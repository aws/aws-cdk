# Amazon OpenSearch Service Construct Library


See [Migrating to OpenSearch](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-elasticsearch-readme.html#migrating-to-opensearch) for migration instructions from `aws-cdk-lib/aws-elasticsearch` to this module, `aws-cdk-lib/aws-opensearchservice`.

## Quick start

Create a development cluster by simply specifying the version:

```ts
const devDomain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
});
```

To perform version upgrades without replacing the entire domain, specify the `enableVersionUpgrade` property.

```ts
const devDomain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  enableVersionUpgrade: true, // defaults to false
});
```

Create a cluster with GP3 volumes:

```ts
const gp3Domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_2_5,
  ebs: {
    volumeSize: 30,
    volumeType: ec2.EbsDeviceVolumeType.GP3,
    throughput: 125,
    iops: 3000,
  },
});
```

Create a production grade cluster by also specifying things like capacity and az distribution

```ts
const prodDomain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  capacity: {
    masterNodes: 5,
    dataNodes: 20,
  },
  ebs: {
    volumeSize: 20,
  },
  zoneAwareness: {
    availabilityZoneCount: 3,
  },
  logging: {
    slowSearchLogEnabled: true,
    appLogEnabled: true,
    slowIndexLogEnabled: true,
  },
});
```

This creates an Amazon OpenSearch Service cluster and automatically sets up log groups for
logging the domain logs and slow search logs.

## A note about SLR

Some cluster configurations (e.g VPC access) require the existence of the [`AWSServiceRoleForAmazonElasticsearchService`](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/slr.html) Service-Linked Role.

When performing such operations via the AWS Console, this SLR is created automatically when needed. However, this is not the behavior when using CloudFormation. If an SLR is needed, but doesn't exist, you will encounter a failure message similar to:

```console
Before you can proceed, you must enable a service-linked role to give Amazon OpenSearch Service...
```

To resolve this, you need to [create](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role) the SLR. We recommend using the AWS CLI:

```console
aws iam create-service-linked-role --aws-service-name es.amazonaws.com
```

You can also create it using the CDK, **but note that only the first application deploying this will succeed**:

```ts
const slr = new iam.CfnServiceLinkedRole(this, 'Service Linked Role', {
  awsServiceName: 'es.amazonaws.com',
});
```

## Importing existing domains

### Using a known domain endpoint

To import an existing domain into your CDK application, use the `Domain.fromDomainEndpoint` factory method.
This method accepts a domain endpoint of an already existing domain:

```ts
const domainEndpoint = 'https://my-domain-jcjotrt6f7otem4sqcwbch3c4u.us-east-1.es.amazonaws.com';
const domain = Domain.fromDomainEndpoint(this, 'ImportedDomain', domainEndpoint);
```

### Using the output of another CloudFormation stack

To import an existing domain with the help of an exported value from another CloudFormation stack,
use the `Domain.fromDomainAttributes` factory method. This will accept tokens.

```ts
const domainArn = Fn.importValue(`another-cf-stack-export-domain-arn`);
const domainEndpoint = Fn.importValue(`another-cf-stack-export-domain-endpoint`);
const domain = Domain.fromDomainAttributes(this, 'ImportedDomain', {
  domainArn,
  domainEndpoint,
});
```

## Permissions

### IAM

Helper methods also exist for managing access to the domain.

```ts
declare const fn: lambda.Function;
declare const domain: Domain;

// Grant write access to the app-search index
domain.grantIndexWrite('app-search', fn);

// Grant read access to the 'app-search/_search' path
domain.grantPathRead('app-search/_search', fn);
```

## Encryption

The domain can also be created with encryption enabled:

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  ebs: {
    volumeSize: 100,
    volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
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

## VPC Support

Domains can be placed inside a VPC, providing a secure communication between Amazon OpenSearch Service and other services within the VPC without the need for an internet gateway, NAT device, or VPN connection.

> Visit [VPC Support for Amazon OpenSearch Service Domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) for more details.

```ts
const vpc = new ec2.Vpc(this, 'Vpc');
const domainProps: DomainProps = {
  version: EngineVersion.OPENSEARCH_1_0,
  removalPolicy: RemovalPolicy.DESTROY,
  vpc,
  // must be enabled since our VPC contains multiple private subnets.
  zoneAwareness: {
    enabled: true,
  },
  capacity: {
    // must be an even number since the default az count is 2.
    dataNodes: 2,
  },
};
new Domain(this, 'Domain', domainProps);
```

In addition, you can use the `vpcSubnets` property to control which specific subnets will be used, and the `securityGroups` property to control
which security groups will be attached to the domain. By default, CDK will select all *private* subnets in the VPC, and create one dedicated security group.

## Metrics

Helper methods exist to access common domain metrics for example:

```ts
declare const domain: Domain;
const freeStorageSpace = domain.metricFreeStorageSpace();
const masterSysMemoryUtilization = domain.metric('MasterSysMemoryUtilization');
```

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Fine grained access control

The domain can also be created with a master user configured. The password can
be supplied or dynamically created if not supplied.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
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

## SAML authentication

You can enable SAML authentication to use your existing identity provider
to offer single sign-on (SSO) for dashboards on Amazon OpenSearch Service domains
running OpenSearch or Elasticsearch 6.7 or later.
To use SAML authentication, fine-grained access control must be enabled.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  enforceHttps: true,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
    enabled: true,
  },
  fineGrainedAccessControl: {
    masterUserName: 'master-user',
    samlAuthenticationEnabled: true,
    samlAuthenticationOptions: {
      idpEntityId: 'entity-id',
      idpMetadataContent: 'metadata-content-with-quotes-escaped',
    },
  },
});
```

## Using unsigned basic auth

For convenience, the domain can be configured to allow unsigned HTTP requests
that use basic auth. Unless the domain is configured to be part of a VPC this
means anyone can access the domain using the configured master username and
password.

To enable unsigned basic auth access the domain is configured with an access
policy that allows anonymous requests, HTTPS required, node to node encryption,
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
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  useUnsignedBasicAuth: true,
});

const masterUserPassword = domain.masterUserPassword;
```

