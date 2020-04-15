import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as %name.PascalCased% from '../lib/%name%-stack';

test('SQS Queue Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
    // THEN
    expect(stack).to(haveResource("AWS::SQS::Queue",{
      VisibilityTimeout: 300
    }));
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
  // THEN
  expect(stack).to(haveResource("AWS::SNS::Topic"));
});
