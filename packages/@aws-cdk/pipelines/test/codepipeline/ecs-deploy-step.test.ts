import * as ccommit from '@aws-cdk/aws-codecommit';
import * as iam from '@aws-cdk/aws-iam';
import { Stack, Environment } from '@aws-cdk/core';
import * as cdkp from '../../lib';
import { TestApp } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

const pipelineRegion = 'pipeline-region';
const pipelineAccount = 'pipeline-account';
const serviceRegion = 'service-region';
const serviceAccount = 'service-account';

const PIPELINE_ENV = {
  region: pipelineRegion,
  account: pipelineAccount,
};

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

describe('EcsDeployStep Errors correctly', () => {
  test('throws an error when role not provided for cross account', () => {

    const input = new cdkp.ShellStep('Build', { commands: [] });
    expect(() => {
      new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
        clusterName: 'cluster-name',
        serviceArn: `arn:aws:ecs:${pipelineRegion}:${serviceAccount}:service/cluster-name/service-name`,
        input: input,
      });
    }).toThrow(/cross account deployments "role" must be provied/);
  });

  test('throws an error when role provided for different account than service', () => {
    const otherAccountStack = new Stack(app, 'OtherAccountStack', {
      env: {
        account: serviceAccount,
        region: pipelineRegion,
      },
    });
    const deployArn = otherAccountStack.formatArn({
      region: '',
      service: 'iam',
      resource: 'role',
      resourceName: 'deployrole',
    });
    const role = iam.Role.fromRoleArn(
      otherAccountStack,
      'DeployRole',
      deployArn,
    );

    const input = new cdkp.ShellStep('Build', { commands: [] });
    expect(() => {
      new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
        clusterName: 'cluster-name',
        serviceArn: `arn:aws:ecs:${pipelineRegion}:fakeAccount:service/cluster-name/service-name`,
        input: input,
        role: role,
      });
    }).toThrow(/cross account deployments the "role" must be in the same account as the service/);
  });
});

describe('EcsDeployStep works with correct properties', () => {
  test('works with role and service in the same account', () => {
    const otherAccountStack = new Stack(app, 'OtherAccountStack', {
      env: {
        account: serviceAccount,
        region: pipelineRegion,
      },
    });
    const deployArn = otherAccountStack.formatArn({
      region: '',
      service: 'iam',
      resource: 'role',
      resourceName: 'deployrole',
    });
    const role = iam.Role.fromRoleArn(
      otherAccountStack,
      'DeployRole',
      deployArn,
    );

    const input = new cdkp.ShellStep('Build', { commands: [] });
    new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
      clusterName: 'cluster-name',
      serviceArn: `arn:aws:ecs:${pipelineRegion}:${serviceAccount}:service/cluster-name/service-name`,
      input: input,
      role: role,
    });
  });

  test('works with pipeline and service in same account', () => {
    const input = new cdkp.ShellStep('Build', { commands: [] });
    const serviceArn = `arn:aws:ecs:${serviceRegion}:${pipelineAccount}:service/cluster-name/service-name`;
    new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
      clusterName: 'cluster-name',
      serviceArn: serviceArn,
      input: input,
    });
  });
});

interface TestPipelineProps {
  readonly crossAccountKeys: boolean;
}
class TestPipeline {
  public readonly pipeline: cdkp.CodePipeline;
  public readonly input: cdkp.IFileSetProducer;
  public constructor(props: TestPipelineProps) {
    const repo = new ccommit.Repository(pipelineStack, 'Repo', {
      repositoryName: 'MyRepo',
    });
    const cdkInput = cdkp.CodePipelineSource.codeCommit(
      repo,
      'main',
    );
    const input = new cdkp.ShellStep('Synth', {
      commands: [],
      input: cdkInput,
    });
    this.input = input;
    const pipeline = new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
      synth: input,
      crossAccountKeys: props.crossAccountKeys,
    });
    this.pipeline = pipeline;
  }
}
/**
 * TODO follow up on arn format https://docs.aws.amazon.com/AmazonECS/latest/userguide/ecs-account-settings.html
 */

