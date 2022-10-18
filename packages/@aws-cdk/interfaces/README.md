# Interfaces for types shared between aws-cdk-lib and other packages
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module exports a single interface called `AssetSource` which defines the
minimum properties required to create an asset.

Usage:

```ts
import { AssetSource } from '@aws-cdk/interfaces';
import * as lambda from '@aws-cdk/aws-lambda';

declare const fn: lambda.Function;
declare const assetSource: AssetSource;
fn.addLayers(new LayerVersion(this, 'LayerVersion', {
  code: lambda.Code.fromAsset(assetSource.path, {
    assetHash: assetSource.assetHash,
  }),
}));
```
