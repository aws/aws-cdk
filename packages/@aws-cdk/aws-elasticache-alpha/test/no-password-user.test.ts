import { Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { NoPasswordUser, AccessControl, UserEngine } from '../lib';

describe('NoPasswordUser', () => {
  describe('validation errors', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('when using Valkey engine throws validation error', () => {
      expect(() => new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.VALKEY,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      })).toThrow('Valkey engine does not support no-password authentication.');
    });
  });

  describe('constructor', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('creates user with minimal required properties', () => {
      new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ElastiCache::User', {
        Engine: 'redis',
        UserId: 'test-user',
        UserName: 'test-user',
        AccessString: 'on ~* +@all',
        AuthenticationMode: {
          Type: 'no-password-required',
        },
        NoPasswordRequired: true,
        Passwords: Match.absent(),
      });
    });

    test('creates user with all possible properties', () => {
      new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        accessControl: AccessControl.fromAccessString('on ~app:* +@read +@write'),
        engine: UserEngine.REDIS,
        userName: 'test-user-name',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ElastiCache::User', {
        Engine: 'redis',
        UserId: 'test-user',
        UserName: 'test-user-name',
        AccessString: 'on ~app:* +@read +@write',
        AuthenticationMode: {
          Type: 'no-password-required',
        },
        NoPasswordRequired: true,
        Passwords: Match.absent(),
      });
    });

    test('creates exactly one ElastiCache user resource', () => {
      new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
        engine: UserEngine.REDIS,
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
      const user = new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user-id',
        userName: 'test-user-name',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~app:* +@read'),
      });

      expect(user.userId).toBe('test-user-id');
      expect(user.userName).toBe('test-user-name');
      expect(user.engine).toBe(UserEngine.REDIS);
      expect(user.accessString).toBe('on ~app:* +@read');
      expect(user.userArn).toBeDefined();
      expect(user.userStatus).toBeDefined();
    });

    test('userName defaults to userId when not provided', () => {
      const user = new NoPasswordUser(stack, 'TestUser', {
        userId: 'my-user-id',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      expect(user.userName).toBe('my-user-id');
      expect(user.engine).toBe('redis');
    });
  });

  describe('isNoPasswordUser', () => {
    test('returns true for NoPasswordUser instances', () => {
      const stack = new Stack();
      const user = new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      expect(NoPasswordUser.isNoPasswordUser(user)).toBe(true);
    });

    test('returns false for non-NoPasswordUser objects', () => {
      expect(NoPasswordUser.isNoPasswordUser({})).toBe(false);
      expect(NoPasswordUser.isNoPasswordUser(null)).toBe(false);
      expect(NoPasswordUser.isNoPasswordUser(undefined)).toBe(false);
      expect(NoPasswordUser.isNoPasswordUser('string')).toBe(false);
      expect(NoPasswordUser.isNoPasswordUser(123)).toBe(false);
    });

    test('returns false for imported users (not actual NoPasswordUser instances)', () => {
      const stack = new Stack();
      const importedUser = NoPasswordUser.fromUserId(stack, 'ImportedUser', 'test-user');

      expect(NoPasswordUser.isNoPasswordUser(importedUser)).toBe(false);
    });
  });

  describe('import methods', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('fromUserAttributes works with valid userArn', () => {
      const user = NoPasswordUser.fromUserAttributes(stack, 'ImportedUser', {
        userArn: 'arn:aws:elasticache:us-east-1:123456789012:user:my-user',
      });

      expect(user.userId).toBe('my-user');
      expect(user.userArn).toBe('arn:aws:elasticache:us-east-1:123456789012:user:my-user');
      expect(user.userName).toBe(undefined);
      expect(user.engine).toBe(undefined);
    });

    test('fromUserAttributes works with userId only', () => {
      const user = NoPasswordUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'imported-user',
      });

      expect(user.userId).toBe('imported-user');
      expect(user.userArn).toContain('imported-user');
      expect(user.userName).toBe(undefined);
      expect(user.engine).toBe(undefined);
    });

    test('fromUserAttributes preserves engine when provided', () => {
      const user = NoPasswordUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
      });

      expect(user.engine).toBe(UserEngine.REDIS);
    });

    test('fromUserAttributes preserves userName when provided', () => {
      const user = NoPasswordUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'test-user',
        userName: 'custom-name',
      });

      expect(user.userName).toBe('custom-name');
    });

    test('fromUserAttributes works with both engine and userName', () => {
      const user = NoPasswordUser.fromUserAttributes(stack, 'ImportedUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
        userName: 'custom-name',
      });

      expect(user.userId).toBe('test-user');
      expect(user.engine).toBe(UserEngine.REDIS);
      expect(user.userName).toBe('custom-name');
    });

    test('fromUserAttributes with userArn preserves additional attributes', () => {
      const arn = 'arn:aws:elasticache:us-east-1:123456789012:user:my-user';
      const user = NoPasswordUser.fromUserAttributes(stack, 'ImportedUser', {
        userArn: arn,
        engine: UserEngine.REDIS,
        userName: 'display-name',
      });

      expect(user.userArn).toBe(arn);
      expect(user.userId).toBe('my-user');
      expect(user.engine).toBe('redis');
      expect(user.userName).toBe('display-name');
    });

    test('fromUserId creates user with correct properties', () => {
      const user = NoPasswordUser.fromUserId(stack, 'ImportedUser', 'my-user-id');

      expect(user.userId).toBe('my-user-id');
      expect(user.userArn).toContain('my-user-id');
      expect(user.userName).toBe(undefined);
      expect(user.engine).toBe(undefined);
    });

    test('fromUserArn creates user with correct properties', () => {
      const arn = 'arn:aws:elasticache:us-west-2:123456789012:user:test-user';
      const user = NoPasswordUser.fromUserArn(stack, 'ImportedUser', arn);

      expect(user.userId).toBe('test-user');
      expect(user.userArn).toBe(arn);
      expect(user.userName).toBe(undefined);
      expect(user.engine).toBe(undefined);
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
      expect(() => NoPasswordUser.fromUserAttributes(stack, 'ImportedUser', { userArn, userId })).toThrow(errorMessage);
    });
  });
});
