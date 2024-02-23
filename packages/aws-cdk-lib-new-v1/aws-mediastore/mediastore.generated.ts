/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::MediaStore::Container resource specifies a storage container to hold objects.
 *
 * A container is similar to a bucket in Amazon S3.
 *
 * When you create a container using AWS CloudFormation , the template manages data for five API actions: creating a container, setting access logging, updating the default container policy, adding a cross-origin resource sharing (CORS) policy, and adding an object lifecycle policy.
 *
 * @cloudformationResource AWS::MediaStore::Container
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html
 */
export class CfnContainer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaStore::Container";

  /**
   * Build a CfnContainer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContainer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnContainerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContainer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The DNS endpoint of the container. Use the endpoint to identify the specific container when sending requests to the data plane. The service assigns this value when the container is created. Once the value has been assigned, it does not change.
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The state of access logging on the container.
   */
  public accessLoggingEnabled?: boolean | cdk.IResolvable;

  /**
   * The name for the container.
   */
  public containerName: string;

  /**
   * Sets the cross-origin resource sharing (CORS) configuration on a container so that the container can service cross-origin requests.
   */
  public corsPolicy?: Array<CfnContainer.CorsRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Writes an object lifecycle policy to a container.
   */
  public lifecyclePolicy?: string;

  /**
   * The metric policy that is associated with the container.
   */
  public metricPolicy?: cdk.IResolvable | CfnContainer.MetricPolicyProperty;

  /**
   * Creates an access policy for the specified container to restrict the users and clients that can access it.
   */
  public policy?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnContainerProps) {
    super(scope, id, {
      "type": CfnContainer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "containerName", this);

    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.accessLoggingEnabled = props.accessLoggingEnabled;
    this.containerName = props.containerName;
    this.corsPolicy = props.corsPolicy;
    this.lifecyclePolicy = props.lifecyclePolicy;
    this.metricPolicy = props.metricPolicy;
    this.policy = props.policy;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaStore::Container", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessLoggingEnabled": this.accessLoggingEnabled,
      "containerName": this.containerName,
      "corsPolicy": this.corsPolicy,
      "lifecyclePolicy": this.lifecyclePolicy,
      "metricPolicy": this.metricPolicy,
      "policy": this.policy,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContainer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContainerPropsToCloudFormation(props);
  }
}

export namespace CfnContainer {
  /**
   * The metric policy that is associated with the container.
   *
   * A metric policy allows AWS Elemental MediaStore to send metrics to Amazon CloudWatch. In the policy, you must indicate whether you want MediaStore to send container-level metrics. You can also include rules to define groups of objects that you want MediaStore to send object-level metrics for.
   *
   * To view examples of how to construct a metric policy for your use case, see [Example Metric Policies](https://docs.aws.amazon.com/mediastore/latest/ug/policies-metric-examples.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-metricpolicy.html
   */
  export interface MetricPolicyProperty {
    /**
     * A setting to enable or disable metrics at the container level.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-metricpolicy.html#cfn-mediastore-container-metricpolicy-containerlevelmetrics
     */
    readonly containerLevelMetrics: string;

    /**
     * A parameter that holds an array of rules that enable metrics at the object level.
     *
     * This parameter is optional, but if you choose to include it, you must also include at least one rule. By default, you can include up to five rules. You can also [request a quota increase](https://docs.aws.amazon.com/servicequotas/home?region=us-east-1#!/services/mediastore/quotas) to allow up to 300 rules per policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-metricpolicy.html#cfn-mediastore-container-metricpolicy-metricpolicyrules
     */
    readonly metricPolicyRules?: Array<cdk.IResolvable | CfnContainer.MetricPolicyRuleProperty> | cdk.IResolvable;
  }

  /**
   * A setting that enables metrics at the object level.
   *
   * Each rule contains an object group and an object group name. If the policy includes the MetricPolicyRules parameter, you must include at least one rule. Each metric policy can include up to five rules by default. You can also [request a quota increase](https://docs.aws.amazon.com/servicequotas/home?region=us-east-1#!/services/mediastore/quotas) to allow up to 300 rules per policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-metricpolicyrule.html
   */
  export interface MetricPolicyRuleProperty {
    /**
     * A path or file name that defines which objects to include in the group.
     *
     * Wildcards (*) are acceptable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-metricpolicyrule.html#cfn-mediastore-container-metricpolicyrule-objectgroup
     */
    readonly objectGroup: string;

