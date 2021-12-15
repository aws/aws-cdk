import * as ccommit from '@aws-cdk/aws-codecommit';
import { IStage } from '@aws-cdk/aws-codepipeline';
import { EcsDeployAction } from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../../lib';
import { PIPELINE_ENV, TestApp } from '../testhelpers';

let app: TestApp;
let pipelineStack: cdk.Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

const testStageEnvs: Required<cdk.Environment>[] = [
  {
    account: '123456789012',
    region: 'us-east-1',
  },
  {
    account: '234567890123',
    region: 'us-west-2',
  },
];

test('CodePipline ECS Deploy Cross Region/Account with create', () => {
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });

  const cdkInput = cdkp.CodePipelineSource.codeCommit(
    repo,
    'main',
  );
  /**
   * for this example not using additionalInputs, but you could leverage them if your source code
   * is in a different repo.
  */
  const synthStep = new cdkp.ShellStep('Synth', {
    input: cdkInput,
    installCommands: ['npm ci'],
    commands: [
      'npm run build',
      'npx cdk synth',
    ],
  });

  const pipeline = new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: synthStep,
    selfMutation: true,
    crossAccountKeys: true,
  });

  testStageEnvs.forEach((stageEnv) => {
    const stage = new TestEcsCreateStage(
      pipelineStack, `infra-${stageEnv.account}-${stageEnv.region}`,
      {
        env: stageEnv,
      },
    );
    const iStage = pipeline.addStage(stage);
    const ecsDeployStep = new EcsDeployStep(
      `deploy-${stageEnv.account}-${stageEnv.region}`,
      {
        input: synthStep.primaryOutput!,
        serviceArn: stage.serviceArn,
        clusterName: stage.clusterName,
        role: stage.deployRole,
        stack: pipelineStack,
      },
    );
    iStage.addPost(ecsDeployStep);
  });

  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: [
      // source stage
      {},
      // build stage,
      {},
      // mutate stage,
      {},
      // us-east-1
      {
        Actions: [
          // CFN Prepare
          {},
          // CFN Deploy
          {},
          {
            Name: 'deploy-123456789012-us-east-1',
            ActionTypeId: {
              Category: 'Deploy',
              Provider: 'ECS',
            },
            Configuration: {
              ClusterName: 'infra-123456789012-us-eas1ecsstackcluster686cedbf40e1f6ae4bfb',
              ServiceName: 'infra-123456789012-us-easckfargateserviceb61e58e250a4b8f1bc09',
            },
            Region: 'us-east-1',
            RoleArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam:us-east-1:123456789012:role/cdk-hnb659fds-deploy-role-123456789012-us-east-1',
                ],
              ],
            },
            RunOrder: 3,
          },
        ],
      },
      // us-west-2
      {},
    ],
  });
});

test('CodePipline ECS Deploy Cross Region/Account with import of existing service', () => {
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });

  const cdkInput = cdkp.CodePipelineSource.codeCommit(
    repo,
    'main',
  );
  /**
   * for this example not using additionalInputs, but you could leverage them if your source code
   * is in a different repo.
  */
  const synthStep = new cdkp.ShellStep('Synth', {
    input: cdkInput,
    installCommands: ['npm ci'],
    commands: [
      'npm run build',
      'npx cdk synth',
    ],
  });

  const pipeline = new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: synthStep,
    selfMutation: true,
    crossAccountKeys: true,
  });


  testStageEnvs.forEach((stageEnv) => {
    const stage = new TestEcsImportStage(
      pipelineStack, `infra-${stageEnv.account}-${stageEnv.region}`,
      {
        env: stageEnv,
        clusterName: 'cluster-name',
        serviceName: 'service-name',
      },
    );
    const iStage = pipeline.addStage(stage);
    const ecsDeployStep = new EcsDeployStep(
      `deploy-${stageEnv.account}-${stageEnv.region}`,
      {
        input: synthStep.primaryOutput!,
        serviceArn: stage.serviceArn,
        clusterName: stage.clusterName,
        role: stage.deployRole,
        stack: pipelineStack,
      },
    );
    iStage.addPost(ecsDeployStep);
  });

  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: [
      // source stage
      {},
      // build stage,
      {},
      // mutate stage,
      {},
      // us-east-1
      {
        Actions: [
          // CFN Prepare
          {},
          // CFN Deploy
          {},
          {
            Name: 'deploy-123456789012-us-east-1',
            ActionTypeId: {
              Category: 'Deploy',
              Provider: 'ECS',
            },
            Configuration: {
              ClusterName: 'cluster-name',
              ServiceName: 'service-name',
            },
            Region: 'us-east-1',
            RoleArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam:us-east-1:123456789012:role/cdk-hnb659fds-deploy-role-123456789012-us-east-1',
                ],
              ],
            },
            RunOrder: 3,
          },
        ],
      },
      // us-west-2
      {},
    ],
  });
});

