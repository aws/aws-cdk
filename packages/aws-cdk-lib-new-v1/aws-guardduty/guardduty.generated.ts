/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::GuardDuty::Detector` resource specifies a new GuardDuty detector.
 *
 * A detector is an object that represents the GuardDuty service. A detector is required for GuardDuty to become operational.
 *
 * Make sure you use either `DataSources` or `Features` in a one request, and not both.
 *
 * @cloudformationResource AWS::GuardDuty::Detector
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html
 */
export class CfnDetector extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GuardDuty::Detector";

  /**
   * Build a CfnDetector from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDetector {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDetectorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDetector(scope, id, propsResult.value);
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
   * Describes which data sources will be enabled for the detector.
   */
  public dataSources?: CfnDetector.CFNDataSourceConfigurationsProperty | cdk.IResolvable;

  /**
   * Specifies whether the detector is to be enabled on creation.
   */
  public enable: boolean | cdk.IResolvable;

  /**
   * A list of features that will be configured for the detector.
   */
  public features?: Array<CfnDetector.CFNFeatureConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies how frequently updated findings are exported.
   */
  public findingPublishingFrequency?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies tags added to a new detector resource.
   */
  public tagsRaw?: Array<CfnDetector.TagItemProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDetectorProps) {
    super(scope, id, {
      "type": CfnDetector.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "enable", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.dataSources = props.dataSources;
    this.enable = props.enable;
    this.features = props.features;
    this.findingPublishingFrequency = props.findingPublishingFrequency;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GuardDuty::Detector", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataSources": this.dataSources,
      "enable": this.enable,
      "features": this.features,
      "findingPublishingFrequency": this.findingPublishingFrequency,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDetector.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDetectorPropsToCloudFormation(props);
  }
}

export namespace CfnDetector {
  /**
   * Describes whether S3 data event logs, Kubernetes audit logs, or Malware Protection will be enabled as a data source when the detector is created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfndatasourceconfigurations.html
   */
  export interface CFNDataSourceConfigurationsProperty {
    /**
     * Describes which Kubernetes data sources are enabled for a detector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfndatasourceconfigurations.html#cfn-guardduty-detector-cfndatasourceconfigurations-kubernetes
     */
    readonly kubernetes?: CfnDetector.CFNKubernetesConfigurationProperty | cdk.IResolvable;

    /**
     * Describes whether Malware Protection will be enabled as a data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfndatasourceconfigurations.html#cfn-guardduty-detector-cfndatasourceconfigurations-malwareprotection
     */
    readonly malwareProtection?: CfnDetector.CFNMalwareProtectionConfigurationProperty | cdk.IResolvable;

    /**
     * Describes whether S3 data event logs are enabled as a data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfndatasourceconfigurations.html#cfn-guardduty-detector-cfndatasourceconfigurations-s3logs
     */
    readonly s3Logs?: CfnDetector.CFNS3LogsConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Describes whether Malware Protection will be enabled as a data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnmalwareprotectionconfiguration.html
   */
  export interface CFNMalwareProtectionConfigurationProperty {
    /**
     * Describes the configuration of Malware Protection for EC2 instances with findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnmalwareprotectionconfiguration.html#cfn-guardduty-detector-cfnmalwareprotectionconfiguration-scanec2instancewithfindings
     */
    readonly scanEc2InstanceWithFindings?: CfnDetector.CFNScanEc2InstanceWithFindingsConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Describes whether Malware Protection for EC2 instances with findings will be enabled as a data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnscanec2instancewithfindingsconfiguration.html
   */
  export interface CFNScanEc2InstanceWithFindingsConfigurationProperty {
    /**
     * Describes the configuration for scanning EBS volumes as data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnscanec2instancewithfindingsconfiguration.html#cfn-guardduty-detector-cfnscanec2instancewithfindingsconfiguration-ebsvolumes
     */
    readonly ebsVolumes?: boolean | cdk.IResolvable;
  }

  /**
   * Describes whether S3 data event logs will be enabled as a data source when the detector is created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfns3logsconfiguration.html
   */
  export interface CFNS3LogsConfigurationProperty {
    /**
     * The status of S3 data event logs as a data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfns3logsconfiguration.html#cfn-guardduty-detector-cfns3logsconfiguration-enable
     */
    readonly enable: boolean | cdk.IResolvable;
  }

  /**
   * Describes which Kubernetes protection data sources are enabled for the detector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnkubernetesconfiguration.html
   */
  export interface CFNKubernetesConfigurationProperty {
    /**
     * Describes whether Kubernetes audit logs are enabled as a data source for the detector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnkubernetesconfiguration.html#cfn-guardduty-detector-cfnkubernetesconfiguration-auditlogs
     */
    readonly auditLogs: CfnDetector.CFNKubernetesAuditLogsConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Describes which optional data sources are enabled for a detector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnkubernetesauditlogsconfiguration.html
   */
  export interface CFNKubernetesAuditLogsConfigurationProperty {
    /**
     * Describes whether Kubernetes audit logs are enabled as a data source for the detector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnkubernetesauditlogsconfiguration.html#cfn-guardduty-detector-cfnkubernetesauditlogsconfiguration-enable
     */
    readonly enable: boolean | cdk.IResolvable;
  }

  /**
   * Information about the configuration of a feature in your account.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnfeatureconfiguration.html
   */
  export interface CFNFeatureConfigurationProperty {
    /**
     * Information about the additional configuration of a feature in your account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnfeatureconfiguration.html#cfn-guardduty-detector-cfnfeatureconfiguration-additionalconfiguration
     */
    readonly additionalConfiguration?: Array<CfnDetector.CFNFeatureAdditionalConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Name of the feature.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnfeatureconfiguration.html#cfn-guardduty-detector-cfnfeatureconfiguration-name
     */
    readonly name: string;

    /**
     * Status of the feature configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnfeatureconfiguration.html#cfn-guardduty-detector-cfnfeatureconfiguration-status
     */
    readonly status: string;
  }

  /**
   * Information about the additional configuration of a feature in your account.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnfeatureadditionalconfiguration.html
   */
  export interface CFNFeatureAdditionalConfigurationProperty {
    /**
     * Name of the additional configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnfeatureadditionalconfiguration.html#cfn-guardduty-detector-cfnfeatureadditionalconfiguration-name
     */
    readonly name?: string;

    /**
     * Status of the additional configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnfeatureadditionalconfiguration.html#cfn-guardduty-detector-cfnfeatureadditionalconfiguration-status
     */
    readonly status?: string;
  }

  /**
   * Describes a tag.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-tagitem.html
   */
  export interface TagItemProperty {
    /**
     * The tag value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-tagitem.html#cfn-guardduty-detector-tagitem-key
     */
    readonly key: string;

    /**
     * The tag key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-tagitem.html#cfn-guardduty-detector-tagitem-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnDetector`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html
 */