    /**
     * A name that allows you to refer to the object group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-metricpolicyrule.html#cfn-mediastore-container-metricpolicyrule-objectgroupname
     */
    readonly objectGroupName: string;
  }

  /**
   * A rule for a CORS policy.
   *
   * You can add up to 100 rules to a CORS policy. If more than one rule applies, the service uses the first applicable rule listed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-corsrule.html
   */
  export interface CorsRuleProperty {
    /**
     * Specifies which headers are allowed in a preflight `OPTIONS` request through the `Access-Control-Request-Headers` header.
     *
     * Each header name that is specified in `Access-Control-Request-Headers` must have a corresponding entry in the rule. Only the headers that were requested are sent back.
     *
     * This element can contain only one wildcard character (*).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-corsrule.html#cfn-mediastore-container-corsrule-allowedheaders
     */
    readonly allowedHeaders?: Array<string>;

    /**
     * Identifies an HTTP method that the origin that is specified in the rule is allowed to execute.
     *
     * Each CORS rule must contain at least one `AllowedMethods` and one `AllowedOrigins` element.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-corsrule.html#cfn-mediastore-container-corsrule-allowedmethods
     */
    readonly allowedMethods?: Array<string>;

    /**
     * One or more response headers that you want users to be able to access from their applications (for example, from a JavaScript `XMLHttpRequest` object).
     *
     * Each CORS rule must have at least one `AllowedOrigins` element. The string value can include only one wildcard character (*), for example, http://*.example.com. Additionally, you can specify only one wildcard character to allow cross-origin access for all origins.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-corsrule.html#cfn-mediastore-container-corsrule-allowedorigins
     */
    readonly allowedOrigins?: Array<string>;

    /**
     * One or more headers in the response that you want users to be able to access from their applications (for example, from a JavaScript `XMLHttpRequest` object).
     *
     * This element is optional for each rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-corsrule.html#cfn-mediastore-container-corsrule-exposeheaders
     */
    readonly exposeHeaders?: Array<string>;

    /**
     * The time in seconds that your browser caches the preflight response for the specified resource.
     *
     * A CORS rule can have only one `MaxAgeSeconds` element.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediastore-container-corsrule.html#cfn-mediastore-container-corsrule-maxageseconds
     */
    readonly maxAgeSeconds?: number;
  }
}

/**
 * Properties for defining a `CfnContainer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html
 */
export interface CfnContainerProps {
  /**
   * The state of access logging on the container.
   *
   * This value is `false` by default, indicating that AWS Elemental MediaStore does not send access logs to Amazon CloudWatch Logs. When you enable access logging on the container, MediaStore changes this value to `true` , indicating that the service delivers access logs for objects stored in that container to CloudWatch Logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html#cfn-mediastore-container-accessloggingenabled
   */
  readonly accessLoggingEnabled?: boolean | cdk.IResolvable;

  /**
   * The name for the container.
   *
   * The name must be from 1 to 255 characters. Container names must be unique to your AWS account within a specific region. As an example, you could create a container named `movies` in every region, as long as you don’t have an existing container with that name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html#cfn-mediastore-container-containername
   */
  readonly containerName: string;

