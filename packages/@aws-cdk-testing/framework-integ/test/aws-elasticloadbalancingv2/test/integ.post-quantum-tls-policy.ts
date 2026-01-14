#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for post-quantum TLS policy feature flag
 *
 * This test verifies that:
 * 1. ALB HTTPS listeners use post-quantum TLS policy when feature flag is enabled
 * 2. NLB TLS listeners use post-quantum TLS policy when feature flag is enabled
 * 3. CloudFormation templates are generated correctly with the expected SSL policies
 *
 * DEPLOYMENT NOTES:
 * - For snapshot generation: Uses dummy certificate ARN (safe for CI/CD)
 * - For actual deployment: Set CDK_INTEG_CERTIFICATE_ARN with real certificate ARN:
 *   export CDK_INTEG_CERTIFICATE_ARN=arn:aws:acm:us-east-1:YOUR-ACCOUNT:certificate/YOUR-CERT-ID
 *   yarn integ-runner --force test/aws-elasticloadbalancingv2/test/integ.post-quantum-tls-policy.js
 * - The certificate must be validated and in the same region as the deployment
 * - Snapshots will contain dummy ARN, deployment will use real ARN if provided
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-elasticloadbalancingv2:usePostQuantumTlsPolicy': true,
  },
});

const stack = new cdk.Stack(app, 'PostQuantumTlsPolicyIntegStack');

// Create VPC
const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 3,
  natGateways: 1,
});

/**
 * Certificate ARN configuration:
 * - By default: Uses dummy ARN (safe for snapshot generation and CI/CD)
 * - For actual deployment: Set CDK_INTEG_CERTIFICATE_ARN with real validated certificate ARN
 *
 * Example for real deployment:
 * export CDK_INTEG_CERTIFICATE_ARN=arn:aws:acm:us-east-1:YOUR-ACCOUNT:certificate/YOUR-CERT-ID
 *
 * The certificate must be validated and in the same region as the deployment.
 */
const certificateArn = process.env.CDK_INTEG_CERTIFICATE_ARN ?? 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012';

// Application Load Balancer with HTTPS listener (should use post-quantum policy)
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
    messageBody: 'ALB with Post-Quantum TLS Policy',
  }),
});

// Add an HTTP listener for comparison (should not have SSL policy)
alb.addListener('HttpListener', {
  port: 80,
  protocol: elbv2.ApplicationProtocol.HTTP,
  defaultAction: elbv2.ListenerAction.redirect({
    protocol: 'HTTPS',
    port: '443',
    permanent: true,
  }),
});

// Network Load Balancer with TLS listener (should use post-quantum policy)
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

// Add a TCP listener for comparison (should not have SSL policy)
const nlbTcpTargetGroup = new elbv2.NetworkTargetGroup(stack, 'NlbTcpTargetGroup', {
  vpc,
  port: 80,
  protocol: elbv2.Protocol.TCP,
});

nlb.addListener('TcpListener', {
  port: 80,
  protocol: elbv2.Protocol.TCP,
  defaultTargetGroups: [nlbTcpTargetGroup],
});

// Test with explicit SSL policy (should override feature flag)
// Using TLS12 policy to verify that explicit policy overrides the feature flag default
alb.addListener('ExplicitSslListener', {
  port: 8443,
  protocol: elbv2.ApplicationProtocol.HTTPS,
  certificates: [elbv2.ListenerCertificate.fromArn(certificateArn)],
  sslPolicy: elbv2.SslPolicy.TLS12, // Explicit TLS12 policy should override feature flag's post-quantum default
  defaultAction: elbv2.ListenerAction.fixedResponse(200, {
    contentType: 'text/plain',
    messageBody: 'ALB with Explicit TLS12 Policy',
  }),
});

// Output the load balancer DNS names for verification
new cdk.CfnOutput(stack, 'ALBDnsName', {
  value: alb.loadBalancerDnsName,
  description: 'Application Load Balancer DNS name',
});

new cdk.CfnOutput(stack, 'NLBDnsName', {
  value: nlb.loadBalancerDnsName,
  description: 'Network Load Balancer DNS name',
});

// Create integration test - this will deploy and test the stack
new IntegTest(app, 'PostQuantumTlsPolicyIntegTest', {
  testCases: [stack],
  diffAssets: true,
  stackUpdateWorkflow: true, // Enable actual deployment for testing
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false, // Don't rollback on failure for easier debugging
      },
    },
  },
});
