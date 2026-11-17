import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import sharp from "sharp";
import { createHash, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { Config } from "./config.ts";
import { DASHBOARD_HTML } from "./dashboard.ts";
import { type Ext, isValidId, Storage } from "./storage.ts";
import {
  chooseFormat, CONTENT_TYPES, isTransformSegment, parseTransforms, render, type OutFmt,
} from "./transforms.ts";

const IMMUTABLE = "public, max-age=31536000, immutable";
const FORMATS: Record<string, Ext> = { jpeg: "jpg", png: "png", webp: "webp", gif: "gif" };
const digest = (s: string) => createHash("sha256").update(s).digest();

export function buildApp(config: Config) {
  const app = Fastify();
  const storage = new Storage(config.dataDir);

  const originAllowed = (origin: string) => {
    const { protocol, hostname } = new URL(origin);
    return (
      hostname === "localhost" || hostname === "127.0.0.1" ||
      (protocol === "https:" && (hostname === "tecnofusion.dev" || hostname.endsWith(".tecnofusion.dev"))) ||
      config.extraOrigins.includes(origin)
    );
  };
  app.register(cors, {
    origin: (origin, cb) => cb(null, !origin || originAllowed(origin)),
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["X-API-Key", "Content-Type"],
  });
  app.register(multipart, { limits: { fileSize: config.maxBytes, files: 1 } });

  app.get("/health", async () => ({ status: "ok" }));

  const serveDashboard = async (_req: any, reply: any) => {
    return reply.type("text/html; charset=utf-8").send(DASHBOARD_HTML);
  };
  app.get("/admin", serveDashboard);
  app.get("/dashboard", serveDashboard);

  const handleStats = async (req: any, reply: any) => {
    const sent = req.headers["x-api-key"];
    if (
      !config.adminKey ||
      typeof sent !== "string" ||
      !timingSafeEqual(digest(config.adminKey), digest(sent))
    ) {
      return reply.code(401).send({ error: "Admin key inválida" });
    }
    const stats = await storage.stats([...config.keys.keys()]);
    return { ...stats, projects: [...config.keys.keys()] };
  };
  app.get("/admin/api/stats", handleStats);
  app.get("/v1/admin/stats", handleStats);

  app.register(async (api) => {
    api.addHook("onRequest", async (req, reply) => {
      const { project } = req.params as { project: string };
      const key = config.keys.get(project);
      const sent = req.headers["x-api-key"];
      if (!key || typeof sent !== "string" || !timingSafeEqual(digest(key), digest(sent))) {
        return reply.code(401).send({ error: "API key inválida" });
      }
    });

    api.post("/v1/:project/upload", async (req, reply) => {
      const { project } = req.params as { project: string };
      let folder: string | undefined;
      let data: Buffer | undefined;
      for await (const part of req.parts()) {
        if (part.type === "file") data = await part.toBuffer();
        else if (part.fieldname === "folder" && typeof part.value === "string" && part.value) folder = part.value;
      }
      if (!data) return reply.code(400).send({ error: "falta el campo file" });
      if (folder && !isValidId(folder)) return reply.code(400).send({ error: "folder inválido" });

      const meta = await sharp(data).metadata().catch(() => null);
      const ext = meta?.format && FORMATS[meta.format];
      if (!meta || !ext) return reply.code(415).send({ error: "formato no soportado (jpeg, png, webp, gif)" });

      const saved = await storage.save(project, folder, ext, data);
      const swap = (meta.orientation ?? 1) >= 5;
      return reply.code(201).send({
        secure_url: `${config.publicUrl}/${project}/image/upload/${saved.publicId}.${ext}`,
        public_id: saved.publicId,
        width: swap ? meta.height : meta.width,
        height: swap ? meta.width : meta.height,
        bytes: data.length,
        format: ext,
      });
    });

    api.get("/v1/:project/list", async (req) => {
      const { project } = req.params as { project: string };
      const q = req.query as { prefix?: string; cursor?: string; limit?: string };
      const limit = Math.min(Math.max(Number(q.limit) || 100, 1), 500);
      return storage.list(project, q.prefix ?? "", q.cursor ?? "", limit);
    });

    api.delete("/v1/:project/*", async (req, reply) => {
      const { project, "*": id } = req.params as { project: string; "*": string };
      if (!isValidId(id) || !(await storage.remove(project, id))) {
        return reply.code(404).send({ result: "not found" });
      }
      return { result: "ok" };
    });
  });

  app.get("/:project/image/upload/*", async (req, reply) => {
    const { project, "*": rest } = req.params as { project: string; "*": string };
    if (!config.keys.has(project)) return reply.code(404).send({ error: "not found" });

    const segments = rest.split("/");
    const transforms = segments.length >= 2 && isTransformSegment(segments[0] ?? "") ? segments.shift() : undefined;
    const file = segments.join("/");
    const dot = file.lastIndexOf(".");
    const id = dot === -1 ? file : file.slice(0, dot);
    const urlExt = dot === -1 ? "" : file.slice(dot + 1).toLowerCase();
    if (!isValidId(id)) return reply.code(404).send({ error: "not found" });

    const spec = parseTransforms(transforms);
    const original = await storage.find(project, id);
    if (!original) return reply.code(404).send({ error: "not found" });

    const fmt: OutFmt = chooseFormat(spec, req.headers.accept ?? "", urlExt, original.ext);
    reply.header("Cache-Control", IMMUTABLE).header("Content-Type", CONTENT_TYPES[fmt]);
    if (spec.f === "auto") reply.header("Vary", "Accept");

    if (!transforms && fmt === original.ext) return reply.send(createReadStream(original.path));

    const variant = createHash("sha1").update(JSON.stringify(spec) + fmt).digest("hex");
    const cached = join(storage.cacheDir(project, id), `${variant}.${fmt}`);
    if (!(await stat(cached).catch(() => null))) {
      await storage.writeCache(cached, await render(original.path, spec, fmt));
    }
    return reply.send(await readFile(cached));
  });

  return app;
}
