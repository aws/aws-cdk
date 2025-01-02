import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as agw from 'aws-cdk-lib/aws-apigateway';

/*
 * Stack verification steps:
 * * `curl -i <CFN output PetsURL>` should return HTTP code 200
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-with-authorizer-and-proxy');

const userPool = new cognito.UserPool(stack, 'UserPool');

const authorizer = new agw.CognitoUserPoolsAuthorizer(stack, 'Authorizer', {
  cognitoUserPools: [userPool],
});

const restApi = new agw.RestApi(stack, 'CdkTestStack', {
  defaultMethodOptions: {
    authorizer,
    authorizationScopes: [cognito.OAuthScope.PROFILE.scopeName],
  },
});

restApi.root
  .resourceForPath('/user')
  .addMethod('GET', new agw.MockIntegration());

restApi.root
  .resourceForPath('/other')
  .addMethod('POST', new agw.MockIntegration(), {
    authorizationScopes: [cognito.OAuthScope.OPENID.scopeName],
  });

new IntegTest(app, 'apigateway-with-authorizer-and-proxy', {
  testCases: [stack],
});
