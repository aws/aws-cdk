## AWS Certificate Manager Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

This package provides Constructs for provisioning and referencing
certificates which can be used in CloudFront and ELB.

The following requests a certificate for a given domain:

[request a certificate example](test/example.simple-request.lit.ts)

After requesting a certificate, you will need to prove that you own the
domain in question before the certificate will be granted. The CloudFormation
deployment will wait until this verification process has been completed.

Because of this wait time, it's better to provision your certificates
either in a separate stack from your main service, or provision them
manually and import them into your CDK application.

The CDK also provides a custom resource which can be used for automatic
validation if the DNS records for the domain are managed through Route53 (see
below).

### Email validation

Email-validated certificates (the default) are validated by receiving an
email on one of a number of predefined domains and following the instructions
in the email.

See [Validate with Email](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-email.html)
in the AWS Certificate Manager User Guide.

### DNS validation

DNS-validated certificates are validated by configuring appropriate DNS
records for your domain.

See [Validate with DNS](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html)
in the AWS Certificate Manager User Guide.

```ts
new Certificate(this, 'Certificate', {
  domainName: 'hello.example.com',
  validation: CertificateValidation.fromDns(),
});
```

If Amazon Route 53 is your DNS provider for the requested domain, the DNS record can be
created automatically:

```ts
new Certificate(this, 'Certificate', {
  domainName: 'hello.example.com',
  validation: CertificateValidation.fromDns(myHostedZone),
});
```

When working with multiple domains, you can specify a default validation hosted zone:

[multiple domains DNS validation](test/example.dns.lit.ts)

Use the `DnsValidatedCertificate` construct for cross-region certificate creation:

```ts
new DnsValidatedCertificate(this, 'CrossRegionCertificate', {
  domainName: 'hello.example.com',
  hostedZone: myHostedZone,
  region: 'us-east-1',
});
```

This is useful when deploying a stack in a region other than `us-east-1` with a
certificate for a CloudFront distribution.

If cross-region is not needed, the recommended solution is to use the
`Certificate` construct which uses a native CloudFormation implementation.


### Importing

If you want to import an existing certificate, you can do so from its ARN:

```ts
const arn = "arn:aws:...";
const certificate = Certificate.fromCertificateArn(this, 'Certificate', arn);
```

### Sharing between Stacks

To share the certificate between stacks in the same CDK application, simply
pass the `Certificate` object between the stacks.
