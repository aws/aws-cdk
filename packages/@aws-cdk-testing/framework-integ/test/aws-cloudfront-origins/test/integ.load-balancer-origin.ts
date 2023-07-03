import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-load-balancer-origin');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const loadbalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.LoadBalancerV2Origin(loadbalancer) },
});

app.synth();
