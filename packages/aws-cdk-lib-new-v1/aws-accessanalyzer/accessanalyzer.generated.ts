/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::AccessAnalyzer::Analyzer` resource specifies a new analyzer.
 *
 * The analyzer is an object that represents the IAM Access Analyzer feature. An analyzer is required for Access Analyzer to become operational.
 *
 * @cloudformationResource AWS::AccessAnalyzer::Analyzer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html
 */
export class CfnAnalyzer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AccessAnalyzer::Analyzer";

  /**
   * Build a CfnAnalyzer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnalyzer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAnalyzerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAnalyzer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the analyzer that was created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Contains information about the configuration of an unused access analyzer for an AWS organization or account.
   */
  public analyzerConfiguration?: CfnAnalyzer.AnalyzerConfigurationProperty | cdk.IResolvable;

  /**
   * The name of the analyzer.
   */
  public analyzerName?: string;

  /**
   * Specifies the archive rules to add for the analyzer.
   */
  public archiveRules?: Array<CfnAnalyzer.ArchiveRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to the analyzer.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type represents the zone of trust for the analyzer.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAnalyzerProps) {
    super(scope, id, {
      "type": CfnAnalyzer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "type", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.analyzerConfiguration = props.analyzerConfiguration;
    this.analyzerName = props.analyzerName;
    this.archiveRules = props.archiveRules;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AccessAnalyzer::Analyzer", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "analyzerConfiguration": this.analyzerConfiguration,
      "analyzerName": this.analyzerName,
      "archiveRules": this.archiveRules,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnalyzer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAnalyzerPropsToCloudFormation(props);
  }
}

export namespace CfnAnalyzer {
  /**
   * Contains information about an archive rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html
   */
  export interface ArchiveRuleProperty {
    /**
     * The criteria for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html#cfn-accessanalyzer-analyzer-archiverule-filter
     */
    readonly filter: Array<CfnAnalyzer.FilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the rule to create.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html#cfn-accessanalyzer-analyzer-archiverule-rulename
     */
    readonly ruleName: string;
  }

  /**
   * The criteria that defines the archive rule.
   *
   * To learn about filter keys that you can use to create an archive rule, see [filter keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-filter-keys.html) in the *User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html
   */
  export interface FilterProperty {
    /**
     * A "contains" condition to match for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-contains
     */
    readonly contains?: Array<string>;

    /**
     * An "equals" condition to match for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-eq
     */
    readonly eq?: Array<string>;

    /**
     * An "exists" condition to match for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-exists
     */
    readonly exists?: boolean | cdk.IResolvable;

    /**
     * A "not equal" condition to match for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-neq
     */
    readonly neq?: Array<string>;

    /**
     * The property used to define the criteria in the filter for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-property
     */
    readonly property: string;
  }

  /**
   * Contains information about the configuration of an unused access analyzer for an AWS organization or account.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analyzerconfiguration.html
   */
  export interface AnalyzerConfigurationProperty {
    /**
     * Specifies the configuration of an unused access analyzer for an AWS organization or account.
     *
     * External access analyzers do not support any configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analyzerconfiguration.html#cfn-accessanalyzer-analyzer-analyzerconfiguration-unusedaccessconfiguration
     */
    readonly unusedAccessConfiguration?: cdk.IResolvable | CfnAnalyzer.UnusedAccessConfigurationProperty;
  }

  /**
   * Contains information about an unused access analyzer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-unusedaccessconfiguration.html
   */
  export interface UnusedAccessConfigurationProperty {
    /**
     * The specified access age in days for which to generate findings for unused access.
     *
     * For example, if you specify 90 days, the analyzer will generate findings for IAM entities within the accounts of the selected organization for any access that hasn't been used in 90 or more days since the analyzer's last scan. You can choose a value between 1 and 180 days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-unusedaccessconfiguration.html#cfn-accessanalyzer-analyzer-unusedaccessconfiguration-unusedaccessage
     */
    readonly unusedAccessAge?: number;
  }
}

/**
 * Properties for defining a `CfnAnalyzer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html
 */
export interface CfnAnalyzerProps {
  /**
   * Contains information about the configuration of an unused access analyzer for an AWS organization or account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-analyzerconfiguration
   */
  readonly analyzerConfiguration?: CfnAnalyzer.AnalyzerConfigurationProperty | cdk.IResolvable;

  /**
   * The name of the analyzer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-analyzername
   */
  readonly analyzerName?: string;

  /**
   * Specifies the archive rules to add for the analyzer.
   *
   * Archive rules automatically archive findings that meet the criteria you define for the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-archiverules
   */
  readonly archiveRules?: Array<CfnAnalyzer.ArchiveRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to the analyzer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type represents the zone of trust for the analyzer.
   *
   * *Allowed Values* : ACCOUNT | ORGANIZATION | ACCOUNT_UNUSED_ACCESS | ORGANIZATION_UNUSED_ACCESS
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalyzerFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contains", cdk.listValidator(cdk.validateString))(properties.contains));
  errors.collect(cdk.propertyValidator("eq", cdk.listValidator(cdk.validateString))(properties.eq));
  errors.collect(cdk.propertyValidator("exists", cdk.validateBoolean)(properties.exists));
  errors.collect(cdk.propertyValidator("neq", cdk.listValidator(cdk.validateString))(properties.neq));
  errors.collect(cdk.propertyValidator("property", cdk.requiredValidator)(properties.property));
  errors.collect(cdk.propertyValidator("property", cdk.validateString)(properties.property));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnalyzerFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalyzerFilterPropertyValidator(properties).assertSuccess();
  return {
    "Contains": cdk.listMapper(cdk.stringToCloudFormation)(properties.contains),
    "Eq": cdk.listMapper(cdk.stringToCloudFormation)(properties.eq),
    "Exists": cdk.booleanToCloudFormation(properties.exists),
    "Neq": cdk.listMapper(cdk.stringToCloudFormation)(properties.neq),
    "Property": cdk.stringToCloudFormation(properties.property)
  };
}

