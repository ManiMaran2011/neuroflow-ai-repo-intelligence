import OpenAI from "openai";

export async function portfolioScorer(repoData,analysis,skills){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

let result;

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
Evaluate a developer project.

Purpose:
${analysis.purpose}

Skills:
${skills.join(", ")}

Return JSON:

{
"difficulty_level":"Beginner | Intermediate | Advanced",
"recommended_roles":["roles"],
"insight":"short evaluation"
}
`
});

let text = response.output_text || "{}";

try{
result = JSON.parse(text);
}catch{
result = {};
}

}catch(e){

result = {};

}

/* FALLBACKS */

if(!result.difficulty_level){

if(skills.length > 5) result.difficulty_level = "Advanced";
else if(skills.length > 2) result.difficulty_level = "Intermediate";
else result.difficulty_level = "Beginner";

}

if(!result.recommended_roles || result.recommended_roles.length === 0){

const roles = [];

if(skills.includes("Python")) roles.push("Backend Developer");
if(skills.includes("JavaScript")) roles.push("Full Stack Developer");
if(skills.includes("React")) roles.push("Frontend Developer");
if(skills.includes("OpenAI API")) roles.push("AI Engineer");

if(roles.length === 0) roles.push("Software Engineer");

result.recommended_roles = roles;

}

if(!result.insight){

result.insight =
"This project demonstrates software development skills and system design capabilities.";

}

return result;

}