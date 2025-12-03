import { SecretValue, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccessControl, IamUser, NoPasswordUser, PasswordUser, UserEngine, UserGroup } from '../lib';

describe('UserGroup', () => {
  describe('validation errors', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test.each([
      {
        testDescription: 'when Redis user group contains non-Redis user throws validation error',
        engine: UserEngine.REDIS,
        userEngine: UserEngine.VALKEY,
        errorMessage: 'Redis user group can only contain Redis users.',
      },
    ])('$testDescription', ({ engine, userEngine, errorMessage }) => {
      const user = new IamUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: userEngine,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      expect(() => {
        new UserGroup(stack, 'TestUserGroup', {
          engine,
          users: [user],
        });
        Template.fromStack(stack);
      }).toThrow(errorMessage);
    });

    test('when Redis user group does not contain default user throws validation error', () => {
      const users = [
        new IamUser(stack, 'TestUser1', {
          userId: 'user1',
          userName: 'user1',
          engine: UserEngine.REDIS,
          accessControl: AccessControl.fromAccessString('on ~* +@all'),
        }),
      ];

      expect(() => {
        new UserGroup(stack, 'TestUserGroup', {
          engine: UserEngine.REDIS,
          users: users,
        });
        Template.fromStack(stack);
      }).toThrow('Redis user groups need to contain a user with the user name "default".');
    });

    test('when Redis user group does not contain any users throws validation error', () => {
      expect(() => {
        new UserGroup(stack, 'TestUserGroup', {
          engine: UserEngine.REDIS,
          users: [],
        });
        Template.fromStack(stack);
      }).toThrow('Redis user groups need to contain a user with the user name "default".');
    });

    test('when Redis user group have users prop as undefined throws validation error', () => {
      expect(() => {
        new UserGroup(stack, 'TestUserGroup', {
          engine: UserEngine.REDIS,
        });
        Template.fromStack(stack);
      }).toThrow('Redis user groups need to contain a user with the user name "default".');
    });

    test('when user group has duplicate usernames throws validation error', () => {
      const users = [
        new PasswordUser(stack, 'TestUser1', {
          userId: 'user1',
          userName: 'duplicate-name',
          engine: UserEngine.VALKEY,
          accessControl: AccessControl.fromAccessString('on ~* +@all'),
          passwords: [SecretValue.secretsManager('newpasswordforuser1')],
        }),
        new PasswordUser(stack, 'TestUser2', {
          userId: 'user2',
          userName: 'duplicate-name',
          engine: UserEngine.VALKEY,
          accessControl: AccessControl.fromAccessString('on ~* +@all'),
          passwords: [SecretValue.secretsManager('newpasswordforuser2')],
        }),
      ];

      expect(() => {
        new UserGroup(stack, 'TestUserGroup', {
          engine: UserEngine.VALKEY,
          users: users,
        });
        Template.fromStack(stack);
      }).toThrow('User group cannot have users with the same user name.');
    });

    test('when REDIS user group has duplicate usernames and do not contain default user throws validation error', () => {
      const users = [
        new NoPasswordUser(stack, 'TestUser1', {
          userId: 'user1',
          userName: 'duplicate-name',
          engine: UserEngine.REDIS,
          accessControl: AccessControl.fromAccessString('on ~* +@all'),
        }),
        new NoPasswordUser(stack, 'TestUser2', {
          userId: 'user2',
          userName: 'duplicate-name',
          engine: UserEngine.REDIS,
          accessControl: AccessControl.fromAccessString('on ~* +@all'),
        }),
      ];

      expect(() => {
        new UserGroup(stack, 'TestUserGroup', {
          engine: UserEngine.REDIS,
          users: users,
        });
        Template.fromStack(stack);
      }).toThrow('User group cannot have users with the same user name.');
    });

    test.each([
      {
        testDescription: 'when passing both userGroupName and userGroupArn throws validation error',
        userGroupArn: 'arn:aws:elasticache:us-east-1:999999999999:usergroup:test-group',
        userGroupName: 'test-group',
        errorMessage: 'Only one of userGroupArn or userGroupName can be provided.',
      },
      {
        testDescription: 'when passing neither userGroupName nor userGroupArn throws validation error',
        errorMessage: 'One of userGroupName or userGroupArn is required.',
      },
      {
        testDescription: 'when passing invalid userGroupArn (no group name) throws validation error',
        userGroupArn: 'arn:aws:elasticache:us-east-1:999999999999:usergroup',
        errorMessage: 'Unable to extract user group name from ARN.',
      },
    ])('$testDescription', ({ userGroupArn, userGroupName, errorMessage }) => {
      expect(() => UserGroup.fromUserGroupAttributes(stack, 'ImportedUserGroup', { userGroupArn, userGroupName })).toThrow(errorMessage);
    });

    test('when adding non-Redis user to Redis group throws validation error', () => {
      const userGroup = new UserGroup(stack, 'TestUserGroup', {
        engine: UserEngine.REDIS,
      });
      const valkeyUser = new IamUser(stack, 'ValkeyUser', {
        userId: 'valkey-user',
        engine: UserEngine.VALKEY,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      expect(() => {
        userGroup.addUser(valkeyUser);
        Template.fromStack(stack);
      },
      ).toThrow('Redis user group can only contain Redis users.');
    });
  });

  describe('constructor', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('creates Valkey user group with minimal required properties', () => {
      new UserGroup(stack, 'TestUserGroup');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ElastiCache::UserGroup', {
        Engine: 'valkey',
        UserGroupId: 'testusergroup',
      });
    });

    test('creates Redis user group with minimal required properties', () => {
      const user = new NoPasswordUser(stack, 'TestUser', {
        userId: 'default',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~app:* +@read +@write'),
      });

      new UserGroup(stack, 'TestUserGroup', {
        engine: UserEngine.REDIS,
        users: [user],
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ElastiCache::UserGroup', {
        Engine: 'redis',
        UserGroupId: 'testusergroup',
        UserIds: [user.userId],
      });
    });

    test('creates user group with all possible properties', () => {
      const user = new PasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
        passwords: [SecretValue.secretsManager('secretvalue-123456')],
      });

      new UserGroup(stack, 'TestUserGroup', {
        userGroupName: 'my-user-group',
        engine: UserEngine.VALKEY,
        users: [user],
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ElastiCache::UserGroup', {
        Engine: 'valkey',
        UserGroupId: 'my-user-group',
        UserIds: ['test-user'],
      });
    });

    test('creates Valkey user group with both Redis and Valkey users', () => {
      const redisUser = new NoPasswordUser(stack, 'RedisUser', {
        userId: 'redis-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const valkeyUser1 = new PasswordUser(stack, 'ValkeyUser1', {
        userId: 'valkey-user1',
        engine: UserEngine.VALKEY,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
        passwords: [SecretValue.secretsManager('secretvalue-123456')],
      });

      const valkeyUser2 = new IamUser(stack, 'ValkeyUser2', {
        userId: 'valkey-user2',
        engine: UserEngine.VALKEY,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const userGroup = new UserGroup(stack, 'TestUserGroup', {
        users: [redisUser, valkeyUser1, valkeyUser2],
      });

      expect(userGroup.users).toHaveLength(3);
      expect(userGroup.users![0].userId).toBe('redis-user');
      expect(userGroup.users![1].userId).toBe('valkey-user1');
      expect(userGroup.users![2].userId).toBe('valkey-user2');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ElastiCache::UserGroup', {
        Engine: 'valkey',
        UserIds: [redisUser.userId, valkeyUser1.userId, valkeyUser2.userId],
      });
    });

    test('creates exactly one ElastiCache user group resource', () => {
      new UserGroup(stack, 'TestUserGroup');

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::ElastiCache::UserGroup', 1);
    });
  });

  describe('properties', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('exposes correct properties', () => {
      const user = new IamUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.VALKEY,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const userGroup = new UserGroup(stack, 'TestUserGroup', {
        userGroupName: 'my-group',
        engine: UserEngine.VALKEY,
        users: [user],
      });

      expect(userGroup.userGroupName).toBe('my-group');
      expect(userGroup.engine).toBe('valkey');
      expect(userGroup.users).toHaveLength(1);
      expect(userGroup.users![0].userId).toBe('test-user');
      expect(userGroup.userGroupArn).toBeDefined();
      expect(userGroup.userGroupStatus).toBeDefined();
    });

    test('defaults to Valkey engine when not specified', () => {
      const userGroup = new UserGroup(stack, 'TestUserGroup');

      expect(userGroup.engine).toBe(UserEngine.VALKEY);
    });

    test('generates userGroupName when not provided', () => {
      const userGroup = new UserGroup(stack, 'TestUserGroup');

      expect(userGroup.userGroupName).toBeDefined();
      expect(typeof userGroup.userGroupName).toBe('string');
    });

    test('show what the token actually contains', () => {
      const userGroup = new UserGroup(stack, 'TestUserGroup');

      expect(userGroup.userGroupName).toBeDefined();
      expect(typeof userGroup.userGroupName).toBe('string');
      expect(userGroup.userGroupName).toMatch(/\$\{Token/);

      const resolved = stack.resolve(userGroup.userGroupName);
      expect(resolved).toEqual('testusergroup');
    });
  });

  describe('addUser', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('adds user to group successfully', () => {
      const userGroup = new UserGroup(stack, 'TestUserGroup', {
        engine: UserEngine.VALKEY,
      });
      const user = new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      userGroup.addUser(user);

      expect(userGroup.users).toHaveLength(1);
      expect(userGroup.users![0].userId).toBe(user.userId);
    });

    test('adds second user to group that already has one user', () => {
      const existingUser = new NoPasswordUser(stack, 'ExistingUser', {
        userId: 'existing-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const userGroup = new UserGroup(stack, 'TestUserGroup', {
        engine: UserEngine.VALKEY,
        users: [existingUser],
      });

      const newUser = new NoPasswordUser(stack, 'NewUser', {
        userId: 'new-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      userGroup.addUser(newUser);

      expect(userGroup.users).toHaveLength(2);
      expect(userGroup.users![0].userId).toBe('existing-user');
      expect(userGroup.users![1].userId).toBe('new-user');
    });
  });

  describe('isUserGroup', () => {
    test('returns true for UserGroup instances', () => {
      const stack = new Stack();
      const userGroup = new UserGroup(stack, 'TestUserGroup');

      expect(UserGroup.isUserGroup(userGroup)).toBe(true);
    });

    test('returns false for non-UserGroup objects', () => {
      expect(UserGroup.isUserGroup({})).toBe(false);
      expect(UserGroup.isUserGroup(null)).toBe(false);
      expect(UserGroup.isUserGroup(undefined)).toBe(false);
      expect(UserGroup.isUserGroup('string')).toBe(false);
      expect(UserGroup.isUserGroup(123)).toBe(false);
    });

    test('returns false for imported user groups (not actual UserGroup instances)', () => {
      const stack = new Stack();
      const importedUserGroup = UserGroup.fromUserGroupName(stack, 'ImportedUserGroup', 'test-group');

      expect(UserGroup.isUserGroup(importedUserGroup)).toBe(false);
    });
  });

  describe('import methods', () => {
    let stack: Stack;
    beforeEach(() => {
      stack = new Stack();
    });

    test('fromUserGroupAttributes works with valid userGroupArn', () => {
      const userGroup = UserGroup.fromUserGroupAttributes(stack, 'ImportedUserGroup', {
        userGroupArn: 'arn:aws:elasticache:us-east-1:123456789012:usergroup:my-group',
      });

      expect(userGroup.userGroupName).toBe('my-group');
      expect(userGroup.userGroupArn).toBe('arn:aws:elasticache:us-east-1:123456789012:usergroup:my-group');
      expect(userGroup.engine).toBe(undefined);
      expect(userGroup.users).toBe(undefined);
    });

    test('fromUserGroupAttributes works with userGroupName only', () => {
      const userGroup = UserGroup.fromUserGroupAttributes(stack, 'ImportedUserGroup', {
        userGroupName: 'imported-group',
      });

      expect(userGroup.userGroupName).toBe('imported-group');
      expect(userGroup.userGroupArn).toContain('imported-group');
      expect(userGroup.engine).toBe(undefined);
      expect(userGroup.users).toBe(undefined);
    });

    test('fromUserGroupAttributes preserves engine when provided', () => {
      const userGroup = UserGroup.fromUserGroupAttributes(stack, 'ImportedUserGroup', {
        userGroupName: 'test-group',
        engine: UserEngine.REDIS,
      });

      expect(userGroup.engine).toBe(UserEngine.REDIS);
    });

    test('fromUserGroupAttributes preserves users when provided', () => {
      const user = new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const userGroup = UserGroup.fromUserGroupAttributes(stack, 'ImportedUserGroup', {
        userGroupName: 'test-group',
        users: [user],
      });

      expect(userGroup.users).toHaveLength(1);
      expect(userGroup.users![0].userId).toBe(user.userId);
    });

    test('fromUserGroupAttributes works with both engine and users', () => {
      const user = new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const userGroup = UserGroup.fromUserGroupAttributes(stack, 'ImportedUserGroup', {
        userGroupName: 'test-group',
        engine: UserEngine.VALKEY,
        users: [user],
      });

      expect(userGroup.userGroupName).toBe('test-group');
      expect(userGroup.userGroupArn).toContain('test-group');
      expect(userGroup.engine).toBe(UserEngine.VALKEY);
      expect(userGroup.users).toHaveLength(1);
      expect(userGroup.users![0].userId).toBe(user.userId);
    });

    test('fromUserGroupAttributes with userGroupArn preserves additional attributes', () => {
      const arn = 'arn:aws:elasticache:us-east-1:123456789012:usergroup:my-group';
      const user = new NoPasswordUser(stack, 'TestUser', {
        userId: 'test-user',
        engine: UserEngine.REDIS,
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      const userGroup = UserGroup.fromUserGroupAttributes(stack, 'ImportedUserGroup', {
        userGroupArn: arn,
        engine: UserEngine.VALKEY,
        users: [user],
      });

      expect(userGroup.userGroupArn).toBe(arn);
      expect(userGroup.userGroupName).toBe('my-group');
      expect(userGroup.engine).toBe('valkey');
      expect(userGroup.users).toHaveLength(1);
      expect(userGroup.users![0].userId).toBe(user.userId);
    });

    test('fromUserGroupName creates user group with correct properties', () => {
      const userGroup = UserGroup.fromUserGroupName(stack, 'ImportedUserGroup', 'my-group-name');

      expect(userGroup.userGroupName).toBe('my-group-name');
      expect(userGroup.userGroupArn).toContain('my-group-name');
      expect(userGroup.engine).toBe(undefined);
      expect(userGroup.users).toBe(undefined);
    });

    test('fromUserGroupArn creates user group with correct properties', () => {
      const arn = 'arn:aws:elasticache:us-west-2:123456789012:usergroup:test-group';
      const userGroup = UserGroup.fromUserGroupArn(stack, 'ImportedUserGroup', arn);

      expect(userGroup.userGroupName).toBe('test-group');
      expect(userGroup.userGroupArn).toBe(arn);
      expect(userGroup.engine).toBe(undefined);
      expect(userGroup.users).toBe(undefined);
    });

    test('imported user groups cannot add users', () => {
      const importedUserGroup = UserGroup.fromUserGroupName(stack, 'ImportedUserGroup', 'test-group');
      const user = new IamUser(stack, 'TestUser', {
        userId: 'test-user',
        accessControl: AccessControl.fromAccessString('on ~* +@all'),
      });

      expect(() => importedUserGroup.addUser(user)).toThrow('Cannot add users to an imported UserGroup. Only UserGroups created in this stack can be modified.');
    });
  });
});

