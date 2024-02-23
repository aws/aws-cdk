/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specify an AWS App Runner Automatic Scaling configuration by using the `AWS::AppRunner::AutoScalingConfiguration` resource in an AWS CloudFormation template.
 *
 * The `AWS::AppRunner::AutoScalingConfiguration` resource is an AWS App Runner resource type that specifies an App Runner automatic scaling configuration.
 *
 * App Runner requires this resource to set non-default auto scaling settings for instances used to process the web requests. You can share an auto scaling configuration across multiple services.
 *
 * Create multiple revisions of a configuration by calling this action multiple times using the same `AutoScalingConfigurationName` . The call returns incremental `AutoScalingConfigurationRevision` values. When you create a service and configure an auto scaling configuration resource, the service uses the latest active revision of the auto scaling configuration by default. You can optionally configure the service to use a specific revision.
 *
 * Configure a higher `MinSize` to increase the spread of your App Runner service over more Availability Zones in the AWS Region . The tradeoff is a higher minimal cost.
 *
 * Configure a lower `MaxSize` to control your cost. The tradeoff is lower responsiveness during peak demand.
 *
 * @cloudformationResource AWS::AppRunner::AutoScalingConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-autoscalingconfiguration.html
 */
export class CfnAutoScalingConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppRunner::AutoScalingConfiguration";

  /**
   * Build a CfnAutoScalingConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAutoScalingConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAutoScalingConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAutoScalingConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of this auto scaling configuration.
   *
   * @cloudformationAttribute AutoScalingConfigurationArn
   */
  public readonly attrAutoScalingConfigurationArn: string;

  /**
   * The revision of this auto scaling configuration. It's unique among all the active configurations that share the same `AutoScalingConfigurationName` .
   *
   * @cloudformationAttribute AutoScalingConfigurationRevision
   */
  public readonly attrAutoScalingConfigurationRevision: number;

  /**
   * It's set to true for the configuration with the highest `Revision` among all configurations that share the same `AutoScalingConfigurationName` . It's set to false otherwise. App Runner temporarily doubles the number of provisioned instances during deployments, to maintain the same capacity for both old and new code.
   *
   * @cloudformationAttribute Latest
   */
  public readonly attrLatest: cdk.IResolvable;

  /**
   * The customer-provided auto scaling configuration name.
   */
  public autoScalingConfigurationName?: string;

  /**
   * The maximum number of concurrent requests that an instance processes.
   */
  public maxConcurrency?: number;

  /**
   * The maximum number of instances that a service scales up to.
   */
  public maxSize?: number;

  /**
   * The minimum number of instances that App Runner provisions for a service.
   */
  public minSize?: number;

  /**
   * A list of metadata items that you can associate with your auto scaling configuration resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAutoScalingConfigurationProps = {}) {
    super(scope, id, {
      "type": CfnAutoScalingConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrAutoScalingConfigurationArn = cdk.Token.asString(this.getAtt("AutoScalingConfigurationArn", cdk.ResolutionTypeHint.STRING));
    this.attrAutoScalingConfigurationRevision = cdk.Token.asNumber(this.getAtt("AutoScalingConfigurationRevision", cdk.ResolutionTypeHint.NUMBER));
    this.attrLatest = this.getAtt("Latest");
    this.autoScalingConfigurationName = props.autoScalingConfigurationName;
    this.maxConcurrency = props.maxConcurrency;
    this.maxSize = props.maxSize;
    this.minSize = props.minSize;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingConfigurationName": this.autoScalingConfigurationName,
      "maxConcurrency": this.maxConcurrency,
      "maxSize": this.maxSize,
      "minSize": this.minSize,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAutoScalingConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAutoScalingConfigurationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAutoScalingConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-autoscalingconfiguration.html
 */
export interface CfnAutoScalingConfigurationProps {
  /**
   * The customer-provided auto scaling configuration name.
   *
   * It can be used in multiple revisions of a configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-autoscalingconfiguration.html#cfn-apprunner-autoscalingconfiguration-autoscalingconfigurationname
   */
  readonly autoScalingConfigurationName?: string;

  /**
   * The maximum number of concurrent requests that an instance processes.
   *
   * If the number of concurrent requests exceeds this limit, App Runner scales the service up.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-autoscalingconfiguration.html#cfn-apprunner-autoscalingconfiguration-maxconcurrency
   */
  readonly maxConcurrency?: number;

  /**
   * The maximum number of instances that a service scales up to.
   *
   * At most `MaxSize` instances actively serve traffic for your service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-autoscalingconfiguration.html#cfn-apprunner-autoscalingconfiguration-maxsize
   */
  readonly maxSize?: number;

  /**
   * The minimum number of instances that App Runner provisions for a service.
   *
   * The service always has at least `MinSize` provisioned instances. Some of them actively serve traffic. The rest of them (provisioned and inactive instances) are a cost-effective compute capacity reserve and are ready to be quickly activated. You pay for memory usage of all the provisioned instances. You pay for CPU usage of only the active subset.
   *
   * App Runner temporarily doubles the number of provisioned instances during deployments, to maintain the same capacity for both old and new code.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-autoscalingconfiguration.html#cfn-apprunner-autoscalingconfiguration-minsize
   */
  readonly minSize?: number;

  /**
   * A list of metadata items that you can associate with your auto scaling configuration resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-autoscalingconfiguration.html#cfn-apprunner-autoscalingconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAutoScalingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAutoScalingConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutoScalingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingConfigurationName", cdk.validateString)(properties.autoScalingConfigurationName));
  errors.collect(cdk.propertyValidator("maxConcurrency", cdk.validateNumber)(properties.maxConcurrency));
  errors.collect(cdk.propertyValidator("maxSize", cdk.validateNumber)(properties.maxSize));
  errors.collect(cdk.propertyValidator("minSize", cdk.validateNumber)(properties.minSize));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAutoScalingConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnAutoScalingConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutoScalingConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AutoScalingConfigurationName": cdk.stringToCloudFormation(properties.autoScalingConfigurationName),
    "MaxConcurrency": cdk.numberToCloudFormation(properties.maxConcurrency),
    "MaxSize": cdk.numberToCloudFormation(properties.maxSize),
    "MinSize": cdk.numberToCloudFormation(properties.minSize),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAutoScalingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutoScalingConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutoScalingConfigurationProps>();
  ret.addPropertyResult("autoScalingConfigurationName", "AutoScalingConfigurationName", (properties.AutoScalingConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingConfigurationName) : undefined));
  ret.addPropertyResult("maxConcurrency", "MaxConcurrency", (properties.MaxConcurrency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConcurrency) : undefined));
  ret.addPropertyResult("maxSize", "MaxSize", (properties.MaxSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSize) : undefined));
  ret.addPropertyResult("minSize", "MinSize", (properties.MinSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSize) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specify an AWS App Runner observability configuration by using the `AWS::AppRunner::ObservabilityConfiguration` resource in an AWS CloudFormation template.
 *
 * The `AWS::AppRunner::ObservabilityConfiguration` resource is an AWS App Runner resource type that specifies an App Runner observability configuration.
 *
 * App Runner requires this resource when you specify App Runner services and you want to enable non-default observability features. You can share an observability configuration across multiple services.
 *
 * Create multiple revisions of a configuration by specifying this resource multiple times using the same `ObservabilityConfigurationName` . App Runner creates multiple resources with incremental `ObservabilityConfigurationRevision` values. When you specify a service and configure an observability configuration resource, the service uses the latest active revision of the observability configuration by default. You can optionally configure the service to use a specific revision.
 *
 * The observability configuration resource is designed to configure multiple features (currently one feature, tracing). This resource takes optional parameters that describe the configuration of these features (currently one parameter, `TraceConfiguration` ). If you don't specify a feature parameter, App Runner doesn't enable the feature.
 *
 * @cloudformationResource AWS::AppRunner::ObservabilityConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-observabilityconfiguration.html
 */
export class CfnObservabilityConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppRunner::ObservabilityConfiguration";

  /**
   * Build a CfnObservabilityConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnObservabilityConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnObservabilityConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnObservabilityConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * It's set to `true` for the configuration with the highest `Revision` among all configurations that share the same `ObservabilityConfigurationName` . It's set to `false` otherwise.
   *
   * @cloudformationAttribute Latest
   */
  public readonly attrLatest: cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of this observability configuration.
   *
   * @cloudformationAttribute ObservabilityConfigurationArn
   */
  public readonly attrObservabilityConfigurationArn: string;

  /**
   * The revision of this observability configuration. It's unique among all the active configurations ( `"Status": "ACTIVE"` ) that share the same `ObservabilityConfigurationName` .
   *
   * @cloudformationAttribute ObservabilityConfigurationRevision
   */
  public readonly attrObservabilityConfigurationRevision: number;

