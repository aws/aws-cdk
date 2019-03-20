import { expect } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import iam = require('../lib');

export = {
  'automatic exports are created when attributes are referneced across stacks'(test: Test) {
    // GIVEN
    const stackWithUser = new cdk.Stack();
    const stackWithGroup = new cdk.Stack();
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
    expect(stackWithUser).toMatch({
      Resources: {
        User00B015A1: {
          Type: "AWS::IAM::User",
          Properties: {
            Groups: [ { "Fn::ImportValue": "Stack:ExportsOutputRefGroupC77FDACD8CF7DD5B" } ]
          }
        }
      }
    });
    expect(stackWithGroup).toMatch({
      Outputs: {
        ExportsOutputRefGroupC77FDACD8CF7DD5B: {
          Value: { Ref: "GroupC77FDACD" },
          Export: { Name: "Stack:ExportsOutputRefGroupC77FDACD8CF7DD5B" }
        }
      },
      Resources: {
        GroupC77FDACD: {
          Type: "AWS::IAM::Group"
        }
      }
    });
    test.done();
  }
};