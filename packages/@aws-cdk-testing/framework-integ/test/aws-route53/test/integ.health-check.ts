import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53recoverycontrol from 'aws-cdk-lib/aws-route53recoverycontrol';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-route53-health-check');

const zone = new route53.HostedZone(stack, 'HostedZone', {
  zoneName: 'cdk.test',
});

const healthCheckHttp = new route53.HealthCheck(stack, 'HealthCheckHttp', {
  type: route53.HealthCheckType.HTTP,
  fqdn: 'lb.cdk.test',
  resourcePath: '/health',
});

new route53.ARecord(stack, 'ARecordHttp', {
  zone,
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckHttp,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordHttp2', {
  zone,
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

const healthCheckHttps = new route53.HealthCheck(stack, 'HealthCheckHttps', {
  type: route53.HealthCheckType.HTTPS,
  fqdn: 'lb-ssl.cdk.test',
  resourcePath: '/health',
  port: 443,
});

new route53.ARecord(stack, 'ARecordHttps', {
  zone,
  recordName: '_foo',
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckHttps,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordHttps2', {
  zone,
  recordName: '_foo',
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

const healthCheckTcp = new route53.HealthCheck(stack, 'HealthCheckTcp', {
  type: route53.HealthCheckType.TCP,
  fqdn: 'lb-tcp.cdk.test',
  port: 443,
});

new route53.ARecord(stack, 'ARecordTcp', {
  zone,
  recordName: '_bar',
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckTcp,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordTcp2', {
  zone,
  recordName: '_bar',
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

const healthCheckCalculated = new route53.HealthCheck(stack, 'HealthCheckCalculated', {
  type: route53.HealthCheckType.CALCULATED,
  healthThreshold: 2,
  childHealthChecks: [healthCheckHttp, healthCheckHttps],
});

new route53.ARecord(stack, 'ARecordCalculated', {
  zone,
  recordName: '_calculated',
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckCalculated,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordCalculated2', {
  zone,
  recordName: '_calculated',
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async function(event) { return { statusCode: 200, body: "OK" }; }'),
});

const cloudwatchAlarm = new cloudwatch.Alarm(stack, 'Alarm', {
  metric: lambdaFunction.metricErrors({ period: cdk.Duration.minutes(1) }),
  threshold: 100,
  evaluationPeriods: 10,
});

const healthCheckCloudWatch = new route53.HealthCheck(stack, 'HealthCheckCloudWatch', {
  type: route53.HealthCheckType.CLOUDWATCH_METRIC,
  alarmIdentifier: {
    region: stack.region,
    name: cloudwatchAlarm.alarmName,
  },
});

new route53.ARecord(stack, 'ARecordCloudWatch', {
  zone,
  recordName: '_cloudwatch',
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckCloudWatch,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordCloudWatch2', {
  zone,
  recordName: '_cloudwatch',
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

const routingControl = new route53recoverycontrol.CfnRoutingControl(stack, 'RoutingControl', {
  name: 'routing-control-name',
  clusterArn: new route53recoverycontrol.CfnCluster(stack, 'Cluster', {
    name: 'cluster',
  }).attrClusterArn,
});

const healthCheckRecoveryControl = new route53.HealthCheck(stack, 'HealthCheckRecoveryControl', {
  type: route53.HealthCheckType.RECOVERY_CONTROL,
  routingControl: routingControl.attrRoutingControlArn,
});

new route53.ARecord(stack, 'ARecordRecoveryControl', {
  zone,
  recordName: '_recoverycontrol',
  target: route53.RecordTarget.fromValues('1.2.3.4'),
  healthCheck: healthCheckRecoveryControl,
  weight: 100,
});
new route53.ARecord(stack, 'ARecordRecoveryControl2', {
  zone,
  recordName: '_recoverycontrol',
  target: route53.RecordTarget.fromValues('5.6.7.8'),
  weight: 0,
});

const integ = new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});

// healthCheckHttp
const httpHealthCheckCreated = integ.assertions.awsApiCall('Route53', 'GetHealthCheck', {
  HealthCheckId: healthCheckHttp.healthCheckId,
});

httpHealthCheckCreated.expect(
  ExpectedResult.objectLike({
    HealthCheck: {
      HealthCheckConfig: {
        Type: 'HTTP',
        FullyQualifiedDomainName: 'lb.cdk.test',
        ResourcePath: '/health',
        RequestInterval: 30,
        Port: 80,
        FailureThreshold: 3,
        Inverted: false,
        MeasureLatency: false,
        Disabled: false,
      },
    },
  }),
);

// HealthCheckHttps
const httpsHealthCheckCreated = integ.assertions.awsApiCall('Route53', 'GetHealthCheck', {
  HealthCheckId: healthCheckHttps.healthCheckId,
});

httpsHealthCheckCreated.expect(
  ExpectedResult.objectLike({
    HealthCheck: {
      HealthCheckConfig: {
        Type: 'HTTPS',
        FullyQualifiedDomainName: 'lb-ssl.cdk.test',
        ResourcePath: '/health',
        RequestInterval: 30,
        Port: 443,
        FailureThreshold: 3,
        Inverted: false,
        MeasureLatency: false,
        Disabled: false,
      },
    },
  }),
);

// healthCheckTcp
const tcpHealthCheckCreated = integ.assertions.awsApiCall('Route53', 'GetHealthCheck', {
  HealthCheckId: healthCheckTcp.healthCheckId,
});

tcpHealthCheckCreated.expect(
  ExpectedResult.objectLike({
    HealthCheck: {
      HealthCheckConfig: {
        Type: 'TCP',
        FullyQualifiedDomainName: 'lb-tcp.cdk.test',
        RequestInterval: 30,
        Port: 443,
        FailureThreshold: 3,
        Inverted: false,
        MeasureLatency: false,
        Disabled: false,
      },
    },
  }),
);

// HealthCheckCalculated
const calculatedHealthCheckCreated = integ.assertions.awsApiCall('Route53', 'GetHealthCheck', {
  HealthCheckId: healthCheckCalculated.healthCheckId,
});

calculatedHealthCheckCreated.expect(
  ExpectedResult.objectLike({
    HealthCheck: {
      HealthCheckConfig: {
        Type: 'CALCULATED',
        // we need to sort the ids because the arrayWith matcher checks for the order of the elements
        ChildHealthChecks: Match.arrayWith([healthCheckHttp.healthCheckId, healthCheckHttps.healthCheckId].sort()),
        HealthThreshold: 2,
        Inverted: false,
        Disabled: false,
      },
    },
  }),
);

// healthCheckCloudWatch
const cloudWatchHealthCheckCreated = integ.assertions.awsApiCall('Route53', 'GetHealthCheck', {
  HealthCheckId: healthCheckCloudWatch.healthCheckId,
});

cloudWatchHealthCheckCreated.expect(
  ExpectedResult.objectLike({
    HealthCheck: {
      CloudWatchAlarmConfiguration: {
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 10,
        MetricName: 'Errors',
        Namespace: 'AWS/Lambda',
        Period: 60,
        Statistic: 'Sum',
        Threshold: 100,
        Dimensions: [
          {
            Name: 'FunctionName',
            Value: lambdaFunction.functionName,
          },
        ],
      },
      HealthCheckConfig: {
        Type: 'CLOUDWATCH_METRIC',
        AlarmIdentifier: {
          Region: stack.region,
          Name: cloudwatchAlarm.alarmName,
        },
        InsufficientDataHealthStatus: 'LastKnownStatus',
        Inverted: false,
        Disabled: false,
      },
    },
  }),
);

// healthCheckRecoveryControl
const recoveryControlHealthCheckCreated = integ.assertions.awsApiCall('Route53', 'GetHealthCheck', {
  HealthCheckId: healthCheckRecoveryControl.healthCheckId,
});

recoveryControlHealthCheckCreated.expect(
  ExpectedResult.objectLike({
    HealthCheck: {
      HealthCheckConfig: {
        Type: 'RECOVERY_CONTROL',
        RoutingControlArn: routingControl.attrRoutingControlArn,
        Inverted: false,
        Disabled: false,
      },
    },
  }),
);
