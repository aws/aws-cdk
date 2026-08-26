import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, App, Duration } from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import {
  DeploymentStrategy,
  Extension,
  Action,
  ActionPoint,
  Parameter,
  Application,
  RolloutStrategy,
  HostedConfiguration,
  ConfigurationContent,
  LambdaDestination,
  SqsDestination,
  SnsDestination,
  EventBridgeDestination,
} from 'aws-cdk-lib/aws-appconfig';

const cdkApp = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(cdkApp, 'aws-appconfig-extension');

// create extension through lambda
const lambda = new Function(stack, 'MyFunction', {
  runtime: Runtime.PYTHON_3_8,
  handler: 'index.handler',
  code: Code.fromInline('def handler(event, context):\n\tprint(\'The function has been invoked.\')'),
});
const app = new Application(stack, 'MyApplication', {
  applicationName: 'AppForExtensionTest',
});
const lambdaExtension = new Extension(stack, 'MyLambdaExtension', {
  actions: [
    new Action({
      actionPoints: [
        ActionPoint.PRE_CREATE_HOSTED_CONFIGURATION_VERSION,
        ActionPoint.ON_DEPLOYMENT_START,
        ActionPoint.AT_DEPLOYMENT_TICK,
      ],
      eventDestination: new LambdaDestination(lambda),
    }),
  ],
});
app.addExtension(lambdaExtension);

// create extension through sqs queue
const queue = new Queue(stack, 'MyQueue');
const queueExtension = new Extension(stack, 'MyQueueExtension', {
  actions: [
    new Action({
      actionPoints: [
        ActionPoint.ON_DEPLOYMENT_START,
      ],
      eventDestination: new SqsDestination(queue),
    }),
  ],
});
app.addExtension(queueExtension);

// create extension through sns topic
const topic = new Topic(stack, 'MyTopic');
const topicExtension = new Extension(stack, 'MyTopicExtension', {
  actions: [
    new Action({
      actionPoints: [
        ActionPoint.ON_DEPLOYMENT_START,
      ],
      eventDestination: new SnsDestination(topic),
    }),
  ],
});
app.addExtension(topicExtension);

// create extension through event bus (with parameters)
const bus = EventBus.fromEventBusName(stack, 'MyEventBus', 'default');
const busExtension = new Extension(stack, 'MyEventBusExtension', {
  actions: [
    new Action({
      actionPoints: [
        ActionPoint.ON_DEPLOYMENT_START,
      ],
      eventDestination: new EventBridgeDestination(bus),
      description: 'My event bus action',
      name: 'MyEventBusPreHostedConfigVersionAction',
    }),
  ],
  parameters: [
    Parameter.required('testParam', 'true'),
    Parameter.notRequired('testNotRequiredParam'),
  ],
});
app.addExtension(busExtension);

// invoke the extension actions
const env = app.addEnvironment('MyEnv');
const hostedConfig = new HostedConfiguration(stack, 'HostedConfiguration', {
  application: app,
  content: ConfigurationContent.fromInlineJson('This is my configuration content'),
  deployTo: [env],
  deploymentStrategy: new DeploymentStrategy(stack, 'MyDeployStrategy', {
    rolloutStrategy: RolloutStrategy.linear({
      growthFactor: 100,
      deploymentDuration: Duration.minutes(0),
    }),
  }),
});
hostedConfig.node.addDependency(lambdaExtension, topicExtension, busExtension, queueExtension);

/* resource deployment alone is sufficient because we already have the
   corresponding resource handler tests to assert that resources can be
   used after created */

new IntegTest(app, 'appconfig-extension', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      args: {
        force: true,
      },
    },
  },
});
