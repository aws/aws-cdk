import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { FileAssetSource } from '@aws-cdk/core';
import { ProductStackAssetBucket } from '../lib';

describe('ProductStackAssetBucket', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', {
      env: { account: '12345678', region: 'test-region' },
    });
  });

  test('default ProductStackAssetBucket creation', () => {
    // WHEN
    new ProductStackAssetBucket(stack, 'MyProductStackAssetBucket', {
      bucketName: 'test-asset-bucket',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'test-asset-bucket',
    });
  }),

  test('default ProductStackAssetBucket creation missing bucketname', () => {
    // WHEN
    expect(() => {
      new ProductStackAssetBucket(stack, 'MyProductStackAssetBucket');
    }).toThrow('BucketName must be defined for assetBucket');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {});
  }),

  test('ProductStackAssetBucket without assets avoids bucket deployment', () => {
    // WHEN
    new ProductStackAssetBucket(stack, 'MyProductStackAssetBucket', {
      bucketName: 'test-asset-bucket',
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 0);
  }),

  test('ProductStackAssetBucket with assets creates bucket deployment', () => {
    // GIVEN
    const assetBucket = new ProductStackAssetBucket(stack, 'MyProductStackAssetBucket', {
      bucketName: 'test-asset-bucket',
    });

    const asset = {
      packaging: 'zip',
      sourceHash: '3be8ad230b47f23554e7098c40e6e4f58ffc7c0cdddbf0da8c8cc105d6d25f2d',
      fileName: '../test/cdk.out/asset.3be8ad230b47f23554e7098c40e6e4f58ffc7c0cdddbf0da8c8cc105d6d25f2d.zip',
    } as FileAssetSource;

    // WHEN
    assetBucket._addAsset(asset);

    // THEN
    Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 1);
  });
});
