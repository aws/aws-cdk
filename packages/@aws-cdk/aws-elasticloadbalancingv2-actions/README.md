# Actions for AWS Elastic Load Balancing V2
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

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
