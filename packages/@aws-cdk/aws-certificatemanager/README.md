## Amazon Certificate Manager Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


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
in the Amazon Certificate Manager User Guide.

### DNS validation

DNS-validated certificates are validated by configuring appropriate DNS
records for your domain.

See [Validate with DNS](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html)
in the Amazon Certificate Manager User Guide.

### Automatic DNS-validated certificates using Route53

The `DnsValidatedCertificateRequest` class provides a Custom Resource by which
you can request a TLS certificate from AWS Certificate Manager that is
automatically validated using a cryptographically secure DNS record. For this to
work, there must be a Route 53 public zone that is responsible for serving
records under the Domain Name of the requested certificate. For example, if you
request a certificate for `www.example.com`, there must be a Route 53 public
zone `example.com` that provides authoritative records for the domain.

Example:

[request a validated certificate example](test/example.dns-validated-request.lit.ts)

### Importing

If you want to import an existing certificate, you can do so from its ARN:

```ts
const arn = "arn:aws:...";
const certificate = Certificate.fromCertificateArn(this, 'Certificate', arn);
```

### Sharing between Stacks

To share the certificate between stacks in the same CDK application, simply
pass the `Certificate` object between the stacks.