import { Template } from '../../assertions';
import { App, CfnResource, SecretValue, Stack, Token } from '../../core';
import { IAM_IMPORTED_USER_AND_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME } from '../../cx-api';
import { Group, ManagedPolicy, Policy, PolicyStatement, User } from '../lib';

describe('IAM user', () => {
  test('default user', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new User(stack, 'MyUser');
    Template.fromStack(stack).templateMatches({
      Resources: { MyUserDC45028B: { Type: 'AWS::IAM::User' } },
    });
  });

  test('default user with password', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new User(stack, 'MyUser', {
      password: SecretValue.unsafePlainText('1234'),
    });

    Template.fromStack(stack).templateMatches({
      Resources:
      {
        MyUserDC45028B:
        {
          Type: 'AWS::IAM::User',
          Properties: { LoginProfile: { Password: '1234' } },
        },
      },
    });
  });

  test('fails if reset password is required but no password is set', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    expect(() => new User(stack, 'MyUser', { passwordResetRequired: true })).toThrow();
  });

  test('create with managed policy', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    new User(stack, 'MyUser', {
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('asdf')],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/asdf']] },
      ],
    });
  });

  test('can supply permissions boundary managed policy', () => {
    // GIVEN
    const stack = new Stack();

    const permissionsBoundary = ManagedPolicy.fromAwsManagedPolicyName('managed-policy');

    new User(stack, 'MyUser', {
      permissionsBoundary,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
      PermissionsBoundary: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/managed-policy',
          ],
        ],
      },
    });
  });

  test('user imported by user name has an ARN', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const user = User.fromUserName(stack, 'import', 'MyUserName');

    // THEN
    expect(stack.resolve(user.userArn)).toStrictEqual({
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':user/MyUserName']],
    });
  });

  test('user imported by user ARN has a name', () => {
    // GIVEN
    const stack = new Stack();
    const userName = 'MyUserName';

    // WHEN
    const user = User.fromUserArn(stack, 'import', `arn:aws:iam::account-id:user/${userName}`);

    // THEN
    expect(stack.resolve(user.userName)).toStrictEqual(userName);
  });

  test('user imported by tokenized user ARN has a name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const user = User.fromUserArn(stack, 'import', Token.asString({ Ref: 'ARN' }));

    // THEN
    expect(stack.resolve(user.userName)).toStrictEqual({
      'Fn::Select': [1, { 'Fn::Split': [':user/', { Ref: 'ARN' }] }],
    });
  });

  test('user imported by user ARN has a principalAccount', () => {
    // GIVEN
    const stack = new Stack();
    const accountId = 'account-id';

    // WHEN
    const user = User.fromUserArn(stack, 'import', `arn:aws:iam::${accountId}:user/mockuser`);

    // THEN
    expect(stack.resolve(user.principalAccount)).toStrictEqual(accountId);
  });

  test('user imported by tokenized user ARN has a principalAccount', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const user = User.fromUserArn(stack, 'import', Token.asString({ Ref: 'ARN' }));

    // THEN
    expect(stack.resolve(user.principalAccount)).toStrictEqual({
      'Fn::Select': [4, { 'Fn::Split': [':', { Ref: 'ARN' }] }],
    });
  });
  test('user imported by a new User cosntruct has a principalAccount', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const user = User.fromUserArn(stack, 'import', new User(stack, 'LocalUser').userArn);

    // THEN
    expect(stack.resolve(user.principalAccount)).toStrictEqual(
      { 'Fn::Select': [4, { 'Fn::Split': [':', { 'Fn::GetAtt': ['LocalUser87F70DDF', 'Arn'] }] }] },
    );
  });

  test('user imported by user ARN with path', () => {
    // GIVEN
    const stack = new Stack();
    const userName = 'MyUserName';

    // WHEN
    const user = User.fromUserArn(stack, 'import', `arn:aws:iam::account-id:user/path/${userName}`);

    // THEN
    expect(stack.resolve(user.userName)).toStrictEqual(userName);
  });

  test('user imported by user ARN with path (multiple elements)', () => {
    // GIVEN
    const stack = new Stack();
    const userName = 'MyUserName';

    // WHEN
    const user = User.fromUserArn(stack, 'import', `arn:aws:iam::account-id:user/p/a/t/h/${userName}`);

    // THEN
    expect(stack.resolve(user.userName)).toStrictEqual(userName);
  });

  test('user imported by tokenized user attributes has a name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const user = User.fromUserAttributes(stack, 'import', {
      userArn: Token.asString({ Ref: 'ARN' }),
    });

    // THEN
    expect(stack.resolve(user.userName)).toStrictEqual({
      'Fn::Select': [1, { 'Fn::Split': [':user/', { Ref: 'ARN' }] }],
    });
  });

  test('user imported by user attributes has a name', () => {
    // GIVEN
    const stack = new Stack();
    const userName = 'MyUserName';

    // WHEN
    const user = User.fromUserAttributes(stack, 'import', {
      userArn: `arn:aws:iam::account-id:user/${userName}`,
    });

    // THEN
    expect(stack.resolve(user.userName)).toStrictEqual(userName);
  });

  test('user imported by user attributes with path has a name', () => {
    // GIVEN
    const stack = new Stack();
    const userName = 'MyUserName';

    // WHEN
    const user = User.fromUserAttributes(stack, 'import', {
      userArn: `arn:aws:iam::account-id:user/path/${userName}`,
    });

    // THEN
    expect(stack.resolve(user.userName)).toStrictEqual(userName);
  });

  test('user imported by user attributes with path (multiple elements) has a name', () => {
    // GIVEN
    const stack = new Stack();
    const userName = 'MyUserName';

    // WHEN
    const user = User.fromUserAttributes(stack, 'import', {
      userArn: `arn:aws:iam::account-id:user/p/a/t/h/${userName}`,
    });

    // THEN
    expect(stack.resolve(user.userName)).toStrictEqual(userName);
  });

  test('add to policy of imported user', () => {
    // GIVEN
    const stack = new Stack();
    const user = User.fromUserName(stack, 'ImportedUser', 'john');

    // WHEN
    user.addToPrincipalPolicy(new PolicyStatement({
      actions: ['aws:Use'],
      resources: ['*'],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Users: ['john'],
      PolicyDocument: {
        Statement: [
          {
            Action: 'aws:Use',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('attach policy to imported user', () => {
    // GIVEN
    const stack = new Stack();
    const user = User.fromUserName(stack, 'ImportedUser', 'john');

    // WHEN
    user.attachInlinePolicy(new Policy(stack, 'Policy', {
      statements: [
        new PolicyStatement({
          actions: ['aws:Use'],
          resources: ['*'],
        }),
      ],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Users: ['john'],
      PolicyDocument: {
        Statement: [
          {
            Action: 'aws:Use',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('addToGroup for imported user', () => {
    // GIVEN
    const stack = new Stack();
    const user = User.fromUserName(stack, 'ImportedUser', 'john');
    const group = new Group(stack, 'Group');
    const otherGroup = new Group(stack, 'OtherGroup');

    // WHEN
    user.addToGroup(group);
    otherGroup.addUser(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::UserToGroupAddition', {
      GroupName: {
        Ref: 'GroupC77FDACD',
      },
      Users: [
        'john',
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::UserToGroupAddition', {
      GroupName: {
        Ref: 'OtherGroup85E5C653',
      },
      Users: [
        'john',
      ],
    });
  });
});

test('cross-env user ARNs include path', () => {
  const app = new App();
  const userStack = new Stack(app, 'user-stack', { env: { account: '123456789012', region: 'us-east-1' } });
  const referencerStack = new Stack(app, 'referencer-stack', { env: { region: 'us-east-2' } });
  const user = new User(userStack, 'User', {
    path: '/sample/path/',
    userName: 'sample-name',
  });
  new CfnResource(referencerStack, 'Referencer', {
    type: 'Custom::UserReferencer',
    properties: { UserArn: user.userArn },
  });

  Template.fromStack(referencerStack).hasResourceProperties('Custom::UserReferencer', {
    UserArn: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':iam::123456789012:user/sample/path/sample-name',
        ],
      ],
    },
  });
});

describe('default policy of an imported user with @aws-cdk/aws-iam:importedUserAndGroupStackSafeDefaultPolicyName', () => {
  const userArn = 'arn:aws:iam::123456789012:user/MyUser';

  function stackSafeApp(): App {
    return new App({ context: { [IAM_IMPORTED_USER_AND_GROUP_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });
  }

  function importUserAndGrant(stack: Stack): void {
    const user = User.fromUserArn(stack, 'ImportedUser', userArn);
    user.addToPrincipalPolicy(new PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }));
  }

  test('is named after the stack and keeps its logical ID', () => {
    // GIVEN
    const stack = new Stack(stackSafeApp(), 'UserStack1');

    // WHEN
    importUserAndGrant(stack);

    // THEN
    const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy', {
      Properties: {
        PolicyName: 'PolicyUserStack1ImportedUser9302B323',
        PolicyDocument: {
          Statement: [{ Action: 's3:GetObject', Effect: 'Allow', Resource: '*' }],
          Version: '2012-10-17',
        },
        Users: ['MyUser'],
      },
    });
    // The logical ID is the same as before the policy got a stack-specific name, so the policy is renamed in place
    expect(Object.keys(policies)).toEqual(['ImportedUserPolicy1A28650A']);
  });

  test('has a different name in each stack that imports the same user', () => {
    // GIVEN
    const stack1 = new Stack(stackSafeApp(), 'UserStack1');
    const stack2 = new Stack(stackSafeApp(), 'UserStack2');

    // WHEN
    importUserAndGrant(stack1);
    importUserAndGrant(stack2);

    // THEN
    Template.fromStack(stack1).hasResourceProperties('AWS::IAM::Policy', { PolicyName: 'PolicyUserStack1ImportedUser9302B323' });
    Template.fromStack(stack2).hasResourceProperties('AWS::IAM::Policy', { PolicyName: 'PolicyUserStack2ImportedUserD0D64717' });
  });

  test('uses the stack name', () => {
    // GIVEN
    const stack = new Stack(stackSafeApp(), 'UserStack', { stackName: 'renamed-stack' });

    // WHEN
    importUserAndGrant(stack);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', { PolicyName: 'PolicyrenamedstackImportedUser17CA3F46' });
  });

  test('keeps the same name in every stack without the feature flag', () => {
    // GIVEN
    const stack1 = new Stack(new App(), 'UserStack1');
    const stack2 = new Stack(new App(), 'UserStack2');

    // WHEN
    importUserAndGrant(stack1);
    importUserAndGrant(stack2);

    // THEN
    for (const stack of [stack1, stack2]) {
      const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy', {
        Properties: { PolicyName: 'ImportedUserPolicy1A28650A', Users: ['MyUser'] },
      });
      expect(Object.keys(policies)).toEqual(['ImportedUserPolicy1A28650A']);
    }
  });
});
