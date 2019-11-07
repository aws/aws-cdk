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

This library provides higher-level multi-service L3 constructs which follow AWS prescriptive architectural patterns. It contains:

* AWS Lambda to Amazon DynamoDB

## AWS Lambda to Amazon DynamoDB Construct

This CDK construct implements the AWS Lambda function to Amazon DynamoDB table pattern. It will deploy a Lambda function and a DynamoDB table. It will apply the least privilege permissions for the Lambda function to read and write data from the DynamoDB table. Additionally, it will set the default input properties for the Lambda function and the DynamoDB table constructs, which can be overridden, if needed. Check the ```lib\core``` folder to see the default input properties.

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