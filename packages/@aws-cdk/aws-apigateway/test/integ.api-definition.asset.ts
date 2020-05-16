import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as apigateway from '../lib';

/*
 * Stack verification steps:
 * * `curl -i <CFN output PetsURL>` should return HTTP code 200
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-fromdefinition-asset');

const api = new apigateway.SpecRestApi(stack, 'my-api', {
  apiDefinition: apigateway.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml')),
});

new cdk.CfnOutput(stack, 'PetsURL', {
  value: api.urlForPath('/pets'),
});

app.synth();
