import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cr from 'aws-cdk-lib/custom-resources';

/**
 * Creates a custom resource that enables Amazon Inspector for the given resource types
 * and waits until the status is ENABLED before returning.
 *
 * The inspector2:Enable API is async — it returns ENABLING immediately.
 * A simple AwsCustomResource cannot poll, so we use a NodejsFunction that
 * calls Enable then polls BatchGetAccountStatus until all requested
 * resource types report ENABLED.
 */
export function enableInspector(stack: cdk.Stack, resourceTypes: string[]): cdk.CustomResource {
  const fn = new lambda.NodejsFunction(stack, 'EnableInspectorFunction', {
    entry: path.join(__dirname, 'enable-inspector.handler.ts'),
    timeout: cdk.Duration.minutes(5),
    initialPolicy: [
      new iam.PolicyStatement({
        actions: ['inspector2:Enable', 'inspector2:BatchGetAccountStatus'],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        actions: ['iam:CreateServiceLinkedRole'],
        resources: [
          'arn:aws:iam::*:role/aws-service-role/inspector2.amazonaws.com/*',
          'arn:aws:iam::*:role/aws-service-role/agentless.inspector2.amazonaws.com/*',
        ],
        conditions: {
          StringEquals: {
            'iam:AWSServiceName': [
              'inspector2.amazonaws.com',
              'agentless.inspector2.amazonaws.com',
            ],
          },
        },
      }),
    ],
  });

  const provider = new cr.Provider(stack, 'EnableInspectorProvider', {
    onEventHandler: fn,
  });

  return new cdk.CustomResource(stack, 'EnableInspector', {
    serviceToken: provider.serviceToken,
    properties: { resourceTypes },
  });
}
