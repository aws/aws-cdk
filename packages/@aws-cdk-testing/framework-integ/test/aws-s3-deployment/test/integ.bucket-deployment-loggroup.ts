import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

const app = new App();
const stack = new Stack(app, 'BucketDeploymentLogGroupStack');

const bucket = new s3.Bucket(stack, 'Dest', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const logGroup = new logs.LogGroup(stack, 'LogGroup', {
  retention: logs.RetentionDays.ONE_DAY,
  removalPolicy: RemovalPolicy.DESTROY,
});

new s3deploy.BucketDeployment(stack, 'Deploy', {
  sources: [s3deploy.Source.data('index.html', '<h1>Hello</h1>')],
  destinationBucket: bucket,
  logGroup,
});

new IntegTest(app, 'BucketDeploymentLogGroupInteg', {
  testCases: [stack],
});
