// Feature: pr-36297-code-review-refactoring, Property 5: CloudFormation Template Equivalence
// Validates: Requirements 3.2, 3.3, 3.4
import * as fc from 'fast-check';
import { Template } from '../../../assertions';
import * as acm from '../../../aws-certificatemanager';
import * as ec2 from '../../../aws-ec2';
import * as cdk from '../../../core';
import * as cxapi from '../../../cx-api';
import * as elbv2 from '../../lib';

// Helper function to create a certificate
function createCertificate(stack: cdk.Stack, id: string = 'Cert'): acm.ICertificate {
  return acm.Certificate.fromCertificateArn(
    stack,
    id,
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

describe('CloudFormation Template Equivalence Property Tests', () => {
  describe('ApplicationListener', () => {
    // Feature: pr-36297-code-review-refactoring, Property 5: CloudFormation Template Equivalence
    // Validates: Requirements 3.2, 3.3, 3.4
    test('Property 5: Template structure is consistent across all configurations', () => {
      fc.assert(fc.property(
        fc.option(arbSslPolicy, { nil: undefined }),
        fc.boolean(),
        fc.constantFrom(elbv2.ApplicationProtocol.HTTP, elbv2.ApplicationProtocol.HTTPS),
        (sslPolicy, featureFlagEnabled, protocol) => {
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
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TG', { vpc, port: 80 })],
          };

          if (sslPolicy !== undefined) {
            listenerProps.sslPolicy = sslPolicy;
          }

          if (protocol === elbv2.ApplicationProtocol.HTTPS) {
            listenerProps.certificates = [createCertificate(stack)];
          }

          lb.addListener('Listener', listenerProps);

          // THEN - Verify template structure
          const template = Template.fromStack(stack);
          const listeners = template.findResources('AWS::ElasticLoadBalancingV2::Listener');
          const listener = Object.values(listeners)[0];

          // Verify expected SSL policy behavior
          if (sslPolicy !== undefined) {
            // Explicit SSL policy should always be present
            expect(listener.Properties.SslPolicy).toBe(sslPolicy);
          } else if (protocol === elbv2.ApplicationProtocol.HTTPS && featureFlagEnabled) {
            // Post-quantum TLS should be applied
            expect(listener.Properties.SslPolicy).toBe(elbv2.SslPolicy.RECOMMENDED_TLS_PQ);
          } else {
            // No SSL policy should be present
            expect(listener.Properties).not.toHaveProperty('SslPolicy');
          }

          // Verify protocol is always set correctly
          expect(listener.Properties.Protocol).toBe(protocol);

          // Verify port is always set correctly
          expect(listener.Properties.Port).toBe(listenerProps.port);

          return true;
        },
      ), { numRuns: 100 });
    });
  });

  describe('NetworkListener', () => {
    // Feature: pr-36297-code-review-refactoring, Property 5: CloudFormation Template Equivalence
    // Validates: Requirements 3.2, 3.3, 3.4
    test('Property 5: Template structure is consistent across all configurations', () => {
      fc.assert(fc.property(
        fc.option(arbSslPolicy, { nil: undefined }),
        fc.boolean(),
        fc.constantFrom(elbv2.Protocol.TCP, elbv2.Protocol.TLS, elbv2.Protocol.UDP),
        (sslPolicy, featureFlagEnabled, protocol) => {
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
          const listenerProps: any = {
            port: protocol === elbv2.Protocol.TLS ? 443 : 80,
            protocol,
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'TG', { vpc, port: 80 })],
          };

          if (sslPolicy !== undefined) {
            listenerProps.sslPolicy = sslPolicy;
          }

          if (protocol === elbv2.Protocol.TLS) {
            listenerProps.certificates = [createCertificate(stack)];
          }

          lb.addListener('Listener', listenerProps);

          // THEN - Verify template structure
          const template = Template.fromStack(stack);
          const listeners = template.findResources('AWS::ElasticLoadBalancingV2::Listener');
          const listener = Object.values(listeners)[0];

          // Verify expected SSL policy behavior
          if (sslPolicy !== undefined) {
            // Explicit SSL policy should always be present
            expect(listener.Properties.SslPolicy).toBe(sslPolicy);
          } else if (protocol === elbv2.Protocol.TLS && featureFlagEnabled) {
            // Post-quantum TLS should be applied
            expect(listener.Properties.SslPolicy).toBe(elbv2.SslPolicy.RECOMMENDED_TLS_PQ);
          } else {
            // No SSL policy should be present
            expect(listener.Properties).not.toHaveProperty('SslPolicy');
          }

          // Verify protocol is always set correctly
          expect(listener.Properties.Protocol).toBe(protocol);

          // Verify port is always set correctly
          expect(listener.Properties.Port).toBe(listenerProps.port);

          return true;
        },
      ), { numRuns: 100 });
    });
  });

  describe('Cross-Listener Consistency', () => {
    // Additional property test to verify both listener types behave consistently
    test('Property 5 Extended: Both listener types handle SSL policies consistently', () => {
      fc.assert(fc.property(
        fc.option(arbSslPolicy, { nil: undefined }),
        fc.boolean(),
        (sslPolicy, featureFlagEnabled) => {
          // GIVEN - Create both ALB and NLB with same configuration
          const app = new cdk.App({
            context: {
              [cxapi.ELB_USE_POST_QUANTUM_TLS_POLICY]: featureFlagEnabled,
            },
          });
          const stack = new cdk.Stack(app);
          const vpc = new ec2.Vpc(stack, 'VPC');
          const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });
          const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });

          // WHEN - Add HTTPS/TLS listeners with same SSL policy configuration
          const albProps: any = {
            port: 443,
            protocol: elbv2.ApplicationProtocol.HTTPS,
            certificates: [createCertificate(stack, 'ALBCert')],
            defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'ALBTG', { vpc, port: 80 })],
          };

          const nlbProps: any = {
            port: 443,
            protocol: elbv2.Protocol.TLS,
            certificates: [createCertificate(stack, 'NLBCert')],
            defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'NLBTG', { vpc, port: 80 })],
          };

          if (sslPolicy !== undefined) {
            albProps.sslPolicy = sslPolicy;
            nlbProps.sslPolicy = sslPolicy;
          }

          alb.addListener('ALBListener', albProps);
          nlb.addListener('NLBListener', nlbProps);

          // THEN - Both should have consistent SSL policy behavior
          const template = Template.fromStack(stack);
          const listeners = template.findResources('AWS::ElasticLoadBalancingV2::Listener');
          const listenerArray = Object.values(listeners);

          // Both listeners should have the same SSL policy behavior
          const albListener = listenerArray.find((l: any) => l.Properties.Protocol === 'HTTPS');
          const nlbListener = listenerArray.find((l: any) => l.Properties.Protocol === 'TLS');

          // Ensure both listeners were found
          expect(albListener).toBeDefined();
          expect(nlbListener).toBeDefined();

          if (sslPolicy !== undefined) {
            expect(albListener!.Properties.SslPolicy).toBe(sslPolicy);
            expect(nlbListener!.Properties.SslPolicy).toBe(sslPolicy);
          } else if (featureFlagEnabled) {
            expect(albListener!.Properties.SslPolicy).toBe(elbv2.SslPolicy.RECOMMENDED_TLS_PQ);
            expect(nlbListener!.Properties.SslPolicy).toBe(elbv2.SslPolicy.RECOMMENDED_TLS_PQ);
          } else {
            expect(albListener!.Properties).not.toHaveProperty('SslPolicy');
            expect(nlbListener!.Properties).not.toHaveProperty('SslPolicy');
          }

          return true;
        },
      ), { numRuns: 100 });
    });
  });
});
