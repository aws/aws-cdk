const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const entryPoints = [];
function recFolderStructure(fileOrDir) {
  if (fs.statSync(fileOrDir).isDirectory()) {
    const items = fs.readdirSync(fileOrDir);
    for (const i of items) {
      console.log(i);
      recFolderStructure(path.join(fileOrDir, i));
    }
  } else {
    if (path.extname(fileOrDir) === '.ts') {
      entryPoints.push(fileOrDir);
    }
  }
}

const bindingsDir = path.join(__dirname, '..', 'lib');
const testDir = path.join(__dirname, '..', 'test');

recFolderStructure(bindingsDir);
recFolderStructure(testDir);

console.log(entryPoints);

for (const ep of entryPoints) {
  const test = ep.includes('.test.ts');
  esbuild.build({
    entryPoints: [ep],
    outfile: `${ep.slice(0, ep.lastIndexOf('.'))}.js`,
    format: 'cjs',
    platform: 'node',
    minify: test ? false : true,
    minifyWhitespace: test ? false : true,
    minifySyntax: test ? false : true,
    minifyIdentifiers: test ? false : true,
    sourcemap: false,
    tsconfig: 'tsconfig.json',
  });
}
