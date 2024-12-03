import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudAssemblyBuilder } from '@aws-cdk/cx-api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from '@jest/globals';
import { WorkGraph } from '../lib/util/work-graph';
import { WorkGraphBuilder } from '../lib/util/work-graph-builder';
import { AssetBuildNode, AssetPublishNode, StackNode, WorkNode } from '../lib/util/work-graph-types';

let rootBuilder: CloudAssemblyBuilder;
beforeEach(() => {
  rootBuilder = new CloudAssemblyBuilder();
});

afterEach(() => {
  rootBuilder.delete();
});

function superset<A>(xs: A[]): Set<A> {
  const ret = new Set(xs);
  (ret as any).isSuperset = true;
  return ret;
}

expect.addEqualityTesters([
  function(exp: unknown, act: unknown): boolean | undefined {
    if (exp instanceof Set && isIterable(act)) {
      if ((exp as any).isSuperset) {
        const actSet = new Set(act);
        return Array.from(exp as any).every((x) => actSet.has(x));
      }
      return this.equals(Array.from(exp).sort(), Array.from(act).sort());
    }
    return undefined;
  },
]);

describe('with some stacks and assets', () => {
  let assembly: cxapi.CloudAssembly;
  beforeEach(() => {
    addSomeStacksAndAssets(rootBuilder);
    assembly = rootBuilder.buildAssembly();
  });

  test('stack depends on the asset publishing step', () => {
    const graph = new WorkGraphBuilder(true).build(assembly.artifacts);

    expect(assertableNode(graph.node('stack2'))).toEqual(expect.objectContaining({
      type: 'stack',
      dependencies: superset(['publish-F1-add54bdbcb']),
    } as Partial<StackNode>));
  });

  test('asset publishing step depends on asset building step', () => {
    const graph = new WorkGraphBuilder(true).build(assembly.artifacts);

    expect(graph.node('publish-F1-add54bdbcb')).toEqual(expect.objectContaining({
      type: 'asset-publish',
      dependencies: superset(['build-F1-a533139934']),
    } satisfies Partial<AssetPublishNode>));
  });

  test('with prebuild off, asset building inherits dependencies from their parent stack', () => {
    const graph = new WorkGraphBuilder(false).build(assembly.artifacts);

    expect(graph.node('build-F1-a533139934')).toEqual(expect.objectContaining({
      type: 'asset-build',
      dependencies: superset(['stack0', 'stack1']),
    } as Partial<AssetBuildNode>));
  });

  test('with prebuild on, assets only have their own dependencies', () => {
    const graph = new WorkGraphBuilder(true).build(assembly.artifacts);

    expect(graph.node('build-F1-a533139934')).toEqual(expect.objectContaining({
      type: 'asset-build',
      dependencies: superset(['stack0']),
    } as Partial<AssetBuildNode>));
  });
});

test('tree metadata is ignored', async () => {
  rootBuilder.addArtifact('tree', {
    type: cxschema.ArtifactType.CDK_TREE,
    properties: {
      file: 'doesnotexist.json',
    } as cxschema.TreeArtifactProperties,
  });

  const assembly = rootBuilder.buildAssembly();

  const graph = new WorkGraphBuilder(true).build(assembly.artifacts);
  expect(graph.ready().length).toEqual(0);
});

test('can handle nested assemblies', async () => {
  addSomeStacksAndAssets(rootBuilder);
  const nested = rootBuilder.createNestedAssembly('nested', 'Nested Assembly');
  addSomeStacksAndAssets(nested);
  nested.buildAssembly();

  const assembly = rootBuilder.buildAssembly();

  let workDone = 0;
  const graph = new WorkGraphBuilder(true).build(assembly.artifacts);

  await graph.doParallel(10, {
    deployStack: async () => { workDone += 1; },
    buildAsset: async () => { },
    publishAsset: async () => { workDone += 1; },
  });

  // The asset is shared between parent assembly and nested assembly, but the stacks will be deployed
  // 3 stacks + 1 asset + 3 stacks (1 reused asset)
  expect(workDone).toEqual(7);
});

