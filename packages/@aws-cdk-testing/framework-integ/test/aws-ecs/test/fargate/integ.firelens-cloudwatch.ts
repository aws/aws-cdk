import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512,
});

// new container with firelens log driver, firelens log router will be created automatically.
const container = taskDefinition.addContainer('nginx', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
  logging: ecs.LogDrivers.firelens({
    options: {
      Name: 'cloudwatch',
      region: stack.region,
      log_group_name: 'ecs-integ-test',
      auto_create_group: 'true',
      log_stream_prefix: 'nginx',
      log_retention_days: '1',
    },
  }),
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP,
});

// Create a security group that allows tcp @ port 80
const securityGroup = new ec2.SecurityGroup(stack, 'websvc-sg', { vpc });
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  securityGroup,
  assignPublicIp: true,
});

app.synth();
