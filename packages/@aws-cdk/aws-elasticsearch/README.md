# Amazon Elasticsearch Service Construct Library
<!--BEGIN STABILITY BANNER-->

---

Features                           | Stability
-----------------------------------|----------------------------------------------------------------
CFN Resources                      | ![Stable](https://img.shields.io/badge/stable-success.svg?style=for-the-badge)
Higher level constructs for Domain | ![Experimental](https://img.shields.io/badge/experimental-important.svg?style=for-the-badge)

> **CFN Resources:** All classes with the `Cfn` prefix in this module ([CFN Resources]) are always
> stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

<!-- -->

> **Experimental:** Higher level constructs in this module that are marked as experimental are
> under active development. They are subject to non-backward compatible changes or removal in any
> future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and
> breaking changes will be announced in the release notes. This means that while you may use them,
> you may need to update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

## Quick start

Create a development cluster by simply specifying the version:

```ts
import * as es from '@aws-cdk/aws-elasticsearch';

const devDomain = new es.Domain(this, 'Domain', {
    version: es.ElasticsearchVersion.V7_1,
});
```

To perform version upgrades without replacing the entire domain, specify the `enableVersionUpgrade` property.

```ts
import * as es from '@aws-cdk/aws-elasticsearch';

const devDomain = new es.Domain(this, 'Domain', {
    version: es.ElasticsearchVersion.V7_9,
    enableVersionUpgrade: true // defaults to false
});
```

Create a production grade cluster by also specifying things like capacity and az distribution

```ts
const prodDomain = new es.Domain(this, 'Domain', {
    version: es.ElasticsearchVersion.V7_1,
    capacity: {
        masterNodes: 5,
        dataNodes: 20
    },
    ebs: {
        volumeSize: 20
    },
    zoneAwareness: {
        availabilityZoneCount: 3
    },
    logging: {
        slowSearchLogEnabled: true,
        appLogEnabled: true,
        slowIndexLogEnabled: true,
    },
});
```

This creates an Elasticsearch cluster and automatically sets up log groups for
logging the domain logs and slow search logs.

## Importing existing domains

To import an existing domain into your CDK application, use the `Domain.fromDomainEndpoint` factory method.
This method accepts a domain endpoint of an already existing domain:

```ts
const domainEndpoint = 'https://my-domain-jcjotrt6f7otem4sqcwbch3c4u.us-east-1.es.amazonaws.com';
const domain = Domain.fromDomainEndpoint(this, 'ImportedDomain', domainEndpoint);
```

## Permissions

### IAM

Helper methods also exist for managing access to the domain.

```ts
const lambda = new lambda.Function(this, 'Lambda', { /* ... */ });

// Grant write access to the app-search index
domain.grantIndexWrite('app-search', lambda);

// Grant read access to the 'app-search/_search' path
domain.grantPathRead('app-search/_search', lambda);
```

## Encryption

The domain can also be created with encryption enabled:

```ts
const domain = new es.Domain(this, 'Domain', {
    version: es.ElasticsearchVersion.V7_4,
    ebs: {
        volumeSize: 100,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
    },
    nodeToNodeEncryption: true,
    encryptionAtRest: {
        enabled: true,
    },
});
```

This sets up the domain with node to node encryption and encryption at
rest. You can also choose to supply your own KMS key to use for encryption at
rest.

## Metrics

Helper methods exist to access common domain metrics for example:

```ts
const freeStorageSpace = domain.metricFreeStorageSpace();
const masterSysMemoryUtilization = domain.metric('MasterSysMemoryUtilization');
```

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Fine grained access control

The domain can also be created with a master user configured. The password can
be supplied or dynamically created if not supplied.

```ts
const domain = new es.Domain(this, 'Domain', {
    version: es.ElasticsearchVersion.V7_1,
    enforceHttps: true,
    nodeToNodeEncryption: true,
    encryptionAtRest: {
        enabled: true,
    },
    fineGrainedAccessControl: {
        masterUserName: 'master-user',
    },
});

const masterUserPassword = domain.masterUserPassword;
```

## Using unsigned basic auth

For convenience, the domain can be configured to allow unsigned HTTP requests
that use basic auth. Unless the domain is configured to be part of a VPC this
means anyone can access the domain using the configured master username and
password.

To enable unsigned basic auth access the domain is configured with an access
policy that allows anyonmous requests, HTTPS required, node to node encryption,
encryption at rest and fine grained access control.

If the above settings are not set they will be configured as part of enabling
unsigned basic auth. If they are set with conflicting values, an error will be
thrown.

If no master user is configured a default master user is created with the
username `admin`.

If no password is configured a default master user password is created and
stored in the AWS Secrets Manager as secret. The secret has the prefix
`<domain id>MasterUser`.

```ts
const domain = new es.Domain(this, 'Domain', {
    version: es.ElasticsearchVersion.V7_1,
    useUnsignedBasicAuth: true,
});

const masterUserPassword = domain.masterUserPassword;
```



## Audit logs

Audit logs can be enabled for a domain, but only when fine grained access control is enabled.

```ts
const domain = new es.Domain(this, 'Domain', {
    version: es.ElasticsearchVersion.V7_1,
    enforceHttps: true,
    nodeToNodeEncryption: true,
    encryptionAtRest: {
        enabled: true,
    },
    fineGrainedAccessControl: {
        masterUserName: 'master-user',
    },
    logging: {
        auditLogEnabled: true,
        slowSearchLogEnabled: true,
        appLogEnabled: true,
        slowIndexLogEnabled: true,
    },
});
```

## UltraWarm

UltraWarm nodes can be enabled to provide a cost-effective way to store large amounts of read-only data.

```ts
const domain = new es.Domain(this, 'Domain', {
    version: es.ElasticsearchVersion.V7_9,
    capacity: {
        masterNodes: 2,
        warmNodes: 2,
        warmInstanceType: 'ultrawarm1.medium.elasticsearch',
    },
});
```
