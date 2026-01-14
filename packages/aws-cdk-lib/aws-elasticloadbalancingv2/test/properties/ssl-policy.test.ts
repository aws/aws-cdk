// Feature: pr-36297-code-review-refactoring
// Property-based tests for SSL policy calculation logic
import * as fc from 'fast-check';
import { Template } from '../../../assertions';
import * as acm from '../../../aws-certificatemanager';
import * as ec2 from '../../../aws-ec2';
import * as cdk from '../../../core';
import * as cxapi from '../../../cx-api';
import * as elbv2 from '../../lib';

// Helper function to create a certificate
function createCertificate(stack: cdk.Stack): acm.ICertificate {
  return acm.Certificate.fromCertificateArn(
    stack,
    'Cert',
    'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
  );
}

// Arbitrary generators
const arbSslPolicy = fc.constantFrom(
  elbv2.SslPolicy.RECOMMENDED,
  elbv2.SslPolicy.RECOMMENDED_TLS,
  elbv2.SslPolicy.TLS13_RES,
  elbv2.SslPolicy.TLS13_EXT1,
  elbv2.SslPolicy.TLS13_EXT2,
  elbv2.SslPolicy.RECOMMENDED_TLS_PQ,
);

const arbApplicationProtocol = fc.constantFrom(
  elbv2.ApplicationProtocol.HTTP,
  elbv2.ApplicationProtocol.HTTPS,
);

const arbNetworkProtocol = fc.constantFrom(
  elbv2.Protocol.TCP,
  elbv2.Protocol.TLS,
  elbv2.Protocol.UDP,
  elbv2.Protocol.TCP_UDP,
);

