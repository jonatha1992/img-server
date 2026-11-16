import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import sharp from "sharp";
import { buildApp } from "../src/app.ts";
import { loadConfig } from "../src/config.ts";

const KEY = "test-key-isabella";
let dir: string;
let app: ReturnType<typeof buildApp>;
let png: Buffer;

async function upload(file: Buffer, opts: { key?: string; folder?: string; project?: string; type?: string } = {}) {
  const fd = new FormData();
  if (opts.folder) fd.append("folder", opts.folder);
  fd.append("file", new Blob([new Uint8Array(file)], { type: opts.type ?? "image/png" }), "x.png");
  const res = new Response(fd);
  return app.inject({
    method: "POST",
    url: `/v1/${opts.project ?? "showroomisabella"}/upload`,
    headers: { "x-api-key": opts.key ?? KEY, "content-type": res.headers.get("content-type") ?? "" },
    payload: Buffer.from(await res.arrayBuffer()),
  });
}

before(async () => {
  dir = await mkdtemp(join(tmpdir(), "img-server-"));
  app = buildApp(loadConfig({ DATA_DIR: dir, PUBLIC_URL: "https://img.test", API_KEY_SHOWROOMISABELLA: KEY, API_KEY_OTRO: "otra" }));
  png = await sharp({ create: { width: 1200, height: 800, channels: 3, background: "#c33" } }).png().toBuffer();
});

after(async () => {
  await app.close();
  await rm(dir, { recursive: true, force: true });
});

describe("subida", () => {
  it("rechaza sin API key o con key de otro proyecto", async () => {
    assert.equal((await upload(png, { key: "mala" })).statusCode, 401);
    assert.equal((await upload(png, { key: "otra" })).statusCode, 401);
    assert.equal((await upload(png, { project: "noexiste" })).statusCode, 401);
  });

  it("rechaza archivos que no son imagen soportada", async () => {
    assert.equal((await upload(Buffer.from("no soy una imagen"))).statusCode, 415);
  });

  it("guarda la imagen y devuelve los datos", async () => {
    const res = await upload(png, { folder: "productos" });
    assert.equal(res.statusCode, 201);
    const body = res.json();
    assert.match(body.public_id, /^productos\/[\w-]+$/);
    assert.equal(body.secure_url, `https://img.test/showroomisabella/image/upload/${body.public_id}.png`);
    assert.deepEqual([body.width, body.height, body.format, body.bytes], [1200, 800, "png", png.length]);
  });

  it("rechaza folder con path traversal", async () => {
    assert.equal((await upload(png, { folder: "../x" })).statusCode, 400);
  });
});

describe("entrega y transformaciones", () => {
  let id: string;
  before(async () => {
    id = (await upload(png)).json().public_id;
  });
  const get = (path: string, accept = "") =>
    app.inject({ method: "GET", url: `/showroomisabella/image/upload/${path}`, headers: { accept } });

  it("sirve el original sin transformar", async () => {
    const res = await get(`${id}.png`);
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers["content-type"], "image/png");
    assert.match(String(res.headers["cache-control"]), /max-age=31536000/);
    assert.deepEqual(res.rawPayload, png);
  });

  it("w_300 mantiene proporción", async () => {
    const res = await get(`w_300/${id}.png`);
    const meta = await sharp(res.rawPayload).metadata();
    assert.deepEqual([meta.width, meta.height], [300, 200]);
  });

  it("c_limit no agranda y c_fill recorta al tamaño exacto", async () => {
    const limit = await sharp((await get(`w_3000,h_3000,c_limit/${id}.png`)).rawPayload).metadata();
    assert.deepEqual([limit.width, limit.height], [1200, 800]);
    const fill = await sharp((await get(`w_200,h_200,c_fill/${id}.png`)).rawPayload).metadata();
    assert.deepEqual([fill.width, fill.height], [200, 200]);
  });

  it("f_auto elige formato según Accept y varía por Accept", async () => {
    const avif = await get(`w_300,f_auto/${id}.png`, "image/avif,image/webp,*/*");
    assert.equal(avif.headers["content-type"], "image/avif");
    assert.equal(avif.headers.vary, "Accept");
    const webp = await get(`f_auto,q_auto,c_limit,w_300/${id}.png`, "image/webp,*/*");
    assert.equal(webp.headers["content-type"], "image/webp");
    const plain = await get(`w_300,f_auto/${id}.png`, "*/*");
    assert.equal(plain.headers["content-type"], "image/png");
  });

  it("q_N cambia el peso del jpg", async () => {
    const low = await get(`q_10/${id}.jpg`);
    const high = await get(`q_95/${id}.jpg`);
    assert.equal(low.headers["content-type"], "image/jpeg");
    assert.ok(low.rawPayload.length < high.rawPayload.length);
  });

  it("transformación inválida da 400 e id inexistente 404", async () => {
    assert.equal((await get(`w_99999/${id}.png`)).statusCode, 400);
    assert.equal((await get(`zz_1/${id}.png`)).statusCode, 400);
    assert.equal((await get(`w_300/nada.png`)).statusCode, 404);
    assert.equal((await get(`..%2f..%2fetc/passwd.png`)).statusCode, 404);
  });

  it("proyecto desconocido da 404", async () => {
    const res = await app.inject({ method: "GET", url: `/otroinexistente/image/upload/${id}.png` });
    assert.equal(res.statusCode, 404);
  });
});

