/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::LookoutMetrics::Alert` type creates an alert for an anomaly detector.
 *
 * @cloudformationResource AWS::LookoutMetrics::Alert
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html
 */
export class CfnAlert extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LookoutMetrics::Alert";

  /**
   * Build a CfnAlert from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAlert {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAlertPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAlert(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the alert. For example, `arn:aws:lookoutmetrics:us-east-2:123456789012:Alert:my-alert`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Action that will be triggered when there is an alert.
   */
  public action: CfnAlert.ActionProperty | cdk.IResolvable;

  /**
   * A description of the alert.
   */
  public alertDescription?: string;

  /**
   * The name of the alert.
   */
  public alertName?: string;

  /**
   * An integer from 0 to 100 specifying the alert sensitivity threshold.
   */
  public alertSensitivityThreshold: number;

  /**
   * The ARN of the detector to which the alert is attached.
   */
  public anomalyDetectorArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAlertProps) {
    super(scope, id, {
      "type": CfnAlert.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "action", this);
    cdk.requireProperty(props, "alertSensitivityThreshold", this);
    cdk.requireProperty(props, "anomalyDetectorArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.action = props.action;
    this.alertDescription = props.alertDescription;
    this.alertName = props.alertName;
    this.alertSensitivityThreshold = props.alertSensitivityThreshold;
    this.anomalyDetectorArn = props.anomalyDetectorArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "alertDescription": this.alertDescription,
      "alertName": this.alertName,
      "alertSensitivityThreshold": this.alertSensitivityThreshold,
      "anomalyDetectorArn": this.anomalyDetectorArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAlert.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAlertPropsToCloudFormation(props);
  }
}

export namespace CfnAlert {
  /**
   * A configuration that specifies the action to perform when anomalies are detected.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-action.html
   */
  export interface ActionProperty {
    /**
     * A configuration for an AWS Lambda channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-action.html#cfn-lookoutmetrics-alert-action-lambdaconfiguration
     */
    readonly lambdaConfiguration?: cdk.IResolvable | CfnAlert.LambdaConfigurationProperty;

    /**
     * A configuration for an Amazon SNS channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-action.html#cfn-lookoutmetrics-alert-action-snsconfiguration
     */
    readonly snsConfiguration?: cdk.IResolvable | CfnAlert.SNSConfigurationProperty;
  }

  /**
   * Contains information about a Lambda configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-lambdaconfiguration.html
   */
  export interface LambdaConfigurationProperty {
    /**
     * The ARN of the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-lambdaconfiguration.html#cfn-lookoutmetrics-alert-lambdaconfiguration-lambdaarn
     */
    readonly lambdaArn: string;

    /**
     * The ARN of an IAM role that has permission to invoke the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-lambdaconfiguration.html#cfn-lookoutmetrics-alert-lambdaconfiguration-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Contains information about the SNS topic to which you want to send your alerts and the IAM role that has access to that topic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-snsconfiguration.html
   */
  export interface SNSConfigurationProperty {
    /**
     * The ARN of the IAM role that has access to the target SNS topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-snsconfiguration.html#cfn-lookoutmetrics-alert-snsconfiguration-rolearn
     */
    readonly roleArn: string;

    /**
     * The ARN of the target SNS topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-snsconfiguration.html#cfn-lookoutmetrics-alert-snsconfiguration-snstopicarn
     */
    readonly snsTopicArn: string;
  }
}

/**
 * Properties for defining a `CfnAlert`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html
 */
export interface CfnAlertProps {
  /**
   * Action that will be triggered when there is an alert.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-action
   */
  readonly action: CfnAlert.ActionProperty | cdk.IResolvable;

  /**
   * A description of the alert.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertdescription
   */
  readonly alertDescription?: string;

  /**
   * The name of the alert.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertname
   */
  readonly alertName?: string;

  /**
   * An integer from 0 to 100 specifying the alert sensitivity threshold.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertsensitivitythreshold
   */
  readonly alertSensitivityThreshold: number;

  /**
   * The ARN of the detector to which the alert is attached.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-anomalydetectorarn
   */
  readonly anomalyDetectorArn: string;
}

/**
 * Determine whether the given properties match those of a `LambdaConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlertLambdaConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.requiredValidator)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"LambdaConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlertLambdaConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlertLambdaConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnAlertLambdaConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAlert.LambdaConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlert.LambdaConfigurationProperty>();
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SNSConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SNSConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlertSNSConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.requiredValidator)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  return errors.wrap("supplied properties not correct for \"SNSConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlertSNSConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlertSNSConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SnsTopicArn": cdk.stringToCloudFormation(properties.snsTopicArn)
  };
}

// @ts-ignore TS6133
function CfnAlertSNSConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAlert.SNSConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlert.SNSConfigurationProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("snsTopicArn", "SnsTopicArn", (properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined));
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
function CfnAlertActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaConfiguration", CfnAlertLambdaConfigurationPropertyValidator)(properties.lambdaConfiguration));
  errors.collect(cdk.propertyValidator("snsConfiguration", CfnAlertSNSConfigurationPropertyValidator)(properties.snsConfiguration));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlertActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlertActionPropertyValidator(properties).assertSuccess();
  return {
    "LambdaConfiguration": convertCfnAlertLambdaConfigurationPropertyToCloudFormation(properties.lambdaConfiguration),
    "SNSConfiguration": convertCfnAlertSNSConfigurationPropertyToCloudFormation(properties.snsConfiguration)
  };
}

