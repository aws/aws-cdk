## AWS Certificate Manager Construct Library

This package provides Constructs for provisioning and referencing certificates which
can be used in CloudFront and ELB.

### Validation

If certificates are created as part of a CloudFormation run, the
CloudFormation provisioning will not complete until domain ownership for the
certificate is completed. For email validation, this involves receiving an
email on one of a number of predefined domains and following the instructions
in the email. The email addresses use will be:

* admin@domain.com
* administrator@domain.com
* hostmaster@domain.com
* postmaster@domain.com
* webmaster@domain.com

DNS validation is possible in ACM, but is not currently available in CloudFormation.
A Custom Resource will be developed for this, but is not currently available.

Because of these blocks, it's probably better to provision your certificates either in a separate
stack from your main service, or provision them manually. In both cases, you'll import the
certificate into your stack afterwards.

### Provisioning

Provision a new certificate by creating an instance of `Certificate`. Email validation will be sent
to `example.com`:

```ts
const certificate = new Certificate(this, 'Certificate', {
    domainName: 'test.example.com'
});
```

### Importing

Import a certificate either manually, if you know the ARN:

```ts
const certificate = Certificate.import(this, 'Certificate', {
    certificteArn: new Arn("arn:aws:...")
});
```

Or use exporting and importing mechanisms between stacks:

```ts
const certRef = certStack.certificate.export();

const certificate = Certificate.import(this, 'Certificate', certRef);
```

> We should probably also make a Custom Resource that can looks up the certificate ARN
> by domain name by querying ACM.
