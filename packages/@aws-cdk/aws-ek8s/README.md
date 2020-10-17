## AWS EK8s
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This package provides `cdk8s` integration with the [EKS](../aws-eks/README.md) construct library,
allowing you to apply cdk8s charts on Amazon EKS clusters.

[CDK8s](https://cdk8s.io/) is an open-source library that enables Kubernetes manifest authoring using familiar programming languages. It is founded on the same technologies as the AWS CDK, such as [`constructs`](https://github.com/aws/constructs) and [`jsii`](https://github.com/aws/jsii).

> To learn more about cdk8s, visit the [Getting Started](https://github.com/awslabs/cdk8s/tree/master/docs/getting-started) tutorials.

In addition to `cdk8s`, you can also use [`cdk8s+`](https://github.com/awslabs/cdk8s/tree/master/packages/cdk8s-plus), which provides higher level abstraction for the core kubernetes api objects.
You can think of it like the `L2` constructs for Kubernetes. Any other `cdk8s` based libraries are also supported, for example [`cdk8s-debore`](https://github.com/toricls/cdk8s-debore).

To get started, add the following dependencies to your `package.json` file:

```json
"dependencies": {
  "@aws-cdk/aws-ek8s": "^1.69.0",
  "cdk8s": "0.30.0",
  "cdk8s-plus": "0.30.0",
  "constructs": "3.0.4"
}
```

> Note that the version of `cdk8s` must be `>=0.30.0`.

Similarly to how you would create a stack by extending `@aws-cdk/core.Stack`, we recommend you create a chart of your own that extends `cdk8s.Chart`,
and add your kubernetes resources to it. You can use `aws-cdk` construct attributes and properties inside your `cdk8s` construct freely.

In this example we create a chart that accepts an `s3.Bucket` and passes its name to a kubernetes pod as an environment variable.

Notice that the chart must accept a `constructs.Construct` type as its scope, not an `@aws-cdk/core.Construct` as you would normally use.
For this reason, to avoid possible confusion, we will create the chart in a separate file:

`+ my-chart.ts`
```ts
import * as s3 from '@aws-cdk/aws-s3';
import * as constructs from 'constructs';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export interface MyChartProps {
  readonly bucket: s3.Bucket;
}

export class MyChart extends cdk8s.Chart {
  constructor(scope: constructs.Construct, id: string, props: MyChartProps) {
    super(scope, id);

    new kplus.Pod(this, 'Pod', {
      spec: {
        containers: [
          new kplus.Container({
            image: 'my-image',
            env: {
              BUCKET_NAME: kplus.EnvValue.fromValue(props.bucket.bucketName),
            },
          }),
        ],
      },
    });
  }
}
```

Then, in your AWS CDK app:

```ts
import * as s3 from '@aws-cdk/aws-s3';
import * as ek8s from '@aws-cdk/aws-ek8s';
import * as cdk8s from 'cdk8s';
import { MyChart } from './my-chart';

// some bucket..
const bucket = new s3.Bucket(this, 'Bucket');

// create a cdk8s chart and use `cdk8s.App` as the scope.
const myChart = new MyChart(new cdk8s.App(), 'MyChart', { bucket });

// add the cdk8s chart as a custom chart to the cluster
cluster.addCustomChart('my-chart', new ek8s.Cdk8sChart(myChart));
```

## Custom CDK8s Constructs

You can also compose a few stock `cdk8s+` constructs into your own custom construct. However, since mixing scopes between `aws-cdk` and `cdk8s` is currently not supported, the `Construct` class
you'll need to use is the one from the [`constructs`](https://github.com/aws/constructs) module, and not from `@aws-cdk/core` like you normally would.
This is why we used `new cdk8s.App()` as the scope of the chart above.

```ts
import * as constructs from 'constructs';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export interface LoadBalancedWebService {
  readonly port: number;
  readonly image: string;
  readonly replicas: number;
}

export class LoadBalancedWebService extends constructs.Construct {
  constructor(scope: constructs.Construct, id: string, props: LoadBalancedWebService) {
    super(scope, id);

    const deployment = new kplus.Deployment(chart, 'Deployment', {
      spec: {
        replicas: props.replicas,
        podSpecTemplate: {
          containers: [ new kplus.Container({ image: props.image }) ]
        }
      },
    });

    deployment.expose({port: props.port, serviceType: kplus.ServiceType.LOAD_BALANCER})

  }
}
```
