export async function portfolioScorer(repoData,analysis,skills){

let difficulty = "Beginner";

if(skills.length >= 4) difficulty = "Intermediate";
if(skills.length >= 7) difficulty = "Advanced";

const roles = [];

if(skills.includes("Python")) roles.push("Backend Developer");
if(skills.includes("JavaScript")) roles.push("Full Stack Developer");
if(skills.includes("Agent Architecture")) roles.push("AI Engineer");
if(skills.includes("OpenAI API")) roles.push("LLM Engineer");

if(roles.length === 0){

roles.push("Software Engineer");

}

return{

difficulty_level:difficulty,

recommended_roles:roles,

improvement_suggestions:[
"Add detailed documentation",
"Include architecture diagrams",
"Add unit tests",
"Provide deployment instructions"
]

};

}