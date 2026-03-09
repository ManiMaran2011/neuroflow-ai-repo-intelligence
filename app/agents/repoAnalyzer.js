export async function repoAnalyzer(repoUrl){

const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

if(!match){
throw new Error("Invalid GitHub URL");
}

const owner = match[1];
const repo = match[2];

const repoRes = await fetch(
`https://api.github.com/repos/${owner}/${repo}`
);

const repoData = await repoRes.json();

const treeRes = await fetch(
`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`
);

const treeData = await treeRes.json();

const codeFiles = treeData.tree
.filter(f =>
f.type === "blob" &&
(
f.path.endsWith(".py") ||
f.path.endsWith(".js") ||
f.path.endsWith(".ts") ||
f.path.endsWith(".tsx") ||
f.path.endsWith(".ipynb")
)
)
.slice(0,12);

const files = [];

for(const file of codeFiles){

try{

const raw = await fetch(
`https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`
);

const content = await raw.text();

files.push({
path:file.path,
content:content.slice(0,2000)
});

}catch{}

}

return{

name:repoData.name,
description:repoData.description,
files

};

}