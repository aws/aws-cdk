/* eslint-disable jest/valid-describe-callback */
/* eslint-disable jest/no-disabled-tests */
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { SerializableNodejsFunctionProps } from './types';

// Paths resolved once
export const CDK_LIB_PATH = path.resolve(__dirname, '..', '..', '..');
export const CDK_CLI_PATH = require.resolve('aws-cdk/bin/cdk');
export const APP_PATH = path.join(__dirname, 'app.ts');
export const MONOREPO_NODE_MODULES = path.resolve(CDK_LIB_PATH, '..', '..', 'node_modules');

const dockerBinary = process.env.CDK_DOCKER ?? 'docker';

// Check Docker availability once
const dockerAvailable = (() => {
  try {
    const r = child_process.spawnSync(dockerBinary, ['info'], { timeout: 5000, stdio: 'pipe' });
    return r.status === 0;
  } catch {
    return false;
  }
})();

// Check which package managers are available locally
function isCommandAvailable(cmd: string): boolean {
  try {
    const r = child_process.spawnSync(cmd, ['--version'], { timeout: 5000, stdio: 'pipe' });
    return r.status === 0;
  } catch {
    return false;
  }
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

const localPkgManagers: Record<PackageManager, boolean> = {
  npm: isCommandAvailable('npm'),
  yarn: isCommandAvailable('yarn'),
  pnpm: isCommandAvailable('pnpm'),
  bun: isCommandAvailable('bun'),
};

/**
 * Lock file content per package manager.
 * For basic bundling (no nodeModules), the content doesn't matter —
 * only the filename is used to detect the package manager.
 */
export const LOCK_FILES: Record<PackageManager, { name: string; content: string }> = {
  npm: {
    name: 'package-lock.json',
    content: JSON.stringify({
      name: 'test',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: { '': { name: 'test', version: '1.0.0' } },
    }),
  },
  yarn: { name: 'yarn.lock', content: '' },
  pnpm: { name: 'pnpm-lock.yaml', content: 'lockfileVersion: \'6.0\'\n' },
  bun: { name: 'bun.lock', content: '' },
};

export const TS_HANDLER = 'export const handler = async () => ({ statusCode: 200, body: "hello" });\n';
export const JS_HANDLER = 'exports.handler = async () => ({ statusCode: 200, body: "hello" });\n';

/**
 * A handler that imports 'delay' — used for nodeModules tests.
 * The import is there to verify the module is available at bundle time,
 * but the actual function is externalized (not bundled) and installed via nodeModules.
 */
export const TS_HANDLER_WITH_DELAY = [
  'import delay from "delay";',
  'export const handler = async () => { await delay(1); return { statusCode: 200 }; };',
].join('\n') + '\n';

/**
 * A real npm lock file that includes delay@5.0.0.
 * Generated via: echo '{"name":"test","version":"1.0.0","dependencies":{"delay":"5.0.0"}}' > package.json && npm install --package-lock-only
 */
export const NPM_LOCK_WITH_DELAY = JSON.stringify({
  name: 'test',
  version: '1.0.0',
  lockfileVersion: 3,
  requires: true,
  packages: {
    '': { name: 'test', version: '1.0.0', dependencies: { delay: '5.0.0' } },
    'node_modules/delay': {
      version: '5.0.0',
      resolved: 'https://registry.npmjs.org/delay/-/delay-5.0.0.tgz',
      integrity: 'sha512-ReEBKkIfe4ya47wlPYf/gu5ib6yUG0/Aez0JQZQz94kiWtRQvZIQbTiehsnwHvLSWJnQdhVeqYue7Id1dKr0qw==',
      license: 'MIT',
    },
  },
});

export interface TestProject {
  dir: string;
  outdir: string;
  entryFile: string;
  cleanup: () => void;
}

/**
 * Run the tests inside both with and without Docker (or skips with complaining if Docker is not available)
 */
export function describeDockerSuite(block: (forceDockerBundling: boolean) => void) {
  describe('local', () => block(false));

  if (dockerAvailable) {
    describe('in docker', () => block(true));
  } else {
    describe.skip(`in docker (${dockerBinary} not found -- set $CDK_DOCKER)`, () => block(true));
  }
}

/**
 * Run the tests inside for the given package manager (or skips with complaining if the package manager is not available)
 */
export function describePackageManagerSuite(block: (pkgManager: PackageManager) => void) {
  for (const pkgManager of ['npm', 'yarn', 'pnpm', 'bun'] as const) {
    if (localPkgManagers[pkgManager]) {
      describe(`with ${pkgManager}`, () => block(pkgManager));
    } else {
      describe.skip(`with ${pkgManager} (skipped -- ${pkgManager} not found on system)`, () => block(pkgManager));
    }
  }
}

/**
 * Creates a temporary project directory with handler, package.json, and lock file.
 */
export function createProject(pkgManager: keyof typeof LOCK_FILES, handlerExt: '.ts' | '.js'): TestProject {
  // Use 'realpath' to resolve the issue that on macOS the $TMPDIR points to a symlink, which messes with the NodejsFunction
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-e2e-')));
  const outdir = path.join(dir, 'cdk.out');

  // package.json
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'test', version: '1.0.0' }));

  // Lock file
  const lock = LOCK_FILES[pkgManager];
  fs.writeFileSync(path.join(dir, lock.name), lock.content);

  // Handler
  const handlerContent = handlerExt === '.ts' ? TS_HANDLER : JS_HANDLER;
  const entryFile = path.join(dir, `handler${handlerExt}`);
  fs.writeFileSync(entryFile, handlerContent);

  // Symlink esbuild so local bundling can find it via npx/yarn run/etc.
  const nodeModules = path.join(dir, 'node_modules');
  const dotBin = path.join(nodeModules, '.bin');
  fs.mkdirSync(dotBin, { recursive: true });
  fs.symlinkSync(path.join(MONOREPO_NODE_MODULES, 'esbuild'), path.join(nodeModules, 'esbuild'));
  fs.symlinkSync(path.join(MONOREPO_NODE_MODULES, '.bin', 'esbuild'), path.join(dotBin, 'esbuild'));
  // esbuild needs its platform-specific binary package
  const esbuildPlatformPkg = '@esbuild';
  const esbuildPlatformSrc = path.join(MONOREPO_NODE_MODULES, esbuildPlatformPkg);
  if (fs.existsSync(esbuildPlatformSrc)) {
    fs.symlinkSync(esbuildPlatformSrc, path.join(nodeModules, esbuildPlatformPkg));
  }

  return {
    dir,
    outdir,
    entryFile,
    cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
  };
}

