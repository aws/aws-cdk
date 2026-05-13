/* eslint-disable jest/valid-describe-callback */
/* eslint-disable jest/no-disabled-tests */
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { SerializableNodejsFunctionProps } from './types';
import { OutputFormat } from '../../lib';

// Paths resolved once
const CDK_LIB_PATH = path.resolve(__dirname, '..', '..', '..');
const CDK_CLI_PATH = require.resolve('aws-cdk/bin/cdk');
const APP_PATH = path.join(__dirname, 'app.ts');
const MONOREPO_NODE_MODULES = path.resolve(CDK_LIB_PATH, '..', '..', 'node_modules');

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

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

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
const LOCK_FILES: Record<PackageManager, { name: string; content: string }> = {
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

// ============================================================
// Tests
// ============================================================

// Increase timeout — Docker bundling can take a while
jest.setTimeout(3_000_000);

let project: TestProject;
afterEach(() => project?.cleanup());

describeDockerSuite((forceDockerBundling) => {
  ////////////////////////////////////////////////////////////////////////
  //  Package-manager dependent tests

  describePackageManagerSuite((pkgManager) => {
    test('bundles a TypeScript handler', () => {
      project = createProject(pkgManager, '.ts');
      cdkSynth(project, {
        entry: project.entryFile,
        bundling: { forceDockerBundling },
      });

      const files = assetFiles(project.outdir);
      expect(files).toContain('index.js');

      // The output should be valid JS that exports a handler
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const bundled = require(path.join(findAssetDir(project.outdir), 'index.js'));
      expect(typeof bundled.handler).toBe('function');
    });

    test('bundles a JavaScript handler', () => {
      project = createProject(pkgManager, '.js');
      cdkSynth(project, {
        entry: path.join(project.dir, 'handler.js'),
        bundling: { forceDockerBundling },
      });

      const files = assetFiles(project.outdir);
      expect(files).toContain('index.js');
    });
  });

  ////////////////////////////////////////////////////////////////////////
  //  Tests that [we believe] do not depend on the package manager in use

  describe('pm-agnostic', () => {
    const pkgManager: PackageManager = 'npm';

    test('beforeBundling hook runs before esbuild', () => {
      project = createProject(pkgManager, '.ts');
      // beforeBundling will create a source file that is loaded by the entrypoint
      fs.writeFileSync(project.entryFile, [
        'import * as fs from "fs";',
        'import * as path from "path";',
        'import { init } from "./module";',
        'init();',
        'export const handler = async () => {',
        '  return { statusCode: 200, body: "ok" };',
        '};',
      ].join('\n') + '\n');

      cdkSynth(project, {
        entry: project.entryFile,
        bundling: {
          forceDockerBundling,
          commandHooks: {
            beforeBundling: ['echo "export function init() { }" > {inputDir}/module.ts'],
            beforeInstall: [],
            afterBundling: [],
          },
        },
      });

      // If beforeBundling failed, cdk synth would have failed (commands are chained with &&)
      const files = assetFiles(project.outdir);
      expect(files).toContain('index.js');
    });

    test('afterBundling hook can add files to output', () => {
      project = createProject(pkgManager, '.ts');

      cdkSynth(project, {
        entry: project.entryFile,
        bundling: {
          forceDockerBundling,
          commandHooks: {
            beforeBundling: [],
            beforeInstall: [],
            afterBundling: ['echo AFTER > {outputDir}/after-bundling-marker.txt'],
          },
        },
      });

      const files = assetFiles(project.outdir);
      expect(files).toContain('index.js');
      expect(files).toContain('after-bundling-marker.txt');

      const markerContent = fs.readFileSync(path.join(findAssetDir(project.outdir), 'after-bundling-marker.txt'), 'utf-8');
      expect(markerContent.trim()).toBe('AFTER');
    });

    test('preCompilation runs tsc before esbuild', () => {
      project = createProject(pkgManager, '.ts');
      // Add tsconfig.json
      fs.writeFileSync(path.join(project.dir, 'tsconfig.json'), JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'CommonJS',
          strict: true,
          outDir: './',
          rootDir: './',
        },
      }));

      // Symlink typescript for local bundling
      if (!forceDockerBundling) {
        const nodeModules = path.join(project.dir, 'node_modules');
        const dotBin = path.join(nodeModules, '.bin');
        fs.symlinkSync(path.join(MONOREPO_NODE_MODULES, 'typescript'), path.join(nodeModules, 'typescript'));
        fs.symlinkSync(path.join(MONOREPO_NODE_MODULES, '.bin', 'tsc'), path.join(dotBin, 'tsc'));
      }

      cdkSynth(project, {
        entry: project.entryFile,
        bundling: {
          forceDockerBundling,
          preCompilation: true,
        },
      });

      const files = assetFiles(project.outdir);
      expect(files).toContain('index.js');

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const bundled = require(path.join(findAssetDir(project.outdir), 'index.js'));
      expect(typeof bundled.handler).toBe('function');
    });

    test('nodeModules installs specified packages into output', () => {
      project = createProject(pkgManager, '.ts');
      // Overwrite handler with one that imports delay
      fs.writeFileSync(project.entryFile, TS_HANDLER_WITH_DELAY);
      // Overwrite package.json and lock file with versions that include delay
      fs.writeFileSync(path.join(project.dir, 'package.json'), JSON.stringify({
        name: 'test', version: '1.0.0', dependencies: { delay: '5.0.0' },
      }));
      fs.writeFileSync(path.join(project.dir, LOCK_FILES[pkgManager].name), NPM_LOCK_WITH_DELAY);

      cdkSynth(project, {
        entry: project.entryFile,
        bundling: {
          forceDockerBundling,
          nodeModules: ['delay'],
        },
      });

      const files = assetFiles(project.outdir);
      expect(files).toContain('index.js');
      // delay should be installed as a real node_module, not bundled
      expect(files).toEqual(expect.arrayContaining([
        expect.stringMatching(/^node_modules\/delay\//),
      ]));
      expect(files).toContain('package.json');
    });

    test('nodeModules can run a preinstall command', () => {
      project = createProject(pkgManager, '.ts');
      // Overwrite handler with one that imports delay
      fs.writeFileSync(project.entryFile, TS_HANDLER_WITH_DELAY);
      // Overwrite package.json and lock file with versions that include delay
      fs.writeFileSync(path.join(project.dir, 'package.json'), JSON.stringify({
        name: 'test', version: '1.0.0', dependencies: { delay: '5.0.0' },
      }));
      fs.writeFileSync(path.join(project.dir, LOCK_FILES[pkgManager].name), NPM_LOCK_WITH_DELAY);

      cdkSynth(project, {
        entry: project.entryFile,
        bundling: {
          forceDockerBundling,
          nodeModules: ['delay'],
          commandHooks: {
            afterBundling: [],
            beforeBundling: [],
            beforeInstall: ['echo INSTALL > {outputDir}/install-marker.txt'],

          },
        },
      });

      const files = assetFiles(project.outdir);
      expect(files).toContain('install-marker.txt');
    });
  });
});

