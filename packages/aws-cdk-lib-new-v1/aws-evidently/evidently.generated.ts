/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates or updates an Evidently *experiment* .
 *
 * Before you create an experiment, you must create the feature to use for the experiment.
 *
 * An experiment helps you make feature design decisions based on evidence and data. An experiment can test as many as five variations at once. Evidently collects experiment data and analyzes it by statistical methods, and provides clear recommendations about which variations perform better.
 *
 * @cloudformationResource AWS::Evidently::Experiment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html
 */
export class CfnExperiment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Evidently::Experiment";

  /**
   * Build a CfnExperiment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExperiment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnExperimentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnExperiment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the experiment. For example, `arn:aws:evidently:us-west-2:0123455678912:project/myProject/experiment/myExperiment`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * An optional description of the experiment.
   */
  public description?: string;

  /**
   * An array of structures that defines the metrics used for the experiment, and whether a higher or lower value for each metric is the goal.
   */
  public metricGoals: Array<cdk.IResolvable | CfnExperiment.MetricGoalObjectProperty> | cdk.IResolvable;

  /**
   * A name for the new experiment.
   */
  public name: string;

  /**
   * A structure that contains the configuration of which variation to use as the "control" version.
   */
  public onlineAbConfig: cdk.IResolvable | CfnExperiment.OnlineAbConfigObjectProperty;

  /**
   * The name or the ARN of the project where this experiment is to be created.
   */
  public project: string;

  /**
   * When Evidently assigns a particular user session to an experiment, it must use a randomization ID to determine which variation the user session is served.
   */
  public randomizationSalt?: string;

  /**
   * Set this to `true` to remove the segment that is associated with this experiment.
   */
  public removeSegment?: boolean | cdk.IResolvable;

  /**
   * A structure that you can use to start and stop the experiment.
   */
  public runningStatus?: cdk.IResolvable | CfnExperiment.RunningStatusObjectProperty;

  /**
   * The portion of the available audience that you want to allocate to this experiment, in thousandths of a percent.
   */
  public samplingRate?: number;

  /**
   * Specifies an audience *segment* to use in the experiment.
   */
  public segment?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Assigns one or more tags (key-value pairs) to the experiment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * An array of structures that describe the configuration of each feature variation used in the experiment.
   */
  public treatments: Array<cdk.IResolvable | CfnExperiment.TreatmentObjectProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnExperimentProps) {
    super(scope, id, {
      "type": CfnExperiment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "metricGoals", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "onlineAbConfig", this);
    cdk.requireProperty(props, "project", this);
    cdk.requireProperty(props, "treatments", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.metricGoals = props.metricGoals;
    this.name = props.name;
    this.onlineAbConfig = props.onlineAbConfig;
    this.project = props.project;
    this.randomizationSalt = props.randomizationSalt;
    this.removeSegment = props.removeSegment;
    this.runningStatus = props.runningStatus;
    this.samplingRate = props.samplingRate;
    this.segment = props.segment;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Evidently::Experiment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.treatments = props.treatments;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "metricGoals": this.metricGoals,
      "name": this.name,
      "onlineAbConfig": this.onlineAbConfig,
      "project": this.project,
      "randomizationSalt": this.randomizationSalt,
      "removeSegment": this.removeSegment,
      "runningStatus": this.runningStatus,
      "samplingRate": this.samplingRate,
      "segment": this.segment,
      "tags": this.tags.renderTags(),
      "treatments": this.treatments
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnExperiment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnExperimentPropsToCloudFormation(props);
  }
}

export namespace CfnExperiment {
  /**
   * Use this structure to start and stop the experiment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-runningstatusobject.html
   */
  export interface RunningStatusObjectProperty {
    /**
     * If you are using AWS CloudFormation to start the experiment, use this field to specify when the experiment is to end.
     *
     * The format is as a UNIX timestamp. For more information about this format, see [The Current Epoch Unix Timestamp](https://docs.aws.amazon.com/https://www.unixtimestamp.com/index.php) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-runningstatusobject.html#cfn-evidently-experiment-runningstatusobject-analysiscompletetime
     */
    readonly analysisCompleteTime?: string;

    /**
     * If you are using AWS CloudFormation to stop this experiment, specify either `COMPLETED` or `CANCELLED` here to indicate how to classify this experiment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-runningstatusobject.html#cfn-evidently-experiment-runningstatusobject-desiredstate
     */
    readonly desiredState?: string;

    /**
     * If you are using AWS CloudFormation to stop this experiment, this is an optional field that you can use to record why the experiment is being stopped or cancelled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-runningstatusobject.html#cfn-evidently-experiment-runningstatusobject-reason
     */
    readonly reason?: string;

    /**
     * To start the experiment now, specify `START` for this parameter.
     *
     * If this experiment is currently running and you want to stop it now, specify `STOP` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-runningstatusobject.html#cfn-evidently-experiment-runningstatusobject-status
     */
    readonly status: string;
  }

  /**
   * Use this structure to tell Evidently whether higher or lower values are desired for a metric that is used in an experiment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-metricgoalobject.html
   */
  export interface MetricGoalObjectProperty {
    /**
     * `INCREASE` means that a variation with a higher number for this metric is performing better.
     *
     * `DECREASE` means that a variation with a lower number for this metric is performing better.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-metricgoalobject.html#cfn-evidently-experiment-metricgoalobject-desiredchange
     */
    readonly desiredChange: string;

    /**
     * The entity, such as a user or session, that does an action that causes a metric value to be recorded.
     *
     * An example is `userDetails.userID` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-metricgoalobject.html#cfn-evidently-experiment-metricgoalobject-entityidkey
     */
    readonly entityIdKey: string;

    /**
     * The EventBridge event pattern that defines how the metric is recorded.
     *
     * For more information about EventBridge event patterns, see [Amazon EventBridge event patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-metricgoalobject.html#cfn-evidently-experiment-metricgoalobject-eventpattern
     */
    readonly eventPattern?: string;

    /**
     * A name for the metric.
     *
     * It can include up to 255 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-metricgoalobject.html#cfn-evidently-experiment-metricgoalobject-metricname
     */
    readonly metricName: string;

    /**
     * A label for the units that the metric is measuring.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-metricgoalobject.html#cfn-evidently-experiment-metricgoalobject-unitlabel
     */
    readonly unitLabel?: string;

    /**
     * The JSON path to reference the numerical metric value in the event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-metricgoalobject.html#cfn-evidently-experiment-metricgoalobject-valuekey
     */
    readonly valueKey: string;
  }

  /**
   * A structure that contains the configuration of which variation to use as the "control" version.
   *
   * The "control" version is used for comparison with other variations. This structure also specifies how much experiment traffic is allocated to each variation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-onlineabconfigobject.html
   */
  export interface OnlineAbConfigObjectProperty {
    /**
     * The name of the variation that is to be the default variation that the other variations are compared to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-onlineabconfigobject.html#cfn-evidently-experiment-onlineabconfigobject-controltreatmentname
     */
    readonly controlTreatmentName?: string;

    /**
     * A set of key-value pairs.
     *
     * The keys are treatment names, and the values are the portion of experiment traffic to be assigned to that treatment. Specify the traffic portion in thousandths of a percent, so 20,000 for a variation would allocate 20% of the experiment traffic to that variation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-onlineabconfigobject.html#cfn-evidently-experiment-onlineabconfigobject-treatmentweights
     */
    readonly treatmentWeights?: Array<cdk.IResolvable | CfnExperiment.TreatmentToWeightProperty> | cdk.IResolvable;
  }

  /**
   * This structure defines how much experiment traffic to allocate to one treatment used in the experiment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-treatmenttoweight.html
   */
  export interface TreatmentToWeightProperty {
    /**
     * The portion of experiment traffic to allocate to this treatment.
     *
     * Specify the traffic portion in thousandths of a percent, so 20,000 allocated to a treatment would allocate 20% of the experiment traffic to that treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-treatmenttoweight.html#cfn-evidently-experiment-treatmenttoweight-splitweight
     */
    readonly splitWeight: number;

    /**
     * The name of the treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-treatmenttoweight.html#cfn-evidently-experiment-treatmenttoweight-treatment
     */
    readonly treatment: string;
  }

  /**
   * A structure that defines one treatment in an experiment.
   *
   * A treatment is a variation of the feature that you are including in the experiment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-treatmentobject.html
   */
  export interface TreatmentObjectProperty {
    /**
     * The description of the treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-treatmentobject.html#cfn-evidently-experiment-treatmentobject-description
     */
    readonly description?: string;

    /**
     * The name of the feature for this experiment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-treatmentobject.html#cfn-evidently-experiment-treatmentobject-feature
     */
    readonly feature: string;

    /**
     * A name for this treatment.
     *
     * It can include up to 127 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-treatmentobject.html#cfn-evidently-experiment-treatmentobject-treatmentname
     */
    readonly treatmentName: string;

    /**
     * The name of the variation to use for this treatment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-experiment-treatmentobject.html#cfn-evidently-experiment-treatmentobject-variation
     */
    readonly variation: string;
  }
}

/**
 * Properties for defining a `CfnExperiment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html
 */
export interface CfnExperimentProps {
  /**
   * An optional description of the experiment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-description
   */
  readonly description?: string;

  /**
   * An array of structures that defines the metrics used for the experiment, and whether a higher or lower value for each metric is the goal.
   *
   * You can use up to three metrics in an experiment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-metricgoals
   */
  readonly metricGoals: Array<cdk.IResolvable | CfnExperiment.MetricGoalObjectProperty> | cdk.IResolvable;

  /**
   * A name for the new experiment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-name
   */
  readonly name: string;

  /**
   * A structure that contains the configuration of which variation to use as the "control" version.
   *
   * The "control" version is used for comparison with other variations. This structure also specifies how much experiment traffic is allocated to each variation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-onlineabconfig
   */
  readonly onlineAbConfig: cdk.IResolvable | CfnExperiment.OnlineAbConfigObjectProperty;

  /**
   * The name or the ARN of the project where this experiment is to be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-project
   */
  readonly project: string;

  /**
   * When Evidently assigns a particular user session to an experiment, it must use a randomization ID to determine which variation the user session is served.
   *
   * This randomization ID is a combination of the entity ID and `randomizationSalt` . If you omit `randomizationSalt` , Evidently uses the experiment name as the `randomizationSalt` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-randomizationsalt
   */
  readonly randomizationSalt?: string;

  /**
   * Set this to `true` to remove the segment that is associated with this experiment.
   *
   * You can't use this parameter if the experiment is currently running.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-removesegment
   */
  readonly removeSegment?: boolean | cdk.IResolvable;

  /**
   * A structure that you can use to start and stop the experiment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-runningstatus
   */
  readonly runningStatus?: cdk.IResolvable | CfnExperiment.RunningStatusObjectProperty;

  /**
   * The portion of the available audience that you want to allocate to this experiment, in thousandths of a percent.
   *
   * The available audience is the total audience minus the audience that you have allocated to overrides or current launches of this feature.
   *
   * This is represented in thousandths of a percent. For example, specify 10,000 to allocate 10% of the available audience.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-samplingrate
   */
  readonly samplingRate?: number;

  /**
   * Specifies an audience *segment* to use in the experiment.
   *
   * When a segment is used in an experiment, only user sessions that match the segment pattern are used in the experiment.
   *
   * For more information, see [Segment rule pattern syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Evidently-segments.html#CloudWatch-Evidently-segments-syntax) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-segment
   */
  readonly segment?: string;

  /**
   * Assigns one or more tags (key-value pairs) to the experiment.
   *
   * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
   *
   * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters.
   *
   * You can associate as many as 50 tags with an experiment.
   *
   * For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * An array of structures that describe the configuration of each feature variation used in the experiment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-experiment.html#cfn-evidently-experiment-treatments
   */
  readonly treatments: Array<cdk.IResolvable | CfnExperiment.TreatmentObjectProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `RunningStatusObjectProperty`
 *
 * @param properties - the TypeScript properties of a `RunningStatusObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentRunningStatusObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("analysisCompleteTime", cdk.validateString)(properties.analysisCompleteTime));
  errors.collect(cdk.propertyValidator("desiredState", cdk.validateString)(properties.desiredState));
  errors.collect(cdk.propertyValidator("reason", cdk.validateString)(properties.reason));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"RunningStatusObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentRunningStatusObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentRunningStatusObjectPropertyValidator(properties).assertSuccess();
  return {
    "AnalysisCompleteTime": cdk.stringToCloudFormation(properties.analysisCompleteTime),
    "DesiredState": cdk.stringToCloudFormation(properties.desiredState),
    "Reason": cdk.stringToCloudFormation(properties.reason),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnExperimentRunningStatusObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnExperiment.RunningStatusObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperiment.RunningStatusObjectProperty>();
  ret.addPropertyResult("analysisCompleteTime", "AnalysisCompleteTime", (properties.AnalysisCompleteTime != null ? cfn_parse.FromCloudFormation.getString(properties.AnalysisCompleteTime) : undefined));
  ret.addPropertyResult("desiredState", "DesiredState", (properties.DesiredState != null ? cfn_parse.FromCloudFormation.getString(properties.DesiredState) : undefined));
  ret.addPropertyResult("reason", "Reason", (properties.Reason != null ? cfn_parse.FromCloudFormation.getString(properties.Reason) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricGoalObjectProperty`
 *
 * @param properties - the TypeScript properties of a `MetricGoalObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentMetricGoalObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("desiredChange", cdk.requiredValidator)(properties.desiredChange));
  errors.collect(cdk.propertyValidator("desiredChange", cdk.validateString)(properties.desiredChange));
  errors.collect(cdk.propertyValidator("entityIdKey", cdk.requiredValidator)(properties.entityIdKey));
  errors.collect(cdk.propertyValidator("entityIdKey", cdk.validateString)(properties.entityIdKey));
  errors.collect(cdk.propertyValidator("eventPattern", cdk.validateString)(properties.eventPattern));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("unitLabel", cdk.validateString)(properties.unitLabel));
  errors.collect(cdk.propertyValidator("valueKey", cdk.requiredValidator)(properties.valueKey));
  errors.collect(cdk.propertyValidator("valueKey", cdk.validateString)(properties.valueKey));
  return errors.wrap("supplied properties not correct for \"MetricGoalObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentMetricGoalObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentMetricGoalObjectPropertyValidator(properties).assertSuccess();
  return {
    "DesiredChange": cdk.stringToCloudFormation(properties.desiredChange),
    "EntityIdKey": cdk.stringToCloudFormation(properties.entityIdKey),
    "EventPattern": cdk.stringToCloudFormation(properties.eventPattern),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "UnitLabel": cdk.stringToCloudFormation(properties.unitLabel),
    "ValueKey": cdk.stringToCloudFormation(properties.valueKey)
  };
}

// @ts-ignore TS6133
function CfnExperimentMetricGoalObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnExperiment.MetricGoalObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperiment.MetricGoalObjectProperty>();
  ret.addPropertyResult("desiredChange", "DesiredChange", (properties.DesiredChange != null ? cfn_parse.FromCloudFormation.getString(properties.DesiredChange) : undefined));
  ret.addPropertyResult("entityIdKey", "EntityIdKey", (properties.EntityIdKey != null ? cfn_parse.FromCloudFormation.getString(properties.EntityIdKey) : undefined));
  ret.addPropertyResult("eventPattern", "EventPattern", (properties.EventPattern != null ? cfn_parse.FromCloudFormation.getString(properties.EventPattern) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("unitLabel", "UnitLabel", (properties.UnitLabel != null ? cfn_parse.FromCloudFormation.getString(properties.UnitLabel) : undefined));
  ret.addPropertyResult("valueKey", "ValueKey", (properties.ValueKey != null ? cfn_parse.FromCloudFormation.getString(properties.ValueKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TreatmentToWeightProperty`
 *
 * @param properties - the TypeScript properties of a `TreatmentToWeightProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTreatmentToWeightPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("splitWeight", cdk.requiredValidator)(properties.splitWeight));
  errors.collect(cdk.propertyValidator("splitWeight", cdk.validateNumber)(properties.splitWeight));
  errors.collect(cdk.propertyValidator("treatment", cdk.requiredValidator)(properties.treatment));
  errors.collect(cdk.propertyValidator("treatment", cdk.validateString)(properties.treatment));
  return errors.wrap("supplied properties not correct for \"TreatmentToWeightProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTreatmentToWeightPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTreatmentToWeightPropertyValidator(properties).assertSuccess();
  return {
    "SplitWeight": cdk.numberToCloudFormation(properties.splitWeight),
    "Treatment": cdk.stringToCloudFormation(properties.treatment)
  };
}

// @ts-ignore TS6133
function CfnExperimentTreatmentToWeightPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnExperiment.TreatmentToWeightProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperiment.TreatmentToWeightProperty>();
  ret.addPropertyResult("splitWeight", "SplitWeight", (properties.SplitWeight != null ? cfn_parse.FromCloudFormation.getNumber(properties.SplitWeight) : undefined));
  ret.addPropertyResult("treatment", "Treatment", (properties.Treatment != null ? cfn_parse.FromCloudFormation.getString(properties.Treatment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnlineAbConfigObjectProperty`
 *
 * @param properties - the TypeScript properties of a `OnlineAbConfigObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentOnlineAbConfigObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("controlTreatmentName", cdk.validateString)(properties.controlTreatmentName));
  errors.collect(cdk.propertyValidator("treatmentWeights", cdk.listValidator(CfnExperimentTreatmentToWeightPropertyValidator))(properties.treatmentWeights));
  return errors.wrap("supplied properties not correct for \"OnlineAbConfigObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentOnlineAbConfigObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentOnlineAbConfigObjectPropertyValidator(properties).assertSuccess();
  return {
    "ControlTreatmentName": cdk.stringToCloudFormation(properties.controlTreatmentName),
    "TreatmentWeights": cdk.listMapper(convertCfnExperimentTreatmentToWeightPropertyToCloudFormation)(properties.treatmentWeights)
  };
}

// @ts-ignore TS6133
function CfnExperimentOnlineAbConfigObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnExperiment.OnlineAbConfigObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperiment.OnlineAbConfigObjectProperty>();
  ret.addPropertyResult("controlTreatmentName", "ControlTreatmentName", (properties.ControlTreatmentName != null ? cfn_parse.FromCloudFormation.getString(properties.ControlTreatmentName) : undefined));
  ret.addPropertyResult("treatmentWeights", "TreatmentWeights", (properties.TreatmentWeights != null ? cfn_parse.FromCloudFormation.getArray(CfnExperimentTreatmentToWeightPropertyFromCloudFormation)(properties.TreatmentWeights) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TreatmentObjectProperty`
 *
 * @param properties - the TypeScript properties of a `TreatmentObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentTreatmentObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("feature", cdk.requiredValidator)(properties.feature));
  errors.collect(cdk.propertyValidator("feature", cdk.validateString)(properties.feature));
  errors.collect(cdk.propertyValidator("treatmentName", cdk.requiredValidator)(properties.treatmentName));
  errors.collect(cdk.propertyValidator("treatmentName", cdk.validateString)(properties.treatmentName));
  errors.collect(cdk.propertyValidator("variation", cdk.requiredValidator)(properties.variation));
  errors.collect(cdk.propertyValidator("variation", cdk.validateString)(properties.variation));
  return errors.wrap("supplied properties not correct for \"TreatmentObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnExperimentTreatmentObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentTreatmentObjectPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Feature": cdk.stringToCloudFormation(properties.feature),
    "TreatmentName": cdk.stringToCloudFormation(properties.treatmentName),
    "Variation": cdk.stringToCloudFormation(properties.variation)
  };
}

// @ts-ignore TS6133
function CfnExperimentTreatmentObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnExperiment.TreatmentObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperiment.TreatmentObjectProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("feature", "Feature", (properties.Feature != null ? cfn_parse.FromCloudFormation.getString(properties.Feature) : undefined));
  ret.addPropertyResult("treatmentName", "TreatmentName", (properties.TreatmentName != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentName) : undefined));
  ret.addPropertyResult("variation", "Variation", (properties.Variation != null ? cfn_parse.FromCloudFormation.getString(properties.Variation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnExperimentProps`
 *
 * @param properties - the TypeScript properties of a `CfnExperimentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExperimentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("metricGoals", cdk.requiredValidator)(properties.metricGoals));
  errors.collect(cdk.propertyValidator("metricGoals", cdk.listValidator(CfnExperimentMetricGoalObjectPropertyValidator))(properties.metricGoals));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("onlineAbConfig", cdk.requiredValidator)(properties.onlineAbConfig));
  errors.collect(cdk.propertyValidator("onlineAbConfig", CfnExperimentOnlineAbConfigObjectPropertyValidator)(properties.onlineAbConfig));
  errors.collect(cdk.propertyValidator("project", cdk.requiredValidator)(properties.project));
  errors.collect(cdk.propertyValidator("project", cdk.validateString)(properties.project));
  errors.collect(cdk.propertyValidator("randomizationSalt", cdk.validateString)(properties.randomizationSalt));
  errors.collect(cdk.propertyValidator("removeSegment", cdk.validateBoolean)(properties.removeSegment));
  errors.collect(cdk.propertyValidator("runningStatus", CfnExperimentRunningStatusObjectPropertyValidator)(properties.runningStatus));
  errors.collect(cdk.propertyValidator("samplingRate", cdk.validateNumber)(properties.samplingRate));
  errors.collect(cdk.propertyValidator("segment", cdk.validateString)(properties.segment));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("treatments", cdk.requiredValidator)(properties.treatments));
  errors.collect(cdk.propertyValidator("treatments", cdk.listValidator(CfnExperimentTreatmentObjectPropertyValidator))(properties.treatments));
  return errors.wrap("supplied properties not correct for \"CfnExperimentProps\"");
}

// @ts-ignore TS6133
function convertCfnExperimentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExperimentPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "MetricGoals": cdk.listMapper(convertCfnExperimentMetricGoalObjectPropertyToCloudFormation)(properties.metricGoals),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OnlineAbConfig": convertCfnExperimentOnlineAbConfigObjectPropertyToCloudFormation(properties.onlineAbConfig),
    "Project": cdk.stringToCloudFormation(properties.project),
    "RandomizationSalt": cdk.stringToCloudFormation(properties.randomizationSalt),
    "RemoveSegment": cdk.booleanToCloudFormation(properties.removeSegment),
    "RunningStatus": convertCfnExperimentRunningStatusObjectPropertyToCloudFormation(properties.runningStatus),
    "SamplingRate": cdk.numberToCloudFormation(properties.samplingRate),
    "Segment": cdk.stringToCloudFormation(properties.segment),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Treatments": cdk.listMapper(convertCfnExperimentTreatmentObjectPropertyToCloudFormation)(properties.treatments)
  };
}

// @ts-ignore TS6133
function CfnExperimentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("metricGoals", "MetricGoals", (properties.MetricGoals != null ? cfn_parse.FromCloudFormation.getArray(CfnExperimentMetricGoalObjectPropertyFromCloudFormation)(properties.MetricGoals) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("onlineAbConfig", "OnlineAbConfig", (properties.OnlineAbConfig != null ? CfnExperimentOnlineAbConfigObjectPropertyFromCloudFormation(properties.OnlineAbConfig) : undefined));
  ret.addPropertyResult("project", "Project", (properties.Project != null ? cfn_parse.FromCloudFormation.getString(properties.Project) : undefined));
  ret.addPropertyResult("randomizationSalt", "RandomizationSalt", (properties.RandomizationSalt != null ? cfn_parse.FromCloudFormation.getString(properties.RandomizationSalt) : undefined));
  ret.addPropertyResult("removeSegment", "RemoveSegment", (properties.RemoveSegment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveSegment) : undefined));
  ret.addPropertyResult("runningStatus", "RunningStatus", (properties.RunningStatus != null ? CfnExperimentRunningStatusObjectPropertyFromCloudFormation(properties.RunningStatus) : undefined));
  ret.addPropertyResult("samplingRate", "SamplingRate", (properties.SamplingRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SamplingRate) : undefined));
  ret.addPropertyResult("segment", "Segment", (properties.Segment != null ? cfn_parse.FromCloudFormation.getString(properties.Segment) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("treatments", "Treatments", (properties.Treatments != null ? cfn_parse.FromCloudFormation.getArray(CfnExperimentTreatmentObjectPropertyFromCloudFormation)(properties.Treatments) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates an Evidently *feature* that you want to launch or test.
 *
 * You can define up to five variations of a feature, and use these variations in your launches and experiments. A feature must be created in a project. For information about creating a project, see [CreateProject](https://docs.aws.amazon.com/cloudwatchevidently/latest/APIReference/API_CreateProject.html) .
 *
 * @cloudformationResource AWS::Evidently::Feature
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html
 */
export class CfnFeature extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Evidently::Feature";

  /**
   * Build a CfnFeature from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFeature {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFeaturePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFeature(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the feature. For example, `arn:aws:evidently:us-west-2:0123455678912:project/myProject/feature/myFeature` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the variation to use as the default variation.
   */
  public defaultVariation?: string;

  /**
   * An optional description of the feature.
   */
  public description?: string;

  /**
   * Specify users that should always be served a specific variation of a feature.
   */
  public entityOverrides?: Array<CfnFeature.EntityOverrideProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specify `ALL_RULES` to activate the traffic allocation specified by any ongoing launches or experiments.
   */
  public evaluationStrategy?: string;

  /**
   * The name for the feature.
   */
  public name: string;

  /**
   * The name or ARN of the project that is to contain the new feature.
   */
  public project: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Assigns one or more tags (key-value pairs) to the feature.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * An array of structures that contain the configuration of the feature's different variations.
   */
  public variations: Array<cdk.IResolvable | CfnFeature.VariationObjectProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFeatureProps) {
    super(scope, id, {
      "type": CfnFeature.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "project", this);
    cdk.requireProperty(props, "variations", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.defaultVariation = props.defaultVariation;
    this.description = props.description;
    this.entityOverrides = props.entityOverrides;
    this.evaluationStrategy = props.evaluationStrategy;
    this.name = props.name;
    this.project = props.project;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Evidently::Feature", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.variations = props.variations;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "defaultVariation": this.defaultVariation,
      "description": this.description,
      "entityOverrides": this.entityOverrides,
      "evaluationStrategy": this.evaluationStrategy,
      "name": this.name,
      "project": this.project,
      "tags": this.tags.renderTags(),
      "variations": this.variations
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFeature.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFeaturePropsToCloudFormation(props);
  }
}

export namespace CfnFeature {
  /**
   * A set of key-value pairs that specify users who should always be served a specific variation of a feature.
   *
   * Each key specifies a user using their user ID, account ID, or some other identifier. The value specifies the name of the variation that the user is to be served.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-entityoverride.html
   */
  export interface EntityOverrideProperty {
    /**
     * The entity ID to be served the variation specified in `Variation` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-entityoverride.html#cfn-evidently-feature-entityoverride-entityid
     */
    readonly entityId?: string;

    /**
     * The name of the variation to serve to the user session that matches the `EntityId` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-entityoverride.html#cfn-evidently-feature-entityoverride-variation
     */
    readonly variation?: string;
  }

  /**
   * This structure contains the name and variation value of one variation of a feature.
   *
   * It can contain only one of the following parameters: `BooleanValue` , `DoubleValue` , `LongValue` or `StringValue` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-variationobject.html
   */
  export interface VariationObjectProperty {
    /**
     * The value assigned to this variation, if the variation type is boolean.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-variationobject.html#cfn-evidently-feature-variationobject-booleanvalue
     */
    readonly booleanValue?: boolean | cdk.IResolvable;

    /**
     * The value assigned to this variation, if the variation type is a double.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-variationobject.html#cfn-evidently-feature-variationobject-doublevalue
     */
    readonly doubleValue?: number;

    /**
     * The value assigned to this variation, if the variation type is a long.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-variationobject.html#cfn-evidently-feature-variationobject-longvalue
     */
    readonly longValue?: number;

    /**
     * The value assigned to this variation, if the variation type is a string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-variationobject.html#cfn-evidently-feature-variationobject-stringvalue
     */
    readonly stringValue?: string;

    /**
     * A name for the variation.
     *
     * It can include up to 127 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-feature-variationobject.html#cfn-evidently-feature-variationobject-variationname
     */
    readonly variationName: string;
  }
}

/**
 * Properties for defining a `CfnFeature`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html
 */
export interface CfnFeatureProps {
  /**
   * The name of the variation to use as the default variation.
   *
   * The default variation is served to users who are not allocated to any ongoing launches or experiments of this feature.
   *
   * This variation must also be listed in the `Variations` structure.
   *
   * If you omit `DefaultVariation` , the first variation listed in the `Variations` structure is used as the default variation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html#cfn-evidently-feature-defaultvariation
   */
  readonly defaultVariation?: string;

  /**
   * An optional description of the feature.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html#cfn-evidently-feature-description
   */
  readonly description?: string;

  /**
   * Specify users that should always be served a specific variation of a feature.
   *
   * Each user is specified by a key-value pair . For each key, specify a user by entering their user ID, account ID, or some other identifier. For the value, specify the name of the variation that they are to be served.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html#cfn-evidently-feature-entityoverrides
   */
  readonly entityOverrides?: Array<CfnFeature.EntityOverrideProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specify `ALL_RULES` to activate the traffic allocation specified by any ongoing launches or experiments.
   *
   * Specify `DEFAULT_VARIATION` to serve the default variation to all users instead.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html#cfn-evidently-feature-evaluationstrategy
   */
  readonly evaluationStrategy?: string;

  /**
   * The name for the feature.
   *
   * It can include up to 127 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html#cfn-evidently-feature-name
   */
  readonly name: string;

  /**
   * The name or ARN of the project that is to contain the new feature.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html#cfn-evidently-feature-project
   */
  readonly project: string;

  /**
   * Assigns one or more tags (key-value pairs) to the feature.
   *
   * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
   *
   * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters.
   *
   * You can associate as many as 50 tags with a feature.
   *
   * For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html#cfn-evidently-feature-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * An array of structures that contain the configuration of the feature's different variations.
   *
   * Each `VariationObject` in the `Variations` array for a feature must have the same type of value ( `BooleanValue` , `DoubleValue` , `LongValue` or `StringValue` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-feature.html#cfn-evidently-feature-variations
   */
  readonly variations: Array<cdk.IResolvable | CfnFeature.VariationObjectProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `EntityOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `EntityOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFeatureEntityOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("entityId", cdk.validateString)(properties.entityId));
  errors.collect(cdk.propertyValidator("variation", cdk.validateString)(properties.variation));
  return errors.wrap("supplied properties not correct for \"EntityOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnFeatureEntityOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFeatureEntityOverridePropertyValidator(properties).assertSuccess();
  return {
    "EntityId": cdk.stringToCloudFormation(properties.entityId),
    "Variation": cdk.stringToCloudFormation(properties.variation)
  };
}

// @ts-ignore TS6133
function CfnFeatureEntityOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFeature.EntityOverrideProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFeature.EntityOverrideProperty>();
  ret.addPropertyResult("entityId", "EntityId", (properties.EntityId != null ? cfn_parse.FromCloudFormation.getString(properties.EntityId) : undefined));
  ret.addPropertyResult("variation", "Variation", (properties.Variation != null ? cfn_parse.FromCloudFormation.getString(properties.Variation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VariationObjectProperty`
 *
 * @param properties - the TypeScript properties of a `VariationObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFeatureVariationObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("booleanValue", cdk.validateBoolean)(properties.booleanValue));
  errors.collect(cdk.propertyValidator("doubleValue", cdk.validateNumber)(properties.doubleValue));
  errors.collect(cdk.propertyValidator("longValue", cdk.validateNumber)(properties.longValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  errors.collect(cdk.propertyValidator("variationName", cdk.requiredValidator)(properties.variationName));
  errors.collect(cdk.propertyValidator("variationName", cdk.validateString)(properties.variationName));
  return errors.wrap("supplied properties not correct for \"VariationObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnFeatureVariationObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFeatureVariationObjectPropertyValidator(properties).assertSuccess();
  return {
    "BooleanValue": cdk.booleanToCloudFormation(properties.booleanValue),
    "DoubleValue": cdk.numberToCloudFormation(properties.doubleValue),
    "LongValue": cdk.numberToCloudFormation(properties.longValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue),
    "VariationName": cdk.stringToCloudFormation(properties.variationName)
  };
}

// @ts-ignore TS6133
function CfnFeatureVariationObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFeature.VariationObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFeature.VariationObjectProperty>();
  ret.addPropertyResult("booleanValue", "BooleanValue", (properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BooleanValue) : undefined));
  ret.addPropertyResult("doubleValue", "DoubleValue", (properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DoubleValue) : undefined));
  ret.addPropertyResult("longValue", "LongValue", (properties.LongValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.LongValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addPropertyResult("variationName", "VariationName", (properties.VariationName != null ? cfn_parse.FromCloudFormation.getString(properties.VariationName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFeatureProps`
 *
 * @param properties - the TypeScript properties of a `CfnFeatureProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFeaturePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultVariation", cdk.validateString)(properties.defaultVariation));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("entityOverrides", cdk.listValidator(CfnFeatureEntityOverridePropertyValidator))(properties.entityOverrides));
  errors.collect(cdk.propertyValidator("evaluationStrategy", cdk.validateString)(properties.evaluationStrategy));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("project", cdk.requiredValidator)(properties.project));
  errors.collect(cdk.propertyValidator("project", cdk.validateString)(properties.project));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("variations", cdk.requiredValidator)(properties.variations));
  errors.collect(cdk.propertyValidator("variations", cdk.listValidator(CfnFeatureVariationObjectPropertyValidator))(properties.variations));
  return errors.wrap("supplied properties not correct for \"CfnFeatureProps\"");
}

// @ts-ignore TS6133
function convertCfnFeaturePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFeaturePropsValidator(properties).assertSuccess();
  return {
    "DefaultVariation": cdk.stringToCloudFormation(properties.defaultVariation),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EntityOverrides": cdk.listMapper(convertCfnFeatureEntityOverridePropertyToCloudFormation)(properties.entityOverrides),
    "EvaluationStrategy": cdk.stringToCloudFormation(properties.evaluationStrategy),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Project": cdk.stringToCloudFormation(properties.project),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Variations": cdk.listMapper(convertCfnFeatureVariationObjectPropertyToCloudFormation)(properties.variations)
  };
}

// @ts-ignore TS6133
function CfnFeaturePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFeatureProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFeatureProps>();
  ret.addPropertyResult("defaultVariation", "DefaultVariation", (properties.DefaultVariation != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultVariation) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("entityOverrides", "EntityOverrides", (properties.EntityOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnFeatureEntityOverridePropertyFromCloudFormation)(properties.EntityOverrides) : undefined));
  ret.addPropertyResult("evaluationStrategy", "EvaluationStrategy", (properties.EvaluationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.EvaluationStrategy) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("project", "Project", (properties.Project != null ? cfn_parse.FromCloudFormation.getString(properties.Project) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("variations", "Variations", (properties.Variations != null ? cfn_parse.FromCloudFormation.getArray(CfnFeatureVariationObjectPropertyFromCloudFormation)(properties.Variations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates a *launch* of a given feature.
 *
 * Before you create a launch, you must create the feature to use for the launch.
 *
 * You can use a launch to safely validate new features by serving them to a specified percentage of your users while you roll out the feature. You can monitor the performance of the new feature to help you decide when to ramp up traffic to more users. This helps you reduce risk and identify unintended consequences before you fully launch the feature.
 *
 * @cloudformationResource AWS::Evidently::Launch
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html
 */
export class CfnLaunch extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Evidently::Launch";

  /**
   * Build a CfnLaunch from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunch {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLaunchPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLaunch(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the launch. For example, `arn:aws:evidently:us-west-2:0123455678912:project/myProject/launch/myLaunch`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * An optional description for the launch.
   */
  public description?: string;

  /**
   * A structure that you can use to start and stop the launch.
   */
  public executionStatus?: CfnLaunch.ExecutionStatusObjectProperty | cdk.IResolvable;

  /**
   * An array of structures that contains the feature and variations that are to be used for the launch.
   */
  public groups: Array<cdk.IResolvable | CfnLaunch.LaunchGroupObjectProperty> | cdk.IResolvable;

  /**
   * An array of structures that define the metrics that will be used to monitor the launch performance.
   */
  public metricMonitors?: Array<cdk.IResolvable | CfnLaunch.MetricDefinitionObjectProperty> | cdk.IResolvable;

  /**
   * The name for the launch.
   */
  public name: string;

  /**
   * The name or ARN of the project that you want to create the launch in.
   */
  public project: string;

  /**
   * When Evidently assigns a particular user session to a launch, it must use a randomization ID to determine which variation the user session is served.
   */
  public randomizationSalt?: string;

  /**
   * An array of structures that define the traffic allocation percentages among the feature variations during each step of the launch.
   */
  public scheduledSplitsConfig: Array<cdk.IResolvable | CfnLaunch.StepConfigProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Assigns one or more tags (key-value pairs) to the launch.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLaunchProps) {
    super(scope, id, {
      "type": CfnLaunch.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "groups", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "project", this);
    cdk.requireProperty(props, "scheduledSplitsConfig", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.executionStatus = props.executionStatus;
    this.groups = props.groups;
    this.metricMonitors = props.metricMonitors;
    this.name = props.name;
    this.project = props.project;
    this.randomizationSalt = props.randomizationSalt;
    this.scheduledSplitsConfig = props.scheduledSplitsConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Evidently::Launch", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "executionStatus": this.executionStatus,
      "groups": this.groups,
      "metricMonitors": this.metricMonitors,
      "name": this.name,
      "project": this.project,
      "randomizationSalt": this.randomizationSalt,
      "scheduledSplitsConfig": this.scheduledSplitsConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunch.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLaunchPropsToCloudFormation(props);
  }
}

export namespace CfnLaunch {
  /**
   * Use this structure to start and stop the launch.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-executionstatusobject.html
   */
  export interface ExecutionStatusObjectProperty {
    /**
     * If you are using AWS CloudFormation to stop this launch, specify either `COMPLETED` or `CANCELLED` here to indicate how to classify this experiment.
     *
     * If you omit this parameter, the default of `COMPLETED` is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-executionstatusobject.html#cfn-evidently-launch-executionstatusobject-desiredstate
     */
    readonly desiredState?: string;

    /**
     * If you are using AWS CloudFormation to stop this launch, this is an optional field that you can use to record why the launch is being stopped or cancelled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-executionstatusobject.html#cfn-evidently-launch-executionstatusobject-reason
     */
    readonly reason?: string;

    /**
     * To start the launch now, specify `START` for this parameter.
     *
     * If this launch is currently running and you want to stop it now, specify `STOP` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-executionstatusobject.html#cfn-evidently-launch-executionstatusobject-status
     */
    readonly status: string;
  }

  /**
   * A structure that defines one launch group in a launch.
   *
   * A launch group is a variation of the feature that you are including in the launch.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-launchgroupobject.html
   */
  export interface LaunchGroupObjectProperty {
    /**
     * A description of the launch group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-launchgroupobject.html#cfn-evidently-launch-launchgroupobject-description
     */
    readonly description?: string;

    /**
     * The feature that this launch is using.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-launchgroupobject.html#cfn-evidently-launch-launchgroupobject-feature
     */
    readonly feature: string;

    /**
     * A name for this launch group.
     *
     * It can include up to 127 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-launchgroupobject.html#cfn-evidently-launch-launchgroupobject-groupname
     */
    readonly groupName: string;

    /**
     * The feature variation to use for this launch group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-launchgroupobject.html#cfn-evidently-launch-launchgroupobject-variation
     */
    readonly variation: string;
  }

  /**
   * This structure defines a metric that you want to use to evaluate the variations during a launch or experiment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-metricdefinitionobject.html
   */
  export interface MetricDefinitionObjectProperty {
    /**
     * The entity, such as a user or session, that does an action that causes a metric value to be recorded.
     *
     * An example is `userDetails.userID` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-metricdefinitionobject.html#cfn-evidently-launch-metricdefinitionobject-entityidkey
     */
    readonly entityIdKey: string;

    /**
     * The EventBridge event pattern that defines how the metric is recorded.
     *
     * For more information about EventBridge event patterns, see [Amazon EventBridge event patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-metricdefinitionobject.html#cfn-evidently-launch-metricdefinitionobject-eventpattern
     */
    readonly eventPattern?: string;

    /**
     * A name for the metric.
     *
     * It can include up to 255 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-metricdefinitionobject.html#cfn-evidently-launch-metricdefinitionobject-metricname
     */
    readonly metricName: string;

    /**
     * A label for the units that the metric is measuring.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-metricdefinitionobject.html#cfn-evidently-launch-metricdefinitionobject-unitlabel
     */
    readonly unitLabel?: string;

    /**
     * The value that is tracked to produce the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-metricdefinitionobject.html#cfn-evidently-launch-metricdefinitionobject-valuekey
     */
    readonly valueKey: string;
  }

  /**
   * A structure that defines when each step of the launch is to start, and how much launch traffic is to be allocated to each variation during each step.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-stepconfig.html
   */
  export interface StepConfigProperty {
    /**
     * An array of structures that define how much launch traffic to allocate to each launch group during this step of the launch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-stepconfig.html#cfn-evidently-launch-stepconfig-groupweights
     */
    readonly groupWeights: Array<CfnLaunch.GroupToWeightProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An array of structures that you can use to specify different traffic splits for one or more audience *segments* .
     *
     * A segment is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users, users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects, such as age.
     *
     * For more information, see [Use segments to focus your audience](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Evidently-segments.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-stepconfig.html#cfn-evidently-launch-stepconfig-segmentoverrides
     */
    readonly segmentOverrides?: Array<cdk.IResolvable | CfnLaunch.SegmentOverrideProperty> | cdk.IResolvable;

    /**
     * The date and time to start this step of the launch.
     *
     * Use UTC format, `yyyy-MM-ddTHH:mm:ssZ` . For example, `2025-11-25T23:59:59Z`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-stepconfig.html#cfn-evidently-launch-stepconfig-starttime
     */
    readonly startTime: string;
  }

  /**
   * A structure containing the percentage of launch traffic to allocate to one launch group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-grouptoweight.html
   */
  export interface GroupToWeightProperty {
    /**
     * The name of the launch group.
     *
     * It can include up to 127 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-grouptoweight.html#cfn-evidently-launch-grouptoweight-groupname
     */
    readonly groupName: string;

    /**
     * The portion of launch traffic to allocate to this launch group.
     *
     * This is represented in thousandths of a percent. For example, specify 20,000 to allocate 20% of the launch audience to this launch group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-grouptoweight.html#cfn-evidently-launch-grouptoweight-splitweight
     */
    readonly splitWeight: number;
  }

  /**
   * Use this structure to specify different traffic splits for one or more audience *segments* .
   *
   * A segment is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users, users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects, such as age.
   *
   * For more information, see [Use segments to focus your audience](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Evidently-segments.html) .
   *
   * This sructure is an array of up to six segment override objects. Each of these objects specifies a segment that you have already created, and defines the traffic split for that segment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-segmentoverride.html
   */
  export interface SegmentOverrideProperty {
    /**
     * A number indicating the order to use to evaluate segment overrides, if there are more than one.
     *
     * Segment overrides with lower numbers are evaluated first.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-segmentoverride.html#cfn-evidently-launch-segmentoverride-evaluationorder
     */
    readonly evaluationOrder: number;

    /**
     * The ARN of the segment to use for this override.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-segmentoverride.html#cfn-evidently-launch-segmentoverride-segment
     */
    readonly segment: string;

    /**
     * The traffic allocation percentages among the feature variations to assign to this segment.
     *
     * This is a set of key-value pairs. The keys are variation names. The values represent the amount of traffic to allocate to that variation for this segment. This is expressed in thousandths of a percent, so a weight of 50000 represents 50% of traffic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-launch-segmentoverride.html#cfn-evidently-launch-segmentoverride-weights
     */
    readonly weights: Array<CfnLaunch.GroupToWeightProperty | cdk.IResolvable> | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnLaunch`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html
 */
export interface CfnLaunchProps {
  /**
   * An optional description for the launch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-description
   */
  readonly description?: string;

  /**
   * A structure that you can use to start and stop the launch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-executionstatus
   */
  readonly executionStatus?: CfnLaunch.ExecutionStatusObjectProperty | cdk.IResolvable;

  /**
   * An array of structures that contains the feature and variations that are to be used for the launch.
   *
   * You can up to five launch groups in a launch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-groups
   */
  readonly groups: Array<cdk.IResolvable | CfnLaunch.LaunchGroupObjectProperty> | cdk.IResolvable;

  /**
   * An array of structures that define the metrics that will be used to monitor the launch performance.
   *
   * You can have up to three metric monitors in the array.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-metricmonitors
   */
  readonly metricMonitors?: Array<cdk.IResolvable | CfnLaunch.MetricDefinitionObjectProperty> | cdk.IResolvable;

  /**
   * The name for the launch.
   *
   * It can include up to 127 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-name
   */
  readonly name: string;

  /**
   * The name or ARN of the project that you want to create the launch in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-project
   */
  readonly project: string;

  /**
   * When Evidently assigns a particular user session to a launch, it must use a randomization ID to determine which variation the user session is served.
   *
   * This randomization ID is a combination of the entity ID and `randomizationSalt` . If you omit `randomizationSalt` , Evidently uses the launch name as the `randomizationsSalt` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-randomizationsalt
   */
  readonly randomizationSalt?: string;

  /**
   * An array of structures that define the traffic allocation percentages among the feature variations during each step of the launch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-scheduledsplitsconfig
   */
  readonly scheduledSplitsConfig: Array<cdk.IResolvable | CfnLaunch.StepConfigProperty> | cdk.IResolvable;

  /**
   * Assigns one or more tags (key-value pairs) to the launch.
   *
   * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
   *
   * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters.
   *
   * You can associate as many as 50 tags with a launch.
   *
   * For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-launch.html#cfn-evidently-launch-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ExecutionStatusObjectProperty`
 *
 * @param properties - the TypeScript properties of a `ExecutionStatusObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchExecutionStatusObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("desiredState", cdk.validateString)(properties.desiredState));
  errors.collect(cdk.propertyValidator("reason", cdk.validateString)(properties.reason));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"ExecutionStatusObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchExecutionStatusObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchExecutionStatusObjectPropertyValidator(properties).assertSuccess();
  return {
    "DesiredState": cdk.stringToCloudFormation(properties.desiredState),
    "Reason": cdk.stringToCloudFormation(properties.reason),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnLaunchExecutionStatusObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunch.ExecutionStatusObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunch.ExecutionStatusObjectProperty>();
  ret.addPropertyResult("desiredState", "DesiredState", (properties.DesiredState != null ? cfn_parse.FromCloudFormation.getString(properties.DesiredState) : undefined));
  ret.addPropertyResult("reason", "Reason", (properties.Reason != null ? cfn_parse.FromCloudFormation.getString(properties.Reason) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LaunchGroupObjectProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchGroupObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchLaunchGroupObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("feature", cdk.requiredValidator)(properties.feature));
  errors.collect(cdk.propertyValidator("feature", cdk.validateString)(properties.feature));
  errors.collect(cdk.propertyValidator("groupName", cdk.requiredValidator)(properties.groupName));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("variation", cdk.requiredValidator)(properties.variation));
  errors.collect(cdk.propertyValidator("variation", cdk.validateString)(properties.variation));
  return errors.wrap("supplied properties not correct for \"LaunchGroupObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchLaunchGroupObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchLaunchGroupObjectPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Feature": cdk.stringToCloudFormation(properties.feature),
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "Variation": cdk.stringToCloudFormation(properties.variation)
  };
}

// @ts-ignore TS6133
function CfnLaunchLaunchGroupObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunch.LaunchGroupObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunch.LaunchGroupObjectProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("feature", "Feature", (properties.Feature != null ? cfn_parse.FromCloudFormation.getString(properties.Feature) : undefined));
  ret.addPropertyResult("groupName", "GroupName", (properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined));
  ret.addPropertyResult("variation", "Variation", (properties.Variation != null ? cfn_parse.FromCloudFormation.getString(properties.Variation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricDefinitionObjectProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDefinitionObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchMetricDefinitionObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("entityIdKey", cdk.requiredValidator)(properties.entityIdKey));
  errors.collect(cdk.propertyValidator("entityIdKey", cdk.validateString)(properties.entityIdKey));
  errors.collect(cdk.propertyValidator("eventPattern", cdk.validateString)(properties.eventPattern));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("unitLabel", cdk.validateString)(properties.unitLabel));
  errors.collect(cdk.propertyValidator("valueKey", cdk.requiredValidator)(properties.valueKey));
  errors.collect(cdk.propertyValidator("valueKey", cdk.validateString)(properties.valueKey));
  return errors.wrap("supplied properties not correct for \"MetricDefinitionObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchMetricDefinitionObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchMetricDefinitionObjectPropertyValidator(properties).assertSuccess();
  return {
    "EntityIdKey": cdk.stringToCloudFormation(properties.entityIdKey),
    "EventPattern": cdk.stringToCloudFormation(properties.eventPattern),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "UnitLabel": cdk.stringToCloudFormation(properties.unitLabel),
    "ValueKey": cdk.stringToCloudFormation(properties.valueKey)
  };
}

// @ts-ignore TS6133
function CfnLaunchMetricDefinitionObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunch.MetricDefinitionObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunch.MetricDefinitionObjectProperty>();
  ret.addPropertyResult("entityIdKey", "EntityIdKey", (properties.EntityIdKey != null ? cfn_parse.FromCloudFormation.getString(properties.EntityIdKey) : undefined));
  ret.addPropertyResult("eventPattern", "EventPattern", (properties.EventPattern != null ? cfn_parse.FromCloudFormation.getString(properties.EventPattern) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("unitLabel", "UnitLabel", (properties.UnitLabel != null ? cfn_parse.FromCloudFormation.getString(properties.UnitLabel) : undefined));
  ret.addPropertyResult("valueKey", "ValueKey", (properties.ValueKey != null ? cfn_parse.FromCloudFormation.getString(properties.ValueKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GroupToWeightProperty`
 *
 * @param properties - the TypeScript properties of a `GroupToWeightProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchGroupToWeightPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupName", cdk.requiredValidator)(properties.groupName));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("splitWeight", cdk.requiredValidator)(properties.splitWeight));
  errors.collect(cdk.propertyValidator("splitWeight", cdk.validateNumber)(properties.splitWeight));
  return errors.wrap("supplied properties not correct for \"GroupToWeightProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchGroupToWeightPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchGroupToWeightPropertyValidator(properties).assertSuccess();
  return {
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "SplitWeight": cdk.numberToCloudFormation(properties.splitWeight)
  };
}

// @ts-ignore TS6133
function CfnLaunchGroupToWeightPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunch.GroupToWeightProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunch.GroupToWeightProperty>();
  ret.addPropertyResult("groupName", "GroupName", (properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined));
  ret.addPropertyResult("splitWeight", "SplitWeight", (properties.SplitWeight != null ? cfn_parse.FromCloudFormation.getNumber(properties.SplitWeight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SegmentOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `SegmentOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchSegmentOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("evaluationOrder", cdk.requiredValidator)(properties.evaluationOrder));
  errors.collect(cdk.propertyValidator("evaluationOrder", cdk.validateNumber)(properties.evaluationOrder));
  errors.collect(cdk.propertyValidator("segment", cdk.requiredValidator)(properties.segment));
  errors.collect(cdk.propertyValidator("segment", cdk.validateString)(properties.segment));
  errors.collect(cdk.propertyValidator("weights", cdk.requiredValidator)(properties.weights));
  errors.collect(cdk.propertyValidator("weights", cdk.listValidator(CfnLaunchGroupToWeightPropertyValidator))(properties.weights));
  return errors.wrap("supplied properties not correct for \"SegmentOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchSegmentOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchSegmentOverridePropertyValidator(properties).assertSuccess();
  return {
    "EvaluationOrder": cdk.numberToCloudFormation(properties.evaluationOrder),
    "Segment": cdk.stringToCloudFormation(properties.segment),
    "Weights": cdk.listMapper(convertCfnLaunchGroupToWeightPropertyToCloudFormation)(properties.weights)
  };
}

// @ts-ignore TS6133
function CfnLaunchSegmentOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunch.SegmentOverrideProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunch.SegmentOverrideProperty>();
  ret.addPropertyResult("evaluationOrder", "EvaluationOrder", (properties.EvaluationOrder != null ? cfn_parse.FromCloudFormation.getNumber(properties.EvaluationOrder) : undefined));
  ret.addPropertyResult("segment", "Segment", (properties.Segment != null ? cfn_parse.FromCloudFormation.getString(properties.Segment) : undefined));
  ret.addPropertyResult("weights", "Weights", (properties.Weights != null ? cfn_parse.FromCloudFormation.getArray(CfnLaunchGroupToWeightPropertyFromCloudFormation)(properties.Weights) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StepConfigProperty`
 *
 * @param properties - the TypeScript properties of a `StepConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchStepConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupWeights", cdk.requiredValidator)(properties.groupWeights));
  errors.collect(cdk.propertyValidator("groupWeights", cdk.listValidator(CfnLaunchGroupToWeightPropertyValidator))(properties.groupWeights));
  errors.collect(cdk.propertyValidator("segmentOverrides", cdk.listValidator(CfnLaunchSegmentOverridePropertyValidator))(properties.segmentOverrides));
  errors.collect(cdk.propertyValidator("startTime", cdk.requiredValidator)(properties.startTime));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateString)(properties.startTime));
  return errors.wrap("supplied properties not correct for \"StepConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchStepConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchStepConfigPropertyValidator(properties).assertSuccess();
  return {
    "GroupWeights": cdk.listMapper(convertCfnLaunchGroupToWeightPropertyToCloudFormation)(properties.groupWeights),
    "SegmentOverrides": cdk.listMapper(convertCfnLaunchSegmentOverridePropertyToCloudFormation)(properties.segmentOverrides),
    "StartTime": cdk.stringToCloudFormation(properties.startTime)
  };
}

// @ts-ignore TS6133
function CfnLaunchStepConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunch.StepConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunch.StepConfigProperty>();
  ret.addPropertyResult("groupWeights", "GroupWeights", (properties.GroupWeights != null ? cfn_parse.FromCloudFormation.getArray(CfnLaunchGroupToWeightPropertyFromCloudFormation)(properties.GroupWeights) : undefined));
  ret.addPropertyResult("segmentOverrides", "SegmentOverrides", (properties.SegmentOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnLaunchSegmentOverridePropertyFromCloudFormation)(properties.SegmentOverrides) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("executionStatus", CfnLaunchExecutionStatusObjectPropertyValidator)(properties.executionStatus));
  errors.collect(cdk.propertyValidator("groups", cdk.requiredValidator)(properties.groups));
  errors.collect(cdk.propertyValidator("groups", cdk.listValidator(CfnLaunchLaunchGroupObjectPropertyValidator))(properties.groups));
  errors.collect(cdk.propertyValidator("metricMonitors", cdk.listValidator(CfnLaunchMetricDefinitionObjectPropertyValidator))(properties.metricMonitors));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("project", cdk.requiredValidator)(properties.project));
  errors.collect(cdk.propertyValidator("project", cdk.validateString)(properties.project));
  errors.collect(cdk.propertyValidator("randomizationSalt", cdk.validateString)(properties.randomizationSalt));
  errors.collect(cdk.propertyValidator("scheduledSplitsConfig", cdk.requiredValidator)(properties.scheduledSplitsConfig));
  errors.collect(cdk.propertyValidator("scheduledSplitsConfig", cdk.listValidator(CfnLaunchStepConfigPropertyValidator))(properties.scheduledSplitsConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLaunchProps\"");
}

// @ts-ignore TS6133
function convertCfnLaunchPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExecutionStatus": convertCfnLaunchExecutionStatusObjectPropertyToCloudFormation(properties.executionStatus),
    "Groups": cdk.listMapper(convertCfnLaunchLaunchGroupObjectPropertyToCloudFormation)(properties.groups),
    "MetricMonitors": cdk.listMapper(convertCfnLaunchMetricDefinitionObjectPropertyToCloudFormation)(properties.metricMonitors),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Project": cdk.stringToCloudFormation(properties.project),
    "RandomizationSalt": cdk.stringToCloudFormation(properties.randomizationSalt),
    "ScheduledSplitsConfig": cdk.listMapper(convertCfnLaunchStepConfigPropertyToCloudFormation)(properties.scheduledSplitsConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLaunchPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("executionStatus", "ExecutionStatus", (properties.ExecutionStatus != null ? CfnLaunchExecutionStatusObjectPropertyFromCloudFormation(properties.ExecutionStatus) : undefined));
  ret.addPropertyResult("groups", "Groups", (properties.Groups != null ? cfn_parse.FromCloudFormation.getArray(CfnLaunchLaunchGroupObjectPropertyFromCloudFormation)(properties.Groups) : undefined));
  ret.addPropertyResult("metricMonitors", "MetricMonitors", (properties.MetricMonitors != null ? cfn_parse.FromCloudFormation.getArray(CfnLaunchMetricDefinitionObjectPropertyFromCloudFormation)(properties.MetricMonitors) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("project", "Project", (properties.Project != null ? cfn_parse.FromCloudFormation.getString(properties.Project) : undefined));
  ret.addPropertyResult("randomizationSalt", "RandomizationSalt", (properties.RandomizationSalt != null ? cfn_parse.FromCloudFormation.getString(properties.RandomizationSalt) : undefined));
  ret.addPropertyResult("scheduledSplitsConfig", "ScheduledSplitsConfig", (properties.ScheduledSplitsConfig != null ? cfn_parse.FromCloudFormation.getArray(CfnLaunchStepConfigPropertyFromCloudFormation)(properties.ScheduledSplitsConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a project, which is the logical object in Evidently that can contain features, launches, and experiments.
 *
 * Use projects to group similar features together.
 *
 * @cloudformationResource AWS::Evidently::Project
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Evidently::Project";

  /**
   * Build a CfnProject from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProject {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProjectPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProject(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the project. For example, `arn:aws:evidently:us-west-2:0123455678912:project/myProject`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Use this parameter if the project will use *client-side evaluation powered by AWS AppConfig* .
   */
  public appConfigResource?: CfnProject.AppConfigResourceObjectProperty | cdk.IResolvable;

  /**
   * A structure that contains information about where Evidently is to store evaluation events for longer term storage, if you choose to do so.
   */
  public dataDelivery?: CfnProject.DataDeliveryObjectProperty | cdk.IResolvable;

  /**
   * An optional description of the project.
   */
  public description?: string;

  /**
   * The name for the project.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Assigns one or more tags (key-value pairs) to the project.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProjectProps) {
    super(scope, id, {
      "type": CfnProject.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.appConfigResource = props.appConfigResource;
    this.dataDelivery = props.dataDelivery;
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Evidently::Project", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appConfigResource": this.appConfigResource,
      "dataDelivery": this.dataDelivery,
      "description": this.description,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProject.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProjectPropsToCloudFormation(props);
  }
}

export namespace CfnProject {
  /**
   * A structure that contains information about where Evidently is to store evaluation events for longer term storage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-datadeliveryobject.html
   */
  export interface DataDeliveryObjectProperty {
    /**
     * If the project stores evaluation events in CloudWatch Logs , this structure stores the log group name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-datadeliveryobject.html#cfn-evidently-project-datadeliveryobject-loggroup
     */
    readonly logGroup?: string;

    /**
     * If the project stores evaluation events in an Amazon S3 bucket, this structure stores the bucket name and bucket prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-datadeliveryobject.html#cfn-evidently-project-datadeliveryobject-s3
     */
    readonly s3?: cdk.IResolvable | CfnProject.S3DestinationProperty;
  }

  /**
   * If the project stores evaluation events in an Amazon S3 bucket, this structure stores the bucket name and bucket prefix.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-s3destination.html
   */
  export interface S3DestinationProperty {
    /**
     * The name of the bucket in which Evidently stores evaluation events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-s3destination.html#cfn-evidently-project-s3destination-bucketname
     */
    readonly bucketName: string;

    /**
     * The bucket prefix in which Evidently stores evaluation events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-s3destination.html#cfn-evidently-project-s3destination-prefix
     */
    readonly prefix?: string;
  }

  /**
   * This is a structure that defines the configuration of how your application integrates with AWS AppConfig to run client-side evaluation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-appconfigresourceobject.html
   */
  export interface AppConfigResourceObjectProperty {
    /**
     * The ID of the AWS AppConfig application to use for client-side evaluation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-appconfigresourceobject.html#cfn-evidently-project-appconfigresourceobject-applicationid
     */
    readonly applicationId: string;

    /**
     * The ID of the AWS AppConfig environment to use for client-side evaluation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-evidently-project-appconfigresourceobject.html#cfn-evidently-project-appconfigresourceobject-environmentid
     */
    readonly environmentId: string;
  }
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-project.html
 */
export interface CfnProjectProps {
  /**
   * Use this parameter if the project will use *client-side evaluation powered by AWS AppConfig* .
   *
   * Client-side evaluation allows your application to assign variations to user sessions locally instead of by calling the [EvaluateFeature](https://docs.aws.amazon.com/cloudwatchevidently/latest/APIReference/API_EvaluateFeature.html) operation. This mitigates the latency and availability risks that come with an API call. For more information, see [Use client-side evaluation - powered by AWS AppConfig .](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Evidently-client-side-evaluation.html)
   *
   * This parameter is a structure that contains information about the AWS AppConfig application that will be used as for client-side evaluation.
   *
   * To create a project that uses client-side evaluation, you must have the `evidently:ExportProjectAsConfiguration` permission.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-project.html#cfn-evidently-project-appconfigresource
   */
  readonly appConfigResource?: CfnProject.AppConfigResourceObjectProperty | cdk.IResolvable;

  /**
   * A structure that contains information about where Evidently is to store evaluation events for longer term storage, if you choose to do so.
   *
   * If you choose not to store these events, Evidently deletes them after using them to produce metrics and other experiment results that you can view.
   *
   * You can't specify both `CloudWatchLogs` and `S3Destination` in the same operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-project.html#cfn-evidently-project-datadelivery
   */
  readonly dataDelivery?: CfnProject.DataDeliveryObjectProperty | cdk.IResolvable;

  /**
   * An optional description of the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-project.html#cfn-evidently-project-description
   */
  readonly description?: string;

  /**
   * The name for the project.
   *
   * It can include up to 127 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-project.html#cfn-evidently-project-name
   */
  readonly name: string;

  /**
   * Assigns one or more tags (key-value pairs) to the project.
   *
   * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
   *
   * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters.
   *
   * You can associate as many as 50 tags with a project.
   *
   * For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-project.html#cfn-evidently-project-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `S3DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectS3DestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"S3DestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnProjectS3DestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectS3DestinationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnProjectS3DestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnProject.S3DestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.S3DestinationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataDeliveryObjectProperty`
 *
 * @param properties - the TypeScript properties of a `DataDeliveryObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectDataDeliveryObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroup", cdk.validateString)(properties.logGroup));
  errors.collect(cdk.propertyValidator("s3", CfnProjectS3DestinationPropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"DataDeliveryObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnProjectDataDeliveryObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectDataDeliveryObjectPropertyValidator(properties).assertSuccess();
  return {
    "LogGroup": cdk.stringToCloudFormation(properties.logGroup),
    "S3": convertCfnProjectS3DestinationPropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnProjectDataDeliveryObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProject.DataDeliveryObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.DataDeliveryObjectProperty>();
  ret.addPropertyResult("logGroup", "LogGroup", (properties.LogGroup != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroup) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnProjectS3DestinationPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AppConfigResourceObjectProperty`
 *
 * @param properties - the TypeScript properties of a `AppConfigResourceObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectAppConfigResourceObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("environmentId", cdk.requiredValidator)(properties.environmentId));
  errors.collect(cdk.propertyValidator("environmentId", cdk.validateString)(properties.environmentId));
  return errors.wrap("supplied properties not correct for \"AppConfigResourceObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnProjectAppConfigResourceObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectAppConfigResourceObjectPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "EnvironmentId": cdk.stringToCloudFormation(properties.environmentId)
  };
}

// @ts-ignore TS6133
function CfnProjectAppConfigResourceObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProject.AppConfigResourceObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.AppConfigResourceObjectProperty>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("environmentId", "EnvironmentId", (properties.EnvironmentId != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appConfigResource", CfnProjectAppConfigResourceObjectPropertyValidator)(properties.appConfigResource));
  errors.collect(cdk.propertyValidator("dataDelivery", CfnProjectDataDeliveryObjectPropertyValidator)(properties.dataDelivery));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProjectProps\"");
}

// @ts-ignore TS6133
function convertCfnProjectPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectPropsValidator(properties).assertSuccess();
  return {
    "AppConfigResource": convertCfnProjectAppConfigResourceObjectPropertyToCloudFormation(properties.appConfigResource),
    "DataDelivery": convertCfnProjectDataDeliveryObjectPropertyToCloudFormation(properties.dataDelivery),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProjectProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProjectProps>();
  ret.addPropertyResult("appConfigResource", "AppConfigResource", (properties.AppConfigResource != null ? CfnProjectAppConfigResourceObjectPropertyFromCloudFormation(properties.AppConfigResource) : undefined));
  ret.addPropertyResult("dataDelivery", "DataDelivery", (properties.DataDelivery != null ? CfnProjectDataDeliveryObjectPropertyFromCloudFormation(properties.DataDelivery) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates a *segment* of your audience.
 *
 * A segment is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users, users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects, such as age.
 *
 * Using a segment in an experiment limits that experiment to evaluate only the users who match the segment criteria. Using one or more segments in a launch allow you to define different traffic splits for the different audience segments.
 *
 * For more information about segment pattern syntax, see [Segment rule pattern syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Evidently-segments.html#CloudWatch-Evidently-segments-syntax) .
 *
 * The pattern that you define for a segment is matched against the value of `evaluationContext` , which is passed into Evidently in the [EvaluateFeature](https://docs.aws.amazon.com/cloudwatchevidently/latest/APIReference/API_EvaluateFeature.html) operation, when Evidently assigns a feature variation to a user.
 *
 * @cloudformationResource AWS::Evidently::Segment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-segment.html
 */
export class CfnSegment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Evidently::Segment";

  /**
   * Build a CfnSegment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSegment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSegmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSegment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the segment. For example, `arn:aws:evidently:us-west-2:123456789012:segment/australiaSegment`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * An optional description for this segment.
   */
  public description?: string;

  /**
   * A name for the segment.
   */
  public name: string;

  /**
   * The pattern to use for the segment.
   */
  public pattern?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Assigns one or more tags (key-value pairs) to the feature.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSegmentProps) {
    super(scope, id, {
      "type": CfnSegment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.pattern = props.pattern;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Evidently::Segment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "pattern": this.pattern,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSegment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSegmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSegment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-segment.html
 */
export interface CfnSegmentProps {
  /**
   * An optional description for this segment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-segment.html#cfn-evidently-segment-description
   */
  readonly description?: string;

  /**
   * A name for the segment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-segment.html#cfn-evidently-segment-name
   */
  readonly name: string;

  /**
   * The pattern to use for the segment.
   *
   * For more information about pattern syntax, see [Segment rule pattern syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Evidently-segments.html#CloudWatch-Evidently-segments-syntax) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-segment.html#cfn-evidently-segment-pattern
   */
  readonly pattern?: string;

  /**
   * Assigns one or more tags (key-value pairs) to the feature.
   *
   * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
   *
   * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters.
   *
   * You can associate as many as 50 tags with a feature.
   *
   * For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-evidently-segment.html#cfn-evidently-segment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnSegmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnSegmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSegmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("pattern", cdk.validateString)(properties.pattern));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSegmentProps\"");
}

// @ts-ignore TS6133
function convertCfnSegmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSegmentPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Pattern": cdk.stringToCloudFormation(properties.pattern),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSegmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegmentProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getString(properties.Pattern) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}