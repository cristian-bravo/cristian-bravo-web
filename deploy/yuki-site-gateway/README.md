# Yuki site gateway

This is a deliberately small, stateless Node 22 sidecar for the public Yuki
widget. It is not a deployment of `../yuki-bot`, and it does not import that
worktree or any private-agent component.

Its only upstream call is one `POST /api/chat` request to the already deployed
Ollama service. It never calls embeddings, tools, the Yuki agent, PostgreSQL,
Redis, CRM, mail, channels, or an owner capability. It never pulls a model.

The current VPS model is pinned by deployment configuration to
`qwen2.5:0.5b`. A caller cannot select a model: startup refuses to run unless
`OLLAMA_CHAT_MODEL` appears exactly in `YUKI_GATEWAY_ALLOWED_MODELS_JSON`.

## Boundary

```text
browser ── same-origin ──> Astro /api/yuki-chat
                                 │ bearer + exact Origin, server-only
                                 ▼
                    HTTPS cystems-yuki-site:3443
                                 │ one bounded /api/chat request
                                 ▼
                         existing private Ollama
```

The gateway accepts only `POST /v1/site-chat`, `application/json`, an exact
allowed `Origin`, and an exact server bearer token. The strict payload is:

```json
{
  "message": "Necesito una cotización.",
  "visitorId": "site_0123456789abcdef0123456789abcdef",
  "remember": false
}
```

`remember: true` is deliberately rejected with `400 PERSISTENCE_UNAVAILABLE`.
There is no conversation history, memory, database write, visitor profile, or
background queue. Keep `YUKI_SITE_CHAT_HISTORY_ENABLED=false` in the Astro
service; enabling it would make the UI request a feature this gateway refuses.

The public prompt in `public-persona.mjs` is intentionally capability-free. It
contains no owner instructions or private CYSTEMS data. Ollama receives only a
system message and the current visitor message, with no `tools` field.

## Required private TLS transport

In production the process refuses to start unless both `TLS_CERT_FILE` and
`TLS_KEY_FILE` are absolute mounted paths. Root/deployment operations must
provision those files outside the repository, with restrictive permissions and
a certificate whose SAN contains exactly `DNS:cystems-yuki-site`.

The Astro container must trust the issuing private CA before Node starts:

```dotenv
NODE_EXTRA_CA_CERTS=/run/cystems-yuki-site-ca.pem
YUKI_SITE_CHAT_ENABLED=true
YUKI_SITE_API_URL=https://cystems-yuki-site:3443/v1/site-chat
YUKI_SITE_API_TOKEN=<same secret as YUKI_GATEWAY_TOKEN>
YUKI_SITE_ORIGIN=https://cystems.ec
YUKI_SITE_CHAT_HISTORY_ENABLED=false
```

The public certificate authority PEM is mounted read-only at that Astro path;
it is not a `PUBLIC_` variable and never enters client JavaScript. The signing
key remains only with root/deployment operations. The sidecar receives only its
leaf certificate and leaf key, likewise through read-only mounts.

The gateway has no host `ports:` mapping. Attach it to:

1. The existing web network, with the DNS alias `cystems-yuki-site`, where
   Astro can reach it. Network membership does not bypass its bearer check.
2. A dedicated internal model network shared with Ollama. Prefer adding this
   narrow network to Ollama rather than joining the gateway to the broad Yuki
   data network that also contains PostgreSQL.

Do not give the gateway the agent, database, or owner-service credentials. Its
only secret is its own bearer token; its only TLS files are the mounted key and
certificate. The included `Dockerfile` exposes 3443 to Docker networks only.
The deployer should also use `read_only`, a small writable `tmpfs`,
`cap_drop: [ALL]`, `no-new-privileges`, a memory limit, and an unprivileged
container user.

`GET /health` and `GET /ready` are process/listener liveness endpoints only;
they intentionally do not send a prompt or prove that Ollama can generate. A
controlled authenticated turn after deployment is the required model-path
verification.

## Limits and failure behavior

- Request body: 8 KiB cap enforced while streaming, including chunked requests.
- Message: normalized, no forbidden controls, maximum 1,200 Unicode code
  points.
- Model: one fixed allowlisted model, explicit `num_ctx: 2048`, and at most 192
  predicted tokens (configurable only down to 64 or up to 256).
- Output: bounded to 1,800 Unicode code points by default and a 64 KiB upstream
  response cap.
- Model work: one concurrent request by default; a second request gets a short
  `429 GATEWAY_BUSY` instead of a queue.
- Rate limiting: fixed one-minute global and per-visitor limits. Visitor IDs
  are SHA-256 hashed before entering the in-memory limiter. At the key cap it
  fails closed instead of evicting active visitors.
- Timeout: hard 18 seconds, below Astro's existing 20-second upstream timeout.
- Slow clients: Node accepts at most 32 TCP connections and has a 10-second
  header deadline; the model-work cap is separate from this connection cap.
- Errors: generic JSON only. Logs contain only status, request ID, and a fixed
  code—never the message, visitor ID, token, upstream URL, or upstream body.

The in-memory limiter is intentionally suitable only for a single replica. If
the gateway is scaled horizontally, retain one replica or add a separately
reviewed shared limiter at the private edge; do not silently add Redis access.

## Build and test

No runtime package dependencies are required. The root QA workflow runs the
same tests through `npm run test:yuki:gateway`:

```sh
docker build -t cystems-yuki-site:local deploy/yuki-site-gateway
node --test deploy/yuki-site-gateway/test/gateway.test.mjs
```

The test suite starts a fake local Ollama HTTP server. It checks the exact
outbound request, strict validation, chunked byte limits, rate/concurrency
limits, controlled upstream failure, and the production TLS configuration
requirement. It makes no production network request and sends no email.

## Deployment handoff

`compose.production.yaml` records the reviewed VPS topology and runtime limits.
It does not provision secrets or certificates. Before enabling
the Astro variables, operations must review the private network attachment,
mount the TLS key/certificate and Astro trust PEM, inject the shared token from
the secret manager, and confirm the existing `qwen2.5:0.5b` model remains
available. Validate one controlled server-to-server turn after deployment; a
successful TLS connection or `/health` alone does not prove model response
latency. Do not set history enabled until a separately reviewed consented
persistence and deletion design exists.
