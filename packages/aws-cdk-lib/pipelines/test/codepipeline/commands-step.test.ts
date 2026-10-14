import { Match, Template } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as cp from '../../../aws-codepipeline';
import * as cpa from '../../../aws-codepipeline-actions';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import { Stack } from '../../../core';
import * as cdkp from '../../lib';
import { AppWithOutput, ModernTestGitHubNpmPipeline, OneStackApp, PIPELINE_ENV, TestApp } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

function v2Pipeline(props: Partial<cdkp.CodePipelineProps> = {}) {
  return new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    pipelineType: cp.PipelineType.V2,
    ...props,
  });
}

function stageActions(stageName: string): any[] {
  const pipelines = Template.fromStack(pipelineStack).findResources('AWS::CodePipeline::Pipeline');
  const pipeline = Object.values(pipelines)[0];
  const stage = pipeline.Properties.Stages.find((s: any) => s.Name === stageName);
  if (!stage) {
    throw new Error(`Stage ${stageName} not found`);
  }
  return stage.Actions;
}

function action(stageName: string, actionName: string): any {
  const ret = stageActions(stageName).find((a: any) => a.Name === actionName);
  if (!ret) {
    throw new Error(`Action ${actionName} not found in stage ${stageName}`);
  }
  return ret;
}

