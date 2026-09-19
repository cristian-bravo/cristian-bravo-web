# Integración con Yuki

## Estado vigente: gateway público aislado

La integración de producción usa `deploy/yuki-site-gateway/`, un servicio Node
22 separado del agente privado. No despliega ni importa el repositorio hermano
`../yuki-bot`. Los apartados históricos inferiores describen la integración
anterior y no son instrucciones de despliegue vigentes.

Flujo: widget → `/api/yuki-chat` de Astro → HTTPS privado
`cystems-yuki-site:3443/v1/site-chat` → Ollama existente, `qwen2.5:0.5b`.
Se reutiliza el modelo del VPS; no se descargaron modelos. Esta es una persona
pública de Yuki, no el agente personal del propietario ni sus herramientas.

- Token sólo entre servidores y origen exacto permitido. El gateway no publica
  puertos al host; ejecuta como UID 1000, raíz de archivos de sólo lectura,
  sin capabilities, con límites de memoria, conexiones y concurrencia.
- CA privada de transporte fuera del repo, clave de firma sólo en el host y
  certificado/clave de servidor montados en el gateway. Astro recibe únicamente
  la CA pública en `/run/cystems-yuki-site-ca.pem`, mediante
  `NODE_EXTRA_CA_CERTS` al arrancar. TLS no se desactiva.
- Una red interna dedicada conecta únicamente el gateway y Ollama. No hay
  conexión a las redes de bases de datos, credenciales del agente ni herramientas.
- Cada consulta envía únicamente el contexto público fijo y el mensaje actual.
  No hay historial conversacional, aprendizaje entre visitas, CRM ni memoria.
  `YUKI_SITE_CHAT_HISTORY_ENABLED=false`; `remember:true` falla cerrado.
- El gateway aplica 8 KiB de cuerpo, 1.200 caracteres por mensaje, 2.048 tokens
  de contexto, 192 de generación, 18 s de plazo y una generación concurrente.
  Sus registros no incluyen mensajes ni credenciales.
- El origen web sólo admite Cloudflare para `cystems.ec` y `www.cystems.ec`.
  Astro confía exclusivamente en la IP del proxy verificada para leer
  `CF-Connecting-IP`; una cabecera inventada directamente al origen recibe 403.
  Si se recrea o cambia la red de Traefik, volver a verificar su IP antes de
  actualizar `TRUSTED_PROXY_CIDRS`; no ampliar la confianza a toda la subred.

### Operación y verificación

El Compose del gateway está en
`/opt/cystems-yuki-site/source/compose.production.yaml`; sus secretos y TLS están
fuera de la carpeta fuente. El Compose web y sus definiciones persistidas en
Coolify incluyen la CA; el de Ollama añade la red dedicada sin reiniciar el
agente privado. La configuración de correo no se modifica.

El certificado de servidor dura un año desde su emisión y la CA tres años.
Renovar el certificado antes de expirar y recrear el gateway; si se rota la CA,
recrear también Astro para que Node vuelva a leerla. Nunca montar la clave de
firma en los contenedores ni publicar el token como variable `PUBLIC_`.

`/health` y `/ready` acreditan sólo el proceso HTTPS, no generación del modelo.
Una consulta autenticada real en el VPS respondió 200 (15,4 s de arranque frío).
El widget publicado respondió 200 en escritorio y móvil (2,5 s y 2,1 s con el
modelo cargado), sin errores JavaScript ni overflow; el control de historial
permanece deshabilitado. No se enviaron correos ni mensajes a canales externos.
`npm run test:yuki:gateway` incluye ocho pruebas con Ollama
simulado, incluida cancelación de un stream de error que no termina.

La revisión visual corrigió únicamente el alcance CSS de los mensajes creados
por JavaScript: ahora conservan sus burbujas, ajuste de texto e indicador de
espera originales. La regresión pasa en Chromium, Firefox y WebKit a 390 y
1.440 px, incluido movimiento reducido: 29/29 pruebas dirigidas del chat y
typecheck sin errores. No cambia el diseño de la página restaurada.

