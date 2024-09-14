import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new Stack(app, 'aws-ecs-patterns-alb-with-additional-security-group');
const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const albfs = new ApplicationLoadBalancedFargateService(stack, 'ALBServiceWithAdditionalSecurityGroup', {
  vpc,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

const securityGroupImport = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup2', 'sg-abcdefghijklmnopq');

albfs.service.connections.addSecurityGroup(securityGroupImport);

new integ.IntegTest(app, 'ApplicationLoadBalancedFargateServiceAdditionalSecurityGroupTest', {
  testCases: [stack],
});

app.synth();
