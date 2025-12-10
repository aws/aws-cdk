#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

/**
 * Simple test to verify feature flag behavior when disabled
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-elasticloadbalancingv2:usePostQuantumTlsPolicy': false,
  },
});

const stack = new cdk.Stack(app, 'FeatureFlagDisabledStack');

// Create VPC
const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

// Use a dummy certificate ARN for testing
const certificateArn = 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012';

// Application Load Balancer with HTTPS listener (should use legacy policy)
const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc,
  internetFacing: true,
});

alb.addListener('HttpsListener', {
  port: 443,
  protocol: elbv2.ApplicationProtocol.HTTPS,
  certificates: [elbv2.ListenerCertificate.fromArn(certificateArn)],
  defaultAction: elbv2.ListenerAction.fixedResponse(200, {
    contentType: 'text/plain',
    messageBody: 'ALB with Legacy TLS Policy',
  }),
});

// Network Load Balancer with TLS listener (should use legacy policy)
const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
  vpc,
  internetFacing: true,
});

const nlbTargetGroup = new elbv2.NetworkTargetGroup(stack, 'NlbTargetGroup', {
  vpc,
  port: 80,
  protocol: elbv2.Protocol.TCP,
});

nlb.addListener('TlsListener', {
  port: 443,
  protocol: elbv2.Protocol.TLS,
  certificates: [elbv2.ListenerCertificate.fromArn(certificateArn)],
  defaultTargetGroups: [nlbTargetGroup],
});