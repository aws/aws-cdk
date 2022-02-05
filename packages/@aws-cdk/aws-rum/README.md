# AWS::RUM Construct Library
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
- [Define AppMonitor](#define-appmonitor)
- [Authorizer](#authorizer)
  - [Use an existing Amazon Cognito identity pool](#use-an-existing-amazon-cognito-identity-pool)
  - [Use Third-party provider](#use-third-party-provider)
- [Code Snippet](#code-snippet)
  - [RUM web client configuration](#rum-web-client-configuration)
  - [With s3 deployment](#with-s3-deployment)

## Introduction

CloudWatch RUM is monitoring tool that can perform real user monitoring to collect and view client-side data about your web application performance from actual user sessions in near real time.

This module supports the ability for users to create CloudWatch RUM and retrieve code snippets on CloudFormation.

## Define AppMonitor

Define `AppMonitor` to your stack:

```ts
import * as rum from '@aws-cdk/aws-rum';

const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor'
});
```

## Authorizer

By default, AppMonitor creates a new Amazon Cognito identity pool and uses it to authenticate the put event.

### Use an existing Amazon Cognito identity pool

If you want to use an existing Amazon Cognito identity pool, you need to pass a `CognitoIdentityPoolAuthorizer` instance.

```ts
const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor',
  authorizer: new rum.CognitoIdentityPoolAuthorizer({
    identityPoolId: 'test-user-pool',
    unauthenticatedRole: myRole,
  }),
});
```

### Use Third-party provider

You can also use a third party authenticator as in `CognitoIdentityPoolAuthorizer`.

```ts
const appMonitor = new rum.AppMonitor(this, 'AppMonitor', {
  domain: 'amazon.com',
  appMonitorName: 'my-app-monitor',
  authorizer: new rum.ThirdPartyAuthorizer({
    role: myRole,
  }),
});
```

## Code Snippet

AppMonitor generates a code snippet that looks like to create on the management console. Note, however, that unlike the management console, the code snippets do not have `<script>` tags because the CDK expects them to be automatically embedded in the application.

```ts
// (function(n,i,v,r,s,c,x,z){...})
const codeSnippet = appMonitor.generateCodeSnippet();
```

### RUM web client configuration

If you want to use [RUM web client configuration](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md) (e.g cookieAttributes), you can pass options to `generateCodeSnippet` argument.

```ts
const codeSnippet = appMonitor.generateCodeSnippet({
  pageIdFormat: rum.PageIdFormat.HASH,
});
```

### With s3 deployment

By using S3 Deployment, you can automate embeded to your application.

```ts
const html = s3deploy.Source.data('index.html', `<html>
  <head>
    <script src="/rum.js" async="true"></script>
  </head>
  <body>Hello RUM</body>
</html>`);
const codeSnippet = appMonitor.generateCodeSnippet();
const rumJS = s3deploy.Source.data('rum.js', codeSnippet);

new s3deploy.BucketDeployment(this, 'BucketDeployment', {
  sources: [html, rumJS],
  destinationBucket: myWebSiteBucket
});
```