// @ts-ignore TS6133
function CfnAlertActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlert.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlert.ActionProperty>();
  ret.addPropertyResult("lambdaConfiguration", "LambdaConfiguration", (properties.LambdaConfiguration != null ? CfnAlertLambdaConfigurationPropertyFromCloudFormation(properties.LambdaConfiguration) : undefined));
  ret.addPropertyResult("snsConfiguration", "SNSConfiguration", (properties.SNSConfiguration != null ? CfnAlertSNSConfigurationPropertyFromCloudFormation(properties.SNSConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAlertProps`
 *
 * @param properties - the TypeScript properties of a `CfnAlertProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlertPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnAlertActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("alertDescription", cdk.validateString)(properties.alertDescription));
  errors.collect(cdk.propertyValidator("alertName", cdk.validateString)(properties.alertName));
  errors.collect(cdk.propertyValidator("alertSensitivityThreshold", cdk.requiredValidator)(properties.alertSensitivityThreshold));
  errors.collect(cdk.propertyValidator("alertSensitivityThreshold", cdk.validateNumber)(properties.alertSensitivityThreshold));
  errors.collect(cdk.propertyValidator("anomalyDetectorArn", cdk.requiredValidator)(properties.anomalyDetectorArn));
  errors.collect(cdk.propertyValidator("anomalyDetectorArn", cdk.validateString)(properties.anomalyDetectorArn));
  return errors.wrap("supplied properties not correct for \"CfnAlertProps\"");
}

// @ts-ignore TS6133
function convertCfnAlertPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlertPropsValidator(properties).assertSuccess();
  return {
    "Action": convertCfnAlertActionPropertyToCloudFormation(properties.action),
    "AlertDescription": cdk.stringToCloudFormation(properties.alertDescription),
    "AlertName": cdk.stringToCloudFormation(properties.alertName),
    "AlertSensitivityThreshold": cdk.numberToCloudFormation(properties.alertSensitivityThreshold),
    "AnomalyDetectorArn": cdk.stringToCloudFormation(properties.anomalyDetectorArn)
  };
}

