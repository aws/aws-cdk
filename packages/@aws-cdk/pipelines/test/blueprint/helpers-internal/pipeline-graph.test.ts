/* eslint-disable import/no-extraneous-dependencies */
import * as cdkp from '../../../lib';
import { ManualApprovalStep, Step } from '../../../lib';
import { Graph, GraphNode, PipelineGraph } from '../../../lib/helpers-internal';
import { flatten } from '../../../lib/private/javascript';
import { AppWithOutput, AppWithExposedStacks, OneStackApp, TestApp } from '../../testhelpers/test-app';

let app: TestApp;

beforeEach(() => {
  app = new TestApp();
});

afterEach(() => {
  app.cleanup();
});

describe('blueprint with one stage', () => {
  let blueprint: Blueprint;
  beforeEach(() => {
    blueprint = new Blueprint(app, 'Bp', {
      synth: new cdkp.ShellStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
        commands: ['build'],
      }),
    });
    blueprint.addStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' } }));
  });

  test('simple app gets graphed correctly', () => {
    // WHEN
    const graph = new PipelineGraph(blueprint).graph;

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
    const graph = new PipelineGraph(blueprint, { selfMutation: true }).graph;

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
  let blueprint: Blueprint;
  beforeEach(() => {
    blueprint = new Blueprint(app, 'Bp', {
      synth: new cdkp.ShellStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
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
    const graph = new PipelineGraph(blueprint).graph;

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
    const graph = new PipelineGraph(blueprint).graph;

    // THEN
    expect(childrenAt(graph, 'Wave', 'Alpha')).toEqual([
      'Gogogo',
      'Stack',
    ]);
  });

  test('pre, changeSet, and post are added correctly inside stack graph', () => {
    // GIVEN
    const appWithExposedStacks = new AppWithExposedStacks(app, 'Gamma');
    const stack = appWithExposedStacks.stacks[0];
    blueprint.waves[0].addStage(appWithExposedStacks, {
      stackSteps: [{
        stack,
        pre: [new cdkp.ManualApprovalStep('Step1'), new cdkp.ManualApprovalStep('Step2'), new cdkp.ManualApprovalStep('Step3')],
        changeSet: [new cdkp.ManualApprovalStep('Manual Approval')],
        post: [new cdkp.ManualApprovalStep('Post Approval')],
      }],
    });

    // WHEN
    const graph = new PipelineGraph(blueprint).graph;

    // THEN
    expect(childrenAt(graph, 'Wave', 'Gamma', 'Stack1')).toEqual([
      'Step1',
      'Step2',
      'Step3',
      'Prepare',
      'Manual Approval',
      'Deploy',
      'Post Approval',
    ]);
  });

  test('steps that do not depend on each other are ordered lexicographically', () => {
    // GIVEN
    const goStep = new cdkp.ManualApprovalStep('Gogogo');
    const checkStep = new cdkp.ManualApprovalStep('Check');
    blueprint.waves[0].stages[0].addPre(
      checkStep,
      goStep,
    );

    // WHEN
    const graph = new PipelineGraph(blueprint).graph;

    // THEN
    expect(childrenAt(graph, 'Wave', 'Alpha')).toEqual([
      'Check',
      'Gogogo',
      'Stack',
    ]);
  });

  test('steps can depend on each other', () => {
    // GIVEN
    const goStep = new cdkp.ManualApprovalStep('Gogogo');
    const checkStep = new cdkp.ManualApprovalStep('Check');
    checkStep.addStepDependency(goStep);
    blueprint.waves[0].stages[0].addPre(
      checkStep,
      goStep,
    );

    // WHEN
    const graph = new PipelineGraph(blueprint).graph;

    // THEN
    expect(childrenAt(graph, 'Wave', 'Alpha')).toEqual([
      'Gogogo',
      'Check',
      'Stack',
    ]);
  });

  test('Steps.sequence adds correct dependencies', () => {
    // GIVEN
    blueprint.waves[0].stages[0].addPre(...Step.sequence([
      new cdkp.ManualApprovalStep('Gogogo'),
      new cdkp.ManualApprovalStep('Check'),
      new cdkp.ManualApprovalStep('DoubleCheck'),
    ]));

    // WHEN
    const graph = new PipelineGraph(blueprint).graph;

    // THEN
    expect(childrenAt(graph, 'Wave', 'Alpha')).toEqual([
      'Gogogo',
      'Check',
      'DoubleCheck',
      'Stack',
    ]);
  });
});

describe('options for other engines', () => {
  test('"publishTemplate" will add steps to publish CFN templates as assets', () => {
    // GIVEN
    const blueprint = new Blueprint(app, 'Bp', {
      synth: new cdkp.ShellStep('Synth', {
        commands: ['build'],
      }),
    });
    blueprint.addStage(new OneStackApp(app, 'Alpha'));

    // WHEN
    const graph = new PipelineGraph(blueprint, {
      publishTemplate: true,
    });

    // THEN
    expect(childrenAt(graph.graph, 'Assets')).toStrictEqual(['FileAsset1']);
  });

  test('"prepareStep: false" can be used to disable the "prepare" step for stack deployments', () => {
    // GIVEN
    const blueprint = new Blueprint(app, 'Bp', {
      synth: new cdkp.ShellStep('Synth', {
        commands: ['build'],
      }),
    });
    blueprint.addStage(new OneStackApp(app, 'Alpha'));

    // WHEN
    const graph = new PipelineGraph(blueprint, {
      prepareStep: false,
    });

    // THEN
    // if "prepareStep" was true (default), the "Stack" node would have "Prepare" and "Deploy"
    // since "prepareStep" is false, it only has "Deploy".
    expect(childrenAt(graph.graph, 'Alpha', 'Stack')).toStrictEqual(['Deploy']);
  });

  test('"prepareStep: false" will not impact "pre" stack steps', () => {
    // GIVEN
    const blueprint = new Blueprint(app, 'Bp', {
      synth: new cdkp.ShellStep('Synth', {
        commands: ['build'],
      }),
    });
    const appWithExposedStacks = new AppWithExposedStacks(app, 'Alpha');
    blueprint.addStage(appWithExposedStacks, {
      stackSteps: [{
        stack: appWithExposedStacks.stacks[0],
        pre: [new ManualApprovalStep('PreCheck')],
      }],
    });

    // WHEN
    const graph = new PipelineGraph(blueprint, {
      prepareStep: false,
    });

    // THEN
    expect(childrenAt(graph.graph, 'Alpha', 'Stack1')).toEqual([
      'PreCheck',
      'Deploy',
    ]);
  });

  test('specifying changeSet step with "prepareStep: false" will throw', () => {
    // GIVEN
    const blueprint = new Blueprint(app, 'Bp', {
      synth: new cdkp.ShellStep('Synth', {
        commands: ['build'],
      }),
    });
    const appWithExposedStacks = new AppWithExposedStacks(app, 'Alpha');
    blueprint.addStage(appWithExposedStacks, {
      stackSteps: [{
        stack: appWithExposedStacks.stacks[0],
        changeSet: [new ManualApprovalStep('ChangeSetApproval')],
      }],
    });

    // THEN
    expect(() => new PipelineGraph(blueprint, {
      prepareStep: false,
    })).toThrow(/Cannot use 'changeSet' steps/);
  });
});


describe('with app with output', () => {
  let blueprint: Blueprint;
  let myApp: AppWithOutput;
  let scriptStep: cdkp.ShellStep;
  beforeEach(() => {
    blueprint = new Blueprint(app, 'Bp', {
      synth: new cdkp.ShellStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
        commands: ['build'],
      }),
    });

    myApp = new AppWithOutput(app, 'Alpha');
    scriptStep = new cdkp.ShellStep('PrintBucketName', {
      envFromCfnOutputs: {
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
    const graph = new PipelineGraph(blueprint).graph;

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
    expect(() => {
      const graph = new PipelineGraph(blueprint).graph;
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
      new PipelineGraph(blueprint).graph;
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

class Blueprint extends cdkp.PipelineBase {
  protected doBuildPipeline(): void {
  }
}
