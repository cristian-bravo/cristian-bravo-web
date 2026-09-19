# Integración con Yuki

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
