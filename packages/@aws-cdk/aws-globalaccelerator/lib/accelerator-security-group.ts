import { ISecurityGroup, SecurityGroup, IVpc } from '@aws-cdk/aws-ec2';

import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { EndpointGroup } from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * The security group used by a Global Accelerator to send traffic to resources in a VPC.
 */
export class AcceleratorSecurityGroup {
  /**
   * Lookup the Global Accelerator security group at CloudFormation deployment time.
   *
   * As of this writing, Global Accelerators (AGA) create a single security group per VPC. AGA security groups are shared
   * by all AGAs in an account. Additionally, there is no CloudFormation mechanism to reference the AGA security groups.
   *
   * This makes creating security group rules which allow traffic from an AGA complicated in CDK. This lookup will identify
   * the AGA security group for a given VPC at CloudFormation deployment time, and lets you create rules for traffic from AGA
   * to other resources created by CDK.
   */
  public static fromVpc(scope: Construct, id: string, vpc: IVpc, endpointGroup: EndpointGroup): ISecurityGroup {

    // The security group name is always 'GlobalAccelerator'
    const globalAcceleratorSGName = 'GlobalAccelerator';

    // How to reference the security group name in the response from EC2
    const ec2ResponseSGIdField = 'SecurityGroups.0.GroupId';

    // The AWS Custom Resource that make a call to EC2 to get the security group ID, for the given VPC
    const lookupAcceleratorSGCustomResource = new AwsCustomResource(scope, id + 'CustomResource', {
      onCreate: {
        service: 'EC2',
        action: 'describeSecurityGroups',
        parameters: {
          Filters: [
            {
              Name: 'group-name',
              Values: [
                globalAcceleratorSGName,
              ],
            },
            {
              Name: 'vpc-id',
              Values: [
                vpc.vpcId,
              ],
            },
          ],
        },
        // We get back a list of responses, but the list should be of length 0 or 1
        // Getting no response means no resources have been linked to the AGA
        physicalResourceId: PhysicalResourceId.fromResponse(ec2ResponseSGIdField),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // Look up the security group ID
    const sg = SecurityGroup.fromSecurityGroupId(scope,
      id,
      lookupAcceleratorSGCustomResource.getResponseField(ec2ResponseSGIdField));
    // We add a dependency on the endpoint group, guaranteeing that CloudFormation won't
    // try and look up the SG before AGA creates it. The SG is created when a VPC resource
    // is associated with an AGA
    lookupAcceleratorSGCustomResource.node.addDependency(endpointGroup);
    return sg;
  }

  private constructor() {}
}
