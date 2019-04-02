import cfn = require("@aws-cdk/aws-cloudformation");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/cdk");
import { DynamoDBGlobalStackProps } from "./aws-dynamodb-global";
/**
 * A stack that will make a Lambda that will launch a lambda to glue
 * together all the DynamoDB tables into a global table
 */
export declare class LambdaGlobalDynamoDBMaker extends cdk.Stack {
    /**
     * The singleton Lambda function that will connect all the DynamoDB tables together into a global table
     */
    lambdaFunction: lambda.IFunction;
    /**
     * The content of the lambdaFunction (python3.7 using boto3)
     */
    lambdaFunctionContent: string;
    /**
     * The CloudFormation CustomResource that will manage the lambda
     */
    customResource: cfn.CustomResource;
    constructor(scope: cdk.Construct, id: string, props: DynamoDBGlobalStackProps);
}
