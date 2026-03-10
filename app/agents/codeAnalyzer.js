import OpenAI from "openai";
import { extractJSON } from "./utils";

export async function codeAnalyzer(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const structure = repoData.files.map(f=>f.path).join("\n");

const codeContext = repoData.files
.slice(0,20)
.map(f=>`FILE:${f.path}\n${f.content.slice(0,1000)}`)
.join("\n\n");

const readmeContext = repoData.readme || "";

const response = await openai.responses.create({
model:"gpt-4.1-mini",

text:{
format:{type:"json_object"}
},

input:`
Analyze this GitHub repository.

README:
${readmeContext}

Description:
${repoData.description}

Languages:
${repoData.languages.join(",")}

Structure:
${structure}

Code:
${codeContext}

Return JSON:

{
"purpose":"project purpose",
"system_type":"system type",
"architecture_complexity":"Beginner | Intermediate | Advanced",
"core_modules":["main modules"],
"architecture_insight":"architecture explanation"
}
`
});

const parsed = extractJSON(response);

parsed.purpose ||= repoData.description || "Software project";
parsed.system_type ||= "Software Application";
parsed.architecture_complexity ||= "Intermediate";
parsed.core_modules ||= structure.split("\n").slice(0,5);
parsed.architecture_insight ||= "Modular codebase with multiple components.";

return parsed;

}