## Amazon Lambda Node.js Library
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This library provides constructs for Node.js Lambda functions.

To use this module, you will need to have Docker installed.

### Node.js Function
Define a `NodejsFunction`:

```ts
new lambda.NodejsFunction(this, 'my-handler');
```

By default, the construct will use the name of the defining file and the construct's id to look
up the entry file:
```
.
├── stack.ts # defines a 'NodejsFunction' with 'my-handler' as id
├── stack.my-handler.ts # exports a function named 'handler'
```

This file is used as "entry" for [esbuild](https://esbuild.github.io/). This means that your code is automatically transpiled and bundled whether it's written in JavaScript or TypeScript.

Alternatively, an entry file and handler can be specified:

```ts
new lambda.NodejsFunction(this, 'MyFunction', {
  entry: '/path/to/my/file.ts', // accepts .js, .jsx, .ts and .tsx files
  handler: 'myExportedFunc'
});
```

All other properties of `lambda.Function` are supported, see also the [AWS Lambda construct library](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda).

The `NodejsFunction` construct automatically [reuses existing connections](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html)
when working with the AWS SDK for JavaScript. Set the `awsSdkConnectionReuse` prop to `false` to disable it.

Use the `bundlingEnvironment` prop to define environments variables when esbuild runs:

```ts
new lambda.NodejsFunction(this, 'my-handler', {
  bundlingEnvironment: {
    NODE_ENV: 'production',
  },
});
```

Use the `buildArgs` prop to pass build arguments when building the bundling image:

```ts
new lambda.NodejsFunction(this, 'my-handler', {
  buildArgs: {
    HTTPS_PROXY: 'https://127.0.0.1:3001',
  },
});
```

Use the `bundlingDockerImage` prop to use a custom bundling image:

```ts
new lambda.NodejsFunction(this, 'my-handler', {
  bundlingDockerImage: dk.BundlingDockerImage.fromAsset('/path/to/Dockerfile'),
});
```

This image should have esbuild installed globally. If you plan to use `nodeModules` it
should also have `npm` or `yarn` depending on the lock file you're using.

Use the [default image provided by `@aws-cdk/aws-lambda-nodejs`](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-lambda-nodejs/lib/Dockerfile)
as a source of inspiration.

### Lock file
The `NodejsFunction` requires a dependencies lock file (`yarn.lock` or
`package-lock.json`). When bundling in a Docker container, the path containing this
lock file is used as the source (`/asset-input`) for the volume mounted in the
container.

By default, it will try to automatically determine your project lock file.
Alternatively, you can specify the `depsLockFilePath` prop manually. In this
case you need to ensure that this path includes `entry` and any module/dependencies
used by your function. Otherwise bundling will fail.

### Configuring esbuild
The `NodejsFunction` construct exposes some [esbuild](https://esbuild.github.io/) options via properties: `minify`, `sourceMaps` and `target`.

### Working with modules

#### Externals
By default, all node modules are bundled except for `aws-sdk`. This can be configured by specifying
the `externalModules` prop.

```ts
new lambda.NodejsFunction(this, 'my-handler', {
  externalModules: [
    'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
    'cool-module', // 'cool-module' is already available in a Layer
  ],
});
```

#### Install modules
By default, all node modules referenced in your Lambda code will be bundled by esbuild.
Use the `nodeModules` prop to specify a list of modules that should not be bundled
but instead included in the `node_modules` folder of the Lambda package. This is useful
when working with native dependencies or when esbuild fails to bundle a module.

```ts
new lambda.NodejsFunction(this, 'my-handler', {
  nodeModules: ['native-module', 'other-module']
});
```

The modules listed in `nodeModules` must be present in the `package.json`'s dependencies. The
same version will be used for installation. The lock file (`yarn.lock` or `package-lock.json`)
will be used along with the right installer (`yarn` or `npm`).

### Local bundling
If esbuild is available it will be used to bundle your code in your environment. Otherwise,
bundling will happen in a [Lambda compatible Docker container](https://hub.docker.com/r/amazon/aws-sam-cli-build-image-nodejs12.x).

For macOS the recommendend approach is to install esbuild as Docker volume performance is really poor.

esbuild can be installed with:

```bash
$ npm install --save-dev esbuild@0
```

OR

```bash
$ yarn add --dev esbuild@0
```

To force bundling in a Docker container, set the `forceDockerBundling` prop to `true`. This
is useful if your function relies on node modules that should be installed (`nodeModules` prop, see [above](#install-modules)) in a Lambda compatible environment. This is usually the
case with modules using native dependencies.
