import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-service-connect-proxy-log-level');

const cluster = new ecs.Cluster(stack, 'EcsCluster', {
  defaultCloudMapNamespace: {
    name: 'proxyloglevel.local',
    useForServiceConnect: true,
  },
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [{ name: 'api', containerPort: 80 }],
  logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'web' }),
});

new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  serviceConnectConfiguration: {
    services: [{ portMappingName: 'api' }],
    logDriver: ecs.LogDrivers.awsLogs({ streamPrefix: 'sc' }),
    proxyLogLevel: ecs.ServiceConnectProxyLogLevel.DEBUG,
  },
});

new integ.IntegTest(app, 'ServiceConnectProxyLogLevel', {
  testCases: [stack],
});
