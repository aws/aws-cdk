import * as fs from 'fs';
import * as path from 'path';
import * as esbuild from 'esbuild';

const entryPoints: string[] = [];
function recFolderStructure(fileOrDir: string) {
  if (fs.statSync(fileOrDir).isDirectory()) {
    const items = fs.readdirSync(fileOrDir);
    for (const i of items) {
      recFolderStructure(path.join(fileOrDir, i));
    }
  } else {
    if (path.extname(fileOrDir) === '.ts' && !fileOrDir.includes('.d.ts') && !fileOrDir.includes('nodejs-entrypoint')) {
      entryPoints.push(fileOrDir);
    }
  }
}

const bindingsDir = path.join(__dirname, '..', 'lib');

recFolderStructure(bindingsDir);

for (const ep of entryPoints) {
  void esbuild.build({
    entryPoints: [ep],
    outfile: `${ep.slice(0, ep.lastIndexOf('.'))}.js`,
    external: ['@aws-sdk/*'],
    format: 'cjs',
    platform: 'node',
    bundle: true,
    minify: true,
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: true,
    sourcemap: false,
    tsconfig: 'tsconfig.json',
  });
}
