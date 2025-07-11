# AWS IoT Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

AWS IoT Core lets you connect billions of IoT devices and route trillions of
messages to AWS services without managing infrastructure.

## `TopicRule`

Create a topic rule that give your devices the ability to interact with AWS services.
You can create a topic rule with an action that invoke the Lambda action as following:

```ts
const func = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = (event) => {
      console.log("It is test for lambda action of AWS IoT Rule.", event);
    };`
  ),
});

new iot.TopicRule(this, 'TopicRule', {
  topicRuleName: 'MyTopicRule', // optional
  description: 'invokes the lambda function', // optional
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'"),
  actions: [new actions.LambdaFunctionAction(func)],
});
```

Or, you can add an action after constructing the `TopicRule` instance as following:

```ts
declare const func: lambda.Function;

const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'"),
});
topicRule.addAction(new actions.LambdaFunctionAction(func));
```

You can also supply `errorAction` as following,
and the IoT Rule will trigger it if a rule's action is unable to perform:

```ts
import * as logs from 'aws-cdk-lib/aws-logs';

const logGroup = new logs.LogGroup(this, 'MyLogGroup');

new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'"),
  errorAction: new actions.CloudWatchLogsAction(logGroup),
});
```

If you wanna make the topic rule disable, add property `enabled: false` as following:

```ts
new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'"),
  enabled: false,
});
```

See also [@aws-cdk/aws-iot-actions-alpha](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-iot-actions-alpha-readme.html) for other actions.

## Logging

AWS IoT provides a [logging feature](https://docs.aws.amazon.com/iot/latest/developerguide/configure-logging.html) that allows you to monitor and log AWS IoT activity.

You can enable IoT logging with the following code:

```ts
new iot.Logging(this, 'Logging', {
  logLevel: iot.LogLevel.INFO,
});
```

**Note**: All logs are forwarded to the `AWSIotLogsV2` log group in CloudWatch.

## Audit

An [AWS IoT Device Defender audit looks](https://docs.aws.amazon.com/iot-device-defender/latest/devguide/device-defender-audit.html) at account- and device-related settings and policies to ensure security measures are in place.
An audit can help you detect any drifts from security best practices or access policies.

### Account Audit Configuration

The IoT audit includes [various audit checks](https://docs.aws.amazon.com/iot-device-defender/latest/devguide/device-defender-audit-checks.html), and it is necessary to configure settings to enable those checks.

You can enable an account audit configuration with the following code:

```ts
// Audit notification are sent to the SNS topic
declare const targetTopic: sns.ITopic;

new iot.AccountAuditConfiguration(this, 'AuditConfiguration', {
  targetTopic,
});
```

By default, all audit checks are enabled, but it is also possible to enable only specific audit checks.

```ts
new iot.AccountAuditConfiguration(this, 'AuditConfiguration', {
  checkConfiguration: {
    // enabled
    authenticatedCognitoRoleOverlyPermissiveCheck: true,
    // enabled by default
    caCertificateExpiringCheck: undefined,
    // disabled
    caCertificateKeyQualityCheck: false,
    conflictingClientIdsCheck: false,
    deviceCertificateAgeCheck: false,
    deviceCertificateExpiringCheck: false,
    deviceCertificateKeyQualityCheck: false,
    deviceCertificateSharedCheck: false,
    intermediateCaRevokedForActiveDeviceCertificatesCheck: false,
    ioTPolicyPotentialMisConfigurationCheck: false,
    iotPolicyOverlyPermissiveCheck: false,
    iotRoleAliasAllowsAccessToUnusedServicesCheck: false,
    iotRoleAliasOverlyPermissiveCheck: false,
    loggingDisabledCheck: false,
    revokedCaCertificateStillActiveCheck: false,
    revokedDeviceCertificateStillActiveCheck: false,
    unauthenticatedCognitoRoleOverlyPermissiveCheck: false,
  },
});
```

To configure [the device certificate age check](https://docs.aws.amazon.com/iot-device-defender/latest/devguide/device-certificate-age-check.html), you can specify the duration for the check:

```ts
import { Duration } from 'aws-cdk-lib';

new iot.AccountAuditConfiguration(this, 'AuditConfiguration', {
  checkConfiguration: {
    deviceCertificateAgeCheck: true,
    // The default value is 365 days
    // Valid values range from 30 days (minimum) to 3652 days (10 years, maximum)
    deviceCertificateAgeCheckDuration: Duration.days(365),
  },
});
```

### Scheduled Audit

You can create a [scheduled audit](https://docs.aws.amazon.com/iot-device-defender/latest/devguide/AuditCommands.html#device-defender-AuditCommandsManageSchedules) that is run at a specified time interval. Checks must be enabled for your account by creating `AccountAuditConfiguration`.

```ts
declare const config: iot.AccountAuditConfiguration;

// Daily audit
const dailyAudit = new iot.ScheduledAudit(this, 'DailyAudit', {
  accountAuditConfiguration: config,
  frequency: iot.Frequency.DAILY,
  auditChecks: [
    iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK,
  ],
})

// Weekly audit
const weeklyAudit = new iot.ScheduledAudit(this, 'WeeklyAudit', {
  accountAuditConfiguration: config,
  frequency: iot.Frequency.WEEKLY,
  dayOfWeek: iot.DayOfWeek.SUNDAY,
  auditChecks: [
    iot.AuditCheck.CA_CERTIFICATE_EXPIRING_CHECK,
  ],
});

// Monthly audit
const monthlyAudit = new iot.ScheduledAudit(this, 'MonthlyAudit', {
  accountAuditConfiguration: config,
  frequency: iot.Frequency.MONTHLY,
  dayOfMonth: iot.DayOfMonth.of(1),
  auditChecks: [
    iot.AuditCheck.CA_CERTIFICATE_KEY_QUALITY_CHECK,
  ],
});
```
