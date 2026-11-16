import { buildApp } from "./app.ts";
import { loadConfig } from "./config.ts";

const config = loadConfig();
if (config.keys.size === 0) {
  console.error("Falta al menos una API_KEY_<PROYECTO> en el entorno");
  process.exit(1);
}
await buildApp(config).listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" });
console.log(`img-server escuchando; proyectos: ${[...config.keys.keys()].join(", ")}`);
