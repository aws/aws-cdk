import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DeliveryStream, S3Bucket } from 'aws-cdk-lib/aws-kinesisfirehose';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { TestSource } from './test-classes';
import { FirehoseTarget } from '../lib/firehose';

describe('Firehose', () => {
  it('should have target arn', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bucket = new Bucket(stack, 'Bucket');
    const deliveryStream = new DeliveryStream(stack, 'MyDeliveryStream', {
      destination: new S3Bucket(bucket),
    });

    const target = new FirehoseTarget(deliveryStream);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        'Fn::GetAtt': [
          'MyDeliveryStream79822137',
          'Arn',
        ],
      },
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bucket = new Bucket(stack, 'Bucket');
    const deliveryStream = new DeliveryStream(stack, 'MyDeliveryStream', {
      destination: new S3Bucket(bucket),
    });

    const inputTransformation = InputTransformation.fromObject({
      key: 'value',
    });
    const target = new FirehoseTarget(deliveryStream, {
      inputTransformation,
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        InputTemplate: '{"key":"value"}',
      },
    });
  });

  it('should grant pipe role putRecord access', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bucket = new Bucket(stack, 'Bucket');
    const deliveryStream = new DeliveryStream(stack, 'MyDeliveryStream', {
      destination: new S3Bucket(bucket),
    });

    const target = new FirehoseTarget(deliveryStream);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
            Resource: { 'Fn::GetAtt': ['MyDeliveryStream79822137', 'Arn'] },
          },
        ],
      },
      Roles: [{ Ref: 'MyPipeRoleCBC8E9AB' }],
    });
  });
});