class TestEcsCreateStage extends cdk.Stage {
  public readonly serviceArn: string;
  public readonly clusterName: string;
  public readonly deployRole: iam.IRole;
  public constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);
    const ecsStack = new TestEcsCreateStack(this, 'ecsStack', { env: props.env! });
    this.serviceArn = ecsStack.serviceArn;
    this.clusterName = ecsStack.clusterName;
    this.deployRole = ecsStack.deployRole;
  }
}

class TestEcsCreateStack extends cdk.Stack {
  public readonly serviceArn: string;
  public readonly clusterName: string;
  public readonly deployRole: iam.IRole;
  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition');
    taskDefinition.addContainer('MainContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    const vpc = new ec2.Vpc(this, 'VPC');
    const cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      vpc,
    });
    const service = new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      serviceName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
    this.serviceArn = this.formatArn({
      service: 'ecs',
      resource: 'service',
      resourceName: service.serviceName,
    });
    this.clusterName = cluster.clusterName;
    /**
     * In order to allow self-mutation work correctly we leverage the deploy role from the CDK bootstrap here.
     * Additionally there are more permissions required to allow that deploy role to deploy ECS.
     * 'hnb659fds' is the default bootstrap qualifier if you leverage a different qualifer change that.
     */
    const cdkBootstrapQualifier = 'hnb659fds';
    const deployRoleName = `cdk-${cdkBootstrapQualifier}-deploy-role-${props.env!.account!}-${props.env!.region!}`;
    const deployArn = this.formatArn({
      service: 'iam',
      resource: 'role',
      resourceName: deployRoleName,
    });
    this.deployRole = iam.Role.fromRoleArn(
      this,
      'DeployRole',
      deployArn,
    );
    // https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html#how-to-update-role-new-services
    this.deployRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'ecs:DescribeServices',
          'ecs:DescribeTaskDefinition',
          'ecs:DescribeTasks',
          'ecs:ListTasks',
          'ecs:RegisterTaskDefinition',
          'ecs:UpdateService',
        ],
        resources: ['*'],
      }),
    );

    this.deployRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: ['*'],
        conditions: {
          StringEqualsIfExists: {
            'iam:PassedToService': [
              'ec2.amazonaws.com',
              'ecs-tasks.amazonaws.com',
            ],
          },
        },
      }),
    );

  }
}

interface TestEcsImportStageProps extends cdk.StageProps {
  // for this example using clusterName as imports to the stack
  // you should be able import from an export when you created the cluster and stack.
  readonly clusterName: string;
  readonly serviceName: string;
}

class TestEcsImportStage extends cdk.Stage {
  public readonly serviceArn: string;
  public readonly clusterName: string;
  public readonly deployRole: iam.IRole;
  public constructor(scope: Construct, id: string, props: TestEcsImportStageProps) {
    super(scope, id, props);
    const ecsStack = new TestEcsImportStack(this, 'ecsStack',
      {
        env: props.env!,
        clusterName: props.clusterName,
        serviceName: props.serviceName,
      },
    );
    this.serviceArn = ecsStack.serviceArn;
    this.clusterName = ecsStack.clusterName;
    this.deployRole = ecsStack.deployRole;
  }
}

interface TestEcsImportStackProps extends cdk.StackProps {
  // for this example using clusterName as imports to the stack
  // you should be able import from an export when you created the cluster and stack.
  readonly clusterName: string;
  readonly serviceName: string;
}

