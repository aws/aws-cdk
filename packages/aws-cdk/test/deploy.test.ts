import * as cxapi from '@aws-cdk/cx-api';
import { deployArtifacts } from '../lib/deploy';
import { AssetBuildNode, AssetPublishNode, StackNode } from '../lib/util/work-graph-types';

const ASSET_MANIFEST_ARTIFACT_SYM = Symbol.for('@aws-cdk/cx-api.AssetManifestArtifact');
const CLOUDFORMATION_STACK_ARTIFACT_SYM = Symbol.for('@aws-cdk/cx-api.CloudFormationStackArtifact');

type Artifact = cxapi.CloudArtifact;
type Stack = cxapi.CloudFormationStackArtifact;
type Asset = cxapi.AssetManifestArtifact;

const sleep = async (duration: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), duration));

// Not great to have actual sleeps in the tests, but they mostly just exist to give the async workflow
// a chance to start new tasks.
const SLOW = 200;

/**
 * Repurposing unused stack attributes to create specific test scenarios
 * - stack.name          = deployment duration
 * - stack.displayName   = error message
 */
describe('DeployAssets', () => {
  const actionedAssets: string[] = [];
  const callbacks = {
    deployStack: async (x: StackNode) => {
      const errorMessage = x.stack.displayName;
      const timeout = Number(x.stack.name) || 0;

      await sleep(timeout);

      if (errorMessage) {
        throw Error(errorMessage);
      }

      actionedAssets.push(x.id);
    },
    buildAsset: async({ id }: AssetBuildNode) => {
      actionedAssets.push(id);
    },
    publishAsset: async({ id }: AssetPublishNode) => {
      actionedAssets.push(id);
    },
  };

  beforeEach(() => {
    actionedAssets.splice(0);
  });

  // Success
  test.each([
    // Concurrency 1
    { scenario: 'No Stacks', concurrency: 1, toDeploy: [], expected: [] },
    { scenario: 'A', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }]), expected: ['A'] },
    { scenario: 'A, B', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack' }]), expected: ['A', 'B'] },
    { scenario: 'A -> B', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack', stackDependencies: ['A'] }]), expected: ['A', 'B'] },
    { scenario: '[unsorted] A -> B', concurrency: 1, toDeploy: createArtifacts([{ id: 'B', type: 'stack', stackDependencies: ['A'] }, { id: 'A', type: 'stack' }]), expected: ['A', 'B'] },
    { scenario: 'A -> B -> C', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack', stackDependencies: ['A'] }, { id: 'C', type: 'stack', stackDependencies: ['B'] }]), expected: ['A', 'B', 'C'] },
    { scenario: 'A -> B, A -> C', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack', stackDependencies: ['A'] }, { id: 'C', type: 'stack', stackDependencies: ['A'] }]), expected: ['A', 'B', 'C'] },
    {
      scenario: 'A (slow), B',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', name: SLOW },
        { id: 'B', type: 'stack' },
      ]),
      expected: ['A', 'B'],
    },
    {
      scenario: 'A -> B, C -> D',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack' },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
        { id: 'C', type: 'stack' },
        { id: 'D', type: 'stack', stackDependencies: ['C'] },
      ]),
      expected: ['A', 'C', 'B', 'D'],
    },
    {
      scenario: 'A (slow) -> B, C -> D',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', name: SLOW },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
        { id: 'C', type: 'stack' },
        { id: 'D', type: 'stack', stackDependencies: ['C'] },
      ]),
      expected: ['A', 'C', 'B', 'D'],
    },
    // With Assets
    {
      scenario: 'A -> a',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', assetDependencies: ['a'] },
        { id: 'a', type: 'asset' },
      ]),
      expected: ['a-build', 'a-publish', 'A'],
    },
    {
      scenario: 'A -> [a, B]',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', stackDependencies: ['B'], assetDependencies: ['a'] },
        { id: 'B', type: 'stack' },
        { id: 'a', type: 'asset', name: SLOW },
      ]),
      expected: ['B', 'a-build', 'a-publish', 'A'],
    },
    {
      scenario: 'A -> a, B -> b',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', assetDependencies: ['a'] },
        { id: 'B', type: 'stack', assetDependencies: ['b'] },
        { id: 'a', type: 'asset' },
        { id: 'b', type: 'asset' },
      ]),
      expected: ['a-build', 'b-build', 'a-publish', 'b-publish', 'A', 'B'],
    },
    {
      scenario: 'A, B -> b -> A',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack' },
        { id: 'B', type: 'stack', assetDependencies: ['b'] },
        { id: 'b', type: 'asset', stackDependencies: ['A'] },
      ]),
      expected: ['A', 'b-build', 'b-publish', 'B'],
    },

    // Concurrency 2
    { scenario: 'No Stacks', concurrency: 2, toDeploy: [], expected: [] },
    { scenario: 'A', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }]), expected: ['A'] },
    { scenario: 'A, B', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack' }]), expected: ['A', 'B'] },
    { scenario: 'A -> B', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack', stackDependencies: ['A'] }]), expected: ['A', 'B'] },
    { scenario: '[unsorted] A -> B', concurrency: 2, toDeploy: createArtifacts([{ id: 'B', type: 'stack', stackDependencies: ['A'] }, { id: 'A', type: 'stack' }]), expected: ['A', 'B'] },
    { scenario: 'A -> B -> C', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack', stackDependencies: ['A'] }, { id: 'C', type: 'stack', stackDependencies: ['B'] }]), expected: ['A', 'B', 'C'] },
    { scenario: 'A -> B, A -> C', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack', stackDependencies: ['A'] }, { id: 'C', type: 'stack', stackDependencies: ['A'] }]), expected: ['A', 'B', 'C'] },
    {
      scenario: 'A, B',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', name: SLOW },
        { id: 'B', type: 'stack' },
      ]),
      expected: ['B', 'A'],
    },
    {
      scenario: 'A -> B, C -> D',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack' },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
        { id: 'C', type: 'stack' },
        { id: 'D', type: 'stack', stackDependencies: ['C'] },
      ]),
      expected: ['A', 'C', 'B', 'D'],
    },
    {
      scenario: 'A (slow) -> B, C -> D',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', name: SLOW },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
        { id: 'C', type: 'stack' },
        { id: 'D', type: 'stack', stackDependencies: ['C'] },
      ]),
      expected: ['C', 'D', 'A', 'B'],
    },
    {
      scenario: 'A -> B, A not selected',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
      ]),
      expected: ['B'],
    },
    // With Assets
    {
      scenario: 'A -> a',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', assetDependencies: ['a'] },
        { id: 'a', type: 'asset' },
      ]),
      expected: ['a-build', 'a-publish', 'A'],
    },
    {
      scenario: 'A -> [a, B]',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', stackDependencies: ['B'], assetDependencies: ['a'] },
        { id: 'B', type: 'stack', name: SLOW },
        { id: 'a', type: 'asset' },
      ]),
      expected: ['a-build', 'a-publish', 'B', 'A'],
    },
    {
      scenario: 'A -> a, B -> b',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', assetDependencies: ['a'] },
        { id: 'B', type: 'stack', assetDependencies: ['b'] },
        { id: 'a', type: 'asset' },
        { id: 'b', type: 'asset' },
      ]),
      expected: ['a-build', 'b-build', 'a-publish', 'b-publish', 'A', 'B'],
    },
    {
      scenario: 'A, B -> b -> A',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack' },
        { id: 'B', type: 'stack', assetDependencies: ['b'] },
        { id: 'b', type: 'asset', stackDependencies: ['A'] },
      ]),
      expected: ['A', 'b-build', 'b-publish', 'B'],
    },
    {
      scenario: 'A, B -> [b, c], b -> A',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', name: SLOW },
        { id: 'B', type: 'stack', assetDependencies: ['b', 'c'] },
        { id: 'b', type: 'asset', stackDependencies: ['A'] },
        { id: 'c', type: 'asset' },
      ]),
      expected: ['c-build', 'c-publish', 'A', 'b-build', 'b-publish', 'B'],
    },
  ])('Success - Concurrency: $concurrency - $scenario', async ({ concurrency, expected, toDeploy }) => {
    await expect(deployArtifacts(toDeploy, { concurrency, callbacks, prebuildAssets: true })).resolves.toBeUndefined();

    expect(actionedAssets).toStrictEqual(expected);
  });

  // Failure
  test.each([
    // Concurrency 1
    { scenario: 'A (error)', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack', displayName: 'A' }]), expectedError: 'A', expectedStacks: [] },
    { scenario: 'A (error), B', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack', displayName: 'A' }, { id: 'B', type: 'stack' }]), expectedError: 'A', expectedStacks: [] },
    { scenario: 'A, B (error)', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack', displayName: 'B' }]), expectedError: 'B', expectedStacks: ['A'] },
    { scenario: 'A (error) -> B', concurrency: 1, toDeploy: createArtifacts([{ id: 'A', type: 'stack', displayName: 'A' }, { id: 'B', type: 'stack', stackDependencies: ['A'] }]), expectedError: 'A', expectedStacks: [] },
    { scenario: '[unsorted] A (error) -> B', concurrency: 1, toDeploy: createArtifacts([{ id: 'B', type: 'stack', stackDependencies: ['A'] }, { id: 'A', type: 'stack', displayName: 'A' }]), expectedError: 'A', expectedStacks: [] },
    {
      scenario: 'A (error) -> B, C -> D',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', displayName: 'A' },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
        { id: 'C', type: 'stack' },
        { id: 'D', type: 'stack', stackDependencies: ['C'] },
      ]),
      expectedError: 'A',
      expectedStacks: [],
    },
    {
      scenario: 'A -> B, C (error) -> D',
      concurrency: 1,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack' },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
        { id: 'C', type: 'stack', displayName: 'C', name: SLOW },
        { id: 'D', type: 'stack', stackDependencies: ['C'] },
      ]),
      expectedError: 'C',
      expectedStacks: ['A'],
    },

    // Concurrency 2
    { scenario: 'A (error)', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack', displayName: 'A' }]), expectedError: 'A', expectedStacks: [] },
    { scenario: 'A (error), B', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack', displayName: 'A' }, { id: 'B', type: 'stack' }]), expectedError: 'A', expectedStacks: ['B'] },
    { scenario: 'A, B (error)', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack' }, { id: 'B', type: 'stack', displayName: 'B' }]), expectedError: 'B', expectedStacks: ['A'] },
    { scenario: 'A (error) -> B', concurrency: 2, toDeploy: createArtifacts([{ id: 'A', type: 'stack', displayName: 'A' }, { id: 'B', type: 'stack', stackDependencies: ['A'] }]), expectedError: 'A', expectedStacks: [] },
    { scenario: '[unsorted] A (error) -> B', concurrency: 2, toDeploy: createArtifacts([{ id: 'B', type: 'stack', stackDependencies: ['A'] }, { id: 'A', type: 'stack', displayName: 'A' }]), expectedError: 'A', expectedStacks: [] },
    {
      scenario: 'A (error) -> B, C -> D',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', displayName: 'A' },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
        { id: 'C', type: 'stack' },
        { id: 'D', type: 'stack', stackDependencies: ['C'] },
      ]),
      expectedError: 'A',
      expectedStacks: ['C'],
    },
    {
      scenario: 'A -> B, C (error) -> D',
      concurrency: 2,
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack' },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
        { id: 'C', type: 'stack', displayName: 'C', name: SLOW },
        { id: 'D', type: 'stack', stackDependencies: ['C'] },
      ]),
      expectedError: 'C',
      expectedStacks: ['A', 'B'],
    },
  ])('Failure - Concurrency: $concurrency - $scenario', async ({ concurrency, expectedError, toDeploy, expectedStacks }) => {
    // eslint-disable-next-line max-len
    await expect(deployArtifacts(toDeploy, { concurrency, callbacks, prebuildAssets: true })).rejects.toThrowError(expectedError);

    expect(actionedAssets).toStrictEqual(expectedStacks);
  });

  test('Can disable prebuild assets', async () => {
    const toDeploy = createArtifacts([
      { id: 'A', type: 'stack', name: SLOW },
      { id: 'B', type: 'stack', stackDependencies: ['A'], assetDependencies: ['b'] },
      { id: 'b', type: 'asset' },
    ]);
    await expect(deployArtifacts(toDeploy, { concurrency: 2, callbacks, prebuildAssets: false })).resolves.toBeUndefined();

    // asset build waits for slow stack A deployment
    expect(actionedAssets).toStrictEqual(['A', 'b-build', 'b-publish', 'B']);
  });
});

interface TestArtifact {
  stackDependencies?: string[];
  assetDependencies?: string[];
  id: string;
  type: 'stack' | 'asset';
  name?: number;
  displayName?: string;
}

function createArtifact(artifact: TestArtifact): Artifact {
  const stackDeps: Artifact[] = artifact.stackDependencies?.map((id) => createArtifact({ id, type: 'stack' })) ?? [];
  const assetDeps: Artifact[] = artifact.assetDependencies?.map((id) => createArtifact({ id, type: 'asset' })) ?? [];

  const art = {
    id: artifact.id,
    dependencies: stackDeps.concat(assetDeps),
    name: artifact.name,
    displayName: artifact.displayName,
  };
  if (artifact.type === 'stack') {
    return {
      ...art,
      [CLOUDFORMATION_STACK_ARTIFACT_SYM]: true,
    } as unknown as Stack;
  } else {
    return {
      ...art,
      [ASSET_MANIFEST_ARTIFACT_SYM]: true,
    } as unknown as Asset;
  }
}

function createArtifacts(artifacts: TestArtifact[]): Artifact[] {
  return artifacts.map((art) => createArtifact(art));
}
