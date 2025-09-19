# ElastiCache CDK Construct Library

This module has constructs for [Amazon ElastiCache](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html).

* The `ServerlessCache` construct facilitates the creation and management of serverless cache.
* The `User` and `UserGroup` constructs facilitate the creation and management of users for the cache.

## Serverless Cache

Amazon ElastiCache Serverless is a serverless option that automatically scales cache capacity based on application traffic patterns. You can create a serverless cache using the `ServerlessCache` construct:

```ts
const vpc = new ec2.Vpc(this, 'VPC');

const cache = new elasticache.ServerlessCache(this, 'MyServerlessCache', {
  vpc,
});
```

### Connecting to serverless cache

To control who can access the serverless cache by the security groups, use the `.connections` attribute.

The serverless cache has a default port `6379`.

This example allows an EC2 instance to connect to the serverless cache:

```ts
declare const serverlessCache: elasticache.ServerlessCache;
declare const instance: ec2.Instance;

// allow the EC2 instance to connect to serverless cache on default port 6379
serverlessCache.connections.allowDefaultPortFrom(instance);
```

### Cache usage limits

You can choose to configure a maximum usage on both cache data storage and ECPU/second for your cache to control cache costs.
Doing so will ensure that your cache usage never exceeds the configured maximum.

For more infomation, see [Setting scaling limits to manage costs](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Scaling.html#Pre-Scaling).

```ts
declare const vpc: ec2.Vpc;

const serverlessCache = new elasticache.ServerlessCache(this, 'ServerlessCache', {
  engine: elasticache.CacheEngine.VALKEY_DEFAULT,
  vpc,
  cacheUsageLimits: {
    // cache data storage limits (GB)
    dataStorageMinimumSize: Size.gibibytes(2), // minimum: 1GB
    dataStorageMaximumSize: Size.gibibytes(3), // maximum: 5000GB
    // rate limits (ECPU/second)
    requestRateLimitMinimum: 1000, // minimum: 1000
    requestRateLimitMaximum: 10000, // maximum: 15000000
  },
});
```

### Backups and restore

You can enable automatic backups for serverless cache.
When automatic backups are enabled, ElastiCache creates a backup of the cache on a daily basis.

Also you can set the backup window for any time when it's most convenient.
If you don't specify a backup window, ElastiCache assigns one automatically.

For more information, see [Scheduling automatic backups](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/backups-automatic.html).

To enable automatic backups, set the `backupRetentionLimit` property. You can also specify the snapshot creation time by setting `backupTime` property:

```ts
declare const vpc: ec2.Vpc;

const serverlessCache = new elasticache.ServerlessCache(this, 'ServerlessCache', {
  backup: {
    // enable automatic backups and set the retention period to 6 days
    backupRetentionLimit: 6,
    // set the backup window to 12:00 AM UTC
    backupTime: events.Schedule.cron({
      hour: '5',
      minute: '0',
    }),
  },
  vpc,
});
```

You can create a final backup by setting `backupNameBeforeDeletion` property.

```ts
declare const vpc: ec2.Vpc;

const serverlessCache = new elasticache.ServerlessCache(this, 'ServerlessCache', {
  engine: elasticache.CacheEngine.VALKEY_DEFAULT,
  backup: {
    // set a backup name before deleting a cache
    backupNameBeforeDeletion: "my-final-backup-name",
  },
  vpc,
});
```

You can restore from backups by setting snapshot ARNs to `backupArnsToRestore` property:

```ts
declare const vpc: ec2.Vpc;

const serverlessCache = new elasticache.ServerlessCache(this, 'ServerlessCache', {
  engine: elasticache.CacheEngine.VALKEY_DEFAULT,
  backup: {
    // set the backup(s) to restore
    backupArnsToRestore: ['arn:aws:elasticache:us-east-1:123456789012:serverlesscachesnapshot:my-final-backup-name'],
  },
  vpc,
});
```

### Customer Managed Key for encryption at rest

ElastiCache supports symmetric Customer Managed key (CMK) for encryption at rest.

For more information, see [Using customer managed keys from AWS KMS](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/at-rest-encryption.html#using-customer-managed-keys-for-elasticache-security).

To use CMK, set your CMK to the `kmsKey` property:

```ts
import { Key } from 'aws-cdk-lib/aws-kms';

declare const kmsKey: Key;
declare const vpc: ec2.Vpc;

const serverlessCache = new elasticache.ServerlessCache(this, 'ServerlessCache', {
  engine: elasticache.CacheEngine.VALKEY_DEFAULT,
  serverlessCacheName: 'my-serverless-cache',
  vpc,
  // set Customer Managed Key
  kmsKey,
});
```

### Metrics

You can monitor your serverless cache using CloudWatch Metrics via the `metric` method.

For more information about serverless cache metrics, see [Serverless metrics and events for Valkey and Redis OSS](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/serverless-metrics-events-redis.html) and [Serverless metrics and events for Memcached](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/serverless-metrics-events.memcached.html).

```ts
declare const serverlessCache: elasticache.ServerlessCache;

// The 5 minutes sum of the total number of successful read-only key lookups in the cache over 5 minutes.
const cacheHits = serverlessCache.metricCacheHitCount();

// The 5 minutes average of the total number of bytes used by the data stored in your cache over 5 minutes.
const bytesUsedForCache = serverlessCache.metricDataStored();

// The 5 minutes average of the total number of ElastiCacheProcessingUnits (ECPUs) consumed by the requests executed on your cache.
const elastiCacheProcessingUnits = serverlessCache.metricECPUsConsumed();

// Create an alarm for ECPUs.
elastiCacheProcessingUnits.createAlarm(this, 'ElastiCacheProcessingUnitsAlarm', {
  threshold: 50,
  evaluationPeriods: 1,
});
```

### Import an existing serverless cache

To import an existing ServerlessCache, use the `ServerlessCache.fromServerlessCacheAttributes` method:

```ts
declare const securityGroup: ec2.SecurityGroup;

const importedServerlessCache = elasticache.ServerlessCache.fromServerlessCacheAttributes(this, 'ImportedServerlessCache', {
  serverlessCacheName: 'my-serverless-cache',
  securityGroups: [securityGroup],
});
```

## User and User Group

Setup required properties and create:

```ts
const newDefaultUser = new elasticache.NoPasswordUser(this, 'NoPasswordUser', {
  userId: 'default',
  accessControl: elasticache.AccessControl.fromAccessString("on ~* +@all"),
})

const userGroup = new elasticache.UserGroup(this, 'UserGroup', {
  users: [newDefaultUser],
});
```

### RBAC

In Valkey 7.2 and onward and Redis OSS 6.0 onward you can use a feature called Role-Based Access Control (RBAC). RBAC is also the only way to control access to serverless caches.

RBAC enables you to control cache access through user groups. These user groups are designed as a way to organize access to caches.

For more information, see [Role-Based Access Control (RBAC)](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Clusters.RBAC.html).

To enable RBAC for ElastiCache with Valkey or Redis OSS, you take the following steps:

* Create users.
* Create a user group and add users to the user group.
* Assign the user group to a cache.

### Create users

First, you need to create users by using `IamUser`, `PasswordUser` or `NoPasswordRequiredUser` construct.

With RBAC, you create users and assign them specific permissions by using `accessString` property.

For more information, see [Specifying Permissions Using an Access String](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Clusters.RBAC.html#Access-string).

You can create an IAM-enabled user by using `IamUser` construct:

```ts
const user = new elasticache.IamUser(this, 'User', {
  // set user id
  userId: 'my-user',

  // set username
  userName: 'my-user',

  // set access string
  accessControl: elasticache.AccessControl.fromAccessString("on ~* +@all"),
});
```

> NOTE: You can't set username in `IamUser` construct because IAM-enabled users must have matching user id and username. For more information, see [Limitations](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth-iam.html). The construct automatically sets the username to be the same as the user id.

If you want to create a password authenticated user, use `PasswordUser` construct:

```ts
const user = new elasticache.PasswordUser(this, 'User', {
  // set user id
  userId: 'my-user-id',

  // set access string
  accessControl: elasticache.AccessControl.fromAccessString("on ~* +@all"),

  // set username
  userName: 'my-user-name',

  // set up to two passwords
  passwords: [
    SecretValue.unsafePlainText('adminUserPassword123'),
    SecretValue.unsafePlainText('anotherAdminUserPassword123'),
  ],
});
```

You can also create a no password required user by using `NoPasswordRequiredUser` construct:

```ts
const user = new elasticache.NoPasswordUser(this, 'User', {
  // set user id
  userId: 'my-user-id',

  // set access string
  accessControl: elasticache.AccessControl.fromAccessString("on ~* +@all"),

  // set username
  userName: 'my-user-name',
});
```

### Default user

ElastiCache automatically creates a default user with both a user ID and username set to `default`. This default user cannot be modified or deleted. The user is created as a no password authentication user.

This user is intended for compatibility with the default behavior of previous Redis OSS versions and has an access string that permits it to call all commands and access all keys.

To use this automatically created default user in CDK, you can import it using `NoPasswordRequiredUser.fromUserAttributes` method. For more information on import methods, see the [Import an existing user and user group](#import-an-existing-user-and-user-group) section.

To add proper access control to a cache, replace the default user with a new one that is either disabled by setting the `accessString` to `off -@all` or secured with a strong password.

To change the default user, create a new default user with the username set to `default`. You can then swap it with the original default user.

For more information, see [Applying RBAC to a Cache for ElastiCache with Valkey or Redis OSS](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Clusters.RBAC.html#rbac-using).

If you want to create a new default user, `userName` must be `default` and `userId` must not be `default` by using `NoPasswordRequiredUser` or `PasswordUser`:

```ts
// use the original `default` user by using import method
const defaultUser = elasticache.NoPasswordUser.fromUserAttributes(this, 'DefaultUser', {
  // userId and userName must be 'default'
  userId: 'default',
});

// create a new default user
const newDefaultUser = new elasticache.NoPasswordUser(this, 'NewDefaultUser', {
  // new default user id must not be 'default'
  userId: 'new-default',
  // default username must be 'default'
  userName: 'default',
  // set access string
  accessControl: elasticache.AccessControl.fromAccessString("on ~* +@all"),
});
```

> NOTE: You can't create a new default user using `IamUser` because an IAM-enabled user's username and user ID cannot be different.

### Add users to the user group

Next, use the `UserGroup` construct to create a user group and add users to it.
Ensure that you include either the original default user or a new default user:

```ts
declare const newDefaultUser: elasticache.IUserBase;
declare const user: elasticache.IUserBase;
declare const anotherUser: elasticache.IUserBase;

const userGroup = new elasticache.UserGroup(this, 'UserGroup', {
  // add users including default user
  users: [newDefaultUser, user],
});

// you can also add a user by using addUser method
userGroup.addUser(anotherUser);
```

### Assign user group

Finally, assign a user group to cache:

```ts
declare const vpc: ec2.Vpc;
declare const userGroup: elasticache.UserGroup;

const serverlessCache = new elasticache.ServerlessCache(this, 'ServerlessCache', {
  engine: elasticache.CacheEngine.VALKEY_DEFAULT,
  serverlessCacheName: 'my-serverless-cache',
  vpc,
  // assign User Group
  userGroup,
});

```

### Grant permissions to IAM-enabled users

If you create IAM-enabled users, `"elasticache:Connect"` action must be allowed for the users and cache.

> NOTE: You don't need grant permissions to no password required users or password authentication users.

For more information, see [Authenticating with IAM](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth-iam.html).

To grant permissions, you can use the `grantConnect` method in `IamUser` and `ServerlessCache` constructs:

```ts
declare const user: elasticache.IamUser;
declare const serverlessCache: elasticache.ServerlessCache;
declare const role: iam.Role;

// grant "elasticache:Connect" action permissions to role
user.grantConnect(role);
serverlessCache.grantConnect(role);
```

### Import an existing user and user group

You can import an existing user and user group by using import methods:

```ts
const stack = new Stack();

const importedIamUser = elasticache.IamUser.fromUserId(this, 'ImportedIamUser', 'my-iam-user-id');

const importedPasswordUser = elasticache.PasswordUser.fromUserAttributes(stack, 'ImportedPasswordUser', {
  userId: 'my-password-user-id',
});

const importedNoPasswordRequiredUser = elasticache.NoPasswordUser.fromUserAttributes(stack, 'ImportedNoPasswordUser', {
  userId: 'my-no-password-user-id',
});

const importedUserGroup = elasticache.UserGroup.fromUserGroupAttributes(this, 'ImportedUserGroup', {
  userGroupName: 'my-user-group-id'
});
```
