import { Template } from '../../assertions';
import * as kms from '../../aws-kms';
import * as sns from '../../aws-sns';
import * as sqs from '../../aws-sqs';
import { Stack } from '../../core';
import * as subscriptions from '../lib';

test('can add subscription to queue that has encryptionType auto changed', () => {
  // GIVEN
  const stack = new Stack();
  const key = new kms.Key(stack, 'CustomKey');
  const queue = new sqs.Queue(stack, 'Queue', {
    encryption: sqs.QueueEncryption.KMS_MANAGED,
    encryptionMasterKey: key,
  });

  const someTopic = new sns.Topic(stack, 'Topic');
  someTopic.addSubscription(
    new subscriptions.SqsSubscription(queue, {
      rawMessageDelivery: true,
    }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
    Endpoint: {
      'Fn::GetAtt': ['Queue4A7E3555', 'Arn'],
    },
    Protocol: 'sqs',
  });
});
