import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 *
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> --input {"body": "Hello"} : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return "Hello JSONata!"
 */
class TestStack extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const commonParameters = {
      Bucket: bucket.bucketName,
      Key: 'test.txt',
    };

    const iamResources = [bucket.arnForObjects('*')];

    const putObject = tasks.CallAwsService.jsonata(this, 'PutObject', {
      service: 's3',
      action: 'putObject',
      parameters: {
        Body: "{% $states.input.body & ' JSONata!' %}",
        ...commonParameters,
      },
      iamResources,
    });

    const getObject = tasks.CallAwsService.jsonata(this, 'GetObject', {
      service: 's3',
      action: 'getObject',
      parameters: commonParameters,
      iamResources,
      assign: {
        body: '{% $states.result.Body %}',
      },
    });

    const deleteObject = tasks.CallAwsService.jsonata(this, 'DeleteObject', {
      service: 's3',
      action: 'deleteObject',
      parameters: commonParameters,
      iamResources,
      outputs: '{% $body %}',
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: putObject.next(getObject).next(deleteObject),
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: this.stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-stepfunctions-aws-sdk-jsonata-integ');
const testCase = new IntegTest(app, 'AwsSdkJsonataTest', {
  testCases: [stack],
});

// Start an execution
const start = testCase.assertions.awsApiCall('@aws-sdk/client-sfn', 'StartExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
  input: JSON.stringify({
    body: 'Hello',
  }),
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('@aws-sdk/client-sfn', 'DescribeExecution', {
  executionArn: start.getAttString('executionArn'),
});

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: '"\\"Hello JSONata!\\""',
}));
app.synth();
