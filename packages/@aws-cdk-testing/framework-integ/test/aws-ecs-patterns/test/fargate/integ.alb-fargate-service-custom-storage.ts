import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack, Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new Stack(app, 'aws-ecs-patterns-alb-with-custom-storage');
const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

new ApplicationLoadBalancedFargateService(stack, 'ALBServiceWithCustomStorage', {
  vpc,
  memoryLimitMiB: 512,
  ephemeralStorageGiB: 35,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  assignPublicIp: true,
  healthCheck: {
    command: ['CMD-SHELL', 'curl -f http://localhost/ || exit 1'],
    interval: Duration.seconds(10),
    retries: 10,
  },
});

new integ.IntegTest(app, 'ApplicationLoadBalancedFargateServiceCustomStorageTest', {
  testCases: [stack],
});

app.synth();