export interface CfnDetectorProps {
  /**
   * Describes which data sources will be enabled for the detector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-datasources
   */
  readonly dataSources?: CfnDetector.CFNDataSourceConfigurationsProperty | cdk.IResolvable;

  /**
   * Specifies whether the detector is to be enabled on creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-enable
   */
  readonly enable: boolean | cdk.IResolvable;

  /**
   * A list of features that will be configured for the detector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-features
   */
  readonly features?: Array<CfnDetector.CFNFeatureConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies how frequently updated findings are exported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-findingpublishingfrequency
   */
  readonly findingPublishingFrequency?: string;

  /**
   * Specifies tags added to a new detector resource.
   *
   * Each tag consists of a key and an optional value, both of which you define.
   *
   * Currently, support is available only for creating and deleting a tag. No support exists for updating the tags.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-tags
   */
  readonly tags?: Array<CfnDetector.TagItemProperty>;
}

/**
 * Determine whether the given properties match those of a `CFNScanEc2InstanceWithFindingsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CFNScanEc2InstanceWithFindingsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorCFNScanEc2InstanceWithFindingsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ebsVolumes", cdk.validateBoolean)(properties.ebsVolumes));
  return errors.wrap("supplied properties not correct for \"CFNScanEc2InstanceWithFindingsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorCFNScanEc2InstanceWithFindingsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorCFNScanEc2InstanceWithFindingsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EbsVolumes": cdk.booleanToCloudFormation(properties.ebsVolumes)
  };
}

// @ts-ignore TS6133
function CfnDetectorCFNScanEc2InstanceWithFindingsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.CFNScanEc2InstanceWithFindingsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.CFNScanEc2InstanceWithFindingsConfigurationProperty>();
  ret.addPropertyResult("ebsVolumes", "EbsVolumes", (properties.EbsVolumes != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsVolumes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CFNMalwareProtectionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CFNMalwareProtectionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorCFNMalwareProtectionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scanEc2InstanceWithFindings", CfnDetectorCFNScanEc2InstanceWithFindingsConfigurationPropertyValidator)(properties.scanEc2InstanceWithFindings));
  return errors.wrap("supplied properties not correct for \"CFNMalwareProtectionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorCFNMalwareProtectionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorCFNMalwareProtectionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ScanEc2InstanceWithFindings": convertCfnDetectorCFNScanEc2InstanceWithFindingsConfigurationPropertyToCloudFormation(properties.scanEc2InstanceWithFindings)
  };
}

// @ts-ignore TS6133
function CfnDetectorCFNMalwareProtectionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.CFNMalwareProtectionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.CFNMalwareProtectionConfigurationProperty>();
  ret.addPropertyResult("scanEc2InstanceWithFindings", "ScanEc2InstanceWithFindings", (properties.ScanEc2InstanceWithFindings != null ? CfnDetectorCFNScanEc2InstanceWithFindingsConfigurationPropertyFromCloudFormation(properties.ScanEc2InstanceWithFindings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CFNS3LogsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CFNS3LogsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorCFNS3LogsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enable", cdk.requiredValidator)(properties.enable));
  errors.collect(cdk.propertyValidator("enable", cdk.validateBoolean)(properties.enable));
  return errors.wrap("supplied properties not correct for \"CFNS3LogsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorCFNS3LogsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorCFNS3LogsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enable": cdk.booleanToCloudFormation(properties.enable)
  };
}

// @ts-ignore TS6133
function CfnDetectorCFNS3LogsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.CFNS3LogsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.CFNS3LogsConfigurationProperty>();
  ret.addPropertyResult("enable", "Enable", (properties.Enable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enable) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CFNKubernetesAuditLogsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CFNKubernetesAuditLogsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorCFNKubernetesAuditLogsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enable", cdk.requiredValidator)(properties.enable));
  errors.collect(cdk.propertyValidator("enable", cdk.validateBoolean)(properties.enable));
  return errors.wrap("supplied properties not correct for \"CFNKubernetesAuditLogsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorCFNKubernetesAuditLogsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorCFNKubernetesAuditLogsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enable": cdk.booleanToCloudFormation(properties.enable)
  };
}

// @ts-ignore TS6133
function CfnDetectorCFNKubernetesAuditLogsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.CFNKubernetesAuditLogsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.CFNKubernetesAuditLogsConfigurationProperty>();
  ret.addPropertyResult("enable", "Enable", (properties.Enable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enable) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CFNKubernetesConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CFNKubernetesConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorCFNKubernetesConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("auditLogs", cdk.requiredValidator)(properties.auditLogs));
  errors.collect(cdk.propertyValidator("auditLogs", CfnDetectorCFNKubernetesAuditLogsConfigurationPropertyValidator)(properties.auditLogs));
  return errors.wrap("supplied properties not correct for \"CFNKubernetesConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorCFNKubernetesConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorCFNKubernetesConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AuditLogs": convertCfnDetectorCFNKubernetesAuditLogsConfigurationPropertyToCloudFormation(properties.auditLogs)
  };
}

// @ts-ignore TS6133
function CfnDetectorCFNKubernetesConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.CFNKubernetesConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.CFNKubernetesConfigurationProperty>();
  ret.addPropertyResult("auditLogs", "AuditLogs", (properties.AuditLogs != null ? CfnDetectorCFNKubernetesAuditLogsConfigurationPropertyFromCloudFormation(properties.AuditLogs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CFNDataSourceConfigurationsProperty`
 *
 * @param properties - the TypeScript properties of a `CFNDataSourceConfigurationsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorCFNDataSourceConfigurationsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kubernetes", CfnDetectorCFNKubernetesConfigurationPropertyValidator)(properties.kubernetes));
  errors.collect(cdk.propertyValidator("malwareProtection", CfnDetectorCFNMalwareProtectionConfigurationPropertyValidator)(properties.malwareProtection));
  errors.collect(cdk.propertyValidator("s3Logs", CfnDetectorCFNS3LogsConfigurationPropertyValidator)(properties.s3Logs));
  return errors.wrap("supplied properties not correct for \"CFNDataSourceConfigurationsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorCFNDataSourceConfigurationsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorCFNDataSourceConfigurationsPropertyValidator(properties).assertSuccess();
  return {
    "Kubernetes": convertCfnDetectorCFNKubernetesConfigurationPropertyToCloudFormation(properties.kubernetes),
    "MalwareProtection": convertCfnDetectorCFNMalwareProtectionConfigurationPropertyToCloudFormation(properties.malwareProtection),
    "S3Logs": convertCfnDetectorCFNS3LogsConfigurationPropertyToCloudFormation(properties.s3Logs)
  };
}

// @ts-ignore TS6133
function CfnDetectorCFNDataSourceConfigurationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.CFNDataSourceConfigurationsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.CFNDataSourceConfigurationsProperty>();
  ret.addPropertyResult("kubernetes", "Kubernetes", (properties.Kubernetes != null ? CfnDetectorCFNKubernetesConfigurationPropertyFromCloudFormation(properties.Kubernetes) : undefined));
  ret.addPropertyResult("malwareProtection", "MalwareProtection", (properties.MalwareProtection != null ? CfnDetectorCFNMalwareProtectionConfigurationPropertyFromCloudFormation(properties.MalwareProtection) : undefined));
  ret.addPropertyResult("s3Logs", "S3Logs", (properties.S3Logs != null ? CfnDetectorCFNS3LogsConfigurationPropertyFromCloudFormation(properties.S3Logs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CFNFeatureAdditionalConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CFNFeatureAdditionalConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorCFNFeatureAdditionalConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"CFNFeatureAdditionalConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorCFNFeatureAdditionalConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorCFNFeatureAdditionalConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnDetectorCFNFeatureAdditionalConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.CFNFeatureAdditionalConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.CFNFeatureAdditionalConfigurationProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CFNFeatureConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CFNFeatureConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorCFNFeatureConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalConfiguration", cdk.listValidator(CfnDetectorCFNFeatureAdditionalConfigurationPropertyValidator))(properties.additionalConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"CFNFeatureConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorCFNFeatureConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorCFNFeatureConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdditionalConfiguration": cdk.listMapper(convertCfnDetectorCFNFeatureAdditionalConfigurationPropertyToCloudFormation)(properties.additionalConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnDetectorCFNFeatureConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetector.CFNFeatureConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.CFNFeatureConfigurationProperty>();
  ret.addPropertyResult("additionalConfiguration", "AdditionalConfiguration", (properties.AdditionalConfiguration != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorCFNFeatureAdditionalConfigurationPropertyFromCloudFormation)(properties.AdditionalConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagItemProperty`
 *
 * @param properties - the TypeScript properties of a `TagItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorTagItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorTagItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorTagItemPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDetectorTagItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetector.TagItemProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetector.TagItemProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDetectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnDetectorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSources", CfnDetectorCFNDataSourceConfigurationsPropertyValidator)(properties.dataSources));
  errors.collect(cdk.propertyValidator("enable", cdk.requiredValidator)(properties.enable));
  errors.collect(cdk.propertyValidator("enable", cdk.validateBoolean)(properties.enable));
  errors.collect(cdk.propertyValidator("features", cdk.listValidator(CfnDetectorCFNFeatureConfigurationPropertyValidator))(properties.features));
  errors.collect(cdk.propertyValidator("findingPublishingFrequency", cdk.validateString)(properties.findingPublishingFrequency));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnDetectorTagItemPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDetectorProps\"");
}

// @ts-ignore TS6133
function convertCfnDetectorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorPropsValidator(properties).assertSuccess();
  return {
    "DataSources": convertCfnDetectorCFNDataSourceConfigurationsPropertyToCloudFormation(properties.dataSources),
    "Enable": cdk.booleanToCloudFormation(properties.enable),
    "Features": cdk.listMapper(convertCfnDetectorCFNFeatureConfigurationPropertyToCloudFormation)(properties.features),
    "FindingPublishingFrequency": cdk.stringToCloudFormation(properties.findingPublishingFrequency),
    "Tags": cdk.listMapper(convertCfnDetectorTagItemPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDetectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorProps>();
  ret.addPropertyResult("dataSources", "DataSources", (properties.DataSources != null ? CfnDetectorCFNDataSourceConfigurationsPropertyFromCloudFormation(properties.DataSources) : undefined));
  ret.addPropertyResult("enable", "Enable", (properties.Enable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enable) : undefined));
  ret.addPropertyResult("features", "Features", (properties.Features != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorCFNFeatureConfigurationPropertyFromCloudFormation)(properties.Features) : undefined));
  ret.addPropertyResult("findingPublishingFrequency", "FindingPublishingFrequency", (properties.FindingPublishingFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.FindingPublishingFrequency) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorTagItemPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GuardDuty::Filter` resource specifies a new filter defined by the provided `findingCriteria` .
 *
 * @cloudformationResource AWS::GuardDuty::Filter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html
 */
