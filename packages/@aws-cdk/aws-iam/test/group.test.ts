import '@aws-cdk/assert-internal/jest';
import { App, Stack } from '@aws-cdk/core';
import { Group, ManagedPolicy, User } from '../lib';

describe('IAM groups', () => {
  test('default group', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new Group(stack, 'MyGroup');

    expect(stack).toMatchTemplate({
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

    expect(stack).toMatchTemplate({
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
    expect(stack).toHaveResource('AWS::IAM::Group', {
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/asdf']] },
      ],
    });
  });
});
