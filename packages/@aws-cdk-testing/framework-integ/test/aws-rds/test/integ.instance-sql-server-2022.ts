import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-sql-server-2022', {
  terminationProtection: false,
});

const vpc = new ec2.Vpc(stack, 'VPC', { 
  maxAzs: 2, 
  restrictDefaultSecurityGroup: false,
});

// Test SQL Server 2022 CU23 version
new rds.DatabaseInstance(stack, 'SqlServer2022CU23', {
  engine: rds.DatabaseInstanceEngine.sqlServerEx({
    version: rds.SqlServerEngineVersion.VER_16_00_4236_2_V1,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  credentials: rds.Credentials.fromUsername('admin', {
    excludeCharacters: '"@/\\',
  }),
  vpc,
  licenseModel: rds.LicenseModel.LICENSE_INCLUDED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Test SQL Server 2022 CU22 version
new rds.DatabaseInstance(stack, 'SqlServer2022CU22', {
  engine: rds.DatabaseInstanceEngine.sqlServerEx({
    version: rds.SqlServerEngineVersion.VER_16_00_4225_2_V1,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  credentials: rds.Credentials.fromUsername('admin', {
    excludeCharacters: '"@/\\',
  }),
  vpc,
  licenseModel: rds.LicenseModel.LICENSE_INCLUDED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Test SQL Server 2022 CU22 GDR version
new rds.DatabaseInstance(stack, 'SqlServer2022CU22GDR', {
  engine: rds.DatabaseInstanceEngine.sqlServerEx({
    version: rds.SqlServerEngineVersion.VER_16_00_4230_2_V1,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  credentials: rds.Credentials.fromUsername('admin', {
    excludeCharacters: '"@/\\',
  }),
  vpc,
  licenseModel: rds.LicenseModel.LICENSE_INCLUDED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'sql-server-2022-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
