# Agente de Registro de Contratos

Aplicación independiente para leer contratos ficticios desde un buzón fixture, extraer datos, validar duplicados/actualizaciones, mantener un maestro CSV de salida y generar alertas.

## Arquitectura recomendada

**Monolito modular TypeScript desplegado como un servicio Railway con volumen persistente en `/app/out`.** Es la opción más práctica para el alcance: un único servicio HTTP reduce complejidad, el dominio es determinista y los artefactos CSV/documentales requieren persistencia. No se recomienda microservicios ni base de datos para este reto.

```text
Chat web → API Node → ciclo de agente → herramientas Zod → fixtures (lectura) / out (escritura)
                                      ↘ adaptador LLM opcional
```

En Railway: build `npm run build`, start `npm start`, variables solo en el servicio y volumen persistente montado en `/app/out`. Railway proporciona `PORT`; el servidor escucha en `0.0.0.0`.

## Ejecución

```bash
npm install
npm run demo
npm run dev
```

## Variables

Ver `.env.example`. Sin clave se puede usar el adaptador fake para desarrollo. Nunca versionar `.env`.

## Calidad

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Límites

No integra Exchange, SharePoint, firma, correo real, portales ni OCR. `msg-005` se rechaza pero permanece pendiente. `msg-006` solo se registra tras confirmar valor `0` y fecha fin `2027-08-31`.
