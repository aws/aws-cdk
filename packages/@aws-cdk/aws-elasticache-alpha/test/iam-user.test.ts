import { Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IamUser, AccessControl, UserEngine } from '../lib';

describe('IamUser', () => {
  describe('validation errors', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test.each([
      {
        testDescription: 'when userName differs from userId throws validation error',
        userId: 'test-user',
        userName: 'different-name',
        errorMessage: 'For IAM authentication, userName must be equal to userId.',
      },
    ])('$testDescription', ({ userId, userName, errorMessage }) => {
      expect(() => new IamUser(stack, 'TestUser', {
        userId,
        userName,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      })).toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('creates user with minimal required properties', () => {
      new IamUser(stack, 'TestUser', {
        userId: 'test-user',
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ElastiCache::User', {
        Engine: 'valkey',
        UserId: 'test-user',
        UserName: 'test-user',
        AccessString: 'on ~* +@all',
        AuthenticationMode: {
          Type: 'iam',
        },
        NoPasswordRequired: false,
        Passwords: Match.absent(),
      });
    });

    test('creates user with all possible properties', () => {
      new IamUser(stack, 'TestUser', {
        userId: 'test-user',
        accessControl: AccessControl.fromAccessString('on ~app:* +@read +@write'),
        engine: UserEngine.REDIS,
        userName: 'test-user',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ElastiCache::User', {
        Engine: 'redis',
        UserId: 'test-user',
        UserName: 'test-user',
        AccessString: 'on ~app:* +@read +@write',
        AuthenticationMode: {
          Type: 'iam',
        },
        NoPasswordRequired: false,
        Passwords: Match.absent(),
      });
    });

    test('creates exactly one ElastiCache user resource', () => {
      new IamUser(stack, 'TestUser', {
        userId: 'test-user',
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::ElastiCache::User', 1);
    });
  });

  describe('properties', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('exposes correct properties', () => {
      const user = new IamUser(stack, 'TestUser', {
        userId: 'test-user-id',
        userName: 'test-user-id',
        engine: UserEngine.VALKEY,
        accessControl: AccessControl.fromAccessString('on ~app:* +@read'),
      });

      expect(user.userId).toBe('test-user-id');
      expect(user.userName).toBe('test-user-id');
      expect(user.engine).toBe('valkey');
      expect(user.accessString).toBe('on ~app:* +@read');
      expect(user.userArn).toBeDefined();
      expect(user.userStatus).toBeDefined();
    });

    test('userName defaults to userId when not provided', () => {
      const user = new IamUser(stack, 'TestUser', {
        userId: 'my-user-id',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      expect(user.userName).toBe('my-user-id');
      expect(user.engine).toBe('redis');
    });
  });

  describe('isIamUser', () => {
    test('returns true for IamUser instances', () => {
      const stack = new Stack();
      const user = new IamUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.VALKEY,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      expect(IamUser.isIamUser(user)).toBe(true);
    });

    test('returns false for non-IamUser objects', () => {
      expect(IamUser.isIamUser({})).toBe(false);
      expect(IamUser.isIamUser(null)).toBe(false);
      expect(IamUser.isIamUser(undefined)).toBe(false);
      expect(IamUser.isIamUser('string')).toBe(false);
      expect(IamUser.isIamUser(123)).toBe(false);
    });

    test('returns false for imported users (not actual IamUser instances)', () => {
      const stack = new Stack();
      const importedUser = IamUser.fromUserId(stack, 'ImportedUser', 'test-user');

      expect(IamUser.isIamUser(importedUser)).toBe(false);
    });
  });

  describe('IAM permissions', () => {
    let stack: Stack;
    let user: IamUser;
    let role: Role;

    beforeEach(() => {
      stack = new Stack();
      user = new IamUser(stack, 'TestUser', {
        userId: 'test-user',
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });
      role = new Role(stack, 'TestRole', {
        assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      });
    });

    test('grantConnect adds correct IAM permissions', () => {
      user.grantConnect(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Effect: 'Allow',
              Action: 'elasticache:Connect',
              Resource: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
            },
          ]),
        },
      });
    });

    test('grant adds custom IAM permissions', () => {
      user.grant(role, 'elasticache:Connect', 'elasticache:DescribeUsers');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Effect: 'Allow',
              Action: ['elasticache:Connect', 'elasticache:DescribeUsers'],
              Resource: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
            },
          ]),
        },
      });
    });

    test('grant works with single action', () => {
      user.grant(role, 'elasticache:Connect');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Effect: 'Allow',
              Action: 'elasticache:Connect',
              Resource: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
            },
          ]),
        },
      });
    });
  });

  describe('import methods', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('fromUserAttributes works with valid userArn', () => {
      const user = IamUser.fromUserAttributes(stack, 'ImportedUser', {
        userArn: 'arn:aws:elasticache:us-east-1:123456789012:user:my-user',
      });

      expect(user.userId).toBe('my-user');
      expect(user.userArn).toBe('arn:aws:elasticache:us-east-1:123456789012:user:my-user');
      expect(user.userName).toBe(undefined);
      expect(user.engine).toBe(undefined);
    });

    test('fromUserAttributes works with userId only', () => {
      const user = IamUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'imported-user',
      });

      expect(user.userId).toBe('imported-user');
      expect(user.userArn).toContain('imported-user');
      expect(user.userName).toBe(undefined);
      expect(user.engine).toBe(undefined);
    });

    test('fromUserAttributes preserves engine when provided', () => {
      const user = IamUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
      });

      expect(user.engine).toBe(UserEngine.REDIS);
    });

    test('fromUserAttributes preserves userName when provided', () => {
      const user = IamUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'test-user',
        userName: 'test-user',
      });

      expect(user.userName).toBe('test-user');
    });

    test('fromUserAttributes works with both engine and userName', () => {
      const user = IamUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
        userName: 'test-user',
      });

      expect(user.userId).toBe('test-user');
      expect(user.engine).toBe(UserEngine.REDIS);
      expect(user.userName).toBe('test-user');
    });

    test('fromUserAttributes with userArn preserves additional attributes', () => {
      const arn = 'arn:aws:elasticache:us-east-1:123456789012:user:my-user';
      const user = IamUser.fromUserAttributes(stack, 'ImportedUser', {
        userArn: arn,
        engine: UserEngine.VALKEY,
        userName: 'my-user',
      });

      expect(user.userArn).toBe(arn);
      expect(user.userId).toBe('my-user');
      expect(user.engine).toBe('valkey');
      expect(user.userName).toBe('my-user');
    });

    test('fromUserId creates user with correct properties', () => {
      const user = IamUser.fromUserId(stack, 'ImportedUser', 'my-user-id');

      expect(user.userId).toBe('my-user-id');
      expect(user.userArn).toContain('my-user-id');
      expect(user.userName).toBe(undefined);
      expect(user.engine).toBe(undefined);
    });

    test('fromUserArn creates user with correct properties', () => {
      const arn = 'arn:aws:elasticache:us-west-2:123456789012:user:test-user';
      const user = IamUser.fromUserArn(stack, 'ImportedUser', arn);

      expect(user.userId).toBe('test-user');
      expect(user.userArn).toBe(arn);
      expect(user.userName).toBe(undefined);
      expect(user.engine).toBe(undefined);
    });

    test('import methods do not validate userName equals userId constraint', () => {
      // Import methods assume external user is valid
      const user = IamUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'test-user',
        userName: 'different-name', // This is allowed for imports
      });

      expect(user.userName).toBe('different-name');
      expect(user.userId).toBe('test-user');
    });

    test.each([
      {
        testDescription: 'when passing both userId and userArn throws validation error',
        userArn: 'arn:aws:elasticache:us-east-1:999999999999:user:test-user',
        userId: 'test-user',
        errorMessage: 'Only one of userArn or userId can be provided.',
      },
      {
        testDescription: 'when passing neither userId nor userArn throws validation error',
        errorMessage: 'One of userId or userArn is required.',
      },
      {
        testDescription: 'when passing invalid userArn (no user id) throws validation error',
        userArn: 'arn:aws:elasticache:us-east-1:999999999999:user',
        errorMessage: 'Unable to extract user id from ARN.',
      },
    ])('$testDescription', ({ userArn, userId, errorMessage }) => {
      expect(() => IamUser.fromUserAttributes(stack, 'ImportedUser', { userArn, userId })).toThrow(errorMessage);
    });
  });
});
