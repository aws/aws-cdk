// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-30T13:43:43.223Z","fingerprint":"r5WAhJhzXIizrrniDkxJsynojW4filnoumU+qBB/Tgk="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html
 */
export interface CfnAssociationProps {

    /**
     * The name of the SSM document that contains the configuration information for the instance. You can specify `Command` or `Automation` documents. The documents can be AWS -predefined documents, documents you created, or a document that is shared with you from another account. For SSM documents that are shared with you from other AWS accounts , you must specify the complete SSM document ARN, in the following format:
     *
     * `arn:partition:ssm:region:account-id:document/document-name`
     *
     * For example: `arn:aws:ssm:us-east-2:12345678912:document/My-Shared-Document`
     *
     * For AWS -predefined documents and SSM documents you created in your account, you only need to specify the document name. For example, `AWS -ApplyPatchBaseline` or `My-Document` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-name
     */
    readonly name: string;

    /**
     * By default, when you create a new association, the system runs it immediately after it is created and then according to the schedule you specified. Specify this option if you don't want an association to run immediately after you create it. This parameter is not supported for rate expressions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-applyonlyatcroninterval
     */
    readonly applyOnlyAtCronInterval?: boolean | cdk.IResolvable;

    /**
     * Specify a descriptive name for the association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-associationname
     */
    readonly associationName?: string;

    /**
     * Choose the parameter that will define how your automation will branch out. This target is required for associations that use an Automation runbook and target resources by using rate controls. Automation is a capability of AWS Systems Manager .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-automationtargetparametername
     */
    readonly automationTargetParameterName?: string;

    /**
     * The names or Amazon Resource Names (ARNs) of the Change Calendar type documents your associations are gated under. The associations only run when that Change Calendar is open. For more information, see [AWS Systems Manager Change Calendar](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-change-calendar) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-calendarnames
     */
    readonly calendarNames?: string[];

    /**
     * The severity level that is assigned to the association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-complianceseverity
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-documentversion
     */
    readonly documentVersion?: string;

    /**
     * The ID of the instance that the SSM document is associated with. You must specify the `InstanceId` or `Targets` property.
     *
     * > `InstanceId` has been deprecated. To specify an instance ID for an association, use the `Targets` parameter. If you use the parameter `InstanceId` , you cannot use the parameters `AssociationName` , `DocumentVersion` , `MaxErrors` , `MaxConcurrency` , `OutputLocation` , or `ScheduleExpression` . To use these parameters, you must use the `Targets` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-instanceid
     */
    readonly instanceId?: string;

    /**
     * The maximum number of targets allowed to run the association at the same time. You can specify a number, for example 10, or a percentage of the target set, for example 10%. The default value is 100%, which means all targets run the association at the same time.
     *
     * If a new managed node starts and attempts to run an association while Systems Manager is running `MaxConcurrency` associations, the association is allowed to run. During the next association interval, the new managed node will process its association within the limit specified for `MaxConcurrency` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-maxconcurrency
     */
    readonly maxConcurrency?: string;

    /**
     * The number of errors that are allowed before the system stops sending requests to run the association on additional targets. You can specify either an absolute number of errors, for example 10, or a percentage of the target set, for example 10%. If you specify 3, for example, the system stops sending requests when the fourth error is received. If you specify 0, then the system stops sending requests after the first error is returned. If you run an association on 50 managed nodes and set `MaxError` to 10%, then the system stops sending the request when the sixth error is received.
     *
     * Executions that are already running an association when `MaxErrors` is reached are allowed to complete, but some of these executions may fail as well. If you need to ensure that there won't be more than max-errors failed executions, set `MaxConcurrency` to 1 so that executions proceed one at a time.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-maxerrors
     */
    readonly maxErrors?: string;

    /**
     * An Amazon Simple Storage Service (Amazon S3) bucket where you want to store the output details of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-outputlocation
     */
    readonly outputLocation?: CfnAssociation.InstanceAssociationOutputLocationProperty | cdk.IResolvable;

    /**
     * The parameters for the runtime configuration of the document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * A cron expression that specifies a schedule when the association runs. The schedule runs in Coordinated Universal Time (UTC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-scheduleexpression
     */
    readonly scheduleExpression?: string;

    /**
     * Number of days to wait after the scheduled day to run an association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-scheduleoffset
     */
    readonly scheduleOffset?: number;

    /**
     * The mode for generating association compliance. You can specify `AUTO` or `MANUAL` . In `AUTO` mode, the system uses the status of the association execution to determine the compliance status. If the association execution runs successfully, then the association is `COMPLIANT` . If the association execution doesn't run successfully, the association is `NON-COMPLIANT` .
     *
     * In `MANUAL` mode, you must specify the `AssociationId` as a parameter for the PutComplianceItems API action. In this case, compliance data is not managed by State Manager. It is managed by your direct call to the PutComplianceItems API action.
     *
     * By default, all associations use `AUTO` mode.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-synccompliance
     */
    readonly syncCompliance?: string;

    /**
     * The targets for the association. You must specify the `InstanceId` or `Targets` property. You can target all instances in an AWS account by specifying the `InstanceIds` key with a value of `*` . To view a JSON and a YAML example that targets all instances, see "Create an association for all managed instances in an AWS account " on the Examples page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-targets
     */
    readonly targets?: Array<CfnAssociation.TargetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The number of seconds the service should wait for the association status to show "Success" before proceeding with the stack execution. If the association status doesn't show "Success" after the specified number of seconds, then stack creation fails.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-waitforsuccesstimeoutseconds
     */
    readonly waitForSuccessTimeoutSeconds?: number;
}

/**
 * Determine whether the given properties match those of a `CfnAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applyOnlyAtCronInterval', cdk.validateBoolean)(properties.applyOnlyAtCronInterval));
    errors.collect(cdk.propertyValidator('associationName', cdk.validateString)(properties.associationName));
    errors.collect(cdk.propertyValidator('automationTargetParameterName', cdk.validateString)(properties.automationTargetParameterName));
    errors.collect(cdk.propertyValidator('calendarNames', cdk.listValidator(cdk.validateString))(properties.calendarNames));
    errors.collect(cdk.propertyValidator('complianceSeverity', cdk.validateString)(properties.complianceSeverity));
    errors.collect(cdk.propertyValidator('documentVersion', cdk.validateString)(properties.documentVersion));
    errors.collect(cdk.propertyValidator('instanceId', cdk.validateString)(properties.instanceId));
    errors.collect(cdk.propertyValidator('maxConcurrency', cdk.validateString)(properties.maxConcurrency));
    errors.collect(cdk.propertyValidator('maxErrors', cdk.validateString)(properties.maxErrors));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('outputLocation', CfnAssociation_InstanceAssociationOutputLocationPropertyValidator)(properties.outputLocation));
    errors.collect(cdk.propertyValidator('parameters', cdk.validateObject)(properties.parameters));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleOffset', cdk.validateNumber)(properties.scheduleOffset));
    errors.collect(cdk.propertyValidator('syncCompliance', cdk.validateString)(properties.syncCompliance));
    errors.collect(cdk.propertyValidator('targets', cdk.listValidator(CfnAssociation_TargetPropertyValidator))(properties.targets));
    errors.collect(cdk.propertyValidator('waitForSuccessTimeoutSeconds', cdk.validateNumber)(properties.waitForSuccessTimeoutSeconds));
    return errors.wrap('supplied properties not correct for "CfnAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::Association` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::Association` resource.
 */
// @ts-ignore TS6133
function cfnAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssociationPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ApplyOnlyAtCronInterval: cdk.booleanToCloudFormation(properties.applyOnlyAtCronInterval),
        AssociationName: cdk.stringToCloudFormation(properties.associationName),
        AutomationTargetParameterName: cdk.stringToCloudFormation(properties.automationTargetParameterName),
        CalendarNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.calendarNames),
        ComplianceSeverity: cdk.stringToCloudFormation(properties.complianceSeverity),
        DocumentVersion: cdk.stringToCloudFormation(properties.documentVersion),
        InstanceId: cdk.stringToCloudFormation(properties.instanceId),
        MaxConcurrency: cdk.stringToCloudFormation(properties.maxConcurrency),
        MaxErrors: cdk.stringToCloudFormation(properties.maxErrors),
        OutputLocation: cfnAssociationInstanceAssociationOutputLocationPropertyToCloudFormation(properties.outputLocation),
        Parameters: cdk.objectToCloudFormation(properties.parameters),
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
        ScheduleOffset: cdk.numberToCloudFormation(properties.scheduleOffset),
        SyncCompliance: cdk.stringToCloudFormation(properties.syncCompliance),
        Targets: cdk.listMapper(cfnAssociationTargetPropertyToCloudFormation)(properties.targets),
        WaitForSuccessTimeoutSeconds: cdk.numberToCloudFormation(properties.waitForSuccessTimeoutSeconds),
    };
}

// @ts-ignore TS6133
function CfnAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssociationProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('applyOnlyAtCronInterval', 'ApplyOnlyAtCronInterval', properties.ApplyOnlyAtCronInterval != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApplyOnlyAtCronInterval) : undefined);
    ret.addPropertyResult('associationName', 'AssociationName', properties.AssociationName != null ? cfn_parse.FromCloudFormation.getString(properties.AssociationName) : undefined);
    ret.addPropertyResult('automationTargetParameterName', 'AutomationTargetParameterName', properties.AutomationTargetParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.AutomationTargetParameterName) : undefined);
    ret.addPropertyResult('calendarNames', 'CalendarNames', properties.CalendarNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CalendarNames) : undefined);
    ret.addPropertyResult('complianceSeverity', 'ComplianceSeverity', properties.ComplianceSeverity != null ? cfn_parse.FromCloudFormation.getString(properties.ComplianceSeverity) : undefined);
    ret.addPropertyResult('documentVersion', 'DocumentVersion', properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined);
    ret.addPropertyResult('instanceId', 'InstanceId', properties.InstanceId != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceId) : undefined);
    ret.addPropertyResult('maxConcurrency', 'MaxConcurrency', properties.MaxConcurrency != null ? cfn_parse.FromCloudFormation.getString(properties.MaxConcurrency) : undefined);
    ret.addPropertyResult('maxErrors', 'MaxErrors', properties.MaxErrors != null ? cfn_parse.FromCloudFormation.getString(properties.MaxErrors) : undefined);
    ret.addPropertyResult('outputLocation', 'OutputLocation', properties.OutputLocation != null ? CfnAssociationInstanceAssociationOutputLocationPropertyFromCloudFormation(properties.OutputLocation) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined);
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined);
    ret.addPropertyResult('scheduleOffset', 'ScheduleOffset', properties.ScheduleOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleOffset) : undefined);
    ret.addPropertyResult('syncCompliance', 'SyncCompliance', properties.SyncCompliance != null ? cfn_parse.FromCloudFormation.getString(properties.SyncCompliance) : undefined);
    ret.addPropertyResult('targets', 'Targets', properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnAssociationTargetPropertyFromCloudFormation)(properties.Targets) : undefined);
    ret.addPropertyResult('waitForSuccessTimeoutSeconds', 'WaitForSuccessTimeoutSeconds', properties.WaitForSuccessTimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.WaitForSuccessTimeoutSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::Association`
 *
 * The `AWS::SSM::Association` resource creates a State Manager association for your managed instances. A State Manager association defines the state that you want to maintain on your instances. For example, an association can specify that anti-virus software must be installed and running on your instances, or that certain ports must be closed. For static targets, the association specifies a schedule for when the configuration is reapplied. For dynamic targets, such as an AWS Resource Groups or an AWS Auto Scaling Group, State Manager applies the configuration when new instances are added to the group. The association also specifies actions to take when applying the configuration. For example, an association for anti-virus software might run once a day. If the software is not installed, then State Manager installs it. If the software is installed, but the service is not running, then the association might instruct State Manager to start the service.
 *
 * @cloudformationResource AWS::SSM::Association
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html
 */
export class CfnAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::Association";

    /**
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
        const ret = new CfnAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The association ID.
     * @cloudformationAttribute AssociationId
     */
    public readonly attrAssociationId: string;

    /**
     * The name of the SSM document that contains the configuration information for the instance. You can specify `Command` or `Automation` documents. The documents can be AWS -predefined documents, documents you created, or a document that is shared with you from another account. For SSM documents that are shared with you from other AWS accounts , you must specify the complete SSM document ARN, in the following format:
     *
     * `arn:partition:ssm:region:account-id:document/document-name`
     *
     * For example: `arn:aws:ssm:us-east-2:12345678912:document/My-Shared-Document`
     *
     * For AWS -predefined documents and SSM documents you created in your account, you only need to specify the document name. For example, `AWS -ApplyPatchBaseline` or `My-Document` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-name
     */
    public name: string;

    /**
     * By default, when you create a new association, the system runs it immediately after it is created and then according to the schedule you specified. Specify this option if you don't want an association to run immediately after you create it. This parameter is not supported for rate expressions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-applyonlyatcroninterval
     */
    public applyOnlyAtCronInterval: boolean | cdk.IResolvable | undefined;

    /**
     * Specify a descriptive name for the association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-associationname
     */
    public associationName: string | undefined;

    /**
     * Choose the parameter that will define how your automation will branch out. This target is required for associations that use an Automation runbook and target resources by using rate controls. Automation is a capability of AWS Systems Manager .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-automationtargetparametername
     */
    public automationTargetParameterName: string | undefined;

    /**
     * The names or Amazon Resource Names (ARNs) of the Change Calendar type documents your associations are gated under. The associations only run when that Change Calendar is open. For more information, see [AWS Systems Manager Change Calendar](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-change-calendar) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-calendarnames
     */
    public calendarNames: string[] | undefined;

    /**
     * The severity level that is assigned to the association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-complianceseverity
     */
    public complianceSeverity: string | undefined;

    /**
     * The version of the SSM document to associate with the target.
     *
     * > Note the following important information.
     * >
     * > - State Manager doesn't support running associations that use a new version of a document if that document is shared from another account. State Manager always runs the `default` version of a document if shared from another account, even though the Systems Manager console shows that a new version was processed. If you want to run an association using a new version of a document shared form another account, you must set the document version to `default` .
     * > - `DocumentVersion` is not valid for documents owned by AWS , such as `AWS-RunPatchBaseline` or `AWS-UpdateSSMAgent` . If you specify `DocumentVersion` for an AWS document, the system returns the following error: "Error occurred during operation 'CreateAssociation'." (RequestToken: <token>, HandlerErrorCode: GeneralServiceException).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-documentversion
     */
    public documentVersion: string | undefined;

    /**
     * The ID of the instance that the SSM document is associated with. You must specify the `InstanceId` or `Targets` property.
     *
     * > `InstanceId` has been deprecated. To specify an instance ID for an association, use the `Targets` parameter. If you use the parameter `InstanceId` , you cannot use the parameters `AssociationName` , `DocumentVersion` , `MaxErrors` , `MaxConcurrency` , `OutputLocation` , or `ScheduleExpression` . To use these parameters, you must use the `Targets` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-instanceid
     */
    public instanceId: string | undefined;

    /**
     * The maximum number of targets allowed to run the association at the same time. You can specify a number, for example 10, or a percentage of the target set, for example 10%. The default value is 100%, which means all targets run the association at the same time.
     *
     * If a new managed node starts and attempts to run an association while Systems Manager is running `MaxConcurrency` associations, the association is allowed to run. During the next association interval, the new managed node will process its association within the limit specified for `MaxConcurrency` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-maxconcurrency
     */
    public maxConcurrency: string | undefined;

    /**
     * The number of errors that are allowed before the system stops sending requests to run the association on additional targets. You can specify either an absolute number of errors, for example 10, or a percentage of the target set, for example 10%. If you specify 3, for example, the system stops sending requests when the fourth error is received. If you specify 0, then the system stops sending requests after the first error is returned. If you run an association on 50 managed nodes and set `MaxError` to 10%, then the system stops sending the request when the sixth error is received.
     *
     * Executions that are already running an association when `MaxErrors` is reached are allowed to complete, but some of these executions may fail as well. If you need to ensure that there won't be more than max-errors failed executions, set `MaxConcurrency` to 1 so that executions proceed one at a time.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-maxerrors
     */
    public maxErrors: string | undefined;

    /**
     * An Amazon Simple Storage Service (Amazon S3) bucket where you want to store the output details of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-outputlocation
     */
    public outputLocation: CfnAssociation.InstanceAssociationOutputLocationProperty | cdk.IResolvable | undefined;

    /**
     * The parameters for the runtime configuration of the document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-parameters
     */
    public parameters: any | cdk.IResolvable | undefined;

    /**
     * A cron expression that specifies a schedule when the association runs. The schedule runs in Coordinated Universal Time (UTC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-scheduleexpression
     */
    public scheduleExpression: string | undefined;

    /**
     * Number of days to wait after the scheduled day to run an association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-scheduleoffset
     */
    public scheduleOffset: number | undefined;

    /**
     * The mode for generating association compliance. You can specify `AUTO` or `MANUAL` . In `AUTO` mode, the system uses the status of the association execution to determine the compliance status. If the association execution runs successfully, then the association is `COMPLIANT` . If the association execution doesn't run successfully, the association is `NON-COMPLIANT` .
     *
     * In `MANUAL` mode, you must specify the `AssociationId` as a parameter for the PutComplianceItems API action. In this case, compliance data is not managed by State Manager. It is managed by your direct call to the PutComplianceItems API action.
     *
     * By default, all associations use `AUTO` mode.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-synccompliance
     */
    public syncCompliance: string | undefined;

    /**
     * The targets for the association. You must specify the `InstanceId` or `Targets` property. You can target all instances in an AWS account by specifying the `InstanceIds` key with a value of `*` . To view a JSON and a YAML example that targets all instances, see "Create an association for all managed instances in an AWS account " on the Examples page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-targets
     */
    public targets: Array<CfnAssociation.TargetProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The number of seconds the service should wait for the association status to show "Success" before proceeding with the stack execution. If the association status doesn't show "Success" after the specified number of seconds, then stack creation fails.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-waitforsuccesstimeoutseconds
     */
    public waitForSuccessTimeoutSeconds: number | undefined;

    /**
     * Create a new `AWS::SSM::Association`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssociationProps) {
        super(scope, id, { type: CfnAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrAssociationId = cdk.Token.asString(this.getAtt('AssociationId', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.applyOnlyAtCronInterval = props.applyOnlyAtCronInterval;
        this.associationName = props.associationName;
        this.automationTargetParameterName = props.automationTargetParameterName;
        this.calendarNames = props.calendarNames;
        this.complianceSeverity = props.complianceSeverity;
        this.documentVersion = props.documentVersion;
        this.instanceId = props.instanceId;
        this.maxConcurrency = props.maxConcurrency;
        this.maxErrors = props.maxErrors;
        this.outputLocation = props.outputLocation;
        this.parameters = props.parameters;
        this.scheduleExpression = props.scheduleExpression;
        this.scheduleOffset = props.scheduleOffset;
        this.syncCompliance = props.syncCompliance;
        this.targets = props.targets;
        this.waitForSuccessTimeoutSeconds = props.waitForSuccessTimeoutSeconds;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            applyOnlyAtCronInterval: this.applyOnlyAtCronInterval,
            associationName: this.associationName,
            automationTargetParameterName: this.automationTargetParameterName,
            calendarNames: this.calendarNames,
            complianceSeverity: this.complianceSeverity,
            documentVersion: this.documentVersion,
            instanceId: this.instanceId,
            maxConcurrency: this.maxConcurrency,
            maxErrors: this.maxErrors,
            outputLocation: this.outputLocation,
            parameters: this.parameters,
            scheduleExpression: this.scheduleExpression,
            scheduleOffset: this.scheduleOffset,
            syncCompliance: this.syncCompliance,
            targets: this.targets,
            waitForSuccessTimeoutSeconds: this.waitForSuccessTimeoutSeconds,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssociationPropsToCloudFormation(props);
    }
}

export namespace CfnAssociation {
    /**
     * `InstanceAssociationOutputLocation` is a property of the [AWS::SSM::Association](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html) resource that specifies an Amazon S3 bucket where you want to store the results of this association request.
     *
     * For the minimal permissions required to enable Amazon S3 output for an association, see [Creating associations](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-state-assoc.html) in the *Systems Manager User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html
     */
    export interface InstanceAssociationOutputLocationProperty {
        /**
         * `S3OutputLocation` is a property of the [InstanceAssociationOutputLocation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html) property that specifies an Amazon S3 bucket where you want to store the results of this request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html#cfn-ssm-association-instanceassociationoutputlocation-s3location
         */
        readonly s3Location?: CfnAssociation.S3OutputLocationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceAssociationOutputLocationProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceAssociationOutputLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssociation_InstanceAssociationOutputLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Location', CfnAssociation_S3OutputLocationPropertyValidator)(properties.s3Location));
    return errors.wrap('supplied properties not correct for "InstanceAssociationOutputLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::Association.InstanceAssociationOutputLocation` resource
 *
 * @param properties - the TypeScript properties of a `InstanceAssociationOutputLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::Association.InstanceAssociationOutputLocation` resource.
 */
// @ts-ignore TS6133
function cfnAssociationInstanceAssociationOutputLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssociation_InstanceAssociationOutputLocationPropertyValidator(properties).assertSuccess();
    return {
        S3Location: cfnAssociationS3OutputLocationPropertyToCloudFormation(properties.s3Location),
    };
}

