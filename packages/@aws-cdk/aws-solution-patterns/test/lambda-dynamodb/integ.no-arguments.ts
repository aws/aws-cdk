/// !cdk-integ *
import lambda = require('@aws-cdk/aws-lambda');
import { App, Stack } from "@aws-cdk/core";
import path = require('path');
import { LambdaToDynamoDB, LambdaToDynamoDBProps } from "../../lib";
const app = new App();

// Empty arguments
const stack = new Stack(app, 'test-lambda-dynamodb-stack');

const props: LambdaToDynamoDBProps = {
  deployLambda: true,
  lambdaFunctionProps: {
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
  }
};

new LambdaToDynamoDB(stack, 'test-lambda-dynamodb-stack', props);
app.synth();