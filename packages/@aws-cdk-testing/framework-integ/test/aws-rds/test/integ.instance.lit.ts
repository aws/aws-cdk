import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**********************************************************************************************************************
 *
 *    Warning! This test case can not be deployed!
 *
 *    Save yourself some time and move on.
 *    The latest given reason is:
 *    - 2023-08-30: `rds.LicenseModel.BRING_YOUR_OWN_LICENSE` is not allowed on our dev accounts, @mrgrain
 *
 *********************************************************************************************************************/

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

class DatabaseInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    /// !show
    // Set open cursors with parameter group
    const parameterGroup = new rds.ParameterGroup(this, 'ParameterGroup', {
      engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
      parameters: {
        open_cursors: '2500',
      },
    });

    /// Add XMLDB and OEM with option group
    const optionGroup = new rds.OptionGroup(this, 'OptionGroup', {
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

    // Allow connections to OEM
    optionGroup.optionConnections.OEM.connections.allowDefaultPortFromAnyIpv4();

    // Database instance with production values
    const instance = new rds.DatabaseInstance(this, 'Instance', {
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
      autoMinorVersionUpgrade: true, // required to be true if LOCATOR is used in the option group
      optionGroup,
      parameterGroup,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Allow connections on default port from any IPV4
    instance.connections.allowDefaultPortFromAnyIpv4();

    // Rotate the master user password every 30 days
    instance.addRotationSingleUser();

    // Add alarm for high CPU
    new cloudwatch.Alarm(this, 'HighCPU', {
      metric: instance.metricCPUUtilization(),
      threshold: 90,
      evaluationPeriods: 1,
    });

    // Trigger Lambda function on instance availability events
    const fn = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromInline('exports.handler = (event) => console.log(event);'),
      handler: 'index.handler',
      runtime: STANDARD_NODEJS_RUNTIME,
    });

    const availabilityRule = instance.onEvent('Availability', { target: new targets.LambdaFunction(fn) });
    availabilityRule.addEventPattern({
      detail: {
        EventCategories: [
          'availability',
        ],
      },
    });
    /// !hide
  }
}

new DatabaseInstanceStack(app, 'aws-cdk-rds-instance');
app.synth();
