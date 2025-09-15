import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iot from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  new iot.AccountAuditConfiguration(stack, 'AccountAuditConfiguration');

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::AccountAuditConfiguration', {
    AccountId: { Ref: 'AWS::AccountId' },
    AuditCheckConfigurations: {
      AuthenticatedCognitoRoleOverlyPermissiveCheck: { Enabled: true },
      CaCertificateExpiringCheck: { Enabled: true },
      CaCertificateKeyQualityCheck: { Enabled: true },
      ConflictingClientIdsCheck: { Enabled: true },
      DeviceCertificateAgeCheck: {
        Enabled: true,
        Configuration: {
          CertAgeThresholdInDays: '365',
        },
      },
      DeviceCertificateExpiringCheck: { Enabled: true },
      DeviceCertificateKeyQualityCheck: { Enabled: true },
      DeviceCertificateSharedCheck: { Enabled: true },
      IntermediateCaRevokedForActiveDeviceCertificatesCheck: { Enabled: true },
      IoTPolicyPotentialMisConfigurationCheck: { Enabled: true },
      IotPolicyOverlyPermissiveCheck: { Enabled: true },
      IotRoleAliasAllowsAccessToUnusedServicesCheck: { Enabled: true },
      IotRoleAliasOverlyPermissiveCheck: { Enabled: true },
      LoggingDisabledCheck: { Enabled: true },
      RevokedCaCertificateStillActiveCheck: { Enabled: true },
      RevokedDeviceCertificateStillActiveCheck: { Enabled: true },
      UnauthenticatedCognitoRoleOverlyPermissiveCheck: { Enabled: true },
    },
    RoleArn: { 'Fn::GetAtt': ['AccountAuditConfigurationAuditRoleBEFDE978', 'Arn'] },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'iot.amazonaws.com' },
        },
      ],
      Version: '2012-10-17',
    },
    ManagedPolicyArns: [
      {
        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSIoTDeviceDefenderAudit']],
      },
    ],
  });
});

test('configure target topic', () => {
  const stack = new cdk.Stack();

  const targetTopic = new sns.Topic(stack, 'TargetTopic');

  new iot.AccountAuditConfiguration(stack, 'AccountAuditConfiguration', {
    targetTopic,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::AccountAuditConfiguration', {
    AuditNotificationTargetConfigurations: {
      Sns: {
        Enabled: true,
        TargetArn: { Ref: 'TargetTopic73BB7828' },
        RoleArn: { 'Fn::GetAtt': ['AccountAuditConfigurationNotificationRoleD9824FB9', 'Arn'] },
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'iot.amazonaws.com' },
        },
      ],
      Version: '2012-10-17',
    },
    Policies: [
      {
        PolicyDocument: {
          Statement: [
            {
              Action: 'sns:Publish',
              Effect: 'Allow',
              Resource: { Ref: 'TargetTopic73BB7828' },
            },
          ],
          Version: '2012-10-17',
        },
      },
    ],
  });
});

test('configure check configuration', () => {
  const stack = new cdk.Stack();

  new iot.AccountAuditConfiguration(stack, 'AccountAuditConfiguration', {
    checkConfiguration: {
      authenticatedCognitoRoleOverlyPermissiveCheck: true,
      caCertificateExpiringCheck: undefined,
      caCertificateKeyQualityCheck: false,
      conflictingClientIdsCheck: false,
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

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::AccountAuditConfiguration', {
    AuditCheckConfigurations: {
      AuthenticatedCognitoRoleOverlyPermissiveCheck: { Enabled: true },
      CaCertificateExpiringCheck: { Enabled: true },
    },
  });
});

test('throw error for configuring duration without enabling deviceCertificateAgeCheck', () => {
  const stack = new cdk.Stack();
  expect(() => new iot.AccountAuditConfiguration(stack, 'AccountAuditConfiguration', {
    checkConfiguration: {
      deviceCertificateAgeCheck: false,
      deviceCertificateAgeCheckDuration: cdk.Duration.days(1229),
    },
  })).toThrow('You cannot specify a value for `deviceCertificateAgeCheckDuration` if `deviceCertificateAgeCheck` is set to `false`.');
});

test.each([
  cdk.Duration.days(29),
  cdk.Duration.days(3651),
])('throw error for invalid duration %s', (duration) => {
  const stack = new cdk.Stack();
  expect(() => new iot.AccountAuditConfiguration(stack, 'AccountAuditConfiguration', {
    checkConfiguration: {
      deviceCertificateAgeCheck: true,
      deviceCertificateAgeCheckDuration: duration,
    },
  })).toThrow(`The device certificate age check threshold must be between 30 and 3650 days. got: ${duration.toDays()} days.`);
});

test('import by Account ID', () => {
  const stack = new cdk.Stack();

  const accountId = '1234567899012';

  const auditConfiguration = iot.AccountAuditConfiguration.fromAccountId(stack, 'AccountAuditConfigurationFromId', accountId);

  expect(auditConfiguration).toMatchObject({
    accountId,
  });
});
