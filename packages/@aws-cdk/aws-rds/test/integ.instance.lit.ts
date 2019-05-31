import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import targets = require('@aws-cdk/aws-events-targets');
import lambda = require('@aws-cdk/aws-lambda');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import rds = require('../lib');

const app = new cdk.App();

class DatabaseInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAZs: 2 });

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
      engine: rds.DatabaseInstanceEngine.OracleSE1,
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
      engine: rds.DatabaseInstanceEngine.OracleSE1,
      licenseModel: rds.LicenseModel.BringYourOwnLicense,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Medium),
      multiAz: true,
      storageType: rds.StorageType.IO1,
      masterUsername: 'syscdk',
      vpc,
      databaseName: 'ORCL',
      storageEncrypted: true,
      backupRetentionPeriod: 7,
      monitoringInterval: 60,
      enablePerformanceInsights: true,
      cloudwatchLogsExports: [
        'trace',
        'audit',
        'alert',
        'listener'
      ],
      cloudwatchLogsRetention: logs.RetentionDays.OneMonth,
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
      code: lambda.Code.inline('exports.handler = (event) => console.log(event);'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810
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
app.run();
