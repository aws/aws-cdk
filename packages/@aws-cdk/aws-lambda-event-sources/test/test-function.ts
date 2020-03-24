import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export class TestFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id, {
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
      runtime: lambda.Runtime.NODEJS_10_X
    });
  }
}

// tslint:disable:no-console
async function handler(event: any) {
  console.log('event:', JSON.stringify(event, undefined, 2));
  return { event };
}
