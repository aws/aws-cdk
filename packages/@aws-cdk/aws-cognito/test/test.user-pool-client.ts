import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import cognito = require('../lib');

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const pool = new cognito.UserPool(stack, 'Pool', { });

    // WHEN
    new cognito.UserPoolClient(stack, 'Client', {
      userPool: pool
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPoolClient', {
      UserPoolId: pool.node.resolve(pool.userPoolId)
    }));

    test.done();
  }
};