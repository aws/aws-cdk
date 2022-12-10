import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import * as sfn from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-map-integ');

const bucket = new s3.Bucket(stack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const key = 'my-key.csv';

const distributedMap = new sfn.Map(stack, 'DistributedMap', {
  mode: sfn.MapProcessorMode.DISTRIBUTED,
  distributatedMapOptions: {
    itemReader: new sfn.S3CSVReader({
      bucket: bucket.bucketName,
      key,
    }),
    resultWriter: new sfn.S3Writer({
      bucket: bucket.bucketName,
      prefix: 'my-prefix',
    }),
  },
});
distributedMap.iterator(new sfn.Pass(stack, 'Pass'));

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  stateMachineName: 'MyStateMachine',
  definition: distributedMap,
});

const testCase = new IntegTest(app, 'DistributedMap', {
  testCases: [stack],
});

testCase.assertions
  .awsApiCall('StepFunctions', 'describeStateMachine', {
    stateMachineArn: stateMachine.stateMachineArn,
  })
  .expect(ExpectedResult.objectLike({ status: 'ACTIVE' }));

// Put an object in the bucket
const putObject = testCase.assertions.awsApiCall('S3', 'putObject', {
  Bucket: bucket.bucketName,
  Key: key,
  Body: 'a,b,c\n1,2,3\n4,5,6',
});

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});
putObject.next(start);

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
start.next(describe);

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
}));

app.synth();
