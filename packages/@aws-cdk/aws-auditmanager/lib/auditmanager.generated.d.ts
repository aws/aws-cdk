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
 * A CloudFormation `AWS::AuditManager::Assessment`
 *
 * The `AWS::AuditManager::Assessment` resource is an Audit Manager resource type that defines the scope of audit evidence collected by Audit Manager . An Audit Manager assessment is an implementation of an Audit Manager framework.
 *
 * @cloudformationResource AWS::AuditManager::Assessment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html
 */
export declare class CfnAssessment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AuditManager::Assessment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssessment;
    /**
     * The Amazon Resource Name (ARN) of the assessment. For example, `arn:aws:auditmanager:us-east-1:123456789012:assessment/111A1A1A-22B2-33C3-DDD4-55E5E5E555E5` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The unique identifier for the assessment. For example, `111A1A1A-22B2-33C3-DDD4-55E5E5E555E5` .
     * @cloudformationAttribute AssessmentId
     */
    readonly attrAssessmentId: string;
    /**
     * The time when the assessment was created. For example, `1607582033.373` .
     * @cloudformationAttribute CreationTime
     */
    readonly attrCreationTime: cdk.IResolvable;
    /**
     * The destination that evidence reports are stored in for the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-assessmentreportsdestination
     */
    assessmentReportsDestination: CfnAssessment.AssessmentReportsDestinationProperty | cdk.IResolvable | undefined;
    /**
     * The AWS account that's associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-awsaccount
     */
    awsAccount: CfnAssessment.AWSAccountProperty | cdk.IResolvable | undefined;
    /**
     * The delegations that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-delegations
     */
    delegations: Array<CfnAssessment.DelegationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The description of the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-description
     */
    description: string | undefined;
    /**
     * The unique identifier for the framework.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-frameworkid
     */
    frameworkId: string | undefined;
    /**
     * The name of the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-name
     */
    name: string | undefined;
    /**
     * The roles that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-roles
     */
    roles: Array<CfnAssessment.RoleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The wrapper of AWS accounts and services that are in scope for the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-scope
     */
    scope: CfnAssessment.ScopeProperty | cdk.IResolvable | undefined;
    /**
     * The overall status of the assessment.
     *
     * When you create a new assessment, the initial `Status` value is always `ACTIVE` . When you create an assessment, even if you specify the value as `INACTIVE` , the value overrides to `ACTIVE` .
     *
     * After you create an assessment, you can change the value of the `Status` property at any time. For example, when you want to stop collecting evidence for your assessment, you can change the assessment status to `INACTIVE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-status
     */
    status: string | undefined;
    /**
     * The tags that are associated with the assessment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-auditmanager-assessment.html#cfn-auditmanager-assessment-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::AuditManager::Assessment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnAssessmentProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnAssessment {
    /**
     * The `AWSAccount` property type specifies the wrapper of the AWS account details, such as account ID, email address, and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsaccount.html
     */
    interface AWSAccountProperty {
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
export declare namespace CfnAssessment {
    /**
     * The `AWSService` property type specifies an AWS service such as Amazon S3 , AWS CloudTrail , and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsservice.html
     */
    interface AWSServiceProperty {
        /**
         * The name of the AWS service .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-awsservice.html#cfn-auditmanager-assessment-awsservice-servicename
         */
        readonly serviceName?: string;
    }
}
export declare namespace CfnAssessment {
    /**
     * The `AssessmentReportsDestination` property type specifies the location in which AWS Audit Manager saves assessment reports for the given assessment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-assessmentreportsdestination.html
     */
    interface AssessmentReportsDestinationProperty {
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
export declare namespace CfnAssessment {
    /**
     * The `Delegation` property type specifies the assignment of a control set to a delegate for review.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-delegation.html
     */
    interface DelegationProperty {
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
export declare namespace CfnAssessment {
    /**
     * The `Role` property type specifies the wrapper that contains AWS Audit Manager role information, such as the role type and IAM Amazon Resource Name (ARN).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-role.html
     */
    interface RoleProperty {
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
export declare namespace CfnAssessment {
    /**
     * The `Scope` property type specifies the wrapper that contains the AWS accounts and services that are in scope for the assessment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-auditmanager-assessment-scope.html
     */
    interface ScopeProperty {
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
