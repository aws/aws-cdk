import { expect, haveResource } from '@aws-cdk/assert';
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
      compatibleRuntimes: [lambda.Runtime.NodeJS810]
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::LayerVersion', {
      Content: cdk.resolve(code.toJSON()),
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
      compatibleRuntimes: [lambda.Runtime.NodeJS810]
    });

    // WHEN
    layer.grantUsage('123456789012');
    layer.grantUsage('*', 'o-123456');

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::LayerVersionPermission', {
      Action: 'lambda:GetLayerVersion',
      LayerVersionArn: cdk.resolve(layer.layerVersionArn),
      Principal: '123456789012',
    }));
    expect(stack).to(haveResource('AWS::Lambda::LayerVersionPermission', {
      Action: 'lambda:GetLayerVersion',
      LayerVersionArn: cdk.resolve(layer.layerVersionArn),
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
});
