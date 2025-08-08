
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Role, ManagedPolicy, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as appsignals from '../lib';

const app = new cdk.App();

class InfraStack extends cdk.Stack {
  public readonly taskRole: Role;
  public readonly taskExecutionRole: Role;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.taskRole = new Role(this, 'ECSTaskRole', {
      roleName: `ECSTaskRole-${this.stackName}`,
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'),
      ],
    });

    this.taskExecutionRole = new Role(this, 'ECSTaskExecutionRole', {
      roleName: `ECSTaskExecutionRole-${this.stackName}`,
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
      ],
    });
  }
}

interface ApplicationSignalsStackProps extends cdk.StackProps {
  taskRole: Role;
  taskExecutionRole: Role;
}

class CloudWatchAgentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationSignalsStackProps) {
    super(scope, id, props);

    // Define Task Definition for CloudWatch agent (Daemon)
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'CloudWatchAgentTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
      taskRole: props.taskRole,
      executionRole: props.taskExecutionRole,
    });

    new appsignals.CloudWatchAgentIntegration(this, 'CloudWatchAgentECSIntegration', {
      taskDefinition: taskDefinition,
      containerName: 'ecs-cwagent',
      enableLogging: false,
      cpu: 128,
      memoryLimitMiB: 64,
      portMappings: [
        {
          containerPort: 4316,
          hostPort: 4316,
        },
        {
          containerPort: 2000,
          hostPort: 2000,
        },
      ],
    });
  }
}

class JavaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationSignalsStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'JavaTaskDefinition', {
      taskRole: props.taskRole,
      executionRole: props.taskExecutionRole,
      networkMode: ecs.NetworkMode.HOST,
    });

    taskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-containers/retail-store-sample-cart:1.1.0'),
      memoryLimitMiB: 512,
    });

    new appsignals.ApplicationSignalsIntegration(this, 'JavaECSIntegration', {
      taskDefinition: taskDefinition,
      instrumentation: {
        sdkVersion: appsignals.JavaInstrumentationVersion.V2_10_0,
      },
      serviceName: 'java-demo',
    });
  }
}

const infraStack = new InfraStack(app, 'ApplicationSignalsInfra-Daemon');
const cwaStack = new CloudWatchAgentStack(app, 'ApplicationSignalsCloudWatchAgent-Daemon', {
  taskRole: infraStack.taskRole,
  taskExecutionRole: infraStack.taskExecutionRole,
});

const javaStack = new JavaStack(app, 'ApplicationSignalsJavaApp-Daemon', {
  taskRole: infraStack.taskRole,
  taskExecutionRole: infraStack.taskExecutionRole,
});
javaStack.addDependency(cwaStack);

new integ.IntegTest(app, 'ApplicationSignalsIntegrationECSDaemonTest', {
  testCases: [infraStack, cwaStack, javaStack],
});

app.synth();