export class CfnFilter extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GuardDuty::Filter";

  /**
   * Build a CfnFilter from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFilter {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFilterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFilter(scope, id, propsResult.value);
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
   * Specifies the action that is to be applied to the findings that match the filter.
   */
  public action: string;

  /**
   * The description of the filter.
   */
  public description: string;

  /**
   * The ID of the detector belonging to the GuardDuty account that you want to create a filter for.
   */
  public detectorId: string;

  /**
   * Represents the criteria to be used in the filter for querying findings.
   */
  public findingCriteria: CfnFilter.FindingCriteriaProperty | cdk.IResolvable;

  /**
   * The name of the filter.
   */
  public name: string;

  /**
   * Specifies the position of the filter in the list of current filters.
   */
  public rank: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to be added to a new filter resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFilterProps) {
    super(scope, id, {
      "type": CfnFilter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "action", this);
    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "detectorId", this);
    cdk.requireProperty(props, "findingCriteria", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "rank", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.action = props.action;
    this.description = props.description;
    this.detectorId = props.detectorId;
    this.findingCriteria = props.findingCriteria;
    this.name = props.name;
    this.rank = props.rank;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GuardDuty::Filter", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "description": this.description,
      "detectorId": this.detectorId,
      "findingCriteria": this.findingCriteria,
      "name": this.name,
      "rank": this.rank,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFilter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFilterPropsToCloudFormation(props);
  }
}

