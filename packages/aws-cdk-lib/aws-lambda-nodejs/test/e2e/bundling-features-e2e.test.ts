import * as fs from 'fs';
import * as path from 'path';
import { performance } from 'perf_hooks';
import type {
  PackageManager,
  TestProject,
} from './bundling-e2e-helpers';
import {
  LOCK_FILES,
  MONOREPO_NODE_MODULES,
  NPM_LOCK_WITH_DELAY,
  TS_HANDLER_WITH_DELAY,
  assetFiles,
  cdkSynth,
  createProject,
  describeDockerSuite,
  findAssetDir,
} from './bundling-e2e-helpers';
import { PERF_COUNTERS_FILE_ENV } from '../../../cx-api/lib/cxapi';

// Increase timeout — Docker bundling can take a while
jest.setTimeout(3_000_000);

let project: TestProject;
beforeEach(() => {
  performance.clearMeasures();
});
afterEach(() => project?.cleanup());

describeDockerSuite((forceDockerBundling) => {
  // Tests that [we believe] do not depend on the package manager in use
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
        target: 'ES2020',
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

  test('performance counters are emitted', () => {
    project = createProject(pkgManager, '.ts');

    // The CLI writes perf counters to 'performance-counters.json' in the output
    // directory. We set the env var to the same path for older CLI versions that
    // pass through the env var instead of setting their own.
    const countersFile = path.join(project.outdir, 'performance-counters.json');
    process.env[PERF_COUNTERS_FILE_ENV] = countersFile;
    try {
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
        context: {
          // If we don't set this, direct esbuild invocations are too fast to get emitted
          '@aws-cdk/core.slowSynthThreshold': '0',
        },
      });

      // If beforeBundling failed, cdk synth would have failed (commands are chained with &&)
      const counters = JSON.parse(fs.readFileSync(countersFile, 'utf-8')).counters;

      if (forceDockerBundling) {
        // Docker bundling has 2 counters: build the docker image, then run the docker image.
        // A single counter should encompass both of them.
        expect(counters).toMatchObject({
          'bundle:NodejsFunction': expect.anything(),
          'bundle:NodejsFunction(cnt)': 1,
          'DockerImage.fromBuild': expect.anything(),
          'AssetBundlingBindMount.run': expect.anything(),
        });

        expect(counters['bundle:NodejsFunction']).toBeGreaterThanOrEqual(counters['DockerImage.fromBuild'] + counters['AssetBundlingBindMount.run']);
      } else {
        // Local bundling has 1 counter: do the bundling
        expect(counters).toMatchObject({
          'bundle:NodejsFunction': expect.anything(),
          'bundle:NodejsFunction(cnt)': 1,
          'NodejsFunction#tryBundle': expect.anything(),
        });

        expect(counters['bundle:NodejsFunction']).toBeGreaterThanOrEqual(counters['NodejsFunction#tryBundle']);
      }
    } finally {
      delete process.env[PERF_COUNTERS_FILE_ENV];
    }
  });
});
