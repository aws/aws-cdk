import * as cdk from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'node:path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const CSV_KEY = 'distributed-map-batch.csv';

class DistributedMapBatchInputStack extends cdk.Stack {
  readonly bucket: s3.Bucket;
  readonly stateMachine: sfn.StateMachine;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distributedMap = new sfn.DistributedMap(this, 'DistributedMapBatchInput', {
      itemReader: new sfn.S3CsvItemReader({
        bucket: this.bucket,
        key: CSV_KEY,
        csvHeaders: sfn.CsvHeaders.useFirstRow(),
      }),
      itemBatcher: new sfn.ItemBatcher({
        maxItemsPerBatch: 2,
        batchInput: {
          batchInputValue: 'constant-value',
          batchInputPathValue: sfn.JsonPath.stringAt('$.batchInputPathValue'),
        },
      }),
      resultWriter: new sfn.ResultWriter({
        bucket: this.bucket,
        prefix: 'my-prefix',
      }),
    });
    distributedMap.itemProcessor(new sfn.Pass(this, 'Pass'));

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(distributedMap),
    });

  }
}

const app = new cdk.App();
const stack = new DistributedMapBatchInputStack(app, 'aws-stepfunctions-distributed-map-batch-input-integ');

const testCase = new IntegTest(app, 'DistributedMapBatchInput', {
  testCases: [stack],
});

testCase.assertions
  .awsApiCall('StepFunctions', 'describeStateMachine', {
    stateMachineArn: stack.stateMachine.stateMachineArn,
  })
  .expect(ExpectedResult.objectLike({ status: 'ACTIVE' }));

// Put an object in the bucket
const putObject = testCase.assertions.awsApiCall('S3', 'putObject', {
  Bucket: stack.bucket.bucketName,
  Key: CSV_KEY,
  Body: 'a,b,c\n1,2,3\n4,5,6',
});

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
  input: JSON.stringify({ batchInputPathValue: 'batch-input-value' }),
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

const objects = testCase.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: stack.bucket.bucketName,
  Prefix: 'my-prefix/',
});

objects.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});

objects.expect(integ.ExpectedResult.objectLike({
  Contents: Match.arrayWith(
    [
      Match.objectLike({
        Key: Match.stringLikeRegexp('\/SUCCEEDED_0\.json$'),
      }),
      Match.objectLike({
        Key: Match.stringLikeRegexp('\/manifest\.json$'),
      }),
    ],
  ),
}));

describe.next(objects);

const invoke = new lambdaNodeJs.NodejsFunction(stack, 'GetResultWriterOutput', {
  entry: path.join(__dirname, 'integ-assets', 'get-succeeded-batch-execution-result/index.ts'),
  handler: 'handler',
  initialPolicy: [
    new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        's3:GetObject',
        's3:ListBucket',
      ],
    }),
  ],
  runtime: lambda.Runtime.NODEJS_18_X,
});

const getResult = testCase.assertions.invokeFunction({
  functionName: invoke.functionName,
  payload: JSON.stringify({
    bucket: stack.bucket.bucketName,
    prefix: 'my-prefix/',
  }),
});

getResult.expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    BatchInput: {
      batchInputValue: 'constant-value',
      batchInputPathValue: 'batch-input-value',
    },
    Items: [
      { a: '1', b: '2', c: '3' },
      { a: '4', b: '5', c: '6' },
    ],
  }),
}));

objects.next(getResult);

app.synth();
