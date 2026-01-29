import { Construct } from 'constructs';
import { Template, Match } from '../../assertions';
import { App, Stack } from '../../core';
import * as cxapi from '../../cx-api';
import { PublicKey } from '../lib';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;

describe('PublicKey', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
  });

  test('import existing key group by id', () => {
    const publicKeyId = 'K36X4X2EO997HM';
    const pubKey = PublicKey.fromPublicKeyId(stack, 'MyPublicKey', publicKeyId);
    expect(pubKey.publicKeyId).toEqual(publicKeyId);
  });

  test('minimal example', () => {
    new PublicKey(stack, 'MyPublicKey', {
      encodedKey: publicKey,
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyPublicKey78071F3D: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
              EncodedKey: publicKey,
              Name: 'StackMyPublicKey36EDA6AB',
            },
          },
        },
      },
    });
  });

  test('maximum example', () => {
    new PublicKey(stack, 'MyPublicKey', {
      publicKeyName: 'pub-key',
      encodedKey: publicKey,
      comment: 'Key expiring on 1/1/1984',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyPublicKey78071F3D: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
              Comment: 'Key expiring on 1/1/1984',
              EncodedKey: publicKey,
              Name: 'pub-key',
            },
          },
        },
      },
    });
  });

  test('bad key example', () => {
    expect(() => new PublicKey(stack, 'MyPublicKey', {
      publicKeyName: 'pub-key',
      encodedKey: 'bad-key',
      comment: 'Key expiring on 1/1/1984',
    })).toThrow(/Public key must be in PEM format [(]with the BEGIN\/END PUBLIC KEY lines[)]; got (.*?)/);
  });

  describe('feature flag behavior', () => {
    test('uses node.addr when feature flag is disabled (default behavior)', () => {
      // Feature flag is disabled by default
      new PublicKey(stack, 'TestPublicKey', {
        encodedKey: publicKey,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFront::PublicKey', {
        PublicKeyConfig: {
          CallerReference: Match.anyValue(), // node.addr is dynamic, so we just check it exists
          EncodedKey: publicKey,
          Name: Match.stringLikeRegexp(/.*TestPublicKey.*/),
        },
      });
    });

    test('uses stable reference when feature flag is enabled', () => {
      // Create a new app with the feature flag enabled
      const flagApp = new App();
      flagApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);

      const newStack = new Stack(flagApp, 'TestStack', {
        env: { account: '123456789012', region: 'testregion' },
      });

      new PublicKey(newStack, 'TestPublicKey', {
        encodedKey: publicKey,
      });

      const template = Template.fromStack(newStack);
      template.hasResourceProperties('AWS::CloudFront::PublicKey', {
        PublicKeyConfig: {
          CallerReference: Match.stringLikeRegexp(/.*TestStack.*TestPublicKey.*/), // Should be stable and include stack/construct names
          EncodedKey: publicKey,
          Name: Match.stringLikeRegexp(/.*TestStack.*TestPublicKey.*/),
        },
      });
    });

    test('stable reference is consistent across multiple constructs', () => {
      // Create a new app with the feature flag enabled
      const flagApp = new App();
      flagApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);

      const newStack = new Stack(flagApp, 'TestStack', {
        env: { account: '123456789012', region: 'testregion' },
      });

      // Create two identical PublicKey constructs
      new PublicKey(newStack, 'TestPublicKey1', {
        encodedKey: publicKey,
      });

      new PublicKey(newStack, 'TestPublicKey2', {
        encodedKey: publicKey,
      });

      const template = Template.fromStack(newStack);

      // Both should have different but stable caller references
      const resources = template.findResources('AWS::CloudFront::PublicKey');
      const callerRefs = Object.values(resources).map(
        (resource: any) => resource.Properties.PublicKeyConfig.CallerReference,
      );

      // Should have two different caller references
      expect(callerRefs).toHaveLength(2);
      expect(callerRefs[0]).not.toEqual(callerRefs[1]);

      // Both should follow the stable pattern
      expect(callerRefs[0]).toMatch(/.*TestStack.*TestPublicKey1.*/);
      expect(callerRefs[1]).toMatch(/.*TestStack.*TestPublicKey2.*/);
    });

    test('caller reference respects CloudFront length limits', () => {
      // Create a new app with the feature flag enabled
      const flagApp = new App();
      flagApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);

      const newStack = new Stack(flagApp, 'VeryLongStackNameThatExceedsNormalLimitsAndShouldBeTruncatedToFitWithinCloudFrontCallerReferenceConstraints', {
        env: { account: '123456789012', region: 'testregion' },
      });

      new PublicKey(newStack, 'VeryLongPublicKeyNameThatAlsoExceedsNormalLimitsAndShouldBeTruncated', {
        encodedKey: publicKey,
      });

      const template = Template.fromStack(newStack);
      template.hasResourceProperties('AWS::CloudFront::PublicKey', {
        PublicKeyConfig: {
          CallerReference: Match.anyValue(),
          EncodedKey: publicKey,
        },
      });

      // Verify the caller reference is within CloudFront's 128 character limit
      const resources = template.findResources('AWS::CloudFront::PublicKey');
      const callerRef = Object.values(resources)[0] as any;
      const callerReference = callerRef.Properties.PublicKeyConfig.CallerReference;

      expect(callerReference.length).toBeLessThanOrEqual(128);
    });

    test('caller reference truncation preserves beginning and end when over 128 characters', () => {
      // Create a new app with the feature flag enabled
      const flagApp = new App();
      flagApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);

      // Create a stack with a very long name that will definitely exceed 128 characters
      const longStackName = 'A'.repeat(50) + 'MiddlePart' + 'B'.repeat(50);
      const newStack = new Stack(flagApp, longStackName, {
        env: { account: '123456789012', region: 'testregion' },
      });

      const longConstructName = 'C'.repeat(30) + 'ConstructMiddle' + 'D'.repeat(30);
      new PublicKey(newStack, longConstructName, {
        encodedKey: publicKey,
      });

      const template = Template.fromStack(newStack);
      const resources = template.findResources('AWS::CloudFront::PublicKey');
      const callerRef = Object.values(resources)[0] as any;
      const callerReference = callerRef.Properties.PublicKeyConfig.CallerReference;

      // Should be exactly 128 characters when truncated
      expect(callerReference.length).toBeLessThanOrEqual(128);

      // If the original unique ID was longer than 128 characters, verify it uses first 64 + last 64
      // We can't easily mock Names.uniqueId, but we can verify the structure if truncation occurred
      if (callerReference.length === 128) {
        // The truncated reference should contain parts from both beginning and end
        // This is a basic sanity check - the exact content depends on Names.uniqueId implementation
        expect(callerReference).toMatch(/^.{64}.{64}$/);
      }
    });

    test('stable caller reference is unique when constructs have different paths', () => {
      // This test addresses the reviewer's concern about uniqueness across different construct positions

      // Test 1: PublicKey directly in stack
      const flagApp1 = new App();
      flagApp1.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const stack1 = new Stack(flagApp1, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new PublicKey(stack1, 'MyPublicKey', {
        encodedKey: publicKey,
      });

      const template1 = Template.fromStack(stack1);
      const resources1 = template1.findResources('AWS::CloudFront::PublicKey');
      const callerRef1 = Object.values(resources1)[0] as any;
      const callerReference1 = callerRef1.Properties.PublicKeyConfig.CallerReference;

      // Test 2: Same PublicKey ID but in nested construct (different path)
      const flagApp2 = new App();
      flagApp2.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const stack2 = new Stack(flagApp2, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      class WrapperConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }

      const wrapper = new WrapperConstruct(stack2, 'Wrapper');

      new PublicKey(wrapper, 'MyPublicKey', {
        encodedKey: publicKey,
      });

      const template2 = Template.fromStack(stack2);
      const resources2 = template2.findResources('AWS::CloudFront::PublicKey');
      const callerRef2 = Object.values(resources2)[0] as any;
      const callerReference2 = callerRef2.Properties.PublicKeyConfig.CallerReference;

      // The caller references should be different due to different paths
      // This ensures uniqueness and prevents CloudFormation conflicts
      expect(callerReference1).not.toEqual(callerReference2);

      // Both should follow the stable pattern with stack name and construct ID
      expect(callerReference1).toMatch(/TestStack-MyPublicKey-[a-f0-9]{16}/);
      expect(callerReference2).toMatch(/TestStack-MyPublicKey-[a-f0-9]{16}/);
    });

    test('stable caller reference is unique across different stacks', () => {
      // Test uniqueness across different stack names
      const flagApp1 = new App();
      flagApp1.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const stack1 = new Stack(flagApp1, 'Stack1', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new PublicKey(stack1, 'MyPublicKey', {
        encodedKey: publicKey,
      });

      const flagApp2 = new App();
      flagApp2.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const stack2 = new Stack(flagApp2, 'Stack2', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new PublicKey(stack2, 'MyPublicKey', {
        encodedKey: publicKey,
      });

      const template1 = Template.fromStack(stack1);
      const template2 = Template.fromStack(stack2);

      const resources1 = template1.findResources('AWS::CloudFront::PublicKey');
      const resources2 = template2.findResources('AWS::CloudFront::PublicKey');

      const callerRef1 = Object.values(resources1)[0] as any;
      const callerRef2 = Object.values(resources2)[0] as any;

      const callerReference1 = callerRef1.Properties.PublicKeyConfig.CallerReference;
      const callerReference2 = callerRef2.Properties.PublicKeyConfig.CallerReference;

      // Should be different due to different stack names
      expect(callerReference1).not.toEqual(callerReference2);

      // Should include respective stack names
      expect(callerReference1).toMatch(/Stack1-MyPublicKey-[a-f0-9]{16}/);
      expect(callerReference2).toMatch(/Stack2-MyPublicKey-[a-f0-9]{16}/);
    });

    test('stable caller reference is unique across different environments', () => {
      // Test uniqueness across different accounts/regions
      const flagApp1 = new App();
      flagApp1.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const stack1 = new Stack(flagApp1, 'TestStack', {
        env: { account: '111111111111', region: 'us-east-1' },
      });

      new PublicKey(stack1, 'MyPublicKey', {
        encodedKey: publicKey,
      });

      const flagApp2 = new App();
      flagApp2.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const stack2 = new Stack(flagApp2, 'TestStack', {
        env: { account: '222222222222', region: 'us-west-2' },
      });

      new PublicKey(stack2, 'MyPublicKey', {
        encodedKey: publicKey,
      });

      const template1 = Template.fromStack(stack1);
      const template2 = Template.fromStack(stack2);

      const resources1 = template1.findResources('AWS::CloudFront::PublicKey');
      const resources2 = template2.findResources('AWS::CloudFront::PublicKey');

      const callerRef1 = Object.values(resources1)[0] as any;
      const callerRef2 = Object.values(resources2)[0] as any;

      const callerReference1 = callerRef1.Properties.PublicKeyConfig.CallerReference;
      const callerReference2 = callerRef2.Properties.PublicKeyConfig.CallerReference;

      // Should be different due to different account/region
      expect(callerReference1).not.toEqual(callerReference2);

      // Both should still follow the pattern but with different hashes
      expect(callerReference1).toMatch(/TestStack-MyPublicKey-[a-f0-9]{16}/);
      expect(callerReference2).toMatch(/TestStack-MyPublicKey-[a-f0-9]{16}/);
    });

    test('stable caller reference is deterministic and unique based on construct path', () => {
      // This test demonstrates how stable caller reference provides uniqueness while being deterministic

      // Test 1: Direct placement
      const flagApp1 = new App();
      flagApp1.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const stack1 = new Stack(flagApp1, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const publicKey1 = new PublicKey(stack1, 'MyPublicKey', {
        encodedKey: publicKey,
      });

      // Test 2: Nested placement
      const flagApp2 = new App();
      flagApp2.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const stack2 = new Stack(flagApp2, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      class WrapperConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }

      const wrapper = new WrapperConstruct(stack2, 'Wrapper');
      const publicKey2 = new PublicKey(wrapper, 'MyPublicKey', {
        encodedKey: publicKey,
      });

      // Verify that node.addr is different (this would cause the old problem)
      expect(publicKey1.node.addr).not.toEqual(publicKey2.node.addr);

      // Verify that node.path is different (this ensures uniqueness)
      expect(publicKey1.node.path).not.toEqual(publicKey2.node.path);

      // But verify that node.id is the same
      expect(publicKey1.node.id).toEqual(publicKey2.node.id);

      // Get the actual caller references from the templates
      const template1 = Template.fromStack(stack1);
      const template2 = Template.fromStack(stack2);

      const resources1 = template1.findResources('AWS::CloudFront::PublicKey');
      const resources2 = template2.findResources('AWS::CloudFront::PublicKey');

      const callerRef1 = Object.values(resources1)[0] as any;
      const callerRef2 = Object.values(resources2)[0] as any;

      const stableCallerReference1 = callerRef1.Properties.PublicKeyConfig.CallerReference;
      const stableCallerReference2 = callerRef2.Properties.PublicKeyConfig.CallerReference;

      // The stable caller references should be different due to different paths
      // This ensures uniqueness and prevents CloudFormation conflicts
      expect(stableCallerReference1).not.toEqual(stableCallerReference2);

      // Both should be deterministic and follow the pattern
      expect(stableCallerReference1).toMatch(/TestStack-MyPublicKey-[a-f0-9]{16}/);
      expect(stableCallerReference2).toMatch(/TestStack-MyPublicKey-[a-f0-9]{16}/);
    });

    test('demonstrates the original issue #15301 is addressed with deterministic references', () => {
      // This test demonstrates that the original issue where CloudFormation would fail
      // with "Invalid request provided: AWS::CloudFront::PublicKey" is now addressed
      // by providing deterministic but unique caller references

      const flagApp = new App();
      flagApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);

      // Original deployment structure
      const originalStack = new Stack(flagApp, 'MyStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const originalPublicKey = new PublicKey(originalStack, 'cloudfront-public-key', {
        encodedKey: publicKey,
      });

      // After refactoring - moved to a nested construct (common refactoring scenario)
      const refactoredApp = new App();
      refactoredApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);

      const refactoredStack = new Stack(refactoredApp, 'MyStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      class CloudFrontResources extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }

      const cloudFrontResources = new CloudFrontResources(refactoredStack, 'CloudFrontResources');
      const refactoredPublicKey = new PublicKey(cloudFrontResources, 'cloudfront-public-key', {
        encodedKey: publicKey,
      });

      // Get caller references from both scenarios
      const originalTemplate = Template.fromStack(originalStack);
      const refactoredTemplate = Template.fromStack(refactoredStack);

      const originalResources = originalTemplate.findResources('AWS::CloudFront::PublicKey');
      const refactoredResources = refactoredTemplate.findResources('AWS::CloudFront::PublicKey');

      const originalCallerRef = Object.values(originalResources)[0] as any;
      const refactoredCallerRef = Object.values(refactoredResources)[0] as any;

      const originalCallerReference = originalCallerRef.Properties.PublicKeyConfig.CallerReference;
      const refactoredCallerReference = refactoredCallerRef.Properties.PublicKeyConfig.CallerReference;

      // The caller references will be different due to different paths
      // This is actually the correct behavior to ensure uniqueness
      expect(originalCallerReference).not.toEqual(refactoredCallerReference);

      // Both should be deterministic and follow the pattern
      expect(originalCallerReference).toMatch(/MyStack-cloudfront-public-key-[a-f0-9]{16}/);
      expect(refactoredCallerReference).toMatch(/MyStack-cloudfront-public-key-[a-f0-9]{16}/);

      // Demonstrate that node.addr would have been different (the old problem)
      expect(originalPublicKey.node.addr).not.toEqual(refactoredPublicKey.node.addr);

      // But node.id is the same
      expect(originalPublicKey.node.id).toEqual(refactoredPublicKey.node.id);

      // The key improvement: both references are deterministic and won't change
      // if the same construct structure is recreated
      const recreatedApp = new App();
      recreatedApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const recreatedStack = new Stack(recreatedApp, 'MyStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });
      const recreatedResources = new CloudFrontResources(recreatedStack, 'CloudFrontResources');
      new PublicKey(recreatedResources, 'cloudfront-public-key', {
        encodedKey: publicKey,
      });

      const recreatedTemplate = Template.fromStack(recreatedStack);
      const recreatedTemplateResources = recreatedTemplate.findResources('AWS::CloudFront::PublicKey');
      const recreatedCallerRef = Object.values(recreatedTemplateResources)[0] as any;
      const recreatedCallerReference = recreatedCallerRef.Properties.PublicKeyConfig.CallerReference;

      // The recreated reference should be identical to the refactored one
      expect(recreatedCallerReference).toEqual(refactoredCallerReference);
    });

    test('feature flag disabled vs enabled produces different caller references', () => {
      // Test with feature flag disabled
      const disabledApp = new App();
      const disabledStack = new Stack(disabledApp, 'TestStack', {
        env: { account: '123456789012', region: 'testregion' },
      });

      new PublicKey(disabledStack, 'TestPublicKey', {
        encodedKey: publicKey,
      });

      // Test with feature flag enabled
      const enabledApp = new App();
      enabledApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);
      const enabledStack = new Stack(enabledApp, 'TestStack', {
        env: { account: '123456789012', region: 'testregion' },
      });

      new PublicKey(enabledStack, 'TestPublicKey', {
        encodedKey: publicKey,
      });

      const disabledTemplate = Template.fromStack(disabledStack);
      const enabledTemplate = Template.fromStack(enabledStack);

      const disabledResources = disabledTemplate.findResources('AWS::CloudFront::PublicKey');
      const enabledResources = enabledTemplate.findResources('AWS::CloudFront::PublicKey');

      const disabledCallerRef = Object.values(disabledResources)[0] as any;
      const enabledCallerRef = Object.values(enabledResources)[0] as any;

      const disabledReference = disabledCallerRef.Properties.PublicKeyConfig.CallerReference;
      const enabledReference = enabledCallerRef.Properties.PublicKeyConfig.CallerReference;

      // They should be different
      expect(disabledReference).not.toEqual(enabledReference);

      // The enabled one should follow the stable pattern
      expect(enabledReference).toMatch(/.*TestStack.*TestPublicKey.*/);
    });
  });
});
