import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import path = require('path');
import { FileAsset, ZipDirectoryAsset } from '../lib/asset';

export = {
  'simple use case'(test: Test)  {
    const stack = new cdk.Stack();
    const dirPath = path.join(__dirname, 'sample-asset-directory');
    const asset = new ZipDirectoryAsset(stack, 'MyAsset', {
      path: dirPath
    });

    // verify that metadata contains an "aws:cdk:asset" entry with
    // the correct information
    const entry = asset.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');
    test.deepEqual(entry!.data, {
      path: dirPath,
      id: 'MyAsset',
      packaging: 'zip',
      s3BucketParameter: 'MyAssetS3Bucket68C9B344',
      s3KeyParameter: 'MyAssetS3VersionKey68E1A45D',
    });

    // verify that now the template contains parameters for this asset
    const template = stack.toCloudFormation();
    test.equal(template.Parameters.MyAssetS3Bucket68C9B344.Type, 'String');
    test.equal(template.Parameters.MyAssetS3VersionKey68E1A45D.Type, 'String');

    test.done();
  },

  '"file" assets'(test: Test) {
    const stack = new cdk.Stack();
    const filePath = path.join(__dirname, 'file-asset.txt');
    const asset = new FileAsset(stack, 'MyAsset', { path: filePath });
    const entry = asset.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');
    test.deepEqual(entry!.data, {
      path: filePath,
      packaging: 'file',
      id: 'MyAsset',
      s3BucketParameter: 'MyAssetS3Bucket68C9B344',
      s3KeyParameter: 'MyAssetS3VersionKey68E1A45D',
    });

    // verify that now the template contains parameters for this asset
    const template = stack.toCloudFormation();
    test.equal(template.Parameters.MyAssetS3Bucket68C9B344.Type, 'String');
    test.equal(template.Parameters.MyAssetS3VersionKey68E1A45D.Type, 'String');

    test.done();
  },

  '"readers" or "grantRead" can be used to grant read permissions on the asset to a principal'(test: Test) {
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'MyUser');
    const group = new iam.Group(stack, 'MyGroup');

    const asset = new ZipDirectoryAsset(stack, 'MyAsset', {
      path: path.join(__dirname, 'sample-asset-directory'),
      readers: [ user ]
    });

    asset.grantRead(group);

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
      Statement: [
        {
        Action: ["s3:GetObject*", "s3:GetBucket*", "s3:List*"],
        Resource: [
          {"Fn::Join": ["", ["arn", ":", {Ref: "AWS::Partition"}, ":", "s3", ":", "", ":", "", ":", {Ref: "MyAssetS3Bucket68C9B344"}]]},
          {"Fn::Join": [ "", [
          {"Fn::Join": ["", [ "arn", ":", {Ref: "AWS::Partition"}, ":", "s3", ":", "", ":", "", ":", {Ref: "MyAssetS3Bucket68C9B344"}]]},
          "/",
          {"Fn::Join": ["", [
            {"Fn::Select": [
              0,
              {"Fn::Split": [ "||", { Ref: "MyAssetS3VersionKey68E1A45D"}]}
            ]},
            "*"
          ]]}
          ]]}
        ]
      }
      ]
    }}));

    test.done();
  },
  'fails if directory not found'(test: Test) {
    const stack = new cdk.Stack();
    test.throws(() => new ZipDirectoryAsset(stack, 'MyDirectory', {
      path: '/path/not/found/' + Math.random() * 999999
    }));
    test.done();
  },

  'multiple assets under the same parent'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ZipDirectoryAsset(stack, 'MyDirectory1', { path: '.' });
    new ZipDirectoryAsset(stack, 'MyDirectory2', { path: '.' });

    // THEN: no error

    test.done();
  },
};
