/// !cdk-integ *
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import { App, Stack } from "@aws-cdk/core";
import path = require('path');
import { LambdaToDynamoDB } from "../../lib";
const app = new App();

// Change the billing mode to PAY_PER_REQUEST
const stack = new Stack(app, 'test-lambda-dynamodb-stack');

new LambdaToDynamoDB(stack, 'test-lambda-dynamodb-stack', {
    dynamoTableProps: {
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
            name: 'id',
            type: dynamodb.AttributeType.STRING
        }
    },
    deployLambda: true,
    lambdaFunctionProps: {
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'index.handler',
    }
});

app.synth();