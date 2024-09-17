import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cr from 'aws-cdk-lib/custom-resources';
import { TOKEN_AWARE_STRINGIFY_LOGICAL_ID_FROM_TOKEN_VALUE } from 'aws-cdk-lib/cx-api';
function createInfra(stack: cdk.Stack) {
  const vpc = new ec2.Vpc(stack, 'MyVpc');
  const vpce = new ec2.InterfaceVpcEndpoint(stack, 'MyVpcEndpoint', {
    vpc,
    service: {
      name: `com.amazonaws.${stack.region}.execute-api`,
      port: 443,
    },
  });

  const policy = cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  });

  new cr.AwsCustomResource(stack, 'GetEndpointIp', {
    policy,
    onUpdate: {
      service: 'EC2',
      action: 'DescribeNetworkInterfaces',
      outputPaths: ['NetworkInterfaces.${index}.PrivateIpAddress'],
      parameters: {
        NetworkInterfaceIds: vpce.vpcEndpointNetworkInterfaceIds,
      },
      physicalResourceId: cr.PhysicalResourceId.of('resourceid'),
    },
  });
}

const app = new cdk.App();
const ffEnabledStack = new cdk.Stack(app, 'FFEnabledStack');
const ffDisabledStack = new cdk.Stack(app, 'FFDisabledStack');

ffEnabledStack.node.setContext(TOKEN_AWARE_STRINGIFY_LOGICAL_ID_FROM_TOKEN_VALUE, true);
ffDisabledStack.node.setContext(TOKEN_AWARE_STRINGIFY_LOGICAL_ID_FROM_TOKEN_VALUE, false);

createInfra(ffEnabledStack);
createInfra(ffDisabledStack);

new integ.IntegTest(app, 'TokenAwareStringifyLogicalIds', {
  testCases: [ffEnabledStack, ffDisabledStack],
});
