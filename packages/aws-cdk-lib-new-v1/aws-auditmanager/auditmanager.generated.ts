/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::AuditManager::Assessment` resource is an Audit Manager resource type that defines the scope of audit evidence collected by Audit Manager .
 *
 * An Audit Manager assessment is an implementation of an Audit Manager framework.
 *
 * @cloudformationResource AWS::AuditManager::Assessment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html
 */
export class CfnAssessment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AuditManager::Assessment";

  /**
   * Build a CfnAssessment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssessment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssessmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAssessment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the assessment.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier for the assessment.
   *
   * @cloudformationAttribute AssessmentId
   */
  public readonly attrAssessmentId: string;

  /**
   * Specifies when the assessment was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: cdk.IResolvable;

  /**
   * The destination that evidence reports are stored in for the assessment.
   */
  public assessmentReportsDestination?: CfnAssessment.AssessmentReportsDestinationProperty | cdk.IResolvable;

  /**
   * The AWS account that's associated with the assessment.
   */
  public awsAccount?: CfnAssessment.AWSAccountProperty | cdk.IResolvable;

  /**
   * The delegations that are associated with the assessment.
   */
  public delegations?: Array<CfnAssessment.DelegationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the assessment.
   */
  public description?: string;

  /**
   * The unique identifier for the framework.
   */
  public frameworkId?: string;

  /**
   * The name of the assessment.
   */
  public name?: string;

  /**
   * The roles that are associated with the assessment.
   */
  public roles?: Array<cdk.IResolvable | CfnAssessment.RoleProperty> | cdk.IResolvable;

  /**
   * The wrapper of AWS accounts and services that are in scope for the assessment.
   */
  public scope?: cdk.IResolvable | CfnAssessment.ScopeProperty;

  /**
   * The overall status of the assessment.
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that are associated with the assessment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssessmentProps = {}) {
    super(scope, id, {
      "type": CfnAssessment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrAssessmentId = cdk.Token.asString(this.getAtt("AssessmentId", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = this.getAtt("CreationTime", cdk.ResolutionTypeHint.NUMBER);
    this.assessmentReportsDestination = props.assessmentReportsDestination;
    this.awsAccount = props.awsAccount;
    this.delegations = props.delegations;
    this.description = props.description;
    this.frameworkId = props.frameworkId;
    this.name = props.name;
    this.roles = props.roles;
    this.scope = props.scope;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AuditManager::Assessment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assessmentReportsDestination": this.assessmentReportsDestination,
      "awsAccount": this.awsAccount,
      "delegations": this.delegations,
      "description": this.description,
      "frameworkId": this.frameworkId,
      "name": this.name,
      "roles": this.roles,
      "scope": this.scope,
      "status": this.status,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssessment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssessmentPropsToCloudFormation(props);
  }
}

export namespace CfnAssessment {
  /**
   * The `AssessmentReportsDestination` property type specifies the location in which AWS Audit Manager saves assessment reports for the given assessment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-assessmentreportsdestination.html
   */
  export interface AssessmentReportsDestinationProperty {
    /**
     * The destination bucket where Audit Manager stores assessment reports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-assessmentreportsdestination.html#cfn-auditmanager-assessment-assessmentreportsdestination-destination
     */
    readonly destination?: string;

    /**
     * The destination type, such as Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-assessmentreportsdestination.html#cfn-auditmanager-assessment-assessmentreportsdestination-destinationtype
     */
    readonly destinationType?: string;
  }

  /**
   * The `Delegation` property type specifies the assignment of a control set to a delegate for review.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html
   */
  export interface DelegationProperty {
    /**
     * The identifier for the assessment that's associated with the delegation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-assessmentid
     */
    readonly assessmentId?: string;

    /**
     * The name of the assessment that's associated with the delegation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-assessmentname
     */
    readonly assessmentName?: string;

    /**
     * The comment that's related to the delegation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-comment
     */
    readonly comment?: string;

    /**
     * The identifier for the control set that's associated with the delegation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-controlsetid
     */
    readonly controlSetId?: string;

    /**
     * The user or role that created the delegation.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `100`
     *
     * *Pattern* : `^[a-zA-Z0-9-_()\\[\\]\\s]+$`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-createdby
     */
    readonly createdBy?: string;

    /**
     * Specifies when the delegation was created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-creationtime
     */
    readonly creationTime?: number;

    /**
     * The unique identifier for the delegation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-id
     */
    readonly id?: string;

    /**
     * Specifies when the delegation was last updated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-lastupdated
     */
    readonly lastUpdated?: number;

    /**
     * The Amazon Resource Name (ARN) of the IAM role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-rolearn
     */
    readonly roleArn?: string;

    /**
     * The type of customer persona.
     *
     * > In `CreateAssessment` , `roleType` can only be `PROCESS_OWNER` .
     * >
     * > In `UpdateSettings` , `roleType` can only be `PROCESS_OWNER` .
     * >
     * > In `BatchCreateDelegationByAssessment` , `roleType` can only be `RESOURCE_OWNER` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-roletype
     */
    readonly roleType?: string;

    /**
     * The status of the delegation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-status
     */
    readonly status?: string;
  }

  /**
   * The `Scope` property type specifies the wrapper that contains the AWS accounts and services that are in scope for the assessment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-scope.html
   */
  export interface ScopeProperty {
    /**
     * The AWS accounts that are included in the scope of the assessment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-scope.html#cfn-auditmanager-assessment-scope-awsaccounts
     */
    readonly awsAccounts?: Array<CfnAssessment.AWSAccountProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The AWS services that are included in the scope of the assessment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-scope.html#cfn-auditmanager-assessment-scope-awsservices
     */
    readonly awsServices?: Array<CfnAssessment.AWSServiceProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The `AWSAccount` property type specifies the wrapper of the AWS account details, such as account ID, email address, and so on.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html
   */
  export interface AWSAccountProperty {
    /**
     * The email address that's associated with the AWS account .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html#cfn-auditmanager-assessment-awsaccount-emailaddress
     */
    readonly emailAddress?: string;

    /**
     * The identifier for the AWS account .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html#cfn-auditmanager-assessment-awsaccount-id
     */
    readonly id?: string;

    /**
     * The name of the AWS account .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html#cfn-auditmanager-assessment-awsaccount-name
     */
    readonly name?: string;
  }

  /**
   * The `AWSService` property type specifies an AWS service such as Amazon S3 , AWS CloudTrail , and so on.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsservice.html
   */
  export interface AWSServiceProperty {
    /**
     * The name of the AWS service .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsservice.html#cfn-auditmanager-assessment-awsservice-servicename
     */
    readonly serviceName?: string;
  }

  /**
   * The `Role` property type specifies the wrapper that contains AWS Audit Manager role information, such as the role type and IAM Amazon Resource Name (ARN).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-role.html
   */
  export interface RoleProperty {
    /**
     * The Amazon Resource Name (ARN) of the IAM role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-role.html#cfn-auditmanager-assessment-role-rolearn
     */
    readonly roleArn?: string;

    /**
     * The type of customer persona.
     *
     * > In `CreateAssessment` , `roleType` can only be `PROCESS_OWNER` .
     * >
     * > In `UpdateSettings` , `roleType` can only be `PROCESS_OWNER` .
     * >
     * > In `BatchCreateDelegationByAssessment` , `roleType` can only be `RESOURCE_OWNER` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-role.html#cfn-auditmanager-assessment-role-roletype
     */
    readonly roleType?: string;
  }
}

/**
 * Properties for defining a `CfnAssessment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html
 */
