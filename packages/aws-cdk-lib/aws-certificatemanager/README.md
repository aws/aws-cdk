# AWS Certificate Manager Construct Library



AWS Certificate Manager (ACM) handles the complexity of creating, storing, and renewing public and private SSL/TLS X.509 certificates and keys that
protect your AWS websites and applications. ACM certificates can secure singular domain names, multiple specific domain names, wildcard domains, or
combinations of these. ACM wildcard certificates can protect an unlimited number of subdomains.

This package provides Constructs for provisioning and referencing ACM certificates which can be used with CloudFront and ELB.

After requesting a certificate, you will need to prove that you own the
domain in question before the certificate will be granted. The CloudFormation
deployment will wait until this verification process has been completed.

Because of this wait time, when using manual validation methods, it's better
to provision your certificates either in a separate stack from your main
service, or provision them manually and import them into your CDK application.

**Note:** There is a limit on total number of ACM certificates that can be requested on an account and region within a year.
The default limit is 2000, but this limit may be (much) lower on new AWS accounts.
See https://docs.aws.amazon.com/acm/latest/userguide/acm-limits.html for more information.

## DNS validation

DNS validation is the preferred method to validate domain ownership, as it has a number of advantages over email validation.
See also [Validate with DNS](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html)
in the AWS Certificate Manager User Guide.

If Amazon Route 53 is your DNS provider for the requested domain, the DNS record can be
created automatically:

```ts
const myHostedZone = new route53.HostedZone(this, 'HostedZone', {
  zoneName: 'example.com',
});
new acm.Certificate(this, 'Certificate', {
  domainName: 'hello.example.com',
  certificateName: 'Hello World Service', // Optionally provide an certificate name
  validation: acm.CertificateValidation.fromDns(myHostedZone),
});
```

If Route 53 is not your DNS provider, the DNS records must be added manually and the stack will not complete
creating until the records are added.

```ts
new acm.Certificate(this, 'Certificate', {
  domainName: 'hello.example.com',
  validation: acm.CertificateValidation.fromDns(), // Records must be added manually
});
```

When working with multiple domains, use the `CertificateValidation.fromDnsMultiZone()`:

```ts
const exampleCom = new route53.HostedZone(this, 'ExampleCom', {
  zoneName: 'example.com',
});
const exampleNet = new route53.HostedZone(this, 'ExampleNet', {
  zoneName: 'example.net',
});

const cert = new acm.Certificate(this, 'Certificate', {
  domainName: 'test.example.com',
  subjectAlternativeNames: ['cool.example.com', 'test.example.net'],
  validation: acm.CertificateValidation.fromDnsMultiZone({
    'test.example.com': exampleCom,
    'cool.example.com': exampleCom,
    'test.example.net': exampleNet,
  }),
});
```

## Email validation

Email-validated certificates (the default) are validated by receiving an
email on one of a number of predefined domains and following the instructions
in the email.

See [Validate with Email](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-email.html)
in the AWS Certificate Manager User Guide.

```ts
new acm.Certificate(this, 'Certificate', {
  domainName: 'hello.example.com',
  validation: acm.CertificateValidation.fromEmail(), // Optional, this is the default
});
```

## Cross-region Certificates

ACM certificates that are used with CloudFront -- or higher-level constructs which rely on CloudFront -- must be in the `us-east-1` region.
CloudFormation allows you to create a Stack with a CloudFront distribution in any region. In order
to create an ACM certificate in us-east-1 and reference it in a CloudFront distribution is a
different region, it is recommended to perform a multi stack deployment.

Enable the Stack property `crossRegionReferences`
in order to access the cross stack/region certificate.

> **This feature is currently experimental**

```ts
import { aws_cloudfront as cloudfront, aws_cloudfront_origins as origins } from 'aws-cdk-lib';
declare const app: App;

const stack1 = new Stack(app, 'Stack1', {
  env: {
    region: 'us-east-1',
  },
  crossRegionReferences: true,
});
const cert = new acm.Certificate(stack1, 'Cert', {
  domainName: '*.example.com',
  validation: acm.CertificateValidation.fromDns(PublicHostedZone.fromHostedZoneId(stack1, 'Zone', 'ZONE_ID')),
});

const stack2 = new Stack(app, 'Stack2', {
  env: {
    region: 'us-east-2',
  },
  crossRegionReferences: true,
});

new cloudfront.Distribution(stack2, 'Distribution', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('example.com'),
  },
  domainNames: ['dev.example.com'],
  certificate: cert,
});
```

## Requesting private certificates

AWS Certificate Manager can create [private certificates](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-private.html) issued by [Private Certificate Authority (PCA)](https://docs.aws.amazon.com/acm-pca/latest/userguide/PcaWelcome.html). Validation of private certificates is not necessary.

```ts
import * as acmpca from 'aws-cdk-lib/aws-acmpca';

new acm.PrivateCertificate(this, 'PrivateCertificate', {
  domainName: 'test.example.com',
  subjectAlternativeNames: ['cool.example.com', 'test.example.net'], // optional
  certificateAuthority: acmpca.CertificateAuthority.fromCertificateAuthorityArn(this, 'CA',
    'arn:aws:acm-pca:us-east-1:123456789012:certificate-authority/023077d8-2bfa-4eb0-8f22-05c96deade77'),
  keyAlgorithm: acm.KeyAlgorithm.RSA_2048, // optional, default algorithm is RSA_2048
});
```

## Requesting certificates without transparency logging

Transparency logging can be opted out of for AWS Certificate Manager certificates. See [opting out of certificate transparency logging](https://docs.aws.amazon.com/acm/latest/userguide/acm-bestpractices.html#best-practices-transparency) for limits.

```ts
new acm.Certificate(this, 'Certificate', {
  domainName: 'test.example.com',
  transparencyLoggingEnabled: false,
});
```

## Key Algorithms

To specify the algorithm of the public and private key pair that your certificate uses to encrypt data use the `keyAlgorithm` property.

Algorithms supported for an ACM certificate request include:
 * `RSA_2048`
 * `EC_prime256v1`
 * `EC_secp384r1`

```ts
new acm.Certificate(this, 'Certificate', {
  domainName: 'test.example.com',
  keyAlgorithm: acm.KeyAlgorithm.EC_PRIME256V1,
});
```

> Visit [Key algorithms](https://docs.aws.amazon.com/acm/latest/userguide/acm-certificate.html#algorithms.title) for more details.

## Importing

If you want to import an existing certificate, you can do so from its ARN:

```ts
const arn = 'arn:aws:...';
const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', arn);
```

## Sharing between Stacks

To share the certificate between stacks in the same CDK application, simply
pass the `Certificate` object between the stacks.

## Metrics

The `DaysToExpiry` metric is available via the `metricDaysToExpiry` method for
all certificates. This metric is emitted by AWS Certificates Manager once per
day until the certificate has effectively expired.

An alarm can be created to determine whether a certificate is soon due for
renewal ussing the following code:

```ts
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

declare const myHostedZone: route53.HostedZone;
const certificate = new acm.Certificate(this, 'Certificate', {
  domainName: 'hello.example.com',
  validation: acm.CertificateValidation.fromDns(myHostedZone),
});
certificate.metricDaysToExpiry().createAlarm(this, 'Alarm', {
  comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
  evaluationPeriods: 1,
  threshold: 45, // Automatic rotation happens between 60 and 45 days before expiry
});
```
