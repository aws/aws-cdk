import { Key } from 'aws-cdk-lib/aws-kms';
import { App, Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { LoggingProtocol, Topic, TracingConfig } from 'aws-cdk-lib/aws-sns';
import { ManagedPolicy, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

class SNSInteg extends Stack {
  public readonly publishEncryptedTopicFn: Function;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new Key(this, 'CustomKey', {
      pendingWindow: Duration.days(7),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const topic = new Topic(this, 'MyTopic', {
      topicName: 'fooTopic',
      displayName: 'fooDisplayName',
      masterKey: key,
    });

    const feedbackRole = new Role(this, 'FeedbackRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
    });
    const deliveryLoggingPolicy = new ManagedPolicy(this, 'Policy', {
      document: new PolicyDocument({
        statements: [new PolicyStatement({
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'logs:PutMetricFilter',
            'logs:PutRetentionPolicy',
          ],
          resources: ['*'],
        })],
      }),
    });
    deliveryLoggingPolicy.attachToRole(feedbackRole);

    topic.addLoggingConfig({
      protocol: LoggingProtocol.HTTP,
      failureFeedbackRole: feedbackRole,
      successFeedbackRole: feedbackRole,
      successFeedbackSampleRate: 50,
    });

    // Topic with signatureVersion
    new Topic(this, 'MyTopicSignatureVersion', {
      topicName: 'fooTopicSignatureVersion',
      displayName: 'fooDisplayNameSignatureVersion',
      signatureVersion: '2',
    });

    // Topic with tracingConfig
    new Topic(this, 'MyTopicTracingConfig', {
      topicName: 'fooTopicTracingConfig',
      displayName: 'fooDisplayNameTracingConfig',
      tracingConfig: TracingConfig.ACTIVE,
    });

    // Can import topic
    const topic2 = new Topic(this, 'MyTopic2', {
      topicName: 'fooTopic2',
      displayName: 'fooDisplayName2',
    });
    const importedTopic2 = Topic.fromTopicArn(this, 'ImportedTopic2', topic2.topicArn);

    const publishRole = new Role(this, 'PublishRole', {
      assumedBy: new ServicePrincipal('s3.amazonaws.com'),
    });
    importedTopic2.grantPublish(publishRole);

    // Can import encrypted topic by attributes
    const topic3 = new Topic(this, 'MyTopic3', {
      topicName: 'fooTopic3',
      displayName: 'fooDisplayName3',
      masterKey: key,
    });
    const importedTopic3 = Topic.fromTopicAttributes(this, 'ImportedTopic3', {
      topicArn: topic3.topicArn,
      keyArn: key.keyArn,
    });
    importedTopic3.grantPublish(publishRole);

    // Create a function that publishes to an encrypted topic to verify grantPublish
    this.publishEncryptedTopicFn = new Function(this, 'PublishEncryptedTopic', {
      functionName: 'publish-encrypted-topic',
      runtime: Runtime.PYTHON_3_12,
      code: Code.fromAsset(path.join(__dirname, 'fixtures', 'publish-encrypted-topic')),
      handler: 'index.lambda_handler',
      environment: {
        TOPIC_ARN: topic3.topicArn,
      },
    });
    topic3.grantPublish(this.publishEncryptedTopicFn);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new SNSInteg(app, 'SNSInteg');

const testCase = new integ.IntegTest(app, 'SNSTest', {
  testCases: [stack],
});

testCase.assertions.invokeFunction({
  functionName: stack.publishEncryptedTopicFn.functionName,
}).expect(integ.ExpectedResult.objectLike({
  Payload: '"published successfully"',
}));

app.synth();
