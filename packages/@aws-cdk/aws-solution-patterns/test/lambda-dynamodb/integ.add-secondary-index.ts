/// !cdk-integ *
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import { App, Stack } from "@aws-cdk/core";
import path = require('path');
import { LambdaToDynamoDB } from "../../lib";
const app = new App();

// Add Global Secondary Index to Dynamo Table
const stack = new Stack(app, 'test-lambda-dynamodb-stack');

const construct: LambdaToDynamoDB = new LambdaToDynamoDB(stack, 'test-lambda-dynamodb-stack', {
  deployLambda: true,
  lambdaFunctionProps: {
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
  }
});

const props: dynamodb.GlobalSecondaryIndexProps = {
    partitionKey: {
        name: 'id2',
        type: dynamodb.AttributeType.STRING
    },
    indexName: 'test_id2'
};
construct.dynamoTable().addGlobalSecondaryIndex(props);

app.synth();