export namespace CfnFilter {
  /**
   * Represents a map of finding properties that match specified conditions and values when querying findings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html
   */
  export interface FindingCriteriaProperty {
    /**
     * Represents a map of finding properties that match specified conditions and values when querying findings.
     *
     * For information about JSON criterion mapping to their console equivalent, see [Finding criteria](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_filter-findings.html#filter_criteria) . The following are the available criterion:
     *
     * - accountId
     * - id
     * - region
     * - severity
     *
     * To filter on the basis of severity, API and CFN use the following input list for the condition:
     *
     * - *Low* : `["1", "2", "3"]`
     * - *Medium* : `["4", "5", "6"]`
     * - *High* : `["7", "8", "9"]`
     *
     * For more information, see [Severity levels for GuardDuty findings](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html#guardduty_findings-severity) .
     * - type
     * - updatedAt
     *
     * Type: ISO 8601 string format: YYYY-MM-DDTHH:MM:SS.SSSZ or YYYY-MM-DDTHH:MM:SSZ depending on whether the value contains milliseconds.
     * - resource.accessKeyDetails.accessKeyId
     * - resource.accessKeyDetails.principalId
     * - resource.accessKeyDetails.userName
     * - resource.accessKeyDetails.userType
     * - resource.instanceDetails.iamInstanceProfile.id
     * - resource.instanceDetails.imageId
     * - resource.instanceDetails.instanceId
     * - resource.instanceDetails.tags.key
     * - resource.instanceDetails.tags.value
     * - resource.instanceDetails.networkInterfaces.ipv6Addresses
     * - resource.instanceDetails.networkInterfaces.privateIpAddresses.privateIpAddress
     * - resource.instanceDetails.networkInterfaces.publicDnsName
     * - resource.instanceDetails.networkInterfaces.publicIp
     * - resource.instanceDetails.networkInterfaces.securityGroups.groupId
     * - resource.instanceDetails.networkInterfaces.securityGroups.groupName
     * - resource.instanceDetails.networkInterfaces.subnetId
     * - resource.instanceDetails.networkInterfaces.vpcId
     * - resource.instanceDetails.outpostArn
     * - resource.resourceType
     * - resource.s3BucketDetails.publicAccess.effectivePermissions
     * - resource.s3BucketDetails.name
     * - resource.s3BucketDetails.tags.key
     * - resource.s3BucketDetails.tags.value
     * - resource.s3BucketDetails.type
     * - service.action.actionType
     * - service.action.awsApiCallAction.api
     * - service.action.awsApiCallAction.callerType
     * - service.action.awsApiCallAction.errorCode
     * - service.action.awsApiCallAction.remoteIpDetails.city.cityName
     * - service.action.awsApiCallAction.remoteIpDetails.country.countryName
     * - service.action.awsApiCallAction.remoteIpDetails.ipAddressV4
     * - service.action.awsApiCallAction.remoteIpDetails.organization.asn
     * - service.action.awsApiCallAction.remoteIpDetails.organization.asnOrg
     * - service.action.awsApiCallAction.serviceName
     * - service.action.dnsRequestAction.domain
     * - service.action.networkConnectionAction.blocked
     * - service.action.networkConnectionAction.connectionDirection
     * - service.action.networkConnectionAction.localPortDetails.port
     * - service.action.networkConnectionAction.protocol
     * - service.action.networkConnectionAction.remoteIpDetails.city.cityName
     * - service.action.networkConnectionAction.remoteIpDetails.country.countryName
     * - service.action.networkConnectionAction.remoteIpDetails.ipAddressV4
     * - service.action.networkConnectionAction.remoteIpDetails.organization.asn
     * - service.action.networkConnectionAction.remoteIpDetails.organization.asnOrg
     * - service.action.networkConnectionAction.remotePortDetails.port
     * - service.action.awsApiCallAction.remoteAccountDetails.affiliated
     * - service.action.kubernetesApiCallAction.remoteIpDetails.ipAddressV4
     * - service.action.kubernetesApiCallAction.requestUri
     * - service.action.networkConnectionAction.localIpDetails.ipAddressV4
     * - service.action.networkConnectionAction.protocol
     * - service.action.awsApiCallAction.serviceName
     * - service.action.awsApiCallAction.remoteAccountDetails.accountId
     * - service.additionalInfo.threatListName
     * - service.resourceRole
     * - resource.eksClusterDetails.name
     * - resource.kubernetesDetails.kubernetesWorkloadDetails.name
     * - resource.kubernetesDetails.kubernetesWorkloadDetails.namespace
     * - resource.kubernetesDetails.kubernetesUserDetails.username
     * - resource.kubernetesDetails.kubernetesWorkloadDetails.containers.image
     * - resource.kubernetesDetails.kubernetesWorkloadDetails.containers.imagePrefix
     * - service.ebsVolumeScanDetails.scanId
     * - service.ebsVolumeScanDetails.scanDetections.threatDetectedByName.threatNames.name
     * - service.ebsVolumeScanDetails.scanDetections.threatDetectedByName.threatNames.severity
     * - service.ebsVolumeScanDetails.scanDetections.threatDetectedByName.threatNames.filePaths.hash
     * - resource.ecsClusterDetails.name
     * - resource.ecsClusterDetails.taskDetails.containers.image
     * - resource.ecsClusterDetails.taskDetails.definitionArn
     * - resource.containerDetails.image
     * - resource.rdsDbInstanceDetails.dbInstanceIdentifier
     * - resource.rdsDbInstanceDetails.dbClusterIdentifier
     * - resource.rdsDbInstanceDetails.engine
     * - resource.rdsDbUserDetails.user
     * - resource.rdsDbInstanceDetails.tags.key
     * - resource.rdsDbInstanceDetails.tags.value
     * - service.runtimeDetails.process.executableSha256
     * - service.runtimeDetails.process.name
     * - service.runtimeDetails.process.name
     * - resource.lambdaDetails.functionName
     * - resource.lambdaDetails.functionArn
     * - resource.lambdaDetails.tags.key
     * - resource.lambdaDetails.tags.value
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html#cfn-guardduty-filter-findingcriteria-criterion
     */
    readonly criterion?: any | cdk.IResolvable;

