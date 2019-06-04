## AWS Certificate Manager Construct Library
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>


This package provides Constructs for provisioning and referencing certificates which
can be used in CloudFront and ELB.

### DNS-validated certificates

The `DnsValidatedCertificateRequest` class provides a Custom Resource by which
you can request a TLS certificate from AWS Certificate Manager that is
automatically validated using a cryptographically secure DNS record. For this to
work, there must be a Route 53 public zone that is responsible for serving
records under the Domain Name of the requested certificate. For example, if you
request a certificate for `www.example.com`, there must be a Route 53 public
zone `example.com` that provides authoritative records for the domain.

#### Example

```ts
import { HostedZoneProvider } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';

const hostedZone = new HostedZoneProvider(this, {
    domainName: 'example.com',
    privateZone: false
}).findAndImport(this, 'ExampleDotCom');

const certificate = new DnsValidatedCertificate(this, 'TestCertificate', {
    domainName: 'test.example.com',
    hostedZone: hostedZone
});
```

### Email validation

Otherwise, if certificates are created as part of a CloudFormation run, the
CloudFormation provisioning will not complete until domain ownership for the
certificate is completed. For email validation, this involves receiving an
email on one of a number of predefined domains and following the instructions
in the email. The email addresses use will be:

* admin@domain.com
* administrator@domain.com
* hostmaster@domain.com
* postmaster@domain.com
* webmaster@domain.com

Because of these blocks, it's probably better to provision your certificates either in a separate
stack from your main service, or provision them manually. In both cases, you'll import the
certificate into your stack afterwards.

#### Example

Provision a new certificate by creating an instance of `Certificate`. Email validation will be sent
to `example.com`:

```ts
const certificate = new Certificate(this, 'Certificate', {
    domainName: 'test.example.com'
});
```

### Importing

Import a certificate manually, if you know the ARN:

```ts
const certificate = Certificate.import(this, 'Certificate', {
    certificateArn: "arn:aws:..."
});
```

### Sharing between Stacks

To share the certificate between stacks in the same CDK application, simply
pass the `Certificate` object between the stacks.


## TODO

- [ ] Custom Resource that can look up the certificate ARN by domain name by querying ACM.
