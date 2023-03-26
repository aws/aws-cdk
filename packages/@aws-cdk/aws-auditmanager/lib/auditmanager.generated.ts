// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:12.170Z","fingerprint":"sJ/7uCE+vqjzcr8vLgTvY1Li0eNk7hzSEyEOT9mGfdY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAssessment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html
 */
export interface CfnAssessmentProps {

    /**
     * The destination that evidence reports are stored in for the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-assessmentreportsdestination
     */
    readonly assessmentReportsDestination?: CfnAssessment.AssessmentReportsDestinationProperty | cdk.IResolvable;

    /**
     * The AWS account that's associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-awsaccount
     */
    readonly awsAccount?: CfnAssessment.AWSAccountProperty | cdk.IResolvable;

    /**
     * The delegations that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-delegations
     */
    readonly delegations?: Array<CfnAssessment.DelegationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The description of the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-description
     */
    readonly description?: string;

    /**
     * The unique identifier for the framework.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-frameworkid
     */
    readonly frameworkId?: string;

    /**
     * The name of the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-name
     */
    readonly name?: string;

    /**
     * The roles that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-roles
     */
    readonly roles?: Array<CfnAssessment.RoleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The wrapper of AWS accounts and services that are in scope for the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-scope
     */
    readonly scope?: CfnAssessment.ScopeProperty | cdk.IResolvable;

    /**
     * The overall status of the assessment.
     *
     * When you create a new assessment, the initial `Status` value is always `ACTIVE` . When you create an assessment, even if you specify the value as `INACTIVE` , the value overrides to `ACTIVE` .
     *
     * After you create an assessment, you can change the value of the `Status` property at any time. For example, when you want to stop collecting evidence for your assessment, you can change the assessment status to `INACTIVE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-status
     */
    readonly status?: string;

