/* eslint-disable import/no-extraneous-dependencies */
import '@aws-cdk/assert-internal/jest';
import * as cdkp from '../../../lib';
import { GraphFromBlueprint } from '../../../lib/bp-codepipeline/_graph-from-blueprint';
import { Graph, GraphNode } from '../../../lib/private/graph';
import { flatten } from '../../../lib/private/javascript';
import { OneStackApp } from '../test-app';
import { TestApp } from '../testutil';

let app: TestApp;

beforeEach(() => {
  app = new TestApp();
});

afterEach(() => {
  app.cleanup();
});

test('simple app gets graphed correctly', () => {
  // GIVEN
  const blueprint = new cdkp.Blueprint({
    synthStep: new cdkp.SynthStep('Synth', {
      input: cdkp.CodePipelineSource.gitHub('test/test'),
      commands: ['build'],
    }),
  });
  blueprint.addStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' } }));

  // WHEN
  const graph = new GraphFromBlueprint(blueprint).graph;

  // THEN
  expect(childNames(graph)).toEqual([
    'Source',
    'Build',
    'CrossAccount',
  ]);

  const crossAccount = assertGraph(graph.tryGetChild('CrossAccount'));
  expect(childNames(crossAccount)).toEqual([
    'Stack',
  ]);

  const stack = assertGraph(crossAccount.tryGetChild('Stack'));
  expect(childNames(stack)).toEqual([
    'Prepare',
    'Deploy',
  ]);
});

function childNames(g: Graph<any>) {
  return Array.from(flatten(g.sortedChildren())).map(n => n.id);
}

function assertGraph<A>(g: GraphNode<A> | undefined): Graph<A> {
  if (!g) { throw new Error('Expected a graph node, got undefined'); }
  if (!(g instanceof Graph)) { throw new Error(`Expected a Graph, got: ${g}`); }
  return g;
}