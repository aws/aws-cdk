import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import s3 = require('../lib');

export = {
  'when notification are added, a custom resource is provisioned + a lambda handler for it'(test: Test) {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.ObjectCreated, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.Topic
      })
    });

    expect(stack).to(haveResource('AWS::S3::Bucket'));
    expect(stack).to(haveResource('Custom::S3BucketNotifications'));

    test.done();
  },
};