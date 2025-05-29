import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cr from 'aws-cdk-lib/custom-resources';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'Stack');

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

new integ.IntegTest(app, 'TokenAwareStringifyLogicalIds', {
  testCases: [stack],
});
