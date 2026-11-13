import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { App, AssetStaging, DockerImage, Stack, Stage } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { BUNDLING_STACKS } from 'aws-cdk-lib/cx-api';
import { PythonFunction, PythonLayerVersion } from '../lib';

let directory: string;
let entry: string;

beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'python-skipped-bundling-'));
  entry = path.join(directory, 'src');
  fs.mkdirSync(path.join(entry, 'example.egg-info'), { recursive: true });
  fs.mkdirSync(path.join(entry, 'nested', 'other.egg-info'), { recursive: true });
  fs.mkdirSync(path.join(entry, '.venv'), { recursive: true });
  fs.writeFileSync(path.join(entry, 'index.py'), 'def handler(event, context): return "ok"');
  fs.writeFileSync(path.join(entry, 'index.pyc'), 'compiled');
  fs.writeFileSync(path.join(entry, 'example.egg-info', 'PKG-INFO'), 'metadata');
  fs.writeFileSync(path.join(entry, 'nested', 'other.egg-info', 'PKG-INFO'), 'metadata');
  fs.writeFileSync(path.join(entry, 'nested', 'keep.py'), '# keep');
  fs.writeFileSync(path.join(entry, '.venv', 'config'), 'environment');
});

afterEach(() => {
  jest.restoreAllMocks();
  fs.rmSync(directory, { recursive: true, force: true });
  AssetStaging.clearAssetHashCache();
});

test('selecting stacks exclusively does not change the selected function asset', () => {
  jest.spyOn(DockerImage, 'fromBuild').mockReturnValue(new DockerImage('python-bundling-test'));
  // Stub only the container execution; asset staging and hashing remain real.
  jest.spyOn(DockerImage.prototype, 'run').mockImplementation((options) => {
    const output = options?.volumes?.find(volume => volume.containerPath === AssetStaging.BUNDLING_OUTPUT_DIR)?.hostPath;
    if (!output) {
      throw new Error('missing bundling output volume');
    }
    fs.copyFileSync(path.join(entry, 'index.py'), path.join(output, 'index.py'));
  });
  const selectedHash = (id: string, patterns: string[]) => {
    const app = new App({ outdir: path.join(directory, id), context: { [BUNDLING_STACKS]: patterns } });
    let hash = '';
    for (const name of ['prod', 'dev']) {
      const stage = new Stage(app, name);
      const stack = new Stack(stage, 'Service');
      const resource = new PythonFunction(stack, 'Handler', {
        entry,
        runtime: Runtime.PYTHON_3_12,
        bundling: { assetExcludes: ['*.egg-info'] },
      });
      if (name === 'dev') {
        expect(stack.bundlingRequired).toBe(true);
        const staging = resource.node.findChild('Code').node.findChild('Stage') as AssetStaging;
        hash = staging.assetHash;
        expect(fs.readdirSync(staging.absoluteStagedPath)).toEqual(['index.py']);
      }
    }
    return hash;
  };
  expect(selectedHash('exclusive', ['dev/*'])).toBe(selectedHash('all', ['**']));
});

test.each(['function', 'layer'])('skipped %s staging respects assetExcludes', (kind) => {
  const app = new App({ outdir: path.join(directory, 'out'), context: { [BUNDLING_STACKS]: ['dev/*'] } });
  const stage = new Stage(app, 'prod');
  const stack = new Stack(stage, 'Service');
  expect(stack.bundlingRequired).toBe(false);
  const bundling = { assetExcludes: ['*.egg-info', '.venv'] };
  const resource = kind === 'function'
    ? new PythonFunction(stack, 'Handler', { entry, runtime: Runtime.PYTHON_3_12, bundling })
    : new PythonLayerVersion(stack, 'Layer', { entry, compatibleRuntimes: [Runtime.PYTHON_3_12], bundling });
  const staging = resource.node.findChild('Code').node.findChild('Stage') as AssetStaging;
  const staged = staging.absoluteStagedPath;
  expect(fs.readFileSync(path.join(staged, 'index.py'), 'utf8')).toContain('def handler');
  expect(fs.existsSync(path.join(staged, 'nested', 'keep.py'))).toBe(true);
  for (const excluded of ['example.egg-info', 'nested/other.egg-info', '.venv', 'index.pyc']) {
    expect(fs.existsSync(path.join(staged, excluded))).toBe(false);
  }
  expect(bundling.assetExcludes).toEqual(['*.egg-info', '.venv']);
});

test.each([undefined, []])('skipped staging with assetExcludes=%s preserves source files and default exclusions', (assetExcludes) => {
  const app = new App({ outdir: path.join(directory, 'out'), context: { [BUNDLING_STACKS]: [] } });
  const stack = new Stack(app, 'Service');
  const resource = new PythonFunction(stack, 'Handler', { entry, runtime: Runtime.PYTHON_3_12, bundling: { assetExcludes } });
  const staging = resource.node.findChild('Code').node.findChild('Stage') as AssetStaging;
  expect(fs.existsSync(path.join(staging.absoluteStagedPath, 'example.egg-info', 'PKG-INFO'))).toBe(true);
  expect(fs.existsSync(path.join(staging.absoluteStagedPath, 'index.pyc'))).toBe(false);
});

test('skipped staging hashes ignore excluded changes but include source changes', () => {
  const stageAsset = (id: string) => {
    AssetStaging.clearAssetHashCache();
    const app = new App({ outdir: path.join(directory, id), context: { [BUNDLING_STACKS]: [] } });
    const stack = new Stack(app, 'Service');
    const resource = new PythonFunction(stack, 'Handler', {
      entry,
      runtime: Runtime.PYTHON_3_12,
      bundling: { assetExcludes: ['*.egg-info'] },
    });
    return (resource.node.findChild('Code').node.findChild('Stage') as AssetStaging).assetHash;
  };
  const original = stageAsset('original');
  fs.writeFileSync(path.join(entry, 'example.egg-info', 'PKG-INFO'), 'changed excluded metadata');
  expect(stageAsset('excluded-change')).toBe(original);
  fs.writeFileSync(path.join(entry, 'index.py'), 'def handler(event, context): return "changed"');
  expect(stageAsset('source-change')).not.toBe(original);
});
