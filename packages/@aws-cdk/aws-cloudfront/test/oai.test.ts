import { Template } from '@aws-cdk/assertions';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import { OriginAccessIdentity } from '../lib';

describe('Origin Access Identity', () => {
  test('With automatic comment', () => {
    const stack = new cdk.Stack();

    new OriginAccessIdentity(stack, 'OAI');

    Template.fromStack(stack).templateMatches(
      {
        Resources: {
          OAIE1EFC67F: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
              CloudFrontOriginAccessIdentityConfig: {
                Comment: 'Allows CloudFront to reach the bucket',
              },
            },
          },
        },
      },
    );
  });

  test('With provided comment', () => {
    const stack = new cdk.Stack();

    new OriginAccessIdentity(stack, 'OAI', {
      comment: 'test comment',
    });

    Template.fromStack(stack).templateMatches(
      {
        Resources: {
          OAIE1EFC67F: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
              CloudFrontOriginAccessIdentityConfig: {
                Comment: 'test comment',
              },
            },
          },
        },
      },
    );
  });

  test('Truncates long comments', () => {
    const stack = new cdk.Stack();

    new OriginAccessIdentity(stack, 'OAI', {
      comment: 'This is a really long comment. Auto-generated comments based on ids of origins might sometimes be this long or even longer and that will break',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'This is a really long comment. Auto-generated comments based on ids of origins might sometimes be this long or even longer and t',
      },
    });
  });

  testDeprecated('Builds ARN of CloudFront user for fromOriginAccessIdentityName', () => {
    const stack = new cdk.Stack();

    const oai = OriginAccessIdentity.fromOriginAccessIdentityName(stack, 'OAI', 'OAITest');

    expect(oai.grantPrincipal.policyFragment.principalJson.AWS[0]).toMatch(/:iam::cloudfront:user\/CloudFront Origin Access Identity OAITest$/);
  });

  test('Builds ARN of CloudFront user for fromOriginAccessIdentityId', () => {
    const stack = new cdk.Stack();

    const oai = OriginAccessIdentity.fromOriginAccessIdentityId(stack, 'OAI', 'OAITest');

    expect(oai.grantPrincipal.policyFragment.principalJson.AWS[0]).toMatch(/:iam::cloudfront:user\/CloudFront Origin Access Identity OAITest$/);
  });
});
