import { Annotations, Template } from '@aws-cdk/assertions';
import { App, CfnResource, Stack } from '@aws-cdk/core';
import { Group, ManagedPolicy, User } from '../lib';

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

  Annotations.fromStack(stack).hasWarning('*', 'You added 11 to IAM Group MyGroup. The maximum number of managed policies attached to an IAM group is 10.');
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

  Annotations.fromStack(stack).hasWarning('/Default/MyGroup', 'You added 11 to IAM Group MyGroup. The maximum number of managed policies attached to an IAM group is 10.');
});