// @ts-ignore TS6133
function CfnAssociationInstanceAssociationOutputLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssociation.InstanceAssociationOutputLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssociation.InstanceAssociationOutputLocationProperty>();
    ret.addPropertyResult('s3Location', 'S3Location', properties.S3Location != null ? CfnAssociationS3OutputLocationPropertyFromCloudFormation(properties.S3Location) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssociation {
    /**
     * `S3OutputLocation` is a property of the [AWS::SSM::Association](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html) resource that specifies an Amazon S3 bucket where you want to store the results of this association request.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html
     */
    export interface S3OutputLocationProperty {
        /**
         * The name of the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html#cfn-ssm-association-s3outputlocation-outputs3bucketname
         */
        readonly outputS3BucketName?: string;
        /**
         * The S3 bucket subfolder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html#cfn-ssm-association-s3outputlocation-outputs3keyprefix
         */
        readonly outputS3KeyPrefix?: string;
        /**
         * The AWS Region of the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html#cfn-ssm-association-s3outputlocation-outputs3region
         */
        readonly outputS3Region?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3OutputLocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3OutputLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssociation_S3OutputLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('outputS3BucketName', cdk.validateString)(properties.outputS3BucketName));
    errors.collect(cdk.propertyValidator('outputS3KeyPrefix', cdk.validateString)(properties.outputS3KeyPrefix));
    errors.collect(cdk.propertyValidator('outputS3Region', cdk.validateString)(properties.outputS3Region));
    return errors.wrap('supplied properties not correct for "S3OutputLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::Association.S3OutputLocation` resource
 *
 * @param properties - the TypeScript properties of a `S3OutputLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::Association.S3OutputLocation` resource.
 */
// @ts-ignore TS6133
function cfnAssociationS3OutputLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssociation_S3OutputLocationPropertyValidator(properties).assertSuccess();
    return {
        OutputS3BucketName: cdk.stringToCloudFormation(properties.outputS3BucketName),
        OutputS3KeyPrefix: cdk.stringToCloudFormation(properties.outputS3KeyPrefix),
        OutputS3Region: cdk.stringToCloudFormation(properties.outputS3Region),
    };
}

// @ts-ignore TS6133
function CfnAssociationS3OutputLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssociation.S3OutputLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssociation.S3OutputLocationProperty>();
    ret.addPropertyResult('outputS3BucketName', 'OutputS3BucketName', properties.OutputS3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3BucketName) : undefined);
    ret.addPropertyResult('outputS3KeyPrefix', 'OutputS3KeyPrefix', properties.OutputS3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3KeyPrefix) : undefined);
    ret.addPropertyResult('outputS3Region', 'OutputS3Region', properties.OutputS3Region != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3Region) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssociation {
    /**
     * `Target` is a property of the [AWS::SSM::Association](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html) resource that specifies the targets for an SSM document in Systems Manager . You can target all instances in an AWS account by specifying the `InstanceIds` key with a value of `*` . To view a JSON and a YAML example that targets all instances, see "Create an association for all managed instances in an AWS account " on the Examples page.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-target.html
     */
    export interface TargetProperty {
        /**
         * User-defined criteria for sending commands that target managed nodes that meet the criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-target.html#cfn-ssm-association-target-key
         */
        readonly key: string;
        /**
         * User-defined criteria that maps to `Key` . For example, if you specified `tag:ServerRole` , you could specify `value:WebServer` to run a command on instances that include EC2 tags of `ServerRole,WebServer` .
         *
         * Depending on the type of target, the maximum number of values for a key might be lower than the global maximum of 50.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-target.html#cfn-ssm-association-target-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssociation_TargetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "TargetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::Association.Target` resource
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::Association.Target` resource.
 */
// @ts-ignore TS6133
function cfnAssociationTargetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssociation_TargetPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnAssociationTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssociation.TargetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssociation.TargetProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDocument`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html
 */
export interface CfnDocumentProps {

    /**
     * The content for the new SSM document in JSON or YAML. For more information about the schemas for SSM document content, see [SSM document schema features and examples](https://docs.aws.amazon.com/systems-manager/latest/userguide/document-schemas-features.html) in the *AWS Systems Manager User Guide* .
     *
     * > This parameter also supports `String` data types.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-content
     */
    readonly content: any | cdk.IResolvable;

    /**
     * A list of key-value pairs that describe attachments to a version of a document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-attachments
     */
    readonly attachments?: Array<CfnDocument.AttachmentsSourceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specify the document format for the request. JSON is the default format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-documentformat
     */
    readonly documentFormat?: string;

    /**
     * The type of document to create.
     *
     * *Allowed Values* : `ApplicationConfigurationSchema` | `Automation` | `Automation.ChangeTemplate` | `Command` | `DeploymentStrategy` | `Package` | `Policy` | `Session`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-documenttype
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-name
     */
    readonly name?: string;

    /**
     * A list of SSM documents required by a document. This parameter is used exclusively by AWS AppConfig . When a user creates an AWS AppConfig configuration in an SSM document, the user must also specify a required document for validation purposes. In this case, an `ApplicationConfiguration` document requires an `ApplicationConfigurationSchema` document for validation purposes. For more information, see [What is AWS AppConfig ?](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-requires
     */
    readonly requires?: Array<CfnDocument.DocumentRequiresProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * AWS CloudFormation resource tags to apply to the document. Use tags to help you identify and categorize resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Specify a target type to define the kinds of resources the document can run on. For example, to run a document on EC2 instances, specify the following value: `/AWS::EC2::Instance` . If you specify a value of '/' the document can run on all types of resources. If you don't specify a value, the document can't run on any resources. For a list of valid resource types, see [AWS resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) in the *AWS CloudFormation User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-targettype
     */
    readonly targetType?: string;

    /**
     * If the document resource you specify in your template already exists, this parameter determines whether a new version of the existing document is created, or the existing document is replaced. `Replace` is the default method. If you specify `NewVersion` for the `UpdateMethod` parameter, and the `Name` of the document does not match an existing resource, a new document is created. When you specify `NewVersion` , the default version of the document is changed to the newly created version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-updatemethod
     */
    readonly updateMethod?: string;

    /**
     * An optional field specifying the version of the artifact you are creating with the document. For example, `Release12.1` . This value is unique across all versions of a document, and can't be changed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-versionname
     */
    readonly versionName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDocumentProps`
 *
 * @param properties - the TypeScript properties of a `CfnDocumentProps`
 *
 * @returns the result of the validation.
 */
function CfnDocumentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attachments', cdk.listValidator(CfnDocument_AttachmentsSourcePropertyValidator))(properties.attachments));
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', cdk.validateObject)(properties.content));
    errors.collect(cdk.propertyValidator('documentFormat', cdk.validateString)(properties.documentFormat));
    errors.collect(cdk.propertyValidator('documentType', cdk.validateString)(properties.documentType));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('requires', cdk.listValidator(CfnDocument_DocumentRequiresPropertyValidator))(properties.requires));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('targetType', cdk.validateString)(properties.targetType));
    errors.collect(cdk.propertyValidator('updateMethod', cdk.validateString)(properties.updateMethod));
    errors.collect(cdk.propertyValidator('versionName', cdk.validateString)(properties.versionName));
    return errors.wrap('supplied properties not correct for "CfnDocumentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::Document` resource
 *
 * @param properties - the TypeScript properties of a `CfnDocumentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::Document` resource.
 */
// @ts-ignore TS6133
function cfnDocumentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDocumentPropsValidator(properties).assertSuccess();
    return {
        Content: cdk.objectToCloudFormation(properties.content),
        Attachments: cdk.listMapper(cfnDocumentAttachmentsSourcePropertyToCloudFormation)(properties.attachments),
        DocumentFormat: cdk.stringToCloudFormation(properties.documentFormat),
        DocumentType: cdk.stringToCloudFormation(properties.documentType),
        Name: cdk.stringToCloudFormation(properties.name),
        Requires: cdk.listMapper(cfnDocumentDocumentRequiresPropertyToCloudFormation)(properties.requires),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TargetType: cdk.stringToCloudFormation(properties.targetType),
        UpdateMethod: cdk.stringToCloudFormation(properties.updateMethod),
        VersionName: cdk.stringToCloudFormation(properties.versionName),
    };
}

