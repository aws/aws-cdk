# Route53 Patterns for the CDK Route53 Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.


---
<!--END STABILITY BANNER-->

This library contains commonly used patterns for Route53.


## HTTPS Redirect

This construct allows creating a simple domainA -> domainB redirect using CloudFront and S3. You can specify multiple domains to be redirected.

  ```ts
  new HttpsRedirect(stack, 'Redirect', {
    recordNames: ['foo.example.com'],
    targetDomain: 'bar.example.com',
    zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'ID',
      zoneName: 'example.com',
    })
  });
  ```

See the documentation of `@aws-cdk/aws-route53-patterns` for more information.
