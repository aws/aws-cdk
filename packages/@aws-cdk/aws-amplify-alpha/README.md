# AWS Amplify Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

The AWS Amplify Console provides a Git-based workflow for deploying and hosting fullstack serverless web applications. A fullstack serverless app consists of a backend built with cloud resources such as GraphQL or REST APIs, file and data storage, and a frontend built with single page application frameworks such as React, Angular, Vue, or Gatsby.

## Setting up an app with branches, custom rules and a domain

To set up an Amplify Console app, define an `App`:

```ts
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const amplifyApp = new amplify.App(this, 'MyApp', {
  sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
    owner: '<user>',
    repository: '<repo>',
    oauthToken: SecretValue.secretsManager('my-github-token'),
  }),
  buildSpec: codebuild.BuildSpec.fromObjectToYaml({
    // Alternatively add a `amplify.yml` to the repo
    version: '1.0',
    frontend: {
      phases: {
        preBuild: {
          commands: [
            'yarn',
          ],
        },
        build: {
          commands: [
            'yarn build',
          ],
        },
      },
      artifacts: {
        baseDirectory: 'public',
        files:
        - '**/*',
      },
    },
  }),
});
```

To connect your `App` to GitLab, use the `GitLabSourceCodeProvider`:

```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  sourceCodeProvider: new amplify.GitLabSourceCodeProvider({
    owner: '<user>',
    repository: '<repo>',
    oauthToken: SecretValue.secretsManager('my-gitlab-token'),
  }),
});
```

To connect your `App` to CodeCommit, use the `CodeCommitSourceCodeProvider`:

```ts
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

const repository = new codecommit.Repository(this, 'Repo', {
  repositoryName: 'my-repo',
});

const amplifyApp = new amplify.App(this, 'App', {
  sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({ repository }),
});
```

The IAM role associated with the `App` will automatically be granted the permission
to pull the CodeCommit repository.

Add branches:

```ts
declare const amplifyApp: amplify.App;

const main = amplifyApp.addBranch('main'); // `id` will be used as repo branch name
const dev = amplifyApp.addBranch('dev', {
  performanceMode: true, // optional, enables performance mode
});
dev.addEnvironment('STAGE', 'dev');
```

Auto build and pull request preview are enabled by default.

Add custom rules for redirection:

```ts
import { CustomRule } from '@aws-cdk/aws-amplify-alpha';

declare const amplifyApp: amplify.App;
amplifyApp.addCustomRule(new CustomRule({
  source: '/docs/specific-filename.html',
  target: '/documents/different-filename.html',
  status: amplify.RedirectStatus.TEMPORARY_REDIRECT,
}));
```

When working with a single page application (SPA), use the
`CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT` to set up a 200
rewrite for all files to `index.html` except for the following
file extensions: css, gif, ico, jpg, js, png, txt, svg, woff,
ttf, map, json, webmanifest.

```ts
declare const mySinglePageApp: amplify.App;

mySinglePageApp.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);
```

Add a domain and map sub domains to branches:

```ts
declare const amplifyApp: amplify.App;
declare const main: amplify.Branch;
declare const dev: amplify.Branch;

const domain = amplifyApp.addDomain('example.com', {
  enableAutoSubdomain: true, // in case subdomains should be auto registered for branches
  autoSubdomainCreationPatterns: ['*', 'pr*'], // regex for branches that should auto register subdomains
});
domain.mapRoot(main); // map main branch to domain root
domain.mapSubDomain(main, 'www');
domain.mapSubDomain(dev); // sub domain prefix defaults to branch name
```

To specify a custom certificate for your custom domain use the `customCertificate` property:

```ts
declare const customCertificate: acm.Certificate;
declare const amplifyApp: amplify.App;

const domain = amplifyApp.addDomain('example.com', {
  customCertificate, // set your custom certificate
});
```

## Restricting access

Password protect the app with basic auth by specifying the `basicAuth` prop.

Use `BasicAuth.fromCredentials` when referencing an existing secret:

```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
    owner: '<user>',
    repository: '<repo>',
    oauthToken: SecretValue.secretsManager('my-github-token'),
  }),
  basicAuth: amplify.BasicAuth.fromCredentials('username', SecretValue.secretsManager('my-github-token')),
});
```

