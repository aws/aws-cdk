## Amazon Elasticsearch Service Construct Library

<!--BEGIN STABILITY BANNER-->
---

| Features | Stability |
| --- | --- |
| CFN Resources | ![Stable](https://img.shields.io/badge/stable-success.svg?style=for-the-badge) |
| Higher level constructs for Domain | ![Experimental](https://img.shields.io/badge/experimental-important.svg?style=for-the-badge) |

> **CFN Resources:** All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

> **Experimental:** Higher level constructs in this module that are marked as experimental are under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

To create an Elasticsearch domain:

```ts
import * as es from '@aws-cdk/aws-elasticsearch';

const domain = new es.Domain(this, 'Domain', {
    elasticsearchVersion: '7.4',
    clusterConfig: {
        masterNodes: 3,
        masterNodeInstanceType: 'c5.large.elasticsearch',
        dataNodes: 3,
        dataNodeInstanceType: 'r5.large.elasticsearch',
    },
    logPublishingOptions: {
        slowSearchLogEnabed: true,
        appLogEnabled: true
    },
});
```

This creates an Elasticsearch cluster and automatically sets up log groups for
logging the domain logs and slow search logs.


### Permissions

#### IAM

Helper methods also exist for managing access to the domain.

```ts
const lambda = new lambda.Function(this, 'Lambda', { /* ... */ });
// Grant the lambda functiomn read access to app-search index
domain.grantIndex(lambda, 'app-search', 'es:HttpGet');
```

### Encryption

The domain can also be created with encryption enabled:

```ts
const domain = new es.Domain(this, 'Domain', {
    elasticsearchVersion: '7.4',
    clusterConfig: {
        masterNodes: 3,
        masterNodeInstanceType: 'c5.large.elasticsearch',
        dataNodes: 3,
        dataNodeInstanceType: 'r5.large.elasticsearch',
    },
    nodeToNodeEncryptionEnabled: true,
    encryptionAtRestOptions: {
        enabled: true,
    },
});

```

This sets up the domain with node to node encryption and encryption at
rest. You can also choose to supply your own KMS key to use for encryption at
rest.

### Metrics

Helper methods exist to access common domain metrics for example:

```ts

const freeStorageSpace = domain.metricFreeStorageSpace('account-id');
const masterSysMemoryUtilization = domain.metric('MasterSysMemoryUtilization', 'account-id');
```

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
