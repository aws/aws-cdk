
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

class JavaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationSignalsStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'JavaTaskDefinition', {
      taskRole: props.taskRole,
      executionRole: props.taskExecutionRole,
      cpu: 1024,
      memoryLimitMiB: 2048,
    });

    taskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-containers/retail-store-sample-cart:1.1.0'),
    });

    new appsignals.ApplicationSignalsIntegration(this, 'JavaECSIntegration', {
      taskDefinition: taskDefinition,
      instrumentation: {
        sdkVersion: appsignals.JavaInstrumentationVersion.V2_10_0,
      },
      serviceName: 'java-demo',
      cloudWatchAgentSidecar: {
        containerName: 'cloudwatch-agent',
        cpu: 256,
        memoryLimitMiB: 512,
      },
    });
  }
}

class PythonStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationSignalsStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'PythonTaskDefinition', {
      taskRole: props.taskRole,
      executionRole: props.taskExecutionRole,
      cpu: 1024,
      memoryLimitMiB: 2048,
    });

    taskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/q0c5s6i7/demo-application:python-remote'),
      command: [
        'sh',
        '-c',
        'python3 manage.py migrate --noinput && python3 manage.py collectstatic --noinput && python3 manage.py runserver 0.0.0.0:8080 --noreload',
      ],
      environment: {
        PYTHONPATH: '/django_remote_app',
        DJANGO_SETTINGS_MODULE: 'django_remote_service.settings',
      },
    });

    new appsignals.ApplicationSignalsIntegration(this, 'PythonECSIntegration', {
      taskDefinition: taskDefinition,
      instrumentation: {
        sdkVersion: appsignals.PythonInstrumentationVersion.V0_8_0,
      },
      serviceName: 'python-demo',
      cloudWatchAgentSidecar: {
        containerName: 'cloudwatch-agent',
        cpu: 256,
        memoryLimitMiB: 512,
      },
    });
  }
}

class DotnetStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationSignalsStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'DotnetTaskDefinition', {
      taskRole: props.taskRole,
      executionRole: props.taskExecutionRole,
      cpu: 2048,
      memoryLimitMiB: 4096,
      runtimePlatform: {
        operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_CORE,
      },
    });

    taskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/dotnet/samples:dotnetapp'),
    });

    new appsignals.ApplicationSignalsIntegration(this, 'DotnetECSIntegration', {
      taskDefinition: taskDefinition,
      instrumentation: {
        sdkVersion: appsignals.DotnetInstrumentationVersion.V1_6_0_WINDOWS2022,
      },
      serviceName: 'dotnet-demo',
      cloudWatchAgentSidecar: {
        containerName: 'cloudwatch-agent',
        cpu: 256,
        memoryLimitMiB: 512,
      },
    });
  }
}

class NodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationSignalsStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'NodeTaskDefinition', {
      taskRole: props.taskRole,
      executionRole: props.taskExecutionRole,
      cpu: 1024,
      memoryLimitMiB: 2048,
    });

    taskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-containers/retail-store-sample-checkout:1.1.0'),
    });

    new appsignals.ApplicationSignalsIntegration(this, 'NodeECSIntegration', {
      taskDefinition: taskDefinition,
      instrumentation: {
        sdkVersion: appsignals.NodeInstrumentationVersion.V0_5_0,
      },
      serviceName: 'node-demo',
      cloudWatchAgentSidecar: {
        containerName: 'cloudwatch-agent',
        cpu: 256,
        memoryLimitMiB: 512,
      },
    });
  }
}

const infraStack = new InfraStack(app, 'ApplicationSignalsInfra-Sidecar');

const dotnetStack = new DotnetStack(app, 'ApplicationSignalsDotnetApp-Sidecar', {
  taskRole: infraStack.taskRole,
  taskExecutionRole: infraStack.taskExecutionRole,
});
const javaStack = new JavaStack(app, 'ApplicationSignalsJavaApp-Sidecar', {
  taskRole: infraStack.taskRole,
  taskExecutionRole: infraStack.taskExecutionRole,
});
const pythonStack = new PythonStack(app, 'ApplicationSignalsPythonApp-Sidecar', {
  taskRole: infraStack.taskRole,
  taskExecutionRole: infraStack.taskExecutionRole,
});
const nodeStack = new NodeStack(app, 'ApplicationSignalsNodeApp-Sidecar', {
  taskRole: infraStack.taskRole,
  taskExecutionRole: infraStack.taskExecutionRole,
});

new integ.IntegTest(app, 'ApplicationSignalsECSSidecarTest', {
  testCases: [infraStack, javaStack, pythonStack, dotnetStack, nodeStack],
});

app.synth();
