/* eslint-disable import/no-extraneous-dependencies */
import '@aws-cdk/assert-internal/jest';
import * as cdkp from '../../../lib';
import { PipelineStructure } from '../../../lib/codepipeline/_pipeline-structure';
import { Graph, GraphNode } from '../../../lib/private/graph';
import { flatten } from '../../../lib/private/javascript';
import { AppWithOutput, OneStackApp } from '../test-app';
import { TestApp } from '../testutil';

let app: TestApp;

beforeEach(() => {
  app = new TestApp();
});

afterEach(() => {
  app.cleanup();
});

describe('blueprint with one stage', () => {
  let blueprint: cdkp.Blueprint;
  beforeEach(() => {
    blueprint = new cdkp.Blueprint({
      synthStep: new cdkp.SynthStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test'),
        commands: ['build'],
      }),
    });
    blueprint.addStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' } }));
  });

  test('simple app gets graphed correctly', () => {
    // WHEN
    const graph = new PipelineStructure(blueprint).graph;

    // THEN
    expect(childrenAt(graph)).toEqual([
      'Source',
      'Build',
      'CrossAccount',
    ]);

    expect(childrenAt(graph, 'CrossAccount')).toEqual([
      'Stack',
    ]);

    expect(childrenAt(graph, 'CrossAccount', 'Stack')).toEqual([
      'Prepare',
      'Deploy',
    ]);
  });

  test('self mutation gets inserted at the right place', () => {
    // WHEN
    const graph = new PipelineStructure(blueprint, { selfMutation: true }).graph;

    // THEN
    expect(childrenAt(graph)).toEqual([
      'Source',
      'Build',
      'UpdatePipeline',
      'CrossAccount',
    ]);

    expect(childrenAt(graph, 'UpdatePipeline')).toEqual([
      'SelfMutate',
    ]);
  });
});

describe('blueprint with wave and stage', () => {
  let blueprint: cdkp.Blueprint;
  beforeEach(() => {
    blueprint = new cdkp.Blueprint({
      synthStep: new cdkp.SynthStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test'),
        commands: ['build'],
      }),
    });

    const wave = blueprint.addWave('Wave');
    wave.addStage(new OneStackApp(app, 'Alpha'));
    wave.addStage(new OneStackApp(app, 'Beta'));
  });

  test('post-action gets added inside stage graph', () => {
    // GIVEN
    blueprint.waves[0].stages[0].addPost(new cdkp.ManualApprovalStep('Approve'));

    // WHEN
    const graph = new PipelineStructure(blueprint).graph;

    // THEN
    expect(childrenAt(graph, 'Wave')).toEqual([
      'Alpha',
      'Beta',
    ]);

    expect(childrenAt(graph, 'Wave', 'Alpha')).toEqual([
      'Stack',
      'Approve',
    ]);
  });

  test('pre-action gets added inside stage graph', () => {
    // GIVEN
    blueprint.waves[0].stages[0].addPre(new cdkp.ManualApprovalStep('Gogogo'));

    // WHEN
    const graph = new PipelineStructure(blueprint).graph;

    // THEN
    expect(childrenAt(graph, 'Wave', 'Alpha')).toEqual([
      'Gogogo',
      'Stack',
    ]);
  });
});

describe('with app with output', () => {
  let blueprint: cdkp.Blueprint;
  let myApp: AppWithOutput;
  let scriptStep: cdkp.ScriptStep;
  beforeEach(() => {
    blueprint = new cdkp.Blueprint({
      synthStep: new cdkp.SynthStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test'),
        commands: ['build'],
      }),
    });

    myApp = new AppWithOutput(app, 'Alpha');
    scriptStep = new cdkp.ScriptStep('PrintBucketName', {
      envFromOutputs: {
        BUCKET_NAME: myApp.theOutput,
      },
      commands: ['echo $BUCKET_NAME'],
    });
  });

  test('post-action using stack output has dependency on execute node', () => {
    // GIVEN
    blueprint.addStage(myApp, {
      post: [scriptStep],
    });

    // WHEN
    const graph = new PipelineStructure(blueprint).graph;

    // THEN
    expect(childrenAt(graph, 'Alpha')).toEqual([
      'Stack',
      'PrintBucketName',
    ]);

    expect(nodeAt(graph, 'Alpha', 'PrintBucketName').dependencies).toContain(
      nodeAt(graph, 'Alpha', 'Stack', 'Deploy'));
  });

  test('pre-action cannot use stack output', () => {
    // GIVEN
    blueprint.addStage(myApp, {
      pre: [scriptStep],
    });

    // WHEN
    const graph = new PipelineStructure(blueprint).graph;
    expect(() => {
      assertGraph(nodeAt(graph, 'Alpha')).sortedLeaves();
    }).toThrow(/Dependency cycle/);
  });

  test('cannot use output from stack not in the pipeline', () => {
    // GIVEN
    blueprint.addStage(new AppWithOutput(app, 'OtherApp'), {
      pre: [scriptStep],
    });

    // WHEN
    expect(() => {
      new PipelineStructure(blueprint).graph;
    }).toThrow(/is not in the pipeline/);
  });
});

function childrenAt(g: Graph<any>, ...descend: string[]) {
  for (const d of descend) {
    const child = g.tryGetChild(d);
    if (!child) {
      throw new Error(`No node named '${d}' in ${g}`);
    }
    g = assertGraph(child);
  }
  return childNames(g);
}

function nodeAt(g: Graph<any>, ...descend: string[]) {
  for (const d of descend.slice(0, descend.length - 1)) {
    const child = g.tryGetChild(d);
    if (!child) {
      throw new Error(`No node named '${d}' in ${g}`);
    }
    g = assertGraph(child);
  }
  const child = g.tryGetChild(descend[descend.length - 1]);
  if (!child) {
    throw new Error(`No node named '${descend[descend.length - 1]}' in ${g}`);
  }
  return child;
}

function childNames(g: Graph<any>) {
  return Array.from(flatten(g.sortedChildren())).map(n => n.id);
}

function assertGraph<A>(g: GraphNode<A> | undefined): Graph<A> {
  if (!g) { throw new Error('Expected a graph node, got undefined'); }
  if (!(g instanceof Graph)) { throw new Error(`Expected a Graph, got: ${g}`); }
  return g;
}