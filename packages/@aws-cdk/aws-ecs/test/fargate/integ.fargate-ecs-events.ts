import ec2 = require('@aws-cdk/aws-ec2');
import targets = require('@aws-cdk/aws-events-targets');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import ecs = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 1 });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512
});

const container = taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP
});

const service = new ecs.FargateService(stack, "Service", {
  cluster,
  taskDefinition,
});

const topic = new sns.Topic(stack, 'Topic');

service.onAnyInfoEvent('OnAnyInfoEvent')
  .addTarget(new targets.SnsTopic(topic));
service.onAnyWarnEvent('OnAnyWarnEvent')
  .addTarget(new targets.SnsTopic(topic));
service.onAnyErrorEvent('OnAnyErrorEvent')
  .addTarget(new targets.SnsTopic(topic));
service.onServiceSteadyState('OnServiceSteadyState')
  .addTarget(new targets.SnsTopic(topic));
service.onTaskSetSteadyState('OnTaskSetSteadyState')
  .addTarget(new targets.SnsTopic(topic));
service.onServiceDesiredCountUpdated('OnServiceDesiredCountUpdated')
  .addTarget(new targets.SnsTopic(topic));
service.onServiceTaskStartImpaired('OnServiceTaskStartImpaired')
  .addTarget(new targets.SnsTopic(topic));
service.onServiceDiscoveryInstanceUnhealthy('OnServiceDiscoveryInstanceUnhealthy')
  .addTarget(new targets.SnsTopic(topic));
service.onServiceDaemonPlacementConstraintViolated('OnServiceDaemonPlacementConstraintViolated')
  .addTarget(new targets.SnsTopic(topic));
service.onEcsOperationThrottled('OnEcsOperationThrottled')
  .addTarget(new targets.SnsTopic(topic));
service.onServiceDiscoveryOperationThrottled('OnServiceDiscoveryOperationThrottled')
  .addTarget(new targets.SnsTopic(topic));
service.onServiceTaskPlacementFailured('OnServiceTaskPlacementFailured')
  .addTarget(new targets.SnsTopic(topic));
service.onServiceTaskConfigurationFailure('OnServiceTaskConfigurationFailure')
  .addTarget(new targets.SnsTopic(topic));
service.onEvent('OnEvent')
  .addTarget(new targets.SnsTopic(topic));

app.synth();
