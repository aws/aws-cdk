import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': true,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
  },
});
const stack = new cdk.Stack(app, 'aws-ecs-integ-alb-ec2-cmd-entrypoint');

// Create VPC and ECS Cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Ec2Cluster', { vpc });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc,
  allowAllOutbound: true,
});
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcpRange(32768, 65535));

const provider = new ecs.AsgCapacityProvider(stack, 'CapacityProvier', {
  autoScalingGroup: new autoscaling.AutoScalingGroup(
    stack,
    'AutoScalingGroup',
    {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      securityGroup,
    },
  ),
  capacityProviderName: 'test-capacity-provider',
});
cluster.addAsgCapacityProvider(provider);

// Create ALB service with Command and EntryPoint
const applicationLoadBalancedEc2Service = new ecsPatterns.ApplicationLoadBalancedEc2Service(
  stack,
  'ALBECSServiceWithCommandEntryPoint',
  {
    cluster,
    memoryLimitMiB: 512,
    cpu: 256,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/docker/library/httpd:2.4'),
      command: ['/bin/sh -c \"echo \'<html><h1>Amazon ECS Sample App</h1></html>\' >  /usr/local/apache2/htdocs/index.html && httpd-foreground\"'],
      entryPoint: ['sh', '-c'],
    },
    capacityProviderStrategies: [
      {
        capacityProvider: provider.capacityProviderName,
        base: 1,
        weight: 1,
      },
    ],
  },
);
applicationLoadBalancedEc2Service.loadBalancer.connections.addSecurityGroup(securityGroup);

new integ.IntegTest(app, 'AlbEc2ServiceWithCommandAndEntryPoint', {
  testCases: [stack],
});

app.synth();
