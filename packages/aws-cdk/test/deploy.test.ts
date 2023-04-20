/* eslint-disable import/order */
import * as cxapi from '@aws-cdk/cx-api';
import { deployArtifacts } from '../lib/deploy';
import { WorkNode } from '../lib/util/work-graph';

type Artifact = cxapi.CloudArtifact;
type Stack = cxapi.CloudFormationStackArtifact;
type Asset = cxapi.AssetManifestArtifact;

const sleep = async (duration: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), duration));

// Not great to have actual sleeps in the tests, but they mostly just exist to give 'p-queue'
// a chance to start new tasks.
const SLOW = 200;

/**
 * Repurposing unused stack attributes to create specific test scenarios
 * - stack.name          = deployment duration
 * - stack.displayName   = error message
 */
describe('DeployStacks', () => {
  const deployedStacks: string[] = [];
  const deployStack = async ({ id, displayName, name }: Stack) => {
    const errorMessage = displayName;
    const timeout = Number(name) || 0;

    await sleep(timeout);

    if (errorMessage) {
      throw Error(errorMessage);
    }

    deployedStacks.push(id);
  };
  const builtAssets: string[] = [];
  const buildAsset = async({ id }: WorkNode) => {
    builtAssets.push(id);
  };
  const publishedAssets: string[] = [];
  const publishAsset = async({ id }: WorkNode) => {
    publishedAssets.push(id);
  };

  beforeEach(() => {
    deployedStacks.splice(0);
  });

  test('kaizen test', async () => {
    const ASSET_MANIFEST_ARTIFACT_SYM = Symbol.for('@aws-cdk/cx-api.AssetManifestArtifact');
    const asset = { id: 'AssetA', dependencies: [], [ASSET_MANIFEST_ARTIFACT_SYM]: true } as unknown as Asset;
    const assetB = { id: 'AssetB', dependencies: [], [ASSET_MANIFEST_ARTIFACT_SYM]: true } as unknown as Asset;
    const stack = { id: 'StackA', dependencies: [asset] } as unknown as Stack;
    const stackB = { id: 'StackB', dependencies: [assetB, stack] } as unknown as Stack;
    // eslint-disable-next-line max-len
    await expect(deployArtifacts([stack, asset, stackB, assetB] as Artifact[], { concurrency: 1, deployStack, buildAsset, publishAsset })).resolves.toBeUndefined();

    expect(deployedStacks).toStrictEqual('a');
  });

  // Success
  test.each([
    // Concurrency 1
    { scenario: 'No Stacks', concurrency: 1, toDeploy: [], expected: [] },
    { scenario: 'A', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [] }], expected: ['A'] },
    { scenario: 'A, B', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [] }], expected: ['A', 'B'] },
    { scenario: 'A -> B', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [{ id: 'A' }] }], expected: ['A', 'B'] },
    { scenario: '[unsorted] A -> B', concurrency: 1, toDeploy: [{ id: 'B', dependencies: [{ id: 'A' }] }, { id: 'A', dependencies: [] }], expected: ['A', 'B'] },
    { scenario: 'A -> B -> C', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [{ id: 'A' }] }, { id: 'C', dependencies: [{ id: 'B' }] }], expected: ['A', 'B', 'C'] },
    { scenario: 'A -> B, A -> C', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [{ id: 'A' }] }, { id: 'C', dependencies: [{ id: 'A' }] }], expected: ['A', 'B', 'C'] },
    {
      scenario: 'A (slow), B',
      concurrency: 1,
      toDeploy: [
        { id: 'A', dependencies: [], name: SLOW },
        { id: 'B', dependencies: [] },
      ],
      expected: ['A', 'B'],
    },
    {
      scenario: 'A -> B, C -> D',
      concurrency: 1,
      toDeploy: [
        { id: 'A', dependencies: [] },
        { id: 'B', dependencies: [{ id: 'A' }] },
        { id: 'C', dependencies: [] },
        { id: 'D', dependencies: [{ id: 'C' }] },
      ],
      expected: ['A', 'C', 'B', 'D'],
    },
    {
      scenario: 'A (slow) -> B, C -> D',
      concurrency: 1,
      toDeploy: [
        { id: 'A', dependencies: [], name: SLOW },
        { id: 'B', dependencies: [{ id: 'A' }] },
        { id: 'C', dependencies: [] },
        { id: 'D', dependencies: [{ id: 'C' }] },
      ],
      expected: ['A', 'C', 'B', 'D'],
    },

    // Concurrency 2
    { scenario: 'No Stacks', concurrency: 2, toDeploy: [], expected: [] },
    { scenario: 'A', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [] }], expected: ['A'] },
    { scenario: 'A, B', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [] }], expected: ['A', 'B'] },
    { scenario: 'A -> B', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [{ id: 'A' }] }], expected: ['A', 'B'] },
    { scenario: '[unsorted] A -> B', concurrency: 2, toDeploy: [{ id: 'B', dependencies: [{ id: 'A' }] }, { id: 'A', dependencies: [] }], expected: ['A', 'B'] },
    { scenario: 'A -> B -> C', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [{ id: 'A' }] }, { id: 'C', dependencies: [{ id: 'B' }] }], expected: ['A', 'B', 'C'] },
    { scenario: 'A -> B, A -> C', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [{ id: 'A' }] }, { id: 'C', dependencies: [{ id: 'A' }] }], expected: ['A', 'B', 'C'] },
    {
      scenario: 'A, B',
      concurrency: 2,
      toDeploy: [
        { id: 'A', dependencies: [], name: SLOW },
        { id: 'B', dependencies: [] },
      ],
      expected: ['B', 'A'],
    },
    {
      scenario: 'A -> B, C -> D',
      concurrency: 2,
      toDeploy: [
        { id: 'A', dependencies: [] },
        { id: 'B', dependencies: [{ id: 'A' }] },
        { id: 'C', dependencies: [] },
        { id: 'D', dependencies: [{ id: 'C' }] },
      ],
      expected: ['A', 'C', 'B', 'D'],
    },
    {
      scenario: 'A (slow) -> B, C -> D',
      concurrency: 2,
      toDeploy: [
        { id: 'A', dependencies: [], name: SLOW },
        { id: 'B', dependencies: [{ id: 'A' }] },
        { id: 'C', dependencies: [] },
        { id: 'D', dependencies: [{ id: 'C' }] },
      ],
      expected: ['C', 'D', 'A', 'B'],
    },
    {
      scenario: 'A -> B, A not selected',
      concurrency: 1,
      toDeploy: [
        { id: 'B', dependencies: [{ id: 'A' }] },
      ],
      expected: ['B'],
    },
  ])('Success - Concurrency: $concurrency - $scenario', async ({ concurrency, expected, toDeploy }) => {
    await expect(deployArtifacts(toDeploy as unknown as Stack[], { concurrency, deployStack, buildAsset, publishAsset })).resolves.toBeUndefined();

    expect(deployedStacks).toStrictEqual(expected);
  });

  // Failure
  test.each([
    // Concurrency 1
    { scenario: 'A (error)', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [], displayName: 'A' }], expectedError: 'A', expectedStacks: [] },
    { scenario: 'A (error), B', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [], displayName: 'A' }, { id: 'B', dependencies: [] }], expectedError: 'A', expectedStacks: [] },
    { scenario: 'A, B (error)', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [], displayName: 'B' }], expectedError: 'B', expectedStacks: ['A'] },
    { scenario: 'A (error) -> B', concurrency: 1, toDeploy: [{ id: 'A', dependencies: [], displayName: 'A' }, { id: 'B', dependencies: [{ id: 'A' }] }], expectedError: 'A', expectedStacks: [] },
    { scenario: '[unsorted] A (error) -> B', concurrency: 1, toDeploy: [{ id: 'B', dependencies: [{ id: 'A' }] }, { id: 'A', dependencies: [], displayName: 'A' }], expectedError: 'A', expectedStacks: [] },
    {
      scenario: 'A (error) -> B, C -> D',
      concurrency: 1,
      toDeploy: [
        { id: 'A', dependencies: [], displayName: 'A' },
        { id: 'B', dependencies: [{ id: 'A' }] },
        { id: 'C', dependencies: [] },
        { id: 'D', dependencies: [{ id: 'C' }] },
      ],
      expectedError: 'A',
      expectedStacks: [],
    },
    {
      scenario: 'A -> B, C (error) -> D',
      concurrency: 1,
      toDeploy: [
        { id: 'A', dependencies: [] },
        { id: 'B', dependencies: [{ id: 'A' }] },
        { id: 'C', dependencies: [], displayName: 'C', name: SLOW },
        { id: 'D', dependencies: [{ id: 'C' }] },
      ],
      expectedError: 'C',
      expectedStacks: ['A'],
    },

    // Concurrency 2
    { scenario: 'A (error)', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [], displayName: 'A' }], expectedError: 'A', expectedStacks: [] },
    { scenario: 'A (error), B', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [], displayName: 'A' }, { id: 'B', dependencies: [] }], expectedError: 'A', expectedStacks: ['B'] },
    { scenario: 'A, B (error)', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [] }, { id: 'B', dependencies: [], displayName: 'B' }], expectedError: 'B', expectedStacks: ['A'] },
    { scenario: 'A (error) -> B', concurrency: 2, toDeploy: [{ id: 'A', dependencies: [], displayName: 'A' }, { id: 'B', dependencies: [{ id: 'A' }] }], expectedError: 'A', expectedStacks: [] },
    { scenario: '[unsorted] A (error) -> B', concurrency: 2, toDeploy: [{ id: 'B', dependencies: [{ id: 'A' }] }, { id: 'A', dependencies: [], displayName: 'A' }], expectedError: 'A', expectedStacks: [] },
    {
      scenario: 'A (error) -> B, C -> D',
      concurrency: 2,
      toDeploy: [
        { id: 'A', dependencies: [], displayName: 'A' },
        { id: 'B', dependencies: [{ id: 'A' }] },
        { id: 'C', dependencies: [] },
        { id: 'D', dependencies: [{ id: 'C' }] },
      ],
      expectedError: 'A',
      expectedStacks: ['C'],
    },
    {
      scenario: 'A -> B, C (error) -> D',
      concurrency: 2,
      toDeploy: [
        { id: 'A', dependencies: [] },
        { id: 'B', dependencies: [{ id: 'A' }] },
        { id: 'C', dependencies: [], displayName: 'C', name: SLOW },
        { id: 'D', dependencies: [{ id: 'C' }] },
      ],
      expectedError: 'C',
      expectedStacks: ['A', 'B'],
    },
  ])('Failure - Concurrency: $concurrency - $scenario', async ({ concurrency, expectedError, toDeploy, expectedStacks }) => {
    // eslint-disable-next-line max-len
    await expect(deployArtifacts(toDeploy as unknown as Stack[], { concurrency, deployStack, buildAsset, publishAsset })).rejects.toThrowError(expectedError);

    expect(deployedStacks).toStrictEqual(expectedStacks);
  });
});
