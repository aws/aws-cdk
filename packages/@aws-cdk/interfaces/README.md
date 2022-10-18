# Interfaces for types shared between aws-cdk-lib and other packages
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module exports a single interface called `ILambdaLayerAsset` which extends `IConstruct`. It defines the interface for a specific asset that can be passed to a `lambda.LayerVersion`.

Usage:

```ts
import { ILambdaLayerAsset } from '@aws-cdk/interfaces';
import * as lambda from '@aws-cdk/aws-lambda';
import * as assets from '@aws-cdk/aws-s3-assets';
imoprt { Construct } from 'constructs';

class MyLayerAsset implements ILambdaLayerAsset {
  bucketArn: string;
  key: string;

  constructor(scope: Construct, id: string) {
    const asset = new assets.Asset(this, 'SampleAsset', {
      path: path.join(__dirname, 'sample-asset-directory'),
    });
    this.bucketArn = asset.bucket.bucketArn;
    this.key = asset.s3ObjectKey;
  }
}

declare const fn: lambda.Function;
fn.addLayers(new LayerVersion(this, 'LayerVersion', {
  code: lambda.Code.fromLambdaLayerAsset(new MyLayerAsset(this, 'LayerCode')),
}));
```