// generates the mono-cdk module by copying @aws-cdk/lib/** to src/
// and rewriting the interdepedent "import" statements.
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function main() {
  const srcdir = path.resolve('src');
  const reexports = [];

  await fs.remove(srcdir);
  await fs.mkdir(srcdir);

  const root = path.resolve(__dirname, '..', '@aws-cdk');
  const modules = await fs.readdir(root);

  for (const dir of modules) {
    const moduledir = path.resolve(root, dir);
    const meta = JSON.parse(await fs.readFile(path.join(moduledir, 'package.json'), 'utf-8'));

    if (meta.deprecated) {
      console.error(`skipping deprecated ${meta.name}`);
      continue;
    }

    if (!meta.jsii) {
      console.error(`skipping non-jsii ${meta.name}`);
      continue;
    }

    // check if moduledir includes any directory other than "lib" and "test"
    const subdirs = [];
    const allowed = [ 'lib', 'test', 'node_modules', 'scripts', 'build-tools' ];
    for (const file of await fs.readdir(moduledir)) {
      if (allowed.includes(file)) {
        continue;
      }
      if ((await fs.stat(path.join(moduledir, file))).isDirectory()) {
        subdirs.push(file);
      }
    }

    if (subdirs.length > 0) {
      console.error(`WARNING: ${moduledir} includes a directory that is not one of [${allowed.join(',')}]: [${subdirs.join(',')}]`);
    }

    const basename = path.basename(moduledir);
    const source = `${moduledir}/lib`;
    const target = `${srcdir}/${basename}/lib`;
    await fs.copy(source, target);

    await fs.writeFile(path.join(path.dirname(target), 'index.ts'), `export * from './lib'\n`);

    const namespace = basename.replace(/-/g, '_');
    reexports.push(`import * as ${namespace} from './${basename}/lib'; export { ${namespace} };`)
  }

  await fs.writeFile(path.join(srcdir, 'index.ts'), reexports.join('\n'));

  const sourceFiles = await findSources(srcdir);
  for (const source of sourceFiles) {
    await rewriteImports(srcdir, source);
  }
}

async function findSources(srcdir) {
  return new Promise((ok, ko) => glob('**/*.ts', { cwd: srcdir }, (err, results) => {
    if (err) { return ko(err); }
    return ok(results);
  }));
}

async function rewriteImports(srcdir, relativeSource) {
  const absoluteSource = path.join(srcdir, relativeSource);
  const source = await fs.readFile(absoluteSource, 'utf-8');

  const match = /from ['"]@aws-cdk\/(.+)['"]/.exec(source);
  if (!match) {
    return;
  }

  const left = source.substring(0, match.index);
  const right = source.substring(match.index + match[0].length);

  const submodule = match[1];
  const moduleDir = path.join(srcdir, submodule);
  const rel = path.relative(path.dirname(absoluteSource), moduleDir)

  const newSource = `${left}from '${rel}'${right}`;
  await fs.writeFile(absoluteSource, newSource);

  // call recursively until exhausted
  await rewriteImports(srcdir, relativeSource);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
