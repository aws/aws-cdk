import cdk = require('@aws-cdk/core');
import apigateway = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'test-apigateway-restapi-defaults');

const api = new apigateway.RestApi(stack, 'my-api');

// at least one method is required
api.root.addMethod('GET');

app.synth();