    /**
     * Specifies the condition to be applied to a single field when filtering through findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html#cfn-guardduty-filter-findingcriteria-itemtype
     */
    readonly itemType?: CfnFilter.ConditionProperty | cdk.IResolvable;
  }

  /**
   * Specifies the condition to apply to a single field when filtering through GuardDuty findings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html
   */
  export interface ConditionProperty {
    /**
     * Represents the equal condition to apply to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-eq
     */
    readonly eq?: Array<string>;

    /**
     * Represents an *equal* ** condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-equals
     */
    readonly equalTo?: Array<string>;

    /**
     * Represents a *greater than* condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-greaterthan
     */
    readonly greaterThan?: number;

    /**
     * Represents a *greater than or equal* condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-greaterthanorequal
     */
    readonly greaterThanOrEqual?: number;

    /**
     * Represents a *greater than* condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-gt
     */
    readonly gt?: number;

    /**
     * Represents the greater than or equal condition to apply to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-gte
     */
    readonly gte?: number;

    /**
     * Represents a *less than* condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-lessthan
     */
    readonly lessThan?: number;

    /**
     * Represents a *less than or equal* condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-lessthanorequal
     */
    readonly lessThanOrEqual?: number;

    /**
     * Represents the less than condition to apply to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-lt
     */
    readonly lt?: number;

    /**
     * Represents the less than or equal condition to apply to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-lte
     */
    readonly lte?: number;

    /**
     * Represents the not equal condition to apply to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-neq
     */
    readonly neq?: Array<string>;

    /**
     * Represents a *not equal* ** condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-notequals
     */
    readonly notEquals?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnFilter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html
 */
export interface CfnFilterProps {
  /**
   * Specifies the action that is to be applied to the findings that match the filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-action
   */
  readonly action: string;

  /**
   * The description of the filter.
   *
   * Valid characters include alphanumeric characters, and special characters such as hyphen, period, colon, underscore, parentheses ( `{ }` , `[ ]` , and `( )` ), forward slash, horizontal tab, vertical tab, newline, form feed, return, and whitespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-description
   */
  readonly description: string;

  /**
   * The ID of the detector belonging to the GuardDuty account that you want to create a filter for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-detectorid
   */
  readonly detectorId: string;

  /**
   * Represents the criteria to be used in the filter for querying findings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-findingcriteria
   */
  readonly findingCriteria: CfnFilter.FindingCriteriaProperty | cdk.IResolvable;

  /**
   * The name of the filter.
   *
   * Valid characters include period (.), underscore (_), dash (-), and alphanumeric characters. A whitespace is considered to be an invalid character.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-name
   */
  readonly name: string;

  /**
   * Specifies the position of the filter in the list of current filters.
   *
   * Also specifies the order in which this filter is applied to the findings. The minimum value for this property is 1 and the maximum is 100.
   *
   * By default, filters may not be created in the same order as they are ranked. To ensure that the filters are created in the expected order, you can use an optional attribute, [DependsOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) , with the following syntax: `"DependsOn":[ "ObjectName" ]` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-rank
   */
  readonly rank: number;

