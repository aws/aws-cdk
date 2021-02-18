import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, IConstruct } from 'constructs';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, CfnResource, IAspect, Stack, Stage, Aspects } from '../lib';

nodeunitShim({
  'Stack inherits unspecified part of the env from Stage'(test: Test) {
    // GIVEN
    const app = new App();
    const stage = new Stage(app, 'Stage', {
      env: { account: 'account', region: 'region' },
    });

    // WHEN
    const stack1 = new Stack(stage, 'Stack1', { env: { region: 'elsewhere' } });
    const stack2 = new Stack(stage, 'Stack2', { env: { account: 'tnuocca' } });

    // THEN
    test.deepEqual(acctRegion(stack1), ['account', 'elsewhere']);
    test.deepEqual(acctRegion(stack2), ['tnuocca', 'region']);

    test.done();
  },

  'envs are inherited deeply'(test: Test) {
    // GIVEN
    const app = new App();
    const outer = new Stage(app, 'Stage', {
      env: { account: 'account', region: 'region' },
    });

    // WHEN
    const innerAcct = new Stage(outer, 'Acct', { env: { account: 'tnuocca' } });
    const innerRegion = new Stage(outer, 'Rgn', { env: { region: 'elsewhere' } });
    const innerNeither = new Stage(outer, 'Neither');

    // THEN
    test.deepEqual(acctRegion(new Stack(innerAcct, 'Stack')), ['tnuocca', 'region']);
    test.deepEqual(acctRegion(new Stack(innerRegion, 'Stack')), ['account', 'elsewhere']);
    test.deepEqual(acctRegion(new Stack(innerNeither, 'Stack')), ['account', 'region']);

    test.done();
  },

  'The Stage Assembly is in the app Assembly\'s manifest'(test: Test) {
    // WHEN
    const app = new App();
    const stage = new Stage(app, 'Stage');
    new BogusStack(stage, 'Stack2');

    // THEN -- app manifest contains a nested cloud assembly
    const appAsm = app.synth();

    const artifact = appAsm.artifacts.find(x => x instanceof cxapi.NestedCloudAssemblyArtifact);
    test.ok(artifact);

    test.done();
  },

  'Stacks in Stage are in a different cxasm than Stacks in App'(test: Test) {
    // WHEN
    const app = new App();
    const stack1 = new BogusStack(app, 'Stack1');
    const stage = new Stage(app, 'Stage');
    const stack2 = new BogusStack(stage, 'Stack2');

    // THEN
    const stageAsm = stage.synth();
    test.deepEqual(stageAsm.stacks.map(s => s.stackName), [stack2.stackName]);

    const appAsm = app.synth();
    test.deepEqual(appAsm.stacks.map(s => s.stackName), [stack1.stackName]);

    test.done();
  },

  'Can nest Stages inside other Stages'(test: Test) {
    // WHEN
    const app = new App();
    const outer = new Stage(app, 'Outer');
    const inner = new Stage(outer, 'Inner');
    const stack = new BogusStack(inner, 'Stack');

    // WHEN
    const appAsm = app.synth();
    const outerAsm = appAsm.getNestedAssembly(outer.artifactId);
    const innerAsm = outerAsm.getNestedAssembly(inner.artifactId);

    test.ok(innerAsm.tryGetArtifact(stack.artifactId));

    test.done();
  },

  'Default stack name in Stage objects incorporates the Stage name and no hash'(test: Test) {
    // WHEN
    const app = new App();
    const stage = new Stage(app, 'MyStage');
    const stack = new BogusStack(stage, 'MyStack');

    // THEN
    test.equal(stage.stageName, 'MyStage');
    test.equal(stack.stackName, 'MyStage-MyStack');

    test.done();
  },

  'Can not have dependencies to stacks outside the nested asm'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new BogusStack(app, 'Stack1');
    const stage = new Stage(app, 'MyStage');
    const stack2 = new BogusStack(stage, 'Stack2');

    // WHEN
    test.throws(() => {
      stack2.addDependency(stack1);
    }, /dependency cannot cross stage boundaries/);

    test.done();
  },

  'When we synth() a stage, aspects inside it must have been applied'(test: Test) {
    // GIVEN
    const app = new App();
    const stage = new Stage(app, 'MyStage');
    const stack = new BogusStack(stage, 'Stack');

    // WHEN
    const aspect = new TouchingAspect();
    Aspects.of(stack).add(aspect);

    // THEN
    app.synth();
    test.deepEqual(aspect.visits.map(c => c.node.path), [
      'MyStage/Stack',
      'MyStage/Stack/Resource',
    ]);

    test.done();
  },

  'Aspects do not apply inside a Stage'(test: Test) {
    // GIVEN
    const app = new App();
    const stage = new Stage(app, 'MyStage');
    new BogusStack(stage, 'Stack');

    // WHEN
    const aspect = new TouchingAspect();
    Aspects.of(app).add(aspect);

    // THEN
    app.synth();
    test.deepEqual(aspect.visits.map(c => c.node.path), [
      '',
      'Tree',
    ]);
    test.done();
  },

  'Automatic dependencies inside a stage are available immediately after synth'(test: Test) {
    // GIVEN
    const app = new App();
    const stage = new Stage(app, 'MyStage');
    const stack1 = new Stack(stage, 'Stack1');
    const stack2 = new Stack(stage, 'Stack2');

    // WHEN
    const resource1 = new CfnResource(stack1, 'Resource', {
      type: 'CDK::Test::Resource',
    });
    new CfnResource(stack2, 'Resource', {
      type: 'CDK::Test::Resource',
      properties: {
        OtherThing: resource1.ref,
      },
    });

    const asm = stage.synth();

    // THEN
    test.deepEqual(
      asm.getStackArtifact(stack2.artifactId).dependencies.map(d => d.id),
      [stack1.artifactId]);

    test.done();
  },

  'Assemblies can be deeply nested'(test: Test) {
    // GIVEN
    const app = new App({ treeMetadata: false });

    const level1 = new Stage(app, 'StageLevel1');
    const level2 = new Stage(level1, 'StageLevel2');
    new Stage(level2, 'StageLevel3');

    // WHEN
    const rootAssembly = app.synth();

    // THEN
    test.deepEqual(rootAssembly.manifest.artifacts, {
      'assembly-StageLevel1': {
        type: 'cdk:cloud-assembly',
        properties: {
          directoryName: 'assembly-StageLevel1',
          displayName: 'StageLevel1',
        },
      },
    });

    const assemblyLevel1 = rootAssembly.getNestedAssembly('assembly-StageLevel1');
    test.deepEqual(assemblyLevel1.manifest.artifacts, {
      'assembly-StageLevel1-StageLevel2': {
        type: 'cdk:cloud-assembly',
        properties: {
          directoryName: 'assembly-StageLevel1-StageLevel2',
          displayName: 'StageLevel1/StageLevel2',
        },
      },
    });

    const assemblyLevel2 = assemblyLevel1.getNestedAssembly('assembly-StageLevel1-StageLevel2');
    test.deepEqual(assemblyLevel2.manifest.artifacts, {
      'assembly-StageLevel1-StageLevel2-StageLevel3': {
        type: 'cdk:cloud-assembly',
        properties: {
          directoryName: 'assembly-StageLevel1-StageLevel2-StageLevel3',
          displayName: 'StageLevel1/StageLevel2/StageLevel3',
        },
      },
    });

    test.done();
  },

  'stage name validation'(test: Test) {
    const app = new App();

    new Stage(app, 'abcd');
    new Stage(app, 'abcd123');
    new Stage(app, 'abcd123-588dfjjk');
    new Stage(app, 'abcd123-588dfjjk.sss');
    new Stage(app, 'abcd123-588dfjjk.sss_ajsid');

    test.throws(() => new Stage(app, 'abcd123-588dfjjk.sss_ajsid '), /invalid stage name "abcd123-588dfjjk.sss_ajsid "/);
    test.throws(() => new Stage(app, 'abcd123-588dfjjk.sss_ajsid/dfo'), /invalid stage name "abcd123-588dfjjk.sss_ajsid\/dfo"/);
    test.throws(() => new Stage(app, '&'), /invalid stage name "&"/);
    test.throws(() => new Stage(app, '45hello'), /invalid stage name "45hello"/);
    test.throws(() => new Stage(app, 'f'), /invalid stage name "f"/);

    test.done();
  },

  'outdir cannot be specified for nested stages'(test: Test) {
    // WHEN
    const app = new App();

    // THEN
    test.throws(() => new Stage(app, 'mystage', { outdir: '/tmp/foo/bar' }), /"outdir" cannot be specified for nested stages/);
    test.done();
  },

  'Stage.isStage indicates that a construct is a stage'(test: Test) {
    // WHEN
    const app = new App();
    const stack = new Stack();
    const stage = new Stage(app, 'Stage');

    // THEN
    test.ok(Stage.isStage(stage));
    test.ok(Stage.isStage(app));
    test.ok(!Stage.isStage(stack));
    test.done();
  },

  'Stage.isStage indicates that a construct is a stage based on symbol'(test: Test) {
    // WHEN
    const app = new App();
    const stage = new Stage(app, 'Stage');

    const externalStage = {};
    const STAGE_SYMBOL = Symbol.for('@aws-cdk/core.Stage');
    Object.defineProperty(externalStage, STAGE_SYMBOL, { value: true });

    // THEN
    test.ok(Stage.isStage(stage));
    test.ok(Stage.isStage(app));
    test.ok(Stage.isStage(externalStage));
    test.done();
  },
});

test('missing context in Stages is propagated up to root assembly', () => {
  // GIVEN
  const app = new App();
  const stage = new Stage(app, 'Stage', {
    env: { account: 'account', region: 'region' },
  });
  const stack = new Stack(stage, 'Stack');
  new CfnResource(stack, 'Resource', { type: 'Something' });

  // WHEN
  stack.reportMissingContext({
    key: 'missing-context-key',
    provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
    props: {
      account: 'account',
      region: 'region',
    },
  });

  // THEN
  const assembly = app.synth();

  expect(assembly.manifest.missing).toEqual([
    {
      key: 'missing-context-key',
      provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
      props: {
        account: 'account',
        region: 'region',
      },
    },
  ]);
});

class TouchingAspect implements IAspect {
  public readonly visits = new Array<IConstruct>();
  public visit(node: IConstruct): void {
    this.visits.push(node);
  }
}

class BogusStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new CfnResource(this, 'Resource', {
      type: 'CDK::Test::Resource',
    });
  }
}

function acctRegion(s: Stack) {
  return [s.account, s.region];
}
