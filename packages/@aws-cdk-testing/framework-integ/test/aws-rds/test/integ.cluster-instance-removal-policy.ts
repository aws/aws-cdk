/**
 * Regression test for https://github.com/aws/aws-cdk/issues/37780
 *
 * Verifies that RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE is correctly propagated
 * to helper resources (subnet groups, cluster instances) in RDS constructs.
 *
 * Note: This test uses a plain Stack (not IntegTestBaseStack) because
 * IntegTestBaseStack's Aspect forcibly overrides all resources to DESTROY,
 * which would defeat the purpose of testing retention policy propagation.
 * Deployed resources will be retained on stack deletion — manual cleanup may
 * be needed after running this integ test.
 */
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { INTEG_TEST_LATEST_AURORA_MYSQL, INTEG_TEST_LATEST_MYSQL } from './db-versions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-removal-policy-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  natGateways: 0,
  restrictDefaultSecurityGroup: false,
});

// DatabaseCluster with RETAIN_ON_UPDATE_OR_DELETE — subnet group and instances
// must also inherit RetainExceptOnCreate, not be left with no policy (Delete).
new rds.DatabaseCluster(stack, 'Cluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
  credentials: rds.Credentials.fromUsername('admin', {
    password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  }),
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  vpc,
  removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
});

// DatabaseInstance with RETAIN_ON_UPDATE_OR_DELETE — subnet group must also
// inherit RetainExceptOnCreate.
new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: INTEG_TEST_LATEST_MYSQL }),
  credentials: rds.Credentials.fromUsername('admin', {
    password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  }),
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
});

new IntegTest(app, 'rds-removal-policy-test', {
  testCases: [stack],
});
