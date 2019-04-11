import cfn = require("@aws-cdk/aws-cloudformation");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/cdk");
import path = require("path");
import { GlobalTableProps } from "./aws-dynamodb-global";

/**
 * A stack that will make a Lambda that will launch a lambda to glue
 * together all the DynamoDB tables into a global table
 */
export class LambdaGlobalDynamoDBMaker extends cdk.Stack {
  /**
   * Permits an IAM Principal to create a global dynamodb table.
   * @param principal The principal (no-op if undefined)
   */
  public static grantCreateGlobalTableLambda(principal?: iam.IPrincipal): void {
    if (principal) {
      principal.addToPolicy(new iam.PolicyStatement()
        .allow()
        .addAllResources()
        .addAction("iam:CreateServiceLinkedRole")
        .addAction("application-autoscaling:DeleteScalingPolicy")
        .addAction("application-autoscaling:DeregisterScalableTarget")
        .addAction("dynamodb:CreateGlobalTable")
        .addAction("dynamodb:DescribeLimits")
        .addAction("dynamodb:DeleteTable")
        .addAction("dynamodb:DescribeGlobalTable")
        .addAction("dynamodb:UpdateGlobalTable"));
    }
  }

  /**
   * The singleton Lambda function that will connect all the DynamoDB tables together into a global table
   */
  public lambdaFunction: lambda.SingletonFunction;

  /**
   * The CloudFormation CustomResource that will manage the lambda
   */
  public customResource: cfn.CustomResource;

  constructor(scope: cdk.Construct, id: string, props: GlobalTableProps) {
    super(scope, id, props);
    this.lambdaFunction = new lambda.SingletonFunction(this, "SingletonLambda", {
      code: lambda.Code.asset(path.resolve(__dirname, "../", "lambda-packages", "aws-dynamodb-global-lambda", "lib")),
      description: "Lambda to make DynamoDB a global table",
      handler: "index.handler",
      runtime: lambda.Runtime.NodeJS810,
      timeout: 300,
      uuid: "D38B65A6-6B54-4FB6-9BAD-9CD40A6DAC12",
    });
    LambdaGlobalDynamoDBMaker.grantCreateGlobalTableLambda(this.lambdaFunction.role);
    this.customResource = new cfn.CustomResource(this, "CfnCustomResource", {
      lambdaProvider: this.lambdaFunction,
      properties: {
        regions: props.regions,
        resourceType: "Custom::MakeGlobalDynamoDB",
        tableName: props.tableName,
      },
    });
  }
}