  /**
   * The tags to be added to a new filter resource.
   *
   * Each tag consists of a key and an optional value, both of which you define.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eq", cdk.listValidator(cdk.validateString))(properties.eq));
  errors.collect(cdk.propertyValidator("equalTo", cdk.listValidator(cdk.validateString))(properties.equalTo));
  errors.collect(cdk.propertyValidator("greaterThan", cdk.validateNumber)(properties.greaterThan));
  errors.collect(cdk.propertyValidator("greaterThanOrEqual", cdk.validateNumber)(properties.greaterThanOrEqual));
  errors.collect(cdk.propertyValidator("gt", cdk.validateNumber)(properties.gt));
  errors.collect(cdk.propertyValidator("gte", cdk.validateNumber)(properties.gte));
  errors.collect(cdk.propertyValidator("lessThan", cdk.validateNumber)(properties.lessThan));
  errors.collect(cdk.propertyValidator("lessThanOrEqual", cdk.validateNumber)(properties.lessThanOrEqual));
  errors.collect(cdk.propertyValidator("lt", cdk.validateNumber)(properties.lt));
  errors.collect(cdk.propertyValidator("lte", cdk.validateNumber)(properties.lte));
  errors.collect(cdk.propertyValidator("neq", cdk.listValidator(cdk.validateString))(properties.neq));
  errors.collect(cdk.propertyValidator("notEquals", cdk.listValidator(cdk.validateString))(properties.notEquals));
  return errors.wrap("supplied properties not correct for \"ConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterConditionPropertyValidator(properties).assertSuccess();
  return {
    "Eq": cdk.listMapper(cdk.stringToCloudFormation)(properties.eq),
    "Equals": cdk.listMapper(cdk.stringToCloudFormation)(properties.equalTo),
    "GreaterThan": cdk.numberToCloudFormation(properties.greaterThan),
    "GreaterThanOrEqual": cdk.numberToCloudFormation(properties.greaterThanOrEqual),
    "Gt": cdk.numberToCloudFormation(properties.gt),
    "Gte": cdk.numberToCloudFormation(properties.gte),
    "LessThan": cdk.numberToCloudFormation(properties.lessThan),
    "LessThanOrEqual": cdk.numberToCloudFormation(properties.lessThanOrEqual),
    "Lt": cdk.numberToCloudFormation(properties.lt),
    "Lte": cdk.numberToCloudFormation(properties.lte),
    "Neq": cdk.listMapper(cdk.stringToCloudFormation)(properties.neq),
    "NotEquals": cdk.listMapper(cdk.stringToCloudFormation)(properties.notEquals)
  };
}

// @ts-ignore TS6133
function CfnFilterConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFilter.ConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.ConditionProperty>();
  ret.addPropertyResult("eq", "Eq", (properties.Eq != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Eq) : undefined));
  ret.addPropertyResult("equalTo", "Equals", (properties.Equals != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Equals) : undefined));
  ret.addPropertyResult("greaterThan", "GreaterThan", (properties.GreaterThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.GreaterThan) : undefined));
  ret.addPropertyResult("greaterThanOrEqual", "GreaterThanOrEqual", (properties.GreaterThanOrEqual != null ? cfn_parse.FromCloudFormation.getNumber(properties.GreaterThanOrEqual) : undefined));
  ret.addPropertyResult("gt", "Gt", (properties.Gt != null ? cfn_parse.FromCloudFormation.getNumber(properties.Gt) : undefined));
  ret.addPropertyResult("gte", "Gte", (properties.Gte != null ? cfn_parse.FromCloudFormation.getNumber(properties.Gte) : undefined));
  ret.addPropertyResult("lessThan", "LessThan", (properties.LessThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.LessThan) : undefined));
  ret.addPropertyResult("lessThanOrEqual", "LessThanOrEqual", (properties.LessThanOrEqual != null ? cfn_parse.FromCloudFormation.getNumber(properties.LessThanOrEqual) : undefined));
  ret.addPropertyResult("lt", "Lt", (properties.Lt != null ? cfn_parse.FromCloudFormation.getNumber(properties.Lt) : undefined));
  ret.addPropertyResult("lte", "Lte", (properties.Lte != null ? cfn_parse.FromCloudFormation.getNumber(properties.Lte) : undefined));
  ret.addPropertyResult("neq", "Neq", (properties.Neq != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Neq) : undefined));
  ret.addPropertyResult("notEquals", "NotEquals", (properties.NotEquals != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotEquals) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FindingCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `FindingCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterFindingCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("criterion", cdk.validateObject)(properties.criterion));
  errors.collect(cdk.propertyValidator("itemType", CfnFilterConditionPropertyValidator)(properties.itemType));
  return errors.wrap("supplied properties not correct for \"FindingCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterFindingCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterFindingCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Criterion": cdk.objectToCloudFormation(properties.criterion),
    "ItemType": convertCfnFilterConditionPropertyToCloudFormation(properties.itemType)
  };
}

// @ts-ignore TS6133
function CfnFilterFindingCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFilter.FindingCriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.FindingCriteriaProperty>();
  ret.addPropertyResult("criterion", "Criterion", (properties.Criterion != null ? cfn_parse.FromCloudFormation.getAny(properties.Criterion) : undefined));
  ret.addPropertyResult("itemType", "ItemType", (properties.ItemType != null ? CfnFilterConditionPropertyFromCloudFormation(properties.ItemType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnFilterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("detectorId", cdk.requiredValidator)(properties.detectorId));
  errors.collect(cdk.propertyValidator("detectorId", cdk.validateString)(properties.detectorId));
  errors.collect(cdk.propertyValidator("findingCriteria", cdk.requiredValidator)(properties.findingCriteria));
  errors.collect(cdk.propertyValidator("findingCriteria", CfnFilterFindingCriteriaPropertyValidator)(properties.findingCriteria));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rank", cdk.requiredValidator)(properties.rank));
  errors.collect(cdk.propertyValidator("rank", cdk.validateNumber)(properties.rank));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFilterProps\"");
}

// @ts-ignore TS6133
function convertCfnFilterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterPropsValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DetectorId": cdk.stringToCloudFormation(properties.detectorId),
    "FindingCriteria": convertCfnFilterFindingCriteriaPropertyToCloudFormation(properties.findingCriteria),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Rank": cdk.numberToCloudFormation(properties.rank),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFilterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilterProps>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("detectorId", "DetectorId", (properties.DetectorId != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorId) : undefined));
  ret.addPropertyResult("findingCriteria", "FindingCriteria", (properties.FindingCriteria != null ? CfnFilterFindingCriteriaPropertyFromCloudFormation(properties.FindingCriteria) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rank", "Rank", (properties.Rank != null ? cfn_parse.FromCloudFormation.getNumber(properties.Rank) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GuardDuty::IPSet` resource specifies a new `IPSet` .
 *
 * An `IPSet` is a list of trusted IP addresses from which secure communication is allowed with AWS infrastructure and applications.
 *
 * @cloudformationResource AWS::GuardDuty::IPSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html
 */
export class CfnIPSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GuardDuty::IPSet";

  /**
   * Build a CfnIPSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIPSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIPSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIPSet(scope, id, propsResult.value);
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
   * Indicates whether or not GuardDuty uses the `IPSet` .
   */
  public activate?: boolean | cdk.IResolvable;

  /**
   * The unique ID of the detector of the GuardDuty account that you want to create an IPSet for.
   */
  public detectorId?: string;

  /**
   * The format of the file that contains the IPSet.
   */
  public format: string;

  /**
   * The URI of the file that contains the IPSet.
   */
  public location: string;

  /**
   * The user-friendly name to identify the IPSet.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to be added to a new IP set resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIPSetProps) {
    super(scope, id, {
      "type": CfnIPSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "format", this);
    cdk.requireProperty(props, "location", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.activate = props.activate;
    this.detectorId = props.detectorId;
    this.format = props.format;
    this.location = props.location;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GuardDuty::IPSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "activate": this.activate,
      "detectorId": this.detectorId,
      "format": this.format,
      "location": this.location,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIPSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIPSetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnIPSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html
 */
export interface CfnIPSetProps {
  /**
   * Indicates whether or not GuardDuty uses the `IPSet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-activate
   */
  readonly activate?: boolean | cdk.IResolvable;

  /**
   * The unique ID of the detector of the GuardDuty account that you want to create an IPSet for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-detectorid
   */
  readonly detectorId?: string;

  /**
   * The format of the file that contains the IPSet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-format
   */
  readonly format: string;

  /**
   * The URI of the file that contains the IPSet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-location
   */
  readonly location: string;

  /**
   * The user-friendly name to identify the IPSet.
   *
   * Allowed characters are alphanumeric, whitespace, dash (-), and underscores (_).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-name
   */
  readonly name?: string;

