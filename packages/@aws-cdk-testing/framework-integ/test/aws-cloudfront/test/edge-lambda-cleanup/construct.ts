import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda'; // eslint-disable-line @typescript-eslint/consistent-type-imports
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs'; // eslint-disable-line @typescript-eslint/consistent-type-imports

/**
 * Adds a custom resource that deletes Lambda@Edge functions on stack teardown,
 * retrying until replicas are cleaned up by CloudFront.
 *
 * Sets removalPolicy RETAIN on the functions so CFN skips deleting them
 * (which fails immediately on replicated functions). The custom resource
 * then handles the actual deletion with retries, so no resources are left over.
 */
export class EdgeLambdaCleanup extends Construct {
  constructor(scope: Construct, id: string, props: { functions: lambda.IFunction[]; runtime: lambda.Runtime }) {
    super(scope, id);

    const arns = props.functions.map((f: lambda.IFunction) => f.functionArn);

    const cleanupFn = new NodejsFunction(this, 'Handler', {
      entry: path.join(__dirname, 'index.ts'),
      handler: 'handler',
      runtime: props.runtime,
      timeout: cdk.Duration.minutes(15),
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['lambda:DeleteFunction'],
          resources: arns.flatMap((arn: string) => [arn, `${arn}:*`]),
        }),
      ],
    });

    new cdk.CustomResource(this, 'CR', {
      serviceToken: new cr.Provider(this, 'Provider', {
        onEventHandler: cleanupFn,
      }).serviceToken,
      properties: {
        FunctionArns: arns,
      },
    });

    for (const fn of props.functions) {
      // EdgeFunction creates its Lambda in a separate cross-region stack,
      // so there's no CfnResource to set RETAIN on here. The cleanup
      // handler deletes those functions by ARN before the stacks tear down.
      const cfnResource = fn.node.defaultChild as cdk.CfnResource | undefined;
      if (cfnResource) {
        cfnResource.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
      }
    }
  }
}
