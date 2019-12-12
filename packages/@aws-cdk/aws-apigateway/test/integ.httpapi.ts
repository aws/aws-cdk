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

    // new apigw.LambdaRestApi(this, 'MyRestApi', {
    //   handler: greetingFunc
    // });

    // HTTP API on root route with Lambda integration
    const httpApi = new apigw.HttpApi(this, 'MyHttpApi', {
      handler: echoFunc
    });

    // HTTP ANY /demo with Lambda integration
    const demoRoute = httpApi.root.addRoute('demo', {
      integrationType: HttpApiIntegrationType.LAMBDA,
      target: greetingFunc
    });

    // same as above with the addLambdaRoute() shorthand
    // HTTP ANY /demo/demo2
    demoRoute.addLambdaRoute('demo2', {
      target: greetingFunc,
    });

    // HTTP ANY /checkip
    // HTTP ANY /checkip will proxy to HTTP GET https://checkip.amazonaws.com/
    httpApi.root.addRoute('checkip', {
      integrationType: HttpApiIntegrationType.HTTP,
      integrationMethod: HttpMethod.GET,
      targetUrl: 'https://checkip.amazonaws.com/'
    });

    // same as above with the addHttpRoute() shorthand
    // HTTP ANY /checkip2 will proxy to HTTP ANY https://checkip.amazonaws.com/
    httpApi.root.addHttpRoute('checkip2', {
      targetUrl: 'https://checkip.amazonaws.com/'
    });

  }
}
const app = new App();
new HttpApiStack(app, 'http-api-test');
app.synth();