describe('CommandsStep', () => {
  test('synthesizes to a Commands action without a CodeBuild project', () => {
    // GIVEN
    const pipeline = v2Pipeline();

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Smoke', { commands: ['echo hello'] })],
    });

    // THEN
    const smoke = action('MyWave', 'Smoke');
    expect(smoke).toEqual({
      Name: 'Smoke',
      ActionTypeId: { Category: 'Compute', Owner: 'AWS', Provider: 'Commands', Version: '1' },
      Commands: ['echo hello'],
      // falls back to the first artifact in the pipeline
      InputArtifacts: [{ Name: 'test_test_Source' }],
      RoleArn: expect.anything(),
      RunOrder: 1,
    });

    // Only the synth and self-mutation projects
    Template.fromStack(pipelineStack).resourceCountIs('AWS::CodeBuild::Project', 2);
  });

  test('uses the primary output of the input as input artifact', () => {
    // GIVEN
    const pipeline = v2Pipeline();
    const build = new cdkp.ShellStep('Build', {
      commands: ['make'],
      primaryOutputDirectory: 'dist',
    });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [build, new cdkp.CommandsStep('Check', { input: build, commands: ['ls'] })],
    });

    // THEN
    expect(action('MyWave', 'Check')).toMatchObject({
      InputArtifacts: [{ Name: 'Build_Output' }],
      RunOrder: 2,
    });
  });

  test('links additional inputs into their directories', () => {
    // GIVEN
    const pipeline = v2Pipeline();

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Check', {
        input: pipeline.gitHubSource,
        additionalInputs: {
          'some/deep/directory': cdkp.CodePipelineSource.gitHub('test2/test2', 'main'),
        },
        commands: ['ls some/deep/directory'],
      })],
    });

    // THEN
    expect(action('MyWave', 'Check')).toMatchObject({
      InputArtifacts: [{ Name: 'test_test_Source' }, { Name: 'test2_test2_Source' }],
      Commands: [
        '[ ! -d "some/deep/directory" ] || { echo \'additionalInputs: "some/deep/directory" must not exist yet. If you want to merge multiple artifacts, use a "cp" command.\'; exit 1; } && mkdir -p -- "some/deep" && ln -s -- "$CODEBUILD_SRC_DIR_test2_test2_Source" "some/deep/directory"',
        'ls some/deep/directory',
      ],
    });
  });

  test('outputFiles produce an output artifact with a Files filter that can be consumed', () => {
    // GIVEN
    const pipeline = v2Pipeline();
    const report = new cdkp.CommandsStep('Report', {
      commands: ['mkdir -p report', 'echo ok > report/result.txt'],
      outputFiles: ['report/**/*'],
    });
    const publish = new cdkp.ShellStep('Publish', {
      input: report,
      commands: ['cat report/result.txt'],
    });

    // WHEN
    pipeline.addWave('MyWave', { post: [report, publish] });

    // THEN
    expect(action('MyWave', 'Report')).toMatchObject({
      OutputArtifacts: [{ Name: 'Report_Output', Files: ['report/**/*'] }],
      RunOrder: 1,
    });
    expect(action('MyWave', 'Publish')).toMatchObject({
      InputArtifacts: [{ Name: 'Report_Output' }],
      RunOrder: 2,
    });
  });

  test('env and envFromCfnOutputs are exported before the commands', () => {
    // GIVEN
    const pipeline = v2Pipeline();
    const myApp = new AppWithOutput(app, 'Alpha');

    // WHEN
    pipeline.addStage(myApp, {
      post: [new cdkp.CommandsStep('Smoke', {
        env: {
          STAGE: 'beta',
          QUOTED: 'it\'s',
          EXECUTION: '#{codepipeline.PipelineExecutionId}',
        },
        envFromCfnOutputs: { BUCKET: myApp.theOutput },
        commands: ['echo "$BUCKET"'],
      })],
    });

    // THEN
    expect(action('Alpha', 'Stack.Deploy')).toMatchObject({
      Namespace: 'AlphaStack6B3389FA',
      RunOrder: 2,
    });
    expect(action('Alpha', 'Smoke')).toMatchObject({
      Commands: [
        'export STAGE=\'beta\'',
        'export QUOTED=\'it\'"\'"\'s\'',
        'export EXECUTION=\'#{codepipeline.PipelineExecutionId}\'',
        'export BUCKET=\'#{AlphaStack6B3389FA.MyOutput}\'',
        'echo "$BUCKET"',
      ],
      RunOrder: 3,
    });
  });

  test('can be used in pre of a stage', () => {
    // GIVEN
    const pipeline = v2Pipeline();

    // WHEN
    pipeline.addStage(new OneStackApp(app, 'Beta'), {
      pre: [new cdkp.CommandsStep('Gate', { commands: ['echo gate'] })],
    });

    // THEN
    expect(action('Beta', 'Gate')).toMatchObject({ RunOrder: 1 });
    expect(action('Beta', 'Stack.Prepare')).toMatchObject({ RunOrder: 2 });
  });

  test('exportedVariable() adds an output variable and a namespace', () => {
    // GIVEN
    const pipeline = v2Pipeline();
    const producer = new cdkp.CommandsStep('Produce', {
      commands: ['export MY_VAR=hello'],
    });
    const consumer = new cdkp.CodeBuildStep('Consume', {
      env: { THE_VAR: producer.exportedVariable('MY_VAR') },
      commands: ['echo "$THE_VAR"'],
    });
    const commandsConsumer = new cdkp.CommandsStep('ConsumeCommands', {
      commands: [`echo "${producer.exportedVariable('MY_VAR')}"`],
    });

    // WHEN
    pipeline.addWave('MyWave', { post: [consumer, commandsConsumer, producer] });

    // THEN
    expect(action('MyWave', 'Produce')).toMatchObject({
      Namespace: 'MyWave@Produce',
      OutputVariables: ['MY_VAR'],
      RunOrder: 1,
    });
    expect(action('MyWave', 'ConsumeCommands')).toMatchObject({
      Commands: ['echo "#{MyWave@Produce.MY_VAR}"'],
      RunOrder: 2,
    });
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'MyWave',
        Actions: Match.arrayWith([Match.objectLike({
          Name: 'Consume',
          RunOrder: 2,
          Configuration: Match.objectLike({
            EnvironmentVariables: Match.serializedJson(Match.arrayWith([{
              name: 'THE_VAR',
              type: 'PLAINTEXT',
              value: '#{MyWave@Produce.MY_VAR}',
            }])),
          }),
        })]),
      }]),
    });
  });

  test('can consume the exported variable of a CodeBuildStep', () => {
    // GIVEN
    const pipeline = v2Pipeline();
    const producer = new cdkp.CodeBuildStep('Produce', {
      commands: ['export MY_VAR=hello'],
    });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Consume', {
        env: { THE_VAR: producer.exportedVariable('MY_VAR') },
        commands: ['echo "$THE_VAR"'],
      }), producer],
    });

    // THEN
    expect(action('MyWave', 'Produce')).toMatchObject({ Namespace: 'MyWave@Produce', RunOrder: 1 });
    expect(action('MyWave', 'Consume')).toMatchObject({
      Commands: ['export THE_VAR=\'#{MyWave@Produce.MY_VAR}\'', 'echo "$THE_VAR"'],
      RunOrder: 2,
    });
  });

  test('outputVariables without consumers are exported without a namespace', () => {
    // GIVEN
    const pipeline = v2Pipeline();

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Produce', {
        commands: ['export A=1 B=2'],
        outputVariables: ['A', 'B'],
      })],
    });

    // THEN
    const produce = action('MyWave', 'Produce');
    expect(produce.OutputVariables).toEqual(['A', 'B']);
    expect(produce.Namespace).toBeUndefined();
  });

  test('passes the compute configuration to the action', () => {
    // GIVEN
    const pipeline = v2Pipeline();
    const vpc = new ec2.Vpc(pipelineStack, 'Vpc');

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('InVpc', {
        commands: ['echo hello'],
        environmentType: cpa.CommandsEnvironmentType.LINUX_CONTAINER,
        computeType: codebuild.ComputeType.MEDIUM,
        vpc,
      })],
    });

    // THEN
    expect(action('MyWave', 'InVpc').Configuration).toEqual({
      EnvironmentType: 'LINUX_CONTAINER',
      ComputeType: 'BUILD_GENERAL1_MEDIUM',
      VpcId: { Ref: 'Vpc8378EB38' },
      Subnets: expect.anything(),
      SecurityGroupIds: expect.anything(),
    });
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Automatic generated security group for CodePipeline Commands action',
    });
  });

  test('codeBuildDefaults do not apply', () => {
    // GIVEN
    const vpc = new ec2.Vpc(pipelineStack, 'Vpc');
    const pipeline = v2Pipeline({
      codeBuildDefaults: {
        vpc,
        buildEnvironment: { computeType: codebuild.ComputeType.LARGE },
      },
    });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Smoke', { commands: ['echo hello'] })],
    });

    // THEN
    expect(action('MyWave', 'Smoke').Configuration).toBeUndefined();
  });

  test('rolePolicyStatements are added to a role for the action', () => {
    // GIVEN
    const pipeline = v2Pipeline();

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Scan', {
        commands: ['aws ecr describe-repositories'],
        rolePolicyStatements: [new iam.PolicyStatement({
          actions: ['ecr:DescribeRepositories'],
          resources: ['*'],
        })],
      })],
    });

    // THEN
    const template = Template.fromStack(pipelineStack);
    const roles = template.findResources('AWS::IAM::Role');
    const roleId = Object.keys(roles).find(id => id.startsWith('CdkPipelineMyWaveScanCodePipelineActionRole'));
    expect(roleId).toBeDefined();
    expect(action('MyWave', 'Scan').RoleArn).toEqual({ 'Fn::GetAtt': [roleId, 'Arn'] });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([{
          Action: 'ecr:DescribeRepositories',
          Effect: 'Allow',
          Resource: '*',
        }]),
      },
      Roles: [{ Ref: roleId }],
    });
  });

  test('rolePolicyStatements are added to the pipeline role with usePipelineRoleForActions', () => {
    // GIVEN
    const pipeline = v2Pipeline({ usePipelineRoleForActions: true });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Scan', {
        commands: ['aws ecr describe-repositories'],
        rolePolicyStatements: [new iam.PolicyStatement({
          actions: ['ecr:DescribeRepositories'],
          resources: ['*'],
        })],
      })],
    });
    pipeline.buildPipeline();

    // THEN
    // The template is not synthesized, because a Commands action currently causes a circular
    // dependency with usePipelineRoleForActions (https://github.com/aws/aws-cdk/issues/34522)
    const policy = pipeline.pipeline.role.node.findChild('DefaultPolicy') as iam.Policy;
    expect(pipelineStack.resolve(policy.document.toJSON()).Statement).toEqual(expect.arrayContaining([{
      Action: 'ecr:DescribeRepositories',
      Effect: 'Allow',
      Resource: '*',
    }]));
  });

  test('uses the given actionRole', () => {
    // GIVEN
    const pipeline = v2Pipeline();
    const role = new iam.Role(pipelineStack, 'MyRole', { assumedBy: new iam.AccountRootPrincipal() });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Smoke', { commands: ['echo hello'], actionRole: role })],
    });

    // THEN
    expect(action('MyWave', 'Smoke').RoleArn).toEqual({ 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] });
  });

  test('works with an existing V2 pipeline', () => {
    // GIVEN
    const codePipeline = new cp.Pipeline(pipelineStack, 'CodePipeline', { pipelineType: cp.PipelineType.V2 });
    const pipeline = new cdkp.CodePipeline(pipelineStack, 'Cdk', {
      codePipeline,
      synth: new cdkp.ShellStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
        commands: ['npx cdk synth'],
      }),
    });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [new cdkp.CommandsStep('Smoke', { commands: ['echo hello'] })],
    });

    // THEN
    expect(action('MyWave', 'Smoke').ActionTypeId.Provider).toEqual('Commands');
  });

  describe('validation', () => {
    test.each([
      ['an explicit V1 pipeline', { pipelineType: cp.PipelineType.V1 }],
      ['a pipeline without a pipeline type', {}],
    ])('throws in %s', (_, props) => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', props);
      pipeline.addWave('MyWave', {
        post: [new cdkp.CommandsStep('Smoke', { commands: ['echo hello'] })],
      });

      expect(() => Template.fromStack(pipelineStack)).toThrow(/CommandsStep 'Smoke' can only be used in a pipeline of type V2/);
    });

    test('throws in an existing V1 pipeline', () => {
      const codePipeline = new cp.Pipeline(pipelineStack, 'CodePipeline', { pipelineType: cp.PipelineType.V1 });
      const pipeline = new cdkp.CodePipeline(pipelineStack, 'Cdk', {
        codePipeline,
        synth: new cdkp.ShellStep('Synth', {
          input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
          commands: ['npx cdk synth'],
        }),
      });
      pipeline.addWave('MyWave', {
        post: [new cdkp.CommandsStep('Smoke', { commands: ['echo hello'] })],
      });

      expect(() => Template.fromStack(pipelineStack)).toThrow(/can only be used in a pipeline of type V2/);
    });

    test('cannot be used as the synth step', () => {
      // The output artifact of a Commands action keeps the paths of the files, so
      // the cloud assembly would not be at the root of the artifact
      new cdkp.CodePipeline(pipelineStack, 'Cdk', {
        pipelineType: cp.PipelineType.V2,
        synth: new cdkp.CommandsStep('Synth', {
          input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
          commands: ['npx cdk synth'],
          outputFiles: ['cdk.out/**/*'],
        }),
      });

      expect(() => Template.fromStack(pipelineStack)).toThrow(/CommandsStep 'Synth' cannot be used as the synth step/);
    });

    test('requires at least one command', () => {
      expect(() => new cdkp.CommandsStep('Smoke', { commands: [] })).toThrow(/'commands' must contain at least one command/);
    });

    test('rejects multi-line commands', () => {
      expect(() => new cdkp.CommandsStep('Smoke', { commands: ['echo a\necho b'] })).toThrow(/does not support multi-line commands/);
    });

    test('rejects commands over 1000 characters', () => {
      expect(() => new cdkp.CommandsStep('Smoke', { commands: ['x'.repeat(1001)] })).toThrow(/at most 1000 characters long, got 1001/);
    });

    test('counts generated commands towards the limit of 50 commands', () => {
      const commands = Array.from({ length: 49 }, (_, i) => `echo ${i}`);
      expect(() => new cdkp.CommandsStep('Smoke', { commands })).not.toThrow();
      expect(() => new cdkp.CommandsStep('Smoke', {
        commands,
        env: { A: 'a', B: 'b' },
      })).toThrow(/supports at most 50 commands, got 51 \(49 commands, 2 environment variables and 0 additional inputs/);
    });

    test.each([[[]], [Array.from({ length: 11 }, (_, i) => `f${i}`)]])('rejects %j outputFiles', (outputFiles) => {
      expect(() => new cdkp.CommandsStep('Smoke', { commands: ['ls'], outputFiles })).toThrow(/'outputFiles' must contain between 1 and 10 patterns/);
    });

    test('rejects more than 15 output variables', () => {
      const outputVariables = Array.from({ length: 15 }, (_, i) => `V${i}`);
      const step = new cdkp.CommandsStep('Smoke', { commands: ['ls'], outputVariables });
      expect(() => step.exportedVariable('V15')).toThrow(/between 1 and 15 output variables, got 16/);
      // the rejected variable is not added, and an already exported variable can still be referenced
      expect(step.outputVariables).toEqual(outputVariables);
      expect(() => step.exportedVariable('V14')).not.toThrow();
      expect(() => new cdkp.CommandsStep('Smoke', { commands: ['ls'], outputVariables: [] })).toThrow(/between 1 and 15 output variables, got 0/);
    });

    test('rejects more than 9 additional inputs', () => {
      const additionalInputs: Record<string, cdkp.IFileSetProducer> = {};
      for (let i = 0; i < 10; i++) {
        additionalInputs[`dir${i}`] = cdkp.CodePipelineSource.gitHub(`test/repo${i}`, 'main');
      }
      expect(() => new cdkp.CommandsStep('Smoke', { commands: ['ls'], additionalInputs })).toThrow(/at most 9 additional inputs, got 10/);
    });

    test('rejects invalid environment variable names', () => {
      expect(() => new cdkp.CommandsStep('Smoke', { commands: ['ls'], env: { 'MY-VAR': 'x' } })).toThrow(/environment variable names must start with a letter or underscore/);
    });

    test('rejects generated commands in a Windows environment', () => {
      expect(() => new cdkp.CommandsStep('Smoke', {
        commands: ['dir'],
        env: { A: 'a' },
        environmentType: cpa.CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER,
        computeType: codebuild.ComputeType.MEDIUM,
      })).toThrow(/only supported in a Linux environment/);
    });

    test('cannot add exported variables after the pipeline has been built', () => {
      const pipeline = v2Pipeline();
      const step = new cdkp.CommandsStep('Produce', { commands: ['export A=1'], outputVariables: ['A'] });
      pipeline.addWave('MyWave', { post: [step] });
      pipeline.buildPipeline();

      expect(step.exportedVariable('A')).toBeDefined();
      expect(() => step.exportedVariable('B')).toThrow(/Pipeline has already been produced/);
    });
  });
});
