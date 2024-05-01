import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as constructs from 'constructs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

export class TestFunction extends lambda.Function {
  constructor(scope: constructs.Construct, id: string) {
    super(scope, id, {
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
      runtime: STANDARD_NODEJS_RUNTIME,
    });
  }
}

/* eslint-disable no-console */
async function handler(event: any) {
  console.log('event:', JSON.stringify(event, undefined, 2));
  return { event };
}
