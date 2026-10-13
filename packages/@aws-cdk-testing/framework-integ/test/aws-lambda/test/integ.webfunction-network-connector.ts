import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import {
  NetworkConnector,
  NetworkConnectorComputeType,
  NetworkConnectorConfiguration,
  WebFunction,
  WebFunctionAuthType,
  WebFunctionCode,
  WebFunctionRuntime,
} from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'WebFunctionNetworkConnectorStack');

// Isolated subnets: the connector provisions ENIs into them, and the test needs no
// egress of its own — no NAT gateways or internet gateway to slow the stack down.
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  natGateways: 0,
  subnetConfiguration: [
    { name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  ],
});

const securityGroup = new ec2.SecurityGroup(stack, 'ConnectorSecurityGroup', {
  vpc,
  allowAllOutbound: true,
});

const connector = new NetworkConnector(stack, 'Connector', {
  configuration: NetworkConnectorConfiguration.vpcEgress({
    computeType: NetworkConnectorComputeType.WEB_FUNCTION,
    vpc,
    securityGroups: [securityGroup],
  }),
});

// Same stack as the connector, so the revision pins the connector's latest version and
// follows it: an update to the connector replaces the revision in the same deployment.
const webFunction = new WebFunction(stack, 'Function', {
  code: WebFunctionCode.fromAssetToManagedBucket(path.join(__dirname, 'webfunction-handler')),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  authType: WebFunctionAuthType.IAM_AUTH,
  egressNetworkConnector: connector,
});

new cdk.CfnOutput(stack, 'ConnectorArn', { value: connector.networkConnectorArn });
new cdk.CfnOutput(stack, 'ConnectorVersionArn', { value: connector.latestVersionArn });

const testCase = new integ.IntegTest(app, 'WebFunctionNetworkConnectorTest', {
  testCases: [stack],
  diffAssets: false,
});

// The revision can only be created once the service accepts the connector version for a
// WebFunction, so a successful deployment covers the connector-to-function wiring.
// The endpoint uses IAM_AUTH, so an unsigned request is rejected with 403. Asserting 403 —
// rather than a connection error or 5xx — confirms the endpoint is live, reachable over TLS,
// and enforcing auth. It does not exercise the code or the VPC egress path: the signature
// check rejects the request before anything is invoked.
testCase.assertions
  .httpApiCall(`https://${webFunction.domainName}/`)
  .expect(integ.ExpectedResult.objectLike({ status: 403 }));
