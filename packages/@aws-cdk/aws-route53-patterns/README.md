# Route53 Patterns for the CDK Route53 Library
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Developer Preview](https://img.shields.io/badge/cdk--constructs-developer--preview-informational.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are in **developer preview** before they become stable. We will only make breaking changes to address unforeseen API issues. Therefore, these APIs are not subject to [Semantic Versioning](https://semver.org/), and breaking changes will be announced in release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

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
