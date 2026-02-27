import type { IPipe, ISource, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { Pipe } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import type * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { EcsTaskTarget } from '../lib';

class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;
  constructor(private readonly queue: sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }
  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }
  grantRead(pipeRole: iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

/**
 * Fargate (awsvpc) scenario:
 * SQS -> Pipe -> Fargate Task -> SSM Parameter
 */
class FargateScenario extends Construct {
  readonly sourceQueue: sqs.Queue;
  readonly parameterName: string;

  constructor(scope: Construct, id: string, props: { cluster: ecs.ICluster }) {
    super(scope, id);

    this.parameterName = '/pipes/ecs/fargate-test-value';
    this.sourceQueue = new sqs.Queue(this, 'SourceQueue', {
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });

    const parameter = new ssm.StringParameter(this, 'Parameter', {
      parameterName: this.parameterName,
      stringValue: 'initial',
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-cli/aws-cli:latest'),
      entryPoint: ['sh', '-c'],
      command: [
        `aws ssm put-parameter --name ${this.parameterName} --value "$MESSAGE" --overwrite --region ${cdk.Stack.of(this).region}`,
      ],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'fargate' }),
    });

    parameter.grantWrite(taskDefinition.taskRole);

    const pipe = new Pipe(this, 'Pipe', {
      source: new TestSource(this.sourceQueue),
      target: new EcsTaskTarget(props.cluster, {
        taskDefinition,
        containerOverrides: [{
          containerName: 'Container',
          environment: [{ name: 'MESSAGE', value: '$.body' }],
        }],
      }),
    });

    // Suppress false positive - PassRole resources are specific ARNs, not wildcards
    // Guard cannot evaluate Fn::GetAtt in unresolved templates
    const pipeRolePolicy = pipe.node.findChild('Role').node.findChild('DefaultPolicy').node.defaultChild as cdk.CfnResource;
    pipeRolePolicy.addMetadata('guard', {
      SuppressedRules: ['IAM_NO_OVERLY_PERMISSIVE_PASSROLE'],
    });
  }
}

/**
 * EC2 bridge mode scenario:
 * SQS -> Pipe -> EC2 Task (bridge) -> SSM Parameter
 */
class Ec2BridgeScenario extends Construct {
  readonly sourceQueue: sqs.Queue;
  readonly parameterName: string;

  constructor(scope: Construct, id: string, props: { vpc: ec2.IVpc; cluster: ecs.Cluster }) {
    super(scope, id);

    this.parameterName = '/pipes/ecs/ec2-test-value';
    this.sourceQueue = new sqs.Queue(this, 'SourceQueue', {
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });

    const asgProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
      autoScalingGroup: new autoscaling.AutoScalingGroup(this, 'Asg', {
        vpc: props.vpc,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
        machineImage: ecs.EcsOptimizedImage.amazonLinux2023(ecs.AmiHardwareType.ARM),
      }),
      enableManagedTerminationProtection: false,
    });
    props.cluster.addAsgCapacityProvider(asgProvider);

    const parameter = new ssm.StringParameter(this, 'Parameter', {
      parameterName: this.parameterName,
      stringValue: 'initial',
    });

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-cli/aws-cli:latest'),
      entryPoint: ['sh', '-c'],
      command: [
        `aws ssm put-parameter --name ${this.parameterName} --value "$MESSAGE" --overwrite --region ${cdk.Stack.of(this).region}`,
      ],
      memoryLimitMiB: 512,
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'ec2' }),
    });

    parameter.grantWrite(taskDefinition.taskRole);

    const pipe = new Pipe(this, 'Pipe', {
      source: new TestSource(this.sourceQueue),
      target: new EcsTaskTarget(props.cluster, {
        taskDefinition,
        containerOverrides: [{
          containerName: 'Container',
          environment: [{ name: 'MESSAGE', value: '$.body' }],
        }],
      }),
    });

    const pipeRolePolicy = pipe.node.findChild('Role').node.findChild('DefaultPolicy').node.defaultChild as cdk.CfnResource;
    pipeRolePolicy.addMetadata('guard', {
      SuppressedRules: ['IAM_NO_OVERLY_PERMISSIVE_PASSROLE'],
    });
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-ecs');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, natGateways: 1 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const fargate = new FargateScenario(stack, 'Fargate', { cluster });
const ec2Bridge = new Ec2BridgeScenario(stack, 'Ec2Bridge', { vpc, cluster });

const test = new IntegTest(app, 'integtest-pipe-target-ecs', {
  testCases: [stack],
});

// Fargate assertion
test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: fargate.sourceQueue.queueUrl,
  MessageBody: 'fargate-updated',
}).next(
  test.assertions.awsApiCall('SSM', 'getParameter', {
    Name: fargate.parameterName,
  }),
).expect(
  ExpectedResult.objectLike({ Parameter: { Value: 'fargate-updated' } }),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
  interval: cdk.Duration.seconds(15),
});

// EC2 bridge assertion
test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: ec2Bridge.sourceQueue.queueUrl,
  MessageBody: 'ec2-updated',
}).next(
  test.assertions.awsApiCall('SSM', 'getParameter', {
    Name: ec2Bridge.parameterName,
  }),
).expect(
  ExpectedResult.objectLike({ Parameter: { Value: 'ec2-updated' } }),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(30),
});

app.synth();
