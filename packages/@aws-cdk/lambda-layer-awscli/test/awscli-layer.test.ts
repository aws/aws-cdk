import { Template } from '@aws-cdk/assertions';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import { ILambdaLayerAsset } from '@aws-cdk/interfaces';
import { Construct } from 'constructs';
import { AwsCliLayer } from '../lib';

test('synthesized to a layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new AwsCliLayer(stack, 'MyLayer');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
    Description: '/opt/awscli/aws',
  });
});

test('accepts custom aws cli asset', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new AwsCliLayer(stack, 'MyLayer', {
    awsCliAsset: new MyAwsCliAsset(stack, 'CustomAwsCliAsset'),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
    Content: {},
  });
});

class MyAwsCliAsset extends Construct implements ILambdaLayerAsset {
  bucketArn: string;
  key: string = 'FakeObjectKey';
  constructor(scope: Construct, id: string) {
    super (scope, id);
    const bucket = new s3.Bucket(this, 'CustomAwsCliBucket');
    this.bucketArn = bucket.bucketArn;
  }
}
