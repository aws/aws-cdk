import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as s3 from '../lib';

export = {
  'when autoDeleteObjects is enabled, a custom resource is provisioned + a lambda handler for it'(test: Test) {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    expect(stack).to(haveResource('AWS::S3::Bucket'));
    expect(stack).to(haveResource('AWS::Lambda::Function'));
    expect(stack).to(haveResource('Custom::AutoDeleteObjects',
      { BucketName: { Ref: 'MyBucketF68F3FF0' } }));

    test.done();
  },

  'two buckets with autoDeleteObjects enabled share the same cr provider'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    new s3.Bucket(stack, 'MyBucket1', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    new s3.Bucket(stack, 'MyBucket2', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const template = app.synth().getStackArtifact(stack.artifactId).template;
    const resourceTypes = Object.values(template.Resources).map((r: any) => r.Type).sort();

    test.deepEqual(resourceTypes, [
      // custom resource provider resources
      'AWS::IAM::Role',
      'AWS::Lambda::Function',

      // buckets
      'AWS::S3::Bucket',
      'AWS::S3::Bucket',

      // auto delete object resources
      'Custom::AutoDeleteObjects',
      'Custom::AutoDeleteObjects',
    ]);

    test.done();
  },

  'iam policy'(test: Test) {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    expect(stack).to(haveResource('AWS::IAM::Role', {
      Policies: [
        {
          PolicyName: 'Inline',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': [
                    'MyBucketF68F3FF0',
                    'Arn',
                  ],
                },
                Action: [
                  's3:GetObject*',
                  's3:GetBucket*',
                  's3:List*',
                  's3:DeleteObject*',
                  's3:PutObject*',
                  's3:Abort*',
                ],
              },
            ],
          },
        },
      ],
    }));

    test.done();
  },

  'when autoDeleteObjects is enabled, throws if removalPolicy is not specified'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket', { autoDeleteObjects: true }), /removal policy/);

    test.done();
  },
};
