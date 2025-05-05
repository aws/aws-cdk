import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'restapi-ip-address-type-test-stack');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  natGateways: 0,
});
const vpcEndpoint = vpc.addInterfaceEndpoint('VpcEndpoint', {
  service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
  privateDnsEnabled: true,
});

const edgeIpv4Api = new apigateway.RestApi(stack, 'EdgeIpv4Api', {
  endpointConfiguration: {
    types: [apigateway.EndpointType.EDGE],
    ipAddressType: apigateway.IpAddressType.IPV4,
  },
});
edgeIpv4Api.root.addMethod('GET');

const edgeDualStackApi = new apigateway.RestApi(stack, 'EdgeDualStackApi', {
  endpointConfiguration: {
    types: [apigateway.EndpointType.EDGE],
    ipAddressType: apigateway.IpAddressType.DUAL_STACK,
  },
});
edgeDualStackApi.root.addMethod('GET');

const regionalIpv4Api = new apigateway.RestApi(stack, 'RegionalIpv4Api', {
  endpointConfiguration: {
    types: [apigateway.EndpointType.REGIONAL],
    ipAddressType: apigateway.IpAddressType.IPV4,
  },
});
regionalIpv4Api.root.addMethod('GET');

const regionalDualStackApi = new apigateway.RestApi(stack, 'RegionalDualStackApi', {
  endpointConfiguration: {
    types: [apigateway.EndpointType.REGIONAL],
    ipAddressType: apigateway.IpAddressType.DUAL_STACK,
  },
});
regionalDualStackApi.root.addMethod('GET');

const privateDualstackApi = new apigateway.RestApi(stack, 'PrivateDualStackApi', {
  endpointConfiguration: {
    types: [apigateway.EndpointType.PRIVATE],
    ipAddressType: apigateway.IpAddressType.DUAL_STACK,
  },
});
privateDualstackApi.root.addMethod('GET');
privateDualstackApi.grantInvokeFromVpcEndpointsOnly([vpcEndpoint]);

new IntegTest(app, 'restapi-ip-address-type-test-integ', {
  testCases: [stack],
});
