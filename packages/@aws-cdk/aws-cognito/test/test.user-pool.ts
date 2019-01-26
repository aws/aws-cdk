import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import cognito = require('../lib');

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new cognito.UserPool(stack, 'Pool', {
      poolName: 'myPool'
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'myPool'
    }));

    test.done();
  },

  'usernameAliasAttributes require signInType of USERNAME'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const toThrow = () => {
      new cognito.UserPool(stack, 'Pool', {
        signInType: cognito.SignInType.EMAIL,
        usernameAliasAttributes: [cognito.Attribute.PREFERRED_USERNAME]
      });
    };

    // THEN
    test.throws(() => toThrow(), /'usernameAliasAttributes' can only be set with a signInType of 'USERNAME'/);
    test.done();
  },

  'usernameAliasAttributes must be one or more of EMAIL, PHONE_NUMBER, or PREFERRED_USERNAME'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const toThrow = () => {
      new cognito.UserPool(stack, 'Pool', {
        signInType: cognito.SignInType.USERNAME,
        usernameAliasAttributes: [cognito.Attribute.GIVEN_NAME]
      });
    };

    // THEN
    test.throws(() => toThrow(), /'usernameAliasAttributes' can only include EMAIL, PHONE_NUMBER, or PREFERRED_USERNAME/);
    test.done();
  },

  'autoVerifiedAttributes must be one or more of EMAIL or PHONE_NUMBER'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const toThrow = () => {
      new cognito.UserPool(stack, 'Pool', {
        signInType: cognito.SignInType.EMAIL,
        autoVerifiedAttributes: [cognito.Attribute.EMAIL, cognito.Attribute.GENDER]
      });
    };

    // THEN
    test.throws(() => toThrow(), /'autoVerifiedAttributes' can only include EMAIL or PHONE_NUMBER/);
    test.done();
  }
};