  /**
   * The tags to be added to a new IP set resource.
   *
   * Each tag consists of a key and an optional value, both of which you define.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnIPSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnIPSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIPSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activate", cdk.validateBoolean)(properties.activate));
  errors.collect(cdk.propertyValidator("detectorId", cdk.validateString)(properties.detectorId));
  errors.collect(cdk.propertyValidator("format", cdk.requiredValidator)(properties.format));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("location", cdk.requiredValidator)(properties.location));
  errors.collect(cdk.propertyValidator("location", cdk.validateString)(properties.location));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnIPSetProps\"");
}

// @ts-ignore TS6133
function convertCfnIPSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIPSetPropsValidator(properties).assertSuccess();
  return {
    "Activate": cdk.booleanToCloudFormation(properties.activate),
    "DetectorId": cdk.stringToCloudFormation(properties.detectorId),
    "Format": cdk.stringToCloudFormation(properties.format),
    "Location": cdk.stringToCloudFormation(properties.location),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnIPSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIPSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIPSetProps>();
  ret.addPropertyResult("activate", "Activate", (properties.Activate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Activate) : undefined));
  ret.addPropertyResult("detectorId", "DetectorId", (properties.DetectorId != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorId) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * You can use the `AWS::GuardDuty::Master` resource in a GuardDuty member account to accept an invitation from a GuardDuty administrator account.
 *
 * The invitation to the member account must be sent prior to using the `AWS::GuardDuty::Master` resource to accept the administrator account's invitation. You can invite a member account by using the `InviteMembers` operation of the GuardDuty API, or by creating an `AWS::GuardDuty::Member` resource.
 *
 * @cloudformationResource AWS::GuardDuty::Master
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html
 */
export class CfnMaster extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GuardDuty::Master";

  /**
   * Build a CfnMaster from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMaster {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMasterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMaster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique ID of the detector of the GuardDuty member account.
   */
  public detectorId: string;

  /**
   * The ID of the invitation that is sent to the account designated as a member account.
   */
  public invitationId?: string;

