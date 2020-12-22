# monocdk Experiment

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

An __experiment__ to bundle all of the CDK into a single module.

> :warning: Please don't use this module unless you are interested in providing
> feedback about this experience.


## Usage

### Installation

To try out `monocdk` replace all references to CDK Construct
Libraries (most `@aws-cdk/*` packages) in your `package.json` file with a single
entrey referring to `monocdk`.

You also need to add a reference to the `constructs` library, according to the
kind of project you are developing:

- For libraries, model the dependency under `devDependencies` **and** `peerDependencies`
- For apps, model the dependency under `dependencies` only

### Use in your code

#### Classic import

You can use a classic import to get access to each service namespaces:

```ts
import { core, aws_s3 as s3 } from 'monocdk';

const app = new core.App();
const stack = new core.Stack(app, 'MonoCDK-Stack');

new s3.Bucket(stack, 'TestBucket');
```

#### Barrel import

Alternatively, you can use "barrel" imports:

```ts
import { App, Stack } from 'monocdk';
import { Bucket } from 'monocdk/aws-s3';

const app = new App();
const stack = new Stack(app, 'MonoCDK-Stack');

new Bucket(stack, 'TestBucket');
```
