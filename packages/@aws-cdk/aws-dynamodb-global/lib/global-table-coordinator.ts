import cfn = require("@aws-cdk/aws-cloudformation");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");
import path = require("path");
import { GlobalTableProps } from "./aws-dynamodb-global";

/**
 * A stack that will make a Lambda that will launch a lambda to glue
 * together all the DynamoDB tables into a global table
 */
export class GlobalTableCoordinator extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: GlobalTableProps) {
    super(scope, id, props);
    const lambdaFunction = new lambda.SingletonFunction(this, "SingletonLambda", {
      code: lambda.Code.fromAsset(path.resolve(__dirname, "../", "lambda-packages", "aws-global-table-coordinator", "lib")),
      description: "Lambda to make DynamoDB a global table",
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: cdk.Duration.minutes(5),
      uuid: "D38B65A6-6B54-4FB6-9BAD-9CD40A6DAC12",
    });

    grantCreateGlobalTableLambda(lambdaFunction.role);

    new cfn.CustomResource(this, "CfnCustomResource", {
      provider: cfn.CustomResourceProvider.lambda(lambdaFunction),
      properties: {
        regions: props.regions,
        resourceType: "Custom::DynamoGlobalTableCoordinator",
        tableName: props.tableName,
      },
      removalPolicy: props.removalPolicy,
    });
  }
}

/**
 * Permits an IAM Principal to create a global dynamodb table.
 * @param principal The principal (no-op if undefined)
 */
function grantCreateGlobalTableLambda(principal?: iam.IPrincipal): void {
  if (principal) {
    principal.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        "iam:CreateServiceLinkedRole",
        "application-autoscaling:DeleteScalingPolicy",
        "application-autoscaling:DeregisterScalableTarget",
        "dynamodb:CreateGlobalTable", "dynamodb:DescribeLimits",
        "dynamodb:DeleteTable", "dynamodb:DescribeGlobalTable",
        "dynamodb:UpdateGlobalTable",
      ]
    }));
  }
}
