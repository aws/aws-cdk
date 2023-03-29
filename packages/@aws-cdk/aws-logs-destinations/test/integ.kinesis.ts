import * as kinesis from '@aws-cdk/aws-kinesis';
import * as logs from '@aws-cdk/aws-logs';
import { App, Stack, RemovalPolicy } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as constructs from 'constructs';
import * as dests from '../lib';


class KinesisEnv extends Stack {
  constructor(scope: constructs.Construct, id: string) {
    super(scope, id);

    const stream = new kinesis.Stream(this, 'MyStream');
    const logGroup = new logs.LogGroup(this, 'LogGroup', { removalPolicy: RemovalPolicy.DESTROY });
    const kinesisDestination = new dests.KinesisDestination(stream);

    new logs.SubscriptionFilter(this, 'Subscription', {
      logGroup: logGroup,
      destination: kinesisDestination,
      filterPattern: logs.FilterPattern.allEvents(),
    });
  }
}

const app = new App();
const stack = new KinesisEnv(app, 'kinesis-logsubscription-integ');

// If the proper dependency is not set, then the deployment fails with:
// Resource handler returned message: "Could not deliver test message to specified
// Kinesis stream. Check if the given kinesis stream is in ACTIVE state.
// (Service: CloudWatchLogs, Status Code: 400, Request ID: [...])"
new IntegTest(app, 'KinesisInteg', {
  testCases: [stack],
});
app.synth();
