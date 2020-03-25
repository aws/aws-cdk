// generates the mono-cdk module by copying @aws-cdk/lib/** to src/
// and rewriting the interdepedent "import" statements.
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const os = require('os');

const exclude_modules = [ 
  // 'aws-lambda-nodejs' // bundles "parcel" which is unacceptable for now
];

const include_non_jsii = [ 
  // 'assert',
  // 'cloudformation-diff',
];

const include_dev_deps = [
  d => d === 'aws-sdk',
  d => d.startsWith('@types/')
];

const exclude_files = [
  'test',
  'node_modules', 
  'package.json', 
  'tsconfig.json', 
  'tsconfig.tsbuildinfo', 
  '.gitignore', 
  '.jsii', 
  'LICENSE', 
  'NOTICE' 
];

async function main() {
  const outdir = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'monocdk-')), 'package');

  console.error(`generating monocdk at ${outdir}`);
  const reexports = [];

  await fs.remove(outdir);
  await fs.mkdir(outdir);

  const monocdkroot = __dirname;
  const root = path.resolve(__dirname, '..', '@aws-cdk');
  const modules = await fs.readdir(root);
  const manifest = await fs.readJson(path.join(monocdkroot, 'package.json'));

  const nodeTypes = manifest.devDependencies['@types/node'];
  if (!nodeTypes) {
    throw new Error(`@types/node must be defined in devDependencies`);
  }
  const devDeps = manifest.devDependencies = {
    '@types/node': nodeTypes,
    'constructs': manifest.devDependencies['constructs']
  };

  if (manifest.dependencies) {
    throw new Error(`package.json should not contain "dependencies"`);
  }

  if (manifest.bundledDependencies) {
    throw new Error(`packaghe.json should not contain "bundledDependencies"`);
  }

  const pkgDeps = manifest.dependencies = { };
  const pkgBundled = manifest.bundledDependencies = [ ];

  for (const dir of modules) {
    if (exclude_modules.includes(dir)) {
      console.error(`skipping module ${dir}`);
      continue;
    }

    const moduledir = path.resolve(root, dir);

    const meta = JSON.parse(await fs.readFile(path.join(moduledir, 'package.json'), 'utf-8'));

    if (meta.deprecated) {
      console.error(`skipping deprecated ${meta.name}`);
      continue;
    }

    if (!meta.jsii && !include_non_jsii.includes(dir)) {
      console.error(`skipping non-jsii module ${meta.name}`);
      continue;
    }

    const basename = path.basename(moduledir);
    const files = await fs.readdir(moduledir);
    const targetdir = path.join(outdir, basename);
    for (const file of files) {
      const source = path.join(moduledir, file);

      // skip excluded directories
      if (exclude_files.includes(file)) {
        continue;
      }

      const target = path.join(targetdir, file);
      await fs.copy(source, target);
    }

    await fs.writeFile(path.join(targetdir, 'index.ts'), `export * from './lib'\n`);

    // export "core" types at the root. all the rest under a namespace.
    if (basename === 'core') {
      reexports.push(`export * from './core/lib';`);
    } else {
      const namespace = basename.replace(/-/g, '_');
      reexports.push(`export * as ${namespace} from './${basename}/lib';`);
    }

    // add @types/ devDependencies from module
    const shouldIncludeDevDep = d => include_dev_deps.find(pred => pred(d));

    for (const [ devDep, devDepVersion ] of Object.entries(meta.devDependencies || {})) {
      if (!shouldIncludeDevDep(devDep)) {
        continue;
      }

      const existingVer = devDeps[devDep];
      if (existingVer && existingVer !== devDepVersion) {
        throw new Error(`mismatching versions for devDependency ${devDep}. ${meta.name} requires ${devDepVersion} but we already have ${existingVer}`);
      }

      if (!existingVer) {
        console.error(`adding dev dep ${devDep}${devDepVersion}`);
        devDeps[devDep] = devDepVersion;
      }
    }

    // add bundled deps
    const bundled = [ ...meta.bundleDependencies || [], ...meta.bundledDependencies || [] ];
    for (const d of bundled) {
      const ver = meta.dependencies[d];
  
      console.error(`adding bundled dep ${d} with version ${ver}`);
      if (!pkgBundled.includes(d)) {
        pkgBundled.push(d);
      }
  
      if (!ver) {
        throw new Error(`cannot determine version for bundled dep ${d} of module ${meta.name}`);
      }
      const existingVer = pkgDeps[d];
      if (!existingVer) {
        pkgDeps[d] = ver;
      } else {
        if (existingVer !== ver) {
          throw new Error(`version mismatch for bundled dep ${d}: ${meta.name} requires version ${ver} but we already have version ${existingVer}`);
        }
      }
    }    
  }

  await fs.writeFile(path.join(outdir, 'index.ts'), reexports.join('\n'));

  console.error(`rewriting "import" statements...`);
  const sourceFiles = await findSources(outdir);
  for (const source of sourceFiles) {
    await rewriteImports(outdir, source);
  }

  // copy tsconfig.json and .npmignore
  const files = [ 'tsconfig.json', '.npmignore', 'README.md', 'LICENSE', 'NOTICE' ];
  for (const file of files) {
    await fs.copy(path.join(monocdkroot, file), path.join(outdir, file));
  }
  
  console.error('writing package.json');
  await fs.writeJson(path.join(outdir, 'package.json'), manifest, { spaces: 2 });

  console.log(outdir);
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
