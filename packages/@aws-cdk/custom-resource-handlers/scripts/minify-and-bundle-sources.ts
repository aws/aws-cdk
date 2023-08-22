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
    // Only minify + bundle 'index.ts' files.
    // The reason why they are called 'index.ts' is that aws-cdk-lib expects that
    // as the file name and it is more intuitive to keep the same name rather than
    // rename as we copy it out.
    if (fileOrDir.includes('index.ts')) {
      entryPoints.push(fileOrDir);
    }
  }
}

const bindingsDir = path.join(__dirname, '..', 'lib');

recFolderStructure(bindingsDir);

for (const ep of entryPoints) {
  void esbuild.build({
    entryPoints: [ep],
    outfile: calculateOutfile(ep),
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

function calculateOutfile(file: string) {
  // turn ts extension into js extension
  file = path.join(path.dirname(file), path.basename(file, path.extname(file)) + '.js');

  // replace /lib with /dist
  const fileContents = file.split(path.sep);
  fileContents[fileContents.lastIndexOf('lib')] = 'dist';

  return fileContents.join(path.sep);
}
