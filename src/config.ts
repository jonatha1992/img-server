export type Config = {
  dataDir: string;
  publicUrl: string;
  keys: Map<string, string>;
  extraOrigins: string[];
  maxBytes: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const keys = new Map<string, string>();
  for (const [name, value] of Object.entries(env)) {
    const m = /^API_KEY_([A-Z0-9_]+)$/.exec(name);
    if (m && m[1] && value) keys.set(m[1].toLowerCase(), value);
  }
  return {
    dataDir: env.DATA_DIR ?? "./data",
    publicUrl: (env.PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, ""),
    keys,
    extraOrigins: (env.CORS_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    maxBytes: 10 * 1024 * 1024,
  };
}
