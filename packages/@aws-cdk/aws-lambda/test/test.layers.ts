import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cxapi = require('@aws-cdk/cx-api');
import { Test, testCase } from 'nodeunit';
import path = require('path');
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
      compatibleRuntimes: [lambda.Runtime.NODEJS_8_10]
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
      compatibleRuntimes: [lambda.Runtime.NODEJS_8_10]
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

  'asset metadata is added to the cloudformation resource'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);

    // WHEN
    new lambda.LayerVersion(stack, 'layer', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code'))
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::LayerVersion', {
      Metadata: {
        'aws:asset:path': 'asset.45f085ecc03a1a22cf003fba3fab28e660c92bcfcd4d0c01b62c7cd191070a2d',
        'aws:asset:property': 'Content'
      }
    }, ResourcePart.CompleteDefinition));
    test.done();
  }
});
