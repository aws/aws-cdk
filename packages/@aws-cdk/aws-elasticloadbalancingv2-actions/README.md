# Actions for AWS Elastic Load Balancing V2
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

This package contains integration actions for ELBv2. See the README of the `@aws-cdk/aws-elasticloadbalancingv2` library.

## Cognito

ELB allows for requests to be authenticated against a Cognito user pool using
the `AuthenticateCognitoAction`. For details on the setup's requirements,
read [Prepare to use Amazon
Cognito](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html#cognito-requirements).
Here's an example:

[Example of using AuthenticateCognitoAction](test/integ.cognito.lit.ts)

> NOTE: this example seems incomplete, I was not able to get the redirect back to the
Load Balancer after authentication working. Would love some pointers on what a full working
setup actually looks like!