  /**
   * Sets the cross-origin resource sharing (CORS) configuration on a container so that the container can service cross-origin requests.
   *
   * For example, you might want to enable a request whose origin is http://www.example.com to access your AWS Elemental MediaStore container at my.example.container.com by using the browser's XMLHttpRequest capability.
   *
   * To enable CORS on a container, you attach a CORS policy to the container. In the CORS policy, you configure rules that identify origins and the HTTP methods that can be executed on your container. The policy can contain up to 398,000 characters. You can add up to 100 rules to a CORS policy. If more than one rule applies, the service uses the first applicable rule listed.
   *
   * To learn more about CORS, see [Cross-Origin Resource Sharing (CORS) in AWS Elemental MediaStore](https://docs.aws.amazon.com/mediastore/latest/ug/cors-policy.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html#cfn-mediastore-container-corspolicy
   */
  readonly corsPolicy?: Array<CfnContainer.CorsRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Writes an object lifecycle policy to a container.
   *
   * If the container already has an object lifecycle policy, the service replaces the existing policy with the new policy. It takes up to 20 minutes for the change to take effect.
   *
   * For information about how to construct an object lifecycle policy, see [Components of an Object Lifecycle Policy](https://docs.aws.amazon.com/mediastore/latest/ug/policies-object-lifecycle-components.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html#cfn-mediastore-container-lifecyclepolicy
   */
  readonly lifecyclePolicy?: string;

  /**
   * The metric policy that is associated with the container.
   *
   * A metric policy allows AWS Elemental MediaStore to send metrics to Amazon CloudWatch. In the policy, you must indicate whether you want MediaStore to send container-level metrics. You can also include rules to define groups of objects that you want MediaStore to send object-level metrics for.
   *
   * To view examples of how to construct a metric policy for your use case, see [Example Metric Policies](https://docs.aws.amazon.com/mediastore/latest/ug/policies-metric-examples.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html#cfn-mediastore-container-metricpolicy
   */
  readonly metricPolicy?: cdk.IResolvable | CfnContainer.MetricPolicyProperty;

  /**
   * Creates an access policy for the specified container to restrict the users and clients that can access it.
   *
   * For information about the data that is included in an access policy, see the [AWS Identity and Access Management User Guide](https://docs.aws.amazon.com/iam/) .
   *
   * For this release of the REST API, you can create only one policy for a container. If you enter `PutContainerPolicy` twice, the second command modifies the existing policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html#cfn-mediastore-container-policy
   */
  readonly policy?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediastore-container.html#cfn-mediastore-container-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `MetricPolicyRuleProperty`
 *
 * @param properties - the TypeScript properties of a `MetricPolicyRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerMetricPolicyRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("objectGroup", cdk.requiredValidator)(properties.objectGroup));
  errors.collect(cdk.propertyValidator("objectGroup", cdk.validateString)(properties.objectGroup));
  errors.collect(cdk.propertyValidator("objectGroupName", cdk.requiredValidator)(properties.objectGroupName));
  errors.collect(cdk.propertyValidator("objectGroupName", cdk.validateString)(properties.objectGroupName));
  return errors.wrap("supplied properties not correct for \"MetricPolicyRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerMetricPolicyRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerMetricPolicyRulePropertyValidator(properties).assertSuccess();
  return {
    "ObjectGroup": cdk.stringToCloudFormation(properties.objectGroup),
    "ObjectGroupName": cdk.stringToCloudFormation(properties.objectGroupName)
  };
}

// @ts-ignore TS6133
function CfnContainerMetricPolicyRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContainer.MetricPolicyRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.MetricPolicyRuleProperty>();
  ret.addPropertyResult("objectGroup", "ObjectGroup", (properties.ObjectGroup != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectGroup) : undefined));
  ret.addPropertyResult("objectGroupName", "ObjectGroupName", (properties.ObjectGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectGroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `MetricPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerMetricPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerLevelMetrics", cdk.requiredValidator)(properties.containerLevelMetrics));
  errors.collect(cdk.propertyValidator("containerLevelMetrics", cdk.validateString)(properties.containerLevelMetrics));
  errors.collect(cdk.propertyValidator("metricPolicyRules", cdk.listValidator(CfnContainerMetricPolicyRulePropertyValidator))(properties.metricPolicyRules));
  return errors.wrap("supplied properties not correct for \"MetricPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerMetricPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerMetricPolicyPropertyValidator(properties).assertSuccess();
  return {
    "ContainerLevelMetrics": cdk.stringToCloudFormation(properties.containerLevelMetrics),
    "MetricPolicyRules": cdk.listMapper(convertCfnContainerMetricPolicyRulePropertyToCloudFormation)(properties.metricPolicyRules)
  };
}

// @ts-ignore TS6133
function CfnContainerMetricPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContainer.MetricPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.MetricPolicyProperty>();
  ret.addPropertyResult("containerLevelMetrics", "ContainerLevelMetrics", (properties.ContainerLevelMetrics != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerLevelMetrics) : undefined));
  ret.addPropertyResult("metricPolicyRules", "MetricPolicyRules", (properties.MetricPolicyRules != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerMetricPolicyRulePropertyFromCloudFormation)(properties.MetricPolicyRules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CorsRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CorsRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerCorsRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedHeaders", cdk.listValidator(cdk.validateString))(properties.allowedHeaders));
  errors.collect(cdk.propertyValidator("allowedMethods", cdk.listValidator(cdk.validateString))(properties.allowedMethods));
  errors.collect(cdk.propertyValidator("allowedOrigins", cdk.listValidator(cdk.validateString))(properties.allowedOrigins));
  errors.collect(cdk.propertyValidator("exposeHeaders", cdk.listValidator(cdk.validateString))(properties.exposeHeaders));
  errors.collect(cdk.propertyValidator("maxAgeSeconds", cdk.validateNumber)(properties.maxAgeSeconds));
  return errors.wrap("supplied properties not correct for \"CorsRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerCorsRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerCorsRulePropertyValidator(properties).assertSuccess();
  return {
    "AllowedHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedHeaders),
    "AllowedMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedMethods),
    "AllowedOrigins": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOrigins),
    "ExposeHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.exposeHeaders),
    "MaxAgeSeconds": cdk.numberToCloudFormation(properties.maxAgeSeconds)
  };
}

// @ts-ignore TS6133
function CfnContainerCorsRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.CorsRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.CorsRuleProperty>();
  ret.addPropertyResult("allowedHeaders", "AllowedHeaders", (properties.AllowedHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedHeaders) : undefined));
  ret.addPropertyResult("allowedMethods", "AllowedMethods", (properties.AllowedMethods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedMethods) : undefined));
  ret.addPropertyResult("allowedOrigins", "AllowedOrigins", (properties.AllowedOrigins != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedOrigins) : undefined));
  ret.addPropertyResult("exposeHeaders", "ExposeHeaders", (properties.ExposeHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExposeHeaders) : undefined));
  ret.addPropertyResult("maxAgeSeconds", "MaxAgeSeconds", (properties.MaxAgeSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAgeSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnContainerProps`
 *
 * @param properties - the TypeScript properties of a `CfnContainerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLoggingEnabled", cdk.validateBoolean)(properties.accessLoggingEnabled));
  errors.collect(cdk.propertyValidator("containerName", cdk.requiredValidator)(properties.containerName));
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  errors.collect(cdk.propertyValidator("corsPolicy", cdk.listValidator(CfnContainerCorsRulePropertyValidator))(properties.corsPolicy));
  errors.collect(cdk.propertyValidator("lifecyclePolicy", cdk.validateString)(properties.lifecyclePolicy));
  errors.collect(cdk.propertyValidator("metricPolicy", CfnContainerMetricPolicyPropertyValidator)(properties.metricPolicy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateString)(properties.policy));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnContainerProps\"");
}

