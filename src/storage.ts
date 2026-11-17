import { createHash, randomBytes } from "node:crypto";
import { mkdir, readdir, rename, rm, stat, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

export const EXTENSIONS = ["jpg", "png", "webp", "gif"] as const;
export type Ext = (typeof EXTENSIONS)[number];

const ID_RE = /^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+){0,3}$/;
export const isValidId = (id: string) => ID_RE.test(id);

export type Stored = { publicId: string; ext: Ext; path: string };
export type Listed = {
  public_id: string;
  format: Ext;
  bytes: number;
  created_at: string;
  width?: number;
  height?: number;
};

export class Storage {
  root: string;

  constructor(root: string) {
    this.root = root;
  }

  private originals = (project: string) => join(this.root, "originals", project);
  cacheDir = (project: string, id: string) =>
    join(this.root, "cache", project, createHash("sha1").update(id).digest("hex"));

  async save(project: string, folder: string | undefined, ext: Ext, data: Buffer): Promise<Stored> {
    const name = randomBytes(9).toString("base64url");
    const publicId = folder ? `${folder}/${name}` : name;
    const path = join(this.originals(project), `${publicId}.${ext}`);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, data);
    return { publicId, ext, path };
  }

  async find(project: string, id: string): Promise<Stored | null> {
    for (const ext of EXTENSIONS) {
      const path = join(this.originals(project), `${id}.${ext}`);
      if ((await stat(path).catch(() => null))?.isFile()) return { publicId: id, ext, path };
    }
    return null;
  }

  async remove(project: string, id: string): Promise<boolean> {
    const found = await this.find(project, id);
    if (!found) return false;
    await unlink(found.path);
    await rm(this.cacheDir(project, id), { recursive: true, force: true });
    return true;
  }

  async list(project: string, prefix: string, cursor: string, limit: number) {
    const base = this.originals(project);
    const all: Listed[] = [];
    const walk = async (dir: string, rel: string): Promise<void> => {
      for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
        if (e.isDirectory()) await walk(join(dir, e.name), `${rel}${e.name}/`);
        else {
          const m = /^(.+)\.(jpg|png|webp|gif)$/.exec(e.name);
          const id = m && `${rel}${m[1]}`;
          if (!m || !id || !id.startsWith(prefix) || id <= cursor) continue;
          const s = await stat(join(dir, e.name));
          let width: number | undefined;
          let height: number | undefined;
          try {
            const meta = await sharp(join(dir, e.name)).metadata();
            width = meta.width;
            height = meta.height;
          } catch {}
          all.push({
            public_id: id,
            format: m[2] as Ext,
            bytes: s.size,
            created_at: s.birthtime.toISOString(),
            width,
            height,
          });
        }
      }
    };
    await walk(base, "");
    all.sort((a, b) => (a.public_id < b.public_id ? -1 : 1));
    const resources = all.slice(0, limit);
    const next_cursor = all.length > limit ? resources[resources.length - 1]?.public_id : undefined;
    return { resources, next_cursor };
  }

  async writeCache(path: string, data: Buffer) {
    await mkdir(dirname(path), { recursive: true });
    const tmp = `${path}.${randomBytes(4).toString("hex")}.tmp`;
    await writeFile(tmp, data);
    await rename(tmp, path);
  }

  async stats(projects: string[]): Promise<{
    totalBytes: number;
    totalFiles: number;
    cacheBytes: number;
    byProject: Record<string, { bytes: number; count: number }>;
  }> {
    let totalBytes = 0;
    let totalFiles = 0;
    const byProject: Record<string, { bytes: number; count: number }> = {};

    for (const proj of projects) {
      let projBytes = 0;
      let projCount = 0;
      const walk = async (dir: string): Promise<void> => {
        for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
          const full = join(dir, e.name);
          if (e.isDirectory()) await walk(full);
          else {
            const s = await stat(full).catch(() => null);
            if (s?.isFile()) {
              projBytes += s.size;
              projCount += 1;
            }
          }
        }
      };
      await walk(this.originals(proj));
      byProject[proj] = { bytes: projBytes, count: projCount };
      totalBytes += projBytes;
      totalFiles += projCount;
    }

    let cacheBytes = 0;
    const walkCache = async (dir: string): Promise<void> => {
      for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
        const full = join(dir, e.name);
        if (e.isDirectory()) await walkCache(full);
        else {
          const s = await stat(full).catch(() => null);
          if (s?.isFile()) cacheBytes += s.size;
        }
      }
    };
    await walkCache(join(this.root, "cache"));

    return { totalBytes, totalFiles, cacheBytes, byProject };
  }
}
