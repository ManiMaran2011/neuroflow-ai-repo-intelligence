import { agentOrchestrator } from "../../agents/orchestrator";

export async function POST(req){

const { repo } = await req.json();

try{

const result = await agentOrchestrator(repo);

return Response.json(result);

}catch(error){

return Response.json(
{error:error.message},
{status:500}
);

}

}