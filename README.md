# img-server

Servicio propio de imágenes tipo Cloudinary para las apps de `tecnofusion.dev`. Publicado en https://img.tecnofusion.dev.

Node 22 + Fastify + sharp (libvips). Originales en `/data/originals/<proyecto>/`, variantes cacheadas en `/data/cache/<proyecto>/` (volumen Docker `img_data`).

## API

Un proyecto = una API key (`API_KEY_<PROYECTO>` en el `.env`). El proyecto de la URL es el nombre en minúsculas. Header: `X-API-Key`.

| Método | Ruta | Auth | Notas |
|---|---|---|---|
| GET | `/admin` o `/dashboard` | pública (auth interna) | Panel de administración web interactivo |
| GET | `/v1/admin/stats` | admin key | Métricas globales (archivos, bytes, caché, proyectos) |
| POST | `/v1/<proyecto>/upload` | key | multipart: `file` (jpeg/png/webp/gif, máx 10 MB), `folder` opcional (ej. `productos`, hasta 4 niveles). Responde 201 `{secure_url, public_id, width, height, bytes, format}` |
| GET | `/<proyecto>/image/upload/[transformaciones/]<public_id>.<ext>` | pública | entrega con transformaciones |
| DELETE | `/v1/<proyecto>/<public_id>` | key | `{result:"ok"}` o 404 `{result:"not found"}` (borra también las variantes) |
| GET | `/v1/<proyecto>/list?prefix=&limit=&cursor=` | key | `{resources:[{public_id,format,bytes,created_at}], next_cursor}` |
| GET | `/health` | pública | |

Transformaciones (separadas por coma, un solo segmento): `w_N`, `h_N` (1–4000), `c_limit` (no agranda, mantiene proporción), `c_fill` (recorta al tamaño exacto), `c_scale` (default), `q_auto` / `q_N` (1–100), `f_auto` (avif/webp según `Accept`, si no el formato original) o `f_jpg|png|webp|avif|gif`. Sin `f_`, el formato sale de la extensión de la URL. Una transformación desconocida responde 400. Las respuestas llevan `Cache-Control: public, max-age=31536000, immutable`.

Ejemplo: `https://img.tecnofusion.dev/showroomisabella/image/upload/f_auto,q_auto,c_limit,w_800/productos/AbC123.jpg`

CORS: `*.tecnofusion.dev` (https), `localhost` y `127.0.0.1` (cualquier puerto), más `CORS_ORIGINS`.

Límites conocidos: los GIF animados se sirven como primer cuadro cuando se transforman; el original sin transformar conserva la animación.

## Panel Web (/admin)

El servidor cuenta con una consola interactiva en `/admin` (o `/dashboard`):
- **Métricas**: espacio en disco de originales, caché y conteo total de archivos.
- **Galería interactiva**: listado de recursos por proyecto con miniaturas optimizadas.
- **Subida drag & drop**: carga directa de imágenes con selector de folder opcional.
- **Probador de transformaciones**: visor en tiempo real para previsualizar presets (`w_300`, `c_fill`, `f_auto`, etc.) o transformaciones libres con botón de copiado de URL y eliminación.
- **Autenticación**: se accede mediante `ADMIN_KEY` (visión global) o API Key del proyecto.

## Desarrollo

```
npm install
npm test            # subida, transformación, entrega, borrado, listado, CORS
npm run typecheck
npm run dev         # con API_KEY_SHOWROOMISABELLA=dev-key en el entorno
```
En VS Code: F5 levanta el server (key `dev-key`), tarea `test` para los tests.

## Despliegue (home-server)

Patrón de `payalert`: `deploy/docker-compose.yml` con labels de Traefik en la red `edge`, publicado por el túnel cloudflared. El deployer (`home-server/deployer/apps.json`, app `img-server`) clona `main` en `D:/Repositorio/img-server-deploy` y corre `docker compose -p img-server --env-file deploy/.env.prod up -d --build`. El `.env.prod` se copia de `D:/Repositorio/home-server/deployer/envs/.env.img-server` (fuera de git).

Para agregar un proyecto: sumar `API_KEY_<NOMBRE>=<clave larga aleatoria>` a ese `.env` y redeployar.

DNS: el hostname `img.tecnofusion.dev` debe existir como Public Hostname del túnel (destino `http://edge-traefik-1:80`). Ver BLUEPRINT.md.
