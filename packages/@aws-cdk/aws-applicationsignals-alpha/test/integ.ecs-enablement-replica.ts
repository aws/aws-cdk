
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Role, ManagedPolicy, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { PrivateDnsNamespace } from 'aws-cdk-lib/aws-servicediscovery';
import { Construct } from 'constructs';
import * as appsignals from '../lib';

const app = new cdk.App();

class InfraStack extends cdk.Stack {
  public readonly taskRole: Role;
  public readonly taskExecutionRole: Role;
  public readonly ecsCluster: ecs.Cluster;
  public readonly dnsNamespace: PrivateDnsNamespace;
  public readonly securityGroup: ec2.SecurityGroup;

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

    const vpc = new ec2.Vpc(this, 'ECSVPC', {});
    this.ecsCluster = new ecs.Cluster(this, 'TestCluster', { vpc });
    this.dnsNamespace = new PrivateDnsNamespace(this, 'Namespace', {
      vpc,
      name: 'local',
    });
    this.securityGroup = new ec2.SecurityGroup(this, 'ECSSG', { vpc });
    this.securityGroup.addIngressRule(this.securityGroup, ec2.Port.tcpRange(0, 65535));
  }
}

interface ApplicationSignalsStackProps extends cdk.StackProps {
  taskRole: Role;
  taskExecutionRole: Role;
  ecsCluster: ecs.Cluster;
  dnsNamespace: PrivateDnsNamespace;
  securityGroup: ec2.SecurityGroup;
}

class CloudWatchAgentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationSignalsStackProps) {
    super(scope, id, props);

    // Define Task Definition for CloudWatch agent (Daemon)
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'CloudWatchAgentTaskDefinition', {
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
          name: 'cwagent-4316',
          containerPort: 4316,
          hostPort: 4316,
        },
        {
          name: 'cwagent-2000',
          containerPort: 2000,
          hostPort: 2000,
        },
      ],
    });

    // new ecs.FargateService(this, 'CloudWatchAgentService', {
    //   cluster: props.ecsCluster,
    //   taskDefinition: taskDefinition,
    //   securityGroups: [props.securityGroup],
    //   enableExecuteCommand: true,
    //   serviceConnectConfiguration: {
    //     namespace: props.dnsNamespace.namespaceArn,
    //     services: [{
    //       portMappingName: 'cwagent-4316',
    //       dnsName: 'cwagent-4316-http',
    //       port: 4316,
    //     }, {
    //       portMappingName: 'cwagent-2000',
    //       dnsName: 'cwagent-2000-http',
    //       port: 2000,
    //     }],
    //   },
    //   desiredCount: 1,
    // });
  }
}

class PythonStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationSignalsStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'PythonTaskDefinition', {
      taskRole: props.taskRole,
      executionRole: props.taskExecutionRole,
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
      memoryLimitMiB: 512,
    });

    new appsignals.ApplicationSignalsIntegration(this, 'PythonECSIntegration', {
      taskDefinition: taskDefinition,
      instrumentation: {
        sdkVersion: appsignals.PythonInstrumentationVersion.V0_8_0,
      },
      serviceName: 'python-demo',
      overrideEnvironments: [
        {
          name: appsignals.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT,
          value: 'http://cwagent-4316-http:4316/v1/metrics',
        }, {
          name: appsignals.TraceExporting.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
          value: 'http://cwagent-4316-http:4316/v1/traces',
        }, {
          name: appsignals.TraceExporting.OTEL_TRACES_SAMPLER_ARG,
          value: 'endpoint=http://cwagent-2000-http:2000',
        },
      ],
    });

    new ecs.FargateService(this, 'PythonApp', {
      cluster: props.ecsCluster,
      taskDefinition: taskDefinition,
      securityGroups: [props.securityGroup],
      desiredCount: 1,
      enableExecuteCommand: true,
      serviceConnectConfiguration: {
        namespace: props.dnsNamespace.namespaceArn,
      },
    });
  }
}

const infraStack = new InfraStack(app, 'ApplicationSignalsInfra-Replica');
const cwaStack = new CloudWatchAgentStack(app, 'ApplicationSignalsCloudWatchAgent-Replica', {
  taskRole: infraStack.taskRole,
  taskExecutionRole: infraStack.taskExecutionRole,
  ecsCluster: infraStack.ecsCluster,
  dnsNamespace: infraStack.dnsNamespace,
  securityGroup: infraStack.securityGroup,
});

const pythonStack = new PythonStack(app, 'ApplicationSignalsPythonApp-Replica', {
  taskRole: infraStack.taskRole,
  taskExecutionRole: infraStack.taskExecutionRole,
  ecsCluster: infraStack.ecsCluster,
  dnsNamespace: infraStack.dnsNamespace,
  securityGroup: infraStack.securityGroup,
});
pythonStack.addDependency(cwaStack);

new integ.IntegTest(app, 'ApplicationSignalsIntegrationECSReplicaTest', {
  testCases: [infraStack, cwaStack, pythonStack],
});

app.synth();
