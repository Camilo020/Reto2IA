# Solución — Registro de Contratos

## Problema

La analista administrativa no tiene una fuente única de contratos vigentes, pólizas y vencimientos; la solución centraliza fixtures contractuales y deja trazabilidad sin reemplazar decisiones humanas.

## Arquitectura

Monolito modular Node/TypeScript: UI web, API HTTP, ciclo de agente, adaptador LLM intercambiable, herramientas Zod, fixtures de solo lectura y `out/` de escritura. Railway se ajusta mediante un servicio único con volumen `/app/out`, variables seguras, healthcheck `/api/health`, rate limit y dominio protegido.

## Extracción y confianza

P0 es regex/heurísticas; cada campo conserva confianza y evidencia. Bajo 0.8 requiere revisión. El modelo no registra valores: las herramientas deterministas validan y persisten.

## Gobierno

El comercial envía contrato firmado, otrosí o terminación al buzón único usando asunto `Contrato | Cliente | ID`. Administración acusa recibo, revisa pendientes y administra el maestro. Documentos sin firma, valor o fecha completa pasan a revisión. La métrica mensual propuesta es porcentaje de contratos facturados incluidos en el maestro.

## Decisiones

1. CSV de salida en vez de BD: cumple el fixture y facilita demo; no sirve para operación multiusuario real.
2. Extracción determinista antes de LLM: reduce alucinaciones y permite demo sin clave.
3. Rechazado distinto de procesado: `msg-005` queda pendiente por decisión de negocio.
4. Confirmación por sesión para `msg-006`: registra valor 0 y fecha 2027-08-31 solo tras acción humana.

## Cobertura

- Buzón, extracción, validación, registro y alertas: implementados para los seis fixtures.
- Exchange, SharePoint, firma y portal real: fuera de alcance.
- LLM real: depende de credencial configurada.

## Riesgos

Datos reales requerirían autenticación, control de acceso, cifrado, retención, volumen persistente, auditoría más rica y validación jurídica. Los fixtures y adjuntos `.txt` no prueban validez documental real.
