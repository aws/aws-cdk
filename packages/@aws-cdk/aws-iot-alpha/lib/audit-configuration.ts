import { Resource, Stack, IResource, Duration } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as iot from 'aws-cdk-lib/aws-iot';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

/**
 * Represents AWS IoT Audit Configuration
 */
export interface IAccountAuditConfiguration extends IResource {
  /**
   * The account ID
   * @attribute
   */
  readonly accountId: string;
}

/**
 * The types of audit checks
 *
 * @see https://docs.aws.amazon.com/iot-device-defender/latest/devguide/device-defender-audit-checks.html
 */
export interface CheckConfiguration {
  /**
   * Checks the permissiveness of an authenticated Amazon Cognito identity pool role.
   *
   * For this check, AWS IoT Device Defender audits all Amazon Cognito identity pools that have been used to connect to the AWS IoT message broker
   * during the 31 days before the audit is performed.
   *
   * @default true
   */
  readonly authenticatedCognitoRoleOverlyPermissiveCheck?: boolean;

  /**
   * Checks if a CA certificate is expiring.
   *
   * This check applies to CA certificates expiring within 30 days or that have expired.
   *
   * @default true
   */
  readonly caCertificateExpiringCheck?: boolean;

  /**
   * Checks the quality of the CA certificate key.
   *
   * The quality checks if the key is in a valid format, not expired, and if the key meets a minimum required size.
   *
   * This check applies to CA certificates that are ACTIVE or PENDING_TRANSFER.
   *
   * @default true
   */
  readonly caCertificateKeyQualityCheck?: boolean;

  /**
   * Checks if multiple devices connect using the same client ID.
   *
   * @default true
   */
  readonly conflictingClientIdsCheck?: boolean;

  /**
   * Checks when a device certificate has been active for a number of days greater than or equal to the number you specify.
   *
   * @default true
   */
  readonly deviceCertificateAgeCheck?: boolean;

  /**
   * The duration used to check if a device certificate has been active
   * for a number of days greater than or equal to the number you specify.
   *
   * Valid values range from 30 days (minimum) to 3650 days (10 years, maximum).
   *
   * You cannot specify a value for this check if `deviceCertificateAgeCheck` is set to `false`.
   *
   * @default - 365 days
   */
  readonly deviceCertificateAgeCheckDuration?: Duration;

  /**
   * Checks if a device certificate is expiring.
   *
   * This check applies to device certificates expiring within 30 days or that have expired.
   *
   * @default true
   */
  readonly deviceCertificateExpiringCheck?: boolean;

  /**
   * Checks the quality of the device certificate key.
   *
   * The quality checks if the key is in a valid format, not expired, signed by a registered certificate authority,
   * and if the key meets a minimum required size.
   *
   * @default true
   */
  readonly deviceCertificateKeyQualityCheck?: boolean;

  /**
   * Checks if multiple concurrent connections use the same X.509 certificate to authenticate with AWS IoT.
   *
   * @default true
   */
  readonly deviceCertificateSharedCheck?: boolean;

  /**
   * Checks if device certificates are still active despite being revoked by an intermediate CA.
   *
   * @default true
   */
  readonly intermediateCaRevokedForActiveDeviceCertificatesCheck?: boolean;

  /**
   * Checks the permissiveness of a policy attached to an authenticated Amazon Cognito identity pool role.
   *
   * @default true
   */
  readonly iotPolicyOverlyPermissiveCheck?: boolean;

  /**
   * Checks if an AWS IoT policy is potentially misconfigured.
   *
   * Misconfigured policies, including overly permissive policies, can cause security incidents like allowing devices access to unintended resources.
   *
   * This check is a warning for you to make sure that only intended actions are allowed before updating the policy.
   *
   * @default true
   */
  readonly ioTPolicyPotentialMisConfigurationCheck?: boolean;

  /**
   * Checks if a role alias has access to services that haven't been used for the AWS IoT device in the last year.
   *
   * @default true
   */
  readonly iotRoleAliasAllowsAccessToUnusedServicesCheck?: boolean;

  /**
   * Checks if the temporary credentials provided by AWS IoT role aliases are overly permissive.
   *
   * @default true
   */
  readonly iotRoleAliasOverlyPermissiveCheck?: boolean;

  /**
   * Checks if AWS IoT logs are disabled.
   *
   * @default true
   */
  readonly loggingDisabledCheck?: boolean;

  /**
   * Checks if a revoked CA certificate is still active.
   *
   * @default true
   */
  readonly revokedCaCertificateStillActiveCheck?: boolean;

  /**
   * Checks if a revoked device certificate is still active.
   *
   * @default true
   */
  readonly revokedDeviceCertificateStillActiveCheck?: boolean;

  /**
   * Checks if policy attached to an unauthenticated Amazon Cognito identity pool role is too permissive.
   *
   * @default true
   */
  readonly unauthenticatedCognitoRoleOverlyPermissiveCheck?: boolean;
}

/**
 * Properties for defining AWS IoT Audit Configuration
 */
export interface AccountAuditConfigurationProps {
  /**
   * The target SNS topic to which audit notifications are sent.
   *
   * @default - no notifications are sent
   */
  readonly targetTopic?: sns.ITopic;

  /**
   * Specifies which audit checks are enabled and disabled for this account.
   *
   * @default - all checks are enabled
   */
  readonly checkConfiguration?: CheckConfiguration;
}

/**
 * Defines AWS IoT Audit Configuration
 */
@propertyInjectable
export class AccountAuditConfiguration extends Resource implements IAccountAuditConfiguration {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-iot-alpha.AccountAuditConfiguration';

