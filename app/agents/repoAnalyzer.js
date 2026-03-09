export async function repoAnalyzer(repoUrl){

const parts = repoUrl.replace("https://github.com/","").split("/");
const owner = parts[0];
const repo = parts[1];

const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
const repoData = await repoRes.json();

const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`);
const treeData = await treeRes.json();

const files = treeData.tree
.filter(f => f.type === "blob")
.filter(f =>
f.path.endsWith(".py") ||
f.path.endsWith(".js") ||
f.path.endsWith(".ts") ||
f.path.endsWith(".tsx") ||
f.path.endsWith(".ipynb")
)
.slice(0,20);

const fileContents = [];

for(const file of files){

try{

const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`);

const data = await res.json();

const content = Buffer.from(data.content,"base64").toString();

fileContents.push({
path:file.path,
content
});

}catch{}

}

return{
name:repoData.name,
description:repoData.description,
files:fileContents
};

}