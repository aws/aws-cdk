# AWS Lambda Layer with the NPM dependency proxy-agent
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module exports a single class called `NodeProxyAgentLayer` which is a `lambda.Layer` that bundles the NPM dependency [`proxy-agent`](https://www.npmjs.com/package/proxy-agent).

> - proxy-agent Version: 5.0.0

Usage:

```ts
import { NodeProxyAgentLayer } from '@aws-cdk/lambda-layer-node-proxy-agent';
import * as lambda from '@aws-cdk/aws-lambda';

declare const fn: lambda.Function;
fn.addLayers(new NodeProxyAgentLayer(this, 'NodeProxyAgentLayer'));
```

[`proxy-agent`](https://www.npmjs.com/package/proxy-agent) will be installed under `/nodejs/node_modules`.
