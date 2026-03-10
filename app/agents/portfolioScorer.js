import OpenAI from "openai";

export async function portfolioScorer(repoData,analysis,skills){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
A developer built this project.

Purpose:
${analysis.purpose}

Skills detected:
${skills.join(", ")}

Evaluate the developer.

Return JSON:

{
"difficulty_level":"Beginner | Intermediate | Advanced",
"recommended_roles":[
"AI Engineer",
"Backend Developer"
],
"insight":"Explain what this project shows about the developer"
}
`
});

let text = response.output_text || "{}";

let parsed;

try{
parsed = JSON.parse(text);
}catch{
parsed = {};
}

return parsed;

}catch(e){

return{
difficulty_level:"Intermediate",
recommended_roles:["Software Engineer"],
insight:"Project demonstrates practical development ability."
};

}

}