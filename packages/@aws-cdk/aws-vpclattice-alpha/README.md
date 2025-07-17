# AWS VPC Lattice Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->


## Overview

AWS VPC Lattice is a fully managed application networking service that you can use to connect, secure, and monitor all your services across multiple accounts and virtual private clouds (VPCs).

This module provides CDK constructs for working with VPC Lattice.

## Installation

Import to your project:

```ts
import * as vpclattice from '@aws-cdk/aws-vpclattice-alpha';
```

## Basic Usage

### Creating a Service Network

```ts
import * as vpclattice from '@aws-cdk/aws-vpclattice-alpha';

// Create a service network
const serviceNetwork = new vpclattice.ServiceNetwork(this, 'MyServiceNetwork', {
  serviceNetworkName: 'my-service-network',
  authType: vpclattice.ServiceNetworkAuthType.AWS_IAM, // Optional: NONE (default) or AWS_IAM
  enableSharing: true, // Optional: enable sharing of the service network
});
```

### Creating a Service

```ts
import * as vpclattice from '@aws-cdk/aws-vpclattice-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

// Create a policy document for AWS_IAM auth type
const authPolicy = new iam.PolicyDocument({
  statements: [
    new iam.PolicyStatement({
      actions: ['vpc-lattice:Invoke'],
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal('arn:aws:iam::123456789012:role/MyRole')],
      resources: ['*'],
    }),
  ],
});

// Create a service
const service = new vpclattice.Service(this, 'MyService', {
  serviceName: 'my-service',
  authType: vpclattice.ServiceAuthType.AWS_IAM,
  authPolicy: authPolicy, // Required when authType is AWS_IAM
  customDomainName: 'api.example.com', // Optional
  dnsEntry: {
    domainName: 'my-service.vpc-lattice-dns.amazonaws.com',
    hostedZoneId: 'Z123456789',
  },
});
```

### Associating Services with a Service Network

```ts
// Create service network with services
const serviceNetwork = new vpclattice.ServiceNetwork(this, 'MyServiceNetwork', {
  serviceNetworkName: 'my-service-network',
  authType: vpclattice.ServiceNetworkAuthType.NONE,
  enableSharing: false,
  services: [service], // Associate services during creation
});

// Or associate services after creation
serviceNetwork.associateServices([service]);
```

### Importing an Existing Service Network

```ts
import * as vpclattice from '@aws-cdk/aws-vpclattice-alpha';

// Import by ARN
const serviceNetworkByArn = vpclattice.ServiceNetwork.fromServiceNetworkArn(
  this,
  'ImportedServiceNetworkByArn',
  'arn:aws:vpc-lattice:us-west-2:123456789012:servicenetwork/sn-12345678901234567'
);

// Import by attributes
const serviceNetworkByAttributes = vpclattice.ServiceNetwork.fromServiceNetworkAttributes(
  this,
  'ImportedServiceNetworkByAttributes',
  {
    serviceNetworkArn: 'arn:aws:vpc-lattice:us-west-2:123456789012:servicenetwork/sn-12345678901234567',
  }
);
```

### Importing an Existing Service

```ts
import * as vpclattice from '@aws-cdk/aws-vpclattice-alpha';

// Import by attributes
const importedService = vpclattice.Service.fromServiceAttributes(
  this,
  'ImportedService',
  {
    serviceArn: 'arn:aws:vpc-lattice:us-west-2:123456789012:service/svc-12345678901234567',
  }
);
```

## Authentication Types

Both services and service networks support two authentication types:

- `ServiceAuthType.NONE` / `ServiceNetworkAuthType.NONE` - No authentication required
- `ServiceAuthType.AWS_IAM` / `ServiceNetworkAuthType.AWS_IAM` - AWS IAM authentication required

When using AWS_IAM authentication for services, you must provide an `authPolicy` in the service properties.
