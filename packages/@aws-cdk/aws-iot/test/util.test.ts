import * as cdk from '@aws-cdk/core';
import { parseCertificateArn, parseCertificateId, parsePolicyArn } from '../lib/util';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});
describe('utils', () => {
  describe('parseCertificateArn', () => {
    test('produce arn from certificate id', () => {
      const certificateId = 'hello';

      expect(stack.resolve(parseCertificateArn(stack, { certificateId }))).toEqual({
        'Fn::Join':
          ['',
            ['arn:',
              { Ref: 'AWS::Partition' },
              ':iot:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cert/hello']],
      });
    });
  });

  describe('parseCertificateId', () => {
    test('produce certificate id when given arn', () => {
      const certificateArn = 'arn:aws:iot:us-east-1:123456789012:cert/hello';
      expect(parseCertificateId(stack, { certificateArn })).toEqual('hello');
    });
  });

  describe('parsePolicyArn', () => {
    test('produce arn from policy name', () => {
      const policyName = 'hello';
      expect(stack.resolve(parsePolicyArn(stack, policyName))).toEqual({
        'Fn::Join':
          ['',
            ['arn:',
              { Ref: 'AWS::Partition' },
              ':iot:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':policy/hello']],
      });
    });
  });
});
