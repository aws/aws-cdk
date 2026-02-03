import { Stack, Size } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Key } from 'aws-cdk-lib/aws-kms';
import { CacheEngine, ServerlessCache, UserEngine, UserGroup } from '../lib';

describe('serverless cache', () => {
  describe('create valid templates', () => {
    let stack: Stack, vpc: Vpc;
    beforeEach(() => {
      stack = new Stack();
      vpc = new Vpc(stack, 'VPC');
    });

    test('import serverless cache', () => {
      const cache = ServerlessCache.fromServerlessCacheAttributes(stack, 'ImportedCache', {
        serverlessCacheName: 'my-serverless-cache',
      });

      expect(cache.serverlessCacheArn).toEqual(`arn:${stack.partition}:elasticache:${stack.region}:${stack.account}:serverlesscache/my-serverless-cache`);
    });

    test.each([
      [CacheEngine.VALKEY_LATEST],
      [CacheEngine.VALKEY_8],
      [CacheEngine.VALKEY_7],
      [CacheEngine.REDIS_LATEST],
      [CacheEngine.REDIS_7],
      [CacheEngine.MEMCACHED_LATEST],
      [CacheEngine.MEMCACHED_1_6],
    ])('import serverless cache for %s', (cacheEngine) => {
      const cache = ServerlessCache.fromServerlessCacheAttributes(stack, 'ImportedCache', {
        serverlessCacheName: 'my-serverless-cache',
        engine: cacheEngine,
      });

      expect(cache.serverlessCacheArn).toEqual(`arn:${stack.partition}:elasticache:${stack.region}:${stack.account}:serverlesscache/my-serverless-cache`);
    });

    test('create serverless cache with full props', () => {
      const key = new Key(stack, 'Key', {});
      const securityGroup = new SecurityGroup(stack, 'SecurityGroup', { vpc });
      const userGroup = new UserGroup(stack, 'UserGroup', {});

      new ServerlessCache(stack, 'Cache', {
        description: 'Serverless cache',
        vpc,
        engine: CacheEngine.VALKEY_8,
        serverlessCacheName: 'serverelessCache',
        kmsKey: key,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [securityGroup],
        userGroup,
        backup: {
          backupRetentionLimit: 2,
          backupNameBeforeDeletion: 'last-snapshot-name',
        },
        cacheUsageLimits: {
          dataStorageMinimumSize: Size.gibibytes(1),
          dataStorageMaximumSize: Size.gibibytes(1),
          requestRateLimitMinimum: 1_000,
          requestRateLimitMaximum: 1_000,

        },
      });

      Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);

      Template.fromStack(stack).hasResourceProperties('AWS::ElastiCache::ServerlessCache', {
        Description: 'Serverless cache',
        Engine: 'valkey',
        MajorEngineVersion: '8',
        KmsKeyId: {
          Ref: 'Key961B73FD',
        },
        FinalSnapshotName: 'last-snapshot-name',
        ServerlessCacheName: 'serverelessCache',
        SnapshotRetentionLimit: 2,
        UserGroupId: 'usergroup',
        CacheUsageLimits: {
          DataStorage: {
            Minimum: 1,
            Maximum: 1,
          },
          ECPUPerSecond: {
            Minimum: 1_000,
            Maximum: 1_000,
          },
        },
      });
    });

    test.each([
      [CacheEngine.VALKEY_LATEST, 'valkey', Match.absent()],
      [CacheEngine.VALKEY_8, 'valkey', '8'],
      [CacheEngine.VALKEY_7, 'valkey', '7'],
      [CacheEngine.REDIS_LATEST, 'redis', Match.absent()],
      [CacheEngine.REDIS_7, 'redis', '7'],
      [CacheEngine.MEMCACHED_LATEST, 'memcached', Match.absent()],
      [CacheEngine.MEMCACHED_1_6, 'memcached', '1.6'],
    ])('test serverless cache version for %s', (cacheEngine, engine, version) => {
      new ServerlessCache(stack, 'Cache', {
        description: 'Serverless cache',
        vpc,
        engine: cacheEngine,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ElastiCache::ServerlessCache', {
        Description: 'Serverless cache',
        Engine: engine,
        MajorEngineVersion: version,
      });
    });

    test('allow security group ingress with endpoint port', () => {
      const cache = new ServerlessCache(stack, 'Cache', {
        vpc,
      });
      new SecurityGroup(stack, 'SecurityGroup', { vpc }).connections.allowToDefaultPort(cache);

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        FromPort: {
          'Fn::GetAtt': ['Cache18F6EE16', 'Endpoint.Port'],
        },
        ToPort: {
          'Fn::GetAtt': ['Cache18F6EE16', 'Endpoint.Port'],
        },
      });
    });
  });

  describe('validation errors', () => {
    let stack: Stack, vpc: Vpc;
    beforeEach(() => {
      stack = new Stack();
      vpc = new Vpc(stack, 'VPC');
    });

    const descriptionLength = 256;
    test.each([
      {
        testDescription: 'when the description is longer than the max(255) characters throws validation error',
        description: 'A'.repeat(descriptionLength),
        errorMessage: `Description must not exceed 255 characters, currently has ${descriptionLength}`,
      },
      {
        testDescription: 'when the description has < characters throws validation error',
        description: '<',
        errorMessage: 'Description must not contain < or > characters',
      },
      {
        testDescription: 'when the description has > characters throws validation error',
        description: '>',
        errorMessage: 'Description must not contain < or > characters',
      },
    ])('$testDescription', ({ description, errorMessage }) => {
      expect(() => new ServerlessCache(stack, 'cache', {
        description,
        vpc,
      }),
      ).toThrow(errorMessage);
    });

    const invalidMinStorageSize = Size.bytes(0);
    const invalidMaxStorageSize = Size.gibibytes(5_001);
    const dataStorageTest = [
      {
        testDescription: 'when the minimum data storage is smaller than the minimum(1 GB) throws validation error',
        cacheUsageLimits: { dataStorageMinimumSize: invalidMinStorageSize },
        errorMessage: 'Data storage minimum must be between 1 and 5000 GB.',
      },
      {
        testDescription: 'when the minimum data storage is larger than the maximum(5000 GB) throws validation error',
        cacheUsageLimits: { dataStorageMinimumSize: invalidMaxStorageSize },
        errorMessage: 'Data storage minimum must be between 1 and 5000 GB.',
      },
      {
        testDescription: 'when the maximum data storage is larger than the maximum(5000 GB) throws validation error',
        cacheUsageLimits: { dataStorageMaximumSize: invalidMaxStorageSize },
        errorMessage: 'Data storage maximum must be between 1 and 5000 GB.',
      },
      {
        testDescription: 'when the maximum data storage is smaller than the minimum(1 GB) throws validation error',
        cacheUsageLimits: { dataStorageMaximumSize: invalidMinStorageSize },
        errorMessage: 'Data storage maximum must be between 1 and 5000 GB.',
      },
      {
        testDescription: 'when the minimum data storage is larger than maximum data storage throws validation error',
        cacheUsageLimits: { dataStorageMinimumSize: Size.gibibytes(100), dataStorageMaximumSize: Size.gibibytes(99) },
        errorMessage: 'Data storage minimum cannot be greater than maximum',
      },
    ];

    const invalidMinRequestRate = 999;
    const invalidMaxRequestRate = 15_000_001;
    const requestRateLimitTests = [
      {
        testDescription: 'when the minimum request rate is smaller than minimum(1,000) throws validation error',
        cacheUsageLimits: {
          requestRateLimitMinimum: invalidMinRequestRate,
        },
        errorMessage: 'Request rate minimum must be between 1,000 and 15,000,000 ECPUs per second',
      },
      {
        testDescription: 'when the minimum request rate is larger than maximum(15,000,000) throws validation error',
        cacheUsageLimits: {
          requestRateLimitMinimum: invalidMaxRequestRate,
        },
        errorMessage: 'Request rate minimum must be between 1,000 and 15,000,000 ECPUs per second',
      },
      {
        testDescription: 'when the maximum request rate is smaller than minimum(1,000) throws validation error',
        cacheUsageLimits: {
          requestRateLimitMaximum: invalidMinRequestRate,
        },
        errorMessage: 'Request rate maximum must be between 1,000 and 15,000,000 ECPUs per second',
      },
      {
        testDescription: `when the maximum request rate is ${invalidMaxRequestRate} throws validation error`,
        cacheUsageLimits: {
          requestRateLimitMaximum: invalidMaxRequestRate,
        },
        errorMessage: 'Request rate maximum must be between 1,000 and 15,000,000 ECPUs per second',
      },
      {
        testDescription: 'when the minimum request rate is larger than maximum request rate throws validation error',
        cacheUsageLimits: {
          requestRateLimitMinimum: 2_000,
          requestRateLimitMaximum: 1_000,
        },
        errorMessage: 'Request rate minimum cannot be greater than maximum',
      },
    ];

    test.each([
      ...dataStorageTest,
      ...requestRateLimitTests,
    ])('$testDescription', ({ cacheUsageLimits, errorMessage }) => {
      expect(() => new ServerlessCache(stack, 'cache', {
        vpc,
        cacheUsageLimits,
      }),
      ).toThrow(errorMessage);
    });

    test.each([
      {
        testDescription: 'when the backup retention limit is smaller than minimum(1) throws validation error',
        backup: {
          backupRetentionLimit: 0,
        },
        errorMessage: 'Backup retention limit must be between 1 and 35 days',
      },
      {
        testDescription: 'when the backup retention limit is larger than maximum(35) throws validation error',
        backup: {
          backupRetentionLimit: 36,
        },
        errorMessage: 'Backup retention limit must be between 1 and 35 days',
      },
      {
        testDescription: 'when the backup name starts with number throws validation error',
        backup: {
          backupNameBeforeDeletion: '1',
        },
        errorMessage: 'Final backup name must begin with a letter',
      },
      {
        testDescription: 'when the backup name ends with hyphen throws validation error',
        backup: {
          backupNameBeforeDeletion: 'a-',
        },
        errorMessage: 'Final backup name must not end with a hyphen',
      },
      {
        testDescription: 'when the backup name has two consecutive hyphen throws validation error',
        backup: {
          backupNameBeforeDeletion: 'a--a',
        },
        errorMessage: 'Final backup name must not contain two consecutive hyphens',
      },
      {
        testDescription: 'when the backup name has dollar sign throws validation error',
        backup: {
          backupNameBeforeDeletion: 'a$b',
        },
        errorMessage: 'Final backup name must contain only ASCII letters, digits, and hyphens',
      },
    ])('$testDescription', ({ backup, errorMessage }) => {
      expect(() => new ServerlessCache(stack, 'cache', {
        vpc,
        backup,
      }),
      ).toThrow(errorMessage);
    });

    test.each([
      {
        testDescription: 'when a user group passed to Mem cache throws validation error',
        engine: CacheEngine.MEMCACHED_LATEST,
        userGroupProps: {

        },
        errorMessage: 'User groups cannot be used with Memcached engines. Only Redis and Valkey engines support user groups.',
      },
      {
        testDescription: 'when a valkey user group passed to Redis cache throws validation error',
        engine: CacheEngine.REDIS_LATEST,
        userGroupProps: {
          engine: UserEngine.VALKEY,
        },
        errorMessage: 'Redis cache can only use Redis user groups.',
      },
    ])('$testDescription', ({ engine, userGroupProps, errorMessage }) => {
      const userGroup = new UserGroup(stack, 'UserGroup', userGroupProps);
      expect(() => new ServerlessCache(stack, 'cache', {
        vpc,
        engine,
        userGroup,
      }),
      ).toThrow(errorMessage);
    });

    test.each([
      {
        testDescription: 'when passing cache name & cache arn throws validation error',
        serverlessCacheArn: 'arn:aws:elasticache:us-east-1:999999999999:serverlesscache:cachename',
        serverlessCacheName: 'cachename',
        errorMessage: 'Only one of serverlessCacheArn or serverlessCacheName can be provided.',
      },
      {
        testDescription: 'when passing none of cache name or cache arn throws validation error',
        errorMessage: 'One of serverlessCacheName or serverlessCacheArn is required.',
      },

      {
        testDescription: 'when passing cache arn invalid(has no cache name) throws validation error',
        serverlessCacheArn: 'arn:aws:elasticache:us-east-1:999999999999:serverlesscache',
        errorMessage: 'Unable to extract serverless cache name from ARN.',
      },
    ])('$testDescription', ({ serverlessCacheName, serverlessCacheArn, errorMessage }) => {
      expect(() => ServerlessCache.fromServerlessCacheAttributes(stack, 'ImportedCache', { serverlessCacheArn, serverlessCacheName })).toThrow(errorMessage);
    });
  });
});