    /**
     * The tags that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAssessmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentProps`
 *
 * @returns the result of the validation.
 */
function CfnAssessmentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assessmentReportsDestination', CfnAssessment_AssessmentReportsDestinationPropertyValidator)(properties.assessmentReportsDestination));
    errors.collect(cdk.propertyValidator('awsAccount', CfnAssessment_AWSAccountPropertyValidator)(properties.awsAccount));
    errors.collect(cdk.propertyValidator('delegations', cdk.listValidator(CfnAssessment_DelegationPropertyValidator))(properties.delegations));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('frameworkId', cdk.validateString)(properties.frameworkId));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('roles', cdk.listValidator(CfnAssessment_RolePropertyValidator))(properties.roles));
    errors.collect(cdk.propertyValidator('scope', CfnAssessment_ScopePropertyValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAssessmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AuditManager::Assessment` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AuditManager::Assessment` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessmentPropsValidator(properties).assertSuccess();
    return {
        AssessmentReportsDestination: cfnAssessmentAssessmentReportsDestinationPropertyToCloudFormation(properties.assessmentReportsDestination),
        AwsAccount: cfnAssessmentAWSAccountPropertyToCloudFormation(properties.awsAccount),
        Delegations: cdk.listMapper(cfnAssessmentDelegationPropertyToCloudFormation)(properties.delegations),
        Description: cdk.stringToCloudFormation(properties.description),
        FrameworkId: cdk.stringToCloudFormation(properties.frameworkId),
        Name: cdk.stringToCloudFormation(properties.name),
        Roles: cdk.listMapper(cfnAssessmentRolePropertyToCloudFormation)(properties.roles),
        Scope: cfnAssessmentScopePropertyToCloudFormation(properties.scope),
        Status: cdk.stringToCloudFormation(properties.status),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAssessmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessmentProps>();
    ret.addPropertyResult('assessmentReportsDestination', 'AssessmentReportsDestination', properties.AssessmentReportsDestination != null ? CfnAssessmentAssessmentReportsDestinationPropertyFromCloudFormation(properties.AssessmentReportsDestination) : undefined);
    ret.addPropertyResult('awsAccount', 'AwsAccount', properties.AwsAccount != null ? CfnAssessmentAWSAccountPropertyFromCloudFormation(properties.AwsAccount) : undefined);
    ret.addPropertyResult('delegations', 'Delegations', properties.Delegations != null ? cfn_parse.FromCloudFormation.getArray(CfnAssessmentDelegationPropertyFromCloudFormation)(properties.Delegations) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('frameworkId', 'FrameworkId', properties.FrameworkId != null ? cfn_parse.FromCloudFormation.getString(properties.FrameworkId) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('roles', 'Roles', properties.Roles != null ? cfn_parse.FromCloudFormation.getArray(CfnAssessmentRolePropertyFromCloudFormation)(properties.Roles) : undefined);
    ret.addPropertyResult('scope', 'Scope', properties.Scope != null ? CfnAssessmentScopePropertyFromCloudFormation(properties.Scope) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AuditManager::Assessment`
 *
 * The `AWS::AuditManager::Assessment` resource is an Audit Manager resource type that defines the scope of audit evidence collected by Audit Manager . An Audit Manager assessment is an implementation of an Audit Manager framework.
 *
 * @cloudformationResource AWS::AuditManager::Assessment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html
 */
export class CfnAssessment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AuditManager::Assessment";

    /**
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
        const ret = new CfnAssessment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the assessment. For example, `arn:aws:auditmanager:us-east-1:123456789012:assessment/111A1A1A-22B2-33C3-DDD4-55E5E5E555E5` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier for the assessment. For example, `111A1A1A-22B2-33C3-DDD4-55E5E5E555E5` .
     * @cloudformationAttribute AssessmentId
     */
    public readonly attrAssessmentId: string;

    /**
     * The time when the assessment was created. For example, `1607582033.373` .
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: cdk.IResolvable;

    /**
     * The destination that evidence reports are stored in for the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-assessmentreportsdestination
     */
    public assessmentReportsDestination: CfnAssessment.AssessmentReportsDestinationProperty | cdk.IResolvable | undefined;

    /**
     * The AWS account that's associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-awsaccount
     */
    public awsAccount: CfnAssessment.AWSAccountProperty | cdk.IResolvable | undefined;

    /**
     * The delegations that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-delegations
     */
    public delegations: Array<CfnAssessment.DelegationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The description of the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-description
     */
    public description: string | undefined;

    /**
     * The unique identifier for the framework.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-frameworkid
     */
    public frameworkId: string | undefined;

    /**
     * The name of the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-name
     */
    public name: string | undefined;

    /**
     * The roles that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-roles
     */
    public roles: Array<CfnAssessment.RoleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The wrapper of AWS accounts and services that are in scope for the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-scope
     */
    public scope: CfnAssessment.ScopeProperty | cdk.IResolvable | undefined;

    /**
     * The overall status of the assessment.
     *
     * When you create a new assessment, the initial `Status` value is always `ACTIVE` . When you create an assessment, even if you specify the value as `INACTIVE` , the value overrides to `ACTIVE` .
     *
     * After you create an assessment, you can change the value of the `Status` property at any time. For example, when you want to stop collecting evidence for your assessment, you can change the assessment status to `INACTIVE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-status
     */
    public status: string | undefined;

    /**
     * The tags that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AuditManager::Assessment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssessmentProps = {}) {
        super(scope, id, { type: CfnAssessment.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrAssessmentId = cdk.Token.asString(this.getAtt('AssessmentId', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING);

        this.assessmentReportsDestination = props.assessmentReportsDestination;
        this.awsAccount = props.awsAccount;
        this.delegations = props.delegations;
        this.description = props.description;
        this.frameworkId = props.frameworkId;
        this.name = props.name;
        this.roles = props.roles;
        this.scope = props.scope;
        this.status = props.status;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AuditManager::Assessment", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssessment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            assessmentReportsDestination: this.assessmentReportsDestination,
            awsAccount: this.awsAccount,
            delegations: this.delegations,
            description: this.description,
            frameworkId: this.frameworkId,
            name: this.name,
            roles: this.roles,
            scope: this.scope,
            status: this.status,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssessmentPropsToCloudFormation(props);
    }
}

export namespace CfnAssessment {
    /**
     * The `AWSAccount` property type specifies the wrapper of the AWS account details, such as account ID, email address, and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html
     */
    export interface AWSAccountProperty {
        /**
         * The email address that's associated with the AWS account .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html#cfn-auditmanager-assessment-awsaccount-emailaddress
         */
        readonly emailAddress?: string;
        /**
         * The identifier for the AWS account .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html#cfn-auditmanager-assessment-awsaccount-id
         */
        readonly id?: string;
        /**
         * The name of the AWS account .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html#cfn-auditmanager-assessment-awsaccount-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AWSAccountProperty`
 *
 * @param properties - the TypeScript properties of a `AWSAccountProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssessment_AWSAccountPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('emailAddress', cdk.validateString)(properties.emailAddress));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "AWSAccountProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.AWSAccount` resource
 *
 * @param properties - the TypeScript properties of a `AWSAccountProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.AWSAccount` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentAWSAccountPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessment_AWSAccountPropertyValidator(properties).assertSuccess();
    return {
        EmailAddress: cdk.stringToCloudFormation(properties.emailAddress),
        Id: cdk.stringToCloudFormation(properties.id),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnAssessmentAWSAccountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.AWSAccountProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.AWSAccountProperty>();
    ret.addPropertyResult('emailAddress', 'EmailAddress', properties.EmailAddress != null ? cfn_parse.FromCloudFormation.getString(properties.EmailAddress) : undefined);
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssessment {
    /**
     * The `AWSService` property type specifies an AWS service such as Amazon S3 , AWS CloudTrail , and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsservice.html
     */
    export interface AWSServiceProperty {
        /**
         * The name of the AWS service .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsservice.html#cfn-auditmanager-assessment-awsservice-servicename
         */
        readonly serviceName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AWSServiceProperty`
 *
 * @param properties - the TypeScript properties of a `AWSServiceProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssessment_AWSServicePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('serviceName', cdk.validateString)(properties.serviceName));
    return errors.wrap('supplied properties not correct for "AWSServiceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.AWSService` resource
 *
 * @param properties - the TypeScript properties of a `AWSServiceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.AWSService` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentAWSServicePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessment_AWSServicePropertyValidator(properties).assertSuccess();
    return {
        ServiceName: cdk.stringToCloudFormation(properties.serviceName),
    };
}

// @ts-ignore TS6133
function CfnAssessmentAWSServicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.AWSServiceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.AWSServiceProperty>();
    ret.addPropertyResult('serviceName', 'ServiceName', properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssessment {
    /**
     * The `AssessmentReportsDestination` property type specifies the location in which AWS Audit Manager saves assessment reports for the given assessment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-assessmentreportsdestination.html
     */
    export interface AssessmentReportsDestinationProperty {
        /**
         * The destination of the assessment report.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-assessmentreportsdestination.html#cfn-auditmanager-assessment-assessmentreportsdestination-destination
         */
        readonly destination?: string;
        /**
         * The destination type, such as Amazon S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-assessmentreportsdestination.html#cfn-auditmanager-assessment-assessmentreportsdestination-destinationtype
         */
        readonly destinationType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AssessmentReportsDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `AssessmentReportsDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssessment_AssessmentReportsDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    errors.collect(cdk.propertyValidator('destinationType', cdk.validateString)(properties.destinationType));
    return errors.wrap('supplied properties not correct for "AssessmentReportsDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.AssessmentReportsDestination` resource
 *
 * @param properties - the TypeScript properties of a `AssessmentReportsDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.AssessmentReportsDestination` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentAssessmentReportsDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessment_AssessmentReportsDestinationPropertyValidator(properties).assertSuccess();
    return {
        Destination: cdk.stringToCloudFormation(properties.destination),
        DestinationType: cdk.stringToCloudFormation(properties.destinationType),
    };
}

// @ts-ignore TS6133
function CfnAssessmentAssessmentReportsDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.AssessmentReportsDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.AssessmentReportsDestinationProperty>();
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined);
    ret.addPropertyResult('destinationType', 'DestinationType', properties.DestinationType != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssessment {
    /**
     * The `Delegation` property type specifies the assignment of a control set to a delegate for review.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html
     */
    export interface DelegationProperty {
        /**
         * The identifier for the assessment that's associated with the delegation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-assessmentid
         */
        readonly assessmentId?: string;
        /**
         * The name of the assessment that's associated with the delegation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-assessmentname
         */
        readonly assessmentName?: string;
        /**
         * The comment that's related to the delegation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-comment
         */
        readonly comment?: string;
        /**
         * The identifier for the control set that's associated with the delegation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-controlsetid
         */
        readonly controlSetId?: string;
        /**
         * The IAM user or role that created the delegation.
         *
         * *Minimum* : `1`
         *
         * *Maximum* : `100`
         *
         * *Pattern* : `^[a-zA-Z0-9-_()\\[\\]\\s]+$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-createdby
         */
        readonly createdBy?: string;
        /**
         * Specifies when the delegation was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-creationtime
         */
        readonly creationTime?: number;
        /**
         * The unique identifier for the delegation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-id
         */
        readonly id?: string;
        /**
         * Specifies when the delegation was last updated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-lastupdated
         */
        readonly lastUpdated?: number;
        /**
         * The Amazon Resource Name (ARN) of the IAM role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-rolearn
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-roletype
         */
        readonly roleType?: string;
        /**
         * The status of the delegation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html#cfn-auditmanager-assessment-delegation-status
         */
        readonly status?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DelegationProperty`
 *
 * @param properties - the TypeScript properties of a `DelegationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssessment_DelegationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assessmentId', cdk.validateString)(properties.assessmentId));
    errors.collect(cdk.propertyValidator('assessmentName', cdk.validateString)(properties.assessmentName));
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('controlSetId', cdk.validateString)(properties.controlSetId));
    errors.collect(cdk.propertyValidator('createdBy', cdk.validateString)(properties.createdBy));
    errors.collect(cdk.propertyValidator('creationTime', cdk.validateNumber)(properties.creationTime));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('lastUpdated', cdk.validateNumber)(properties.lastUpdated));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleType', cdk.validateString)(properties.roleType));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "DelegationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.Delegation` resource
 *
 * @param properties - the TypeScript properties of a `DelegationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.Delegation` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentDelegationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessment_DelegationPropertyValidator(properties).assertSuccess();
    return {
        AssessmentId: cdk.stringToCloudFormation(properties.assessmentId),
        AssessmentName: cdk.stringToCloudFormation(properties.assessmentName),
        Comment: cdk.stringToCloudFormation(properties.comment),
        ControlSetId: cdk.stringToCloudFormation(properties.controlSetId),
        CreatedBy: cdk.stringToCloudFormation(properties.createdBy),
        CreationTime: cdk.numberToCloudFormation(properties.creationTime),
        Id: cdk.stringToCloudFormation(properties.id),
        LastUpdated: cdk.numberToCloudFormation(properties.lastUpdated),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        RoleType: cdk.stringToCloudFormation(properties.roleType),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnAssessmentDelegationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.DelegationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.DelegationProperty>();
    ret.addPropertyResult('assessmentId', 'AssessmentId', properties.AssessmentId != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentId) : undefined);
    ret.addPropertyResult('assessmentName', 'AssessmentName', properties.AssessmentName != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentName) : undefined);
    ret.addPropertyResult('comment', 'Comment', properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined);
    ret.addPropertyResult('controlSetId', 'ControlSetId', properties.ControlSetId != null ? cfn_parse.FromCloudFormation.getString(properties.ControlSetId) : undefined);
    ret.addPropertyResult('createdBy', 'CreatedBy', properties.CreatedBy != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedBy) : undefined);
    ret.addPropertyResult('creationTime', 'CreationTime', properties.CreationTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.CreationTime) : undefined);
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addPropertyResult('lastUpdated', 'LastUpdated', properties.LastUpdated != null ? cfn_parse.FromCloudFormation.getNumber(properties.LastUpdated) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addPropertyResult('roleType', 'RoleType', properties.RoleType != null ? cfn_parse.FromCloudFormation.getString(properties.RoleType) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssessment {
    /**
     * The `Role` property type specifies the wrapper that contains AWS Audit Manager role information, such as the role type and IAM Amazon Resource Name (ARN).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-role.html
     */
    export interface RoleProperty {
        /**
         * The Amazon Resource Name (ARN) of the IAM role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-role.html#cfn-auditmanager-assessment-role-rolearn
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-role.html#cfn-auditmanager-assessment-role-roletype
         */
        readonly roleType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RoleProperty`
 *
 * @param properties - the TypeScript properties of a `RoleProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssessment_RolePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleType', cdk.validateString)(properties.roleType));
    return errors.wrap('supplied properties not correct for "RoleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.Role` resource
 *
 * @param properties - the TypeScript properties of a `RoleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.Role` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentRolePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessment_RolePropertyValidator(properties).assertSuccess();
    return {
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        RoleType: cdk.stringToCloudFormation(properties.roleType),
    };
}

// @ts-ignore TS6133
function CfnAssessmentRolePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.RoleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.RoleProperty>();
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addPropertyResult('roleType', 'RoleType', properties.RoleType != null ? cfn_parse.FromCloudFormation.getString(properties.RoleType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssessment {
    /**
     * The `Scope` property type specifies the wrapper that contains the AWS accounts and services that are in scope for the assessment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-scope.html
     */
    export interface ScopeProperty {
        /**
         * The AWS accounts that are included in the scope of the assessment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-scope.html#cfn-auditmanager-assessment-scope-awsaccounts
         */
        readonly awsAccounts?: Array<CfnAssessment.AWSAccountProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The AWS services that are included in the scope of the assessment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-scope.html#cfn-auditmanager-assessment-scope-awsservices
         */
        readonly awsServices?: Array<CfnAssessment.AWSServiceProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ScopeProperty`
 *
 * @param properties - the TypeScript properties of a `ScopeProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssessment_ScopePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsAccounts', cdk.listValidator(CfnAssessment_AWSAccountPropertyValidator))(properties.awsAccounts));
    errors.collect(cdk.propertyValidator('awsServices', cdk.listValidator(CfnAssessment_AWSServicePropertyValidator))(properties.awsServices));
    return errors.wrap('supplied properties not correct for "ScopeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.Scope` resource
 *
 * @param properties - the TypeScript properties of a `ScopeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AuditManager::Assessment.Scope` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentScopePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssessment_ScopePropertyValidator(properties).assertSuccess();
    return {
        AwsAccounts: cdk.listMapper(cfnAssessmentAWSAccountPropertyToCloudFormation)(properties.awsAccounts),
        AwsServices: cdk.listMapper(cfnAssessmentAWSServicePropertyToCloudFormation)(properties.awsServices),
    };
}

// @ts-ignore TS6133
function CfnAssessmentScopePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssessment.ScopeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssessment.ScopeProperty>();
    ret.addPropertyResult('awsAccounts', 'AwsAccounts', properties.AwsAccounts != null ? cfn_parse.FromCloudFormation.getArray(CfnAssessmentAWSAccountPropertyFromCloudFormation)(properties.AwsAccounts) : undefined);
    ret.addPropertyResult('awsServices', 'AwsServices', properties.AwsServices != null ? cfn_parse.FromCloudFormation.getArray(CfnAssessmentAWSServicePropertyFromCloudFormation)(properties.AwsServices) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
