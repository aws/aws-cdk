import { InstanceType, Vpc, SecurityGroup, Peer, Port } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage, AsgCapacityProvider, EcsOptimizedImage } from 'aws-cdk-lib/aws-ecs';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { Protocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

import { ApplicationMultipleTargetGroupsEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
  },
});
const stack = new Stack(app, 'aws-ecs-integ-multiple-alb-healthchecks');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'Cluster', { vpc });
const securityGroup = new SecurityGroup(stack, 'MyAutoScalingGroupSG', {
  vpc,
  allowAllOutbound: true,
});
securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcpRange(32768, 65535));
const provider = new AsgCapacityProvider(stack, 'MyProvider', {
  autoScalingGroup: new AutoScalingGroup(stack, 'MyAutoScalingGroup', {
    vpc,
    instanceType: new InstanceType('t2.micro'),
    machineImage: EcsOptimizedImage.amazonLinux2(),
    securityGroup,
  }),
  capacityProviderName: 'my-capacity-provider',
});
cluster.addAsgCapacityProvider(provider);

// Two load balancers with two listeners and two target groups.
const applicationMultipleTargetGroupsFargateService = new ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  loadBalancers: [
    {
      name: 'lb1',
      listeners: [
        {
          name: 'listener1',
        },
      ],
    },
    {
      name: 'lb2',
      listeners: [
        {
          name: 'listener2',
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1',
    },
    {
      containerPort: 80,
      listener: 'listener2',
    },
  ],
});
applicationMultipleTargetGroupsFargateService.loadBalancers[0].connections.addSecurityGroup(securityGroup);
applicationMultipleTargetGroupsFargateService.loadBalancers[1].connections.addSecurityGroup(securityGroup);

applicationMultipleTargetGroupsFargateService.targetGroups[0].configureHealthCheck({
  protocol: Protocol.HTTP,
  healthyThresholdCount: 2,
  unhealthyThresholdCount: 2,
  timeout: Duration.seconds(10),
  interval: Duration.seconds(30),
  healthyHttpCodes: '200',
});

applicationMultipleTargetGroupsFargateService.targetGroups[1].configureHealthCheck({
  protocol: Protocol.HTTP,
  healthyThresholdCount: 2,
  unhealthyThresholdCount: 2,
  timeout: Duration.seconds(10),
  interval: Duration.seconds(30),
  healthyHttpCodes: '200',
});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
