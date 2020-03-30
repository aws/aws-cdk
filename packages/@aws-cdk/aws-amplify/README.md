## AWS Amplify Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module.**
>
> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib))
> are auto-generated from CloudFormation. They are stable and safe to use.
>
> However, all other classes, i.e., higher level constructs, are under active development and subject to non-backward
> compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

The AWS Amplify Console provides a Git-based workflow for deploying and hosting fullstack serverless web applications. A fullstack serverless app consists of a backend built with cloud resources such as GraphQL or REST APIs, file and data storage, and a frontend built with single page application frameworks such as React, Angular, Vue, or Gatsby.

### Setting up an app with branches, custom rules and a domain
To set up an Amplify Console app, define an `App`:
```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import amplify = require('@aws-cdk/aws-amplify');
import cdk = require('@aws-cdk/core');

const amplifyApp = new amplify.App(this, 'MyApp', {
  sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
    owner: '<user>',
    repository: '<repo>',
    oauthToken: cdk.SecretValue.secretsManager('my-github-token')
  }),
  buildSpec: codebuild.BuildSpec.fromObject({ // Alternatively add a `amplify.yml` to the repo
    version: '1.0',
    frontend: {
      phases: {
        preBuild: {
          commands: [
            'yarn'
          ]
        },
        build: {
          commands: [
            'yarn build'
          ]
        }
      },
      artifacts: {
        baseDirectory: 'public',
        files: '**/*'
      }
    }
  })
});
```

To connect your `App` to CodeCommit, use the `CodeCommitSourceCodeProvider`:
```ts
const repository = new codecommit.Repository(this, 'Repo', {
  repositoryName: 'my-repo'
});

const amplifyApp = new amplify.App(this, 'App', {
  sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({ repository })
});
```

The IAM role associated with the `App` will automatically be granted the permission
to pull the CodeCommit repository.

Add branches:
```ts
const master = amplifyApp.addBranch('master'); // `id` will be used as repo branch name
const dev = amplifyApp.addBranch('dev');
dev.addEnvironment('STAGE', 'dev');
```
Auto build and pull request preview are enabled by default.

Add custom rules for redirection:
```ts
amplifyApp.addCustomRule({
  source: '/docs/specific-filename.html',
  target: '/documents/different-filename.html',
  status: amplify.RedirectStatus.TEMPORARY_REDIRECT
});
```

Add a domain and map sub domains to branches:
```ts
const domain = amplifyApp.addDomain('example.com');
domain.mapSubDomain(master, 'www');
domain.mapSubDomain(dev); // sub domain prefix defaults to branch name
```

### Restricting access
Password protect the app with basic auth by specifying the `basicAuth` prop.

Use `BasicAuth.fromCredentials` when referencing an existing secret:
```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  repository: 'https://github.com/<user>/<repo>',
  oauthToken: cdk.SecretValue.secretsManager('my-github-token'),
  basicAuth: amplify.BasicAuth.fromCredentials('username', cdk.SecretValue.secretsManager('my-github-token'))
});
```

Use `BasicAuth.fromGeneratedPassword` to generate a password in Secrets Manager:
```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  repository: 'https://github.com/<user>/<repo>',
  oauthToken: cdk.SecretValue.secretsManager('my-github-token'),
  basicAuth: amplify.BasicAuth.fromGeneratedPassword('username')
});
```

Basic auth can be added to specific branches:
```ts
app.addBranch('feature/next', {
  basicAuth: amplify.BasicAuth.fromGeneratedPassword('username')
});
```

### Automatically creating branches
Use the `autoBranchCreation` prop to automatically create new branches:
```ts
const amplifyApp = new amplify.App(this, 'MyApp', {
  repository: 'https://github.com/<user>/<repo>',
  oauthToken: cdk.SecretValue.secretsManager('my-github-token'),
  autoBranchCreation: {
    patterns: ['feature/*', 'test/*']
  }
});
```
