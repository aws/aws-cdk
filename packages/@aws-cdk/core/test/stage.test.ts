import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, IConstruct } from 'constructs';
import { App, CfnResource, IAspect, Stack, Stage, Aspects } from '../lib';

describe('stage', () => {
  test('Stack inherits unspecified part of the env from Stage', () => {
    // GIVEN
    const app = new App();
    const stage = new Stage(app, 'Stage', {
      env: { account: 'account', region: 'region' },
    });

    // WHEN
    const stack1 = new Stack(stage, 'Stack1', { env: { region: 'elsewhere' } });
    const stack2 = new Stack(stage, 'Stack2', { env: { account: 'tnuocca' } });

    // THEN
    expect(acctRegion(stack1)).toEqual(['account', 'elsewhere']);
    expect(acctRegion(stack2)).toEqual(['tnuocca', 'region']);
  });

  test('envs are inherited deeply', () => {
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
    expect(acctRegion(new Stack(innerAcct, 'Stack'))).toEqual(['tnuocca', 'region']);
    expect(acctRegion(new Stack(innerRegion, 'Stack'))).toEqual(['account', 'elsewhere']);
    expect(acctRegion(new Stack(innerNeither, 'Stack'))).toEqual(['account', 'region']);
  });

  test('The Stage Assembly is in the app Assembly\'s manifest', () => {
    // WHEN
    const app = new App();
    const stage = new Stage(app, 'Stage');
    new BogusStack(stage, 'Stack2');

    // THEN -- app manifest contains a nested cloud assembly
    const appAsm = app.synth();

    const artifact = appAsm.artifacts.find(x => x instanceof cxapi.NestedCloudAssemblyArtifact);
    expect(artifact).toBeDefined();
  });

  test('Stacks in Stage are in a different cxasm than Stacks in App', () => {
    // WHEN
    const app = new App();
    const stack1 = new BogusStack(app, 'Stack1');
    const stage = new Stage(app, 'Stage');
    const stack2 = new BogusStack(stage, 'Stack2');

    // THEN
    const stageAsm = stage.synth();
    expect(stageAsm.stacks.map(s => s.stackName)).toEqual([stack2.stackName]);

    const appAsm = app.synth();
    expect(appAsm.stacks.map(s => s.stackName)).toEqual([stack1.stackName]);
  });

  test('Can nest Stages inside other Stages', () => {
    // WHEN
    const app = new App();
    const outer = new Stage(app, 'Outer');
    const inner = new Stage(outer, 'Inner');
    const stack = new BogusStack(inner, 'Stack');

    // WHEN
    const appAsm = app.synth();
    const outerAsm = appAsm.getNestedAssembly(outer.artifactId);
    const innerAsm = outerAsm.getNestedAssembly(inner.artifactId);

    expect(innerAsm.tryGetArtifact(stack.artifactId)).toBeDefined();
  });

  test('Default stack name in Stage objects incorporates the Stage name and no hash', () => {
    // WHEN
    const app = new App();
    const stage = new Stage(app, 'MyStage');
    const stack = new BogusStack(stage, 'MyStack');

    // THEN
    expect(stage.stageName).toEqual('MyStage');
    expect(stack.stackName).toEqual('MyStage-MyStack');
  });

  test('Can not have dependencies to stacks outside the nested asm', () => {
    // GIVEN
    const app = new App();
    const stack1 = new BogusStack(app, 'Stack1');
    const stage = new Stage(app, 'MyStage');
    const stack2 = new BogusStack(stage, 'Stack2');

    // WHEN
    expect(() => {
      stack2.addDependency(stack1);
    }).toThrow(/dependency cannot cross stage boundaries/);
  });

  test('When we synth() a stage, aspects inside it must have been applied', () => {
    // GIVEN
    const app = new App();
    const stage = new Stage(app, 'MyStage');
    const stack = new BogusStack(stage, 'Stack');

    // WHEN
    const aspect = new TouchingAspect();
    Aspects.of(stack).add(aspect);

    // THEN
    app.synth();
    expect(aspect.visits.map(c => c.node.path)).toEqual([
      'MyStage/Stack',
      'MyStage/Stack/Resource',
    ]);
  });

  test('Aspects do not apply inside a Stage', () => {
    // GIVEN
    const app = new App();
    const stage = new Stage(app, 'MyStage');
    new BogusStack(stage, 'Stack');

    // WHEN
    const aspect = new TouchingAspect();
    Aspects.of(app).add(aspect);

    // THEN
    app.synth();
    expect(aspect.visits.map(c => c.node.path)).toEqual([
      '',
      'Tree',
    ]);
  });

  test('Automatic dependencies inside a stage are available immediately after synth', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
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
    expect(
      asm.getStackArtifact(stack2.artifactId).dependencies.map(d => d.id)).toEqual(
      [stack1.artifactId]);
  });

  test('Assemblies can be deeply nested', () => {
    // GIVEN
    const app = new App({ treeMetadata: false });

    const level1 = new Stage(app, 'StageLevel1');
    const level2 = new Stage(level1, 'StageLevel2');
    new Stage(level2, 'StageLevel3');

    // WHEN
    const rootAssembly = app.synth();

    // THEN
    expect(rootAssembly.manifest.artifacts).toEqual({
      'assembly-StageLevel1': {
        type: 'cdk:cloud-assembly',
        properties: {
          directoryName: 'assembly-StageLevel1',
          displayName: 'StageLevel1',
        },
      },
    });

    const assemblyLevel1 = rootAssembly.getNestedAssembly('assembly-StageLevel1');
    expect(assemblyLevel1.manifest.artifacts).toEqual({
      'assembly-StageLevel1-StageLevel2': {
        type: 'cdk:cloud-assembly',
        properties: {
          directoryName: 'assembly-StageLevel1-StageLevel2',
          displayName: 'StageLevel1/StageLevel2',
        },
      },
    });

    const assemblyLevel2 = assemblyLevel1.getNestedAssembly('assembly-StageLevel1-StageLevel2');
    expect(assemblyLevel2.manifest.artifacts).toEqual({
      'assembly-StageLevel1-StageLevel2-StageLevel3': {
        type: 'cdk:cloud-assembly',
        properties: {
          directoryName: 'assembly-StageLevel1-StageLevel2-StageLevel3',
          displayName: 'StageLevel1/StageLevel2/StageLevel3',
        },
      },
    });
  });

  test('stage name validation', () => {
    const app = new App();

    new Stage(app, 'abcd');
    new Stage(app, 'abcd123');
    new Stage(app, 'abcd123-588dfjjk');
    new Stage(app, 'abcd123-588dfjjk.sss');
    new Stage(app, 'abcd123-588dfjjk.sss_ajsid');

    expect(() => new Stage(app, 'abcd123-588dfjjk.sss_ajsid ')).toThrow(/invalid stage name "abcd123-588dfjjk.sss_ajsid "/);
    expect(() => new Stage(app, 'abcd123-588dfjjk.sss_ajsid/dfo')).toThrow(/invalid stage name "abcd123-588dfjjk.sss_ajsid\/dfo"/);
    expect(() => new Stage(app, '&')).toThrow(/invalid stage name "&"/);
    expect(() => new Stage(app, '45hello')).toThrow(/invalid stage name "45hello"/);
    expect(() => new Stage(app, 'f')).toThrow(/invalid stage name "f"/);
  });

  test('outdir cannot be specified for nested stages', () => {
    // WHEN
    const app = new App();

    // THEN
    expect(() => new Stage(app, 'mystage', { outdir: '/tmp/foo/bar' })).toThrow(/"outdir" cannot be specified for nested stages/);
  });

  test('Stage.isStage indicates that a construct is a stage', () => {
    // WHEN
    const app = new App();
    const stack = new Stack();
    const stage = new Stage(app, 'Stage');

    // THEN
    expect(Stage.isStage(stage)).toEqual(true);
    expect(Stage.isStage(app)).toEqual(true);
    expect(Stage.isStage(stack)).toEqual(false);
  });

  test('Stage.isStage indicates that a construct is a stage based on symbol', () => {
    // WHEN
    const app = new App();
    const stage = new Stage(app, 'Stage');

    const externalStage = {};
    const STAGE_SYMBOL = Symbol.for('@aws-cdk/core.Stage');
    Object.defineProperty(externalStage, STAGE_SYMBOL, { value: true });

    // THEN
    expect(Stage.isStage(stage)).toEqual(true);
    expect(Stage.isStage(app)).toEqual(true);
    expect(Stage.isStage(externalStage)).toEqual(true);
  });
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
  stack.reportMissingContextKey({
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
        lookupRoleArn: 'arn:${AWS::Partition}:iam::account:role/cdk-hnb659fds-lookup-role-account-region',
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
