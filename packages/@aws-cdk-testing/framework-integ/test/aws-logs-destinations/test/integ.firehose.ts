import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import * as dests from 'aws-cdk-lib/aws-logs-destinations';

class FirehoseEnv extends Stack {
  constructor(scope: constructs.Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const stream = new firehose.DeliveryStream(this, 'MyStream', {
      destination: new firehose.S3Bucket(bucket, { loggingConfig: { logging: false } }),
    });
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const firehoseDestination = new dests.FirehoseDestination(stream);

    new logs.SubscriptionFilter(this, 'Subscription', {
      logGroup: logGroup,
      destination: firehoseDestination,
      filterPattern: logs.FilterPattern.allEvents(),
    });
  }
}

const app = new App();
const stack = new FirehoseEnv(app, 'firehose-logsubscription-integ');

// If the proper dependency is not set, then the deployment fails with:
// Resource handler returned message: "Invalid request provided: AWS::Logs::SubscriptionFilter. Could not deliver test message to specified Firehose stream."
// (Service: CloudWatchLogs, Status Code: 400, Request ID: [...])"
new IntegTest(app, 'FirehoseInteg', {
  testCases: [stack],
});
