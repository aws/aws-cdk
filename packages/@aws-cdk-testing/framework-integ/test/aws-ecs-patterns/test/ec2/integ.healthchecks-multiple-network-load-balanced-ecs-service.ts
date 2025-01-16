import { InstanceType, Vpc, Peer, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { AsgCapacityProvider, Cluster, ContainerImage, EcsOptimizedImage } from 'aws-cdk-lib/aws-ecs';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { NetworkMultipleTargetGroupsEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
  },
});
const stack = new Stack(app, 'aws-ecs-integ-nlb-healthchecks');
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
const networkMultipleTargetGroupsFargateService = new NetworkMultipleTargetGroupsEc2Service(stack, 'myService', {
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

networkMultipleTargetGroupsFargateService.targetGroups[0].configureHealthCheck({});

networkMultipleTargetGroupsFargateService.targetGroups[1].configureHealthCheck({});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