class TestEcsImportStack extends cdk.Stack {
  public readonly serviceArn: string;
  public readonly clusterName: string;
  public readonly deployRole: iam.IRole;
  public constructor(scope: Construct, id: string, props: TestEcsImportStackProps) {
    super(scope, id, props);
    // import the existing VPC
    const vpc = ec2.Vpc.fromLookup(
      this,
      'VpcLookup',
      {
        isDefault: false,
      },
    );
    const cluster = ecs.Cluster.fromClusterAttributes(this, 'Cluster', {
      vpc: vpc,
      securityGroups: [],
      clusterName: props.clusterName,
    });
    const service = ecs.Ec2Service.fromEc2ServiceAttributes(
      this,
      'importService', {
        serviceName: props.serviceName,
        cluster: cluster,
      },
    );

    this.serviceArn = service.serviceArn;
    this.clusterName = cluster.clusterName;
    /**
     * In order to allow self-mutation work correctly we leverage the deploy role from the CDK bootstrap here.
     * Additionally there are more permissions required to allow that deploy role to deploy ECS.
     * 'hnb659fds' is the default bootstrap qualifier if you leverage a different qualifer change that.
     */
    const cdkBootstrapQualifier = 'hnb659fds';
    const deployRoleName = `cdk-${cdkBootstrapQualifier}-deploy-role-${props.env!.account!}-${props.env!.region!}`;
    const deployArn = this.formatArn({
      service: 'iam',
      resource: 'role',
      resourceName: deployRoleName,
    });
    this.deployRole = iam.Role.fromRoleArn(
      this,
      'DeployRole',
      deployArn,
    );
    // https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html#how-to-update-role-new-services
    this.deployRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'ecs:DescribeServices',
          'ecs:DescribeTaskDefinition',
          'ecs:DescribeTasks',
          'ecs:ListTasks',
          'ecs:RegisterTaskDefinition',
          'ecs:UpdateService',
        ],
        resources: ['*'],
      }),
    );

    this.deployRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: ['*'],
        conditions: {
          StringEqualsIfExists: {
            'iam:PassedToService': [
              'ec2.amazonaws.com',
              'ecs-tasks.amazonaws.com',
            ],
          },
        },
      }),
    );

  }
}

interface EcsDeployStepProps {
  readonly stack: cdk.Stack;
  readonly role: iam.IRole;
  readonly clusterName: string;
  readonly serviceArn: string;
  readonly input: cdkp.IFileSetProducer;
}

// This probably should be created into a default Step like CodeBuildStep
class EcsDeployStep extends cdkp.Step implements cdkp.ICodePipelineActionFactory {
  public readonly input: cdkp.IFileSetProducer;
  public readonly service: ecs.IBaseService;
  public readonly role: iam.IRole;
  public constructor(
    id: string,
    props: EcsDeployStepProps,
  ) {
    super(id);
    this.input = props.input;
    this.role = props.role;

    const fakeVpc = new ec2.Vpc(
      props.stack,
      `fakeVpc-${id}`,
    );

    const importCluster = ecs.Cluster.fromClusterAttributes(
      props.stack,
      `importCluster-${id}`, {
        vpc: fakeVpc,
        securityGroups: [],
        clusterName: props.clusterName,
      },
    );

    this.service = ecs.Ec2Service.fromEc2ServiceAttributes(
      props.stack,
      `importService-${id}`, {
        serviceArn: props.serviceArn,
        cluster: importCluster,
      },
    );
  }
  public produceAction(
    stage: IStage,
    options: cdkp.ProduceActionOptions,
  ): cdkp.CodePipelineActionFactoryResult {
    const ecsDeployAction = new EcsDeployAction({
      actionName: options.actionName,
      runOrder: options.runOrder,
      role: this.role,
      service: this.service,
      // Translate the FileSet into a codepipeline.Artifact
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      input: options.artifacts.toCodePipeline(this.input.primaryOutput!),
    });
    stage.addAction(ecsDeployAction);

    return { runOrdersConsumed: 1 };
  }
}
