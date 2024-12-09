import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-call-aws-service-efs-integ');

const task = new CallAwsService(stack, 'TagEfsAccessPoint', {
  service: 'efs',
  action: 'tagResource',
  iamResources: ['*'],
  parameters: {
    ResourceId: sfn.JsonPath.stringAt('$.pathToArn'),
    Tags: [
      {
        Key: 'MYTAGNAME',
        Value: sfn.JsonPath.stringAt('$.pathToId'),
      },
    ],
  },
  resultPath: sfn.JsonPath.DISCARD,
});

new sfn.StateMachine(stack, 'StateMachine', {
  definition: task,
});

// THEN
new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
