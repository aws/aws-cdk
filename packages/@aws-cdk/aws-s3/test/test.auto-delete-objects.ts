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
    expect(stack).to(haveResource('Custom::AutoDeleteObjects'));

    test.done();
  },

  'when autoDeleteObjects is enabled, throws if removalPolicy is not specified'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket', { autoDeleteObjects: true }), /removal policy/);

    test.done();
  },
};