// @ts-ignore TS6133
function convertCfnContainerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerPropsValidator(properties).assertSuccess();
  return {
    "AccessLoggingEnabled": cdk.booleanToCloudFormation(properties.accessLoggingEnabled),
    "ContainerName": cdk.stringToCloudFormation(properties.containerName),
    "CorsPolicy": cdk.listMapper(convertCfnContainerCorsRulePropertyToCloudFormation)(properties.corsPolicy),
    "LifecyclePolicy": cdk.stringToCloudFormation(properties.lifecyclePolicy),
    "MetricPolicy": convertCfnContainerMetricPolicyPropertyToCloudFormation(properties.metricPolicy),
    "Policy": cdk.stringToCloudFormation(properties.policy),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnContainerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerProps>();
  ret.addPropertyResult("accessLoggingEnabled", "AccessLoggingEnabled", (properties.AccessLoggingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AccessLoggingEnabled) : undefined));
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addPropertyResult("corsPolicy", "CorsPolicy", (properties.CorsPolicy != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerCorsRulePropertyFromCloudFormation)(properties.CorsPolicy) : undefined));
  ret.addPropertyResult("lifecyclePolicy", "LifecyclePolicy", (properties.LifecyclePolicy != null ? cfn_parse.FromCloudFormation.getString(properties.LifecyclePolicy) : undefined));
  ret.addPropertyResult("metricPolicy", "MetricPolicy", (properties.MetricPolicy != null ? CfnContainerMetricPolicyPropertyFromCloudFormation(properties.MetricPolicy) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getString(properties.Policy) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}