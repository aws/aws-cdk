import * as cdk from "@aws-cdk/core";
import * as sns from '@aws-cdk/sns';
import * as sqs from '@aws-cdk/sqs';

class ACL extends cdk.Stack {
    constructor(parent: cdk.App, name: string) {
        super(parent, name);

        const topic = new sns.Topic(this, 'MyTopic');
        const queue = new sqs.Queue(this, 'MyQueue', {
            visibilityTimeoutSec: 300
        });

        topic.subscribeQueue(queue);
    }
}

class CFN extends cdk.Stack {
    constructor(parent: cdk.App, name: string) {
        super(parent, name);

        const topic = new sns.cloudformation.TopicResource(this, 'MyTopic');
        const queue = new sqs.cloudformation.QueueResource(this, 'MyQueue');

        new sns.cloudformation.SubscriptionResource(this, 'TopicToQueue', {
            topicArn: topic.ref, // ref == arn for topics
            endpoint: queue.queueName,
            protocol: 'sqs'
        });

        const policyDocument = new cdk.PolicyDocument();
        policyDocument.addStatement(new cdk.PolicyStatement()
            .addResource(queue.queueArn)
            .addAction('sqs:SendMessage')
            .addServicePrincipal('sns.amazonaws.com')
            .setCondition('ArnEquals', { 'aws:SourceArn': topic.ref }));

        new sqs.cloudformation.QueuePolicyResource(this, 'MyQueuePolicy', {
            policyDocument,
            queues: [ queue.ref ]
        });
    }
}

const app = new cdk.App(process.argv);
new ACL(app, 'acl');
new CFN(app, 'cfn');
process.stdout.write(app.run());
