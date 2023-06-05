import { WorkGraph } from '../lib/util/work-graph';
import { AssetBuildNode, AssetPublishNode, DeploymentState, StackNode } from '../lib/util/work-graph-types';

const DUMMY: any = 'DUMMY';

const sleep = async (duration: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), duration));

// Not great to have actual sleeps in the tests, but they mostly just exist to give the async workflow
// a chance to start new tasks.
const SLOW = 200;

/**
 * Repurposing unused stack attributes to create specific test scenarios
 * - stack.name          = deployment duration
 * - stack.displayName   = error message
 */
describe('WorkGraph', () => {
  const actionedAssets: string[] = [];
  const callbacks = {
    deployStack: async (x: StackNode) => {
      const errorMessage = x.stack.displayName;
      const timeout = Number(x.stack.stackName) || 0;

      await sleep(timeout);

      // Special case for testing NestedCloudAssemblyArtifacts
      if (errorMessage && !errorMessage.startsWith('Nested')) {
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
    const graph = new WorkGraph();
    addTestArtifactsToGraph(toDeploy, graph);

    await graph.doParallel(concurrency, callbacks);

    expect(actionedAssets).toStrictEqual(expected);
  });

  test('can remove unnecessary assets', async () => {
    const graph = new WorkGraph();
    addTestArtifactsToGraph([
      { id: 'a', type: 'asset' },
      { id: 'b', type: 'asset' },
      { id: 'A', type: 'stack', assetDependencies: ['a', 'b'] },
    ], graph);

    // Remove 'b' from the graph
    await graph.removeUnnecessaryAssets(node => Promise.resolve(node.id.startsWith('b')));
    await graph.doParallel(1, callbacks);

    // We expect to only see 'a' and 'A'
    expect(actionedAssets).toEqual(['a-build', 'a-publish', 'A']);
  });

  // Failure Concurrency
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
    const graph = new WorkGraph();
    addTestArtifactsToGraph(toDeploy, graph);

    await expect(graph.doParallel(concurrency, callbacks)).rejects.toThrowError(expectedError);

    expect(actionedAssets).toStrictEqual(expectedStacks);
  });

  // Failure Graph Circular Dependencies
  test.each([
    {
      scenario: 'A -> A',
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', stackDependencies: ['A'] },
      ]),
      expectedError: 'A -> A',
    },
    {
      scenario: 'A -> B, B -> A',
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack', stackDependencies: ['B'] },
        { id: 'B', type: 'stack', stackDependencies: ['A'] },
      ]),
      expectedError: 'A -> B -> A',
    },
    {
      scenario: 'A, B -> C, C -> D, D -> B',
      toDeploy: createArtifacts([
        { id: 'A', type: 'stack' }, // Add a node to visit first so the infinite loop occurs deeper in the traversal callstack.
        { id: 'B', type: 'stack', stackDependencies: ['C'] },
        { id: 'C', type: 'stack', stackDependencies: ['D'] },
        { id: 'D', type: 'stack', stackDependencies: ['B'] },
      ]),
      expectedError: 'B -> C -> D -> B',
    },
  ])('Failure - Graph Circular Dependencies - $scenario', async ({ toDeploy, expectedError }) => {
    const graph = new WorkGraph();
    addTestArtifactsToGraph(toDeploy, graph);

    await expect(graph.doParallel(1, callbacks)).rejects.toThrowError(new RegExp(`Unable to make progress.*${expectedError}`));
  });
});

interface TestArtifact {
  stackDependencies?: string[];
  assetDependencies?: string[];
  id: string;
  type: 'stack' | 'asset' | 'tree'| 'nested';
  name?: number;
  displayName?: string;
}

function createArtifacts(artifacts: TestArtifact[]) {
  return artifacts;
}

function addTestArtifactsToGraph(toDeploy: TestArtifact[], graph: WorkGraph) {
  for (const node of toDeploy) {
    switch (node.type) {
      case 'stack':
        graph.addNodes({
          type: 'stack',
          id: node.id,
          deploymentState: DeploymentState.PENDING,
          stack: {
            // We're smuggling information here so that the set of callbacks can do some appropriate action
            stackName: node.name, // Used to smuggle sleep duration
            displayName: node.displayName, // Used to smuggle exception triggers
          } as any,
          dependencies: new Set([...node.stackDependencies ?? [], ...(node.assetDependencies ?? []).map(x => `${x}-publish`)]),
        });
        break;
      case 'asset':
        graph.addNodes({
          type: 'asset-build',
          id: `${node.id}-build`,
          deploymentState: DeploymentState.PENDING,
          asset: DUMMY,
          assetManifest: DUMMY,
          assetManifestArtifact: DUMMY,
          parentStack: DUMMY,
          dependencies: new Set([...node.stackDependencies ?? [], ...(node.assetDependencies ?? []).map(x => `${x}-publish`)]),
        });
        graph.addNodes({
          type: 'asset-publish',
          id: `${node.id}-publish`,
          deploymentState: DeploymentState.PENDING,
          asset: DUMMY,
          assetManifest: DUMMY,
          assetManifestArtifact: DUMMY,
          parentStack: DUMMY,
          dependencies: new Set([`${node.id}-build`]),
        });
        break;
    }
  }
  graph.removeUnavailableDependencies();
}