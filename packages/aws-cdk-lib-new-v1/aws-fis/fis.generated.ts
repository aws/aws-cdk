/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies an experiment template.
 *
 * An experiment template includes the following components:
 *
 * - *Targets* : A target can be a specific resource in your AWS environment, or one or more resources that match criteria that you specify, for example, resources that have specific tags.
 * - *Actions* : The actions to carry out on the target. You can specify multiple actions, the duration of each action, and when to start each action during an experiment.
 * - *Stop conditions* : If a stop condition is triggered while an experiment is running, the experiment is automatically stopped. You can define a stop condition as a CloudWatch alarm.
 *
 * For more information, see [Experiment templates](https://docs.aws.amazon.com/fis/latest/userguide/experiment-templates.html) in the *AWS Fault Injection Service User Guide* .
 *
 * @cloudformationResource AWS::FIS::ExperimentTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html
 */
export class CfnExperimentTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::FIS::ExperimentTemplate";

  /**
   * Build a CfnExperimentTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExperimentTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnExperimentTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnExperimentTemplate(scope, id, propsResult.value);
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
   * The actions for the experiment.
   */
  public actions?: cdk.IResolvable | Record<string, CfnExperimentTemplate.ExperimentTemplateActionProperty | cdk.IResolvable>;

  /**
   * The description for the experiment template.
   */
  public description: string;

  /**
   * The experiment options for an experiment template.
   */
  public experimentOptions?: CfnExperimentTemplate.ExperimentTemplateExperimentOptionsProperty | cdk.IResolvable;

  /**
   * The configuration for experiment logging.
   */
  public logConfiguration?: CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of an IAM role.
   */
  public roleArn: string;

  /**
   * The stop conditions for the experiment.
   */
  public stopConditions: Array<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the experiment template.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The targets for the experiment.
   */
  public targets: cdk.IResolvable | Record<string, CfnExperimentTemplate.ExperimentTemplateTargetProperty | cdk.IResolvable>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnExperimentTemplateProps) {
    super(scope, id, {
      "type": CfnExperimentTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "stopConditions", this);
    cdk.requireProperty(props, "targets", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.actions = props.actions;
    this.description = props.description;
    this.experimentOptions = props.experimentOptions;
    this.logConfiguration = props.logConfiguration;
    this.roleArn = props.roleArn;
    this.stopConditions = props.stopConditions;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::FIS::ExperimentTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targets = props.targets;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "description": this.description,
      "experimentOptions": this.experimentOptions,
      "logConfiguration": this.logConfiguration,
      "roleArn": this.roleArn,
      "stopConditions": this.stopConditions,
      "tags": this.tags.renderTags(),
      "targets": this.targets
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnExperimentTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnExperimentTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnExperimentTemplate {
  /**
   * Specifies an action for an experiment template.
   *
   * For more information, see [Actions](https://docs.aws.amazon.com/fis/latest/userguide/actions.html) in the *AWS Fault Injection Service User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html
   */
  export interface ExperimentTemplateActionProperty {
    /**
     * The ID of the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-actionid
     */
    readonly actionId: string;

    /**
     * A description for the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-description
     */
    readonly description?: string;

    /**
     * The parameters for the action, if applicable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-parameters
     */
    readonly parameters?: cdk.IResolvable | Record<string, string>;

    /**
     * The name of the action that must be completed before the current action starts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-startafter
     */
    readonly startAfter?: Array<string>;

    /**
     * One or more targets for the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-targets
     */
    readonly targets?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * Specifies a stop condition for an experiment template.
   *
   * For more information, see [Stop conditions](https://docs.aws.amazon.com/fis/latest/userguide/stop-conditions.html) in the *AWS Fault Injection Service User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html
   */
  export interface ExperimentTemplateStopConditionProperty {
    /**
     * The source for the stop condition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html#cfn-fis-experimenttemplate-experimenttemplatestopcondition-source
     */
    readonly source: string;

    /**
     * The Amazon Resource Name (ARN) of the CloudWatch alarm, if applicable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html#cfn-fis-experimenttemplate-experimenttemplatestopcondition-value
     */
    readonly value?: string;
  }

  /**
   * Specifies a target for an experiment.
   *
   * You must specify at least one Amazon Resource Name (ARN) or at least one resource tag. You cannot specify both ARNs and tags.
   *
   * For more information, see [Targets](https://docs.aws.amazon.com/fis/latest/userguide/targets.html) in the *AWS Fault Injection Service User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html
   */
  export interface ExperimentTemplateTargetProperty {
    /**
     * The filters to apply to identify target resources using specific attributes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-filters
     */
    readonly filters?: Array<CfnExperimentTemplate.ExperimentTemplateTargetFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The parameters for the resource type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-parameters
     */
    readonly parameters?: cdk.IResolvable | Record<string, string>;

    /**
     * The Amazon Resource Names (ARNs) of the targets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcearns
     */
    readonly resourceArns?: Array<string>;

    /**
     * The tags for the target resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcetags
     */
    readonly resourceTags?: cdk.IResolvable | Record<string, string>;

    /**
     * The resource type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcetype
     */
    readonly resourceType: string;

    /**
     * Scopes the identified resources to a specific count or percentage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-selectionmode
     */
    readonly selectionMode: string;
  }

  /**
   * Specifies a filter used for the target resource input in an experiment template.
   *
   * For more information, see [Resource filters](https://docs.aws.amazon.com/fis/latest/userguide/targets.html#target-filters) in the *AWS Fault Injection Service User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html
   */
  export interface ExperimentTemplateTargetFilterProperty {
    /**
     * The attribute path for the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html#cfn-fis-experimenttemplate-experimenttemplatetargetfilter-path
     */
    readonly path: string;

    /**
     * The attribute values for the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html#cfn-fis-experimenttemplate-experimenttemplatetargetfilter-values
     */
    readonly values: Array<string>;
  }

  /**
   * Specifies the configuration for experiment logging.
   *
   * For more information, see [Experiment logging](https://docs.aws.amazon.com/fis/latest/userguide/monitoring-logging.html) in the *AWS Fault Injection Service User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html
   */
  export interface ExperimentTemplateLogConfigurationProperty {
    /**
     * The configuration for experiment logging to CloudWatch Logs .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-cloudwatchlogsconfiguration
     */
    readonly cloudWatchLogsConfiguration?: any | cdk.IResolvable;

    /**
     * The schema version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-logschemaversion
     */
    readonly logSchemaVersion: number;

    /**
     * The configuration for experiment logging to Amazon S3 .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-s3configuration
     */
    readonly s3Configuration?: any | cdk.IResolvable;
  }

  /**
   * Describes the experiment options for an experiment template.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateexperimentoptions.html
   */
  export interface ExperimentTemplateExperimentOptionsProperty {
    /**
     * The account targeting setting for an experiment template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateexperimentoptions.html#cfn-fis-experimenttemplate-experimenttemplateexperimentoptions-accounttargeting
     */
    readonly accountTargeting?: string;

    /**
     * The empty target resolution mode for an experiment template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateexperimentoptions.html#cfn-fis-experimenttemplate-experimenttemplateexperimentoptions-emptytargetresolutionmode
     */
    readonly emptyTargetResolutionMode?: string;
  }

  /**
   * Specifies the configuration for experiment logging to CloudWatch Logs .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-cloudwatchlogsconfiguration.html
   */
  export interface CloudWatchLogsConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the destination Amazon CloudWatch Logs log group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-cloudwatchlogsconfiguration.html#cfn-fis-experimenttemplate-cloudwatchlogsconfiguration-loggrouparn
     */
    readonly logGroupArn: string;
  }

  /**
   * Specifies the configuration for experiment logging to Amazon S3 .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html
   */
  export interface S3ConfigurationProperty {
    /**
     * The name of the destination bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html#cfn-fis-experimenttemplate-s3configuration-bucketname
     */
    readonly bucketName: string;

    /**
     * The bucket prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html#cfn-fis-experimenttemplate-s3configuration-prefix
     */
    readonly prefix?: string;
  }
}

/**
 * Properties for defining a `CfnExperimentTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html
 */
export interface CfnExperimentTemplateProps {
  /**
   * The actions for the experiment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-actions
   */
  readonly actions?: cdk.IResolvable | Record<string, CfnExperimentTemplate.ExperimentTemplateActionProperty | cdk.IResolvable>;

  /**
   * The description for the experiment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-description
   */
  readonly description: string;

  /**
   * The experiment options for an experiment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-experimentoptions
   */
  readonly experimentOptions?: CfnExperimentTemplate.ExperimentTemplateExperimentOptionsProperty | cdk.IResolvable;

  /**
   * The configuration for experiment logging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-logconfiguration
   */
  readonly logConfiguration?: CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of an IAM role.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-rolearn
   */
  readonly roleArn: string;

  /**
   * The stop conditions for the experiment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-stopconditions
   */
  readonly stopConditions: Array<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The tags for the experiment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The targets for the experiment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-targets
   */
  readonly targets: cdk.IResolvable | Record<string, CfnExperimentTemplate.ExperimentTemplateTargetProperty | cdk.IResolvable>;
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateActionProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionId", cdk.requiredValidator)(properties.actionId));
  errors.collect(cdk.propertyValidator("actionId", cdk.validateString)(properties.actionId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("startAfter", cdk.listValidator(cdk.validateString))(properties.startAfter));
  errors.collect(cdk.propertyValidator("targets", cdk.hashValidator(cdk.validateString))(properties.targets));
  return errors.wrap("supplied properties not correct for \"ExperimentTemplateActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplateExperimentTemplateActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplateExperimentTemplateActionPropertyValidator(properties).assertSuccess();
  return {
    "ActionId": cdk.stringToCloudFormation(properties.actionId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "StartAfter": cdk.listMapper(cdk.stringToCloudFormation)(properties.startAfter),
    "Targets": cdk.hashMapper(cdk.stringToCloudFormation)(properties.targets)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateActionProperty>();
  ret.addPropertyResult("actionId", "ActionId", (properties.ActionId != null ? cfn_parse.FromCloudFormation.getString(properties.ActionId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("startAfter", "StartAfter", (properties.StartAfter != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StartAfter) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Targets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateStopConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateStopConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateStopConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ExperimentTemplateStopConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplateExperimentTemplateStopConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplateExperimentTemplateStopConditionPropertyValidator(properties).assertSuccess();
  return {
    "Source": cdk.stringToCloudFormation(properties.source),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateStopConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty>();
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateTargetFilterProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateTargetFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateTargetFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"ExperimentTemplateTargetFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplateExperimentTemplateTargetFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplateExperimentTemplateTargetFilterPropertyValidator(properties).assertSuccess();
  return {
    "Path": cdk.stringToCloudFormation(properties.path),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateTargetFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateTargetFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateTargetFilterProperty>();
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateTargetProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filters", cdk.listValidator(CfnExperimentTemplateExperimentTemplateTargetFilterPropertyValidator))(properties.filters));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("resourceArns", cdk.listValidator(cdk.validateString))(properties.resourceArns));
  errors.collect(cdk.propertyValidator("resourceTags", cdk.hashValidator(cdk.validateString))(properties.resourceTags));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("selectionMode", cdk.requiredValidator)(properties.selectionMode));
  errors.collect(cdk.propertyValidator("selectionMode", cdk.validateString)(properties.selectionMode));
  return errors.wrap("supplied properties not correct for \"ExperimentTemplateTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplateExperimentTemplateTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplateExperimentTemplateTargetPropertyValidator(properties).assertSuccess();
  return {
    "Filters": cdk.listMapper(convertCfnExperimentTemplateExperimentTemplateTargetFilterPropertyToCloudFormation)(properties.filters),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "ResourceArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceArns),
    "ResourceTags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.resourceTags),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "SelectionMode": cdk.stringToCloudFormation(properties.selectionMode)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateTargetProperty>();
  ret.addPropertyResult("filters", "Filters", (properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnExperimentTemplateExperimentTemplateTargetFilterPropertyFromCloudFormation)(properties.Filters) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("resourceArns", "ResourceArns", (properties.ResourceArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceArns) : undefined));
  ret.addPropertyResult("resourceTags", "ResourceTags", (properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResourceTags) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("selectionMode", "SelectionMode", (properties.SelectionMode != null ? cfn_parse.FromCloudFormation.getString(properties.SelectionMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateLogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateLogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogsConfiguration", cdk.validateObject)(properties.cloudWatchLogsConfiguration));
  errors.collect(cdk.propertyValidator("logSchemaVersion", cdk.requiredValidator)(properties.logSchemaVersion));
  errors.collect(cdk.propertyValidator("logSchemaVersion", cdk.validateNumber)(properties.logSchemaVersion));
  errors.collect(cdk.propertyValidator("s3Configuration", cdk.validateObject)(properties.s3Configuration));
  return errors.wrap("supplied properties not correct for \"ExperimentTemplateLogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplateExperimentTemplateLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplateExperimentTemplateLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogsConfiguration": cdk.objectToCloudFormation(properties.cloudWatchLogsConfiguration),
    "LogSchemaVersion": cdk.numberToCloudFormation(properties.logSchemaVersion),
    "S3Configuration": cdk.objectToCloudFormation(properties.s3Configuration)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty>();
  ret.addPropertyResult("cloudWatchLogsConfiguration", "CloudWatchLogsConfiguration", (properties.CloudWatchLogsConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.CloudWatchLogsConfiguration) : undefined));
  ret.addPropertyResult("logSchemaVersion", "LogSchemaVersion", (properties.LogSchemaVersion != null ? cfn_parse.FromCloudFormation.getNumber(properties.LogSchemaVersion) : undefined));
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? cfn_parse.FromCloudFormation.getAny(properties.S3Configuration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateExperimentOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateExperimentOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateExperimentOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountTargeting", cdk.validateString)(properties.accountTargeting));
  errors.collect(cdk.propertyValidator("emptyTargetResolutionMode", cdk.validateString)(properties.emptyTargetResolutionMode));
  return errors.wrap("supplied properties not correct for \"ExperimentTemplateExperimentOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplateExperimentTemplateExperimentOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplateExperimentTemplateExperimentOptionsPropertyValidator(properties).assertSuccess();
  return {
    "AccountTargeting": cdk.stringToCloudFormation(properties.accountTargeting),
    "EmptyTargetResolutionMode": cdk.stringToCloudFormation(properties.emptyTargetResolutionMode)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateExperimentOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateExperimentOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateExperimentOptionsProperty>();
  ret.addPropertyResult("accountTargeting", "AccountTargeting", (properties.AccountTargeting != null ? cfn_parse.FromCloudFormation.getString(properties.AccountTargeting) : undefined));
  ret.addPropertyResult("emptyTargetResolutionMode", "EmptyTargetResolutionMode", (properties.EmptyTargetResolutionMode != null ? cfn_parse.FromCloudFormation.getString(properties.EmptyTargetResolutionMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnExperimentTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnExperimentTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.hashValidator(CfnExperimentTemplateExperimentTemplateActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("experimentOptions", CfnExperimentTemplateExperimentTemplateExperimentOptionsPropertyValidator)(properties.experimentOptions));
  errors.collect(cdk.propertyValidator("logConfiguration", CfnExperimentTemplateExperimentTemplateLogConfigurationPropertyValidator)(properties.logConfiguration));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("stopConditions", cdk.requiredValidator)(properties.stopConditions));
  errors.collect(cdk.propertyValidator("stopConditions", cdk.listValidator(CfnExperimentTemplateExperimentTemplateStopConditionPropertyValidator))(properties.stopConditions));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("targets", cdk.requiredValidator)(properties.targets));
  errors.collect(cdk.propertyValidator("targets", cdk.hashValidator(CfnExperimentTemplateExperimentTemplateTargetPropertyValidator))(properties.targets));
  return errors.wrap("supplied properties not correct for \"CfnExperimentTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplatePropsValidator(properties).assertSuccess();
  return {
    "Actions": cdk.hashMapper(convertCfnExperimentTemplateExperimentTemplateActionPropertyToCloudFormation)(properties.actions),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExperimentOptions": convertCfnExperimentTemplateExperimentTemplateExperimentOptionsPropertyToCloudFormation(properties.experimentOptions),
    "LogConfiguration": convertCfnExperimentTemplateExperimentTemplateLogConfigurationPropertyToCloudFormation(properties.logConfiguration),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "StopConditions": cdk.listMapper(convertCfnExperimentTemplateExperimentTemplateStopConditionPropertyToCloudFormation)(properties.stopConditions),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Targets": cdk.hashMapper(convertCfnExperimentTemplateExperimentTemplateTargetPropertyToCloudFormation)(properties.targets)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplateProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getMap(CfnExperimentTemplateExperimentTemplateActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("experimentOptions", "ExperimentOptions", (properties.ExperimentOptions != null ? CfnExperimentTemplateExperimentTemplateExperimentOptionsPropertyFromCloudFormation(properties.ExperimentOptions) : undefined));
  ret.addPropertyResult("logConfiguration", "LogConfiguration", (properties.LogConfiguration != null ? CfnExperimentTemplateExperimentTemplateLogConfigurationPropertyFromCloudFormation(properties.LogConfiguration) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("stopConditions", "StopConditions", (properties.StopConditions != null ? cfn_parse.FromCloudFormation.getArray(CfnExperimentTemplateExperimentTemplateStopConditionPropertyFromCloudFormation)(properties.StopConditions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getMap(CfnExperimentTemplateExperimentTemplateTargetPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplateCloudWatchLogsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.requiredValidator)(properties.logGroupArn));
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.validateString)(properties.logGroupArn));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplateCloudWatchLogsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplateCloudWatchLogsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupArn": cdk.stringToCloudFormation(properties.logGroupArn)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplateCloudWatchLogsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.CloudWatchLogsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.CloudWatchLogsConfigurationProperty>();
  ret.addPropertyResult("logGroupArn", "LogGroupArn", (properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTemplateS3ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"S3ConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTemplateS3ConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTemplateS3ConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnExperimentTemplateS3ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnExperimentTemplate.S3ConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.S3ConfigurationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a target account configuration for the experiment template.
 *
 * A target account configuration is required when `accountTargeting` of `experimentOptions` is set to `multi-account` . For more information, see [experiment options](https://docs.aws.amazon.com/fis/latest/userguide/experiment-options.html) in the *AWS Fault Injection Service User Guide* .
 *
 * @cloudformationResource AWS::FIS::TargetAccountConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-targetaccountconfiguration.html
 */
export class CfnTargetAccountConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::FIS::TargetAccountConfiguration";

  /**
   * Build a CfnTargetAccountConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTargetAccountConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTargetAccountConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTargetAccountConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The AWS account ID of the target account.
   */
  public accountId: string;

  /**
   * The description of the target account.
   */
  public description?: string;

  /**
   * The ID of the experiment template.
   */
  public experimentTemplateId: string;

  /**
   * The Amazon Resource Name (ARN) of an IAM role for the target account.
   */
  public roleArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTargetAccountConfigurationProps) {
    super(scope, id, {
      "type": CfnTargetAccountConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountId", this);
    cdk.requireProperty(props, "experimentTemplateId", this);
    cdk.requireProperty(props, "roleArn", this);

    this.accountId = props.accountId;
    this.description = props.description;
    this.experimentTemplateId = props.experimentTemplateId;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountId": this.accountId,
      "description": this.description,
      "experimentTemplateId": this.experimentTemplateId,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTargetAccountConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTargetAccountConfigurationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTargetAccountConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-targetaccountconfiguration.html
 */
export interface CfnTargetAccountConfigurationProps {
  /**
   * The AWS account ID of the target account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-targetaccountconfiguration.html#cfn-fis-targetaccountconfiguration-accountid
   */
  readonly accountId: string;

  /**
   * The description of the target account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-targetaccountconfiguration.html#cfn-fis-targetaccountconfiguration-description
   */
  readonly description?: string;

  /**
   * The ID of the experiment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-targetaccountconfiguration.html#cfn-fis-targetaccountconfiguration-experimenttemplateid
   */
  readonly experimentTemplateId: string;

  /**
   * The Amazon Resource Name (ARN) of an IAM role for the target account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-targetaccountconfiguration.html#cfn-fis-targetaccountconfiguration-rolearn
   */
  readonly roleArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnTargetAccountConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTargetAccountConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetAccountConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.requiredValidator)(properties.accountId));
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("experimentTemplateId", cdk.requiredValidator)(properties.experimentTemplateId));
  errors.collect(cdk.propertyValidator("experimentTemplateId", cdk.validateString)(properties.experimentTemplateId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnTargetAccountConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnTargetAccountConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetAccountConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExperimentTemplateId": cdk.stringToCloudFormation(properties.experimentTemplateId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnTargetAccountConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTargetAccountConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetAccountConfigurationProps>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("experimentTemplateId", "ExperimentTemplateId", (properties.ExperimentTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.ExperimentTemplateId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}