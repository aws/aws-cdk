import * as path from 'path';
import type { TestProject } from './bundling-e2e-helpers';
import {
  assetFiles,
  cdkSynth,
  createProject,
  describeDockerSuite,
  describePackageManagerSuite,
  findAssetDir,
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
});
