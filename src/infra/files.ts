import { copyFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export const fixturesRoot=(dir:string)=>path.join(dir,"fixtures","reto-02");
export const outRoot=(dir:string)=>path.join(dir,"out");
export const validMessageId=(id:string)=>/^msg-\d{3}$/.test(id);
export const readJson=async <T>(file:string):Promise<T>=>JSON.parse(await readFile(file,"utf8")) as T;
export const readText=(file:string)=>readFile(file,"utf8");
export async function writeAtomic(file:string, value:string|Uint8Array):Promise<void>{await mkdir(path.dirname(file),{recursive:true});const tmp=`${file}.tmp-${process.pid}-${Date.now()}`;await writeFile(tmp,value);await rename(tmp,file);}
export async function appendJsonl(file:string, value:unknown):Promise<void>{const old=await readFile(file,"utf8").catch(()=>"");await writeAtomic(file,`${old}${JSON.stringify(value)}\n`);}
export async function cleanOut(dir:string):Promise<void>{await rm(outRoot(dir),{recursive:true,force:true});await mkdir(outRoot(dir),{recursive:true});}
export async function copyAtomic(source:string,target:string):Promise<void>{await mkdir(path.dirname(target),{recursive:true});const tmp=`${target}.tmp-${process.pid}`;await copyFile(source,tmp);await rename(tmp,target);}
export function safeJoin(base:string,...parts:string[]):string{if(parts.some(p=>!p||p==="."||p===".."||p.includes("/")||p.includes("\\")))throw new Error("Ruta inválida");return path.join(base,...parts);}
export function slug(value:string):string{return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}