  /**
   * A name for the observability configuration.
   */
  public observabilityConfigurationName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of metadata items that you can associate with your observability configuration resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The configuration of the tracing feature within this observability configuration.
   */
  public traceConfiguration?: cdk.IResolvable | CfnObservabilityConfiguration.TraceConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnObservabilityConfigurationProps = {}) {
    super(scope, id, {
      "type": CfnObservabilityConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrLatest = this.getAtt("Latest");
    this.attrObservabilityConfigurationArn = cdk.Token.asString(this.getAtt("ObservabilityConfigurationArn", cdk.ResolutionTypeHint.STRING));
    this.attrObservabilityConfigurationRevision = cdk.Token.asNumber(this.getAtt("ObservabilityConfigurationRevision", cdk.ResolutionTypeHint.NUMBER));
    this.observabilityConfigurationName = props.observabilityConfigurationName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppRunner::ObservabilityConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.traceConfiguration = props.traceConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "observabilityConfigurationName": this.observabilityConfigurationName,
      "tags": this.tags.renderTags(),
      "traceConfiguration": this.traceConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnObservabilityConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnObservabilityConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnObservabilityConfiguration {
  /**
   * Describes the configuration of the tracing feature within an AWS App Runner observability configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-observabilityconfiguration-traceconfiguration.html
   */
  export interface TraceConfigurationProperty {
    /**
     * The implementation provider chosen for tracing App Runner services.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-observabilityconfiguration-traceconfiguration.html#cfn-apprunner-observabilityconfiguration-traceconfiguration-vendor
     */
    readonly vendor: string;
  }
}

/**
 * Properties for defining a `CfnObservabilityConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-observabilityconfiguration.html
 */
export interface CfnObservabilityConfigurationProps {
  /**
   * A name for the observability configuration.
   *
   * When you use it for the first time in an AWS Region , App Runner creates revision number `1` of this name. When you use the same name in subsequent calls, App Runner creates incremental revisions of the configuration.
   *
   * > The name `DefaultConfiguration` is reserved. You can't use it to create a new observability configuration, and you can't create a revision of it.
   * >
   * > When you want to use your own observability configuration for your App Runner service, *create a configuration with a different name* , and then provide it when you create or update your service.
   *
   * If you don't specify a name, AWS CloudFormation generates a name for your observability configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-observabilityconfiguration.html#cfn-apprunner-observabilityconfiguration-observabilityconfigurationname
   */
  readonly observabilityConfigurationName?: string;

  /**
   * A list of metadata items that you can associate with your observability configuration resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-observabilityconfiguration.html#cfn-apprunner-observabilityconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The configuration of the tracing feature within this observability configuration.
   *
   * If you don't specify it, App Runner doesn't enable tracing.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-observabilityconfiguration.html#cfn-apprunner-observabilityconfiguration-traceconfiguration
   */
  readonly traceConfiguration?: cdk.IResolvable | CfnObservabilityConfiguration.TraceConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `TraceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TraceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnObservabilityConfigurationTraceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vendor", cdk.requiredValidator)(properties.vendor));
  errors.collect(cdk.propertyValidator("vendor", cdk.validateString)(properties.vendor));
  return errors.wrap("supplied properties not correct for \"TraceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnObservabilityConfigurationTraceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnObservabilityConfigurationTraceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Vendor": cdk.stringToCloudFormation(properties.vendor)
  };
}

// @ts-ignore TS6133
function CfnObservabilityConfigurationTraceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnObservabilityConfiguration.TraceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObservabilityConfiguration.TraceConfigurationProperty>();
  ret.addPropertyResult("vendor", "Vendor", (properties.Vendor != null ? cfn_parse.FromCloudFormation.getString(properties.Vendor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnObservabilityConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnObservabilityConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnObservabilityConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("observabilityConfigurationName", cdk.validateString)(properties.observabilityConfigurationName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("traceConfiguration", CfnObservabilityConfigurationTraceConfigurationPropertyValidator)(properties.traceConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnObservabilityConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnObservabilityConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnObservabilityConfigurationPropsValidator(properties).assertSuccess();
  return {
    "ObservabilityConfigurationName": cdk.stringToCloudFormation(properties.observabilityConfigurationName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TraceConfiguration": convertCfnObservabilityConfigurationTraceConfigurationPropertyToCloudFormation(properties.traceConfiguration)
  };
}

// @ts-ignore TS6133
function CfnObservabilityConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnObservabilityConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObservabilityConfigurationProps>();
  ret.addPropertyResult("observabilityConfigurationName", "ObservabilityConfigurationName", (properties.ObservabilityConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.ObservabilityConfigurationName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("traceConfiguration", "TraceConfiguration", (properties.TraceConfiguration != null ? CfnObservabilityConfigurationTraceConfigurationPropertyFromCloudFormation(properties.TraceConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specify an AWS App Runner service by using the `AWS::AppRunner::Service` resource in an AWS CloudFormation template.
 *
 * The `AWS::AppRunner::Service` resource is an AWS App Runner resource type that specifies an App Runner service.
 *
 * @cloudformationResource AWS::AppRunner::Service
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html
 */
export class CfnService extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppRunner::Service";

  /**
   * Build a CfnService from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnService {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServicePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnService(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of this service.
   *
   * @cloudformationAttribute ServiceArn
   */
  public readonly attrServiceArn: string;

  /**
   * An ID that App Runner generated for this service. It's unique within the AWS Region .
   *
   * @cloudformationAttribute ServiceId
   */
  public readonly attrServiceId: string;

  /**
   * A subdomain URL that App Runner generated for this service. You can use this URL to access your service web application.
   *
   * @cloudformationAttribute ServiceUrl
   */
  public readonly attrServiceUrl: string;

  /**
   * The current state of the App Runner service. These particular values mean the following.
   *
   * - `CREATE_FAILED` – The service failed to create. The failed service isn't usable, and still counts towards your service quota. To troubleshoot this failure, read the failure events and logs, change any parameters that need to be fixed, and rebuild your service using `UpdateService` .
   * - `DELETE_FAILED` – The service failed to delete and can't be successfully recovered. Retry the service deletion call to ensure that all related resources are removed.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The Amazon Resource Name (ARN) of an App Runner automatic scaling configuration resource that you want to associate with your service.
   */
  public autoScalingConfigurationArn?: string;

  /**
   * An optional custom encryption key that App Runner uses to encrypt the copy of your source repository that it maintains and your service logs.
   */
  public encryptionConfiguration?: CfnService.EncryptionConfigurationProperty | cdk.IResolvable;

  /**
   * The settings for the health check that AWS App Runner performs to monitor the health of the App Runner service.
   */
  public healthCheckConfiguration?: CfnService.HealthCheckConfigurationProperty | cdk.IResolvable;

  /**
   * The runtime configuration of instances (scaling units) of your service.
   */
  public instanceConfiguration?: CfnService.InstanceConfigurationProperty | cdk.IResolvable;

  /**
   * Configuration settings related to network traffic of the web application that the App Runner service runs.
   */
  public networkConfiguration?: cdk.IResolvable | CfnService.NetworkConfigurationProperty;

  /**
   * The observability configuration of your service.
   */
  public observabilityConfiguration?: cdk.IResolvable | CfnService.ServiceObservabilityConfigurationProperty;

  /**
   * A name for the App Runner service.
   */
  public serviceName?: string;

  /**
   * The source to deploy to the App Runner service.
   */
  public sourceConfiguration: cdk.IResolvable | CfnService.SourceConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional list of metadata items that you can associate with the App Runner service resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceProps) {
    super(scope, id, {
      "type": CfnService.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "sourceConfiguration", this);

    this.attrServiceArn = cdk.Token.asString(this.getAtt("ServiceArn", cdk.ResolutionTypeHint.STRING));
    this.attrServiceId = cdk.Token.asString(this.getAtt("ServiceId", cdk.ResolutionTypeHint.STRING));
    this.attrServiceUrl = cdk.Token.asString(this.getAtt("ServiceUrl", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.autoScalingConfigurationArn = props.autoScalingConfigurationArn;
    this.encryptionConfiguration = props.encryptionConfiguration;
    this.healthCheckConfiguration = props.healthCheckConfiguration;
    this.instanceConfiguration = props.instanceConfiguration;
    this.networkConfiguration = props.networkConfiguration;
    this.observabilityConfiguration = props.observabilityConfiguration;
    this.serviceName = props.serviceName;
    this.sourceConfiguration = props.sourceConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppRunner::Service", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoScalingConfigurationArn": this.autoScalingConfigurationArn,
      "encryptionConfiguration": this.encryptionConfiguration,
      "healthCheckConfiguration": this.healthCheckConfiguration,
      "instanceConfiguration": this.instanceConfiguration,
      "networkConfiguration": this.networkConfiguration,
      "observabilityConfiguration": this.observabilityConfiguration,
      "serviceName": this.serviceName,
      "sourceConfiguration": this.sourceConfiguration,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnService.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServicePropsToCloudFormation(props);
  }
}

export namespace CfnService {
  /**
   * Describes the settings for the health check that AWS App Runner performs to monitor the health of a service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-healthcheckconfiguration.html
   */
  export interface HealthCheckConfigurationProperty {
    /**
     * The number of consecutive checks that must succeed before App Runner decides that the service is healthy.
     *
     * Default: `1`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-healthcheckconfiguration.html#cfn-apprunner-service-healthcheckconfiguration-healthythreshold
     */
    readonly healthyThreshold?: number;

    /**
     * The time interval, in seconds, between health checks.
     *
     * Default: `5`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-healthcheckconfiguration.html#cfn-apprunner-service-healthcheckconfiguration-interval
     */
    readonly interval?: number;

    /**
     * The URL that health check requests are sent to.
     *
     * `Path` is only applicable when you set `Protocol` to `HTTP` .
     *
     * Default: `"/"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-healthcheckconfiguration.html#cfn-apprunner-service-healthcheckconfiguration-path
     */
    readonly path?: string;

    /**
     * The IP protocol that App Runner uses to perform health checks for your service.
     *
     * If you set `Protocol` to `HTTP` , App Runner sends health check requests to the HTTP path specified by `Path` .
     *
     * Default: `TCP`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-healthcheckconfiguration.html#cfn-apprunner-service-healthcheckconfiguration-protocol
     */
    readonly protocol?: string;

    /**
     * The time, in seconds, to wait for a health check response before deciding it failed.
     *
     * Default: `2`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-healthcheckconfiguration.html#cfn-apprunner-service-healthcheckconfiguration-timeout
     */
    readonly timeout?: number;

    /**
     * The number of consecutive checks that must fail before App Runner decides that the service is unhealthy.
     *
     * Default: `5`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-healthcheckconfiguration.html#cfn-apprunner-service-healthcheckconfiguration-unhealthythreshold
     */
    readonly unhealthyThreshold?: number;
  }

  /**
   * Describes the runtime configuration of an AWS App Runner service instance (scaling unit).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-instanceconfiguration.html
   */
  export interface InstanceConfigurationProperty {
    /**
     * The number of CPU units reserved for each instance of your App Runner service.
     *
     * Default: `1 vCPU`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-instanceconfiguration.html#cfn-apprunner-service-instanceconfiguration-cpu
     */
    readonly cpu?: string;

    /**
     * The Amazon Resource Name (ARN) of an IAM role that provides permissions to your App Runner service.
     *
     * These are permissions that your code needs when it calls any AWS APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-instanceconfiguration.html#cfn-apprunner-service-instanceconfiguration-instancerolearn
     */
    readonly instanceRoleArn?: string;

    /**
     * The amount of memory, in MB or GB, reserved for each instance of your App Runner service.
     *
     * Default: `2 GB`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-instanceconfiguration.html#cfn-apprunner-service-instanceconfiguration-memory
     */
    readonly memory?: string;
  }

  /**
   * Describes a custom encryption key that AWS App Runner uses to encrypt copies of the source repository and service logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-encryptionconfiguration.html
   */
  export interface EncryptionConfigurationProperty {
    /**
     * The ARN of the KMS key that's used for encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-encryptionconfiguration.html#cfn-apprunner-service-encryptionconfiguration-kmskey
     */
    readonly kmsKey: string;
  }

  /**
   * Describes the observability configuration of an AWS App Runner service.
   *
   * These are additional observability features, like tracing, that you choose to enable. They're configured in a separate resource that you associate with your service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-serviceobservabilityconfiguration.html
   */
  export interface ServiceObservabilityConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the observability configuration that is associated with the service.
     *
     * Specified only when `ObservabilityEnabled` is `true` .
     *
     * Specify an ARN with a name and a revision number to associate that revision. For example: `arn:aws:apprunner:us-east-1:123456789012:observabilityconfiguration/xray-tracing/3`
     *
     * Specify just the name to associate the latest revision. For example: `arn:aws:apprunner:us-east-1:123456789012:observabilityconfiguration/xray-tracing`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-serviceobservabilityconfiguration.html#cfn-apprunner-service-serviceobservabilityconfiguration-observabilityconfigurationarn
     */
    readonly observabilityConfigurationArn?: string;

    /**
     * When `true` , an observability configuration resource is associated with the service, and an `ObservabilityConfigurationArn` is specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-serviceobservabilityconfiguration.html#cfn-apprunner-service-serviceobservabilityconfiguration-observabilityenabled
     */
    readonly observabilityEnabled: boolean | cdk.IResolvable;
  }

  /**
   * Describes the source deployed to an AWS App Runner service.
   *
   * It can be a code or an image repository.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourceconfiguration.html
   */
  export interface SourceConfigurationProperty {
    /**
     * Describes the resources that are needed to authenticate access to some source repositories.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourceconfiguration.html#cfn-apprunner-service-sourceconfiguration-authenticationconfiguration
     */
    readonly authenticationConfiguration?: CfnService.AuthenticationConfigurationProperty | cdk.IResolvable;

    /**
     * If `true` , continuous integration from the source repository is enabled for the App Runner service.
     *
     * Each repository change (including any source code commit or new image version) starts a deployment.
     *
     * Default: App Runner sets to `false` for a source image that uses an ECR Public repository or an ECR repository that's in an AWS account other than the one that the service is in. App Runner sets to `true` in all other cases (which currently include a source code repository or a source image using a same-account ECR repository).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourceconfiguration.html#cfn-apprunner-service-sourceconfiguration-autodeploymentsenabled
     */
    readonly autoDeploymentsEnabled?: boolean | cdk.IResolvable;

    /**
     * The description of a source code repository.
     *
     * You must provide either this member or `ImageRepository` (but not both).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourceconfiguration.html#cfn-apprunner-service-sourceconfiguration-coderepository
     */
    readonly codeRepository?: CfnService.CodeRepositoryProperty | cdk.IResolvable;

    /**
     * The description of a source image repository.
     *
     * You must provide either this member or `CodeRepository` (but not both).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourceconfiguration.html#cfn-apprunner-service-sourceconfiguration-imagerepository
     */
    readonly imageRepository?: CfnService.ImageRepositoryProperty | cdk.IResolvable;
  }

  /**
   * Describes resources needed to authenticate access to some source repositories.
   *
   * The specific resource depends on the repository provider.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-authenticationconfiguration.html
   */
  export interface AuthenticationConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants the App Runner service access to a source repository.
     *
     * It's required for ECR image repositories (but not for ECR Public repositories).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-authenticationconfiguration.html#cfn-apprunner-service-authenticationconfiguration-accessrolearn
     */
    readonly accessRoleArn?: string;

    /**
     * The Amazon Resource Name (ARN) of the App Runner connection that enables the App Runner service to connect to a source repository.
     *
     * It's required for GitHub code repositories.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-authenticationconfiguration.html#cfn-apprunner-service-authenticationconfiguration-connectionarn
     */
    readonly connectionArn?: string;
  }

  /**
   * Describes a source code repository.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-coderepository.html
   */
  export interface CodeRepositoryProperty {
    /**
     * Configuration for building and running the service from a source code repository.
     *
     * > `CodeConfiguration` is required only for `CreateService` request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-coderepository.html#cfn-apprunner-service-coderepository-codeconfiguration
     */
    readonly codeConfiguration?: CfnService.CodeConfigurationProperty | cdk.IResolvable;

    /**
     * The location of the repository that contains the source code.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-coderepository.html#cfn-apprunner-service-coderepository-repositoryurl
     */
    readonly repositoryUrl: string;

    /**
     * The version that should be used within the source code repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-coderepository.html#cfn-apprunner-service-coderepository-sourcecodeversion
     */
    readonly sourceCodeVersion: cdk.IResolvable | CfnService.SourceCodeVersionProperty;

    /**
     * The path of the directory that stores source code and configuration files.
     *
     * The build and start commands also execute from here. The path is absolute from root and, if not specified, defaults to the repository root.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-coderepository.html#cfn-apprunner-service-coderepository-sourcedirectory
     */
    readonly sourceDirectory?: string;
  }

  /**
   * Identifies a version of code that AWS App Runner refers to within a source code repository.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourcecodeversion.html
   */
  export interface SourceCodeVersionProperty {
    /**
     * The type of version identifier.
     *
     * For a git-based repository, branches represent versions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourcecodeversion.html#cfn-apprunner-service-sourcecodeversion-type
     */
    readonly type: string;

    /**
     * A source code version.
     *
     * For a git-based repository, a branch name maps to a specific version. App Runner uses the most recent commit to the branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourcecodeversion.html#cfn-apprunner-service-sourcecodeversion-value
     */
    readonly value: string;
  }

  /**
   * Describes the configuration that AWS App Runner uses to build and run an App Runner service from a source code repository.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfiguration.html
   */
  export interface CodeConfigurationProperty {
    /**
     * The basic configuration for building and running the App Runner service.
     *
     * Use it to quickly launch an App Runner service without providing a `apprunner.yaml` file in the source code repository (or ignoring the file if it exists).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfiguration.html#cfn-apprunner-service-codeconfiguration-codeconfigurationvalues
     */
    readonly codeConfigurationValues?: CfnService.CodeConfigurationValuesProperty | cdk.IResolvable;

    /**
     * The source of the App Runner configuration. Values are interpreted as follows:.
     *
     * - `REPOSITORY` – App Runner reads configuration values from the `apprunner.yaml` file in the source code repository and ignores `CodeConfigurationValues` .
     * - `API` – App Runner uses configuration values provided in `CodeConfigurationValues` and ignores the `apprunner.yaml` file in the source code repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfiguration.html#cfn-apprunner-service-codeconfiguration-configurationsource
     */
    readonly configurationSource: string;
  }

  /**
   * Describes the basic configuration needed for building and running an AWS App Runner service.
   *
   * This type doesn't support the full set of possible configuration options. Fur full configuration capabilities, use a `apprunner.yaml` file in the source code repository.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfigurationvalues.html
   */
  export interface CodeConfigurationValuesProperty {
    /**
     * The command App Runner runs to build your application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfigurationvalues.html#cfn-apprunner-service-codeconfigurationvalues-buildcommand
     */
    readonly buildCommand?: string;

    /**
     * The port that your application listens to in the container.
     *
     * Default: `8080`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfigurationvalues.html#cfn-apprunner-service-codeconfigurationvalues-port
     */
    readonly port?: string;

    /**
     * A runtime environment type for building and running an App Runner service.
     *
     * It represents a programming language runtime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfigurationvalues.html#cfn-apprunner-service-codeconfigurationvalues-runtime
     */
    readonly runtime: string;

    /**
     * An array of key-value pairs representing the secrets and parameters that get referenced to your service as an environment variable.
     *
     * The supported values are either the full Amazon Resource Name (ARN) of the AWS Secrets Manager secret or the full ARN of the parameter in the AWS Systems Manager Parameter Store.
     *
     * > - If the AWS Systems Manager Parameter Store parameter exists in the same AWS Region as the service that you're launching, you can use either the full ARN or name of the secret. If the parameter exists in a different Region, then the full ARN must be specified.
     * > - Currently, cross account referencing of AWS Systems Manager Parameter Store parameter is not supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfigurationvalues.html#cfn-apprunner-service-codeconfigurationvalues-runtimeenvironmentsecrets
     */
    readonly runtimeEnvironmentSecrets?: Array<cdk.IResolvable | CfnService.KeyValuePairProperty> | cdk.IResolvable;

    /**
     * The environment variables that are available to your running AWS App Runner service.
     *
     * An array of key-value pairs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfigurationvalues.html#cfn-apprunner-service-codeconfigurationvalues-runtimeenvironmentvariables
     */
    readonly runtimeEnvironmentVariables?: Array<cdk.IResolvable | CfnService.KeyValuePairProperty> | cdk.IResolvable;

    /**
     * The command App Runner runs to start your application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfigurationvalues.html#cfn-apprunner-service-codeconfigurationvalues-startcommand
     */
    readonly startCommand?: string;
  }

  /**
   * Describes a key-value pair, which is a string-to-string mapping.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-keyvaluepair.html
   */
  export interface KeyValuePairProperty {
    /**
     * The key name string to map to a value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-keyvaluepair.html#cfn-apprunner-service-keyvaluepair-name
     */
    readonly name?: string;

    /**
     * The value string to which the key name is mapped.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-keyvaluepair.html#cfn-apprunner-service-keyvaluepair-value
     */
    readonly value?: string;
  }

  /**
   * Describes a source image repository.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imagerepository.html
   */
  export interface ImageRepositoryProperty {
    /**
     * Configuration for running the identified image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imagerepository.html#cfn-apprunner-service-imagerepository-imageconfiguration
     */
    readonly imageConfiguration?: CfnService.ImageConfigurationProperty | cdk.IResolvable;

    /**
     * The identifier of an image.
     *
     * For an image in Amazon Elastic Container Registry (Amazon ECR), this is an image name. For the image name format, see [Pulling an image](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-pull-ecr-image.html) in the *Amazon ECR User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imagerepository.html#cfn-apprunner-service-imagerepository-imageidentifier
     */
    readonly imageIdentifier: string;

    /**
     * The type of the image repository.
     *
     * This reflects the repository provider and whether the repository is private or public.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imagerepository.html#cfn-apprunner-service-imagerepository-imagerepositorytype
     */
    readonly imageRepositoryType: string;
  }

  /**
   * Describes the configuration that AWS App Runner uses to run an App Runner service using an image pulled from a source image repository.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html
   */
  export interface ImageConfigurationProperty {
    /**
     * The port that your application listens to in the container.
     *
     * Default: `8080`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html#cfn-apprunner-service-imageconfiguration-port
     */
    readonly port?: string;

    /**
     * An array of key-value pairs representing the secrets and parameters that get referenced to your service as an environment variable.
     *
     * The supported values are either the full Amazon Resource Name (ARN) of the AWS Secrets Manager secret or the full ARN of the parameter in the AWS Systems Manager Parameter Store.
     *
     * > - If the AWS Systems Manager Parameter Store parameter exists in the same AWS Region as the service that you're launching, you can use either the full ARN or name of the secret. If the parameter exists in a different Region, then the full ARN must be specified.
     * > - Currently, cross account referencing of AWS Systems Manager Parameter Store parameter is not supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html#cfn-apprunner-service-imageconfiguration-runtimeenvironmentsecrets
     */
    readonly runtimeEnvironmentSecrets?: Array<cdk.IResolvable | CfnService.KeyValuePairProperty> | cdk.IResolvable;

    /**
     * Environment variables that are available to your running App Runner service.
     *
     * An array of key-value pairs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html#cfn-apprunner-service-imageconfiguration-runtimeenvironmentvariables
     */
    readonly runtimeEnvironmentVariables?: Array<cdk.IResolvable | CfnService.KeyValuePairProperty> | cdk.IResolvable;

    /**
     * An optional command that App Runner runs to start the application in the source image.
     *
     * If specified, this command overrides the Docker image’s default start command.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html#cfn-apprunner-service-imageconfiguration-startcommand
     */
    readonly startCommand?: string;
  }

  /**
   * Describes configuration settings related to network traffic of an AWS App Runner service.
   *
   * Consists of embedded objects for each configurable network feature.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * Network configuration settings for outbound message traffic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-networkconfiguration.html#cfn-apprunner-service-networkconfiguration-egressconfiguration
     */
    readonly egressConfiguration?: CfnService.EgressConfigurationProperty | cdk.IResolvable;

    /**
     * Network configuration settings for inbound message traffic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-networkconfiguration.html#cfn-apprunner-service-networkconfiguration-ingressconfiguration
     */
    readonly ingressConfiguration?: CfnService.IngressConfigurationProperty | cdk.IResolvable;

    /**
     * App Runner provides you with the option to choose between *Internet Protocol version 4 (IPv4)* and *dual stack* (IPv4 and IPv6) for your incoming public network configuration.
     *
     * This is an optional parameter. If you do not specify an `IpAddressType` , it defaults to select IPv4.
     *
     * > Currently, App Runner supports dual stack for only Public endpoint. Only IPv4 is supported for Private endpoint. If you update a service that's using dual-stack Public endpoint to a Private endpoint, your App Runner service will default to support only IPv4 for Private endpoint and fail to receive traffic originating from IPv6 endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-networkconfiguration.html#cfn-apprunner-service-networkconfiguration-ipaddresstype
     */
    readonly ipAddressType?: string;
  }

  /**
   * Describes configuration settings related to outbound network traffic of an AWS App Runner service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-egressconfiguration.html
   */
  export interface EgressConfigurationProperty {
    /**
     * The type of egress configuration.
     *
     * Set to `DEFAULT` for access to resources hosted on public networks.
     *
     * Set to `VPC` to associate your service to a custom VPC specified by `VpcConnectorArn` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-egressconfiguration.html#cfn-apprunner-service-egressconfiguration-egresstype
     */
    readonly egressType: string;

    /**
     * The Amazon Resource Name (ARN) of the App Runner VPC connector that you want to associate with your App Runner service.
     *
     * Only valid when `EgressType = VPC` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-egressconfiguration.html#cfn-apprunner-service-egressconfiguration-vpcconnectorarn
     */
    readonly vpcConnectorArn?: string;
  }

  /**
   * Network configuration settings for inbound network traffic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-ingressconfiguration.html
   */
  export interface IngressConfigurationProperty {
    /**
     * Specifies whether your App Runner service is publicly accessible.
     *
     * To make the service publicly accessible set it to `True` . To make the service privately accessible, from only within an Amazon VPC set it to `False` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-ingressconfiguration.html#cfn-apprunner-service-ingressconfiguration-ispubliclyaccessible
     */
    readonly isPubliclyAccessible: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnService`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html
 */
export interface CfnServiceProps {
  /**
   * The Amazon Resource Name (ARN) of an App Runner automatic scaling configuration resource that you want to associate with your service.
   *
   * If not provided, App Runner associates the latest revision of a default auto scaling configuration.
   *
   * Specify an ARN with a name and a revision number to associate that revision. For example: `arn:aws:apprunner:us-east-1:123456789012:autoscalingconfiguration/high-availability/3`
   *
   * Specify just the name to associate the latest revision. For example: `arn:aws:apprunner:us-east-1:123456789012:autoscalingconfiguration/high-availability`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-autoscalingconfigurationarn
   */
  readonly autoScalingConfigurationArn?: string;

  /**
   * An optional custom encryption key that App Runner uses to encrypt the copy of your source repository that it maintains and your service logs.
   *
   * By default, App Runner uses an AWS managed key .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-encryptionconfiguration
   */
  readonly encryptionConfiguration?: CfnService.EncryptionConfigurationProperty | cdk.IResolvable;

  /**
   * The settings for the health check that AWS App Runner performs to monitor the health of the App Runner service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-healthcheckconfiguration
   */
  readonly healthCheckConfiguration?: CfnService.HealthCheckConfigurationProperty | cdk.IResolvable;

  /**
   * The runtime configuration of instances (scaling units) of your service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-instanceconfiguration
   */
  readonly instanceConfiguration?: CfnService.InstanceConfigurationProperty | cdk.IResolvable;

  /**
   * Configuration settings related to network traffic of the web application that the App Runner service runs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-networkconfiguration
   */
  readonly networkConfiguration?: cdk.IResolvable | CfnService.NetworkConfigurationProperty;

  /**
   * The observability configuration of your service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-observabilityconfiguration
   */
  readonly observabilityConfiguration?: cdk.IResolvable | CfnService.ServiceObservabilityConfigurationProperty;

  /**
   * A name for the App Runner service.
   *
   * It must be unique across all the running App Runner services in your AWS account in the AWS Region .
   *
   * If you don't specify a name, AWS CloudFormation generates a name for your service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-servicename
   */
  readonly serviceName?: string;

  /**
   * The source to deploy to the App Runner service.
   *
   * It can be a code or an image repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-sourceconfiguration
   */
  readonly sourceConfiguration: cdk.IResolvable | CfnService.SourceConfigurationProperty;

  /**
   * An optional list of metadata items that you can associate with the App Runner service resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-service.html#cfn-apprunner-service-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `HealthCheckConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceHealthCheckConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthyThreshold", cdk.validateNumber)(properties.healthyThreshold));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  errors.collect(cdk.propertyValidator("unhealthyThreshold", cdk.validateNumber)(properties.unhealthyThreshold));
  return errors.wrap("supplied properties not correct for \"HealthCheckConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceHealthCheckConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceHealthCheckConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "HealthyThreshold": cdk.numberToCloudFormation(properties.healthyThreshold),
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "Timeout": cdk.numberToCloudFormation(properties.timeout),
    "UnhealthyThreshold": cdk.numberToCloudFormation(properties.unhealthyThreshold)
  };
}

