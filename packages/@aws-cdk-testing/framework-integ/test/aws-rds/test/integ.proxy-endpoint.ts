import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new App();
const stack = new Stack(app, 'cdk-rds-proxy-endpoint');

const vpc = new ec2.Vpc(stack, 'vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const dbInstance = new rds.DatabaseInstance(stack, 'dbInstance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_17_5,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
});

const dbProxy = new rds.DatabaseProxy(stack, 'dbProxy', {
  secrets: [dbInstance.secret!],
  proxyTarget: rds.ProxyTarget.fromInstance(dbInstance),
  vpc,
});

const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', vpc.vpcDefaultSecurityGroup);

dbProxy.addEndpoint('dbProxyEndpoint', {
  vpc,
  targetRole: rds.ProxyEndpointTargetRole.READ_ONLY,
  securityGroups: [securityGroup],
});

new integ.IntegTest(app, 'cdk-rds-proxy-endpoint-integ', {
  testCases: [stack],
});
