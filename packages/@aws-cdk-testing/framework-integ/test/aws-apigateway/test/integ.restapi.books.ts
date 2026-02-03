import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class BookStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const booksHandler = new apigw.LambdaIntegration(new lambda.Function(this, 'BooksHandler', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${echoHandlerCode}`),
    }));

    const bookHandler = new apigw.LambdaIntegration(new lambda.Function(this, 'BookHandler', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${echoHandlerCode}`),
    }));

    const hello = new apigw.LambdaIntegration(new lambda.Function(this, 'Hello', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${helloCode}`),
    }));

    const api = new apigw.RestApi(this, 'books-api', { cloudWatchRole: true });
    api.root.addMethod('ANY', hello);

    const books = api.root.addResource('books', {
      defaultIntegration: booksHandler,
      defaultMethodOptions: { authorizationType: apigw.AuthorizationType.IAM },
    });

    books.addMethod('GET');
    books.addMethod('POST');

    const book = books.addResource('{book_id}', {
      defaultIntegration: bookHandler,
      // note that authorization type is inherited from /books
    });

    book.addMethod('GET');
    book.addMethod('DELETE');
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new BookStack(app, 'restapi-books-example');
new IntegTest(app, 'restapi-books', {
  testCases: [testCase],
});

function echoHandlerCode(event: any, _: any, callback: any) {
  return callback(undefined, {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
  });
}

function helloCode(_event: any, _context: any, callback: any) {
  return callback(undefined, {
    statusCode: 200,
    body: 'hello, world!',
  });
}