// @ts-ignore TS6133
function CfnAlertPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlertProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlertProps>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnAlertActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("alertDescription", "AlertDescription", (properties.AlertDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AlertDescription) : undefined));
  ret.addPropertyResult("alertName", "AlertName", (properties.AlertName != null ? cfn_parse.FromCloudFormation.getString(properties.AlertName) : undefined));
  ret.addPropertyResult("alertSensitivityThreshold", "AlertSensitivityThreshold", (properties.AlertSensitivityThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.AlertSensitivityThreshold) : undefined));
  ret.addPropertyResult("anomalyDetectorArn", "AnomalyDetectorArn", (properties.AnomalyDetectorArn != null ? cfn_parse.FromCloudFormation.getString(properties.AnomalyDetectorArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::LookoutMetrics::AnomalyDetector` type creates an anomaly detector.
 *
 * @cloudformationResource AWS::LookoutMetrics::AnomalyDetector
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html
 */
export class CfnAnomalyDetector extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LookoutMetrics::AnomalyDetector";

  /**
   * Build a CfnAnomalyDetector from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnomalyDetector {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAnomalyDetectorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAnomalyDetector(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the detector. For example, `arn:aws:lookoutmetrics:us-east-2:123456789012:AnomalyDetector:my-detector`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Contains information about the configuration of the anomaly detector.
   */
  public anomalyDetectorConfig: CfnAnomalyDetector.AnomalyDetectorConfigProperty | cdk.IResolvable;

  /**
   * A description of the detector.
   */
  public anomalyDetectorDescription?: string;

  /**
   * The name of the detector.
   */
  public anomalyDetectorName?: string;

  /**
   * The ARN of the KMS key to use to encrypt your data.
   */
  public kmsKeyArn?: string;

  /**
   * The detector's dataset.
   */
  public metricSetList: Array<cdk.IResolvable | CfnAnomalyDetector.MetricSetProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAnomalyDetectorProps) {
    super(scope, id, {
      "type": CfnAnomalyDetector.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "anomalyDetectorConfig", this);
    cdk.requireProperty(props, "metricSetList", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.anomalyDetectorConfig = props.anomalyDetectorConfig;
    this.anomalyDetectorDescription = props.anomalyDetectorDescription;
    this.anomalyDetectorName = props.anomalyDetectorName;
    this.kmsKeyArn = props.kmsKeyArn;
    this.metricSetList = props.metricSetList;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "anomalyDetectorConfig": this.anomalyDetectorConfig,
      "anomalyDetectorDescription": this.anomalyDetectorDescription,
      "anomalyDetectorName": this.anomalyDetectorName,
      "kmsKeyArn": this.kmsKeyArn,
      "metricSetList": this.metricSetList
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnomalyDetector.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAnomalyDetectorPropsToCloudFormation(props);
  }
}

export namespace CfnAnomalyDetector {
  /**
   * Contains information about a detector's configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-anomalydetectorconfig.html
   */
  export interface AnomalyDetectorConfigProperty {
    /**
     * The frequency at which the detector analyzes its source data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-anomalydetectorconfig.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorconfig-anomalydetectorfrequency
     */
    readonly anomalyDetectorFrequency: string;
  }

  /**
   * Contains information about a dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html
   */
  export interface MetricSetProperty {
    /**
     * A list of the fields you want to treat as dimensions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-dimensionlist
     */
    readonly dimensionList?: Array<string>;

    /**
     * A list of metrics that the dataset will contain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metriclist
     */
    readonly metricList: Array<cdk.IResolvable | CfnAnomalyDetector.MetricProperty> | cdk.IResolvable;

    /**
     * A description of the dataset you are creating.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metricsetdescription
     */
    readonly metricSetDescription?: string;

    /**
     * The frequency with which the source data will be analyzed for anomalies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metricsetfrequency
     */
    readonly metricSetFrequency?: string;

    /**
     * The name of the dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metricsetname
     */
    readonly metricSetName: string;

    /**
     * Contains information about how the source data should be interpreted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metricsource
     */
    readonly metricSource: cdk.IResolvable | CfnAnomalyDetector.MetricSourceProperty;

    /**
     * After an interval ends, the amount of seconds that the detector waits before importing data.
     *
     * Offset is only supported for S3, Redshift, Athena and datasources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-offset
     */
    readonly offset?: number;

    /**
     * Contains information about the column used for tracking time in your source data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-timestampcolumn
     */
    readonly timestampColumn?: cdk.IResolvable | CfnAnomalyDetector.TimestampColumnProperty;

    /**
     * The time zone in which your source data was recorded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-timezone
     */
    readonly timezone?: string;
  }

  /**
   * A calculation made by contrasting a measure and a dimension from your source data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html
   */
  export interface MetricProperty {
    /**
     * The function with which the metric is calculated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html#cfn-lookoutmetrics-anomalydetector-metric-aggregationfunction
     */
    readonly aggregationFunction: string;

    /**
     * The name of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html#cfn-lookoutmetrics-anomalydetector-metric-metricname
     */
    readonly metricName: string;

    /**
     * The namespace for the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html#cfn-lookoutmetrics-anomalydetector-metric-namespace
     */
    readonly namespace?: string;
  }

  /**
   * Contains information about how the source data should be interpreted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html
   */
  export interface MetricSourceProperty {
    /**
     * Details about an AppFlow datasource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-appflowconfig
     */
    readonly appFlowConfig?: CfnAnomalyDetector.AppFlowConfigProperty | cdk.IResolvable;

    /**
     * Details about an Amazon CloudWatch monitoring datasource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-cloudwatchconfig
     */
    readonly cloudwatchConfig?: CfnAnomalyDetector.CloudwatchConfigProperty | cdk.IResolvable;

    /**
     * Details about an Amazon Relational Database Service (RDS) datasource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-rdssourceconfig
     */
    readonly rdsSourceConfig?: cdk.IResolvable | CfnAnomalyDetector.RDSSourceConfigProperty;

    /**
     * Details about an Amazon Redshift database datasource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-redshiftsourceconfig
     */
    readonly redshiftSourceConfig?: cdk.IResolvable | CfnAnomalyDetector.RedshiftSourceConfigProperty;

    /**
     * Contains information about the configuration of the S3 bucket that contains source files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-s3sourceconfig
     */
    readonly s3SourceConfig?: cdk.IResolvable | CfnAnomalyDetector.S3SourceConfigProperty;
  }

  /**
   * Contains information about the configuration of the S3 bucket that contains source files.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html
   */
  export interface S3SourceConfigProperty {
    /**
     * Contains information about a source file's formatting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html#cfn-lookoutmetrics-anomalydetector-s3sourceconfig-fileformatdescriptor
     */
    readonly fileFormatDescriptor: CfnAnomalyDetector.FileFormatDescriptorProperty | cdk.IResolvable;

    /**
     * A list of paths to the historical data files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html#cfn-lookoutmetrics-anomalydetector-s3sourceconfig-historicaldatapathlist
     */
    readonly historicalDataPathList?: Array<string>;

    /**
     * The ARN of an IAM role that has read and write access permissions to the source S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html#cfn-lookoutmetrics-anomalydetector-s3sourceconfig-rolearn
     */
    readonly roleArn: string;

    /**
     * A list of templated paths to the source files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html#cfn-lookoutmetrics-anomalydetector-s3sourceconfig-templatedpathlist
     */
    readonly templatedPathList?: Array<string>;
  }

  /**
   * Contains information about a source file's formatting.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-fileformatdescriptor.html
   */
  export interface FileFormatDescriptorProperty {
    /**
     * Contains information about how a source CSV data file should be analyzed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-fileformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-fileformatdescriptor-csvformatdescriptor
     */
    readonly csvFormatDescriptor?: CfnAnomalyDetector.CsvFormatDescriptorProperty | cdk.IResolvable;

    /**
     * Contains information about how a source JSON data file should be analyzed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-fileformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-fileformatdescriptor-jsonformatdescriptor
     */
    readonly jsonFormatDescriptor?: cdk.IResolvable | CfnAnomalyDetector.JsonFormatDescriptorProperty;
  }

  /**
   * Contains information about how a source JSON data file should be analyzed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-jsonformatdescriptor.html
   */
  export interface JsonFormatDescriptorProperty {
    /**
     * The character set in which the source JSON file is written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-jsonformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-jsonformatdescriptor-charset
     */
    readonly charset?: string;

    /**
     * The level of compression of the source CSV file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-jsonformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-jsonformatdescriptor-filecompression
     */
    readonly fileCompression?: string;
  }

  /**
   * Contains information about how a source CSV data file should be analyzed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html
   */
  export interface CsvFormatDescriptorProperty {
    /**
     * The character set in which the source CSV file is written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-charset
     */
    readonly charset?: string;

    /**
     * Whether or not the source CSV file contains a header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-containsheader
     */
    readonly containsHeader?: boolean | cdk.IResolvable;

    /**
     * The character used to delimit the source CSV file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-delimiter
     */
    readonly delimiter?: string;

    /**
     * The level of compression of the source CSV file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-filecompression
     */
    readonly fileCompression?: string;

    /**
     * A list of the source CSV file's headers, if any.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-headerlist
     */
    readonly headerList?: Array<string>;

    /**
     * The character used as a quote character.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-quotesymbol
     */
    readonly quoteSymbol?: string;
  }

  /**
   * Details about an Amazon CloudWatch datasource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-cloudwatchconfig.html
   */
  export interface CloudwatchConfigProperty {
    /**
     * An IAM role that gives Amazon Lookout for Metrics permission to access data in Amazon CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-cloudwatchconfig.html#cfn-lookoutmetrics-anomalydetector-cloudwatchconfig-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Contains information about the Amazon Relational Database Service (RDS) configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html
   */
  export interface RDSSourceConfigProperty {
    /**
     * The host name of the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-databasehost
     */
    readonly databaseHost: string;

    /**
     * The name of the RDS database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-databasename
     */
    readonly databaseName: string;

    /**
     * The port number where the database can be accessed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-databaseport
     */
    readonly databasePort: number;

    /**
     * A string identifying the database instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-dbinstanceidentifier
     */
    readonly dbInstanceIdentifier: string;

    /**
     * The Amazon Resource Name (ARN) of the role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-rolearn
     */
    readonly roleArn: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Secrets Manager role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-secretmanagerarn
     */
    readonly secretManagerArn: string;

    /**
     * The name of the table in the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-tablename
     */
    readonly tableName: string;

    /**
     * An object containing information about the Amazon Virtual Private Cloud (VPC) configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-vpcconfiguration
     */
    readonly vpcConfiguration: cdk.IResolvable | CfnAnomalyDetector.VpcConfigurationProperty;
  }

  /**
   * Contains configuration information about the Amazon Virtual Private Cloud (VPC).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-vpcconfiguration.html
   */
  export interface VpcConfigurationProperty {
    /**
     * An array of strings containing the list of security groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-vpcconfiguration.html#cfn-lookoutmetrics-anomalydetector-vpcconfiguration-securitygroupidlist
     */
    readonly securityGroupIdList: Array<string>;

    /**
     * An array of strings containing the Amazon VPC subnet IDs (e.g., `subnet-0bb1c79de3EXAMPLE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-vpcconfiguration.html#cfn-lookoutmetrics-anomalydetector-vpcconfiguration-subnetidlist
     */
    readonly subnetIdList: Array<string>;
  }

  /**
   * Details about an Amazon AppFlow flow datasource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-appflowconfig.html
   */
  export interface AppFlowConfigProperty {
    /**
     * name of the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-appflowconfig.html#cfn-lookoutmetrics-anomalydetector-appflowconfig-flowname
     */
    readonly flowName: string;

    /**
     * An IAM role that gives Amazon Lookout for Metrics permission to access the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-appflowconfig.html#cfn-lookoutmetrics-anomalydetector-appflowconfig-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Provides information about the Amazon Redshift database configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html
   */
  export interface RedshiftSourceConfigProperty {
    /**
     * A string identifying the Redshift cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-clusteridentifier
     */
    readonly clusterIdentifier: string;

    /**
     * The name of the database host.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-databasehost
     */
    readonly databaseHost: string;

    /**
     * The Redshift database name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-databasename
     */
    readonly databaseName: string;

    /**
     * The port number where the database can be accessed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-databaseport
     */
    readonly databasePort: number;

    /**
     * The Amazon Resource Name (ARN) of the role providing access to the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-rolearn
     */
    readonly roleArn: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Secrets Manager role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-secretmanagerarn
     */
    readonly secretManagerArn: string;

    /**
     * The table name of the Redshift database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-tablename
     */
    readonly tableName: string;

    /**
     * Contains information about the Amazon Virtual Private Cloud (VPC) configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-vpcconfiguration
     */
    readonly vpcConfiguration: cdk.IResolvable | CfnAnomalyDetector.VpcConfigurationProperty;
  }

  /**
   * Contains information about the column used to track time in a source data file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-timestampcolumn.html
   */
  export interface TimestampColumnProperty {
    /**
     * The format of the timestamp column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-timestampcolumn.html#cfn-lookoutmetrics-anomalydetector-timestampcolumn-columnformat
     */
    readonly columnFormat?: string;

    /**
     * The name of the timestamp column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-timestampcolumn.html#cfn-lookoutmetrics-anomalydetector-timestampcolumn-columnname
     */
    readonly columnName?: string;
  }
}

/**
 * Properties for defining a `CfnAnomalyDetector`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html
 */
export interface CfnAnomalyDetectorProps {
  /**
   * Contains information about the configuration of the anomaly detector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorconfig
   */
  readonly anomalyDetectorConfig: CfnAnomalyDetector.AnomalyDetectorConfigProperty | cdk.IResolvable;

  /**
   * A description of the detector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectordescription
   */
  readonly anomalyDetectorDescription?: string;

  /**
   * The name of the detector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorname
   */
  readonly anomalyDetectorName?: string;

  /**
   * The ARN of the KMS key to use to encrypt your data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * The detector's dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-metricsetlist
   */
  readonly metricSetList: Array<cdk.IResolvable | CfnAnomalyDetector.MetricSetProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `AnomalyDetectorConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AnomalyDetectorConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorAnomalyDetectorConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("anomalyDetectorFrequency", cdk.requiredValidator)(properties.anomalyDetectorFrequency));
  errors.collect(cdk.propertyValidator("anomalyDetectorFrequency", cdk.validateString)(properties.anomalyDetectorFrequency));
  return errors.wrap("supplied properties not correct for \"AnomalyDetectorConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorAnomalyDetectorConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorAnomalyDetectorConfigPropertyValidator(properties).assertSuccess();
  return {
    "AnomalyDetectorFrequency": cdk.stringToCloudFormation(properties.anomalyDetectorFrequency)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorAnomalyDetectorConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.AnomalyDetectorConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.AnomalyDetectorConfigProperty>();
  ret.addPropertyResult("anomalyDetectorFrequency", "AnomalyDetectorFrequency", (properties.AnomalyDetectorFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.AnomalyDetectorFrequency) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricProperty`
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregationFunction", cdk.requiredValidator)(properties.aggregationFunction));
  errors.collect(cdk.propertyValidator("aggregationFunction", cdk.validateString)(properties.aggregationFunction));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  return errors.wrap("supplied properties not correct for \"MetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorMetricPropertyValidator(properties).assertSuccess();
  return {
    "AggregationFunction": cdk.stringToCloudFormation(properties.aggregationFunction),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Namespace": cdk.stringToCloudFormation(properties.namespace)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.MetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricProperty>();
  ret.addPropertyResult("aggregationFunction", "AggregationFunction", (properties.AggregationFunction != null ? cfn_parse.FromCloudFormation.getString(properties.AggregationFunction) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonFormatDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `JsonFormatDescriptorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorJsonFormatDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("charset", cdk.validateString)(properties.charset));
  errors.collect(cdk.propertyValidator("fileCompression", cdk.validateString)(properties.fileCompression));
  return errors.wrap("supplied properties not correct for \"JsonFormatDescriptorProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorJsonFormatDescriptorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorJsonFormatDescriptorPropertyValidator(properties).assertSuccess();
  return {
    "Charset": cdk.stringToCloudFormation(properties.charset),
    "FileCompression": cdk.stringToCloudFormation(properties.fileCompression)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorJsonFormatDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.JsonFormatDescriptorProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.JsonFormatDescriptorProperty>();
  ret.addPropertyResult("charset", "Charset", (properties.Charset != null ? cfn_parse.FromCloudFormation.getString(properties.Charset) : undefined));
  ret.addPropertyResult("fileCompression", "FileCompression", (properties.FileCompression != null ? cfn_parse.FromCloudFormation.getString(properties.FileCompression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CsvFormatDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `CsvFormatDescriptorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorCsvFormatDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("charset", cdk.validateString)(properties.charset));
  errors.collect(cdk.propertyValidator("containsHeader", cdk.validateBoolean)(properties.containsHeader));
  errors.collect(cdk.propertyValidator("delimiter", cdk.validateString)(properties.delimiter));
  errors.collect(cdk.propertyValidator("fileCompression", cdk.validateString)(properties.fileCompression));
  errors.collect(cdk.propertyValidator("headerList", cdk.listValidator(cdk.validateString))(properties.headerList));
  errors.collect(cdk.propertyValidator("quoteSymbol", cdk.validateString)(properties.quoteSymbol));
  return errors.wrap("supplied properties not correct for \"CsvFormatDescriptorProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorCsvFormatDescriptorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorCsvFormatDescriptorPropertyValidator(properties).assertSuccess();
  return {
    "Charset": cdk.stringToCloudFormation(properties.charset),
    "ContainsHeader": cdk.booleanToCloudFormation(properties.containsHeader),
    "Delimiter": cdk.stringToCloudFormation(properties.delimiter),
    "FileCompression": cdk.stringToCloudFormation(properties.fileCompression),
    "HeaderList": cdk.listMapper(cdk.stringToCloudFormation)(properties.headerList),
    "QuoteSymbol": cdk.stringToCloudFormation(properties.quoteSymbol)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorCsvFormatDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.CsvFormatDescriptorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.CsvFormatDescriptorProperty>();
  ret.addPropertyResult("charset", "Charset", (properties.Charset != null ? cfn_parse.FromCloudFormation.getString(properties.Charset) : undefined));
  ret.addPropertyResult("containsHeader", "ContainsHeader", (properties.ContainsHeader != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContainsHeader) : undefined));
  ret.addPropertyResult("delimiter", "Delimiter", (properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined));
  ret.addPropertyResult("fileCompression", "FileCompression", (properties.FileCompression != null ? cfn_parse.FromCloudFormation.getString(properties.FileCompression) : undefined));
  ret.addPropertyResult("headerList", "HeaderList", (properties.HeaderList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.HeaderList) : undefined));
  ret.addPropertyResult("quoteSymbol", "QuoteSymbol", (properties.QuoteSymbol != null ? cfn_parse.FromCloudFormation.getString(properties.QuoteSymbol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FileFormatDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `FileFormatDescriptorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorFileFormatDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("csvFormatDescriptor", CfnAnomalyDetectorCsvFormatDescriptorPropertyValidator)(properties.csvFormatDescriptor));
  errors.collect(cdk.propertyValidator("jsonFormatDescriptor", CfnAnomalyDetectorJsonFormatDescriptorPropertyValidator)(properties.jsonFormatDescriptor));
  return errors.wrap("supplied properties not correct for \"FileFormatDescriptorProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorFileFormatDescriptorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorFileFormatDescriptorPropertyValidator(properties).assertSuccess();
  return {
    "CsvFormatDescriptor": convertCfnAnomalyDetectorCsvFormatDescriptorPropertyToCloudFormation(properties.csvFormatDescriptor),
    "JsonFormatDescriptor": convertCfnAnomalyDetectorJsonFormatDescriptorPropertyToCloudFormation(properties.jsonFormatDescriptor)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorFileFormatDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.FileFormatDescriptorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.FileFormatDescriptorProperty>();
  ret.addPropertyResult("csvFormatDescriptor", "CsvFormatDescriptor", (properties.CsvFormatDescriptor != null ? CfnAnomalyDetectorCsvFormatDescriptorPropertyFromCloudFormation(properties.CsvFormatDescriptor) : undefined));
  ret.addPropertyResult("jsonFormatDescriptor", "JsonFormatDescriptor", (properties.JsonFormatDescriptor != null ? CfnAnomalyDetectorJsonFormatDescriptorPropertyFromCloudFormation(properties.JsonFormatDescriptor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3SourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3SourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorS3SourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fileFormatDescriptor", cdk.requiredValidator)(properties.fileFormatDescriptor));
  errors.collect(cdk.propertyValidator("fileFormatDescriptor", CfnAnomalyDetectorFileFormatDescriptorPropertyValidator)(properties.fileFormatDescriptor));
  errors.collect(cdk.propertyValidator("historicalDataPathList", cdk.listValidator(cdk.validateString))(properties.historicalDataPathList));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("templatedPathList", cdk.listValidator(cdk.validateString))(properties.templatedPathList));
  return errors.wrap("supplied properties not correct for \"S3SourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorS3SourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorS3SourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "FileFormatDescriptor": convertCfnAnomalyDetectorFileFormatDescriptorPropertyToCloudFormation(properties.fileFormatDescriptor),
    "HistoricalDataPathList": cdk.listMapper(cdk.stringToCloudFormation)(properties.historicalDataPathList),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TemplatedPathList": cdk.listMapper(cdk.stringToCloudFormation)(properties.templatedPathList)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorS3SourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.S3SourceConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.S3SourceConfigProperty>();
  ret.addPropertyResult("fileFormatDescriptor", "FileFormatDescriptor", (properties.FileFormatDescriptor != null ? CfnAnomalyDetectorFileFormatDescriptorPropertyFromCloudFormation(properties.FileFormatDescriptor) : undefined));
  ret.addPropertyResult("historicalDataPathList", "HistoricalDataPathList", (properties.HistoricalDataPathList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.HistoricalDataPathList) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("templatedPathList", "TemplatedPathList", (properties.TemplatedPathList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TemplatedPathList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudwatchConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CloudwatchConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorCloudwatchConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CloudwatchConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorCloudwatchConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorCloudwatchConfigPropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorCloudwatchConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.CloudwatchConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.CloudwatchConfigProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIdList", cdk.requiredValidator)(properties.securityGroupIdList));
  errors.collect(cdk.propertyValidator("securityGroupIdList", cdk.listValidator(cdk.validateString))(properties.securityGroupIdList));
  errors.collect(cdk.propertyValidator("subnetIdList", cdk.requiredValidator)(properties.subnetIdList));
  errors.collect(cdk.propertyValidator("subnetIdList", cdk.listValidator(cdk.validateString))(properties.subnetIdList));
  return errors.wrap("supplied properties not correct for \"VpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIdList": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIdList),
    "SubnetIdList": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIdList)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.VpcConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.VpcConfigurationProperty>();
  ret.addPropertyResult("securityGroupIdList", "SecurityGroupIdList", (properties.SecurityGroupIdList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIdList) : undefined));
  ret.addPropertyResult("subnetIdList", "SubnetIdList", (properties.SubnetIdList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIdList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RDSSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RDSSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorRDSSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dbInstanceIdentifier", cdk.requiredValidator)(properties.dbInstanceIdentifier));
  errors.collect(cdk.propertyValidator("dbInstanceIdentifier", cdk.validateString)(properties.dbInstanceIdentifier));
  errors.collect(cdk.propertyValidator("databaseHost", cdk.requiredValidator)(properties.databaseHost));
  errors.collect(cdk.propertyValidator("databaseHost", cdk.validateString)(properties.databaseHost));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databasePort", cdk.requiredValidator)(properties.databasePort));
  errors.collect(cdk.propertyValidator("databasePort", cdk.validateNumber)(properties.databasePort));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("secretManagerArn", cdk.requiredValidator)(properties.secretManagerArn));
  errors.collect(cdk.propertyValidator("secretManagerArn", cdk.validateString)(properties.secretManagerArn));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("vpcConfiguration", cdk.requiredValidator)(properties.vpcConfiguration));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnAnomalyDetectorVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"RDSSourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorRDSSourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorRDSSourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "DBInstanceIdentifier": cdk.stringToCloudFormation(properties.dbInstanceIdentifier),
    "DatabaseHost": cdk.stringToCloudFormation(properties.databaseHost),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DatabasePort": cdk.numberToCloudFormation(properties.databasePort),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecretManagerArn": cdk.stringToCloudFormation(properties.secretManagerArn),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "VpcConfiguration": convertCfnAnomalyDetectorVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorRDSSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.RDSSourceConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.RDSSourceConfigProperty>();
  ret.addPropertyResult("databaseHost", "DatabaseHost", (properties.DatabaseHost != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseHost) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("databasePort", "DatabasePort", (properties.DatabasePort != null ? cfn_parse.FromCloudFormation.getNumber(properties.DatabasePort) : undefined));
  ret.addPropertyResult("dbInstanceIdentifier", "DBInstanceIdentifier", (properties.DBInstanceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DBInstanceIdentifier) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("secretManagerArn", "SecretManagerArn", (properties.SecretManagerArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretManagerArn) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnAnomalyDetectorVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AppFlowConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AppFlowConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorAppFlowConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("flowName", cdk.requiredValidator)(properties.flowName));
  errors.collect(cdk.propertyValidator("flowName", cdk.validateString)(properties.flowName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"AppFlowConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorAppFlowConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorAppFlowConfigPropertyValidator(properties).assertSuccess();
  return {
    "FlowName": cdk.stringToCloudFormation(properties.flowName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorAppFlowConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.AppFlowConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.AppFlowConfigProperty>();
  ret.addPropertyResult("flowName", "FlowName", (properties.FlowName != null ? cfn_parse.FromCloudFormation.getString(properties.FlowName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedshiftSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorRedshiftSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.requiredValidator)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.validateString)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("databaseHost", cdk.requiredValidator)(properties.databaseHost));
  errors.collect(cdk.propertyValidator("databaseHost", cdk.validateString)(properties.databaseHost));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databasePort", cdk.requiredValidator)(properties.databasePort));
  errors.collect(cdk.propertyValidator("databasePort", cdk.validateNumber)(properties.databasePort));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("secretManagerArn", cdk.requiredValidator)(properties.secretManagerArn));
  errors.collect(cdk.propertyValidator("secretManagerArn", cdk.validateString)(properties.secretManagerArn));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("vpcConfiguration", cdk.requiredValidator)(properties.vpcConfiguration));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnAnomalyDetectorVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"RedshiftSourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorRedshiftSourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorRedshiftSourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "ClusterIdentifier": cdk.stringToCloudFormation(properties.clusterIdentifier),
    "DatabaseHost": cdk.stringToCloudFormation(properties.databaseHost),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DatabasePort": cdk.numberToCloudFormation(properties.databasePort),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecretManagerArn": cdk.stringToCloudFormation(properties.secretManagerArn),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "VpcConfiguration": convertCfnAnomalyDetectorVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorRedshiftSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.RedshiftSourceConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.RedshiftSourceConfigProperty>();
  ret.addPropertyResult("clusterIdentifier", "ClusterIdentifier", (properties.ClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier) : undefined));
  ret.addPropertyResult("databaseHost", "DatabaseHost", (properties.DatabaseHost != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseHost) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("databasePort", "DatabasePort", (properties.DatabasePort != null ? cfn_parse.FromCloudFormation.getNumber(properties.DatabasePort) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("secretManagerArn", "SecretManagerArn", (properties.SecretManagerArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretManagerArn) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnAnomalyDetectorVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricSourceProperty`
 *
 * @param properties - the TypeScript properties of a `MetricSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorMetricSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appFlowConfig", CfnAnomalyDetectorAppFlowConfigPropertyValidator)(properties.appFlowConfig));
  errors.collect(cdk.propertyValidator("cloudwatchConfig", CfnAnomalyDetectorCloudwatchConfigPropertyValidator)(properties.cloudwatchConfig));
  errors.collect(cdk.propertyValidator("rdsSourceConfig", CfnAnomalyDetectorRDSSourceConfigPropertyValidator)(properties.rdsSourceConfig));
  errors.collect(cdk.propertyValidator("redshiftSourceConfig", CfnAnomalyDetectorRedshiftSourceConfigPropertyValidator)(properties.redshiftSourceConfig));
  errors.collect(cdk.propertyValidator("s3SourceConfig", CfnAnomalyDetectorS3SourceConfigPropertyValidator)(properties.s3SourceConfig));
  return errors.wrap("supplied properties not correct for \"MetricSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorMetricSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorMetricSourcePropertyValidator(properties).assertSuccess();
  return {
    "AppFlowConfig": convertCfnAnomalyDetectorAppFlowConfigPropertyToCloudFormation(properties.appFlowConfig),
    "CloudwatchConfig": convertCfnAnomalyDetectorCloudwatchConfigPropertyToCloudFormation(properties.cloudwatchConfig),
    "RDSSourceConfig": convertCfnAnomalyDetectorRDSSourceConfigPropertyToCloudFormation(properties.rdsSourceConfig),
    "RedshiftSourceConfig": convertCfnAnomalyDetectorRedshiftSourceConfigPropertyToCloudFormation(properties.redshiftSourceConfig),
    "S3SourceConfig": convertCfnAnomalyDetectorS3SourceConfigPropertyToCloudFormation(properties.s3SourceConfig)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.MetricSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricSourceProperty>();
  ret.addPropertyResult("appFlowConfig", "AppFlowConfig", (properties.AppFlowConfig != null ? CfnAnomalyDetectorAppFlowConfigPropertyFromCloudFormation(properties.AppFlowConfig) : undefined));
  ret.addPropertyResult("cloudwatchConfig", "CloudwatchConfig", (properties.CloudwatchConfig != null ? CfnAnomalyDetectorCloudwatchConfigPropertyFromCloudFormation(properties.CloudwatchConfig) : undefined));
  ret.addPropertyResult("rdsSourceConfig", "RDSSourceConfig", (properties.RDSSourceConfig != null ? CfnAnomalyDetectorRDSSourceConfigPropertyFromCloudFormation(properties.RDSSourceConfig) : undefined));
  ret.addPropertyResult("redshiftSourceConfig", "RedshiftSourceConfig", (properties.RedshiftSourceConfig != null ? CfnAnomalyDetectorRedshiftSourceConfigPropertyFromCloudFormation(properties.RedshiftSourceConfig) : undefined));
  ret.addPropertyResult("s3SourceConfig", "S3SourceConfig", (properties.S3SourceConfig != null ? CfnAnomalyDetectorS3SourceConfigPropertyFromCloudFormation(properties.S3SourceConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimestampColumnProperty`
 *
 * @param properties - the TypeScript properties of a `TimestampColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorTimestampColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("columnFormat", cdk.validateString)(properties.columnFormat));
  errors.collect(cdk.propertyValidator("columnName", cdk.validateString)(properties.columnName));
  return errors.wrap("supplied properties not correct for \"TimestampColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorTimestampColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorTimestampColumnPropertyValidator(properties).assertSuccess();
  return {
    "ColumnFormat": cdk.stringToCloudFormation(properties.columnFormat),
    "ColumnName": cdk.stringToCloudFormation(properties.columnName)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorTimestampColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.TimestampColumnProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.TimestampColumnProperty>();
  ret.addPropertyResult("columnFormat", "ColumnFormat", (properties.ColumnFormat != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnFormat) : undefined));
  ret.addPropertyResult("columnName", "ColumnName", (properties.ColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricSetProperty`
 *
 * @param properties - the TypeScript properties of a `MetricSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorMetricSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensionList", cdk.listValidator(cdk.validateString))(properties.dimensionList));
  errors.collect(cdk.propertyValidator("metricList", cdk.requiredValidator)(properties.metricList));
  errors.collect(cdk.propertyValidator("metricList", cdk.listValidator(CfnAnomalyDetectorMetricPropertyValidator))(properties.metricList));
  errors.collect(cdk.propertyValidator("metricSetDescription", cdk.validateString)(properties.metricSetDescription));
  errors.collect(cdk.propertyValidator("metricSetFrequency", cdk.validateString)(properties.metricSetFrequency));
  errors.collect(cdk.propertyValidator("metricSetName", cdk.requiredValidator)(properties.metricSetName));
  errors.collect(cdk.propertyValidator("metricSetName", cdk.validateString)(properties.metricSetName));
  errors.collect(cdk.propertyValidator("metricSource", cdk.requiredValidator)(properties.metricSource));
  errors.collect(cdk.propertyValidator("metricSource", CfnAnomalyDetectorMetricSourcePropertyValidator)(properties.metricSource));
  errors.collect(cdk.propertyValidator("offset", cdk.validateNumber)(properties.offset));
  errors.collect(cdk.propertyValidator("timestampColumn", CfnAnomalyDetectorTimestampColumnPropertyValidator)(properties.timestampColumn));
  errors.collect(cdk.propertyValidator("timezone", cdk.validateString)(properties.timezone));
  return errors.wrap("supplied properties not correct for \"MetricSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorMetricSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorMetricSetPropertyValidator(properties).assertSuccess();
  return {
    "DimensionList": cdk.listMapper(cdk.stringToCloudFormation)(properties.dimensionList),
    "MetricList": cdk.listMapper(convertCfnAnomalyDetectorMetricPropertyToCloudFormation)(properties.metricList),
    "MetricSetDescription": cdk.stringToCloudFormation(properties.metricSetDescription),
    "MetricSetFrequency": cdk.stringToCloudFormation(properties.metricSetFrequency),
    "MetricSetName": cdk.stringToCloudFormation(properties.metricSetName),
    "MetricSource": convertCfnAnomalyDetectorMetricSourcePropertyToCloudFormation(properties.metricSource),
    "Offset": cdk.numberToCloudFormation(properties.offset),
    "TimestampColumn": convertCfnAnomalyDetectorTimestampColumnPropertyToCloudFormation(properties.timestampColumn),
    "Timezone": cdk.stringToCloudFormation(properties.timezone)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyDetector.MetricSetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricSetProperty>();
  ret.addPropertyResult("dimensionList", "DimensionList", (properties.DimensionList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DimensionList) : undefined));
  ret.addPropertyResult("metricList", "MetricList", (properties.MetricList != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorMetricPropertyFromCloudFormation)(properties.MetricList) : undefined));
  ret.addPropertyResult("metricSetDescription", "MetricSetDescription", (properties.MetricSetDescription != null ? cfn_parse.FromCloudFormation.getString(properties.MetricSetDescription) : undefined));
  ret.addPropertyResult("metricSetFrequency", "MetricSetFrequency", (properties.MetricSetFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MetricSetFrequency) : undefined));
  ret.addPropertyResult("metricSetName", "MetricSetName", (properties.MetricSetName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricSetName) : undefined));
  ret.addPropertyResult("metricSource", "MetricSource", (properties.MetricSource != null ? CfnAnomalyDetectorMetricSourcePropertyFromCloudFormation(properties.MetricSource) : undefined));
  ret.addPropertyResult("offset", "Offset", (properties.Offset != null ? cfn_parse.FromCloudFormation.getNumber(properties.Offset) : undefined));
  ret.addPropertyResult("timestampColumn", "TimestampColumn", (properties.TimestampColumn != null ? CfnAnomalyDetectorTimestampColumnPropertyFromCloudFormation(properties.TimestampColumn) : undefined));
  ret.addPropertyResult("timezone", "Timezone", (properties.Timezone != null ? cfn_parse.FromCloudFormation.getString(properties.Timezone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAnomalyDetectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnomalyDetectorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyDetectorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("anomalyDetectorConfig", cdk.requiredValidator)(properties.anomalyDetectorConfig));
  errors.collect(cdk.propertyValidator("anomalyDetectorConfig", CfnAnomalyDetectorAnomalyDetectorConfigPropertyValidator)(properties.anomalyDetectorConfig));
  errors.collect(cdk.propertyValidator("anomalyDetectorDescription", cdk.validateString)(properties.anomalyDetectorDescription));
  errors.collect(cdk.propertyValidator("anomalyDetectorName", cdk.validateString)(properties.anomalyDetectorName));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("metricSetList", cdk.requiredValidator)(properties.metricSetList));
  errors.collect(cdk.propertyValidator("metricSetList", cdk.listValidator(CfnAnomalyDetectorMetricSetPropertyValidator))(properties.metricSetList));
  return errors.wrap("supplied properties not correct for \"CfnAnomalyDetectorProps\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyDetectorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyDetectorPropsValidator(properties).assertSuccess();
  return {
    "AnomalyDetectorConfig": convertCfnAnomalyDetectorAnomalyDetectorConfigPropertyToCloudFormation(properties.anomalyDetectorConfig),
    "AnomalyDetectorDescription": cdk.stringToCloudFormation(properties.anomalyDetectorDescription),
    "AnomalyDetectorName": cdk.stringToCloudFormation(properties.anomalyDetectorName),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "MetricSetList": cdk.listMapper(convertCfnAnomalyDetectorMetricSetPropertyToCloudFormation)(properties.metricSetList)
  };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetectorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetectorProps>();
  ret.addPropertyResult("anomalyDetectorConfig", "AnomalyDetectorConfig", (properties.AnomalyDetectorConfig != null ? CfnAnomalyDetectorAnomalyDetectorConfigPropertyFromCloudFormation(properties.AnomalyDetectorConfig) : undefined));
  ret.addPropertyResult("anomalyDetectorDescription", "AnomalyDetectorDescription", (properties.AnomalyDetectorDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AnomalyDetectorDescription) : undefined));
  ret.addPropertyResult("anomalyDetectorName", "AnomalyDetectorName", (properties.AnomalyDetectorName != null ? cfn_parse.FromCloudFormation.getString(properties.AnomalyDetectorName) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("metricSetList", "MetricSetList", (properties.MetricSetList != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorMetricSetPropertyFromCloudFormation)(properties.MetricSetList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}