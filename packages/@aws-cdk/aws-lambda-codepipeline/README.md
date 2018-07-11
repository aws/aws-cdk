## AWS CodePipline Actions for AWS Lambda

This module contains an Action that allows you to invoke a Lambda function from CodePipeline.

Example usage:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');
import lambdaCodepipeline = require('@aws-cdk/aws-lambda-codepipeline');

// see the @aws-cdk/aws-lambda module for more documentation on how to create Lamda functions
const lambdaFun = new lambda.Lambda(// ...
);

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const lambdaStage = new codepipeline.Stage(pipeline, 'Lambda');
new lambdaCodepipeline.PipelineInvokeAction(lambdaStage, 'Lambda', {
    lambda: lambdaFun,
});
```

See [the AWS documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html)
on how to write a Lambda function invoked from CodePipeline.