export interface CfnAssessmentProps {
  /**
   * The destination that evidence reports are stored in for the assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-assessmentreportsdestination
   */
  readonly assessmentReportsDestination?: CfnAssessment.AssessmentReportsDestinationProperty | cdk.IResolvable;

  /**
   * The AWS account that's associated with the assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-awsaccount
   */
  readonly awsAccount?: CfnAssessment.AWSAccountProperty | cdk.IResolvable;

  /**
   * The delegations that are associated with the assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-delegations
   */
  readonly delegations?: Array<CfnAssessment.DelegationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-description
   */
  readonly description?: string;

  /**
   * The unique identifier for the framework.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-frameworkid
   */
  readonly frameworkId?: string;

  /**
   * The name of the assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-name
   */
  readonly name?: string;

  /**
   * The roles that are associated with the assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-roles
   */
  readonly roles?: Array<cdk.IResolvable | CfnAssessment.RoleProperty> | cdk.IResolvable;

  /**
   * The wrapper of AWS accounts and services that are in scope for the assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-scope
   */
  readonly scope?: cdk.IResolvable | CfnAssessment.ScopeProperty;

  /**
   * The overall status of the assessment.
   *
   * When you create a new assessment, the initial `Status` value is always `ACTIVE` . When you create an assessment, even if you specify the value as `INACTIVE` , the value overrides to `ACTIVE` .
   *
   * After you create an assessment, you can change the value of the `Status` property at any time. For example, when you want to stop collecting evidence for your assessment, you can change the assessment status to `INACTIVE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-status
   */
  readonly status?: string;