// @ts-ignore TS6133
function CfnAnalyzerFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalyzer.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalyzer.FilterProperty>();
  ret.addPropertyResult("contains", "Contains", (properties.Contains != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Contains) : undefined));
  ret.addPropertyResult("eq", "Eq", (properties.Eq != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Eq) : undefined));
  ret.addPropertyResult("exists", "Exists", (properties.Exists != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Exists) : undefined));
  ret.addPropertyResult("neq", "Neq", (properties.Neq != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Neq) : undefined));
  ret.addPropertyResult("property", "Property", (properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ArchiveRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalyzerArchiveRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filter", cdk.requiredValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("filter", cdk.listValidator(CfnAnalyzerFilterPropertyValidator))(properties.filter));
  errors.collect(cdk.propertyValidator("ruleName", cdk.requiredValidator)(properties.ruleName));
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  return errors.wrap("supplied properties not correct for \"ArchiveRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnalyzerArchiveRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalyzerArchiveRulePropertyValidator(properties).assertSuccess();
  return {
    "Filter": cdk.listMapper(convertCfnAnalyzerFilterPropertyToCloudFormation)(properties.filter),
    "RuleName": cdk.stringToCloudFormation(properties.ruleName)
  };
}

// @ts-ignore TS6133
function CfnAnalyzerArchiveRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalyzer.ArchiveRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalyzer.ArchiveRuleProperty>();
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalyzerFilterPropertyFromCloudFormation)(properties.Filter) : undefined));
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UnusedAccessConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `UnusedAccessConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalyzerUnusedAccessConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unusedAccessAge", cdk.validateNumber)(properties.unusedAccessAge));
  return errors.wrap("supplied properties not correct for \"UnusedAccessConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnalyzerUnusedAccessConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalyzerUnusedAccessConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "UnusedAccessAge": cdk.numberToCloudFormation(properties.unusedAccessAge)
  };
}

// @ts-ignore TS6133
function CfnAnalyzerUnusedAccessConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnalyzer.UnusedAccessConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalyzer.UnusedAccessConfigurationProperty>();
  ret.addPropertyResult("unusedAccessAge", "UnusedAccessAge", (properties.UnusedAccessAge != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnusedAccessAge) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnalyzerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AnalyzerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalyzerAnalyzerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unusedAccessConfiguration", CfnAnalyzerUnusedAccessConfigurationPropertyValidator)(properties.unusedAccessConfiguration));
  return errors.wrap("supplied properties not correct for \"AnalyzerConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnalyzerAnalyzerConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalyzerAnalyzerConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "UnusedAccessConfiguration": convertCfnAnalyzerUnusedAccessConfigurationPropertyToCloudFormation(properties.unusedAccessConfiguration)
  };
}

// @ts-ignore TS6133
function CfnAnalyzerAnalyzerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalyzer.AnalyzerConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalyzer.AnalyzerConfigurationProperty>();
  ret.addPropertyResult("unusedAccessConfiguration", "UnusedAccessConfiguration", (properties.UnusedAccessConfiguration != null ? CfnAnalyzerUnusedAccessConfigurationPropertyFromCloudFormation(properties.UnusedAccessConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAnalyzerProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnalyzerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnalyzerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("analyzerConfiguration", CfnAnalyzerAnalyzerConfigurationPropertyValidator)(properties.analyzerConfiguration));
  errors.collect(cdk.propertyValidator("analyzerName", cdk.validateString)(properties.analyzerName));
  errors.collect(cdk.propertyValidator("archiveRules", cdk.listValidator(CfnAnalyzerArchiveRulePropertyValidator))(properties.archiveRules));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnAnalyzerProps\"");
}

// @ts-ignore TS6133
function convertCfnAnalyzerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnalyzerPropsValidator(properties).assertSuccess();
  return {
    "AnalyzerConfiguration": convertCfnAnalyzerAnalyzerConfigurationPropertyToCloudFormation(properties.analyzerConfiguration),
    "AnalyzerName": cdk.stringToCloudFormation(properties.analyzerName),
    "ArchiveRules": cdk.listMapper(convertCfnAnalyzerArchiveRulePropertyToCloudFormation)(properties.archiveRules),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAnalyzerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnalyzerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnalyzerProps>();
  ret.addPropertyResult("analyzerConfiguration", "AnalyzerConfiguration", (properties.AnalyzerConfiguration != null ? CfnAnalyzerAnalyzerConfigurationPropertyFromCloudFormation(properties.AnalyzerConfiguration) : undefined));
  ret.addPropertyResult("analyzerName", "AnalyzerName", (properties.AnalyzerName != null ? cfn_parse.FromCloudFormation.getString(properties.AnalyzerName) : undefined));
  ret.addPropertyResult("archiveRules", "ArchiveRules", (properties.ArchiveRules != null ? cfn_parse.FromCloudFormation.getArray(CfnAnalyzerArchiveRulePropertyFromCloudFormation)(properties.ArchiveRules) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}