import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2 } from 'aws-cdk-lib/cx-api';

const CSV_KEY = 'my-key.csv';

const app = new App({
  context: {
    [STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2]: true,
  },
});
const stack = new Stack(app, 'aws-stepfunctions-map-result-writer-bucket-jsonpath');

const bucket = new s3.Bucket(stack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: RemovalPolicy.DESTROY,
});

const distributedMap = new sfn.DistributedMap(stack, 'DistributedMap', {
  itemReader: new sfn.S3CsvItemReader({
    bucket: bucket,
    key: CSV_KEY,
  }),
  resultWriterV2: new sfn.ResultWriterV2({
    bucketNamePath: sfn.JsonPath.stringAt('$.bucketName'),
    prefix: 'my-prefix',
  }),
});

distributedMap.itemProcessor(new sfn.Pass(stack, 'Pass'));

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definition: distributedMap,
});

const integTest = new IntegTest(app, 'aws-stepfunctions-map-result-writer-bucket-jsonpath-test', {
  testCases: [stack],
});

const putObject = integTest.assertions.awsApiCall('S3', 'putObject', {
  Bucket: bucket.bucketName,
  Key: CSV_KEY,
  Body: 'a,b,c\n1,2,3\n4,5,6',
});

const start = integTest.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
  input: JSON.stringify({
    bucketName: bucket.bucketName,
  }),
});
putObject.next(start);

const describe = integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
  includedData: 'METADATA_ONLY',
});
start.next(describe);

describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: Duration.seconds(30),
  totalTimeout: Duration.minutes(5),
});
