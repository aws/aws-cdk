# Amazon Lambda Node.js Library


This library provides constructs for Node.js Lambda functions.

## Node.js Function

The `NodejsFunction` construct creates a Lambda function with automatic transpiling and bundling
of TypeScript or Javascript code. This results in smaller Lambda packages that contain only the
code and dependencies needed to run the function.

It uses [esbuild](https://esbuild.github.io/) under the hood.

## Reference project architecture

The `NodejsFunction` allows you to define your CDK and runtime dependencies in a single
package.json and to collocate your runtime code with your infrastructure code:

```plaintext
.
├── lib
│   ├── my-construct.api.ts # Lambda handler for API
│   ├── my-construct.auth.ts # Lambda handler for Auth
│   └── my-construct.ts # CDK construct with two Lambda functions
├── package-lock.json # single lock file
├── package.json # CDK and runtime dependencies defined in a single package.json
└── tsconfig.json
```

By default, the construct will use the name of the defining file and the construct's
id to look up the entry file. In `my-construct.ts` above we have:

```ts
// automatic entry look up
const apiHandler = new nodejs.NodejsFunction(this, 'api');
const authHandler = new nodejs.NodejsFunction(this, 'auth');
```

Alternatively, an entry file and handler can be specified:

```ts
new nodejs.NodejsFunction(this, 'MyFunction', {
  entry: '/path/to/my/file.ts', // accepts .js, .jsx, .cjs, .mjs, .ts, .tsx, .cts and .mts files
  handler: 'myExportedFunc', // defaults to 'handler'
});
```

The handler value will be automatically prefixed with the bundled output file name, `index.`,
unless the handler value contains a `.` character, in which case the handler value is used as-is to
allow for values needed by some Lambda extensions.

For monorepos, the reference architecture becomes:

```plaintext
.
├── packages
│   ├── cool-package
│   │   ├── lib
│   │   │   ├── cool-construct.api.ts
│   │   │   ├── cool-construct.auth.ts
│   │   │   └── cool-construct.ts
│   │   ├── package.json # CDK and runtime dependencies for cool-package
│   │   └── tsconfig.json
│   └── super-package
│       ├── lib
│       │   ├── super-construct.handler.ts
│       │   └── super-construct.ts
│       ├── package.json # CDK and runtime dependencies for super-package
│       └── tsconfig.json
├── package-lock.json # single lock file
├── package.json # root dependencies
└── tsconfig.json
```

## Customizing the underlying Lambda function

All properties of `lambda.Function` can be used to customize the underlying `lambda.Function`.

See also the [AWS Lambda construct library](https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib/aws-lambda).

The `NodejsFunction` construct automatically [reuses existing connections](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html)
when working with the AWS SDK for JavaScript. Set the `awsSdkConnectionReuse` prop to `false` to disable it.

## Runtime

When the `@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion` feature flag is enabled, the `NODEJS_LATEST` runtime 
will be used by default. This runtime will be updated to use the latest Node.js version currently available in lambda.
Since this runtime can change from version to version, you should ensure that all of your dependencies are included
during packaging and avoid relying on depdendencies being globally installed. See [externals](#externals) for details.

**When using `NODEJS_LATEST` runtime make sure that all of your dependencies are included during bundling, or as layers.
Usage of globally installed packages in the lambda environment may cause your function to break in future versions. If
you need to rely on packages pre-installed in the lambda environment, you must explicitly set your runtime.**

This can be set via `lambda.Runtime`:

```ts
import { Runtime } from 'aws-cdk-lib/aws-lambda';

new nodejs.NodejsFunction(this, 'my-function', {
    runtime: Runtime.NODEJS_18_X,
});
```

With the `@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion` disabled, the runtime will default to `NODEJ_16_X`.

## Lock file

The `NodejsFunction` requires a dependencies lock file (`yarn.lock`, `pnpm-lock.yaml` or
`package-lock.json`). When bundling in a Docker container, the path containing this lock file is
used as the source (`/asset-input`) for the volume mounted in the container.

By default, the construct will try to automatically determine your project lock file.
Alternatively, you can specify the `depsLockFilePath` prop manually. In this
case you need to ensure that this path includes `entry` and any module/dependencies
used by your function. Otherwise bundling will fail.

## Local bundling

If `esbuild` is available it will be used to bundle your code in your environment. Otherwise,
bundling will happen in a [Lambda compatible Docker container](https://gallery.ecr.aws/sam/build-nodejs18.x)
with the Docker platform based on the target architecture of the Lambda function.

For macOS the recommended approach is to install `esbuild` as Docker volume performance is really poor.

`esbuild` can be installed with:

```console
$ npm install --save-dev esbuild@0
```

OR

```console
$ yarn add --dev esbuild@0
```

If you're using a monorepo layout, the `esbuild` dependency needs to be installed in the "root" `package.json` file,
not in the workspace. From the reference architecture described [above](#reference-project-architecture), the `esbuild`
dev dependency needs to be in `./package.json`, not `packages/cool-package/package.json` or
`packages/super-package/package.json`.

To force bundling in a Docker container even if `esbuild` is available in your environment,
set `bundling.forceDockerBundling` to `true`. This is useful if your function relies on node
modules that should be installed (`nodeModules` prop, see [below](#install-modules)) in a Lambda
compatible environment. This is usually the case with modules using native dependencies.

## Working with modules

### Externals

When the `NODEJS_LATEST` runtime is used, no modules are excluded from bundling by default. This is because the runtime
will change as new NodeJs versions become available in lambda, which may change what packages are vended as part of the
environment.

When passing a runtime that is known to include a version of the aws sdk, it will be excluded by default. For example, when
passing `NODEJS_16_X`, `aws-sdk` is excluded. When passing `NODEJS_18_X`,  all `@aws-sdk/*` packages are excluded.

This can be configured by specifying `bundling.externalModules`:

```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    externalModules: [
      '@aws-sdk/*', // Use the AWS SDK for JS v3 available in the Lambda runtime
      'cool-module', // 'cool-module' is already available in a Layer
    ],
  },
});
```

### Install modules

By default, all node modules referenced in your Lambda code will be bundled by `esbuild`.
Use the `nodeModules` prop under `bundling` to specify a list of modules that should not be
bundled but instead included in the `node_modules` folder of the Lambda package. This is useful
when working with native dependencies or when `esbuild` fails to bundle a module.

```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    nodeModules: ['native-module', 'other-module'],
  },
});
```

The modules listed in `nodeModules` must be present in the `package.json`'s dependencies or
installed. The same version will be used for installation. The lock file (`yarn.lock`,
`pnpm-lock.yaml` or `package-lock.json`) will be used along with the right installer (`yarn`,
`pnpm` or `npm`).

When working with `nodeModules` using native dependencies, you might want to force bundling in a
Docker container even if `esbuild` is available in your environment. This can be done by setting
`bundling.forceDockerBundling` to `true`.

## Configuring `esbuild`

The `NodejsFunction` construct exposes [esbuild options](https://esbuild.github.io/api/#build-api)
via properties under `bundling`:

```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    minify: true, // minify code, defaults to false
    sourceMap: true, // include source map, defaults to false
    sourceMapMode: nodejs.SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
    sourcesContent: false, // do not include original source into source map, defaults to true
    target: 'es2020', // target environment for the generated JavaScript code
    loader: { // Use the 'dataurl' loader for '.png' files
      '.png': 'dataurl',
    },
    define: { // Replace strings during build time
      'process.env.API_KEY': JSON.stringify('xxx-xxxx-xxx'),
      'process.env.PRODUCTION': JSON.stringify(true),
      'process.env.NUMBER': JSON.stringify(123),
    },
    logLevel: nodejs.LogLevel.ERROR, // defaults to LogLevel.WARNING
    keepNames: true, // defaults to false
    tsconfig: 'custom-tsconfig.json', // use custom-tsconfig.json instead of default,
    metafile: true, // include meta file, defaults to false
    banner: '/* comments */', // requires esbuild >= 0.9.0, defaults to none
    footer: '/* comments */', // requires esbuild >= 0.9.0, defaults to none
    charset: nodejs.Charset.UTF8, // do not escape non-ASCII characters, defaults to Charset.ASCII
    format: nodejs.OutputFormat.ESM, // ECMAScript module output format, defaults to OutputFormat.CJS (OutputFormat.ESM requires Node.js >= 14)
    mainFields: ['module', 'main'], // prefer ECMAScript versions of dependencies
    inject: ['./my-shim.js', './other-shim.js'], // allows to automatically replace a global variable with an import from another file
    esbuildArgs: { // Pass additional arguments to esbuild
      "--log-limit": "0",
      "--splitting": true,
    },
  },
});
```

## Command hooks

It is possible to run additional commands by specifying the `commandHooks` prop:

```text
// This example only available in TypeScript
// Run additional props via `commandHooks`
new nodejs.NodejsFunction(this, 'my-handler-with-commands', {
  bundling: {
    commandHooks: {
      beforeBundling(inputDir: string, outputDir: string): string[] {
        return [
          `echo hello > ${inputDir}/a.txt`,
          `cp ${inputDir}/a.txt ${outputDir}`,
        ];
      },
      afterBundling(inputDir: string, outputDir: string): string[] {
        return [`cp ${inputDir}/b.txt ${outputDir}/txt`];
      },
      beforeInstall() {
        return [];
      },
      // ...
    },
    // ...
  },
});
```

The following hooks are available:

- `beforeBundling`: runs before all bundling commands
- `beforeInstall`: runs before node modules installation
- `afterBundling`: runs after all bundling commands

They all receive the directory containing the lock file (`inputDir`) and the
directory where the bundled asset will be output (`outputDir`). They must return
an array of commands to run. Commands are chained with `&&`.

The commands will run in the environment in which bundling occurs: inside the
container for Docker bundling or on the host OS for local bundling.

## Pre Compilation with TSC

In some cases, `esbuild` may not yet support some newer features of the typescript language, such as,
[`emitDecoratorMetadata`](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata).
In such cases, it is possible to run pre-compilation using `tsc` by setting the `preCompilation` flag.

```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    preCompilation: true,
  },
});
```

Note: A [`tsconfig.json` file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) is required

## Customizing Docker bundling

Use `bundling.environment` to define environments variables when `esbuild` runs:

```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    environment: {
      NODE_ENV: 'production',
    },
  },
});
```

Use `bundling.buildArgs` to pass build arguments when building the Docker bundling image:

```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    buildArgs: {
      HTTPS_PROXY: 'https://127.0.0.1:3001',
    },
  }
});
```

Use `bundling.dockerImage` to use a custom Docker bundling image:

```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    dockerImage: DockerImage.fromBuild('/path/to/Dockerfile'),
  },
});
```

This image should have `esbuild` installed **globally**. If you plan to use `nodeModules` it
should also have `npm`, `yarn` or `pnpm` depending on the lock file you're using.

Use the [default image provided by `aws-cdk-lib/aws-lambda-nodejs`](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-lambda-nodejs/lib/Dockerfile)
as a source of inspiration.

You can set additional Docker options to configure the build environment:

 ```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
      network: 'host',
      securityOpt: 'no-new-privileges',
      user: 'user:group',
      volumesFrom: ['777f7dc92da7'],
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
   },
});
```

## Asset hash

By default the asset hash will be calculated based on the bundled output (`AssetHashType.OUTPUT`).

Use the `assetHash` prop to pass a custom hash:

```ts
new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    assetHash: 'my-custom-hash',
  },
});
```

If you chose to customize the hash, you will need to make sure it is updated every time the asset
changes, or otherwise it is possible that some deployments will not be invalidated.

## Docker based bundling in complex Docker configurations

By default the input and output of Docker based bundling is handled via bind mounts.
In situtations where this does not work, like Docker-in-Docker setups or when using a remote Docker socket, you can configure an alternative, but slower, variant that also works in these situations.

 ```ts
 new nodejs.NodejsFunction(this, 'my-handler', {
  bundling: {
    bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
  },
});
```