## Custom access policies

If the domain requires custom access control it can be configured either as a
constructor property, or later by means of a helper method.

For simple permissions the `accessPolicies` constructor may be sufficient:

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  accessPolicies: [
    new iam.PolicyStatement({
      actions: ['es:*ESHttpPost', 'es:ESHttpPut*'],
      effect: iam.Effect.ALLOW,
      principals: [new iam.AccountPrincipal('123456789012')],
      resources: ['*'],
    }),
  ]
});
```

For more complex use-cases, for example, to set the domain up to receive data from a
[cross-account Amazon Data Firehose](https://aws.amazon.com/premiumsupport/knowledge-center/kinesis-firehose-cross-account-streaming/) the `addAccessPolicies` helper method
allows for policies that include the explicit domain ARN.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
});
domain.addAccessPolicies(
  new iam.PolicyStatement({
    actions: ['es:ESHttpPost', 'es:ESHttpPut'],
    effect: iam.Effect.ALLOW,
    principals: [new iam.AccountPrincipal('123456789012')],
    resources: [domain.domainArn, `${domain.domainArn}/*`],
  }),
  new iam.PolicyStatement({
    actions: ['es:ESHttpGet'],
    effect: iam.Effect.ALLOW,
    principals: [new iam.AccountPrincipal('123456789012')],
    resources: [
      `${domain.domainArn}/_all/_settings`,
      `${domain.domainArn}/_cluster/stats`,
      `${domain.domainArn}/index-name*/_mapping/type-name`,
      `${domain.domainArn}/roletest*/_mapping/roletest`,
      `${domain.domainArn}/_nodes`,
      `${domain.domainArn}/_nodes/stats`,
      `${domain.domainArn}/_nodes/*/stats`,
      `${domain.domainArn}/_stats`,
      `${domain.domainArn}/index-name*/_stats`,
      `${domain.domainArn}/roletest*/_stat`,
    ],
  }),
);
```


## Audit logs

Audit logs can be enabled for a domain, but only when fine grained access control is enabled.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
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

## Suppress creating CloudWatch Logs resource policy

When logging is enabled for the domain, the CloudWatch Logs resource policy is created by default.
This resource policy is necessary for logging, but since only a maximum of 10 resource policies can be created per region,
the maximum number of resource policies may be a problem when enabling logging for several domains.
By setting the `suppressLogsResourcePolicy` option to true, you can suppress the creation of a CloudWatch Logs resource policy.

