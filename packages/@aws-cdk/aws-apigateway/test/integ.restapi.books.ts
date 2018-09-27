import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import apigw = require('../lib');

class BookStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    const booksHandler = new apigw.LambdaIntegration(new lambda.Function(this, 'BooksHandler', {
      runtime: lambda.Runtime.NodeJS610,
      handler: 'index.handler',
      code: lambda.Code.inline(`exports.handler = ${echoHandlerCode}`)
    }));

    const bookHandler = new apigw.LambdaIntegration(new lambda.Function(this, 'BookHandler', {
      runtime: lambda.Runtime.NodeJS610,
      handler: 'index.handler',
      code: lambda.Code.inline(`exports.handler = ${echoHandlerCode}`)
    }));

    const hello = new apigw.LambdaIntegration(new lambda.Function(this, 'Hello', {
      runtime: lambda.Runtime.NodeJS610,
      handler: 'index.handler',
      code: lambda.Code.inline(`exports.handler = ${helloCode}`)
    }));

    const api = new apigw.RestApi(this, 'books-api');
    api.root.addMethod('ANY', hello);

    const books = api.root.addResource('books', {
      defaultIntegration: booksHandler,
      defaultMethodOptions: { authorizationType: apigw.AuthorizationType.IAM }
    });

    books.addMethod('GET');
    books.addMethod('POST');

    const book = books.addResource('{book_id}', {
      defaultIntegration: bookHandler
      // note that authorization type is inherited from /books
    });

    book.addMethod('GET');
    book.addMethod('DELETE');
  }
}

class BookApp extends cdk.App {
  constructor(argv: string[]) {
    super(argv);

    new BookStack(this, 'restapi-books-example');
  }
}

function echoHandlerCode(event: any, _: any, callback: any) {
  return callback(undefined, {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event)
  });
}

function helloCode(_event: any, _context: any, callback: any) {
  return callback(undefined, {
    statusCode: 200,
    body: 'hello, world!'
  });
}

process.stdout.write(new BookApp(process.argv).run());
