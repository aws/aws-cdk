import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

// tslint:disable:max-line-length

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ApiagtewayV2HttpApi');

const getbooksHandler = new lambda.Function(stack, 'MyFunc', {
  runtime: lambda.Runtime.PYTHON_3_7,
  handler: 'index.handler',
  code: new lambda.InlineCode(`
import json
def handler(event, context):
      return {
        'statusCode': 200,
        'body': json.dumps(event)
      }`),
});

const getbookReviewsHandler = new lambda.Function(stack, 'RootFunc', {
  runtime: lambda.Runtime.PYTHON_3_7,
  handler: 'index.handler',
  code: new lambda.InlineCode(`
import json, os
def handler(event, context):
      whoami = os.environ['WHOAMI']
      http_path = os.environ['HTTP_PATH']
      return {
        'statusCode': 200,
        'body': json.dumps({ 'whoami': whoami, 'http_path': http_path })
      }`),
  environment: {
    WHOAMI: 'root',
    HTTP_PATH: '/',
  },
});

const rootUrl = 'https://checkip.amazonaws.com';
const defaultUrl = 'https://aws.amazon.com';

// create a basic HTTP API with http proxy integration as the $default route
const api = new apigatewayv2.HttpApi(stack, 'HttpApi', {
  defaultTarget: { uri: defaultUrl },
});

api.addRoutes(['GET /', 'POST /'], api.addHttpIntegration('RootInteg', { url: rootUrl }));
api.addRoute({ method: apigatewayv2.HttpMethod.GET, path: '/books' }, api.addLambdaIntegration('getbooksInteg', { handler : getbooksHandler }));
api.addRoute('GET /books/reviews', api.addLambdaIntegration('getBookReviewInteg', { handler: getbookReviewsHandler }));
