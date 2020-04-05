import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { App, CfnResource, Stack } from '@aws-cdk/core';
import { AnyPrincipal, CfnPolicy, Group, Policy, PolicyStatement, Role, ServicePrincipal, User } from '../lib';

// tslint:disable:object-literal-key-quotes

describe('IAM policy', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'MyStack');
  });

  test('fails when "forced" policy is empty', () => {
    new Policy(stack, 'MyPolicy', { force: true });

    expect(() => app.synth()).toThrow(/is empty/);
  });

  test('policy with statements', () => {
    const policy = new Policy(stack, 'MyPolicy', { policyName: 'MyPolicyName' });
    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
    policy.addStatements(new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));

    const group = new Group(stack, 'MyGroup');
    group.attachInlinePolicy(policy);

    expect(stack).toMatchTemplate({ Resources:
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
  });

  test('policy name can be omitted, in which case the logical id will be used', () => {
    const policy = new Policy(stack, 'MyPolicy');
    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
    policy.addStatements(new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));

    const user = new User(stack, 'MyUser');
    user.attachInlinePolicy(policy);

    expect(stack).toMatchTemplate({ Resources:
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
  });

  test('policy can be attached users, groups and roles and added permissions via props', () => {
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

    expect(stack).toMatchTemplate({ Resources:
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
  });

  test('idempotent if a principal (user/group/role) is attached twice', () => {
    const p = new Policy(stack, 'MyPolicy');
    p.addStatements(new PolicyStatement({ actions: ['*'], resources: ['*'] }));

    const user = new User(stack, 'MyUser');
    p.attachToUser(user);
    p.attachToUser(user);

    expect(stack).toMatchTemplate({ Resources:
      { MyPolicy39D66CF6:
         { Type: 'AWS::IAM::Policy',
           Properties:
          { PolicyDocument:
           { Statement: [ { Action: '*', Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyPolicy39D66CF6',
          Users: [ { Ref: 'MyUserDC45028B' } ] } },
      MyUserDC45028B: { Type: 'AWS::IAM::User' } } });
  });

  test('users, groups, roles and permissions can be added using methods', () => {
    const p = new Policy(stack, 'MyTestPolicy', {
      policyName: 'Foo',
    });

    p.attachToUser(new User(stack, 'User1'));
    p.attachToUser(new User(stack, 'User2'));
    p.attachToGroup(new Group(stack, 'Group1'));
    p.attachToRole(new Role(stack, 'Role1', { assumedBy: new ServicePrincipal('test.service') }));
    p.addStatements(new PolicyStatement({ resources: ['*'], actions: ['dynamodb:GetItem'] }));

    expect(stack).toMatchTemplate({ Resources:
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
  });

  test('policy can be attached to users, groups or role via methods on the principal', () => {
    const policy = new Policy(stack, 'MyPolicy');
    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('test.service') });

    user.attachInlinePolicy(policy);
    group.attachInlinePolicy(policy);
    role.attachInlinePolicy(policy);

    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['*'] }));

    expect(stack).toMatchTemplate({ Resources:
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
  });

  test('fails if policy name is not unique within a user/group/role', () => {
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
    expect(() => p2.attachToUser(user)).toThrow(/A policy named "Foo" is already attached/);
    expect(() => p2.attachToGroup(group)).toThrow(/A policy named "Foo" is already attached/);
    expect(() => p2.attachToRole(role)).toThrow(/A policy named "Foo" is already attached/);

    p3.attachToUser(user);
    p3.attachToGroup(group);
    p3.attachToRole(role);
  });

  test('fails if "forced" policy is not attached to a principal', () => {
    new Policy(stack, 'MyPolicy', { force: true });
    expect(() => app.synth()).toThrow(/attached to at least one principal: user, group or role/);
  });

  test("generated policy name is the same as the logical id if it's shorter than 128 characters", () => {
    createPolicyWithLogicalId(stack, 'Foo');

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      'PolicyName': 'Foo',
    });
  });

  test('generated policy name only uses the last 128 characters of the logical id', () => {
    const logicalId128 = 'a' + dup(128 - 2) + 'a';
    const logicalIdOver128 = 'PREFIX' + logicalId128;

    createPolicyWithLogicalId(stack, logicalIdOver128);

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      'PolicyName': logicalId128,
    });

    function dup(count: number) {
      let r = '';
      for (let i = 0; i < count; ++i) {
        r += 'x';
      }
      return r;
    }
  });

  test('force=false, dependency on empty Policy never materializes', () => {
    // GIVEN
    const pol = new Policy(stack, 'Pol', { force: false });

    const res = new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
    });

    // WHEN
    res.node.addDependency(pol);

    // THEN
    expect(stack).toMatchTemplate({
      Resources: {
        Resource: {
          Type: 'Some::Resource',
        }
      }
    });
  });

  test('force=false, dependency on attached and non-empty Policy can be taken', () => {
    // GIVEN
    const pol = new Policy(stack, 'Pol', { force: false });
    pol.addStatements(new PolicyStatement({
      actions: ['s3:*'],
      resources: ['*'],
    }));
    pol.attachToUser(new User(stack, 'User'));

    const res = new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
    });

    // WHEN
    res.node.addDependency(pol);

    // THEN
    expect(stack).toHaveResource('Some::Resource', {
      Type: 'Some::Resource',
      DependsOn: [ 'Pol0FE9AD5D' ]
    }, ResourcePart.CompleteDefinition);
  });

  test('empty policy is OK if force=false', () => {
    new Policy(stack, 'Pol', { force: false });

    app.synth();
    // If we got here, all OK
  });

  test('reading policyName forces a Policy to materialize', () => {
    const pol = new Policy(stack, 'Pol', { force: false });
    Array.isArray(pol.policyName);

    expect(() => app.synth()).toThrow(/must contain at least one statement/);
  });
});

function createPolicyWithLogicalId(stack: Stack, logicalId: string): void {
  const policy = new Policy(stack, logicalId);
  const cfnPolicy = policy.node.defaultChild as CfnPolicy;
  cfnPolicy.overrideLogicalId(logicalId); // force a particular logical ID

  // add statements & principal to satisfy validation
  policy.addStatements(new PolicyStatement({
    actions: ['*'],
    resources: ['*'],
  }));
  policy.attachToRole(new Role(stack, 'Role', { assumedBy: new AnyPrincipal() }));
}
