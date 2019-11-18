#!/usr/bin/env node
import lambda = require('@aws-cdk/aws-lambda');
import { App, Construct, Stack } from '@aws-cdk/core';
import path = require('path');
import layers = require('../lib');

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new lambda.Function(this, 'Fn', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'handler')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      layers: [layers.Layer.AWS_SDK_JS.getLayerVersion(this)]
    });
  }
}

const app = new App();

new TestStack(app, 'integ-aws-cdk-sdk-js-layer');

app.synth();
