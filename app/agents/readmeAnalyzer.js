import OpenAI from "openai";
import { extractJSON } from "./utils";

export async function readmeAnalyzer(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const readme = repoData.files.find(f =>
f.path.toLowerCase().includes("readme")
);

if(!readme){
return {
project_summary: repoData.description || "Software project",
system_category: "Software Application"
};
}

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
Analyze this README.

README:
${readme.content.slice(0,4000)}

Return ONLY JSON:

{
"project_summary":"summary of the project",
"system_category":"AI system | SaaS | Web App | ML pipeline | Dev Tool"
}
`
});

const parsed = extractJSON(response);

parsed.project_summary ||= repoData.description || "Software project";
parsed.system_category ||= "Software Application";

return parsed;

}