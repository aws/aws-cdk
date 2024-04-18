import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as assert from 'assert';
import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class NatInstanceStack extends cdk.Stack {
  public readonly apiUrl: string;
  public readonly bucketName: string;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const keyPair = new ec2.KeyPair(this, 'KeyPair');
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      ...ec2.NatInstanceProviderV2.DEFAULT_USER_DATA_COMMANDS,
      'echo "hello world!" > hello.txt',
      `aws s3 cp hello.txt s3://${bucket.bucketName}`,
    );

    const natGatewayProvider = ec2.NatProvider.instanceV2({
      instanceType: new ec2.InstanceType('t3.small'),
      creditSpecification: ec2.CpuCredits.UNLIMITED,
      defaultAllowedTraffic: ec2.NatTrafficDirection.NONE,
      keyPair,
      userData,
    });

    const vpc = new ec2.Vpc(this, 'MyVpc', { natGatewayProvider });

    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      allowAllOutbound: false,
    });
    securityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow egress to S3');
    for (const gateway of natGatewayProvider.gatewayInstances) {
      bucket.grantWrite(gateway);
      gateway.addSecurityGroup(securityGroup);
    }

    Array.isArray(vpc);
    Array.isArray(natGatewayProvider.configuredGateways);

    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'ALB', { vpc });
    const listener = loadBalancer.addListener('listener', { port: 80 });
    listener.addTargets('target', { port: 80 });
    listener.addAction('response', { action: elbv2.ListenerAction.fixedResponse(200) });

    const httpApi = new apigwv2.HttpApi(this, 'HttpProxyPrivateApi', {
      defaultIntegration: new integrations.HttpAlbIntegration('DefaultIntegration', listener),
      createDefaultStage: true,
    });

    assert(httpApi.url, 'httpApi.url cannot be empty');
    this.apiUrl = httpApi.url;
    this.bucketName = bucket.bucketName;
  }
}

const app = new cdk.App();
const stack = new NatInstanceStack(app, 'aws-cdk-vpc-nat-instance-v2-custom');

const integ = new IntegTest(app, 'nat-instance-v2-custom-integ-test', {
  testCases: [stack],
});

integ.assertions.httpApiCall(stack.apiUrl, {})
  .expect(ExpectedResult.objectLike({ status: 200 }));

const { provider: getObjectCallProvider } = integ.assertions.awsApiCall(
  'S3', 'getObject', { Bucket: stack.bucketName, Key: 'hello.txt' },
);

getObjectCallProvider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});
