import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-call-aws-service-optional-iam-integ');

// Create a recursive Step Functions task that calls itself
// This demonstrates the use case where iamResources is optional
const recursiveTask = new CallAwsService(stack, 'RecursiveStartExecution', {
  service: 'sfn',
  action: 'startExecution',
  // Note: iamResources is intentionally omitted for recursive scenarios
  parameters: {
    StateMachineArn: sfn.JsonPath.stringAt('$.stateMachineArn'),
    Input: sfn.JsonPath.objectAt('$.input'),
  },
});

// Create a simple pass state to complete the workflow
const passState = new sfn.Pass(stack, 'Complete', {
  result: sfn.Result.fromObject({ status: 'completed' }),
});

// Create the state machine with manual IAM management
// Note: In a real scenario, IAM permissions would be managed separately
// to avoid circular dependencies, but for this integration test we'll
// demonstrate that the CloudFormation template generates correctly
const stateMachine = new sfn.StateMachine(stack, 'RecursiveStateMachine', {
  definition: recursiveTask.next(passState),
});

// Test with additional IAM statements only (no iamResources)
const taskWithAdditionalStatements = new CallAwsService(stack, 'TaskWithAdditionalOnly', {
  service: 'dynamodb',
  action: 'putItem',
  // Note: iamResources is omitted, only additionalIamStatements provided
  additionalIamStatements: [
    new iam.PolicyStatement({
      actions: ['dynamodb:PutItem'],
      resources: ['arn:aws:dynamodb:*:*:table/TestTable'],
    }),
  ],
  parameters: {
    TableName: 'TestTable',
    Item: {
      id: { S: sfn.JsonPath.stringAt('$.id') },
      data: { S: 'test-data' },
    },
  },
});

// Create a second state machine to test the additional statements scenario
const additionalStatementsStateMachine = new sfn.StateMachine(stack, 'AdditionalStatementsStateMachine', {
  definition: taskWithAdditionalStatements,
});

// THEN - Integration test to verify CloudFormation template generation
const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

// Verify that the recursive state machine was created successfully
integ.assertions.awsApiCall('StepFunctions', 'describeStateMachine', {
  stateMachineArn: stateMachine.stateMachineArn,
}).expect(ExpectedResult.objectLike({
  status: 'ACTIVE',
}));

// Verify that the additional statements state machine was created successfully
integ.assertions.awsApiCall('StepFunctions', 'describeStateMachine', {
  stateMachineArn: additionalStatementsStateMachine.stateMachineArn,
}).expect(ExpectedResult.objectLike({
  status: 'ACTIVE',
}));

app.synth();
