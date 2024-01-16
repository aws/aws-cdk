import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

const backend = new elbv2.ApplicationLoadBalancer(stack, 'Backend', {
  vpc,
});
backend.addListener('Listener', {
  protocol: elbv2.ApplicationProtocol.HTTP,
  defaultAction: elbv2.ListenerAction.fixedResponse(200, {
    contentType: 'application/json',
    messageBody: JSON.stringify({
      Message: 'I am ALB!',
    }),
  }),
});

const nlb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'SG', { vpc }),
  ],
});
nlb.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

const listener = nlb.addListener('Listener', {
  port: 80,
});

const group = listener.addTargets('Target', {
  port: 80,
  targets: [new targets.AlbTarget(backend, 80)],
});
backend.connections.allowFrom(nlb, ec2.Port.tcp(80));

group.configureHealthCheck({
  interval: cdk.Duration.seconds(250),
  timeout: cdk.Duration.seconds(100),
  protocol: elbv2.Protocol.HTTP,
  healthyThresholdCount: 5,
  unhealthyThresholdCount: 2,
});

vpc.publicSubnets.forEach(subnet => group.node.addDependency(subnet));
group.node.addDependency(vpc.internetConnectivityEstablished);

// The target's security group must allow being routed by the LB and the clients.

const test = new integ.IntegTest(app, 'elbv2-integ', {
  testCases: [stack],
});
const call = test.assertions.httpApiCall(`http://${nlb.loadBalancerDnsName}`);
call.expect(integ.ExpectedResult.objectLike({
  status: 200,
  body: {
    Message: 'I am ALB!',
  },
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(3),
});

app.synth();
