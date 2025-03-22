import * as cdk from 'aws-cdk-lib/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as s3 from 'aws-cdk-lib/aws-s3';

const CSV_KEY = 'my-key.csv';

class DistributedMapStack extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  readonly bucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distributedMap = sfn.DistributedMap.jsonata(this, 'DistributedMap', {
      itemReader: new sfn.S3CsvItemReader({
        bucket: this.bucket,
        key: CSV_KEY,
        csvHeaders: sfn.CsvHeaders.useFirstRow(),
      }),
      assign: {
        uniqueId: '{% $invalidFunction() %}', // This function does not exist, triggering an error
      },
    }).addCatch(
      sfn.Fail.jsonPath(this, 'failed', {
        error: 'ErrorHappened',
        cause: 'We got stuck',
      }),
      {
        outputs: '$states.errorOutput',
      },
    );

    distributedMap.itemProcessor(sfn.Pass.jsonata(this, 'Pass'), {
      mode: sfn.ProcessorMode.DISTRIBUTED,
      executionType: sfn.ProcessorType.STANDARD,
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: distributedMap,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }
}

const app = new cdk.App();
const stack = new DistributedMapStack(app, 'aws-stepfunctions-map-with-catch');

const testCase = new IntegTest(app, 'DistributedMap-JSONATA', {
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

// Describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});

// Expect the execution to FAIL since assign will throw
describe.expect(ExpectedResult.objectLike({
  status: 'FAILED',
  cause: 'We got stuck',
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(5),
});

app.synth();
