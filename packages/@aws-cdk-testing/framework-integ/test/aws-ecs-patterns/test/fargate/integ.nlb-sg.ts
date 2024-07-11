import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new cdk.Stack(app, 'aws-ecs-integ-lb-fargate');

// Create VPC and cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });
const securityGroupNlb = new ec2.SecurityGroup(stack, 'SecurityGroupNlb', {
  vpc,
  allowAllOutbound: true,
});
securityGroupNlb.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcpRange(32768, 65535));
const securityGroupService = new ec2.SecurityGroup(stack, 'SecurityGroupService', {
  vpc,
  allowAllOutbound: true,
});
securityGroupService.addIngressRule(ec2.Peer.securityGroupId(securityGroupNlb.securityGroupId), ec2.Port.allTcp());

// Create NLB service with security group
const networkLoadBalancedFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBFargateService', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  securityGroups: [securityGroupService],
});
networkLoadBalancedFargateService.loadBalancer.connections.addSecurityGroup(securityGroupNlb);

new integ.IntegTest(app, 'l3FargateTest', {
  testCases: [stack],
});

app.synth();
