import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { FileAssetSource } from '@aws-cdk/core';
import { ProductStackAssetBucket } from '../lib/private/product-stack-asset-bucket';
import { hashValues } from '../lib/private/util';

describe('ProductStackAssetBucket', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789876' },
    });
  });

  test('default ProductStackAssetBucket creation', () => {
    // WHEN
    new ProductStackAssetBucket(stack, 'MyProductStackAssetBucket');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: `product-stack-asset-bucket-${stack.account}-${hashValues('MyProductStackAssetBucket')}`,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
  }),

  test('ProductStackAssetBucket without assets avoids bucket deployment', () => {
    // GIVEN
    const assetBucket = new ProductStackAssetBucket(stack, 'MyProductStackAssetBucket');

    // WHEN
    assetBucket.deployAssets();

    // THEN
    Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 0);
  }),

  test('ProductStackAssetBucket with assets creates bucket deployment', () => {
    // GIVEN
    const assetBucket = new ProductStackAssetBucket(stack, 'MyProductStackAssetBucket');

    const asset = {
      packaging: 'zip',
      sourceHash: '3be8ad230b47f23554e7098c40e6e4f58ffc7c0cdddbf0da8c8cc105d6d25f2d',
      fileName: '../test/cdk.out/asset.3be8ad230b47f23554e7098c40e6e4f58ffc7c0cdddbf0da8c8cc105d6d25f2d.zip',
    } as FileAssetSource;

    // WHEN
    assetBucket.addAsset(asset);
    assetBucket.deployAssets();

    // THEN
    Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 1);
  });
});