/**
 * Runs `cdk synth` against the test project and returns the output directory.
 */
export function cdkSynth(proj: TestProject, config: SerializableNodejsFunctionProps): { stdout: string; stderr: string } {
  const result = child_process.spawnSync(
    process.execPath, // node
    [
      CDK_CLI_PATH,
      'synth',
      '--app', `ts-node --transpileOnly --preferTsExts ${APP_PATH}`,
      '--output', proj.outdir,
      '--no-version-reporting',
      '--no-path-metadata',
      '--no-asset-metadata',
      '--quiet',
      ...Object.entries(config.context ?? {}).flatMap(([key, value]) => ['--context', `${key}=${value}`]),
    ],
    {
      cwd: proj.dir,
      env: {
        ...process.env,
        CDK_LIB_PATH,
        E2E_CONFIG: JSON.stringify(config),
      },
      timeout: 450_000,
      stdio: 'pipe',
    },
  );

  const stdout = result.stdout?.toString() ?? '';
  const stderr = result.stderr?.toString() ?? '';

  if (result.status !== 0) {
    throw new Error(`cdk synth failed (exit ${result.status}):\n${stdout}\n${stderr}`);
  }

  return { stdout, stderr };
}

/**
 * Finds the single asset directory in the synth output.
 */
export function findAssetDir(outdir: string): string {
  const entries = fs.readdirSync(outdir).filter(e => e.startsWith('asset.'));
  if (entries.length !== 1) {
    throw new Error(`Expected exactly 1 asset directory, found ${entries.length}: ${entries.join(', ')}`);
  }
  return path.join(outdir, entries[0]);
}

/**
 * Returns all files in the asset directory (relative paths).
 */
export function assetFiles(outdir: string): string[] {
  const assetDir = findAssetDir(outdir);
  return listFilesRecursive(assetDir, assetDir);
}

function listFilesRecursive(dir: string, root: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(full, root));
    } else {
      results.push(path.relative(root, full));
    }
  }
  return results;
}
