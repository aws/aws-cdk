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

## Table of Contents

- [Introduction](#introduction)
  - [App Monitor](#appmonitor)
  - [Authorizer](#authorizer)
    - [Existing Cognito ID pool](#use-an-existing-amazon-cognito-identity-pool)
    - [Third-party provider](#use-third-party-provider)
  - [Code Snippet](#code-snippet)
    - [RUM web client configuration](#rum-web-client-configuration)
    - [With s3 deployment](#with-s3-deployment)
  - [Importing App Monigor](#importing-app-monitor)

## Introduction

CloudWatch RUM is monitoring tool that can perform real user monitoring to collect and view client-side data about your web application performance from actual user sessions in near real time.

This module supports the ability for users to create CloudWatch RUM and retrieve code snippets on CloudFormation.

## App Monitor

Define `AppMonitor` to your stack:

```ts
import * as rum from '@aws-cdk/aws-rum';

const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor'
});
```

### Authorizer

By default, AppMonitor creates a new Amazon Cognito identity pool and uses it to authenticate the put event.

#### Use an existing Amazon Cognito identity pool

If you want to use an existing Amazon Cognito identity pool, you need to pass a `CognitoIdentityPoolAuthorizer` instance.

```ts
import * as rum from '@aws-cdk/aws-rum';
import * as iam from '@aws-cdk/aws-iam';

declare const myRole: iam.IRole;

const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor',
  authorizer: new rum.CognitoIdentityPoolAuthorizer({
    identityPoolId: 'my-user-pool-id',
    unauthenticatedRole: myRole,
  }),
});
```

#### Use Third-party provider

You can also use a third party authenticator as in `CognitoIdentityPoolAuthorizer`.

```ts
import * as rum from '@aws-cdk/aws-rum';
import * as iam from '@aws-cdk/aws-iam';

declare const myRole: iam.IRole;

const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor',
  authorizer: new rum.ThirdPartyAuthorizer({
    role: myRole,
  }),
});
```

### Code Snippet

AppMonitor generates a code snippet that looks like to create on the management console. Note, however, that unlike the management console, the code snippets do not have `<script>` tags because the CDK expects them to be automatically embedded in the application.

```ts
import * as rum from '@aws-cdk/aws-rum';

const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor'
});

// (function(n,i,v,r,s,c,x,z){...})
const codeSnippet = appMonitor.generateCodeSnippet('CodeSnippet');
```

#### RUM web client configuration

If you want to use [RUM web client configuration](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md) (e.g cookieAttributes), you can pass options to `generateCodeSnippet` argument.

```ts
import * as rum from '@aws-cdk/aws-rum';

const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor'
});

const codeSnippet = appMonitor.generateCodeSnippet('CodeSnippet', {
  pageIdFormat: rum.PageIdFormat.HASH,
});
```

#### With s3 deployment

By using S3 Deployment, you can automate embeded to your application.
This example is shortest way that deploy site using RUM.

```ts
import * as rum from '@aws-cdk/aws-rum';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';

const webSiteBucket = new s3.Bucket(this, 'WebSiteBucket', {
  publicReadAccess: true,
  websiteIndexDocument: 'index.html'
});
const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor'
});
const codeSnippet = appMonitor.generateCodeSnippet('CodeSnippet');
const rumJs = s3deploy.Source.data('rum.js', codeSnippet);

const html = s3deploy.Source.data('index.html', `<html>
  <head>
    <script src="/rum.js" async="true"></script>
  </head>
  <body>Hello RUM</body>
</html>`);

new s3deploy.BucketDeployment(this, 'BucketDeployment', {
  sources: [html, rumJs],
  destinationBucket: webSiteBucket
});
```

### Importing App Monitor

AppMonitor construct can import existing app monitor, just like any other L2 construct.

```ts
import * as rum from '@aws-cdk/aws-rum';

const appMonitor = rum.AppMonitor.fromAppMonitorName(this, 'AppMonitor', 'AppMonitorName');
```

or

```ts
import * as rum from '@aws-cdk/aws-rum';

const appMonitor = rum.AppMonitor.fromAppMonitorArn(this, 'AppMonitor', 'arn:aws:rum:some-region:1111111:appmonitor/my-app-monitor');
```

Of course, the imported app monitors can generate code snippets.

```ts
import * as rum from '@aws-cdk/aws-rum';

const appMonitor = rum.AppMonitor.fromAppMonitorName(this, 'AppMonitor', 'AppMonitorName');
const codeSnippet = appMonitor.generateCodeSnippet('CodeSnippet');
```
