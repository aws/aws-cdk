import { expect } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as lambda from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'can import a Lambda version by ARN'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const version = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:region:account-id:function:function-name:version');

    new cdk.CfnOutput(stack, 'ARN', { value: version.functionArn });
    new cdk.CfnOutput(stack, 'Name', { value: version.functionName });

    // THEN
    expect(stack).toMatch({
      Outputs: {
        ARN: {
          Value: "arn:aws:lambda:region:account-id:function:function-name:version"
        },
        Name: {
          Value: "function-name:version"
        }
      }
    });

    test.done();
  },
};
