import { expect } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Group, Policy, PolicyStatement, Role, ServicePrincipal, User } from '../lib';
import { generatePolicyName } from '../lib/util';

export = {
  'fails when policy is empty'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new Policy(stack, 'MyPolicy');

    test.throws(() => app.synth(), /Policy is empty/);
    test.done();
  },

  'policy with statements'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    const policy = new Policy(stack, 'MyPolicy', { policyName: 'MyPolicyName' });
    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
    policy.addStatements(new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));

    const group = new Group(stack, 'MyGroup');
    group.attachInlinePolicy(policy);

    expect(stack).toMatch({ Resources:
      { MyPolicy39D66CF6:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { Groups: [ { Ref: 'MyGroupCBA54B1B' } ],
          PolicyDocument:
           { Statement:
            [ { Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
              { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyPolicyName' } },
        MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' } } });
    test.done();
  },

  'policy name can be omitted, in which case the logical id will be used'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    const policy = new Policy(stack, 'MyPolicy');
    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
    policy.addStatements(new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));

    const user = new User(stack, 'MyUser');
    user.attachInlinePolicy(policy);

    expect(stack).toMatch({ Resources:
      { MyPolicy39D66CF6:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
              { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyPolicy39D66CF6',
          Users: [ { Ref: 'MyUserDC45028B' } ] } },
        MyUserDC45028B: { Type: 'AWS::IAM::User' } } });
    test.done();
  },

  'policy can be attached users, groups and roles and added permissions via props'(test: Test) {
    const app = new App();

    const stack = new Stack(app, 'MyStack');

    const user1 = new User(stack, 'User1');
    const group1 = new Group(stack, 'Group1');
    const role1 = new Role(stack, 'Role1', {
      assumedBy: new ServicePrincipal('test.service')
    });

    new Policy(stack, 'MyTestPolicy', {
      policyName: 'Foo',
      users: [ user1 ],
      groups: [ group1 ],
      roles: [ role1 ],
      statements: [ new PolicyStatement({ resources: ['*'], actions: ['dynamodb:PutItem'] }) ],
    });

    expect(stack).toMatch({ Resources:
      { User1E278A736: { Type: 'AWS::IAM::User' },
        Group1BEBD4686: { Type: 'AWS::IAM::Group' },
        Role13A5C70C1:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'test.service' } } ],
             Version: '2012-10-17' } } },
        MyTestPolicy316BDB50:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { Groups: [ { Ref: 'Group1BEBD4686' } ],
          PolicyDocument:
           { Statement:
            [ { Action: 'dynamodb:PutItem', Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'Foo',
          Roles: [ { Ref: 'Role13A5C70C1' } ],
          Users: [ { Ref: 'User1E278A736' } ] } } } });

    test.done();
  },

  'idempotent if a principal (user/group/role) is attached twice'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const p = new Policy(stack, 'MyPolicy');
    p.addStatements(new PolicyStatement({ actions: ['*'], resources: ['*'] }));

    const user = new User(stack, 'MyUser');
    p.attachToUser(user);
    p.attachToUser(user);

    expect(stack).toMatch({ Resources:
      { MyPolicy39D66CF6:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement: [ { Action: '*', Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyPolicy39D66CF6',
          Users: [ { Ref: 'MyUserDC45028B' } ] } },
        MyUserDC45028B: { Type: 'AWS::IAM::User' } } });
    test.done();
  },

  'users, groups, roles and permissions can be added using methods'(test: Test) {
    const app = new App();

    const stack = new Stack(app, 'MyStack');

    const p = new Policy(stack, 'MyTestPolicy', {
      policyName: 'Foo',
    });

    p.attachToUser(new User(stack, 'User1'));
    p.attachToUser(new User(stack, 'User2'));
    p.attachToGroup(new Group(stack, 'Group1'));
    p.attachToRole(new Role(stack, 'Role1', { assumedBy: new ServicePrincipal('test.service') }));
    p.addStatements(new PolicyStatement({ resources: ['*'], actions: ['dynamodb:GetItem'] }));

    expect(stack).toMatch({ Resources:
      { MyTestPolicy316BDB50:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { Groups: [ { Ref: 'Group1BEBD4686' } ],
          PolicyDocument:
           { Statement:
            [ { Action: 'dynamodb:GetItem', Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'Foo',
          Roles: [ { Ref: 'Role13A5C70C1' } ],
          Users: [ { Ref: 'User1E278A736' }, { Ref: 'User21F1486D1' } ] } },
        User1E278A736: { Type: 'AWS::IAM::User' },
        User21F1486D1: { Type: 'AWS::IAM::User' },
        Group1BEBD4686: { Type: 'AWS::IAM::Group' },
        Role13A5C70C1:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'test.service' } } ],
             Version: '2012-10-17' } } } } });
    test.done();
  },

  'policy can be attached to users, groups or role via methods on the principal'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    const policy = new Policy(stack, 'MyPolicy');
    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('test.service') });

    user.attachInlinePolicy(policy);
    group.attachInlinePolicy(policy);
    role.attachInlinePolicy(policy);

    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['*'] }));

    expect(stack).toMatch({ Resources:
      { MyPolicy39D66CF6:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { Groups: [ { Ref: 'MyGroupCBA54B1B' } ],
          PolicyDocument:
           { Statement: [ { Action: '*', Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyPolicy39D66CF6',
          Roles: [ { Ref: 'MyRoleF48FFE04' } ],
          Users: [ { Ref: 'MyUserDC45028B' } ] } },
        MyUserDC45028B: { Type: 'AWS::IAM::User' },
        MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' },
        MyRoleF48FFE04:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'test.service' } } ],
             Version: '2012-10-17' } } } } });
    test.done();
  },

  'fails if policy name is not unique within a user/group/role'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // create two policies named Foo and attach them both to the same user/group/role
    const p1 = new Policy(stack, 'P1', { policyName: 'Foo' });
    const p2 = new Policy(stack, 'P2', { policyName: 'Foo' });
    const p3 = new Policy(stack, 'P3'); // uses logicalID as name

    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('sns.amazonaws.com') });

    p1.attachToUser(user);
    p1.attachToGroup(group);
    p1.attachToRole(role);

    // try to attach p2 to all of these and expect to fail
    test.throws(() => p2.attachToUser(user), /A policy named "Foo" is already attached/);
    test.throws(() => p2.attachToGroup(group), /A policy named "Foo" is already attached/);
    test.throws(() => p2.attachToRole(role), /A policy named "Foo" is already attached/);

    p3.attachToUser(user);
    p3.attachToGroup(group);
    p3.attachToRole(role);

    test.done();
  },

  'fails if policy is not attached to a principal'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new Policy(stack, 'MyPolicy');
    test.throws(() => app.synth(), /Policy must be attached to at least one principal: user, group or role/);
    test.done();
  },

  'generated policy name only uses the last 128 characters of the logical id'(test: Test) {
    test.equal(generatePolicyName('Foo'), 'Foo');

    const logicalId50 = '[' + dup(50 - 2) + ']';
    test.equal(generatePolicyName(logicalId50), logicalId50);

    const logicalId128 = '[' + dup(128 - 2) + ']';
    test.equal(generatePolicyName(logicalId128), logicalId128);

    const withPrefix = 'PREFIX' + logicalId128;
    test.equal(generatePolicyName(withPrefix), logicalId128, 'ensure prefix is omitted');

    test.done();

    function dup(count: number) {
      let r = '';
      for (let i = 0; i < count; ++i) {
        r += 'x';
      }
      return r;
    }
  }
};
