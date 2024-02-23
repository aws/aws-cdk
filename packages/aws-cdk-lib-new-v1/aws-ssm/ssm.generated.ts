/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::SSM::Association` resource creates a State Manager association for your managed instances.
 *
 * A State Manager association defines the state that you want to maintain on your instances. For example, an association can specify that anti-virus software must be installed and running on your instances, or that certain ports must be closed. For static targets, the association specifies a schedule for when the configuration is reapplied. For dynamic targets, such as an AWS Resource Groups or an AWS Auto Scaling Group, State Manager applies the configuration when new instances are added to the group. The association also specifies actions to take when applying the configuration. For example, an association for anti-virus software might run once a day. If the software is not installed, then State Manager installs it. If the software is installed, but the service is not running, then the association might instruct State Manager to start the service.
 *
 * @cloudformationResource AWS::SSM::Association
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html
 */
export class CfnAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::Association";

  /**
   * Build a CfnAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The association ID.
   *
   * @cloudformationAttribute AssociationId
   */
  public readonly attrAssociationId: string;

  /**
   * By default, when you create a new association, the system runs it immediately after it is created and then according to the schedule you specified.
   */
  public applyOnlyAtCronInterval?: boolean | cdk.IResolvable;

  /**
   * Specify a descriptive name for the association.
   */
  public associationName?: string;

  /**
   * Choose the parameter that will define how your automation will branch out.
   */
  public automationTargetParameterName?: string;

  /**
   * The names or Amazon Resource Names (ARNs) of the Change Calendar type documents your associations are gated under.
   */
  public calendarNames?: Array<string>;

  /**
   * The severity level that is assigned to the association.
   */
  public complianceSeverity?: string;

  /**
   * The version of the SSM document to associate with the target.
   */
  public documentVersion?: string;

  /**
   * The ID of the instance that the SSM document is associated with.
   */
  public instanceId?: string;

  /**
   * The maximum number of targets allowed to run the association at the same time.
   */
  public maxConcurrency?: string;

  /**
   * The number of errors that are allowed before the system stops sending requests to run the association on additional targets.
   */
  public maxErrors?: string;

  /**
   * The name of the SSM document that contains the configuration information for the instance.
   */
  public name: string;

  /**
   * An Amazon Simple Storage Service (Amazon S3) bucket where you want to store the output details of the request.
   */
  public outputLocation?: CfnAssociation.InstanceAssociationOutputLocationProperty | cdk.IResolvable;

  /**
   * Parameter values that the SSM document uses at runtime.
   */
  public parameters?: any | cdk.IResolvable;

  /**
   * A cron expression that specifies a schedule when the association runs.
   */
  public scheduleExpression?: string;

  /**
   * Number of days to wait after the scheduled day to run an association.
   */
  public scheduleOffset?: number;

  /**
   * The mode for generating association compliance.
   */
  public syncCompliance?: string;

  /**
   * The targets for the association.
   */
  public targets?: Array<cdk.IResolvable | CfnAssociation.TargetProperty> | cdk.IResolvable;

  /**
   * The number of seconds the service should wait for the association status to show "Success" before proceeding with the stack execution.
   */
  public waitForSuccessTimeoutSeconds?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssociationProps) {
    super(scope, id, {
      "type": CfnAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrAssociationId = cdk.Token.asString(this.getAtt("AssociationId", cdk.ResolutionTypeHint.STRING));
    this.applyOnlyAtCronInterval = props.applyOnlyAtCronInterval;
    this.associationName = props.associationName;
    this.automationTargetParameterName = props.automationTargetParameterName;
    this.calendarNames = props.calendarNames;
    this.complianceSeverity = props.complianceSeverity;
    this.documentVersion = props.documentVersion;
    this.instanceId = props.instanceId;
    this.maxConcurrency = props.maxConcurrency;
    this.maxErrors = props.maxErrors;
    this.name = props.name;
    this.outputLocation = props.outputLocation;
    this.parameters = props.parameters;
    this.scheduleExpression = props.scheduleExpression;
    this.scheduleOffset = props.scheduleOffset;
    this.syncCompliance = props.syncCompliance;
    this.targets = props.targets;
    this.waitForSuccessTimeoutSeconds = props.waitForSuccessTimeoutSeconds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applyOnlyAtCronInterval": this.applyOnlyAtCronInterval,
      "associationName": this.associationName,
      "automationTargetParameterName": this.automationTargetParameterName,
      "calendarNames": this.calendarNames,
      "complianceSeverity": this.complianceSeverity,
      "documentVersion": this.documentVersion,
      "instanceId": this.instanceId,
      "maxConcurrency": this.maxConcurrency,
      "maxErrors": this.maxErrors,
      "name": this.name,
      "outputLocation": this.outputLocation,
      "parameters": this.parameters,
      "scheduleExpression": this.scheduleExpression,
      "scheduleOffset": this.scheduleOffset,
      "syncCompliance": this.syncCompliance,
      "targets": this.targets,
      "waitForSuccessTimeoutSeconds": this.waitForSuccessTimeoutSeconds
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssociationPropsToCloudFormation(props);
  }
}

export namespace CfnAssociation {
  /**
   * `Target` is a property of the [AWS::SSM::Association](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html) resource that specifies the targets for an SSM document in Systems Manager . You can target all instances in an AWS account by specifying the `InstanceIds` key with a value of `*` . To view a JSON and a YAML example that targets all instances, see "Create an association for all managed instances in an AWS account " on the Examples page.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-target.html
   */
  export interface TargetProperty {
    /**
     * User-defined criteria for sending commands that target managed nodes that meet the criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-target.html#cfn-ssm-association-target-key
     */
    readonly key: string;

    /**
     * User-defined criteria that maps to `Key` .
     *
     * For example, if you specified `tag:ServerRole` , you could specify `value:WebServer` to run a command on instances that include EC2 tags of `ServerRole,WebServer` .
     *
     * Depending on the type of target, the maximum number of values for a key might be lower than the global maximum of 50.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-target.html#cfn-ssm-association-target-values
     */
    readonly values: Array<string>;
  }

  /**
   * `InstanceAssociationOutputLocation` is a property of the [AWS::SSM::Association](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html) resource that specifies an Amazon S3 bucket where you want to store the results of this association request.
   *
   * For the minimal permissions required to enable Amazon S3 output for an association, see [Creating associations](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-state-assoc.html) in the *Systems Manager User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html
   */
  export interface InstanceAssociationOutputLocationProperty {
    /**
     * `S3OutputLocation` is a property of the [InstanceAssociationOutputLocation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html) property that specifies an Amazon S3 bucket where you want to store the results of this request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html#cfn-ssm-association-instanceassociationoutputlocation-s3location
     */
    readonly s3Location?: cdk.IResolvable | CfnAssociation.S3OutputLocationProperty;
  }

  /**
   * `S3OutputLocation` is a property of the [AWS::SSM::Association](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html) resource that specifies an Amazon S3 bucket where you want to store the results of this association request.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html
   */
  export interface S3OutputLocationProperty {
    /**
     * The name of the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html#cfn-ssm-association-s3outputlocation-outputs3bucketname
     */
    readonly outputS3BucketName?: string;

    /**
     * The S3 bucket subfolder.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html#cfn-ssm-association-s3outputlocation-outputs3keyprefix
     */
    readonly outputS3KeyPrefix?: string;

    /**
     * The AWS Region of the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html#cfn-ssm-association-s3outputlocation-outputs3region
     */
    readonly outputS3Region?: string;
  }
}

/**
 * Properties for defining a `CfnAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html
 */
export interface CfnAssociationProps {
  /**
   * By default, when you create a new association, the system runs it immediately after it is created and then according to the schedule you specified.
   *
   * Specify this option if you don't want an association to run immediately after you create it. This parameter is not supported for rate expressions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-applyonlyatcroninterval
   */
  readonly applyOnlyAtCronInterval?: boolean | cdk.IResolvable;

  /**
   * Specify a descriptive name for the association.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-associationname
   */
  readonly associationName?: string;

  /**
   * Choose the parameter that will define how your automation will branch out.
   *
   * This target is required for associations that use an Automation runbook and target resources by using rate controls. Automation is a capability of AWS Systems Manager .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-automationtargetparametername
   */
  readonly automationTargetParameterName?: string;

  /**
   * The names or Amazon Resource Names (ARNs) of the Change Calendar type documents your associations are gated under.
   *
   * The associations only run when that Change Calendar is open. For more information, see [AWS Systems Manager Change Calendar](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-change-calendar) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-calendarnames
   */
  readonly calendarNames?: Array<string>;

  /**
   * The severity level that is assigned to the association.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-complianceseverity
   */
  readonly complianceSeverity?: string;

  /**
   * The version of the SSM document to associate with the target.
   *
   * > Note the following important information.
   * >
   * > - State Manager doesn't support running associations that use a new version of a document if that document is shared from another account. State Manager always runs the `default` version of a document if shared from another account, even though the Systems Manager console shows that a new version was processed. If you want to run an association using a new version of a document shared form another account, you must set the document version to `default` .
   * > - `DocumentVersion` is not valid for documents owned by AWS , such as `AWS-RunPatchBaseline` or `AWS-UpdateSSMAgent` . If you specify `DocumentVersion` for an AWS document, the system returns the following error: "Error occurred during operation 'CreateAssociation'." (RequestToken: <token>, HandlerErrorCode: GeneralServiceException).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-documentversion
   */
  readonly documentVersion?: string;

  /**
   * The ID of the instance that the SSM document is associated with.
   *
   * You must specify the `InstanceId` or `Targets` property.
   *
   * > `InstanceId` has been deprecated. To specify an instance ID for an association, use the `Targets` parameter. If you use the parameter `InstanceId` , you cannot use the parameters `AssociationName` , `DocumentVersion` , `MaxErrors` , `MaxConcurrency` , `OutputLocation` , or `ScheduleExpression` . To use these parameters, you must use the `Targets` parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-instanceid
   */
  readonly instanceId?: string;

  /**
   * The maximum number of targets allowed to run the association at the same time.
   *
   * You can specify a number, for example 10, or a percentage of the target set, for example 10%. The default value is 100%, which means all targets run the association at the same time.
   *
   * If a new managed node starts and attempts to run an association while Systems Manager is running `MaxConcurrency` associations, the association is allowed to run. During the next association interval, the new managed node will process its association within the limit specified for `MaxConcurrency` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-maxconcurrency
   */
  readonly maxConcurrency?: string;

  /**
   * The number of errors that are allowed before the system stops sending requests to run the association on additional targets.
   *
   * You can specify either an absolute number of errors, for example 10, or a percentage of the target set, for example 10%. If you specify 3, for example, the system stops sending requests when the fourth error is received. If you specify 0, then the system stops sending requests after the first error is returned. If you run an association on 50 managed nodes and set `MaxError` to 10%, then the system stops sending the request when the sixth error is received.
   *
   * Executions that are already running an association when `MaxErrors` is reached are allowed to complete, but some of these executions may fail as well. If you need to ensure that there won't be more than max-errors failed executions, set `MaxConcurrency` to 1 so that executions proceed one at a time.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-maxerrors
   */
  readonly maxErrors?: string;

  /**
   * The name of the SSM document that contains the configuration information for the instance.
   *
   * You can specify `Command` or `Automation` documents. The documents can be AWS -predefined documents, documents you created, or a document that is shared with you from another account. For SSM documents that are shared with you from other AWS accounts , you must specify the complete SSM document ARN, in the following format:
   *
   * `arn:partition:ssm:region:account-id:document/document-name`
   *
   * For example: `arn:aws:ssm:us-east-2:12345678912:document/My-Shared-Document`
   *
   * For AWS -predefined documents and SSM documents you created in your account, you only need to specify the document name. For example, `AWS -ApplyPatchBaseline` or `My-Document` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-name
   */
  readonly name: string;

  /**
   * An Amazon Simple Storage Service (Amazon S3) bucket where you want to store the output details of the request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-outputlocation
   */
  readonly outputLocation?: CfnAssociation.InstanceAssociationOutputLocationProperty | cdk.IResolvable;

  /**
   * Parameter values that the SSM document uses at runtime.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-parameters
   */
  readonly parameters?: any | cdk.IResolvable;

  /**
   * A cron expression that specifies a schedule when the association runs.
   *
   * The schedule runs in Coordinated Universal Time (UTC).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-scheduleexpression
   */
  readonly scheduleExpression?: string;

  /**
   * Number of days to wait after the scheduled day to run an association.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-scheduleoffset
   */
  readonly scheduleOffset?: number;

  /**
   * The mode for generating association compliance.
   *
   * You can specify `AUTO` or `MANUAL` . In `AUTO` mode, the system uses the status of the association execution to determine the compliance status. If the association execution runs successfully, then the association is `COMPLIANT` . If the association execution doesn't run successfully, the association is `NON-COMPLIANT` .
   *
   * In `MANUAL` mode, you must specify the `AssociationId` as a parameter for the PutComplianceItems API action. In this case, compliance data is not managed by State Manager. It is managed by your direct call to the PutComplianceItems API action.
   *
   * By default, all associations use `AUTO` mode.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-synccompliance
   */
  readonly syncCompliance?: string;

  /**
   * The targets for the association.
   *
   * You must specify the `InstanceId` or `Targets` property. You can target all instances in an AWS account by specifying the `InstanceIds` key with a value of `*` . To view a JSON and a YAML example that targets all instances, see "Create an association for all managed instances in an AWS account " on the Examples page.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-targets
   */
  readonly targets?: Array<cdk.IResolvable | CfnAssociation.TargetProperty> | cdk.IResolvable;

