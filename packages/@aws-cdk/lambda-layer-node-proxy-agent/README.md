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
const fn = new lambda.Function(...);
fn.addLayers(new NodeProxyAgentLayer(stack, 'NodeProxyAgentLayer'));
```

[`proxy-agent`](https://www.npmjs.com/package/proxy-agent) will be installed under `/opt/nodejs/node_modules`.
