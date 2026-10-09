import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

// The integration forwards only the named request headers to the Step Functions
// execution input, instead of all headers (which would include sensitive values
// such as Authorization).
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigateway-stepfunctions-header-names');

const api = new apigw.RestApi(stack, 'my-rest-api');
const passTask = new sfn.Pass(stack, 'passTask');

const stateMachine: sfn.IStateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(passTask),
  stateMachineType: sfn.StateMachineType.EXPRESS,
});

const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine, {
  headerNames: ['User-Id', 'x-correlation-id'],
});
api.root.addMethod('GET', integ);

new IntegTest(app, 'aws-apigateway-stepfunctions-header-names', {
  testCases: [
    stack,
  ],
});
