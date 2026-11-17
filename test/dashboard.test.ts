import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildApp } from "../src/app.js";

describe("dashboard y stats", () => {
  let app: ReturnType<typeof buildApp>;
  let tmp: string;

  before(async () => {
    tmp = await mkdtemp(join(tmpdir(), "img-dash-"));
    app = buildApp({
      dataDir: tmp,
      publicUrl: "https://img.tecnofusion.dev",
      keys: new Map([["testproj", "key-123"]]),
      adminKey: "admin-secret-key",
      extraOrigins: [],
      maxBytes: 10 * 1024 * 1024,
    });
  });

  after(async () => {
    await app.close();
    await rm(tmp, { recursive: true, force: true });
  });

  it("sirve el html del dashboard en /admin", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/admin",
    });
    assert.equal(res.statusCode, 200);
    assert.match(res.headers["content-type"] ?? "", /text\/html/);
    assert.match(res.body, /img-server &bull; Console/);
  });

  it("rechaza stats sin admin key", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/admin/api/stats",
    });
    assert.equal(res.statusCode, 401);
  });

  it("devuelve stats con admin key", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/admin/api/stats",
      headers: { "x-api-key": "admin-secret-key" },
    });
    assert.equal(res.statusCode, 200);
    const json = res.json();
    assert.equal(typeof json.totalFiles, "number");
    assert.equal(typeof json.totalBytes, "number");
  });
});
