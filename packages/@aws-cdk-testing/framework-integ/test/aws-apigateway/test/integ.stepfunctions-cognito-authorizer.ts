import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

/**
 * Stack verification steps:
 * 1. Get Cognito User Pool client ID and create a test user
 * 2. Authenticate and get JWT token
 * 3. curl -X POST 'https://<api-id>.execute-api.<region>.amazonaws.com/prod' \
 *    -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json'
 * 4. Check Step Functions execution input contains authorizer claims
 */

class StepFunctionsAuthorizerStack extends cdk.Stack {
  constructor(scope: Construct) {
    super(scope, 'StepFunctionsAuthorizerStack');

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = userPool.addClient('Client');

    // Step Functions State Machine
    const passTask = new sfn.Pass(this, 'PassTask', {
      result: { value: 'Success' },
    });

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: passTask,
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });

    // API Gateway with Cognito Authorizer
    const api = new apigw.RestApi(this, 'Api', {
      cloudWatchRole: true,
    });

    const cognitoAuthorizer = new apigw.CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [userPool],
    });

    const integration = apigw.StepFunctionsIntegration.startExecution(stateMachine, {
      authorizer: true,
    });

    api.root.addMethod('POST', integration, {
      authorizer: cognitoAuthorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', { value: api.url });
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'ClientId', { value: userPoolClient.userPoolClientId });
  }
}

const app = new cdk.App();
const testCase = new StepFunctionsAuthorizerStack(app);

new IntegTest(app, 'stepfunctions-cognito-authorizer', {
  testCases: [testCase],
});
app.synth();
