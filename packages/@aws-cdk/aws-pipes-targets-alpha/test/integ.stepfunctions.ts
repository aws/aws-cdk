import { InputTransformation, IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { SfnStateMachine } from '../lib/stepfunctions';

/*
 * Stack verification steps:
 * 1. Create a parameter 'MyParameter' in SystemsManager(SSM) with value '🌧️'
 * 3. The message '🌈' is sent to the queue 'SourceQueue', which triggers the step function from the pipe.
 * 4. The step function updates the parameter 'MyParameter' from value '🌧️' to '🌈'
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-sfn-target');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');

// When this module is promoted from alpha, TestSource should
// be replaced with SqsSource from @aws-cdk/aws-pipes-sources-alpha
class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;
  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }
  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }
  grantRead(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

const parameterName = 'MyPipeParameter';
new ssm.StringParameter(stack, 'MyParameter', {
  parameterName,
  stringValue: '🌧️',
});
const putParameterStep = new tasks.CallAwsService(stack, 'PutParameter', {
  service: 'ssm',
  action: 'putParameter',
  iamResources: ['*'],
  parameters: {
    'Name': parameterName,
    'Value.$': '$[0].body', // The message is received in batches, we just take the first message to update the parameter.
    'Type': 'String',
    'Overwrite': true,
  },
});

const targetStateMachine = new sfn.StateMachine(stack, 'TargetStateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable( putParameterStep),
});

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new SfnStateMachine(targetStateMachine,
    {
      inputTransformation: InputTransformation.fromObject({ body: '<$.body>' }),
    }),
});

const test = new IntegTest(app, 'integtest-pipe-target-sfn', {
  testCases: [stack],
});

const rainbow = '🌈';
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: rainbow,
});

putMessageOnQueue.next(test.assertions.awsApiCall('SSM', 'getParameter',
  {
    Name: parameterName,
  })).expect(ExpectedResult.objectLike({
  Parameter: {
    Name: parameterName,
    Value: rainbow,
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(10),
});

app.synth();
