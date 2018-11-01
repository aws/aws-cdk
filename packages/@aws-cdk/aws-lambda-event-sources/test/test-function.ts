import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');

export class TestFunction extends lambda.Function {
  constructor(parent: cdk.Construct, id: string) {
    super(parent, id, {
      handler: 'index.handler',
      code: lambda.Code.inline(`exports.handler = ${handler.toString()}`),
      runtime: lambda.Runtime.NodeJS810
    });
  }
}

// tslint:disable:no-console
async function handler(event: any) {
  console.log('event:', JSON.stringify(event, undefined, 2));
  return { event };
}