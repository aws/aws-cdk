import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3vectors from '../../lib';

class PolicyStack extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.vectorBucket = new s3vectors.VectorBucket(this, 'DefaultBucket', {
      vectorBucketName: 'integ-vb-with-policy',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.vectorBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3vectors:GetVectorBucket'],
      principals: [new iam.AccountPrincipal(this.account)],
      resources: [this.vectorBucket.vectorBucketArn],
    }));
  }
}

const app = new core.App();

const stack = new PolicyStack(app, 'VectorBucketPolicyIntegTest');

const integ = new IntegTest(app, 'VectorBucketPolicyIntegTestCase', {
  testCases: [stack],
});

integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketPolicyCommand', {
  vectorBucketArn: stack.vectorBucket.vectorBucketArn,
}).expect(ExpectedResult.objectLike({
  policy: Match.stringLikeRegexp('s3vectors:GetVectorBucket'),
}));

app.synth();
