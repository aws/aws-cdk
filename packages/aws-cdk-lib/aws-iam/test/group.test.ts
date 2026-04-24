import { Annotations, Template } from '../../assertions';
import { App, CfnResource, Stack } from '../../core';
import { Group, ManagedPolicy, PolicyStatement, User } from '../lib';

describe('IAM groups', () => {
  test('default group', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new Group(stack, 'MyGroup');

    Template.fromStack(stack).templateMatches({
      Resources: { MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' } },
    });
  });

  test('users can be added to the group either via `user.addToGroup` or `group.addUser`', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const group = new Group(stack, 'MyGroup');
    const user1 = new User(stack, 'User1');
    const user2 = new User(stack, 'User2');
    user1.addToGroup(group);
    group.addUser(user2);

    Template.fromStack(stack).templateMatches({
      Resources:
      {
        MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' },
        User1E278A736:
        {
          Type: 'AWS::IAM::User',
          Properties: { Groups: [{ Ref: 'MyGroupCBA54B1B' }] },
        },
        User21F1486D1:
        {
          Type: 'AWS::IAM::User',
          Properties: { Groups: [{ Ref: 'MyGroupCBA54B1B' }] },
        },
      },
    });
  });

  test('create with managed policy', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Group(stack, 'MyGroup', {
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('asdf')],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Group', {
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/asdf']] },
      ],
    });
  });

  test('groups imported by group name have valid arn', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const group1 = Group.fromGroupName(stack, 'imported-group1', 'MyGroupName1');
    const group2 = Group.fromGroupName(stack, 'imported-group2', 'division/MyGroupName2');

    // THEN
    expect(stack.resolve(group1.groupArn)).toStrictEqual({
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':group/MyGroupName1']],
    });
    expect(stack.resolve(group2.groupArn)).toStrictEqual({
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':group/division/MyGroupName2']],
    });
  });

  describe('imported group policy name', () => {
    test('default behavior (no flag)', () => {
      const stack = new Stack();
      const group = Group.fromGroupName(stack, 'ImportedGroup', 'admins');

      group.addToPrincipalPolicy(new PolicyStatement({
        actions: ['aws:TestAction'],
        resources: ['*'],
      }));

      Template.fromStack(stack).hasResource('AWS::IAM::Policy', {
        Properties: {
          PolicyName: 'ImportedGroupDefaultPolicy5FF6A7A2',
          Groups: ['admins'],
        },
      });
    });

    test('with feature flag enabled', () => {
      const app = new App({
        context: {
          '@aws-cdk/aws-iam:importedGroupStackSafeDefaultPolicyName': true,
        },
      });
      const stack = new Stack(app, 'Stack');
      const group = Group.fromGroupName(stack, 'ImportedGroup', 'admins');

      group.addToPrincipalPolicy(new PolicyStatement({
        actions: ['aws:TestAction'],
        resources: ['*'],
      }));

      Template.fromStack(stack).hasResource('AWS::IAM::Policy', {
        Properties: {
          PolicyName: 'DefaultPolicyStackImportedGroupD2A19646',
          Groups: ['admins'],
        },
      });
    });

    test('with custom defaultPolicyName', () => {
      const stack = new Stack();
      const group = Group.fromGroupName(stack, 'ImportedGroup', 'admins', {
        defaultPolicyName: 'CustomPolicyName',
      });

      group.addToPrincipalPolicy(new PolicyStatement({
        actions: ['aws:TestAction'],
        resources: ['*'],
      }));

      Template.fromStack(stack).hasResource('AWS::IAM::Policy', {
        Properties: {
          PolicyName: 'CustomPolicyName',
          Groups: ['admins'],
        },
      });
    });

    test('with both feature flag and custom defaultPolicyName (custom wins)', () => {
      const app = new App({
        context: {
          '@aws-cdk/aws-iam:importedGroupStackSafeDefaultPolicyName': true,
        },
      });
      const stack = new Stack(app, 'Stack');
      const group = Group.fromGroupName(stack, 'ImportedGroup', 'admins', {
        defaultPolicyName: 'CustomPolicyName',
      });

      group.addToPrincipalPolicy(new PolicyStatement({
        actions: ['aws:TestAction'],
        resources: ['*'],
      }));

      Template.fromStack(stack).hasResource('AWS::IAM::Policy', {
        Properties: {
          PolicyName: 'CustomPolicyName',
          Groups: ['admins'],
        },
      });
    });

    test('cross-stack uniqueness with feature flag', () => {
      const app = new App({
        context: {
          '@aws-cdk/aws-iam:importedGroupStackSafeDefaultPolicyName': true,
        },
      });

      const stack1 = new Stack(app, 'Stack1');
      const group1 = Group.fromGroupName(stack1, 'ImportedGroup', 'admins');
      group1.addToPrincipalPolicy(new PolicyStatement({
        actions: ['aws:TestAction1'],
        resources: ['*'],
      }));

      const stack2 = new Stack(app, 'Stack2');
      const group2 = Group.fromGroupName(stack2, 'ImportedGroup', 'admins');
      group2.addToPrincipalPolicy(new PolicyStatement({
        actions: ['aws:TestAction2'],
        resources: ['*'],
      }));

      const template1 = Template.fromStack(stack1);
      const template2 = Template.fromStack(stack2);

      const policy1 = template1.findResources('AWS::IAM::Policy');
      const policy2 = template2.findResources('AWS::IAM::Policy');

      const name1 = Object.values(policy1)[0].Properties.PolicyName;
      const name2 = Object.values(policy2)[0].Properties.PolicyName;

      expect(name1).toMatch(/^DefaultPolicyStack1ImportedGroup/);
      expect(name2).toMatch(/^DefaultPolicyStack2ImportedGroup/);
      expect(name1).not.toEqual(name2);
    });
  });
});

