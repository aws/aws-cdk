import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { ApiDestinationTarget } from '../lib/api-destination';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-api-dest');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');

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

const secret = new cdk.aws_secretsmanager.Secret(stack, 'MySecret', {
  secretStringValue: cdk.SecretValue.unsafePlainText('abc123'),
});

const connection = new cdk.aws_events.Connection(stack, 'MyConnection', {
  authorization: cdk.aws_events.Authorization.apiKey('x-api-key', secret.secretValue),
  description: 'Connection with API Key x-api-key',
  connectionName: 'MyConnection',
});

const destination = new cdk.aws_events.ApiDestination(stack, 'MyDestination', {
  connection,
  endpoint: 'https://httpbin.org/headers',
  httpMethod: cdk.aws_events.HttpMethod.GET,
  apiDestinationName: 'MyDestination',
  rateLimitPerSecond: 1,
  description: 'Calling example.com with API key x-api-key',
});

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new ApiDestinationTarget(destination),

});

const test = new IntegTest(app, 'integtest-pipe-target-api-dest', {
  testCases: [stack],
});

test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: 'USA',
});

// This is difficult to validate as we're invoking an external API.
// A manual check was done to ensure the pipe executed successfully.

app.synth();
