import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as aws_stepfunction_tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const CSV_KEY = 'my-key.csv';
const SUCCESS_MARKER_KEY = 'pass-flag.txt';

interface DistributedMapRedriveStackProps extends cdk.StackProps {
  readonly mapRunLabel?: string;
}

class DistributedMapRedriveStack extends cdk.Stack {
  readonly bucket: s3.Bucket;
  readonly stateMachine: sfn.StateMachine;

  constructor(scope: cdk.App, id: string, props?: DistributedMapRedriveStackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distributedMap = new sfn.DistributedMap(this, 'DistributedMap', {
      label: props?.mapRunLabel,
      itemReader: new sfn.S3CsvItemReader({
        bucket: this.bucket,
        key: CSV_KEY,
        csvHeaders: sfn.CsvHeaders.useFirstRow(),
      }),
    });

    // Existence of the success marker object determines if the distributed map succeeds or fails
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

function setupAssertions(testCaseStack: DistributedMapRedriveStack, assertions: integ.IDeployAssert) {
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

  // describe the results of the execution
  const expectFailedExecution = assertions
    .awsApiCall('StepFunctions', 'describeExecution', {
      executionArn: executionArn,
    })
    .expect(integ.ExpectedResult.objectLike({ status: 'FAILED' }))
    .waitForAssertions({
      interval: cdk.Duration.seconds(10),
      totalTimeout: cdk.Duration.minutes(1),
    });

  // Upload the success marker, so that the next execution succeeds
  const uploadSucceedMarker = assertions.awsApiCall('S3', 'putObject', {
    Bucket: testCaseStack.bucket.bucketName,
    Key: SUCCESS_MARKER_KEY,
    Body: '',
  });

  const redriveExecution = assertions.awsApiCall('StepFunctions', 'redriveExecution', {
    executionArn: executionArn,
  });

  const expectRedrivenExecution = assertions
    .awsApiCall('StepFunctions', 'describeExecution', { executionArn: executionArn })
    .expect(integ.ExpectedResult.objectLike({ status: 'SUCCEEDED' }))
    .waitForAssertions({
      interval: cdk.Duration.seconds(10),
      totalTimeout: cdk.Duration.minutes(1),
    });

  waitForStateMachineActive
    .next(uploadInput)
    .next(startExecution)
    .next(expectFailedExecution)
    .next(uploadSucceedMarker)
    .next(redriveExecution)
    .next(expectRedrivenExecution);
}

const app = new cdk.App();

const unlabeledDistributedMapStack = new DistributedMapRedriveStack(app, 'UnlabeledDistributedMapRedrive');
const labeledDistributedMapStack = new DistributedMapRedriveStack(app, 'LabeledDistributedMapRedrive', {
  mapRunLabel: 'myLabel',
});

const testCase = new integ.IntegTest(app, 'DistributedMap', {
  testCases: [unlabeledDistributedMapStack, labeledDistributedMapStack],
});

setupAssertions(labeledDistributedMapStack, testCase.assertions);
setupAssertions(unlabeledDistributedMapStack, testCase.assertions);
