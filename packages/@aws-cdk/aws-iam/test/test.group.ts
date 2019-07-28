import { expect, haveResource } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Group, ManagedPolicy, User } from '../lib';

export = {
  'default group'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new Group(stack, 'MyGroup');

    expect(stack).toMatch({
      Resources: { MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' } }
    });

    test.done();
  },

  'users can be added to the group either via `user.addToGroup` or `group.addUser`'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const group = new Group(stack, 'MyGroup');
    const user1 = new User(stack, 'User1');
    const user2 = new User(stack, 'User2');
    user1.addToGroup(group);
    group.addUser(user2);

    expect(stack).toMatch({ Resources:
      { MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' },
        User1E278A736:
         { Type: 'AWS::IAM::User',
         Properties: { Groups: [ { Ref: 'MyGroupCBA54B1B' } ] } },
        User21F1486D1:
         { Type: 'AWS::IAM::User',
         Properties: { Groups: [ { Ref: 'MyGroupCBA54B1B' } ] } } } });
    test.done();
  },

  'create with managed policy'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Group(stack, 'MyGroup', {
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('asdf')]
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Group', {
      ManagedPolicyArns: [
        { "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":iam::aws:policy/asdf" ] ] }
      ]
    }));

    test.done();
  }
};
