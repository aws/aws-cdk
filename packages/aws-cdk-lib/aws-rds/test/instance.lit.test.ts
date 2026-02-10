/**
 * NOTE: This is a unit test instead of an integration test because we cannot use
 * "BRING_YOUR_OWN_LICENSE" in dev accounts
 */

import { Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import * as ec2 from '../../aws-ec2';
import * as targets from '../../aws-events-targets';
import * as lambda from '../../aws-lambda';
import * as logs from '../../aws-logs';
import * as cdk from '../../core';
import { RemovalPolicy } from '../../core';
import * as rds from '../lib';

describe('database instance with BYOL', () => {
  test('create Oracle instance with parameter group, option group, and monitoring', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

    const parameterGroup = new rds.ParameterGroup(stack, 'ParameterGroup', {
      engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
      parameters: {
        open_cursors: '2500',
      },
    });

    const optionGroup = new rds.OptionGroup(stack, 'OptionGroup', {
      engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
      configurations: [
        {
          name: 'LOCATOR',
        },
        {
          name: 'OEM',
          port: 1158,
          vpc,
        },
      ],
    });

    optionGroup.optionConnections.OEM.connections.allowDefaultPortFromAnyIpv4();

    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
      licenseModel: rds.LicenseModel.BRING_YOUR_OWN_LICENSE,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      multiAz: true,
      storageType: rds.StorageType.IO1,
      credentials: rds.Credentials.fromUsername('syscdk'),
      vpc,
      databaseName: 'ORCL',
      storageEncrypted: true,
      backupRetention: cdk.Duration.days(7),
      monitoringInterval: cdk.Duration.seconds(60),
      enablePerformanceInsights: true,
      cloudwatchLogsExports: [
        'trace',
        'audit',
        'alert',
        'listener',
      ],
      cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      autoMinorVersionUpgrade: true,
      optionGroup,
      parameterGroup,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    instance.connections.allowDefaultPortFromAnyIpv4();
    instance.addRotationSingleUser();

    new cloudwatch.Alarm(stack, 'HighCPU', {
      metric: instance.metricCPUUtilization(),
      threshold: 90,
      evaluationPeriods: 1,
    });

    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.fromInline('exports.handler = (event) => console.log(event);'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    });

    const availabilityRule = instance.onEvent('Availability', { target: new targets.LambdaFunction(fn) });
    availabilityRule.addEventPattern({
      detail: {
        EventCategories: [
          'availability',
        ],
      },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'oracle-se2',
      LicenseModel: 'bring-your-own-license',
      DBInstanceClass: 'db.t3.medium',
      MultiAZ: true,
      StorageType: 'io1',
      StorageEncrypted: true,
      BackupRetentionPeriod: 7,
      MonitoringInterval: 60,
      EnablePerformanceInsights: true,
      EnableCloudwatchLogsExports: ['trace', 'audit', 'alert', 'listener'],
      AutoMinorVersionUpgrade: true,
    });

    template.hasResourceProperties('AWS::RDS::DBParameterGroup', {
      Parameters: {
        open_cursors: '2500',
      },
    });

    template.hasResourceProperties('AWS::RDS::OptionGroup', {
      OptionConfigurations: [
        { OptionName: 'LOCATOR' },
        { OptionName: 'OEM', Port: 1158 },
      ],
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      Threshold: 90,
      EvaluationPeriods: 1,
    });

    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        detail: {
          EventCategories: ['availability'],
        },
      },
    });
  });
});