////////////////////////////////////////////////////////////////////////
//  Tests that [we believe] do not depend on local vs. Docker bundling

describe('environment-agnostic', () => {
  const pkgManager = 'npm';
  const forceDockerBundling = false;

  test('produces source map when enabled', () => {
    project = createProject(pkgManager, '.ts');
    cdkSynth(project, {
      entry: project.entryFile,
      bundling: {
        sourceMap: true,
        forceDockerBundling,
      },
    });

    const files = assetFiles(project.outdir);
    expect(files).toContain('index.js');
    expect(files).toContain('index.js.map');
  });

  test('produces metafile when enabled', () => {
    project = createProject(pkgManager, '.ts');
    cdkSynth(project, {
      entry: project.entryFile,
      bundling: {
        metafile: true,
        forceDockerBundling,
      },
    });

    const files = assetFiles(project.outdir);
    expect(files).toContain('index.js');
    expect(files).toContain('index.meta.json');

    const meta = JSON.parse(fs.readFileSync(path.join(findAssetDir(project.outdir), 'index.meta.json'), 'utf-8'));
    expect(meta.outputs).toBeDefined();
  });

  test('minified output is smaller than non-minified', () => {
    // Non-minified
    project = createProject(pkgManager, '.ts');
    cdkSynth(project, {
      entry: project.entryFile,
      bundling: {
        forceDockerBundling,
      },
    });
    const normalSize = fs.statSync(path.join(findAssetDir(project.outdir), 'index.js')).size;
    project.cleanup();

    // Minified
    project = createProject(pkgManager, '.ts');
    cdkSynth(project, {
      entry: project.entryFile,
      bundling: {
        minify: true,
        forceDockerBundling,
      },
    });
    const minSize = fs.statSync(path.join(findAssetDir(project.outdir), 'index.js')).size;

    expect(minSize).toBeLessThan(normalSize);
  });

  test('produces ESM output with .mjs extension', () => {
    project = createProject(pkgManager, '.ts');
    cdkSynth(project, {
      entry: project.entryFile,
      bundling: {
        format: OutputFormat.ESM,
        forceDockerBundling,
      },
    });

    const files = assetFiles(project.outdir);
    expect(files).toContain('index.mjs');
    expect(files).not.toContain('index.js');
  });

  test('define substitutes constants in bundled output', () => {
    project = createProject(pkgManager, '.ts');
    // Write a handler that uses the defined constant
    fs.writeFileSync(project.entryFile,
      'declare const BUILD_TIME_VALUE: string;\n' +
      'export const handler = async () => ({ statusCode: 200, body: BUILD_TIME_VALUE });\n',
    );
    cdkSynth(project, {
      entry: project.entryFile,
      bundling: {
        forceDockerBundling,
        define: { BUILD_TIME_VALUE: JSON.stringify('substituted-value') },
      },
    });

    const bundledContent = fs.readFileSync(path.join(findAssetDir(project.outdir), 'index.js'), 'utf-8');
    expect(bundledContent).toContain('substituted-value');
    expect(bundledContent).not.toContain('BUILD_TIME_VALUE');
  });

  test('banner adds text to beginning of output', () => {
    project = createProject(pkgManager, '.ts');
    cdkSynth(project, {
      entry: project.entryFile,
      bundling: {
        forceDockerBundling,
        banner: '/* E2E-BANNER-TEST */',
      },
    });

    const bundledContent = fs.readFileSync(path.join(findAssetDir(project.outdir), 'index.js'), 'utf-8');
    expect(bundledContent).toMatch(/^\/\* E2E-BANNER-TEST \*\//);
  });

  test('footer adds text to end of output', () => {
    project = createProject(pkgManager, '.ts');
    cdkSynth(project, {
      entry: project.entryFile,
      bundling: {
        forceDockerBundling,
        footer: '/* E2E-FOOTER-TEST */',
      },
    });

    const bundledContent = fs.readFileSync(path.join(findAssetDir(project.outdir), 'index.js'), 'utf-8');
    expect(bundledContent.trimEnd()).toMatch(/\/\* E2E-FOOTER-TEST \*\/$/);
  });
});

/**
 * Run the tests inside both with and without Docker (or skips with complaining if Docker is not available)
 */
function describeDockerSuite(block: (forceDockerBundling: boolean) => void) {
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
function describePackageManagerSuite(block: (pkgManager: PackageManager) => void) {
  for (const pkgManager of ['npm', 'yarn', 'pnpm', 'bun'] as const) {
    if (localPkgManagers[pkgManager]) {
      describe(`with ${pkgManager}`, () => block(pkgManager));
    } else {
      describe.skip(`with ${pkgManager} (skipped -- ${pkgManager} not found on system)`, () => block(pkgManager));
    }
  }
}

const TS_HANDLER = 'export const handler = async () => ({ statusCode: 200, body: "hello" });\n';
const JS_HANDLER = 'exports.handler = async () => ({ statusCode: 200, body: "hello" });\n';

/**
 * A handler that imports 'delay' — used for nodeModules tests.
 * The import is there to verify the module is available at bundle time,
 * but the actual function is externalized (not bundled) and installed via nodeModules.
 */
const TS_HANDLER_WITH_DELAY = [
  'import delay from "delay";',
  'export const handler = async () => { await delay(1); return { statusCode: 200 }; };',
].join('\n') + '\n';

/**
 * A real npm lock file that includes delay@5.0.0.
 * Generated via: echo '{"name":"test","version":"1.0.0","dependencies":{"delay":"5.0.0"}}' > package.json && npm install --package-lock-only
 */
const NPM_LOCK_WITH_DELAY = JSON.stringify({
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

interface TestProject {
  dir: string;
  outdir: string;
  entryFile: string;
  cleanup: () => void;
}

/**
 * Creates a temporary project directory with handler, package.json, and lock file.
 */
function createProject(pkgManager: keyof typeof LOCK_FILES, handlerExt: '.ts' | '.js'): TestProject {
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
function cdkSynth(proj: TestProject, config: SerializableNodejsFunctionProps): { stdout: string; stderr: string } {
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
    ],
    {
      cwd: proj.dir,
      env: {
        ...process.env,
        CDK_LIB_PATH,
        E2E_CONFIG: JSON.stringify(config),
      },
      timeout: 120_000,
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
function findAssetDir(outdir: string): string {
  const entries = fs.readdirSync(outdir).filter(e => e.startsWith('asset.'));
  if (entries.length !== 1) {
    throw new Error(`Expected exactly 1 asset directory, found ${entries.length}: ${entries.join(', ')}`);
  }
  return path.join(outdir, entries[0]);
}

/**
 * Returns all files in the asset directory (relative paths).
 */
function assetFiles(outdir: string): string[] {
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
