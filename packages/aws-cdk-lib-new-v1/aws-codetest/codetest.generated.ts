/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Resource Type definition for AWS::CodeTest::PersistentConfiguration.
 *
 * @cloudformationResource AWS::CodeTest::PersistentConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-persistentconfiguration.html
 */
export class CfnPersistentConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeTest::PersistentConfiguration";

  /**
   * Build a CfnPersistentConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPersistentConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPersistentConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPersistentConfiguration(scope, id, propsResult.value);
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

  public name?: string;

  public resultsRoleArn: string;

  public version?: string;

  public vpcConfig?: cdk.IResolvable | CfnPersistentConfiguration.VpcConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPersistentConfigurationProps) {
    super(scope, id, {
      "type": CfnPersistentConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resultsRoleArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.resultsRoleArn = props.resultsRoleArn;
    this.version = props.version;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "resultsRoleArn": this.resultsRoleArn,
      "version": this.version,
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPersistentConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPersistentConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnPersistentConfiguration {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codetest-persistentconfiguration-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codetest-persistentconfiguration-vpcconfig.html#cfn-codetest-persistentconfiguration-vpcconfig-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codetest-persistentconfiguration-vpcconfig.html#cfn-codetest-persistentconfiguration-vpcconfig-subnets
     */
    readonly subnets?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnPersistentConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-persistentconfiguration.html
 */
export interface CfnPersistentConfigurationProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-persistentconfiguration.html#cfn-codetest-persistentconfiguration-name
   */
  readonly name?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-persistentconfiguration.html#cfn-codetest-persistentconfiguration-resultsrolearn
   */
  readonly resultsRoleArn: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-persistentconfiguration.html#cfn-codetest-persistentconfiguration-version
   */
  readonly version?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-persistentconfiguration.html#cfn-codetest-persistentconfiguration-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnPersistentConfiguration.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPersistentConfigurationVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnPersistentConfigurationVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPersistentConfigurationVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnPersistentConfigurationVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPersistentConfiguration.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPersistentConfiguration.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPersistentConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPersistentConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPersistentConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resultsRoleArn", cdk.requiredValidator)(properties.resultsRoleArn));
  errors.collect(cdk.propertyValidator("resultsRoleArn", cdk.validateString)(properties.resultsRoleArn));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnPersistentConfigurationVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"CfnPersistentConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnPersistentConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPersistentConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ResultsRoleArn": cdk.stringToCloudFormation(properties.resultsRoleArn),
    "Version": cdk.stringToCloudFormation(properties.version),
    "VpcConfig": convertCfnPersistentConfigurationVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnPersistentConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPersistentConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPersistentConfigurationProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resultsRoleArn", "ResultsRoleArn", (properties.ResultsRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResultsRoleArn) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnPersistentConfigurationVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Resource Type definition for AWS::CodeTest::Series.
 *
 * @cloudformationResource AWS::CodeTest::Series
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-series.html
 */
export class CfnSeries extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeTest::Series";

  /**
   * Build a CfnSeries from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSeries {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSeriesPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSeries(scope, id, propsResult.value);
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

  public name?: string;

  public persistentConfigurationId: string;

  public runDefinition: any | cdk.IResolvable;

  public state: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSeriesProps) {
    super(scope, id, {
      "type": CfnSeries.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "persistentConfigurationId", this);
    cdk.requireProperty(props, "runDefinition", this);
    cdk.requireProperty(props, "state", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.persistentConfigurationId = props.persistentConfigurationId;
    this.runDefinition = props.runDefinition;
    this.state = props.state;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "persistentConfigurationId": this.persistentConfigurationId,
      "runDefinition": this.runDefinition,
      "state": this.state
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSeries.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSeriesPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSeries`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-series.html
 */
export interface CfnSeriesProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-series.html#cfn-codetest-series-name
   */
  readonly name?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-series.html#cfn-codetest-series-persistentconfigurationid
   */
  readonly persistentConfigurationId: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-series.html#cfn-codetest-series-rundefinition
   */
  readonly runDefinition: any | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codetest-series.html#cfn-codetest-series-state
   */
  readonly state: string;
}

/**
 * Determine whether the given properties match those of a `CfnSeriesProps`
 *
 * @param properties - the TypeScript properties of a `CfnSeriesProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSeriesPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("persistentConfigurationId", cdk.requiredValidator)(properties.persistentConfigurationId));
  errors.collect(cdk.propertyValidator("persistentConfigurationId", cdk.validateString)(properties.persistentConfigurationId));
  errors.collect(cdk.propertyValidator("runDefinition", cdk.requiredValidator)(properties.runDefinition));
  errors.collect(cdk.propertyValidator("runDefinition", cdk.validateObject)(properties.runDefinition));
  errors.collect(cdk.propertyValidator("state", cdk.requiredValidator)(properties.state));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  return errors.wrap("supplied properties not correct for \"CfnSeriesProps\"");
}

// @ts-ignore TS6133
function convertCfnSeriesPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSeriesPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "PersistentConfigurationId": cdk.stringToCloudFormation(properties.persistentConfigurationId),
    "RunDefinition": cdk.objectToCloudFormation(properties.runDefinition),
    "State": cdk.stringToCloudFormation(properties.state)
  };
}

// @ts-ignore TS6133
function CfnSeriesPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSeriesProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSeriesProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("persistentConfigurationId", "PersistentConfigurationId", (properties.PersistentConfigurationId != null ? cfn_parse.FromCloudFormation.getString(properties.PersistentConfigurationId) : undefined));
  ret.addPropertyResult("runDefinition", "RunDefinition", (properties.RunDefinition != null ? cfn_parse.FromCloudFormation.getAny(properties.RunDefinition) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}