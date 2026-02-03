import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { JsonPath } from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

/**
 *
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> --input {"body": "hello world!"} : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return "hello world!"
 */
class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket');

    const commonParameters = {
      Bucket: bucket.bucketName,
      Key: 'test.txt',
    };

    const iamResources = [bucket.arnForObjects('*')];

    const putObject = new tasks.CallAwsService(this, 'PutObject', {
      service: 's3',
      action: 'putObject',
      parameters: {
        Body: sfn.JsonPath.stringAt('$.body'),
        ...commonParameters,
      },
      iamResources,
    });

    const getObject = new tasks.CallAwsService(this, 'GetObject', {
      service: 's3',
      action: 'getObject',
      parameters: commonParameters,
      iamResources,
    });

    const deleteObject = new tasks.CallAwsService(this, 'DeleteObject', {
      service: 's3',
      action: 'deleteObject',
      parameters: commonParameters,
      iamResources,
      resultPath: JsonPath.DISCARD,
    });

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: putObject.next(getObject).next(deleteObject),
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-stepfunctions-aws-sdk-integ');
app.synth();
