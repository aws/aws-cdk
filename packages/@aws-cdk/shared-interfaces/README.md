# AWS CDK Shared Interfaces
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module exports types shared between `aws-cdk-lib` and other packages.

## AssetSource

`AssetSource` defines the minimum properties required to create an asset. This
interface was created so that `aws-cdk-lib` could both depend on external
packages for the assets used in the `aws-cdk-lib/lambda-layer-...` submodules,
and also accept an `AssetSource` provided by a user. This interface is
implemented by classes in the `@aws-cdk/asset-...` packages, and probably will
not be used by typical CDK applications or construct libraries.

Usage:

```ts
import { AssetSource } from '@aws-cdk/shared-interfaces';
import * as lambda from '@aws-cdk/aws-lambda';

declare const fn: lambda.Function;
declare const assetSource: AssetSource;
fn.addLayers(new LayerVersion(this, 'LayerVersion', {
  code: lambda.Code.fromAsset(assetSource.path),
}));
```