  /**
   * The tags that are associated with the assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AssessmentReportsDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `AssessmentReportsDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentAssessmentReportsDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  errors.collect(cdk.propertyValidator("destinationType", cdk.validateString)(properties.destinationType));
  return errors.wrap("supplied properties not correct for \"AssessmentReportsDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentAssessmentReportsDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentAssessmentReportsDestinationPropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination),
    "DestinationType": cdk.stringToCloudFormation(properties.destinationType)
  };
}

// @ts-ignore TS6133
function CfnAssessmentAssessmentReportsDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.AssessmentReportsDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.AssessmentReportsDestinationProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined));
  ret.addPropertyResult("destinationType", "DestinationType", (properties.DestinationType != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DelegationProperty`
 *
 * @param properties - the TypeScript properties of a `DelegationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentDelegationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assessmentId", cdk.validateString)(properties.assessmentId));
  errors.collect(cdk.propertyValidator("assessmentName", cdk.validateString)(properties.assessmentName));
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("controlSetId", cdk.validateString)(properties.controlSetId));
  errors.collect(cdk.propertyValidator("createdBy", cdk.validateString)(properties.createdBy));
  errors.collect(cdk.propertyValidator("creationTime", cdk.validateNumber)(properties.creationTime));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("lastUpdated", cdk.validateNumber)(properties.lastUpdated));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleType", cdk.validateString)(properties.roleType));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"DelegationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentDelegationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentDelegationPropertyValidator(properties).assertSuccess();
  return {
    "AssessmentId": cdk.stringToCloudFormation(properties.assessmentId),
    "AssessmentName": cdk.stringToCloudFormation(properties.assessmentName),
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "ControlSetId": cdk.stringToCloudFormation(properties.controlSetId),
    "CreatedBy": cdk.stringToCloudFormation(properties.createdBy),
    "CreationTime": cdk.numberToCloudFormation(properties.creationTime),
    "Id": cdk.stringToCloudFormation(properties.id),
    "LastUpdated": cdk.numberToCloudFormation(properties.lastUpdated),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "RoleType": cdk.stringToCloudFormation(properties.roleType),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnAssessmentDelegationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.DelegationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.DelegationProperty>();
  ret.addPropertyResult("assessmentId", "AssessmentId", (properties.AssessmentId != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentId) : undefined));
  ret.addPropertyResult("assessmentName", "AssessmentName", (properties.AssessmentName != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentName) : undefined));
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("controlSetId", "ControlSetId", (properties.ControlSetId != null ? cfn_parse.FromCloudFormation.getString(properties.ControlSetId) : undefined));
  ret.addPropertyResult("createdBy", "CreatedBy", (properties.CreatedBy != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedBy) : undefined));
  ret.addPropertyResult("creationTime", "CreationTime", (properties.CreationTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.CreationTime) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("lastUpdated", "LastUpdated", (properties.LastUpdated != null ? cfn_parse.FromCloudFormation.getNumber(properties.LastUpdated) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("roleType", "RoleType", (properties.RoleType != null ? cfn_parse.FromCloudFormation.getString(properties.RoleType) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AWSAccountProperty`
 *
 * @param properties - the TypeScript properties of a `AWSAccountProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentAWSAccountPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("emailAddress", cdk.validateString)(properties.emailAddress));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"AWSAccountProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentAWSAccountPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentAWSAccountPropertyValidator(properties).assertSuccess();
  return {
    "EmailAddress": cdk.stringToCloudFormation(properties.emailAddress),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnAssessmentAWSAccountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.AWSAccountProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.AWSAccountProperty>();
  ret.addPropertyResult("emailAddress", "EmailAddress", (properties.EmailAddress != null ? cfn_parse.FromCloudFormation.getString(properties.EmailAddress) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AWSServiceProperty`
 *
 * @param properties - the TypeScript properties of a `AWSServiceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentAWSServicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  return errors.wrap("supplied properties not correct for \"AWSServiceProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentAWSServicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentAWSServicePropertyValidator(properties).assertSuccess();
  return {
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName)
  };
}

// @ts-ignore TS6133
function CfnAssessmentAWSServicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.AWSServiceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.AWSServiceProperty>();
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScopeProperty`
 *
 * @param properties - the TypeScript properties of a `ScopeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentScopePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsAccounts", cdk.listValidator(CfnAssessmentAWSAccountPropertyValidator))(properties.awsAccounts));
  errors.collect(cdk.propertyValidator("awsServices", cdk.listValidator(CfnAssessmentAWSServicePropertyValidator))(properties.awsServices));
  return errors.wrap("supplied properties not correct for \"ScopeProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentScopePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentScopePropertyValidator(properties).assertSuccess();
  return {
    "AwsAccounts": cdk.listMapper(convertCfnAssessmentAWSAccountPropertyToCloudFormation)(properties.awsAccounts),
    "AwsServices": cdk.listMapper(convertCfnAssessmentAWSServicePropertyToCloudFormation)(properties.awsServices)
  };
}

// @ts-ignore TS6133
function CfnAssessmentScopePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssessment.ScopeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.ScopeProperty>();
  ret.addPropertyResult("awsAccounts", "AwsAccounts", (properties.AwsAccounts != null ? cfn_parse.FromCloudFormation.getArray(CfnAssessmentAWSAccountPropertyFromCloudFormation)(properties.AwsAccounts) : undefined));
  ret.addPropertyResult("awsServices", "AwsServices", (properties.AwsServices != null ? cfn_parse.FromCloudFormation.getArray(CfnAssessmentAWSServicePropertyFromCloudFormation)(properties.AwsServices) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RoleProperty`
 *
 * @param properties - the TypeScript properties of a `RoleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentRolePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleType", cdk.validateString)(properties.roleType));
  return errors.wrap("supplied properties not correct for \"RoleProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentRolePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentRolePropertyValidator(properties).assertSuccess();
  return {
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "RoleType": cdk.stringToCloudFormation(properties.roleType)
  };
}

// @ts-ignore TS6133
function CfnAssessmentRolePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssessment.RoleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.RoleProperty>();
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("roleType", "RoleType", (properties.RoleType != null ? cfn_parse.FromCloudFormation.getString(properties.RoleType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAssessmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssessmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assessmentReportsDestination", CfnAssessmentAssessmentReportsDestinationPropertyValidator)(properties.assessmentReportsDestination));
  errors.collect(cdk.propertyValidator("awsAccount", CfnAssessmentAWSAccountPropertyValidator)(properties.awsAccount));
  errors.collect(cdk.propertyValidator("delegations", cdk.listValidator(CfnAssessmentDelegationPropertyValidator))(properties.delegations));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("frameworkId", cdk.validateString)(properties.frameworkId));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roles", cdk.listValidator(CfnAssessmentRolePropertyValidator))(properties.roles));
  errors.collect(cdk.propertyValidator("scope", CfnAssessmentScopePropertyValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAssessmentProps\"");
}

// @ts-ignore TS6133
function convertCfnAssessmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssessmentPropsValidator(properties).assertSuccess();
  return {
    "AssessmentReportsDestination": convertCfnAssessmentAssessmentReportsDestinationPropertyToCloudFormation(properties.assessmentReportsDestination),
    "AwsAccount": convertCfnAssessmentAWSAccountPropertyToCloudFormation(properties.awsAccount),
    "Delegations": cdk.listMapper(convertCfnAssessmentDelegationPropertyToCloudFormation)(properties.delegations),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FrameworkId": cdk.stringToCloudFormation(properties.frameworkId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Roles": cdk.listMapper(convertCfnAssessmentRolePropertyToCloudFormation)(properties.roles),
    "Scope": convertCfnAssessmentScopePropertyToCloudFormation(properties.scope),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAssessmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessmentProps>();
  ret.addPropertyResult("assessmentReportsDestination", "AssessmentReportsDestination", (properties.AssessmentReportsDestination != null ? CfnAssessmentAssessmentReportsDestinationPropertyFromCloudFormation(properties.AssessmentReportsDestination) : undefined));
  ret.addPropertyResult("awsAccount", "AwsAccount", (properties.AwsAccount != null ? CfnAssessmentAWSAccountPropertyFromCloudFormation(properties.AwsAccount) : undefined));
  ret.addPropertyResult("delegations", "Delegations", (properties.Delegations != null ? cfn_parse.FromCloudFormation.getArray(CfnAssessmentDelegationPropertyFromCloudFormation)(properties.Delegations) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("frameworkId", "FrameworkId", (properties.FrameworkId != null ? cfn_parse.FromCloudFormation.getString(properties.FrameworkId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roles", "Roles", (properties.Roles != null ? cfn_parse.FromCloudFormation.getArray(CfnAssessmentRolePropertyFromCloudFormation)(properties.Roles) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? CfnAssessmentScopePropertyFromCloudFormation(properties.Scope) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}