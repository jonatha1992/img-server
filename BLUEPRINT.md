# BLUEPRINT: img-server

## Estado actual
Servicio de imágenes (upload, entrega con transformaciones, borrado, listado) con tests verdes. Repo `jonatha1992/img-server`, ramas dev/test/main. Despliegue: ver sección Despliegue.

## Decisiones
- Fastify + sharp, TypeScript ejecutado con type-stripping de Node 22 (sin build). `tsc --noEmit` solo chequea tipos.
- Una API key por proyecto vía env `API_KEY_<PROYECTO>`; proyectos no se crean por API.
- Original sin modificar en disco; variantes cacheadas por `public_id` (carpeta sha1) para poder borrarlas con el original.
- Transformaciones al estilo Cloudinary acotadas a w/h/c/q/f; lo desconocido da 400.

## Archivos clave
- `src/app.ts` rutas, auth, CORS · `src/transforms.ts` parseo y render · `src/storage.ts` disco · `src/config.ts` env
- `deploy/docker-compose.yml` (Traefik labels, puerto 127.0.0.1:3940, volumen `img_data`)
- `test/api.test.ts`

## Despliegue
- Registrado en `home-server/deployer/apps.json` como `img-server` (main.deploy=true, health http://127.0.0.1:3940/health).
- Secrets: `D:/Repositorio/home-server/deployer/envs/.env.img-server` en el server (no en git).
- DNS pendiente/estado: ver notas del último cambio.

## Cambios recientes
- Versión inicial.
