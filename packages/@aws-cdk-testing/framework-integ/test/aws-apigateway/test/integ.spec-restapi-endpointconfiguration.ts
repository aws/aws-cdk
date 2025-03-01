import * as path from 'path';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

const app = new App();
const stack = new Stack(app, 'specrestapi-endpointConfiguration');

const api = new apigateway.SpecRestApi(stack, 'my-api', {
  apiDefinition: apigateway.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml')),
  endpointConfiguration: {
    types: [apigateway.EndpointType.REGIONAL],
  },
});

new CfnOutput(stack, 'PetsURL', {
  value: api.urlForPath('/pets'),
});

const integTest = new IntegTest(app, 'specrestapi-endpointConfiguration-test', {
  testCases: [stack],
});

integTest.assertions.httpApiCall(api.urlForPath('/pets')).expect(ExpectedResult.objectLike({
  status: 200,
  ok: true,
}));
