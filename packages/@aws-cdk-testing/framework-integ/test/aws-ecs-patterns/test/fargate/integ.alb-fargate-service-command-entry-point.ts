import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(
  app,
  'aws-ecs-integ-lb-fargate-cmd-entrypoint-test',
);

// Create VPC and cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'TestFargateCluster', { vpc });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc,
  allowAllOutbound: false,
});
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

// Create ALB service with Command and EntryPoint
const applicationLoadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
  stack,
  'ALBFargateServiceWithCommandAndEntryPoint',
  {
    cluster,
    memoryLimitMiB: 512,
    cpu: 256,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/docker/library/httpd:2.4'),
      command: ['/bin/sh -c \"echo \'<html><h1>Amazon ECS Sample App</h1></html>\' >  /usr/local/apache2/htdocs/index.html && httpd-foreground\"'],
      entryPoint: ['sh', '-c'],
    },
  },
);
applicationLoadBalancedFargateService.loadBalancer.connections.addSecurityGroup(securityGroup);

new integ.IntegTest(app, 'AlbFargateServiceWithCommandAndEntryPoint', {
  testCases: [stack],
});

app.synth();
