import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import { OriginAccessIdentity } from '../lib';

describe('Origin Access Identity', () => {
  test('With automatic comment', () => {
    const stack = new cdk.Stack();

    new OriginAccessIdentity(stack, 'OAI');

    expect(stack).toMatchTemplate(
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

    expect(stack).toMatchTemplate(
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

    expect(stack).toHaveResourceLike('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'This is a really long comment. Auto-generated comments based on ids of origins might sometimes be this long or even longer and t',
      },
    });
  });

  test('Builds ARN of CloudFront user', () => {
    const stack = new cdk.Stack();

    const oai = OriginAccessIdentity.fromOriginAccessIdentityName(stack, 'OAI', 'OAITest');

    expect(oai.grantPrincipal.policyFragment.principalJson.AWS[0]).toMatch(/:iam::cloudfront:user\/CloudFront Origin Access Identity OAITest$/);
  });
});
