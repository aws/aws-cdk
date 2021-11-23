import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as apigw from '../lib';

/**
 * Stack verification steps:
 * * `curl -X POST 'https://<api-id>.execute-api.<region>.amazonaws.com/prod' \
 * * -d '{"key":"Hello"}' -H 'Content-Type: application/json'`
 * The above should return a "Hello" response
 */

class StepFunctionsRestApiDeploymentStack extends cdk.Stack {
  constructor(scope: Construct) {
    super(scope, 'StepFunctionsRestApiDeploymentStack');

    const passTask = new sfn.Pass(this, 'PassTask', {
      result: { value: 'Hello' },
    });

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: passTask,
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });

    const api = new apigw.StepFunctionsRestApi(this, 'StepFunctionsRestApi', {
      deploy: false,
      stateMachine: stateMachine,
      headers: true,
      querystring: true,
      path: true,
      requestContext: {
        accountId: true,
        apiId: true,
        apiKey: true,
        authorizerPrincipalId: true,
        caller: true,
        cognitoAuthenticationProvider: true,
        cognitoAuthenticationType: true,
        cognitoIdentityId: true,
        cognitoIdentityPoolId: true,
        httpMethod: true,
        stage: true,
        sourceIp: true,
        user: true,
        userAgent: true,
        userArn: true,
        requestId: true,
        resourceId: true,
        resourcePath: true,
      },
    });

    api.deploymentStage = new apigw.Stage(this, 'stage', {
      deployment: new apigw.Deployment(this, 'deployment', {
        api,
      }),
    });
  }
}

const app = new cdk.App();
new StepFunctionsRestApiDeploymentStack(app);
app.synth();