  /**
   * The number of seconds the service should wait for the association status to show "Success" before proceeding with the stack execution.
   *
   * If the association status doesn't show "Success" after the specified number of seconds, then stack creation fails.
   *
   * > When you specify a value for the `WaitForSuccessTimeoutSeconds` , [drift detection](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html) for your AWS CloudFormation stack’s configuration might yield inaccurate results. If drift detection is important in your scenario, we recommend that you don’t include `WaitForSuccessTimeoutSeconds` in your template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-waitforsuccesstimeoutseconds
   */
  readonly waitForSuccessTimeoutSeconds?: number;
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssociationTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"TargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssociationTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssociationTargetPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnAssociationTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssociation.TargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssociation.TargetProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3OutputLocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3OutputLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssociationS3OutputLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("outputS3BucketName", cdk.validateString)(properties.outputS3BucketName));
  errors.collect(cdk.propertyValidator("outputS3KeyPrefix", cdk.validateString)(properties.outputS3KeyPrefix));
  errors.collect(cdk.propertyValidator("outputS3Region", cdk.validateString)(properties.outputS3Region));
  return errors.wrap("supplied properties not correct for \"S3OutputLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssociationS3OutputLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssociationS3OutputLocationPropertyValidator(properties).assertSuccess();
  return {
    "OutputS3BucketName": cdk.stringToCloudFormation(properties.outputS3BucketName),
    "OutputS3KeyPrefix": cdk.stringToCloudFormation(properties.outputS3KeyPrefix),
    "OutputS3Region": cdk.stringToCloudFormation(properties.outputS3Region)
  };
}

// @ts-ignore TS6133
function CfnAssociationS3OutputLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssociation.S3OutputLocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssociation.S3OutputLocationProperty>();
  ret.addPropertyResult("outputS3BucketName", "OutputS3BucketName", (properties.OutputS3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3BucketName) : undefined));
  ret.addPropertyResult("outputS3KeyPrefix", "OutputS3KeyPrefix", (properties.OutputS3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3KeyPrefix) : undefined));
  ret.addPropertyResult("outputS3Region", "OutputS3Region", (properties.OutputS3Region != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3Region) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceAssociationOutputLocationProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceAssociationOutputLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssociationInstanceAssociationOutputLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Location", CfnAssociationS3OutputLocationPropertyValidator)(properties.s3Location));
  return errors.wrap("supplied properties not correct for \"InstanceAssociationOutputLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssociationInstanceAssociationOutputLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssociationInstanceAssociationOutputLocationPropertyValidator(properties).assertSuccess();
  return {
    "S3Location": convertCfnAssociationS3OutputLocationPropertyToCloudFormation(properties.s3Location)
  };
}

// @ts-ignore TS6133
function CfnAssociationInstanceAssociationOutputLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssociation.InstanceAssociationOutputLocationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssociation.InstanceAssociationOutputLocationProperty>();
  ret.addPropertyResult("s3Location", "S3Location", (properties.S3Location != null ? CfnAssociationS3OutputLocationPropertyFromCloudFormation(properties.S3Location) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applyOnlyAtCronInterval", cdk.validateBoolean)(properties.applyOnlyAtCronInterval));
  errors.collect(cdk.propertyValidator("associationName", cdk.validateString)(properties.associationName));
  errors.collect(cdk.propertyValidator("automationTargetParameterName", cdk.validateString)(properties.automationTargetParameterName));
  errors.collect(cdk.propertyValidator("calendarNames", cdk.listValidator(cdk.validateString))(properties.calendarNames));
  errors.collect(cdk.propertyValidator("complianceSeverity", cdk.validateString)(properties.complianceSeverity));
  errors.collect(cdk.propertyValidator("documentVersion", cdk.validateString)(properties.documentVersion));
  errors.collect(cdk.propertyValidator("instanceId", cdk.validateString)(properties.instanceId));
  errors.collect(cdk.propertyValidator("maxConcurrency", cdk.validateString)(properties.maxConcurrency));
  errors.collect(cdk.propertyValidator("maxErrors", cdk.validateString)(properties.maxErrors));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("outputLocation", CfnAssociationInstanceAssociationOutputLocationPropertyValidator)(properties.outputLocation));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleOffset", cdk.validateNumber)(properties.scheduleOffset));
  errors.collect(cdk.propertyValidator("syncCompliance", cdk.validateString)(properties.syncCompliance));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnAssociationTargetPropertyValidator))(properties.targets));
  errors.collect(cdk.propertyValidator("waitForSuccessTimeoutSeconds", cdk.validateNumber)(properties.waitForSuccessTimeoutSeconds));
  return errors.wrap("supplied properties not correct for \"CfnAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssociationPropsValidator(properties).assertSuccess();
  return {
    "ApplyOnlyAtCronInterval": cdk.booleanToCloudFormation(properties.applyOnlyAtCronInterval),
    "AssociationName": cdk.stringToCloudFormation(properties.associationName),
    "AutomationTargetParameterName": cdk.stringToCloudFormation(properties.automationTargetParameterName),
    "CalendarNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.calendarNames),
    "ComplianceSeverity": cdk.stringToCloudFormation(properties.complianceSeverity),
    "DocumentVersion": cdk.stringToCloudFormation(properties.documentVersion),
    "InstanceId": cdk.stringToCloudFormation(properties.instanceId),
    "MaxConcurrency": cdk.stringToCloudFormation(properties.maxConcurrency),
    "MaxErrors": cdk.stringToCloudFormation(properties.maxErrors),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OutputLocation": convertCfnAssociationInstanceAssociationOutputLocationPropertyToCloudFormation(properties.outputLocation),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression),
    "ScheduleOffset": cdk.numberToCloudFormation(properties.scheduleOffset),
    "SyncCompliance": cdk.stringToCloudFormation(properties.syncCompliance),
    "Targets": cdk.listMapper(convertCfnAssociationTargetPropertyToCloudFormation)(properties.targets),
    "WaitForSuccessTimeoutSeconds": cdk.numberToCloudFormation(properties.waitForSuccessTimeoutSeconds)
  };
}

