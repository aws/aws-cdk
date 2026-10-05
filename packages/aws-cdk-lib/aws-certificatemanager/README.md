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

## Requesting public SSL/TLS certificates exportable to use anywhere

AWS Certificate Manager can issue an exportable public certificate. There is a charge at certificate issuance and again when the certificate renews. See [opting out of certificate transparency logging](https://docs.aws.amazon.com/acm/latest/userguide/acm-exportable-certificates.html) for details.

```ts
new acm.Certificate(this, 'Certificate', {
  domainName: 'test.example.com',
  allowExport: true,
});
```

## Issuing certificates with ACME

AWS Certificate Manager can act as a managed [ACME](https://datatracker.ietf.org/doc/html/rfc8555) server. ACME clients such as
Certbot or cert-manager use an `AcmeEndpoint` to request publicly trusted certificates for workloads on infrastructure you
manage, such as on-premises servers or Kubernetes clusters. See
[ACME certificate automation](https://docs.aws.amazon.com/acm/latest/userguide/acm-acme.html) for details.

Compared with exportable certificates, the private key is generated by the ACME client and never leaves it, and the ACME
client renews the certificate itself. ACME-issued certificates are valid for 45 days and cannot be used with services
integrated with ACM such as Elastic Load Balancing, CloudFront or API Gateway. There is a charge for each certificate
issuance and renewal.

The CDK manages the endpoint, the domains it may issue certificates for, and the external account bindings (EAB) that ACME
clients register with. Certificates themselves are requested by the ACME clients at runtime.

```ts
declare const myHostedZone: route53.IHostedZone;

const endpoint = new acm.AcmeEndpoint(this, 'AcmeEndpoint', {
  certificateAuthority: acm.AcmeCertificateAuthority.public({
    allowedKeyAlgorithms: [acm.KeyAlgorithm.EC_PRIME256V1], // optional, default allows all supported algorithms
  }),
  contactRequired: true, // optional, require ACME clients to register a contact email
});

// Pre-approve the domain. ACM creates the validation record in the hosted zone.
endpoint.addDomainValidation('ExampleCom', {
  domainName: 'example.com',
  hostedZone: myHostedZone, // optional, otherwise create the DNS validation record manually
  allowExactDomain: true,
  allowSubdomains: true,
  allowWildcards: false,
});

// Credentials for an ACME client
endpoint.addExternalAccountBinding('WebTeam');
```

Provide the `endpoint.endpointUrl` to your ACME clients. The key ID and MAC key of an external account binding are not
available through CloudFormation. Retrieve them with
`aws acm get-acme-external-account-binding-credentials --acme-external-account-binding-arn <arn>` and handle them like an
access key.

### External account binding roles

Each external account binding is associated with an IAM role that authorizes certificate issuance and revocation for
the ACME clients registered with it. By default, a role is created that may issue, tag and revoke ACME certificates
for any domain validated on the endpoint. It can only be assumed by ACM on behalf of your account, and its permissions
only apply to sessions that ACM establishes for this endpoint. Restrict it further with the same condition keys that
apply to `acm:RequestCertificate`:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration } from 'aws-cdk-lib';

declare const endpoint: acm.AcmeEndpoint;

const binding = endpoint.addExternalAccountBinding('ApiTeam', {
  expiration: Duration.days(30), // optional, credentials can no longer register new ACME accounts after 30 days
});
binding.role.addToPrincipalPolicy(new iam.PolicyStatement({
  effect: iam.Effect.DENY,
  actions: ['acm:RequestCertificate'],
  resources: ['*'],
  conditions: { 'ForAnyValue:StringNotLike': { 'acm:DomainNames': '*.api.example.com' } },
}));
```

You can also bring your own role. It must trust the `acm-acme.amazonaws.com` service principal, and no permissions are
added to it. See [IAM for ACME certificate automation](https://docs.aws.amazon.com/acm/latest/userguide/security-iam-acme.html).

```ts
import * as iam from 'aws-cdk-lib/aws-iam';

declare const endpoint: acm.AcmeEndpoint;
declare const issuanceRole: iam.IRole;

endpoint.addExternalAccountBinding('OpsTeam', { role: issuanceRole });
```

### ACME metrics

ACME endpoints publish the `CertificateIssuanceSuccess` and `CertificateIssuanceFailed` metrics:

```ts
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

declare const endpoint: acm.AcmeEndpoint;

endpoint.metrics.metricCertificateIssuanceFailed().createAlarm(this, 'IssuanceFailures', {
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
  evaluationPeriods: 1,
  threshold: 1,
});
```

### Importing an ACME endpoint

```ts
const endpoint = acm.AcmeEndpoint.fromAcmeEndpointAttributes(this, 'Endpoint', {
  acmeEndpointArn: 'arn:aws:acm:us-east-1:123456789012:acme-endpoint/11111111-2222-3333-4444-555555555555',
  endpointUrl: 'https://acm-acme-enroll.us-east-1.api.aws/11111111-2222-3333-4444-555555555555/directory', // optional
});
endpoint.addDomainValidation('ExampleNet', { domainName: 'example.net' });
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
renewal using the following code:

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