test('cross-env group ARNs include path', () => {
  const app = new App();
  const groupStack = new Stack(app, 'group-stack', { env: { account: '123456789012', region: 'us-east-1' } });
  const referencerStack = new Stack(app, 'referencer-stack', { env: { region: 'us-east-2' } });
  const group = new Group(groupStack, 'Group', {
    path: '/sample/path/',
    groupName: 'sample-name',
  });
  new CfnResource(referencerStack, 'Referencer', {
    type: 'Custom::GroupReferencer',
    properties: { GroupArn: group.groupArn },
  });

  Template.fromStack(referencerStack).hasResourceProperties('Custom::GroupReferencer', {
    GroupArn: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':iam::123456789012:group/sample/path/sample-name',
        ],
      ],
    },
  });
});

test('throw warning if attached managed policies exceed 10 in constructor', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new Group(stack, 'MyGroup', {
    groupName: 'MyGroup',
    managedPolicies: [
      ManagedPolicy.fromAwsManagedPolicyName('0'),
      ManagedPolicy.fromAwsManagedPolicyName('1'),
      ManagedPolicy.fromAwsManagedPolicyName('2'),
      ManagedPolicy.fromAwsManagedPolicyName('3'),
      ManagedPolicy.fromAwsManagedPolicyName('4'),
      ManagedPolicy.fromAwsManagedPolicyName('5'),
      ManagedPolicy.fromAwsManagedPolicyName('6'),
      ManagedPolicy.fromAwsManagedPolicyName('7'),
      ManagedPolicy.fromAwsManagedPolicyName('8'),
      ManagedPolicy.fromAwsManagedPolicyName('9'),
      ManagedPolicy.fromAwsManagedPolicyName('10'),
    ],
  });

  Annotations.fromStack(stack).hasWarning('*', 'You added 11 to IAM Group MyGroup. The maximum number of managed policies attached to an IAM group is 10. [ack: @aws-cdk/aws-iam:groupMaxPoliciesExceeded]');
});

test('throw warning if attached managed policies exceed 10 when calling `addManagedPolicy`', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const group = new Group(stack, 'MyGroup', {
    groupName: 'MyGroup',
  });

  for (let i = 0; i <= 11; i++) {
    group.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName(i.toString()));
  }

  Annotations.fromStack(stack).hasWarning('/Default/MyGroup', 'You added 12 to IAM Group MyGroup. The maximum number of managed policies attached to an IAM group is 10. [ack: @aws-cdk/aws-iam:groupMaxPoliciesExceeded]');
});
