import { Template } from '@aws-cdk/assertions';
import * as cognito from '@aws-cdk/aws-cognito';
import { Duration, Stack } from '@aws-cdk/core';
import { AuthorizationType, CognitoUserPoolsAuthorizer, RestApi } from '../../lib';

describe('Cognito Authorizer', () => {
  test('default cognito authorizer', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new cognito.UserPool(stack, 'UserPool');

    // WHEN
    const authorizer = new CognitoUserPoolsAuthorizer(stack, 'myauthorizer', {
      cognitoUserPools: [userPool],
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'COGNITO_USER_POOLS',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.Authorization',
      ProviderARNs: [stack.resolve(userPool.userPoolArn)],
    });

    expect(authorizer.authorizerArn.endsWith(`/authorizers/${authorizer.authorizerId}`)).toBeTruthy();
  });

  test('cognito authorizer with all parameters specified', () => {
    // GIVEN
    const stack = new Stack();
    const userPool1 = new cognito.UserPool(stack, 'UserPool1');
    const userPool2 = new cognito.UserPool(stack, 'UserPool2');

    // WHEN
    const authorizer = new CognitoUserPoolsAuthorizer(stack, 'myauthorizer', {
      cognitoUserPools: [userPool1, userPool2],
      identitySource: 'method.request.header.whoami',
      authorizerName: 'myauthorizer',
      resultsCacheTtl: Duration.minutes(1),
    });

    const restApi = new RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'COGNITO_USER_POOLS',
      Name: 'myauthorizer',
      RestApiId: stack.resolve(restApi.restApiId),
      IdentitySource: 'method.request.header.whoami',
      AuthorizerResultTtlInSeconds: 60,
      ProviderARNs: [stack.resolve(userPool1.userPoolArn), stack.resolve(userPool2.userPoolArn)],
    });

    expect(authorizer.authorizerArn.endsWith(`/authorizers/${authorizer.authorizerId}`)).toBeTruthy();
  });

  test('rest api depends on the authorizer when @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
    const stack = new Stack();
    stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);
    const userPool1 = new cognito.UserPool(stack, 'UserPool');

    const authorizer = new CognitoUserPoolsAuthorizer(stack, 'Authorizer', {
      cognitoUserPools: [userPool1],
    });

    const restApi = new RestApi(stack, 'Api');

    restApi.root.addMethod('ANY', undefined, {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    });

    const template = Template.fromStack(stack);

    const authorizerId = Object.keys(template.findResources('AWS::ApiGateway::Authorizer'))[0];
    const deployment = Object.values(template.findResources('AWS::ApiGateway::Deployment'))[0];

    expect(deployment.DependsOn).toEqual(expect.arrayContaining([authorizerId]));
  });

  test('a new deployment is created when a cognito user pool is re-created and @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
    const createApiTemplate = (userPoolId: string) => {
      const stack = new Stack();
      stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);

      const userPool = new cognito.UserPool(stack, userPoolId);

      const auth = new CognitoUserPoolsAuthorizer(stack, 'myauthorizer', {
        resultsCacheTtl: Duration.seconds(0),
        cognitoUserPools: [userPool],
      });

      const restApi = new RestApi(stack, 'myrestapi');
      restApi.root.addMethod('ANY', undefined, {
        authorizer: auth,
        authorizationType: AuthorizationType.COGNITO,
      });

      return Template.fromStack(stack);
    };

    const oldTemplate = createApiTemplate('foo');
    const newTemplate = createApiTemplate('bar');

    const oldDeploymentId = Object.keys(oldTemplate.findResources('AWS::ApiGateway::Deployment'))[0];
    const newDeploymentId = Object.keys(newTemplate.findResources('AWS::ApiGateway::Deployment'))[0];

    expect(oldDeploymentId).not.toEqual(newDeploymentId);
  });
});
