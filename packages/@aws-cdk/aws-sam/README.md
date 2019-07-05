## AWS Serverless Application Model Construct Library
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

This module includes low-level constructs that synthesize into `AWS::Serverless` resources.

```ts
const sam = require('@aws-cdk/aws-sam');
```

### Related

The following AWS CDK modules include constructs that can be used to work with Amazon API Gateway and AWS Lambda:

* [aws-lambda](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html): define AWS Lambda functions
* [aws-lambda-event-sources](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-event-sources-readme.html): classes that allow using various AWS services as event sources for AWS Lambda functions
* [aws-apigateway](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-apigateway-readme.html): define APIs through Amazon API Gateway
* [aws-codedeploy](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-codedeploy-readme.html#lambda-applications): define AWS Lambda deployment with traffic shifting support

