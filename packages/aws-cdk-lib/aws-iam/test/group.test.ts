import { Annotations, Capture, Template } from '../../assertions';
import { App, CfnResource, Stack } from '../../core';
import { IAM_IMPORTED_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME } from '../../cx-api';
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

describe('feature flag: @aws-cdk/aws-iam:importedGroupStackSafeDefaultPolicyName', () => {
  const groupArn = 'arn:aws:iam::123456789012:group/MyGroup';

  function importGroupAndGrant(app: App, stackId: string, groupId = 'ImportedGroup'): Stack {
    const stack = new Stack(app, stackId);
    const group = Group.fromGroupArn(stack, groupId, groupArn);
    group.addToPrincipalPolicy(new PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }));
    return stack;
  }

  test('the same group imported in different stacks has different default policy names', () => {
    const app = new App({ context: { [IAM_IMPORTED_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });
    const stack1 = importGroupAndGrant(app, 'GroupStack1');
    const stack2 = importGroupAndGrant(app, 'GroupStack2');

    const stack1PolicyNameCapture = new Capture();
    Template.fromStack(stack1).hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: stack1PolicyNameCapture,
      Groups: ['MyGroup'],
    });

    const stack2PolicyNameCapture = new Capture();
    Template.fromStack(stack2).hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: stack2PolicyNameCapture,
      Groups: ['MyGroup'],
    });

    expect(stack1PolicyNameCapture.asString()).not.toBe(stack2PolicyNameCapture.asString());
    expect(stack1PolicyNameCapture.asString()).toMatch(/DefaultPolicyGroupStack1ImportedGroup.*/);
    expect(stack2PolicyNameCapture.asString()).toMatch(/DefaultPolicyGroupStack2ImportedGroup.*/);
  });

  test('the same group imported in different stacks has the same default policy name without the flag', () => {
    const app = new App({ context: { [IAM_IMPORTED_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME]: false } });
    const stack1 = importGroupAndGrant(app, 'GroupStack1');
    const stack2 = importGroupAndGrant(app, 'GroupStack2');

    const stack1PolicyNameCapture = new Capture();
    Template.fromStack(stack1).hasResourceProperties('AWS::IAM::Policy', { PolicyName: stack1PolicyNameCapture });

    const stack2PolicyNameCapture = new Capture();
    Template.fromStack(stack2).hasResourceProperties('AWS::IAM::Policy', { PolicyName: stack2PolicyNameCapture });

    expect(stack1PolicyNameCapture.asString()).toBe(stack2PolicyNameCapture.asString());
    expect(stack1PolicyNameCapture.asString()).toMatch(/ImportedGroupDefaultPolicy.{8}/);
  });

  test('a group imported by name also gets a stack-safe default policy name', () => {
    const app = new App({ context: { [IAM_IMPORTED_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });
    const stack = new Stack(app, 'GroupStack');
    const group = Group.fromGroupName(stack, 'ImportedGroup', 'MyGroup');
    group.addToPrincipalPolicy(new PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }));

    const policyNameCapture = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', { PolicyName: policyNameCapture });

    expect(policyNameCapture.asString()).toMatch(/DefaultPolicyGroupStackImportedGroup.*/);
  });

  test('policy name is truncated to a maximum length of 128 characters when the generated name exceeds this limit', () => {
    const app = new App({ context: { [IAM_IMPORTED_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });
    const stack = importGroupAndGrant(app, 'GroupStack', `ImportedGroup${'x'.repeat(150)}`);

    const policyNameCapture = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', { PolicyName: policyNameCapture });

    const policyName = policyNameCapture.asString();
    expect(policyName).toMatch(/^DefaultPolicy/);
    expect(policyName.length).toBeLessThanOrEqual(128);
    expect(policyName.length).toBeGreaterThan(120);
  });

  test('the statements are still added to the renamed default policy', () => {
    const app = new App({ context: { [IAM_IMPORTED_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });
    const stack = importGroupAndGrant(app, 'GroupStack');

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{ Action: 's3:GetObject', Effect: 'Allow', Resource: '*' }],
        Version: '2012-10-17',
      },
      Groups: ['MyGroup'],
    });
  });

  test('an owned group keeps its default policy name', () => {
    const app = new App({ context: { [IAM_IMPORTED_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });
    const stack = new Stack(app, 'GroupStack');
    const group = new Group(stack, 'MyGroup');
    group.addToPrincipalPolicy(new PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }));

    const policyNameCapture = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', { PolicyName: policyNameCapture });

    expect(policyNameCapture.asString()).toMatch(/MyGroupDefaultPolicy.{8}/);
  });
});
