import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

class SfnRestApiWithoutDefaultMethodResponsesStack extends cdk.Stack {
  constructor(scope: Construct) {
    super(scope, 'SfnRestApiWithoutDefaultMethodResponses');

    const passTask = new sfn.Pass(this, 'PassTask', {
      result: { value: 'Hello' },
    });

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: passTask,
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });

    const api = new apigw.StepFunctionsRestApi(this, 'StepFunctionsRestApi', {
      stateMachine: stateMachine,
      useDefaultMethodResponses: false,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
    });
  }
}

const app = new cdk.App();
const testCase = new SfnRestApiWithoutDefaultMethodResponsesStack(app);

new IntegTest(app, 'sfn-restapi-without-default-method-responses', {
  testCases: [testCase],
});
app.synth();
