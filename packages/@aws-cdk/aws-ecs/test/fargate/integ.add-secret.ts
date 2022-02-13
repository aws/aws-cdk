/*
 * Stack verification steps:
 * * The Fargate service should reach a steady state.
 */

import * as ec2 from '@aws-cdk/aws-ec2';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });
const secret = new secretsmanager.Secret(stack, 'Secret');
const secretField = new secretsmanager.Secret(stack, 'SecretField', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ username: 'user' }),
    generateStringKey: 'password',
  },
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512,
});

const container = taskDefinition.addContainer('nginx', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP,
});

const securityGroup = new ec2.SecurityGroup(stack, 'websvc-sg', { vpc });
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  securityGroup,
  assignPublicIp: true,
});

container.addSecret('ADDED_FIRST_SECRET', ecs.Secret.fromSecretsManager(secret));
container.addSecret('ADDED_SECOND_SECRET_FIELD', ecs.Secret.fromSecretsManager(secretField, 'password'));

app.synth();
