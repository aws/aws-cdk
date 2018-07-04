import { App, PolicyDocument, PolicyStatement, Stack } from "@aws-cdk/core";
import { SubscriptionResource, Topic, TopicResource } from '@aws-cdk/sns';
import { Queue, QueuePolicyResource, QueueResource } from '@aws-cdk/sqs';

class ACL extends Stack {
    constructor(parent: App, name: string) {
        super(parent, name);

        const topic = new Topic(this, 'MyTopic');
        const queue = new Queue(this, 'MyQueue', {
            visibilityTimeoutSec: 300
        });

        topic.subscribeQueue(queue);
    }
}

class CFN extends Stack {
    constructor(parent: App, name: string) {
        super(parent, name);

        const topic = new TopicResource(this, 'MyTopic');
        const queue = new QueueResource(this, 'MyQueue');

        new SubscriptionResource(this, 'TopicToQueue', {
            topicArn: topic.ref, // ref == arn for topics
            endpoint: queue.queueName,
            protocol: 'sqs'
        });

        const policyDocument = new PolicyDocument();
        policyDocument.addStatement(new PolicyStatement()
            .addResource(queue.queueArn)
            .addAction('sqs:SendMessage')
            .addServicePrincipal('sns.amazonaws.com')
            .setCondition('ArnEquals', { 'aws:SourceArn': topic.ref }));

        new QueuePolicyResource(this, 'MyQueuePolicy', {
            policyDocument,
            queues: [ queue.ref ]
        });
    }
}

const app = new App(process.argv);
new ACL(app, 'acl');
new CFN(app, 'cfn');
process.stdout.write(app.run());
