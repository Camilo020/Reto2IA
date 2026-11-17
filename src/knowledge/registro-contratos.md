## Reglas de operación

- Duplicado: mismo ID, valor, inicio y fin; no modifica maestro.
- Actualización: mismo ID con cambios o documento otrosí; registra historial.
- Nuevo: contrato sin coincidencia.
- Rechazado: cotización o documento no contractual; no se registra ni se marca procesado.
- Confianza menor a 0.8: requiere revisión.
- Póliza exigida sin certificado: pendiente; sin póliza: no_aplica.
- `msg-006`: solo registrar tras confirmación humana de valor 0 y fecha fin 2027-08-31.
- El maestro fixture es inmutable; el maestro de trabajo vive en out/sharepoint.
