# Solución — Agente de Registro de Contratos

## 1. Problema y usuario

La analista administrativa no cuenta con una fuente única de contratos vigentes, pólizas y vencimientos. El agente prepara un maestro contractual trazable a partir de contratos ficticios enviados por comerciales.

## 2. Arquitectura

```text
Chat web → API HTTP → ciclo de agente → herramientas Zod → fixtures (solo lectura)
                                  ↘ adaptador DeepSeek/fake → out/ (solo escritura)
```

Se eligió un monolito modular TypeScript: el dominio de extracción/validación no depende de HTTP ni del proveedor LLM. En Railway se ejecuta como un servicio Node único, con variables seguras y volumen persistente `/app/out`.

## 3. Ciclo del agente y confirmación

El ciclo carga `agent/prompt.md` y `src/knowledge/registro-contratos.md`, llama al proveedor con herramientas definidas por Zod, valida argumentos antes de ejecutarlas y conserva un historial de llamadas. Tiene topes configurables de iteraciones, tokens y timeout.

Cuando una herramienta devuelve revisión para `msg-006`, el backend guarda una confirmación pendiente por sesión. Solo una respuesta afirmativa posterior autoriza el registro de valor `0` y fecha `2027-08-31`; el modelo no puede autorizarse solo.

## 4. Proveedor, modelo y costo

DeepSeek se selecciona por configuración (`DEEPSEEK_MODEL`, por defecto `deepseek-chat`) usando Chat Completions y tool calls. Sin `DEEPSEEK_API_KEY` se usa el adaptador fake solo para desarrollo. El costo por caso se calcula con `usage.total_tokens` reportado por el proveedor multiplicado por la tarifa vigente de la cuenta; no se fija una tarifa porque puede cambiar y debe verificarse antes de defensa.

## 5. Estrategia de extracción y confianza

P0 usa regex y heurísticas sobre TXT. Cada campo conserva evidencia y confianza: 1.0 para valor explícito, 0.9 para normalización, menor a 0.8 para inferencia y 0 para ausencia. Las herramientas persisten solo valores validados; no se inventan fechas, monedas ni identificadores. Los importes conservan moneda original.

## 6. Regla de gobierno

- Buzón único: `contratos@periferia-ficticia.com`; responsable: Administración.
- Comercial: envía PDF firmado, otrosí o acta de terminación dentro de dos días hábiles de firma, con asunto `Contrato | Cliente | ID`.
- Administración: acusa recibo en un día hábil y resuelve/rechaza excepciones en tres días hábiles.
- Sin firma, valor o fecha verificable: revisión humana, no registro automático.
- Escalamiento: Administración → Gerencia Comercial → Gerencia.
- Se realizará campaña de reconstrucción junio–agosto de 2026 con responsables por región.
- Indicador mensual: porcentaje de contratos facturados que aparecen en el maestro del mismo mes.

## 7. Decisiones y trade-offs

1. CSV en `out/sharepoint` en vez de BD: cumple el reto y simplifica demo; no cubre concurrencia multiusuario.
2. Extracción determinista antes de LLM: reduce alucinaciones y permite demo sin clave; requiere ampliar reglas ante nuevos formatos.
3. Rechazado separado de procesado: `msg-005` permanece pendiente; evita ocultar un documento que requiere decisión futura.
4. Póliza contractual sin certificado es `pendiente`, no `vigente`; prioriza integridad sobre optimismo.

## 8. Supuestos

Los fixtures son fuente de verdad de la demo; contratos marco se registran con valor 0 solo tras confirmación del caso `msg-006`; `fecha_registro` usa fecha de ejecución inyectada. Los `.txt` sustituyen documentos PDF y se conserva su extensión real.

## 9. Cobertura

| HU | Estado |
|---|---|
| Leer buzón | Hecho |
| Extraer contrato | Hecho para 6 fixtures |
| Validar/clasificar | Hecho: nuevo, actualización, duplicado, rechazado |
| Registrar/archivar | Hecho en salida local |
| Alertar | Hecho con fecha inyectable |
| Errores | Hecho para IDs y fechas inválidos |
| Integraciones reales | Fuera de alcance |

## 10. Uso de IA

Se usó PERXIA para análisis del PRD, planificación, implementación y pruebas. Se rechazaron inferencias de fechas/valores no sustentadas y automatización de integraciones externas.

## 11. Riesgos de producción

Producción requeriría autenticación, autorización por recurso, cifrado, retención, observabilidad, volumen persistente, control de concurrencia y validación jurídica. Los fixtures no acreditan documentos reales ni aceptación de clientes.