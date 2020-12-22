# Amazon ECS Service Discovery Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

This package contains constructs for working with **AWS Cloud Map**

AWS Cloud Map is a fully managed service that you can use to create and
maintain a map of the backend services and resources that your applications
depend on.

For further information on AWS Cloud Map,
see the [AWS Cloud Map documentation](https://docs.aws.amazon.com/cloud-map)

## HTTP Namespace Example

The following example creates an AWS Cloud Map namespace that
supports API calls, creates a service in that namespace, and
registers an instance to it:

[Creating a Cloud Map service within an HTTP namespace](test/integ.service-with-http-namespace.lit.ts)

## Private DNS Namespace Example

The following example creates an AWS Cloud Map namespace that
supports both API calls and DNS queries within a vpc, creates a
service in that namespace, and registers a loadbalancer as an
instance:

[Creating a Cloud Map service within a Private DNS namespace](test/integ.service-with-private-dns-namespace.lit.ts)

## Public DNS Namespace Example

The following example creates an AWS Cloud Map namespace that
supports both API calls and public DNS queries, creates a service in
that namespace, and registers an IP instance:

[Creating a Cloud Map service within a Public namespace](test/integ.service-with-public-dns-namespace.lit.ts)

For DNS namespaces, you can also register instances to services with CNAME records:

[Creating a Cloud Map service within a Public namespace](test/integ.service-with-cname-record.lit.ts)
