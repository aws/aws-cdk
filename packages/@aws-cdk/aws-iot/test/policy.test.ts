import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import * as iot from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

describe('IoT Policy', () => {
  test('all defaults', () => {
    // WHEN
    new iot.Policy(stack, 'MyIotPolicy', {
      statements: [new iot.PolicyStatement({
        actions: ['iot:Connect'],
        resources: ['arn:aws:iot:us-east-1:123456789012:client/myClientId'],
      })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Policy', {
      'PolicyName': 'MyIotPolicyCB76D4D8',
      'PolicyDocument': {
        'Version': '2012-10-17',
        'Statement': [
          {
            'Effect': 'Allow',
            'Action': 'iot:Connect',
            'Resource': 'arn:aws:iot:us-east-1:123456789012:client/myClientId',
          },
        ],
      },
    });
  });
  test('specify statements', () => {
    // WHEN
    new iot.Policy(stack, 'MyIotPolicy', {
      statements: [new iot.PolicyStatement({
        actions: ['iot:Connect'],
        resources: ['arn:aws:iot:us-east-1:123456789012:client/myClientId'],
      })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Policy', {
      'PolicyName': 'MyIotPolicyCB76D4D8',
      'PolicyDocument': {
        'Version': '2012-10-17',
        'Statement': [
          {
            'Effect': 'Allow',
            'Action': 'iot:Connect',
            'Resource': 'arn:aws:iot:us-east-1:123456789012:client/myClientId',
          },
        ],
      },
    });
  });
  test('specify policyName', () => {
    // WHEN
    new iot.Policy(stack, 'MyIotPolicy', {
      policyName: 'policyName',
      statements: [new iot.PolicyStatement({
        actions: ['iot:Connect'],
        resources: ['arn:aws:iot:us-east-1:123456789012:client/myClientId'],
      })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Policy', {
      'PolicyName': 'policyName',
    });
  });
  test('specify document', () => {
    // WHEN
    new iot.Policy(stack, 'MyIotPolicy', {
      document: new iot.PolicyDocument({
        statements: [new iot.PolicyStatement({
          actions: ['iot:Connect'],
          resources: ['arn:aws:iot:us-east-1:123456789012:client/myClientId'],
        })],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Policy', {
      'PolicyName': 'MyIotPolicyCB76D4D8',
      'PolicyDocument': {
        'Version': '2012-10-17',
        'Statement': [
          {
            'Effect': 'Allow',
            'Action': 'iot:Connect',
            'Resource': 'arn:aws:iot:us-east-1:123456789012:client/myClientId',
          },
        ],
      },
    });
  });
  test('fromPolicyName', () => {
    // WHEN
    const imported = iot.Policy.fromPolicyName(stack, 'Imported', 'MyIotPolicy');

    // THEN
    expect(imported.policyName).toEqual('MyIotPolicy');
  });
  test('can provide statements after creation', () => {
    // WHEN
    const policy = new iot.Policy(stack, 'MyIotPolicy');
    policy.addStatements(new iot.PolicyStatement({
      actions: ['iot:Connect'],
      resources: ['arn:aws:iot:us-east-1:123456789012:client/myClientId'],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Policy', {
      'PolicyName': 'MyIotPolicyCB76D4D8',
      'PolicyDocument': {
        'Version': '2012-10-17',
        'Statement': [
          {
            'Effect': 'Allow',
            'Action': 'iot:Connect',
            'Resource': 'arn:aws:iot:us-east-1:123456789012:client/myClientId',
          },
        ],
      },
    });
  });
  test('can attach policy to certificate', () => {
    // WHEN
    const statement = new iot.PolicyStatement();
    statement.addActions('iot:Connect');
    statement.addAllResources();
    const policy = new iot.Policy(stack, 'MyIotPolicy', {
      statements: [statement],
    });

    const cert = new iot.Certificate(stack, 'MyCertificate', {
      status: iot.CertificateStatus.ACTIVE,
      certificateSigningRequest: 'csr',
    });

    policy.attachToCertificate(cert);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::PolicyPrincipalAttachment', {
      'PolicyName': 'MyIotPolicyCB76D4D8',
      'Principal': { 'Fn::GetAtt': ['MyCertificate41357985', 'Arn'] },
    });
  });
  test('provides policy name', () => {
    // WHEN
    const policy = new iot.Policy(stack, 'MyIotPolicy', {
      policyName: 'MyPolicyName',
    });

    // THEN
    expect(policy.policyName).toEqual('MyPolicyName');
  });
  test('provides policy arn', () => {
    // WHEN
    const policy = new iot.Policy(stack, 'MyIotPolicy');

    // THEN
    expect(stack.resolve(policy.policyArn)).toEqual({
      'Fn::GetAtt': ['MyIotPolicyCB76D4D8', 'Arn'],
    });
  });
  test('fails if policy document is missing actions', () => {
    // WHEN
    const app = new App();
    stack = new Stack(app, 'MyStack');
    new iot.Policy(stack, 'MyIotPolicy', {
      statements: [new iot.PolicyStatement({})],
    });

    // THEN
    expect(() => {
      app.synth();
    }).toThrowError(/An IoT PolicyStatement must specify at least one 'action'./);
  });
  test('fails if policy document is missing resources', () => {
    // WHEN
    const app = new App();
    stack = new Stack(app, 'MyStack');
    new iot.Policy(stack, 'MyIotPolicy', {
      statements: [new iot.PolicyStatement({
        actions: ['iot:Connect'],
      })],
    });
    // THEN
    expect(() => {
      app.synth();
    }).toThrowError(/An IoT PolicyStatement must specify at least one 'resource'./);
  });
  test('reading policyName forces a Policy to materialize', () => {
    // WHEN
    // THEN
    expect(() => {
      const app = new App();
      stack = new Stack(app, 'MyStack');
      const policy = new iot.Policy(stack, 'MyIotPolicy');
      Array.isArray(policy.policyName);
      app.synth();
    }).toThrowError(/You must add statements to the policy/);
  });
});
