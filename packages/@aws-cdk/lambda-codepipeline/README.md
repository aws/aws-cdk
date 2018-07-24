## AWS Lambda Construct Library for AWS CodePipeline Actions

This module contains an Action that allows you to invoke a Lambda function from CodePipeline.

Example usage:

```ts
import * as codepipeline from '@aws-cdk/codepipeline';
import * as lambda from '@aws-cdk/lambda';
import * as lambda_codepipeline from '@aws-cdk/lambda-codepipeline';

// see the @aws-cdk/lambda module for more documentation on how to create Lamda functions
const lambdaFun = new lambda.Lambda(// ...
);

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const lambdaStage = new codepipeline.Stage(pipeline, 'Lambda');
new lambda_codepipeline.PipelineInvokeAction(lambdaStage, 'Lambda', {
    lambda: lambdaFun,
});
```
