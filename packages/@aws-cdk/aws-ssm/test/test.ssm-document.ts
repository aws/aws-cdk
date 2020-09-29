import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ssm from '../lib';

export = {
  'association name is rendered properly in L1 construct'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ssm.CfnAssociation(stack, 'Assoc', {
      name: 'document',
      parameters: {
        a: ['a'],
        B: [],
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::SSM::Association', {
      Name: 'document',
      Parameters: {
        a: ['a'],
        B: [],
      },
    }));
    test.done();
  },
};
