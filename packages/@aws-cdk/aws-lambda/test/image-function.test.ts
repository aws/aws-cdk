import * as path from 'path';
import '@aws-cdk/assert-internal/jest';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as _ from 'lodash';
import * as lambda from '../lib';

describe('image-function', () => {

  test('error when layers set in a container function', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const code = new lambda.S3Code(bucket, 'ObjectKey');

    const layer = new lambda.LayerVersion(stack, 'Layer', {
      code,
    });

    expect(() => new lambda.DockerImageFunction(stack, 'MyLambda', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-lambda-handler')),
      layers: [layer],
    })).toThrow(/Layers are not supported for container image functions/);
  });

});
