import { agentOrchestrator } from "../../agents/orchestrator";

export async function POST(req){

const {repo} = await req.json();

const result = await agentOrchestrator(repo);

return Response.json(result);

}