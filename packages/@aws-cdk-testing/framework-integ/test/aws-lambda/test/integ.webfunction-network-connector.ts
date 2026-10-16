import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
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

// Isolated subnets: the connector provisions ENIs into them. With no NAT gateway or internet
// gateway, the only way out of the VPC is the S3 gateway endpoint added below.
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  natGateways: 0,
  subnetConfiguration: [
    { name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  ],
});

// The function proves its egress goes through the VPC by reading an object that the bucket
// serves only through this endpoint.
const s3Endpoint = vpc.addGatewayEndpoint('S3Endpoint', {
  service: ec2.GatewayVpcEndpointAwsService.S3,
});

const EGRESS_OBJECT_KEY = 'egress.txt';
const EGRESS_OBJECT_BODY = 'reached-through-the-vpc';

const egressBucket = new s3.Bucket(stack, 'EgressBucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  enforceSSL: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
// Unsigned reads of the one object, but only when they arrive through the endpoint. The
// aws:SourceVpce condition keeps this out of S3's definition of a public policy.
egressBucket.addToResourcePolicy(new iam.PolicyStatement({
  principals: [new iam.AnyPrincipal()],
  actions: ['s3:GetObject'],
  resources: [egressBucket.arnForObjects(EGRESS_OBJECT_KEY)],
  conditions: { StringEquals: { 'aws:SourceVpce': s3Endpoint.vpcEndpointId } },
}));

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
  code: WebFunctionCode.fromAssetToManagedBucket(path.join(__dirname, 'webfunction-egress-handler')),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  // The assertion below has to reach the handler, and integ-tests cannot sign requests.
  // The handler only returns the test object's fixed content, and the stack is torn down
  // after the test.
  authType: WebFunctionAuthType.APPLICATION_MANAGED,
  egressNetworkConnector: connector,
  environment: {
    OBJECT_URL: egressBucket.virtualHostedUrlForObject(EGRESS_OBJECT_KEY),
  },
});

new cdk.CfnOutput(stack, 'ConnectorArn', { value: connector.networkConnectorArn });
new cdk.CfnOutput(stack, 'ConnectorVersionArn', { value: connector.latestVersionArn });

const testCase = new integ.IntegTest(app, 'WebFunctionNetworkConnectorTest', {
  testCases: [stack],
  diffAssets: false,
});

// Write the object, then call the function. A 200 carrying the object's body shows that the
// handler runs and that its request left through the VPC's S3 endpoint, the only way to
// satisfy the bucket policy. Without working egress through the connector the handler
// returns 502.
testCase.assertions
  .awsApiCall('S3', 'putObject', {
    Bucket: egressBucket.bucketName,
    Key: EGRESS_OBJECT_KEY,
    Body: EGRESS_OBJECT_BODY,
  })
  .next(
    testCase.assertions
      .httpApiCall(`https://${webFunction.domainName}/`)
      .expect(integ.ExpectedResult.objectLike({
        status: 200,
        body: { object: EGRESS_OBJECT_BODY },
      })),
  );
