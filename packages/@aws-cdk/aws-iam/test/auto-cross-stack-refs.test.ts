import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as iam from '../lib';

describe('automatic cross-stack references', () => {
  test('automatic exports are created when attributes are referneced across stacks', () => {
    // GIVEN
    const app = new cdk.App();
    const stackWithUser = new cdk.Stack(app, 'stack1');
    const stackWithGroup = new cdk.Stack(app, 'stack2');
    const user = new iam.User(stackWithUser, 'User');
    const group = new iam.Group(stackWithGroup, 'Group');

    // WHEN
    group.addUser(user);

    //
    // `group.addUser` adds the group to the user resource definition, so we expect
    // that an automatic export will be created for the group and the user's stack
    // to use ImportValue to import it.
    // note that order of "expect"s matters. we first need to synthesize the user's
    // stack so that the cross stack reference will be reported and only then the
    // group's stack. in the real world, App will take care of this.
    //

    // THEN
    Template.fromStack(stackWithUser).templateMatches({
      Resources: {
        User00B015A1: {
          Type: 'AWS::IAM::User',
          Properties: {
            Groups: [{ 'Fn::ImportValue': 'stack2:ExportsOutputRefGroupC77FDACD8CF7DD5B' }],
          },
        },
      },
    });
    Template.fromStack(stackWithGroup).templateMatches({
      Outputs: {
        ExportsOutputRefGroupC77FDACD8CF7DD5B: {
          Value: { Ref: 'GroupC77FDACD' },
          Export: { Name: 'stack2:ExportsOutputRefGroupC77FDACD8CF7DD5B' },
        },
      },
      Resources: {
        GroupC77FDACD: {
          Type: 'AWS::IAM::Group',
        },
      },
    });
  });

  test('cannot reference tokens across apps', () => {
    // GIVEN
    const stack1 = new cdk.Stack();
    const stack2 = new cdk.Stack();
    const user = new iam.User(stack1, 'User');
    const group = new iam.Group(stack2, 'Group');
    group.addUser(user);

    // THEN
    expect(() => cdk.App.of(stack1)!.synth()).toThrow(/Cannot reference across apps/);
  });
});
