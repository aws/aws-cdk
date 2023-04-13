import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

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
      cloudWatchRole: true,
      stateMachine: stateMachine,
      headers: true,
      path: false,
      querystring: false,
      requestContext: {
        accountId: true,
        userArn: true,
      },
    });

    api.deploymentStage = new apigw.Stage(this, 'stage', {
      deployment: new apigw.Deployment(this, 'deployment', {
        api,
      }),
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
    });
  }
}

const app = new cdk.App();
const testCase = new StepFunctionsRestApiDeploymentStack(app);

new IntegTest(app, 'step-functions-restapi', {
  testCases: [testCase],
});
app.synth();