Use `BasicAuth.fromGeneratedPassword` to generate a password in Secrets Manager:

```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
    owner: '<user>',
    repository: '<repo>',
    oauthToken: SecretValue.secretsManager('my-github-token'),
  }),
  basicAuth: amplify.BasicAuth.fromGeneratedPassword('username'),
});
```

Basic auth can be added to specific branches:

```ts
declare const amplifyApp: amplify.App;
amplifyApp.addBranch('feature/next', {
  basicAuth: amplify.BasicAuth.fromGeneratedPassword('username'),
});
```

## Automatically creating and deleting branches

Use the `autoBranchCreation` and `autoBranchDeletion` props to control creation/deletion
of branches:

```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
    owner: '<user>',
    repository: '<repo>',
    oauthToken: SecretValue.secretsManager('my-github-token'),
  }),
  autoBranchCreation: { // Automatically connect branches that match a pattern set
    patterns: ['feature/*', 'test/*'],
  },
  autoBranchDeletion: true, // Automatically disconnect a branch when you delete a branch from your repository
});
```

## Adding custom response headers

Use the `customResponseHeaders` prop to configure custom response headers for an Amplify app:

```ts
const amplifyApp = new amplify.App(this, 'App', {
  sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
    owner: '<user>',
    repository: '<repo>',
    oauthToken: SecretValue.secretsManager('my-github-token'),
  }),
  customResponseHeaders: [
    {
      pattern: '*.json',
      headers: {
        'custom-header-name-1': 'custom-header-value-1',
        'custom-header-name-2': 'custom-header-value-2',
      },
    },
    {
      pattern: '/path/*',
      headers: {
        'custom-header-name-1': 'custom-header-value-2',
      },
    },
  ],
});
```

## Configure server side rendering when hosting app

Setting the `platform` field on the Amplify `App` construct can be used to control whether the app will host only static assets or server side rendered assets in addition to static. By default, the value is set to `WEB` (static only), however, server side rendering can be turned on by setting to `WEB_COMPUTE` as follows:

```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  platform: amplify.Platform.WEB_COMPUTE,
});
```

## Compute role

This integration, enables you to assign an IAM role to the Amplify SSR Compute service to allow your server-side rendered (SSR) application to securely access specific AWS resources based on the role's permissions.

For example, you can allow your app's SSR compute functions to securely access other AWS services or resources, such as Amazon Bedrock or an Amazon S3 bucket, based on the permissions defined in the assigned IAM role.

For more information, see [Adding an SSR Compute role to allow access to AWS resources](https://docs.aws.amazon.com/amplify/latest/userguide/amplify-SSR-compute-role.html).

By default, a new role is created when `platform` is `Platform.WEB_COMPUTE` or `Platform.WEB_DYNAMIC`.
If you want to assign an IAM role to the APP, set `compute` to the role:

```ts
declare const computeRole: iam.Role;

const amplifyApp = new amplify.App(this, 'MyApp', {
  platform: amplify.Platform.WEB_COMPUTE,
  computeRole,
});
```

## Cache Config

Amplify uses Amazon CloudFront to manage the caching configuration for your hosted applications. A cache configuration is applied to each app to optimize for the best performance.

Setting the `cacheConfigType` field on the Amplify `App` construct can be used to control cache configuration. By default, the value is set to `AMPLIFY_MANAGED`. If you want to exclude all cookies from the cache key, set `AMPLIFY_MANAGED_NO_COOKIES`.

For more information, see [Managing the cache configuration for an app](https://docs.aws.amazon.com/amplify/latest/userguide/caching.html).

```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  cacheConfigType: amplify.CacheConfigType.AMPLIFY_MANAGED_NO_COOKIES,
});
```

## Deploying Assets

`sourceCodeProvider` is optional; when this is not specified the Amplify app can be deployed to using `.zip` packages. The `asset` property can be used to deploy S3 assets to Amplify as part of the CDK:

```ts
import * as assets from 'aws-cdk-lib/aws-s3-assets';

declare const asset: assets.Asset;
declare const amplifyApp: amplify.App;
const branch = amplifyApp.addBranch("dev", { asset: asset });
```
