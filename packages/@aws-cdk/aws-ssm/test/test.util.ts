// tslint:disable: max-line-length

import { Stack, Token } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { arnForParameterName } from '../lib/util';

export = {
  arnForParameterName: {

    'simple names': {

      'concrete parameterName and no physical name (sep is "/")'(test: Test) {
        const stack = new Stack();
        test.deepEqual(stack.resolve(arnForParameterName(stack, 'myParam', undefined)), {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/myParam']]
        });
        test.done();
      },

      'token parameterName and concrete physical name (no additional "/")'(test: Test) {
        const stack = new Stack();
        test.deepEqual(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), { physicalName: 'myParam' })), {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'Boom' }]]
        });
        test.done();
      },

      'token parameterName, explicit "/" separator'(test: Test) {
        const stack = new Stack();
        test.deepEqual(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), { parameterArnSeparator: '/' })), {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'Boom' }]]
        });
        test.done();
      }

    },

    'path names': {

      'concrete parameterName and no physical name (sep is "/")'(test: Test) {
        const stack = new Stack();
        test.deepEqual(stack.resolve(arnForParameterName(stack, '/foo/bar', undefined)), {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/foo/bar']]
        });
        test.done();
      },

      'token parameterName and concrete physical name (no sep)'(test: Test) {
        const stack = new Stack();
        test.deepEqual(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), { physicalName: '/foo/bar' })), {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'Boom' }]]
        });
        test.done();
      },

      'token parameterName, explicit "" separator'(test: Test) {
        const stack = new Stack();
        test.deepEqual(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), { parameterArnSeparator: '' })), {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'Boom' }]]
        });
        test.done();
      }

    },

    'fails if explicit separator is not defined and parameterName is a token'(test: Test) {
      const stack = new Stack();
      test.throws(() => arnForParameterName(stack, Token.asString({ Ref: 'Boom' })), /foo/);
      test.done();
    }

  }
};