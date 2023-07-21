import { Stack, App, Duration } from 'aws-cdk-lib';
import { Alarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import {
  DeploymentStrategy,
  Environment,
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
} from '../lib';

class DeploymentStrategyTestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // create basic deployment strategy
    new DeploymentStrategy(this, 'MyDeploymentStrategy', {
      rolloutStrategy: RolloutStrategy.linear(15, Duration.minutes(5)),
    });
  }
}

class EnvironmentTestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // create resources needed for environment
    const app = new Application(this, 'MyApplication', {
      name: 'AppForEnvTest',
    });
    const alarm = new Alarm(this, 'MyAlarm', {
      metric: new Metric({
        namespace: 'aws',
        metricName: 'dummy name',
      }),
      evaluationPeriods: 5,
      threshold: 10,
    });

    // create environment with all props defined
    new Environment(this, 'MyEnvironment', {
      application: app,
      description: 'This is the environment for integ testing',
      monitors: [
        {
          alarm,
        },
      ],
    });
  }
}

class ExtensionTestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // create extension through lambda
    const lambda = new Function(this, 'MyFunction', {
      runtime: Runtime.PYTHON_3_8,
      handler: 'index.handler',
      code: Code.fromInline('def handler(event, context):\n\tprint(\'The function has been invoked.\')'),
    });
    const app = new Application(this, 'MyApplication', {
      name: 'AppForExtensionTest',
    });
    const lambdaExtension = new Extension(this, 'MyLambdaExtension', {
      actions: [
        new Action({
          actionPoints: [
            ActionPoint.PRE_CREATE_HOSTED_CONFIGURATION_VERSION,
            ActionPoint.ON_DEPLOYMENT_START,
          ],
          eventDestination: new LambdaDestination(lambda),
        }),
      ],
    });
    app.addExtension(lambdaExtension);

    // create extension through sqs queue
    const queue = new Queue(this, 'MyQueue');
    const queueExtension = new Extension(this, 'MyQueueExtension', {
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
    const topic = new Topic(this, 'MyTopic');
    const topicExtension = new Extension(this, 'MyTopicExtension', {
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
    const bus = EventBus.fromEventBusName(this, 'MyEventBus', 'default');
    const busExtension = new Extension(this, 'MyEventBusExtension', {
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
    const hostedConfig = new HostedConfiguration(this, 'HostedConfiguration', {
      application: app,
      content: ConfigurationContent.fromInline('This is my configuration content'),
      deployTo: [env],
      deploymentStrategy: new DeploymentStrategy(this, 'MyDeployStrategy', {
        rolloutStrategy: RolloutStrategy.linear(100, Duration.minutes(0)),
      }),
    });
    hostedConfig.node.addDependency(lambdaExtension, topicExtension, busExtension, queueExtension);
  }
}

const app = new App();
new DeploymentStrategyTestStack(app, 'DeploymentStrategyIntegTest');
new EnvironmentTestStack(app, 'EnvironmentIntegTest');
new ExtensionTestStack(app, 'ExtensionIntegTest');
app.synth();
