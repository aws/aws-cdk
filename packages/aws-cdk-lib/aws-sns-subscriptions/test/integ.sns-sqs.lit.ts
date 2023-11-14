import * as kms from '../../aws-kms';
import * as sns from '../../aws-sns';
import * as sqs from '../../aws-sqs';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as subs from '../lib';

const restrictSqsDescryption = { [cxapi.SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY]: true };

class SnsToSqs extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const topic = new sns.Topic(this, 'MyTopic');
    const queue = new sqs.Queue(this, 'MyQueue', {
      encryptionMasterKey: new kms.Key(this, 'EncryptionMasterKey'),
    });

    topic.addSubscription(new subs.SqsSubscription(queue, {
      deadLetterQueue: new sqs.Queue(this, 'DeadLetterQueue'),
    }));
    /// !hide
  }
}

const app = new cdk.App({
  context: restrictSqsDescryption,
});

new SnsToSqs(app, 'aws-cdk-sns-sqs');

app.synth();
