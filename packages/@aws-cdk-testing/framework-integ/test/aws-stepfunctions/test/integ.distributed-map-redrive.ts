import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as aws_stepfunction_tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const CSV_KEY = 'my-key.csv';
const SUCCESS_MARKER_KEY = 'pass-flag.txt';

class DistributedMapRedriveStack extends cdk.Stack {
  readonly bucket: s3.Bucket;
  readonly stateMachine: sfn.StateMachine;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distributedMap = new sfn.DistributedMap(this, 'DistributedMap', {
      itemReader: new sfn.S3CsvItemReader({
        bucket: this.bucket,
        key: CSV_KEY,
        csvHeaders: sfn.CsvHeaders.useFirstRow(),
      }),
    });

    const getSuccessMarker = new aws_stepfunction_tasks.CallAwsService(this, 'GetData', {
      action: 'getObject',
      iamResources: [this.bucket.arnForObjects('*')],
      parameters: {
        Bucket: this.bucket.bucketName,
        Key: SUCCESS_MARKER_KEY,
      },
      service: 's3',
    });

    distributedMap.itemProcessor(getSuccessMarker);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.ChainDefinitionBody.fromChainable(distributedMap),
    });
  }
}

const app = new cdk.App();
const stack = new DistributedMapRedriveStack(app, 'aws-stepfunctions-distributed-map-redrive-integ');

const testCase = new IntegTest(app, 'DistributedMap', {
  testCases: [stack],
});

testCase.assertions
  .awsApiCall('StepFunctions', 'describeStateMachine', {
    stateMachineArn: stack.stateMachine.stateMachineArn,
  })
  .expect(ExpectedResult.objectLike({ status: 'ACTIVE' }))
  .waitForAssertions({
    interval: cdk.Duration.seconds(10),
    totalTimeout: cdk.Duration.minutes(5),
  });

// Put an object in the bucket
const putObject = testCase.assertions.awsApiCall('S3', 'putObject', {
  Bucket: stack.bucket.bucketName,
  Key: CSV_KEY,
  Body: 'a,b,c\n1,2,3\n4,5,6',
});

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
});
putObject.next(start);

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
start.next(describe);

// assert the results
describe
  .expect(ExpectedResult.objectLike({ status: 'FAILED' }))
  .waitForAssertions({
    interval: cdk.Duration.seconds(10),
    totalTimeout: cdk.Duration.minutes(1),
  });

const uploadSucceedMarker = testCase.assertions.awsApiCall('S3', 'putObject', {
  Bucket: stack.bucket.bucketName,
  Key: SUCCESS_MARKER_KEY,
  Body: '',
});
describe.next(uploadSucceedMarker);

const redrive = testCase.assertions.awsApiCall('StepFunctions', 'redriveExecution', {
  executionArn: start.getAttString('executionArn'),
});
uploadSucceedMarker.next(redrive);

// describe the results of the execution
const describeRedrive = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
redrive.next(describeRedrive);

// assert the results
describeRedrive
  .expect(ExpectedResult.objectLike({ status: 'SUCCEEDED' }))
  .waitForAssertions({
    interval: cdk.Duration.seconds(10),
    totalTimeout: cdk.Duration.minutes(1),
  });

app.synth();
