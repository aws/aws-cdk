import * as fs from 'fs';
import * as path from 'path';
import type { TestProject } from './bundling-e2e-helpers';
import {
  assetFiles,
  cdkSynth,
  createProject,
  findAssetDir,
} from './bundling-e2e-helpers';
import { OutputFormat } from '../../lib';

// Increase timeout — Docker bundling can take a while
jest.setTimeout(3_000_000);

// These tests do not depend on local vs. Docker bundling, so they only run locally.
const pkgManager = 'npm';
const forceDockerBundling = false;

let project: TestProject;
afterEach(() => project?.cleanup());

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