describe("listado y borrado", () => {
  it("lista, borra con la key, limpia variantes y el id deja de existir", async () => {
    const id = (await upload(png, { folder: "tmp" })).json().public_id;
    await app.inject({ method: "GET", url: `/showroomisabella/image/upload/w_100/${id}.png` });

    const headers = { "x-api-key": KEY };
    const list = await app.inject({ method: "GET", url: "/v1/showroomisabella/list?prefix=tmp/", headers });
    assert.deepEqual(list.json().resources.map((r: { public_id: string }) => r.public_id), [id]);

    assert.equal((await app.inject({ method: "DELETE", url: `/v1/showroomisabella/${id}` })).statusCode, 401);
    const del = await app.inject({ method: "DELETE", url: `/v1/showroomisabella/${id}`, headers });
    assert.deepEqual(del.json(), { result: "ok" });
    assert.equal((await app.inject({ method: "DELETE", url: `/v1/showroomisabella/${id}`, headers })).statusCode, 404);
    assert.equal((await app.inject({ method: "GET", url: `/showroomisabella/image/upload/w_100/${id}.png` })).statusCode, 404);

    const after = await app.inject({ method: "GET", url: "/v1/showroomisabella/list?prefix=tmp/", headers });
    assert.equal(after.json().resources.length, 0);
  });

  it("pagina con limit y next_cursor", async () => {
    for (let i = 0; i < 3; i++) await upload(png, { folder: "pag" });
    const headers = { "x-api-key": KEY };
    const p1 = (await app.inject({ method: "GET", url: "/v1/showroomisabella/list?prefix=pag/&limit=2", headers })).json();
    assert.equal(p1.resources.length, 2);
    const p2 = (await app.inject({ method: "GET", url: `/v1/showroomisabella/list?prefix=pag/&limit=2&cursor=${encodeURIComponent(p1.next_cursor)}`, headers })).json();
    assert.equal(p2.resources.length, 1);
    assert.equal(p2.next_cursor, undefined);
  });
});

describe("CORS", () => {
  const preflight = (origin: string) =>
    app.inject({
      method: "OPTIONS",
      url: "/v1/showroomisabella/upload",
      headers: { origin, "access-control-request-method": "POST", "access-control-request-headers": "x-api-key" },
    });

  it("permite *.tecnofusion.dev y localhost", async () => {
    for (const o of ["https://showroomisabella.tecnofusion.dev", "http://localhost:5173"]) {
      assert.equal((await preflight(o)).headers["access-control-allow-origin"], o);
    }
  });

  it("no permite otros dominios", async () => {
    assert.equal((await preflight("https://evil.com")).headers["access-control-allow-origin"], undefined);
    assert.equal((await preflight("https://tecnofusion.dev.evil.com")).headers["access-control-allow-origin"], undefined);
  });
});
