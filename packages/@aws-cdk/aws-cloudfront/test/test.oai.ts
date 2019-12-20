import { expect } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { OriginAccessIdentity } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'Origin Access Identity with automatic comment'(test: Test) {
    const stack = new cdk.Stack();

    new OriginAccessIdentity(stack, "OAI");

    expect(stack).toMatch(
      {
        "Resources": {
          "OAIE1EFC67F": {
            "Type": "AWS::CloudFront::CloudFrontOriginAccessIdentity",
            "Properties": {
              "CloudFrontOriginAccessIdentityConfig": {
                "Comment": "Allows CloudFront to reach the bucket"
              }
            }
          }
        }
      }
    );

    test.done();
  },
  'Origin Access Identity with comment'(test: Test) {
    const stack = new cdk.Stack();

    new OriginAccessIdentity(stack, "OAI", {
      comment: "test comment"
    });

    expect(stack).toMatch(
      {
        "Resources": {
          "OAIE1EFC67F": {
            "Type": "AWS::CloudFront::CloudFrontOriginAccessIdentity",
            "Properties": {
              "CloudFrontOriginAccessIdentityConfig": {
                "Comment": "test comment"
              }
            }
          }
        }
      }
    );

    test.done();
  },

  'Builds ARN of CloudFront user'(test: Test) {
    const stack = new cdk.Stack();

    const oai = OriginAccessIdentity.fromOriginAccessIdentityName(stack, "OAI", "OAITest");

    test.ok(
      oai.grantPrincipal.policyFragment.principalJson.AWS[0].endsWith(
        ":iam::cloudfront:user/CloudFront Origin Access Identity OAITest"
      )
    );

    test.done();
  }
};