describe('Pipeline Adds work', () => {
  test('Deploy to service in same account and region', () => {
    const testPipeline = new TestPipeline({ crossAccountKeys: false });
    const wave = testPipeline.pipeline.addWave('Deploy');
    const serviceArn = `arn:aws:ecs:${pipelineRegion}:${pipelineAccount}:service/service-name`;
    const ecsDeployStep = new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
      clusterName: 'cluster-name',
      serviceArn: serviceArn,
      input: testPipeline.input,
    });
    wave.addPre(ecsDeployStep);

    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        // source stage
        {
          Name: 'Source',
        },
        // synth build stage,
        {
          Name: 'Build',
        },
        // mutate build stage,
        {
          Name: 'UpdatePipeline',
        },
        // ecs deploy
        {
          Name: 'Deploy',
          Actions: [
            {
              Name: 'DeployStep',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'ECS',
              },
              Configuration: {
                ClusterName: 'cluster-name',
                ServiceName: 'service-name',
              },
              InputArtifacts: [
                {
                  Name: 'Synth_Output',
                },
              ],
              RoleArn: {
                'Fn::GetAtt': [
                  'PipelineDeployDeployStepCodePipelineActionRole0325A75C',
                  'Arn',
                ],
              },
            },
          ],
        },
      ],
    });
  });

  test('Deploy to service in same account and region with imagePath', () => {
    const testPipeline = new TestPipeline({ crossAccountKeys: false });
    const wave = testPipeline.pipeline.addWave('Deploy');
    const serviceArn = `arn:aws:ecs:${pipelineRegion}:${pipelineAccount}:service/service-name`;
    const ecsDeployStep = new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
      clusterName: 'cluster-name',
      serviceArn: serviceArn,
      input: testPipeline.input,
      imagePath: 'imageFile.json',
    });
    wave.addPre(ecsDeployStep);

    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        // source stage
        {
          Name: 'Source',
        },
        // synth build stage,
        {
          Name: 'Build',
        },
        // mutate build stage,
        {
          Name: 'UpdatePipeline',
        },
        // ecs deploy
        {
          Name: 'Deploy',
          Actions: [
            {
              Name: 'DeployStep',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'ECS',
              },
              Configuration: {
                ClusterName: 'cluster-name',
                ServiceName: 'service-name',
                FileName: 'imageFile.json',
              },
              InputArtifacts: [
                {
                  Name: 'Synth_Output',
                },
              ],
              RoleArn: {
                'Fn::GetAtt': [
                  'PipelineDeployDeployStepCodePipelineActionRole0325A75C',
                  'Arn',
                ],
              },
            },
          ],
        },
      ],
    });
  });

  test('Deploy to service in same account different region', () => {
    const testPipeline = new TestPipeline({ crossAccountKeys: false });
    const wave = testPipeline.pipeline.addWave('Deploy');
    const serviceArn = `arn:aws:ecs:${serviceRegion}:${pipelineAccount}:service/service-name`;
    const ecsDeployStep = new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
      clusterName: 'cluster-name',
      serviceArn: serviceArn,
      input: testPipeline.input,
    });
    wave.addPre(ecsDeployStep);

    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        // source stage
        {
          Name: 'Source',
        },
        // synth build stage,
        {
          Name: 'Build',
        },
        // mutate build stage,
        {
          Name: 'UpdatePipeline',
        },
        // ecs deploy
        {
          Name: 'Deploy',
          Actions: [
            {
              Name: 'DeployStep',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'ECS',
              },
              Configuration: {
                ClusterName: 'cluster-name',
                ServiceName: 'service-name',
              },
              InputArtifacts: [
                {
                  Name: 'Synth_Output',
                },
              ],
              Region: serviceRegion,
              RoleArn: {
                'Fn::GetAtt': [
                  'PipelineDeployDeployStepCodePipelineActionRole0325A75C',
                  'Arn',
                ],
              },
            },
          ],
        },
      ],
    });
  });

  test('Deploy to service in different account same region', () => {
    const testPipeline = new TestPipeline({ crossAccountKeys: true });
    const wave = testPipeline.pipeline.addWave('Deploy');
    const otherAccountStack = new Stack(app, 'OtherAccountStack', {
      env: {
        account: serviceAccount,
        region: pipelineRegion,
      },
    });
    const deployArn = otherAccountStack.formatArn({
      region: '',
      service: 'iam',
      resource: 'role',
      resourceName: 'deployrole',
    });
    const role = iam.Role.fromRoleArn(
      otherAccountStack,
      'DeployRole',
      deployArn,
    );

    const serviceArn = `arn:aws:ecs:${pipelineRegion}:${serviceAccount}:service/service-name`;
    const ecsDeployStep = new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
      clusterName: 'cluster-name',
      serviceArn: serviceArn,
      input: testPipeline.input,
      role: role,
    });
    wave.addPre(ecsDeployStep);

    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        // source stage
        {
          Name: 'Source',
        },
        // synth build stage,
        {
          Name: 'Build',
        },
        // mutate build stage,
        {
          Name: 'UpdatePipeline',
        },
        // ecs deploy
        {
          Name: 'Deploy',
          Actions: [
            {
              Name: 'DeployStep',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'ECS',
              },
              Configuration: {
                ClusterName: 'cluster-name',
                ServiceName: 'service-name',
              },
              InputArtifacts: [
                {
                  Name: 'Synth_Output',
                },
              ],
              RoleArn: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    `:iam::${serviceAccount}:role/deployrole`,
                  ],
                ],
              },
            },
          ],
        },
      ],
    });
  });

  test('Deploy to service in different account and different region', () => {
    const testPipeline = new TestPipeline({ crossAccountKeys: true });
    const wave = testPipeline.pipeline.addWave('Deploy');
    const otherAccountStack = new Stack(app, 'OtherAccountStack', {
      env: {
        account: serviceAccount,
        region: serviceRegion,
      },
    });
    const deployArn = otherAccountStack.formatArn({
      region: '',
      service: 'iam',
      resource: 'role',
      resourceName: 'deployrole',
    });
    const role = iam.Role.fromRoleArn(
      otherAccountStack,
      'DeployRole',
      deployArn,
    );

    const serviceArn = `arn:aws:ecs:${serviceRegion}:${serviceAccount}:service/service-name`;
    const ecsDeployStep = new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
      clusterName: 'cluster-name',
      serviceArn: serviceArn,
      input: testPipeline.input,
      role: role,
    });
    wave.addPre(ecsDeployStep);

    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        // source stage
        {
          Name: 'Source',
        },
        // synth build stage,
        {
          Name: 'Build',
        },
        // mutate build stage,
        {
          Name: 'UpdatePipeline',
        },
        // ecs deploy
        {
          Name: 'Deploy',
          Actions: [
            {
              Name: 'DeployStep',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'ECS',
              },
              Configuration: {
                ClusterName: 'cluster-name',
                ServiceName: 'service-name',
              },
              InputArtifacts: [
                {
                  Name: 'Synth_Output',
                },
              ],
              RoleArn: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    `:iam::${serviceAccount}:role/deployrole`,
                  ],
                ],
              },
              Region: serviceRegion,
            },
          ],
        },
      ],
    });
  });
  test('Deploy to service in across multiple accounts and regions', () => {
    const testPipeline = new TestPipeline({ crossAccountKeys: true });
    const stages: Required<Environment>[] = [
      {
        region: serviceRegion,
        account: serviceAccount,
      },
      {
        region: 'service-region2',
        account: 'service-account2',
      },
    ];
    stages.forEach((stageEnv) => {
      const region = stageEnv.region;
      const account = stageEnv.account;
      const wave = testPipeline.pipeline.addWave(`Deploy-${region}-${account}`);
      const otherAccountStack = new Stack(app, `OtherAccountStack-${region}-${account}`, { env: stageEnv });
      const deployArn = otherAccountStack.formatArn({
        region: '',
        service: 'iam',
        resource: 'role',
        resourceName: 'deployrole',
      });
      const role = iam.Role.fromRoleArn(otherAccountStack, 'DeployRole', deployArn);
      const serviceArn = `arn:aws:ecs:${region}:${account}:service/service-name`;
      const ecsDeployStep = new cdkp.EcsDeployStep(pipelineStack, 'DeployStep', {
        clusterName: 'cluster-name',
        serviceArn: serviceArn,
        input: testPipeline.input,
        role: role,
      });
      wave.addPre(ecsDeployStep);
    });

    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        // source stage
        {
          Name: 'Source',
        },
        // synth build stage,
        {
          Name: 'Build',
        },
        // mutate build stage,
        {
          Name: 'UpdatePipeline',
        },
        // ecs deploy service-account and service-region
        {
          Name: `Deploy-${serviceRegion}-${serviceAccount}`,
          Actions: [
            {
              Name: 'DeployStep',
              ActionTypeId: {
                Category: 'Deploy',
                Provider: 'ECS',
              },
              Configuration: {
                ClusterName: 'cluster-name',
                ServiceName: 'service-name',
              },
              InputArtifacts: [
                {
                  Name: 'Synth_Output',
                },
              ],
              RoleArn: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    `:iam::${serviceAccount}:role/deployrole`,
                  ],
                ],
              },
              Region: serviceRegion,
            },
          ],
        },
        // ecs deploy service-account2 and service-region2
        {
          Name: 'Deploy-service-region2-service-account2',
        },
      ],
    });
  });
});