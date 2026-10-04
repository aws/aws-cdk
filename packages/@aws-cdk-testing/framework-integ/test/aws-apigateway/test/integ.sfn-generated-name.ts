import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { App, PhysicalName, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { RestApi, StepFunctionsIntegration } from 'aws-cdk-lib/aws-apigateway';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const app = new App();

const stack = new Stack(app, 'SfnGeneratedNameStack', {
  env: { account: '111111111111', region: 'us-east-1' },
});

const stateMachine = new sfn.StateMachine(stack, 'Machine', {
  stateMachineName: PhysicalName.GENERATE_IF_NEEDED,
  stateMachineType: sfn.StateMachineType.EXPRESS,
  definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Pass(stack, 'Pass')),
});

const api = new RestApi(stack, 'Api', {
  cloudWatchRole: true,
});
api.root.addMethod('POST', StepFunctionsIntegration.startExecution(stateMachine));

const other = new Stack(app, 'SfnGeneratedNameOtherStack', {
  env: { account: '999999999999', region: 'eu-west-1' },
});
new StringParameter(other, 'StateMachineArn', {
  stringValue: stateMachine.stateMachineArn,
});

new IntegTest(app, 'sfn-generated-name', {
  testCases: [stack, other],
});
