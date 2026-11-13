/**
 * Integration test: Gateway targets that trust a private CA certificate.
 *
 * The MCP server sits behind an internal ALB whose HTTPS listener serves a
 * certificate issued by a throwaway private CA. A custom resource generates the CA
 * and the server certificate at deploy time (for the ALB's DNS name), imports the
 * server certificate into ACM for the listener, and uploads the CA certificate to
 * S3 and Secrets Manager.
 *
 * The MCP Server targets point at the same endpoint and reference the CA in S3
 * (CertificateConfiguration.fromBucket) or in Secrets Manager
 * (CertificateConfiguration.fromSecret). AgentCore calls `initialize` and
 * `tools/list` on the endpoint while the target stabilizes, so a target only
 * reaches READY if the gateway trusted the private CA, which requires the
 * gateway role to have been granted read access to the certificate.
 *
 * The service only accepts certificate configurations on targets with a private
 * endpoint. Two targets reach the internal ALB through a VPC Lattice resource gateway
 * that the gateway manages (PrivateEndpoint.fromVpc), and a third one through a
 * resource gateway and resource configuration defined in this stack
 * (PrivateEndpoint.fromResourceConfiguration).
 */

/// !cdk-integ cdk-agentcore-gateway-target-certificate

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as vpclattice from 'aws-cdk-lib/aws-vpclattice';
import * as cr from 'aws-cdk-lib/custom-resources';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-agentcore-gateway-target-certificate');

// ---------------------------------------------------------------------------
// MCP server: Lambda behind an internal ALB
// ---------------------------------------------------------------------------

const mcpServer = new lambda.Function(stack, 'McpServer', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
exports.handler = async (event) => {
  const raw = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString() : event.body;
  const body = raw ? JSON.parse(raw) : {};
  const id = body.id ?? null;
  let result;
  switch (body.method) {
    case 'initialize':
      result = {
        protocolVersion: body.params?.protocolVersion ?? '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: { name: 'integ-private-ca-mcp-server', version: '0.0.1' },
      };
      break;
    case 'tools/list':
      result = {
        tools: [{
          name: 'echo',
          description: 'Echoes the input back',
          inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] },
        }],
      };
      break;
    case 'notifications/initialized':
      return { statusCode: 202, statusDescription: '202 Accepted', isBase64Encoded: false, headers: {}, body: '' };
    default:
      result = undefined;
  }
  const payload = result !== undefined
    ? { jsonrpc: '2.0', id, result }
    : { jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } };
  return {
    statusCode: 200,
    statusDescription: '200 OK',
    isBase64Encoded: false,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
};
  `),
});

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  natGateways: 0,
  subnetConfiguration: [{ name: 'Isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED }],
  restrictDefaultSecurityGroup: false,
});

const alb = new elbv2.ApplicationLoadBalancer(stack, 'Alb', {
  vpc,
  internetFacing: false,
});

// Security group for the VPC Lattice resource gateway that AgentCore manages in the VPC.
const resourceGatewaySecurityGroup = new ec2.SecurityGroup(stack, 'ResourceGatewaySecurityGroup', { vpc });
alb.connections.allowFrom(resourceGatewaySecurityGroup, ec2.Port.tcp(443));

// ---------------------------------------------------------------------------
// Private CA: generate, import to ACM, upload to S3 and Secrets Manager
// ---------------------------------------------------------------------------

const caBucket = new s3.Bucket(stack, 'CaBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const caObjectKey = 'certs/private-root-ca.pem';

const caSecret = new secretsmanager.Secret(stack, 'CaSecret', {
  description: 'Private root CA certificate for the AgentCore gateway target certificate integ test',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const generatorFunction = new lambda.Function(stack, 'PrivateCaGenerator', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'private-ca-generator')),
  timeout: cdk.Duration.minutes(5),
});
caBucket.grantPut(generatorFunction, caObjectKey);
caSecret.grantWrite(generatorFunction);
generatorFunction.addToRolePolicy(new iam.PolicyStatement({
  actions: ['acm:ImportCertificate', 'acm:DeleteCertificate'],
  resources: ['*'],
}));

const privateCa = new cdk.CustomResource(stack, 'PrivateCa', {
  serviceToken: new cr.Provider(stack, 'PrivateCaProvider', { onEventHandler: generatorFunction }).serviceToken,
  properties: {
    DnsName: alb.loadBalancerDnsName,
    BucketName: caBucket.bucketName,
    ObjectKey: caObjectKey,
    SecretArn: caSecret.secretArn,
  },
});

const listener = alb.addListener('Https', {
  port: 443,
  protocol: elbv2.ApplicationProtocol.HTTPS,
  certificates: [elbv2.ListenerCertificate.fromArn(privateCa.getAttString('CertificateArn'))],
  open: false,
});
listener.addTargets('McpServer', {
  targets: [new targets.LambdaTarget(mcpServer)],
});

// ---------------------------------------------------------------------------
// Gateway and targets under test
// ---------------------------------------------------------------------------

const gateway = new agentcore.Gateway(stack, 'Gateway', {
  gatewayName: 'private-ca-cert-gw',
});

const endpoint = `https://${alb.loadBalancerDnsName}/mcp`;

