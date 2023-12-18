import { Template } from '../../assertions';
import { Stack, Token, App, CfnResource } from '../../core';
import { InstanceProfile, Role, ServicePrincipal } from '../lib';

describe('IAM instance profiles', () => {
  test('default instance profile', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new InstanceProfile(stack, 'InstanceProfile');

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        InstanceProfileInstanceRole3FE337A6: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'ec2.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
          },
        },
        InstanceProfile9F2F41CB: {
          Type: 'AWS::IAM::InstanceProfile',
          Properties: {
            Roles: [
              {
                Ref: 'InstanceProfileInstanceRole3FE337A6',
              },
            ],
          },
        },
      },
    });
  });

  test('given role', () => {
    // GIVEN
    const stack = new Stack();
    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    // WHEN
    new InstanceProfile(stack, 'InstanceProfile', { role });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        Role1ABCC5F0: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'ec2.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
          },
        },
        InstanceProfile9F2F41CB: {
          Type: 'AWS::IAM::InstanceProfile',
          Properties: {
            Roles: [
              {
                Ref: 'Role1ABCC5F0',
              },
            ],
          },
        },
      },
    });
  });

  test('given instance profile name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new InstanceProfile(stack, 'InstanceProfile', {
      instanceProfileName: 'MyInstanceProfile',
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        InstanceProfileInstanceRole3FE337A6: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'ec2.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
          },
        },
        InstanceProfile9F2F41CB: {
          Type: 'AWS::IAM::InstanceProfile',
          Properties: {
            Roles: [
              {
                Ref: 'InstanceProfileInstanceRole3FE337A6',
              },
            ],
            InstanceProfileName: 'MyInstanceProfile',
          },
        },
      },
    });
  });

  test('given instance profile path', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new InstanceProfile(stack, 'InstanceProfile', {
      path: '/sample/path/',
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        InstanceProfileInstanceRole3FE337A6: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'ec2.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
          },
        },
        InstanceProfile9F2F41CB: {
          Type: 'AWS::IAM::InstanceProfile',
          Properties: {
            Roles: [
              {
                Ref: 'InstanceProfileInstanceRole3FE337A6',
              },
            ],
            Path: '/sample/path/',
          },
        },
      },
    });
  });

  test('cross-env instance profile ARNs include path', () => {
    // GIVEN
    const app = new App();
    const instanceProfileStack = new Stack(app, 'instance-profile-stack', { env: { account: '123456789012', region: 'us-east-1' } });
    const referencerStack = new Stack(app, 'referencer-stack', { env: { region: 'us-east-2' } });
    const role = new Role(instanceProfileStack, 'Role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });
    const instanceProfile = new InstanceProfile(instanceProfileStack, 'InstanceProfile', {
      role,
      path: '/sample/path/',
      instanceProfileName: 'sample-name',
    });

    // WHEN
    new CfnResource(referencerStack, 'Referencer', {
      type: 'Custom::InstanceProfileReferencer',
      properties: { InstanceProfileArn: instanceProfile.instanceProfileArn },
    });

    // THEN
    Template.fromStack(referencerStack).hasResourceProperties('Custom::InstanceProfileReferencer', {
      InstanceProfileArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::123456789012:instance-profile/sample/path/sample-name',
          ],
        ],
      },
    });
  });

  test('instance profile imported by name has an arn', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileName(stack, 'InstanceProfile', 'path/MyInstanceProfile');

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileArn)).toStrictEqual({
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':instance-profile/path/MyInstanceProfile']],
    });
  });

  test('instance profile imported by arn has a name', () => {
    // GIVEN
    const stack = new Stack();
    const instanceProfileName = 'MyInstanceProfile';

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileArn(stack, 'InstanceProfile', `arn:aws:iam::account-id:instance-profile/${instanceProfileName}`);

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileName)).toStrictEqual(instanceProfileName);
  });

  test('instance profile imported by tokenzied arn has a name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileArn(stack, 'InstanceProfile', Token.asString({ Ref: 'ARN' }));

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileName)).toStrictEqual({
      'Fn::Select': [1, { 'Fn::Split': [':instance-profile/', { Ref: 'ARN' }] }],
    });
  });

  test('instance profile imported by arn with path', () => {
    // GIVEN
    const stack = new Stack();
    const instanceProfileName = 'MyInstanceProfile';

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileArn(stack, 'InstanceProfile', `arn:aws:iam::account-id:instance-profile/path/${instanceProfileName}`);

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileName)).toStrictEqual(instanceProfileName);
  });

  test('instance profile imported by arn with multiple element path', () => {
    // GIVEN
    const stack = new Stack();
    const instanceProfileName = 'MyInstanceProfile';

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileArn(stack, 'InstanceProfile', `arn:aws:iam::account-id:instance-profile/p/a/t/h/${instanceProfileName}`);

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileName)).toStrictEqual(instanceProfileName);
  });

  test('instance profile imported by attributes has a name and a role', () => {
    // GIVEN
    const stack = new Stack();
    const instanceProfileName = 'MyInstanceProfile';
    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileAttributes(stack, 'InstanceProfile', {
      instanceProfileArn: `arn:aws:iam::account-id:instance-profile/${instanceProfileName}`,
      role,
    });

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileName)).toStrictEqual(instanceProfileName);
    expect(stack.resolve(instanceProfile.role?.roleName)).toStrictEqual(stack.resolve(role.roleName));
  });

  test('instance profile imported by tokenzied arn attribute has a name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileAttributes(stack, 'InstanceProfile', {
      instanceProfileArn: Token.asString({ Ref: 'ARN' }),
    });

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileName)).toStrictEqual({
      'Fn::Select': [1, { 'Fn::Split': [':instance-profile/', { Ref: 'ARN' }] }],
    });
  });

  test('instance profile imported by arn attribute with path has a name', () => {
    // GIVEN
    const stack = new Stack();
    const instanceProfileName = 'MyInstanceProfile';

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileArn(stack, 'InstanceProfile', `arn:aws:iam::account-id:instance-profile/path/${instanceProfileName}`);

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileName)).toStrictEqual(instanceProfileName);
  });

  test('instance profile imported by an arn attribute with multiple element path has a name', () => {
    // GIVEN
    const stack = new Stack();
    const instanceProfileName = 'MyInstanceProfile';

    // WHEN
    const instanceProfile = InstanceProfile.fromInstanceProfileArn(stack, 'InstanceProfile', `arn:aws:iam::account-id:instance-profile/p/a/t/h/${instanceProfileName}`);

    // THEN
    expect(stack.resolve(instanceProfile.instanceProfileName)).toStrictEqual(instanceProfileName);
  });
});
