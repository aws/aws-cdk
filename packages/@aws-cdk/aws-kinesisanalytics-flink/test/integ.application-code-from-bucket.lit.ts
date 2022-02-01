import * as path from 'path';
import * as assets from '@aws-cdk/aws-s3-assets';
import * as core from '@aws-cdk/core';
import * as flink from '../lib';

const app = new core.App();
const stack = new core.Stack(app, 'FlinkAppCodeFromBucketTest');

const asset = new assets.Asset(stack, 'CodeAsset', {
  path: path.join(__dirname, 'code-asset'),
});
const bucket = asset.bucket;
const fileKey = asset.s3ObjectKey;

///! show
new flink.Application(stack, 'App', {
  code: flink.ApplicationCode.fromBucket(bucket, fileKey),
  runtime: flink.Runtime.FLINK_1_11,
});
///! hide

app.synth();
