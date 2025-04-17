import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigateway-stepfunctions-startexecution-without-default-method-responses');

const api = new apigw.RestApi(stack, 'my-rest-api');
const passTask = new sfn.Pass(stack, 'passTask', {
  inputPath: '$.somekey',
});

const stateMachine: sfn.IStateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(passTask),
  stateMachineType: sfn.StateMachineType.EXPRESS,
});

const methodOptions = {
  methodResponses: [
    {
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    },
  ],
};

const integrationOptions = {
  useDefaultMethodResponses: false,
};

const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine, integrationOptions);

api.root.addMethod('GET', integ, methodOptions);

new IntegTest(app, 'aws-apigateway-stepfunctions-startexecution-without-default-method-responses', {
  testCases: [
    stack,
  ],
});

app.synth();
