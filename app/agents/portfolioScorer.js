export async function portfolioScorer(repoData,analysis,skills){

let difficulty = "Beginner";

if(skills.length > 6) difficulty = "Intermediate";
if(skills.length > 10) difficulty = "Advanced";

const roles = [];

if(skills.includes("Python")) roles.push("Backend Developer");
if(skills.includes("FastAPI")) roles.push("API Engineer");
if(skills.includes("OpenAI API")) roles.push("AI Engineer");
if(skills.includes("LangChain")) roles.push("LLM Engineer");

if(roles.length === 0){

roles.push("Software Engineer");
roles.push("Backend Developer");

}

return{

difficulty_level:difficulty,
recommended_roles:roles,
improvement_suggestions:[
"Add more documentation",
"Include tests",
"Improve README with architecture diagram"
]

};

}