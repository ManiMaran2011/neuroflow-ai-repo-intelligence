export async function repoAnalyzer(repoUrl){

const parts = repoUrl.replace("https://github.com/","").split("/");

const owner = parts[0];
const repo = parts[1];

const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
const repoData = await repoRes.json();

const branch = repoData.default_branch || "main";

const treeRes = await fetch(
`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
);

const treeData = await treeRes.json();

/* PRIORITIZE IMPORTANT CODE FOLDERS */

const priorityFolders = [
"src",
"backend",
"app",
"agents",
"services",
"core"
];

const codeFiles = treeData.tree
.filter(f => f.type === "blob")
.filter(f =>
f.path.endsWith(".py") ||
f.path.endsWith(".js") ||
f.path.endsWith(".ts") ||
f.path.endsWith(".tsx")
);

/* SORT FILES BY IMPORTANCE */

codeFiles.sort((a,b)=>{

const aPriority = priorityFolders.some(p => a.path.includes(p)) ? 0 : 1;
const bPriority = priorityFolders.some(p => b.path.includes(p)) ? 0 : 1;

return aPriority - bPriority;

});

const selectedFiles = codeFiles.slice(0,20);

const fileContents = [];

for(const file of selectedFiles){

try{

const res = await fetch(
`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${branch}`
);

const data = await res.json();

if(!data.content) continue;

const decoded = Buffer.from(data.content,"base64").toString("utf8");

fileContents.push({
path:file.path,
content:decoded
});

}catch(e){

console.log("file fetch failed:",file.path);

}

}

/* GUARANTEE FILES EXIST */

if(fileContents.length === 0){

fileContents.push({
path:"fallback.txt",
content:repoData.description || "software project repository"
});

}

return{

name:repoData.name,
description:repoData.description,
files:fileContents

};

}