// @ts-ignore TS6133
function CfnServiceHealthCheckConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.HealthCheckConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.HealthCheckConfigurationProperty>();
  ret.addPropertyResult("healthyThreshold", "HealthyThreshold", (properties.HealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthyThreshold) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addPropertyResult("unhealthyThreshold", "UnhealthyThreshold", (properties.UnhealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThreshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceInstanceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpu", cdk.validateString)(properties.cpu));
  errors.collect(cdk.propertyValidator("instanceRoleArn", cdk.validateString)(properties.instanceRoleArn));
  errors.collect(cdk.propertyValidator("memory", cdk.validateString)(properties.memory));
  return errors.wrap("supplied properties not correct for \"InstanceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceInstanceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceInstanceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Cpu": cdk.stringToCloudFormation(properties.cpu),
    "InstanceRoleArn": cdk.stringToCloudFormation(properties.instanceRoleArn),
    "Memory": cdk.stringToCloudFormation(properties.memory)
  };
}

// @ts-ignore TS6133
function CfnServiceInstanceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.InstanceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.InstanceConfigurationProperty>();
  ret.addPropertyResult("cpu", "Cpu", (properties.Cpu != null ? cfn_parse.FromCloudFormation.getString(properties.Cpu) : undefined));
  ret.addPropertyResult("instanceRoleArn", "InstanceRoleArn", (properties.InstanceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceRoleArn) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getString(properties.Memory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKey", cdk.requiredValidator)(properties.kmsKey));
  errors.collect(cdk.propertyValidator("kmsKey", cdk.validateString)(properties.kmsKey));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KmsKey": cdk.stringToCloudFormation(properties.kmsKey)
  };
}

// @ts-ignore TS6133
function CfnServiceEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.EncryptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.EncryptionConfigurationProperty>();
  ret.addPropertyResult("kmsKey", "KmsKey", (properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceObservabilityConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceObservabilityConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceServiceObservabilityConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("observabilityConfigurationArn", cdk.validateString)(properties.observabilityConfigurationArn));
  errors.collect(cdk.propertyValidator("observabilityEnabled", cdk.requiredValidator)(properties.observabilityEnabled));
  errors.collect(cdk.propertyValidator("observabilityEnabled", cdk.validateBoolean)(properties.observabilityEnabled));
  return errors.wrap("supplied properties not correct for \"ServiceObservabilityConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceServiceObservabilityConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceServiceObservabilityConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ObservabilityConfigurationArn": cdk.stringToCloudFormation(properties.observabilityConfigurationArn),
    "ObservabilityEnabled": cdk.booleanToCloudFormation(properties.observabilityEnabled)
  };
}

// @ts-ignore TS6133
function CfnServiceServiceObservabilityConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.ServiceObservabilityConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ServiceObservabilityConfigurationProperty>();
  ret.addPropertyResult("observabilityConfigurationArn", "ObservabilityConfigurationArn", (properties.ObservabilityConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.ObservabilityConfigurationArn) : undefined));
  ret.addPropertyResult("observabilityEnabled", "ObservabilityEnabled", (properties.ObservabilityEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ObservabilityEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthenticationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceAuthenticationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessRoleArn", cdk.validateString)(properties.accessRoleArn));
  errors.collect(cdk.propertyValidator("connectionArn", cdk.validateString)(properties.connectionArn));
  return errors.wrap("supplied properties not correct for \"AuthenticationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceAuthenticationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceAuthenticationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccessRoleArn": cdk.stringToCloudFormation(properties.accessRoleArn),
    "ConnectionArn": cdk.stringToCloudFormation(properties.connectionArn)
  };
}

// @ts-ignore TS6133
function CfnServiceAuthenticationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.AuthenticationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.AuthenticationConfigurationProperty>();
  ret.addPropertyResult("accessRoleArn", "AccessRoleArn", (properties.AccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.AccessRoleArn) : undefined));
  ret.addPropertyResult("connectionArn", "ConnectionArn", (properties.ConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceCodeVersionProperty`
 *
 * @param properties - the TypeScript properties of a `SourceCodeVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceSourceCodeVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SourceCodeVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceSourceCodeVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceSourceCodeVersionPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnServiceSourceCodeVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.SourceCodeVersionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.SourceCodeVersionProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeyValuePairProperty`
 *
 * @param properties - the TypeScript properties of a `KeyValuePairProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceKeyValuePairPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"KeyValuePairProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceKeyValuePairPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceKeyValuePairPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnServiceKeyValuePairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.KeyValuePairProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.KeyValuePairProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CodeConfigurationValuesProperty`
 *
 * @param properties - the TypeScript properties of a `CodeConfigurationValuesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceCodeConfigurationValuesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("buildCommand", cdk.validateString)(properties.buildCommand));
  errors.collect(cdk.propertyValidator("port", cdk.validateString)(properties.port));
  errors.collect(cdk.propertyValidator("runtime", cdk.requiredValidator)(properties.runtime));
  errors.collect(cdk.propertyValidator("runtime", cdk.validateString)(properties.runtime));
  errors.collect(cdk.propertyValidator("runtimeEnvironmentSecrets", cdk.listValidator(CfnServiceKeyValuePairPropertyValidator))(properties.runtimeEnvironmentSecrets));
  errors.collect(cdk.propertyValidator("runtimeEnvironmentVariables", cdk.listValidator(CfnServiceKeyValuePairPropertyValidator))(properties.runtimeEnvironmentVariables));
  errors.collect(cdk.propertyValidator("startCommand", cdk.validateString)(properties.startCommand));
  return errors.wrap("supplied properties not correct for \"CodeConfigurationValuesProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceCodeConfigurationValuesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceCodeConfigurationValuesPropertyValidator(properties).assertSuccess();
  return {
    "BuildCommand": cdk.stringToCloudFormation(properties.buildCommand),
    "Port": cdk.stringToCloudFormation(properties.port),
    "Runtime": cdk.stringToCloudFormation(properties.runtime),
    "RuntimeEnvironmentSecrets": cdk.listMapper(convertCfnServiceKeyValuePairPropertyToCloudFormation)(properties.runtimeEnvironmentSecrets),
    "RuntimeEnvironmentVariables": cdk.listMapper(convertCfnServiceKeyValuePairPropertyToCloudFormation)(properties.runtimeEnvironmentVariables),
    "StartCommand": cdk.stringToCloudFormation(properties.startCommand)
  };
}

// @ts-ignore TS6133
function CfnServiceCodeConfigurationValuesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.CodeConfigurationValuesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.CodeConfigurationValuesProperty>();
  ret.addPropertyResult("buildCommand", "BuildCommand", (properties.BuildCommand != null ? cfn_parse.FromCloudFormation.getString(properties.BuildCommand) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addPropertyResult("runtime", "Runtime", (properties.Runtime != null ? cfn_parse.FromCloudFormation.getString(properties.Runtime) : undefined));
  ret.addPropertyResult("runtimeEnvironmentSecrets", "RuntimeEnvironmentSecrets", (properties.RuntimeEnvironmentSecrets != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceKeyValuePairPropertyFromCloudFormation)(properties.RuntimeEnvironmentSecrets) : undefined));
  ret.addPropertyResult("runtimeEnvironmentVariables", "RuntimeEnvironmentVariables", (properties.RuntimeEnvironmentVariables != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceKeyValuePairPropertyFromCloudFormation)(properties.RuntimeEnvironmentVariables) : undefined));
  ret.addPropertyResult("startCommand", "StartCommand", (properties.StartCommand != null ? cfn_parse.FromCloudFormation.getString(properties.StartCommand) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CodeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CodeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceCodeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeConfigurationValues", CfnServiceCodeConfigurationValuesPropertyValidator)(properties.codeConfigurationValues));
  errors.collect(cdk.propertyValidator("configurationSource", cdk.requiredValidator)(properties.configurationSource));
  errors.collect(cdk.propertyValidator("configurationSource", cdk.validateString)(properties.configurationSource));
  return errors.wrap("supplied properties not correct for \"CodeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceCodeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceCodeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CodeConfigurationValues": convertCfnServiceCodeConfigurationValuesPropertyToCloudFormation(properties.codeConfigurationValues),
    "ConfigurationSource": cdk.stringToCloudFormation(properties.configurationSource)
  };
}

// @ts-ignore TS6133
function CfnServiceCodeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.CodeConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.CodeConfigurationProperty>();
  ret.addPropertyResult("codeConfigurationValues", "CodeConfigurationValues", (properties.CodeConfigurationValues != null ? CfnServiceCodeConfigurationValuesPropertyFromCloudFormation(properties.CodeConfigurationValues) : undefined));
  ret.addPropertyResult("configurationSource", "ConfigurationSource", (properties.ConfigurationSource != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationSource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CodeRepositoryProperty`
 *
 * @param properties - the TypeScript properties of a `CodeRepositoryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceCodeRepositoryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeConfiguration", CfnServiceCodeConfigurationPropertyValidator)(properties.codeConfiguration));
  errors.collect(cdk.propertyValidator("repositoryUrl", cdk.requiredValidator)(properties.repositoryUrl));
  errors.collect(cdk.propertyValidator("repositoryUrl", cdk.validateString)(properties.repositoryUrl));
  errors.collect(cdk.propertyValidator("sourceCodeVersion", cdk.requiredValidator)(properties.sourceCodeVersion));
  errors.collect(cdk.propertyValidator("sourceCodeVersion", CfnServiceSourceCodeVersionPropertyValidator)(properties.sourceCodeVersion));
  errors.collect(cdk.propertyValidator("sourceDirectory", cdk.validateString)(properties.sourceDirectory));
  return errors.wrap("supplied properties not correct for \"CodeRepositoryProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceCodeRepositoryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceCodeRepositoryPropertyValidator(properties).assertSuccess();
  return {
    "CodeConfiguration": convertCfnServiceCodeConfigurationPropertyToCloudFormation(properties.codeConfiguration),
    "RepositoryUrl": cdk.stringToCloudFormation(properties.repositoryUrl),
    "SourceCodeVersion": convertCfnServiceSourceCodeVersionPropertyToCloudFormation(properties.sourceCodeVersion),
    "SourceDirectory": cdk.stringToCloudFormation(properties.sourceDirectory)
  };
}

// @ts-ignore TS6133
function CfnServiceCodeRepositoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.CodeRepositoryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.CodeRepositoryProperty>();
  ret.addPropertyResult("codeConfiguration", "CodeConfiguration", (properties.CodeConfiguration != null ? CfnServiceCodeConfigurationPropertyFromCloudFormation(properties.CodeConfiguration) : undefined));
  ret.addPropertyResult("repositoryUrl", "RepositoryUrl", (properties.RepositoryUrl != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryUrl) : undefined));
  ret.addPropertyResult("sourceCodeVersion", "SourceCodeVersion", (properties.SourceCodeVersion != null ? CfnServiceSourceCodeVersionPropertyFromCloudFormation(properties.SourceCodeVersion) : undefined));
  ret.addPropertyResult("sourceDirectory", "SourceDirectory", (properties.SourceDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.SourceDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceImageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("port", cdk.validateString)(properties.port));
  errors.collect(cdk.propertyValidator("runtimeEnvironmentSecrets", cdk.listValidator(CfnServiceKeyValuePairPropertyValidator))(properties.runtimeEnvironmentSecrets));
  errors.collect(cdk.propertyValidator("runtimeEnvironmentVariables", cdk.listValidator(CfnServiceKeyValuePairPropertyValidator))(properties.runtimeEnvironmentVariables));
  errors.collect(cdk.propertyValidator("startCommand", cdk.validateString)(properties.startCommand));
  return errors.wrap("supplied properties not correct for \"ImageConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceImageConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceImageConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Port": cdk.stringToCloudFormation(properties.port),
    "RuntimeEnvironmentSecrets": cdk.listMapper(convertCfnServiceKeyValuePairPropertyToCloudFormation)(properties.runtimeEnvironmentSecrets),
    "RuntimeEnvironmentVariables": cdk.listMapper(convertCfnServiceKeyValuePairPropertyToCloudFormation)(properties.runtimeEnvironmentVariables),
    "StartCommand": cdk.stringToCloudFormation(properties.startCommand)
  };
}

// @ts-ignore TS6133
function CfnServiceImageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.ImageConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ImageConfigurationProperty>();
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addPropertyResult("runtimeEnvironmentSecrets", "RuntimeEnvironmentSecrets", (properties.RuntimeEnvironmentSecrets != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceKeyValuePairPropertyFromCloudFormation)(properties.RuntimeEnvironmentSecrets) : undefined));
  ret.addPropertyResult("runtimeEnvironmentVariables", "RuntimeEnvironmentVariables", (properties.RuntimeEnvironmentVariables != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceKeyValuePairPropertyFromCloudFormation)(properties.RuntimeEnvironmentVariables) : undefined));
  ret.addPropertyResult("startCommand", "StartCommand", (properties.StartCommand != null ? cfn_parse.FromCloudFormation.getString(properties.StartCommand) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageRepositoryProperty`
 *
 * @param properties - the TypeScript properties of a `ImageRepositoryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceImageRepositoryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("imageConfiguration", CfnServiceImageConfigurationPropertyValidator)(properties.imageConfiguration));
  errors.collect(cdk.propertyValidator("imageIdentifier", cdk.requiredValidator)(properties.imageIdentifier));
  errors.collect(cdk.propertyValidator("imageIdentifier", cdk.validateString)(properties.imageIdentifier));
  errors.collect(cdk.propertyValidator("imageRepositoryType", cdk.requiredValidator)(properties.imageRepositoryType));
  errors.collect(cdk.propertyValidator("imageRepositoryType", cdk.validateString)(properties.imageRepositoryType));
  return errors.wrap("supplied properties not correct for \"ImageRepositoryProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceImageRepositoryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceImageRepositoryPropertyValidator(properties).assertSuccess();
  return {
    "ImageConfiguration": convertCfnServiceImageConfigurationPropertyToCloudFormation(properties.imageConfiguration),
    "ImageIdentifier": cdk.stringToCloudFormation(properties.imageIdentifier),
    "ImageRepositoryType": cdk.stringToCloudFormation(properties.imageRepositoryType)
  };
}

// @ts-ignore TS6133
function CfnServiceImageRepositoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.ImageRepositoryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.ImageRepositoryProperty>();
  ret.addPropertyResult("imageConfiguration", "ImageConfiguration", (properties.ImageConfiguration != null ? CfnServiceImageConfigurationPropertyFromCloudFormation(properties.ImageConfiguration) : undefined));
  ret.addPropertyResult("imageIdentifier", "ImageIdentifier", (properties.ImageIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ImageIdentifier) : undefined));
  ret.addPropertyResult("imageRepositoryType", "ImageRepositoryType", (properties.ImageRepositoryType != null ? cfn_parse.FromCloudFormation.getString(properties.ImageRepositoryType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationConfiguration", CfnServiceAuthenticationConfigurationPropertyValidator)(properties.authenticationConfiguration));
  errors.collect(cdk.propertyValidator("autoDeploymentsEnabled", cdk.validateBoolean)(properties.autoDeploymentsEnabled));
  errors.collect(cdk.propertyValidator("codeRepository", CfnServiceCodeRepositoryPropertyValidator)(properties.codeRepository));
  errors.collect(cdk.propertyValidator("imageRepository", CfnServiceImageRepositoryPropertyValidator)(properties.imageRepository));
  return errors.wrap("supplied properties not correct for \"SourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationConfiguration": convertCfnServiceAuthenticationConfigurationPropertyToCloudFormation(properties.authenticationConfiguration),
    "AutoDeploymentsEnabled": cdk.booleanToCloudFormation(properties.autoDeploymentsEnabled),
    "CodeRepository": convertCfnServiceCodeRepositoryPropertyToCloudFormation(properties.codeRepository),
    "ImageRepository": convertCfnServiceImageRepositoryPropertyToCloudFormation(properties.imageRepository)
  };
}

// @ts-ignore TS6133
function CfnServiceSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.SourceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.SourceConfigurationProperty>();
  ret.addPropertyResult("authenticationConfiguration", "AuthenticationConfiguration", (properties.AuthenticationConfiguration != null ? CfnServiceAuthenticationConfigurationPropertyFromCloudFormation(properties.AuthenticationConfiguration) : undefined));
  ret.addPropertyResult("autoDeploymentsEnabled", "AutoDeploymentsEnabled", (properties.AutoDeploymentsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoDeploymentsEnabled) : undefined));
  ret.addPropertyResult("codeRepository", "CodeRepository", (properties.CodeRepository != null ? CfnServiceCodeRepositoryPropertyFromCloudFormation(properties.CodeRepository) : undefined));
  ret.addPropertyResult("imageRepository", "ImageRepository", (properties.ImageRepository != null ? CfnServiceImageRepositoryPropertyFromCloudFormation(properties.ImageRepository) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EgressConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EgressConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceEgressConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("egressType", cdk.requiredValidator)(properties.egressType));
  errors.collect(cdk.propertyValidator("egressType", cdk.validateString)(properties.egressType));
  errors.collect(cdk.propertyValidator("vpcConnectorArn", cdk.validateString)(properties.vpcConnectorArn));
  return errors.wrap("supplied properties not correct for \"EgressConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceEgressConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceEgressConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EgressType": cdk.stringToCloudFormation(properties.egressType),
    "VpcConnectorArn": cdk.stringToCloudFormation(properties.vpcConnectorArn)
  };
}

// @ts-ignore TS6133
function CfnServiceEgressConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.EgressConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.EgressConfigurationProperty>();
  ret.addPropertyResult("egressType", "EgressType", (properties.EgressType != null ? cfn_parse.FromCloudFormation.getString(properties.EgressType) : undefined));
  ret.addPropertyResult("vpcConnectorArn", "VpcConnectorArn", (properties.VpcConnectorArn != null ? cfn_parse.FromCloudFormation.getString(properties.VpcConnectorArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IngressConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IngressConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceIngressConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isPubliclyAccessible", cdk.requiredValidator)(properties.isPubliclyAccessible));
  errors.collect(cdk.propertyValidator("isPubliclyAccessible", cdk.validateBoolean)(properties.isPubliclyAccessible));
  return errors.wrap("supplied properties not correct for \"IngressConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceIngressConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceIngressConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "IsPubliclyAccessible": cdk.booleanToCloudFormation(properties.isPubliclyAccessible)
  };
}

// @ts-ignore TS6133
function CfnServiceIngressConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.IngressConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.IngressConfigurationProperty>();
  ret.addPropertyResult("isPubliclyAccessible", "IsPubliclyAccessible", (properties.IsPubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsPubliclyAccessible) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("egressConfiguration", CfnServiceEgressConfigurationPropertyValidator)(properties.egressConfiguration));
  errors.collect(cdk.propertyValidator("ingressConfiguration", CfnServiceIngressConfigurationPropertyValidator)(properties.ingressConfiguration));
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EgressConfiguration": convertCfnServiceEgressConfigurationPropertyToCloudFormation(properties.egressConfiguration),
    "IngressConfiguration": convertCfnServiceIngressConfigurationPropertyToCloudFormation(properties.ingressConfiguration),
    "IpAddressType": cdk.stringToCloudFormation(properties.ipAddressType)
  };
}

// @ts-ignore TS6133
function CfnServiceNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.NetworkConfigurationProperty>();
  ret.addPropertyResult("egressConfiguration", "EgressConfiguration", (properties.EgressConfiguration != null ? CfnServiceEgressConfigurationPropertyFromCloudFormation(properties.EgressConfiguration) : undefined));
  ret.addPropertyResult("ingressConfiguration", "IngressConfiguration", (properties.IngressConfiguration != null ? CfnServiceIngressConfigurationPropertyFromCloudFormation(properties.IngressConfiguration) : undefined));
  ret.addPropertyResult("ipAddressType", "IpAddressType", (properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServiceProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScalingConfigurationArn", cdk.validateString)(properties.autoScalingConfigurationArn));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnServiceEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("healthCheckConfiguration", CfnServiceHealthCheckConfigurationPropertyValidator)(properties.healthCheckConfiguration));
  errors.collect(cdk.propertyValidator("instanceConfiguration", CfnServiceInstanceConfigurationPropertyValidator)(properties.instanceConfiguration));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnServiceNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("observabilityConfiguration", CfnServiceServiceObservabilityConfigurationPropertyValidator)(properties.observabilityConfiguration));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  errors.collect(cdk.propertyValidator("sourceConfiguration", cdk.requiredValidator)(properties.sourceConfiguration));
  errors.collect(cdk.propertyValidator("sourceConfiguration", CfnServiceSourceConfigurationPropertyValidator)(properties.sourceConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnServiceProps\"");
}

// @ts-ignore TS6133
function convertCfnServicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServicePropsValidator(properties).assertSuccess();
  return {
    "AutoScalingConfigurationArn": cdk.stringToCloudFormation(properties.autoScalingConfigurationArn),
    "EncryptionConfiguration": convertCfnServiceEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "HealthCheckConfiguration": convertCfnServiceHealthCheckConfigurationPropertyToCloudFormation(properties.healthCheckConfiguration),
    "InstanceConfiguration": convertCfnServiceInstanceConfigurationPropertyToCloudFormation(properties.instanceConfiguration),
    "NetworkConfiguration": convertCfnServiceNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "ObservabilityConfiguration": convertCfnServiceServiceObservabilityConfigurationPropertyToCloudFormation(properties.observabilityConfiguration),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName),
    "SourceConfiguration": convertCfnServiceSourceConfigurationPropertyToCloudFormation(properties.sourceConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnServicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProps>();
  ret.addPropertyResult("autoScalingConfigurationArn", "AutoScalingConfigurationArn", (properties.AutoScalingConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingConfigurationArn) : undefined));
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnServiceEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("healthCheckConfiguration", "HealthCheckConfiguration", (properties.HealthCheckConfiguration != null ? CfnServiceHealthCheckConfigurationPropertyFromCloudFormation(properties.HealthCheckConfiguration) : undefined));
  ret.addPropertyResult("instanceConfiguration", "InstanceConfiguration", (properties.InstanceConfiguration != null ? CfnServiceInstanceConfigurationPropertyFromCloudFormation(properties.InstanceConfiguration) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnServiceNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("observabilityConfiguration", "ObservabilityConfiguration", (properties.ObservabilityConfiguration != null ? CfnServiceServiceObservabilityConfigurationPropertyFromCloudFormation(properties.ObservabilityConfiguration) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addPropertyResult("sourceConfiguration", "SourceConfiguration", (properties.SourceConfiguration != null ? CfnServiceSourceConfigurationPropertyFromCloudFormation(properties.SourceConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specify an AWS App Runner VPC connector by using the `AWS::AppRunner::VpcConnector` resource in an AWS CloudFormation template.
 *
 * The `AWS::AppRunner::VpcConnector` resource is an AWS App Runner resource type that specifies an App Runner VPC connector.
 *
 * App Runner requires this resource when you want to associate your App Runner service to a custom Amazon Virtual Private Cloud ( Amazon VPC ).
 *
 * @cloudformationResource AWS::AppRunner::VpcConnector
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcconnector.html
 */
export class CfnVpcConnector extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppRunner::VpcConnector";

  /**
   * Build a CfnVpcConnector from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcConnector {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVpcConnectorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVpcConnector(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of this VPC connector.
   *
   * @cloudformationAttribute VpcConnectorArn
   */
  public readonly attrVpcConnectorArn: string;

  /**
   * The revision of this VPC connector. It's unique among all the active connectors ( `"Status": "ACTIVE"` ) that share the same `Name` .
   *
   * > At this time, App Runner supports only one revision per name.
   *
   * @cloudformationAttribute VpcConnectorRevision
   */
  public readonly attrVpcConnectorRevision: number;

  /**
   * A list of IDs of security groups that App Runner should use for access to AWS resources under the specified subnets.
   */
  public securityGroups?: Array<string>;

  /**
   * A list of IDs of subnets that App Runner should use when it associates your service with a custom Amazon VPC.
   */
  public subnets: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of metadata items that you can associate with your VPC connector resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A name for the VPC connector.
   */
  public vpcConnectorName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVpcConnectorProps) {
    super(scope, id, {
      "type": CfnVpcConnector.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "subnets", this);

    this.attrVpcConnectorArn = cdk.Token.asString(this.getAtt("VpcConnectorArn", cdk.ResolutionTypeHint.STRING));
    this.attrVpcConnectorRevision = cdk.Token.asNumber(this.getAtt("VpcConnectorRevision", cdk.ResolutionTypeHint.NUMBER));
    this.securityGroups = props.securityGroups;
    this.subnets = props.subnets;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppRunner::VpcConnector", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcConnectorName = props.vpcConnectorName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "securityGroups": this.securityGroups,
      "subnets": this.subnets,
      "tags": this.tags.renderTags(),
      "vpcConnectorName": this.vpcConnectorName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcConnector.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVpcConnectorPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVpcConnector`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcconnector.html
 */
export interface CfnVpcConnectorProps {
  /**
   * A list of IDs of security groups that App Runner should use for access to AWS resources under the specified subnets.
   *
   * If not specified, App Runner uses the default security group of the Amazon VPC. The default security group allows all outbound traffic.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcconnector.html#cfn-apprunner-vpcconnector-securitygroups
   */
  readonly securityGroups?: Array<string>;

  /**
   * A list of IDs of subnets that App Runner should use when it associates your service with a custom Amazon VPC.
   *
   * Specify IDs of subnets of a single Amazon VPC. App Runner determines the Amazon VPC from the subnets you specify.
   *
   * > App Runner currently only provides support for IPv4.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcconnector.html#cfn-apprunner-vpcconnector-subnets
   */
  readonly subnets: Array<string>;

  /**
   * A list of metadata items that you can associate with your VPC connector resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcconnector.html#cfn-apprunner-vpcconnector-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A name for the VPC connector.
   *
   * If you don't specify a name, AWS CloudFormation generates a name for your VPC connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcconnector.html#cfn-apprunner-vpcconnector-vpcconnectorname
   */
  readonly vpcConnectorName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnVpcConnectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcConnectorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcConnectorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcConnectorName", cdk.validateString)(properties.vpcConnectorName));
  return errors.wrap("supplied properties not correct for \"CfnVpcConnectorProps\"");
}

// @ts-ignore TS6133
function convertCfnVpcConnectorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcConnectorPropsValidator(properties).assertSuccess();
  return {
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcConnectorName": cdk.stringToCloudFormation(properties.vpcConnectorName)
  };
}

// @ts-ignore TS6133
function CfnVpcConnectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcConnectorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcConnectorProps>();
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcConnectorName", "VpcConnectorName", (properties.VpcConnectorName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcConnectorName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specify an AWS App Runner VPC Ingress Connection by using the `AWS::AppRunner::VpcIngressConnection` resource in an AWS CloudFormation template.
 *
 * The `AWS::AppRunner::VpcIngressConnection` resource is an AWS App Runner resource type that specifies an App Runner VPC Ingress Connection.
 *
 * App Runner requires this resource when you want to associate your App Runner service to an Amazon VPC endpoint.
 *
 * @cloudformationResource AWS::AppRunner::VpcIngressConnection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcingressconnection.html
 */
export class CfnVpcIngressConnection extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppRunner::VpcIngressConnection";

  /**
   * Build a CfnVpcIngressConnection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcIngressConnection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVpcIngressConnectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVpcIngressConnection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The domain name associated with the VPC Ingress Connection resource.
   *
   * @cloudformationAttribute DomainName
   */
  public readonly attrDomainName: string;

  /**
   * The current status of the VPC Ingress Connection. The VPC Ingress Connection displays one of the following statuses: `AVAILABLE` , `PENDING_CREATION` , `PENDING_UPDATE` , `PENDING_DELETION` , `FAILED_CREATION` , `FAILED_UPDATE` , `FAILED_DELETION` , and `DELETED` ..
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The Amazon Resource Name (ARN) of the VPC Ingress Connection.
   *
   * @cloudformationAttribute VpcIngressConnectionArn
   */
  public readonly attrVpcIngressConnectionArn: string;

  /**
   * Specifications for the customer’s Amazon VPC and the related AWS PrivateLink VPC endpoint that are used to create the VPC Ingress Connection resource.
   */
  public ingressVpcConfiguration: CfnVpcIngressConnection.IngressVpcConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) for this App Runner service that is used to create the VPC Ingress Connection resource.
   */
  public serviceArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional list of metadata items that you can associate with the VPC Ingress Connection resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The customer-provided VPC Ingress Connection name.
   */
  public vpcIngressConnectionName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVpcIngressConnectionProps) {
    super(scope, id, {
      "type": CfnVpcIngressConnection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "ingressVpcConfiguration", this);
    cdk.requireProperty(props, "serviceArn", this);

    this.attrDomainName = cdk.Token.asString(this.getAtt("DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrVpcIngressConnectionArn = cdk.Token.asString(this.getAtt("VpcIngressConnectionArn", cdk.ResolutionTypeHint.STRING));
    this.ingressVpcConfiguration = props.ingressVpcConfiguration;
    this.serviceArn = props.serviceArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppRunner::VpcIngressConnection", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcIngressConnectionName = props.vpcIngressConnectionName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "ingressVpcConfiguration": this.ingressVpcConfiguration,
      "serviceArn": this.serviceArn,
      "tags": this.tags.renderTags(),
      "vpcIngressConnectionName": this.vpcIngressConnectionName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcIngressConnection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVpcIngressConnectionPropsToCloudFormation(props);
  }
}

export namespace CfnVpcIngressConnection {
  /**
   * Specifications for the customer’s VPC and related PrivateLink VPC endpoint that are used to associate with the VPC Ingress Connection resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-vpcingressconnection-ingressvpcconfiguration.html
   */
  export interface IngressVpcConfigurationProperty {
    /**
     * The ID of the VPC endpoint that your App Runner service connects to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-vpcingressconnection-ingressvpcconfiguration.html#cfn-apprunner-vpcingressconnection-ingressvpcconfiguration-vpcendpointid
     */
    readonly vpcEndpointId: string;

    /**
     * The ID of the VPC that is used for the VPC endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-vpcingressconnection-ingressvpcconfiguration.html#cfn-apprunner-vpcingressconnection-ingressvpcconfiguration-vpcid
     */
    readonly vpcId: string;
  }
}

/**
 * Properties for defining a `CfnVpcIngressConnection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcingressconnection.html
 */
export interface CfnVpcIngressConnectionProps {
  /**
   * Specifications for the customer’s Amazon VPC and the related AWS PrivateLink VPC endpoint that are used to create the VPC Ingress Connection resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcingressconnection.html#cfn-apprunner-vpcingressconnection-ingressvpcconfiguration
   */
  readonly ingressVpcConfiguration: CfnVpcIngressConnection.IngressVpcConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) for this App Runner service that is used to create the VPC Ingress Connection resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcingressconnection.html#cfn-apprunner-vpcingressconnection-servicearn
   */
  readonly serviceArn: string;

  /**
   * An optional list of metadata items that you can associate with the VPC Ingress Connection resource.
   *
   * A tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcingressconnection.html#cfn-apprunner-vpcingressconnection-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The customer-provided VPC Ingress Connection name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apprunner-vpcingressconnection.html#cfn-apprunner-vpcingressconnection-vpcingressconnectionname
   */
  readonly vpcIngressConnectionName?: string;
}

/**
 * Determine whether the given properties match those of a `IngressVpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IngressVpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcIngressConnectionIngressVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vpcEndpointId", cdk.requiredValidator)(properties.vpcEndpointId));
  errors.collect(cdk.propertyValidator("vpcEndpointId", cdk.validateString)(properties.vpcEndpointId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"IngressVpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnVpcIngressConnectionIngressVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcIngressConnectionIngressVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "VpcEndpointId": cdk.stringToCloudFormation(properties.vpcEndpointId),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnVpcIngressConnectionIngressVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcIngressConnection.IngressVpcConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcIngressConnection.IngressVpcConfigurationProperty>();
  ret.addPropertyResult("vpcEndpointId", "VpcEndpointId", (properties.VpcEndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcEndpointId) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVpcIngressConnectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcIngressConnectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcIngressConnectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ingressVpcConfiguration", cdk.requiredValidator)(properties.ingressVpcConfiguration));
  errors.collect(cdk.propertyValidator("ingressVpcConfiguration", CfnVpcIngressConnectionIngressVpcConfigurationPropertyValidator)(properties.ingressVpcConfiguration));
  errors.collect(cdk.propertyValidator("serviceArn", cdk.requiredValidator)(properties.serviceArn));
  errors.collect(cdk.propertyValidator("serviceArn", cdk.validateString)(properties.serviceArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcIngressConnectionName", cdk.validateString)(properties.vpcIngressConnectionName));
  return errors.wrap("supplied properties not correct for \"CfnVpcIngressConnectionProps\"");
}

// @ts-ignore TS6133
function convertCfnVpcIngressConnectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcIngressConnectionPropsValidator(properties).assertSuccess();
  return {
    "IngressVpcConfiguration": convertCfnVpcIngressConnectionIngressVpcConfigurationPropertyToCloudFormation(properties.ingressVpcConfiguration),
    "ServiceArn": cdk.stringToCloudFormation(properties.serviceArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcIngressConnectionName": cdk.stringToCloudFormation(properties.vpcIngressConnectionName)
  };
}

// @ts-ignore TS6133
function CfnVpcIngressConnectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcIngressConnectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcIngressConnectionProps>();
  ret.addPropertyResult("ingressVpcConfiguration", "IngressVpcConfiguration", (properties.IngressVpcConfiguration != null ? CfnVpcIngressConnectionIngressVpcConfigurationPropertyFromCloudFormation(properties.IngressVpcConfiguration) : undefined));
  ret.addPropertyResult("serviceArn", "ServiceArn", (properties.ServiceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcIngressConnectionName", "VpcIngressConnectionName", (properties.VpcIngressConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.VpcIngressConnectionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}