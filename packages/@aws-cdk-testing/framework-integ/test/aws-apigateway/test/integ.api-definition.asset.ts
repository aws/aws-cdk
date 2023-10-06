import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

/*
 * Stack verification steps:
 * * `curl -s -o /dev/null -w "%{http_code}" <CFN output PetsURL>` should return HTTP code 200
 * * `curl -s -o /dev/null -w "%{http_code}" <CFN output BooksURL>` should return HTTP code 200
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-fromdefinition-asset');

const api = new apigateway.SpecRestApi(stack, 'my-api', {
  cloudWatchRole: true,
  apiDefinition: apigateway.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml')),
});

api.root.addResource('books').addMethod('GET', new apigateway.MockIntegration({
  integrationResponses: [{
    statusCode: '200',
  }],
  passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
  requestTemplates: {
    'application/json': '{ "statusCode": 200 }',
  },
}), {
  methodResponses: [{ statusCode: '200' }],
});

new cdk.CfnOutput(stack, 'PetsURL', {
  value: api.urlForPath('/pets'),
});

new cdk.CfnOutput(stack, 'BooksURL', {
  value: api.urlForPath('/books'),
});

new IntegTest(app, 'restapi-fromdefinition', {
  testCases: [stack],
});
