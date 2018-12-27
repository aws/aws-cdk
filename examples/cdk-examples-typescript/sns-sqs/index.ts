import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

class ACL extends cdk.Stack {
  constructor(scope: cdk.App, scid: string) {
    super(scope, scid);

    const topic = new sns.Topic(this, 'MyTopic');
    const queue = new sqs.Queue(this, 'MyQueue', {
      visibilityTimeoutSec: 300
    });

    topic.subscribeQueue(queue);
  }
}

class CFN extends cdk.Stack {
  constructor(scope: cdk.App, scid: string) {
    super(scope, scid);

    const topic = new sns.CfnTopic(this, 'MyTopic');
    const queue = new sqs.CfnQueue(this, 'MyQueue');

    new sns.CfnSubscription(this, 'TopicToQueue', {
      topicArn: topic.ref, // ref == arn for topics
      endpoint: queue.queueName,
      protocol: 'sqs'
    });

    const policyDocument = new iam.PolicyDocument();
    policyDocument.addStatement(new iam.PolicyStatement()
      .addResource(queue.queueArn)
      .addAction('sqs:SendMessage')
      .addServicePrincipal('sns.amazonaws.com')
      .setCondition('ArnEquals', { 'aws:SourceArn': topic.ref }));

    new sqs.CfnQueuePolicy(this, 'MyQueuePolicy', {
      policyDocument,
      queues: [ queue.ref ]
    });
  }
}

const app = new cdk.App();
new ACL(app, 'acl');
new CFN(app, 'cfn');
app.run();
