export type Clasificacion = "nuevo" | "actualizacion" | "duplicado" | "rechazado";
export type TipoDocumento = "contrato" | "otrosi" | "cotizacion" | "desconocido";
export type EstadoPoliza = "vigente" | "pendiente" | "vencida" | "no_aplica";
export type Fuente = "buzon" | "manual" | "migracion";
export type Moneda = "COP" | "USD" | "PEN" | "PAB" | "HNL";
export type Pais = "CO" | "EC" | "PE" | "PA" | "HN";

export type Correo = { id:string; de:string; para:string; asunto:string; fecha:string; cuerpo:string; adjuntos:string[] };
export type Comercial = { email:string; nombre:string; region:string };
export type RegistroContrato = { id_contrato:string; cliente:string; nit_cliente:string; pais:Pais; objeto:string; valor:number; moneda:Moneda; fecha_inicio:string; fecha_fin:string; requiere_poliza:boolean; tipo_poliza:string; estado_poliza:EstadoPoliza; comercial:string; ruta_sharepoint:string; fecha_registro:string; fuente:Fuente };
export type ContratoExtraido = { id_contrato:string|null; cliente:string|null; nit_cliente:string|null; pais:Pais|null; objeto:string|null; valor:number|null; moneda:Moneda|null; fecha_inicio:string|null; fecha_fin:string|null; requiere_poliza:boolean|null; tipo_poliza:string[]; estado_poliza:EstadoPoliza|null; comercial:string|null; ruta_sharepoint:string|null; fecha_registro:string|null; fuente:Fuente; tipo_documento:TipoDocumento; confianza:Record<string,number>; evidencias:Record<string,string>; valor_indeterminado:boolean; otrosi_de:string|null };
export type Validacion = { clasificacion:Clasificacion; existente:RegistroContrato|null; requiere_revision:string[]; diferencias:string[]; advertencias:string[]; motivo:string|null };
export type ToolContext = { directory:string; sessionId:string; confirmedMessageId?:string; confirmedFields?: Record<string,unknown>; today?:string };