Referencias operativas: [CA adicional de Node](https://nodejs.org/docs/latest-v22.x/api/cli.html#node_extra_ca_certsfile)
y [allowlist por IP de Traefik](https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/ipallowlist/).

Para deshabilitar únicamente el chat: establecer `YUKI_SITE_CHAT_ENABLED=false`
en el entorno privado web y recrear sólo `web`. Los respaldos anteriores a esta
conexión están en `/opt/cystems-yuki-site/backups/`, con acceso restringido.
No restaurar el rediseño rechazado ni detener otros servicios como rollback.

## Registro histórico: integración anterior, sustituida

Lo que sigue conserva el diagnóstico anterior para trazabilidad. No representa
la configuración o disponibilidad del gateway público actual.

## Arquitectura y límites

El widget inferior derecho llama a `/api/yuki-chat` del mismo sitio. Ese proxy autentica la solicitud hacia el gateway privado `/v1/site-chat` de Yuki. El navegador nunca recibe la credencial del gateway ni acceso a herramientas, canales privados o tareas del propietario.

La conservación de la conversación requiere consentimiento y una ruta interna
autorizada. Sin consentimiento, el gateway no conserva conversación, sesión ni
historial en AgentCore. La edición concurrente más reciente exige `coreRoute`
para `remember:true`, pero el entrypoint público dedicado no lo inyecta:
en ese gateway la opción falla cerrada con 503, no guarda historial. Por ello el
sitio mantiene deshabilitado el checkbox salvo habilitación explícita de
`YUKI_SITE_CHAT_HISTORY_ENABLED=true` después de verificar esa capacidad. La
interfaz por sí sola no demuestra persistencia real.
Desactivarlo rota su identificador, pero no borra conversaciones previamente
guardadas. El proveedor procesa los mensajes bajo su propia retención.

El aprendizaje o memoria de largo plazo por visitante todavía **no está
completado**. No debe describirse el checkbox como una autorización para que
Yuki aprenda preferencias: hoy transmite únicamente el consentimiento para
conservar historial, cuya conexión también sigue pendiente. Implementar aprendizaje real exige un scope de
visitante y un flujo de borrado/retención explícitos; no se debe reutilizar un
identificador de visitante como si fuera un cliente CRM.

## Desarrollo conectado

Se necesita el repositorio hermano `../yuki-bot`, sus dependencias y su build de servidor actualizado, además de PostgreSQL, Redis y un proveedor del modelo disponible.

```sh
npm --prefix ../yuki-bot run build:server
npm run dev:yuki
```

El launcher utiliza la configuración privada existente de `yuki-agent-api-1`, genera un token compartido sólo en memoria y limita los procesos a loopback. El sitio usa `127.0.0.1:4322` y el gateway `127.0.0.1:3101`. No inicia canales, herramientas ni workers de Yuki. Rechaza puertos ocupados y termina únicamente su propio árbol de procesos al cerrar.

`npm run test:yuki:live` intenta una comprobación real del proveedor y cierra
los procesos. No es una prueba simulada: puede consumir capacidad/cuota del
modelo configurado. Solo demuestra la conexión si termina con el mensaje de
éxito; no se ejecuta en CI.

## Producción

Configurar en el servidor web, nunca con prefijo `PUBLIC_`:

```dotenv
YUKI_SITE_CHAT_ENABLED=true
YUKI_SITE_CHAT_HISTORY_ENABLED=false
YUKI_SITE_API_URL=https://<gateway-privado>/v1/site-chat
YUKI_SITE_API_TOKEN=<credencial-aleatoria-compartida>
YUKI_SITE_ORIGIN=https://cystems.ec
```

El gateway requiere la credencial correspondiente, allowlist exacta de
orígenes, Redis y el proveedor del modelo operativo. La configuración completa
está en `../yuki-bot/docs/integrations/SITE_CHAT.md`. Usar HTTPS fuera de
loopback y el entrypoint dedicado `site-chat/standalone`, separado de las
capacidades administrativas. No habilitar `SITE_CHAT_ENABLED` en el entrypoint
central de Yuki: actualmente conserva una ruta de montaje sobre el agente
central y su personalidad privada, que no es apta para visitantes públicos.
Este trabajo no publica automáticamente los cambios en el dominio de
producción.

No habilitar `YUKI_SITE_CHAT_HISTORY_ENABLED` hasta probar el historial con dos
visitantes distintos, consentimiento/revocación y aislamiento de datos privados.
La fixture de Playwright lo habilita únicamente contra respuestas simuladas
para conservar la cobertura de ese estado futuro; el test de servidor comprueba
por separado que el estado deshabilitado entrega el control inactivo.

## Estado verificado el 19 de septiembre de 2026

- UI, proxy, límites, señal de consentimiento y renderizado seguro: incluidos en las 300 pruebas aprobadas del sitio. El servidor con historial deshabilitado se verifica en la fixture independiente; no se afirma persistencia real del gateway.
- Suite completa del backend: 540 pruebas aprobadas y una omitida por plataforma.
- Esa suite completa precede a los últimos cambios concurrentes en `site-chat`. La revalidación dirigida del 19 de septiembre a las 17:49 (America/Guayaquil) aprobó 7/7 pruebas de `test/site-chat-api.test.ts`, incluida la respuesta 503 sin `coreRoute`. No equivale a validación extremo a extremo del código concurrente nuevo.
- La revalidación posterior encontró que el entrypoint central ya inyecta `coreRoute` condicionalmente (edición de las 17:54), pero el standalone público no. Ese montaje central sigue usando el agente/persona privados: no sustituye al gateway público ni acredita aislamiento entre visitantes. Se preservó el trabajo concurrente y no se habilitó esa ruta.
- Gateway aislado: `/health` y `/ready` respondieron 200; una llamada directa sin credencial fue rechazada con 401. En ese momento `/ready` comprobaba PostgreSQL y Redis, pero no la disponibilidad del proveedor/modelo, por lo que no certifica que Yuki pueda responder.
- La respuesta real del modelo continúa pendiente: el runtime existente apunta a `http://ollama:11434`, modelo `qwen3:8b` y embeddings `embeddinggemma`, pero el servicio correspondiente no está disponible. El proxy devuelve 502 sin filtrar detalles privados.
- Existe un motor QA detenido con modelos distintos; no se cambió silenciosamente el modelo ni se descargaron modelos nuevos. Resolver esa decisión antes de considerar la conexión operativa.
- La revalidación actual de `npm run build:server` del repositorio hermano pasó. La disponibilidad del LLM sigue pendiente y no se considera una integración operativa hasta completar el smoke real.
- Tanto el historial consentido como el aprendizaje de largo plazo siguen pendientes de wiring seguro y verificación con dos visitantes distintos. No asociar indiscriminadamente todos los visitantes a un único scope de cliente/proyecto: se debe probar que ninguna conversación ni recuerdo cruza entre visitantes ni alcanza datos privados del propietario.

Cuando falta configuración, el widget informa de indisponibilidad. No promete haber guardado la consulta ni una respuesta posterior.
