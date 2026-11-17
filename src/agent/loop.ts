import type { ToolContext } from "../domain/types.js";
import type { LlmAdapter } from "../llm/adapter.js";
import { tools } from "../tools/contratos.js";
import type { Session } from "./session.js";

type RunnableTool = { description:string; execute:(args:never,ctx:ToolContext)=>Promise<string> };
const known=tools as Record<string,RunnableTool>;

export async function runTurn(session:Session,message:string,adapter:LlmAdapter,prompt:string,ctx:ToolContext){
  if(session.busy)throw new Error("Sesión ocupada");
  session.busy=true;
  try{
    if(!session.messages.length)session.messages.push({role:"system",content:prompt});
    session.messages.push({role:"user",content:message});
    const calls:{name:string;args?:Record<string,unknown>;result:string}[]=[];
    const definitions=Object.entries(known).map(([name,tool])=>({name,description:tool.description,parameters:{type:"object"}}));
    for(let iteration=0;iteration<25;iteration+=1){
      const response=await adapter.send(session.messages,definitions);
      session.messages.push({role:"assistant",content:response.content,toolCalls:response.toolCalls});
      if(!response.toolCalls.length){
        session.history.push({role:"assistant",content:response.content,toolCalls:calls});
        return {reply:response.content,toolCalls:calls,needsConfirmation:false};
      }
      for(const call of response.toolCalls){
        const tool=known[call.name];
        if(!tool){calls.push({name:call.name,result:"herramienta desconocida"});continue;}
        let args:Record<string,unknown>;
        try{args=JSON.parse(call.arguments) as Record<string,unknown>;}catch{calls.push({name:call.name,result:"argumentos inválidos"});continue;}
        const result=await tool.execute(args as never,ctx);
        session.messages.push({role:"tool",toolCallId:call.id,content:result});
        calls.push({name:call.name,args,result});
      }
    }
    return {reply:"Límite de iteraciones alcanzado.",toolCalls:calls,needsConfirmation:false};
  }finally{session.busy=false;}
}
