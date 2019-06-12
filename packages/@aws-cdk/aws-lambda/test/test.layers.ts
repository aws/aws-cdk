import { countResources, expect, haveResource } from '@aws-cdk/assert';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Test, testCase } from 'nodeunit';
import lambda = require('../lib');

export = testCase({
  'creating a layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    // WHEN
    new lambda.LayerVersion(stack, 'LayerVersion', {
      code,
      compatibleRuntimes: [lambda.Runtime.Nodejs810]
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::LayerVersion', {
      Content: {
        S3Bucket: stack.resolve(bucket.bucketName),
        S3Key: 'ObjectKey',
      },
      CompatibleRuntimes: ['nodejs8.10']
    }));

    test.done();
  },

  'granting access to a layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');
    const layer = new lambda.LayerVersion(stack, 'LayerVersion', {
      code,
      compatibleRuntimes: [lambda.Runtime.Nodejs810]
    });

    // WHEN
    layer.addPermission('GrantUsage-123456789012', { accountId: '123456789012' });
    layer.addPermission('GrantUsage-o-123456',     { accountId: '*', organizationId: 'o-123456' });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::LayerVersionPermission', {
      Action: 'lambda:GetLayerVersion',
      LayerVersionArn: stack.resolve(layer.layerVersionArn),
      Principal: '123456789012',
    }));
    expect(stack).to(haveResource('AWS::Lambda::LayerVersionPermission', {
      Action: 'lambda:GetLayerVersion',
      LayerVersionArn: stack.resolve(layer.layerVersionArn),
      Principal: '*',
      OrganizationId: 'o-123456'
    }));

    test.done();
  },

  'creating a layer with no runtimes compatible'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    // THEN
    test.throws(() => new lambda.LayerVersion(stack, 'LayerVersion', { code, compatibleRuntimes: [] }),
                /supports no runtime/);

    test.done();
  },

  'singleton layers are created exactly once'(test: Test) {
    // Given
    const stack = new cdk.Stack(undefined, 'TestStack');
    const uuid = '75F9D74A-67AF-493E-888A-20976130F0B1';
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    // When
    for (let i = 0 ; i < 5 ; i++) {
      new lambda.SingletonLayerVersion(stack, `Layer-${i}`, { uuid, code });
    }

    // Then
    expect(stack).to(countResources('AWS::Lambda::LayerVersion', 1));

    test.done();
  }
});
