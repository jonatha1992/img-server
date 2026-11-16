import sharp from "sharp";

export type OutFmt = "jpg" | "png" | "webp" | "avif" | "gif";
export type Spec = {
  w?: number;
  h?: number;
  crop: "limit" | "fill" | "scale";
  q: number;
  f?: OutFmt | "auto";
};

export const CONTENT_TYPES: Record<OutFmt, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

const MAX_SIDE = 4000;
const SEGMENT_RE = /^[a-z]{1,2}_[^,/]+(,[a-z]{1,2}_[^,/]+)*$/;

export class BadTransform extends Error {
  statusCode = 400;
}

export const isTransformSegment = (s: string) => SEGMENT_RE.test(s);

export function parseTransforms(segment: string | undefined): Spec {
  const spec: Spec = { crop: "scale", q: 80 };
  for (const token of segment ? segment.split(",") : []) {
    const key = token.slice(0, token.indexOf("_"));
    const value = token.slice(token.indexOf("_") + 1);
    if (key === "w" || key === "h") {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1 || n > MAX_SIDE) throw new BadTransform(`${token}: 1-${MAX_SIDE}`);
      spec[key] = n;
    } else if (key === "c" && (value === "limit" || value === "fill" || value === "scale")) {
      spec.crop = value;
    } else if (key === "q" && value === "auto") {
      spec.q = 80;
    } else if (key === "q") {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1 || n > 100) throw new BadTransform(`${token}: 1-100`);
      spec.q = n;
    } else if (key === "f" && (value === "auto" || value in CONTENT_TYPES)) {
      spec.f = value as Spec["f"];
    } else {
      throw new BadTransform(`transformación no soportada: ${token}`);
    }
  }
  return spec;
}

export function chooseFormat(spec: Spec, accept: string, urlExt: string, original: OutFmt): OutFmt {
  if (spec.f === "auto") {
    if (accept.includes("image/avif")) return "avif";
    if (accept.includes("image/webp")) return "webp";
    return original;
  }
  if (spec.f) return spec.f;
  const ext = urlExt === "jpeg" ? "jpg" : urlExt;
  return ext in CONTENT_TYPES ? (ext as OutFmt) : original;
}

export async function render(path: string, spec: Spec, fmt: OutFmt): Promise<Buffer> {
  let img = sharp(path).rotate();
  if (spec.w || spec.h) {
    img = img.resize({
      width: spec.w,
      height: spec.h,
      fit: spec.crop === "fill" ? "cover" : spec.crop === "scale" && spec.w && spec.h ? "fill" : "inside",
      withoutEnlargement: spec.crop === "limit",
    });
  }
  switch (fmt) {
    case "jpg": return img.jpeg({ quality: spec.q, mozjpeg: true }).toBuffer();
    case "webp": return img.webp({ quality: spec.q }).toBuffer();
    case "avif": return img.avif({ quality: Math.min(spec.q, 60), effort: 3 }).toBuffer();
    case "png": return img.png().toBuffer();
    case "gif": return img.gif().toBuffer();
  }
}
