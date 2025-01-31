import { App, Stack } from 'aws-cdk-lib';
import { Topic, TopicPolicy } from 'aws-cdk-lib/aws-sns';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const app = new App();

const stack = new Stack(app, 'SNSTopicPolicyStack');

const topic = new Topic(stack, 'Topic', {
  topicName: 'fooTopic',
  displayName: 'fooDisplay',
});

const policyDocument = new PolicyDocument({
  assignSids: true,
  statements: [
    new PolicyStatement({
      actions: ['sns:Publish'],
      principals: [new ServicePrincipal('s3.amazonaws.com')],
      resources: [topic.topicArn],
    }),
  ],
});

new TopicPolicy(stack, 'TopicPolicy', {
  topics: [topic],
  policyDocument,
  enforceSSL: true,
});

const topicAddPolicy = new Topic(stack, 'TopicAddPolicy', {
  topicName: 'topicAddPolicy',
  displayName: 'topicDisplayNameAddPolicy',
  enforceSSL: true,
});

topicAddPolicy.addToResourcePolicy(new PolicyStatement({
  principals: [new ServicePrincipal('s3.amazonaws.com')],
  actions: ['sns:Publish'],
  resources: [topicAddPolicy.topicArn],
}));

new Topic(stack, 'TopicWithSSL', {
  enforceSSL: true,
});

new IntegTest(app, 'SNSTopicPolicyInteg', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});
