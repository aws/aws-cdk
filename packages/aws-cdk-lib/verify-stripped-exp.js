const { spawnSync } = require('child_process');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');

const JS_DIST_LIB = 'dist/js/';

async function main() {
  const cwd = process.cwd();
  const awsCdkModulesPath = path.join(findWorkspacePath(),'packages', '@aws-cdk');
  const tempDir = fs.mkdtempSync(os.tmpdir());
  
  console.log(tempDir);
  process.chdir(tempDir);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const version = require('./package.json').version;
  const tarFullPath = path.join(cwd, JS_DIST_LIB, `aws-cdk-lib-${version}.tgz`);
  exec('npm', ['init', '-y']);
  exec('npm', ['install', tarFullPath]);
  const installedAwsCdkLib = path.join('node_modules', 'aws-cdk-lib', 'lib');

  for (const module of fs.readdirSync(awsCdkModulesPath)) {
    const pkgJson = require(path.join(awsCdkModulesPath, module, 'package.json'));
    if (pkgJson['stability'] !== 'experimental') {
      continue;
    }
    if (pkgJson['cdk-build'].cloudformation) {
      // if a cfn module, verify only the allowed files exists
      const files = await getAllFiles(path.join(installedAwsCdkLib, module));
      files.forEach(file => {
        if (!isAllowedFile(file)) {
          throw `only L1 auto generated files are allowed in experimental modules included in aws-cdk-lib, the file ${file} exists in ${module}`;
        }
      });
    } else {
      // not a cfn module, verify it was entirely removed
      if (fs.existsSync(path.join(installedAwsCdkLib, module))) {
        throw `only L1s of experimental modules are allowed in aws-cdk-lib. The higher level module ${module} was included`;
      }  
    }
  }

}

main().then(
  () => process.exit(0),
  (err) => {
    process.stderr.write(`${err.toString()}\n`);
    process.exit(1);
  },
);

/**
 * Spawn sync with error handling
 */
function exec(cmd, args) {
  const proc = spawnSync(cmd, args);

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    if (proc.stdout || proc.stderr) {
      throw new Error(`[Status ${proc.status}] stdout: ${proc.stdout?.toString().trim()}\n\n\nstderr: ${proc.stderr?.toString().trim()}`);
    }
    throw new Error(`${cmd} exited with status ${proc.status}`);
  }

  return proc;
}

const GENERATED_SUFFIX_REGEX = new RegExp(/generated\.(js|ts|d\.ts)$/);
const ALLOWED_FILES = ['.jsiirc.json', 'index.ts', 'index.js', 'index.d.ts'];


function isAllowedFile(file) {
  if (GENERATED_SUFFIX_REGEX.test(file)) {
    return true;
  }
  return ALLOWED_FILES.includes(file);
}

function getAllChildren(dir) {
  return fs.readdirSync(dir);
}

async function getAllFiles(dir) {
  const ret = new Array();

  async function recurse(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if ((await fs.stat(fullPath)).isDirectory()) {
        await recurse(fullPath);
      } else {
        ret.push(file);
      }
    }
  }
  await recurse(dir);
  return ret;
}

async function isDirectory(path) {
  return await fs.stat(path).isDirectorySync();
}
/**
 * Find the workspace root path. Walk up the directory tree until you find lerna.json
 */
 function findWorkspacePath() {

  return _findRootPath(process.cwd());

  function _findRootPath(part) {
    if (process.cwd() === os.homedir()) {
      throw new Error('couldn\'t find a \'lerna.json\' file when walking up the directory tree, are you in a aws-cdk project?');
    }

    if (fs.existsSync(path.resolve(part, 'lerna.json'))) {
      return part;
    }
    return _findRootPath(path.resolve(part, '..'));
  }
}