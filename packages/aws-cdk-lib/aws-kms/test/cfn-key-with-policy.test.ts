import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as kms from '../lib';

describe('CfnKeyWithPolicy', () => {
  let stack: cdk.Stack;
  let cfnKey: kms.CfnKey;

  beforeEach(() => {
    stack = new cdk.Stack();
    cfnKey = new kms.CfnKey(stack, 'CfnKey', {
      keyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('can add statements to resource policy', () => {
    const wrapper = new kms.CfnKeyWithPolicy(cfnKey);
    const statement = new iam.PolicyStatement({
      actions: ['kms:Decrypt'],
      resources: ['*'],
      principals: [new iam.AccountPrincipal('123456789012')],
    });

    const result = wrapper.addToResourcePolicy(statement);

    expect(result.statementAdded).toBe(true);
    expect(result.policyDependable).toBeDefined();
  });

  test('added statement appears in synthesized template', () => {
    const wrapper = new kms.CfnKeyWithPolicy(cfnKey);
    wrapper.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['kms:Encrypt'],
      resources: ['*'],
      principals: [new iam.ArnPrincipal('arn:aws:iam::111122223333:user/test')],
    }));

    let template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
            },
            Resource: '*',
          },
          {
            Action: 'kms:Encrypt',
            Effect: 'Allow',
            Principal: {
              AWS: 'arn:aws:iam::111122223333:user/test',
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('env property matches underlying CfnKey', () => {
    const wrapper = new kms.CfnKeyWithPolicy(cfnKey);
    expect(stack.resolve(wrapper.env)).toEqual(stack.resolve(cfnKey.env));
  });
});
