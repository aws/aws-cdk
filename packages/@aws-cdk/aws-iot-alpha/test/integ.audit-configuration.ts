import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iot from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const targetTopic = new sns.Topic(this, 'Topic');

    const config = new iot.AccountAuditConfiguration(this, 'AuditConfiguration', {
      targetTopic,
      checkConfiguration: {
        deviceCertificateAgeCheckDuration: cdk.Duration.days(1229),
      },
    });

    new iot.ScheduledAudit(this, 'DailyAudit', {
      accountAuditConfiguration: config,
      frequency: iot.Frequency.DAILY,
      auditChecks: [
        iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK,
      ],
    });

    new iot.ScheduledAudit(this, 'WeeklyAudit', {
      accountAuditConfiguration: config,
      frequency: iot.Frequency.WEEKLY,
      dayOfWeek: iot.DayOfWeek.SUNDAY,
      auditChecks: [
        iot.AuditCheck.CA_CERTIFICATE_EXPIRING_CHECK,
      ],
    });

    new iot.ScheduledAudit(this, 'MonthlyAudit', {
      accountAuditConfiguration: config,
      frequency: iot.Frequency.MONTHLY,
      dayOfMonth: iot.DayOfMonth.LAST_DAY,
      auditChecks: [
        iot.AuditCheck.CA_CERTIFICATE_KEY_QUALITY_CHECK,
        iot.AuditCheck.CONFLICTING_CLIENT_IDS_CHECK,
        iot.AuditCheck.DEVICE_CERTIFICATE_EXPIRING_CHECK,
        iot.AuditCheck.DEVICE_CERTIFICATE_KEY_QUALITY_CHECK,
        iot.AuditCheck.DEVICE_CERTIFICATE_SHARED_CHECK,
        iot.AuditCheck.IOT_POLICY_OVERLY_PERMISSIVE_CHECK,
        iot.AuditCheck.IOT_ROLE_ALIAS_ALLOWS_ACCESS_TO_UNUSED_SERVICES_CHECK,
        iot.AuditCheck.IOT_ROLE_ALIAS_OVERLY_PERMISSIVE_CHECK,
        iot.AuditCheck.LOGGING_DISABLED_CHECK,
        iot.AuditCheck.REVOKED_CA_CERTIFICATE_STILL_ACTIVE_CHECK,
        iot.AuditCheck.REVOKED_DEVICE_CERTIFICATE_STILL_ACTIVE_CHECK,
        iot.AuditCheck.UNAUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK,
      ],
    });
  }
}

const app = new cdk.App();
const testCase = new TestStack(app, 'IotAuditConfigurationTestStack');

new integ.IntegTest(app, 'IotAuditConfigurationTest', {
  testCases: [testCase],
});
