import OpenAI from "openai";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const repoTree = repoData.files.map(f=>f.path).join("\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
Analyze this GitHub repository and identify the technologies and developer skills used.

Repository files:
${repoTree}

Return JSON:

{
"skills":[
"Python",
"Async Programming",
"API Development"
]
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

return parsed.skills || [];

}catch(e){

return ["Software Development"];

}

}