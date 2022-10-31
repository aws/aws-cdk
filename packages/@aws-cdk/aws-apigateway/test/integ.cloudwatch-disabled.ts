import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as apigateway from '../lib';

export class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);
    const api = new apigateway.RestApi(this, 'my-api', {
      retainDeployments: true,
    });
    api.root.addMethod('GET'); // must have at least one method or an API definition
  }
}

const app = new cdk.App();
new IntegTest(app, 'cloudwatch-logs-disabled', {
  testCases: [
    new Test(app, 'default-api'),
  ],
});
