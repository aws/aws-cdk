#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as apigw from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-from-open-api-spec');

new apigw.SpecHttpApi(stack, 'oas-api', {
  apiDefinition: apigw.ApiDefinition.fromAsset('integ.oas.yaml'),
})

app.synth();