describe('SSL Policy Property Tests', () => {
  describe('ApplicationListener', () => {
    // Feature: pr-36297-code-review-refactoring, Property 1: Explicit SSL Policy Override
    // Validates: Requirements 1.2
    test('Property 1: Explicit SSL policy overrides feature flag', () => {
      fc.assert(fc.property(
        arbSslPolicy,
        arbApplicationProtocol,
        fc.boolean(),
        (explicitPolicy, protocol, featureFlagEnabled) => {
          // GIVEN
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: featureFlagEnabled,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

          // WHEN
          const listenerProps: any = {
            port: protocol === elbv2.ApplicationProtocol.HTTPS ? 443 : 80,
            protocol,
            sslPolicy: explicitPolicy,
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TG', { vpc, port: 80 })],
          };

          if (protocol === elbv2.ApplicationProtocol.HTTPS) {
            listenerProps.certificates = [createCertificate(stack)];
          }

          lb.addListener('Listener', listenerProps);

          // THEN
          const template = Template.fromStack(stack);
          template.hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            SslPolicy: explicitPolicy,
          });

          return true;
        },
      ), { numRuns: 100 });
    });

    // Feature: pr-36297-code-review-refactoring, Property 2: Post-Quantum TLS Application
    // Validates: Requirements 1.3
    test('Property 2: Post-quantum TLS policy applied when feature flag enabled', () => {
      fc.assert(fc.property(
        fc.constant(elbv2.ApplicationProtocol.HTTPS),
        (protocol) => {
          // GIVEN
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: true,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

          // WHEN - No explicit SSL policy provided
          lb.addListener('Listener', {
            port: 443,
            protocol,
            certificates: [createCertificate(stack)],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TG', { vpc, port: 80 })],
          });

          // THEN
          const template = Template.fromStack(stack);
          template.hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            SslPolicy: elbv2.SslPolicy.RECOMMENDED_TLS_PQ,
          });

          return true;
        },
      ), { numRuns: 100 });
    });

    // Feature: pr-36297-code-review-refactoring, Property 3: Non-Secure Protocol Handling
    // Validates: Requirements 1.4
    test('Property 3: HTTP listeners have no SSL policy regardless of feature flag', () => {
      fc.assert(fc.property(
        fc.boolean(),
        (featureFlagEnabled) => {
          // GIVEN
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: featureFlagEnabled,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

          // WHEN - HTTP protocol, no explicit SSL policy
          lb.addListener('Listener', {
            port: 80,
            protocol: elbv2.ApplicationProtocol.HTTP,
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TG', { vpc, port: 80 })],
          });

          // THEN
          const template = Template.fromStack(stack);
          const listeners = template.findResources('AWS::ElasticLoadBalancingV2::Listener');
          const listener = Object.values(listeners)[0];

          return !listener.Properties.hasOwnProperty('SslPolicy');
        },
      ), { numRuns: 100 });
    });

    // Feature: pr-36297-code-review-refactoring, Property 4: Feature Flag Disabled Behavior
    // Validates: Requirements 1.5
    test('Property 4: No SSL policy when feature flag disabled and no explicit policy', () => {
      fc.assert(fc.property(
        fc.constant(elbv2.ApplicationProtocol.HTTPS),
        (protocol) => {
          // GIVEN
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: false,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

          // WHEN - HTTPS protocol, no explicit SSL policy, feature flag disabled
          lb.addListener('Listener', {
            port: 443,
            protocol,
            certificates: [createCertificate(stack)],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TG', { vpc, port: 80 })],
          });

          // THEN
          const template = Template.fromStack(stack);
          const listeners = template.findResources('AWS::ElasticLoadBalancingV2::Listener');
          const listener = Object.values(listeners)[0];

          // When feature flag is disabled, CloudFormation will use its default SSL policy
          // So we should not have an explicit SslPolicy property in the template
          return !listener.Properties.hasOwnProperty('SslPolicy');
        },
      ), { numRuns: 100 });
    });
  });

  describe('NetworkListener', () => {
    // Feature: pr-36297-code-review-refactoring, Property 1: Explicit SSL Policy Override
    // Validates: Requirements 2.2
    test('Property 1: Explicit SSL policy overrides feature flag', () => {
      fc.assert(fc.property(
        arbSslPolicy,
        fc.constantFrom(elbv2.Protocol.TLS),
        fc.boolean(),
        (explicitPolicy, protocol, featureFlagEnabled) => {
          // GIVEN
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: featureFlagEnabled,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

          // WHEN
          lb.addListener('Listener', {
            port: 443,
            protocol,
            sslPolicy: explicitPolicy,
            certificates: [createCertificate(stack)],
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'TG', { vpc, port: 80 })],
          });

          // THEN
          const template = Template.fromStack(stack);
          template.hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            SslPolicy: explicitPolicy,
          });

          return true;
        },
      ), { numRuns: 100 });
    });

    // Feature: pr-36297-code-review-refactoring, Property 2: Post-Quantum TLS Application
    // Validates: Requirements 2.3
    test('Property 2: Post-quantum TLS policy applied when feature flag enabled', () => {
      fc.assert(fc.property(
        fc.constant(elbv2.Protocol.TLS),
        (protocol) => {
          // GIVEN
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: true,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

          // WHEN - No explicit SSL policy provided
          lb.addListener('Listener', {
            port: 443,
            protocol,
            certificates: [createCertificate(stack)],
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'TG', { vpc, port: 80 })],
          });

          // THEN
          const template = Template.fromStack(stack);
          template.hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            SslPolicy: elbv2.SslPolicy.RECOMMENDED_TLS_PQ,
          });

          return true;
        },
      ), { numRuns: 100 });
    });

    // Feature: pr-36297-code-review-refactoring, Property 3: Non-Secure Protocol Handling
    // Validates: Requirements 2.4
    test('Property 3: TCP/UDP listeners have no SSL policy regardless of feature flag', () => {
      fc.assert(fc.property(
        fc.constantFrom(elbv2.Protocol.TCP, elbv2.Protocol.UDP),
        fc.boolean(),
        (protocol, featureFlagEnabled) => {
          // GIVEN
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: featureFlagEnabled,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

          // WHEN - TCP/UDP protocol, no explicit SSL policy
          lb.addListener('Listener', {
            port: 80,
            protocol,
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'TG', { vpc, port: 80 })],
          });

          // THEN
          const template = Template.fromStack(stack);
          const listeners = template.findResources('AWS::ElasticLoadBalancingV2::Listener');
          const listener = Object.values(listeners)[0];

          return !listener.Properties.hasOwnProperty('SslPolicy');
        },
      ), { numRuns: 100 });
    });

    // Feature: pr-36297-code-review-refactoring, Property 4: Feature Flag Disabled Behavior
    // Validates: Requirements 2.5
    test('Property 4: No SSL policy when feature flag disabled and no explicit policy', () => {
      fc.assert(fc.property(
        fc.constant(elbv2.Protocol.TLS),
        (protocol) => {
          // GIVEN
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: false,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

          // WHEN - TLS protocol, no explicit SSL policy, feature flag disabled
          lb.addListener('Listener', {
            port: 443,
            protocol,
            certificates: [createCertificate(stack)],
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'TG', { vpc, port: 80 })],
          });

          // THEN
          const template = Template.fromStack(stack);
          const listeners = template.findResources('AWS::ElasticLoadBalancingV2::Listener');
          const listener = Object.values(listeners)[0];

          // When feature flag is disabled, CloudFormation will use its default SSL policy
          // So we should not have an explicit SslPolicy property in the template
          return !listener.Properties.hasOwnProperty('SslPolicy');
        },
      ), { numRuns: 100 });
    });
  });
});