If you set the `suppressLogsResourcePolicy` option to true, you must create a resource policy before deployment.
Also, to avoid reaching this limit, consider reusing a broader policy that includes multiple log groups.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
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
  suppressLogsResourcePolicy: true,
});
```

> Visit [Monitoring OpenSearch logs with Amazon CloudWatch Logs](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createdomain-configure-slow-logs.html) for more details.

## UltraWarm

UltraWarm nodes can be enabled to provide a cost-effective way to store large amounts of read-only data.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  capacity: {
    masterNodes: 2,
    warmNodes: 2,
    warmInstanceType: 'ultrawarm1.medium.search',
  },
});
```

## Cold storage

Cold storage can be enabled on the domain. You must enable UltraWarm storage to enable cold storage.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  capacity: {
    masterNodes: 2,
    warmNodes: 2,
    warmInstanceType: 'ultrawarm1.medium.search',
  },
  coldStorageEnabled: true,
});
```

## Custom endpoint

Custom endpoints can be configured to reach the domain under a custom domain name.

```ts
new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  customEndpoint: {
    domainName: 'search.example.com',
  },
});
```

It is also possible to specify a custom certificate instead of the auto-generated one.

Additionally, an automatic CNAME-Record is created if a hosted zone is provided for the custom endpoint

## Advanced options

[Advanced options](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html#createdomain-configure-advanced-options) can used to configure additional options.

```ts
new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  advancedOptions: {
    'rest.action.multi.allow_explicit_index': 'false',
    'indices.fielddata.cache.size': '25',
    'indices.query.bool.max_clause_count': '2048',
  },
});
```

## Amazon Cognito authentication for OpenSearch Dashboards

The domain can be configured to use Amazon Cognito authentication for OpenSearch Dashboards.

> Visit [Configuring Amazon Cognito authentication for OpenSearch Dashboards](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html) for more details.

```ts
declare const cognitoConfigurationRole: iam.Role;

const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_0,
  cognitoDashboardsAuth: {
    role: cognitoConfigurationRole,
    identityPoolId: 'example-identity-pool-id',
    userPoolId: 'example-user-pool-id',
  },
});
```

## Enable support for Multi-AZ with Standby deployment

The domain can be configured to use [multi-AZ with standby](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html#managedomains-za-standby).

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_3,
  ebs: {
    volumeSize: 10,
    volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
  },
  zoneAwareness: {
    enabled: true,
    availabilityZoneCount: 3,
  },
  capacity: {
    multiAzWithStandbyEnabled: true,
    masterNodes: 3,
    dataNodes: 3,
  },
});
```

## Define off-peak windows

The domain can be configured to use a daily 10-hour window considered as off-peak hours.

Off-peak windows were introduced on February 16, 2023. 
All domains created before this date have the off-peak window disabled by default. 
You must manually enable and configure the off-peak window for these domains. 
All domains created after this date will have the off-peak window enabled by default. 
You can't disable the off-peak window for a domain after it's enabled.

> Visit [Defining off-peak windows for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/off-peak.html) for more details.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_3,
  offPeakWindowEnabled: true, // can be omitted if offPeakWindowStart is set
  offPeakWindowStart: {
    hours: 20,
    minutes: 0,
  },
});
```

## Configuring service software updates

The domain can be configured to use service software updates.

> Visit [Service software updates in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/service-software.html) for more details.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_3,
  enableAutoSoftwareUpdate: true,
});
```

## IP address type

You can specify either dual stack or IPv4 as your IP address type.

```ts
const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_3,
  ipAddressType: IpAddressType.DUAL_STACK,
});
```

## Using Coordinator node with NodeOptions

You can specify coordinator as a valid value for node type.

> Visit [Dedicated coordinator nodes in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/Dedicated-coordinator-nodes.html) for more details.

```ts
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';

const domain = new Domain(this, 'Domain', {
  version: EngineVersion.OPENSEARCH_1_3,
  capacity: {
    nodeOptions: [
      {
        nodeType: opensearch.NodeType.COORDINATOR,
        nodeConfig: {
          enabled: true,
          count: 2,
          type: 'm5.large.search',
        },
      },
    ],
  },
})
```