  /**
   * Import an existing AWS IoT Audit Configuration
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param accountId The account ID
   */
  public static fromAccountId(scope: Construct, id: string, accountId: string): IAccountAuditConfiguration {
    class Import extends Resource implements IAccountAuditConfiguration {
      public readonly accountId = accountId;
    }
    return new Import(scope, id);
  }

  /**
   * The account ID
   * @attribute
   */
  public readonly accountId: string;

  constructor(scope: Construct, id: string, props?: AccountAuditConfigurationProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const deviceAgeCheckThreshold = props?.checkConfiguration?.deviceCertificateAgeCheckDuration;

    if (deviceAgeCheckThreshold) {
      if (props?.checkConfiguration?.deviceCertificateAgeCheck === false) {
        throw new Error('You cannot specify a value for `deviceCertificateAgeCheckDuration` if `deviceCertificateAgeCheck` is set to `false`.');
      }
      if (!deviceAgeCheckThreshold.isUnresolved() && deviceAgeCheckThreshold.toDays() < 30 || deviceAgeCheckThreshold.toDays() > 3650) {
        throw new Error(`The device certificate age check threshold must be between 30 and 3650 days. got: ${deviceAgeCheckThreshold.toDays()} days.`);
      }
    }

    this.accountId = Stack.of(this).account;

    const auditRole = new iam.Role(this, 'AuditRole', {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSIoTDeviceDefenderAudit'),
      ],
    });

    new iot.CfnAccountAuditConfiguration(this, 'Resource', {
      accountId: this.accountId,
      auditCheckConfigurations: this.renderAuditCheckConfigurations(props?.checkConfiguration),
      auditNotificationTargetConfigurations: this.renderAuditNotificationTargetConfigurations(props?.targetTopic),
      roleArn: auditRole.roleArn,
    });
  }

  /**
   * Render the audit notification target configurations
   */
  private renderAuditNotificationTargetConfigurations(
    targetTopic?: sns.ITopic,
  ): iot.CfnAccountAuditConfiguration.AuditNotificationTargetConfigurationsProperty | undefined {
    if (!targetTopic) {
      return undefined;
    }

    const notificationRole = new iam.Role(this, 'NotificationRole', {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
      inlinePolicies: {
        NotificationPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['sns:Publish'],
              resources: [targetTopic.topicArn],
            }),
          ],
        }),
      },
    });

    return {
      sns: {
        enabled: true,
        targetArn: targetTopic.topicArn,
        roleArn: notificationRole.roleArn,
      },
    };
  }

  /**
   * Render the audit check configurations
   */
  private renderAuditCheckConfigurations(checkConfiguration?: CheckConfiguration): iot.CfnAccountAuditConfiguration.AuditCheckConfigurationsProperty {
    return {
      authenticatedCognitoRoleOverlyPermissiveCheck:
        this.renderAuditCheckConfiguration(checkConfiguration?.authenticatedCognitoRoleOverlyPermissiveCheck),
      caCertificateExpiringCheck: this.renderAuditCheckConfiguration(checkConfiguration?.caCertificateExpiringCheck),
      caCertificateKeyQualityCheck: this.renderAuditCheckConfiguration(checkConfiguration?.caCertificateKeyQualityCheck),
      conflictingClientIdsCheck: this.renderAuditCheckConfiguration(checkConfiguration?.conflictingClientIdsCheck),
      deviceCertificateAgeCheck:
        checkConfiguration?.deviceCertificateAgeCheck !== false ?
          {
            enabled: true,
            configuration: {
              certAgeThresholdInDays: String(checkConfiguration?.deviceCertificateAgeCheckDuration?.toDays() ?? 365),
            },
          } :
          undefined,
      deviceCertificateExpiringCheck: this.renderAuditCheckConfiguration(checkConfiguration?.deviceCertificateExpiringCheck),
      deviceCertificateKeyQualityCheck: this.renderAuditCheckConfiguration(checkConfiguration?.deviceCertificateKeyQualityCheck),
      deviceCertificateSharedCheck: this.renderAuditCheckConfiguration(checkConfiguration?.deviceCertificateSharedCheck),
      intermediateCaRevokedForActiveDeviceCertificatesCheck:
        this.renderAuditCheckConfiguration(checkConfiguration?.intermediateCaRevokedForActiveDeviceCertificatesCheck),
      iotPolicyOverlyPermissiveCheck: this.renderAuditCheckConfiguration(checkConfiguration?.iotPolicyOverlyPermissiveCheck),
      ioTPolicyPotentialMisConfigurationCheck: this.renderAuditCheckConfiguration(checkConfiguration?.ioTPolicyPotentialMisConfigurationCheck),
      iotRoleAliasAllowsAccessToUnusedServicesCheck:
        this.renderAuditCheckConfiguration(checkConfiguration?.iotRoleAliasAllowsAccessToUnusedServicesCheck),
      iotRoleAliasOverlyPermissiveCheck: this.renderAuditCheckConfiguration(checkConfiguration?.iotRoleAliasOverlyPermissiveCheck),
      loggingDisabledCheck: this.renderAuditCheckConfiguration(checkConfiguration?.loggingDisabledCheck),
      revokedCaCertificateStillActiveCheck: this.renderAuditCheckConfiguration(checkConfiguration?.revokedCaCertificateStillActiveCheck),
      revokedDeviceCertificateStillActiveCheck:
        this.renderAuditCheckConfiguration(checkConfiguration?.revokedDeviceCertificateStillActiveCheck),
      unauthenticatedCognitoRoleOverlyPermissiveCheck:
        this.renderAuditCheckConfiguration(checkConfiguration?.unauthenticatedCognitoRoleOverlyPermissiveCheck),
    };
  }

  /**
   * Render the audit check configuration
   */
  private renderAuditCheckConfiguration(check?: boolean): iot.CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | undefined {
    return check === false ? undefined : { enabled: true };
  }
}