// @ts-ignore TS6133
function CfnDocumentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentProps>();
    ret.addPropertyResult('content', 'Content', cfn_parse.FromCloudFormation.getAny(properties.Content));
    ret.addPropertyResult('attachments', 'Attachments', properties.Attachments != null ? cfn_parse.FromCloudFormation.getArray(CfnDocumentAttachmentsSourcePropertyFromCloudFormation)(properties.Attachments) : undefined);
    ret.addPropertyResult('documentFormat', 'DocumentFormat', properties.DocumentFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentFormat) : undefined);
    ret.addPropertyResult('documentType', 'DocumentType', properties.DocumentType != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentType) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('requires', 'Requires', properties.Requires != null ? cfn_parse.FromCloudFormation.getArray(CfnDocumentDocumentRequiresPropertyFromCloudFormation)(properties.Requires) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('targetType', 'TargetType', properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined);
    ret.addPropertyResult('updateMethod', 'UpdateMethod', properties.UpdateMethod != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateMethod) : undefined);
    ret.addPropertyResult('versionName', 'VersionName', properties.VersionName != null ? cfn_parse.FromCloudFormation.getString(properties.VersionName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::Document`
 *
 * The `AWS::SSM::Document` resource creates a Systems Manager (SSM) document in AWS Systems Manager . This document defines the actions that Systems Manager performs on your AWS resources.
 *
 * > This resource does not support CloudFormation drift detection.
 *
 * @cloudformationResource AWS::SSM::Document
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html
 */
export class CfnDocument extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::Document";

    /**
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
        const ret = new CfnDocument(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The content for the new SSM document in JSON or YAML. For more information about the schemas for SSM document content, see [SSM document schema features and examples](https://docs.aws.amazon.com/systems-manager/latest/userguide/document-schemas-features.html) in the *AWS Systems Manager User Guide* .
     *
     * > This parameter also supports `String` data types.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-content
     */
    public content: any | cdk.IResolvable;

    /**
     * A list of key-value pairs that describe attachments to a version of a document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-attachments
     */
    public attachments: Array<CfnDocument.AttachmentsSourceProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specify the document format for the request. JSON is the default format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-documentformat
     */
    public documentFormat: string | undefined;

    /**
     * The type of document to create.
     *
     * *Allowed Values* : `ApplicationConfigurationSchema` | `Automation` | `Automation.ChangeTemplate` | `Command` | `DeploymentStrategy` | `Package` | `Policy` | `Session`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-documenttype
     */
    public documentType: string | undefined;

    /**
     * A name for the SSM document.
     *
     * > You can't use the following strings as document name prefixes. These are reserved by AWS for use as document name prefixes:
     * >
     * > - `aws`
     * > - `amazon`
     * > - `amzn`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-name
     */
    public name: string | undefined;

    /**
     * A list of SSM documents required by a document. This parameter is used exclusively by AWS AppConfig . When a user creates an AWS AppConfig configuration in an SSM document, the user must also specify a required document for validation purposes. In this case, an `ApplicationConfiguration` document requires an `ApplicationConfigurationSchema` document for validation purposes. For more information, see [What is AWS AppConfig ?](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-requires
     */
    public requires: Array<CfnDocument.DocumentRequiresProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * AWS CloudFormation resource tags to apply to the document. Use tags to help you identify and categorize resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Specify a target type to define the kinds of resources the document can run on. For example, to run a document on EC2 instances, specify the following value: `/AWS::EC2::Instance` . If you specify a value of '/' the document can run on all types of resources. If you don't specify a value, the document can't run on any resources. For a list of valid resource types, see [AWS resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) in the *AWS CloudFormation User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-targettype
     */
    public targetType: string | undefined;

    /**
     * If the document resource you specify in your template already exists, this parameter determines whether a new version of the existing document is created, or the existing document is replaced. `Replace` is the default method. If you specify `NewVersion` for the `UpdateMethod` parameter, and the `Name` of the document does not match an existing resource, a new document is created. When you specify `NewVersion` , the default version of the document is changed to the newly created version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-updatemethod
     */
    public updateMethod: string | undefined;

    /**
     * An optional field specifying the version of the artifact you are creating with the document. For example, `Release12.1` . This value is unique across all versions of a document, and can't be changed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-versionname
     */
    public versionName: string | undefined;

    /**
     * Create a new `AWS::SSM::Document`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDocumentProps) {
        super(scope, id, { type: CfnDocument.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'content', this);

        this.content = props.content;
        this.attachments = props.attachments;
        this.documentFormat = props.documentFormat;
        this.documentType = props.documentType;
        this.name = props.name;
        this.requires = props.requires;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSM::Document", props.tags, { tagPropertyName: 'tags' });
        this.targetType = props.targetType;
        this.updateMethod = props.updateMethod;
        this.versionName = props.versionName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDocument.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            content: this.content,
            attachments: this.attachments,
            documentFormat: this.documentFormat,
            documentType: this.documentType,
            name: this.name,
            requires: this.requires,
            tags: this.tags.renderTags(),
            targetType: this.targetType,
            updateMethod: this.updateMethod,
            versionName: this.versionName,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDocumentPropsToCloudFormation(props);
    }
}

export namespace CfnDocument {
    /**
     * Identifying information about a document attachment, including the file name and a key-value pair that identifies the location of an attachment to a document.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-attachmentssource.html
     */
    export interface AttachmentsSourceProperty {
        /**
         * The key of a key-value pair that identifies the location of an attachment to a document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-attachmentssource.html#cfn-ssm-document-attachmentssource-key
         */
        readonly key?: string;
        /**
         * The name of the document attachment file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-attachmentssource.html#cfn-ssm-document-attachmentssource-name
         */
        readonly name?: string;
        /**
         * The value of a key-value pair that identifies the location of an attachment to a document. The format for *Value* depends on the type of key you specify.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-attachmentssource.html#cfn-ssm-document-attachmentssource-values
         */
        readonly values?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AttachmentsSourceProperty`
 *
 * @param properties - the TypeScript properties of a `AttachmentsSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnDocument_AttachmentsSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "AttachmentsSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::Document.AttachmentsSource` resource
 *
 * @param properties - the TypeScript properties of a `AttachmentsSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::Document.AttachmentsSource` resource.
 */
// @ts-ignore TS6133
function cfnDocumentAttachmentsSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDocument_AttachmentsSourcePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnDocumentAttachmentsSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocument.AttachmentsSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocument.AttachmentsSourceProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDocument {
    /**
     * An SSM document required by the current document.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-documentrequires.html
     */
    export interface DocumentRequiresProperty {
        /**
         * The name of the required SSM document. The name can be an Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-documentrequires.html#cfn-ssm-document-documentrequires-name
         */
        readonly name?: string;
        /**
         * The document version required by the current document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-document-documentrequires.html#cfn-ssm-document-documentrequires-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DocumentRequiresProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentRequiresProperty`
 *
 * @returns the result of the validation.
 */
function CfnDocument_DocumentRequiresPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "DocumentRequiresProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::Document.DocumentRequires` resource
 *
 * @param properties - the TypeScript properties of a `DocumentRequiresProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::Document.DocumentRequires` resource.
 */
// @ts-ignore TS6133
function cfnDocumentDocumentRequiresPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDocument_DocumentRequiresPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnDocumentDocumentRequiresPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocument.DocumentRequiresProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocument.DocumentRequiresProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnMaintenanceWindow`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html
 */
export interface CfnMaintenanceWindowProps {

    /**
     * Enables a maintenance window task to run on managed instances, even if you have not registered those instances as targets. If enabled, then you must specify the unregistered instances (by instance ID) when you register a task with the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-allowunassociatedtargets
     */
    readonly allowUnassociatedTargets: boolean | cdk.IResolvable;

    /**
     * The number of hours before the end of the maintenance window that AWS Systems Manager stops scheduling new tasks for execution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-cutoff
     */
    readonly cutoff: number;

    /**
     * The duration of the maintenance window in hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-duration
     */
    readonly duration: number;

    /**
     * The name of the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-name
     */
    readonly name: string;

    /**
     * The schedule of the maintenance window in the form of a cron or rate expression.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-schedule
     */
    readonly schedule: string;

    /**
     * A description of the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-description
     */
    readonly description?: string;

    /**
     * The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become inactive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-enddate
     */
    readonly endDate?: string;

    /**
     * The number of days to wait to run a maintenance window after the scheduled cron expression date and time.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-scheduleoffset
     */
    readonly scheduleOffset?: number;

    /**
     * The time zone that the scheduled maintenance window executions are based on, in Internet Assigned Numbers Authority (IANA) format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-scheduletimezone
     */
    readonly scheduleTimezone?: string;

    /**
     * The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become active. StartDate allows you to delay activation of the Maintenance Window until the specified future date.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-startdate
     */
    readonly startDate?: string;

    /**
     * Optional metadata that you assign to a resource in the form of an arbitrary set of tags (key-value pairs). Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a maintenance window to identify the type of tasks it will run, the types of targets, and the environment it will run in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnMaintenanceWindowProps`
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowProps`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowUnassociatedTargets', cdk.requiredValidator)(properties.allowUnassociatedTargets));
    errors.collect(cdk.propertyValidator('allowUnassociatedTargets', cdk.validateBoolean)(properties.allowUnassociatedTargets));
    errors.collect(cdk.propertyValidator('cutoff', cdk.requiredValidator)(properties.cutoff));
    errors.collect(cdk.propertyValidator('cutoff', cdk.validateNumber)(properties.cutoff));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('duration', cdk.requiredValidator)(properties.duration));
    errors.collect(cdk.propertyValidator('duration', cdk.validateNumber)(properties.duration));
    errors.collect(cdk.propertyValidator('endDate', cdk.validateString)(properties.endDate));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('schedule', cdk.requiredValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('schedule', cdk.validateString)(properties.schedule));
    errors.collect(cdk.propertyValidator('scheduleOffset', cdk.validateNumber)(properties.scheduleOffset));
    errors.collect(cdk.propertyValidator('scheduleTimezone', cdk.validateString)(properties.scheduleTimezone));
    errors.collect(cdk.propertyValidator('startDate', cdk.validateString)(properties.startDate));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnMaintenanceWindowProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindow` resource
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindow` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowPropsValidator(properties).assertSuccess();
    return {
        AllowUnassociatedTargets: cdk.booleanToCloudFormation(properties.allowUnassociatedTargets),
        Cutoff: cdk.numberToCloudFormation(properties.cutoff),
        Duration: cdk.numberToCloudFormation(properties.duration),
        Name: cdk.stringToCloudFormation(properties.name),
        Schedule: cdk.stringToCloudFormation(properties.schedule),
        Description: cdk.stringToCloudFormation(properties.description),
        EndDate: cdk.stringToCloudFormation(properties.endDate),
        ScheduleOffset: cdk.numberToCloudFormation(properties.scheduleOffset),
        ScheduleTimezone: cdk.stringToCloudFormation(properties.scheduleTimezone),
        StartDate: cdk.stringToCloudFormation(properties.startDate),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowProps>();
    ret.addPropertyResult('allowUnassociatedTargets', 'AllowUnassociatedTargets', cfn_parse.FromCloudFormation.getBoolean(properties.AllowUnassociatedTargets));
    ret.addPropertyResult('cutoff', 'Cutoff', cfn_parse.FromCloudFormation.getNumber(properties.Cutoff));
    ret.addPropertyResult('duration', 'Duration', cfn_parse.FromCloudFormation.getNumber(properties.Duration));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('schedule', 'Schedule', cfn_parse.FromCloudFormation.getString(properties.Schedule));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('endDate', 'EndDate', properties.EndDate != null ? cfn_parse.FromCloudFormation.getString(properties.EndDate) : undefined);
    ret.addPropertyResult('scheduleOffset', 'ScheduleOffset', properties.ScheduleOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleOffset) : undefined);
    ret.addPropertyResult('scheduleTimezone', 'ScheduleTimezone', properties.ScheduleTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleTimezone) : undefined);
    ret.addPropertyResult('startDate', 'StartDate', properties.StartDate != null ? cfn_parse.FromCloudFormation.getString(properties.StartDate) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::MaintenanceWindow`
 *
 * The `AWS::SSM::MaintenanceWindow` resource represents general information about a maintenance window for AWS Systems Manager . Maintenance Windows let you define a schedule for when to perform potentially disruptive actions on your instances, such as patching an operating system (OS), updating drivers, or installing software. Each maintenance window has a schedule, a duration, a set of registered targets, and a set of registered tasks.
 *
 * For more information, see [Systems Manager Maintenance Windows](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-maintenance.html) in the *AWS Systems Manager User Guide* and [CreateMaintenanceWindow](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_CreateMaintenanceWindow.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::MaintenanceWindow
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html
 */
export class CfnMaintenanceWindow extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::MaintenanceWindow";

    /**
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
        const ret = new CfnMaintenanceWindow(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Enables a maintenance window task to run on managed instances, even if you have not registered those instances as targets. If enabled, then you must specify the unregistered instances (by instance ID) when you register a task with the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-allowunassociatedtargets
     */
    public allowUnassociatedTargets: boolean | cdk.IResolvable;

    /**
     * The number of hours before the end of the maintenance window that AWS Systems Manager stops scheduling new tasks for execution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-cutoff
     */
    public cutoff: number;

    /**
     * The duration of the maintenance window in hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-duration
     */
    public duration: number;

    /**
     * The name of the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-name
     */
    public name: string;

    /**
     * The schedule of the maintenance window in the form of a cron or rate expression.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-schedule
     */
    public schedule: string;

    /**
     * A description of the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-description
     */
    public description: string | undefined;

    /**
     * The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become inactive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-enddate
     */
    public endDate: string | undefined;

    /**
     * The number of days to wait to run a maintenance window after the scheduled cron expression date and time.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-scheduleoffset
     */
    public scheduleOffset: number | undefined;

    /**
     * The time zone that the scheduled maintenance window executions are based on, in Internet Assigned Numbers Authority (IANA) format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-scheduletimezone
     */
    public scheduleTimezone: string | undefined;

    /**
     * The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become active. StartDate allows you to delay activation of the Maintenance Window until the specified future date.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-startdate
     */
    public startDate: string | undefined;

    /**
     * Optional metadata that you assign to a resource in the form of an arbitrary set of tags (key-value pairs). Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a maintenance window to identify the type of tasks it will run, the types of targets, and the environment it will run in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindow.html#cfn-ssm-maintenancewindow-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::SSM::MaintenanceWindow`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMaintenanceWindowProps) {
        super(scope, id, { type: CfnMaintenanceWindow.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'allowUnassociatedTargets', this);
        cdk.requireProperty(props, 'cutoff', this);
        cdk.requireProperty(props, 'duration', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'schedule', this);

        this.allowUnassociatedTargets = props.allowUnassociatedTargets;
        this.cutoff = props.cutoff;
        this.duration = props.duration;
        this.name = props.name;
        this.schedule = props.schedule;
        this.description = props.description;
        this.endDate = props.endDate;
        this.scheduleOffset = props.scheduleOffset;
        this.scheduleTimezone = props.scheduleTimezone;
        this.startDate = props.startDate;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSM::MaintenanceWindow", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMaintenanceWindow.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            allowUnassociatedTargets: this.allowUnassociatedTargets,
            cutoff: this.cutoff,
            duration: this.duration,
            name: this.name,
            schedule: this.schedule,
            description: this.description,
            endDate: this.endDate,
            scheduleOffset: this.scheduleOffset,
            scheduleTimezone: this.scheduleTimezone,
            startDate: this.startDate,
            tags: this.tags.renderTags(),
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMaintenanceWindowPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnMaintenanceWindowTarget`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html
 */
export interface CfnMaintenanceWindowTargetProps {

    /**
     * The type of target that is being registered with the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-resourcetype
     */
    readonly resourceType: string;

    /**
     * The targets to register with the maintenance window. In other words, the instances to run commands on when the maintenance window runs.
     *
     * You must specify targets by using the `WindowTargetIds` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-targets
     */
    readonly targets: Array<CfnMaintenanceWindowTarget.TargetsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The ID of the maintenance window to register the target with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-windowid
     */
    readonly windowId: string;

    /**
     * A description for the target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-description
     */
    readonly description?: string;

    /**
     * The name for the maintenance window target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-name
     */
    readonly name?: string;

    /**
     * A user-provided value that will be included in any Amazon CloudWatch Events events that are raised while running tasks for these targets in this maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-ownerinformation
     */
    readonly ownerInformation?: string;
}

/**
 * Determine whether the given properties match those of a `CfnMaintenanceWindowTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowTargetProps`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTargetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('ownerInformation', cdk.validateString)(properties.ownerInformation));
    errors.collect(cdk.propertyValidator('resourceType', cdk.requiredValidator)(properties.resourceType));
    errors.collect(cdk.propertyValidator('resourceType', cdk.validateString)(properties.resourceType));
    errors.collect(cdk.propertyValidator('targets', cdk.requiredValidator)(properties.targets));
    errors.collect(cdk.propertyValidator('targets', cdk.listValidator(CfnMaintenanceWindowTarget_TargetsPropertyValidator))(properties.targets));
    errors.collect(cdk.propertyValidator('windowId', cdk.requiredValidator)(properties.windowId));
    errors.collect(cdk.propertyValidator('windowId', cdk.validateString)(properties.windowId));
    return errors.wrap('supplied properties not correct for "CfnMaintenanceWindowTargetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTarget` resource
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowTargetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTarget` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTargetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTargetPropsValidator(properties).assertSuccess();
    return {
        ResourceType: cdk.stringToCloudFormation(properties.resourceType),
        Targets: cdk.listMapper(cfnMaintenanceWindowTargetTargetsPropertyToCloudFormation)(properties.targets),
        WindowId: cdk.stringToCloudFormation(properties.windowId),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        OwnerInformation: cdk.stringToCloudFormation(properties.ownerInformation),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTargetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTargetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTargetProps>();
    ret.addPropertyResult('resourceType', 'ResourceType', cfn_parse.FromCloudFormation.getString(properties.ResourceType));
    ret.addPropertyResult('targets', 'Targets', cfn_parse.FromCloudFormation.getArray(CfnMaintenanceWindowTargetTargetsPropertyFromCloudFormation)(properties.Targets));
    ret.addPropertyResult('windowId', 'WindowId', cfn_parse.FromCloudFormation.getString(properties.WindowId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('ownerInformation', 'OwnerInformation', properties.OwnerInformation != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerInformation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::MaintenanceWindowTarget`
 *
 * The `AWS::SSM::MaintenanceWindowTarget` resource registers a target with a maintenance window for AWS Systems Manager . For more information, see [RegisterTargetWithMaintenanceWindow](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_RegisterTargetWithMaintenanceWindow.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::MaintenanceWindowTarget
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html
 */
export class CfnMaintenanceWindowTarget extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::MaintenanceWindowTarget";

    /**
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
        const ret = new CfnMaintenanceWindowTarget(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The type of target that is being registered with the maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-resourcetype
     */
    public resourceType: string;

    /**
     * The targets to register with the maintenance window. In other words, the instances to run commands on when the maintenance window runs.
     *
     * You must specify targets by using the `WindowTargetIds` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-targets
     */
    public targets: Array<CfnMaintenanceWindowTarget.TargetsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The ID of the maintenance window to register the target with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-windowid
     */
    public windowId: string;

    /**
     * A description for the target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-description
     */
    public description: string | undefined;

    /**
     * The name for the maintenance window target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-name
     */
    public name: string | undefined;

    /**
     * A user-provided value that will be included in any Amazon CloudWatch Events events that are raised while running tasks for these targets in this maintenance window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtarget.html#cfn-ssm-maintenancewindowtarget-ownerinformation
     */
    public ownerInformation: string | undefined;

    /**
     * Create a new `AWS::SSM::MaintenanceWindowTarget`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMaintenanceWindowTargetProps) {
        super(scope, id, { type: CfnMaintenanceWindowTarget.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceType', this);
        cdk.requireProperty(props, 'targets', this);
        cdk.requireProperty(props, 'windowId', this);

        this.resourceType = props.resourceType;
        this.targets = props.targets;
        this.windowId = props.windowId;
        this.description = props.description;
        this.name = props.name;
        this.ownerInformation = props.ownerInformation;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMaintenanceWindowTarget.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            resourceType: this.resourceType,
            targets: this.targets,
            windowId: this.windowId,
            description: this.description,
            name: this.name,
            ownerInformation: this.ownerInformation,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMaintenanceWindowTargetPropsToCloudFormation(props);
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtarget-targets.html
     */
    export interface TargetsProperty {
        /**
         * User-defined criteria for sending commands that target managed nodes that meet the criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtarget-targets.html#cfn-ssm-maintenancewindowtarget-targets-key
         */
        readonly key: string;
        /**
         * User-defined criteria that maps to `Key` . For example, if you specified `tag:ServerRole` , you could specify `value:WebServer` to run a command on instances that include EC2 tags of `ServerRole,WebServer` .
         *
         * Depending on the type of target, the maximum number of values for a key might be lower than the global maximum of 50.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtarget-targets.html#cfn-ssm-maintenancewindowtarget-targets-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `TargetsProperty`
 *
 * @param properties - the TypeScript properties of a `TargetsProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTarget_TargetsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "TargetsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTarget.Targets` resource
 *
 * @param properties - the TypeScript properties of a `TargetsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTarget.Targets` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTargetTargetsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTarget_TargetsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTargetTargetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTarget.TargetsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTarget.TargetsProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnMaintenanceWindowTask`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html
 */
export interface CfnMaintenanceWindowTaskProps {

    /**
     * The priority of the task in the maintenance window. The lower the number, the higher the priority. Tasks that have the same priority are scheduled in parallel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-priority
     */
    readonly priority: number;

    /**
     * The resource that the task uses during execution.
     *
     * For `RUN_COMMAND` and `AUTOMATION` task types, `TaskArn` is the SSM document name or Amazon Resource Name (ARN).
     *
     * For `LAMBDA` tasks, `TaskArn` is the function name or ARN.
     *
     * For `STEP_FUNCTIONS` tasks, `TaskArn` is the state machine ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskarn
     */
    readonly taskArn: string;

    /**
     * The type of task. Valid values: `RUN_COMMAND` , `AUTOMATION` , `LAMBDA` , `STEP_FUNCTIONS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-tasktype
     */
    readonly taskType: string;

    /**
     * The ID of the maintenance window where the task is registered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-windowid
     */
    readonly windowId: string;

    /**
     * The specification for whether tasks should continue to run after the cutoff time specified in the maintenance windows is reached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-cutoffbehavior
     */
    readonly cutoffBehavior?: string;

    /**
     * A description of the task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-description
     */
    readonly description?: string;

    /**
     * Information about an Amazon S3 bucket to write Run Command task-level logs to.
     *
     * > `LoggingInfo` has been deprecated. To specify an Amazon S3 bucket to contain logs for Run Command tasks, instead use the `OutputS3BucketName` and `OutputS3KeyPrefix` options in the `TaskInvocationParameters` structure. For information about how Systems Manager handles these options for the supported maintenance window task types, see [AWS ::SSM::MaintenanceWindowTask MaintenanceWindowRunCommandParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-logginginfo
     */
    readonly loggingInfo?: CfnMaintenanceWindowTask.LoggingInfoProperty | cdk.IResolvable;

    /**
     * The maximum number of targets this task can be run for, in parallel.
     *
     * > Although this element is listed as "Required: No", a value can be omitted only when you are registering or updating a [targetless task](https://docs.aws.amazon.com/systems-manager/latest/userguide/maintenance-windows-targetless-tasks.html) You must provide a value in all other cases.
     * >
     * > For maintenance window tasks without a target specified, you can't supply a value for this option. Instead, the system inserts a placeholder value of `1` . This value doesn't affect the running of your task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-maxconcurrency
     */
    readonly maxConcurrency?: string;

    /**
     * The maximum number of errors allowed before this task stops being scheduled.
     *
     * > Although this element is listed as "Required: No", a value can be omitted only when you are registering or updating a [targetless task](https://docs.aws.amazon.com/systems-manager/latest/userguide/maintenance-windows-targetless-tasks.html) You must provide a value in all other cases.
     * >
     * > For maintenance window tasks without a target specified, you can't supply a value for this option. Instead, the system inserts a placeholder value of `1` . This value doesn't affect the running of your task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-maxerrors
     */
    readonly maxErrors?: string;

    /**
     * The task name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-name
     */
    readonly name?: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) service role to use to publish Amazon Simple Notification Service (Amazon SNS) notifications for maintenance window Run Command tasks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-servicerolearn
     */
    readonly serviceRoleArn?: string;

    /**
     * The targets, either instances or window target IDs.
     *
     * - Specify instances using `Key=InstanceIds,Values= *instanceid1* , *instanceid2*` .
     * - Specify window target IDs using `Key=WindowTargetIds,Values= *window-target-id-1* , *window-target-id-2*` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-targets
     */
    readonly targets?: Array<CfnMaintenanceWindowTask.TargetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The parameters to pass to the task when it runs. Populate only the fields that match the task type. All other fields should be empty.
     *
     * > When you update a maintenance window task that has options specified in `TaskInvocationParameters` , you must provide again all the `TaskInvocationParameters` values that you want to retain. The values you do not specify again are removed. For example, suppose that when you registered a Run Command task, you specified `TaskInvocationParameters` values for `Comment` , `NotificationConfig` , and `OutputS3BucketName` . If you update the maintenance window task and specify only a different `OutputS3BucketName` value, the values for `Comment` and `NotificationConfig` are removed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters
     */
    readonly taskInvocationParameters?: CfnMaintenanceWindowTask.TaskInvocationParametersProperty | cdk.IResolvable;

    /**
     * The parameters to pass to the task when it runs.
     *
     * > `TaskParameters` has been deprecated. To specify parameters to pass to a task when it runs, instead use the `Parameters` option in the `TaskInvocationParameters` structure. For information about how Systems Manager handles these options for the supported maintenance window task types, see [MaintenanceWindowTaskInvocationParameters](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_MaintenanceWindowTaskInvocationParameters.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskparameters
     */
    readonly taskParameters?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnMaintenanceWindowTaskProps`
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowTaskProps`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTaskPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cutoffBehavior', cdk.validateString)(properties.cutoffBehavior));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('loggingInfo', CfnMaintenanceWindowTask_LoggingInfoPropertyValidator)(properties.loggingInfo));
    errors.collect(cdk.propertyValidator('maxConcurrency', cdk.validateString)(properties.maxConcurrency));
    errors.collect(cdk.propertyValidator('maxErrors', cdk.validateString)(properties.maxErrors));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('serviceRoleArn', cdk.validateString)(properties.serviceRoleArn));
    errors.collect(cdk.propertyValidator('targets', cdk.listValidator(CfnMaintenanceWindowTask_TargetPropertyValidator))(properties.targets));
    errors.collect(cdk.propertyValidator('taskArn', cdk.requiredValidator)(properties.taskArn));
    errors.collect(cdk.propertyValidator('taskArn', cdk.validateString)(properties.taskArn));
    errors.collect(cdk.propertyValidator('taskInvocationParameters', CfnMaintenanceWindowTask_TaskInvocationParametersPropertyValidator)(properties.taskInvocationParameters));
    errors.collect(cdk.propertyValidator('taskParameters', cdk.validateObject)(properties.taskParameters));
    errors.collect(cdk.propertyValidator('taskType', cdk.requiredValidator)(properties.taskType));
    errors.collect(cdk.propertyValidator('taskType', cdk.validateString)(properties.taskType));
    errors.collect(cdk.propertyValidator('windowId', cdk.requiredValidator)(properties.windowId));
    errors.collect(cdk.propertyValidator('windowId', cdk.validateString)(properties.windowId));
    return errors.wrap('supplied properties not correct for "CfnMaintenanceWindowTaskProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask` resource
 *
 * @param properties - the TypeScript properties of a `CfnMaintenanceWindowTaskProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTaskPropsValidator(properties).assertSuccess();
    return {
        Priority: cdk.numberToCloudFormation(properties.priority),
        TaskArn: cdk.stringToCloudFormation(properties.taskArn),
        TaskType: cdk.stringToCloudFormation(properties.taskType),
        WindowId: cdk.stringToCloudFormation(properties.windowId),
        CutoffBehavior: cdk.stringToCloudFormation(properties.cutoffBehavior),
        Description: cdk.stringToCloudFormation(properties.description),
        LoggingInfo: cfnMaintenanceWindowTaskLoggingInfoPropertyToCloudFormation(properties.loggingInfo),
        MaxConcurrency: cdk.stringToCloudFormation(properties.maxConcurrency),
        MaxErrors: cdk.stringToCloudFormation(properties.maxErrors),
        Name: cdk.stringToCloudFormation(properties.name),
        ServiceRoleArn: cdk.stringToCloudFormation(properties.serviceRoleArn),
        Targets: cdk.listMapper(cfnMaintenanceWindowTaskTargetPropertyToCloudFormation)(properties.targets),
        TaskInvocationParameters: cfnMaintenanceWindowTaskTaskInvocationParametersPropertyToCloudFormation(properties.taskInvocationParameters),
        TaskParameters: cdk.objectToCloudFormation(properties.taskParameters),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTaskProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTaskProps>();
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('taskArn', 'TaskArn', cfn_parse.FromCloudFormation.getString(properties.TaskArn));
    ret.addPropertyResult('taskType', 'TaskType', cfn_parse.FromCloudFormation.getString(properties.TaskType));
    ret.addPropertyResult('windowId', 'WindowId', cfn_parse.FromCloudFormation.getString(properties.WindowId));
    ret.addPropertyResult('cutoffBehavior', 'CutoffBehavior', properties.CutoffBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.CutoffBehavior) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('loggingInfo', 'LoggingInfo', properties.LoggingInfo != null ? CfnMaintenanceWindowTaskLoggingInfoPropertyFromCloudFormation(properties.LoggingInfo) : undefined);
    ret.addPropertyResult('maxConcurrency', 'MaxConcurrency', properties.MaxConcurrency != null ? cfn_parse.FromCloudFormation.getString(properties.MaxConcurrency) : undefined);
    ret.addPropertyResult('maxErrors', 'MaxErrors', properties.MaxErrors != null ? cfn_parse.FromCloudFormation.getString(properties.MaxErrors) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('serviceRoleArn', 'ServiceRoleArn', properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined);
    ret.addPropertyResult('targets', 'Targets', properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnMaintenanceWindowTaskTargetPropertyFromCloudFormation)(properties.Targets) : undefined);
    ret.addPropertyResult('taskInvocationParameters', 'TaskInvocationParameters', properties.TaskInvocationParameters != null ? CfnMaintenanceWindowTaskTaskInvocationParametersPropertyFromCloudFormation(properties.TaskInvocationParameters) : undefined);
    ret.addPropertyResult('taskParameters', 'TaskParameters', properties.TaskParameters != null ? cfn_parse.FromCloudFormation.getAny(properties.TaskParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::MaintenanceWindowTask`
 *
 * The `AWS::SSM::MaintenanceWindowTask` resource defines information about a task for an AWS Systems Manager maintenance window. For more information, see [RegisterTaskWithMaintenanceWindow](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_RegisterTaskWithMaintenanceWindow.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::MaintenanceWindowTask
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html
 */
export class CfnMaintenanceWindowTask extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::MaintenanceWindowTask";

    /**
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
        const ret = new CfnMaintenanceWindowTask(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The priority of the task in the maintenance window. The lower the number, the higher the priority. Tasks that have the same priority are scheduled in parallel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-priority
     */
    public priority: number;

    /**
     * The resource that the task uses during execution.
     *
     * For `RUN_COMMAND` and `AUTOMATION` task types, `TaskArn` is the SSM document name or Amazon Resource Name (ARN).
     *
     * For `LAMBDA` tasks, `TaskArn` is the function name or ARN.
     *
     * For `STEP_FUNCTIONS` tasks, `TaskArn` is the state machine ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskarn
     */
    public taskArn: string;

    /**
     * The type of task. Valid values: `RUN_COMMAND` , `AUTOMATION` , `LAMBDA` , `STEP_FUNCTIONS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-tasktype
     */
    public taskType: string;

    /**
     * The ID of the maintenance window where the task is registered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-windowid
     */
    public windowId: string;

    /**
     * The specification for whether tasks should continue to run after the cutoff time specified in the maintenance windows is reached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-cutoffbehavior
     */
    public cutoffBehavior: string | undefined;

    /**
     * A description of the task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-description
     */
    public description: string | undefined;

    /**
     * Information about an Amazon S3 bucket to write Run Command task-level logs to.
     *
     * > `LoggingInfo` has been deprecated. To specify an Amazon S3 bucket to contain logs for Run Command tasks, instead use the `OutputS3BucketName` and `OutputS3KeyPrefix` options in the `TaskInvocationParameters` structure. For information about how Systems Manager handles these options for the supported maintenance window task types, see [AWS ::SSM::MaintenanceWindowTask MaintenanceWindowRunCommandParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-logginginfo
     */
    public loggingInfo: CfnMaintenanceWindowTask.LoggingInfoProperty | cdk.IResolvable | undefined;

    /**
     * The maximum number of targets this task can be run for, in parallel.
     *
     * > Although this element is listed as "Required: No", a value can be omitted only when you are registering or updating a [targetless task](https://docs.aws.amazon.com/systems-manager/latest/userguide/maintenance-windows-targetless-tasks.html) You must provide a value in all other cases.
     * >
     * > For maintenance window tasks without a target specified, you can't supply a value for this option. Instead, the system inserts a placeholder value of `1` . This value doesn't affect the running of your task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-maxconcurrency
     */
    public maxConcurrency: string | undefined;

    /**
     * The maximum number of errors allowed before this task stops being scheduled.
     *
     * > Although this element is listed as "Required: No", a value can be omitted only when you are registering or updating a [targetless task](https://docs.aws.amazon.com/systems-manager/latest/userguide/maintenance-windows-targetless-tasks.html) You must provide a value in all other cases.
     * >
     * > For maintenance window tasks without a target specified, you can't supply a value for this option. Instead, the system inserts a placeholder value of `1` . This value doesn't affect the running of your task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-maxerrors
     */
    public maxErrors: string | undefined;

    /**
     * The task name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-name
     */
    public name: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) service role to use to publish Amazon Simple Notification Service (Amazon SNS) notifications for maintenance window Run Command tasks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-servicerolearn
     */
    public serviceRoleArn: string | undefined;

    /**
     * The targets, either instances or window target IDs.
     *
     * - Specify instances using `Key=InstanceIds,Values= *instanceid1* , *instanceid2*` .
     * - Specify window target IDs using `Key=WindowTargetIds,Values= *window-target-id-1* , *window-target-id-2*` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-targets
     */
    public targets: Array<CfnMaintenanceWindowTask.TargetProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The parameters to pass to the task when it runs. Populate only the fields that match the task type. All other fields should be empty.
     *
     * > When you update a maintenance window task that has options specified in `TaskInvocationParameters` , you must provide again all the `TaskInvocationParameters` values that you want to retain. The values you do not specify again are removed. For example, suppose that when you registered a Run Command task, you specified `TaskInvocationParameters` values for `Comment` , `NotificationConfig` , and `OutputS3BucketName` . If you update the maintenance window task and specify only a different `OutputS3BucketName` value, the values for `Comment` and `NotificationConfig` are removed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters
     */
    public taskInvocationParameters: CfnMaintenanceWindowTask.TaskInvocationParametersProperty | cdk.IResolvable | undefined;

    /**
     * The parameters to pass to the task when it runs.
     *
     * > `TaskParameters` has been deprecated. To specify parameters to pass to a task when it runs, instead use the `Parameters` option in the `TaskInvocationParameters` structure. For information about how Systems Manager handles these options for the supported maintenance window task types, see [MaintenanceWindowTaskInvocationParameters](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_MaintenanceWindowTaskInvocationParameters.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskparameters
     */
    public taskParameters: any | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::SSM::MaintenanceWindowTask`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMaintenanceWindowTaskProps) {
        super(scope, id, { type: CfnMaintenanceWindowTask.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'priority', this);
        cdk.requireProperty(props, 'taskArn', this);
        cdk.requireProperty(props, 'taskType', this);
        cdk.requireProperty(props, 'windowId', this);

        this.priority = props.priority;
        this.taskArn = props.taskArn;
        this.taskType = props.taskType;
        this.windowId = props.windowId;
        this.cutoffBehavior = props.cutoffBehavior;
        this.description = props.description;
        this.loggingInfo = props.loggingInfo;
        this.maxConcurrency = props.maxConcurrency;
        this.maxErrors = props.maxErrors;
        this.name = props.name;
        this.serviceRoleArn = props.serviceRoleArn;
        this.targets = props.targets;
        this.taskInvocationParameters = props.taskInvocationParameters;
        this.taskParameters = props.taskParameters;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMaintenanceWindowTask.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            priority: this.priority,
            taskArn: this.taskArn,
            taskType: this.taskType,
            windowId: this.windowId,
            cutoffBehavior: this.cutoffBehavior,
            description: this.description,
            loggingInfo: this.loggingInfo,
            maxConcurrency: this.maxConcurrency,
            maxErrors: this.maxErrors,
            name: this.name,
            serviceRoleArn: this.serviceRoleArn,
            targets: this.targets,
            taskInvocationParameters: this.taskInvocationParameters,
            taskParameters: this.taskParameters,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMaintenanceWindowTaskPropsToCloudFormation(props);
    }
}

export namespace CfnMaintenanceWindowTask {
    /**
     * Configuration options for sending command output to Amazon CloudWatch Logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-cloudwatchoutputconfig.html
     */
    export interface CloudWatchOutputConfigProperty {
        /**
         * The name of the CloudWatch Logs log group where you want to send command output. If you don't specify a group name, AWS Systems Manager automatically creates a log group for you. The log group uses the following naming format:
         *
         * `aws/ssm/ *SystemsManagerDocumentName*`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-cloudwatchoutputconfig.html#cfn-ssm-maintenancewindowtask-cloudwatchoutputconfig-cloudwatchloggroupname
         */
        readonly cloudWatchLogGroupName?: string;
        /**
         * Enables Systems Manager to send command output to CloudWatch Logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-cloudwatchoutputconfig.html#cfn-ssm-maintenancewindowtask-cloudwatchoutputconfig-cloudwatchoutputenabled
         */
        readonly cloudWatchOutputEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchOutputConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchOutputConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_CloudWatchOutputConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogGroupName', cdk.validateString)(properties.cloudWatchLogGroupName));
    errors.collect(cdk.propertyValidator('cloudWatchOutputEnabled', cdk.validateBoolean)(properties.cloudWatchOutputEnabled));
    return errors.wrap('supplied properties not correct for "CloudWatchOutputConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.CloudWatchOutputConfig` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchOutputConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.CloudWatchOutputConfig` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_CloudWatchOutputConfigPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogGroupName: cdk.stringToCloudFormation(properties.cloudWatchLogGroupName),
        CloudWatchOutputEnabled: cdk.booleanToCloudFormation(properties.cloudWatchOutputEnabled),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.CloudWatchOutputConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.CloudWatchOutputConfigProperty>();
    ret.addPropertyResult('cloudWatchLogGroupName', 'CloudWatchLogGroupName', properties.CloudWatchLogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupName) : undefined);
    ret.addPropertyResult('cloudWatchOutputEnabled', 'CloudWatchOutputEnabled', properties.CloudWatchOutputEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchOutputEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMaintenanceWindowTask {
    /**
     * The `LoggingInfo` property type specifies information about the Amazon S3 bucket to write instance-level logs to.
     *
     * `LoggingInfo` is a property of the [AWS::SSM::MaintenanceWindowTask](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html) resource.
     *
     * > `LoggingInfo` has been deprecated. To specify an Amazon S3 bucket to contain logs, instead use the `OutputS3BucketName` and `OutputS3KeyPrefix` options in the `TaskInvocationParameters` structure. For information about how Systems Manager handles these options for the supported maintenance window task types, see [AWS ::SSM::MaintenanceWindowTask MaintenanceWindowRunCommandParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html
     */
    export interface LoggingInfoProperty {
        /**
         * The AWS Region where the S3 bucket is located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-region
         */
        readonly region: string;
        /**
         * The name of an S3 bucket where execution logs are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The Amazon S3 bucket subfolder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-s3prefix
         */
        readonly s3Prefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingInfoProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_LoggingInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('region', cdk.requiredValidator)(properties.region));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Prefix', cdk.validateString)(properties.s3Prefix));
    return errors.wrap('supplied properties not correct for "LoggingInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.LoggingInfo` resource
 *
 * @param properties - the TypeScript properties of a `LoggingInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.LoggingInfo` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskLoggingInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_LoggingInfoPropertyValidator(properties).assertSuccess();
    return {
        Region: cdk.stringToCloudFormation(properties.region),
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3Prefix: cdk.stringToCloudFormation(properties.s3Prefix),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskLoggingInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.LoggingInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.LoggingInfoProperty>();
    ret.addPropertyResult('region', 'Region', cfn_parse.FromCloudFormation.getString(properties.Region));
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3Prefix', 'S3Prefix', properties.S3Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3Prefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMaintenanceWindowTask {
    /**
     * The `MaintenanceWindowAutomationParameters` property type specifies the parameters for an `AUTOMATION` task type for a maintenance window task in AWS Systems Manager .
     *
     * `MaintenanceWindowAutomationParameters` is a property of the [TaskInvocationParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html) property type.
     *
     * For information about available parameters in Automation runbooks, you can view the content of the runbook itself in the Systems Manager console. For information, see [View runbook content](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents-reference-details.html#view-automation-json) in the *AWS Systems Manager User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html
     */
    export interface MaintenanceWindowAutomationParametersProperty {
        /**
         * The version of an Automation runbook to use during task execution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowautomationparameters-documentversion
         */
        readonly documentVersion?: string;
        /**
         * The parameters for the AUTOMATION task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowautomationparameters-parameters
         */
        readonly parameters?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowAutomationParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowAutomationParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_MaintenanceWindowAutomationParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('documentVersion', cdk.validateString)(properties.documentVersion));
    errors.collect(cdk.propertyValidator('parameters', cdk.validateObject)(properties.parameters));
    return errors.wrap('supplied properties not correct for "MaintenanceWindowAutomationParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.MaintenanceWindowAutomationParameters` resource
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowAutomationParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.MaintenanceWindowAutomationParameters` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_MaintenanceWindowAutomationParametersPropertyValidator(properties).assertSuccess();
    return {
        DocumentVersion: cdk.stringToCloudFormation(properties.documentVersion),
        Parameters: cdk.objectToCloudFormation(properties.parameters),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.MaintenanceWindowAutomationParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.MaintenanceWindowAutomationParametersProperty>();
    ret.addPropertyResult('documentVersion', 'DocumentVersion', properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMaintenanceWindowTask {
    /**
     * The `MaintenanceWindowLambdaParameters` property type specifies the parameters for a `LAMBDA` task type for a maintenance window task in AWS Systems Manager .
     *
     * `MaintenanceWindowLambdaParameters` is a property of the [TaskInvocationParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html
     */
    export interface MaintenanceWindowLambdaParametersProperty {
        /**
         * Client-specific information to pass to the AWS Lambda function that you're invoking. You can then use the `context` variable to process the client information in your AWS Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-clientcontext
         */
        readonly clientContext?: string;
        /**
         * JSON to provide to your AWS Lambda function as input.
         *
         * > Although `Type` is listed as "String" for this property, the payload content must be formatted as a Base64-encoded binary data object.
         *
         * *Length Constraint:* 4096
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-payload
         */
        readonly payload?: string;
        /**
         * An AWS Lambda function version or alias name. If you specify a function version, the action uses the qualified function Amazon Resource Name (ARN) to invoke a specific Lambda function. If you specify an alias name, the action uses the alias ARN to invoke the Lambda function version that the alias points to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-qualifier
         */
        readonly qualifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowLambdaParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowLambdaParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_MaintenanceWindowLambdaParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientContext', cdk.validateString)(properties.clientContext));
    errors.collect(cdk.propertyValidator('payload', cdk.validateString)(properties.payload));
    errors.collect(cdk.propertyValidator('qualifier', cdk.validateString)(properties.qualifier));
    return errors.wrap('supplied properties not correct for "MaintenanceWindowLambdaParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.MaintenanceWindowLambdaParameters` resource
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowLambdaParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.MaintenanceWindowLambdaParameters` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_MaintenanceWindowLambdaParametersPropertyValidator(properties).assertSuccess();
    return {
        ClientContext: cdk.stringToCloudFormation(properties.clientContext),
        Payload: cdk.stringToCloudFormation(properties.payload),
        Qualifier: cdk.stringToCloudFormation(properties.qualifier),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.MaintenanceWindowLambdaParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.MaintenanceWindowLambdaParametersProperty>();
    ret.addPropertyResult('clientContext', 'ClientContext', properties.ClientContext != null ? cfn_parse.FromCloudFormation.getString(properties.ClientContext) : undefined);
    ret.addPropertyResult('payload', 'Payload', properties.Payload != null ? cfn_parse.FromCloudFormation.getString(properties.Payload) : undefined);
    ret.addPropertyResult('qualifier', 'Qualifier', properties.Qualifier != null ? cfn_parse.FromCloudFormation.getString(properties.Qualifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMaintenanceWindowTask {
    /**
     * The `MaintenanceWindowRunCommandParameters` property type specifies the parameters for a `RUN_COMMAND` task type for a maintenance window task in AWS Systems Manager . This means that these parameters are the same as those for the `SendCommand` API call. For more information about `SendCommand` parameters, see [SendCommand](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_SendCommand.html) in the *AWS Systems Manager API Reference* .
     *
     * For information about available parameters in SSM Command documents, you can view the content of the document itself in the Systems Manager console. For information, see [Viewing SSM command document content](https://docs.aws.amazon.com/systems-manager/latest/userguide/viewing-ssm-document-content.html) in the *AWS Systems Manager User Guide* .
     *
     * `MaintenanceWindowRunCommandParameters` is a property of the [TaskInvocationParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html
     */
    export interface MaintenanceWindowRunCommandParametersProperty {
        /**
         * Configuration options for sending command output to Amazon CloudWatch Logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-cloudwatchoutputconfig
         */
        readonly cloudWatchOutputConfig?: CfnMaintenanceWindowTask.CloudWatchOutputConfigProperty | cdk.IResolvable;
        /**
         * Information about the command or commands to run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-comment
         */
        readonly comment?: string;
        /**
         * The SHA-256 or SHA-1 hash created by the system when the document was created. SHA-1 hashes have been deprecated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-documenthash
         */
        readonly documentHash?: string;
        /**
         * The SHA-256 or SHA-1 hash type. SHA-1 hashes are deprecated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-documenthashtype
         */
        readonly documentHashType?: string;
        /**
         * The AWS Systems Manager document (SSM document) version to use in the request. You can specify `$DEFAULT` , `$LATEST` , or a specific version number. If you run commands by using the AWS CLI, then you must escape the first two options by using a backslash. If you specify a version number, then you don't need to use the backslash. For example:
         *
         * `--document-version "\$DEFAULT"`
         *
         * `--document-version "\$LATEST"`
         *
         * `--document-version "3"`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-documentversion
         */
        readonly documentVersion?: string;
        /**
         * Configurations for sending notifications about command status changes on a per-managed node basis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-notificationconfig
         */
        readonly notificationConfig?: CfnMaintenanceWindowTask.NotificationConfigProperty | cdk.IResolvable;
        /**
         * The name of the Amazon Simple Storage Service (Amazon S3) bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-outputs3bucketname
         */
        readonly outputS3BucketName?: string;
        /**
         * The S3 bucket subfolder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-outputs3keyprefix
         */
        readonly outputS3KeyPrefix?: string;
        /**
         * The parameters for the `RUN_COMMAND` task execution.
         *
         * The supported parameters are the same as those for the `SendCommand` API call. For more information, see [SendCommand](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_SendCommand.html) in the *AWS Systems Manager API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-parameters
         */
        readonly parameters?: any | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) service role to use to publish Amazon Simple Notification Service (Amazon SNS) notifications for maintenance window Run Command tasks.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-servicerolearn
         */
        readonly serviceRoleArn?: string;
        /**
         * If this time is reached and the command hasn't already started running, it doesn't run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-timeoutseconds
         */
        readonly timeoutSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowRunCommandParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowRunCommandParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_MaintenanceWindowRunCommandParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchOutputConfig', CfnMaintenanceWindowTask_CloudWatchOutputConfigPropertyValidator)(properties.cloudWatchOutputConfig));
    errors.collect(cdk.propertyValidator('comment', cdk.validateString)(properties.comment));
    errors.collect(cdk.propertyValidator('documentHash', cdk.validateString)(properties.documentHash));
    errors.collect(cdk.propertyValidator('documentHashType', cdk.validateString)(properties.documentHashType));
    errors.collect(cdk.propertyValidator('documentVersion', cdk.validateString)(properties.documentVersion));
    errors.collect(cdk.propertyValidator('notificationConfig', CfnMaintenanceWindowTask_NotificationConfigPropertyValidator)(properties.notificationConfig));
    errors.collect(cdk.propertyValidator('outputS3BucketName', cdk.validateString)(properties.outputS3BucketName));
    errors.collect(cdk.propertyValidator('outputS3KeyPrefix', cdk.validateString)(properties.outputS3KeyPrefix));
    errors.collect(cdk.propertyValidator('parameters', cdk.validateObject)(properties.parameters));
    errors.collect(cdk.propertyValidator('serviceRoleArn', cdk.validateString)(properties.serviceRoleArn));
    errors.collect(cdk.propertyValidator('timeoutSeconds', cdk.validateNumber)(properties.timeoutSeconds));
    return errors.wrap('supplied properties not correct for "MaintenanceWindowRunCommandParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.MaintenanceWindowRunCommandParameters` resource
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowRunCommandParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.MaintenanceWindowRunCommandParameters` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_MaintenanceWindowRunCommandParametersPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchOutputConfig: cfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyToCloudFormation(properties.cloudWatchOutputConfig),
        Comment: cdk.stringToCloudFormation(properties.comment),
        DocumentHash: cdk.stringToCloudFormation(properties.documentHash),
        DocumentHashType: cdk.stringToCloudFormation(properties.documentHashType),
        DocumentVersion: cdk.stringToCloudFormation(properties.documentVersion),
        NotificationConfig: cfnMaintenanceWindowTaskNotificationConfigPropertyToCloudFormation(properties.notificationConfig),
        OutputS3BucketName: cdk.stringToCloudFormation(properties.outputS3BucketName),
        OutputS3KeyPrefix: cdk.stringToCloudFormation(properties.outputS3KeyPrefix),
        Parameters: cdk.objectToCloudFormation(properties.parameters),
        ServiceRoleArn: cdk.stringToCloudFormation(properties.serviceRoleArn),
        TimeoutSeconds: cdk.numberToCloudFormation(properties.timeoutSeconds),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.MaintenanceWindowRunCommandParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.MaintenanceWindowRunCommandParametersProperty>();
    ret.addPropertyResult('cloudWatchOutputConfig', 'CloudWatchOutputConfig', properties.CloudWatchOutputConfig != null ? CfnMaintenanceWindowTaskCloudWatchOutputConfigPropertyFromCloudFormation(properties.CloudWatchOutputConfig) : undefined);
    ret.addPropertyResult('comment', 'Comment', properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined);
    ret.addPropertyResult('documentHash', 'DocumentHash', properties.DocumentHash != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentHash) : undefined);
    ret.addPropertyResult('documentHashType', 'DocumentHashType', properties.DocumentHashType != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentHashType) : undefined);
    ret.addPropertyResult('documentVersion', 'DocumentVersion', properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined);
    ret.addPropertyResult('notificationConfig', 'NotificationConfig', properties.NotificationConfig != null ? CfnMaintenanceWindowTaskNotificationConfigPropertyFromCloudFormation(properties.NotificationConfig) : undefined);
    ret.addPropertyResult('outputS3BucketName', 'OutputS3BucketName', properties.OutputS3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3BucketName) : undefined);
    ret.addPropertyResult('outputS3KeyPrefix', 'OutputS3KeyPrefix', properties.OutputS3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.OutputS3KeyPrefix) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined);
    ret.addPropertyResult('serviceRoleArn', 'ServiceRoleArn', properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined);
    ret.addPropertyResult('timeoutSeconds', 'TimeoutSeconds', properties.TimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMaintenanceWindowTask {
    /**
     * The `MaintenanceWindowStepFunctionsParameters` property type specifies the parameters for the execution of a `STEP_FUNCTIONS` task in a Systems Manager maintenance window.
     *
     * `MaintenanceWindowStepFunctionsParameters` is a property of the [TaskInvocationParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters.html
     */
    export interface MaintenanceWindowStepFunctionsParametersProperty {
        /**
         * The inputs for the `STEP_FUNCTIONS` task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters-input
         */
        readonly input?: string;
        /**
         * The name of the `STEP_FUNCTIONS` task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowstepfunctionsparameters-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MaintenanceWindowStepFunctionsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowStepFunctionsParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_MaintenanceWindowStepFunctionsParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "MaintenanceWindowStepFunctionsParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.MaintenanceWindowStepFunctionsParameters` resource
 *
 * @param properties - the TypeScript properties of a `MaintenanceWindowStepFunctionsParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.MaintenanceWindowStepFunctionsParameters` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_MaintenanceWindowStepFunctionsParametersPropertyValidator(properties).assertSuccess();
    return {
        Input: cdk.stringToCloudFormation(properties.input),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.MaintenanceWindowStepFunctionsParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.MaintenanceWindowStepFunctionsParametersProperty>();
    ret.addPropertyResult('input', 'Input', properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMaintenanceWindowTask {
    /**
     * The `NotificationConfig` property type specifies configurations for sending notifications for a maintenance window task in AWS Systems Manager .
     *
     * `NotificationConfig` is a property of the [MaintenanceWindowRunCommandParameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html
     */
    export interface NotificationConfigProperty {
        /**
         * An Amazon Resource Name (ARN) for an Amazon Simple Notification Service (Amazon SNS) topic. Run Command pushes notifications about command status changes to this topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationarn
         */
        readonly notificationArn: string;
        /**
         * The different events that you can receive notifications for. These events include the following: `All` (events), `InProgress` , `Success` , `TimedOut` , `Cancelled` , `Failed` . To learn more about these events, see [Configuring Amazon SNS Notifications for AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-sns-notifications.html) in the *AWS Systems Manager User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationevents
         */
        readonly notificationEvents?: string[];
        /**
         * The notification type.
         *
         * - `Command` : Receive notification when the status of a command changes.
         * - `Invocation` : For commands sent to multiple instances, receive notification on a per-instance basis when the status of a command changes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationtype
         */
        readonly notificationType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_NotificationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('notificationArn', cdk.requiredValidator)(properties.notificationArn));
    errors.collect(cdk.propertyValidator('notificationArn', cdk.validateString)(properties.notificationArn));
    errors.collect(cdk.propertyValidator('notificationEvents', cdk.listValidator(cdk.validateString))(properties.notificationEvents));
    errors.collect(cdk.propertyValidator('notificationType', cdk.validateString)(properties.notificationType));
    return errors.wrap('supplied properties not correct for "NotificationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.NotificationConfig` resource
 *
 * @param properties - the TypeScript properties of a `NotificationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.NotificationConfig` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskNotificationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_NotificationConfigPropertyValidator(properties).assertSuccess();
    return {
        NotificationArn: cdk.stringToCloudFormation(properties.notificationArn),
        NotificationEvents: cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationEvents),
        NotificationType: cdk.stringToCloudFormation(properties.notificationType),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskNotificationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.NotificationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.NotificationConfigProperty>();
    ret.addPropertyResult('notificationArn', 'NotificationArn', cfn_parse.FromCloudFormation.getString(properties.NotificationArn));
    ret.addPropertyResult('notificationEvents', 'NotificationEvents', properties.NotificationEvents != null ? cfn_parse.FromCloudFormation.getStringArray(properties.NotificationEvents) : undefined);
    ret.addPropertyResult('notificationType', 'NotificationType', properties.NotificationType != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMaintenanceWindowTask {
    /**
     * The `Target` property type specifies targets (either instances or window target IDs). You specify instances by using `Key=InstanceIds,Values=< *instanceid1* >,< *instanceid2* >` . You specify window target IDs using `Key=WindowTargetIds,Values=< *window-target-id-1* >,< *window-target-id-2* >` for a maintenance window task in AWS Systems Manager .
     *
     * `Target` is a property of the [AWS::SSM::MaintenanceWindowTask](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html) property type.
     *
     * > To use `resource-groups:Name` as the key for a maintenance window target, specify the resource group as a `AWS::SSM::MaintenanceWindowTarget` type, and use the `Ref` function to specify the target for `AWS::SSM::MaintenanceWindowTask` . For an example, see *Create a Run Command task that targets instances using a resource group name* in [AWS::SSM::MaintenanceWindowTask Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#aws-resource-ssm-maintenancewindowtask--examples) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html
     */
    export interface TargetProperty {
        /**
         * User-defined criteria for sending commands that target instances that meet the criteria. `Key` can be `InstanceIds` or `WindowTargetIds` . For more information about how to target instances within a maintenance window task, see [About 'register-task-with-maintenance-window' Options and Values](https://docs.aws.amazon.com/systems-manager/latest/userguide/register-tasks-options.html) in the *AWS Systems Manager User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html#cfn-ssm-maintenancewindowtask-target-key
         */
        readonly key: string;
        /**
         * User-defined criteria that maps to `Key` . For example, if you specify `InstanceIds` , you can specify `i-1234567890abcdef0,i-9876543210abcdef0` to run a command on two EC2 instances. For more information about how to target instances within a maintenance window task, see [About 'register-task-with-maintenance-window' Options and Values](https://docs.aws.amazon.com/systems-manager/latest/userguide/register-tasks-options.html) in the *AWS Systems Manager User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html#cfn-ssm-maintenancewindowtask-target-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_TargetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "TargetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.Target` resource
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.Target` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskTargetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_TargetPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.TargetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.TargetProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMaintenanceWindowTask {
    /**
     * The `TaskInvocationParameters` property type specifies the task execution parameters for a maintenance window task in AWS Systems Manager .
     *
     * `TaskInvocationParameters` is a property of the [AWS::SSM::MaintenanceWindowTask](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html
     */
    export interface TaskInvocationParametersProperty {
        /**
         * The parameters for an `AUTOMATION` task type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowautomationparameters
         */
        readonly maintenanceWindowAutomationParameters?: CfnMaintenanceWindowTask.MaintenanceWindowAutomationParametersProperty | cdk.IResolvable;
        /**
         * The parameters for a `LAMBDA` task type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowlambdaparameters
         */
        readonly maintenanceWindowLambdaParameters?: CfnMaintenanceWindowTask.MaintenanceWindowLambdaParametersProperty | cdk.IResolvable;
        /**
         * The parameters for a `RUN_COMMAND` task type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowruncommandparameters
         */
        readonly maintenanceWindowRunCommandParameters?: CfnMaintenanceWindowTask.MaintenanceWindowRunCommandParametersProperty | cdk.IResolvable;
        /**
         * The parameters for a `STEP_FUNCTIONS` task type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowstepfunctionsparameters
         */
        readonly maintenanceWindowStepFunctionsParameters?: CfnMaintenanceWindowTask.MaintenanceWindowStepFunctionsParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TaskInvocationParametersProperty`
 *
 * @param properties - the TypeScript properties of a `TaskInvocationParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnMaintenanceWindowTask_TaskInvocationParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maintenanceWindowAutomationParameters', CfnMaintenanceWindowTask_MaintenanceWindowAutomationParametersPropertyValidator)(properties.maintenanceWindowAutomationParameters));
    errors.collect(cdk.propertyValidator('maintenanceWindowLambdaParameters', CfnMaintenanceWindowTask_MaintenanceWindowLambdaParametersPropertyValidator)(properties.maintenanceWindowLambdaParameters));
    errors.collect(cdk.propertyValidator('maintenanceWindowRunCommandParameters', CfnMaintenanceWindowTask_MaintenanceWindowRunCommandParametersPropertyValidator)(properties.maintenanceWindowRunCommandParameters));
    errors.collect(cdk.propertyValidator('maintenanceWindowStepFunctionsParameters', CfnMaintenanceWindowTask_MaintenanceWindowStepFunctionsParametersPropertyValidator)(properties.maintenanceWindowStepFunctionsParameters));
    return errors.wrap('supplied properties not correct for "TaskInvocationParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.TaskInvocationParameters` resource
 *
 * @param properties - the TypeScript properties of a `TaskInvocationParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::MaintenanceWindowTask.TaskInvocationParameters` resource.
 */
// @ts-ignore TS6133
function cfnMaintenanceWindowTaskTaskInvocationParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMaintenanceWindowTask_TaskInvocationParametersPropertyValidator(properties).assertSuccess();
    return {
        MaintenanceWindowAutomationParameters: cfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyToCloudFormation(properties.maintenanceWindowAutomationParameters),
        MaintenanceWindowLambdaParameters: cfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyToCloudFormation(properties.maintenanceWindowLambdaParameters),
        MaintenanceWindowRunCommandParameters: cfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyToCloudFormation(properties.maintenanceWindowRunCommandParameters),
        MaintenanceWindowStepFunctionsParameters: cfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyToCloudFormation(properties.maintenanceWindowStepFunctionsParameters),
    };
}

// @ts-ignore TS6133
function CfnMaintenanceWindowTaskTaskInvocationParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMaintenanceWindowTask.TaskInvocationParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMaintenanceWindowTask.TaskInvocationParametersProperty>();
    ret.addPropertyResult('maintenanceWindowAutomationParameters', 'MaintenanceWindowAutomationParameters', properties.MaintenanceWindowAutomationParameters != null ? CfnMaintenanceWindowTaskMaintenanceWindowAutomationParametersPropertyFromCloudFormation(properties.MaintenanceWindowAutomationParameters) : undefined);
    ret.addPropertyResult('maintenanceWindowLambdaParameters', 'MaintenanceWindowLambdaParameters', properties.MaintenanceWindowLambdaParameters != null ? CfnMaintenanceWindowTaskMaintenanceWindowLambdaParametersPropertyFromCloudFormation(properties.MaintenanceWindowLambdaParameters) : undefined);
    ret.addPropertyResult('maintenanceWindowRunCommandParameters', 'MaintenanceWindowRunCommandParameters', properties.MaintenanceWindowRunCommandParameters != null ? CfnMaintenanceWindowTaskMaintenanceWindowRunCommandParametersPropertyFromCloudFormation(properties.MaintenanceWindowRunCommandParameters) : undefined);
    ret.addPropertyResult('maintenanceWindowStepFunctionsParameters', 'MaintenanceWindowStepFunctionsParameters', properties.MaintenanceWindowStepFunctionsParameters != null ? CfnMaintenanceWindowTaskMaintenanceWindowStepFunctionsParametersPropertyFromCloudFormation(properties.MaintenanceWindowStepFunctionsParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnParameter`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html
 */
export interface CfnParameterProps {

    /**
     * The type of parameter.
     *
     * > AWS CloudFormation doesn't support creating a `SecureString` parameter type.
     *
     * *Allowed Values* : String | StringList
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-type
     */
    readonly type: string;

    /**
     * The parameter value.
     *
     * > If type is `StringList` , the system returns a comma-separated string with no spaces between commas in the `Value` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-value
     */
    readonly value: string;

    /**
     * A regular expression used to validate the parameter value. For example, for String types with values restricted to numbers, you can specify the following: `AllowedPattern=^\d+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-allowedpattern
     */
    readonly allowedPattern?: string;

    /**
     * The data type of the parameter, such as `text` or `aws:ec2:image` . The default is `text` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-datatype
     */
    readonly dataType?: string;

    /**
     * Information about the parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-description
     */
    readonly description?: string;

    /**
     * The name of the parameter.
     *
     * > The maximum length constraint listed below includes capacity for additional system attributes that aren't part of the name. The maximum length for a parameter name, including the full length of the parameter ARN, is 1011 characters. For example, the length of the following parameter name is 65 characters, not 20 characters: `arn:aws:ssm:us-east-2:111222333444:parameter/ExampleParameterName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-name
     */
    readonly name?: string;

    /**
     * Information about the policies assigned to a parameter.
     *
     * [Assigning parameter policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-policies.html) in the *AWS Systems Manager User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-policies
     */
    readonly policies?: string;

    /**
     * Optional metadata that you assign to a resource in the form of an arbitrary set of tags (key-value pairs). Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a Systems Manager parameter to identify the type of resource to which it applies, the environment, or the type of configuration data referenced by the parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-tags
     */
    readonly tags?: any;

    /**
     * The parameter tier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-tier
     */
    readonly tier?: string;
}

/**
 * Determine whether the given properties match those of a `CfnParameterProps`
 *
 * @param properties - the TypeScript properties of a `CfnParameterProps`
 *
 * @returns the result of the validation.
 */
function CfnParameterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedPattern', cdk.validateString)(properties.allowedPattern));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('policies', cdk.validateString)(properties.policies));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('tier', cdk.validateString)(properties.tier));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CfnParameterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::Parameter` resource
 *
 * @param properties - the TypeScript properties of a `CfnParameterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::Parameter` resource.
 */
// @ts-ignore TS6133
function cfnParameterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnParameterPropsValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
        AllowedPattern: cdk.stringToCloudFormation(properties.allowedPattern),
        DataType: cdk.stringToCloudFormation(properties.dataType),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Policies: cdk.stringToCloudFormation(properties.policies),
        Tags: cdk.objectToCloudFormation(properties.tags),
        Tier: cdk.stringToCloudFormation(properties.tier),
    };
}

// @ts-ignore TS6133
function CfnParameterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnParameterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnParameterProps>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addPropertyResult('allowedPattern', 'AllowedPattern', properties.AllowedPattern != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedPattern) : undefined);
    ret.addPropertyResult('dataType', 'DataType', properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('policies', 'Policies', properties.Policies != null ? cfn_parse.FromCloudFormation.getString(properties.Policies) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('tier', 'Tier', properties.Tier != null ? cfn_parse.FromCloudFormation.getString(properties.Tier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::Parameter`
 *
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
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html
 */
export class CfnParameter extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::Parameter";

    /**
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
        const ret = new CfnParameter(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the type of the parameter. Valid values are `String` or `StringList` .
     * @cloudformationAttribute Type
     */
    public readonly attrType: string;

    /**
     * Returns the value of the parameter.
     * @cloudformationAttribute Value
     */
    public readonly attrValue: string;

    /**
     * The type of parameter.
     *
     * > AWS CloudFormation doesn't support creating a `SecureString` parameter type.
     *
     * *Allowed Values* : String | StringList
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-type
     */
    public type: string;

    /**
     * The parameter value.
     *
     * > If type is `StringList` , the system returns a comma-separated string with no spaces between commas in the `Value` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-value
     */
    public value: string;

    /**
     * A regular expression used to validate the parameter value. For example, for String types with values restricted to numbers, you can specify the following: `AllowedPattern=^\d+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-allowedpattern
     */
    public allowedPattern: string | undefined;

    /**
     * The data type of the parameter, such as `text` or `aws:ec2:image` . The default is `text` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-datatype
     */
    public dataType: string | undefined;

    /**
     * Information about the parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-description
     */
    public description: string | undefined;

    /**
     * The name of the parameter.
     *
     * > The maximum length constraint listed below includes capacity for additional system attributes that aren't part of the name. The maximum length for a parameter name, including the full length of the parameter ARN, is 1011 characters. For example, the length of the following parameter name is 65 characters, not 20 characters: `arn:aws:ssm:us-east-2:111222333444:parameter/ExampleParameterName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-name
     */
    public name: string | undefined;

    /**
     * Information about the policies assigned to a parameter.
     *
     * [Assigning parameter policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-policies.html) in the *AWS Systems Manager User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-policies
     */
    public policies: string | undefined;

    /**
     * Optional metadata that you assign to a resource in the form of an arbitrary set of tags (key-value pairs). Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a Systems Manager parameter to identify the type of resource to which it applies, the environment, or the type of configuration data referenced by the parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The parameter tier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#cfn-ssm-parameter-tier
     */
    public tier: string | undefined;

    /**
     * Create a new `AWS::SSM::Parameter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnParameterProps) {
        super(scope, id, { type: CfnParameter.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'type', this);
        cdk.requireProperty(props, 'value', this);
        this.attrType = cdk.Token.asString(this.getAtt('Type', cdk.ResolutionTypeHint.STRING));
        this.attrValue = cdk.Token.asString(this.getAtt('Value', cdk.ResolutionTypeHint.STRING));

        this.type = props.type;
        this.value = props.value;
        this.allowedPattern = props.allowedPattern;
        this.dataType = props.dataType;
        this.description = props.description;
        this.name = props.name;
        this.policies = props.policies;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::SSM::Parameter", props.tags, { tagPropertyName: 'tags' });
        this.tier = props.tier;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnParameter.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            type: this.type,
            value: this.value,
            allowedPattern: this.allowedPattern,
            dataType: this.dataType,
            description: this.description,
            name: this.name,
            policies: this.policies,
            tags: this.tags.renderTags(),
            tier: this.tier,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnParameterPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPatchBaseline`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html
 */
export interface CfnPatchBaselineProps {

    /**
     * The name of the patch baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-name
     */
    readonly name: string;

    /**
     * A set of rules used to include patches in the baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvalrules
     */
    readonly approvalRules?: CfnPatchBaseline.RuleGroupProperty | cdk.IResolvable;

    /**
     * A list of explicitly approved patches for the baseline.
     *
     * For information about accepted formats for lists of approved patches and rejected patches, see [About package name formats for approved and rejected patch lists](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-approved-rejected-package-name-formats.html) in the *AWS Systems Manager User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatches
     */
    readonly approvedPatches?: string[];

    /**
     * Defines the compliance level for approved patches. When an approved patch is reported as missing, this value describes the severity of the compliance violation. The default value is `UNSPECIFIED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatchescompliancelevel
     */
    readonly approvedPatchesComplianceLevel?: string;

    /**
     * Indicates whether the list of approved patches includes non-security updates that should be applied to the managed nodes. The default value is `false` . Applies to Linux managed nodes only.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatchesenablenonsecurity
     */
    readonly approvedPatchesEnableNonSecurity?: boolean | cdk.IResolvable;

    /**
     * A description of the patch baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-description
     */
    readonly description?: string;

    /**
     * A set of global filters used to include patches in the baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-globalfilters
     */
    readonly globalFilters?: CfnPatchBaseline.PatchFilterGroupProperty | cdk.IResolvable;

    /**
     * Defines the operating system the patch baseline applies to. The default value is `WINDOWS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-operatingsystem
     */
    readonly operatingSystem?: string;

    /**
     * The name of the patch group to be registered with the patch baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-patchgroups
     */
    readonly patchGroups?: string[];

    /**
     * A list of explicitly rejected patches for the baseline.
     *
     * For information about accepted formats for lists of approved patches and rejected patches, see [About package name formats for approved and rejected patch lists](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-approved-rejected-package-name-formats.html) in the *AWS Systems Manager User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-rejectedpatches
     */
    readonly rejectedPatches?: string[];

    /**
     * The action for Patch Manager to take on patches included in the `RejectedPackages` list.
     *
     * - *`ALLOW_AS_DEPENDENCY`* : A package in the `Rejected` patches list is installed only if it is a dependency of another package. It is considered compliant with the patch baseline, and its status is reported as `InstalledOther` . This is the default action if no option is specified.
     * - *`BLOCK`* : Packages in the `RejectedPatches` list, and packages that include them as dependencies, aren't installed under any circumstances. If a package was installed before it was added to the Rejected patches list, it is considered non-compliant with the patch baseline, and its status is reported as `InstalledRejected` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-rejectedpatchesaction
     */
    readonly rejectedPatchesAction?: string;

    /**
     * Information about the patches to use to update the managed nodes, including target operating systems and source repositories. Applies to Linux managed nodes only.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-sources
     */
    readonly sources?: Array<CfnPatchBaseline.PatchSourceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Optional metadata that you assign to a resource. Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a patch baseline to identify the severity level of patches it specifies and the operating system family it applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPatchBaselineProps`
 *
 * @param properties - the TypeScript properties of a `CfnPatchBaselineProps`
 *
 * @returns the result of the validation.
 */
function CfnPatchBaselinePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('approvalRules', CfnPatchBaseline_RuleGroupPropertyValidator)(properties.approvalRules));
    errors.collect(cdk.propertyValidator('approvedPatches', cdk.listValidator(cdk.validateString))(properties.approvedPatches));
    errors.collect(cdk.propertyValidator('approvedPatchesComplianceLevel', cdk.validateString)(properties.approvedPatchesComplianceLevel));
    errors.collect(cdk.propertyValidator('approvedPatchesEnableNonSecurity', cdk.validateBoolean)(properties.approvedPatchesEnableNonSecurity));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('globalFilters', CfnPatchBaseline_PatchFilterGroupPropertyValidator)(properties.globalFilters));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('operatingSystem', cdk.validateString)(properties.operatingSystem));
    errors.collect(cdk.propertyValidator('patchGroups', cdk.listValidator(cdk.validateString))(properties.patchGroups));
    errors.collect(cdk.propertyValidator('rejectedPatches', cdk.listValidator(cdk.validateString))(properties.rejectedPatches));
    errors.collect(cdk.propertyValidator('rejectedPatchesAction', cdk.validateString)(properties.rejectedPatchesAction));
    errors.collect(cdk.propertyValidator('sources', cdk.listValidator(CfnPatchBaseline_PatchSourcePropertyValidator))(properties.sources));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPatchBaselineProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline` resource
 *
 * @param properties - the TypeScript properties of a `CfnPatchBaselineProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline` resource.
 */
// @ts-ignore TS6133
function cfnPatchBaselinePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPatchBaselinePropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ApprovalRules: cfnPatchBaselineRuleGroupPropertyToCloudFormation(properties.approvalRules),
        ApprovedPatches: cdk.listMapper(cdk.stringToCloudFormation)(properties.approvedPatches),
        ApprovedPatchesComplianceLevel: cdk.stringToCloudFormation(properties.approvedPatchesComplianceLevel),
        ApprovedPatchesEnableNonSecurity: cdk.booleanToCloudFormation(properties.approvedPatchesEnableNonSecurity),
        Description: cdk.stringToCloudFormation(properties.description),
        GlobalFilters: cfnPatchBaselinePatchFilterGroupPropertyToCloudFormation(properties.globalFilters),
        OperatingSystem: cdk.stringToCloudFormation(properties.operatingSystem),
        PatchGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.patchGroups),
        RejectedPatches: cdk.listMapper(cdk.stringToCloudFormation)(properties.rejectedPatches),
        RejectedPatchesAction: cdk.stringToCloudFormation(properties.rejectedPatchesAction),
        Sources: cdk.listMapper(cfnPatchBaselinePatchSourcePropertyToCloudFormation)(properties.sources),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPatchBaselinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPatchBaselineProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaselineProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('approvalRules', 'ApprovalRules', properties.ApprovalRules != null ? CfnPatchBaselineRuleGroupPropertyFromCloudFormation(properties.ApprovalRules) : undefined);
    ret.addPropertyResult('approvedPatches', 'ApprovedPatches', properties.ApprovedPatches != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ApprovedPatches) : undefined);
    ret.addPropertyResult('approvedPatchesComplianceLevel', 'ApprovedPatchesComplianceLevel', properties.ApprovedPatchesComplianceLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ApprovedPatchesComplianceLevel) : undefined);
    ret.addPropertyResult('approvedPatchesEnableNonSecurity', 'ApprovedPatchesEnableNonSecurity', properties.ApprovedPatchesEnableNonSecurity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApprovedPatchesEnableNonSecurity) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('globalFilters', 'GlobalFilters', properties.GlobalFilters != null ? CfnPatchBaselinePatchFilterGroupPropertyFromCloudFormation(properties.GlobalFilters) : undefined);
    ret.addPropertyResult('operatingSystem', 'OperatingSystem', properties.OperatingSystem != null ? cfn_parse.FromCloudFormation.getString(properties.OperatingSystem) : undefined);
    ret.addPropertyResult('patchGroups', 'PatchGroups', properties.PatchGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PatchGroups) : undefined);
    ret.addPropertyResult('rejectedPatches', 'RejectedPatches', properties.RejectedPatches != null ? cfn_parse.FromCloudFormation.getStringArray(properties.RejectedPatches) : undefined);
    ret.addPropertyResult('rejectedPatchesAction', 'RejectedPatchesAction', properties.RejectedPatchesAction != null ? cfn_parse.FromCloudFormation.getString(properties.RejectedPatchesAction) : undefined);
    ret.addPropertyResult('sources', 'Sources', properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnPatchBaselinePatchSourcePropertyFromCloudFormation)(properties.Sources) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::PatchBaseline`
 *
 * The `AWS::SSM::PatchBaseline` resource defines the basic information for an AWS Systems Manager patch baseline. A patch baseline defines which patches are approved for installation on your instances.
 *
 * For more information, see [CreatePatchBaseline](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_CreatePatchBaseline.html) in the *AWS Systems Manager API Reference* .
 *
 * @cloudformationResource AWS::SSM::PatchBaseline
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html
 */
export class CfnPatchBaseline extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::PatchBaseline";

    /**
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
        const ret = new CfnPatchBaseline(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the patch baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-name
     */
    public name: string;

    /**
     * A set of rules used to include patches in the baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvalrules
     */
    public approvalRules: CfnPatchBaseline.RuleGroupProperty | cdk.IResolvable | undefined;

    /**
     * A list of explicitly approved patches for the baseline.
     *
     * For information about accepted formats for lists of approved patches and rejected patches, see [About package name formats for approved and rejected patch lists](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-approved-rejected-package-name-formats.html) in the *AWS Systems Manager User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatches
     */
    public approvedPatches: string[] | undefined;

    /**
     * Defines the compliance level for approved patches. When an approved patch is reported as missing, this value describes the severity of the compliance violation. The default value is `UNSPECIFIED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatchescompliancelevel
     */
    public approvedPatchesComplianceLevel: string | undefined;

    /**
     * Indicates whether the list of approved patches includes non-security updates that should be applied to the managed nodes. The default value is `false` . Applies to Linux managed nodes only.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-approvedpatchesenablenonsecurity
     */
    public approvedPatchesEnableNonSecurity: boolean | cdk.IResolvable | undefined;

    /**
     * A description of the patch baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-description
     */
    public description: string | undefined;

    /**
     * A set of global filters used to include patches in the baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-globalfilters
     */
    public globalFilters: CfnPatchBaseline.PatchFilterGroupProperty | cdk.IResolvable | undefined;

    /**
     * Defines the operating system the patch baseline applies to. The default value is `WINDOWS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-operatingsystem
     */
    public operatingSystem: string | undefined;

    /**
     * The name of the patch group to be registered with the patch baseline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-patchgroups
     */
    public patchGroups: string[] | undefined;

    /**
     * A list of explicitly rejected patches for the baseline.
     *
     * For information about accepted formats for lists of approved patches and rejected patches, see [About package name formats for approved and rejected patch lists](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-approved-rejected-package-name-formats.html) in the *AWS Systems Manager User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-rejectedpatches
     */
    public rejectedPatches: string[] | undefined;

    /**
     * The action for Patch Manager to take on patches included in the `RejectedPackages` list.
     *
     * - *`ALLOW_AS_DEPENDENCY`* : A package in the `Rejected` patches list is installed only if it is a dependency of another package. It is considered compliant with the patch baseline, and its status is reported as `InstalledOther` . This is the default action if no option is specified.
     * - *`BLOCK`* : Packages in the `RejectedPatches` list, and packages that include them as dependencies, aren't installed under any circumstances. If a package was installed before it was added to the Rejected patches list, it is considered non-compliant with the patch baseline, and its status is reported as `InstalledRejected` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-rejectedpatchesaction
     */
    public rejectedPatchesAction: string | undefined;

    /**
     * Information about the patches to use to update the managed nodes, including target operating systems and source repositories. Applies to Linux managed nodes only.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-sources
     */
    public sources: Array<CfnPatchBaseline.PatchSourceProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Optional metadata that you assign to a resource. Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For example, you might want to tag a patch baseline to identify the severity level of patches it specifies and the operating system family it applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html#cfn-ssm-patchbaseline-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::SSM::PatchBaseline`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPatchBaselineProps) {
        super(scope, id, { type: CfnPatchBaseline.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.approvalRules = props.approvalRules;
        this.approvedPatches = props.approvedPatches;
        this.approvedPatchesComplianceLevel = props.approvedPatchesComplianceLevel;
        this.approvedPatchesEnableNonSecurity = props.approvedPatchesEnableNonSecurity;
        this.description = props.description;
        this.globalFilters = props.globalFilters;
        this.operatingSystem = props.operatingSystem;
        this.patchGroups = props.patchGroups;
        this.rejectedPatches = props.rejectedPatches;
        this.rejectedPatchesAction = props.rejectedPatchesAction;
        this.sources = props.sources;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSM::PatchBaseline", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPatchBaseline.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            approvalRules: this.approvalRules,
            approvedPatches: this.approvedPatches,
            approvedPatchesComplianceLevel: this.approvedPatchesComplianceLevel,
            approvedPatchesEnableNonSecurity: this.approvedPatchesEnableNonSecurity,
            description: this.description,
            globalFilters: this.globalFilters,
            operatingSystem: this.operatingSystem,
            patchGroups: this.patchGroups,
            rejectedPatches: this.rejectedPatches,
            rejectedPatchesAction: this.rejectedPatchesAction,
            sources: this.sources,
            tags: this.tags.renderTags(),
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPatchBaselinePropsToCloudFormation(props);
    }
}

export namespace CfnPatchBaseline {
    /**
     * The `PatchFilter` property type defines a patch filter for an AWS Systems Manager patch baseline.
     *
     * The `PatchFilters` property of the [PatchFilterGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html) property type contains a list of `PatchFilter` property types.
     *
     * You can view lists of valid values for the patch properties by running the `DescribePatchProperties` command. For more information, see [DescribePatchProperties](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_DescribePatchProperties.html) in the *AWS Systems Manager API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html
     */
    export interface PatchFilterProperty {
        /**
         * The key for the filter.
         *
         * For information about valid keys, see [PatchFilter](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PatchFilter.html) in the *AWS Systems Manager API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html#cfn-ssm-patchbaseline-patchfilter-key
         */
        readonly key?: string;
        /**
         * The value for the filter key.
         *
         * For information about valid values for each key based on operating system type, see [PatchFilter](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PatchFilter.html) in the *AWS Systems Manager API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfilter.html#cfn-ssm-patchbaseline-patchfilter-values
         */
        readonly values?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `PatchFilterProperty`
 *
 * @param properties - the TypeScript properties of a `PatchFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnPatchBaseline_PatchFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "PatchFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.PatchFilter` resource
 *
 * @param properties - the TypeScript properties of a `PatchFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.PatchFilter` resource.
 */
// @ts-ignore TS6133
function cfnPatchBaselinePatchFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPatchBaseline_PatchFilterPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnPatchBaselinePatchFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPatchBaseline.PatchFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.PatchFilterProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPatchBaseline {
    /**
     * The `PatchFilterGroup` property type specifies a set of patch filters for an AWS Systems Manager patch baseline, typically used for approval rules for a Systems Manager patch baseline.
     *
     * `PatchFilterGroup` is the property type for the `GlobalFilters` property of the [AWS::SSM::PatchBaseline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html) resource and the `PatchFilterGroup` property of the [Rule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html
     */
    export interface PatchFilterGroupProperty {
        /**
         * The set of patch filters that make up the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchfiltergroup.html#cfn-ssm-patchbaseline-patchfiltergroup-patchfilters
         */
        readonly patchFilters?: Array<CfnPatchBaseline.PatchFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PatchFilterGroupProperty`
 *
 * @param properties - the TypeScript properties of a `PatchFilterGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnPatchBaseline_PatchFilterGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('patchFilters', cdk.listValidator(CfnPatchBaseline_PatchFilterPropertyValidator))(properties.patchFilters));
    return errors.wrap('supplied properties not correct for "PatchFilterGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.PatchFilterGroup` resource
 *
 * @param properties - the TypeScript properties of a `PatchFilterGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.PatchFilterGroup` resource.
 */
// @ts-ignore TS6133
function cfnPatchBaselinePatchFilterGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPatchBaseline_PatchFilterGroupPropertyValidator(properties).assertSuccess();
    return {
        PatchFilters: cdk.listMapper(cfnPatchBaselinePatchFilterPropertyToCloudFormation)(properties.patchFilters),
    };
}

// @ts-ignore TS6133
function CfnPatchBaselinePatchFilterGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPatchBaseline.PatchFilterGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.PatchFilterGroupProperty>();
    ret.addPropertyResult('patchFilters', 'PatchFilters', properties.PatchFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnPatchBaselinePatchFilterPropertyFromCloudFormation)(properties.PatchFilters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPatchBaseline {
    /**
     * `PatchSource` is the property type for the `Sources` resource of the [AWS::SSM::PatchBaseline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html) resource.
     *
     * The AWS CloudFormation `AWS::SSM::PatchSource` resource is used to provide information about the patches to use to update target instances, including target operating systems and source repository. Applies to Linux instances only.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchsource.html
     */
    export interface PatchSourceProperty {
        /**
         * The value of the yum repo configuration. For example:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchsource.html#cfn-ssm-patchbaseline-patchsource-configuration
         */
        readonly configuration?: string;
        /**
         * The name specified to identify the patch source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchsource.html#cfn-ssm-patchbaseline-patchsource-name
         */
        readonly name?: string;
        /**
         * The specific operating system versions a patch repository applies to, such as "Ubuntu16.04", "AmazonLinux2016.09", "RedhatEnterpriseLinux7.2" or "Suse12.7". For lists of supported product values, see [PatchFilter](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PatchFilter.html) in the *AWS Systems Manager API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-patchsource.html#cfn-ssm-patchbaseline-patchsource-products
         */
        readonly products?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `PatchSourceProperty`
 *
 * @param properties - the TypeScript properties of a `PatchSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPatchBaseline_PatchSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configuration', cdk.validateString)(properties.configuration));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('products', cdk.listValidator(cdk.validateString))(properties.products));
    return errors.wrap('supplied properties not correct for "PatchSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.PatchSource` resource
 *
 * @param properties - the TypeScript properties of a `PatchSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.PatchSource` resource.
 */
// @ts-ignore TS6133
function cfnPatchBaselinePatchSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPatchBaseline_PatchSourcePropertyValidator(properties).assertSuccess();
    return {
        Configuration: cdk.stringToCloudFormation(properties.configuration),
        Name: cdk.stringToCloudFormation(properties.name),
        Products: cdk.listMapper(cdk.stringToCloudFormation)(properties.products),
    };
}

// @ts-ignore TS6133
function CfnPatchBaselinePatchSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPatchBaseline.PatchSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.PatchSourceProperty>();
    ret.addPropertyResult('configuration', 'Configuration', properties.Configuration != null ? cfn_parse.FromCloudFormation.getString(properties.Configuration) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('products', 'Products', properties.Products != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Products) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPatchBaseline {
    /**
     * The `Rule` property type specifies an approval rule for a Systems Manager patch baseline.
     *
     * The `PatchRules` property of the [RuleGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html) property type contains a list of `Rule` property types.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html
     */
    export interface RuleProperty {
        /**
         * The number of days after the release date of each patch matched by the rule that the patch is marked as approved in the patch baseline. For example, a value of `7` means that patches are approved seven days after they are released.
         *
         * You must specify a value for `ApproveAfterDays` .
         *
         * Exception: Not supported on Debian Server or Ubuntu Server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-approveafterdays
         */
        readonly approveAfterDays?: number;
        /**
         * The cutoff date for auto approval of released patches. Any patches released on or before this date are installed automatically. Not supported on Debian Server or Ubuntu Server.
         *
         * Enter dates in the format `YYYY-MM-DD` . For example, `2021-12-31` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-approveuntildate
         */
        readonly approveUntilDate?: string;
        /**
         * A compliance severity level for all approved patches in a patch baseline. Valid compliance severity levels include the following: `UNSPECIFIED` , `CRITICAL` , `HIGH` , `MEDIUM` , `LOW` , and `INFORMATIONAL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-compliancelevel
         */
        readonly complianceLevel?: string;
        /**
         * For managed nodes identified by the approval rule filters, enables a patch baseline to apply non-security updates available in the specified repository. The default value is `false` . Applies to Linux managed nodes only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-enablenonsecurity
         */
        readonly enableNonSecurity?: boolean | cdk.IResolvable;
        /**
         * The patch filter group that defines the criteria for the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rule.html#cfn-ssm-patchbaseline-rule-patchfiltergroup
         */
        readonly patchFilterGroup?: CfnPatchBaseline.PatchFilterGroupProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnPatchBaseline_RulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('approveAfterDays', cdk.validateNumber)(properties.approveAfterDays));
    errors.collect(cdk.propertyValidator('approveUntilDate', cdk.validateString)(properties.approveUntilDate));
    errors.collect(cdk.propertyValidator('complianceLevel', cdk.validateString)(properties.complianceLevel));
    errors.collect(cdk.propertyValidator('enableNonSecurity', cdk.validateBoolean)(properties.enableNonSecurity));
    errors.collect(cdk.propertyValidator('patchFilterGroup', CfnPatchBaseline_PatchFilterGroupPropertyValidator)(properties.patchFilterGroup));
    return errors.wrap('supplied properties not correct for "RuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.Rule` resource
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.Rule` resource.
 */
// @ts-ignore TS6133
function cfnPatchBaselineRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPatchBaseline_RulePropertyValidator(properties).assertSuccess();
    return {
        ApproveAfterDays: cdk.numberToCloudFormation(properties.approveAfterDays),
        ApproveUntilDate: cdk.stringToCloudFormation(properties.approveUntilDate),
        ComplianceLevel: cdk.stringToCloudFormation(properties.complianceLevel),
        EnableNonSecurity: cdk.booleanToCloudFormation(properties.enableNonSecurity),
        PatchFilterGroup: cfnPatchBaselinePatchFilterGroupPropertyToCloudFormation(properties.patchFilterGroup),
    };
}

// @ts-ignore TS6133
function CfnPatchBaselineRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPatchBaseline.RuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.RuleProperty>();
    ret.addPropertyResult('approveAfterDays', 'ApproveAfterDays', properties.ApproveAfterDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ApproveAfterDays) : undefined);
    ret.addPropertyResult('approveUntilDate', 'ApproveUntilDate', properties.ApproveUntilDate != null ? cfn_parse.FromCloudFormation.getString(properties.ApproveUntilDate) : undefined);
    ret.addPropertyResult('complianceLevel', 'ComplianceLevel', properties.ComplianceLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ComplianceLevel) : undefined);
    ret.addPropertyResult('enableNonSecurity', 'EnableNonSecurity', properties.EnableNonSecurity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableNonSecurity) : undefined);
    ret.addPropertyResult('patchFilterGroup', 'PatchFilterGroup', properties.PatchFilterGroup != null ? CfnPatchBaselinePatchFilterGroupPropertyFromCloudFormation(properties.PatchFilterGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPatchBaseline {
    /**
     * The `RuleGroup` property type specifies a set of rules that define the approval rules for an AWS Systems Manager patch baseline.
     *
     * `RuleGroup` is the property type for the `ApprovalRules` property of the [AWS::SSM::PatchBaseline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html
     */
    export interface RuleGroupProperty {
        /**
         * The rules that make up the rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-patchbaseline-rulegroup.html#cfn-ssm-patchbaseline-rulegroup-patchrules
         */
        readonly patchRules?: Array<CfnPatchBaseline.RuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleGroupProperty`
 *
 * @param properties - the TypeScript properties of a `RuleGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnPatchBaseline_RuleGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('patchRules', cdk.listValidator(CfnPatchBaseline_RulePropertyValidator))(properties.patchRules));
    return errors.wrap('supplied properties not correct for "RuleGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.RuleGroup` resource
 *
 * @param properties - the TypeScript properties of a `RuleGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::PatchBaseline.RuleGroup` resource.
 */
// @ts-ignore TS6133
function cfnPatchBaselineRuleGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPatchBaseline_RuleGroupPropertyValidator(properties).assertSuccess();
    return {
        PatchRules: cdk.listMapper(cfnPatchBaselineRulePropertyToCloudFormation)(properties.patchRules),
    };
}

// @ts-ignore TS6133
function CfnPatchBaselineRuleGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPatchBaseline.RuleGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPatchBaseline.RuleGroupProperty>();
    ret.addPropertyResult('patchRules', 'PatchRules', properties.PatchRules != null ? cfn_parse.FromCloudFormation.getArray(CfnPatchBaselineRulePropertyFromCloudFormation)(properties.PatchRules) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnResourceDataSync`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html
 */
export interface CfnResourceDataSyncProps {

    /**
     * A name for the resource data sync.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncname
     */
    readonly syncName: string;

    /**
     * The name of the S3 bucket where the aggregated data is stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketname
     */
    readonly bucketName?: string;

    /**
     * An Amazon S3 prefix for the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The AWS Region with the S3 bucket targeted by the resource data sync.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketregion
     */
    readonly bucketRegion?: string;

    /**
     * The ARN of an encryption key for a destination in Amazon S3 . You can use a KMS key to encrypt inventory data in Amazon S3 . You must specify a key that exist in the same region as the destination Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * Configuration information for the target S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-s3destination
     */
    readonly s3Destination?: CfnResourceDataSync.S3DestinationProperty | cdk.IResolvable;

    /**
     * A supported sync format. The following format is currently supported: JsonSerDe
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncformat
     */
    readonly syncFormat?: string;

    /**
     * Information about the source where the data was synchronized.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncsource
     */
    readonly syncSource?: CfnResourceDataSync.SyncSourceProperty | cdk.IResolvable;

    /**
     * The type of resource data sync. If `SyncType` is `SyncToDestination` , then the resource data sync synchronizes data to an S3 bucket. If the `SyncType` is `SyncFromSource` then the resource data sync synchronizes data from AWS Organizations or from multiple AWS Regions .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-synctype
     */
    readonly syncType?: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourceDataSyncProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceDataSyncProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceDataSyncPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketPrefix', cdk.validateString)(properties.bucketPrefix));
    errors.collect(cdk.propertyValidator('bucketRegion', cdk.validateString)(properties.bucketRegion));
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('s3Destination', CfnResourceDataSync_S3DestinationPropertyValidator)(properties.s3Destination));
    errors.collect(cdk.propertyValidator('syncFormat', cdk.validateString)(properties.syncFormat));
    errors.collect(cdk.propertyValidator('syncName', cdk.requiredValidator)(properties.syncName));
    errors.collect(cdk.propertyValidator('syncName', cdk.validateString)(properties.syncName));
    errors.collect(cdk.propertyValidator('syncSource', CfnResourceDataSync_SyncSourcePropertyValidator)(properties.syncSource));
    errors.collect(cdk.propertyValidator('syncType', cdk.validateString)(properties.syncType));
    return errors.wrap('supplied properties not correct for "CfnResourceDataSyncProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::ResourceDataSync` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceDataSyncProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::ResourceDataSync` resource.
 */
// @ts-ignore TS6133
function cfnResourceDataSyncPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceDataSyncPropsValidator(properties).assertSuccess();
    return {
        SyncName: cdk.stringToCloudFormation(properties.syncName),
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        BucketPrefix: cdk.stringToCloudFormation(properties.bucketPrefix),
        BucketRegion: cdk.stringToCloudFormation(properties.bucketRegion),
        KMSKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        S3Destination: cfnResourceDataSyncS3DestinationPropertyToCloudFormation(properties.s3Destination),
        SyncFormat: cdk.stringToCloudFormation(properties.syncFormat),
        SyncSource: cfnResourceDataSyncSyncSourcePropertyToCloudFormation(properties.syncSource),
        SyncType: cdk.stringToCloudFormation(properties.syncType),
    };
}

// @ts-ignore TS6133
function CfnResourceDataSyncPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDataSyncProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDataSyncProps>();
    ret.addPropertyResult('syncName', 'SyncName', cfn_parse.FromCloudFormation.getString(properties.SyncName));
    ret.addPropertyResult('bucketName', 'BucketName', properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined);
    ret.addPropertyResult('bucketPrefix', 'BucketPrefix', properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined);
    ret.addPropertyResult('bucketRegion', 'BucketRegion', properties.BucketRegion != null ? cfn_parse.FromCloudFormation.getString(properties.BucketRegion) : undefined);
    ret.addPropertyResult('kmsKeyArn', 'KMSKeyArn', properties.KMSKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KMSKeyArn) : undefined);
    ret.addPropertyResult('s3Destination', 'S3Destination', properties.S3Destination != null ? CfnResourceDataSyncS3DestinationPropertyFromCloudFormation(properties.S3Destination) : undefined);
    ret.addPropertyResult('syncFormat', 'SyncFormat', properties.SyncFormat != null ? cfn_parse.FromCloudFormation.getString(properties.SyncFormat) : undefined);
    ret.addPropertyResult('syncSource', 'SyncSource', properties.SyncSource != null ? CfnResourceDataSyncSyncSourcePropertyFromCloudFormation(properties.SyncSource) : undefined);
    ret.addPropertyResult('syncType', 'SyncType', properties.SyncType != null ? cfn_parse.FromCloudFormation.getString(properties.SyncType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::ResourceDataSync`
 *
 * The `AWS::SSM::ResourceDataSync` resource creates, updates, or deletes a resource data sync for AWS Systems Manager . A resource data sync helps you view data from multiple sources in a single location. Systems Manager offers two types of resource data sync: `SyncToDestination` and `SyncFromSource` .
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
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html
 */
export class CfnResourceDataSync extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::ResourceDataSync";

    /**
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
        const ret = new CfnResourceDataSync(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the resource data sync.
     * @cloudformationAttribute SyncName
     */
    public readonly attrSyncName: string;

    /**
     * A name for the resource data sync.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncname
     */
    public syncName: string;

    /**
     * The name of the S3 bucket where the aggregated data is stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketname
     */
    public bucketName: string | undefined;

    /**
     * An Amazon S3 prefix for the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketprefix
     */
    public bucketPrefix: string | undefined;

    /**
     * The AWS Region with the S3 bucket targeted by the resource data sync.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-bucketregion
     */
    public bucketRegion: string | undefined;

    /**
     * The ARN of an encryption key for a destination in Amazon S3 . You can use a KMS key to encrypt inventory data in Amazon S3 . You must specify a key that exist in the same region as the destination Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-kmskeyarn
     */
    public kmsKeyArn: string | undefined;

    /**
     * Configuration information for the target S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-s3destination
     */
    public s3Destination: CfnResourceDataSync.S3DestinationProperty | cdk.IResolvable | undefined;

    /**
     * A supported sync format. The following format is currently supported: JsonSerDe
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncformat
     */
    public syncFormat: string | undefined;

    /**
     * Information about the source where the data was synchronized.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-syncsource
     */
    public syncSource: CfnResourceDataSync.SyncSourceProperty | cdk.IResolvable | undefined;

    /**
     * The type of resource data sync. If `SyncType` is `SyncToDestination` , then the resource data sync synchronizes data to an S3 bucket. If the `SyncType` is `SyncFromSource` then the resource data sync synchronizes data from AWS Organizations or from multiple AWS Regions .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcedatasync.html#cfn-ssm-resourcedatasync-synctype
     */
    public syncType: string | undefined;

    /**
     * Create a new `AWS::SSM::ResourceDataSync`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceDataSyncProps) {
        super(scope, id, { type: CfnResourceDataSync.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'syncName', this);
        this.attrSyncName = cdk.Token.asString(this.getAtt('SyncName', cdk.ResolutionTypeHint.STRING));

        this.syncName = props.syncName;
        this.bucketName = props.bucketName;
        this.bucketPrefix = props.bucketPrefix;
        this.bucketRegion = props.bucketRegion;
        this.kmsKeyArn = props.kmsKeyArn;
        this.s3Destination = props.s3Destination;
        this.syncFormat = props.syncFormat;
        this.syncSource = props.syncSource;
        this.syncType = props.syncType;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceDataSync.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            syncName: this.syncName,
            bucketName: this.bucketName,
            bucketPrefix: this.bucketPrefix,
            bucketRegion: this.bucketRegion,
            kmsKeyArn: this.kmsKeyArn,
            s3Destination: this.s3Destination,
            syncFormat: this.syncFormat,
            syncSource: this.syncSource,
            syncType: this.syncType,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourceDataSyncPropsToCloudFormation(props);
    }
}

export namespace CfnResourceDataSync {
    /**
     * Information about the `AwsOrganizationsSource` resource data sync source. A sync source of this type can synchronize data from AWS Organizations or, if an AWS organization isn't present, from multiple AWS Regions .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-awsorganizationssource.html
     */
    export interface AwsOrganizationsSourceProperty {
        /**
         * If an AWS organization is present, this is either `OrganizationalUnits` or `EntireOrganization` . For `OrganizationalUnits` , the data is aggregated from a set of organization units. For `EntireOrganization` , the data is aggregated from the entire AWS organization.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-awsorganizationssource.html#cfn-ssm-resourcedatasync-awsorganizationssource-organizationsourcetype
         */
        readonly organizationSourceType: string;
        /**
         * The AWS Organizations organization units included in the sync.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-awsorganizationssource.html#cfn-ssm-resourcedatasync-awsorganizationssource-organizationalunits
         */
        readonly organizationalUnits?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AwsOrganizationsSourceProperty`
 *
 * @param properties - the TypeScript properties of a `AwsOrganizationsSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceDataSync_AwsOrganizationsSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('organizationSourceType', cdk.requiredValidator)(properties.organizationSourceType));
    errors.collect(cdk.propertyValidator('organizationSourceType', cdk.validateString)(properties.organizationSourceType));
    errors.collect(cdk.propertyValidator('organizationalUnits', cdk.listValidator(cdk.validateString))(properties.organizationalUnits));
    return errors.wrap('supplied properties not correct for "AwsOrganizationsSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::ResourceDataSync.AwsOrganizationsSource` resource
 *
 * @param properties - the TypeScript properties of a `AwsOrganizationsSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::ResourceDataSync.AwsOrganizationsSource` resource.
 */
// @ts-ignore TS6133
function cfnResourceDataSyncAwsOrganizationsSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceDataSync_AwsOrganizationsSourcePropertyValidator(properties).assertSuccess();
    return {
        OrganizationSourceType: cdk.stringToCloudFormation(properties.organizationSourceType),
        OrganizationalUnits: cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationalUnits),
    };
}

// @ts-ignore TS6133
function CfnResourceDataSyncAwsOrganizationsSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDataSync.AwsOrganizationsSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDataSync.AwsOrganizationsSourceProperty>();
    ret.addPropertyResult('organizationSourceType', 'OrganizationSourceType', cfn_parse.FromCloudFormation.getString(properties.OrganizationSourceType));
    ret.addPropertyResult('organizationalUnits', 'OrganizationalUnits', properties.OrganizationalUnits != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OrganizationalUnits) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResourceDataSync {
    /**
     * Information about the target S3 bucket for the resource data sync.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html
     */
    export interface S3DestinationProperty {
        /**
         * The name of the S3 bucket where the aggregated data is stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-bucketname
         */
        readonly bucketName: string;
        /**
         * An Amazon S3 prefix for the bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-bucketprefix
         */
        readonly bucketPrefix?: string;
        /**
         * The AWS Region with the S3 bucket targeted by the resource data sync.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-bucketregion
         */
        readonly bucketRegion: string;
        /**
         * The ARN of an encryption key for a destination in Amazon S3. Must belong to the same Region as the destination S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-kmskeyarn
         */
        readonly kmsKeyArn?: string;
        /**
         * A supported sync format. The following format is currently supported: JsonSerDe
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-s3destination.html#cfn-ssm-resourcedatasync-s3destination-syncformat
         */
        readonly syncFormat: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceDataSync_S3DestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketPrefix', cdk.validateString)(properties.bucketPrefix));
    errors.collect(cdk.propertyValidator('bucketRegion', cdk.requiredValidator)(properties.bucketRegion));
    errors.collect(cdk.propertyValidator('bucketRegion', cdk.validateString)(properties.bucketRegion));
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('syncFormat', cdk.requiredValidator)(properties.syncFormat));
    errors.collect(cdk.propertyValidator('syncFormat', cdk.validateString)(properties.syncFormat));
    return errors.wrap('supplied properties not correct for "S3DestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::ResourceDataSync.S3Destination` resource
 *
 * @param properties - the TypeScript properties of a `S3DestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::ResourceDataSync.S3Destination` resource.
 */
// @ts-ignore TS6133
function cfnResourceDataSyncS3DestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceDataSync_S3DestinationPropertyValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        BucketPrefix: cdk.stringToCloudFormation(properties.bucketPrefix),
        BucketRegion: cdk.stringToCloudFormation(properties.bucketRegion),
        KMSKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        SyncFormat: cdk.stringToCloudFormation(properties.syncFormat),
    };
}

// @ts-ignore TS6133
function CfnResourceDataSyncS3DestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDataSync.S3DestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDataSync.S3DestinationProperty>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('bucketPrefix', 'BucketPrefix', properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined);
    ret.addPropertyResult('bucketRegion', 'BucketRegion', cfn_parse.FromCloudFormation.getString(properties.BucketRegion));
    ret.addPropertyResult('kmsKeyArn', 'KMSKeyArn', properties.KMSKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KMSKeyArn) : undefined);
    ret.addPropertyResult('syncFormat', 'SyncFormat', cfn_parse.FromCloudFormation.getString(properties.SyncFormat));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResourceDataSync {
    /**
     * Information about the source of the data included in the resource data sync.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html
     */
    export interface SyncSourceProperty {
        /**
         * Information about the AwsOrganizationsSource resource data sync source. A sync source of this type can synchronize data from AWS Organizations .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html#cfn-ssm-resourcedatasync-syncsource-awsorganizationssource
         */
        readonly awsOrganizationsSource?: CfnResourceDataSync.AwsOrganizationsSourceProperty | cdk.IResolvable;
        /**
         * Whether to automatically synchronize and aggregate data from new AWS Regions when those Regions come online.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html#cfn-ssm-resourcedatasync-syncsource-includefutureregions
         */
        readonly includeFutureRegions?: boolean | cdk.IResolvable;
        /**
         * The `SyncSource` AWS Regions included in the resource data sync.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html#cfn-ssm-resourcedatasync-syncsource-sourceregions
         */
        readonly sourceRegions: string[];
        /**
         * The type of data source for the resource data sync. `SourceType` is either `AwsOrganizations` (if an organization is present in AWS Organizations ) or `SingleAccountMultiRegions` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-resourcedatasync-syncsource.html#cfn-ssm-resourcedatasync-syncsource-sourcetype
         */
        readonly sourceType: string;
    }
}

/**
 * Determine whether the given properties match those of a `SyncSourceProperty`
 *
 * @param properties - the TypeScript properties of a `SyncSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceDataSync_SyncSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsOrganizationsSource', CfnResourceDataSync_AwsOrganizationsSourcePropertyValidator)(properties.awsOrganizationsSource));
    errors.collect(cdk.propertyValidator('includeFutureRegions', cdk.validateBoolean)(properties.includeFutureRegions));
    errors.collect(cdk.propertyValidator('sourceRegions', cdk.requiredValidator)(properties.sourceRegions));
    errors.collect(cdk.propertyValidator('sourceRegions', cdk.listValidator(cdk.validateString))(properties.sourceRegions));
    errors.collect(cdk.propertyValidator('sourceType', cdk.requiredValidator)(properties.sourceType));
    errors.collect(cdk.propertyValidator('sourceType', cdk.validateString)(properties.sourceType));
    return errors.wrap('supplied properties not correct for "SyncSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::ResourceDataSync.SyncSource` resource
 *
 * @param properties - the TypeScript properties of a `SyncSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::ResourceDataSync.SyncSource` resource.
 */
// @ts-ignore TS6133
function cfnResourceDataSyncSyncSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceDataSync_SyncSourcePropertyValidator(properties).assertSuccess();
    return {
        AwsOrganizationsSource: cfnResourceDataSyncAwsOrganizationsSourcePropertyToCloudFormation(properties.awsOrganizationsSource),
        IncludeFutureRegions: cdk.booleanToCloudFormation(properties.includeFutureRegions),
        SourceRegions: cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceRegions),
        SourceType: cdk.stringToCloudFormation(properties.sourceType),
    };
}

// @ts-ignore TS6133
function CfnResourceDataSyncSyncSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDataSync.SyncSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDataSync.SyncSourceProperty>();
    ret.addPropertyResult('awsOrganizationsSource', 'AwsOrganizationsSource', properties.AwsOrganizationsSource != null ? CfnResourceDataSyncAwsOrganizationsSourcePropertyFromCloudFormation(properties.AwsOrganizationsSource) : undefined);
    ret.addPropertyResult('includeFutureRegions', 'IncludeFutureRegions', properties.IncludeFutureRegions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeFutureRegions) : undefined);
    ret.addPropertyResult('sourceRegions', 'SourceRegions', cfn_parse.FromCloudFormation.getStringArray(properties.SourceRegions));
    ret.addPropertyResult('sourceType', 'SourceType', cfn_parse.FromCloudFormation.getString(properties.SourceType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {

    /**
     * A policy you want to associate with a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html#cfn-ssm-resourcepolicy-policy
     */
    readonly policy: any | cdk.IResolvable;

    /**
     * Amazon Resource Name (ARN) of the resource to which you want to attach a policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html#cfn-ssm-resourcepolicy-resourcearn
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
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policy', cdk.requiredValidator)(properties.policy));
    errors.collect(cdk.propertyValidator('policy', cdk.validateObject)(properties.policy));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "CfnResourcePolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSM::ResourcePolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSM::ResourcePolicy` resource.
 */
// @ts-ignore TS6133
function cfnResourcePolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourcePolicyPropsValidator(properties).assertSuccess();
    return {
        Policy: cdk.objectToCloudFormation(properties.policy),
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
    ret.addPropertyResult('policy', 'Policy', cfn_parse.FromCloudFormation.getAny(properties.Policy));
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSM::ResourcePolicy`
 *
 * Creates or updates a Systems Manager resource policy. A resource policy helps you to define the IAM entity (for example, an AWS account ) that can manage your Systems Manager resources. Currently, `OpsItemGroup` is the only resource that supports Systems Manager resource policies. The resource policy for `OpsItemGroup` enables AWS accounts to view and interact with OpsCenter operational work items (OpsItems). OpsCenter is a capability of Systems Manager .
 *
 * @cloudformationResource AWS::SSM::ResourcePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSM::ResourcePolicy";

    /**
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
        const ret = new CfnResourcePolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * ID of the current policy version. The hash helps to prevent a situation where multiple users attempt to overwrite a policy. You must provide this hash and the policy ID when updating or deleting a policy.
     * @cloudformationAttribute PolicyHash
     */
    public readonly attrPolicyHash: string;

    /**
     * ID of the current policy version.
     * @cloudformationAttribute PolicyId
     */
    public readonly attrPolicyId: string;

    /**
     * A policy you want to associate with a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html#cfn-ssm-resourcepolicy-policy
     */
    public policy: any | cdk.IResolvable;

    /**
     * Amazon Resource Name (ARN) of the resource to which you want to attach a policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-resourcepolicy.html#cfn-ssm-resourcepolicy-resourcearn
     */
    public resourceArn: string;

    /**
     * Create a new `AWS::SSM::ResourcePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
        super(scope, id, { type: CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policy', this);
        cdk.requireProperty(props, 'resourceArn', this);
        this.attrPolicyHash = cdk.Token.asString(this.getAtt('PolicyHash', cdk.ResolutionTypeHint.STRING));
        this.attrPolicyId = cdk.Token.asString(this.getAtt('PolicyId', cdk.ResolutionTypeHint.STRING));

        this.policy = props.policy;
        this.resourceArn = props.resourceArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            policy: this.policy,
            resourceArn: this.resourceArn,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourcePolicyPropsToCloudFormation(props);
    }
}
