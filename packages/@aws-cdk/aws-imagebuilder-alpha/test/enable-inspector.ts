import * as cdk from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Creates an AwsCustomResource that enables Amazon Inspector for the given resource types.
 * Required for imageScanningEnabled to work in any account.
 */
export function enableInspector(stack: cdk.Stack, resourceTypes: string[]): cr.AwsCustomResource {
  return new cr.AwsCustomResource(stack, 'EnableInspector', {
    onCreate: {
      service: 'Inspector2',
      action: 'enable',
      parameters: { resourceTypes },
      physicalResourceId: cr.PhysicalResourceId.of(`EnableInspector-${resourceTypes.join('-')}`),
    },
    policy: cr.AwsCustomResourcePolicy.fromStatements([
      new iam.PolicyStatement({
        actions: ['inspector2:Enable', 'iam:CreateServiceLinkedRole'],
        resources: ['*'],
      }),
    ]),
  });
}
