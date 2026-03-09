import OpenAI from "openai";

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

export async function skillExtractor(repoData){

const code = repoData.files
.map(f => f.content)
.join("\n");

const prompt = `
Analyze the following code samples.

Extract developer skills.

Return JSON array.

Example:

[
"Python",
"FastAPI",
"LangChain",
"Vector Databases",
"RAG",
"Machine Learning"
]

Code:
${code}
`;

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:prompt
});

const text = response.output_text;

try{
return JSON.parse(text);
}catch{
return [];
}

}