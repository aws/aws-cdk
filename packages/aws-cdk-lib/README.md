# AWS Cloud Development Kit Library

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

The AWS CDK construct library provides APIs to define your CDK application and add
CDK constructs to the application.

## Usage

### Upgrade from CDK 1.x

When upgrading from CDK 1.x, remove all dependencies to individual CDK packages
from your dependencies file and follow the rest of the sections.

### Installation

Add a single entry in your dependencies list to this package.

You also need to add a reference to the `constructs` library, according to the
kind of project you are developing:
- For libraries, model the dependency under `devDependencies` **and** `peerDependencies`
- For apps, model the dependency under `dependencies` only

### Use in your code

#### Classic import

You can use a classic import to get access to each service namespaces:

```ts
import { core, aws_s3 as s3 } from 'aws-cdk-lib';

const app = new core.App();
const stack = new core.Stack(app, 'TestStack');

new s3.Bucket(stack, 'TestBucket');
```

#### Barrel import

Alternatively, you can use "barrel" imports:

```ts
import { App, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const app = new App();
const stack = new Stack(app, 'TestStack');

new Bucket(stack, 'TestBucket');
```