// Certificate configurations are only supported for targets with a private endpoint.
const privateEndpoint = agentcore.PrivateEndpoint.fromVpc({
  vpc,
  securityGroups: [resourceGatewaySecurityGroup],
});

const s3Target = gateway.addMcpServerTarget('S3CaTarget', {
  gatewayTargetName: 'private-ca-from-s3',
  endpoint,
  credentialProviderConfigurations: [],
  certificateConfigurations: [
    agentcore.CertificateConfiguration.fromBucket(caBucket, caObjectKey),
  ],
  privateEndpoint,
});

const secretTarget = gateway.addMcpServerTarget('SecretCaTarget', {
  gatewayTargetName: 'private-ca-from-secret',
  endpoint,
  credentialProviderConfigurations: [],
  certificateConfigurations: [
    agentcore.CertificateConfiguration.fromSecret(caSecret),
  ],
  privateEndpoint,
});

// A VPC Lattice resource gateway and resource configuration managed in this stack,
// for a target that uses PrivateEndpoint.fromResourceConfiguration().
const resourceGateway = new vpclattice.CfnResourceGateway(stack, 'ResourceGateway', {
  name: 'private-ca-cert-rgw',
  vpcIdentifier: vpc.vpcId,
  subnetIds: vpc.isolatedSubnets.map((subnet) => subnet.subnetId),
  securityGroupIds: [resourceGatewaySecurityGroup.securityGroupId],
  ipAddressType: 'IPV4',
});

const resourceConfiguration = new vpclattice.CfnResourceConfiguration(stack, 'ResourceConfiguration', {
  name: 'private-ca-cert-rcfg',
  resourceConfigurationType: 'SINGLE',
  resourceGatewayId: resourceGateway.attrId,
  protocolType: 'TCP',
  portRanges: ['443'],
  resourceConfigurationDefinition: {
    dnsResource: { domainName: alb.loadBalancerDnsName, ipAddressType: 'IPV4' },
  },
});

const selfManagedTarget = gateway.addMcpServerTarget('SelfManagedLatticeTarget', {
  gatewayTargetName: 'private-ca-self-managed-lattice',
  endpoint,
  credentialProviderConfigurations: [],
  certificateConfigurations: [
    agentcore.CertificateConfiguration.fromSecret(caSecret),
  ],
  privateEndpoint: agentcore.PrivateEndpoint.fromResourceConfiguration(resourceConfiguration.attrId),
});

// The CA must be uploaded and the listener serving before the targets are created.
for (const target of [s3Target, secretTarget, selfManagedTarget]) {
  target.node.addDependency(privateCa, listener);
}

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

const integTest = new integ.IntegTest(app, 'GatewayTargetCertificate', {
  testCases: [stack],
  regions: ['us-east-1'],
});

// The SDK bundled with the assertion provider drops the certificateConfigurations and
// privateEndpoint fields of GetGatewayTarget, which it does not know yet. This function
// calls the API with a signed HTTP request and returns the raw response.
const targetGetter = new lambda.Function(stack, 'GatewayTargetGetter', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'gateway-target-getter')),
  timeout: cdk.Duration.seconds(30),
});
targetGetter.addToRolePolicy(new iam.PolicyStatement({
  actions: ['bedrock-agentcore:GetGatewayTarget'],
  resources: ['*'],
}));

// READY requires the gateway to have completed the TLS handshake against the private CA,
// because AgentCore lists the tools of an MCP server target while the target stabilizes.
const expectReady = (target: agentcore.GatewayTarget, expected: object) => {
  integTest.assertions.invokeFunction({
    functionName: targetGetter.functionName,
    payload: JSON.stringify({ gatewayIdentifier: gateway.gatewayId, targetId: target.targetId }),
  }).expect(integ.ExpectedResult.objectLike({
    // serializedJson matches exactly, so wrap the pattern to match the response partially.
    Payload: integ.Match.serializedJson(integ.Match.objectLike({ status: 'READY', ...expected })),
  })).waitForAssertions({
    totalTimeout: cdk.Duration.minutes(15),
    interval: cdk.Duration.seconds(30),
  });
};

expectReady(s3Target, {
  name: 'private-ca-from-s3',
  certificateConfigurations: [{ s3: { uri: `s3://${caBucket.bucketName}/${caObjectKey}` } }],
  privateEndpoint: { managedVpcResource: { vpcIdentifier: vpc.vpcId } },
});
expectReady(secretTarget, {
  name: 'private-ca-from-secret',
  certificateConfigurations: [{ secretsManager: { secretArn: caSecret.secretArn } }],
  privateEndpoint: { managedVpcResource: { vpcIdentifier: vpc.vpcId } },
});
expectReady(selfManagedTarget, {
  name: 'private-ca-self-managed-lattice',
  certificateConfigurations: [{ secretsManager: { secretArn: caSecret.secretArn } }],
  privateEndpoint: { selfManagedLatticeResource: { resourceConfigurationIdentifier: resourceConfiguration.attrId } },
});
