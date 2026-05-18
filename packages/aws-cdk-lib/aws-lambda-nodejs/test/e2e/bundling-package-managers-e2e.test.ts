import * as fs from 'fs';
import * as path from 'path';
import type { TestProject } from './bundling-e2e-helpers';
import {
  assetFiles,
  cdkSynth,
  createProject,
  describeDockerSuite,
  describePackageManagerSuite,
  findAssetDir,
  localPkgManagers,
  PNPM_LOCK_WITH_DELAY,
  TS_HANDLER_WITH_DELAY,
} from './bundling-e2e-helpers';

// Increase timeout — Docker bundling can take a while
jest.setTimeout(3_000_000);

let project: TestProject;
afterEach(() => project?.cleanup());

describeDockerSuite((forceDockerBundling) => {
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

  // Regression test for https://github.com/aws/aws-cdk/issues/37898
  const describePnpmOrSkip = (!forceDockerBundling && !localPkgManagers.pnpm)
    ? describe.skip
    : describe;

  describePnpmOrSkip('pnpm-specific', () => {
    test('beforeInstall writes to pnpm-workspace.yaml survive CDK workspace setup', () => {
      project = createProject('pnpm', '.ts');
      fs.writeFileSync(project.entryFile, TS_HANDLER_WITH_DELAY);
      fs.writeFileSync(path.join(project.dir, 'package.json'), JSON.stringify({
        name: 'test', version: '1.0.0', dependencies: { delay: '5.0.0' },
      }));
      fs.writeFileSync(path.join(project.dir, 'pnpm-lock.yaml'), PNPM_LOCK_WITH_DELAY);

      cdkSynth(project, {
        entry: project.entryFile,
        bundling: {
          forceDockerBundling,
          nodeModules: ['delay'],
          commandHooks: {
            beforeBundling: [],
            afterBundling: [],
            beforeInstall: ['echo allowBuilds: > {outputDir}/pnpm-workspace.yaml'],
          },
        },
      });

      const workspaceYaml = fs.readFileSync(
        path.join(findAssetDir(project.outdir), 'pnpm-workspace.yaml'),
        'utf-8',
      );
      expect(workspaceYaml).toContain('allowBuilds');
    });
  });
});
