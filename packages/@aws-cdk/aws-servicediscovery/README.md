## Amazon ECS Service Discovery Construct Library
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

This package contains constructs for working with **AWS Cloud Map**

AWS Cloud Map is a fully managed service that you can use to create and
maintain a map of the backend services and resources that your applications
depend on.

For further information on AWS Cloud Map,
see the [AWS Cloud Map documentation](https://docs.aws.amazon.com/cloud-map)

The following example creates an AWS Cloud Map namespace that
supports API calls, creates a service in that namespace, and
registers an instance to it:

[Creating a Cloud Map service within an HTTP namespace](test/integ.service-with-http-namespace.lit.ts)

The following example creates an AWS Cloud Map namespace that
supports both API calls and DNS queries within a vpc, creates a
service in that namespace, and registers a loadbalancer as an
instance:

[Creating a Cloud Map service within a Private DNS namespace](test/integ.service-with-private-dns-namespace.lit.ts)

The following example creates an AWS Cloud Map namespace that
supports both API calls and public DNS queries, creates a service in
that namespace, and registers an IP instance:

[Creating a Cloud Map service within a Public namespace](test/integ.service-with-public-dns-namespace.lit.ts)

For DNS namespaces, you can also register instances to services with CNAME records:

[Creating a Cloud Map service within a Public namespace](test/integ.service-with-cname-record.lit.ts)
