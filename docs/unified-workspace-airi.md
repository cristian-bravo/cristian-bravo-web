# AIRI con el espacio unificado CYSTEMS

Yuki mantiene la identidad, memoria, proyectos, herramientas y permisos. AIRI
puede actuar como cliente visual con avatar y audio. La cuenta privada del CRM
no se transforma en una contraseña pública para el avatar o el sitio.

Esta guía prepara los contratos existentes del backend. No acredita que AIRI
esté instalado ni que un proveedor de voz esté conectado; esos componentes
requieren su propia prueba real. El proyecto de AIRI solicitado es
[moeru-ai/airi](https://github.com/moeru-ai/airi); su configuración actual debe
verificarse con su documentación oficial antes de instalarlo.

## Texto con el agente actual

El backend ya define una API compatible con Chat Completions:

| Valor | Configuración |
| --- | --- |
| Base URL del proveedor | `https://crm.example.com/v1/airi/openai/v1` |
| Modelo presentado por Yuki | `yuki-agent` |
| Descubrimiento | `GET /models` |
| Generación | `POST /chat/completions`, normal o SSE |
| Autenticación | Bearer dedicado al cliente AIRI |

Usa el `ownerId` canónico de la cuenta del CRM para el cliente AIRI. El JSON de
clientes contiene **el nombre de una variable**, nunca su secreto. Ejemplo de
estructura con identificadores ficticios:

```dotenv
AIRI_ENABLED=true
AIRI_CLIENTS_JSON=[{"id":"cystems-desktop","ownerId":"OWNER_CANONICO_DE_EJEMPLO","tokenEnvironmentVariable":"AIRI_CYSTEMS_TOKEN"}]
AIRI_ALLOWED_ORIGINS_JSON=["https://airi.example.com"]
AIRI_ALLOW_MISSING_ORIGIN=false
AIRI_OPENAI_BASE_PATH=/v1/airi/openai/v1
```

Genera `AIRI_CYSTEMS_TOKEN` fuera del repositorio y entrégalo únicamente al
cliente privado. Debe tener al menos 32 caracteres y no reutilizar el token
del proxy público, una sesión web o una contraseña. Para un cliente desktop
que no envía `Origin`, evalúa explícitamente la opción de origen ausente; la
configuración de navegador debe mantener los orígenes exactos.

El adapter de Yuki toma únicamente el último mensaje del usuario. Descarta
los prompts de sistema e historial que pueda enviar AIRI para conservar la
personalidad y memoria del agente central. El modelo `yuki-agent` representa
ese agente; no reemplaza por sí mismo el proveedor de modelo configurado.

## Avatar y cancelación

El WebSocket propio de Yuki está en `/v1/airi/ws`. Su primer mensaje es
`authenticate` con `clientId`, `protocolVersion:1` y el token dedicado.
Después acepta `chat.request` con `content`, `requestId` y `sessionId`, y
`chat.cancel` para cancelar el turno. Produce estados del avatar `idle`,
`thinking` y `speaking` y eventos `chat.started`, `chat.delta` y
`chat.completed`. Este contrato es de Yuki: no se presenta como un plugin
nativo ya instalado de AIRI.

## Voz

El puente independiente `/v1/voice/ws` autentica un cliente y un perfil de
dispositivo configurados por el servidor. Un turno envía `audio.start`, frames
binarios acotados y `audio.commit`; `audio.cancel` interrumpe transcripción,
respuesta o síntesis. Hay límites separados de bytes por frame, por turno y
de salida, además de duración y conexiones.

El proveedor de voz admite endpoints compatibles con
`POST /audio/transcriptions` y `POST /audio/speech`. Configura
`VOICE_STT_BASE_URL`, `VOICE_TTS_BASE_URL`, modelos, formato y voz en el perfil
del dispositivo. Los secretos se guardan en variables separadas. El chat del
sitio no ofrece acceso al micrófono ni al puente privado por activar Yuki.

## Puesta en marcha prevista

1. Verificar primero el endpoint `models` y una respuesta normal/SSE con la
   identidad AIRI dedicada y el mismo owner del CRM.
2. Conectar AIRI a ese proveedor y verificar conversación, reconexión y
   cancelación sin duplicar el historial del agente.
3. Reutilizar primero un servicio STT/TTS ya disponible. Si se incorpora uno
   nuevo, conservar sus archivos Docker en `H:\Docker` y revisar los recursos
   y modelos disponibles antes de descargar nada.
4. Probar una frase con transcripción y audio reproducible, incluido cancelar
   un turno, y registrar el resultado real. Las pruebas con audio ficticio no
   sustituyen esa comprobación.

Los contratos y pruebas del backend viven en `../yuki-bot/src/airi/`,
`../yuki-bot/src/voice/`, `test/airi-openai-api.test.ts`,
`test/airi-bridge.test.ts`, `test/voice-provider.test.ts`,
`test/voice-turn-service.test.ts` y `test/voice-bridge.test.ts`.
