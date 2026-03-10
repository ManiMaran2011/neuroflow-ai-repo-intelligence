export function extractJSON(response){

try{

if(response.output_text){
return JSON.parse(response.output_text);
}

const text = response.output?.[0]?.content?.[0]?.text;

if(!text) return {};

const match = text.match(/\{[\s\S]*\}/);

if(match){
return JSON.parse(match[0]);
}

}catch(e){
console.log("JSON extraction failed",e);
}

return {};

}