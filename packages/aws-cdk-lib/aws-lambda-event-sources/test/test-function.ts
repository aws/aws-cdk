import * as constructs from 'constructs';
import * as lambda from '../../aws-lambda';

export class TestFunction extends lambda.Function {
  constructor(scope: constructs.Construct, id: string) {
    super(scope, id, {
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });
  }
}

/* eslint-disable no-console */
async function handler(event: any) {
  console.log('event:', JSON.stringify(event, undefined, 2));
  return { event };
}