  public masterId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMasterProps) {
    super(scope, id, {
      "type": CfnMaster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "detectorId", this);
    cdk.requireProperty(props, "masterId", this);

    this.detectorId = props.detectorId;
    this.invitationId = props.invitationId;
    this.masterId = props.masterId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "detectorId": this.detectorId,
      "invitationId": this.invitationId,
      "masterId": this.masterId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMaster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMasterPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnMaster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html
 */
export interface CfnMasterProps {
  /**
   * The unique ID of the detector of the GuardDuty member account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-detectorid
   */
  readonly detectorId: string;

  /**
   * The ID of the invitation that is sent to the account designated as a member account.
   *
   * You can find the invitation ID by using the ListInvitation action of the GuardDuty API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-invitationid
   */
  readonly invitationId?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-masterid
   */
  readonly masterId: string;
}

/**
 * Determine whether the given properties match those of a `CfnMasterProps`
 *
 * @param properties - the TypeScript properties of a `CfnMasterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMasterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("detectorId", cdk.requiredValidator)(properties.detectorId));
  errors.collect(cdk.propertyValidator("detectorId", cdk.validateString)(properties.detectorId));
  errors.collect(cdk.propertyValidator("invitationId", cdk.validateString)(properties.invitationId));
  errors.collect(cdk.propertyValidator("masterId", cdk.requiredValidator)(properties.masterId));
  errors.collect(cdk.propertyValidator("masterId", cdk.validateString)(properties.masterId));
  return errors.wrap("supplied properties not correct for \"CfnMasterProps\"");
}

// @ts-ignore TS6133
function convertCfnMasterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMasterPropsValidator(properties).assertSuccess();
  return {
    "DetectorId": cdk.stringToCloudFormation(properties.detectorId),
    "InvitationId": cdk.stringToCloudFormation(properties.invitationId),
    "MasterId": cdk.stringToCloudFormation(properties.masterId)
  };
}

// @ts-ignore TS6133
function CfnMasterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMasterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMasterProps>();
  ret.addPropertyResult("detectorId", "DetectorId", (properties.DetectorId != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorId) : undefined));
  ret.addPropertyResult("invitationId", "InvitationId", (properties.InvitationId != null ? cfn_parse.FromCloudFormation.getString(properties.InvitationId) : undefined));
  ret.addPropertyResult("masterId", "MasterId", (properties.MasterId != null ? cfn_parse.FromCloudFormation.getString(properties.MasterId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * You can use the `AWS::GuardDuty::Member` resource to add an AWS account as a GuardDuty member account to the current GuardDuty administrator account.
 *
 * If the value of the `Status` property is not provided or is set to `Created` , a member account is created but not invited. If the value of the `Status` property is set to `Invited` , a member account is created and invited. An `AWS::GuardDuty::Member` resource must be created with the `Status` property set to `Invited` before the `AWS::GuardDuty::Master` resource can be created in a GuardDuty member account.
 *
 * @cloudformationResource AWS::GuardDuty::Member
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html
 */
export class CfnMember extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GuardDuty::Member";

  /**
   * Build a CfnMember from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMember {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMemberPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMember(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the detector associated with the GuardDuty service to add the member to.
   */
  public detectorId: string;

  /**
   * Specifies whether or not to disable email notification for the member account that you invite.
   */
  public disableEmailNotification?: boolean | cdk.IResolvable;

  /**
   * The email address associated with the member account.
   */
  public email: string;

  public memberId: string;

  /**
   * The invitation message that you want to send to the accounts that you're inviting to GuardDuty as members.
   */
  public message?: string;

  /**
   * You can use the `Status` property to update the status of the relationship between the member account and its administrator account.
   */
  public status?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMemberProps) {
    super(scope, id, {
      "type": CfnMember.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "detectorId", this);
    cdk.requireProperty(props, "email", this);
    cdk.requireProperty(props, "memberId", this);

    this.detectorId = props.detectorId;
    this.disableEmailNotification = props.disableEmailNotification;
    this.email = props.email;
    this.memberId = props.memberId;
    this.message = props.message;
    this.status = props.status;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "detectorId": this.detectorId,
      "disableEmailNotification": this.disableEmailNotification,
      "email": this.email,
      "memberId": this.memberId,
      "message": this.message,
      "status": this.status
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMember.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMemberPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnMember`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html
 */
export interface CfnMemberProps {
  /**
   * The ID of the detector associated with the GuardDuty service to add the member to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-detectorid
   */
  readonly detectorId: string;

  /**
   * Specifies whether or not to disable email notification for the member account that you invite.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-disableemailnotification
   */
  readonly disableEmailNotification?: boolean | cdk.IResolvable;

  /**
   * The email address associated with the member account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-email
   */
  readonly email: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-memberid
   */
  readonly memberId: string;

  /**
   * The invitation message that you want to send to the accounts that you're inviting to GuardDuty as members.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-message
   */
  readonly message?: string;

  /**
   * You can use the `Status` property to update the status of the relationship between the member account and its administrator account.
   *
   * Valid values are `Created` and `Invited` when using an `AWS::GuardDuty::Member` resource. If the value for this property is not provided or set to `Created` , a member account is created but not invited. If the value of this property is set to `Invited` , a member account is created and invited.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-status
   */
  readonly status?: string;
}

/**
 * Determine whether the given properties match those of a `CfnMemberProps`
 *
 * @param properties - the TypeScript properties of a `CfnMemberProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("detectorId", cdk.requiredValidator)(properties.detectorId));
  errors.collect(cdk.propertyValidator("detectorId", cdk.validateString)(properties.detectorId));
  errors.collect(cdk.propertyValidator("disableEmailNotification", cdk.validateBoolean)(properties.disableEmailNotification));
  errors.collect(cdk.propertyValidator("email", cdk.requiredValidator)(properties.email));
  errors.collect(cdk.propertyValidator("email", cdk.validateString)(properties.email));
  errors.collect(cdk.propertyValidator("memberId", cdk.requiredValidator)(properties.memberId));
  errors.collect(cdk.propertyValidator("memberId", cdk.validateString)(properties.memberId));
  errors.collect(cdk.propertyValidator("message", cdk.validateString)(properties.message));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"CfnMemberProps\"");
}

// @ts-ignore TS6133
function convertCfnMemberPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberPropsValidator(properties).assertSuccess();
  return {
    "DetectorId": cdk.stringToCloudFormation(properties.detectorId),
    "DisableEmailNotification": cdk.booleanToCloudFormation(properties.disableEmailNotification),
    "Email": cdk.stringToCloudFormation(properties.email),
    "MemberId": cdk.stringToCloudFormation(properties.memberId),
    "Message": cdk.stringToCloudFormation(properties.message),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnMemberPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMemberProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMemberProps>();
  ret.addPropertyResult("detectorId", "DetectorId", (properties.DetectorId != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorId) : undefined));
  ret.addPropertyResult("disableEmailNotification", "DisableEmailNotification", (properties.DisableEmailNotification != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableEmailNotification) : undefined));
  ret.addPropertyResult("email", "Email", (properties.Email != null ? cfn_parse.FromCloudFormation.getString(properties.Email) : undefined));
  ret.addPropertyResult("memberId", "MemberId", (properties.MemberId != null ? cfn_parse.FromCloudFormation.getString(properties.MemberId) : undefined));
  ret.addPropertyResult("message", "Message", (properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::GuardDuty::ThreatIntelSet` resource specifies a new `ThreatIntelSet` .
 *
 * A `ThreatIntelSet` consists of known malicious IP addresses. GuardDuty generates findings based on the `ThreatIntelSet` when it is activated.
 *
 * @cloudformationResource AWS::GuardDuty::ThreatIntelSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html
 */
export class CfnThreatIntelSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GuardDuty::ThreatIntelSet";

  /**
   * Build a CfnThreatIntelSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnThreatIntelSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnThreatIntelSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnThreatIntelSet(scope, id, propsResult.value);
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
   * A Boolean value that indicates whether GuardDuty is to start using the uploaded ThreatIntelSet.
   */
  public activate?: boolean | cdk.IResolvable;

  /**
   * The unique ID of the detector of the GuardDuty account that you want to create a threatIntelSet for.
   */
  public detectorId?: string;

  /**
   * The format of the file that contains the ThreatIntelSet.
   */
  public format: string;

  /**
   * The URI of the file that contains the ThreatIntelSet.
   */
  public location: string;

  /**
   * A user-friendly ThreatIntelSet name displayed in all findings that are generated by activity that involves IP addresses included in this ThreatIntelSet.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to be added to a new threat list resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnThreatIntelSetProps) {
    super(scope, id, {
      "type": CfnThreatIntelSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "format", this);
    cdk.requireProperty(props, "location", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.activate = props.activate;
    this.detectorId = props.detectorId;
    this.format = props.format;
    this.location = props.location;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GuardDuty::ThreatIntelSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "activate": this.activate,
      "detectorId": this.detectorId,
      "format": this.format,
      "location": this.location,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnThreatIntelSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnThreatIntelSetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnThreatIntelSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html
 */
export interface CfnThreatIntelSetProps {
  /**
   * A Boolean value that indicates whether GuardDuty is to start using the uploaded ThreatIntelSet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-activate
   */
  readonly activate?: boolean | cdk.IResolvable;

  /**
   * The unique ID of the detector of the GuardDuty account that you want to create a threatIntelSet for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-detectorid
   */
  readonly detectorId?: string;

  /**
   * The format of the file that contains the ThreatIntelSet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-format
   */
  readonly format: string;

  /**
   * The URI of the file that contains the ThreatIntelSet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-location
   */
  readonly location: string;

  /**
   * A user-friendly ThreatIntelSet name displayed in all findings that are generated by activity that involves IP addresses included in this ThreatIntelSet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-name
   */
  readonly name?: string;

  /**
   * The tags to be added to a new threat list resource.
   *
   * Each tag consists of a key and an optional value, both of which you define.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnThreatIntelSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnThreatIntelSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThreatIntelSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activate", cdk.validateBoolean)(properties.activate));
  errors.collect(cdk.propertyValidator("detectorId", cdk.validateString)(properties.detectorId));
  errors.collect(cdk.propertyValidator("format", cdk.requiredValidator)(properties.format));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("location", cdk.requiredValidator)(properties.location));
  errors.collect(cdk.propertyValidator("location", cdk.validateString)(properties.location));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnThreatIntelSetProps\"");
}

// @ts-ignore TS6133
function convertCfnThreatIntelSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThreatIntelSetPropsValidator(properties).assertSuccess();
  return {
    "Activate": cdk.booleanToCloudFormation(properties.activate),
    "DetectorId": cdk.stringToCloudFormation(properties.detectorId),
    "Format": cdk.stringToCloudFormation(properties.format),
    "Location": cdk.stringToCloudFormation(properties.location),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnThreatIntelSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThreatIntelSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThreatIntelSetProps>();
  ret.addPropertyResult("activate", "Activate", (properties.Activate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Activate) : undefined));
  ret.addPropertyResult("detectorId", "DetectorId", (properties.DetectorId != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorId) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}