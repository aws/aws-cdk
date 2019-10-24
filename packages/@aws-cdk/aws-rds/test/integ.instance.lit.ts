import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import targets = require('@aws-cdk/aws-events-targets');
import lambda = require('@aws-cdk/aws-lambda');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/core');
import rds = require('../lib');

const app = new cdk.App();

class DatabaseInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });

    /// !show
    // Set open cursors with parameter group
    const parameterGroup = new rds.ParameterGroup(this, 'ParameterGroup', {
      family: 'oracle-se1-11.2',
      parameters: {
        open_cursors: '2500'
      }
    });

    /// Add XMLDB and OEM with option group
    const optionGroup = new rds.OptionGroup(this, 'OptionGroup', {
      engine: rds.DatabaseInstanceEngine.ORACLE_SE1,
      majorEngineVersion: '11.2',
      configurations: [
        {
          name: 'XMLDB'
        },
        {
          name: 'OEM',
          port: 1158,
          vpc
        }
      ]
    });

    // Allow connections to OEM
    optionGroup.optionConnections.OEM.connections.allowDefaultPortFromAnyIpv4();

    // Database instance with production values
    const instance = new rds.DatabaseInstance(this, 'Instance', {
      engine: rds.DatabaseInstanceEngine.ORACLE_SE1,
      licenseModel: rds.LicenseModel.BRING_YOUR_OWN_LICENSE,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MEDIUM),
      multiAz: true,
      storageType: rds.StorageType.IO1,
      masterUsername: 'syscdk',
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
        'listener'
      ],
      cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      autoMinorVersionUpgrade: false,
      optionGroup,
      parameterGroup
    });

    // Allow connections on default port from any IPV4
    instance.connections.allowDefaultPortFromAnyIpv4();

    // Rotate the master user password every 30 days
    instance.addRotationSingleUser('Rotation');

    // Add alarm for high CPU
    new cloudwatch.Alarm(this, 'HighCPU', {
      metric: instance.metricCPUUtilization(),
      threshold: 90,
      evaluationPeriods: 1
    });

    // Trigger Lambda function on instance availability events
    const fn = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromInline('exports.handler = (event) => console.log(event);'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X
    });

    const availabilityRule = instance.onEvent('Availability', { target: new targets.LambdaFunction(fn) });
    availabilityRule.addEventPattern({
      detail: {
        EventCategories: [
          'availability'
        ]
      }
    });
    /// !hide
  }
}

new DatabaseInstanceStack(app, 'aws-cdk-rds-instance');
app.synth();
