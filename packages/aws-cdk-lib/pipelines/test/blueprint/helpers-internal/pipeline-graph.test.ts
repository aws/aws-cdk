
import * as cdkp from '../../../lib';
import { ManualApprovalStep, Step } from '../../../lib';
import type { GraphNode } from '../../../lib/helpers-internal';
import { Graph, PipelineGraph } from '../../../lib/helpers-internal';
import { flatten } from '../../../lib/private/javascript';
import { AppWithOutput, AppWithExposedStacks, OneStackApp, TwoStackApp, TestApp } from '../../testhelpers/test-app';

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

describe('deployGate', () => {
  let blueprint: Blueprint;
  beforeEach(() => {
    blueprint = new Blueprint(app, 'Bp', {
      synth: new cdkp.ShellStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
        commands: ['build'],
      }),
    });
  });

  test('gate node depends on all prepare nodes, all deploy nodes depend on gate', () => {
    // GIVEN — 3 independent stacks
    const stage = new AppWithExposedStacks(app, 'Prod');
    blueprint.addStage(stage, {
      deployGate: [new ManualApprovalStep('Approve')],
    });

    // WHEN
    const graph = new PipelineGraph(blueprint);

    // THEN — sortedLeaves gives the correct tranche order (this is what CodePipeline uses)
    const leaves = graph.graph.sortedLeaves();
    const trancheIds = leaves.map(t => t.map(n => n.id).sort());

    // All Prepare nodes come before Approve
    const approveTranche = leaves.findIndex(t => t.some(n => n.id === 'Approve'));
    const prepare1Tranche = leaves.findIndex(t => t.some(n => n.id === 'Prepare' && n.parentGraph?.id === 'Stack1'));
    const prepare2Tranche = leaves.findIndex(t => t.some(n => n.id === 'Prepare' && n.parentGraph?.id === 'Stack2'));
    const prepare3Tranche = leaves.findIndex(t => t.some(n => n.id === 'Prepare' && n.parentGraph?.id === 'Stack3'));
    expect(approveTranche).toBeGreaterThan(prepare1Tranche);
    expect(approveTranche).toBeGreaterThan(prepare2Tranche);
    expect(approveTranche).toBeGreaterThan(prepare3Tranche);

    // All Deploy nodes come after Approve
    const deploy1Tranche = leaves.findIndex(t => t.some(n => n.id === 'Deploy' && n.parentGraph?.id === 'Stack1-Deploy'));
    const deploy2Tranche = leaves.findIndex(t => t.some(n => n.id === 'Deploy' && n.parentGraph?.id === 'Stack2-Deploy'));
    const deploy3Tranche = leaves.findIndex(t => t.some(n => n.id === 'Deploy' && n.parentGraph?.id === 'Stack3-Deploy'));
    expect(deploy1Tranche).toBeGreaterThan(approveTranche);
    expect(deploy2Tranche).toBeGreaterThan(approveTranche);
    expect(deploy3Tranche).toBeGreaterThan(approveTranche);

    // direct dependency check
    const approveNode = nodeAt(graph.graph, 'Prod', 'Approve');
    const stack1Graph = nodeAt(graph.graph, 'Prod', 'Stack1');
    const stack2Graph = nodeAt(graph.graph, 'Prod', 'Stack2');
    const stack3Graph = nodeAt(graph.graph, 'Prod', 'Stack3');
    const deploy1 = nodeAt(graph.graph, 'Prod', 'Stack1-Deploy', 'Deploy');
    const deploy2 = nodeAt(graph.graph, 'Prod', 'Stack2-Deploy', 'Deploy');
    const deploy3 = nodeAt(graph.graph, 'Prod', 'Stack3-Deploy', 'Deploy');
    expect(approveNode.dependencies).toContain(stack1Graph);
    expect(approveNode.dependencies).toContain(stack2Graph);
    expect(approveNode.dependencies).toContain(stack3Graph);
    expect(deploy1.dependencies).toContain(approveNode);
    expect(deploy2.dependencies).toContain(approveNode);
    expect(deploy3.dependencies).toContain(approveNode);

    void trancheIds; // used above
  });

  test('multiple gate steps run in parallel by default', () => {
    // GIVEN
    const stage = new AppWithExposedStacks(app, 'Prod');
    blueprint.addStage(stage, {
      deployGate: [
        new ManualApprovalStep('ApproveA'),
        new ManualApprovalStep('ApproveB'),
      ],
    });

    // WHEN
    const leaves = new PipelineGraph(blueprint).graph.sortedLeaves();

    // THEN — both gate nodes are in the same tranche (parallel)
    const approveATranche = leaves.findIndex(t => t.some(n => n.id === 'ApproveA'));
    const approveBTranche = leaves.findIndex(t => t.some(n => n.id === 'ApproveB'));
    expect(approveATranche).toBeGreaterThan(-1);
    expect(approveATranche).toEqual(approveBTranche);
  });

  test('Step.sequence chains gate steps in order', () => {
    // GIVEN
    const stage = new AppWithExposedStacks(app, 'Prod');
    blueprint.addStage(stage, {
      deployGate: Step.sequence([
        new ManualApprovalStep('First'),
        new ManualApprovalStep('Second'),
      ]),
    });

    // WHEN
    const leaves = new PipelineGraph(blueprint).graph.sortedLeaves();

    // THEN — Second is in a later tranche than First
    const firstTranche = leaves.findIndex(t => t.some(n => n.id === 'First'));
    const secondTranche = leaves.findIndex(t => t.some(n => n.id === 'Second'));
    expect(firstTranche).toBeGreaterThan(-1);
    expect(secondTranche).toBeGreaterThan(firstTranche);
  });

  test('deploy nodes do not depend on each other — all stacks deploy in parallel after gate', () => {
    // GIVEN — 3 independent stacks
    const stage = new AppWithExposedStacks(app, 'Prod');
    blueprint.addStage(stage, {
      deployGate: [new ManualApprovalStep('Approve')],
    });

    // WHEN
    const graph = new PipelineGraph(blueprint);
    const deploy1 = nodeAt(graph.graph, 'Prod', 'Stack1-Deploy', 'Deploy');
    const deploy2 = nodeAt(graph.graph, 'Prod', 'Stack2-Deploy', 'Deploy');
    const deploy3 = nodeAt(graph.graph, 'Prod', 'Stack3-Deploy', 'Deploy');

    // THEN — deploy nodes only depend on the gate, not on each other
    expect(deploy1.dependencies).not.toContain(deploy2);
    expect(deploy1.dependencies).not.toContain(deploy3);
    expect(deploy2.dependencies).not.toContain(deploy1);
    expect(deploy2.dependencies).not.toContain(deploy3);
    expect(deploy3.dependencies).not.toContain(deploy1);
    expect(deploy3.dependencies).not.toContain(deploy2);
  });

  test('throws when stage has dependent stacks', () => {
    // GIVEN — TwoStackApp has Stack2 depending on Stack1 by default
    expect(() => {
      blueprint.addStage(new TwoStackApp(app, 'Prod'), {
        deployGate: [new ManualApprovalStep('Approve')],
      });
    }).toThrow(/cannot use.*deployGate.*dependent/);
  });

  test('throws when prepareStep is disabled', () => {
    // GIVEN
    blueprint.addStage(new AppWithExposedStacks(app, 'Prod'), {
      deployGate: [new ManualApprovalStep('Approve')],
    });

    // THEN
    expect(() => new PipelineGraph(blueprint, { prepareStep: false })).toThrow(/cannot use.*deployGate.*change sets are disabled/);
  });

  test('throws when gate step consumes stack output', () => {
    // GIVEN
    const myApp = new AppWithOutput(app, 'Prod');
    const scriptStep = new cdkp.ShellStep('Check', {
      envFromCfnOutputs: { BUCKET_NAME: myApp.theOutput },
      commands: ['echo $BUCKET_NAME'],
    });

    // THEN
    expect(() => {
      blueprint.addStage(myApp, {
        deployGate: [scriptStep],
      });
    }).toThrow(/cannot use.*deployGate.*consume stack outputs/);
  });

  test('post steps depend on all stack graphs, not on the gate node directly', () => {
    // GIVEN
    const stage = new AppWithExposedStacks(app, 'Prod');
    blueprint.addStage(stage, {
      deployGate: [new ManualApprovalStep('Approve')],
      post: [new ManualApprovalStep('PostDeploy')],
    });

    // WHEN
    const graph = new PipelineGraph(blueprint);
    const postNode = nodeAt(graph.graph, 'Prod', 'PostDeploy');
    const approveNode = nodeAt(graph.graph, 'Prod', 'Approve');
    const deploy1Graph = nodeAt(graph.graph, 'Prod', 'Stack1-Deploy');
    const deploy2Graph = nodeAt(graph.graph, 'Prod', 'Stack2-Deploy');
    const deploy3Graph = nodeAt(graph.graph, 'Prod', 'Stack3-Deploy');

    // THEN — post depends on the deploy sub-graphs (which contain Deploy nodes)
    expect(postNode.dependencies).toContain(deploy1Graph);
    expect(postNode.dependencies).toContain(deploy2Graph);
    expect(postNode.dependencies).toContain(deploy3Graph);
    // post does NOT directly depend on the gate
    expect(postNode.dependencies).not.toContain(approveNode);
  });

  test('renderDot() and render() do not throw for a deployGate stage', () => {
    // Gate nodes depend on stackGraph objects (not on Prepare leaf nodes directly),
    // so sortedChildren() on retGraph sees no cycle: gateNode -> stackGraph is a
    // forward edge, and deployNode (inside stackGraph) -> gateNode does not project
    // to a retGraph-level cycle because deployNode is not a direct child of retGraph.
    const stage = new AppWithExposedStacks(app, 'Prod');
    blueprint.addStage(stage, {
      deployGate: [new ManualApprovalStep('Approve')],
    });
    const graph = new PipelineGraph(blueprint).graph;
    expect(() => graph.render()).not.toThrow();
    expect(() => graph.renderDot()).not.toThrow();
  });

  test('without deployGate, deploy node only depends on its own prepare node within the stack graph', () => {
    // GIVEN — same stage without deployGate
    blueprint.addStage(new AppWithExposedStacks(app, 'Prod'));

    // WHEN
    const graph = new PipelineGraph(blueprint);
    const deploy1 = nodeAt(graph.graph, 'Prod', 'Stack1', 'Deploy');
    const prepare1 = nodeAt(graph.graph, 'Prod', 'Stack1', 'Prepare');
    const prepare2 = nodeAt(graph.graph, 'Prod', 'Stack2', 'Prepare');
    const prepare3 = nodeAt(graph.graph, 'Prod', 'Stack3', 'Prepare');

    // THEN — deploy1 depends on its own prepare, but NOT on other stacks' prepare nodes
    expect(deploy1.dependencies).toContain(prepare1);
    expect(deploy1.dependencies).not.toContain(prepare2);
    expect(deploy1.dependencies).not.toContain(prepare3);
  });

  test('reusing the same Step instance as both deployGate and pre throws a ValidationError', () => {
    // addStepNode() dedupes by Step identity, so using the same instance in both
    // pre and deployGate would create a cycle (Shared -> prepareGraph -> Shared).
    // fromStage() catches this and throws.
    const stage = new AppWithExposedStacks(app, 'Prod');
    const shared = new ManualApprovalStep('Shared');

    expect(() => {
      blueprint.addStage(stage, { pre: [shared], deployGate: [shared] });
    }).toThrow(/cannot use.*deployGate.*multiple roles/);
  });

  test('reusing the same Step instance as deployGate across two stages causes a cycle (known limitation: use separate instances)', () => {
    // addStepNode() dedupes per PipelineGraph by Step identity only, not by (Step, stage).
    // Reusing the same instance across stages wires the second stage's deploys to the
    // first stage's gate node, creating a cycle. This is a pre-existing limitation of
    // addStepNode() — not introduced by deployGate. Users must create a new Step per stage.
    const stageA = new AppWithExposedStacks(app, 'Beta');
    const stageB = new AppWithExposedStacks(app, 'Prod');
    const shared = new ManualApprovalStep('Approve');
    blueprint.addStage(stageA, { deployGate: [shared] });
    blueprint.addStage(stageB, { deployGate: [shared] });

    expect(() => new PipelineGraph(blueprint)).toThrow(/Dependency cycle/);
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
