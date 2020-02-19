## Amazon Elastic File System Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This construct library allows you to set up AWS Elastic File System (EFS).

```ts
import efs = require('@aws-cdk/aws-efs');

const myVpc = new ec2.Vpc(this, 'VPC');
const fileSystem = new efs.EfsFileSystem(this, 'MyEfsFileSystem', {
    vpc: myVpc,
    encrypted: true,
    lifecyclePolicy: EfsLifecyclePolicyProperty.AFTER_14_DAYS,
    performanceMode: EfsPerformanceMode.GENERAL_PURPOSE,
    throughputMode: EfsThroughputMode.BURSTING
});
```

### Connecting

To control who can access the EFS, use the `.connections` attribute. EFS has
a fixed default port, so you don't need to specify the port:

```ts
fileSystem.connections.allowDefaultPortFrom(instance);
```


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