test('dependencies on unselected artifacts are silently ignored', async () => {
  addStack(rootBuilder, 'stackA', {
    environment: 'aws://222222/us-east-1',
  });
  addStack(rootBuilder, 'stackB', {
    dependencies: ['stackA'],
    environment: 'aws://222222/us-east-1',
  });

  const asm = rootBuilder.buildAssembly();
  const graph = new WorkGraphBuilder(true).build([asm.getStackArtifact('stackB')]);
  expect(graph.ready()[0]).toEqual(expect.objectContaining({
    id: 'stackB',
    dependencies: new Set(),
  }));
});

describe('tests that use assets', () => {
  const files = {
    // Referencing an existing file on disk is important here.
    // It means these two assets will have the same AssetManifest
    // and the graph will merge the two into a single asset.
    'work-graph-builder.test.js': {
      source: { path: __dirname },
      destinations: {
        D1: { bucketName: 'bucket', objectKey: 'key' },
      },
    },
  };
  const environment = 'aws://11111/us-east-1';

  test('assets with shared contents between dependant stacks', async () => {
    addStack(rootBuilder, 'StackA', {
      environment: 'aws://11111/us-east-1',
      dependencies: ['StackA.assets'],
    });
    addAssets(rootBuilder, 'StackA.assets', { files });

    addStack(rootBuilder, 'StackB', {
      environment: 'aws://11111/us-east-1',
      dependencies: ['StackB.assets', 'StackA'],
    });
    addAssets(rootBuilder, 'StackB.assets', { files });

    const assembly = rootBuilder.buildAssembly();

    const graph = new WorkGraphBuilder(true).build(assembly.artifacts);
    const traversal = await traverseAndRecord(graph);

    expect(traversal).toEqual([
      expect.stringMatching(/^build-work-graph-builder.test.js-.*$/),
      expect.stringMatching(/^publish-work-graph-builder.test.js-.*$/),
      'StackA',
      'StackB',
    ]);
  });

  test('a more complex way to make a cycle', async () => {
    // A -> B -> C | A and C share an asset. The asset will have a dependency on B, that is not a *direct* reverse dependency, and will cause a cycle.
    addStack(rootBuilder, 'StackA', { environment, dependencies: ['StackA.assets', 'StackB'] });
    addAssets(rootBuilder, 'StackA.assets', { files });

    addStack(rootBuilder, 'StackB', { environment, dependencies: ['StackC'] });

    addStack(rootBuilder, 'StackC', { environment, dependencies: ['StackC.assets'] });
    addAssets(rootBuilder, 'StackC.assets', { files });

    const assembly = rootBuilder.buildAssembly();
    const graph = new WorkGraphBuilder(true).build(assembly.artifacts);

    // THEN
    expect(graph.findCycle()).toBeUndefined();
  });

  test('the same asset to different destinations is only built once', async () => {
    addStack(rootBuilder, 'StackA', {
      environment: 'aws://11111/us-east-1',
      dependencies: ['StackA.assets'],
    });
    addAssets(rootBuilder, 'StackA.assets', {
      files: {
        abcdef: {
          source: { path: __dirname },
          destinations: {
            D1: { bucketName: 'bucket1', objectKey: 'key' },
            D2: { bucketName: 'bucket2', objectKey: 'key' },
          },
        },
      },
    });

    addStack(rootBuilder, 'StackB', {
      environment: 'aws://11111/us-east-1',
      dependencies: ['StackB.assets', 'StackA'],
    });
    addAssets(rootBuilder, 'StackB.assets', {
      files: {
        abcdef: {
          source: { path: __dirname },
          destinations: {
            D3: { bucketName: 'bucket3', objectKey: 'key' },
          },
        },
      },
    });

    const assembly = rootBuilder.buildAssembly();

    const graph = new WorkGraphBuilder(true).build(assembly.artifacts);
    const traversal = await traverseAndRecord(graph);

    expect(traversal).toEqual([
      expect.stringMatching(/^build-abcdef-.*$/),
      expect.stringMatching(/^publish-abcdef-.*$/),
      expect.stringMatching(/^publish-abcdef-.*$/),
      'StackA',
      expect.stringMatching(/^publish-abcdef-.*$/),
      'StackB',
    ]);
  });

  test('different parameters for the same named definition are both published', async () => {
    addStack(rootBuilder, 'StackA', {
      environment: 'aws://11111/us-east-1',
      dependencies: ['StackA.assets'],
    });
    addAssets(rootBuilder, 'StackA.assets', {
      files: {
        abcdef: {
          source: { path: __dirname },
          destinations: {
            D: { bucketName: 'bucket1', objectKey: 'key' },
          },
        },
      },
    });

    addStack(rootBuilder, 'StackB', {
      environment: 'aws://11111/us-east-1',
      dependencies: ['StackB.assets', 'StackA'],
    });
    addAssets(rootBuilder, 'StackB.assets', {
      files: {
        abcdef: {
          source: { path: __dirname },
          destinations: {
            D: { bucketName: 'bucket2', objectKey: 'key' },
          },
        },
      },
    });

    const assembly = rootBuilder.buildAssembly();

    const graph = new WorkGraphBuilder(true).build(assembly.artifacts);
    const traversal = await traverseAndRecord(graph);

    expect(traversal).toEqual([
      expect.stringMatching(/^build-abcdef-.*$/),
      expect.stringMatching(/^publish-abcdef-.*$/),
      'StackA',
      expect.stringMatching(/^publish-abcdef-.*$/),
      'StackB',
    ]);
  });
});

