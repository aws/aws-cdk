/// !cdk-integ *
import lambda = require('@aws-cdk/aws-lambda');
import { App, Stack } from "@aws-cdk/core";
import path = require('path');
import { LambdaToDynamoDB } from "../../lib";

class TestStack extends Stack {
    constructor(scope: App, id: string) {
        super(scope, id);

        const lambdaObj = new lambda.Function(this, 'MyLambda', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_10_X
        });

        new LambdaToDynamoDB(this, 'LambdaToDynamoDB', {
            deployLambda: false,
            existingLambdaObj: lambdaObj
        });
    }
  }

const app = new App();

new TestStack(app, 'test-lambda-dynamodb-stack');

app.synth();