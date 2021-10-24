# AWS Lambda Layer with kubectl (and helm)
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module exports a single class called `KubectlLayer` which is a `lambda.Layer` that bundles the [`kubectl`](https://kubernetes.io/docs/reference/kubectl/kubectl/) and the [`helm`](https://helm.sh/) command line.

> - Helm Version: 1.20.0
> - Kubectl Version: 3.4.2

Usage:

```ts
const fn = new lambda.Function(...);
fn.addLayers(new KubectlLayer(stack, 'KubectlLayer'));
```

`kubectl` will be installed under `/opt/kubectl/kubectl`, and `helm` will be installed under `/opt/helm/helm`.
