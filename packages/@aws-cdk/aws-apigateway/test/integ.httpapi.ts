import lambda = require('@aws-cdk/aws-lambda');
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import apigw = require('../lib');
import { HttpApiIntegrationType } from '../lib';
import { HttpMethod } from '../lib/route';

class HttpApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const echoFunc = new lambda.Function(this, 'FuncNodeDemo', {
      code: new lambda.InlineCode(`exports.handler = (event, context, callback) =>
      callback(null, {
        statusCode: '200',
        body: JSON.stringify(event),
        headers: {
          'Content-Type': 'application/json',
        },
      });`),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X
    });

    const greetingFunc = new lambda.Function(this, 'FuncPythonDemo', {
      code: new lambda.InlineCode(`
import json
def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    `),
    handler: 'index.lambda_handler',
    runtime: lambda.Runtime.PYTHON_3_7
    });

    new apigw.LambdaRestApi(this, 'MyRestApi', {
      handler: greetingFunc
    });

    const httpApi = new apigw.HttpApi(this, 'MyHttpApi', {
      handler: echoFunc
    });

    // HTTP ANY /demo
    const demoRoute = httpApi.root.addRoute('demo', {
      integrationType: HttpApiIntegrationType.LAMBDA,
      target: greetingFunc
    });

    // HTTP ANY /demo/demo2
    demoRoute.addRoute('demo2', {
      integrationType: HttpApiIntegrationType.LAMBDA,
      target: greetingFunc,
    });

    // HTTP ANY /pahud
    httpApi.root.addRoute('checkip', {
      integrationType: HttpApiIntegrationType.HTTP,
      integrationMethod: HttpMethod.GET,
      targetUrl: 'https://checkip.amazonaws.com/'
    });

  }
}
const app = new App();
new HttpApiStack(app, 'http-api-test');
app.synth();