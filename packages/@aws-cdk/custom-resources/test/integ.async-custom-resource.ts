import lambda = require('@aws-cdk/aws-lambda');
import { App, CfnOutput, Construct, Stack, Token } from '@aws-cdk/core';
import path = require('path');
import { AsyncCustomResource } from '../lib';

const app = new App();

class CustomResourceConsumer extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const res = new AsyncCustomResource(this, 'MyCustomResource', {
      handlerCode: lambda.Code.fromAsset(path.join(__dirname, 'acr-demo-handler')),
      resourceType: 'Custom::Boom',
      uuid: 'resource1',
      properties: {
        Prop1: 1234,
        Prop2: 'hello'
      },
    });

    new CfnOutput(this, 'CustomResourceAttribute', {
      value: Token.asString(res.getAtt('MyAttribute'))
    });

  }
}

new CustomResourceConsumer(app, 'acr-3');

app.synth();