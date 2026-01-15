import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const CSV_KEY = 'my-key.csv';

class DistributedMapParallelStack extends cdk.Stack {
  readonly bucket: s3.Bucket;
  readonly stateMachine: sfn.StateMachine;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const parallel = new sfn.Parallel(this, 'Parallel');

    const distributedMap = new sfn.DistributedMap(this, 'DistributedMap', {
      itemReader: new sfn.S3CsvItemReader({
        bucket: this.bucket,
        key: CSV_KEY,
        csvHeaders: sfn.CsvHeaders.useFirstRow(),
      }),
    }).itemProcessor(new sfn.Pass(this, 'Pass'));

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.ChainDefinitionBody.fromChainable(parallel.branch(distributedMap)),
    });
  }
}

function setupAssertions(testCaseStack: DistributedMapParallelStack, assertions: integ.IDeployAssert) {
  const waitForStateMachineActive = assertions
    .awsApiCall('StepFunctions', 'describeStateMachine', {
      stateMachineArn: testCaseStack.stateMachine.stateMachineArn,
    })
    .expect(integ.ExpectedResult.objectLike({ status: 'ACTIVE' }))
    .waitForAssertions({
      interval: cdk.Duration.seconds(10),
      totalTimeout: cdk.Duration.minutes(5),
    });

  // Upload the input to the DistributedMap
  const uploadInput = assertions.awsApiCall('S3', 'putObject', {
    Bucket: testCaseStack.bucket.bucketName,
    Key: CSV_KEY,
    Body: 'a,b,c\n1,2,3\n4,5,6',
  });

  // Start an execution
  const startExecution = assertions.awsApiCall('StepFunctions', 'startExecution', {
    stateMachineArn: testCaseStack.stateMachine.stateMachineArn,
  });

  const executionArn = startExecution.getAttString('executionArn');

  const expectSucceededExecution = assertions
    .awsApiCall('StepFunctions', 'describeExecution', { executionArn: executionArn })
    .expect(integ.ExpectedResult.objectLike({ status: 'SUCCEEDED' }))
    .waitForAssertions({
      interval: cdk.Duration.seconds(10),
      totalTimeout: cdk.Duration.minutes(1),
    });

  waitForStateMachineActive
    .next(uploadInput)
    .next(startExecution)
    .next(expectSucceededExecution);
}

const app = new cdk.App();
const parallelStack = new DistributedMapParallelStack(app, 'DistributedMapParallelStack');

const testCase = new integ.IntegTest(app, 'DistributedMapParallel', {
  testCases: [parallelStack],
});

setupAssertions(parallelStack, testCase.assertions);
