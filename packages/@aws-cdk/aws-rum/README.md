# Amazon CloudWatch RUM Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

# Amazon CloudWatch RUM Construct Library

## Table of Contents

- [Introduction](#introduction)
  - [App Monitor](#appmonitor)
  - [Authorizer](#authorizer)
    - [Create a New Cognito ID pool](#use-an-existing-amazon-cognito-identity-pool)
    - [Existing Cognito ID pool](#use-an-existing-amazon-cognito-identity-pool)
    - [Third-party provider](#use-third-party-provider)

## Introduction

With CloudWatch RUM, you can perform real user monitoring to collect and view client-side data about your web application performance
from actual user sessions in near real time. The data that you can visualize and analyze includes page load times,
client-side errors, and user behavior. When you view this data, you can see it all aggregated together and also see breakdowns
by the browsers and devices that your customers use.

To use RUM, you create an app monitor and provide some information. RUM generates a JavaScript snippet for you to paste into your application.
The snippet pulls in the RUM web client code. The RUM web client captures data from a percentage of your application's user sessions,
which is displayed in a pre-built dashboard. You can specify what percentage of user sessions to gather data from.  
For more information, see [Amazon Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html).

This module supports the ability for users to create CloudWatch RUM and retrieve code snippets.

## App Monitor

Define an `AppMonitor` in your stack:

```ts
const appMonitor = new AppMonitor(this, 'AppMonitor', {
  domain: 'my-website.com'
});
```

### Authorizer

To use CloudWatch RUM, your application must have authorization.

You have three options to set up authorization:

- Let CloudWatch RUM create a new Amazon Cognito identity pool for the application. This method requires the least effort to set up. It's the default option.
The identity pool will contain an unauthenticated identity.
This allows the CloudWatch RUM web client to send data to CloudWatch RUM without authenticating the user of the application.
The Amazon Cognito identity pool has an attached IAM role.
The Amazon Cognito unauthenticated identity allows the web client to assume the IAM role that is authorized to send data to CloudWatch RUM.
- Use an existing Amazon Cognito identity pool. In this case, you must pass the IAM role as well that is attached to the identity pool.
- Use authentication from an existing identity provider that you have already set up.
In this case, you must get credentials from the identity provider and your application must forward these credentials to the RUM web client.

#### Creates a new Amazon Cognito identity pool

By default, AppMonitor creates a new Amazon Cognito identity pool.
This is the simplest option to set up, and if you choose this no further setup steps are required.
You must have administrative permissions to use this option. For more information,
see [IAM policies to use CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-permissions.html).

```ts
const appMonitor = new AppMonitor(this, 'AppMonitor', {
  domain: 'my-website.com'
});
```

#### Use an existing Amazon Cognito identity pool

If you want to use an existing Amazon Cognito identity pool,
you need to pass the `identityPool` and the `role` that associated with your identity pool.

```ts
import * as identitypool from '@aws-cdk/aws-cognito-identitypool';
import * as iam from '@aws-cdk/aws-iam';

const identityPool = identitypool.IdentityPool.fromIdentityPoolId(this, 'IdentityPool', 'us-east-1:dj2823ryiwuhef937');
const role = iam.Role.fromRoleName(this, 'Role', 'UnauthenticatedRole');
const appMonitor = new AppMonitor(this, 'AppMonitor', {
  domain: 'my-website.com',
  identityPool,
  role
});
```

#### Use Third-party provider

If you want to use third-party authenticator, you can only pass a `role` that associated with your identity pool.

```ts
import * as iam from '@aws-cdk/aws-iam';

declare const role: iam.IRole;
const appMonitor = new AppMonitor(this, 'AppMonitor', {
  domain: 'my-website.com',
  role
});
```

Add the following to your application to have it pass the credentials from your provider to CloudWatch RUM.
Insert the line so that it runs after a user has signed in to your application and the application has received the credentials to use to access AWS.

```ts
cwr('setAwsCredentials', {/* Credentials or CredentialProvider */});
```

For more information, see [Amazon Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-get-started-authorization.html#CloudWatch-RUM-get-started-authorization-thirdparty) for to use Third-party provider.
