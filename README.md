# Agente de Registro de Contratos

Aplicación independiente que procesa contratos ficticios del buzón, extrae datos trazables, valida duplicados/otrosíes, actualiza un maestro CSV de salida y genera alertas.

## Arranque

```bash
npm install
npm run dev
```

Para comprobar el dominio sin un proveedor LLM:

```bash
npm run demo
```

## Calidad

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Variables

| Variable | Uso |
|---|---|
| `LLM_PROVIDER` | `deepseek` o `fake`. |
| `DEEPSEEK_API_KEY` | Solo backend; nunca repositorio, frontend ni logs. |
| `DEEPSEEK_BASE_URL` | URL de DeepSeek. |
| `DEEPSEEK_MODEL` | Modelo configurado. |
| `PORT` | Puerto HTTP, por defecto 8080. |
| `MAX_ITERATIONS_PER_TURN` | Máximo de ciclos de herramientas. |
| `MAX_TOKENS_PER_SESSION` | Presupuesto por sesión. |
| `LLM_TIMEOUT_MS` | Timeout de proveedor. |
| `RATE_LIMIT_PER_MINUTE` | Límite de API por IP. |

Copia `.env.example` a `.env` para desarrollo local. No subas `.env`.

## Demo determinista

`npm run demo` limpia `out/`, procesa los seis mensajes y genera:

- altas `msg-001` y `msg-002`;
- actualización de `CT-2026-011` desde `msg-003`;
- duplicado de `msg-004` sin nueva fila;
- rechazo pendiente de `msg-005`, sin incluirlo en procesados;
- bloqueo y posterior confirmación de `msg-006` con valor `0` y fecha fin `2027-08-31`;
- `out/alertas.md`.

## API

- `POST /api/chat` → `{ sessionId, message }`.
- `GET /api/sessions/:id` → historial.
- `GET /api/health` → proveedor/modelo sin secretos.

## Railway

La URL pública configurada es `https://reto2ia-production.up.railway.app`.

Configura Build `npm run build`, Start `npm start`, healthcheck `/api/health` y un volumen persistente en `/app/out`. Agrega `DEEPSEEK_API_KEY` en Railway Variables para activar el modelo real; sin la clave, la app inicia en modo `fake` y no se debe usar como prueba de conversación LLM.

## Límites

No integra Exchange, SharePoint, firma, correo real, portales ni OCR. Los fixtures son ficticios; no prueban validez documental o jurídica real.