/**
 * Write an asset manifest file and add it to the assembly builder
 */
function addAssets(
  builder: CloudAssemblyBuilder,
  artifactId: string,
  options: { files: Record<string, cxschema.FileAsset>; dependencies?: string[] },
) {
  const manifestFile = `${artifactId}.json`;
  const outPath = path.join(builder.outdir, manifestFile);

  const manifest: cxschema.AssetManifest = {
    version: cxschema.Manifest.version(),
    files: options.files,
  };

  fs.writeFileSync(outPath, JSON.stringify(manifest, undefined, 2));

  builder.addArtifact(artifactId, {
    type: cxschema.ArtifactType.ASSET_MANIFEST,
    dependencies: options.dependencies,
    properties: {
      file: manifestFile,
    } as cxschema.AssetManifestProperties,
  });
}

/**
 * Add a stack to the cloud assembly
 */
function addStack(builder: CloudAssemblyBuilder, stackId: string, options: { environment: string; dependencies?: string[] }) {
  const templateFile = `${stackId}.template.json`;
  const outPath = path.join(builder.outdir, templateFile);
  fs.writeFileSync(outPath, JSON.stringify({}, undefined, 2));

  builder.addArtifact(stackId, {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    dependencies: options.dependencies,
    environment: options.environment,
    properties: {
      templateFile,
    },
  });
}

function addSomeStacksAndAssets(builder: CloudAssemblyBuilder) {
  addStack(builder, 'stack0', {
    environment: 'aws://11111/us-east-1',
  });
  addAssets(builder, 'stack2assets', {
    dependencies: ['stack0'],
    files: {
      F1: {
        source: { path: 'xyz' },
        destinations: {
          D1: { bucketName: 'bucket', objectKey: 'key' },
        },
      },
    },
  });
  addStack(builder, 'stack1', {
    environment: 'aws://11111/us-east-1',
  });
  addStack(builder, 'stack2', {
    environment: 'aws://11111/us-east-1',
    dependencies: ['stack2assets', 'stack1'],
  });
}

/**
 * We can't do arrayContaining on the set that a Node has, so convert it to an array for asserting
 */
function assertableNode<A extends WorkNode>(x: A) {
  return {
    ...x,
    dependencies: Array.from(x.dependencies),
  };
}

async function traverseAndRecord(graph: WorkGraph) {
  const ret: string[] = [];
  await graph.doParallel(1, {
    deployStack: async (node) => { ret.push(node.id); },
    buildAsset: async (node) => { ret.push(node.id); },
    publishAsset: async (node) => { ret.push(node.id); },
  });
  return ret;
}

function isIterable(x: unknown): x is Iterable<any> {
  return x && typeof x === 'object' && (x as any)[Symbol.iterator];
}
