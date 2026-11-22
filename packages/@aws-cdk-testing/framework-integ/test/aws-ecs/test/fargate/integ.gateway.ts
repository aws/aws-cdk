import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-gateway');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

// the gateway's load balancers write access logs here; the HTTP check below runs with logging on
const logs = new s3.Bucket(stack, 'GatewayLogs', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const gateway = new ecs.Gateway(stack, 'Gateway', {
  vpc,
  scheme: ecs.GatewayScheme.INTERNET_FACING,
  deletionProtection: false,
  propagateTags: ecs.GatewayPropagateTags.NONE,
  accessLogs: { bucket: logs, prefix: 'gateway' },
});
cluster.associateGateway(gateway);

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:1.27'),
  portMappings: [{ containerPort: 80, name: 'web' }],
});

const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  minHealthyPercent: 100,
  gatewayConnector: {
    portName: 'web',
    accessTypes: [ecs.GatewayAccessType.PUBLIC],
    healthCheck: { path: '/' },
    deregistrationDelay: cdk.Duration.seconds(30),
  },
});

const test = new integ.IntegTest(app, 'GatewayTest', {
  testCases: [stack],
});

// The service is active and its task is running.
const serviceActive = test.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [service.serviceName],
}).expect(integ.ExpectedResult.objectLike({ services: [{ status: 'ACTIVE', runningCount: 1 }] }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(15) });

// DescribeServices doesn't return gateway connectors; they are in the service revision. The SDK in
// the Lambda runtime predates gateways and drops those fields, so this function calls the ECS API
// directly. It returns the connector's port name and deregistration delay, the connection status
// and access type, and the HTTP status of the service URL once the connection is active.
const checkGateway = new lambda.Function(stack, 'CheckGateway', {
  runtime: lambda.Runtime.NODEJS_24_X,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(30),
  environment: { CLUSTER: cluster.clusterName, SERVICE: service.serviceName },
  code: lambda.Code.fromInline(`
const crypto = require('crypto');
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();

async function ecs(action, params) {
  const region = process.env.AWS_REGION;
  const host = 'ecs.' + region + '.amazonaws.com';
  const body = JSON.stringify(params);
  const amzDate = new Date().toISOString().replace(/[:-]|\\.\\d{3}/g, '');
  const date = amzDate.slice(0, 8);
  const headers = {
    'content-type': 'application/x-amz-json-1.1',
    'host': host,
    'x-amz-date': amzDate,
    'x-amz-security-token': process.env.AWS_SESSION_TOKEN,
    'x-amz-target': 'AmazonEC2ContainerServiceV20141113.' + action,
  };
  const names = Object.keys(headers).sort();
  const canonical = ['POST', '/', '', names.map((n) => n + ':' + headers[n] + '\\n').join(''), names.join(';'), sha256(body)].join('\\n');
  const scope = date + '/' + region + '/ecs/aws4_request';
  const toSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonical)].join('\\n');
  const key = hmac(hmac(hmac(hmac('AWS4' + process.env.AWS_SECRET_ACCESS_KEY, date), region), 'ecs'), 'aws4_request');
  const signature = crypto.createHmac('sha256', key).update(toSign).digest('hex');
  delete headers.host;
  headers.authorization = 'AWS4-HMAC-SHA256 Credential=' + process.env.AWS_ACCESS_KEY_ID + '/' + scope
    + ', SignedHeaders=' + names.join(';') + ', Signature=' + signature;
  const response = await fetch('https://' + host + '/', { method: 'POST', headers, body });
  const result = await response.json();
  if (!response.ok) throw new Error(action + ' failed: ' + JSON.stringify(result));
  return result;
}

exports.handler = async () => {
  const described = await ecs('DescribeServices', { cluster: process.env.CLUSTER, services: [process.env.SERVICE] });
  const revisionArn = described.services[0].currentServiceRevisions[0].arn;
  const revisions = await ecs('DescribeServiceRevisions', { serviceRevisionArns: [revisionArn] });
  const revision = revisions.serviceRevisions[0];
  const connector = (revision.gatewayConnectors || [])[0] || {};
  const connection = ((revision.ecsManagedResources || {}).gatewayConnections || [])[0] || {};
  let http = 'none';
  if (connection.status === 'ACTIVE') {
    try {
      http = String((await fetch(connection.serviceUrl)).status);
    } catch (e) {
      // DNS for a new hostname can take a few minutes after the connection is active
      http = (e.cause && e.cause.code) || 'error';
    }
  }
  return [connector.portName, (connector.deregistrationDelay || {}).timeoutSeconds, connection.status, connection.accessType, http].join(' ');
};
`),
});
checkGateway.addToRolePolicy(new iam.PolicyStatement({
  actions: ['ecs:DescribeServices', 'ecs:DescribeServiceRevisions'],
  resources: ['*'],
}));

// The connection reports CREATE_IN_PROGRESS until its URL is ready, and the service then answers
// through the gateway.
const gatewayReady = test.assertions.invokeFunction({ functionName: checkGateway.functionName })
  .expect(integ.ExpectedResult.objectLike({ Payload: '"web 30 ACTIVE PUBLIC 200"' }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(15) });
serviceActive.next(gatewayReady);
