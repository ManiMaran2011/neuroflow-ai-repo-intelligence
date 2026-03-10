import OpenAI from "openai";
import { extractJSON } from "./utils";

export async function portfolioScorer(repoData,analysis,skills){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const response = await openai.responses.create({
model:"gpt-4.1-mini",

text:{
format:{type:"json_object"}
},

input:`
Evaluate this project.

Purpose:
${analysis.purpose}

Technologies:
${skills.join(",")}

Return JSON:

{
"difficulty_level":"Beginner | Intermediate | Advanced",
"recommended_roles":["roles"],
"improvement_suggestions":["suggestions"]
}
`
});

const parsed = extractJSON(response);

parsed.difficulty_level ||= "Intermediate";
parsed.recommended_roles ||= ["Software Engineer"];
parsed.improvement_suggestions ||= ["Improve documentation"];

return parsed;

}