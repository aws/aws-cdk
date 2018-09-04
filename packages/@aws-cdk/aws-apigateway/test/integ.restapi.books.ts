import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import apigw = require('../lib');

class BookStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string) {
        super(parent, name);

        const echo = new apigw.LambdaIntegration(new lambda.Function(this, 'Handler', {
            runtime: lambda.Runtime.NodeJS610,
            handler: 'index.handler',
            code: lambda.Code.inline(`exports.handler = ${handlerCode}`)
        }));

        const hello = new apigw.LambdaIntegration(new lambda.Function(this, 'Hello', {
            runtime: lambda.Runtime.NodeJS610,
            handler: 'index.handler',
            code: lambda.Code.inline(`exports.handler = ${helloCode}`)
        }));

        const api = new apigw.RestApi(this, 'books-api', { defaultIntegration: echo });
        api.onMethod('GET', hello);

        const books = api.addResource('books');
        books.onMethod('GET');
        books.onMethod('POST');

        const book = books.addResource('{book_id}');
        book.onMethod('GET');
        book.onMethod('DELETE');
    }
}

class BookApp extends cdk.App {
    constructor(argv: string[]) {
        super(argv);

        new BookStack(this, 'restapi-books-example');
    }
}

function handlerCode(event: any, _: any, callback: any) {
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