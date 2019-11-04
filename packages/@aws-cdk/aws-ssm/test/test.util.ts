// tslint:disable: max-line-length

import { expect } from '@aws-cdk/assert';
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
        test.deepEqual(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), 'myParam')), {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'Boom' }]]
        });
        test.done();
      },

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
        test.deepEqual(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), '/foo/bar')), {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'Boom' }]]
        });
        test.done();
      },

    },

    'token parameterName and no physical name (Fn::If expression)'(test: Test) {
      const stack = new Stack();

      test.deepEqual(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), undefined)), {
        'Fn::Join':
          ['',
            ['arn:',
              { Ref: 'AWS::Partition' },
              ':ssm:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':parameter',
              {
                'Fn::If':
                  ['AWSCDKStartsWith',
                    { Ref: 'Boom' },
                    { 'Fn::Join': ['', ['/', { Ref: 'Boom' }]] }]
              }]]
      });

      expect(stack).toMatch({
        Conditions: {
          AWSCDKStartsWith: {
            "Fn::Equals": [
              { "Fn::Select": [ 0, { "Fn::Split": [ "/", { Ref: "Boom" } ] } ] },
              ""
            ]
          }
        }
      });

      test.done();
    }

  }
};