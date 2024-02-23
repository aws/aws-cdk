/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Use the `AWS::IoT::AccountAuditConfiguration` resource to configure or reconfigure the Device Defender audit settings for your account.
 *
 * Settings include how audit notifications are sent and which audit checks are enabled or disabled. For API reference, see [UpdateAccountAuditConfiguration](https://docs.aws.amazon.com/iot/latest/apireference/API_UpdateAccountAuditConfiguration.html) and for detailed information on all available audit checks, see [Audit checks](https://docs.aws.amazon.com/iot/latest/developerguide/device-defender-audit-checks.html) .
 *
 * @cloudformationResource AWS::IoT::AccountAuditConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-accountauditconfiguration.html
 */
export class CfnAccountAuditConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::AccountAuditConfiguration";

  /**
   * Build a CfnAccountAuditConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccountAuditConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccountAuditConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccountAuditConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the account.
   */
  public accountId: string;

  /**
   * Specifies which audit checks are enabled and disabled for this account.
   */
  public auditCheckConfigurations: CfnAccountAuditConfiguration.AuditCheckConfigurationsProperty | cdk.IResolvable;

  /**
   * Information about the targets to which audit notifications are sent.
   */
  public auditNotificationTargetConfigurations?: CfnAccountAuditConfiguration.AuditNotificationTargetConfigurationsProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the role that grants permission to AWS IoT to access information about your devices, policies, certificates, and other items as required when performing an audit.
   */
  public roleArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccountAuditConfigurationProps) {
    super(scope, id, {
      "type": CfnAccountAuditConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountId", this);
    cdk.requireProperty(props, "auditCheckConfigurations", this);
    cdk.requireProperty(props, "roleArn", this);

    this.accountId = props.accountId;
    this.auditCheckConfigurations = props.auditCheckConfigurations;
    this.auditNotificationTargetConfigurations = props.auditNotificationTargetConfigurations;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountId": this.accountId,
      "auditCheckConfigurations": this.auditCheckConfigurations,
      "auditNotificationTargetConfigurations": this.auditNotificationTargetConfigurations,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccountAuditConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccountAuditConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnAccountAuditConfiguration {
  /**
   * The types of audit checks that can be performed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html
   */
  export interface AuditCheckConfigurationsProperty {
    /**
     * Checks the permissiveness of an authenticated Amazon Cognito identity pool role.
     *
     * For this check, AWS IoT Device Defender audits all Amazon Cognito identity pools that have been used to connect to the AWS IoT message broker during the 31 days before the audit is performed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-authenticatedcognitoroleoverlypermissivecheck
     */
    readonly authenticatedCognitoRoleOverlyPermissiveCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if a CA certificate is expiring.
     *
     * This check applies to CA certificates expiring within 30 days or that have expired.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-cacertificateexpiringcheck
     */
    readonly caCertificateExpiringCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks the quality of the CA certificate key.
     *
     * The quality checks if the key is in a valid format, not expired, and if the key meets a minimum required size. This check applies to CA certificates that are `ACTIVE` or `PENDING_TRANSFER` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-cacertificatekeyqualitycheck
     */
    readonly caCertificateKeyQualityCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if multiple devices connect using the same client ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-conflictingclientidscheck
     */
    readonly conflictingClientIdsCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if a device certificate is expiring.
     *
     * This check applies to device certificates expiring within 30 days or that have expired.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-devicecertificateexpiringcheck
     */
    readonly deviceCertificateExpiringCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks the quality of the device certificate key.
     *
     * The quality checks if the key is in a valid format, not expired, signed by a registered certificate authority, and if the key meets a minimum required size.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-devicecertificatekeyqualitycheck
     */
    readonly deviceCertificateKeyQualityCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if multiple concurrent connections use the same X.509 certificate to authenticate with AWS IoT .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-devicecertificatesharedcheck
     */
    readonly deviceCertificateSharedCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if device certificates are still active despite being revoked by an intermediate CA.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-intermediatecarevokedforactivedevicecertificatescheck
     */
    readonly intermediateCaRevokedForActiveDeviceCertificatesCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks the permissiveness of a policy attached to an authenticated Amazon Cognito identity pool role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-iotpolicyoverlypermissivecheck
     */
    readonly iotPolicyOverlyPermissiveCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if an AWS IoT policy is potentially misconfigured.
     *
     * Misconfigured policies, including overly permissive policies, can cause security incidents like allowing devices access to unintended resources. This check is a warning for you to make sure that only intended actions are allowed before updating the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-iotpolicypotentialmisconfigurationcheck
     */
    readonly ioTPolicyPotentialMisConfigurationCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if a role alias has access to services that haven't been used for the AWS IoT device in the last year.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-iotrolealiasallowsaccesstounusedservicescheck
     */
    readonly iotRoleAliasAllowsAccessToUnusedServicesCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if the temporary credentials provided by AWS IoT role aliases are overly permissive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-iotrolealiasoverlypermissivecheck
     */
    readonly iotRoleAliasOverlyPermissiveCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if AWS IoT logs are disabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-loggingdisabledcheck
     */
    readonly loggingDisabledCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if a revoked CA certificate is still active.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-revokedcacertificatestillactivecheck
     */
    readonly revokedCaCertificateStillActiveCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if a revoked device certificate is still active.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-revokeddevicecertificatestillactivecheck
     */
    readonly revokedDeviceCertificateStillActiveCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;

    /**
     * Checks if policy attached to an unauthenticated Amazon Cognito identity pool role is too permissive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations-unauthenticatedcognitoroleoverlypermissivecheck
     */
    readonly unauthenticatedCognitoRoleOverlyPermissiveCheck?: CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Which audit checks are enabled and disabled for this account.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfiguration.html
   */
  export interface AuditCheckConfigurationProperty {
    /**
     * True if this audit check is enabled for this account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfiguration.html#cfn-iot-accountauditconfiguration-auditcheckconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * The configuration of the audit notification target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditnotificationtargetconfigurations.html
   */
  export interface AuditNotificationTargetConfigurationsProperty {
    /**
     * The `Sns` notification target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditnotificationtargetconfigurations.html#cfn-iot-accountauditconfiguration-auditnotificationtargetconfigurations-sns
     */
    readonly sns?: CfnAccountAuditConfiguration.AuditNotificationTargetProperty | cdk.IResolvable;
  }

  /**
   * Information about the targets to which audit notifications are sent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditnotificationtarget.html
   */
  export interface AuditNotificationTargetProperty {
    /**
     * True if notifications to the target are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditnotificationtarget.html#cfn-iot-accountauditconfiguration-auditnotificationtarget-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The ARN of the role that grants permission to send notifications to the target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditnotificationtarget.html#cfn-iot-accountauditconfiguration-auditnotificationtarget-rolearn
     */
    readonly roleArn?: string;

    /**
     * The ARN of the target (SNS topic) to which audit notifications are sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditnotificationtarget.html#cfn-iot-accountauditconfiguration-auditnotificationtarget-targetarn
     */
    readonly targetArn?: string;
  }
}

/**
 * Properties for defining a `CfnAccountAuditConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-accountauditconfiguration.html
 */
export interface CfnAccountAuditConfigurationProps {
  /**
   * The ID of the account.
   *
   * You can use the expression `!Sub "${AWS::AccountId}"` to use your account ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-accountauditconfiguration.html#cfn-iot-accountauditconfiguration-accountid
   */
  readonly accountId: string;

  /**
   * Specifies which audit checks are enabled and disabled for this account.
   *
   * Some data collection might start immediately when certain checks are enabled. When a check is disabled, any data collected so far in relation to the check is deleted. To disable a check, set the value of the `Enabled:` key to `false` .
   *
   * If an enabled check is removed from the template, it will also be disabled.
   *
   * You can't disable a check if it's used by any scheduled audit. You must delete the check from the scheduled audit or delete the scheduled audit itself to disable the check.
   *
   * For more information on avialbe auidt checks see [AWS::IoT::AccountAuditConfiguration AuditCheckConfigurations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-accountauditconfiguration-auditcheckconfigurations.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-accountauditconfiguration.html#cfn-iot-accountauditconfiguration-auditcheckconfigurations
   */
  readonly auditCheckConfigurations: CfnAccountAuditConfiguration.AuditCheckConfigurationsProperty | cdk.IResolvable;

  /**
   * Information about the targets to which audit notifications are sent.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-accountauditconfiguration.html#cfn-iot-accountauditconfiguration-auditnotificationtargetconfigurations
   */
  readonly auditNotificationTargetConfigurations?: CfnAccountAuditConfiguration.AuditNotificationTargetConfigurationsProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the role that grants permission to AWS IoT to access information about your devices, policies, certificates, and other items as required when performing an audit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-accountauditconfiguration.html#cfn-iot-accountauditconfiguration-rolearn
   */
  readonly roleArn: string;
}

/**
 * Determine whether the given properties match those of a `AuditCheckConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AuditCheckConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"AuditCheckConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountAuditConfiguration.AuditCheckConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountAuditConfiguration.AuditCheckConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuditCheckConfigurationsProperty`
 *
 * @param properties - the TypeScript properties of a `AuditCheckConfigurationsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccountAuditConfigurationAuditCheckConfigurationsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticatedCognitoRoleOverlyPermissiveCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.authenticatedCognitoRoleOverlyPermissiveCheck));
  errors.collect(cdk.propertyValidator("caCertificateExpiringCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.caCertificateExpiringCheck));
  errors.collect(cdk.propertyValidator("caCertificateKeyQualityCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.caCertificateKeyQualityCheck));
  errors.collect(cdk.propertyValidator("conflictingClientIdsCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.conflictingClientIdsCheck));
  errors.collect(cdk.propertyValidator("deviceCertificateExpiringCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.deviceCertificateExpiringCheck));
  errors.collect(cdk.propertyValidator("deviceCertificateKeyQualityCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.deviceCertificateKeyQualityCheck));
  errors.collect(cdk.propertyValidator("deviceCertificateSharedCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.deviceCertificateSharedCheck));
  errors.collect(cdk.propertyValidator("intermediateCaRevokedForActiveDeviceCertificatesCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.intermediateCaRevokedForActiveDeviceCertificatesCheck));
  errors.collect(cdk.propertyValidator("ioTPolicyPotentialMisConfigurationCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.ioTPolicyPotentialMisConfigurationCheck));
  errors.collect(cdk.propertyValidator("iotPolicyOverlyPermissiveCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.iotPolicyOverlyPermissiveCheck));
  errors.collect(cdk.propertyValidator("iotRoleAliasAllowsAccessToUnusedServicesCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.iotRoleAliasAllowsAccessToUnusedServicesCheck));
  errors.collect(cdk.propertyValidator("iotRoleAliasOverlyPermissiveCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.iotRoleAliasOverlyPermissiveCheck));
  errors.collect(cdk.propertyValidator("loggingDisabledCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.loggingDisabledCheck));
  errors.collect(cdk.propertyValidator("revokedCaCertificateStillActiveCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.revokedCaCertificateStillActiveCheck));
  errors.collect(cdk.propertyValidator("revokedDeviceCertificateStillActiveCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.revokedDeviceCertificateStillActiveCheck));
  errors.collect(cdk.propertyValidator("unauthenticatedCognitoRoleOverlyPermissiveCheck", CfnAccountAuditConfigurationAuditCheckConfigurationPropertyValidator)(properties.unauthenticatedCognitoRoleOverlyPermissiveCheck));
  return errors.wrap("supplied properties not correct for \"AuditCheckConfigurationsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccountAuditConfigurationAuditCheckConfigurationsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccountAuditConfigurationAuditCheckConfigurationsPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticatedCognitoRoleOverlyPermissiveCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.authenticatedCognitoRoleOverlyPermissiveCheck),
    "CaCertificateExpiringCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.caCertificateExpiringCheck),
    "CaCertificateKeyQualityCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.caCertificateKeyQualityCheck),
    "ConflictingClientIdsCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.conflictingClientIdsCheck),
    "DeviceCertificateExpiringCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.deviceCertificateExpiringCheck),
    "DeviceCertificateKeyQualityCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.deviceCertificateKeyQualityCheck),
    "DeviceCertificateSharedCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.deviceCertificateSharedCheck),
    "IntermediateCaRevokedForActiveDeviceCertificatesCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.intermediateCaRevokedForActiveDeviceCertificatesCheck),
    "IoTPolicyPotentialMisConfigurationCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.ioTPolicyPotentialMisConfigurationCheck),
    "IotPolicyOverlyPermissiveCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.iotPolicyOverlyPermissiveCheck),
    "IotRoleAliasAllowsAccessToUnusedServicesCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.iotRoleAliasAllowsAccessToUnusedServicesCheck),
    "IotRoleAliasOverlyPermissiveCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.iotRoleAliasOverlyPermissiveCheck),
    "LoggingDisabledCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.loggingDisabledCheck),
    "RevokedCaCertificateStillActiveCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.revokedCaCertificateStillActiveCheck),
    "RevokedDeviceCertificateStillActiveCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.revokedDeviceCertificateStillActiveCheck),
    "UnauthenticatedCognitoRoleOverlyPermissiveCheck": convertCfnAccountAuditConfigurationAuditCheckConfigurationPropertyToCloudFormation(properties.unauthenticatedCognitoRoleOverlyPermissiveCheck)
  };
}

// @ts-ignore TS6133
function CfnAccountAuditConfigurationAuditCheckConfigurationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountAuditConfiguration.AuditCheckConfigurationsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountAuditConfiguration.AuditCheckConfigurationsProperty>();
  ret.addPropertyResult("authenticatedCognitoRoleOverlyPermissiveCheck", "AuthenticatedCognitoRoleOverlyPermissiveCheck", (properties.AuthenticatedCognitoRoleOverlyPermissiveCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.AuthenticatedCognitoRoleOverlyPermissiveCheck) : undefined));
  ret.addPropertyResult("caCertificateExpiringCheck", "CaCertificateExpiringCheck", (properties.CaCertificateExpiringCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.CaCertificateExpiringCheck) : undefined));
  ret.addPropertyResult("caCertificateKeyQualityCheck", "CaCertificateKeyQualityCheck", (properties.CaCertificateKeyQualityCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.CaCertificateKeyQualityCheck) : undefined));
  ret.addPropertyResult("conflictingClientIdsCheck", "ConflictingClientIdsCheck", (properties.ConflictingClientIdsCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.ConflictingClientIdsCheck) : undefined));
  ret.addPropertyResult("deviceCertificateExpiringCheck", "DeviceCertificateExpiringCheck", (properties.DeviceCertificateExpiringCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.DeviceCertificateExpiringCheck) : undefined));
  ret.addPropertyResult("deviceCertificateKeyQualityCheck", "DeviceCertificateKeyQualityCheck", (properties.DeviceCertificateKeyQualityCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.DeviceCertificateKeyQualityCheck) : undefined));
  ret.addPropertyResult("deviceCertificateSharedCheck", "DeviceCertificateSharedCheck", (properties.DeviceCertificateSharedCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.DeviceCertificateSharedCheck) : undefined));
  ret.addPropertyResult("intermediateCaRevokedForActiveDeviceCertificatesCheck", "IntermediateCaRevokedForActiveDeviceCertificatesCheck", (properties.IntermediateCaRevokedForActiveDeviceCertificatesCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.IntermediateCaRevokedForActiveDeviceCertificatesCheck) : undefined));
  ret.addPropertyResult("iotPolicyOverlyPermissiveCheck", "IotPolicyOverlyPermissiveCheck", (properties.IotPolicyOverlyPermissiveCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.IotPolicyOverlyPermissiveCheck) : undefined));
  ret.addPropertyResult("ioTPolicyPotentialMisConfigurationCheck", "IoTPolicyPotentialMisConfigurationCheck", (properties.IoTPolicyPotentialMisConfigurationCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.IoTPolicyPotentialMisConfigurationCheck) : undefined));
  ret.addPropertyResult("iotRoleAliasAllowsAccessToUnusedServicesCheck", "IotRoleAliasAllowsAccessToUnusedServicesCheck", (properties.IotRoleAliasAllowsAccessToUnusedServicesCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.IotRoleAliasAllowsAccessToUnusedServicesCheck) : undefined));
  ret.addPropertyResult("iotRoleAliasOverlyPermissiveCheck", "IotRoleAliasOverlyPermissiveCheck", (properties.IotRoleAliasOverlyPermissiveCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.IotRoleAliasOverlyPermissiveCheck) : undefined));
  ret.addPropertyResult("loggingDisabledCheck", "LoggingDisabledCheck", (properties.LoggingDisabledCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.LoggingDisabledCheck) : undefined));
  ret.addPropertyResult("revokedCaCertificateStillActiveCheck", "RevokedCaCertificateStillActiveCheck", (properties.RevokedCaCertificateStillActiveCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.RevokedCaCertificateStillActiveCheck) : undefined));
  ret.addPropertyResult("revokedDeviceCertificateStillActiveCheck", "RevokedDeviceCertificateStillActiveCheck", (properties.RevokedDeviceCertificateStillActiveCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.RevokedDeviceCertificateStillActiveCheck) : undefined));
  ret.addPropertyResult("unauthenticatedCognitoRoleOverlyPermissiveCheck", "UnauthenticatedCognitoRoleOverlyPermissiveCheck", (properties.UnauthenticatedCognitoRoleOverlyPermissiveCheck != null ? CfnAccountAuditConfigurationAuditCheckConfigurationPropertyFromCloudFormation(properties.UnauthenticatedCognitoRoleOverlyPermissiveCheck) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuditNotificationTargetProperty`
 *
 * @param properties - the TypeScript properties of a `AuditNotificationTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccountAuditConfigurationAuditNotificationTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"AuditNotificationTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccountAuditConfigurationAuditNotificationTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccountAuditConfigurationAuditNotificationTargetPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnAccountAuditConfigurationAuditNotificationTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountAuditConfiguration.AuditNotificationTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountAuditConfiguration.AuditNotificationTargetProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuditNotificationTargetConfigurationsProperty`
 *
 * @param properties - the TypeScript properties of a `AuditNotificationTargetConfigurationsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccountAuditConfigurationAuditNotificationTargetConfigurationsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sns", CfnAccountAuditConfigurationAuditNotificationTargetPropertyValidator)(properties.sns));
  return errors.wrap("supplied properties not correct for \"AuditNotificationTargetConfigurationsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccountAuditConfigurationAuditNotificationTargetConfigurationsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccountAuditConfigurationAuditNotificationTargetConfigurationsPropertyValidator(properties).assertSuccess();
  return {
    "Sns": convertCfnAccountAuditConfigurationAuditNotificationTargetPropertyToCloudFormation(properties.sns)
  };
}

// @ts-ignore TS6133
function CfnAccountAuditConfigurationAuditNotificationTargetConfigurationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountAuditConfiguration.AuditNotificationTargetConfigurationsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountAuditConfiguration.AuditNotificationTargetConfigurationsProperty>();
  ret.addPropertyResult("sns", "Sns", (properties.Sns != null ? CfnAccountAuditConfigurationAuditNotificationTargetPropertyFromCloudFormation(properties.Sns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAccountAuditConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccountAuditConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccountAuditConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.requiredValidator)(properties.accountId));
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("auditCheckConfigurations", cdk.requiredValidator)(properties.auditCheckConfigurations));
  errors.collect(cdk.propertyValidator("auditCheckConfigurations", CfnAccountAuditConfigurationAuditCheckConfigurationsPropertyValidator)(properties.auditCheckConfigurations));
  errors.collect(cdk.propertyValidator("auditNotificationTargetConfigurations", CfnAccountAuditConfigurationAuditNotificationTargetConfigurationsPropertyValidator)(properties.auditNotificationTargetConfigurations));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnAccountAuditConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnAccountAuditConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccountAuditConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "AuditCheckConfigurations": convertCfnAccountAuditConfigurationAuditCheckConfigurationsPropertyToCloudFormation(properties.auditCheckConfigurations),
    "AuditNotificationTargetConfigurations": convertCfnAccountAuditConfigurationAuditNotificationTargetConfigurationsPropertyToCloudFormation(properties.auditNotificationTargetConfigurations),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnAccountAuditConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountAuditConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountAuditConfigurationProps>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("auditCheckConfigurations", "AuditCheckConfigurations", (properties.AuditCheckConfigurations != null ? CfnAccountAuditConfigurationAuditCheckConfigurationsPropertyFromCloudFormation(properties.AuditCheckConfigurations) : undefined));
  ret.addPropertyResult("auditNotificationTargetConfigurations", "AuditNotificationTargetConfigurations", (properties.AuditNotificationTargetConfigurations != null ? CfnAccountAuditConfigurationAuditNotificationTargetConfigurationsPropertyFromCloudFormation(properties.AuditNotificationTargetConfigurations) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an authorizer.
 *
 * @cloudformationResource AWS::IoT::Authorizer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html
 */
export class CfnAuthorizer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::Authorizer";

  /**
   * Build a CfnAuthorizer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAuthorizer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAuthorizerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAuthorizer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the authorizer.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The authorizer's Lambda function ARN.
   */
  public authorizerFunctionArn: string;

  /**
   * The authorizer name.
   */
  public authorizerName?: string;

  /**
   * When `true` , the result from the authorizer's Lambda function is cached for clients that use persistent HTTP connections.
   */
  public enableCachingForHttp?: boolean | cdk.IResolvable;

  /**
   * Specifies whether AWS IoT validates the token signature in an authorization request.
   */
  public signingDisabled?: boolean | cdk.IResolvable;

  /**
   * The status of the authorizer.
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the custom authorizer.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The key used to extract the token from the HTTP headers.
   */
  public tokenKeyName?: string;

  /**
   * The public keys used to validate the token signature returned by your custom authentication service.
   */
  public tokenSigningPublicKeys?: cdk.IResolvable | Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAuthorizerProps) {
    super(scope, id, {
      "type": CfnAuthorizer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authorizerFunctionArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.authorizerFunctionArn = props.authorizerFunctionArn;
    this.authorizerName = props.authorizerName;
    this.enableCachingForHttp = props.enableCachingForHttp;
    this.signingDisabled = props.signingDisabled;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::Authorizer", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tokenKeyName = props.tokenKeyName;
    this.tokenSigningPublicKeys = props.tokenSigningPublicKeys;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authorizerFunctionArn": this.authorizerFunctionArn,
      "authorizerName": this.authorizerName,
      "enableCachingForHttp": this.enableCachingForHttp,
      "signingDisabled": this.signingDisabled,
      "status": this.status,
      "tags": this.tags.renderTags(),
      "tokenKeyName": this.tokenKeyName,
      "tokenSigningPublicKeys": this.tokenSigningPublicKeys
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAuthorizer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAuthorizerPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAuthorizer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html
 */
export interface CfnAuthorizerProps {
  /**
   * The authorizer's Lambda function ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html#cfn-iot-authorizer-authorizerfunctionarn
   */
  readonly authorizerFunctionArn: string;

  /**
   * The authorizer name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html#cfn-iot-authorizer-authorizername
   */
  readonly authorizerName?: string;

  /**
   * When `true` , the result from the authorizer's Lambda function is cached for clients that use persistent HTTP connections.
   *
   * The results are cached for the time specified by the Lambda function in `refreshAfterInSeconds` . This value doesn't affect authorization of clients that use MQTT connections.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html#cfn-iot-authorizer-enablecachingforhttp
   */
  readonly enableCachingForHttp?: boolean | cdk.IResolvable;

  /**
   * Specifies whether AWS IoT validates the token signature in an authorization request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html#cfn-iot-authorizer-signingdisabled
   */
  readonly signingDisabled?: boolean | cdk.IResolvable;

  /**
   * The status of the authorizer.
   *
   * Valid values: `ACTIVE` | `INACTIVE`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html#cfn-iot-authorizer-status
   */
  readonly status?: string;

  /**
   * Metadata which can be used to manage the custom authorizer.
   *
   * > For URI Request parameters use format: ...key1=value1&key2=value2...
   * >
   * > For the CLI command-line parameter use format: &&tags "key1=value1&key2=value2..."
   * >
   * > For the cli-input-json file use format: "tags": "key1=value1&key2=value2..."
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html#cfn-iot-authorizer-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The key used to extract the token from the HTTP headers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html#cfn-iot-authorizer-tokenkeyname
   */
  readonly tokenKeyName?: string;

  /**
   * The public keys used to validate the token signature returned by your custom authentication service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-authorizer.html#cfn-iot-authorizer-tokensigningpublickeys
   */
  readonly tokenSigningPublicKeys?: cdk.IResolvable | Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnAuthorizerProps`
 *
 * @param properties - the TypeScript properties of a `CfnAuthorizerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAuthorizerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizerFunctionArn", cdk.requiredValidator)(properties.authorizerFunctionArn));
  errors.collect(cdk.propertyValidator("authorizerFunctionArn", cdk.validateString)(properties.authorizerFunctionArn));
  errors.collect(cdk.propertyValidator("authorizerName", cdk.validateString)(properties.authorizerName));
  errors.collect(cdk.propertyValidator("enableCachingForHttp", cdk.validateBoolean)(properties.enableCachingForHttp));
  errors.collect(cdk.propertyValidator("signingDisabled", cdk.validateBoolean)(properties.signingDisabled));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tokenKeyName", cdk.validateString)(properties.tokenKeyName));
  errors.collect(cdk.propertyValidator("tokenSigningPublicKeys", cdk.hashValidator(cdk.validateString))(properties.tokenSigningPublicKeys));
  return errors.wrap("supplied properties not correct for \"CfnAuthorizerProps\"");
}

// @ts-ignore TS6133
function convertCfnAuthorizerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAuthorizerPropsValidator(properties).assertSuccess();
  return {
    "AuthorizerFunctionArn": cdk.stringToCloudFormation(properties.authorizerFunctionArn),
    "AuthorizerName": cdk.stringToCloudFormation(properties.authorizerName),
    "EnableCachingForHttp": cdk.booleanToCloudFormation(properties.enableCachingForHttp),
    "SigningDisabled": cdk.booleanToCloudFormation(properties.signingDisabled),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TokenKeyName": cdk.stringToCloudFormation(properties.tokenKeyName),
    "TokenSigningPublicKeys": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tokenSigningPublicKeys)
  };
}

// @ts-ignore TS6133
function CfnAuthorizerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAuthorizerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAuthorizerProps>();
  ret.addPropertyResult("authorizerFunctionArn", "AuthorizerFunctionArn", (properties.AuthorizerFunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerFunctionArn) : undefined));
  ret.addPropertyResult("authorizerName", "AuthorizerName", (properties.AuthorizerName != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerName) : undefined));
  ret.addPropertyResult("enableCachingForHttp", "EnableCachingForHttp", (properties.EnableCachingForHttp != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableCachingForHttp) : undefined));
  ret.addPropertyResult("signingDisabled", "SigningDisabled", (properties.SigningDisabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SigningDisabled) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tokenKeyName", "TokenKeyName", (properties.TokenKeyName != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyName) : undefined));
  ret.addPropertyResult("tokenSigningPublicKeys", "TokenSigningPublicKeys", (properties.TokenSigningPublicKeys != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.TokenSigningPublicKeys) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new billing group.
 *
 * Requires permission to access the [CreateBillingGroup](https://docs.aws.amazon.com//service-authorization/latest/reference/list_awsiot.html#awsiot-actions-as-permissions) action.
 *
 * @cloudformationResource AWS::IoT::BillingGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-billinggroup.html
 */
export class CfnBillingGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::BillingGroup";

  /**
   * Build a CfnBillingGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBillingGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBillingGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBillingGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the billing group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the billing group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the billing group.
   */
  public billingGroupName?: string;

  /**
   * The properties of the billing group.
   */
  public billingGroupProperties?: CfnBillingGroup.BillingGroupPropertiesProperty | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the billing group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBillingGroupProps = {}) {
    super(scope, id, {
      "type": CfnBillingGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.billingGroupName = props.billingGroupName;
    this.billingGroupProperties = props.billingGroupProperties;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::BillingGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "billingGroupName": this.billingGroupName,
      "billingGroupProperties": this.billingGroupProperties,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBillingGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBillingGroupPropsToCloudFormation(props);
  }
}

export namespace CfnBillingGroup {
  /**
   * The properties of a billing group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-billinggroup-billinggroupproperties.html
   */
  export interface BillingGroupPropertiesProperty {
    /**
     * The description of the billing group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-billinggroup-billinggroupproperties.html#cfn-iot-billinggroup-billinggroupproperties-billinggroupdescription
     */
    readonly billingGroupDescription?: string;
  }
}

/**
 * Properties for defining a `CfnBillingGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-billinggroup.html
 */
export interface CfnBillingGroupProps {
  /**
   * The name of the billing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-billinggroup.html#cfn-iot-billinggroup-billinggroupname
   */
  readonly billingGroupName?: string;

  /**
   * The properties of the billing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-billinggroup.html#cfn-iot-billinggroup-billinggroupproperties
   */
  readonly billingGroupProperties?: CfnBillingGroup.BillingGroupPropertiesProperty | cdk.IResolvable;

  /**
   * Metadata which can be used to manage the billing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-billinggroup.html#cfn-iot-billinggroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `BillingGroupPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `BillingGroupPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBillingGroupBillingGroupPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("billingGroupDescription", cdk.validateString)(properties.billingGroupDescription));
  return errors.wrap("supplied properties not correct for \"BillingGroupPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnBillingGroupBillingGroupPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBillingGroupBillingGroupPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BillingGroupDescription": cdk.stringToCloudFormation(properties.billingGroupDescription)
  };
}

// @ts-ignore TS6133
function CfnBillingGroupBillingGroupPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBillingGroup.BillingGroupPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBillingGroup.BillingGroupPropertiesProperty>();
  ret.addPropertyResult("billingGroupDescription", "BillingGroupDescription", (properties.BillingGroupDescription != null ? cfn_parse.FromCloudFormation.getString(properties.BillingGroupDescription) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBillingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnBillingGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBillingGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("billingGroupName", cdk.validateString)(properties.billingGroupName));
  errors.collect(cdk.propertyValidator("billingGroupProperties", CfnBillingGroupBillingGroupPropertiesPropertyValidator)(properties.billingGroupProperties));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnBillingGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnBillingGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBillingGroupPropsValidator(properties).assertSuccess();
  return {
    "BillingGroupName": cdk.stringToCloudFormation(properties.billingGroupName),
    "BillingGroupProperties": convertCfnBillingGroupBillingGroupPropertiesPropertyToCloudFormation(properties.billingGroupProperties),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnBillingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBillingGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBillingGroupProps>();
  ret.addPropertyResult("billingGroupName", "BillingGroupName", (properties.BillingGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.BillingGroupName) : undefined));
  ret.addPropertyResult("billingGroupProperties", "BillingGroupProperties", (properties.BillingGroupProperties != null ? CfnBillingGroupBillingGroupPropertiesPropertyFromCloudFormation(properties.BillingGroupProperties) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a CA certificate.
 *
 * @cloudformationResource AWS::IoT::CACertificate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html
 */
export class CfnCACertificate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::CACertificate";

  /**
   * Build a CfnCACertificate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCACertificate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCACertificatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCACertificate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) for the CA certificate. For example:
   *
   * `{ "Fn::GetAtt": ["MyCACertificate", "Arn"] }`
   *
   * A value similar to the following is returned:
   *
   * `arn:aws:iot:us-east-1:123456789012:cacert/a6be6b84559801927e35a8f901fae08b5971d78d1562e29504ff9663b276a5f5`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The CA certificate ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Whether the CA certificate is configured for auto registration of device certificates.
   */
  public autoRegistrationStatus?: string;

  /**
   * The certificate data in PEM format.
   */
  public caCertificatePem: string;

  /**
   * The mode of the CA.
   */
  public certificateMode?: string;

  /**
   * Information about the registration configuration.
   */
  public registrationConfig?: cdk.IResolvable | CfnCACertificate.RegistrationConfigProperty;

  /**
   * If true, removes auto registration.
   */
  public removeAutoRegistration?: boolean | cdk.IResolvable;

  /**
   * The status of the CA certificate.
   */
  public status: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The private key verification certificate.
   */
  public verificationCertificatePem?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCACertificateProps) {
    super(scope, id, {
      "type": CfnCACertificate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "caCertificatePem", this);
    cdk.requireProperty(props, "status", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.autoRegistrationStatus = props.autoRegistrationStatus;
    this.caCertificatePem = props.caCertificatePem;
    this.certificateMode = props.certificateMode;
    this.registrationConfig = props.registrationConfig;
    this.removeAutoRegistration = props.removeAutoRegistration;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::CACertificate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.verificationCertificatePem = props.verificationCertificatePem;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoRegistrationStatus": this.autoRegistrationStatus,
      "caCertificatePem": this.caCertificatePem,
      "certificateMode": this.certificateMode,
      "registrationConfig": this.registrationConfig,
      "removeAutoRegistration": this.removeAutoRegistration,
      "status": this.status,
      "tags": this.tags.renderTags(),
      "verificationCertificatePem": this.verificationCertificatePem
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCACertificate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCACertificatePropsToCloudFormation(props);
  }
}

export namespace CfnCACertificate {
  /**
   * The registration configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-cacertificate-registrationconfig.html
   */
  export interface RegistrationConfigProperty {
    /**
     * The ARN of the role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-cacertificate-registrationconfig.html#cfn-iot-cacertificate-registrationconfig-rolearn
     */
    readonly roleArn?: string;

    /**
     * The template body.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-cacertificate-registrationconfig.html#cfn-iot-cacertificate-registrationconfig-templatebody
     */
    readonly templateBody?: string;

    /**
     * The name of the provisioning template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-cacertificate-registrationconfig.html#cfn-iot-cacertificate-registrationconfig-templatename
     */
    readonly templateName?: string;
  }
}

/**
 * Properties for defining a `CfnCACertificate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html
 */
export interface CfnCACertificateProps {
  /**
   * Whether the CA certificate is configured for auto registration of device certificates.
   *
   * Valid values are "ENABLE" and "DISABLE".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html#cfn-iot-cacertificate-autoregistrationstatus
   */
  readonly autoRegistrationStatus?: string;

  /**
   * The certificate data in PEM format.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html#cfn-iot-cacertificate-cacertificatepem
   */
  readonly caCertificatePem: string;

  /**
   * The mode of the CA.
   *
   * All the device certificates that are registered using this CA will be registered in the same mode as the CA. For more information about certificate mode for device certificates, see [certificate mode](https://docs.aws.amazon.com//iot/latest/apireference/API_CertificateDescription.html#iot-Type-CertificateDescription-certificateMode) .
   *
   * Valid values are "DEFAULT" and "SNI_ONLY".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html#cfn-iot-cacertificate-certificatemode
   */
  readonly certificateMode?: string;

  /**
   * Information about the registration configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html#cfn-iot-cacertificate-registrationconfig
   */
  readonly registrationConfig?: cdk.IResolvable | CfnCACertificate.RegistrationConfigProperty;

  /**
   * If true, removes auto registration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html#cfn-iot-cacertificate-removeautoregistration
   */
  readonly removeAutoRegistration?: boolean | cdk.IResolvable;

  /**
   * The status of the CA certificate.
   *
   * Valid values are "ACTIVE" and "INACTIVE".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html#cfn-iot-cacertificate-status
   */
  readonly status: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html#cfn-iot-cacertificate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The private key verification certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-cacertificate.html#cfn-iot-cacertificate-verificationcertificatepem
   */
  readonly verificationCertificatePem?: string;
}

/**
 * Determine whether the given properties match those of a `RegistrationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RegistrationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCACertificateRegistrationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("templateBody", cdk.validateString)(properties.templateBody));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  return errors.wrap("supplied properties not correct for \"RegistrationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCACertificateRegistrationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCACertificateRegistrationConfigPropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TemplateBody": cdk.stringToCloudFormation(properties.templateBody),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName)
  };
}

// @ts-ignore TS6133
function CfnCACertificateRegistrationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCACertificate.RegistrationConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCACertificate.RegistrationConfigProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("templateBody", "TemplateBody", (properties.TemplateBody != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateBody) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCACertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnCACertificateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCACertificatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoRegistrationStatus", cdk.validateString)(properties.autoRegistrationStatus));
  errors.collect(cdk.propertyValidator("caCertificatePem", cdk.requiredValidator)(properties.caCertificatePem));
  errors.collect(cdk.propertyValidator("caCertificatePem", cdk.validateString)(properties.caCertificatePem));
  errors.collect(cdk.propertyValidator("certificateMode", cdk.validateString)(properties.certificateMode));
  errors.collect(cdk.propertyValidator("registrationConfig", CfnCACertificateRegistrationConfigPropertyValidator)(properties.registrationConfig));
  errors.collect(cdk.propertyValidator("removeAutoRegistration", cdk.validateBoolean)(properties.removeAutoRegistration));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("verificationCertificatePem", cdk.validateString)(properties.verificationCertificatePem));
  return errors.wrap("supplied properties not correct for \"CfnCACertificateProps\"");
}

// @ts-ignore TS6133
function convertCfnCACertificatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCACertificatePropsValidator(properties).assertSuccess();
  return {
    "AutoRegistrationStatus": cdk.stringToCloudFormation(properties.autoRegistrationStatus),
    "CACertificatePem": cdk.stringToCloudFormation(properties.caCertificatePem),
    "CertificateMode": cdk.stringToCloudFormation(properties.certificateMode),
    "RegistrationConfig": convertCfnCACertificateRegistrationConfigPropertyToCloudFormation(properties.registrationConfig),
    "RemoveAutoRegistration": cdk.booleanToCloudFormation(properties.removeAutoRegistration),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VerificationCertificatePem": cdk.stringToCloudFormation(properties.verificationCertificatePem)
  };
}

// @ts-ignore TS6133
function CfnCACertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCACertificateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCACertificateProps>();
  ret.addPropertyResult("autoRegistrationStatus", "AutoRegistrationStatus", (properties.AutoRegistrationStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AutoRegistrationStatus) : undefined));
  ret.addPropertyResult("caCertificatePem", "CACertificatePem", (properties.CACertificatePem != null ? cfn_parse.FromCloudFormation.getString(properties.CACertificatePem) : undefined));
  ret.addPropertyResult("certificateMode", "CertificateMode", (properties.CertificateMode != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateMode) : undefined));
  ret.addPropertyResult("registrationConfig", "RegistrationConfig", (properties.RegistrationConfig != null ? CfnCACertificateRegistrationConfigPropertyFromCloudFormation(properties.RegistrationConfig) : undefined));
  ret.addPropertyResult("removeAutoRegistration", "RemoveAutoRegistration", (properties.RemoveAutoRegistration != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveAutoRegistration) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("verificationCertificatePem", "VerificationCertificatePem", (properties.VerificationCertificatePem != null ? cfn_parse.FromCloudFormation.getString(properties.VerificationCertificatePem) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::Certificate` resource to declare an AWS IoT X.509 certificate. For information about working with X.509 certificates, see [X.509 Client Certificates](https://docs.aws.amazon.com/iot/latest/developerguide/x509-client-certs.html) in the *AWS IoT Developer Guide* .
 *
 * @cloudformationResource AWS::IoT::Certificate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html
 */
export class CfnCertificate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::Certificate";

  /**
   * Build a CfnCertificate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCertificate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCertificatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCertificate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) for the certificate. For example:
   *
   * `{ "Fn::GetAtt": ["MyCertificate", "Arn"] }`
   *
   * A value similar to the following is returned:
   *
   * `arn:aws:iot:ap-southeast-2:123456789012:cert/a1234567b89c012d3e4fg567hij8k9l01mno1p23q45678901rs234567890t1u2`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The certificate ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The CA certificate used to sign the device certificate being registered, not available when CertificateMode is SNI_ONLY.
   */
  public caCertificatePem?: string;

  /**
   * Specifies which mode of certificate registration to use with this resource.
   */
  public certificateMode?: string;

  /**
   * The certificate data in PEM format.
   */
  public certificatePem?: string;

  /**
   * The certificate signing request (CSR).
   */
  public certificateSigningRequest?: string;

  /**
   * The status of the certificate.
   */
  public status: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCertificateProps) {
    super(scope, id, {
      "type": CfnCertificate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "status", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.caCertificatePem = props.caCertificatePem;
    this.certificateMode = props.certificateMode;
    this.certificatePem = props.certificatePem;
    this.certificateSigningRequest = props.certificateSigningRequest;
    this.status = props.status;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "caCertificatePem": this.caCertificatePem,
      "certificateMode": this.certificateMode,
      "certificatePem": this.certificatePem,
      "certificateSigningRequest": this.certificateSigningRequest,
      "status": this.status
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCertificatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCertificate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html
 */
export interface CfnCertificateProps {
  /**
   * The CA certificate used to sign the device certificate being registered, not available when CertificateMode is SNI_ONLY.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html#cfn-iot-certificate-cacertificatepem
   */
  readonly caCertificatePem?: string;

  /**
   * Specifies which mode of certificate registration to use with this resource.
   *
   * Valid options are DEFAULT with CaCertificatePem and CertificatePem, SNI_ONLY with CertificatePem, and Default with CertificateSigningRequest.
   *
   * `DEFAULT` : A certificate in `DEFAULT` mode is either generated by AWS IoT Core or registered with an issuer certificate authority (CA). Devices with certificates in `DEFAULT` mode aren't required to send the Server Name Indication (SNI) extension when connecting to AWS IoT Core . However, to use features such as custom domains and VPC endpoints, we recommend that you use the SNI extension when connecting to AWS IoT Core .
   *
   * `SNI_ONLY` : A certificate in `SNI_ONLY` mode is registered without an issuer CA. Devices with certificates in `SNI_ONLY` mode must send the SNI extension when connecting to AWS IoT Core .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html#cfn-iot-certificate-certificatemode
   */
  readonly certificateMode?: string;

  /**
   * The certificate data in PEM format.
   *
   * Requires SNI_ONLY for the certificate mode or the accompanying CACertificatePem for registration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html#cfn-iot-certificate-certificatepem
   */
  readonly certificatePem?: string;

  /**
   * The certificate signing request (CSR).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html#cfn-iot-certificate-certificatesigningrequest
   */
  readonly certificateSigningRequest?: string;

  /**
   * The status of the certificate.
   *
   * Valid values are ACTIVE, INACTIVE, REVOKED, PENDING_TRANSFER, and PENDING_ACTIVATION.
   *
   * The status value REGISTER_INACTIVE is deprecated and should not be used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificate.html#cfn-iot-certificate-status
   */
  readonly status: string;
}

/**
 * Determine whether the given properties match those of a `CfnCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCertificatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("caCertificatePem", cdk.validateString)(properties.caCertificatePem));
  errors.collect(cdk.propertyValidator("certificateMode", cdk.validateString)(properties.certificateMode));
  errors.collect(cdk.propertyValidator("certificatePem", cdk.validateString)(properties.certificatePem));
  errors.collect(cdk.propertyValidator("certificateSigningRequest", cdk.validateString)(properties.certificateSigningRequest));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"CfnCertificateProps\"");
}

// @ts-ignore TS6133
function convertCfnCertificatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCertificatePropsValidator(properties).assertSuccess();
  return {
    "CACertificatePem": cdk.stringToCloudFormation(properties.caCertificatePem),
    "CertificateMode": cdk.stringToCloudFormation(properties.certificateMode),
    "CertificatePem": cdk.stringToCloudFormation(properties.certificatePem),
    "CertificateSigningRequest": cdk.stringToCloudFormation(properties.certificateSigningRequest),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProps>();
  ret.addPropertyResult("caCertificatePem", "CACertificatePem", (properties.CACertificatePem != null ? cfn_parse.FromCloudFormation.getString(properties.CACertificatePem) : undefined));
  ret.addPropertyResult("certificateMode", "CertificateMode", (properties.CertificateMode != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateMode) : undefined));
  ret.addPropertyResult("certificatePem", "CertificatePem", (properties.CertificatePem != null ? cfn_parse.FromCloudFormation.getString(properties.CertificatePem) : undefined));
  ret.addPropertyResult("certificateSigningRequest", "CertificateSigningRequest", (properties.CertificateSigningRequest != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateSigningRequest) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::CustomMetric` resource to define a custom metric published by your devices to Device Defender.
 *
 * For API reference, see [CreateCustomMetric](https://docs.aws.amazon.com/iot/latest/apireference/API_CreateCustomMetric.html) and for general information, see [Custom metrics](https://docs.aws.amazon.com/iot/latest/developerguide/dd-detect-custom-metrics.html) .
 *
 * @cloudformationResource AWS::IoT::CustomMetric
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-custommetric.html
 */
export class CfnCustomMetric extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::CustomMetric";

  /**
   * Build a CfnCustomMetric from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomMetric {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCustomMetricPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCustomMetric(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Number (ARN) of the custom metric; for example, `arn: *aws-partition* :iot: *region* : *accountId* :custommetric/ *metricName*` .
   *
   * @cloudformationAttribute MetricArn
   */
  public readonly attrMetricArn: string;

  /**
   * The friendly name in the console for the custom metric.
   */
  public displayName?: string;

  /**
   * The name of the custom metric.
   */
  public metricName?: string;

  /**
   * The type of the custom metric. Types include `string-list` , `ip-address-list` , `number-list` , and `number` .
   */
  public metricType: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that can be used to manage the custom metric.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCustomMetricProps) {
    super(scope, id, {
      "type": CfnCustomMetric.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "metricType", this);

    this.attrMetricArn = cdk.Token.asString(this.getAtt("MetricArn", cdk.ResolutionTypeHint.STRING));
    this.displayName = props.displayName;
    this.metricName = props.metricName;
    this.metricType = props.metricType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::CustomMetric", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "displayName": this.displayName,
      "metricName": this.metricName,
      "metricType": this.metricType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomMetric.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCustomMetricPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCustomMetric`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-custommetric.html
 */
export interface CfnCustomMetricProps {
  /**
   * The friendly name in the console for the custom metric.
   *
   * This name doesn't have to be unique. Don't use this name as the metric identifier in the device metric report. You can update the friendly name after you define it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-custommetric.html#cfn-iot-custommetric-displayname
   */
  readonly displayName?: string;

  /**
   * The name of the custom metric.
   *
   * This will be used in the metric report submitted from the device/thing. The name can't begin with `aws:` . You can’t change the name after you define it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-custommetric.html#cfn-iot-custommetric-metricname
   */
  readonly metricName?: string;

  /**
   * The type of the custom metric. Types include `string-list` , `ip-address-list` , `number-list` , and `number` .
   *
   * > The type `number` only takes a single metric value as an input, but when you submit the metrics value in the DeviceMetrics report, you must pass it as an array with a single value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-custommetric.html#cfn-iot-custommetric-metrictype
   */
  readonly metricType: string;

  /**
   * Metadata that can be used to manage the custom metric.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-custommetric.html#cfn-iot-custommetric-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnCustomMetricProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomMetricProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomMetricPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricType", cdk.requiredValidator)(properties.metricType));
  errors.collect(cdk.propertyValidator("metricType", cdk.validateString)(properties.metricType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCustomMetricProps\"");
}

// @ts-ignore TS6133
function convertCfnCustomMetricPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomMetricPropsValidator(properties).assertSuccess();
  return {
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "MetricType": cdk.stringToCloudFormation(properties.metricType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCustomMetricPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomMetricProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomMetricProps>();
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("metricType", "MetricType", (properties.MetricType != null ? cfn_parse.FromCloudFormation.getString(properties.MetricType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::Dimension` to limit the scope of a metric used in a security profile for AWS IoT Device Defender .
 *
 * For example, using a `TOPIC_FILTER` dimension, you can narrow down the scope of the metric to only MQTT topics where the name matches the pattern specified in the dimension. For API reference, see [CreateDimension](https://docs.aws.amazon.com/iot/latest/apireference/API_CreateDimension.html) and for general information, see [Scoping metrics in security profiles using dimensions](https://docs.aws.amazon.com/iot/latest/developerguide/scoping-security-behavior.html) .
 *
 * @cloudformationResource AWS::IoT::Dimension
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-dimension.html
 */
export class CfnDimension extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::Dimension";

  /**
   * Build a CfnDimension from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDimension {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDimensionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDimension(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the dimension.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A unique identifier for the dimension.
   */
  public name?: string;

  /**
   * Specifies the value or list of values for the dimension.
   */
  public stringValues: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that can be used to manage the dimension.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specifies the type of dimension.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDimensionProps) {
    super(scope, id, {
      "type": CfnDimension.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "stringValues", this);
    cdk.requireProperty(props, "type", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.stringValues = props.stringValues;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::Dimension", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "stringValues": this.stringValues,
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDimension.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDimensionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDimension`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-dimension.html
 */
export interface CfnDimensionProps {
  /**
   * A unique identifier for the dimension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-dimension.html#cfn-iot-dimension-name
   */
  readonly name?: string;

  /**
   * Specifies the value or list of values for the dimension.
   *
   * For `TOPIC_FILTER` dimensions, this is a pattern used to match the MQTT topic (for example, "admin/#").
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-dimension.html#cfn-iot-dimension-stringvalues
   */
  readonly stringValues: Array<string>;

  /**
   * Metadata that can be used to manage the dimension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-dimension.html#cfn-iot-dimension-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies the type of dimension.
   *
   * Supported types: `TOPIC_FILTER.`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-dimension.html#cfn-iot-dimension-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnDimensionProps`
 *
 * @param properties - the TypeScript properties of a `CfnDimensionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDimensionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("stringValues", cdk.requiredValidator)(properties.stringValues));
  errors.collect(cdk.propertyValidator("stringValues", cdk.listValidator(cdk.validateString))(properties.stringValues));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnDimensionProps\"");
}

// @ts-ignore TS6133
function convertCfnDimensionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDimensionPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "StringValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.stringValues),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDimensionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDimensionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDimensionProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("stringValues", "StringValues", (properties.StringValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StringValues) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a domain configuration.
 *
 * @cloudformationResource AWS::IoT::DomainConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html
 */
export class CfnDomainConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::DomainConfiguration";

  /**
   * Build a CfnDomainConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomainConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDomainConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDomainConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the domain configuration.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The type of service delivered by the domain.
   *
   * @cloudformationAttribute DomainType
   */
  public readonly attrDomainType: string;

  /**
   * The ARNs of the certificates that AWS IoT passes to the device during the TLS handshake. Currently you can specify only one certificate ARN. This value is not required for AWS -managed domains.
   *
   * @cloudformationAttribute ServerCertificates
   */
  public readonly attrServerCertificates: cdk.IResolvable;

  /**
   * An object that specifies the authorization service for a domain.
   */
  public authorizerConfig?: CfnDomainConfiguration.AuthorizerConfigProperty | cdk.IResolvable;

  /**
   * The name of the domain configuration.
   */
  public domainConfigurationName?: string;

  /**
   * The status to which the domain configuration should be updated.
   */
  public domainConfigurationStatus?: string;

  /**
   * The name of the domain.
   */
  public domainName?: string;

  /**
   * The ARNs of the certificates that AWS IoT passes to the device during the TLS handshake.
   */
  public serverCertificateArns?: Array<string>;

  /**
   * The type of service delivered by the endpoint.
   */
  public serviceType?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the domain configuration.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * An object that specifies the TLS configuration for a domain.
   */
  public tlsConfig?: cdk.IResolvable | CfnDomainConfiguration.TlsConfigProperty;

  /**
   * The certificate used to validate the server certificate and prove domain name ownership.
   */
  public validationCertificateArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainConfigurationProps = {}) {
    super(scope, id, {
      "type": CfnDomainConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDomainType = cdk.Token.asString(this.getAtt("DomainType", cdk.ResolutionTypeHint.STRING));
    this.attrServerCertificates = this.getAtt("ServerCertificates");
    this.authorizerConfig = props.authorizerConfig;
    this.domainConfigurationName = props.domainConfigurationName;
    this.domainConfigurationStatus = props.domainConfigurationStatus;
    this.domainName = props.domainName;
    this.serverCertificateArns = props.serverCertificateArns;
    this.serviceType = props.serviceType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::DomainConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tlsConfig = props.tlsConfig;
    this.validationCertificateArn = props.validationCertificateArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authorizerConfig": this.authorizerConfig,
      "domainConfigurationName": this.domainConfigurationName,
      "domainConfigurationStatus": this.domainConfigurationStatus,
      "domainName": this.domainName,
      "serverCertificateArns": this.serverCertificateArns,
      "serviceType": this.serviceType,
      "tags": this.tags.renderTags(),
      "tlsConfig": this.tlsConfig,
      "validationCertificateArn": this.validationCertificateArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomainConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDomainConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnDomainConfiguration {
  /**
   * An object that specifies the TLS configuration for a domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-tlsconfig.html
   */
  export interface TlsConfigProperty {
    /**
     * The security policy for a domain configuration.
     *
     * For more information, see [Security policies](https://docs.aws.amazon.com/iot/latest/developerguide/transport-security.html#tls-policy-table) in the *AWS IoT Core developer guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-tlsconfig.html#cfn-iot-domainconfiguration-tlsconfig-securitypolicy
     */
    readonly securityPolicy?: string;
  }

  /**
   * An object that specifies the authorization service for a domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-authorizerconfig.html
   */
  export interface AuthorizerConfigProperty {
    /**
     * A Boolean that specifies whether the domain configuration's authorization service can be overridden.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-authorizerconfig.html#cfn-iot-domainconfiguration-authorizerconfig-allowauthorizeroverride
     */
    readonly allowAuthorizerOverride?: boolean | cdk.IResolvable;

    /**
     * The name of the authorization service for a domain configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-authorizerconfig.html#cfn-iot-domainconfiguration-authorizerconfig-defaultauthorizername
     */
    readonly defaultAuthorizerName?: string;
  }

  /**
   * An object that contains information about a server certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-servercertificatesummary.html
   */
  export interface ServerCertificateSummaryProperty {
    /**
     * The ARN of the server certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-servercertificatesummary.html#cfn-iot-domainconfiguration-servercertificatesummary-servercertificatearn
     */
    readonly serverCertificateArn?: string;

    /**
     * The status of the server certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-servercertificatesummary.html#cfn-iot-domainconfiguration-servercertificatesummary-servercertificatestatus
     */
    readonly serverCertificateStatus?: string;

    /**
     * Details that explain the status of the server certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-domainconfiguration-servercertificatesummary.html#cfn-iot-domainconfiguration-servercertificatesummary-servercertificatestatusdetail
     */
    readonly serverCertificateStatusDetail?: string;
  }
}

/**
 * Properties for defining a `CfnDomainConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html
 */
export interface CfnDomainConfigurationProps {
  /**
   * An object that specifies the authorization service for a domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-authorizerconfig
   */
  readonly authorizerConfig?: CfnDomainConfiguration.AuthorizerConfigProperty | cdk.IResolvable;

  /**
   * The name of the domain configuration.
   *
   * This value must be unique to a region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-domainconfigurationname
   */
  readonly domainConfigurationName?: string;

  /**
   * The status to which the domain configuration should be updated.
   *
   * Valid values: `ENABLED` | `DISABLED`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-domainconfigurationstatus
   */
  readonly domainConfigurationStatus?: string;

  /**
   * The name of the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-domainname
   */
  readonly domainName?: string;

  /**
   * The ARNs of the certificates that AWS IoT passes to the device during the TLS handshake.
   *
   * Currently you can specify only one certificate ARN. This value is not required for AWS -managed domains.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-servercertificatearns
   */
  readonly serverCertificateArns?: Array<string>;

  /**
   * The type of service delivered by the endpoint.
   *
   * > AWS IoT Core currently supports only the `DATA` service type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-servicetype
   */
  readonly serviceType?: string;

  /**
   * Metadata which can be used to manage the domain configuration.
   *
   * > For URI Request parameters use format: ...key1=value1&key2=value2...
   * >
   * > For the CLI command-line parameter use format: &&tags "key1=value1&key2=value2..."
   * >
   * > For the cli-input-json file use format: "tags": "key1=value1&key2=value2..."
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * An object that specifies the TLS configuration for a domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-tlsconfig
   */
  readonly tlsConfig?: cdk.IResolvable | CfnDomainConfiguration.TlsConfigProperty;

  /**
   * The certificate used to validate the server certificate and prove domain name ownership.
   *
   * This certificate must be signed by a public certificate authority. This value is not required for AWS -managed domains.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-domainconfiguration.html#cfn-iot-domainconfiguration-validationcertificatearn
   */
  readonly validationCertificateArn?: string;
}

/**
 * Determine whether the given properties match those of a `TlsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TlsConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainConfigurationTlsConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityPolicy", cdk.validateString)(properties.securityPolicy));
  return errors.wrap("supplied properties not correct for \"TlsConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainConfigurationTlsConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainConfigurationTlsConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityPolicy": cdk.stringToCloudFormation(properties.securityPolicy)
  };
}

// @ts-ignore TS6133
function CfnDomainConfigurationTlsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomainConfiguration.TlsConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainConfiguration.TlsConfigProperty>();
  ret.addPropertyResult("securityPolicy", "SecurityPolicy", (properties.SecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthorizerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainConfigurationAuthorizerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowAuthorizerOverride", cdk.validateBoolean)(properties.allowAuthorizerOverride));
  errors.collect(cdk.propertyValidator("defaultAuthorizerName", cdk.validateString)(properties.defaultAuthorizerName));
  return errors.wrap("supplied properties not correct for \"AuthorizerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainConfigurationAuthorizerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainConfigurationAuthorizerConfigPropertyValidator(properties).assertSuccess();
  return {
    "AllowAuthorizerOverride": cdk.booleanToCloudFormation(properties.allowAuthorizerOverride),
    "DefaultAuthorizerName": cdk.stringToCloudFormation(properties.defaultAuthorizerName)
  };
}

// @ts-ignore TS6133
function CfnDomainConfigurationAuthorizerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainConfiguration.AuthorizerConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainConfiguration.AuthorizerConfigProperty>();
  ret.addPropertyResult("allowAuthorizerOverride", "AllowAuthorizerOverride", (properties.AllowAuthorizerOverride != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowAuthorizerOverride) : undefined));
  ret.addPropertyResult("defaultAuthorizerName", "DefaultAuthorizerName", (properties.DefaultAuthorizerName != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthorizerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerCertificateSummaryProperty`
 *
 * @param properties - the TypeScript properties of a `ServerCertificateSummaryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainConfigurationServerCertificateSummaryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serverCertificateArn", cdk.validateString)(properties.serverCertificateArn));
  errors.collect(cdk.propertyValidator("serverCertificateStatus", cdk.validateString)(properties.serverCertificateStatus));
  errors.collect(cdk.propertyValidator("serverCertificateStatusDetail", cdk.validateString)(properties.serverCertificateStatusDetail));
  return errors.wrap("supplied properties not correct for \"ServerCertificateSummaryProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainConfigurationServerCertificateSummaryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainConfigurationServerCertificateSummaryPropertyValidator(properties).assertSuccess();
  return {
    "ServerCertificateArn": cdk.stringToCloudFormation(properties.serverCertificateArn),
    "ServerCertificateStatus": cdk.stringToCloudFormation(properties.serverCertificateStatus),
    "ServerCertificateStatusDetail": cdk.stringToCloudFormation(properties.serverCertificateStatusDetail)
  };
}

// @ts-ignore TS6133
function CfnDomainConfigurationServerCertificateSummaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomainConfiguration.ServerCertificateSummaryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainConfiguration.ServerCertificateSummaryProperty>();
  ret.addPropertyResult("serverCertificateArn", "ServerCertificateArn", (properties.ServerCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServerCertificateArn) : undefined));
  ret.addPropertyResult("serverCertificateStatus", "ServerCertificateStatus", (properties.ServerCertificateStatus != null ? cfn_parse.FromCloudFormation.getString(properties.ServerCertificateStatus) : undefined));
  ret.addPropertyResult("serverCertificateStatusDetail", "ServerCertificateStatusDetail", (properties.ServerCertificateStatusDetail != null ? cfn_parse.FromCloudFormation.getString(properties.ServerCertificateStatusDetail) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDomainConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizerConfig", CfnDomainConfigurationAuthorizerConfigPropertyValidator)(properties.authorizerConfig));
  errors.collect(cdk.propertyValidator("domainConfigurationName", cdk.validateString)(properties.domainConfigurationName));
  errors.collect(cdk.propertyValidator("domainConfigurationStatus", cdk.validateString)(properties.domainConfigurationStatus));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("serverCertificateArns", cdk.listValidator(cdk.validateString))(properties.serverCertificateArns));
  errors.collect(cdk.propertyValidator("serviceType", cdk.validateString)(properties.serviceType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tlsConfig", CfnDomainConfigurationTlsConfigPropertyValidator)(properties.tlsConfig));
  errors.collect(cdk.propertyValidator("validationCertificateArn", cdk.validateString)(properties.validationCertificateArn));
  return errors.wrap("supplied properties not correct for \"CfnDomainConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AuthorizerConfig": convertCfnDomainConfigurationAuthorizerConfigPropertyToCloudFormation(properties.authorizerConfig),
    "DomainConfigurationName": cdk.stringToCloudFormation(properties.domainConfigurationName),
    "DomainConfigurationStatus": cdk.stringToCloudFormation(properties.domainConfigurationStatus),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "ServerCertificateArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.serverCertificateArns),
    "ServiceType": cdk.stringToCloudFormation(properties.serviceType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TlsConfig": convertCfnDomainConfigurationTlsConfigPropertyToCloudFormation(properties.tlsConfig),
    "ValidationCertificateArn": cdk.stringToCloudFormation(properties.validationCertificateArn)
  };
}

// @ts-ignore TS6133
function CfnDomainConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainConfigurationProps>();
  ret.addPropertyResult("authorizerConfig", "AuthorizerConfig", (properties.AuthorizerConfig != null ? CfnDomainConfigurationAuthorizerConfigPropertyFromCloudFormation(properties.AuthorizerConfig) : undefined));
  ret.addPropertyResult("domainConfigurationName", "DomainConfigurationName", (properties.DomainConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainConfigurationName) : undefined));
  ret.addPropertyResult("domainConfigurationStatus", "DomainConfigurationStatus", (properties.DomainConfigurationStatus != null ? cfn_parse.FromCloudFormation.getString(properties.DomainConfigurationStatus) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("serverCertificateArns", "ServerCertificateArns", (properties.ServerCertificateArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ServerCertificateArns) : undefined));
  ret.addPropertyResult("serviceType", "ServiceType", (properties.ServiceType != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tlsConfig", "TlsConfig", (properties.TlsConfig != null ? CfnDomainConfigurationTlsConfigPropertyFromCloudFormation(properties.TlsConfig) : undefined));
  ret.addPropertyResult("validationCertificateArn", "ValidationCertificateArn", (properties.ValidationCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.ValidationCertificateArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::FleetMetric` resource to declare a fleet metric.
 *
 * @cloudformationResource AWS::IoT::FleetMetric
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html
 */
export class CfnFleetMetric extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::FleetMetric";

  /**
   * Build a CfnFleetMetric from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleetMetric {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFleetMetricPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFleetMetric(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time the fleet metric was created.
   *
   * @cloudformationAttribute CreationDate
   */
  public readonly attrCreationDate: cdk.IResolvable;

  /**
   * The time the fleet metric was last modified.
   *
   * @cloudformationAttribute LastModifiedDate
   */
  public readonly attrLastModifiedDate: cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the fleet metric.
   *
   * @cloudformationAttribute MetricArn
   */
  public readonly attrMetricArn: string;

  /**
   * The fleet metric version.
   *
   * @cloudformationAttribute Version
   */
  public readonly attrVersion: cdk.IResolvable;

  /**
   * The field to aggregate.
   */
  public aggregationField?: string;

  /**
   * The type of the aggregation query.
   */
  public aggregationType?: CfnFleetMetric.AggregationTypeProperty | cdk.IResolvable;

  /**
   * The fleet metric description.
   */
  public description?: string;

  /**
   * The name of the index to search.
   */
  public indexName?: string;

  /**
   * The name of the fleet metric to create.
   */
  public metricName: string;

  /**
   * The time in seconds between fleet metric emissions.
   */
  public period?: number;

  /**
   * The search query string.
   */
  public queryString?: string;

  /**
   * The query version.
   */
  public queryVersion?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the fleet metric.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Used to support unit transformation such as milliseconds to seconds.
   */
  public unit?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFleetMetricProps) {
    super(scope, id, {
      "type": CfnFleetMetric.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "metricName", this);

    this.attrCreationDate = this.getAtt("CreationDate", cdk.ResolutionTypeHint.NUMBER);
    this.attrLastModifiedDate = this.getAtt("LastModifiedDate", cdk.ResolutionTypeHint.NUMBER);
    this.attrMetricArn = cdk.Token.asString(this.getAtt("MetricArn", cdk.ResolutionTypeHint.STRING));
    this.attrVersion = this.getAtt("Version", cdk.ResolutionTypeHint.NUMBER);
    this.aggregationField = props.aggregationField;
    this.aggregationType = props.aggregationType;
    this.description = props.description;
    this.indexName = props.indexName;
    this.metricName = props.metricName;
    this.period = props.period;
    this.queryString = props.queryString;
    this.queryVersion = props.queryVersion;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::FleetMetric", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.unit = props.unit;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "aggregationField": this.aggregationField,
      "aggregationType": this.aggregationType,
      "description": this.description,
      "indexName": this.indexName,
      "metricName": this.metricName,
      "period": this.period,
      "queryString": this.queryString,
      "queryVersion": this.queryVersion,
      "tags": this.tags.renderTags(),
      "unit": this.unit
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFleetMetric.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFleetMetricPropsToCloudFormation(props);
  }
}

export namespace CfnFleetMetric {
  /**
   * The type of aggregation queries.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-fleetmetric-aggregationtype.html
   */
  export interface AggregationTypeProperty {
    /**
     * The name of the aggregation type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-fleetmetric-aggregationtype.html#cfn-iot-fleetmetric-aggregationtype-name
     */
    readonly name: string;

    /**
     * A list of the values of aggregation types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-fleetmetric-aggregationtype.html#cfn-iot-fleetmetric-aggregationtype-values
     */
    readonly values: Array<string>;
  }
}

/**
 * Properties for defining a `CfnFleetMetric`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html
 */
export interface CfnFleetMetricProps {
  /**
   * The field to aggregate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-aggregationfield
   */
  readonly aggregationField?: string;

  /**
   * The type of the aggregation query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-aggregationtype
   */
  readonly aggregationType?: CfnFleetMetric.AggregationTypeProperty | cdk.IResolvable;

  /**
   * The fleet metric description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-description
   */
  readonly description?: string;

  /**
   * The name of the index to search.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-indexname
   */
  readonly indexName?: string;

  /**
   * The name of the fleet metric to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-metricname
   */
  readonly metricName: string;

  /**
   * The time in seconds between fleet metric emissions.
   *
   * Range [60(1 min), 86400(1 day)] and must be multiple of 60.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-period
   */
  readonly period?: number;

  /**
   * The search query string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-querystring
   */
  readonly queryString?: string;

  /**
   * The query version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-queryversion
   */
  readonly queryVersion?: string;

  /**
   * Metadata which can be used to manage the fleet metric.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Used to support unit transformation such as milliseconds to seconds.
   *
   * Must be a unit supported by CW metric. Default to null.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-fleetmetric.html#cfn-iot-fleetmetric-unit
   */
  readonly unit?: string;
}

/**
 * Determine whether the given properties match those of a `AggregationTypeProperty`
 *
 * @param properties - the TypeScript properties of a `AggregationTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetMetricAggregationTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"AggregationTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetMetricAggregationTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetMetricAggregationTypePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnFleetMetricAggregationTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleetMetric.AggregationTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleetMetric.AggregationTypeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFleetMetricProps`
 *
 * @param properties - the TypeScript properties of a `CfnFleetMetricProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetMetricPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregationField", cdk.validateString)(properties.aggregationField));
  errors.collect(cdk.propertyValidator("aggregationType", CfnFleetMetricAggregationTypePropertyValidator)(properties.aggregationType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("indexName", cdk.validateString)(properties.indexName));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("period", cdk.validateNumber)(properties.period));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateString)(properties.queryString));
  errors.collect(cdk.propertyValidator("queryVersion", cdk.validateString)(properties.queryVersion));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"CfnFleetMetricProps\"");
}

// @ts-ignore TS6133
function convertCfnFleetMetricPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetMetricPropsValidator(properties).assertSuccess();
  return {
    "AggregationField": cdk.stringToCloudFormation(properties.aggregationField),
    "AggregationType": convertCfnFleetMetricAggregationTypePropertyToCloudFormation(properties.aggregationType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IndexName": cdk.stringToCloudFormation(properties.indexName),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Period": cdk.numberToCloudFormation(properties.period),
    "QueryString": cdk.stringToCloudFormation(properties.queryString),
    "QueryVersion": cdk.stringToCloudFormation(properties.queryVersion),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnFleetMetricPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleetMetricProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleetMetricProps>();
  ret.addPropertyResult("aggregationField", "AggregationField", (properties.AggregationField != null ? cfn_parse.FromCloudFormation.getString(properties.AggregationField) : undefined));
  ret.addPropertyResult("aggregationType", "AggregationType", (properties.AggregationType != null ? CfnFleetMetricAggregationTypePropertyFromCloudFormation(properties.AggregationType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("indexName", "IndexName", (properties.IndexName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexName) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("period", "Period", (properties.Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.Period) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getString(properties.QueryString) : undefined));
  ret.addPropertyResult("queryVersion", "QueryVersion", (properties.QueryVersion != null ? cfn_parse.FromCloudFormation.getString(properties.QueryVersion) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Represents a job template.
 *
 * @cloudformationResource AWS::IoT::JobTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html
 */
export class CfnJobTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::JobTemplate";

  /**
   * Build a CfnJobTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnJobTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnJobTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnJobTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the job to use as the basis for the job template.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The criteria that determine when and how a job abort takes place.
   */
  public abortConfig?: any | cdk.IResolvable;

  /**
   * A description of the job template.
   */
  public description: string;

  /**
   * The package version Amazon Resource Names (ARNs) that are installed on the device’s reserved named shadow ( `$package` ) when the job successfully completes.
   */
  public destinationPackageVersions?: Array<string>;

  /**
   * The job document.
   */
  public document?: string;

  /**
   * An S3 link, or S3 object URL, to the job document.
   */
  public documentSource?: string;

  /**
   * The ARN of the job to use as the basis for the job template.
   */
  public jobArn?: string;

  /**
   * Allows you to create the criteria to retry a job.
   */
  public jobExecutionsRetryConfig?: cdk.IResolvable | CfnJobTemplate.JobExecutionsRetryConfigProperty;

  /**
   * Allows you to create a staged rollout of a job.
   */
  public jobExecutionsRolloutConfig?: any | cdk.IResolvable;

  /**
   * A unique identifier for the job template.
   */
  public jobTemplateId: string;

  /**
   * An optional configuration within the SchedulingConfig to setup a recurring maintenance window with a predetermined start time and duration for the rollout of a job document to all devices in a target group for a job.
   */
  public maintenanceWindows?: Array<cdk.IResolvable | CfnJobTemplate.MaintenanceWindowProperty> | cdk.IResolvable;

  /**
   * Configuration for pre-signed S3 URLs.
   */
  public presignedUrlConfig?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that can be used to manage the job template.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specifies the amount of time each device has to finish its execution of the job.
   */
  public timeoutConfig?: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnJobTemplateProps) {
    super(scope, id, {
      "type": CfnJobTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "jobTemplateId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.abortConfig = props.abortConfig;
    this.description = props.description;
    this.destinationPackageVersions = props.destinationPackageVersions;
    this.document = props.document;
    this.documentSource = props.documentSource;
    this.jobArn = props.jobArn;
    this.jobExecutionsRetryConfig = props.jobExecutionsRetryConfig;
    this.jobExecutionsRolloutConfig = props.jobExecutionsRolloutConfig;
    this.jobTemplateId = props.jobTemplateId;
    this.maintenanceWindows = props.maintenanceWindows;
    this.presignedUrlConfig = props.presignedUrlConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::JobTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeoutConfig = props.timeoutConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "abortConfig": this.abortConfig,
      "description": this.description,
      "destinationPackageVersions": this.destinationPackageVersions,
      "document": this.document,
      "documentSource": this.documentSource,
      "jobArn": this.jobArn,
      "jobExecutionsRetryConfig": this.jobExecutionsRetryConfig,
      "jobExecutionsRolloutConfig": this.jobExecutionsRolloutConfig,
      "jobTemplateId": this.jobTemplateId,
      "maintenanceWindows": this.maintenanceWindows,
      "presignedUrlConfig": this.presignedUrlConfig,
      "tags": this.tags.renderTags(),
      "timeoutConfig": this.timeoutConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnJobTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnJobTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnJobTemplate {
  /**
   * Specifies the amount of time each device has to finish its execution of the job.
   *
   * A timer is started when the job execution status is set to `IN_PROGRESS` . If the job execution status is not set to another terminal state before the timer expires, it will be automatically set to `TIMED_OUT` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-timeoutconfig.html
   */
  export interface TimeoutConfigProperty {
    /**
     * Specifies the amount of time, in minutes, this device has to finish execution of this job.
     *
     * The timeout interval can be anywhere between 1 minute and 7 days (1 to 10080 minutes). The in progress timer can't be updated and will apply to all job executions for the job. Whenever a job execution remains in the IN_PROGRESS status for longer than this interval, the job execution will fail and switch to the terminal `TIMED_OUT` status.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-timeoutconfig.html#cfn-iot-jobtemplate-timeoutconfig-inprogresstimeoutinminutes
     */
    readonly inProgressTimeoutInMinutes: number;
  }

  /**
   * The configuration that determines how many retries are allowed for each failure type for a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-jobexecutionsretryconfig.html
   */
  export interface JobExecutionsRetryConfigProperty {
    /**
     * The list of criteria that determines how many retries are allowed for each failure type for a job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-jobexecutionsretryconfig.html#cfn-iot-jobtemplate-jobexecutionsretryconfig-retrycriterialist
     */
    readonly retryCriteriaList?: Array<cdk.IResolvable | CfnJobTemplate.RetryCriteriaProperty> | cdk.IResolvable;
  }

  /**
   * The criteria that determines how many retries are allowed for each failure type for a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-retrycriteria.html
   */
  export interface RetryCriteriaProperty {
    /**
     * The type of job execution failures that can initiate a job retry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-retrycriteria.html#cfn-iot-jobtemplate-retrycriteria-failuretype
     */
    readonly failureType?: string;

    /**
     * The number of retries allowed for a failure type for the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-retrycriteria.html#cfn-iot-jobtemplate-retrycriteria-numberofretries
     */
    readonly numberOfRetries?: number;
  }

  /**
   * The criteria that determine when and how a job abort takes place.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-abortconfig.html
   */
  export interface AbortConfigProperty {
    /**
     * The list of criteria that determine when and how to abort the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-abortconfig.html#cfn-iot-jobtemplate-abortconfig-criterialist
     */
    readonly criteriaList: Array<CfnJobTemplate.AbortCriteriaProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The criteria that determine when and how a job abort takes place.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-abortcriteria.html
   */
  export interface AbortCriteriaProperty {
    /**
     * The type of job action to take to initiate the job abort.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-abortcriteria.html#cfn-iot-jobtemplate-abortcriteria-action
     */
    readonly action: string;

    /**
     * The type of job execution failures that can initiate a job abort.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-abortcriteria.html#cfn-iot-jobtemplate-abortcriteria-failuretype
     */
    readonly failureType: string;

    /**
     * The minimum number of things which must receive job execution notifications before the job can be aborted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-abortcriteria.html#cfn-iot-jobtemplate-abortcriteria-minnumberofexecutedthings
     */
    readonly minNumberOfExecutedThings: number;

    /**
     * The minimum percentage of job execution failures that must occur to initiate the job abort.
     *
     * AWS IoT Core supports up to two digits after the decimal (for example, 10.9 and 10.99, but not 10.999).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-abortcriteria.html#cfn-iot-jobtemplate-abortcriteria-thresholdpercentage
     */
    readonly thresholdPercentage: number;
  }

  /**
   * Allows you to create a staged rollout of a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-jobexecutionsrolloutconfig.html
   */
  export interface JobExecutionsRolloutConfigProperty {
    /**
     * The rate of increase for a job rollout.
     *
     * This parameter allows you to define an exponential rate for a job rollout.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-jobexecutionsrolloutconfig.html#cfn-iot-jobtemplate-jobexecutionsrolloutconfig-exponentialrolloutrate
     */
    readonly exponentialRolloutRate?: CfnJobTemplate.ExponentialRolloutRateProperty | cdk.IResolvable;

    /**
     * The maximum number of things that will be notified of a pending job, per minute.
     *
     * This parameter allows you to create a staged rollout.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-jobexecutionsrolloutconfig.html#cfn-iot-jobtemplate-jobexecutionsrolloutconfig-maximumperminute
     */
    readonly maximumPerMinute?: number;
  }

  /**
   * Allows you to create an exponential rate of rollout for a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-exponentialrolloutrate.html
   */
  export interface ExponentialRolloutRateProperty {
    /**
     * The minimum number of things that will be notified of a pending job, per minute at the start of job rollout.
     *
     * This parameter allows you to define the initial rate of rollout.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-exponentialrolloutrate.html#cfn-iot-jobtemplate-exponentialrolloutrate-baserateperminute
     */
    readonly baseRatePerMinute: number;

    /**
     * The exponential factor to increase the rate of rollout for a job.
     *
     * AWS IoT Core supports up to one digit after the decimal (for example, 1.5, but not 1.55).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-exponentialrolloutrate.html#cfn-iot-jobtemplate-exponentialrolloutrate-incrementfactor
     */
    readonly incrementFactor: number;

    /**
     * The criteria to initiate the increase in rate of rollout for a job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-exponentialrolloutrate.html#cfn-iot-jobtemplate-exponentialrolloutrate-rateincreasecriteria
     */
    readonly rateIncreaseCriteria: cdk.IResolvable | CfnJobTemplate.RateIncreaseCriteriaProperty;
  }

  /**
   * Allows you to define a criteria to initiate the increase in rate of rollout for a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-rateincreasecriteria.html
   */
  export interface RateIncreaseCriteriaProperty {
    /**
     * The threshold for number of notified things that will initiate the increase in rate of rollout.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-rateincreasecriteria.html#cfn-iot-jobtemplate-rateincreasecriteria-numberofnotifiedthings
     */
    readonly numberOfNotifiedThings?: number;

    /**
     * The threshold for number of succeeded things that will initiate the increase in rate of rollout.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-rateincreasecriteria.html#cfn-iot-jobtemplate-rateincreasecriteria-numberofsucceededthings
     */
    readonly numberOfSucceededThings?: number;
  }

  /**
   * An optional configuration within the `SchedulingConfig` to setup a recurring maintenance window with a predetermined start time and duration for the rollout of a job document to all devices in a target group for a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-maintenancewindow.html
   */
  export interface MaintenanceWindowProperty {
    /**
     * Displays the duration of the next maintenance window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-maintenancewindow.html#cfn-iot-jobtemplate-maintenancewindow-durationinminutes
     */
    readonly durationInMinutes?: number;

    /**
     * Displays the start time of the next maintenance window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-maintenancewindow.html#cfn-iot-jobtemplate-maintenancewindow-starttime
     */
    readonly startTime?: string;
  }

  /**
   * Configuration for pre-signed S3 URLs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-presignedurlconfig.html
   */
  export interface PresignedUrlConfigProperty {
    /**
     * How long (in seconds) pre-signed URLs are valid.
     *
     * Valid values are 60 - 3600, the default value is 3600 seconds. Pre-signed URLs are generated when Jobs receives an MQTT request for the job document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-presignedurlconfig.html#cfn-iot-jobtemplate-presignedurlconfig-expiresinsec
     */
    readonly expiresInSec?: number;

    /**
     * The ARN of an IAM role that grants grants permission to download files from the S3 bucket where the job data/updates are stored.
     *
     * The role must also grant permission for IoT to download the files.
     *
     * > For information about addressing the confused deputy problem, see [cross-service confused deputy prevention](https://docs.aws.amazon.com/iot/latest/developerguide/cross-service-confused-deputy-prevention.html) in the *AWS IoT Core developer guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-jobtemplate-presignedurlconfig.html#cfn-iot-jobtemplate-presignedurlconfig-rolearn
     */
    readonly roleArn: string;
  }
}

/**
 * Properties for defining a `CfnJobTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html
 */
export interface CfnJobTemplateProps {
  /**
   * The criteria that determine when and how a job abort takes place.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-abortconfig
   */
  readonly abortConfig?: any | cdk.IResolvable;

  /**
   * A description of the job template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-description
   */
  readonly description: string;

  /**
   * The package version Amazon Resource Names (ARNs) that are installed on the device’s reserved named shadow ( `$package` ) when the job successfully completes.
   *
   * *Note:* Up to 25 package version ARNS are allowed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-destinationpackageversions
   */
  readonly destinationPackageVersions?: Array<string>;

  /**
   * The job document.
   *
   * Required if you don't specify a value for `documentSource` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-document
   */
  readonly document?: string;

  /**
   * An S3 link, or S3 object URL, to the job document.
   *
   * The link is an Amazon S3 object URL and is required if you don't specify a value for `document` .
   *
   * For example, `--document-source https://s3. *region-code* .amazonaws.com/example-firmware/device-firmware.1.0`
   *
   * For more information, see [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-documentsource
   */
  readonly documentSource?: string;

  /**
   * The ARN of the job to use as the basis for the job template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-jobarn
   */
  readonly jobArn?: string;

  /**
   * Allows you to create the criteria to retry a job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-jobexecutionsretryconfig
   */
  readonly jobExecutionsRetryConfig?: cdk.IResolvable | CfnJobTemplate.JobExecutionsRetryConfigProperty;

  /**
   * Allows you to create a staged rollout of a job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-jobexecutionsrolloutconfig
   */
  readonly jobExecutionsRolloutConfig?: any | cdk.IResolvable;

  /**
   * A unique identifier for the job template.
   *
   * We recommend using a UUID. Alpha-numeric characters, "-", and "_" are valid for use here.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-jobtemplateid
   */
  readonly jobTemplateId: string;

  /**
   * An optional configuration within the SchedulingConfig to setup a recurring maintenance window with a predetermined start time and duration for the rollout of a job document to all devices in a target group for a job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-maintenancewindows
   */
  readonly maintenanceWindows?: Array<cdk.IResolvable | CfnJobTemplate.MaintenanceWindowProperty> | cdk.IResolvable;

  /**
   * Configuration for pre-signed S3 URLs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-presignedurlconfig
   */
  readonly presignedUrlConfig?: any | cdk.IResolvable;

  /**
   * Metadata that can be used to manage the job template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies the amount of time each device has to finish its execution of the job.
   *
   * A timer is started when the job execution status is set to `IN_PROGRESS` . If the job execution status is not set to another terminal state before the timer expires, it will be automatically set to `TIMED_OUT` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-jobtemplate.html#cfn-iot-jobtemplate-timeoutconfig
   */
  readonly timeoutConfig?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `TimeoutConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TimeoutConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateTimeoutConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inProgressTimeoutInMinutes", cdk.requiredValidator)(properties.inProgressTimeoutInMinutes));
  errors.collect(cdk.propertyValidator("inProgressTimeoutInMinutes", cdk.validateNumber)(properties.inProgressTimeoutInMinutes));
  return errors.wrap("supplied properties not correct for \"TimeoutConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateTimeoutConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateTimeoutConfigPropertyValidator(properties).assertSuccess();
  return {
    "InProgressTimeoutInMinutes": cdk.numberToCloudFormation(properties.inProgressTimeoutInMinutes)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateTimeoutConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobTemplate.TimeoutConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.TimeoutConfigProperty>();
  ret.addPropertyResult("inProgressTimeoutInMinutes", "InProgressTimeoutInMinutes", (properties.InProgressTimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.InProgressTimeoutInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetryCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `RetryCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateRetryCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureType", cdk.validateString)(properties.failureType));
  errors.collect(cdk.propertyValidator("numberOfRetries", cdk.validateNumber)(properties.numberOfRetries));
  return errors.wrap("supplied properties not correct for \"RetryCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateRetryCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateRetryCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "FailureType": cdk.stringToCloudFormation(properties.failureType),
    "NumberOfRetries": cdk.numberToCloudFormation(properties.numberOfRetries)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateRetryCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobTemplate.RetryCriteriaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.RetryCriteriaProperty>();
  ret.addPropertyResult("failureType", "FailureType", (properties.FailureType != null ? cfn_parse.FromCloudFormation.getString(properties.FailureType) : undefined));
  ret.addPropertyResult("numberOfRetries", "NumberOfRetries", (properties.NumberOfRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfRetries) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JobExecutionsRetryConfigProperty`
 *
 * @param properties - the TypeScript properties of a `JobExecutionsRetryConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateJobExecutionsRetryConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("retryCriteriaList", cdk.listValidator(CfnJobTemplateRetryCriteriaPropertyValidator))(properties.retryCriteriaList));
  return errors.wrap("supplied properties not correct for \"JobExecutionsRetryConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateJobExecutionsRetryConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateJobExecutionsRetryConfigPropertyValidator(properties).assertSuccess();
  return {
    "RetryCriteriaList": cdk.listMapper(convertCfnJobTemplateRetryCriteriaPropertyToCloudFormation)(properties.retryCriteriaList)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateJobExecutionsRetryConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobTemplate.JobExecutionsRetryConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.JobExecutionsRetryConfigProperty>();
  ret.addPropertyResult("retryCriteriaList", "RetryCriteriaList", (properties.RetryCriteriaList != null ? cfn_parse.FromCloudFormation.getArray(CfnJobTemplateRetryCriteriaPropertyFromCloudFormation)(properties.RetryCriteriaList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AbortCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `AbortCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateAbortCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("failureType", cdk.requiredValidator)(properties.failureType));
  errors.collect(cdk.propertyValidator("failureType", cdk.validateString)(properties.failureType));
  errors.collect(cdk.propertyValidator("minNumberOfExecutedThings", cdk.requiredValidator)(properties.minNumberOfExecutedThings));
  errors.collect(cdk.propertyValidator("minNumberOfExecutedThings", cdk.validateNumber)(properties.minNumberOfExecutedThings));
  errors.collect(cdk.propertyValidator("thresholdPercentage", cdk.requiredValidator)(properties.thresholdPercentage));
  errors.collect(cdk.propertyValidator("thresholdPercentage", cdk.validateNumber)(properties.thresholdPercentage));
  return errors.wrap("supplied properties not correct for \"AbortCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateAbortCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateAbortCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "FailureType": cdk.stringToCloudFormation(properties.failureType),
    "MinNumberOfExecutedThings": cdk.numberToCloudFormation(properties.minNumberOfExecutedThings),
    "ThresholdPercentage": cdk.numberToCloudFormation(properties.thresholdPercentage)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateAbortCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobTemplate.AbortCriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.AbortCriteriaProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("failureType", "FailureType", (properties.FailureType != null ? cfn_parse.FromCloudFormation.getString(properties.FailureType) : undefined));
  ret.addPropertyResult("minNumberOfExecutedThings", "MinNumberOfExecutedThings", (properties.MinNumberOfExecutedThings != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinNumberOfExecutedThings) : undefined));
  ret.addPropertyResult("thresholdPercentage", "ThresholdPercentage", (properties.ThresholdPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThresholdPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AbortConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AbortConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateAbortConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("criteriaList", cdk.requiredValidator)(properties.criteriaList));
  errors.collect(cdk.propertyValidator("criteriaList", cdk.listValidator(CfnJobTemplateAbortCriteriaPropertyValidator))(properties.criteriaList));
  return errors.wrap("supplied properties not correct for \"AbortConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateAbortConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateAbortConfigPropertyValidator(properties).assertSuccess();
  return {
    "CriteriaList": cdk.listMapper(convertCfnJobTemplateAbortCriteriaPropertyToCloudFormation)(properties.criteriaList)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateAbortConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobTemplate.AbortConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.AbortConfigProperty>();
  ret.addPropertyResult("criteriaList", "CriteriaList", (properties.CriteriaList != null ? cfn_parse.FromCloudFormation.getArray(CfnJobTemplateAbortCriteriaPropertyFromCloudFormation)(properties.CriteriaList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateIncreaseCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `RateIncreaseCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateRateIncreaseCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("numberOfNotifiedThings", cdk.validateNumber)(properties.numberOfNotifiedThings));
  errors.collect(cdk.propertyValidator("numberOfSucceededThings", cdk.validateNumber)(properties.numberOfSucceededThings));
  return errors.wrap("supplied properties not correct for \"RateIncreaseCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateRateIncreaseCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateRateIncreaseCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "NumberOfNotifiedThings": cdk.numberToCloudFormation(properties.numberOfNotifiedThings),
    "NumberOfSucceededThings": cdk.numberToCloudFormation(properties.numberOfSucceededThings)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateRateIncreaseCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobTemplate.RateIncreaseCriteriaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.RateIncreaseCriteriaProperty>();
  ret.addPropertyResult("numberOfNotifiedThings", "NumberOfNotifiedThings", (properties.NumberOfNotifiedThings != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfNotifiedThings) : undefined));
  ret.addPropertyResult("numberOfSucceededThings", "NumberOfSucceededThings", (properties.NumberOfSucceededThings != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfSucceededThings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExponentialRolloutRateProperty`
 *
 * @param properties - the TypeScript properties of a `ExponentialRolloutRateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateExponentialRolloutRatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseRatePerMinute", cdk.requiredValidator)(properties.baseRatePerMinute));
  errors.collect(cdk.propertyValidator("baseRatePerMinute", cdk.validateNumber)(properties.baseRatePerMinute));
  errors.collect(cdk.propertyValidator("incrementFactor", cdk.requiredValidator)(properties.incrementFactor));
  errors.collect(cdk.propertyValidator("incrementFactor", cdk.validateNumber)(properties.incrementFactor));
  errors.collect(cdk.propertyValidator("rateIncreaseCriteria", cdk.requiredValidator)(properties.rateIncreaseCriteria));
  errors.collect(cdk.propertyValidator("rateIncreaseCriteria", CfnJobTemplateRateIncreaseCriteriaPropertyValidator)(properties.rateIncreaseCriteria));
  return errors.wrap("supplied properties not correct for \"ExponentialRolloutRateProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateExponentialRolloutRatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateExponentialRolloutRatePropertyValidator(properties).assertSuccess();
  return {
    "BaseRatePerMinute": cdk.numberToCloudFormation(properties.baseRatePerMinute),
    "IncrementFactor": cdk.numberToCloudFormation(properties.incrementFactor),
    "RateIncreaseCriteria": convertCfnJobTemplateRateIncreaseCriteriaPropertyToCloudFormation(properties.rateIncreaseCriteria)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateExponentialRolloutRatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobTemplate.ExponentialRolloutRateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.ExponentialRolloutRateProperty>();
  ret.addPropertyResult("baseRatePerMinute", "BaseRatePerMinute", (properties.BaseRatePerMinute != null ? cfn_parse.FromCloudFormation.getNumber(properties.BaseRatePerMinute) : undefined));
  ret.addPropertyResult("incrementFactor", "IncrementFactor", (properties.IncrementFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.IncrementFactor) : undefined));
  ret.addPropertyResult("rateIncreaseCriteria", "RateIncreaseCriteria", (properties.RateIncreaseCriteria != null ? CfnJobTemplateRateIncreaseCriteriaPropertyFromCloudFormation(properties.RateIncreaseCriteria) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JobExecutionsRolloutConfigProperty`
 *
 * @param properties - the TypeScript properties of a `JobExecutionsRolloutConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateJobExecutionsRolloutConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exponentialRolloutRate", CfnJobTemplateExponentialRolloutRatePropertyValidator)(properties.exponentialRolloutRate));
  errors.collect(cdk.propertyValidator("maximumPerMinute", cdk.validateNumber)(properties.maximumPerMinute));
  return errors.wrap("supplied properties not correct for \"JobExecutionsRolloutConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateJobExecutionsRolloutConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateJobExecutionsRolloutConfigPropertyValidator(properties).assertSuccess();
  return {
    "ExponentialRolloutRate": convertCfnJobTemplateExponentialRolloutRatePropertyToCloudFormation(properties.exponentialRolloutRate),
    "MaximumPerMinute": cdk.numberToCloudFormation(properties.maximumPerMinute)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateJobExecutionsRolloutConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobTemplate.JobExecutionsRolloutConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.JobExecutionsRolloutConfigProperty>();
  ret.addPropertyResult("exponentialRolloutRate", "ExponentialRolloutRate", (properties.ExponentialRolloutRate != null ? CfnJobTemplateExponentialRolloutRatePropertyFromCloudFormation(properties.ExponentialRolloutRate) : undefined));
  ret.addPropertyResult("maximumPerMinute", "MaximumPerMinute", (properties.MaximumPerMinute != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumPerMinute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplateMaintenanceWindowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInMinutes", cdk.validateNumber)(properties.durationInMinutes));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  return errors.wrap("supplied properties not correct for \"MaintenanceWindowProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplateMaintenanceWindowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplateMaintenanceWindowPropertyValidator(properties).assertSuccess();
  return {
    "DurationInMinutes": cdk.numberToCloudFormation(properties.durationInMinutes),
    "StartTime": cdk.stringToCloudFormation(properties.startTime)
  };
}

// @ts-ignore TS6133
function CfnJobTemplateMaintenanceWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobTemplate.MaintenanceWindowProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.MaintenanceWindowProperty>();
  ret.addPropertyResult("durationInMinutes", "DurationInMinutes", (properties.DurationInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInMinutes) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PresignedUrlConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PresignedUrlConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplatePresignedUrlConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expiresInSec", cdk.validateNumber)(properties.expiresInSec));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"PresignedUrlConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplatePresignedUrlConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplatePresignedUrlConfigPropertyValidator(properties).assertSuccess();
  return {
    "ExpiresInSec": cdk.numberToCloudFormation(properties.expiresInSec),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnJobTemplatePresignedUrlConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobTemplate.PresignedUrlConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplate.PresignedUrlConfigProperty>();
  ret.addPropertyResult("expiresInSec", "ExpiresInSec", (properties.ExpiresInSec != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExpiresInSec) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnJobTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnJobTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("abortConfig", cdk.validateObject)(properties.abortConfig));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("destinationPackageVersions", cdk.listValidator(cdk.validateString))(properties.destinationPackageVersions));
  errors.collect(cdk.propertyValidator("document", cdk.validateString)(properties.document));
  errors.collect(cdk.propertyValidator("documentSource", cdk.validateString)(properties.documentSource));
  errors.collect(cdk.propertyValidator("jobArn", cdk.validateString)(properties.jobArn));
  errors.collect(cdk.propertyValidator("jobExecutionsRetryConfig", CfnJobTemplateJobExecutionsRetryConfigPropertyValidator)(properties.jobExecutionsRetryConfig));
  errors.collect(cdk.propertyValidator("jobExecutionsRolloutConfig", cdk.validateObject)(properties.jobExecutionsRolloutConfig));
  errors.collect(cdk.propertyValidator("jobTemplateId", cdk.requiredValidator)(properties.jobTemplateId));
  errors.collect(cdk.propertyValidator("jobTemplateId", cdk.validateString)(properties.jobTemplateId));
  errors.collect(cdk.propertyValidator("maintenanceWindows", cdk.listValidator(CfnJobTemplateMaintenanceWindowPropertyValidator))(properties.maintenanceWindows));
  errors.collect(cdk.propertyValidator("presignedUrlConfig", cdk.validateObject)(properties.presignedUrlConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("timeoutConfig", cdk.validateObject)(properties.timeoutConfig));
  return errors.wrap("supplied properties not correct for \"CfnJobTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnJobTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobTemplatePropsValidator(properties).assertSuccess();
  return {
    "AbortConfig": cdk.objectToCloudFormation(properties.abortConfig),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DestinationPackageVersions": cdk.listMapper(cdk.stringToCloudFormation)(properties.destinationPackageVersions),
    "Document": cdk.stringToCloudFormation(properties.document),
    "DocumentSource": cdk.stringToCloudFormation(properties.documentSource),
    "JobArn": cdk.stringToCloudFormation(properties.jobArn),
    "JobExecutionsRetryConfig": convertCfnJobTemplateJobExecutionsRetryConfigPropertyToCloudFormation(properties.jobExecutionsRetryConfig),
    "JobExecutionsRolloutConfig": cdk.objectToCloudFormation(properties.jobExecutionsRolloutConfig),
    "JobTemplateId": cdk.stringToCloudFormation(properties.jobTemplateId),
    "MaintenanceWindows": cdk.listMapper(convertCfnJobTemplateMaintenanceWindowPropertyToCloudFormation)(properties.maintenanceWindows),
    "PresignedUrlConfig": cdk.objectToCloudFormation(properties.presignedUrlConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TimeoutConfig": cdk.objectToCloudFormation(properties.timeoutConfig)
  };
}

// @ts-ignore TS6133
function CfnJobTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobTemplateProps>();
  ret.addPropertyResult("abortConfig", "AbortConfig", (properties.AbortConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.AbortConfig) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("destinationPackageVersions", "DestinationPackageVersions", (properties.DestinationPackageVersions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DestinationPackageVersions) : undefined));
  ret.addPropertyResult("document", "Document", (properties.Document != null ? cfn_parse.FromCloudFormation.getString(properties.Document) : undefined));
  ret.addPropertyResult("documentSource", "DocumentSource", (properties.DocumentSource != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentSource) : undefined));
  ret.addPropertyResult("jobArn", "JobArn", (properties.JobArn != null ? cfn_parse.FromCloudFormation.getString(properties.JobArn) : undefined));
  ret.addPropertyResult("jobExecutionsRetryConfig", "JobExecutionsRetryConfig", (properties.JobExecutionsRetryConfig != null ? CfnJobTemplateJobExecutionsRetryConfigPropertyFromCloudFormation(properties.JobExecutionsRetryConfig) : undefined));
  ret.addPropertyResult("jobExecutionsRolloutConfig", "JobExecutionsRolloutConfig", (properties.JobExecutionsRolloutConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.JobExecutionsRolloutConfig) : undefined));
  ret.addPropertyResult("jobTemplateId", "JobTemplateId", (properties.JobTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.JobTemplateId) : undefined));
  ret.addPropertyResult("maintenanceWindows", "MaintenanceWindows", (properties.MaintenanceWindows != null ? cfn_parse.FromCloudFormation.getArray(CfnJobTemplateMaintenanceWindowPropertyFromCloudFormation)(properties.MaintenanceWindows) : undefined));
  ret.addPropertyResult("presignedUrlConfig", "PresignedUrlConfig", (properties.PresignedUrlConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.PresignedUrlConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("timeoutConfig", "TimeoutConfig", (properties.TimeoutConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.TimeoutConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Configure logging.
 *
 * @cloudformationResource AWS::IoT::Logging
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-logging.html
 */
export class CfnLogging extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::Logging";

  /**
   * Build a CfnLogging from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLogging {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoggingPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLogging(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The account ID.
   */
  public accountId: string;

  /**
   * The default log level.
   */
  public defaultLogLevel: string;

  /**
   * The role ARN used for the log.
   */
  public roleArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoggingProps) {
    super(scope, id, {
      "type": CfnLogging.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountId", this);
    cdk.requireProperty(props, "defaultLogLevel", this);
    cdk.requireProperty(props, "roleArn", this);

    this.accountId = props.accountId;
    this.defaultLogLevel = props.defaultLogLevel;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountId": this.accountId,
      "defaultLogLevel": this.defaultLogLevel,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogging.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoggingPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLogging`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-logging.html
 */
export interface CfnLoggingProps {
  /**
   * The account ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-logging.html#cfn-iot-logging-accountid
   */
  readonly accountId: string;

  /**
   * The default log level.
   *
   * Valid Values: `DEBUG | INFO | ERROR | WARN | DISABLED`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-logging.html#cfn-iot-logging-defaultloglevel
   */
  readonly defaultLogLevel: string;

  /**
   * The role ARN used for the log.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-logging.html#cfn-iot-logging-rolearn
   */
  readonly roleArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnLoggingProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoggingProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.requiredValidator)(properties.accountId));
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("defaultLogLevel", cdk.requiredValidator)(properties.defaultLogLevel));
  errors.collect(cdk.propertyValidator("defaultLogLevel", cdk.validateString)(properties.defaultLogLevel));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnLoggingProps\"");
}

// @ts-ignore TS6133
function convertCfnLoggingPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingPropsValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "DefaultLogLevel": cdk.stringToCloudFormation(properties.defaultLogLevel),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnLoggingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingProps>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("defaultLogLevel", "DefaultLogLevel", (properties.DefaultLogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultLogLevel) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Defines an action that can be applied to audit findings by using StartAuditMitigationActionsTask.
 *
 * For API reference, see [CreateMitigationAction](https://docs.aws.amazon.com/iot/latest/apireference/API_CreateMitigationAction.html) and for general information, see [Mitigation actions](https://docs.aws.amazon.com/iot/latest/developerguide/dd-mitigation-actions.html) .
 *
 * @cloudformationResource AWS::IoT::MitigationAction
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-mitigationaction.html
 */
export class CfnMitigationAction extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::MitigationAction";

  /**
   * Build a CfnMitigationAction from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMitigationAction {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMitigationActionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMitigationAction(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the mitigation action.
   *
   * @cloudformationAttribute MitigationActionArn
   */
  public readonly attrMitigationActionArn: string;

  /**
   * The ID of the mitigation action.
   *
   * @cloudformationAttribute MitigationActionId
   */
  public readonly attrMitigationActionId: string;

  /**
   * The friendly name of the mitigation action.
   */
  public actionName?: string;

  /**
   * The set of parameters for this mitigation action.
   */
  public actionParams: CfnMitigationAction.ActionParamsProperty | cdk.IResolvable;

  /**
   * The IAM role ARN used to apply this mitigation action.
   */
  public roleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that can be used to manage the mitigation action.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMitigationActionProps) {
    super(scope, id, {
      "type": CfnMitigationAction.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actionParams", this);
    cdk.requireProperty(props, "roleArn", this);

    this.attrMitigationActionArn = cdk.Token.asString(this.getAtt("MitigationActionArn", cdk.ResolutionTypeHint.STRING));
    this.attrMitigationActionId = cdk.Token.asString(this.getAtt("MitigationActionId", cdk.ResolutionTypeHint.STRING));
    this.actionName = props.actionName;
    this.actionParams = props.actionParams;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::MitigationAction", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actionName": this.actionName,
      "actionParams": this.actionParams,
      "roleArn": this.roleArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMitigationAction.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMitigationActionPropsToCloudFormation(props);
  }
}

export namespace CfnMitigationAction {
  /**
   * Defines the type of action and the parameters for that action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-actionparams.html
   */
  export interface ActionParamsProperty {
    /**
     * Specifies the group to which you want to add the devices.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-actionparams.html#cfn-iot-mitigationaction-actionparams-addthingstothinggroupparams
     */
    readonly addThingsToThingGroupParams?: CfnMitigationAction.AddThingsToThingGroupParamsProperty | cdk.IResolvable;

    /**
     * Specifies the logging level and the role with permissions for logging.
     *
     * You cannot specify a logging level of `DISABLED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-actionparams.html#cfn-iot-mitigationaction-actionparams-enableiotloggingparams
     */
    readonly enableIoTLoggingParams?: CfnMitigationAction.EnableIoTLoggingParamsProperty | cdk.IResolvable;

    /**
     * Specifies the topic to which the finding should be published.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-actionparams.html#cfn-iot-mitigationaction-actionparams-publishfindingtosnsparams
     */
    readonly publishFindingToSnsParams?: cdk.IResolvable | CfnMitigationAction.PublishFindingToSnsParamsProperty;

    /**
     * Replaces the policy version with a default or blank policy.
     *
     * You specify the template name. Only a value of `BLANK_POLICY` is currently supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-actionparams.html#cfn-iot-mitigationaction-actionparams-replacedefaultpolicyversionparams
     */
    readonly replaceDefaultPolicyVersionParams?: cdk.IResolvable | CfnMitigationAction.ReplaceDefaultPolicyVersionParamsProperty;

    /**
     * Specifies the new state for the CA certificate.
     *
     * Only a value of `DEACTIVATE` is currently supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-actionparams.html#cfn-iot-mitigationaction-actionparams-updatecacertificateparams
     */
    readonly updateCaCertificateParams?: cdk.IResolvable | CfnMitigationAction.UpdateCACertificateParamsProperty;

    /**
     * Specifies the new state for a device certificate.
     *
     * Only a value of `DEACTIVATE` is currently supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-actionparams.html#cfn-iot-mitigationaction-actionparams-updatedevicecertificateparams
     */
    readonly updateDeviceCertificateParams?: cdk.IResolvable | CfnMitigationAction.UpdateDeviceCertificateParamsProperty;
  }

  /**
   * Parameters to define a mitigation action that changes the state of the device certificate to inactive.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-updatedevicecertificateparams.html
   */
  export interface UpdateDeviceCertificateParamsProperty {
    /**
     * The action that you want to apply to the device certificate.
     *
     * The only supported value is `DEACTIVATE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-updatedevicecertificateparams.html#cfn-iot-mitigationaction-updatedevicecertificateparams-action
     */
    readonly action: string;
  }

  /**
   * Parameters used when defining a mitigation action that move a set of things to a thing group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-addthingstothinggroupparams.html
   */
  export interface AddThingsToThingGroupParamsProperty {
    /**
     * Specifies if this mitigation action can move the things that triggered the mitigation action even if they are part of one or more dynamic thing groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-addthingstothinggroupparams.html#cfn-iot-mitigationaction-addthingstothinggroupparams-overridedynamicgroups
     */
    readonly overrideDynamicGroups?: boolean | cdk.IResolvable;

    /**
     * The list of groups to which you want to add the things that triggered the mitigation action.
     *
     * You can add a thing to a maximum of 10 groups, but you can't add a thing to more than one group in the same hierarchy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-addthingstothinggroupparams.html#cfn-iot-mitigationaction-addthingstothinggroupparams-thinggroupnames
     */
    readonly thingGroupNames: Array<string>;
  }

  /**
   * Parameters to define a mitigation action that publishes findings to Amazon SNS.
   *
   * You can implement your own custom actions in response to the Amazon SNS messages.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-publishfindingtosnsparams.html
   */
  export interface PublishFindingToSnsParamsProperty {
    /**
     * The ARN of the topic to which you want to publish the findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-publishfindingtosnsparams.html#cfn-iot-mitigationaction-publishfindingtosnsparams-topicarn
     */
    readonly topicArn: string;
  }

  /**
   * Parameters used when defining a mitigation action that enable AWS IoT Core logging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-enableiotloggingparams.html
   */
  export interface EnableIoTLoggingParamsProperty {
    /**
     * Specifies the type of information to be logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-enableiotloggingparams.html#cfn-iot-mitigationaction-enableiotloggingparams-loglevel
     */
    readonly logLevel: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role used for logging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-enableiotloggingparams.html#cfn-iot-mitigationaction-enableiotloggingparams-rolearnforlogging
     */
    readonly roleArnForLogging: string;
  }

  /**
   * Parameters to define a mitigation action that adds a blank policy to restrict permissions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-replacedefaultpolicyversionparams.html
   */
  export interface ReplaceDefaultPolicyVersionParamsProperty {
    /**
     * The name of the template to be applied.
     *
     * The only supported value is `BLANK_POLICY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-replacedefaultpolicyversionparams.html#cfn-iot-mitigationaction-replacedefaultpolicyversionparams-templatename
     */
    readonly templateName: string;
  }

  /**
   * Parameters to define a mitigation action that changes the state of the CA certificate to inactive.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-updatecacertificateparams.html
   */
  export interface UpdateCACertificateParamsProperty {
    /**
     * The action that you want to apply to the CA certificate.
     *
     * The only supported value is `DEACTIVATE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-mitigationaction-updatecacertificateparams.html#cfn-iot-mitigationaction-updatecacertificateparams-action
     */
    readonly action: string;
  }
}

/**
 * Properties for defining a `CfnMitigationAction`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-mitigationaction.html
 */
export interface CfnMitigationActionProps {
  /**
   * The friendly name of the mitigation action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-mitigationaction.html#cfn-iot-mitigationaction-actionname
   */
  readonly actionName?: string;

  /**
   * The set of parameters for this mitigation action.
   *
   * The parameters vary, depending on the kind of action you apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-mitigationaction.html#cfn-iot-mitigationaction-actionparams
   */
  readonly actionParams: CfnMitigationAction.ActionParamsProperty | cdk.IResolvable;

  /**
   * The IAM role ARN used to apply this mitigation action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-mitigationaction.html#cfn-iot-mitigationaction-rolearn
   */
  readonly roleArn: string;

  /**
   * Metadata that can be used to manage the mitigation action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-mitigationaction.html#cfn-iot-mitigationaction-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `UpdateDeviceCertificateParamsProperty`
 *
 * @param properties - the TypeScript properties of a `UpdateDeviceCertificateParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMitigationActionUpdateDeviceCertificateParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  return errors.wrap("supplied properties not correct for \"UpdateDeviceCertificateParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMitigationActionUpdateDeviceCertificateParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMitigationActionUpdateDeviceCertificateParamsPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action)
  };
}

// @ts-ignore TS6133
function CfnMitigationActionUpdateDeviceCertificateParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMitigationAction.UpdateDeviceCertificateParamsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMitigationAction.UpdateDeviceCertificateParamsProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AddThingsToThingGroupParamsProperty`
 *
 * @param properties - the TypeScript properties of a `AddThingsToThingGroupParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMitigationActionAddThingsToThingGroupParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("overrideDynamicGroups", cdk.validateBoolean)(properties.overrideDynamicGroups));
  errors.collect(cdk.propertyValidator("thingGroupNames", cdk.requiredValidator)(properties.thingGroupNames));
  errors.collect(cdk.propertyValidator("thingGroupNames", cdk.listValidator(cdk.validateString))(properties.thingGroupNames));
  return errors.wrap("supplied properties not correct for \"AddThingsToThingGroupParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMitigationActionAddThingsToThingGroupParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMitigationActionAddThingsToThingGroupParamsPropertyValidator(properties).assertSuccess();
  return {
    "OverrideDynamicGroups": cdk.booleanToCloudFormation(properties.overrideDynamicGroups),
    "ThingGroupNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.thingGroupNames)
  };
}

// @ts-ignore TS6133
function CfnMitigationActionAddThingsToThingGroupParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMitigationAction.AddThingsToThingGroupParamsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMitigationAction.AddThingsToThingGroupParamsProperty>();
  ret.addPropertyResult("overrideDynamicGroups", "OverrideDynamicGroups", (properties.OverrideDynamicGroups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.OverrideDynamicGroups) : undefined));
  ret.addPropertyResult("thingGroupNames", "ThingGroupNames", (properties.ThingGroupNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ThingGroupNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PublishFindingToSnsParamsProperty`
 *
 * @param properties - the TypeScript properties of a `PublishFindingToSnsParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMitigationActionPublishFindingToSnsParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("topicArn", cdk.requiredValidator)(properties.topicArn));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"PublishFindingToSnsParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMitigationActionPublishFindingToSnsParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMitigationActionPublishFindingToSnsParamsPropertyValidator(properties).assertSuccess();
  return {
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnMitigationActionPublishFindingToSnsParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMitigationAction.PublishFindingToSnsParamsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMitigationAction.PublishFindingToSnsParamsProperty>();
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnableIoTLoggingParamsProperty`
 *
 * @param properties - the TypeScript properties of a `EnableIoTLoggingParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMitigationActionEnableIoTLoggingParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logLevel", cdk.requiredValidator)(properties.logLevel));
  errors.collect(cdk.propertyValidator("logLevel", cdk.validateString)(properties.logLevel));
  errors.collect(cdk.propertyValidator("roleArnForLogging", cdk.requiredValidator)(properties.roleArnForLogging));
  errors.collect(cdk.propertyValidator("roleArnForLogging", cdk.validateString)(properties.roleArnForLogging));
  return errors.wrap("supplied properties not correct for \"EnableIoTLoggingParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMitigationActionEnableIoTLoggingParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMitigationActionEnableIoTLoggingParamsPropertyValidator(properties).assertSuccess();
  return {
    "LogLevel": cdk.stringToCloudFormation(properties.logLevel),
    "RoleArnForLogging": cdk.stringToCloudFormation(properties.roleArnForLogging)
  };
}

// @ts-ignore TS6133
function CfnMitigationActionEnableIoTLoggingParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMitigationAction.EnableIoTLoggingParamsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMitigationAction.EnableIoTLoggingParamsProperty>();
  ret.addPropertyResult("logLevel", "LogLevel", (properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined));
  ret.addPropertyResult("roleArnForLogging", "RoleArnForLogging", (properties.RoleArnForLogging != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArnForLogging) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplaceDefaultPolicyVersionParamsProperty`
 *
 * @param properties - the TypeScript properties of a `ReplaceDefaultPolicyVersionParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMitigationActionReplaceDefaultPolicyVersionParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("templateName", cdk.requiredValidator)(properties.templateName));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  return errors.wrap("supplied properties not correct for \"ReplaceDefaultPolicyVersionParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMitigationActionReplaceDefaultPolicyVersionParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMitigationActionReplaceDefaultPolicyVersionParamsPropertyValidator(properties).assertSuccess();
  return {
    "TemplateName": cdk.stringToCloudFormation(properties.templateName)
  };
}

// @ts-ignore TS6133
function CfnMitigationActionReplaceDefaultPolicyVersionParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMitigationAction.ReplaceDefaultPolicyVersionParamsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMitigationAction.ReplaceDefaultPolicyVersionParamsProperty>();
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UpdateCACertificateParamsProperty`
 *
 * @param properties - the TypeScript properties of a `UpdateCACertificateParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMitigationActionUpdateCACertificateParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  return errors.wrap("supplied properties not correct for \"UpdateCACertificateParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMitigationActionUpdateCACertificateParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMitigationActionUpdateCACertificateParamsPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action)
  };
}

// @ts-ignore TS6133
function CfnMitigationActionUpdateCACertificateParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMitigationAction.UpdateCACertificateParamsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMitigationAction.UpdateCACertificateParamsProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionParamsProperty`
 *
 * @param properties - the TypeScript properties of a `ActionParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMitigationActionActionParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addThingsToThingGroupParams", CfnMitigationActionAddThingsToThingGroupParamsPropertyValidator)(properties.addThingsToThingGroupParams));
  errors.collect(cdk.propertyValidator("enableIoTLoggingParams", CfnMitigationActionEnableIoTLoggingParamsPropertyValidator)(properties.enableIoTLoggingParams));
  errors.collect(cdk.propertyValidator("publishFindingToSnsParams", CfnMitigationActionPublishFindingToSnsParamsPropertyValidator)(properties.publishFindingToSnsParams));
  errors.collect(cdk.propertyValidator("replaceDefaultPolicyVersionParams", CfnMitigationActionReplaceDefaultPolicyVersionParamsPropertyValidator)(properties.replaceDefaultPolicyVersionParams));
  errors.collect(cdk.propertyValidator("updateCaCertificateParams", CfnMitigationActionUpdateCACertificateParamsPropertyValidator)(properties.updateCaCertificateParams));
  errors.collect(cdk.propertyValidator("updateDeviceCertificateParams", CfnMitigationActionUpdateDeviceCertificateParamsPropertyValidator)(properties.updateDeviceCertificateParams));
  return errors.wrap("supplied properties not correct for \"ActionParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMitigationActionActionParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMitigationActionActionParamsPropertyValidator(properties).assertSuccess();
  return {
    "AddThingsToThingGroupParams": convertCfnMitigationActionAddThingsToThingGroupParamsPropertyToCloudFormation(properties.addThingsToThingGroupParams),
    "EnableIoTLoggingParams": convertCfnMitigationActionEnableIoTLoggingParamsPropertyToCloudFormation(properties.enableIoTLoggingParams),
    "PublishFindingToSnsParams": convertCfnMitigationActionPublishFindingToSnsParamsPropertyToCloudFormation(properties.publishFindingToSnsParams),
    "ReplaceDefaultPolicyVersionParams": convertCfnMitigationActionReplaceDefaultPolicyVersionParamsPropertyToCloudFormation(properties.replaceDefaultPolicyVersionParams),
    "UpdateCACertificateParams": convertCfnMitigationActionUpdateCACertificateParamsPropertyToCloudFormation(properties.updateCaCertificateParams),
    "UpdateDeviceCertificateParams": convertCfnMitigationActionUpdateDeviceCertificateParamsPropertyToCloudFormation(properties.updateDeviceCertificateParams)
  };
}

// @ts-ignore TS6133
function CfnMitigationActionActionParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMitigationAction.ActionParamsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMitigationAction.ActionParamsProperty>();
  ret.addPropertyResult("addThingsToThingGroupParams", "AddThingsToThingGroupParams", (properties.AddThingsToThingGroupParams != null ? CfnMitigationActionAddThingsToThingGroupParamsPropertyFromCloudFormation(properties.AddThingsToThingGroupParams) : undefined));
  ret.addPropertyResult("enableIoTLoggingParams", "EnableIoTLoggingParams", (properties.EnableIoTLoggingParams != null ? CfnMitigationActionEnableIoTLoggingParamsPropertyFromCloudFormation(properties.EnableIoTLoggingParams) : undefined));
  ret.addPropertyResult("publishFindingToSnsParams", "PublishFindingToSnsParams", (properties.PublishFindingToSnsParams != null ? CfnMitigationActionPublishFindingToSnsParamsPropertyFromCloudFormation(properties.PublishFindingToSnsParams) : undefined));
  ret.addPropertyResult("replaceDefaultPolicyVersionParams", "ReplaceDefaultPolicyVersionParams", (properties.ReplaceDefaultPolicyVersionParams != null ? CfnMitigationActionReplaceDefaultPolicyVersionParamsPropertyFromCloudFormation(properties.ReplaceDefaultPolicyVersionParams) : undefined));
  ret.addPropertyResult("updateCaCertificateParams", "UpdateCACertificateParams", (properties.UpdateCACertificateParams != null ? CfnMitigationActionUpdateCACertificateParamsPropertyFromCloudFormation(properties.UpdateCACertificateParams) : undefined));
  ret.addPropertyResult("updateDeviceCertificateParams", "UpdateDeviceCertificateParams", (properties.UpdateDeviceCertificateParams != null ? CfnMitigationActionUpdateDeviceCertificateParamsPropertyFromCloudFormation(properties.UpdateDeviceCertificateParams) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMitigationActionProps`
 *
 * @param properties - the TypeScript properties of a `CfnMitigationActionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMitigationActionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionName", cdk.validateString)(properties.actionName));
  errors.collect(cdk.propertyValidator("actionParams", cdk.requiredValidator)(properties.actionParams));
  errors.collect(cdk.propertyValidator("actionParams", CfnMitigationActionActionParamsPropertyValidator)(properties.actionParams));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnMitigationActionProps\"");
}

// @ts-ignore TS6133
function convertCfnMitigationActionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMitigationActionPropsValidator(properties).assertSuccess();
  return {
    "ActionName": cdk.stringToCloudFormation(properties.actionName),
    "ActionParams": convertCfnMitigationActionActionParamsPropertyToCloudFormation(properties.actionParams),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnMitigationActionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMitigationActionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMitigationActionProps>();
  ret.addPropertyResult("actionName", "ActionName", (properties.ActionName != null ? cfn_parse.FromCloudFormation.getString(properties.ActionName) : undefined));
  ret.addPropertyResult("actionParams", "ActionParams", (properties.ActionParams != null ? CfnMitigationActionActionParamsPropertyFromCloudFormation(properties.ActionParams) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::Policy` resource to declare an AWS IoT policy.
 *
 * For more information about working with AWS IoT policies, see [Authorization](https://docs.aws.amazon.com/iot/latest/developerguide/authorization.html) in the *AWS IoT Developer Guide* .
 *
 * @cloudformationResource AWS::IoT::Policy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policy.html
 */
export class CfnPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::Policy";

  /**
   * Build a CfnPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the AWS IoT policy, such as `arn:aws:iot:us-east-2:123456789012:policy/MyPolicy` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of this policy.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The JSON document that describes the policy.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * The policy name.
   */
  public policyName?: string;

  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPolicyProps) {
    super(scope, id, {
      "type": CfnPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.policyDocument = props.policyDocument;
    this.policyName = props.policyName;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyDocument": this.policyDocument,
      "policyName": this.policyName,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policy.html
 */
export interface CfnPolicyProps {
  /**
   * The JSON document that describes the policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policy.html#cfn-iot-policy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;

  /**
   * The policy name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policy.html#cfn-iot-policy-policyname
   */
  readonly policyName?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policy.html#cfn-iot-policy-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicyProps>();
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::PolicyPrincipalAttachment` resource to attach an AWS IoT policy to a principal (an X.509 certificate or other credential).
 *
 * For information about working with AWS IoT policies and principals, see [Authorization](https://docs.aws.amazon.com/iot/latest/developerguide/authorization.html) in the *AWS IoT Developer Guide* .
 *
 * @cloudformationResource AWS::IoT::PolicyPrincipalAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policyprincipalattachment.html
 */
export class CfnPolicyPrincipalAttachment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::PolicyPrincipalAttachment";

  /**
   * Build a CfnPolicyPrincipalAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPolicyPrincipalAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPolicyPrincipalAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPolicyPrincipalAttachment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the AWS IoT policy.
   */
  public policyName: string;

  /**
   * The principal, which can be a certificate ARN (as returned from the `CreateCertificate` operation) or an Amazon Cognito ID.
   */
  public principal: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPolicyPrincipalAttachmentProps) {
    super(scope, id, {
      "type": CfnPolicyPrincipalAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyName", this);
    cdk.requireProperty(props, "principal", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.policyName = props.policyName;
    this.principal = props.principal;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyName": this.policyName,
      "principal": this.principal
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPolicyPrincipalAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPolicyPrincipalAttachmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPolicyPrincipalAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policyprincipalattachment.html
 */
export interface CfnPolicyPrincipalAttachmentProps {
  /**
   * The name of the AWS IoT policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policyprincipalattachment.html#cfn-iot-policyprincipalattachment-policyname
   */
  readonly policyName: string;

  /**
   * The principal, which can be a certificate ARN (as returned from the `CreateCertificate` operation) or an Amazon Cognito ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-policyprincipalattachment.html#cfn-iot-policyprincipalattachment-principal
   */
  readonly principal: string;
}

/**
 * Determine whether the given properties match those of a `CfnPolicyPrincipalAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnPolicyPrincipalAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyPrincipalAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("principal", cdk.requiredValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("principal", cdk.validateString)(properties.principal));
  return errors.wrap("supplied properties not correct for \"CfnPolicyPrincipalAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnPolicyPrincipalAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyPrincipalAttachmentPropsValidator(properties).assertSuccess();
  return {
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "Principal": cdk.stringToCloudFormation(properties.principal)
  };
}

// @ts-ignore TS6133
function CfnPolicyPrincipalAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPolicyPrincipalAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPolicyPrincipalAttachmentProps>();
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addPropertyResult("principal", "Principal", (properties.Principal != null ? cfn_parse.FromCloudFormation.getString(properties.Principal) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a fleet provisioning template.
 *
 * @cloudformationResource AWS::IoT::ProvisioningTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html
 */
export class CfnProvisioningTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::ProvisioningTemplate";

  /**
   * Build a CfnProvisioningTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProvisioningTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProvisioningTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProvisioningTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN that identifies the provisioning template.
   *
   * @cloudformationAttribute TemplateArn
   */
  public readonly attrTemplateArn: string;

  /**
   * The description of the fleet provisioning template.
   */
  public description?: string;

  /**
   * True to enable the fleet provisioning template, otherwise false.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * Creates a pre-provisioning hook template.
   */
  public preProvisioningHook?: cdk.IResolvable | CfnProvisioningTemplate.ProvisioningHookProperty;

  /**
   * The role ARN for the role associated with the fleet provisioning template.
   */
  public provisioningRoleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that can be used to manage the fleet provisioning template.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The JSON formatted contents of the fleet provisioning template version.
   */
  public templateBody: string;

  /**
   * The name of the fleet provisioning template.
   */
  public templateName?: string;

  /**
   * The type of the provisioning template.
   */
  public templateType?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProvisioningTemplateProps) {
    super(scope, id, {
      "type": CfnProvisioningTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "provisioningRoleArn", this);
    cdk.requireProperty(props, "templateBody", this);

    this.attrTemplateArn = cdk.Token.asString(this.getAtt("TemplateArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.enabled = props.enabled;
    this.preProvisioningHook = props.preProvisioningHook;
    this.provisioningRoleArn = props.provisioningRoleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::ProvisioningTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateBody = props.templateBody;
    this.templateName = props.templateName;
    this.templateType = props.templateType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "enabled": this.enabled,
      "preProvisioningHook": this.preProvisioningHook,
      "provisioningRoleArn": this.provisioningRoleArn,
      "tags": this.tags.renderTags(),
      "templateBody": this.templateBody,
      "templateName": this.templateName,
      "templateType": this.templateType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProvisioningTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProvisioningTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnProvisioningTemplate {
  /**
   * Structure that contains payloadVersion and targetArn.
   *
   * Provisioning hooks can be used when fleet provisioning to validate device parameters before allowing the device to be provisioned.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-provisioningtemplate-provisioninghook.html
   */
  export interface ProvisioningHookProperty {
    /**
     * The payload that was sent to the target function.
     *
     * The valid payload is `"2020-04-01"` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-provisioningtemplate-provisioninghook.html#cfn-iot-provisioningtemplate-provisioninghook-payloadversion
     */
    readonly payloadVersion?: string;

    /**
     * The ARN of the target function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-provisioningtemplate-provisioninghook.html#cfn-iot-provisioningtemplate-provisioninghook-targetarn
     */
    readonly targetArn?: string;
  }
}

/**
 * Properties for defining a `CfnProvisioningTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html
 */
export interface CfnProvisioningTemplateProps {
  /**
   * The description of the fleet provisioning template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html#cfn-iot-provisioningtemplate-description
   */
  readonly description?: string;

  /**
   * True to enable the fleet provisioning template, otherwise false.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html#cfn-iot-provisioningtemplate-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * Creates a pre-provisioning hook template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html#cfn-iot-provisioningtemplate-preprovisioninghook
   */
  readonly preProvisioningHook?: cdk.IResolvable | CfnProvisioningTemplate.ProvisioningHookProperty;

  /**
   * The role ARN for the role associated with the fleet provisioning template.
   *
   * This IoT role grants permission to provision a device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html#cfn-iot-provisioningtemplate-provisioningrolearn
   */
  readonly provisioningRoleArn: string;

  /**
   * Metadata that can be used to manage the fleet provisioning template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html#cfn-iot-provisioningtemplate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The JSON formatted contents of the fleet provisioning template version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html#cfn-iot-provisioningtemplate-templatebody
   */
  readonly templateBody: string;

  /**
   * The name of the fleet provisioning template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html#cfn-iot-provisioningtemplate-templatename
   */
  readonly templateName?: string;

  /**
   * The type of the provisioning template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-provisioningtemplate.html#cfn-iot-provisioningtemplate-templatetype
   */
  readonly templateType?: string;
}

/**
 * Determine whether the given properties match those of a `ProvisioningHookProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisioningHookProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProvisioningTemplateProvisioningHookPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payloadVersion", cdk.validateString)(properties.payloadVersion));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"ProvisioningHookProperty\"");
}

// @ts-ignore TS6133
function convertCfnProvisioningTemplateProvisioningHookPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProvisioningTemplateProvisioningHookPropertyValidator(properties).assertSuccess();
  return {
    "PayloadVersion": cdk.stringToCloudFormation(properties.payloadVersion),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnProvisioningTemplateProvisioningHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnProvisioningTemplate.ProvisioningHookProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProvisioningTemplate.ProvisioningHookProperty>();
  ret.addPropertyResult("payloadVersion", "PayloadVersion", (properties.PayloadVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadVersion) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnProvisioningTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnProvisioningTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProvisioningTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("preProvisioningHook", CfnProvisioningTemplateProvisioningHookPropertyValidator)(properties.preProvisioningHook));
  errors.collect(cdk.propertyValidator("provisioningRoleArn", cdk.requiredValidator)(properties.provisioningRoleArn));
  errors.collect(cdk.propertyValidator("provisioningRoleArn", cdk.validateString)(properties.provisioningRoleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("templateBody", cdk.requiredValidator)(properties.templateBody));
  errors.collect(cdk.propertyValidator("templateBody", cdk.validateString)(properties.templateBody));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  errors.collect(cdk.propertyValidator("templateType", cdk.validateString)(properties.templateType));
  return errors.wrap("supplied properties not correct for \"CfnProvisioningTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnProvisioningTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProvisioningTemplatePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "PreProvisioningHook": convertCfnProvisioningTemplateProvisioningHookPropertyToCloudFormation(properties.preProvisioningHook),
    "ProvisioningRoleArn": cdk.stringToCloudFormation(properties.provisioningRoleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TemplateBody": cdk.stringToCloudFormation(properties.templateBody),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName),
    "TemplateType": cdk.stringToCloudFormation(properties.templateType)
  };
}

// @ts-ignore TS6133
function CfnProvisioningTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProvisioningTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProvisioningTemplateProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("preProvisioningHook", "PreProvisioningHook", (properties.PreProvisioningHook != null ? CfnProvisioningTemplateProvisioningHookPropertyFromCloudFormation(properties.PreProvisioningHook) : undefined));
  ret.addPropertyResult("provisioningRoleArn", "ProvisioningRoleArn", (properties.ProvisioningRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisioningRoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("templateBody", "TemplateBody", (properties.TemplateBody != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateBody) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addPropertyResult("templateType", "TemplateType", (properties.TemplateType != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Configure resource-specific logging.
 *
 * @cloudformationResource AWS::IoT::ResourceSpecificLogging
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-resourcespecificlogging.html
 */
export class CfnResourceSpecificLogging extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::ResourceSpecificLogging";

  /**
   * Build a CfnResourceSpecificLogging from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceSpecificLogging {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceSpecificLoggingPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceSpecificLogging(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The target Id.
   *
   * @cloudformationAttribute TargetId
   */
  public readonly attrTargetId: string;

  /**
   * The default log level.Valid Values: `DEBUG | INFO | ERROR | WARN | DISABLED`.
   */
  public logLevel: string;

  /**
   * The target name.
   */
  public targetName: string;

  /**
   * The target type.
   */
  public targetType: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceSpecificLoggingProps) {
    super(scope, id, {
      "type": CfnResourceSpecificLogging.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "logLevel", this);
    cdk.requireProperty(props, "targetName", this);
    cdk.requireProperty(props, "targetType", this);

    this.attrTargetId = cdk.Token.asString(this.getAtt("TargetId", cdk.ResolutionTypeHint.STRING));
    this.logLevel = props.logLevel;
    this.targetName = props.targetName;
    this.targetType = props.targetType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "logLevel": this.logLevel,
      "targetName": this.targetName,
      "targetType": this.targetType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceSpecificLogging.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceSpecificLoggingPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourceSpecificLogging`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-resourcespecificlogging.html
 */
export interface CfnResourceSpecificLoggingProps {
  /**
   * The default log level.Valid Values: `DEBUG | INFO | ERROR | WARN | DISABLED`.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-resourcespecificlogging.html#cfn-iot-resourcespecificlogging-loglevel
   */
  readonly logLevel: string;

  /**
   * The target name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-resourcespecificlogging.html#cfn-iot-resourcespecificlogging-targetname
   */
  readonly targetName: string;

  /**
   * The target type.
   *
   * Valid Values: `DEFAULT | THING_GROUP`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-resourcespecificlogging.html#cfn-iot-resourcespecificlogging-targettype
   */
  readonly targetType: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourceSpecificLoggingProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceSpecificLoggingProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceSpecificLoggingPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logLevel", cdk.requiredValidator)(properties.logLevel));
  errors.collect(cdk.propertyValidator("logLevel", cdk.validateString)(properties.logLevel));
  errors.collect(cdk.propertyValidator("targetName", cdk.requiredValidator)(properties.targetName));
  errors.collect(cdk.propertyValidator("targetName", cdk.validateString)(properties.targetName));
  errors.collect(cdk.propertyValidator("targetType", cdk.requiredValidator)(properties.targetType));
  errors.collect(cdk.propertyValidator("targetType", cdk.validateString)(properties.targetType));
  return errors.wrap("supplied properties not correct for \"CfnResourceSpecificLoggingProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceSpecificLoggingPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceSpecificLoggingPropsValidator(properties).assertSuccess();
  return {
    "LogLevel": cdk.stringToCloudFormation(properties.logLevel),
    "TargetName": cdk.stringToCloudFormation(properties.targetName),
    "TargetType": cdk.stringToCloudFormation(properties.targetType)
  };
}

// @ts-ignore TS6133
function CfnResourceSpecificLoggingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSpecificLoggingProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSpecificLoggingProps>();
  ret.addPropertyResult("logLevel", "LogLevel", (properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined));
  ret.addPropertyResult("targetName", "TargetName", (properties.TargetName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetName) : undefined));
  ret.addPropertyResult("targetType", "TargetType", (properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a role alias.
 *
 * Requires permission to access the [CreateRoleAlias](https://docs.aws.amazon.com//service-authorization/latest/reference/list_awsiot.html#awsiot-actions-as-permissions) action.
 *
 * @cloudformationResource AWS::IoT::RoleAlias
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-rolealias.html
 */
export class CfnRoleAlias extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::RoleAlias";

  /**
   * Build a CfnRoleAlias from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoleAlias {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRoleAliasPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRoleAlias(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The role alias ARN.
   *
   * @cloudformationAttribute RoleAliasArn
   */
  public readonly attrRoleAliasArn: string;

  /**
   * The number of seconds for which the credential is valid.
   */
  public credentialDurationSeconds?: number;

  /**
   * The role alias.
   */
  public roleAlias?: string;

  /**
   * The role ARN.
   */
  public roleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRoleAliasProps) {
    super(scope, id, {
      "type": CfnRoleAlias.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "roleArn", this);

    this.attrRoleAliasArn = cdk.Token.asString(this.getAtt("RoleAliasArn", cdk.ResolutionTypeHint.STRING));
    this.credentialDurationSeconds = props.credentialDurationSeconds;
    this.roleAlias = props.roleAlias;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::RoleAlias", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "credentialDurationSeconds": this.credentialDurationSeconds,
      "roleAlias": this.roleAlias,
      "roleArn": this.roleArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoleAlias.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRoleAliasPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRoleAlias`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-rolealias.html
 */
export interface CfnRoleAliasProps {
  /**
   * The number of seconds for which the credential is valid.
   *
   * @default - 3600
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-rolealias.html#cfn-iot-rolealias-credentialdurationseconds
   */
  readonly credentialDurationSeconds?: number;

  /**
   * The role alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-rolealias.html#cfn-iot-rolealias-rolealias
   */
  readonly roleAlias?: string;

  /**
   * The role ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-rolealias.html#cfn-iot-rolealias-rolearn
   */
  readonly roleArn: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-rolealias.html#cfn-iot-rolealias-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnRoleAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnRoleAliasProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoleAliasPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("credentialDurationSeconds", cdk.validateNumber)(properties.credentialDurationSeconds));
  errors.collect(cdk.propertyValidator("roleAlias", cdk.validateString)(properties.roleAlias));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRoleAliasProps\"");
}

// @ts-ignore TS6133
function convertCfnRoleAliasPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoleAliasPropsValidator(properties).assertSuccess();
  return {
    "CredentialDurationSeconds": cdk.numberToCloudFormation(properties.credentialDurationSeconds),
    "RoleAlias": cdk.stringToCloudFormation(properties.roleAlias),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRoleAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoleAliasProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoleAliasProps>();
  ret.addPropertyResult("credentialDurationSeconds", "CredentialDurationSeconds", (properties.CredentialDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.CredentialDurationSeconds) : undefined));
  ret.addPropertyResult("roleAlias", "RoleAlias", (properties.RoleAlias != null ? cfn_parse.FromCloudFormation.getString(properties.RoleAlias) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::ScheduledAudit` resource to create a scheduled audit that is run at a specified time interval.
 *
 * For API reference, see [CreateScheduleAudit](https://docs.aws.amazon.com/iot/latest/apireference/API_CreateScheduledAudit.html) and for general information, see [Audit](https://docs.aws.amazon.com/iot/latest/developerguide/device-defender-audit.html) .
 *
 * @cloudformationResource AWS::IoT::ScheduledAudit
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-scheduledaudit.html
 */
export class CfnScheduledAudit extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::ScheduledAudit";

  /**
   * Build a CfnScheduledAudit from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduledAudit {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScheduledAuditPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScheduledAudit(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the scheduled audit.
   *
   * @cloudformationAttribute ScheduledAuditArn
   */
  public readonly attrScheduledAuditArn: string;

  /**
   * The day of the month on which the scheduled audit is run (if the `frequency` is "MONTHLY").
   */
  public dayOfMonth?: string;

  /**
   * The day of the week on which the scheduled audit is run (if the `frequency` is "WEEKLY" or "BIWEEKLY").
   */
  public dayOfWeek?: string;

  /**
   * How often the scheduled audit occurs.
   */
  public frequency: string;

  /**
   * The name of the scheduled audit.
   */
  public scheduledAuditName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that can be used to manage the scheduled audit.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Which checks are performed during the scheduled audit.
   */
  public targetCheckNames: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScheduledAuditProps) {
    super(scope, id, {
      "type": CfnScheduledAudit.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "frequency", this);
    cdk.requireProperty(props, "targetCheckNames", this);

    this.attrScheduledAuditArn = cdk.Token.asString(this.getAtt("ScheduledAuditArn", cdk.ResolutionTypeHint.STRING));
    this.dayOfMonth = props.dayOfMonth;
    this.dayOfWeek = props.dayOfWeek;
    this.frequency = props.frequency;
    this.scheduledAuditName = props.scheduledAuditName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::ScheduledAudit", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetCheckNames = props.targetCheckNames;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dayOfMonth": this.dayOfMonth,
      "dayOfWeek": this.dayOfWeek,
      "frequency": this.frequency,
      "scheduledAuditName": this.scheduledAuditName,
      "tags": this.tags.renderTags(),
      "targetCheckNames": this.targetCheckNames
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScheduledAudit.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScheduledAuditPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnScheduledAudit`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-scheduledaudit.html
 */
export interface CfnScheduledAuditProps {
  /**
   * The day of the month on which the scheduled audit is run (if the `frequency` is "MONTHLY").
   *
   * If days 29-31 are specified, and the month does not have that many days, the audit takes place on the "LAST" day of the month.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-scheduledaudit.html#cfn-iot-scheduledaudit-dayofmonth
   */
  readonly dayOfMonth?: string;

  /**
   * The day of the week on which the scheduled audit is run (if the `frequency` is "WEEKLY" or "BIWEEKLY").
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-scheduledaudit.html#cfn-iot-scheduledaudit-dayofweek
   */
  readonly dayOfWeek?: string;

  /**
   * How often the scheduled audit occurs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-scheduledaudit.html#cfn-iot-scheduledaudit-frequency
   */
  readonly frequency: string;

  /**
   * The name of the scheduled audit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-scheduledaudit.html#cfn-iot-scheduledaudit-scheduledauditname
   */
  readonly scheduledAuditName?: string;

  /**
   * Metadata that can be used to manage the scheduled audit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-scheduledaudit.html#cfn-iot-scheduledaudit-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Which checks are performed during the scheduled audit.
   *
   * Checks must be enabled for your account. (Use `DescribeAccountAuditConfiguration` to see the list of all checks, including those that are enabled or use `UpdateAccountAuditConfiguration` to select which checks are enabled.)
   *
   * The following checks are currently aviable:
   *
   * - `AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK`
   * - `CA_CERTIFICATE_EXPIRING_CHECK`
   * - `CA_CERTIFICATE_KEY_QUALITY_CHECK`
   * - `CONFLICTING_CLIENT_IDS_CHECK`
   * - `DEVICE_CERTIFICATE_EXPIRING_CHECK`
   * - `DEVICE_CERTIFICATE_KEY_QUALITY_CHECK`
   * - `DEVICE_CERTIFICATE_SHARED_CHECK`
   * - `IOT_POLICY_OVERLY_PERMISSIVE_CHECK`
   * - `IOT_ROLE_ALIAS_ALLOWS_ACCESS_TO_UNUSED_SERVICES_CHECK`
   * - `IOT_ROLE_ALIAS_OVERLY_PERMISSIVE_CHECK`
   * - `LOGGING_DISABLED_CHECK`
   * - `REVOKED_CA_CERTIFICATE_STILL_ACTIVE_CHECK`
   * - `REVOKED_DEVICE_CERTIFICATE_STILL_ACTIVE_CHECK`
   * - `UNAUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-scheduledaudit.html#cfn-iot-scheduledaudit-targetchecknames
   */
  readonly targetCheckNames: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnScheduledAuditProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduledAuditProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledAuditPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dayOfMonth", cdk.validateString)(properties.dayOfMonth));
  errors.collect(cdk.propertyValidator("dayOfWeek", cdk.validateString)(properties.dayOfWeek));
  errors.collect(cdk.propertyValidator("frequency", cdk.requiredValidator)(properties.frequency));
  errors.collect(cdk.propertyValidator("frequency", cdk.validateString)(properties.frequency));
  errors.collect(cdk.propertyValidator("scheduledAuditName", cdk.validateString)(properties.scheduledAuditName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetCheckNames", cdk.requiredValidator)(properties.targetCheckNames));
  errors.collect(cdk.propertyValidator("targetCheckNames", cdk.listValidator(cdk.validateString))(properties.targetCheckNames));
  return errors.wrap("supplied properties not correct for \"CfnScheduledAuditProps\"");
}

// @ts-ignore TS6133
function convertCfnScheduledAuditPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledAuditPropsValidator(properties).assertSuccess();
  return {
    "DayOfMonth": cdk.stringToCloudFormation(properties.dayOfMonth),
    "DayOfWeek": cdk.stringToCloudFormation(properties.dayOfWeek),
    "Frequency": cdk.stringToCloudFormation(properties.frequency),
    "ScheduledAuditName": cdk.stringToCloudFormation(properties.scheduledAuditName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetCheckNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetCheckNames)
  };
}

// @ts-ignore TS6133
function CfnScheduledAuditPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledAuditProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledAuditProps>();
  ret.addPropertyResult("dayOfMonth", "DayOfMonth", (properties.DayOfMonth != null ? cfn_parse.FromCloudFormation.getString(properties.DayOfMonth) : undefined));
  ret.addPropertyResult("dayOfWeek", "DayOfWeek", (properties.DayOfWeek != null ? cfn_parse.FromCloudFormation.getString(properties.DayOfWeek) : undefined));
  ret.addPropertyResult("frequency", "Frequency", (properties.Frequency != null ? cfn_parse.FromCloudFormation.getString(properties.Frequency) : undefined));
  ret.addPropertyResult("scheduledAuditName", "ScheduledAuditName", (properties.ScheduledAuditName != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduledAuditName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetCheckNames", "TargetCheckNames", (properties.TargetCheckNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetCheckNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::SecurityProfile` resource to create a Device Defender security profile.
 *
 * For API reference, see [CreateSecurityProfile](https://docs.aws.amazon.com/iot/latest/apireference/API_CreateSecurityProfile.html) and for general information, see [Detect](https://docs.aws.amazon.com/iot/latest/developerguide/device-defender-detect.html) .
 *
 * @cloudformationResource AWS::IoT::SecurityProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html
 */
export class CfnSecurityProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::SecurityProfile";

  /**
   * Build a CfnSecurityProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecurityProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecurityProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the security profile.
   *
   * @cloudformationAttribute SecurityProfileArn
   */
  public readonly attrSecurityProfileArn: string;

  /**
   * A list of metrics whose data is retained (stored).
   */
  public additionalMetricsToRetainV2?: Array<cdk.IResolvable | CfnSecurityProfile.MetricToRetainProperty> | cdk.IResolvable;

  /**
   * Specifies the destinations to which alerts are sent.
   */
  public alertTargets?: cdk.IResolvable | Record<string, CfnSecurityProfile.AlertTargetProperty | cdk.IResolvable>;

  /**
   * Specifies the behaviors that, when violated by a device (thing), cause an alert.
   */
  public behaviors?: Array<CfnSecurityProfile.BehaviorProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies the MQTT topic and role ARN required for metric export.
   */
  public metricsExportConfig?: cdk.IResolvable | CfnSecurityProfile.MetricsExportConfigProperty;

  /**
   * A description of the security profile.
   */
  public securityProfileDescription?: string;

  /**
   * The name you gave to the security profile.
   */
  public securityProfileName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that can be used to manage the security profile.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the target (thing group) to which the security profile is attached.
   */
  public targetArns?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecurityProfileProps = {}) {
    super(scope, id, {
      "type": CfnSecurityProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrSecurityProfileArn = cdk.Token.asString(this.getAtt("SecurityProfileArn", cdk.ResolutionTypeHint.STRING));
    this.additionalMetricsToRetainV2 = props.additionalMetricsToRetainV2;
    this.alertTargets = props.alertTargets;
    this.behaviors = props.behaviors;
    this.metricsExportConfig = props.metricsExportConfig;
    this.securityProfileDescription = props.securityProfileDescription;
    this.securityProfileName = props.securityProfileName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::SecurityProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetArns = props.targetArns;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalMetricsToRetainV2": this.additionalMetricsToRetainV2,
      "alertTargets": this.alertTargets,
      "behaviors": this.behaviors,
      "metricsExportConfig": this.metricsExportConfig,
      "securityProfileDescription": this.securityProfileDescription,
      "securityProfileName": this.securityProfileName,
      "tags": this.tags.renderTags(),
      "targetArns": this.targetArns
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecurityProfilePropsToCloudFormation(props);
  }
}

export namespace CfnSecurityProfile {
  /**
   * The metric you want to retain.
   *
   * Dimensions are optional.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metrictoretain.html
   */
  export interface MetricToRetainProperty {
    /**
     * The value indicates exporting metrics related to the `MetricToRetain` when it's true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metrictoretain.html#cfn-iot-securityprofile-metrictoretain-exportmetric
     */
    readonly exportMetric?: boolean | cdk.IResolvable;

    /**
     * A standard of measurement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metrictoretain.html#cfn-iot-securityprofile-metrictoretain-metric
     */
    readonly metric: string;

    /**
     * The dimension of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metrictoretain.html#cfn-iot-securityprofile-metrictoretain-metricdimension
     */
    readonly metricDimension?: cdk.IResolvable | CfnSecurityProfile.MetricDimensionProperty;
  }

  /**
   * The dimension of the metric.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricdimension.html
   */
  export interface MetricDimensionProperty {
    /**
     * The name of the dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricdimension.html#cfn-iot-securityprofile-metricdimension-dimensionname
     */
    readonly dimensionName: string;

    /**
     * Operators are constructs that perform logical operations.
     *
     * Valid values are `IN` and `NOT_IN` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricdimension.html#cfn-iot-securityprofile-metricdimension-operator
     */
    readonly operator?: string;
  }

  /**
   * A Device Defender security profile behavior.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behavior.html
   */
  export interface BehaviorProperty {
    /**
     * The criteria that determine if a device is behaving normally in regard to the `metric` .
     *
     * > In the AWS IoT console, you can choose to be sent an alert through Amazon SNS when AWS IoT Device Defender detects that a device is behaving anomalously.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behavior.html#cfn-iot-securityprofile-behavior-criteria
     */
    readonly criteria?: CfnSecurityProfile.BehaviorCriteriaProperty | cdk.IResolvable;

    /**
     * Value indicates exporting metrics related to the behavior when it is true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behavior.html#cfn-iot-securityprofile-behavior-exportmetric
     */
    readonly exportMetric?: boolean | cdk.IResolvable;

    /**
     * What is measured by the behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behavior.html#cfn-iot-securityprofile-behavior-metric
     */
    readonly metric?: string;

    /**
     * The dimension of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behavior.html#cfn-iot-securityprofile-behavior-metricdimension
     */
    readonly metricDimension?: cdk.IResolvable | CfnSecurityProfile.MetricDimensionProperty;

    /**
     * The name you've given to the behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behavior.html#cfn-iot-securityprofile-behavior-name
     */
    readonly name: string;

    /**
     * The alert status.
     *
     * If you set the value to `true` , alerts will be suppressed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behavior.html#cfn-iot-securityprofile-behavior-suppressalerts
     */
    readonly suppressAlerts?: boolean | cdk.IResolvable;
  }

  /**
   * The criteria by which the behavior is determined to be normal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behaviorcriteria.html
   */
  export interface BehaviorCriteriaProperty {
    /**
     * The operator that relates the thing measured ( `metric` ) to the criteria (containing a `value` or `statisticalThreshold` ).
     *
     * Valid operators include:
     *
     * - `string-list` : `in-set` and `not-in-set`
     * - `number-list` : `in-set` and `not-in-set`
     * - `ip-address-list` : `in-cidr-set` and `not-in-cidr-set`
     * - `number` : `less-than` , `less-than-equals` , `greater-than` , and `greater-than-equals`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behaviorcriteria.html#cfn-iot-securityprofile-behaviorcriteria-comparisonoperator
     */
    readonly comparisonOperator?: string;

    /**
     * If a device is in violation of the behavior for the specified number of consecutive datapoints, an alarm occurs.
     *
     * If not specified, the default is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behaviorcriteria.html#cfn-iot-securityprofile-behaviorcriteria-consecutivedatapointstoalarm
     */
    readonly consecutiveDatapointsToAlarm?: number;

    /**
     * If an alarm has occurred and the offending device is no longer in violation of the behavior for the specified number of consecutive datapoints, the alarm is cleared.
     *
     * If not specified, the default is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behaviorcriteria.html#cfn-iot-securityprofile-behaviorcriteria-consecutivedatapointstoclear
     */
    readonly consecutiveDatapointsToClear?: number;

    /**
     * Use this to specify the time duration over which the behavior is evaluated, for those criteria that have a time dimension (for example, `NUM_MESSAGES_SENT` ).
     *
     * For a `statisticalThreshhold` metric comparison, measurements from all devices are accumulated over this time duration before being used to calculate percentiles, and later, measurements from an individual device are also accumulated over this time duration before being given a percentile rank. Cannot be used with list-based metric datatypes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behaviorcriteria.html#cfn-iot-securityprofile-behaviorcriteria-durationseconds
     */
    readonly durationSeconds?: number;

    /**
     * The confidence level of the detection model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behaviorcriteria.html#cfn-iot-securityprofile-behaviorcriteria-mldetectionconfig
     */
    readonly mlDetectionConfig?: cdk.IResolvable | CfnSecurityProfile.MachineLearningDetectionConfigProperty;

    /**
     * A statistical ranking (percentile)that indicates a threshold value by which a behavior is determined to be in compliance or in violation of the behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behaviorcriteria.html#cfn-iot-securityprofile-behaviorcriteria-statisticalthreshold
     */
    readonly statisticalThreshold?: cdk.IResolvable | CfnSecurityProfile.StatisticalThresholdProperty;

    /**
     * The value to be compared with the `metric` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-behaviorcriteria.html#cfn-iot-securityprofile-behaviorcriteria-value
     */
    readonly value?: cdk.IResolvable | CfnSecurityProfile.MetricValueProperty;
  }

  /**
   * The `MachineLearningDetectionConfig` property type controls confidence of the machine learning model.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-machinelearningdetectionconfig.html
   */
  export interface MachineLearningDetectionConfigProperty {
    /**
     * The model confidence level.
     *
     * There are three levels of confidence, `"high"` , `"medium"` , and `"low"` .
     *
     * The higher the confidence level, the lower the sensitivity, and the lower the alarm frequency will be.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-machinelearningdetectionconfig.html#cfn-iot-securityprofile-machinelearningdetectionconfig-confidencelevel
     */
    readonly confidenceLevel?: string;
  }

  /**
   * The value to be compared with the `metric` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricvalue.html
   */
  export interface MetricValueProperty {
    /**
     * If the `comparisonOperator` calls for a set of CIDRs, use this to specify that set to be compared with the `metric` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricvalue.html#cfn-iot-securityprofile-metricvalue-cidrs
     */
    readonly cidrs?: Array<string>;

    /**
     * If the `comparisonOperator` calls for a numeric value, use this to specify that numeric value to be compared with the `metric` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricvalue.html#cfn-iot-securityprofile-metricvalue-count
     */
    readonly count?: string;

    /**
     * The numeric values of a metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricvalue.html#cfn-iot-securityprofile-metricvalue-number
     */
    readonly number?: number;

    /**
     * The numeric value of a metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricvalue.html#cfn-iot-securityprofile-metricvalue-numbers
     */
    readonly numbers?: Array<number> | cdk.IResolvable;

    /**
     * If the `comparisonOperator` calls for a set of ports, use this to specify that set to be compared with the `metric` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricvalue.html#cfn-iot-securityprofile-metricvalue-ports
     */
    readonly ports?: Array<number> | cdk.IResolvable;

    /**
     * The string values of a metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricvalue.html#cfn-iot-securityprofile-metricvalue-strings
     */
    readonly strings?: Array<string>;
  }

  /**
   * A statistical ranking (percentile) that indicates a threshold value by which a behavior is determined to be in compliance or in violation of the behavior.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-statisticalthreshold.html
   */
  export interface StatisticalThresholdProperty {
    /**
     * The percentile that resolves to a threshold value by which compliance with a behavior is determined.
     *
     * Metrics are collected over the specified period ( `durationSeconds` ) from all reporting devices in your account and statistical ranks are calculated. Then, the measurements from a device are collected over the same period. If the accumulated measurements from the device fall above or below ( `comparisonOperator` ) the value associated with the percentile specified, then the device is considered to be in compliance with the behavior, otherwise a violation occurs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-statisticalthreshold.html#cfn-iot-securityprofile-statisticalthreshold-statistic
     */
    readonly statistic?: string;
  }

  /**
   * A structure containing the alert target ARN and the role ARN.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-alerttarget.html
   */
  export interface AlertTargetProperty {
    /**
     * The Amazon Resource Name (ARN) of the notification target to which alerts are sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-alerttarget.html#cfn-iot-securityprofile-alerttarget-alerttargetarn
     */
    readonly alertTargetArn: string;

    /**
     * The ARN of the role that grants permission to send alerts to the notification target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-alerttarget.html#cfn-iot-securityprofile-alerttarget-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Specifies the MQTT topic and role ARN required for metric export.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricsexportconfig.html
   */
  export interface MetricsExportConfigProperty {
    /**
     * The MQTT topic that Device Defender Detect should publish messages to for metrics export.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricsexportconfig.html#cfn-iot-securityprofile-metricsexportconfig-mqtttopic
     */
    readonly mqttTopic: string;

    /**
     * This role ARN has permission to publish MQTT messages, after which Device Defender Detect can assume the role and publish messages on your behalf.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-securityprofile-metricsexportconfig.html#cfn-iot-securityprofile-metricsexportconfig-rolearn
     */
    readonly roleArn: string;
  }
}

/**
 * Properties for defining a `CfnSecurityProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html
 */
export interface CfnSecurityProfileProps {
  /**
   * A list of metrics whose data is retained (stored).
   *
   * By default, data is retained for any metric used in the profile's `behaviors` , but it's also retained for any metric specified here. Can be used with custom metrics; can't be used with dimensions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html#cfn-iot-securityprofile-additionalmetricstoretainv2
   */
  readonly additionalMetricsToRetainV2?: Array<cdk.IResolvable | CfnSecurityProfile.MetricToRetainProperty> | cdk.IResolvable;

  /**
   * Specifies the destinations to which alerts are sent.
   *
   * (Alerts are always sent to the console.) Alerts are generated when a device (thing) violates a behavior.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html#cfn-iot-securityprofile-alerttargets
   */
  readonly alertTargets?: cdk.IResolvable | Record<string, CfnSecurityProfile.AlertTargetProperty | cdk.IResolvable>;

  /**
   * Specifies the behaviors that, when violated by a device (thing), cause an alert.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html#cfn-iot-securityprofile-behaviors
   */
  readonly behaviors?: Array<CfnSecurityProfile.BehaviorProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies the MQTT topic and role ARN required for metric export.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html#cfn-iot-securityprofile-metricsexportconfig
   */
  readonly metricsExportConfig?: cdk.IResolvable | CfnSecurityProfile.MetricsExportConfigProperty;

  /**
   * A description of the security profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html#cfn-iot-securityprofile-securityprofiledescription
   */
  readonly securityProfileDescription?: string;

  /**
   * The name you gave to the security profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html#cfn-iot-securityprofile-securityprofilename
   */
  readonly securityProfileName?: string;

  /**
   * Metadata that can be used to manage the security profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html#cfn-iot-securityprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the target (thing group) to which the security profile is attached.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-securityprofile.html#cfn-iot-securityprofile-targetarns
   */
  readonly targetArns?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `MetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileMetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensionName", cdk.requiredValidator)(properties.dimensionName));
  errors.collect(cdk.propertyValidator("dimensionName", cdk.validateString)(properties.dimensionName));
  errors.collect(cdk.propertyValidator("operator", cdk.validateString)(properties.operator));
  return errors.wrap("supplied properties not correct for \"MetricDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileMetricDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileMetricDimensionPropertyValidator(properties).assertSuccess();
  return {
    "DimensionName": cdk.stringToCloudFormation(properties.dimensionName),
    "Operator": cdk.stringToCloudFormation(properties.operator)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityProfile.MetricDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.MetricDimensionProperty>();
  ret.addPropertyResult("dimensionName", "DimensionName", (properties.DimensionName != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionName) : undefined));
  ret.addPropertyResult("operator", "Operator", (properties.Operator != null ? cfn_parse.FromCloudFormation.getString(properties.Operator) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricToRetainProperty`
 *
 * @param properties - the TypeScript properties of a `MetricToRetainProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileMetricToRetainPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exportMetric", cdk.validateBoolean)(properties.exportMetric));
  errors.collect(cdk.propertyValidator("metric", cdk.requiredValidator)(properties.metric));
  errors.collect(cdk.propertyValidator("metric", cdk.validateString)(properties.metric));
  errors.collect(cdk.propertyValidator("metricDimension", CfnSecurityProfileMetricDimensionPropertyValidator)(properties.metricDimension));
  return errors.wrap("supplied properties not correct for \"MetricToRetainProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileMetricToRetainPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileMetricToRetainPropertyValidator(properties).assertSuccess();
  return {
    "ExportMetric": cdk.booleanToCloudFormation(properties.exportMetric),
    "Metric": cdk.stringToCloudFormation(properties.metric),
    "MetricDimension": convertCfnSecurityProfileMetricDimensionPropertyToCloudFormation(properties.metricDimension)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileMetricToRetainPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityProfile.MetricToRetainProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.MetricToRetainProperty>();
  ret.addPropertyResult("exportMetric", "ExportMetric", (properties.ExportMetric != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExportMetric) : undefined));
  ret.addPropertyResult("metric", "Metric", (properties.Metric != null ? cfn_parse.FromCloudFormation.getString(properties.Metric) : undefined));
  ret.addPropertyResult("metricDimension", "MetricDimension", (properties.MetricDimension != null ? CfnSecurityProfileMetricDimensionPropertyFromCloudFormation(properties.MetricDimension) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MachineLearningDetectionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `MachineLearningDetectionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileMachineLearningDetectionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("confidenceLevel", cdk.validateString)(properties.confidenceLevel));
  return errors.wrap("supplied properties not correct for \"MachineLearningDetectionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileMachineLearningDetectionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileMachineLearningDetectionConfigPropertyValidator(properties).assertSuccess();
  return {
    "ConfidenceLevel": cdk.stringToCloudFormation(properties.confidenceLevel)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileMachineLearningDetectionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityProfile.MachineLearningDetectionConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.MachineLearningDetectionConfigProperty>();
  ret.addPropertyResult("confidenceLevel", "ConfidenceLevel", (properties.ConfidenceLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ConfidenceLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricValueProperty`
 *
 * @param properties - the TypeScript properties of a `MetricValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileMetricValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cidrs", cdk.listValidator(cdk.validateString))(properties.cidrs));
  errors.collect(cdk.propertyValidator("count", cdk.validateString)(properties.count));
  errors.collect(cdk.propertyValidator("number", cdk.validateNumber)(properties.number));
  errors.collect(cdk.propertyValidator("numbers", cdk.listValidator(cdk.validateNumber))(properties.numbers));
  errors.collect(cdk.propertyValidator("ports", cdk.listValidator(cdk.validateNumber))(properties.ports));
  errors.collect(cdk.propertyValidator("strings", cdk.listValidator(cdk.validateString))(properties.strings));
  return errors.wrap("supplied properties not correct for \"MetricValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileMetricValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileMetricValuePropertyValidator(properties).assertSuccess();
  return {
    "Cidrs": cdk.listMapper(cdk.stringToCloudFormation)(properties.cidrs),
    "Count": cdk.stringToCloudFormation(properties.count),
    "Number": cdk.numberToCloudFormation(properties.number),
    "Numbers": cdk.listMapper(cdk.numberToCloudFormation)(properties.numbers),
    "Ports": cdk.listMapper(cdk.numberToCloudFormation)(properties.ports),
    "Strings": cdk.listMapper(cdk.stringToCloudFormation)(properties.strings)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileMetricValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityProfile.MetricValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.MetricValueProperty>();
  ret.addPropertyResult("cidrs", "Cidrs", (properties.Cidrs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Cidrs) : undefined));
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getString(properties.Count) : undefined));
  ret.addPropertyResult("number", "Number", (properties.Number != null ? cfn_parse.FromCloudFormation.getNumber(properties.Number) : undefined));
  ret.addPropertyResult("numbers", "Numbers", (properties.Numbers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Numbers) : undefined));
  ret.addPropertyResult("ports", "Ports", (properties.Ports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Ports) : undefined));
  ret.addPropertyResult("strings", "Strings", (properties.Strings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Strings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatisticalThresholdProperty`
 *
 * @param properties - the TypeScript properties of a `StatisticalThresholdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileStatisticalThresholdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statistic", cdk.validateString)(properties.statistic));
  return errors.wrap("supplied properties not correct for \"StatisticalThresholdProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileStatisticalThresholdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileStatisticalThresholdPropertyValidator(properties).assertSuccess();
  return {
    "Statistic": cdk.stringToCloudFormation(properties.statistic)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileStatisticalThresholdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityProfile.StatisticalThresholdProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.StatisticalThresholdProperty>();
  ret.addPropertyResult("statistic", "Statistic", (properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BehaviorCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `BehaviorCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileBehaviorCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("consecutiveDatapointsToAlarm", cdk.validateNumber)(properties.consecutiveDatapointsToAlarm));
  errors.collect(cdk.propertyValidator("consecutiveDatapointsToClear", cdk.validateNumber)(properties.consecutiveDatapointsToClear));
  errors.collect(cdk.propertyValidator("durationSeconds", cdk.validateNumber)(properties.durationSeconds));
  errors.collect(cdk.propertyValidator("mlDetectionConfig", CfnSecurityProfileMachineLearningDetectionConfigPropertyValidator)(properties.mlDetectionConfig));
  errors.collect(cdk.propertyValidator("statisticalThreshold", CfnSecurityProfileStatisticalThresholdPropertyValidator)(properties.statisticalThreshold));
  errors.collect(cdk.propertyValidator("value", CfnSecurityProfileMetricValuePropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"BehaviorCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileBehaviorCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileBehaviorCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "ConsecutiveDatapointsToAlarm": cdk.numberToCloudFormation(properties.consecutiveDatapointsToAlarm),
    "ConsecutiveDatapointsToClear": cdk.numberToCloudFormation(properties.consecutiveDatapointsToClear),
    "DurationSeconds": cdk.numberToCloudFormation(properties.durationSeconds),
    "MlDetectionConfig": convertCfnSecurityProfileMachineLearningDetectionConfigPropertyToCloudFormation(properties.mlDetectionConfig),
    "StatisticalThreshold": convertCfnSecurityProfileStatisticalThresholdPropertyToCloudFormation(properties.statisticalThreshold),
    "Value": convertCfnSecurityProfileMetricValuePropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileBehaviorCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityProfile.BehaviorCriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.BehaviorCriteriaProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("consecutiveDatapointsToAlarm", "ConsecutiveDatapointsToAlarm", (properties.ConsecutiveDatapointsToAlarm != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConsecutiveDatapointsToAlarm) : undefined));
  ret.addPropertyResult("consecutiveDatapointsToClear", "ConsecutiveDatapointsToClear", (properties.ConsecutiveDatapointsToClear != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConsecutiveDatapointsToClear) : undefined));
  ret.addPropertyResult("durationSeconds", "DurationSeconds", (properties.DurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationSeconds) : undefined));
  ret.addPropertyResult("mlDetectionConfig", "MlDetectionConfig", (properties.MlDetectionConfig != null ? CfnSecurityProfileMachineLearningDetectionConfigPropertyFromCloudFormation(properties.MlDetectionConfig) : undefined));
  ret.addPropertyResult("statisticalThreshold", "StatisticalThreshold", (properties.StatisticalThreshold != null ? CfnSecurityProfileStatisticalThresholdPropertyFromCloudFormation(properties.StatisticalThreshold) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnSecurityProfileMetricValuePropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `BehaviorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("criteria", CfnSecurityProfileBehaviorCriteriaPropertyValidator)(properties.criteria));
  errors.collect(cdk.propertyValidator("exportMetric", cdk.validateBoolean)(properties.exportMetric));
  errors.collect(cdk.propertyValidator("metric", cdk.validateString)(properties.metric));
  errors.collect(cdk.propertyValidator("metricDimension", CfnSecurityProfileMetricDimensionPropertyValidator)(properties.metricDimension));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("suppressAlerts", cdk.validateBoolean)(properties.suppressAlerts));
  return errors.wrap("supplied properties not correct for \"BehaviorProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileBehaviorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileBehaviorPropertyValidator(properties).assertSuccess();
  return {
    "Criteria": convertCfnSecurityProfileBehaviorCriteriaPropertyToCloudFormation(properties.criteria),
    "ExportMetric": cdk.booleanToCloudFormation(properties.exportMetric),
    "Metric": cdk.stringToCloudFormation(properties.metric),
    "MetricDimension": convertCfnSecurityProfileMetricDimensionPropertyToCloudFormation(properties.metricDimension),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SuppressAlerts": cdk.booleanToCloudFormation(properties.suppressAlerts)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityProfile.BehaviorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.BehaviorProperty>();
  ret.addPropertyResult("criteria", "Criteria", (properties.Criteria != null ? CfnSecurityProfileBehaviorCriteriaPropertyFromCloudFormation(properties.Criteria) : undefined));
  ret.addPropertyResult("exportMetric", "ExportMetric", (properties.ExportMetric != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExportMetric) : undefined));
  ret.addPropertyResult("metric", "Metric", (properties.Metric != null ? cfn_parse.FromCloudFormation.getString(properties.Metric) : undefined));
  ret.addPropertyResult("metricDimension", "MetricDimension", (properties.MetricDimension != null ? CfnSecurityProfileMetricDimensionPropertyFromCloudFormation(properties.MetricDimension) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("suppressAlerts", "SuppressAlerts", (properties.SuppressAlerts != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SuppressAlerts) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AlertTargetProperty`
 *
 * @param properties - the TypeScript properties of a `AlertTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileAlertTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alertTargetArn", cdk.requiredValidator)(properties.alertTargetArn));
  errors.collect(cdk.propertyValidator("alertTargetArn", cdk.validateString)(properties.alertTargetArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"AlertTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileAlertTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileAlertTargetPropertyValidator(properties).assertSuccess();
  return {
    "AlertTargetArn": cdk.stringToCloudFormation(properties.alertTargetArn),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileAlertTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityProfile.AlertTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.AlertTargetProperty>();
  ret.addPropertyResult("alertTargetArn", "AlertTargetArn", (properties.AlertTargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.AlertTargetArn) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricsExportConfigProperty`
 *
 * @param properties - the TypeScript properties of a `MetricsExportConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfileMetricsExportConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mqttTopic", cdk.requiredValidator)(properties.mqttTopic));
  errors.collect(cdk.propertyValidator("mqttTopic", cdk.validateString)(properties.mqttTopic));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"MetricsExportConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfileMetricsExportConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfileMetricsExportConfigPropertyValidator(properties).assertSuccess();
  return {
    "MqttTopic": cdk.stringToCloudFormation(properties.mqttTopic),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfileMetricsExportConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityProfile.MetricsExportConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfile.MetricsExportConfigProperty>();
  ret.addPropertyResult("mqttTopic", "MqttTopic", (properties.MqttTopic != null ? cfn_parse.FromCloudFormation.getString(properties.MqttTopic) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalMetricsToRetainV2", cdk.listValidator(CfnSecurityProfileMetricToRetainPropertyValidator))(properties.additionalMetricsToRetainV2));
  errors.collect(cdk.propertyValidator("alertTargets", cdk.hashValidator(CfnSecurityProfileAlertTargetPropertyValidator))(properties.alertTargets));
  errors.collect(cdk.propertyValidator("behaviors", cdk.listValidator(CfnSecurityProfileBehaviorPropertyValidator))(properties.behaviors));
  errors.collect(cdk.propertyValidator("metricsExportConfig", CfnSecurityProfileMetricsExportConfigPropertyValidator)(properties.metricsExportConfig));
  errors.collect(cdk.propertyValidator("securityProfileDescription", cdk.validateString)(properties.securityProfileDescription));
  errors.collect(cdk.propertyValidator("securityProfileName", cdk.validateString)(properties.securityProfileName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetArns", cdk.listValidator(cdk.validateString))(properties.targetArns));
  return errors.wrap("supplied properties not correct for \"CfnSecurityProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfilePropsValidator(properties).assertSuccess();
  return {
    "AdditionalMetricsToRetainV2": cdk.listMapper(convertCfnSecurityProfileMetricToRetainPropertyToCloudFormation)(properties.additionalMetricsToRetainV2),
    "AlertTargets": cdk.hashMapper(convertCfnSecurityProfileAlertTargetPropertyToCloudFormation)(properties.alertTargets),
    "Behaviors": cdk.listMapper(convertCfnSecurityProfileBehaviorPropertyToCloudFormation)(properties.behaviors),
    "MetricsExportConfig": convertCfnSecurityProfileMetricsExportConfigPropertyToCloudFormation(properties.metricsExportConfig),
    "SecurityProfileDescription": cdk.stringToCloudFormation(properties.securityProfileDescription),
    "SecurityProfileName": cdk.stringToCloudFormation(properties.securityProfileName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetArns)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfileProps>();
  ret.addPropertyResult("additionalMetricsToRetainV2", "AdditionalMetricsToRetainV2", (properties.AdditionalMetricsToRetainV2 != null ? cfn_parse.FromCloudFormation.getArray(CfnSecurityProfileMetricToRetainPropertyFromCloudFormation)(properties.AdditionalMetricsToRetainV2) : undefined));
  ret.addPropertyResult("alertTargets", "AlertTargets", (properties.AlertTargets != null ? cfn_parse.FromCloudFormation.getMap(CfnSecurityProfileAlertTargetPropertyFromCloudFormation)(properties.AlertTargets) : undefined));
  ret.addPropertyResult("behaviors", "Behaviors", (properties.Behaviors != null ? cfn_parse.FromCloudFormation.getArray(CfnSecurityProfileBehaviorPropertyFromCloudFormation)(properties.Behaviors) : undefined));
  ret.addPropertyResult("metricsExportConfig", "MetricsExportConfig", (properties.MetricsExportConfig != null ? CfnSecurityProfileMetricsExportConfigPropertyFromCloudFormation(properties.MetricsExportConfig) : undefined));
  ret.addPropertyResult("securityProfileDescription", "SecurityProfileDescription", (properties.SecurityProfileDescription != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityProfileDescription) : undefined));
  ret.addPropertyResult("securityProfileName", "SecurityProfileName", (properties.SecurityProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityProfileName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetArns", "TargetArns", (properties.TargetArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetArns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::SoftwarePackage` resource to create a software package.
 *
 * For information about working with software packages, see [AWS IoT Device Management Software Package Catalog](https://docs.aws.amazon.com/iot/latest/developerguide/software-package-catalog.html) and [Creating a software package and package version](https://docs.aws.amazon.com/iot/latest/developerguide/creating-package-and-version.html) in the *AWS IoT Developer Guide* . See also, [CreatePackage](https://docs.aws.amazon.com/iot/latest/apireference/API_CreatePackage.html) in the *API Guide* .
 *
 * @cloudformationResource AWS::IoT::SoftwarePackage
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackage.html
 */
export class CfnSoftwarePackage extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::SoftwarePackage";

  /**
   * Build a CfnSoftwarePackage from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSoftwarePackage {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSoftwarePackagePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSoftwarePackage(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the package.
   *
   * @cloudformationAttribute PackageArn
   */
  public readonly attrPackageArn: string;

  /**
   * A summary of the package being created.
   */
  public description?: string;

  /**
   * The name of the new software package.
   */
  public packageName?: string;

  /**
   * Metadata that can be used to manage the package.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSoftwarePackageProps = {}) {
    super(scope, id, {
      "type": CfnSoftwarePackage.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrPackageArn = cdk.Token.asString(this.getAtt("PackageArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.packageName = props.packageName;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "packageName": this.packageName,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSoftwarePackage.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSoftwarePackagePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSoftwarePackage`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackage.html
 */
export interface CfnSoftwarePackageProps {
  /**
   * A summary of the package being created.
   *
   * This can be used to outline the package's contents or purpose.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackage.html#cfn-iot-softwarepackage-description
   */
  readonly description?: string;

  /**
   * The name of the new software package.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackage.html#cfn-iot-softwarepackage-packagename
   */
  readonly packageName?: string;

  /**
   * Metadata that can be used to manage the package.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackage.html#cfn-iot-softwarepackage-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnSoftwarePackageProps`
 *
 * @param properties - the TypeScript properties of a `CfnSoftwarePackageProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSoftwarePackagePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("packageName", cdk.validateString)(properties.packageName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSoftwarePackageProps\"");
}

// @ts-ignore TS6133
function convertCfnSoftwarePackagePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSoftwarePackagePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "PackageName": cdk.stringToCloudFormation(properties.packageName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSoftwarePackagePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSoftwarePackageProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSoftwarePackageProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("packageName", "PackageName", (properties.PackageName != null ? cfn_parse.FromCloudFormation.getString(properties.PackageName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::SoftwarePackageVersion` resource to create a software package version.
 *
 * For information about working with software package versions, see [AWS IoT Device Management Software Package Catalog](https://docs.aws.amazon.com/iot/latest/developerguide/software-package-catalog.html) and [Creating a software package and package version](https://docs.aws.amazon.com/iot/latest/developerguide/creating-package-and-version.html) in the *AWS IoT Developer Guide* . See also, [CreatePackageVersion](https://docs.aws.amazon.com/iot/latest/apireference/API_CreatePackageVersion.html) in the *API Guide* .
 *
 * > The associated software package must exist before the package version is created. If you create a software package and package version in the same CloudFormation template, set the software package as a [dependency](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) of the package version. If they are created out of sequence, you will receive an error.
 * >
 * > Package versions and created in a `draft` state, for more information, see [Package version lifecycle](https://docs.aws.amazon.com/iot/latest/developerguide/preparing-to-use-software-package-catalog.html#package-version-lifecycle) . To change the package version state after it’s created, use the [UpdatePackageVersionAPI](https://docs.aws.amazon.com/iot/latest/apireference/API_UpdatePackageVersion.html) command.
 *
 * @cloudformationResource AWS::IoT::SoftwarePackageVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackageversion.html
 */
export class CfnSoftwarePackageVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::SoftwarePackageVersion";

  /**
   * Build a CfnSoftwarePackageVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSoftwarePackageVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSoftwarePackageVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSoftwarePackageVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Error reason for a package version failure during creation or update.
   *
   * @cloudformationAttribute ErrorReason
   */
  public readonly attrErrorReason: string;

  /**
   * The Amazon Resource Name (ARN) for the package.
   *
   * @cloudformationAttribute PackageVersionArn
   */
  public readonly attrPackageVersionArn: string;

  /**
   * The status of the package version. For more information, see [Package version lifecycle](https://docs.aws.amazon.com/iot/latest/developerguide/preparing-to-use-software-package-catalog.html#package-version-lifecycle) .
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * Metadata that can be used to define a package version’s configuration.
   */
  public attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * A summary of the package version being created.
   */
  public description?: string;

  /**
   * The name of the associated software package.
   */
  public packageName: string;

  /**
   * Metadata that can be used to manage the package version.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The name of the new package version.
   */
  public versionName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSoftwarePackageVersionProps) {
    super(scope, id, {
      "type": CfnSoftwarePackageVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "packageName", this);

    this.attrErrorReason = cdk.Token.asString(this.getAtt("ErrorReason", cdk.ResolutionTypeHint.STRING));
    this.attrPackageVersionArn = cdk.Token.asString(this.getAtt("PackageVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attributes = props.attributes;
    this.description = props.description;
    this.packageName = props.packageName;
    this.tags = props.tags;
    this.versionName = props.versionName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attributes": this.attributes,
      "description": this.description,
      "packageName": this.packageName,
      "tags": this.tags,
      "versionName": this.versionName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSoftwarePackageVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSoftwarePackageVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSoftwarePackageVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackageversion.html
 */
export interface CfnSoftwarePackageVersionProps {
  /**
   * Metadata that can be used to define a package version’s configuration.
   *
   * For example, the S3 file location, configuration options that are being sent to the device or fleet.
   *
   * The combined size of all the attributes on a package version is limited to 3KB.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackageversion.html#cfn-iot-softwarepackageversion-attributes
   */
  readonly attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * A summary of the package version being created.
   *
   * This can be used to outline the package's contents or purpose.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackageversion.html#cfn-iot-softwarepackageversion-description
   */
  readonly description?: string;

  /**
   * The name of the associated software package.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackageversion.html#cfn-iot-softwarepackageversion-packagename
   */
  readonly packageName: string;

  /**
   * Metadata that can be used to manage the package version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackageversion.html#cfn-iot-softwarepackageversion-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the new package version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-softwarepackageversion.html#cfn-iot-softwarepackageversion-versionname
   */
  readonly versionName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSoftwarePackageVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSoftwarePackageVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSoftwarePackageVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("packageName", cdk.requiredValidator)(properties.packageName));
  errors.collect(cdk.propertyValidator("packageName", cdk.validateString)(properties.packageName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("versionName", cdk.validateString)(properties.versionName));
  return errors.wrap("supplied properties not correct for \"CfnSoftwarePackageVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnSoftwarePackageVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSoftwarePackageVersionPropsValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "Description": cdk.stringToCloudFormation(properties.description),
    "PackageName": cdk.stringToCloudFormation(properties.packageName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VersionName": cdk.stringToCloudFormation(properties.versionName)
  };
}

// @ts-ignore TS6133
function CfnSoftwarePackageVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSoftwarePackageVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSoftwarePackageVersionProps>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("packageName", "PackageName", (properties.PackageName != null ? cfn_parse.FromCloudFormation.getString(properties.PackageName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("versionName", "VersionName", (properties.VersionName != null ? cfn_parse.FromCloudFormation.getString(properties.VersionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::Thing` resource to declare an AWS IoT thing.
 *
 * For information about working with things, see [How AWS IoT Works](https://docs.aws.amazon.com/iot/latest/developerguide/aws-iot-how-it-works.html) and [Device Registry for AWS IoT](https://docs.aws.amazon.com/iot/latest/developerguide/thing-registry.html) in the *AWS IoT Developer Guide* .
 *
 * @cloudformationResource AWS::IoT::Thing
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thing.html
 */
export class CfnThing extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::Thing";

  /**
   * Build a CfnThing from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnThing {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnThingPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnThing(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the AWS IoT thing, such as `arn:aws:iot:us-east-2:123456789012:thing/MyThing` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Id of this thing.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A string that contains up to three key value pairs.
   */
  public attributePayload?: CfnThing.AttributePayloadProperty | cdk.IResolvable;

  /**
   * The name of the thing to update.
   */
  public thingName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnThingProps = {}) {
    super(scope, id, {
      "type": CfnThing.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attributePayload = props.attributePayload;
    this.thingName = props.thingName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attributePayload": this.attributePayload,
      "thingName": this.thingName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnThing.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnThingPropsToCloudFormation(props);
  }
}

export namespace CfnThing {
  /**
   * The AttributePayload property specifies up to three attributes for an AWS IoT as key-value pairs.
   *
   * AttributePayload is a property of the [AWS::IoT::Thing](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thing.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thing-attributepayload.html
   */
  export interface AttributePayloadProperty {
    /**
     * A JSON string containing up to three key-value pair in JSON format. For example:.
     *
     * `{\"attributes\":{\"string1\":\"string2\"}}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thing-attributepayload.html#cfn-iot-thing-attributepayload-attributes
     */
    readonly attributes?: cdk.IResolvable | Record<string, string>;
  }
}

/**
 * Properties for defining a `CfnThing`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thing.html
 */
export interface CfnThingProps {
  /**
   * A string that contains up to three key value pairs.
   *
   * Maximum length of 800. Duplicates not allowed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thing.html#cfn-iot-thing-attributepayload
   */
  readonly attributePayload?: CfnThing.AttributePayloadProperty | cdk.IResolvable;

  /**
   * The name of the thing to update.
   *
   * You can't change a thing's name. To change a thing's name, you must create a new thing, give it the new name, and then delete the old thing.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thing.html#cfn-iot-thing-thingname
   */
  readonly thingName?: string;
}

/**
 * Determine whether the given properties match those of a `AttributePayloadProperty`
 *
 * @param properties - the TypeScript properties of a `AttributePayloadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThingAttributePayloadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  return errors.wrap("supplied properties not correct for \"AttributePayloadProperty\"");
}

// @ts-ignore TS6133
function convertCfnThingAttributePayloadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThingAttributePayloadPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes)
  };
}

// @ts-ignore TS6133
function CfnThingAttributePayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThing.AttributePayloadProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThing.AttributePayloadProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnThingProps`
 *
 * @param properties - the TypeScript properties of a `CfnThingProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThingPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributePayload", CfnThingAttributePayloadPropertyValidator)(properties.attributePayload));
  errors.collect(cdk.propertyValidator("thingName", cdk.validateString)(properties.thingName));
  return errors.wrap("supplied properties not correct for \"CfnThingProps\"");
}

// @ts-ignore TS6133
function convertCfnThingPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThingPropsValidator(properties).assertSuccess();
  return {
    "AttributePayload": convertCfnThingAttributePayloadPropertyToCloudFormation(properties.attributePayload),
    "ThingName": cdk.stringToCloudFormation(properties.thingName)
  };
}

// @ts-ignore TS6133
function CfnThingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThingProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThingProps>();
  ret.addPropertyResult("attributePayload", "AttributePayload", (properties.AttributePayload != null ? CfnThingAttributePayloadPropertyFromCloudFormation(properties.AttributePayload) : undefined));
  ret.addPropertyResult("thingName", "ThingName", (properties.ThingName != null ? cfn_parse.FromCloudFormation.getString(properties.ThingName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new thing group.
 *
 * A dynamic thing group is created if the resource template contains the `QueryString` attribute. A dynamic thing group will not contain the `ParentGroupName` attribute. A static thing group and dynamic thing group can't be converted to each other via the addition or removal of the `QueryString` attribute.
 *
 * > This is a control plane operation. See [Authorization](https://docs.aws.amazon.com/iot/latest/developerguide/iot-authorization.html) for information about authorizing control plane actions.
 *
 * Requires permission to access the [CreateThingGroup](https://docs.aws.amazon.com//service-authorization/latest/reference/list_awsiot.html#awsiot-actions-as-permissions) action.
 *
 * @cloudformationResource AWS::IoT::ThingGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thinggroup.html
 */
export class CfnThingGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::ThingGroup";

  /**
   * Build a CfnThingGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnThingGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnThingGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnThingGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The thing group ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The thing group ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The parent thing group name.
   */
  public parentGroupName?: string;

  /**
   * The dynamic thing group search query string.
   */
  public queryString?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the thing group or dynamic thing group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The thing group name.
   */
  public thingGroupName?: string;

  /**
   * Thing group properties.
   */
  public thingGroupProperties?: cdk.IResolvable | CfnThingGroup.ThingGroupPropertiesProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnThingGroupProps = {}) {
    super(scope, id, {
      "type": CfnThingGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.parentGroupName = props.parentGroupName;
    this.queryString = props.queryString;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::ThingGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.thingGroupName = props.thingGroupName;
    this.thingGroupProperties = props.thingGroupProperties;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "parentGroupName": this.parentGroupName,
      "queryString": this.queryString,
      "tags": this.tags.renderTags(),
      "thingGroupName": this.thingGroupName,
      "thingGroupProperties": this.thingGroupProperties
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnThingGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnThingGroupPropsToCloudFormation(props);
  }
}

export namespace CfnThingGroup {
  /**
   * Thing group properties.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thinggroup-thinggroupproperties.html
   */
  export interface ThingGroupPropertiesProperty {
    /**
     * The thing group attributes in JSON format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thinggroup-thinggroupproperties.html#cfn-iot-thinggroup-thinggroupproperties-attributepayload
     */
    readonly attributePayload?: CfnThingGroup.AttributePayloadProperty | cdk.IResolvable;

    /**
     * The thing group description.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thinggroup-thinggroupproperties.html#cfn-iot-thinggroup-thinggroupproperties-thinggroupdescription
     */
    readonly thingGroupDescription?: string;
  }

  /**
   * The attribute payload.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thinggroup-attributepayload.html
   */
  export interface AttributePayloadProperty {
    /**
     * A JSON string containing up to three key-value pair in JSON format. For example:.
     *
     * `{\"attributes\":{\"string1\":\"string2\"}}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thinggroup-attributepayload.html#cfn-iot-thinggroup-attributepayload-attributes
     */
    readonly attributes?: cdk.IResolvable | Record<string, string>;
  }
}

/**
 * Properties for defining a `CfnThingGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thinggroup.html
 */
export interface CfnThingGroupProps {
  /**
   * The parent thing group name.
   *
   * A Dynamic Thing Group does not have `parentGroupName` defined.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thinggroup.html#cfn-iot-thinggroup-parentgroupname
   */
  readonly parentGroupName?: string;

  /**
   * The dynamic thing group search query string.
   *
   * The `queryString` attribute *is* required for `CreateDynamicThingGroup` . The `queryString` attribute *is not* required for `CreateThingGroup` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thinggroup.html#cfn-iot-thinggroup-querystring
   */
  readonly queryString?: string;

  /**
   * Metadata which can be used to manage the thing group or dynamic thing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thinggroup.html#cfn-iot-thinggroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The thing group name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thinggroup.html#cfn-iot-thinggroup-thinggroupname
   */
  readonly thingGroupName?: string;

  /**
   * Thing group properties.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thinggroup.html#cfn-iot-thinggroup-thinggroupproperties
   */
  readonly thingGroupProperties?: cdk.IResolvable | CfnThingGroup.ThingGroupPropertiesProperty;
}

/**
 * Determine whether the given properties match those of a `AttributePayloadProperty`
 *
 * @param properties - the TypeScript properties of a `AttributePayloadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThingGroupAttributePayloadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  return errors.wrap("supplied properties not correct for \"AttributePayloadProperty\"");
}

// @ts-ignore TS6133
function convertCfnThingGroupAttributePayloadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThingGroupAttributePayloadPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes)
  };
}

// @ts-ignore TS6133
function CfnThingGroupAttributePayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThingGroup.AttributePayloadProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThingGroup.AttributePayloadProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ThingGroupPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ThingGroupPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThingGroupThingGroupPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributePayload", CfnThingGroupAttributePayloadPropertyValidator)(properties.attributePayload));
  errors.collect(cdk.propertyValidator("thingGroupDescription", cdk.validateString)(properties.thingGroupDescription));
  return errors.wrap("supplied properties not correct for \"ThingGroupPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnThingGroupThingGroupPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThingGroupThingGroupPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "AttributePayload": convertCfnThingGroupAttributePayloadPropertyToCloudFormation(properties.attributePayload),
    "ThingGroupDescription": cdk.stringToCloudFormation(properties.thingGroupDescription)
  };
}

// @ts-ignore TS6133
function CfnThingGroupThingGroupPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnThingGroup.ThingGroupPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThingGroup.ThingGroupPropertiesProperty>();
  ret.addPropertyResult("attributePayload", "AttributePayload", (properties.AttributePayload != null ? CfnThingGroupAttributePayloadPropertyFromCloudFormation(properties.AttributePayload) : undefined));
  ret.addPropertyResult("thingGroupDescription", "ThingGroupDescription", (properties.ThingGroupDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ThingGroupDescription) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnThingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnThingGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThingGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parentGroupName", cdk.validateString)(properties.parentGroupName));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateString)(properties.queryString));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("thingGroupName", cdk.validateString)(properties.thingGroupName));
  errors.collect(cdk.propertyValidator("thingGroupProperties", CfnThingGroupThingGroupPropertiesPropertyValidator)(properties.thingGroupProperties));
  return errors.wrap("supplied properties not correct for \"CfnThingGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnThingGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThingGroupPropsValidator(properties).assertSuccess();
  return {
    "ParentGroupName": cdk.stringToCloudFormation(properties.parentGroupName),
    "QueryString": cdk.stringToCloudFormation(properties.queryString),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "ThingGroupName": cdk.stringToCloudFormation(properties.thingGroupName),
    "ThingGroupProperties": convertCfnThingGroupThingGroupPropertiesPropertyToCloudFormation(properties.thingGroupProperties)
  };
}

// @ts-ignore TS6133
function CfnThingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThingGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThingGroupProps>();
  ret.addPropertyResult("parentGroupName", "ParentGroupName", (properties.ParentGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ParentGroupName) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getString(properties.QueryString) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("thingGroupName", "ThingGroupName", (properties.ThingGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ThingGroupName) : undefined));
  ret.addPropertyResult("thingGroupProperties", "ThingGroupProperties", (properties.ThingGroupProperties != null ? CfnThingGroupThingGroupPropertiesPropertyFromCloudFormation(properties.ThingGroupProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::ThingPrincipalAttachment` resource to attach a principal (an X.509 certificate or another credential) to a thing.
 *
 * For more information about working with AWS IoT things and principals, see [Authorization](https://docs.aws.amazon.com/iot/latest/developerguide/authorization.html) in the *AWS IoT Developer Guide* .
 *
 * @cloudformationResource AWS::IoT::ThingPrincipalAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingprincipalattachment.html
 */
export class CfnThingPrincipalAttachment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::ThingPrincipalAttachment";

  /**
   * Build a CfnThingPrincipalAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnThingPrincipalAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnThingPrincipalAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnThingPrincipalAttachment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The principal, which can be a certificate ARN (as returned from the `CreateCertificate` operation) or an Amazon Cognito ID.
   */
  public principal: string;

  /**
   * The name of the AWS IoT thing.
   */
  public thingName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnThingPrincipalAttachmentProps) {
    super(scope, id, {
      "type": CfnThingPrincipalAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "principal", this);
    cdk.requireProperty(props, "thingName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.principal = props.principal;
    this.thingName = props.thingName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "principal": this.principal,
      "thingName": this.thingName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnThingPrincipalAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnThingPrincipalAttachmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnThingPrincipalAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingprincipalattachment.html
 */
export interface CfnThingPrincipalAttachmentProps {
  /**
   * The principal, which can be a certificate ARN (as returned from the `CreateCertificate` operation) or an Amazon Cognito ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingprincipalattachment.html#cfn-iot-thingprincipalattachment-principal
   */
  readonly principal: string;

  /**
   * The name of the AWS IoT thing.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingprincipalattachment.html#cfn-iot-thingprincipalattachment-thingname
   */
  readonly thingName: string;
}

/**
 * Determine whether the given properties match those of a `CfnThingPrincipalAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnThingPrincipalAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThingPrincipalAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("principal", cdk.requiredValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("principal", cdk.validateString)(properties.principal));
  errors.collect(cdk.propertyValidator("thingName", cdk.requiredValidator)(properties.thingName));
  errors.collect(cdk.propertyValidator("thingName", cdk.validateString)(properties.thingName));
  return errors.wrap("supplied properties not correct for \"CfnThingPrincipalAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnThingPrincipalAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThingPrincipalAttachmentPropsValidator(properties).assertSuccess();
  return {
    "Principal": cdk.stringToCloudFormation(properties.principal),
    "ThingName": cdk.stringToCloudFormation(properties.thingName)
  };
}

// @ts-ignore TS6133
function CfnThingPrincipalAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThingPrincipalAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThingPrincipalAttachmentProps>();
  ret.addPropertyResult("principal", "Principal", (properties.Principal != null ? cfn_parse.FromCloudFormation.getString(properties.Principal) : undefined));
  ret.addPropertyResult("thingName", "ThingName", (properties.ThingName != null ? cfn_parse.FromCloudFormation.getString(properties.ThingName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new thing type.
 *
 * @cloudformationResource AWS::IoT::ThingType
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingtype.html
 */
export class CfnThingType extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::ThingType";

  /**
   * Build a CfnThingType from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnThingType {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnThingTypePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnThingType(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The thing type arn.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The thing type id.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Deprecates a thing type. You can not associate new things with deprecated thing type.
   */
  public deprecateThingType?: boolean | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the thing type.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the thing type.
   */
  public thingTypeName?: string;

  /**
   * The thing type properties for the thing type to create.
   */
  public thingTypeProperties?: cdk.IResolvable | CfnThingType.ThingTypePropertiesProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnThingTypeProps = {}) {
    super(scope, id, {
      "type": CfnThingType.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.deprecateThingType = props.deprecateThingType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::ThingType", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.thingTypeName = props.thingTypeName;
    this.thingTypeProperties = props.thingTypeProperties;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deprecateThingType": this.deprecateThingType,
      "tags": this.tags.renderTags(),
      "thingTypeName": this.thingTypeName,
      "thingTypeProperties": this.thingTypeProperties
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnThingType.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnThingTypePropsToCloudFormation(props);
  }
}

export namespace CfnThingType {
  /**
   * The ThingTypeProperties contains information about the thing type including: a thing type description, and a list of searchable thing attribute names.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thingtype-thingtypeproperties.html
   */
  export interface ThingTypePropertiesProperty {
    /**
     * A list of searchable thing attribute names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thingtype-thingtypeproperties.html#cfn-iot-thingtype-thingtypeproperties-searchableattributes
     */
    readonly searchableAttributes?: Array<string>;

    /**
     * The description of the thing type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-thingtype-thingtypeproperties.html#cfn-iot-thingtype-thingtypeproperties-thingtypedescription
     */
    readonly thingTypeDescription?: string;
  }
}

/**
 * Properties for defining a `CfnThingType`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingtype.html
 */
export interface CfnThingTypeProps {
  /**
   * Deprecates a thing type. You can not associate new things with deprecated thing type.
   *
   * Requires permission to access the [DeprecateThingType](https://docs.aws.amazon.com//service-authorization/latest/reference/list_awsiot.html#awsiot-actions-as-permissions) action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingtype.html#cfn-iot-thingtype-deprecatethingtype
   */
  readonly deprecateThingType?: boolean | cdk.IResolvable;

  /**
   * Metadata which can be used to manage the thing type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingtype.html#cfn-iot-thingtype-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the thing type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingtype.html#cfn-iot-thingtype-thingtypename
   */
  readonly thingTypeName?: string;

  /**
   * The thing type properties for the thing type to create.
   *
   * It contains information about the new thing type including a description, and a list of searchable thing attribute names. `ThingTypeProperties` can't be updated after the initial creation of the `ThingType` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-thingtype.html#cfn-iot-thingtype-thingtypeproperties
   */
  readonly thingTypeProperties?: cdk.IResolvable | CfnThingType.ThingTypePropertiesProperty;
}

/**
 * Determine whether the given properties match those of a `ThingTypePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ThingTypePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThingTypeThingTypePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("searchableAttributes", cdk.listValidator(cdk.validateString))(properties.searchableAttributes));
  errors.collect(cdk.propertyValidator("thingTypeDescription", cdk.validateString)(properties.thingTypeDescription));
  return errors.wrap("supplied properties not correct for \"ThingTypePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnThingTypeThingTypePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThingTypeThingTypePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "SearchableAttributes": cdk.listMapper(cdk.stringToCloudFormation)(properties.searchableAttributes),
    "ThingTypeDescription": cdk.stringToCloudFormation(properties.thingTypeDescription)
  };
}

// @ts-ignore TS6133
function CfnThingTypeThingTypePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnThingType.ThingTypePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThingType.ThingTypePropertiesProperty>();
  ret.addPropertyResult("searchableAttributes", "SearchableAttributes", (properties.SearchableAttributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SearchableAttributes) : undefined));
  ret.addPropertyResult("thingTypeDescription", "ThingTypeDescription", (properties.ThingTypeDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ThingTypeDescription) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnThingTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnThingTypeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThingTypePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deprecateThingType", cdk.validateBoolean)(properties.deprecateThingType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("thingTypeName", cdk.validateString)(properties.thingTypeName));
  errors.collect(cdk.propertyValidator("thingTypeProperties", CfnThingTypeThingTypePropertiesPropertyValidator)(properties.thingTypeProperties));
  return errors.wrap("supplied properties not correct for \"CfnThingTypeProps\"");
}

// @ts-ignore TS6133
function convertCfnThingTypePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThingTypePropsValidator(properties).assertSuccess();
  return {
    "DeprecateThingType": cdk.booleanToCloudFormation(properties.deprecateThingType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "ThingTypeName": cdk.stringToCloudFormation(properties.thingTypeName),
    "ThingTypeProperties": convertCfnThingTypeThingTypePropertiesPropertyToCloudFormation(properties.thingTypeProperties)
  };
}

// @ts-ignore TS6133
function CfnThingTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThingTypeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThingTypeProps>();
  ret.addPropertyResult("deprecateThingType", "DeprecateThingType", (properties.DeprecateThingType != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeprecateThingType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("thingTypeName", "ThingTypeName", (properties.ThingTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.ThingTypeName) : undefined));
  ret.addPropertyResult("thingTypeProperties", "ThingTypeProperties", (properties.ThingTypeProperties != null ? CfnThingTypeThingTypePropertiesPropertyFromCloudFormation(properties.ThingTypeProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoT::TopicRule` resource to declare an AWS IoT rule.
 *
 * For information about working with AWS IoT rules, see [Rules for AWS IoT](https://docs.aws.amazon.com/iot/latest/developerguide/iot-rules.html) in the *AWS IoT Developer Guide* .
 *
 * @cloudformationResource AWS::IoT::TopicRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html
 */
export class CfnTopicRule extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::TopicRule";

  /**
   * Build a CfnTopicRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTopicRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTopicRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTopicRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the AWS IoT rule, such as `arn:aws:iot:us-east-2:123456789012:rule/MyIoTRule` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the rule.
   */
  public ruleName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the topic rule.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The rule payload.
   */
  public topicRulePayload: cdk.IResolvable | CfnTopicRule.TopicRulePayloadProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTopicRuleProps) {
    super(scope, id, {
      "type": CfnTopicRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "topicRulePayload", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.ruleName = props.ruleName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoT::TopicRule", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.topicRulePayload = props.topicRulePayload;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "ruleName": this.ruleName,
      "tags": this.tags.renderTags(),
      "topicRulePayload": this.topicRulePayload
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTopicRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTopicRulePropsToCloudFormation(props);
  }
}

export namespace CfnTopicRule {
  /**
   * Describes a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-topicrulepayload.html
   */
  export interface TopicRulePayloadProperty {
    /**
     * The actions associated with the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-topicrulepayload.html#cfn-iot-topicrule-topicrulepayload-actions
     */
    readonly actions: Array<CfnTopicRule.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The version of the SQL rules engine to use when evaluating the rule.
     *
     * The default value is 2015-10-08.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-topicrulepayload.html#cfn-iot-topicrule-topicrulepayload-awsiotsqlversion
     */
    readonly awsIotSqlVersion?: string;

    /**
     * The description of the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-topicrulepayload.html#cfn-iot-topicrule-topicrulepayload-description
     */
    readonly description?: string;

    /**
     * The action to take when an error occurs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-topicrulepayload.html#cfn-iot-topicrule-topicrulepayload-erroraction
     */
    readonly errorAction?: CfnTopicRule.ActionProperty | cdk.IResolvable;

    /**
     * Specifies whether the rule is disabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-topicrulepayload.html#cfn-iot-topicrule-topicrulepayload-ruledisabled
     */
    readonly ruleDisabled?: boolean | cdk.IResolvable;

    /**
     * The SQL statement used to query the topic.
     *
     * For more information, see [AWS IoT SQL Reference](https://docs.aws.amazon.com/iot/latest/developerguide/iot-sql-reference.html) in the *AWS IoT Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-topicrulepayload.html#cfn-iot-topicrule-topicrulepayload-sql
     */
    readonly sql: string;
  }

  /**
   * Describes the actions associated with a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html
   */
  export interface ActionProperty {
    /**
     * Change the state of a CloudWatch alarm.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-cloudwatchalarm
     */
    readonly cloudwatchAlarm?: CfnTopicRule.CloudwatchAlarmActionProperty | cdk.IResolvable;

    /**
     * Sends data to CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-cloudwatchlogs
     */
    readonly cloudwatchLogs?: CfnTopicRule.CloudwatchLogsActionProperty | cdk.IResolvable;

    /**
     * Capture a CloudWatch metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-cloudwatchmetric
     */
    readonly cloudwatchMetric?: CfnTopicRule.CloudwatchMetricActionProperty | cdk.IResolvable;

    /**
     * Write to a DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-dynamodb
     */
    readonly dynamoDb?: CfnTopicRule.DynamoDBActionProperty | cdk.IResolvable;

    /**
     * Write to a DynamoDB table.
     *
     * This is a new version of the DynamoDB action. It allows you to write each attribute in an MQTT message payload into a separate DynamoDB column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-dynamodbv2
     */
    readonly dynamoDBv2?: CfnTopicRule.DynamoDBv2ActionProperty | cdk.IResolvable;

    /**
     * Write data to an Amazon OpenSearch Service domain.
     *
     * > The `Elasticsearch` action can only be used by existing rule actions. To create a new rule action or to update an existing rule action, use the `OpenSearch` rule action instead. For more information, see [OpenSearchAction](https://docs.aws.amazon.com//iot/latest/apireference/API_OpenSearchAction.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-elasticsearch
     */
    readonly elasticsearch?: CfnTopicRule.ElasticsearchActionProperty | cdk.IResolvable;

    /**
     * Write to an Amazon Kinesis Firehose stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-firehose
     */
    readonly firehose?: CfnTopicRule.FirehoseActionProperty | cdk.IResolvable;

    /**
     * Send data to an HTTPS endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-http
     */
    readonly http?: CfnTopicRule.HttpActionProperty | cdk.IResolvable;

    /**
     * Sends message data to an AWS IoT Analytics channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-iotanalytics
     */
    readonly iotAnalytics?: CfnTopicRule.IotAnalyticsActionProperty | cdk.IResolvable;

    /**
     * Sends an input to an AWS IoT Events detector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-iotevents
     */
    readonly iotEvents?: CfnTopicRule.IotEventsActionProperty | cdk.IResolvable;

    /**
     * Sends data from the MQTT message that triggered the rule to AWS IoT SiteWise asset properties.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-iotsitewise
     */
    readonly iotSiteWise?: CfnTopicRule.IotSiteWiseActionProperty | cdk.IResolvable;

    /**
     * Send messages to an Amazon Managed Streaming for Apache Kafka (Amazon MSK) or self-managed Apache Kafka cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-kafka
     */
    readonly kafka?: cdk.IResolvable | CfnTopicRule.KafkaActionProperty;

    /**
     * Write data to an Amazon Kinesis stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-kinesis
     */
    readonly kinesis?: cdk.IResolvable | CfnTopicRule.KinesisActionProperty;

    /**
     * Invoke a Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-lambda
     */
    readonly lambda?: cdk.IResolvable | CfnTopicRule.LambdaActionProperty;

    /**
     * Sends device location data to [Amazon Location Service](https://docs.aws.amazon.com//location/latest/developerguide/welcome.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-location
     */
    readonly location?: cdk.IResolvable | CfnTopicRule.LocationActionProperty;

    /**
     * Write data to an Amazon OpenSearch Service domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-opensearch
     */
    readonly openSearch?: cdk.IResolvable | CfnTopicRule.OpenSearchActionProperty;

    /**
     * Publish to another MQTT topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-republish
     */
    readonly republish?: cdk.IResolvable | CfnTopicRule.RepublishActionProperty;

    /**
     * Write to an Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-s3
     */
    readonly s3?: cdk.IResolvable | CfnTopicRule.S3ActionProperty;

    /**
     * Publish to an Amazon SNS topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-sns
     */
    readonly sns?: cdk.IResolvable | CfnTopicRule.SnsActionProperty;

    /**
     * Publish to an Amazon SQS queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-sqs
     */
    readonly sqs?: cdk.IResolvable | CfnTopicRule.SqsActionProperty;

    /**
     * Starts execution of a Step Functions state machine.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-stepfunctions
     */
    readonly stepFunctions?: cdk.IResolvable | CfnTopicRule.StepFunctionsActionProperty;

    /**
     * Writes attributes from an MQTT message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-action.html#cfn-iot-topicrule-action-timestream
     */
    readonly timestream?: cdk.IResolvable | CfnTopicRule.TimestreamActionProperty;
  }

  /**
   * Describes an action to write data to an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-s3action.html
   */
  export interface S3ActionProperty {
    /**
     * The Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-s3action.html#cfn-iot-topicrule-s3action-bucketname
     */
    readonly bucketName: string;

    /**
     * The Amazon S3 canned ACL that controls access to the object identified by the object key.
     *
     * For more information, see [S3 canned ACLs](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-s3action.html#cfn-iot-topicrule-s3action-cannedacl
     */
    readonly cannedAcl?: string;

    /**
     * The object key.
     *
     * For more information, see [Actions, resources, and condition keys for Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/list_amazons3.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-s3action.html#cfn-iot-topicrule-s3action-key
     */
    readonly key: string;

    /**
     * The ARN of the IAM role that grants access.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-s3action.html#cfn-iot-topicrule-s3action-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Describes an action that updates a CloudWatch alarm.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchalarmaction.html
   */
  export interface CloudwatchAlarmActionProperty {
    /**
     * The CloudWatch alarm name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchalarmaction.html#cfn-iot-topicrule-cloudwatchalarmaction-alarmname
     */
    readonly alarmName: string;

    /**
     * The IAM role that allows access to the CloudWatch alarm.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchalarmaction.html#cfn-iot-topicrule-cloudwatchalarmaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The reason for the alarm change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchalarmaction.html#cfn-iot-topicrule-cloudwatchalarmaction-statereason
     */
    readonly stateReason: string;

    /**
     * The value of the alarm state.
     *
     * Acceptable values are: OK, ALARM, INSUFFICIENT_DATA.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchalarmaction.html#cfn-iot-topicrule-cloudwatchalarmaction-statevalue
     */
    readonly stateValue: string;
  }

  /**
   * Sends an input to an AWS IoT Events detector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-ioteventsaction.html
   */
  export interface IotEventsActionProperty {
    /**
     * Whether to process the event actions as a batch. The default value is `false` .
     *
     * When `batchMode` is `true` , you can't specify a `messageId` .
     *
     * When `batchMode` is `true` and the rule SQL statement evaluates to an Array, each Array element is treated as a separate message when Events by calling [`BatchPutMessage`](https://docs.aws.amazon.com/iotevents/latest/apireference/API_iotevents-data_BatchPutMessage.html) . The resulting array can't have more than 10 messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-ioteventsaction.html#cfn-iot-topicrule-ioteventsaction-batchmode
     */
    readonly batchMode?: boolean | cdk.IResolvable;

    /**
     * The name of the AWS IoT Events input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-ioteventsaction.html#cfn-iot-topicrule-ioteventsaction-inputname
     */
    readonly inputName: string;

    /**
     * The ID of the message. The default `messageId` is a new UUID value.
     *
     * When `batchMode` is `true` , you can't specify a `messageId` --a new UUID value will be assigned.
     *
     * Assign a value to this property to ensure that only one input (message) with a given `messageId` will be processed by an AWS IoT Events detector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-ioteventsaction.html#cfn-iot-topicrule-ioteventsaction-messageid
     */
    readonly messageId?: string;

    /**
     * The ARN of the role that grants AWS IoT permission to send an input to an AWS IoT Events detector.
     *
     * ("Action":"iotevents:BatchPutMessage").
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-ioteventsaction.html#cfn-iot-topicrule-ioteventsaction-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Describes an action that writes data to an Amazon Kinesis Firehose stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-firehoseaction.html
   */
  export interface FirehoseActionProperty {
    /**
     * Whether to deliver the Kinesis Data Firehose stream as a batch by using [`PutRecordBatch`](https://docs.aws.amazon.com/firehose/latest/APIReference/API_PutRecordBatch.html) . The default value is `false` .
     *
     * When `batchMode` is `true` and the rule's SQL statement evaluates to an Array, each Array element forms one record in the [`PutRecordBatch`](https://docs.aws.amazon.com/firehose/latest/APIReference/API_PutRecordBatch.html) request. The resulting array can't have more than 500 records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-firehoseaction.html#cfn-iot-topicrule-firehoseaction-batchmode
     */
    readonly batchMode?: boolean | cdk.IResolvable;

    /**
     * The delivery stream name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-firehoseaction.html#cfn-iot-topicrule-firehoseaction-deliverystreamname
     */
    readonly deliveryStreamName: string;

    /**
     * The IAM role that grants access to the Amazon Kinesis Firehose stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-firehoseaction.html#cfn-iot-topicrule-firehoseaction-rolearn
     */
    readonly roleArn: string;

    /**
     * A character separator that will be used to separate records written to the Firehose stream.
     *
     * Valid values are: '\n' (newline), '\t' (tab), '\r\n' (Windows newline), ',' (comma).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-firehoseaction.html#cfn-iot-topicrule-firehoseaction-separator
     */
    readonly separator?: string;
  }

  /**
   * Describes an action to republish to another topic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishaction.html
   */
  export interface RepublishActionProperty {
    /**
     * MQTT Version 5.0 headers information. For more information, see [MQTT](https://docs.aws.amazon.com//iot/latest/developerguide/mqtt.html) in the IoT Core Developer Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishaction.html#cfn-iot-topicrule-republishaction-headers
     */
    readonly headers?: cdk.IResolvable | CfnTopicRule.RepublishActionHeadersProperty;

    /**
     * The Quality of Service (QoS) level to use when republishing messages.
     *
     * The default value is 0.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishaction.html#cfn-iot-topicrule-republishaction-qos
     */
    readonly qos?: number;

    /**
     * The ARN of the IAM role that grants access.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishaction.html#cfn-iot-topicrule-republishaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The name of the MQTT topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishaction.html#cfn-iot-topicrule-republishaction-topic
     */
    readonly topic: string;
  }

  /**
   * Specifies MQTT Version 5.0 headers information. For more information, see [MQTT](https://docs.aws.amazon.com//iot/latest/developerguide/mqtt.html) in the IoT Core Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishactionheaders.html
   */
  export interface RepublishActionHeadersProperty {
    /**
     * A UTF-8 encoded string that describes the content of the publishing message.
     *
     * For more information, see [Content Type](https://docs.aws.amazon.com/https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901118) in the MQTT Version 5.0 specification.
     *
     * Supports [substitution templates](https://docs.aws.amazon.com//iot/latest/developerguide/iot-substitution-templates.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishactionheaders.html#cfn-iot-topicrule-republishactionheaders-contenttype
     */
    readonly contentType?: string;

    /**
     * The base64-encoded binary data used by the sender of the request message to identify which request the response message is for.
     *
     * For more information, see [Correlation Data](https://docs.aws.amazon.com/https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901115) in the MQTT Version 5.0 specification.
     *
     * Supports [substitution templates](https://docs.aws.amazon.com//iot/latest/developerguide/iot-substitution-templates.html) .
     *
     * > This binary data must be base64-encoded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishactionheaders.html#cfn-iot-topicrule-republishactionheaders-correlationdata
     */
    readonly correlationData?: string;

    /**
     * A user-defined integer value that represents the message expiry interval at the broker.
     *
     * If the messages haven't been sent to the subscribers within that interval, the message expires and is removed. The value of `messageExpiry` represents the number of seconds before it expires. For more information about the limits of `messageExpiry` , see [Message broker and protocol limits and quotas](https://docs.aws.amazon.com//general/latest/gr/iot-core.html#limits_iot) in the IoT Core Reference Guide.
     *
     * Supports [substitution templates](https://docs.aws.amazon.com//iot/latest/developerguide/iot-substitution-templates.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishactionheaders.html#cfn-iot-topicrule-republishactionheaders-messageexpiry
     */
    readonly messageExpiry?: string;

    /**
     * An `Enum` string value that indicates whether the payload is formatted as UTF-8.
     *
     * Valid values are `UNSPECIFIED_BYTES` and `UTF8_DATA` .
     *
     * For more information, see [Payload Format Indicator](https://docs.aws.amazon.com/https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901111) from the MQTT Version 5.0 specification.
     *
     * Supports [substitution templates](https://docs.aws.amazon.com//iot/latest/developerguide/iot-substitution-templates.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishactionheaders.html#cfn-iot-topicrule-republishactionheaders-payloadformatindicator
     */
    readonly payloadFormatIndicator?: string;

    /**
     * A UTF-8 encoded string that's used as the topic name for a response message.
     *
     * The response topic is used to describe the topic to which the receiver should publish as part of the request-response flow. The topic must not contain wildcard characters.
     *
     * For more information, see [Response Topic](https://docs.aws.amazon.com/https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901114) in the MQTT Version 5.0 specification.
     *
     * Supports [substitution templates](https://docs.aws.amazon.com//iot/latest/developerguide/iot-substitution-templates.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishactionheaders.html#cfn-iot-topicrule-republishactionheaders-responsetopic
     */
    readonly responseTopic?: string;

    /**
     * An array of key-value pairs that you define in the MQTT5 header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-republishactionheaders.html#cfn-iot-topicrule-republishactionheaders-userproperties
     */
    readonly userProperties?: Array<cdk.IResolvable | CfnTopicRule.UserPropertyProperty> | cdk.IResolvable;
  }

  /**
   * A key-value pair that you define in the header.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-userproperty.html
   */
  export interface UserPropertyProperty {
    /**
     * A key to be specified in `UserProperty` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-userproperty.html#cfn-iot-topicrule-userproperty-key
     */
    readonly key: string;

    /**
     * A value to be specified in `UserProperty` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-userproperty.html#cfn-iot-topicrule-userproperty-value
     */
    readonly value: string;
  }

  /**
   * Send messages to an Amazon Managed Streaming for Apache Kafka (Amazon MSK) or self-managed Apache Kafka cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaaction.html
   */
  export interface KafkaActionProperty {
    /**
     * Properties of the Apache Kafka producer client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaaction.html#cfn-iot-topicrule-kafkaaction-clientproperties
     */
    readonly clientProperties: cdk.IResolvable | Record<string, string>;

    /**
     * The ARN of Kafka action's VPC `TopicRuleDestination` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaaction.html#cfn-iot-topicrule-kafkaaction-destinationarn
     */
    readonly destinationArn: string;

    /**
     * The list of Kafka headers that you specify.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaaction.html#cfn-iot-topicrule-kafkaaction-headers
     */
    readonly headers?: Array<cdk.IResolvable | CfnTopicRule.KafkaActionHeaderProperty> | cdk.IResolvable;

    /**
     * The Kafka message key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaaction.html#cfn-iot-topicrule-kafkaaction-key
     */
    readonly key?: string;

    /**
     * The Kafka message partition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaaction.html#cfn-iot-topicrule-kafkaaction-partition
     */
    readonly partition?: string;

    /**
     * The Kafka topic for messages to be sent to the Kafka broker.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaaction.html#cfn-iot-topicrule-kafkaaction-topic
     */
    readonly topic: string;
  }

  /**
   * Specifies a Kafka header using key-value pairs when you create a Rule’s Kafka Action.
   *
   * You can use these headers to route data from IoT clients to downstream Kafka clusters without modifying your message payload.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaactionheader.html
   */
  export interface KafkaActionHeaderProperty {
    /**
     * The key of the Kafka header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaactionheader.html#cfn-iot-topicrule-kafkaactionheader-key
     */
    readonly key: string;

    /**
     * The value of the Kafka header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kafkaactionheader.html#cfn-iot-topicrule-kafkaactionheader-value
     */
    readonly value: string;
  }

  /**
   * Starts execution of a Step Functions state machine.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-stepfunctionsaction.html
   */
  export interface StepFunctionsActionProperty {
    /**
     * (Optional) A name will be given to the state machine execution consisting of this prefix followed by a UUID.
     *
     * Step Functions automatically creates a unique name for each state machine execution if one is not provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-stepfunctionsaction.html#cfn-iot-topicrule-stepfunctionsaction-executionnameprefix
     */
    readonly executionNamePrefix?: string;

    /**
     * The ARN of the role that grants IoT permission to start execution of a state machine ("Action":"states:StartExecution").
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-stepfunctionsaction.html#cfn-iot-topicrule-stepfunctionsaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The name of the Step Functions state machine whose execution will be started.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-stepfunctionsaction.html#cfn-iot-topicrule-stepfunctionsaction-statemachinename
     */
    readonly stateMachineName: string;
  }

  /**
   * Describes an action to write to a DynamoDB table.
   *
   * The `tableName` , `hashKeyField` , and `rangeKeyField` values must match the values used when you created the table.
   *
   * The `hashKeyValue` and `rangeKeyvalue` fields use a substitution template syntax. These templates provide data at runtime. The syntax is as follows: ${ *sql-expression* }.
   *
   * You can specify any valid expression in a WHERE or SELECT clause, including JSON properties, comparisons, calculations, and functions. For example, the following field uses the third level of the topic:
   *
   * `"hashKeyValue": "${topic(3)}"`
   *
   * The following field uses the timestamp:
   *
   * `"rangeKeyValue": "${timestamp()}"`
   *
   * For more information, see [DynamoDBv2 Action](https://docs.aws.amazon.com/iot/latest/developerguide/iot-rule-actions.html) in the *AWS IoT Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html
   */
  export interface DynamoDBActionProperty {
    /**
     * The hash key name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-hashkeyfield
     */
    readonly hashKeyField: string;

    /**
     * The hash key type.
     *
     * Valid values are "STRING" or "NUMBER"
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-hashkeytype
     */
    readonly hashKeyType?: string;

    /**
     * The hash key value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-hashkeyvalue
     */
    readonly hashKeyValue: string;

    /**
     * The action payload.
     *
     * This name can be customized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-payloadfield
     */
    readonly payloadField?: string;

    /**
     * The range key name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-rangekeyfield
     */
    readonly rangeKeyField?: string;

    /**
     * The range key type.
     *
     * Valid values are "STRING" or "NUMBER"
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-rangekeytype
     */
    readonly rangeKeyType?: string;

    /**
     * The range key value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-rangekeyvalue
     */
    readonly rangeKeyValue?: string;

    /**
     * The ARN of the IAM role that grants access to the DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The name of the DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbaction.html#cfn-iot-topicrule-dynamodbaction-tablename
     */
    readonly tableName: string;
  }

  /**
   * Send data to an HTTPS endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpaction.html
   */
  export interface HttpActionProperty {
    /**
     * The authentication method to use when sending data to an HTTPS endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpaction.html#cfn-iot-topicrule-httpaction-auth
     */
    readonly auth?: CfnTopicRule.HttpAuthorizationProperty | cdk.IResolvable;

    /**
     * The URL to which AWS IoT sends a confirmation message.
     *
     * The value of the confirmation URL must be a prefix of the endpoint URL. If you do not specify a confirmation URL AWS IoT uses the endpoint URL as the confirmation URL. If you use substitution templates in the confirmationUrl, you must create and enable topic rule destinations that match each possible value of the substitution template before traffic is allowed to your endpoint URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpaction.html#cfn-iot-topicrule-httpaction-confirmationurl
     */
    readonly confirmationUrl?: string;

    /**
     * The HTTP headers to send with the message data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpaction.html#cfn-iot-topicrule-httpaction-headers
     */
    readonly headers?: Array<CfnTopicRule.HttpActionHeaderProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The endpoint URL.
     *
     * If substitution templates are used in the URL, you must also specify a `confirmationUrl` . If this is a new destination, a new `TopicRuleDestination` is created if possible.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpaction.html#cfn-iot-topicrule-httpaction-url
     */
    readonly url: string;
  }

  /**
   * The HTTP action header.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpactionheader.html
   */
  export interface HttpActionHeaderProperty {
    /**
     * The HTTP header key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpactionheader.html#cfn-iot-topicrule-httpactionheader-key
     */
    readonly key: string;

    /**
     * The HTTP header value.
     *
     * Substitution templates are supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpactionheader.html#cfn-iot-topicrule-httpactionheader-value
     */
    readonly value: string;
  }

  /**
   * The authorization method used to send messages.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpauthorization.html
   */
  export interface HttpAuthorizationProperty {
    /**
     * Use Sig V4 authorization.
     *
     * For more information, see [Signature Version 4 Signing Process](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-httpauthorization.html#cfn-iot-topicrule-httpauthorization-sigv4
     */
    readonly sigv4?: cdk.IResolvable | CfnTopicRule.SigV4AuthorizationProperty;
  }

  /**
   * For more information, see [Signature Version 4 signing process](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-sigv4authorization.html
   */
  export interface SigV4AuthorizationProperty {
    /**
     * The ARN of the signing role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-sigv4authorization.html#cfn-iot-topicrule-sigv4authorization-rolearn
     */
    readonly roleArn: string;

    /**
     * The service name to use while signing with Sig V4.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-sigv4authorization.html#cfn-iot-topicrule-sigv4authorization-servicename
     */
    readonly serviceName: string;

    /**
     * The signing region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-sigv4authorization.html#cfn-iot-topicrule-sigv4authorization-signingregion
     */
    readonly signingRegion: string;
  }

  /**
   * Describes an action that writes data to an Amazon OpenSearch Service domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-opensearchaction.html
   */
  export interface OpenSearchActionProperty {
    /**
     * The endpoint of your OpenSearch domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-opensearchaction.html#cfn-iot-topicrule-opensearchaction-endpoint
     */
    readonly endpoint: string;

    /**
     * The unique identifier for the document you are storing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-opensearchaction.html#cfn-iot-topicrule-opensearchaction-id
     */
    readonly id: string;

    /**
     * The OpenSearch index where you want to store your data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-opensearchaction.html#cfn-iot-topicrule-opensearchaction-index
     */
    readonly index: string;

    /**
     * The IAM role ARN that has access to OpenSearch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-opensearchaction.html#cfn-iot-topicrule-opensearchaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The type of document you are storing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-opensearchaction.html#cfn-iot-topicrule-opensearchaction-type
     */
    readonly type: string;
  }

  /**
   * Describes an action to write to a DynamoDB table.
   *
   * This DynamoDB action writes each attribute in the message payload into it's own column in the DynamoDB table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbv2action.html
   */
  export interface DynamoDBv2ActionProperty {
    /**
     * Specifies the DynamoDB table to which the message data will be written. For example:.
     *
     * `{ "dynamoDBv2": { "roleArn": "aws:iam:12341251:my-role" "putItem": { "tableName": "my-table" } } }`
     *
     * Each attribute in the message payload will be written to a separate column in the DynamoDB database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbv2action.html#cfn-iot-topicrule-dynamodbv2action-putitem
     */
    readonly putItem?: cdk.IResolvable | CfnTopicRule.PutItemInputProperty;

    /**
     * The ARN of the IAM role that grants access to the DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-dynamodbv2action.html#cfn-iot-topicrule-dynamodbv2action-rolearn
     */
    readonly roleArn?: string;
  }

  /**
   * The input for the DynamoActionVS action that specifies the DynamoDB table to which the message data will be written.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putiteminput.html
   */
  export interface PutItemInputProperty {
    /**
     * The table where the message data will be written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putiteminput.html#cfn-iot-topicrule-putiteminput-tablename
     */
    readonly tableName: string;
  }

  /**
   * Describes an action that captures a CloudWatch metric.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchmetricaction.html
   */
  export interface CloudwatchMetricActionProperty {
    /**
     * The CloudWatch metric name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchmetricaction.html#cfn-iot-topicrule-cloudwatchmetricaction-metricname
     */
    readonly metricName: string;

    /**
     * The CloudWatch metric namespace name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchmetricaction.html#cfn-iot-topicrule-cloudwatchmetricaction-metricnamespace
     */
    readonly metricNamespace: string;

    /**
     * An optional [Unix timestamp](https://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/cloudwatch_concepts.html#about_timestamp) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchmetricaction.html#cfn-iot-topicrule-cloudwatchmetricaction-metrictimestamp
     */
    readonly metricTimestamp?: string;

    /**
     * The [metric unit](https://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/cloudwatch_concepts.html#Unit) supported by CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchmetricaction.html#cfn-iot-topicrule-cloudwatchmetricaction-metricunit
     */
    readonly metricUnit: string;

    /**
     * The CloudWatch metric value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchmetricaction.html#cfn-iot-topicrule-cloudwatchmetricaction-metricvalue
     */
    readonly metricValue: string;

    /**
     * The IAM role that allows access to the CloudWatch metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchmetricaction.html#cfn-iot-topicrule-cloudwatchmetricaction-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Describes an action to send data from an MQTT message that triggered the rule to AWS IoT SiteWise asset properties.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-iotsitewiseaction.html
   */
  export interface IotSiteWiseActionProperty {
    /**
     * A list of asset property value entries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-iotsitewiseaction.html#cfn-iot-topicrule-iotsitewiseaction-putassetpropertyvalueentries
     */
    readonly putAssetPropertyValueEntries: Array<cdk.IResolvable | CfnTopicRule.PutAssetPropertyValueEntryProperty> | cdk.IResolvable;

    /**
     * The ARN of the role that grants AWS IoT permission to send an asset property value to AWS IoT SiteWise.
     *
     * ( `"Action": "iotsitewise:BatchPutAssetPropertyValue"` ). The trust policy can restrict access to specific asset hierarchy paths.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-iotsitewiseaction.html#cfn-iot-topicrule-iotsitewiseaction-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * An asset property value entry containing the following information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putassetpropertyvalueentry.html
   */
  export interface PutAssetPropertyValueEntryProperty {
    /**
     * The ID of the AWS IoT SiteWise asset.
     *
     * You must specify either a `propertyAlias` or both an `aliasId` and a `propertyId` . Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putassetpropertyvalueentry.html#cfn-iot-topicrule-putassetpropertyvalueentry-assetid
     */
    readonly assetId?: string;

    /**
     * Optional.
     *
     * A unique identifier for this entry that you can define to better track which message caused an error in case of failure. Accepts substitution templates. Defaults to a new UUID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putassetpropertyvalueentry.html#cfn-iot-topicrule-putassetpropertyvalueentry-entryid
     */
    readonly entryId?: string;

    /**
     * The name of the property alias associated with your asset property.
     *
     * You must specify either a `propertyAlias` or both an `aliasId` and a `propertyId` . Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putassetpropertyvalueentry.html#cfn-iot-topicrule-putassetpropertyvalueentry-propertyalias
     */
    readonly propertyAlias?: string;

    /**
     * The ID of the asset's property.
     *
     * You must specify either a `propertyAlias` or both an `aliasId` and a `propertyId` . Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putassetpropertyvalueentry.html#cfn-iot-topicrule-putassetpropertyvalueentry-propertyid
     */
    readonly propertyId?: string;

    /**
     * A list of property values to insert that each contain timestamp, quality, and value (TQV) information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putassetpropertyvalueentry.html#cfn-iot-topicrule-putassetpropertyvalueentry-propertyvalues
     */
    readonly propertyValues: Array<CfnTopicRule.AssetPropertyValueProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * An asset property value entry containing the following information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvalue.html
   */
  export interface AssetPropertyValueProperty {
    /**
     * Optional.
     *
     * A string that describes the quality of the value. Accepts substitution templates. Must be `GOOD` , `BAD` , or `UNCERTAIN` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvalue.html#cfn-iot-topicrule-assetpropertyvalue-quality
     */
    readonly quality?: string;

    /**
     * The asset property value timestamp.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvalue.html#cfn-iot-topicrule-assetpropertyvalue-timestamp
     */
    readonly timestamp: CfnTopicRule.AssetPropertyTimestampProperty | cdk.IResolvable;

    /**
     * The value of the asset property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvalue.html#cfn-iot-topicrule-assetpropertyvalue-value
     */
    readonly value: CfnTopicRule.AssetPropertyVariantProperty | cdk.IResolvable;
  }

  /**
   * Contains an asset property value (of a single type).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvariant.html
   */
  export interface AssetPropertyVariantProperty {
    /**
     * Optional.
     *
     * A string that contains the boolean value ( `true` or `false` ) of the value entry. Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvariant.html#cfn-iot-topicrule-assetpropertyvariant-booleanvalue
     */
    readonly booleanValue?: string;

    /**
     * Optional.
     *
     * A string that contains the double value of the value entry. Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvariant.html#cfn-iot-topicrule-assetpropertyvariant-doublevalue
     */
    readonly doubleValue?: string;

    /**
     * Optional.
     *
     * A string that contains the integer value of the value entry. Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvariant.html#cfn-iot-topicrule-assetpropertyvariant-integervalue
     */
    readonly integerValue?: string;

    /**
     * Optional.
     *
     * The string value of the value entry. Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertyvariant.html#cfn-iot-topicrule-assetpropertyvariant-stringvalue
     */
    readonly stringValue?: string;
  }

  /**
   * An asset property timestamp entry containing the following information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertytimestamp.html
   */
  export interface AssetPropertyTimestampProperty {
    /**
     * Optional.
     *
     * A string that contains the nanosecond time offset. Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertytimestamp.html#cfn-iot-topicrule-assetpropertytimestamp-offsetinnanos
     */
    readonly offsetInNanos?: string;

    /**
     * A string that contains the time in seconds since epoch.
     *
     * Accepts substitution templates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-assetpropertytimestamp.html#cfn-iot-topicrule-assetpropertytimestamp-timeinseconds
     */
    readonly timeInSeconds: string;
  }

  /**
   * Describes an action that writes data to an Amazon OpenSearch Service domain.
   *
   * > The `Elasticsearch` action can only be used by existing rule actions. To create a new rule action or to update an existing rule action, use the `OpenSearch` rule action instead. For more information, see [OpenSearchAction](https://docs.aws.amazon.com//iot/latest/apireference/API_OpenSearchAction.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-elasticsearchaction.html
   */
  export interface ElasticsearchActionProperty {
    /**
     * The endpoint of your OpenSearch domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-elasticsearchaction.html#cfn-iot-topicrule-elasticsearchaction-endpoint
     */
    readonly endpoint: string;

    /**
     * The unique identifier for the document you are storing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-elasticsearchaction.html#cfn-iot-topicrule-elasticsearchaction-id
     */
    readonly id: string;

    /**
     * The index where you want to store your data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-elasticsearchaction.html#cfn-iot-topicrule-elasticsearchaction-index
     */
    readonly index: string;

    /**
     * The IAM role ARN that has access to OpenSearch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-elasticsearchaction.html#cfn-iot-topicrule-elasticsearchaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The type of document you are storing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-elasticsearchaction.html#cfn-iot-topicrule-elasticsearchaction-type
     */
    readonly type: string;
  }

  /**
   * Describes an action to publish data to an Amazon SQS queue.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-sqsaction.html
   */
  export interface SqsActionProperty {
    /**
     * The URL of the Amazon SQS queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-sqsaction.html#cfn-iot-topicrule-sqsaction-queueurl
     */
    readonly queueUrl: string;

    /**
     * The ARN of the IAM role that grants access.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-sqsaction.html#cfn-iot-topicrule-sqsaction-rolearn
     */
    readonly roleArn: string;

    /**
     * Specifies whether to use Base64 encoding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-sqsaction.html#cfn-iot-topicrule-sqsaction-usebase64
     */
    readonly useBase64?: boolean | cdk.IResolvable;
  }

  /**
   * Describes an action to write data to an Amazon Kinesis stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kinesisaction.html
   */
  export interface KinesisActionProperty {
    /**
     * The partition key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kinesisaction.html#cfn-iot-topicrule-kinesisaction-partitionkey
     */
    readonly partitionKey?: string;

    /**
     * The ARN of the IAM role that grants access to the Amazon Kinesis stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kinesisaction.html#cfn-iot-topicrule-kinesisaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The name of the Amazon Kinesis stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kinesisaction.html#cfn-iot-topicrule-kinesisaction-streamname
     */
    readonly streamName: string;
  }

  /**
   * Describes an action that updates a CloudWatch log.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchlogsaction.html
   */
  export interface CloudwatchLogsActionProperty {
    /**
     * Indicates whether batches of log records will be extracted and uploaded into CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchlogsaction.html#cfn-iot-topicrule-cloudwatchlogsaction-batchmode
     */
    readonly batchMode?: boolean | cdk.IResolvable;

    /**
     * The CloudWatch log name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchlogsaction.html#cfn-iot-topicrule-cloudwatchlogsaction-loggroupname
     */
    readonly logGroupName: string;

    /**
     * The IAM role that allows access to the CloudWatch log.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-cloudwatchlogsaction.html#cfn-iot-topicrule-cloudwatchlogsaction-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Describes an action that writes records into an Amazon Timestream table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamaction.html
   */
  export interface TimestreamActionProperty {
    /**
     * The name of an Amazon Timestream database that has the table to write records into.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamaction.html#cfn-iot-topicrule-timestreamaction-databasename
     */
    readonly databaseName: string;

    /**
     * Metadata attributes of the time series that are written in each measure record.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamaction.html#cfn-iot-topicrule-timestreamaction-dimensions
     */
    readonly dimensions: Array<cdk.IResolvable | CfnTopicRule.TimestreamDimensionProperty> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the role that grants AWS IoT permission to write to the Timestream database table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamaction.html#cfn-iot-topicrule-timestreamaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The table where the message data will be written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamaction.html#cfn-iot-topicrule-timestreamaction-tablename
     */
    readonly tableName: string;

    /**
     * The value to use for the entry's timestamp.
     *
     * If blank, the time that the entry was processed is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamaction.html#cfn-iot-topicrule-timestreamaction-timestamp
     */
    readonly timestamp?: cdk.IResolvable | CfnTopicRule.TimestreamTimestampProperty;
  }

  /**
   * Metadata attributes of the time series that are written in each measure record.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamdimension.html
   */
  export interface TimestreamDimensionProperty {
    /**
     * The metadata dimension name.
     *
     * This is the name of the column in the Amazon Timestream database table record.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamdimension.html#cfn-iot-topicrule-timestreamdimension-name
     */
    readonly name: string;

    /**
     * The value to write in this column of the database record.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamdimension.html#cfn-iot-topicrule-timestreamdimension-value
     */
    readonly value: string;
  }

  /**
   * The value to use for the entry's timestamp.
   *
   * If blank, the time that the entry was processed is used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamtimestamp.html
   */
  export interface TimestreamTimestampProperty {
    /**
     * The precision of the timestamp value that results from the expression described in `value` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamtimestamp.html#cfn-iot-topicrule-timestreamtimestamp-unit
     */
    readonly unit: string;

    /**
     * An expression that returns a long epoch time value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestreamtimestamp.html#cfn-iot-topicrule-timestreamtimestamp-value
     */
    readonly value: string;
  }

  /**
   * Sends message data to an AWS IoT Analytics channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-iotanalyticsaction.html
   */
  export interface IotAnalyticsActionProperty {
    /**
     * Whether to process the action as a batch. The default value is `false` .
     *
     * When `batchMode` is `true` and the rule SQL statement evaluates to an Array, each Array element is delivered as a separate message when passed by [`BatchPutMessage`](https://docs.aws.amazon.com/iotanalytics/latest/APIReference/API_BatchPutMessage.html) The resulting array can't have more than 100 messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-iotanalyticsaction.html#cfn-iot-topicrule-iotanalyticsaction-batchmode
     */
    readonly batchMode?: boolean | cdk.IResolvable;

    /**
     * The name of the IoT Analytics channel to which message data will be sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-iotanalyticsaction.html#cfn-iot-topicrule-iotanalyticsaction-channelname
     */
    readonly channelName: string;

    /**
     * The ARN of the role which has a policy that grants IoT Analytics permission to send message data via IoT Analytics (iotanalytics:BatchPutMessage).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-iotanalyticsaction.html#cfn-iot-topicrule-iotanalyticsaction-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Describes an action to publish to an Amazon SNS topic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-snsaction.html
   */
  export interface SnsActionProperty {
    /**
     * (Optional) The message format of the message to publish.
     *
     * Accepted values are "JSON" and "RAW". The default value of the attribute is "RAW". SNS uses this setting to determine if the payload should be parsed and relevant platform-specific bits of the payload should be extracted. For more information, see [Amazon SNS Message and JSON Formats](https://docs.aws.amazon.com/sns/latest/dg/json-formats.html) in the *Amazon Simple Notification Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-snsaction.html#cfn-iot-topicrule-snsaction-messageformat
     */
    readonly messageFormat?: string;

    /**
     * The ARN of the IAM role that grants access.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-snsaction.html#cfn-iot-topicrule-snsaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The ARN of the SNS topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-snsaction.html#cfn-iot-topicrule-snsaction-targetarn
     */
    readonly targetArn: string;
  }

  /**
   * Describes an action to invoke a Lambda function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-lambdaaction.html
   */
  export interface LambdaActionProperty {
    /**
     * The ARN of the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-lambdaaction.html#cfn-iot-topicrule-lambdaaction-functionarn
     */
    readonly functionArn?: string;
  }

  /**
   * Describes an action to send device location updates from an MQTT message to an Amazon Location tracker resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-locationaction.html
   */
  export interface LocationActionProperty {
    /**
     * The unique ID of the device providing the location data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-locationaction.html#cfn-iot-topicrule-locationaction-deviceid
     */
    readonly deviceId: string;

    /**
     * A string that evaluates to a double value that represents the latitude of the device's location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-locationaction.html#cfn-iot-topicrule-locationaction-latitude
     */
    readonly latitude: string;

    /**
     * A string that evaluates to a double value that represents the longitude of the device's location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-locationaction.html#cfn-iot-topicrule-locationaction-longitude
     */
    readonly longitude: string;

    /**
     * The IAM role that grants permission to write to the Amazon Location resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-locationaction.html#cfn-iot-topicrule-locationaction-rolearn
     */
    readonly roleArn: string;

    /**
     * The time that the location data was sampled.
     *
     * The default value is the time the MQTT message was processed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-locationaction.html#cfn-iot-topicrule-locationaction-timestamp
     */
    readonly timestamp?: cdk.IResolvable | CfnTopicRule.TimestampProperty;

    /**
     * The name of the tracker resource in Amazon Location in which the location is updated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-locationaction.html#cfn-iot-topicrule-locationaction-trackername
     */
    readonly trackerName: string;
  }

  /**
   * Describes how to interpret an application-defined timestamp value from an MQTT message payload and the precision of that value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestamp.html
   */
  export interface TimestampProperty {
    /**
     * The precision of the timestamp value that results from the expression described in `value` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestamp.html#cfn-iot-topicrule-timestamp-unit
     */
    readonly unit?: string;

    /**
     * An expression that returns a long epoch time value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-timestamp.html#cfn-iot-topicrule-timestamp-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnTopicRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html
 */
export interface CfnTopicRuleProps {
  /**
   * The name of the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html#cfn-iot-topicrule-rulename
   */
  readonly ruleName?: string;

  /**
   * Metadata which can be used to manage the topic rule.
   *
   * > For URI Request parameters use format: ...key1=value1&key2=value2...
   * >
   * > For the CLI command-line parameter use format: --tags "key1=value1&key2=value2..."
   * >
   * > For the cli-input-json file use format: "tags": "key1=value1&key2=value2..."
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html#cfn-iot-topicrule-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The rule payload.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html#cfn-iot-topicrule-topicrulepayload
   */
  readonly topicRulePayload: cdk.IResolvable | CfnTopicRule.TopicRulePayloadProperty;
}

/**
 * Determine whether the given properties match those of a `S3ActionProperty`
 *
 * @param properties - the TypeScript properties of a `S3ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleS3ActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("cannedAcl", cdk.validateString)(properties.cannedAcl));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"S3ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleS3ActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleS3ActionPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "CannedAcl": cdk.stringToCloudFormation(properties.cannedAcl),
    "Key": cdk.stringToCloudFormation(properties.key),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleS3ActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.S3ActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.S3ActionProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("cannedAcl", "CannedAcl", (properties.CannedAcl != null ? cfn_parse.FromCloudFormation.getString(properties.CannedAcl) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudwatchAlarmActionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudwatchAlarmActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleCloudwatchAlarmActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarmName", cdk.requiredValidator)(properties.alarmName));
  errors.collect(cdk.propertyValidator("alarmName", cdk.validateString)(properties.alarmName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("stateReason", cdk.requiredValidator)(properties.stateReason));
  errors.collect(cdk.propertyValidator("stateReason", cdk.validateString)(properties.stateReason));
  errors.collect(cdk.propertyValidator("stateValue", cdk.requiredValidator)(properties.stateValue));
  errors.collect(cdk.propertyValidator("stateValue", cdk.validateString)(properties.stateValue));
  return errors.wrap("supplied properties not correct for \"CloudwatchAlarmActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleCloudwatchAlarmActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleCloudwatchAlarmActionPropertyValidator(properties).assertSuccess();
  return {
    "AlarmName": cdk.stringToCloudFormation(properties.alarmName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "StateReason": cdk.stringToCloudFormation(properties.stateReason),
    "StateValue": cdk.stringToCloudFormation(properties.stateValue)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleCloudwatchAlarmActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.CloudwatchAlarmActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.CloudwatchAlarmActionProperty>();
  ret.addPropertyResult("alarmName", "AlarmName", (properties.AlarmName != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("stateReason", "StateReason", (properties.StateReason != null ? cfn_parse.FromCloudFormation.getString(properties.StateReason) : undefined));
  ret.addPropertyResult("stateValue", "StateValue", (properties.StateValue != null ? cfn_parse.FromCloudFormation.getString(properties.StateValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotEventsActionProperty`
 *
 * @param properties - the TypeScript properties of a `IotEventsActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleIotEventsActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchMode", cdk.validateBoolean)(properties.batchMode));
  errors.collect(cdk.propertyValidator("inputName", cdk.requiredValidator)(properties.inputName));
  errors.collect(cdk.propertyValidator("inputName", cdk.validateString)(properties.inputName));
  errors.collect(cdk.propertyValidator("messageId", cdk.validateString)(properties.messageId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"IotEventsActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleIotEventsActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleIotEventsActionPropertyValidator(properties).assertSuccess();
  return {
    "BatchMode": cdk.booleanToCloudFormation(properties.batchMode),
    "InputName": cdk.stringToCloudFormation(properties.inputName),
    "MessageId": cdk.stringToCloudFormation(properties.messageId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleIotEventsActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.IotEventsActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.IotEventsActionProperty>();
  ret.addPropertyResult("batchMode", "BatchMode", (properties.BatchMode != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BatchMode) : undefined));
  ret.addPropertyResult("inputName", "InputName", (properties.InputName != null ? cfn_parse.FromCloudFormation.getString(properties.InputName) : undefined));
  ret.addPropertyResult("messageId", "MessageId", (properties.MessageId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirehoseActionProperty`
 *
 * @param properties - the TypeScript properties of a `FirehoseActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleFirehoseActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchMode", cdk.validateBoolean)(properties.batchMode));
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.requiredValidator)(properties.deliveryStreamName));
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.validateString)(properties.deliveryStreamName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("separator", cdk.validateString)(properties.separator));
  return errors.wrap("supplied properties not correct for \"FirehoseActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleFirehoseActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleFirehoseActionPropertyValidator(properties).assertSuccess();
  return {
    "BatchMode": cdk.booleanToCloudFormation(properties.batchMode),
    "DeliveryStreamName": cdk.stringToCloudFormation(properties.deliveryStreamName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Separator": cdk.stringToCloudFormation(properties.separator)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleFirehoseActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.FirehoseActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.FirehoseActionProperty>();
  ret.addPropertyResult("batchMode", "BatchMode", (properties.BatchMode != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BatchMode) : undefined));
  ret.addPropertyResult("deliveryStreamName", "DeliveryStreamName", (properties.DeliveryStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("separator", "Separator", (properties.Separator != null ? cfn_parse.FromCloudFormation.getString(properties.Separator) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `UserPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleUserPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"UserPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleUserPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleUserPropertyPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleUserPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.UserPropertyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.UserPropertyProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RepublishActionHeadersProperty`
 *
 * @param properties - the TypeScript properties of a `RepublishActionHeadersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleRepublishActionHeadersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator("correlationData", cdk.validateString)(properties.correlationData));
  errors.collect(cdk.propertyValidator("messageExpiry", cdk.validateString)(properties.messageExpiry));
  errors.collect(cdk.propertyValidator("payloadFormatIndicator", cdk.validateString)(properties.payloadFormatIndicator));
  errors.collect(cdk.propertyValidator("responseTopic", cdk.validateString)(properties.responseTopic));
  errors.collect(cdk.propertyValidator("userProperties", cdk.listValidator(CfnTopicRuleUserPropertyPropertyValidator))(properties.userProperties));
  return errors.wrap("supplied properties not correct for \"RepublishActionHeadersProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleRepublishActionHeadersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleRepublishActionHeadersPropertyValidator(properties).assertSuccess();
  return {
    "ContentType": cdk.stringToCloudFormation(properties.contentType),
    "CorrelationData": cdk.stringToCloudFormation(properties.correlationData),
    "MessageExpiry": cdk.stringToCloudFormation(properties.messageExpiry),
    "PayloadFormatIndicator": cdk.stringToCloudFormation(properties.payloadFormatIndicator),
    "ResponseTopic": cdk.stringToCloudFormation(properties.responseTopic),
    "UserProperties": cdk.listMapper(convertCfnTopicRuleUserPropertyPropertyToCloudFormation)(properties.userProperties)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleRepublishActionHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.RepublishActionHeadersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.RepublishActionHeadersProperty>();
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addPropertyResult("correlationData", "CorrelationData", (properties.CorrelationData != null ? cfn_parse.FromCloudFormation.getString(properties.CorrelationData) : undefined));
  ret.addPropertyResult("messageExpiry", "MessageExpiry", (properties.MessageExpiry != null ? cfn_parse.FromCloudFormation.getString(properties.MessageExpiry) : undefined));
  ret.addPropertyResult("payloadFormatIndicator", "PayloadFormatIndicator", (properties.PayloadFormatIndicator != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadFormatIndicator) : undefined));
  ret.addPropertyResult("responseTopic", "ResponseTopic", (properties.ResponseTopic != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseTopic) : undefined));
  ret.addPropertyResult("userProperties", "UserProperties", (properties.UserProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicRuleUserPropertyPropertyFromCloudFormation)(properties.UserProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RepublishActionProperty`
 *
 * @param properties - the TypeScript properties of a `RepublishActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleRepublishActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headers", CfnTopicRuleRepublishActionHeadersPropertyValidator)(properties.headers));
  errors.collect(cdk.propertyValidator("qos", cdk.validateNumber)(properties.qos));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("topic", cdk.requiredValidator)(properties.topic));
  errors.collect(cdk.propertyValidator("topic", cdk.validateString)(properties.topic));
  return errors.wrap("supplied properties not correct for \"RepublishActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleRepublishActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleRepublishActionPropertyValidator(properties).assertSuccess();
  return {
    "Headers": convertCfnTopicRuleRepublishActionHeadersPropertyToCloudFormation(properties.headers),
    "Qos": cdk.numberToCloudFormation(properties.qos),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Topic": cdk.stringToCloudFormation(properties.topic)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleRepublishActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.RepublishActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.RepublishActionProperty>();
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? CfnTopicRuleRepublishActionHeadersPropertyFromCloudFormation(properties.Headers) : undefined));
  ret.addPropertyResult("qos", "Qos", (properties.Qos != null ? cfn_parse.FromCloudFormation.getNumber(properties.Qos) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("topic", "Topic", (properties.Topic != null ? cfn_parse.FromCloudFormation.getString(properties.Topic) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KafkaActionHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaActionHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleKafkaActionHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"KafkaActionHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleKafkaActionHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleKafkaActionHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleKafkaActionHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.KafkaActionHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.KafkaActionHeaderProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KafkaActionProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleKafkaActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientProperties", cdk.requiredValidator)(properties.clientProperties));
  errors.collect(cdk.propertyValidator("clientProperties", cdk.hashValidator(cdk.validateString))(properties.clientProperties));
  errors.collect(cdk.propertyValidator("destinationArn", cdk.requiredValidator)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("headers", cdk.listValidator(CfnTopicRuleKafkaActionHeaderPropertyValidator))(properties.headers));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("partition", cdk.validateString)(properties.partition));
  errors.collect(cdk.propertyValidator("topic", cdk.requiredValidator)(properties.topic));
  errors.collect(cdk.propertyValidator("topic", cdk.validateString)(properties.topic));
  return errors.wrap("supplied properties not correct for \"KafkaActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleKafkaActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleKafkaActionPropertyValidator(properties).assertSuccess();
  return {
    "ClientProperties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.clientProperties),
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Headers": cdk.listMapper(convertCfnTopicRuleKafkaActionHeaderPropertyToCloudFormation)(properties.headers),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Partition": cdk.stringToCloudFormation(properties.partition),
    "Topic": cdk.stringToCloudFormation(properties.topic)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleKafkaActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.KafkaActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.KafkaActionProperty>();
  ret.addPropertyResult("clientProperties", "ClientProperties", (properties.ClientProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ClientProperties) : undefined));
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicRuleKafkaActionHeaderPropertyFromCloudFormation)(properties.Headers) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("partition", "Partition", (properties.Partition != null ? cfn_parse.FromCloudFormation.getString(properties.Partition) : undefined));
  ret.addPropertyResult("topic", "Topic", (properties.Topic != null ? cfn_parse.FromCloudFormation.getString(properties.Topic) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StepFunctionsActionProperty`
 *
 * @param properties - the TypeScript properties of a `StepFunctionsActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleStepFunctionsActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executionNamePrefix", cdk.validateString)(properties.executionNamePrefix));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("stateMachineName", cdk.requiredValidator)(properties.stateMachineName));
  errors.collect(cdk.propertyValidator("stateMachineName", cdk.validateString)(properties.stateMachineName));
  return errors.wrap("supplied properties not correct for \"StepFunctionsActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleStepFunctionsActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleStepFunctionsActionPropertyValidator(properties).assertSuccess();
  return {
    "ExecutionNamePrefix": cdk.stringToCloudFormation(properties.executionNamePrefix),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "StateMachineName": cdk.stringToCloudFormation(properties.stateMachineName)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleStepFunctionsActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.StepFunctionsActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.StepFunctionsActionProperty>();
  ret.addPropertyResult("executionNamePrefix", "ExecutionNamePrefix", (properties.ExecutionNamePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionNamePrefix) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("stateMachineName", "StateMachineName", (properties.StateMachineName != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBActionProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleDynamoDBActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hashKeyField", cdk.requiredValidator)(properties.hashKeyField));
  errors.collect(cdk.propertyValidator("hashKeyField", cdk.validateString)(properties.hashKeyField));
  errors.collect(cdk.propertyValidator("hashKeyType", cdk.validateString)(properties.hashKeyType));
  errors.collect(cdk.propertyValidator("hashKeyValue", cdk.requiredValidator)(properties.hashKeyValue));
  errors.collect(cdk.propertyValidator("hashKeyValue", cdk.validateString)(properties.hashKeyValue));
  errors.collect(cdk.propertyValidator("payloadField", cdk.validateString)(properties.payloadField));
  errors.collect(cdk.propertyValidator("rangeKeyField", cdk.validateString)(properties.rangeKeyField));
  errors.collect(cdk.propertyValidator("rangeKeyType", cdk.validateString)(properties.rangeKeyType));
  errors.collect(cdk.propertyValidator("rangeKeyValue", cdk.validateString)(properties.rangeKeyValue));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"DynamoDBActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleDynamoDBActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleDynamoDBActionPropertyValidator(properties).assertSuccess();
  return {
    "HashKeyField": cdk.stringToCloudFormation(properties.hashKeyField),
    "HashKeyType": cdk.stringToCloudFormation(properties.hashKeyType),
    "HashKeyValue": cdk.stringToCloudFormation(properties.hashKeyValue),
    "PayloadField": cdk.stringToCloudFormation(properties.payloadField),
    "RangeKeyField": cdk.stringToCloudFormation(properties.rangeKeyField),
    "RangeKeyType": cdk.stringToCloudFormation(properties.rangeKeyType),
    "RangeKeyValue": cdk.stringToCloudFormation(properties.rangeKeyValue),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleDynamoDBActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.DynamoDBActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.DynamoDBActionProperty>();
  ret.addPropertyResult("hashKeyField", "HashKeyField", (properties.HashKeyField != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyField) : undefined));
  ret.addPropertyResult("hashKeyType", "HashKeyType", (properties.HashKeyType != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyType) : undefined));
  ret.addPropertyResult("hashKeyValue", "HashKeyValue", (properties.HashKeyValue != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyValue) : undefined));
  ret.addPropertyResult("payloadField", "PayloadField", (properties.PayloadField != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadField) : undefined));
  ret.addPropertyResult("rangeKeyField", "RangeKeyField", (properties.RangeKeyField != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyField) : undefined));
  ret.addPropertyResult("rangeKeyType", "RangeKeyType", (properties.RangeKeyType != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyType) : undefined));
  ret.addPropertyResult("rangeKeyValue", "RangeKeyValue", (properties.RangeKeyValue != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyValue) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpActionHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `HttpActionHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleHttpActionHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"HttpActionHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleHttpActionHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleHttpActionHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleHttpActionHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.HttpActionHeaderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.HttpActionHeaderProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SigV4AuthorizationProperty`
 *
 * @param properties - the TypeScript properties of a `SigV4AuthorizationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleSigV4AuthorizationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("serviceName", cdk.requiredValidator)(properties.serviceName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  errors.collect(cdk.propertyValidator("signingRegion", cdk.requiredValidator)(properties.signingRegion));
  errors.collect(cdk.propertyValidator("signingRegion", cdk.validateString)(properties.signingRegion));
  return errors.wrap("supplied properties not correct for \"SigV4AuthorizationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleSigV4AuthorizationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleSigV4AuthorizationPropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName),
    "SigningRegion": cdk.stringToCloudFormation(properties.signingRegion)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleSigV4AuthorizationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.SigV4AuthorizationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.SigV4AuthorizationProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addPropertyResult("signingRegion", "SigningRegion", (properties.SigningRegion != null ? cfn_parse.FromCloudFormation.getString(properties.SigningRegion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpAuthorizationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpAuthorizationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleHttpAuthorizationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sigv4", CfnTopicRuleSigV4AuthorizationPropertyValidator)(properties.sigv4));
  return errors.wrap("supplied properties not correct for \"HttpAuthorizationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleHttpAuthorizationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleHttpAuthorizationPropertyValidator(properties).assertSuccess();
  return {
    "Sigv4": convertCfnTopicRuleSigV4AuthorizationPropertyToCloudFormation(properties.sigv4)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleHttpAuthorizationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.HttpAuthorizationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.HttpAuthorizationProperty>();
  ret.addPropertyResult("sigv4", "Sigv4", (properties.Sigv4 != null ? CfnTopicRuleSigV4AuthorizationPropertyFromCloudFormation(properties.Sigv4) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpActionProperty`
 *
 * @param properties - the TypeScript properties of a `HttpActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleHttpActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("auth", CfnTopicRuleHttpAuthorizationPropertyValidator)(properties.auth));
  errors.collect(cdk.propertyValidator("confirmationUrl", cdk.validateString)(properties.confirmationUrl));
  errors.collect(cdk.propertyValidator("headers", cdk.listValidator(CfnTopicRuleHttpActionHeaderPropertyValidator))(properties.headers));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"HttpActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleHttpActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleHttpActionPropertyValidator(properties).assertSuccess();
  return {
    "Auth": convertCfnTopicRuleHttpAuthorizationPropertyToCloudFormation(properties.auth),
    "ConfirmationUrl": cdk.stringToCloudFormation(properties.confirmationUrl),
    "Headers": cdk.listMapper(convertCfnTopicRuleHttpActionHeaderPropertyToCloudFormation)(properties.headers),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleHttpActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.HttpActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.HttpActionProperty>();
  ret.addPropertyResult("auth", "Auth", (properties.Auth != null ? CfnTopicRuleHttpAuthorizationPropertyFromCloudFormation(properties.Auth) : undefined));
  ret.addPropertyResult("confirmationUrl", "ConfirmationUrl", (properties.ConfirmationUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ConfirmationUrl) : undefined));
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicRuleHttpActionHeaderPropertyFromCloudFormation)(properties.Headers) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OpenSearchActionProperty`
 *
 * @param properties - the TypeScript properties of a `OpenSearchActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleOpenSearchActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpoint", cdk.requiredValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("index", cdk.requiredValidator)(properties.index));
  errors.collect(cdk.propertyValidator("index", cdk.validateString)(properties.index));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"OpenSearchActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleOpenSearchActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleOpenSearchActionPropertyValidator(properties).assertSuccess();
  return {
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Index": cdk.stringToCloudFormation(properties.index),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleOpenSearchActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.OpenSearchActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.OpenSearchActionProperty>();
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("index", "Index", (properties.Index != null ? cfn_parse.FromCloudFormation.getString(properties.Index) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PutItemInputProperty`
 *
 * @param properties - the TypeScript properties of a `PutItemInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRulePutItemInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"PutItemInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRulePutItemInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRulePutItemInputPropertyValidator(properties).assertSuccess();
  return {
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnTopicRulePutItemInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.PutItemInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.PutItemInputProperty>();
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBv2ActionProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBv2ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleDynamoDBv2ActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("putItem", CfnTopicRulePutItemInputPropertyValidator)(properties.putItem));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"DynamoDBv2ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleDynamoDBv2ActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleDynamoDBv2ActionPropertyValidator(properties).assertSuccess();
  return {
    "PutItem": convertCfnTopicRulePutItemInputPropertyToCloudFormation(properties.putItem),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleDynamoDBv2ActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.DynamoDBv2ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.DynamoDBv2ActionProperty>();
  ret.addPropertyResult("putItem", "PutItem", (properties.PutItem != null ? CfnTopicRulePutItemInputPropertyFromCloudFormation(properties.PutItem) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudwatchMetricActionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudwatchMetricActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleCloudwatchMetricActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricNamespace", cdk.requiredValidator)(properties.metricNamespace));
  errors.collect(cdk.propertyValidator("metricNamespace", cdk.validateString)(properties.metricNamespace));
  errors.collect(cdk.propertyValidator("metricTimestamp", cdk.validateString)(properties.metricTimestamp));
  errors.collect(cdk.propertyValidator("metricUnit", cdk.requiredValidator)(properties.metricUnit));
  errors.collect(cdk.propertyValidator("metricUnit", cdk.validateString)(properties.metricUnit));
  errors.collect(cdk.propertyValidator("metricValue", cdk.requiredValidator)(properties.metricValue));
  errors.collect(cdk.propertyValidator("metricValue", cdk.validateString)(properties.metricValue));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CloudwatchMetricActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleCloudwatchMetricActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleCloudwatchMetricActionPropertyValidator(properties).assertSuccess();
  return {
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "MetricNamespace": cdk.stringToCloudFormation(properties.metricNamespace),
    "MetricTimestamp": cdk.stringToCloudFormation(properties.metricTimestamp),
    "MetricUnit": cdk.stringToCloudFormation(properties.metricUnit),
    "MetricValue": cdk.stringToCloudFormation(properties.metricValue),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleCloudwatchMetricActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.CloudwatchMetricActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.CloudwatchMetricActionProperty>();
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("metricNamespace", "MetricNamespace", (properties.MetricNamespace != null ? cfn_parse.FromCloudFormation.getString(properties.MetricNamespace) : undefined));
  ret.addPropertyResult("metricTimestamp", "MetricTimestamp", (properties.MetricTimestamp != null ? cfn_parse.FromCloudFormation.getString(properties.MetricTimestamp) : undefined));
  ret.addPropertyResult("metricUnit", "MetricUnit", (properties.MetricUnit != null ? cfn_parse.FromCloudFormation.getString(properties.MetricUnit) : undefined));
  ret.addPropertyResult("metricValue", "MetricValue", (properties.MetricValue != null ? cfn_parse.FromCloudFormation.getString(properties.MetricValue) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyVariantProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyVariantProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleAssetPropertyVariantPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("booleanValue", cdk.validateString)(properties.booleanValue));
  errors.collect(cdk.propertyValidator("doubleValue", cdk.validateString)(properties.doubleValue));
  errors.collect(cdk.propertyValidator("integerValue", cdk.validateString)(properties.integerValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  return errors.wrap("supplied properties not correct for \"AssetPropertyVariantProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleAssetPropertyVariantPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleAssetPropertyVariantPropertyValidator(properties).assertSuccess();
  return {
    "BooleanValue": cdk.stringToCloudFormation(properties.booleanValue),
    "DoubleValue": cdk.stringToCloudFormation(properties.doubleValue),
    "IntegerValue": cdk.stringToCloudFormation(properties.integerValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleAssetPropertyVariantPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.AssetPropertyVariantProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.AssetPropertyVariantProperty>();
  ret.addPropertyResult("booleanValue", "BooleanValue", (properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getString(properties.BooleanValue) : undefined));
  ret.addPropertyResult("doubleValue", "DoubleValue", (properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getString(properties.DoubleValue) : undefined));
  ret.addPropertyResult("integerValue", "IntegerValue", (properties.IntegerValue != null ? cfn_parse.FromCloudFormation.getString(properties.IntegerValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyTimestampProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyTimestampProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleAssetPropertyTimestampPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("offsetInNanos", cdk.validateString)(properties.offsetInNanos));
  errors.collect(cdk.propertyValidator("timeInSeconds", cdk.requiredValidator)(properties.timeInSeconds));
  errors.collect(cdk.propertyValidator("timeInSeconds", cdk.validateString)(properties.timeInSeconds));
  return errors.wrap("supplied properties not correct for \"AssetPropertyTimestampProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleAssetPropertyTimestampPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleAssetPropertyTimestampPropertyValidator(properties).assertSuccess();
  return {
    "OffsetInNanos": cdk.stringToCloudFormation(properties.offsetInNanos),
    "TimeInSeconds": cdk.stringToCloudFormation(properties.timeInSeconds)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleAssetPropertyTimestampPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.AssetPropertyTimestampProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.AssetPropertyTimestampProperty>();
  ret.addPropertyResult("offsetInNanos", "OffsetInNanos", (properties.OffsetInNanos != null ? cfn_parse.FromCloudFormation.getString(properties.OffsetInNanos) : undefined));
  ret.addPropertyResult("timeInSeconds", "TimeInSeconds", (properties.TimeInSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.TimeInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyValueProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleAssetPropertyValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("quality", cdk.validateString)(properties.quality));
  errors.collect(cdk.propertyValidator("timestamp", cdk.requiredValidator)(properties.timestamp));
  errors.collect(cdk.propertyValidator("timestamp", CfnTopicRuleAssetPropertyTimestampPropertyValidator)(properties.timestamp));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnTopicRuleAssetPropertyVariantPropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"AssetPropertyValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleAssetPropertyValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleAssetPropertyValuePropertyValidator(properties).assertSuccess();
  return {
    "Quality": cdk.stringToCloudFormation(properties.quality),
    "Timestamp": convertCfnTopicRuleAssetPropertyTimestampPropertyToCloudFormation(properties.timestamp),
    "Value": convertCfnTopicRuleAssetPropertyVariantPropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleAssetPropertyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.AssetPropertyValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.AssetPropertyValueProperty>();
  ret.addPropertyResult("quality", "Quality", (properties.Quality != null ? cfn_parse.FromCloudFormation.getString(properties.Quality) : undefined));
  ret.addPropertyResult("timestamp", "Timestamp", (properties.Timestamp != null ? CfnTopicRuleAssetPropertyTimestampPropertyFromCloudFormation(properties.Timestamp) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnTopicRuleAssetPropertyVariantPropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PutAssetPropertyValueEntryProperty`
 *
 * @param properties - the TypeScript properties of a `PutAssetPropertyValueEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRulePutAssetPropertyValueEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assetId", cdk.validateString)(properties.assetId));
  errors.collect(cdk.propertyValidator("entryId", cdk.validateString)(properties.entryId));
  errors.collect(cdk.propertyValidator("propertyAlias", cdk.validateString)(properties.propertyAlias));
  errors.collect(cdk.propertyValidator("propertyId", cdk.validateString)(properties.propertyId));
  errors.collect(cdk.propertyValidator("propertyValues", cdk.requiredValidator)(properties.propertyValues));
  errors.collect(cdk.propertyValidator("propertyValues", cdk.listValidator(CfnTopicRuleAssetPropertyValuePropertyValidator))(properties.propertyValues));
  return errors.wrap("supplied properties not correct for \"PutAssetPropertyValueEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRulePutAssetPropertyValueEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRulePutAssetPropertyValueEntryPropertyValidator(properties).assertSuccess();
  return {
    "AssetId": cdk.stringToCloudFormation(properties.assetId),
    "EntryId": cdk.stringToCloudFormation(properties.entryId),
    "PropertyAlias": cdk.stringToCloudFormation(properties.propertyAlias),
    "PropertyId": cdk.stringToCloudFormation(properties.propertyId),
    "PropertyValues": cdk.listMapper(convertCfnTopicRuleAssetPropertyValuePropertyToCloudFormation)(properties.propertyValues)
  };
}

// @ts-ignore TS6133
function CfnTopicRulePutAssetPropertyValueEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.PutAssetPropertyValueEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.PutAssetPropertyValueEntryProperty>();
  ret.addPropertyResult("assetId", "AssetId", (properties.AssetId != null ? cfn_parse.FromCloudFormation.getString(properties.AssetId) : undefined));
  ret.addPropertyResult("entryId", "EntryId", (properties.EntryId != null ? cfn_parse.FromCloudFormation.getString(properties.EntryId) : undefined));
  ret.addPropertyResult("propertyAlias", "PropertyAlias", (properties.PropertyAlias != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyAlias) : undefined));
  ret.addPropertyResult("propertyId", "PropertyId", (properties.PropertyId != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyId) : undefined));
  ret.addPropertyResult("propertyValues", "PropertyValues", (properties.PropertyValues != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicRuleAssetPropertyValuePropertyFromCloudFormation)(properties.PropertyValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotSiteWiseActionProperty`
 *
 * @param properties - the TypeScript properties of a `IotSiteWiseActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleIotSiteWiseActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("putAssetPropertyValueEntries", cdk.requiredValidator)(properties.putAssetPropertyValueEntries));
  errors.collect(cdk.propertyValidator("putAssetPropertyValueEntries", cdk.listValidator(CfnTopicRulePutAssetPropertyValueEntryPropertyValidator))(properties.putAssetPropertyValueEntries));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"IotSiteWiseActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleIotSiteWiseActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleIotSiteWiseActionPropertyValidator(properties).assertSuccess();
  return {
    "PutAssetPropertyValueEntries": cdk.listMapper(convertCfnTopicRulePutAssetPropertyValueEntryPropertyToCloudFormation)(properties.putAssetPropertyValueEntries),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleIotSiteWiseActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.IotSiteWiseActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.IotSiteWiseActionProperty>();
  ret.addPropertyResult("putAssetPropertyValueEntries", "PutAssetPropertyValueEntries", (properties.PutAssetPropertyValueEntries != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicRulePutAssetPropertyValueEntryPropertyFromCloudFormation)(properties.PutAssetPropertyValueEntries) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ElasticsearchActionProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleElasticsearchActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpoint", cdk.requiredValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("index", cdk.requiredValidator)(properties.index));
  errors.collect(cdk.propertyValidator("index", cdk.validateString)(properties.index));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ElasticsearchActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleElasticsearchActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleElasticsearchActionPropertyValidator(properties).assertSuccess();
  return {
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Index": cdk.stringToCloudFormation(properties.index),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleElasticsearchActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.ElasticsearchActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.ElasticsearchActionProperty>();
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("index", "Index", (properties.Index != null ? cfn_parse.FromCloudFormation.getString(properties.Index) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SqsActionProperty`
 *
 * @param properties - the TypeScript properties of a `SqsActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleSqsActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queueUrl", cdk.requiredValidator)(properties.queueUrl));
  errors.collect(cdk.propertyValidator("queueUrl", cdk.validateString)(properties.queueUrl));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("useBase64", cdk.validateBoolean)(properties.useBase64));
  return errors.wrap("supplied properties not correct for \"SqsActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleSqsActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleSqsActionPropertyValidator(properties).assertSuccess();
  return {
    "QueueUrl": cdk.stringToCloudFormation(properties.queueUrl),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "UseBase64": cdk.booleanToCloudFormation(properties.useBase64)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleSqsActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.SqsActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.SqsActionProperty>();
  ret.addPropertyResult("queueUrl", "QueueUrl", (properties.QueueUrl != null ? cfn_parse.FromCloudFormation.getString(properties.QueueUrl) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("useBase64", "UseBase64", (properties.UseBase64 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseBase64) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisActionProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleKinesisActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("partitionKey", cdk.validateString)(properties.partitionKey));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("streamName", cdk.requiredValidator)(properties.streamName));
  errors.collect(cdk.propertyValidator("streamName", cdk.validateString)(properties.streamName));
  return errors.wrap("supplied properties not correct for \"KinesisActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleKinesisActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleKinesisActionPropertyValidator(properties).assertSuccess();
  return {
    "PartitionKey": cdk.stringToCloudFormation(properties.partitionKey),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "StreamName": cdk.stringToCloudFormation(properties.streamName)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleKinesisActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.KinesisActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.KinesisActionProperty>();
  ret.addPropertyResult("partitionKey", "PartitionKey", (properties.PartitionKey != null ? cfn_parse.FromCloudFormation.getString(properties.PartitionKey) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("streamName", "StreamName", (properties.StreamName != null ? cfn_parse.FromCloudFormation.getString(properties.StreamName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudwatchLogsActionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudwatchLogsActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleCloudwatchLogsActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchMode", cdk.validateBoolean)(properties.batchMode));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.requiredValidator)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CloudwatchLogsActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleCloudwatchLogsActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleCloudwatchLogsActionPropertyValidator(properties).assertSuccess();
  return {
    "BatchMode": cdk.booleanToCloudFormation(properties.batchMode),
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleCloudwatchLogsActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.CloudwatchLogsActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.CloudwatchLogsActionProperty>();
  ret.addPropertyResult("batchMode", "BatchMode", (properties.BatchMode != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BatchMode) : undefined));
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimestreamDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `TimestreamDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleTimestreamDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TimestreamDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleTimestreamDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleTimestreamDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleTimestreamDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.TimestreamDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.TimestreamDimensionProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimestreamTimestampProperty`
 *
 * @param properties - the TypeScript properties of a `TimestreamTimestampProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleTimestreamTimestampPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unit", cdk.requiredValidator)(properties.unit));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TimestreamTimestampProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleTimestreamTimestampPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleTimestreamTimestampPropertyValidator(properties).assertSuccess();
  return {
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleTimestreamTimestampPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.TimestreamTimestampProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.TimestreamTimestampProperty>();
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimestreamActionProperty`
 *
 * @param properties - the TypeScript properties of a `TimestreamActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleTimestreamActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("dimensions", cdk.requiredValidator)(properties.dimensions));
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnTopicRuleTimestreamDimensionPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("timestamp", CfnTopicRuleTimestreamTimestampPropertyValidator)(properties.timestamp));
  return errors.wrap("supplied properties not correct for \"TimestreamActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleTimestreamActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleTimestreamActionPropertyValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Dimensions": cdk.listMapper(convertCfnTopicRuleTimestreamDimensionPropertyToCloudFormation)(properties.dimensions),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "Timestamp": convertCfnTopicRuleTimestreamTimestampPropertyToCloudFormation(properties.timestamp)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleTimestreamActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.TimestreamActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.TimestreamActionProperty>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicRuleTimestreamDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("timestamp", "Timestamp", (properties.Timestamp != null ? CfnTopicRuleTimestreamTimestampPropertyFromCloudFormation(properties.Timestamp) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotAnalyticsActionProperty`
 *
 * @param properties - the TypeScript properties of a `IotAnalyticsActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleIotAnalyticsActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchMode", cdk.validateBoolean)(properties.batchMode));
  errors.collect(cdk.propertyValidator("channelName", cdk.requiredValidator)(properties.channelName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"IotAnalyticsActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleIotAnalyticsActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleIotAnalyticsActionPropertyValidator(properties).assertSuccess();
  return {
    "BatchMode": cdk.booleanToCloudFormation(properties.batchMode),
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleIotAnalyticsActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.IotAnalyticsActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.IotAnalyticsActionProperty>();
  ret.addPropertyResult("batchMode", "BatchMode", (properties.BatchMode != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BatchMode) : undefined));
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SnsActionProperty`
 *
 * @param properties - the TypeScript properties of a `SnsActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleSnsActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("messageFormat", cdk.validateString)(properties.messageFormat));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"SnsActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleSnsActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleSnsActionPropertyValidator(properties).assertSuccess();
  return {
    "MessageFormat": cdk.stringToCloudFormation(properties.messageFormat),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleSnsActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.SnsActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.SnsActionProperty>();
  ret.addPropertyResult("messageFormat", "MessageFormat", (properties.MessageFormat != null ? cfn_parse.FromCloudFormation.getString(properties.MessageFormat) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaActionProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleLambdaActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  return errors.wrap("supplied properties not correct for \"LambdaActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleLambdaActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleLambdaActionPropertyValidator(properties).assertSuccess();
  return {
    "FunctionArn": cdk.stringToCloudFormation(properties.functionArn)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleLambdaActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.LambdaActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.LambdaActionProperty>();
  ret.addPropertyResult("functionArn", "FunctionArn", (properties.FunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimestampProperty`
 *
 * @param properties - the TypeScript properties of a `TimestampProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleTimestampPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TimestampProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleTimestampPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleTimestampPropertyValidator(properties).assertSuccess();
  return {
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleTimestampPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.TimestampProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.TimestampProperty>();
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocationActionProperty`
 *
 * @param properties - the TypeScript properties of a `LocationActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleLocationActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceId", cdk.requiredValidator)(properties.deviceId));
  errors.collect(cdk.propertyValidator("deviceId", cdk.validateString)(properties.deviceId));
  errors.collect(cdk.propertyValidator("latitude", cdk.requiredValidator)(properties.latitude));
  errors.collect(cdk.propertyValidator("latitude", cdk.validateString)(properties.latitude));
  errors.collect(cdk.propertyValidator("longitude", cdk.requiredValidator)(properties.longitude));
  errors.collect(cdk.propertyValidator("longitude", cdk.validateString)(properties.longitude));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("timestamp", CfnTopicRuleTimestampPropertyValidator)(properties.timestamp));
  errors.collect(cdk.propertyValidator("trackerName", cdk.requiredValidator)(properties.trackerName));
  errors.collect(cdk.propertyValidator("trackerName", cdk.validateString)(properties.trackerName));
  return errors.wrap("supplied properties not correct for \"LocationActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleLocationActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleLocationActionPropertyValidator(properties).assertSuccess();
  return {
    "DeviceId": cdk.stringToCloudFormation(properties.deviceId),
    "Latitude": cdk.stringToCloudFormation(properties.latitude),
    "Longitude": cdk.stringToCloudFormation(properties.longitude),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Timestamp": convertCfnTopicRuleTimestampPropertyToCloudFormation(properties.timestamp),
    "TrackerName": cdk.stringToCloudFormation(properties.trackerName)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleLocationActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.LocationActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.LocationActionProperty>();
  ret.addPropertyResult("deviceId", "DeviceId", (properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined));
  ret.addPropertyResult("latitude", "Latitude", (properties.Latitude != null ? cfn_parse.FromCloudFormation.getString(properties.Latitude) : undefined));
  ret.addPropertyResult("longitude", "Longitude", (properties.Longitude != null ? cfn_parse.FromCloudFormation.getString(properties.Longitude) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("timestamp", "Timestamp", (properties.Timestamp != null ? CfnTopicRuleTimestampPropertyFromCloudFormation(properties.Timestamp) : undefined));
  ret.addPropertyResult("trackerName", "TrackerName", (properties.TrackerName != null ? cfn_parse.FromCloudFormation.getString(properties.TrackerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudwatchAlarm", CfnTopicRuleCloudwatchAlarmActionPropertyValidator)(properties.cloudwatchAlarm));
  errors.collect(cdk.propertyValidator("cloudwatchLogs", CfnTopicRuleCloudwatchLogsActionPropertyValidator)(properties.cloudwatchLogs));
  errors.collect(cdk.propertyValidator("cloudwatchMetric", CfnTopicRuleCloudwatchMetricActionPropertyValidator)(properties.cloudwatchMetric));
  errors.collect(cdk.propertyValidator("dynamoDb", CfnTopicRuleDynamoDBActionPropertyValidator)(properties.dynamoDb));
  errors.collect(cdk.propertyValidator("dynamoDBv2", CfnTopicRuleDynamoDBv2ActionPropertyValidator)(properties.dynamoDBv2));
  errors.collect(cdk.propertyValidator("elasticsearch", CfnTopicRuleElasticsearchActionPropertyValidator)(properties.elasticsearch));
  errors.collect(cdk.propertyValidator("firehose", CfnTopicRuleFirehoseActionPropertyValidator)(properties.firehose));
  errors.collect(cdk.propertyValidator("http", CfnTopicRuleHttpActionPropertyValidator)(properties.http));
  errors.collect(cdk.propertyValidator("iotAnalytics", CfnTopicRuleIotAnalyticsActionPropertyValidator)(properties.iotAnalytics));
  errors.collect(cdk.propertyValidator("iotEvents", CfnTopicRuleIotEventsActionPropertyValidator)(properties.iotEvents));
  errors.collect(cdk.propertyValidator("iotSiteWise", CfnTopicRuleIotSiteWiseActionPropertyValidator)(properties.iotSiteWise));
  errors.collect(cdk.propertyValidator("kafka", CfnTopicRuleKafkaActionPropertyValidator)(properties.kafka));
  errors.collect(cdk.propertyValidator("kinesis", CfnTopicRuleKinesisActionPropertyValidator)(properties.kinesis));
  errors.collect(cdk.propertyValidator("lambda", CfnTopicRuleLambdaActionPropertyValidator)(properties.lambda));
  errors.collect(cdk.propertyValidator("location", CfnTopicRuleLocationActionPropertyValidator)(properties.location));
  errors.collect(cdk.propertyValidator("openSearch", CfnTopicRuleOpenSearchActionPropertyValidator)(properties.openSearch));
  errors.collect(cdk.propertyValidator("republish", CfnTopicRuleRepublishActionPropertyValidator)(properties.republish));
  errors.collect(cdk.propertyValidator("s3", CfnTopicRuleS3ActionPropertyValidator)(properties.s3));
  errors.collect(cdk.propertyValidator("sns", CfnTopicRuleSnsActionPropertyValidator)(properties.sns));
  errors.collect(cdk.propertyValidator("sqs", CfnTopicRuleSqsActionPropertyValidator)(properties.sqs));
  errors.collect(cdk.propertyValidator("stepFunctions", CfnTopicRuleStepFunctionsActionPropertyValidator)(properties.stepFunctions));
  errors.collect(cdk.propertyValidator("timestream", CfnTopicRuleTimestreamActionPropertyValidator)(properties.timestream));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleActionPropertyValidator(properties).assertSuccess();
  return {
    "CloudwatchAlarm": convertCfnTopicRuleCloudwatchAlarmActionPropertyToCloudFormation(properties.cloudwatchAlarm),
    "CloudwatchLogs": convertCfnTopicRuleCloudwatchLogsActionPropertyToCloudFormation(properties.cloudwatchLogs),
    "CloudwatchMetric": convertCfnTopicRuleCloudwatchMetricActionPropertyToCloudFormation(properties.cloudwatchMetric),
    "DynamoDB": convertCfnTopicRuleDynamoDBActionPropertyToCloudFormation(properties.dynamoDb),
    "DynamoDBv2": convertCfnTopicRuleDynamoDBv2ActionPropertyToCloudFormation(properties.dynamoDBv2),
    "Elasticsearch": convertCfnTopicRuleElasticsearchActionPropertyToCloudFormation(properties.elasticsearch),
    "Firehose": convertCfnTopicRuleFirehoseActionPropertyToCloudFormation(properties.firehose),
    "Http": convertCfnTopicRuleHttpActionPropertyToCloudFormation(properties.http),
    "IotAnalytics": convertCfnTopicRuleIotAnalyticsActionPropertyToCloudFormation(properties.iotAnalytics),
    "IotEvents": convertCfnTopicRuleIotEventsActionPropertyToCloudFormation(properties.iotEvents),
    "IotSiteWise": convertCfnTopicRuleIotSiteWiseActionPropertyToCloudFormation(properties.iotSiteWise),
    "Kafka": convertCfnTopicRuleKafkaActionPropertyToCloudFormation(properties.kafka),
    "Kinesis": convertCfnTopicRuleKinesisActionPropertyToCloudFormation(properties.kinesis),
    "Lambda": convertCfnTopicRuleLambdaActionPropertyToCloudFormation(properties.lambda),
    "Location": convertCfnTopicRuleLocationActionPropertyToCloudFormation(properties.location),
    "OpenSearch": convertCfnTopicRuleOpenSearchActionPropertyToCloudFormation(properties.openSearch),
    "Republish": convertCfnTopicRuleRepublishActionPropertyToCloudFormation(properties.republish),
    "S3": convertCfnTopicRuleS3ActionPropertyToCloudFormation(properties.s3),
    "Sns": convertCfnTopicRuleSnsActionPropertyToCloudFormation(properties.sns),
    "Sqs": convertCfnTopicRuleSqsActionPropertyToCloudFormation(properties.sqs),
    "StepFunctions": convertCfnTopicRuleStepFunctionsActionPropertyToCloudFormation(properties.stepFunctions),
    "Timestream": convertCfnTopicRuleTimestreamActionPropertyToCloudFormation(properties.timestream)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRule.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.ActionProperty>();
  ret.addPropertyResult("cloudwatchAlarm", "CloudwatchAlarm", (properties.CloudwatchAlarm != null ? CfnTopicRuleCloudwatchAlarmActionPropertyFromCloudFormation(properties.CloudwatchAlarm) : undefined));
  ret.addPropertyResult("cloudwatchLogs", "CloudwatchLogs", (properties.CloudwatchLogs != null ? CfnTopicRuleCloudwatchLogsActionPropertyFromCloudFormation(properties.CloudwatchLogs) : undefined));
  ret.addPropertyResult("cloudwatchMetric", "CloudwatchMetric", (properties.CloudwatchMetric != null ? CfnTopicRuleCloudwatchMetricActionPropertyFromCloudFormation(properties.CloudwatchMetric) : undefined));
  ret.addPropertyResult("dynamoDb", "DynamoDB", (properties.DynamoDB != null ? CfnTopicRuleDynamoDBActionPropertyFromCloudFormation(properties.DynamoDB) : undefined));
  ret.addPropertyResult("dynamoDBv2", "DynamoDBv2", (properties.DynamoDBv2 != null ? CfnTopicRuleDynamoDBv2ActionPropertyFromCloudFormation(properties.DynamoDBv2) : undefined));
  ret.addPropertyResult("elasticsearch", "Elasticsearch", (properties.Elasticsearch != null ? CfnTopicRuleElasticsearchActionPropertyFromCloudFormation(properties.Elasticsearch) : undefined));
  ret.addPropertyResult("firehose", "Firehose", (properties.Firehose != null ? CfnTopicRuleFirehoseActionPropertyFromCloudFormation(properties.Firehose) : undefined));
  ret.addPropertyResult("http", "Http", (properties.Http != null ? CfnTopicRuleHttpActionPropertyFromCloudFormation(properties.Http) : undefined));
  ret.addPropertyResult("iotAnalytics", "IotAnalytics", (properties.IotAnalytics != null ? CfnTopicRuleIotAnalyticsActionPropertyFromCloudFormation(properties.IotAnalytics) : undefined));
  ret.addPropertyResult("iotEvents", "IotEvents", (properties.IotEvents != null ? CfnTopicRuleIotEventsActionPropertyFromCloudFormation(properties.IotEvents) : undefined));
  ret.addPropertyResult("iotSiteWise", "IotSiteWise", (properties.IotSiteWise != null ? CfnTopicRuleIotSiteWiseActionPropertyFromCloudFormation(properties.IotSiteWise) : undefined));
  ret.addPropertyResult("kafka", "Kafka", (properties.Kafka != null ? CfnTopicRuleKafkaActionPropertyFromCloudFormation(properties.Kafka) : undefined));
  ret.addPropertyResult("kinesis", "Kinesis", (properties.Kinesis != null ? CfnTopicRuleKinesisActionPropertyFromCloudFormation(properties.Kinesis) : undefined));
  ret.addPropertyResult("lambda", "Lambda", (properties.Lambda != null ? CfnTopicRuleLambdaActionPropertyFromCloudFormation(properties.Lambda) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnTopicRuleLocationActionPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addPropertyResult("openSearch", "OpenSearch", (properties.OpenSearch != null ? CfnTopicRuleOpenSearchActionPropertyFromCloudFormation(properties.OpenSearch) : undefined));
  ret.addPropertyResult("republish", "Republish", (properties.Republish != null ? CfnTopicRuleRepublishActionPropertyFromCloudFormation(properties.Republish) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnTopicRuleS3ActionPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addPropertyResult("sns", "Sns", (properties.Sns != null ? CfnTopicRuleSnsActionPropertyFromCloudFormation(properties.Sns) : undefined));
  ret.addPropertyResult("sqs", "Sqs", (properties.Sqs != null ? CfnTopicRuleSqsActionPropertyFromCloudFormation(properties.Sqs) : undefined));
  ret.addPropertyResult("stepFunctions", "StepFunctions", (properties.StepFunctions != null ? CfnTopicRuleStepFunctionsActionPropertyFromCloudFormation(properties.StepFunctions) : undefined));
  ret.addPropertyResult("timestream", "Timestream", (properties.Timestream != null ? CfnTopicRuleTimestreamActionPropertyFromCloudFormation(properties.Timestream) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TopicRulePayloadProperty`
 *
 * @param properties - the TypeScript properties of a `TopicRulePayloadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleTopicRulePayloadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnTopicRuleActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("awsIotSqlVersion", cdk.validateString)(properties.awsIotSqlVersion));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("errorAction", CfnTopicRuleActionPropertyValidator)(properties.errorAction));
  errors.collect(cdk.propertyValidator("ruleDisabled", cdk.validateBoolean)(properties.ruleDisabled));
  errors.collect(cdk.propertyValidator("sql", cdk.requiredValidator)(properties.sql));
  errors.collect(cdk.propertyValidator("sql", cdk.validateString)(properties.sql));
  return errors.wrap("supplied properties not correct for \"TopicRulePayloadProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleTopicRulePayloadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleTopicRulePayloadPropertyValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnTopicRuleActionPropertyToCloudFormation)(properties.actions),
    "AwsIotSqlVersion": cdk.stringToCloudFormation(properties.awsIotSqlVersion),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ErrorAction": convertCfnTopicRuleActionPropertyToCloudFormation(properties.errorAction),
    "RuleDisabled": cdk.booleanToCloudFormation(properties.ruleDisabled),
    "Sql": cdk.stringToCloudFormation(properties.sql)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleTopicRulePayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRule.TopicRulePayloadProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRule.TopicRulePayloadProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicRuleActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("awsIotSqlVersion", "AwsIotSqlVersion", (properties.AwsIotSqlVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsIotSqlVersion) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("errorAction", "ErrorAction", (properties.ErrorAction != null ? CfnTopicRuleActionPropertyFromCloudFormation(properties.ErrorAction) : undefined));
  ret.addPropertyResult("ruleDisabled", "RuleDisabled", (properties.RuleDisabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RuleDisabled) : undefined));
  ret.addPropertyResult("sql", "Sql", (properties.Sql != null ? cfn_parse.FromCloudFormation.getString(properties.Sql) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTopicRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnTopicRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("topicRulePayload", cdk.requiredValidator)(properties.topicRulePayload));
  errors.collect(cdk.propertyValidator("topicRulePayload", CfnTopicRuleTopicRulePayloadPropertyValidator)(properties.topicRulePayload));
  return errors.wrap("supplied properties not correct for \"CfnTopicRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnTopicRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRulePropsValidator(properties).assertSuccess();
  return {
    "RuleName": cdk.stringToCloudFormation(properties.ruleName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TopicRulePayload": convertCfnTopicRuleTopicRulePayloadPropertyToCloudFormation(properties.topicRulePayload)
  };
}

// @ts-ignore TS6133
function CfnTopicRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRuleProps>();
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("topicRulePayload", "TopicRulePayload", (properties.TopicRulePayload != null ? CfnTopicRuleTopicRulePayloadPropertyFromCloudFormation(properties.TopicRulePayload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A topic rule destination.
 *
 * @cloudformationResource AWS::IoT::TopicRuleDestination
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicruledestination.html
 */
export class CfnTopicRuleDestination extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::TopicRuleDestination";

  /**
   * Build a CfnTopicRuleDestination from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTopicRuleDestination {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTopicRuleDestinationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTopicRuleDestination(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The topic rule destination URL.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Additional details or reason why the topic rule destination is in the current status.
   *
   * @cloudformationAttribute StatusReason
   */
  public readonly attrStatusReason: string;

  /**
   * Properties of the HTTP URL.
   */
  public httpUrlProperties?: CfnTopicRuleDestination.HttpUrlDestinationSummaryProperty | cdk.IResolvable;

  /**
   * - **IN_PROGRESS** - A topic rule destination was created but has not been confirmed.
   */
  public status?: string;

  /**
   * Properties of the virtual private cloud (VPC) connection.
   */
  public vpcProperties?: cdk.IResolvable | CfnTopicRuleDestination.VpcDestinationPropertiesProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTopicRuleDestinationProps = {}) {
    super(scope, id, {
      "type": CfnTopicRuleDestination.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrStatusReason = cdk.Token.asString(this.getAtt("StatusReason", cdk.ResolutionTypeHint.STRING));
    this.httpUrlProperties = props.httpUrlProperties;
    this.status = props.status;
    this.vpcProperties = props.vpcProperties;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "httpUrlProperties": this.httpUrlProperties,
      "status": this.status,
      "vpcProperties": this.vpcProperties
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTopicRuleDestination.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTopicRuleDestinationPropsToCloudFormation(props);
  }
}

export namespace CfnTopicRuleDestination {
  /**
   * HTTP URL destination properties.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicruledestination-httpurldestinationsummary.html
   */
  export interface HttpUrlDestinationSummaryProperty {
    /**
     * The URL used to confirm the HTTP topic rule destination URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicruledestination-httpurldestinationsummary.html#cfn-iot-topicruledestination-httpurldestinationsummary-confirmationurl
     */
    readonly confirmationUrl?: string;
  }

  /**
   * The properties of a virtual private cloud (VPC) destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicruledestination-vpcdestinationproperties.html
   */
  export interface VpcDestinationPropertiesProperty {
    /**
     * The ARN of a role that has permission to create and attach to elastic network interfaces (ENIs).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicruledestination-vpcdestinationproperties.html#cfn-iot-topicruledestination-vpcdestinationproperties-rolearn
     */
    readonly roleArn?: string;

    /**
     * The security groups of the VPC destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicruledestination-vpcdestinationproperties.html#cfn-iot-topicruledestination-vpcdestinationproperties-securitygroups
     */
    readonly securityGroups?: Array<string>;

    /**
     * The subnet IDs of the VPC destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicruledestination-vpcdestinationproperties.html#cfn-iot-topicruledestination-vpcdestinationproperties-subnetids
     */
    readonly subnetIds?: Array<string>;

    /**
     * The ID of the VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicruledestination-vpcdestinationproperties.html#cfn-iot-topicruledestination-vpcdestinationproperties-vpcid
     */
    readonly vpcId?: string;
  }
}

/**
 * Properties for defining a `CfnTopicRuleDestination`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicruledestination.html
 */
export interface CfnTopicRuleDestinationProps {
  /**
   * Properties of the HTTP URL.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicruledestination.html#cfn-iot-topicruledestination-httpurlproperties
   */
  readonly httpUrlProperties?: CfnTopicRuleDestination.HttpUrlDestinationSummaryProperty | cdk.IResolvable;

  /**
   * - **IN_PROGRESS** - A topic rule destination was created but has not been confirmed.
   *
   * You can set status to `IN_PROGRESS` by calling `UpdateTopicRuleDestination` . Calling `UpdateTopicRuleDestination` causes a new confirmation challenge to be sent to your confirmation endpoint.
   * - **ENABLED** - Confirmation was completed, and traffic to this destination is allowed. You can set status to `DISABLED` by calling `UpdateTopicRuleDestination` .
   * - **DISABLED** - Confirmation was completed, and traffic to this destination is not allowed. You can set status to `ENABLED` by calling `UpdateTopicRuleDestination` .
   * - **ERROR** - Confirmation could not be completed; for example, if the confirmation timed out. You can call `GetTopicRuleDestination` for details about the error. You can set status to `IN_PROGRESS` by calling `UpdateTopicRuleDestination` . Calling `UpdateTopicRuleDestination` causes a new confirmation challenge to be sent to your confirmation endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicruledestination.html#cfn-iot-topicruledestination-status
   */
  readonly status?: string;

  /**
   * Properties of the virtual private cloud (VPC) connection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicruledestination.html#cfn-iot-topicruledestination-vpcproperties
   */
  readonly vpcProperties?: cdk.IResolvable | CfnTopicRuleDestination.VpcDestinationPropertiesProperty;
}

/**
 * Determine whether the given properties match those of a `HttpUrlDestinationSummaryProperty`
 *
 * @param properties - the TypeScript properties of a `HttpUrlDestinationSummaryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleDestinationHttpUrlDestinationSummaryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("confirmationUrl", cdk.validateString)(properties.confirmationUrl));
  return errors.wrap("supplied properties not correct for \"HttpUrlDestinationSummaryProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleDestinationHttpUrlDestinationSummaryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleDestinationHttpUrlDestinationSummaryPropertyValidator(properties).assertSuccess();
  return {
    "ConfirmationUrl": cdk.stringToCloudFormation(properties.confirmationUrl)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleDestinationHttpUrlDestinationSummaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRuleDestination.HttpUrlDestinationSummaryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRuleDestination.HttpUrlDestinationSummaryProperty>();
  ret.addPropertyResult("confirmationUrl", "ConfirmationUrl", (properties.ConfirmationUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ConfirmationUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `VpcDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleDestinationVpcDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VpcDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleDestinationVpcDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleDestinationVpcDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleDestinationVpcDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopicRuleDestination.VpcDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRuleDestination.VpcDestinationPropertiesProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTopicRuleDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTopicRuleDestinationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicRuleDestinationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpUrlProperties", CfnTopicRuleDestinationHttpUrlDestinationSummaryPropertyValidator)(properties.httpUrlProperties));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("vpcProperties", CfnTopicRuleDestinationVpcDestinationPropertiesPropertyValidator)(properties.vpcProperties));
  return errors.wrap("supplied properties not correct for \"CfnTopicRuleDestinationProps\"");
}

// @ts-ignore TS6133
function convertCfnTopicRuleDestinationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicRuleDestinationPropsValidator(properties).assertSuccess();
  return {
    "HttpUrlProperties": convertCfnTopicRuleDestinationHttpUrlDestinationSummaryPropertyToCloudFormation(properties.httpUrlProperties),
    "Status": cdk.stringToCloudFormation(properties.status),
    "VpcProperties": convertCfnTopicRuleDestinationVpcDestinationPropertiesPropertyToCloudFormation(properties.vpcProperties)
  };
}

// @ts-ignore TS6133
function CfnTopicRuleDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicRuleDestinationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicRuleDestinationProps>();
  ret.addPropertyResult("httpUrlProperties", "HttpUrlProperties", (properties.HttpUrlProperties != null ? CfnTopicRuleDestinationHttpUrlDestinationSummaryPropertyFromCloudFormation(properties.HttpUrlProperties) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("vpcProperties", "VpcProperties", (properties.VpcProperties != null ? CfnTopicRuleDestinationVpcDestinationPropertiesPropertyFromCloudFormation(properties.VpcProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a certificate provider.
 *
 * AWS IoT Core certificate provider lets you customize how to sign a certificate signing request (CSR) in fleet provisioning. For more information, see [Self-managed certificate signing using AWS IoT Core certificate provider](https://docs.aws.amazon.com/iot/latest/developerguide/provisioning-cert-provider.html) from the *AWS IoT Core Developer Guide* .
 *
 * @cloudformationResource AWS::IoT::CertificateProvider
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificateprovider.html
 */
export class CfnCertificateProvider extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoT::CertificateProvider";

  /**
   * Build a CfnCertificateProvider from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCertificateProvider {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCertificateProviderPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCertificateProvider(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) for the certificate. For example:
   *
   * `{ "Fn::GetAtt": ["MyCertificateProvider", "Arn"] }`
   *
   * A value similar to the following is returned:
   *
   * `arn:aws:iot:ap-southeast-2:123456789012:certprovider/my-certificate-provider`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A list of the operations that the certificate provider will use to generate certificates.
   */
  public accountDefaultForOperations: Array<string>;

  /**
   * The name of the certificate provider.
   */
  public certificateProviderName?: string;

  /**
   * The ARN of the Lambda function.
   */
  public lambdaFunctionArn: string;

  /**
   * Metadata that can be used to manage the certificate provider.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCertificateProviderProps) {
    super(scope, id, {
      "type": CfnCertificateProvider.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountDefaultForOperations", this);
    cdk.requireProperty(props, "lambdaFunctionArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.accountDefaultForOperations = props.accountDefaultForOperations;
    this.certificateProviderName = props.certificateProviderName;
    this.lambdaFunctionArn = props.lambdaFunctionArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountDefaultForOperations": this.accountDefaultForOperations,
      "certificateProviderName": this.certificateProviderName,
      "lambdaFunctionArn": this.lambdaFunctionArn,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificateProvider.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCertificateProviderPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCertificateProvider`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificateprovider.html
 */
export interface CfnCertificateProviderProps {
  /**
   * A list of the operations that the certificate provider will use to generate certificates.
   *
   * Valid value: `CreateCertificateFromCsr` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificateprovider.html#cfn-iot-certificateprovider-accountdefaultforoperations
   */
  readonly accountDefaultForOperations: Array<string>;

  /**
   * The name of the certificate provider.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificateprovider.html#cfn-iot-certificateprovider-certificateprovidername
   */
  readonly certificateProviderName?: string;

  /**
   * The ARN of the Lambda function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificateprovider.html#cfn-iot-certificateprovider-lambdafunctionarn
   */
  readonly lambdaFunctionArn: string;

  /**
   * Metadata that can be used to manage the certificate provider.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-certificateprovider.html#cfn-iot-certificateprovider-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnCertificateProviderProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProviderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCertificateProviderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountDefaultForOperations", cdk.requiredValidator)(properties.accountDefaultForOperations));
  errors.collect(cdk.propertyValidator("accountDefaultForOperations", cdk.listValidator(cdk.validateString))(properties.accountDefaultForOperations));
  errors.collect(cdk.propertyValidator("certificateProviderName", cdk.validateString)(properties.certificateProviderName));
  errors.collect(cdk.propertyValidator("lambdaFunctionArn", cdk.requiredValidator)(properties.lambdaFunctionArn));
  errors.collect(cdk.propertyValidator("lambdaFunctionArn", cdk.validateString)(properties.lambdaFunctionArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCertificateProviderProps\"");
}

// @ts-ignore TS6133
function convertCfnCertificateProviderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCertificateProviderPropsValidator(properties).assertSuccess();
  return {
    "AccountDefaultForOperations": cdk.listMapper(cdk.stringToCloudFormation)(properties.accountDefaultForOperations),
    "CertificateProviderName": cdk.stringToCloudFormation(properties.certificateProviderName),
    "LambdaFunctionArn": cdk.stringToCloudFormation(properties.lambdaFunctionArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCertificateProviderPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProviderProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProviderProps>();
  ret.addPropertyResult("accountDefaultForOperations", "AccountDefaultForOperations", (properties.AccountDefaultForOperations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AccountDefaultForOperations) : undefined));
  ret.addPropertyResult("certificateProviderName", "CertificateProviderName", (properties.CertificateProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateProviderName) : undefined));
  ret.addPropertyResult("lambdaFunctionArn", "LambdaFunctionArn", (properties.LambdaFunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}