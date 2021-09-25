/* eslint-disable max-len */

import { Stack, Token } from '@aws-cdk/core';
import { arnForParameterName } from '../lib/util';

describe('arnForParameterName', () => {
  describe('simple names', () => {
    test('concrete parameterName and no physical name (sep is "/")', () => {
      const stack = new Stack();
      expect(stack.resolve(arnForParameterName(stack, 'myParam', undefined))).toEqual({
        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/myParam']],
      });
    });

    test('token parameterName and concrete physical name (no additional "/")', () => {
      const stack = new Stack();
      expect(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), { physicalName: 'myParam' }))).toEqual({
        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'Boom' }]],
      });
    });

    test('token parameterName, explicit "/" separator', () => {
      const stack = new Stack();
      expect(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), { simpleName: true }))).toEqual({
        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'Boom' }]],
      });
    });
  });

  describe('path names', () => {
    test('concrete parameterName and no physical name (sep is "/")', () => {
      const stack = new Stack();
      expect(stack.resolve(arnForParameterName(stack, '/foo/bar', undefined))).toEqual({
        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/foo/bar']],
      });
    });

    test('token parameterName and concrete physical name (no sep)', () => {
      const stack = new Stack();
      expect(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), { physicalName: '/foo/bar' }))).toEqual({
        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'Boom' }]],
      });
    });

    test('token parameterName, explicit "" separator', () => {
      const stack = new Stack();
      expect(stack.resolve(arnForParameterName(stack, Token.asString({ Ref: 'Boom' }), { simpleName: false }))).toEqual({
        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'Boom' }]],
      });
    });
  });

  test('fails if explicit separator is not defined and parameterName is a token', () => {
    const stack = new Stack();
    expect(() => arnForParameterName(stack, Token.asString({ Ref: 'Boom' }))).toThrow(/Unable to determine ARN separator for SSM parameter since the parameter name is an unresolved token. Use "fromAttributes" and specify "simpleName" explicitly/);
  });
});