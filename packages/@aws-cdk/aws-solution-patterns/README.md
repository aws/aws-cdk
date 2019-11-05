# CDK Construct library for higher-level multi-service Constructs
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This library provides higher-level multi-service constructs which follow AWS prescriptive architectural patterns. It contains:

* AWS Lambda to Amazon DynamoDB

## AWS Lambda to Amazon DynamoDB Construct

This CDK construct implements the AWS Lambda function to Amazon DynamoDB pattern

Here is a minimal deployable pattern definition:

```
const { LambdaToDynamoDB } = require('@aws-cdk/aws-solution-patterns');

new LambdaToDynamoDB(stack, 'LambdaToDynamoDB', {
  deployLambda: true,
  lambdaFunctionProps: {
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler'
  }
});

```