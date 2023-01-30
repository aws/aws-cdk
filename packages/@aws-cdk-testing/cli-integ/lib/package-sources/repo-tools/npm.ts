import * as child_process from 'child_process';
import * as fs from 'fs-extra';

let argv = process.argv.slice(2);

// eslint-disable-next-line no-console
console.log('fake npm');

if (argv[0] === 'install') {
  if (!process.env.REPO_PACKAGE_MAP) {
    throw new Error('REPO_PACKAGE_MAP not set');
  }
  const repoPackageMap = fs.readJsonSync(process.env.REPO_PACKAGE_MAP, { encoding: 'utf-8' });

  // Replace paths in the 'package.json' in the current directory
  if (fs.pathExistsSync('package.json')) {
    const packageJson = fs.readJsonSync('package.json', { encoding: 'utf-8' });
    for (const deps of [packageJson.dependencies ?? {}, packageJson.devDependencies ?? {}]) {
      for (const [name, version] of Object.entries(deps)) {
        deps[name] = repoPackageMap[name] ?? version;
      }
    }
    fs.writeJsonSync('package.json', packageJson, { encoding: 'utf-8' });
  }

  // Replace package names on the command line
  argv = argv.map(x => repoPackageMap[x] ?? x);
}

////////////////////////////////////////////////////////////////////////
//  Shell out to original npm

const child = child_process.spawn('node', [require.resolve('npm'), ...argv], {
  shell: false,
  stdio: ['ignore', 'inherit', 'inherit'],
});

child.once('error', e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

child.once('close', code => {
  if (code) {
    process.exitCode = code;
  }
});