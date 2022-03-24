# cdk-cli-wrapper
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

CDK CLI Wrapper Library.

Internal only for now.

## Overview

This package provides a library which wraps the CDK CLI, allowing you to interact with the CLI programmatically.

Currently this package provides wrappers for:

- `cdk deploy`
- `cdk synth`
- `cdk destroy`
- `cdk list`

## Usage

First create a new `CdkCliWrapper` with the directory in which you want to execute commands,
and optionally any environment variables that you want to include in the execution environment.

```ts
new CdkCliWrapper({
  directory: '/path/to/project',
  env: {
    KEY: 'value',
  },
});
```

### deploy

```ts
const cdk = new CdkCliWrapper({
  directory: '/project/path',
});

cdk.deploy({
  app: 'node bin/my-app.js',
  stacks: ['my-test-stack'],
});
```

### synth

```ts
const cdk = new CdkCliWrapper({
  directory: '/project/path',
});

cdk.synth({
  app: 'node bin/my-app.js',
  stacks: ['my-test-stack'],
});
```

### destroy

```ts
const cdk = new CdkCliWrapper({
  directory: '/project/path',
});

cdk.destroy({
  app: 'node bin/my-app.js',
  stacks: ['my-test-stack'],
});
```

### list

```ts
const cdk = new CdkCliWrapper({
  directory: '/project/path',
});

cdk.list({
  app: 'node bin/my-app.js',
  stacks: ['*'],
});
```
