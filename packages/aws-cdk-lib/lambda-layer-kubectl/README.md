# AWS Lambda Layer with kubectl (and helm)

This module exports a single class called `KubectlLayer` which is a `lambda.Layer` that bundles the [`kubectl`](https://kubernetes.io/docs/reference/kubectl/kubectl/) and the [`helm`](https://helm.sh/) command line.

> - Helm Version: 3.5.4
> - Kubectl Version: 1.20.0

Usage:

```ts
// KubectlLayer bundles the 'kubectl' and 'helm' command lines
import { KubectlLayer } from 'aws-cdk-lib/lambda-layer-kubectl';

declare const fn: lambda.Function;
fn.addLayers(new KubectlLayer(this, 'KubectlLayer'));
```

`kubectl` will be installed under `/opt/kubectl/kubectl`, and `helm` will be installed under `/opt/helm/helm`.

## Alternatives

This module bundles Kubectl v1.20.0 and the associated helm version
To use alternative Kubectl versions, including the latest available,
you can use the external module
[awscdk-asset-kubectl](https://github.com/cdklabs/awscdk-asset-kubectl).