// @ts-ignore TS6133
function CfnAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssociationProps>();
  ret.addPropertyResult("applyOnlyAtCronInterval", "ApplyOnlyAtCronInterval", (properties.ApplyOnlyAtCronInterval != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApplyOnlyAtCronInterval) : undefined));
  ret.addPropertyResult("associationName", "AssociationName", (properties.AssociationName != null ? cfn_parse.FromCloudFormation.getString(properties.AssociationName) : undefined));
  ret.addPropertyResult("automationTargetParameterName", "AutomationTargetParameterName", (properties.AutomationTargetParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.AutomationTargetParameterName) : undefined));
  ret.addPropertyResult("calendarNames", "CalendarNames", (properties.CalendarNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CalendarNames) : undefined));
  ret.addPropertyResult("complianceSeverity", "ComplianceSeverity", (properties.ComplianceSeverity != null ? cfn_parse.FromCloudFormation.getString(properties.ComplianceSeverity) : undefined));
  ret.addPropertyResult("documentVersion", "DocumentVersion", (properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined));
  ret.addPropertyResult("instanceId", "InstanceId", (properties.InstanceId != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceId) : undefined));
  ret.addPropertyResult("maxConcurrency", "MaxConcurrency", (properties.MaxConcurrency != null ? cfn_parse.FromCloudFormation.getString(properties.MaxConcurrency) : undefined));
  ret.addPropertyResult("maxErrors", "MaxErrors", (properties.MaxErrors != null ? cfn_parse.FromCloudFormation.getString(properties.MaxErrors) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("outputLocation", "OutputLocation", (properties.OutputLocation != null ? CfnAssociationInstanceAssociationOutputLocationPropertyFromCloudFormation(properties.OutputLocation) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addPropertyResult("scheduleOffset", "ScheduleOffset", (properties.ScheduleOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleOffset) : undefined));
  ret.addPropertyResult("syncCompliance", "SyncCompliance", (properties.SyncCompliance != null ? cfn_parse.FromCloudFormation.getString(properties.SyncCompliance) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnAssociationTargetPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addPropertyResult("waitForSuccessTimeoutSeconds", "WaitForSuccessTimeoutSeconds", (properties.WaitForSuccessTimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.WaitForSuccessTimeoutSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSM::Document` resource creates a Systems Manager (SSM) document in AWS Systems Manager .
 *
 * This document defines the actions that Systems Manager performs on your AWS resources.
 *
 * > This resource does not support CloudFormation drift detection.
 *
 * @cloudformationResource AWS::SSM::Document
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html
 */
export class CfnDocument extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::Document";

  /**
   * Build a CfnDocument from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDocument {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDocumentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDocument(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of key-value pairs that describe attachments to a version of a document.
   */
  public attachments?: Array<CfnDocument.AttachmentsSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The content for the new SSM document in JSON or YAML.
   */
  public content: any | cdk.IResolvable;

  /**
   * Specify the document format for the request.
   */
  public documentFormat?: string;

  /**
   * The type of document to create.
   */
  public documentType?: string;

  /**
   * A name for the SSM document.
   */
  public name?: string;

  /**
   * A list of SSM documents required by a document.
   */
  public requires?: Array<CfnDocument.DocumentRequiresProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * AWS CloudFormation resource tags to apply to the document.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specify a target type to define the kinds of resources the document can run on.
   */
  public targetType?: string;

  /**
   * If the document resource you specify in your template already exists, this parameter determines whether a new version of the existing document is created, or the existing document is replaced.
   */
  public updateMethod?: string;

  /**
   * An optional field specifying the version of the artifact you are creating with the document.
   */
  public versionName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDocumentProps) {
    super(scope, id, {
      "type": CfnDocument.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "content", this);

    this.attachments = props.attachments;
    this.content = props.content;
    this.documentFormat = props.documentFormat;
    this.documentType = props.documentType;
    this.name = props.name;
    this.requires = props.requires;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSM::Document", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetType = props.targetType;
    this.updateMethod = props.updateMethod;
    this.versionName = props.versionName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attachments": this.attachments,
      "content": this.content,
      "documentFormat": this.documentFormat,
      "documentType": this.documentType,
      "name": this.name,
      "requires": this.requires,
      "tags": this.tags.renderTags(),
      "targetType": this.targetType,
      "updateMethod": this.updateMethod,
      "versionName": this.versionName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDocument.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDocumentPropsToCloudFormation(props);
  }
}

export namespace CfnDocument {
  /**
   * An SSM document required by the current document.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-documentrequires.html
   */
  export interface DocumentRequiresProperty {
    /**
     * The name of the required SSM document.
     *
     * The name can be an Amazon Resource Name (ARN).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-documentrequires.html#cfn-ssm-document-documentrequires-name
     */
    readonly name?: string;

    /**
     * The document version required by the current document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-documentrequires.html#cfn-ssm-document-documentrequires-version
     */
    readonly version?: string;
  }

  /**
   * Identifying information about a document attachment, including the file name and a key-value pair that identifies the location of an attachment to a document.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-attachmentssource.html
   */
  export interface AttachmentsSourceProperty {
    /**
     * The key of a key-value pair that identifies the location of an attachment to a document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-attachmentssource.html#cfn-ssm-document-attachmentssource-key
     */
    readonly key?: string;

    /**
     * The name of the document attachment file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-attachmentssource.html#cfn-ssm-document-attachmentssource-name
     */
    readonly name?: string;

    /**
     * The value of a key-value pair that identifies the location of an attachment to a document.
     *
     * The format for *Value* depends on the type of key you specify.
     *
     * - For the key *SourceUrl* , the value is an S3 bucket location. For example:
     *
     * `"Values": [ "s3://doc-example-bucket/my-folder" ]`
     * - For the key *S3FileUrl* , the value is a file in an S3 bucket. For example:
     *
     * `"Values": [ "s3://doc-example-bucket/my-folder/my-file.py" ]`
     * - For the key *AttachmentReference* , the value is constructed from the name of another SSM document in your account, a version number of that document, and a file attached to that document version that you want to reuse. For example:
     *
     * `"Values": [ "MyOtherDocument/3/my-other-file.py" ]`
     *
     * However, if the SSM document is shared with you from another account, the full SSM document ARN must be specified instead of the document name only. For example:
     *
     * `"Values": [ "arn:aws:ssm:us-east-2:111122223333:document/OtherAccountDocument/3/their-file.py" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-attachmentssource.html#cfn-ssm-document-attachmentssource-values
     */
    readonly values?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnDocument`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html
 */
export interface CfnDocumentProps {
  /**
   * A list of key-value pairs that describe attachments to a version of a document.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-attachments
   */
  readonly attachments?: Array<CfnDocument.AttachmentsSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The content for the new SSM document in JSON or YAML.
   *
   * For more information about the schemas for SSM document content, see [SSM document schema features and examples](https://docs.aws.amazon.com/systems-manager/latest/userguide/document-schemas-features.html) in the *AWS Systems Manager User Guide* .
   *
   * > This parameter also supports `String` data types.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-content
   */
  readonly content: any | cdk.IResolvable;

  /**
   * Specify the document format for the request.
   *
   * JSON is the default format.
   *
   * @default - "JSON"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-documentformat
   */
  readonly documentFormat?: string;

  /**
   * The type of document to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-documenttype
   */
  readonly documentType?: string;

  /**
   * A name for the SSM document.
   *
   * > You can't use the following strings as document name prefixes. These are reserved by AWS for use as document name prefixes:
   * >
   * > - `aws`
   * > - `amazon`
   * > - `amzn`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-name
   */
  readonly name?: string;

  /**
   * A list of SSM documents required by a document.
   *
   * This parameter is used exclusively by AWS AppConfig . When a user creates an AWS AppConfig configuration in an SSM document, the user must also specify a required document for validation purposes. In this case, an `ApplicationConfiguration` document requires an `ApplicationConfigurationSchema` document for validation purposes. For more information, see [What is AWS AppConfig ?](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-requires
   */
  readonly requires?: Array<CfnDocument.DocumentRequiresProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * AWS CloudFormation resource tags to apply to the document.
   *
   * Use tags to help you identify and categorize resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specify a target type to define the kinds of resources the document can run on.
   *
   * For example, to run a document on EC2 instances, specify the following value: `/AWS::EC2::Instance` . If you specify a value of '/' the document can run on all types of resources. If you don't specify a value, the document can't run on any resources. For a list of valid resource types, see [AWS resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) in the *AWS CloudFormation User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-targettype
   */
  readonly targetType?: string;

  /**
   * If the document resource you specify in your template already exists, this parameter determines whether a new version of the existing document is created, or the existing document is replaced.
   *
   * `Replace` is the default method. If you specify `NewVersion` for the `UpdateMethod` parameter, and the `Name` of the document does not match an existing resource, a new document is created. When you specify `NewVersion` , the default version of the document is changed to the newly created version.
   *
   * @default - "Replace"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-updatemethod
   */
  readonly updateMethod?: string;

  /**
   * An optional field specifying the version of the artifact you are creating with the document.
   *
   * For example, `Release12.1` . This value is unique across all versions of a document, and can't be changed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-versionname
   */
  readonly versionName?: string;
}

/**
 * Determine whether the given properties match those of a `DocumentRequiresProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentRequiresProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentDocumentRequiresPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"DocumentRequiresProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentDocumentRequiresPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentDocumentRequiresPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnDocumentDocumentRequiresPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocument.DocumentRequiresProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocument.DocumentRequiresProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AttachmentsSourceProperty`
 *
 * @param properties - the TypeScript properties of a `AttachmentsSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentAttachmentsSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"AttachmentsSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentAttachmentsSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentAttachmentsSourcePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnDocumentAttachmentsSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocument.AttachmentsSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocument.AttachmentsSourceProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDocumentProps`
 *
 * @param properties - the TypeScript properties of a `CfnDocumentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachments", cdk.listValidator(CfnDocumentAttachmentsSourcePropertyValidator))(properties.attachments));
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", cdk.validateObject)(properties.content));
  errors.collect(cdk.propertyValidator("documentFormat", cdk.validateString)(properties.documentFormat));
  errors.collect(cdk.propertyValidator("documentType", cdk.validateString)(properties.documentType));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("requires", cdk.listValidator(CfnDocumentDocumentRequiresPropertyValidator))(properties.requires));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetType", cdk.validateString)(properties.targetType));
  errors.collect(cdk.propertyValidator("updateMethod", cdk.validateString)(properties.updateMethod));
  errors.collect(cdk.propertyValidator("versionName", cdk.validateString)(properties.versionName));
  return errors.wrap("supplied properties not correct for \"CfnDocumentProps\"");
}

// @ts-ignore TS6133
function convertCfnDocumentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentPropsValidator(properties).assertSuccess();
  return {
    "Attachments": cdk.listMapper(convertCfnDocumentAttachmentsSourcePropertyToCloudFormation)(properties.attachments),
    "Content": cdk.objectToCloudFormation(properties.content),
    "DocumentFormat": cdk.stringToCloudFormation(properties.documentFormat),
    "DocumentType": cdk.stringToCloudFormation(properties.documentType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Requires": cdk.listMapper(convertCfnDocumentDocumentRequiresPropertyToCloudFormation)(properties.requires),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetType": cdk.stringToCloudFormation(properties.targetType),
    "UpdateMethod": cdk.stringToCloudFormation(properties.updateMethod),
    "VersionName": cdk.stringToCloudFormation(properties.versionName)
  };
}

// @ts-ignore TS6133
function CfnDocumentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentProps>();
  ret.addPropertyResult("attachments", "Attachments", (properties.Attachments != null ? cfn_parse.FromCloudFormation.getArray(CfnDocumentAttachmentsSourcePropertyFromCloudFormation)(properties.Attachments) : undefined));
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getAny(properties.Content) : undefined));
  ret.addPropertyResult("documentFormat", "DocumentFormat", (properties.DocumentFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentFormat) : undefined));
  ret.addPropertyResult("documentType", "DocumentType", (properties.DocumentType != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("requires", "Requires", (properties.Requires != null ? cfn_parse.FromCloudFormation.getArray(CfnDocumentDocumentRequiresPropertyFromCloudFormation)(properties.Requires) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetType", "TargetType", (properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined));
  ret.addPropertyResult("updateMethod", "UpdateMethod", (properties.UpdateMethod != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateMethod) : undefined));
  ret.addPropertyResult("versionName", "VersionName", (properties.VersionName != null ? cfn_parse.FromCloudFormation.getString(properties.VersionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSM::MaintenanceWindow` resource represents general information about a maintenance window for AWS Systems Manager .
 *
 * Maintenance Windows let you define a schedule for when to perform potentially disruptive actions on your instances, such as patching an operating system (OS), updating drivers, or installing software. Each maintenance window has a schedule, a duration, a set of registered targets, and a set of registered tasks.
 *
 * For more information, see [Systems Manager Maintenance Windows](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-maintenance.html) in the *AWS Systems Manager User Guide* and [CreateMaintenanceWindow](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_CreateMaintenanceWindow.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::MaintenanceWindow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html
 */
export class CfnMaintenanceWindow extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::MaintenanceWindow";

  /**
   * Build a CfnMaintenanceWindow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMaintenanceWindow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMaintenanceWindowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMaintenanceWindow(scope, id, propsResult.value);
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
   * Enables a maintenance window task to run on managed instances, even if you have not registered those instances as targets.
   */
  public allowUnassociatedTargets: boolean | cdk.IResolvable;

  /**
   * The number of hours before the end of the maintenance window that AWS Systems Manager stops scheduling new tasks for execution.
   */
  public cutoff: number;

  /**
   * A description of the maintenance window.
   */
  public description?: string;

  /**
   * The duration of the maintenance window in hours.
   */
  public duration: number;

  /**
   * The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become inactive.
   */
  public endDate?: string;

  /**
   * The name of the maintenance window.
   */
  public name: string;

  /**
   * The schedule of the maintenance window in the form of a cron or rate expression.
   */
  public schedule: string;

  /**
   * The number of days to wait to run a maintenance window after the scheduled cron expression date and time.
   */
  public scheduleOffset?: number;

  /**
   * The time zone that the scheduled maintenance window executions are based on, in Internet Assigned Numbers Authority (IANA) format.
   */
  public scheduleTimezone?: string;

  /**
   * The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become active.
   */
  public startDate?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you assign to a resource in the form of an arbitrary set of tags (key-value pairs).
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMaintenanceWindowProps) {
    super(scope, id, {
      "type": CfnMaintenanceWindow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "allowUnassociatedTargets", this);
    cdk.requireProperty(props, "cutoff", this);
    cdk.requireProperty(props, "duration", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "schedule", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.allowUnassociatedTargets = props.allowUnassociatedTargets;
    this.cutoff = props.cutoff;
    this.description = props.description;
    this.duration = props.duration;
    this.endDate = props.endDate;
    this.name = props.name;
    this.schedule = props.schedule;
    this.scheduleOffset = props.scheduleOffset;
    this.scheduleTimezone = props.scheduleTimezone;
    this.startDate = props.startDate;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSM::MaintenanceWindow", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowUnassociatedTargets": this.allowUnassociatedTargets,
      "cutoff": this.cutoff,
      "description": this.description,
      "duration": this.duration,
      "endDate": this.endDate,
      "name": this.name,
      "schedule": this.schedule,
      "scheduleOffset": this.scheduleOffset,
      "scheduleTimezone": this.scheduleTimezone,
      "startDate": this.startDate,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMaintenanceWindow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMaintenanceWindowPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnMaintenanceWindow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html
 */
export interface CfnMaintenanceWindowProps {
  /**
   * Enables a maintenance window task to run on managed instances, even if you have not registered those instances as targets.
   *
   * If enabled, then you must specify the unregistered instances (by instance ID) when you register a task with the maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-allowunassociatedtargets
   */
  readonly allowUnassociatedTargets: boolean | cdk.IResolvable;

  /**
   * The number of hours before the end of the maintenance window that AWS Systems Manager stops scheduling new tasks for execution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-cutoff
   */
  readonly cutoff: number;

  /**
   * A description of the maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-description
   */
  readonly description?: string;

  /**
   * The duration of the maintenance window in hours.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-duration
   */
  readonly duration: number;

  /**
   * The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become inactive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-enddate
   */
  readonly endDate?: string;

  /**
   * The name of the maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-name
   */
  readonly name: string;

  /**
   * The schedule of the maintenance window in the form of a cron or rate expression.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-schedule
   */
  readonly schedule: string;

  /**
   * The number of days to wait to run a maintenance window after the scheduled cron expression date and time.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-scheduleoffset
   */
  readonly scheduleOffset?: number;

  /**
   * The time zone that the scheduled maintenance window executions are based on, in Internet Assigned Numbers Authority (IANA) format.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-scheduletimezone
   */
  readonly scheduleTimezone?: string;

  /**
   * The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become active.
   *
   * StartDate allows you to delay activation of the Maintenance Window until the specified future date.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-startdate
   */
  readonly startDate?: string;

  /**
   * Optional metadata that you assign to a resource in the form of an arbitrary set of tags (key-value pairs).
   *
   * Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a maintenance window to identify the type of tasks it will run, the types of targets, and the environment it will run in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnMaintenanceWindowProps`
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowUnassociatedTargets", cdk.requiredValidator)(properties.allowUnassociatedTargets));
  errors.collect(cdk.propertyValidator("allowUnassociatedTargets", cdk.validateBoolean)(properties.allowUnassociatedTargets));
  errors.collect(cdk.propertyValidator("cutoff", cdk.requiredValidator)(properties.cutoff));
  errors.collect(cdk.propertyValidator("cutoff", cdk.validateNumber)(properties.cutoff));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("duration", cdk.requiredValidator)(properties.duration));
  errors.collect(cdk.propertyValidator("duration", cdk.validateNumber)(properties.duration));
  errors.collect(cdk.propertyValidator("endDate", cdk.validateString)(properties.endDate));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("schedule", cdk.requiredValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("schedule", cdk.validateString)(properties.schedule));
  errors.collect(cdk.propertyValidator("scheduleOffset", cdk.validateNumber)(properties.scheduleOffset));
  errors.collect(cdk.propertyValidator("scheduleTimezone", cdk.validateString)(properties.scheduleTimezone));
  errors.collect(cdk.propertyValidator("startDate", cdk.validateString)(properties.startDate));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnMaintenanceWindowProps\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowPropsValidator(properties).assertSuccess();
  return {
    "AllowUnassociatedTargets": cdk.booleanToCloudFormation(properties.allowUnassociatedTargets),
    "Cutoff": cdk.numberToCloudFormation(properties.cutoff),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Duration": cdk.numberToCloudFormation(properties.duration),
    "EndDate": cdk.stringToCloudFormation(properties.endDate),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Schedule": cdk.stringToCloudFormation(properties.schedule),
    "ScheduleOffset": cdk.numberToCloudFormation(properties.scheduleOffset),
    "ScheduleTimezone": cdk.stringToCloudFormation(properties.scheduleTimezone),
    "StartDate": cdk.stringToCloudFormation(properties.startDate),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowProps>();
  ret.addPropertyResult("allowUnassociatedTargets", "AllowUnassociatedTargets", (properties.AllowUnassociatedTargets != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowUnassociatedTargets) : undefined));
  ret.addPropertyResult("cutoff", "Cutoff", (properties.Cutoff != null ? cfn_parse.FromCloudFormation.getNumber(properties.Cutoff) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("duration", "Duration", (properties.Duration != null ? cfn_parse.FromCloudFormation.getNumber(properties.Duration) : undefined));
  ret.addPropertyResult("endDate", "EndDate", (properties.EndDate != null ? cfn_parse.FromCloudFormation.getString(properties.EndDate) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? cfn_parse.FromCloudFormation.getString(properties.Schedule) : undefined));
  ret.addPropertyResult("scheduleOffset", "ScheduleOffset", (properties.ScheduleOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleOffset) : undefined));
  ret.addPropertyResult("scheduleTimezone", "ScheduleTimezone", (properties.ScheduleTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleTimezone) : undefined));
  ret.addPropertyResult("startDate", "StartDate", (properties.StartDate != null ? cfn_parse.FromCloudFormation.getString(properties.StartDate) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSM::MaintenanceWindowTarget` resource registers a target with a maintenance window for AWS Systems Manager .
 *
 * For more information, see [RegisterTargetWithMaintenanceWindow](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_RegisterTargetWithMaintenanceWindow.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::MaintenanceWindowTarget
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html
 */
export class CfnMaintenanceWindowTarget extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::MaintenanceWindowTarget";

  /**
   * Build a CfnMaintenanceWindowTarget from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMaintenanceWindowTarget {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMaintenanceWindowTargetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMaintenanceWindowTarget(scope, id, propsResult.value);
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
   * A description for the target.
   */
  public description?: string;

  /**
   * The name for the maintenance window target.
   */
  public name?: string;

  /**
   * A user-provided value that will be included in any Amazon CloudWatch Events events that are raised while running tasks for these targets in this maintenance window.
   */
  public ownerInformation?: string;

  /**
   * The type of target that is being registered with the maintenance window.
   */
  public resourceType: string;

  /**
   * The targets to register with the maintenance window.
   */
  public targets: Array<cdk.IResolvable | CfnMaintenanceWindowTarget.TargetsProperty> | cdk.IResolvable;

  /**
   * The ID of the maintenance window to register the target with.
   */
  public windowId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMaintenanceWindowTargetProps) {
    super(scope, id, {
      "type": CfnMaintenanceWindowTarget.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourceType", this);
    cdk.requireProperty(props, "targets", this);
    cdk.requireProperty(props, "windowId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.ownerInformation = props.ownerInformation;
    this.resourceType = props.resourceType;
    this.targets = props.targets;
    this.windowId = props.windowId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "ownerInformation": this.ownerInformation,
      "resourceType": this.resourceType,
      "targets": this.targets,
      "windowId": this.windowId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMaintenanceWindowTarget.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMaintenanceWindowTargetPropsToCloudFormation(props);
  }
}

export namespace CfnMaintenanceWindowTarget {
  /**
   * The `Targets` property type specifies adding a target to a maintenance window target in AWS Systems Manager .
   *
   * `Targets` is a property of the [AWS::SSM::MaintenanceWindowTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtarget-targets.html
   */
  export interface TargetsProperty {
    /**
     * User-defined criteria for sending commands that target managed nodes that meet the criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtarget-targets.html#cfn-ssm-maintenancewindowtarget-targets-key
     */
    readonly key: string;

    /**
     * User-defined criteria that maps to `Key` .
     *
     * For example, if you specified `tag:ServerRole` , you could specify `value:WebServer` to run a command on instances that include EC2 tags of `ServerRole,WebServer` .
     *
     * Depending on the type of target, the maximum number of values for a key might be lower than the global maximum of 50.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtarget-targets.html#cfn-ssm-maintenancewindowtarget-targets-values
     */
    readonly values: Array<string>;
  }
}

/**
 * Properties for defining a `CfnMaintenanceWindowTarget`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html
 */
export interface CfnMaintenanceWindowTargetProps {
  /**
   * A description for the target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-description
   */
  readonly description?: string;

  /**
   * The name for the maintenance window target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-name
   */
  readonly name?: string;

  /**
   * A user-provided value that will be included in any Amazon CloudWatch Events events that are raised while running tasks for these targets in this maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-ownerinformation
   */
  readonly ownerInformation?: string;

  /**
   * The type of target that is being registered with the maintenance window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-resourcetype
   */
  readonly resourceType: string;

  /**
   * The targets to register with the maintenance window.
   *
   * In other words, the instances to run commands on when the maintenance window runs.
   *
   * You must specify targets by using the `WindowTargetIds` parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-targets
   */
  readonly targets: Array<cdk.IResolvable | CfnMaintenanceWindowTarget.TargetsProperty> | cdk.IResolvable;

  /**
   * The ID of the maintenance window to register the target with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-windowid
   */
  readonly windowId: string;
}

/**
 * Determine whether the given properties match those of a `TargetsProperty`
 *
 * @param properties - the TypeScript properties of a `TargetsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTargetTargetsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"TargetsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTargetTargetsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTargetTargetsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTargetTargetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTarget.TargetsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTarget.TargetsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMaintenanceWindowTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowTargetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTargetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("ownerInformation", cdk.validateString)(properties.ownerInformation));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("targets", cdk.requiredValidator)(properties.targets));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnMaintenanceWindowTargetTargetsPropertyValidator))(properties.targets));
  errors.collect(cdk.propertyValidator("windowId", cdk.requiredValidator)(properties.windowId));
  errors.collect(cdk.propertyValidator("windowId", cdk.validateString)(properties.windowId));
  return errors.wrap("supplied properties not correct for \"CfnMaintenanceWindowTargetProps\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTargetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTargetPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OwnerInformation": cdk.stringToCloudFormation(properties.ownerInformation),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "Targets": cdk.listMapper(convertCfnMaintenanceWindowTargetTargetsPropertyToCloudFormation)(properties.targets),
    "WindowId": cdk.stringToCloudFormation(properties.windowId)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTargetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTargetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTargetProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("ownerInformation", "OwnerInformation", (properties.OwnerInformation != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerInformation) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnMaintenanceWindowTargetTargetsPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addPropertyResult("windowId", "WindowId", (properties.WindowId != null ? cfn_parse.FromCloudFormation.getString(properties.WindowId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSM::MaintenanceWindowTask` resource defines information about a task for an AWS Systems Manager maintenance window.
 *
 * For more information, see [RegisterTaskWithMaintenanceWindow](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_RegisterTaskWithMaintenanceWindow.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::MaintenanceWindowTask
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html
 */
export class CfnMaintenanceWindowTask extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::MaintenanceWindowTask";

  /**
   * Build a CfnMaintenanceWindowTask from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMaintenanceWindowTask {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMaintenanceWindowTaskPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMaintenanceWindowTask(scope, id, propsResult.value);
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
   * The specification for whether tasks should continue to run after the cutoff time specified in the maintenance windows is reached.
   */
  public cutoffBehavior?: string;

  /**
   * A description of the task.
   */
  public description?: string;

  /**
   * Information about an Amazon S3 bucket to write Run Command task-level logs to.
   */
  public loggingInfo?: cdk.IResolvable | CfnMaintenanceWindowTask.LoggingInfoProperty;

  /**
   * The maximum number of targets this task can be run for, in parallel.
   */
  public maxConcurrency?: string;

  /**
   * The maximum number of errors allowed before this task stops being scheduled.
   */
  public maxErrors?: string;

  /**
   * The task name.
   */
  public name?: string;

  /**
   * The priority of the task in the maintenance window.
   */
  public priority: number;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) service role to use to publish Amazon Simple Notification Service (Amazon SNS) notifications for maintenance window Run Command tasks.
   */
  public serviceRoleArn?: string;

  /**
   * The targets, either instances or window target IDs.
   */
  public targets?: Array<cdk.IResolvable | CfnMaintenanceWindowTask.TargetProperty> | cdk.IResolvable;

  /**
   * The resource that the task uses during execution.
   */
  public taskArn: string;

  /**
   * The parameters to pass to the task when it runs.
   */
  public taskInvocationParameters?: cdk.IResolvable | CfnMaintenanceWindowTask.TaskInvocationParametersProperty;

  /**
   * The parameters to pass to the task when it runs.
   */
  public taskParameters?: any | cdk.IResolvable;

  /**
   * The type of task.
   */
  public taskType: string;

  /**
   * The ID of the maintenance window where the task is registered.
   */
  public windowId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMaintenanceWindowTaskProps) {
    super(scope, id, {
      "type": CfnMaintenanceWindowTask.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "priority", this);
    cdk.requireProperty(props, "taskArn", this);
    cdk.requireProperty(props, "taskType", this);
    cdk.requireProperty(props, "windowId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.cutoffBehavior = props.cutoffBehavior;
    this.description = props.description;
    this.loggingInfo = props.loggingInfo;
    this.maxConcurrency = props.maxConcurrency;
    this.maxErrors = props.maxErrors;
    this.name = props.name;
    this.priority = props.priority;
    this.serviceRoleArn = props.serviceRoleArn;
    this.targets = props.targets;
    this.taskArn = props.taskArn;
    this.taskInvocationParameters = props.taskInvocationParameters;
    this.taskParameters = props.taskParameters;
    this.taskType = props.taskType;
    this.windowId = props.windowId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cutoffBehavior": this.cutoffBehavior,
      "description": this.description,
      "loggingInfo": this.loggingInfo,
      "maxConcurrency": this.maxConcurrency,
      "maxErrors": this.maxErrors,
      "name": this.name,
      "priority": this.priority,
      "serviceRoleArn": this.serviceRoleArn,
      "targets": this.targets,
      "taskArn": this.taskArn,
      "taskInvocationParameters": this.taskInvocationParameters,
      "taskParameters": this.taskParameters,
      "taskType": this.taskType,
      "windowId": this.windowId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMaintenanceWindowTask.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMaintenanceWindowTaskPropsToCloudFormation(props);
  }
}

export namespace CfnMaintenanceWindowTask {
  /**
   * The `Target` property type specifies targets (either instances or window target IDs).
   *
   * You specify instances by using `Key=InstanceIds,Values=< *instanceid1* >,< *instanceid2* >` . You specify window target IDs using `Key=WindowTargetIds,Values=< *window-target-id-1* >,< *window-target-id-2* >` for a maintenance window task in AWS Systems Manager .
   *
   * `Target` is a property of the [AWS::SSM::MaintenanceWindowTask](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html) property type.
   *
   * > To use `resource-groups:Name` as the key for a maintenance window target, specify the resource group as a `AWS::SSM::MaintenanceWindowTarget` type, and use the `Ref` function to specify the target for `AWS::SSM::MaintenanceWindowTask` . For an example, see *Create a Run Command task that targets instances using a resource group name* in [AWS::SSM::MaintenanceWindowTask Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#aws-resource-ssm-maintenancewindowtask--examples) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html
   */
  export interface TargetProperty {
    /**
     * User-defined criteria for sending commands that target instances that meet the criteria.
     *
     * `Key` can be `InstanceIds` or `WindowTargetIds` . For more information about how to target instances within a maintenance window task, see [About 'register-task-with-maintenance-window' Options and Values](https://docs.aws.amazon.com/systems-manager/latest/userguide/register-tasks-options.html) in the *AWS Systems Manager User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html#cfn-ssm-maintenancewindowtask-target-key
     */
    readonly key: string;

    /**
     * User-defined criteria that maps to `Key` .
     *
     * For example, if you specify `InstanceIds` , you can specify `i-1234567890abcdef0,i-9876543210abcdef0` to run a command on two EC2 instances. For more information about how to target instances within a maintenance window task, see [About 'register-task-with-maintenance-window' Options and Values](https://docs.aws.amazon.com/systems-manager/latest/userguide/register-tasks-options.html) in the *AWS Systems Manager User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html#cfn-ssm-maintenancewindowtask-target-values
     */
    readonly values: Array<string>;
  }

  /**
   * The `TaskInvocationParameters` property type specifies the task execution parameters for a maintenance window task in AWS Systems Manager .
   *
   * `TaskInvocationParameters` is a property of the [AWS::SSM::MaintenanceWindowTask](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html
   */
  export interface TaskInvocationParametersProperty {
    /**
     * The parameters for an `AUTOMATION` task type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowautomationparameters
     */
    readonly maintenanceWindowAutomationParameters?: cdk.IResolvable | CfnMaintenanceWindowTask.MaintenanceWindowAutomationParametersProperty;

    /**
     * The parameters for a `LAMBDA` task type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowlambdaparameters
     */
    readonly maintenanceWindowLambdaParameters?: cdk.IResolvable | CfnMaintenanceWindowTask.MaintenanceWindowLambdaParametersProperty;

    /**
     * The parameters for a `RUN_COMMAND` task type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowruncommandparameters
     */
    readonly maintenanceWindowRunCommandParameters?: cdk.IResolvable | CfnMaintenanceWindowTask.MaintenanceWindowRunCommandParametersProperty;

    /**
     * The parameters for a `STEP_FUNCTIONS` task type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowstepfunctionsparameters
     */
    readonly maintenanceWindowStepFunctionsParameters?: cdk.IResolvable | CfnMaintenanceWindowTask.MaintenanceWindowStepFunctionsParametersProperty;
  }

  /**
   * The `MaintenanceWindowRunCommandParameters` property type specifies the parameters for a `RUN_COMMAND` task type for a maintenance window task in AWS Systems Manager .
   *
   * This means that these parameters are the same as those for the `SendCommand` API call. For more information about `SendCommand` parameters, see [SendCommand](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_SendCommand.html) in the *AWS Systems Manager API Reference* .
   *
   * For information about available parameters in SSM Command documents, you can view the content of the document itself in the Systems Manager console. For information, see [Viewing SSM command document content](https://docs.aws.amazon.com/systems-manager/latest/userguide/viewing-ssm-document-content.html) in the *AWS Systems Manager User Guide* .
   *
   * `MaintenanceWindowRunCommandParameters` is a property of the [TaskInvocationParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html
   */
  export interface MaintenanceWindowRunCommandParametersProperty {
    /**
     * Configuration options for sending command output to Amazon CloudWatch Logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-cloudwatchoutputconfig
     */
    readonly cloudWatchOutputConfig?: CfnMaintenanceWindowTask.CloudWatchOutputConfigProperty | cdk.IResolvable;

    /**
     * Information about the command or commands to run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-comment
     */
    readonly comment?: string;

    /**
     * The SHA-256 or SHA-1 hash created by the system when the document was created.
     *
     * SHA-1 hashes have been deprecated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-documenthash
     */
    readonly documentHash?: string;

    /**
     * The SHA-256 or SHA-1 hash type.
     *
     * SHA-1 hashes are deprecated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-documenthashtype
     */
    readonly documentHashType?: string;

    /**
     * The AWS Systems Manager document (SSM document) version to use in the request.
     *
     * You can specify `$DEFAULT` , `$LATEST` , or a specific version number. If you run commands by using the AWS CLI, then you must escape the first two options by using a backslash. If you specify a version number, then you don't need to use the backslash. For example:
     *
     * `--document-version "\$DEFAULT"`
     *
     * `--document-version "\$LATEST"`
     *
     * `--document-version "3"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-documentversion
     */
    readonly documentVersion?: string;

    /**
     * Configurations for sending notifications about command status changes on a per-managed node basis.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-notificationconfig
     */
    readonly notificationConfig?: cdk.IResolvable | CfnMaintenanceWindowTask.NotificationConfigProperty;

    /**
     * The name of the Amazon Simple Storage Service (Amazon S3) bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-outputs3bucketname
     */
    readonly outputS3BucketName?: string;

    /**
     * The S3 bucket subfolder.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-outputs3keyprefix
     */
    readonly outputS3KeyPrefix?: string;

    /**
     * The parameters for the `RUN_COMMAND` task execution.
     *
     * The supported parameters are the same as those for the `SendCommand` API call. For more information, see [SendCommand](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_SendCommand.html) in the *AWS Systems Manager API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) service role to use to publish Amazon Simple Notification Service (Amazon SNS) notifications for maintenance window Run Command tasks.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-servicerolearn
     */
    readonly serviceRoleArn?: string;

    /**
     * If this time is reached and the command hasn't already started running, it doesn't run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-timeoutseconds
     */
    readonly timeoutSeconds?: number;
  }

  /**
   * Configuration options for sending command output to Amazon CloudWatch Logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-cloudwatchoutputconfig.html
   */
  export interface CloudWatchOutputConfigProperty {
    /**
     * The name of the CloudWatch Logs log group where you want to send command output.
     *
     * If you don't specify a group name, AWS Systems Manager automatically creates a log group for you. The log group uses the following naming format:
     *
     * `aws/ssm/ *SystemsManagerDocumentName*`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-cloudwatchoutputconfig.html#cfn-ssm-maintenancewindowtask-cloudwatchoutputconfig-cloudwatchloggroupname
     */
    readonly cloudWatchLogGroupName?: string;

    /**
     * Enables Systems Manager to send command output to CloudWatch Logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-cloudwatchoutputconfig.html#cfn-ssm-maintenancewindowtask-cloudwatchoutputconfig-cloudwatchoutputenabled
     */
    readonly cloudWatchOutputEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * The `NotificationConfig` property type specifies configurations for sending notifications for a maintenance window task in AWS Systems Manager .
   *
   * `NotificationConfig` is a property of the [MaintenanceWindowRunCommandParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html
   */
  export interface NotificationConfigProperty {
    /**
     * An Amazon Resource Name (ARN) for an Amazon Simple Notification Service (Amazon SNS) topic.
     *
     * Run Command pushes notifications about command status changes to this topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationarn
     */
    readonly notificationArn: string;

    /**
     * The different events that you can receive notifications for.
     *
     * These events include the following: `All` (events), `InProgress` , `Success` , `TimedOut` , `Cancelled` , `Failed` . To learn more about these events, see [Configuring Amazon SNS Notifications for AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-sns-notifications.html) in the *AWS Systems Manager User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationevents
     */
    readonly notificationEvents?: Array<string>;

    /**
     * The notification type.
     *
     * - `Command` : Receive notification when the status of a command changes.
     * - `Invocation` : For commands sent to multiple instances, receive notification on a per-instance basis when the status of a command changes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationtype
     */
    readonly notificationType?: string;
  }

  /**
   * The `MaintenanceWindowAutomationParameters` property type specifies the parameters for an `AUTOMATION` task type for a maintenance window task in AWS Systems Manager .
   *
   * `MaintenanceWindowAutomationParameters` is a property of the [TaskInvocationParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html) property type.
   *
   * For information about available parameters in Automation runbooks, you can view the content of the runbook itself in the Systems Manager console. For information, see [View runbook content](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents-reference-details.html#view-automation-json) in the *AWS Systems Manager User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html
   */
  export interface MaintenanceWindowAutomationParametersProperty {
    /**
     * The version of an Automation runbook to use during task execution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowautomationparameters-documentversion
     */
    readonly documentVersion?: string;

    /**
     * The parameters for the AUTOMATION task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowautomationparameters-parameters
     */
    readonly parameters?: any | cdk.IResolvable;
  }

  /**
   * The `MaintenanceWindowStepFunctionsParameters` property type specifies the parameters for the execution of a `STEP_FUNCTIONS` task in a Systems Manager maintenance window.
   *
   * `MaintenanceWindowStepFunctionsParameters` is a property of the [TaskInvocationParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters.html
   */
  export interface MaintenanceWindowStepFunctionsParametersProperty {
    /**
     * The inputs for the `STEP_FUNCTIONS` task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters-input
     */
    readonly input?: string;

    /**
     * The name of the `STEP_FUNCTIONS` task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters-name
     */
    readonly name?: string;
  }

  /**
   * The `MaintenanceWindowLambdaParameters` property type specifies the parameters for a `LAMBDA` task type for a maintenance window task in AWS Systems Manager .
   *
   * `MaintenanceWindowLambdaParameters` is a property of the [TaskInvocationParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html
   */
  export interface MaintenanceWindowLambdaParametersProperty {
    /**
     * Client-specific information to pass to the AWS Lambda function that you're invoking.
     *
     * You can then use the `context` variable to process the client information in your AWS Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-clientcontext
     */
    readonly clientContext?: string;

    /**
     * JSON to provide to your AWS Lambda function as input.
     *
     * > Although `Type` is listed as "String" for this property, the payload content must be formatted as a Base64-encoded binary data object.
     *
     * *Length Constraint:* 4096
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-payload
     */
    readonly payload?: string;

    /**
     * An AWS Lambda function version or alias name.
     *
     * If you specify a function version, the action uses the qualified function Amazon Resource Name (ARN) to invoke a specific Lambda function. If you specify an alias name, the action uses the alias ARN to invoke the Lambda function version that the alias points to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-qualifier
     */
    readonly qualifier?: string;
  }

  /**
   * The `LoggingInfo` property type specifies information about the Amazon S3 bucket to write instance-level logs to.
   *
   * `LoggingInfo` is a property of the [AWS::SSM::MaintenanceWindowTask](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html) resource.
   *
   * > `LoggingInfo` has been deprecated. To specify an Amazon S3 bucket to contain logs, instead use the `OutputS3BucketName` and `OutputS3KeyPrefix` options in the `TaskInvocationParameters` structure. For information about how Systems Manager handles these options for the supported maintenance window task types, see [AWS ::SSM::MaintenanceWindowTask MaintenanceWindowRunCommandParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html
   */
  export interface LoggingInfoProperty {
    /**
     * The AWS Region where the S3 bucket is located.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-region
     */
    readonly region: string;

    /**
     * The name of an S3 bucket where execution logs are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The Amazon S3 bucket subfolder.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-s3prefix
     */
    readonly s3Prefix?: string;
  }
}

/**
 * Properties for defining a `CfnMaintenanceWindowTask`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html
 */
export interface CfnMaintenanceWindowTaskProps {
  /**
   * The specification for whether tasks should continue to run after the cutoff time specified in the maintenance windows is reached.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-cutoffbehavior
   */
  readonly cutoffBehavior?: string;

  /**
   * A description of the task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-description
   */
  readonly description?: string;

  /**
   * Information about an Amazon S3 bucket to write Run Command task-level logs to.
   *
   * > `LoggingInfo` has been deprecated. To specify an Amazon S3 bucket to contain logs for Run Command tasks, instead use the `OutputS3BucketName` and `OutputS3KeyPrefix` options in the `TaskInvocationParameters` structure. For information about how Systems Manager handles these options for the supported maintenance window task types, see [AWS ::SSM::MaintenanceWindowTask MaintenanceWindowRunCommandParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-logginginfo
   */
  readonly loggingInfo?: cdk.IResolvable | CfnMaintenanceWindowTask.LoggingInfoProperty;

  /**
   * The maximum number of targets this task can be run for, in parallel.
   *
   * > Although this element is listed as "Required: No", a value can be omitted only when you are registering or updating a [targetless task](https://docs.aws.amazon.com/systems-manager/latest/userguide/maintenance-windows-targetless-tasks.html) You must provide a value in all other cases.
   * >
   * > For maintenance window tasks without a target specified, you can't supply a value for this option. Instead, the system inserts a placeholder value of `1` . This value doesn't affect the running of your task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-maxconcurrency
   */
  readonly maxConcurrency?: string;

  /**
   * The maximum number of errors allowed before this task stops being scheduled.
   *
   * > Although this element is listed as "Required: No", a value can be omitted only when you are registering or updating a [targetless task](https://docs.aws.amazon.com/systems-manager/latest/userguide/maintenance-windows-targetless-tasks.html) You must provide a value in all other cases.
   * >
   * > For maintenance window tasks without a target specified, you can't supply a value for this option. Instead, the system inserts a placeholder value of `1` . This value doesn't affect the running of your task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-maxerrors
   */
  readonly maxErrors?: string;

  /**
   * The task name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-name
   */
  readonly name?: string;

  /**
   * The priority of the task in the maintenance window.
   *
   * The lower the number, the higher the priority. Tasks that have the same priority are scheduled in parallel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-priority
   */
  readonly priority: number;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) service role to use to publish Amazon Simple Notification Service (Amazon SNS) notifications for maintenance window Run Command tasks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-servicerolearn
   */
  readonly serviceRoleArn?: string;

  /**
   * The targets, either instances or window target IDs.
   *
   * - Specify instances using `Key=InstanceIds,Values= *instanceid1* , *instanceid2*` .
   * - Specify window target IDs using `Key=WindowTargetIds,Values= *window-target-id-1* , *window-target-id-2*` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-targets
   */
  readonly targets?: Array<cdk.IResolvable | CfnMaintenanceWindowTask.TargetProperty> | cdk.IResolvable;

  /**
   * The resource that the task uses during execution.
   *
   * For `RUN_COMMAND` and `AUTOMATION` task types, `TaskArn` is the SSM document name or Amazon Resource Name (ARN).
   *
   * For `LAMBDA` tasks, `TaskArn` is the function name or ARN.
   *
   * For `STEP_FUNCTIONS` tasks, `TaskArn` is the state machine ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskarn
   */
  readonly taskArn: string;

  /**
   * The parameters to pass to the task when it runs.
   *
   * Populate only the fields that match the task type. All other fields should be empty.
   *
   * > When you update a maintenance window task that has options specified in `TaskInvocationParameters` , you must provide again all the `TaskInvocationParameters` values that you want to retain. The values you do not specify again are removed. For example, suppose that when you registered a Run Command task, you specified `TaskInvocationParameters` values for `Comment` , `NotificationConfig` , and `OutputS3BucketName` . If you update the maintenance window task and specify only a different `OutputS3BucketName` value, the values for `Comment` and `NotificationConfig` are removed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters
   */
  readonly taskInvocationParameters?: cdk.IResolvable | CfnMaintenanceWindowTask.TaskInvocationParametersProperty;

  /**
   * The parameters to pass to the task when it runs.
   *
   * > `TaskParameters` has been deprecated. To specify parameters to pass to a task when it runs, instead use the `Parameters` option in the `TaskInvocationParameters` structure. For information about how Systems Manager handles these options for the supported maintenance window task types, see [MaintenanceWindowTaskInvocationParameters](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_MaintenanceWindowTaskInvocationParameters.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskparameters
   */
  readonly taskParameters?: any | cdk.IResolvable;

  /**
   * The type of task.
   *
   * Valid values: `RUN_COMMAND` , `AUTOMATION` , `LAMBDA` , `STEP_FUNCTIONS` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-tasktype
   */
  readonly taskType: string;

  /**
   * The ID of the maintenance window where the task is registered.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-windowid
   */
  readonly windowId: string;
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"TargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskTargetPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTask.TargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.TargetProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchOutputConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchOutputConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupName", cdk.validateString)(properties.cloudWatchLogGroupName));
  errors.collect(cdk.propertyValidator("cloudWatchOutputEnabled", cdk.validateBoolean)(properties.cloudWatchOutputEnabled));
  return errors.wrap("supplied properties not correct for \"CloudWatchOutputConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogGroupName": cdk.stringToCloudFormation(properties.cloudWatchLogGroupName),
    "CloudWatchOutputEnabled": cdk.booleanToCloudFormation(properties.cloudWatchOutputEnabled)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.CloudWatchOutputConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.CloudWatchOutputConfigProperty>();
  ret.addPropertyResult("cloudWatchLogGroupName", "CloudWatchLogGroupName", (properties.CloudWatchLogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupName) : undefined));
  ret.addPropertyResult("cloudWatchOutputEnabled", "CloudWatchOutputEnabled", (properties.CloudWatchOutputEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchOutputEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskNotificationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("notificationArn", cdk.requiredValidator)(properties.notificationArn));
  errors.collect(cdk.propertyValidator("notificationArn", cdk.validateString)(properties.notificationArn));
  errors.collect(cdk.propertyValidator("notificationEvents", cdk.listValidator(cdk.validateString))(properties.notificationEvents));
  errors.collect(cdk.propertyValidator("notificationType", cdk.validateString)(properties.notificationType));
  return errors.wrap("supplied properties not correct for \"NotificationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskNotificationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskNotificationConfigPropertyValidator(properties).assertSuccess();
  return {
    "NotificationArn": cdk.stringToCloudFormation(properties.notificationArn),
    "NotificationEvents": cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationEvents),
    "NotificationType": cdk.stringToCloudFormation(properties.notificationType)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskNotificationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTask.NotificationConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.NotificationConfigProperty>();
  ret.addPropertyResult("notificationArn", "NotificationArn", (properties.NotificationArn != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationArn) : undefined));
  ret.addPropertyResult("notificationEvents", "NotificationEvents", (properties.NotificationEvents != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotificationEvents) : undefined));
  ret.addPropertyResult("notificationType", "NotificationType", (properties.NotificationType != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowRunCommandParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowRunCommandParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchOutputConfig", CfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyValidator)(properties.cloudWatchOutputConfig));
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("documentHash", cdk.validateString)(properties.documentHash));
  errors.collect(cdk.propertyValidator("documentHashType", cdk.validateString)(properties.documentHashType));
  errors.collect(cdk.propertyValidator("documentVersion", cdk.validateString)(properties.documentVersion));
  errors.collect(cdk.propertyValidator("notificationConfig", CfnMaintenanceWindowTaskNotificationConfigPropertyValidator)(properties.notificationConfig));
  errors.collect(cdk.propertyValidator("outputS3BucketName", cdk.validateString)(properties.outputS3BucketName));
  errors.collect(cdk.propertyValidator("outputS3KeyPrefix", cdk.validateString)(properties.outputS3KeyPrefix));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.validateString)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("timeoutSeconds", cdk.validateNumber)(properties.timeoutSeconds));
  return errors.wrap("supplied properties not correct for \"MaintenanceWindowRunCommandParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchOutputConfig": convertCfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyToCloudFormation(properties.cloudWatchOutputConfig),
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "DocumentHash": cdk.stringToCloudFormation(properties.documentHash),
    "DocumentHashType": cdk.stringToCloudFormation(properties.documentHashType),
    "DocumentVersion": cdk.stringToCloudFormation(properties.documentVersion),
    "NotificationConfig": convertCfnMaintenanceWindowTaskNotificationConfigPropertyToCloudFormation(properties.notificationConfig),
    "OutputS3BucketName": cdk.stringToCloudFormation(properties.outputS3BucketName),
    "OutputS3KeyPrefix": cdk.stringToCloudFormation(properties.outputS3KeyPrefix),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "ServiceRoleArn": cdk.stringToCloudFormation(properties.serviceRoleArn),
    "TimeoutSeconds": cdk.numberToCloudFormation(properties.timeoutSeconds)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTask.MaintenanceWindowRunCommandParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.MaintenanceWindowRunCommandParametersProperty>();
  ret.addPropertyResult("cloudWatchOutputConfig", "CloudWatchOutputConfig", (properties.CloudWatchOutputConfig != null ? CfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyFromCloudFormation(properties.CloudWatchOutputConfig) : undefined));
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("documentHash", "DocumentHash", (properties.DocumentHash != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentHash) : undefined));
  ret.addPropertyResult("documentHashType", "DocumentHashType", (properties.DocumentHashType != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentHashType) : undefined));
  ret.addPropertyResult("documentVersion", "DocumentVersion", (properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined));
  ret.addPropertyResult("notificationConfig", "NotificationConfig", (properties.NotificationConfig != null ? CfnMaintenanceWindowTaskNotificationConfigPropertyFromCloudFormation(properties.NotificationConfig) : undefined));
  ret.addPropertyResult("outputS3BucketName", "OutputS3BucketName", (properties.OutputS3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3BucketName) : undefined));
  ret.addPropertyResult("outputS3KeyPrefix", "OutputS3KeyPrefix", (properties.OutputS3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3KeyPrefix) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("serviceRoleArn", "ServiceRoleArn", (properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined));
  ret.addPropertyResult("timeoutSeconds", "TimeoutSeconds", (properties.TimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowAutomationParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowAutomationParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentVersion", cdk.validateString)(properties.documentVersion));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  return errors.wrap("supplied properties not correct for \"MaintenanceWindowAutomationParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyValidator(properties).assertSuccess();
  return {
    "DocumentVersion": cdk.stringToCloudFormation(properties.documentVersion),
    "Parameters": cdk.objectToCloudFormation(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTask.MaintenanceWindowAutomationParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.MaintenanceWindowAutomationParametersProperty>();
  ret.addPropertyResult("documentVersion", "DocumentVersion", (properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowStepFunctionsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowStepFunctionsParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"MaintenanceWindowStepFunctionsParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyValidator(properties).assertSuccess();
  return {
    "Input": cdk.stringToCloudFormation(properties.input),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTask.MaintenanceWindowStepFunctionsParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.MaintenanceWindowStepFunctionsParametersProperty>();
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowLambdaParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowLambdaParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientContext", cdk.validateString)(properties.clientContext));
  errors.collect(cdk.propertyValidator("payload", cdk.validateString)(properties.payload));
  errors.collect(cdk.propertyValidator("qualifier", cdk.validateString)(properties.qualifier));
  return errors.wrap("supplied properties not correct for \"MaintenanceWindowLambdaParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyValidator(properties).assertSuccess();
  return {
    "ClientContext": cdk.stringToCloudFormation(properties.clientContext),
    "Payload": cdk.stringToCloudFormation(properties.payload),
    "Qualifier": cdk.stringToCloudFormation(properties.qualifier)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTask.MaintenanceWindowLambdaParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.MaintenanceWindowLambdaParametersProperty>();
  ret.addPropertyResult("clientContext", "ClientContext", (properties.ClientContext != null ? cfn_parse.FromCloudFormation.getString(properties.ClientContext) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? cfn_parse.FromCloudFormation.getString(properties.Payload) : undefined));
  ret.addPropertyResult("qualifier", "Qualifier", (properties.Qualifier != null ? cfn_parse.FromCloudFormation.getString(properties.Qualifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskInvocationParametersProperty`
 *
 * @param properties - the TypeScript properties of a `TaskInvocationParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskTaskInvocationParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maintenanceWindowAutomationParameters", CfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyValidator)(properties.maintenanceWindowAutomationParameters));
  errors.collect(cdk.propertyValidator("maintenanceWindowLambdaParameters", CfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyValidator)(properties.maintenanceWindowLambdaParameters));
  errors.collect(cdk.propertyValidator("maintenanceWindowRunCommandParameters", CfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyValidator)(properties.maintenanceWindowRunCommandParameters));
  errors.collect(cdk.propertyValidator("maintenanceWindowStepFunctionsParameters", CfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyValidator)(properties.maintenanceWindowStepFunctionsParameters));
  return errors.wrap("supplied properties not correct for \"TaskInvocationParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskTaskInvocationParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskTaskInvocationParametersPropertyValidator(properties).assertSuccess();
  return {
    "MaintenanceWindowAutomationParameters": convertCfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyToCloudFormation(properties.maintenanceWindowAutomationParameters),
    "MaintenanceWindowLambdaParameters": convertCfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyToCloudFormation(properties.maintenanceWindowLambdaParameters),
    "MaintenanceWindowRunCommandParameters": convertCfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyToCloudFormation(properties.maintenanceWindowRunCommandParameters),
    "MaintenanceWindowStepFunctionsParameters": convertCfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyToCloudFormation(properties.maintenanceWindowStepFunctionsParameters)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskTaskInvocationParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTask.TaskInvocationParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.TaskInvocationParametersProperty>();
  ret.addPropertyResult("maintenanceWindowAutomationParameters", "MaintenanceWindowAutomationParameters", (properties.MaintenanceWindowAutomationParameters != null ? CfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyFromCloudFormation(properties.MaintenanceWindowAutomationParameters) : undefined));
  ret.addPropertyResult("maintenanceWindowLambdaParameters", "MaintenanceWindowLambdaParameters", (properties.MaintenanceWindowLambdaParameters != null ? CfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyFromCloudFormation(properties.MaintenanceWindowLambdaParameters) : undefined));
  ret.addPropertyResult("maintenanceWindowRunCommandParameters", "MaintenanceWindowRunCommandParameters", (properties.MaintenanceWindowRunCommandParameters != null ? CfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyFromCloudFormation(properties.MaintenanceWindowRunCommandParameters) : undefined));
  ret.addPropertyResult("maintenanceWindowStepFunctionsParameters", "MaintenanceWindowStepFunctionsParameters", (properties.MaintenanceWindowStepFunctionsParameters != null ? CfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyFromCloudFormation(properties.MaintenanceWindowStepFunctionsParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingInfoProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskLoggingInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("region", cdk.requiredValidator)(properties.region));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Prefix", cdk.validateString)(properties.s3Prefix));
  return errors.wrap("supplied properties not correct for \"LoggingInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskLoggingInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskLoggingInfoPropertyValidator(properties).assertSuccess();
  return {
    "Region": cdk.stringToCloudFormation(properties.region),
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Prefix": cdk.stringToCloudFormation(properties.s3Prefix)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskLoggingInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMaintenanceWindowTask.LoggingInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.LoggingInfoProperty>();
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Prefix", "S3Prefix", (properties.S3Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMaintenanceWindowTaskProps`
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowTaskProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMaintenanceWindowTaskPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cutoffBehavior", cdk.validateString)(properties.cutoffBehavior));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("loggingInfo", CfnMaintenanceWindowTaskLoggingInfoPropertyValidator)(properties.loggingInfo));
  errors.collect(cdk.propertyValidator("maxConcurrency", cdk.validateString)(properties.maxConcurrency));
  errors.collect(cdk.propertyValidator("maxErrors", cdk.validateString)(properties.maxErrors));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.validateString)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnMaintenanceWindowTaskTargetPropertyValidator))(properties.targets));
  errors.collect(cdk.propertyValidator("taskArn", cdk.requiredValidator)(properties.taskArn));
  errors.collect(cdk.propertyValidator("taskArn", cdk.validateString)(properties.taskArn));
  errors.collect(cdk.propertyValidator("taskInvocationParameters", CfnMaintenanceWindowTaskTaskInvocationParametersPropertyValidator)(properties.taskInvocationParameters));
  errors.collect(cdk.propertyValidator("taskParameters", cdk.validateObject)(properties.taskParameters));
  errors.collect(cdk.propertyValidator("taskType", cdk.requiredValidator)(properties.taskType));
  errors.collect(cdk.propertyValidator("taskType", cdk.validateString)(properties.taskType));
  errors.collect(cdk.propertyValidator("windowId", cdk.requiredValidator)(properties.windowId));
  errors.collect(cdk.propertyValidator("windowId", cdk.validateString)(properties.windowId));
  return errors.wrap("supplied properties not correct for \"CfnMaintenanceWindowTaskProps\"");
}

// @ts-ignore TS6133
function convertCfnMaintenanceWindowTaskPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMaintenanceWindowTaskPropsValidator(properties).assertSuccess();
  return {
    "CutoffBehavior": cdk.stringToCloudFormation(properties.cutoffBehavior),
    "Description": cdk.stringToCloudFormation(properties.description),
    "LoggingInfo": convertCfnMaintenanceWindowTaskLoggingInfoPropertyToCloudFormation(properties.loggingInfo),
    "MaxConcurrency": cdk.stringToCloudFormation(properties.maxConcurrency),
    "MaxErrors": cdk.stringToCloudFormation(properties.maxErrors),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "ServiceRoleArn": cdk.stringToCloudFormation(properties.serviceRoleArn),
    "Targets": cdk.listMapper(convertCfnMaintenanceWindowTaskTargetPropertyToCloudFormation)(properties.targets),
    "TaskArn": cdk.stringToCloudFormation(properties.taskArn),
    "TaskInvocationParameters": convertCfnMaintenanceWindowTaskTaskInvocationParametersPropertyToCloudFormation(properties.taskInvocationParameters),
    "TaskParameters": cdk.objectToCloudFormation(properties.taskParameters),
    "TaskType": cdk.stringToCloudFormation(properties.taskType),
    "WindowId": cdk.stringToCloudFormation(properties.windowId)
  };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTaskProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTaskProps>();
  ret.addPropertyResult("cutoffBehavior", "CutoffBehavior", (properties.CutoffBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.CutoffBehavior) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("loggingInfo", "LoggingInfo", (properties.LoggingInfo != null ? CfnMaintenanceWindowTaskLoggingInfoPropertyFromCloudFormation(properties.LoggingInfo) : undefined));
  ret.addPropertyResult("maxConcurrency", "MaxConcurrency", (properties.MaxConcurrency != null ? cfn_parse.FromCloudFormation.getString(properties.MaxConcurrency) : undefined));
  ret.addPropertyResult("maxErrors", "MaxErrors", (properties.MaxErrors != null ? cfn_parse.FromCloudFormation.getString(properties.MaxErrors) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("serviceRoleArn", "ServiceRoleArn", (properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnMaintenanceWindowTaskTargetPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addPropertyResult("taskArn", "TaskArn", (properties.TaskArn != null ? cfn_parse.FromCloudFormation.getString(properties.TaskArn) : undefined));
  ret.addPropertyResult("taskInvocationParameters", "TaskInvocationParameters", (properties.TaskInvocationParameters != null ? CfnMaintenanceWindowTaskTaskInvocationParametersPropertyFromCloudFormation(properties.TaskInvocationParameters) : undefined));
  ret.addPropertyResult("taskParameters", "TaskParameters", (properties.TaskParameters != null ? cfn_parse.FromCloudFormation.getAny(properties.TaskParameters) : undefined));
  ret.addPropertyResult("taskType", "TaskType", (properties.TaskType != null ? cfn_parse.FromCloudFormation.getString(properties.TaskType) : undefined));
  ret.addPropertyResult("windowId", "WindowId", (properties.WindowId != null ? cfn_parse.FromCloudFormation.getString(properties.WindowId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSM::Parameter` resource creates an SSM parameter in AWS Systems Manager Parameter Store.
 *
 * > To create an SSM parameter, you must have the AWS Identity and Access Management ( IAM ) permissions `ssm:PutParameter` and `ssm:AddTagsToResource` . On stack creation, AWS CloudFormation adds the following three tags to the parameter: `aws:cloudformation:stack-name` , `aws:cloudformation:logical-id` , and `aws:cloudformation:stack-id` , in addition to any custom tags you specify.
 * >
 * > To add, update, or remove tags during stack update, you must have IAM permissions for both `ssm:AddTagsToResource` and `ssm:RemoveTagsFromResource` . For more information, see [Managing Access Using Policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/security-iam.html#security_iam_access-manage) in the *AWS Systems Manager User Guide* .
 *
 * For information about valid values for parameters, see [Requirements and Constraints for Parameter Names](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html#sysman-parameter-name-constraints) in the *AWS Systems Manager User Guide* and [PutParameter](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PutParameter.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::Parameter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html
 */
export class CfnParameter extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::Parameter";

  /**
   * Build a CfnParameter from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnParameter {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnParameterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnParameter(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the type of the parameter. Valid values are `String` or `StringList` .
   *
   * @cloudformationAttribute Type
   */
  public readonly attrType: string;

  /**
   * Returns the value of the parameter.
   *
   * @cloudformationAttribute Value
   */
  public readonly attrValue: string;

  /**
   * A regular expression used to validate the parameter value.
   */
  public allowedPattern?: string;

  /**
   * The data type of the parameter, such as `text` or `aws:ec2:image` .
   */
  public dataType?: string;

  /**
   * Information about the parameter.
   */
  public description?: string;

  /**
   * The name of the parameter.
   */
  public name?: string;

  /**
   * Information about the policies assigned to a parameter.
   */
  public policies?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you assign to a resource in the form of an arbitrary set of tags (key-value pairs).
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The parameter tier.
   */
  public tier?: string;

  /**
   * The type of parameter.
   */
  public type: string;

  /**
   * The parameter value.
   */
  public value: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnParameterProps) {
    super(scope, id, {
      "type": CfnParameter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "type", this);
    cdk.requireProperty(props, "value", this);

    this.attrType = cdk.Token.asString(this.getAtt("Type", cdk.ResolutionTypeHint.STRING));
    this.attrValue = cdk.Token.asString(this.getAtt("Value", cdk.ResolutionTypeHint.STRING));
    this.allowedPattern = props.allowedPattern;
    this.dataType = props.dataType;
    this.description = props.description;
    this.name = props.name;
    this.policies = props.policies;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::SSM::Parameter", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tier = props.tier;
    this.type = props.type;
    this.value = props.value;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowedPattern": this.allowedPattern,
      "dataType": this.dataType,
      "description": this.description,
      "name": this.name,
      "policies": this.policies,
      "tags": this.tags.renderTags(),
      "tier": this.tier,
      "type": this.type,
      "value": this.value
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnParameter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnParameterPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnParameter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html
 */
export interface CfnParameterProps {
  /**
   * A regular expression used to validate the parameter value.
   *
   * For example, for String types with values restricted to numbers, you can specify the following: `AllowedPattern=^\d+$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-allowedpattern
   */
  readonly allowedPattern?: string;

  /**
   * The data type of the parameter, such as `text` or `aws:ec2:image` .
   *
   * The default is `text` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-datatype
   */
  readonly dataType?: string;

  /**
   * Information about the parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-description
   */
  readonly description?: string;

  /**
   * The name of the parameter.
   *
   * > The maximum length constraint listed below includes capacity for additional system attributes that aren't part of the name. The maximum length for a parameter name, including the full length of the parameter ARN, is 1011 characters. For example, the length of the following parameter name is 65 characters, not 20 characters: `arn:aws:ssm:us-east-2:111222333444:parameter/ExampleParameterName`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-name
   */
  readonly name?: string;

  /**
   * Information about the policies assigned to a parameter.
   *
   * [Assigning parameter policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-policies.html) in the *AWS Systems Manager User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-policies
   */
  readonly policies?: string;

  /**
   * Optional metadata that you assign to a resource in the form of an arbitrary set of tags (key-value pairs).
   *
   * Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a Systems Manager parameter to identify the type of resource to which it applies, the environment, or the type of configuration data referenced by the parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The parameter tier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-tier
   */
  readonly tier?: string;

  /**
   * The type of parameter.
   *
   * > Although `SecureString` is included in the list of valid values, AWS CloudFormation does *not* currently support creating a `SecureString` parameter type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-type
   */
  readonly type: string;

  /**
   * The parameter value.
   *
   * > If type is `StringList` , the system returns a comma-separated string with no spaces between commas in the `Value` field.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-value
   */
  readonly value: string;
}

/**
 * Determine whether the given properties match those of a `CfnParameterProps`
 *
 * @param properties - the TypeScript properties of a `CfnParameterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnParameterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedPattern", cdk.validateString)(properties.allowedPattern));
  errors.collect(cdk.propertyValidator("dataType", cdk.validateString)(properties.dataType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policies", cdk.validateString)(properties.policies));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("tier", cdk.validateString)(properties.tier));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"CfnParameterProps\"");
}

// @ts-ignore TS6133
function convertCfnParameterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnParameterPropsValidator(properties).assertSuccess();
  return {
    "AllowedPattern": cdk.stringToCloudFormation(properties.allowedPattern),
    "DataType": cdk.stringToCloudFormation(properties.dataType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Policies": cdk.stringToCloudFormation(properties.policies),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Tier": cdk.stringToCloudFormation(properties.tier),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnParameterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnParameterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnParameterProps>();
  ret.addPropertyResult("allowedPattern", "AllowedPattern", (properties.AllowedPattern != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedPattern) : undefined));
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policies", "Policies", (properties.Policies != null ? cfn_parse.FromCloudFormation.getString(properties.Policies) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("tier", "Tier", (properties.Tier != null ? cfn_parse.FromCloudFormation.getString(properties.Tier) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSM::PatchBaseline` resource defines the basic information for an AWS Systems Manager patch baseline.
 *
 * A patch baseline defines which patches are approved for installation on your instances.
 *
 * For more information, see [CreatePatchBaseline](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_CreatePatchBaseline.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::PatchBaseline
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html
 */
export class CfnPatchBaseline extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::PatchBaseline";

  /**
   * Build a CfnPatchBaseline from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPatchBaseline {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPatchBaselinePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPatchBaseline(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the patch baseline.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A set of rules used to include patches in the baseline.
   */
  public approvalRules?: cdk.IResolvable | CfnPatchBaseline.RuleGroupProperty;

  /**
   * A list of explicitly approved patches for the baseline.
   */
  public approvedPatches?: Array<string>;

  /**
   * Defines the compliance level for approved patches.
   */
  public approvedPatchesComplianceLevel?: string;

  /**
   * Indicates whether the list of approved patches includes non-security updates that should be applied to the managed nodes.
   */
  public approvedPatchesEnableNonSecurity?: boolean | cdk.IResolvable;

  /**
   * Set the baseline as default baseline.
   */
  public defaultBaseline?: boolean | cdk.IResolvable;

  /**
   * A description of the patch baseline.
   */
  public description?: string;

  /**
   * A set of global filters used to include patches in the baseline.
   */
  public globalFilters?: cdk.IResolvable | CfnPatchBaseline.PatchFilterGroupProperty;

  /**
   * The name of the patch baseline.
   */
  public name: string;

  /**
   * Defines the operating system the patch baseline applies to.
   */
  public operatingSystem?: string;

  /**
   * The name of the patch group to be registered with the patch baseline.
   */
  public patchGroups?: Array<string>;

  /**
   * A list of explicitly rejected patches for the baseline.
   */
  public rejectedPatches?: Array<string>;

  /**
   * The action for Patch Manager to take on patches included in the `RejectedPackages` list.
   */
  public rejectedPatchesAction?: string;

  /**
   * Information about the patches to use to update the managed nodes, including target operating systems and source repositories.
   */
  public sources?: Array<cdk.IResolvable | CfnPatchBaseline.PatchSourceProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Optional metadata that you assign to a resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPatchBaselineProps) {
    super(scope, id, {
      "type": CfnPatchBaseline.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.approvalRules = props.approvalRules;
    this.approvedPatches = props.approvedPatches;
    this.approvedPatchesComplianceLevel = props.approvedPatchesComplianceLevel;
    this.approvedPatchesEnableNonSecurity = props.approvedPatchesEnableNonSecurity;
    this.defaultBaseline = props.defaultBaseline;
    this.description = props.description;
    this.globalFilters = props.globalFilters;
    this.name = props.name;
    this.operatingSystem = props.operatingSystem;
    this.patchGroups = props.patchGroups;
    this.rejectedPatches = props.rejectedPatches;
    this.rejectedPatchesAction = props.rejectedPatchesAction;
    this.sources = props.sources;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSM::PatchBaseline", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "approvalRules": this.approvalRules,
      "approvedPatches": this.approvedPatches,
      "approvedPatchesComplianceLevel": this.approvedPatchesComplianceLevel,
      "approvedPatchesEnableNonSecurity": this.approvedPatchesEnableNonSecurity,
      "defaultBaseline": this.defaultBaseline,
      "description": this.description,
      "globalFilters": this.globalFilters,
      "name": this.name,
      "operatingSystem": this.operatingSystem,
      "patchGroups": this.patchGroups,
      "rejectedPatches": this.rejectedPatches,
      "rejectedPatchesAction": this.rejectedPatchesAction,
      "sources": this.sources,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPatchBaseline.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPatchBaselinePropsToCloudFormation(props);
  }
}

export namespace CfnPatchBaseline {
  /**
   * The `RuleGroup` property type specifies a set of rules that define the approval rules for an AWS Systems Manager patch baseline.
   *
   * `RuleGroup` is the property type for the `ApprovalRules` property of the [AWS::SSM::PatchBaseline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html
   */
  export interface RuleGroupProperty {
    /**
     * The rules that make up the rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html#cfn-ssm-patchbaseline-rulegroup-patchrules
     */
    readonly patchRules?: Array<cdk.IResolvable | CfnPatchBaseline.RuleProperty> | cdk.IResolvable;
  }

  /**
   * The `Rule` property type specifies an approval rule for a Systems Manager patch baseline.
   *
   * The `PatchRules` property of the [RuleGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html) property type contains a list of `Rule` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html
   */
  export interface RuleProperty {
    /**
     * The number of days after the release date of each patch matched by the rule that the patch is marked as approved in the patch baseline.
     *
     * For example, a value of `7` means that patches are approved seven days after they are released.
     *
     * You must specify a value for `ApproveAfterDays` .
     *
     * Exception: Not supported on Debian Server or Ubuntu Server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-approveafterdays
     */
    readonly approveAfterDays?: number;

    /**
     * The cutoff date for auto approval of released patches.
     *
     * Any patches released on or before this date are installed automatically. Not supported on Debian Server or Ubuntu Server.
     *
     * Enter dates in the format `YYYY-MM-DD` . For example, `2021-12-31` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-approveuntildate
     */
    readonly approveUntilDate?: string;

    /**
     * A compliance severity level for all approved patches in a patch baseline.
     *
     * Valid compliance severity levels include the following: `UNSPECIFIED` , `CRITICAL` , `HIGH` , `MEDIUM` , `LOW` , and `INFORMATIONAL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-compliancelevel
     */
    readonly complianceLevel?: string;

    /**
     * For managed nodes identified by the approval rule filters, enables a patch baseline to apply non-security updates available in the specified repository.
     *
     * The default value is `false` . Applies to Linux managed nodes only.
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-enablenonsecurity
     */
    readonly enableNonSecurity?: boolean | cdk.IResolvable;

    /**
     * The patch filter group that defines the criteria for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-patchfiltergroup
     */
    readonly patchFilterGroup?: cdk.IResolvable | CfnPatchBaseline.PatchFilterGroupProperty;
  }

  /**
   * The `PatchFilterGroup` property type specifies a set of patch filters for an AWS Systems Manager patch baseline, typically used for approval rules for a Systems Manager patch baseline.
   *
   * `PatchFilterGroup` is the property type for the `GlobalFilters` property of the [AWS::SSM::PatchBaseline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html) resource and the `PatchFilterGroup` property of the [Rule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html
   */
  export interface PatchFilterGroupProperty {
    /**
     * The set of patch filters that make up the group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html#cfn-ssm-patchbaseline-patchfiltergroup-patchfilters
     */
    readonly patchFilters?: Array<cdk.IResolvable | CfnPatchBaseline.PatchFilterProperty> | cdk.IResolvable;
  }

  /**
   * The `PatchFilter` property type defines a patch filter for an AWS Systems Manager patch baseline.
   *
   * The `PatchFilters` property of the [PatchFilterGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html) property type contains a list of `PatchFilter` property types.
   *
   * You can view lists of valid values for the patch properties by running the `DescribePatchProperties` command. For more information, see [DescribePatchProperties](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_DescribePatchProperties.html) in the *AWS Systems Manager API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html
   */
  export interface PatchFilterProperty {
    /**
     * The key for the filter.
     *
     * For information about valid keys, see [PatchFilter](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PatchFilter.html) in the *AWS Systems Manager API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html#cfn-ssm-patchbaseline-patchfilter-key
     */
    readonly key?: string;

    /**
     * The value for the filter key.
     *
     * For information about valid values for each key based on operating system type, see [PatchFilter](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PatchFilter.html) in the *AWS Systems Manager API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html#cfn-ssm-patchbaseline-patchfilter-values
     */
    readonly values?: Array<string>;
  }

  /**
   * `PatchSource` is the property type for the `Sources` resource of the [AWS::SSM::PatchBaseline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html) resource.
   *
   * The AWS CloudFormation `AWS::SSM::PatchSource` resource is used to provide information about the patches to use to update target instances, including target operating systems and source repository. Applies to Linux managed nodes only.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchsource.html
   */
  export interface PatchSourceProperty {
    /**
     * The value of the yum repo configuration. For example:.
     *
     * `[main]`
     *
     * `name=MyCustomRepository`
     *
     * `baseurl=https://my-custom-repository`
     *
     * `enabled=1`
     *
     * > For information about other options available for your yum repository configuration, see [dnf.conf(5)](https://docs.aws.amazon.com/https://man7.org/linux/man-pages/man5/dnf.conf.5.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchsource.html#cfn-ssm-patchbaseline-patchsource-configuration
     */
    readonly configuration?: string;

    /**
     * The name specified to identify the patch source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchsource.html#cfn-ssm-patchbaseline-patchsource-name
     */
    readonly name?: string;

    /**
     * The specific operating system versions a patch repository applies to, such as "Ubuntu16.04", "RedhatEnterpriseLinux7.2" or "Suse12.7". For lists of supported product values, see [PatchFilter](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PatchFilter.html) in the *AWS Systems Manager API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchsource.html#cfn-ssm-patchbaseline-patchsource-products
     */
    readonly products?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnPatchBaseline`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html
 */
export interface CfnPatchBaselineProps {
  /**
   * A set of rules used to include patches in the baseline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvalrules
   */
  readonly approvalRules?: cdk.IResolvable | CfnPatchBaseline.RuleGroupProperty;

  /**
   * A list of explicitly approved patches for the baseline.
   *
   * For information about accepted formats for lists of approved patches and rejected patches, see [About package name formats for approved and rejected patch lists](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-approved-rejected-package-name-formats.html) in the *AWS Systems Manager User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatches
   */
  readonly approvedPatches?: Array<string>;

  /**
   * Defines the compliance level for approved patches.
   *
   * When an approved patch is reported as missing, this value describes the severity of the compliance violation. The default value is `UNSPECIFIED` .
   *
   * @default - "UNSPECIFIED"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatchescompliancelevel
   */
  readonly approvedPatchesComplianceLevel?: string;

  /**
   * Indicates whether the list of approved patches includes non-security updates that should be applied to the managed nodes.
   *
   * The default value is `false` . Applies to Linux managed nodes only.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatchesenablenonsecurity
   */
  readonly approvedPatchesEnableNonSecurity?: boolean | cdk.IResolvable;

  /**
   * Set the baseline as default baseline.
   *
   * Only registering to default patch baseline is allowed.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-defaultbaseline
   */
  readonly defaultBaseline?: boolean | cdk.IResolvable;

  /**
   * A description of the patch baseline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-description
   */
  readonly description?: string;

  /**
   * A set of global filters used to include patches in the baseline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-globalfilters
   */
  readonly globalFilters?: cdk.IResolvable | CfnPatchBaseline.PatchFilterGroupProperty;

  /**
   * The name of the patch baseline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-name
   */
  readonly name: string;

  /**
   * Defines the operating system the patch baseline applies to.
   *
   * The default value is `WINDOWS` .
   *
   * @default - "WINDOWS"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-operatingsystem
   */
  readonly operatingSystem?: string;

  /**
   * The name of the patch group to be registered with the patch baseline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-patchgroups
   */
  readonly patchGroups?: Array<string>;

  /**
   * A list of explicitly rejected patches for the baseline.
   *
   * For information about accepted formats for lists of approved patches and rejected patches, see [About package name formats for approved and rejected patch lists](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-approved-rejected-package-name-formats.html) in the *AWS Systems Manager User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-rejectedpatches
   */
  readonly rejectedPatches?: Array<string>;

  /**
   * The action for Patch Manager to take on patches included in the `RejectedPackages` list.
   *
   * - *`ALLOW_AS_DEPENDENCY`* : A package in the `Rejected` patches list is installed only if it is a dependency of another package. It is considered compliant with the patch baseline, and its status is reported as `InstalledOther` . This is the default action if no option is specified.
   * - *`BLOCK`* : Packages in the `RejectedPatches` list, and packages that include them as dependencies, aren't installed under any circumstances. If a package was installed before it was added to the Rejected patches list, it is considered non-compliant with the patch baseline, and its status is reported as `InstalledRejected` .
   *
   * @default - "ALLOW_AS_DEPENDENCY"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-rejectedpatchesaction
   */
  readonly rejectedPatchesAction?: string;

  /**
   * Information about the patches to use to update the managed nodes, including target operating systems and source repositories.
   *
   * Applies to Linux managed nodes only.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-sources
   */
  readonly sources?: Array<cdk.IResolvable | CfnPatchBaseline.PatchSourceProperty> | cdk.IResolvable;

  /**
   * Optional metadata that you assign to a resource.
   *
   * Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a patch baseline to identify the severity level of patches it specifies and the operating system family it applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `PatchFilterProperty`
 *
 * @param properties - the TypeScript properties of a `PatchFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPatchBaselinePatchFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"PatchFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnPatchBaselinePatchFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPatchBaselinePatchFilterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnPatchBaselinePatchFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPatchBaseline.PatchFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.PatchFilterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PatchFilterGroupProperty`
 *
 * @param properties - the TypeScript properties of a `PatchFilterGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPatchBaselinePatchFilterGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("patchFilters", cdk.listValidator(CfnPatchBaselinePatchFilterPropertyValidator))(properties.patchFilters));
  return errors.wrap("supplied properties not correct for \"PatchFilterGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnPatchBaselinePatchFilterGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPatchBaselinePatchFilterGroupPropertyValidator(properties).assertSuccess();
  return {
    "PatchFilters": cdk.listMapper(convertCfnPatchBaselinePatchFilterPropertyToCloudFormation)(properties.patchFilters)
  };
}

// @ts-ignore TS6133
function CfnPatchBaselinePatchFilterGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPatchBaseline.PatchFilterGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.PatchFilterGroupProperty>();
  ret.addPropertyResult("patchFilters", "PatchFilters", (properties.PatchFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnPatchBaselinePatchFilterPropertyFromCloudFormation)(properties.PatchFilters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPatchBaselineRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("approveAfterDays", cdk.validateNumber)(properties.approveAfterDays));
  errors.collect(cdk.propertyValidator("approveUntilDate", cdk.validateString)(properties.approveUntilDate));
  errors.collect(cdk.propertyValidator("complianceLevel", cdk.validateString)(properties.complianceLevel));
  errors.collect(cdk.propertyValidator("enableNonSecurity", cdk.validateBoolean)(properties.enableNonSecurity));
  errors.collect(cdk.propertyValidator("patchFilterGroup", CfnPatchBaselinePatchFilterGroupPropertyValidator)(properties.patchFilterGroup));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnPatchBaselineRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPatchBaselineRulePropertyValidator(properties).assertSuccess();
  return {
    "ApproveAfterDays": cdk.numberToCloudFormation(properties.approveAfterDays),
    "ApproveUntilDate": cdk.stringToCloudFormation(properties.approveUntilDate),
    "ComplianceLevel": cdk.stringToCloudFormation(properties.complianceLevel),
    "EnableNonSecurity": cdk.booleanToCloudFormation(properties.enableNonSecurity),
    "PatchFilterGroup": convertCfnPatchBaselinePatchFilterGroupPropertyToCloudFormation(properties.patchFilterGroup)
  };
}

// @ts-ignore TS6133
function CfnPatchBaselineRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPatchBaseline.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.RuleProperty>();
  ret.addPropertyResult("approveAfterDays", "ApproveAfterDays", (properties.ApproveAfterDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ApproveAfterDays) : undefined));
  ret.addPropertyResult("approveUntilDate", "ApproveUntilDate", (properties.ApproveUntilDate != null ? cfn_parse.FromCloudFormation.getString(properties.ApproveUntilDate) : undefined));
  ret.addPropertyResult("complianceLevel", "ComplianceLevel", (properties.ComplianceLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ComplianceLevel) : undefined));
  ret.addPropertyResult("enableNonSecurity", "EnableNonSecurity", (properties.EnableNonSecurity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableNonSecurity) : undefined));
  ret.addPropertyResult("patchFilterGroup", "PatchFilterGroup", (properties.PatchFilterGroup != null ? CfnPatchBaselinePatchFilterGroupPropertyFromCloudFormation(properties.PatchFilterGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleGroupProperty`
 *
 * @param properties - the TypeScript properties of a `RuleGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPatchBaselineRuleGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("patchRules", cdk.listValidator(CfnPatchBaselineRulePropertyValidator))(properties.patchRules));
  return errors.wrap("supplied properties not correct for \"RuleGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnPatchBaselineRuleGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPatchBaselineRuleGroupPropertyValidator(properties).assertSuccess();
  return {
    "PatchRules": cdk.listMapper(convertCfnPatchBaselineRulePropertyToCloudFormation)(properties.patchRules)
  };
}

// @ts-ignore TS6133
function CfnPatchBaselineRuleGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPatchBaseline.RuleGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.RuleGroupProperty>();
  ret.addPropertyResult("patchRules", "PatchRules", (properties.PatchRules != null ? cfn_parse.FromCloudFormation.getArray(CfnPatchBaselineRulePropertyFromCloudFormation)(properties.PatchRules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PatchSourceProperty`
 *
 * @param properties - the TypeScript properties of a `PatchSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPatchBaselinePatchSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuration", cdk.validateString)(properties.configuration));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("products", cdk.listValidator(cdk.validateString))(properties.products));
  return errors.wrap("supplied properties not correct for \"PatchSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPatchBaselinePatchSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPatchBaselinePatchSourcePropertyValidator(properties).assertSuccess();
  return {
    "Configuration": cdk.stringToCloudFormation(properties.configuration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Products": cdk.listMapper(cdk.stringToCloudFormation)(properties.products)
  };
}

// @ts-ignore TS6133
function CfnPatchBaselinePatchSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPatchBaseline.PatchSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.PatchSourceProperty>();
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? cfn_parse.FromCloudFormation.getString(properties.Configuration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("products", "Products", (properties.Products != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Products) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPatchBaselineProps`
 *
 * @param properties - the TypeScript properties of a `CfnPatchBaselineProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPatchBaselinePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("approvalRules", CfnPatchBaselineRuleGroupPropertyValidator)(properties.approvalRules));
  errors.collect(cdk.propertyValidator("approvedPatches", cdk.listValidator(cdk.validateString))(properties.approvedPatches));
  errors.collect(cdk.propertyValidator("approvedPatchesComplianceLevel", cdk.validateString)(properties.approvedPatchesComplianceLevel));
  errors.collect(cdk.propertyValidator("approvedPatchesEnableNonSecurity", cdk.validateBoolean)(properties.approvedPatchesEnableNonSecurity));
  errors.collect(cdk.propertyValidator("defaultBaseline", cdk.validateBoolean)(properties.defaultBaseline));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("globalFilters", CfnPatchBaselinePatchFilterGroupPropertyValidator)(properties.globalFilters));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("operatingSystem", cdk.validateString)(properties.operatingSystem));
  errors.collect(cdk.propertyValidator("patchGroups", cdk.listValidator(cdk.validateString))(properties.patchGroups));
  errors.collect(cdk.propertyValidator("rejectedPatches", cdk.listValidator(cdk.validateString))(properties.rejectedPatches));
  errors.collect(cdk.propertyValidator("rejectedPatchesAction", cdk.validateString)(properties.rejectedPatchesAction));
  errors.collect(cdk.propertyValidator("sources", cdk.listValidator(CfnPatchBaselinePatchSourcePropertyValidator))(properties.sources));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPatchBaselineProps\"");
}

// @ts-ignore TS6133
function convertCfnPatchBaselinePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPatchBaselinePropsValidator(properties).assertSuccess();
  return {
    "ApprovalRules": convertCfnPatchBaselineRuleGroupPropertyToCloudFormation(properties.approvalRules),
    "ApprovedPatches": cdk.listMapper(cdk.stringToCloudFormation)(properties.approvedPatches),
    "ApprovedPatchesComplianceLevel": cdk.stringToCloudFormation(properties.approvedPatchesComplianceLevel),
    "ApprovedPatchesEnableNonSecurity": cdk.booleanToCloudFormation(properties.approvedPatchesEnableNonSecurity),
    "DefaultBaseline": cdk.booleanToCloudFormation(properties.defaultBaseline),
    "Description": cdk.stringToCloudFormation(properties.description),
    "GlobalFilters": convertCfnPatchBaselinePatchFilterGroupPropertyToCloudFormation(properties.globalFilters),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OperatingSystem": cdk.stringToCloudFormation(properties.operatingSystem),
    "PatchGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.patchGroups),
    "RejectedPatches": cdk.listMapper(cdk.stringToCloudFormation)(properties.rejectedPatches),
    "RejectedPatchesAction": cdk.stringToCloudFormation(properties.rejectedPatchesAction),
    "Sources": cdk.listMapper(convertCfnPatchBaselinePatchSourcePropertyToCloudFormation)(properties.sources),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPatchBaselinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPatchBaselineProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaselineProps>();
  ret.addPropertyResult("approvalRules", "ApprovalRules", (properties.ApprovalRules != null ? CfnPatchBaselineRuleGroupPropertyFromCloudFormation(properties.ApprovalRules) : undefined));
  ret.addPropertyResult("approvedPatches", "ApprovedPatches", (properties.ApprovedPatches != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ApprovedPatches) : undefined));
  ret.addPropertyResult("approvedPatchesComplianceLevel", "ApprovedPatchesComplianceLevel", (properties.ApprovedPatchesComplianceLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ApprovedPatchesComplianceLevel) : undefined));
  ret.addPropertyResult("approvedPatchesEnableNonSecurity", "ApprovedPatchesEnableNonSecurity", (properties.ApprovedPatchesEnableNonSecurity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApprovedPatchesEnableNonSecurity) : undefined));
  ret.addPropertyResult("defaultBaseline", "DefaultBaseline", (properties.DefaultBaseline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DefaultBaseline) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("globalFilters", "GlobalFilters", (properties.GlobalFilters != null ? CfnPatchBaselinePatchFilterGroupPropertyFromCloudFormation(properties.GlobalFilters) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("operatingSystem", "OperatingSystem", (properties.OperatingSystem != null ? cfn_parse.FromCloudFormation.getString(properties.OperatingSystem) : undefined));
  ret.addPropertyResult("patchGroups", "PatchGroups", (properties.PatchGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PatchGroups) : undefined));
  ret.addPropertyResult("rejectedPatches", "RejectedPatches", (properties.RejectedPatches != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RejectedPatches) : undefined));
  ret.addPropertyResult("rejectedPatchesAction", "RejectedPatchesAction", (properties.RejectedPatchesAction != null ? cfn_parse.FromCloudFormation.getString(properties.RejectedPatchesAction) : undefined));
  ret.addPropertyResult("sources", "Sources", (properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnPatchBaselinePatchSourcePropertyFromCloudFormation)(properties.Sources) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSM::ResourceDataSync` resource creates, updates, or deletes a resource data sync for AWS Systems Manager .
 *
 * A resource data sync helps you view data from multiple sources in a single location. Systems Manager offers two types of resource data sync: `SyncToDestination` and `SyncFromSource` .
 *
 * You can configure Systems Manager Inventory to use the `SyncToDestination` type to synchronize Inventory data from multiple AWS Regions to a single Amazon S3 bucket.
 *
 * You can configure Systems Manager Explorer to use the `SyncFromSource` type to synchronize operational work items (OpsItems) and operational data (OpsData) from multiple AWS Regions . This type can synchronize OpsItems and OpsData from multiple AWS accounts and Regions or from an `EntireOrganization` by using AWS Organizations .
 *
 * A resource data sync is an asynchronous operation that returns immediately. After a successful initial sync is completed, the system continuously syncs data.
 *
 * By default, data is not encrypted in Amazon S3 . We strongly recommend that you enable encryption in Amazon S3 to ensure secure data storage. We also recommend that you secure access to the Amazon S3 bucket by creating a restrictive bucket policy.
 *
 * For more information, see [Configuring Inventory Collection](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-inventory-configuring.html#sysman-inventory-datasync) and [Setting Up Systems Manager Explorer to Display Data from Multiple Accounts and Regions](https://docs.aws.amazon.com/systems-manager/latest/userguide/Explorer-resource-data-sync.html) in the *AWS Systems Manager User Guide* .
 *
 * Important: The following *Syntax* section shows all fields that are supported for a resource data sync. The *Examples* section below shows the recommended way to specify configurations for each sync type. Please see the *Examples* section when you create your resource data sync.
 *
 * @cloudformationResource AWS::SSM::ResourceDataSync
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html
 */
export class CfnResourceDataSync extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::ResourceDataSync";

  /**
   * Build a CfnResourceDataSync from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceDataSync {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceDataSyncPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceDataSync(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the resource data sync.
   *
   * @cloudformationAttribute SyncName
   */
  public readonly attrSyncName: string;

  /**
   * The name of the S3 bucket where the aggregated data is stored.
   */
  public bucketName?: string;

  /**
   * An Amazon S3 prefix for the bucket.
   */
  public bucketPrefix?: string;

  /**
   * The AWS Region with the S3 bucket targeted by the resource data sync.
   */
  public bucketRegion?: string;

  /**
   * The ARN of an encryption key for a destination in Amazon S3 .
   */
  public kmsKeyArn?: string;

  /**
   * Configuration information for the target S3 bucket.
   */
  public s3Destination?: cdk.IResolvable | CfnResourceDataSync.S3DestinationProperty;

  /**
   * A supported sync format.
   */
  public syncFormat?: string;

  public syncName: string;

  /**
   * Information about the source where the data was synchronized.
   */
  public syncSource?: cdk.IResolvable | CfnResourceDataSync.SyncSourceProperty;

  /**
   * The type of resource data sync.
   */
  public syncType?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceDataSyncProps) {
    super(scope, id, {
      "type": CfnResourceDataSync.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "syncName", this);

    this.attrSyncName = cdk.Token.asString(this.getAtt("SyncName", cdk.ResolutionTypeHint.STRING));
    this.bucketName = props.bucketName;
    this.bucketPrefix = props.bucketPrefix;
    this.bucketRegion = props.bucketRegion;
    this.kmsKeyArn = props.kmsKeyArn;
    this.s3Destination = props.s3Destination;
    this.syncFormat = props.syncFormat;
    this.syncName = props.syncName;
    this.syncSource = props.syncSource;
    this.syncType = props.syncType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bucketName": this.bucketName,
      "bucketPrefix": this.bucketPrefix,
      "bucketRegion": this.bucketRegion,
      "kmsKeyArn": this.kmsKeyArn,
      "s3Destination": this.s3Destination,
      "syncFormat": this.syncFormat,
      "syncName": this.syncName,
      "syncSource": this.syncSource,
      "syncType": this.syncType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceDataSync.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceDataSyncPropsToCloudFormation(props);
  }
}

export namespace CfnResourceDataSync {
  /**
   * Information about the target S3 bucket for the resource data sync.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html
   */
  export interface S3DestinationProperty {
    /**
     * The name of the S3 bucket where the aggregated data is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-bucketname
     */
    readonly bucketName: string;

    /**
     * An Amazon S3 prefix for the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The AWS Region with the S3 bucket targeted by the resource data sync.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-bucketregion
     */
    readonly bucketRegion: string;

    /**
     * The ARN of an encryption key for a destination in Amazon S3.
     *
     * Must belong to the same Region as the destination S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * A supported sync format.
     *
     * The following format is currently supported: JsonSerDe
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-syncformat
     */
    readonly syncFormat: string;
  }

  /**
   * Information about the source of the data included in the resource data sync.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html
   */
  export interface SyncSourceProperty {
    /**
     * Information about the AwsOrganizationsSource resource data sync source.
     *
     * A sync source of this type can synchronize data from AWS Organizations .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html#cfn-ssm-resourcedatasync-syncsource-awsorganizationssource
     */
    readonly awsOrganizationsSource?: CfnResourceDataSync.AwsOrganizationsSourceProperty | cdk.IResolvable;

    /**
     * Whether to automatically synchronize and aggregate data from new AWS Regions when those Regions come online.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html#cfn-ssm-resourcedatasync-syncsource-includefutureregions
     */
    readonly includeFutureRegions?: boolean | cdk.IResolvable;

    /**
     * The `SyncSource` AWS Regions included in the resource data sync.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html#cfn-ssm-resourcedatasync-syncsource-sourceregions
     */
    readonly sourceRegions: Array<string>;

    /**
     * The type of data source for the resource data sync.
     *
     * `SourceType` is either `AwsOrganizations` (if an organization is present in AWS Organizations ) or `SingleAccountMultiRegions` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html#cfn-ssm-resourcedatasync-syncsource-sourcetype
     */
    readonly sourceType: string;
  }

  /**
   * Information about the `AwsOrganizationsSource` resource data sync source.
   *
   * A sync source of this type can synchronize data from AWS Organizations or, if an AWS organization isn't present, from multiple AWS Regions .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-awsorganizationssource.html
   */
  export interface AwsOrganizationsSourceProperty {
    /**
     * The AWS Organizations organization units included in the sync.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-awsorganizationssource.html#cfn-ssm-resourcedatasync-awsorganizationssource-organizationalunits
     */
    readonly organizationalUnits?: Array<string>;

    /**
     * If an AWS organization is present, this is either `OrganizationalUnits` or `EntireOrganization` .
     *
     * For `OrganizationalUnits` , the data is aggregated from a set of organization units. For `EntireOrganization` , the data is aggregated from the entire AWS organization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-awsorganizationssource.html#cfn-ssm-resourcedatasync-awsorganizationssource-organizationsourcetype
     */
    readonly organizationSourceType: string;
  }
}

/**
 * Properties for defining a `CfnResourceDataSync`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html
 */
export interface CfnResourceDataSyncProps {
  /**
   * The name of the S3 bucket where the aggregated data is stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketname
   */
  readonly bucketName?: string;

  /**
   * An Amazon S3 prefix for the bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketprefix
   */
  readonly bucketPrefix?: string;

  /**
   * The AWS Region with the S3 bucket targeted by the resource data sync.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketregion
   */
  readonly bucketRegion?: string;

  /**
   * The ARN of an encryption key for a destination in Amazon S3 .
   *
   * You can use a KMS key to encrypt inventory data in Amazon S3 . You must specify a key that exist in the same region as the destination Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * Configuration information for the target S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-s3destination
   */
  readonly s3Destination?: cdk.IResolvable | CfnResourceDataSync.S3DestinationProperty;

  /**
   * A supported sync format.
   *
   * The following format is currently supported: JsonSerDe
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncformat
   */
  readonly syncFormat?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncname
   */
  readonly syncName: string;

  /**
   * Information about the source where the data was synchronized.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncsource
   */
  readonly syncSource?: cdk.IResolvable | CfnResourceDataSync.SyncSourceProperty;

  /**
   * The type of resource data sync.
   *
   * If `SyncType` is `SyncToDestination` , then the resource data sync synchronizes data to an S3 bucket. If the `SyncType` is `SyncFromSource` then the resource data sync synchronizes data from AWS Organizations or from multiple AWS Regions .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-synctype
   */
  readonly syncType?: string;
}

/**
 * Determine whether the given properties match those of a `S3DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDataSyncS3DestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("bucketRegion", cdk.requiredValidator)(properties.bucketRegion));
  errors.collect(cdk.propertyValidator("bucketRegion", cdk.validateString)(properties.bucketRegion));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("syncFormat", cdk.requiredValidator)(properties.syncFormat));
  errors.collect(cdk.propertyValidator("syncFormat", cdk.validateString)(properties.syncFormat));
  return errors.wrap("supplied properties not correct for \"S3DestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDataSyncS3DestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDataSyncS3DestinationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "BucketRegion": cdk.stringToCloudFormation(properties.bucketRegion),
    "KMSKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "SyncFormat": cdk.stringToCloudFormation(properties.syncFormat)
  };
}

// @ts-ignore TS6133
function CfnResourceDataSyncS3DestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDataSync.S3DestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDataSync.S3DestinationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("bucketRegion", "BucketRegion", (properties.BucketRegion != null ? cfn_parse.FromCloudFormation.getString(properties.BucketRegion) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KMSKeyArn", (properties.KMSKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KMSKeyArn) : undefined));
  ret.addPropertyResult("syncFormat", "SyncFormat", (properties.SyncFormat != null ? cfn_parse.FromCloudFormation.getString(properties.SyncFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsOrganizationsSourceProperty`
 *
 * @param properties - the TypeScript properties of a `AwsOrganizationsSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDataSyncAwsOrganizationsSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("organizationSourceType", cdk.requiredValidator)(properties.organizationSourceType));
  errors.collect(cdk.propertyValidator("organizationSourceType", cdk.validateString)(properties.organizationSourceType));
  errors.collect(cdk.propertyValidator("organizationalUnits", cdk.listValidator(cdk.validateString))(properties.organizationalUnits));
  return errors.wrap("supplied properties not correct for \"AwsOrganizationsSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDataSyncAwsOrganizationsSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDataSyncAwsOrganizationsSourcePropertyValidator(properties).assertSuccess();
  return {
    "OrganizationSourceType": cdk.stringToCloudFormation(properties.organizationSourceType),
    "OrganizationalUnits": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationalUnits)
  };
}

// @ts-ignore TS6133
function CfnResourceDataSyncAwsOrganizationsSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDataSync.AwsOrganizationsSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDataSync.AwsOrganizationsSourceProperty>();
  ret.addPropertyResult("organizationalUnits", "OrganizationalUnits", (properties.OrganizationalUnits != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationalUnits) : undefined));
  ret.addPropertyResult("organizationSourceType", "OrganizationSourceType", (properties.OrganizationSourceType != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationSourceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SyncSourceProperty`
 *
 * @param properties - the TypeScript properties of a `SyncSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDataSyncSyncSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsOrganizationsSource", CfnResourceDataSyncAwsOrganizationsSourcePropertyValidator)(properties.awsOrganizationsSource));
  errors.collect(cdk.propertyValidator("includeFutureRegions", cdk.validateBoolean)(properties.includeFutureRegions));
  errors.collect(cdk.propertyValidator("sourceRegions", cdk.requiredValidator)(properties.sourceRegions));
  errors.collect(cdk.propertyValidator("sourceRegions", cdk.listValidator(cdk.validateString))(properties.sourceRegions));
  errors.collect(cdk.propertyValidator("sourceType", cdk.requiredValidator)(properties.sourceType));
  errors.collect(cdk.propertyValidator("sourceType", cdk.validateString)(properties.sourceType));
  return errors.wrap("supplied properties not correct for \"SyncSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDataSyncSyncSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDataSyncSyncSourcePropertyValidator(properties).assertSuccess();
  return {
    "AwsOrganizationsSource": convertCfnResourceDataSyncAwsOrganizationsSourcePropertyToCloudFormation(properties.awsOrganizationsSource),
    "IncludeFutureRegions": cdk.booleanToCloudFormation(properties.includeFutureRegions),
    "SourceRegions": cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceRegions),
    "SourceType": cdk.stringToCloudFormation(properties.sourceType)
  };
}

// @ts-ignore TS6133
function CfnResourceDataSyncSyncSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDataSync.SyncSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDataSync.SyncSourceProperty>();
  ret.addPropertyResult("awsOrganizationsSource", "AwsOrganizationsSource", (properties.AwsOrganizationsSource != null ? CfnResourceDataSyncAwsOrganizationsSourcePropertyFromCloudFormation(properties.AwsOrganizationsSource) : undefined));
  ret.addPropertyResult("includeFutureRegions", "IncludeFutureRegions", (properties.IncludeFutureRegions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeFutureRegions) : undefined));
  ret.addPropertyResult("sourceRegions", "SourceRegions", (properties.SourceRegions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceRegions) : undefined));
  ret.addPropertyResult("sourceType", "SourceType", (properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResourceDataSyncProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceDataSyncProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDataSyncPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("bucketRegion", cdk.validateString)(properties.bucketRegion));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("s3Destination", CfnResourceDataSyncS3DestinationPropertyValidator)(properties.s3Destination));
  errors.collect(cdk.propertyValidator("syncFormat", cdk.validateString)(properties.syncFormat));
  errors.collect(cdk.propertyValidator("syncName", cdk.requiredValidator)(properties.syncName));
  errors.collect(cdk.propertyValidator("syncName", cdk.validateString)(properties.syncName));
  errors.collect(cdk.propertyValidator("syncSource", CfnResourceDataSyncSyncSourcePropertyValidator)(properties.syncSource));
  errors.collect(cdk.propertyValidator("syncType", cdk.validateString)(properties.syncType));
  return errors.wrap("supplied properties not correct for \"CfnResourceDataSyncProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceDataSyncPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDataSyncPropsValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "BucketRegion": cdk.stringToCloudFormation(properties.bucketRegion),
    "KMSKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "S3Destination": convertCfnResourceDataSyncS3DestinationPropertyToCloudFormation(properties.s3Destination),
    "SyncFormat": cdk.stringToCloudFormation(properties.syncFormat),
    "SyncName": cdk.stringToCloudFormation(properties.syncName),
    "SyncSource": convertCfnResourceDataSyncSyncSourcePropertyToCloudFormation(properties.syncSource),
    "SyncType": cdk.stringToCloudFormation(properties.syncType)
  };
}

// @ts-ignore TS6133
function CfnResourceDataSyncPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDataSyncProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDataSyncProps>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("bucketRegion", "BucketRegion", (properties.BucketRegion != null ? cfn_parse.FromCloudFormation.getString(properties.BucketRegion) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KMSKeyArn", (properties.KMSKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KMSKeyArn) : undefined));
  ret.addPropertyResult("s3Destination", "S3Destination", (properties.S3Destination != null ? CfnResourceDataSyncS3DestinationPropertyFromCloudFormation(properties.S3Destination) : undefined));
  ret.addPropertyResult("syncFormat", "SyncFormat", (properties.SyncFormat != null ? cfn_parse.FromCloudFormation.getString(properties.SyncFormat) : undefined));
  ret.addPropertyResult("syncName", "SyncName", (properties.SyncName != null ? cfn_parse.FromCloudFormation.getString(properties.SyncName) : undefined));
  ret.addPropertyResult("syncSource", "SyncSource", (properties.SyncSource != null ? CfnResourceDataSyncSyncSourcePropertyFromCloudFormation(properties.SyncSource) : undefined));
  ret.addPropertyResult("syncType", "SyncType", (properties.SyncType != null ? cfn_parse.FromCloudFormation.getString(properties.SyncType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates a Systems Manager resource policy.
 *
 * A resource policy helps you to define the IAM entity (for example, an AWS account ) that can manage your Systems Manager resources. Currently, `OpsItemGroup` is the only resource that supports Systems Manager resource policies. The resource policy for `OpsItemGroup` enables AWS accounts to view and interact with OpsCenter operational work items (OpsItems). OpsCenter is a capability of Systems Manager .
 *
 * @cloudformationResource AWS::SSM::ResourcePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSM::ResourcePolicy";

  /**
   * Build a CfnResourcePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourcePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourcePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * ID of the current policy version. The hash helps to prevent a situation where multiple users attempt to overwrite a policy. You must provide this hash and the policy ID when updating or deleting a policy.
   *
   * @cloudformationAttribute PolicyHash
   */
  public readonly attrPolicyHash: string;

  /**
   * ID of the current policy version.
   *
   * @cloudformationAttribute PolicyId
   */
  public readonly attrPolicyId: string;

  /**
   * A policy you want to associate with a resource.
   */
  public policy: any | cdk.IResolvable;

  /**
   * Amazon Resource Name (ARN) of the resource to which you want to attach a policy.
   */
  public resourceArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
    super(scope, id, {
      "type": CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "resourceArn", this);

    this.attrPolicyHash = cdk.Token.asString(this.getAtt("PolicyHash", cdk.ResolutionTypeHint.STRING));
    this.attrPolicyId = cdk.Token.asString(this.getAtt("PolicyId", cdk.ResolutionTypeHint.STRING));
    this.policy = props.policy;
    this.resourceArn = props.resourceArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policy": this.policy,
      "resourceArn": this.resourceArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourcePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {
  /**
   * A policy you want to associate with a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html#cfn-ssm-resourcepolicy-policy
   */
  readonly policy: any | cdk.IResolvable;

  /**
   * Amazon Resource Name (ARN) of the resource to which you want to attach a policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html#cfn-ssm-resourcepolicy-resourcearn
   */
  readonly resourceArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourcePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"CfnResourcePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnResourcePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourcePolicyPropsValidator(properties).assertSuccess();
  return {
    "Policy": cdk.objectToCloudFormation(properties.policy),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}