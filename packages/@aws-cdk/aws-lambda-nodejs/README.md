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

This file is used as "entry" for [Parcel](https://parceljs.org/). This means that your code is
automatically transpiled and bundled whether it's written in JavaScript or TypeScript.

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

Use the `parcelEnvironment` prop to define environments variables when Parcel runs:

```ts
new lambda.NodejsFunction(this, 'my-handler', {
  parcelEnvironment: {
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

This image should have Parcel installed at `/`. If you plan to use `nodeModules` it
should also have `npm` or `yarn` depending on the lock file you're using.

Use the [default image provided by `@aws-cdk/aws-lambda-nodejs`](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-lambda-nodejs/parcel/Dockerfile)
as a source of inspiration.

### Project root
The `NodejsFunction` tries to automatically determine your project root, that is
the root of your node project. This is usually where the top level `node_modules`
folder of your project is located. When bundling in a Docker container, the
project root is used as the source (`/asset-input`) for the volume mounted in
the container.

The following folders are considered by walking up parent folders starting from
the current working directory (order matters):
* the folder containing your `.git` folder
* the folder containing a `yarn.lock` file
* the folder containing a `package-lock.json` file
* the folder containing a `package.json` file

Alternatively, you can specify the `projectRoot` prop manually. In this case you
need to ensure that this path includes `entry` and any module/dependencies used
by your function. Otherwise bundling will fail.

### Configuring Parcel
The `NodejsFunction` construct exposes some [Parcel](https://parceljs.org/) options via properties: `minify`, `sourceMaps` and `cacheDir`.

Parcel transpiles your code (every internal module) with [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) and uses the
runtime version of your Lambda function as target.

Configuring Babel with Parcel is possible via a `.babelrc` or a `babel` config in `package.json`.

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
By default, all node modules referenced in your Lambda code will be bundled by Parcel.
Use the `nodeModules` prop to specify a list of modules that should not be bundled
but instead included in the `node_modules` folder of the Lambda package. This is useful
when working with native dependencies or when Parcel fails to bundle a module.

```ts
new lambda.NodejsFunction(this, 'my-handler', {
  nodeModules: ['native-module', 'other-module']
});
```

The modules listed in `nodeModules` must be present in the `package.json`'s dependencies. The
same version will be used for installation. If a lock file is detected (`package-lock.json` or
`yarn.lock`) it will be used along with the right installer (`npm` or `yarn`).

### Local bundling
If Parcel v2.0.0-beta.1 is available it will be used to bundle your code in your environment. Otherwise,
bundling will happen in a [Lambda compatible Docker container](https://hub.docker.com/r/amazon/aws-sam-cli-build-image-nodejs12.x).

For macOS the recommendend approach is to install Parcel as Docker volume performance is really poor.

Parcel v2.0.0-beta.1 can be installed with:

```bash
$ npm install --save-dev --save-exact parcel@2.0.0-beta.1
```

OR

```bash
$ yarn add --dev --exact parcel@2.0.0-beta.1
```

To force bundling in a Docker container, set the `forceDockerBundling` prop to `true`. This
is useful if your function relies on node modules that should be installed (`nodeModules` prop, see [above](#install-modules)) in a Lambda compatible environment. This is usually the
case with modules using native dependencies.
