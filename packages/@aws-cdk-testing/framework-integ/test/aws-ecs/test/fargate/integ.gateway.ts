import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-gateway');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const gateway = new ecs.Gateway(stack, 'Gateway', {
  vpc,
  scheme: ecs.GatewayScheme.INTERNET_FACING,
  deletionProtection: false,
  propagateTags: ecs.GatewayPropagateTags.NONE,
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

// getAttString() limits a call's response to the requested paths, so a call that is matched with
// expect() and a call whose attributes are read are separate calls.

// The primary check works with any SDK version: the service is active and its task is running.
const describeParams = { cluster: cluster.clusterName, services: [service.serviceName] };
const serviceActive = test.assertions.awsApiCall('ECS', 'describeServices', describeParams)
  .expect(integ.ExpectedResult.objectLike({ services: [{ status: 'ACTIVE', runningCount: 1 }] }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(15) });
const serviceInfo = test.assertions.awsApiCall('ECS', 'describeServices', describeParams);
serviceActive.next(serviceInfo);

// DescribeServices doesn't return gateway connectors; they are in the service revision. An SDK that
// predates gateways drops these fields, so these checks need a recent SDK in the Lambda runtime.
const revisionParams = { serviceRevisionArns: [serviceInfo.getAttString('services.0.currentServiceRevisions.0.arn')] };
const revisionActive = test.assertions.awsApiCall('ECS', 'describeServiceRevisions', revisionParams)
  .expect(integ.ExpectedResult.objectLike({
    serviceRevisions: [{
      gatewayConnectors: [{ portName: 'web', deregistrationDelay: { timeoutSeconds: 30 } }],
      // the connection reports CREATE_IN_PROGRESS until its URL is ready
      ecsManagedResources: { gatewayConnections: [{ status: 'ACTIVE', accessType: 'PUBLIC' }] },
    }],
  }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(10) });
const revisionInfo = test.assertions.awsApiCall('ECS', 'describeServiceRevisions', revisionParams);
revisionActive.next(revisionInfo);

// The service answers through the gateway.
const url = test.assertions.httpApiCall(
  revisionInfo.getAttString('serviceRevisions.0.ecsManagedResources.gatewayConnections.0.serviceUrl'));
url.expect(integ.ExpectedResult.objectLike({ status: 200 }));
// DNS for a new hostname can take a few minutes after the connection is active.
url.waitForAssertions({ totalTimeout: cdk.Duration.minutes(10) });
revisionInfo.next(url);
