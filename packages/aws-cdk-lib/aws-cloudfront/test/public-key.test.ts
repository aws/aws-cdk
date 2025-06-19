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

    test('feature flag works with construct tree changes', () => {
      // Create a new app with the feature flag enabled
      const flagApp = new App();
      flagApp.node.setContext(cxapi.CLOUDFRONT_STABLE_PUBLIC_KEY_CALLER_REFERENCE, true);

      // Create a stack with nested constructs
      const newStack = new Stack(flagApp, 'TestStack', {
        env: { account: '123456789012', region: 'testregion' },
      });

      // Simulate moving a PublicKey between different construct trees
      // This would normally cause the node.addr to change
      class BaseConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }

      class SubConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }

      const baseConstruct = new BaseConstruct(newStack, 'BaseConstruct');
      const subConstruct = new SubConstruct(baseConstruct, 'SubConstruct');

      new PublicKey(subConstruct, 'TestPublicKey', {
        encodedKey: publicKey,
      });

      const template = Template.fromStack(newStack);
      template.hasResourceProperties('AWS::CloudFront::PublicKey', {
        PublicKeyConfig: {
          CallerReference: Match.stringLikeRegexp(/.*TestStack.*TestPublicKey.*/), // Should still be stable
          EncodedKey: publicKey,
        },
      });
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
