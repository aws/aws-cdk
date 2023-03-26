// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:40:01.865Z","fingerprint":"71ZZLkl904K63ytUCUk0pklMlz8VMjEiVQQattTgBdE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnBackupPlan`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html
 */
export interface CfnBackupPlanProps {

    /**
     * Uniquely identifies the backup plan to be associated with the selection of resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html#cfn-backup-backupplan-backupplan
     */
    readonly backupPlan: CfnBackupPlan.BackupPlanResourceTypeProperty | cdk.IResolvable;

    /**
     * To help organize your resources, you can assign your own metadata to the resources that you create. Each tag is a key-value pair. The specified tags are assigned to all backups created with this plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html#cfn-backup-backupplan-backupplantags
     */
    readonly backupPlanTags?: { [key: string]: (string) } | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBackupPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnBackupPlanProps`
 *
 * @returns the result of the validation.
 */
function CfnBackupPlanPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backupPlan', cdk.requiredValidator)(properties.backupPlan));
    errors.collect(cdk.propertyValidator('backupPlan', CfnBackupPlan_BackupPlanResourceTypePropertyValidator)(properties.backupPlan));
    errors.collect(cdk.propertyValidator('backupPlanTags', cdk.hashValidator(cdk.validateString))(properties.backupPlanTags));
    return errors.wrap('supplied properties not correct for "CfnBackupPlanProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupPlan` resource
 *
 * @param properties - the TypeScript properties of a `CfnBackupPlanProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupPlan` resource.
 */
// @ts-ignore TS6133
function cfnBackupPlanPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupPlanPropsValidator(properties).assertSuccess();
    return {
        BackupPlan: cfnBackupPlanBackupPlanResourceTypePropertyToCloudFormation(properties.backupPlan),
        BackupPlanTags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.backupPlanTags),
    };
}

// @ts-ignore TS6133
function CfnBackupPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlanProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlanProps>();
    ret.addPropertyResult('backupPlan', 'BackupPlan', CfnBackupPlanBackupPlanResourceTypePropertyFromCloudFormation(properties.BackupPlan));
    ret.addPropertyResult('backupPlanTags', 'BackupPlanTags', properties.BackupPlanTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.BackupPlanTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Backup::BackupPlan`
 *
 * Contains an optional backup plan display name and an array of `BackupRule` objects, each of which specifies a backup rule. Each rule in a backup plan is a separate scheduled task and can back up a different selection of AWS resources.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-cfn) .
 *
 * @cloudformationResource AWS::Backup::BackupPlan
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html
 */
export class CfnBackupPlan extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Backup::BackupPlan";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBackupPlan {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBackupPlanPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBackupPlan(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup plan; for example, `arn:aws:backup:us-east-1:123456789012:plan:8F81F553-3A74-4A3F-B93D-B3360DC80C50` .
     * @cloudformationAttribute BackupPlanArn
     */
    public readonly attrBackupPlanArn: string;

    /**
     * Uniquely identifies a backup plan.
     * @cloudformationAttribute BackupPlanId
     */
    public readonly attrBackupPlanId: string;

    /**
     * Unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. Version Ids cannot be edited.
     * @cloudformationAttribute VersionId
     */
    public readonly attrVersionId: string;

    /**
     * Uniquely identifies the backup plan to be associated with the selection of resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html#cfn-backup-backupplan-backupplan
     */
    public backupPlan: CfnBackupPlan.BackupPlanResourceTypeProperty | cdk.IResolvable;

    /**
     * To help organize your resources, you can assign your own metadata to the resources that you create. Each tag is a key-value pair. The specified tags are assigned to all backups created with this plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html#cfn-backup-backupplan-backupplantags
     */
    public backupPlanTags: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Backup::BackupPlan`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBackupPlanProps) {
        super(scope, id, { type: CfnBackupPlan.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'backupPlan', this);
        this.attrBackupPlanArn = cdk.Token.asString(this.getAtt('BackupPlanArn', cdk.ResolutionTypeHint.STRING));
        this.attrBackupPlanId = cdk.Token.asString(this.getAtt('BackupPlanId', cdk.ResolutionTypeHint.STRING));
        this.attrVersionId = cdk.Token.asString(this.getAtt('VersionId', cdk.ResolutionTypeHint.STRING));

        this.backupPlan = props.backupPlan;
        this.backupPlanTags = props.backupPlanTags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBackupPlan.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            backupPlan: this.backupPlan,
            backupPlanTags: this.backupPlanTags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBackupPlanPropsToCloudFormation(props);
    }
}

export namespace CfnBackupPlan {
    /**
     * Specifies an object containing resource type and backup options. This is only supported for Windows VSS backups.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-advancedbackupsettingresourcetype.html
     */
    export interface AdvancedBackupSettingResourceTypeProperty {
        /**
         * The backup option for the resource. Each option is a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-advancedbackupsettingresourcetype.html#cfn-backup-backupplan-advancedbackupsettingresourcetype-backupoptions
         */
        readonly backupOptions: any | cdk.IResolvable;
        /**
         * The name of a resource type. The only supported resource type is EC2.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-advancedbackupsettingresourcetype.html#cfn-backup-backupplan-advancedbackupsettingresourcetype-resourcetype
         */
        readonly resourceType: string;
    }
}

/**
 * Determine whether the given properties match those of a `AdvancedBackupSettingResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedBackupSettingResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupPlan_AdvancedBackupSettingResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backupOptions', cdk.requiredValidator)(properties.backupOptions));
    errors.collect(cdk.propertyValidator('backupOptions', cdk.validateObject)(properties.backupOptions));
    errors.collect(cdk.propertyValidator('resourceType', cdk.requiredValidator)(properties.resourceType));
    errors.collect(cdk.propertyValidator('resourceType', cdk.validateString)(properties.resourceType));
    return errors.wrap('supplied properties not correct for "AdvancedBackupSettingResourceTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.AdvancedBackupSettingResourceType` resource
 *
 * @param properties - the TypeScript properties of a `AdvancedBackupSettingResourceTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.AdvancedBackupSettingResourceType` resource.
 */
// @ts-ignore TS6133
function cfnBackupPlanAdvancedBackupSettingResourceTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupPlan_AdvancedBackupSettingResourceTypePropertyValidator(properties).assertSuccess();
    return {
        BackupOptions: cdk.objectToCloudFormation(properties.backupOptions),
        ResourceType: cdk.stringToCloudFormation(properties.resourceType),
    };
}

// @ts-ignore TS6133
function CfnBackupPlanAdvancedBackupSettingResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.AdvancedBackupSettingResourceTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.AdvancedBackupSettingResourceTypeProperty>();
    ret.addPropertyResult('backupOptions', 'BackupOptions', cfn_parse.FromCloudFormation.getAny(properties.BackupOptions));
    ret.addPropertyResult('resourceType', 'ResourceType', cfn_parse.FromCloudFormation.getString(properties.ResourceType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBackupPlan {
    /**
     * Specifies an object containing properties used to create a backup plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupplanresourcetype.html
     */
    export interface BackupPlanResourceTypeProperty {
        /**
         * A list of backup options for each resource type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupplanresourcetype.html#cfn-backup-backupplan-backupplanresourcetype-advancedbackupsettings
         */
        readonly advancedBackupSettings?: Array<CfnBackupPlan.AdvancedBackupSettingResourceTypeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The display name of a backup plan.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupplanresourcetype.html#cfn-backup-backupplan-backupplanresourcetype-backupplanname
         */
        readonly backupPlanName: string;
        /**
         * An array of `BackupRule` objects, each of which specifies a scheduled task that is used to back up a selection of resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupplanresourcetype.html#cfn-backup-backupplan-backupplanresourcetype-backupplanrule
         */
        readonly backupPlanRule: Array<CfnBackupPlan.BackupRuleResourceTypeProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BackupPlanResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `BackupPlanResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupPlan_BackupPlanResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('advancedBackupSettings', cdk.listValidator(CfnBackupPlan_AdvancedBackupSettingResourceTypePropertyValidator))(properties.advancedBackupSettings));
    errors.collect(cdk.propertyValidator('backupPlanName', cdk.requiredValidator)(properties.backupPlanName));
    errors.collect(cdk.propertyValidator('backupPlanName', cdk.validateString)(properties.backupPlanName));
    errors.collect(cdk.propertyValidator('backupPlanRule', cdk.requiredValidator)(properties.backupPlanRule));
    errors.collect(cdk.propertyValidator('backupPlanRule', cdk.listValidator(CfnBackupPlan_BackupRuleResourceTypePropertyValidator))(properties.backupPlanRule));
    return errors.wrap('supplied properties not correct for "BackupPlanResourceTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.BackupPlanResourceType` resource
 *
 * @param properties - the TypeScript properties of a `BackupPlanResourceTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.BackupPlanResourceType` resource.
 */
// @ts-ignore TS6133
function cfnBackupPlanBackupPlanResourceTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupPlan_BackupPlanResourceTypePropertyValidator(properties).assertSuccess();
    return {
        AdvancedBackupSettings: cdk.listMapper(cfnBackupPlanAdvancedBackupSettingResourceTypePropertyToCloudFormation)(properties.advancedBackupSettings),
        BackupPlanName: cdk.stringToCloudFormation(properties.backupPlanName),
        BackupPlanRule: cdk.listMapper(cfnBackupPlanBackupRuleResourceTypePropertyToCloudFormation)(properties.backupPlanRule),
    };
}

// @ts-ignore TS6133
function CfnBackupPlanBackupPlanResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.BackupPlanResourceTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.BackupPlanResourceTypeProperty>();
    ret.addPropertyResult('advancedBackupSettings', 'AdvancedBackupSettings', properties.AdvancedBackupSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupPlanAdvancedBackupSettingResourceTypePropertyFromCloudFormation)(properties.AdvancedBackupSettings) : undefined);
    ret.addPropertyResult('backupPlanName', 'BackupPlanName', cfn_parse.FromCloudFormation.getString(properties.BackupPlanName));
    ret.addPropertyResult('backupPlanRule', 'BackupPlanRule', cfn_parse.FromCloudFormation.getArray(CfnBackupPlanBackupRuleResourceTypePropertyFromCloudFormation)(properties.BackupPlanRule));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBackupPlan {
    /**
     * Specifies an object containing properties used to schedule a task to back up a selection of resources.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html
     */
    export interface BackupRuleResourceTypeProperty {
        /**
         * A value in minutes after a backup job is successfully started before it must be completed or it is canceled by AWS Backup .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-completionwindowminutes
         */
        readonly completionWindowMinutes?: number;
        /**
         * An array of CopyAction objects, which contains the details of the copy operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-copyactions
         */
        readonly copyActions?: Array<CfnBackupPlan.CopyActionResourceTypeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Enables continuous backup and point-in-time restores (PITR).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-enablecontinuousbackup
         */
        readonly enableContinuousBackup?: boolean | cdk.IResolvable;
        /**
         * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. AWS Backup transitions and expires backups automatically according to the lifecycle that you define.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-lifecycle
         */
        readonly lifecycle?: CfnBackupPlan.LifecycleResourceTypeProperty | cdk.IResolvable;
        /**
         * To help organize your resources, you can assign your own metadata to the resources that you create. Each tag is a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-recoverypointtags
         */
        readonly recoveryPointTags?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * A display name for a backup rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-rulename
         */
        readonly ruleName: string;
        /**
         * A CRON expression specifying when AWS Backup initiates a backup job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-scheduleexpression
         */
        readonly scheduleExpression?: string;
        /**
         * An optional value that specifies a period of time in minutes after a backup is scheduled before a job is canceled if it doesn't start successfully.
         *
         * If this value is included, it must be at least 60 minutes to avoid errors.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-startwindowminutes
         */
        readonly startWindowMinutes?: number;
        /**
         * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the AWS Region where they are created. They consist of letters, numbers, and hyphens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-targetbackupvault
         */
        readonly targetBackupVault: string;
    }
}

/**
 * Determine whether the given properties match those of a `BackupRuleResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `BackupRuleResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupPlan_BackupRuleResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('completionWindowMinutes', cdk.validateNumber)(properties.completionWindowMinutes));
    errors.collect(cdk.propertyValidator('copyActions', cdk.listValidator(CfnBackupPlan_CopyActionResourceTypePropertyValidator))(properties.copyActions));
    errors.collect(cdk.propertyValidator('enableContinuousBackup', cdk.validateBoolean)(properties.enableContinuousBackup));
    errors.collect(cdk.propertyValidator('lifecycle', CfnBackupPlan_LifecycleResourceTypePropertyValidator)(properties.lifecycle));
    errors.collect(cdk.propertyValidator('recoveryPointTags', cdk.hashValidator(cdk.validateString))(properties.recoveryPointTags));
    errors.collect(cdk.propertyValidator('ruleName', cdk.requiredValidator)(properties.ruleName));
    errors.collect(cdk.propertyValidator('ruleName', cdk.validateString)(properties.ruleName));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('startWindowMinutes', cdk.validateNumber)(properties.startWindowMinutes));
    errors.collect(cdk.propertyValidator('targetBackupVault', cdk.requiredValidator)(properties.targetBackupVault));
    errors.collect(cdk.propertyValidator('targetBackupVault', cdk.validateString)(properties.targetBackupVault));
    return errors.wrap('supplied properties not correct for "BackupRuleResourceTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.BackupRuleResourceType` resource
 *
 * @param properties - the TypeScript properties of a `BackupRuleResourceTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.BackupRuleResourceType` resource.
 */
// @ts-ignore TS6133
function cfnBackupPlanBackupRuleResourceTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupPlan_BackupRuleResourceTypePropertyValidator(properties).assertSuccess();
    return {
        CompletionWindowMinutes: cdk.numberToCloudFormation(properties.completionWindowMinutes),
        CopyActions: cdk.listMapper(cfnBackupPlanCopyActionResourceTypePropertyToCloudFormation)(properties.copyActions),
        EnableContinuousBackup: cdk.booleanToCloudFormation(properties.enableContinuousBackup),
        Lifecycle: cfnBackupPlanLifecycleResourceTypePropertyToCloudFormation(properties.lifecycle),
        RecoveryPointTags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.recoveryPointTags),
        RuleName: cdk.stringToCloudFormation(properties.ruleName),
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
        StartWindowMinutes: cdk.numberToCloudFormation(properties.startWindowMinutes),
        TargetBackupVault: cdk.stringToCloudFormation(properties.targetBackupVault),
    };
}

// @ts-ignore TS6133
function CfnBackupPlanBackupRuleResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.BackupRuleResourceTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.BackupRuleResourceTypeProperty>();
    ret.addPropertyResult('completionWindowMinutes', 'CompletionWindowMinutes', properties.CompletionWindowMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.CompletionWindowMinutes) : undefined);
    ret.addPropertyResult('copyActions', 'CopyActions', properties.CopyActions != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupPlanCopyActionResourceTypePropertyFromCloudFormation)(properties.CopyActions) : undefined);
    ret.addPropertyResult('enableContinuousBackup', 'EnableContinuousBackup', properties.EnableContinuousBackup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableContinuousBackup) : undefined);
    ret.addPropertyResult('lifecycle', 'Lifecycle', properties.Lifecycle != null ? CfnBackupPlanLifecycleResourceTypePropertyFromCloudFormation(properties.Lifecycle) : undefined);
    ret.addPropertyResult('recoveryPointTags', 'RecoveryPointTags', properties.RecoveryPointTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.RecoveryPointTags) : undefined);
    ret.addPropertyResult('ruleName', 'RuleName', cfn_parse.FromCloudFormation.getString(properties.RuleName));
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined);
    ret.addPropertyResult('startWindowMinutes', 'StartWindowMinutes', properties.StartWindowMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartWindowMinutes) : undefined);
    ret.addPropertyResult('targetBackupVault', 'TargetBackupVault', cfn_parse.FromCloudFormation.getString(properties.TargetBackupVault));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBackupPlan {
    /**
     * Copies backups created by a backup rule to another vault.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-copyactionresourcetype.html
     */
    export interface CopyActionResourceTypeProperty {
        /**
         * An Amazon Resource Name (ARN) that uniquely identifies the destination backup vault for the copied backup. For example, `arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-copyactionresourcetype.html#cfn-backup-backupplan-copyactionresourcetype-destinationbackupvaultarn
         */
        readonly destinationBackupVaultArn: string;
        /**
         * Defines when a protected resource is transitioned to cold storage and when it expires. AWS Backup transitions and expires backups automatically according to the lifecycle that you define. If you do not specify a lifecycle, AWS Backup applies the lifecycle policy of the source backup to the destination backup.
         *
         * Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-copyactionresourcetype.html#cfn-backup-backupplan-copyactionresourcetype-lifecycle
         */
        readonly lifecycle?: CfnBackupPlan.LifecycleResourceTypeProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CopyActionResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `CopyActionResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupPlan_CopyActionResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationBackupVaultArn', cdk.requiredValidator)(properties.destinationBackupVaultArn));
    errors.collect(cdk.propertyValidator('destinationBackupVaultArn', cdk.validateString)(properties.destinationBackupVaultArn));
    errors.collect(cdk.propertyValidator('lifecycle', CfnBackupPlan_LifecycleResourceTypePropertyValidator)(properties.lifecycle));
    return errors.wrap('supplied properties not correct for "CopyActionResourceTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.CopyActionResourceType` resource
 *
 * @param properties - the TypeScript properties of a `CopyActionResourceTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.CopyActionResourceType` resource.
 */
// @ts-ignore TS6133
function cfnBackupPlanCopyActionResourceTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupPlan_CopyActionResourceTypePropertyValidator(properties).assertSuccess();
    return {
        DestinationBackupVaultArn: cdk.stringToCloudFormation(properties.destinationBackupVaultArn),
        Lifecycle: cfnBackupPlanLifecycleResourceTypePropertyToCloudFormation(properties.lifecycle),
    };
}

// @ts-ignore TS6133
function CfnBackupPlanCopyActionResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.CopyActionResourceTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.CopyActionResourceTypeProperty>();
    ret.addPropertyResult('destinationBackupVaultArn', 'DestinationBackupVaultArn', cfn_parse.FromCloudFormation.getString(properties.DestinationBackupVaultArn));
    ret.addPropertyResult('lifecycle', 'Lifecycle', properties.Lifecycle != null ? CfnBackupPlanLifecycleResourceTypePropertyFromCloudFormation(properties.Lifecycle) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBackupPlan {
    /**
     * Specifies an object containing an array of `Transition` objects that determine how long in days before a recovery point transitions to cold storage or is deleted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-lifecycleresourcetype.html
     */
    export interface LifecycleResourceTypeProperty {
        /**
         * Specifies the number of days after creation that a recovery point is deleted. Must be greater than `MoveToColdStorageAfterDays` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-lifecycleresourcetype.html#cfn-backup-backupplan-lifecycleresourcetype-deleteafterdays
         */
        readonly deleteAfterDays?: number;
        /**
         * Specifies the number of days after creation that a recovery point is moved to cold storage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-lifecycleresourcetype.html#cfn-backup-backupplan-lifecycleresourcetype-movetocoldstorageafterdays
         */
        readonly moveToColdStorageAfterDays?: number;
    }
}

/**
 * Determine whether the given properties match those of a `LifecycleResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `LifecycleResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupPlan_LifecycleResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteAfterDays', cdk.validateNumber)(properties.deleteAfterDays));
    errors.collect(cdk.propertyValidator('moveToColdStorageAfterDays', cdk.validateNumber)(properties.moveToColdStorageAfterDays));
    return errors.wrap('supplied properties not correct for "LifecycleResourceTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.LifecycleResourceType` resource
 *
 * @param properties - the TypeScript properties of a `LifecycleResourceTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupPlan.LifecycleResourceType` resource.
 */
// @ts-ignore TS6133
function cfnBackupPlanLifecycleResourceTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupPlan_LifecycleResourceTypePropertyValidator(properties).assertSuccess();
    return {
        DeleteAfterDays: cdk.numberToCloudFormation(properties.deleteAfterDays),
        MoveToColdStorageAfterDays: cdk.numberToCloudFormation(properties.moveToColdStorageAfterDays),
    };
}

// @ts-ignore TS6133
function CfnBackupPlanLifecycleResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.LifecycleResourceTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.LifecycleResourceTypeProperty>();
    ret.addPropertyResult('deleteAfterDays', 'DeleteAfterDays', properties.DeleteAfterDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.DeleteAfterDays) : undefined);
    ret.addPropertyResult('moveToColdStorageAfterDays', 'MoveToColdStorageAfterDays', properties.MoveToColdStorageAfterDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.MoveToColdStorageAfterDays) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnBackupSelection`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html
 */
export interface CfnBackupSelectionProps {

    /**
     * Uniquely identifies a backup plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html#cfn-backup-backupselection-backupplanid
     */
    readonly backupPlanId: string;

    /**
     * Specifies the body of a request to assign a set of resources to a backup plan.
     *
     * It includes an array of resources, an optional array of patterns to exclude resources, an optional role to provide access to the AWS service the resource belongs to, and an optional array of tags used to identify a set of resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html#cfn-backup-backupselection-backupselection
     */
    readonly backupSelection: CfnBackupSelection.BackupSelectionResourceTypeProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBackupSelectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnBackupSelectionProps`
 *
 * @returns the result of the validation.
 */
function CfnBackupSelectionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backupPlanId', cdk.requiredValidator)(properties.backupPlanId));
    errors.collect(cdk.propertyValidator('backupPlanId', cdk.validateString)(properties.backupPlanId));
    errors.collect(cdk.propertyValidator('backupSelection', cdk.requiredValidator)(properties.backupSelection));
    errors.collect(cdk.propertyValidator('backupSelection', CfnBackupSelection_BackupSelectionResourceTypePropertyValidator)(properties.backupSelection));
    return errors.wrap('supplied properties not correct for "CfnBackupSelectionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupSelection` resource
 *
 * @param properties - the TypeScript properties of a `CfnBackupSelectionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupSelection` resource.
 */
// @ts-ignore TS6133
function cfnBackupSelectionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupSelectionPropsValidator(properties).assertSuccess();
    return {
        BackupPlanId: cdk.stringToCloudFormation(properties.backupPlanId),
        BackupSelection: cfnBackupSelectionBackupSelectionResourceTypePropertyToCloudFormation(properties.backupSelection),
    };
}

// @ts-ignore TS6133
function CfnBackupSelectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelectionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelectionProps>();
    ret.addPropertyResult('backupPlanId', 'BackupPlanId', cfn_parse.FromCloudFormation.getString(properties.BackupPlanId));
    ret.addPropertyResult('backupSelection', 'BackupSelection', CfnBackupSelectionBackupSelectionResourceTypePropertyFromCloudFormation(properties.BackupSelection));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Backup::BackupSelection`
 *
 * Specifies a set of resources to assign to a backup plan.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-cfn) .
 *
 * @cloudformationResource AWS::Backup::BackupSelection
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html
 */
export class CfnBackupSelection extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Backup::BackupSelection";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBackupSelection {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBackupSelectionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBackupSelection(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Uniquely identifies a backup plan.
     * @cloudformationAttribute BackupPlanId
     */
    public readonly attrBackupPlanId: string;

    /**
     * Uniquely identifies the backup selection.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * Uniquely identifies a request to assign a set of resources to a backup plan.
     * @cloudformationAttribute SelectionId
     */
    public readonly attrSelectionId: string;

    /**
     * Uniquely identifies a backup plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html#cfn-backup-backupselection-backupplanid
     */
    public backupPlanId: string;

    /**
     * Specifies the body of a request to assign a set of resources to a backup plan.
     *
     * It includes an array of resources, an optional array of patterns to exclude resources, an optional role to provide access to the AWS service the resource belongs to, and an optional array of tags used to identify a set of resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html#cfn-backup-backupselection-backupselection
     */
    public backupSelection: CfnBackupSelection.BackupSelectionResourceTypeProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::Backup::BackupSelection`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBackupSelectionProps) {
        super(scope, id, { type: CfnBackupSelection.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'backupPlanId', this);
        cdk.requireProperty(props, 'backupSelection', this);
        this.attrBackupPlanId = cdk.Token.asString(this.getAtt('BackupPlanId', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrSelectionId = cdk.Token.asString(this.getAtt('SelectionId', cdk.ResolutionTypeHint.STRING));

        this.backupPlanId = props.backupPlanId;
        this.backupSelection = props.backupSelection;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBackupSelection.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            backupPlanId: this.backupPlanId,
            backupSelection: this.backupSelection,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBackupSelectionPropsToCloudFormation(props);
    }
}

export namespace CfnBackupSelection {
    /**
     * Specifies an object containing properties used to assign a set of resources to a backup plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html
     */
    export interface BackupSelectionResourceTypeProperty {
        /**
         * A list of conditions that you define to assign resources to your backup plans using tags. For example, `"StringEquals": { "ConditionKey": "aws:ResourceTag/CreatedByCryo", "ConditionValue": "true" },` . Condition operators are case sensitive.
         *
         * `Conditions` differs from `ListOfTags` as follows:
         *
         * - When you specify more than one condition, you only assign the resources that match ALL conditions (using AND logic).
         * - `Conditions` supports `StringEquals` , `StringLike` , `StringNotEquals` , and `StringNotLike` . `ListOfTags` only supports `StringEquals` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-conditions
         */
        readonly conditions?: any | cdk.IResolvable;
        /**
         * The ARN of the IAM role that AWS Backup uses to authenticate when backing up the target resource; for example, `arn:aws:iam::123456789012:role/S3Access` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-iamrolearn
         */
        readonly iamRoleArn: string;
        /**
         * A list of conditions that you define to assign resources to your backup plans using tags. For example, `"StringEquals": { "ConditionKey": "aws:ResourceTag/CreatedByCryo", "ConditionValue": "true" },` . Condition operators are case sensitive.
         *
         * `ListOfTags` differs from `Conditions` as follows:
         *
         * - When you specify more than one condition, you assign all resources that match AT LEAST ONE condition (using OR logic).
         * - `ListOfTags` only supports `StringEquals` . `Conditions` supports `StringEquals` , `StringLike` , `StringNotEquals` , and `StringNotLike` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-listoftags
         */
        readonly listOfTags?: Array<CfnBackupSelection.ConditionResourceTypeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of Amazon Resource Names (ARNs) to exclude from a backup plan. The maximum number of ARNs is 500 without wildcards, or 30 ARNs with wildcards.
         *
         * If you need to exclude many resources from a backup plan, consider a different resource selection strategy, such as assigning only one or a few resource types or refining your resource selection using tags.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-notresources
         */
        readonly notResources?: string[];
        /**
         * An array of strings that contain Amazon Resource Names (ARNs) of resources to assign to a backup plan.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-resources
         */
        readonly resources?: string[];
        /**
         * The display name of a resource selection document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-selectionname
         */
        readonly selectionName: string;
    }
}

/**
 * Determine whether the given properties match those of a `BackupSelectionResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `BackupSelectionResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupSelection_BackupSelectionResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conditions', cdk.validateObject)(properties.conditions));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.requiredValidator)(properties.iamRoleArn));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.validateString)(properties.iamRoleArn));
    errors.collect(cdk.propertyValidator('listOfTags', cdk.listValidator(CfnBackupSelection_ConditionResourceTypePropertyValidator))(properties.listOfTags));
    errors.collect(cdk.propertyValidator('notResources', cdk.listValidator(cdk.validateString))(properties.notResources));
    errors.collect(cdk.propertyValidator('resources', cdk.listValidator(cdk.validateString))(properties.resources));
    errors.collect(cdk.propertyValidator('selectionName', cdk.requiredValidator)(properties.selectionName));
    errors.collect(cdk.propertyValidator('selectionName', cdk.validateString)(properties.selectionName));
    return errors.wrap('supplied properties not correct for "BackupSelectionResourceTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupSelection.BackupSelectionResourceType` resource
 *
 * @param properties - the TypeScript properties of a `BackupSelectionResourceTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupSelection.BackupSelectionResourceType` resource.
 */
// @ts-ignore TS6133
function cfnBackupSelectionBackupSelectionResourceTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupSelection_BackupSelectionResourceTypePropertyValidator(properties).assertSuccess();
    return {
        Conditions: cdk.objectToCloudFormation(properties.conditions),
        IamRoleArn: cdk.stringToCloudFormation(properties.iamRoleArn),
        ListOfTags: cdk.listMapper(cfnBackupSelectionConditionResourceTypePropertyToCloudFormation)(properties.listOfTags),
        NotResources: cdk.listMapper(cdk.stringToCloudFormation)(properties.notResources),
        Resources: cdk.listMapper(cdk.stringToCloudFormation)(properties.resources),
        SelectionName: cdk.stringToCloudFormation(properties.selectionName),
    };
}

// @ts-ignore TS6133
function CfnBackupSelectionBackupSelectionResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelection.BackupSelectionResourceTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelection.BackupSelectionResourceTypeProperty>();
    ret.addPropertyResult('conditions', 'Conditions', properties.Conditions != null ? cfn_parse.FromCloudFormation.getAny(properties.Conditions) : undefined);
    ret.addPropertyResult('iamRoleArn', 'IamRoleArn', cfn_parse.FromCloudFormation.getString(properties.IamRoleArn));
    ret.addPropertyResult('listOfTags', 'ListOfTags', properties.ListOfTags != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionResourceTypePropertyFromCloudFormation)(properties.ListOfTags) : undefined);
    ret.addPropertyResult('notResources', 'NotResources', properties.NotResources != null ? cfn_parse.FromCloudFormation.getStringArray(properties.NotResources) : undefined);
    ret.addPropertyResult('resources', 'Resources', properties.Resources != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Resources) : undefined);
    ret.addPropertyResult('selectionName', 'SelectionName', cfn_parse.FromCloudFormation.getString(properties.SelectionName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBackupSelection {
    /**
     * Includes information about tags you define to assign tagged resources to a backup plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionparameter.html
     */
    export interface ConditionParameterProperty {
        /**
         * The key in a key-value pair. For example, in the tag `Department: Accounting` , `Department` is the key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionparameter.html#cfn-backup-backupselection-conditionparameter-conditionkey
         */
        readonly conditionKey?: string;
        /**
         * The value in a key-value pair. For example, in the tag `Department: Accounting` , `Accounting` is the value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionparameter.html#cfn-backup-backupselection-conditionparameter-conditionvalue
         */
        readonly conditionValue?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConditionParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupSelection_ConditionParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conditionKey', cdk.validateString)(properties.conditionKey));
    errors.collect(cdk.propertyValidator('conditionValue', cdk.validateString)(properties.conditionValue));
    return errors.wrap('supplied properties not correct for "ConditionParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupSelection.ConditionParameter` resource
 *
 * @param properties - the TypeScript properties of a `ConditionParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupSelection.ConditionParameter` resource.
 */
// @ts-ignore TS6133
function cfnBackupSelectionConditionParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupSelection_ConditionParameterPropertyValidator(properties).assertSuccess();
    return {
        ConditionKey: cdk.stringToCloudFormation(properties.conditionKey),
        ConditionValue: cdk.stringToCloudFormation(properties.conditionValue),
    };
}

// @ts-ignore TS6133
function CfnBackupSelectionConditionParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelection.ConditionParameterProperty>();
    ret.addPropertyResult('conditionKey', 'ConditionKey', properties.ConditionKey != null ? cfn_parse.FromCloudFormation.getString(properties.ConditionKey) : undefined);
    ret.addPropertyResult('conditionValue', 'ConditionValue', properties.ConditionValue != null ? cfn_parse.FromCloudFormation.getString(properties.ConditionValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBackupSelection {
    /**
     * Specifies an object that contains an array of triplets made up of a condition type (such as `STRINGEQUALS` ), a key, and a value. Conditions are used to filter resources in a selection that is assigned to a backup plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionresourcetype.html
     */
    export interface ConditionResourceTypeProperty {
        /**
         * The key in a key-value pair. For example, in `"Department": "accounting"` , `"Department"` is the key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionresourcetype.html#cfn-backup-backupselection-conditionresourcetype-conditionkey
         */
        readonly conditionKey: string;
        /**
         * An operation, such as `STRINGEQUALS` , that is applied to a key-value pair used to filter resources in a selection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionresourcetype.html#cfn-backup-backupselection-conditionresourcetype-conditiontype
         */
        readonly conditionType: string;
        /**
         * The value in a key-value pair. For example, in `"Department": "accounting"` , `"accounting"` is the value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionresourcetype.html#cfn-backup-backupselection-conditionresourcetype-conditionvalue
         */
        readonly conditionValue: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConditionResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupSelection_ConditionResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conditionKey', cdk.requiredValidator)(properties.conditionKey));
    errors.collect(cdk.propertyValidator('conditionKey', cdk.validateString)(properties.conditionKey));
    errors.collect(cdk.propertyValidator('conditionType', cdk.requiredValidator)(properties.conditionType));
    errors.collect(cdk.propertyValidator('conditionType', cdk.validateString)(properties.conditionType));
    errors.collect(cdk.propertyValidator('conditionValue', cdk.requiredValidator)(properties.conditionValue));
    errors.collect(cdk.propertyValidator('conditionValue', cdk.validateString)(properties.conditionValue));
    return errors.wrap('supplied properties not correct for "ConditionResourceTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupSelection.ConditionResourceType` resource
 *
 * @param properties - the TypeScript properties of a `ConditionResourceTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupSelection.ConditionResourceType` resource.
 */
// @ts-ignore TS6133
function cfnBackupSelectionConditionResourceTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupSelection_ConditionResourceTypePropertyValidator(properties).assertSuccess();
    return {
        ConditionKey: cdk.stringToCloudFormation(properties.conditionKey),
        ConditionType: cdk.stringToCloudFormation(properties.conditionType),
        ConditionValue: cdk.stringToCloudFormation(properties.conditionValue),
    };
}

// @ts-ignore TS6133
function CfnBackupSelectionConditionResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelection.ConditionResourceTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelection.ConditionResourceTypeProperty>();
    ret.addPropertyResult('conditionKey', 'ConditionKey', cfn_parse.FromCloudFormation.getString(properties.ConditionKey));
    ret.addPropertyResult('conditionType', 'ConditionType', cfn_parse.FromCloudFormation.getString(properties.ConditionType));
    ret.addPropertyResult('conditionValue', 'ConditionValue', cfn_parse.FromCloudFormation.getString(properties.ConditionValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBackupSelection {
    /**
     * Contains information about which resources to include or exclude from a backup plan using their tags. Conditions are case sensitive.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html
     */
    export interface ConditionsProperty {
        /**
         * Filters the values of your tagged resources for only those resources that you tagged with the same value. Also called "exact matching."
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html#cfn-backup-backupselection-conditions-stringequals
         */
        readonly stringEquals?: Array<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Filters the values of your tagged resources for matching tag values with the use of a wildcard character (*) anywhere in the string. For example, "prod*" or "*rod*" matches the tag value "production".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html#cfn-backup-backupselection-conditions-stringlike
         */
        readonly stringLike?: Array<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Filters the values of your tagged resources for only those resources that you tagged that do not have the same value. Also called "negated matching."
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html#cfn-backup-backupselection-conditions-stringnotequals
         */
        readonly stringNotEquals?: Array<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Filters the values of your tagged resources for non-matching tag values with the use of a wildcard character (*) anywhere in the string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html#cfn-backup-backupselection-conditions-stringnotlike
         */
        readonly stringNotLike?: Array<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConditionsProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupSelection_ConditionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('stringEquals', cdk.listValidator(CfnBackupSelection_ConditionParameterPropertyValidator))(properties.stringEquals));
    errors.collect(cdk.propertyValidator('stringLike', cdk.listValidator(CfnBackupSelection_ConditionParameterPropertyValidator))(properties.stringLike));
    errors.collect(cdk.propertyValidator('stringNotEquals', cdk.listValidator(CfnBackupSelection_ConditionParameterPropertyValidator))(properties.stringNotEquals));
    errors.collect(cdk.propertyValidator('stringNotLike', cdk.listValidator(CfnBackupSelection_ConditionParameterPropertyValidator))(properties.stringNotLike));
    return errors.wrap('supplied properties not correct for "ConditionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupSelection.Conditions` resource
 *
 * @param properties - the TypeScript properties of a `ConditionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupSelection.Conditions` resource.
 */
// @ts-ignore TS6133
function cfnBackupSelectionConditionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupSelection_ConditionsPropertyValidator(properties).assertSuccess();
    return {
        StringEquals: cdk.listMapper(cfnBackupSelectionConditionParameterPropertyToCloudFormation)(properties.stringEquals),
        StringLike: cdk.listMapper(cfnBackupSelectionConditionParameterPropertyToCloudFormation)(properties.stringLike),
        StringNotEquals: cdk.listMapper(cfnBackupSelectionConditionParameterPropertyToCloudFormation)(properties.stringNotEquals),
        StringNotLike: cdk.listMapper(cfnBackupSelectionConditionParameterPropertyToCloudFormation)(properties.stringNotLike),
    };
}

// @ts-ignore TS6133
function CfnBackupSelectionConditionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelection.ConditionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelection.ConditionsProperty>();
    ret.addPropertyResult('stringEquals', 'StringEquals', properties.StringEquals != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionParameterPropertyFromCloudFormation)(properties.StringEquals) : undefined);
    ret.addPropertyResult('stringLike', 'StringLike', properties.StringLike != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionParameterPropertyFromCloudFormation)(properties.StringLike) : undefined);
    ret.addPropertyResult('stringNotEquals', 'StringNotEquals', properties.StringNotEquals != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionParameterPropertyFromCloudFormation)(properties.StringNotEquals) : undefined);
    ret.addPropertyResult('stringNotLike', 'StringNotLike', properties.StringNotLike != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionParameterPropertyFromCloudFormation)(properties.StringNotLike) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnBackupVault`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html
 */
export interface CfnBackupVaultProps {

    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the AWS Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-backupvaultname
     */
    readonly backupVaultName: string;

    /**
     * A resource-based policy that is used to manage access permissions on the target backup vault.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-accesspolicy
     */
    readonly accessPolicy?: any | cdk.IResolvable;

    /**
     * Metadata that you can assign to help organize the resources that you create. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-backupvaulttags
     */
    readonly backupVaultTags?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * A server-side encryption key you can specify to encrypt your backups from services that support full AWS Backup management; for example, `arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab` . If you specify a key, you must specify its ARN, not its alias. If you do not specify a key, AWS Backup creates a KMS key for you by default.
     *
     * To learn which AWS Backup services support full AWS Backup management and how AWS Backup handles encryption for backups from services that do not yet support full AWS Backup , see [Encryption for backups in AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/encryption.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-encryptionkeyarn
     */
    readonly encryptionKeyArn?: string;

    /**
     * Configuration for [AWS Backup Vault Lock](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-lockconfiguration
     */
    readonly lockConfiguration?: CfnBackupVault.LockConfigurationTypeProperty | cdk.IResolvable;

    /**
     * The SNS event notifications for the specified backup vault.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-notifications
     */
    readonly notifications?: CfnBackupVault.NotificationObjectTypeProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBackupVaultProps`
 *
 * @param properties - the TypeScript properties of a `CfnBackupVaultProps`
 *
 * @returns the result of the validation.
 */
function CfnBackupVaultPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessPolicy', cdk.validateObject)(properties.accessPolicy));
    errors.collect(cdk.propertyValidator('backupVaultName', cdk.requiredValidator)(properties.backupVaultName));
    errors.collect(cdk.propertyValidator('backupVaultName', cdk.validateString)(properties.backupVaultName));
    errors.collect(cdk.propertyValidator('backupVaultTags', cdk.hashValidator(cdk.validateString))(properties.backupVaultTags));
    errors.collect(cdk.propertyValidator('encryptionKeyArn', cdk.validateString)(properties.encryptionKeyArn));
    errors.collect(cdk.propertyValidator('lockConfiguration', CfnBackupVault_LockConfigurationTypePropertyValidator)(properties.lockConfiguration));
    errors.collect(cdk.propertyValidator('notifications', CfnBackupVault_NotificationObjectTypePropertyValidator)(properties.notifications));
    return errors.wrap('supplied properties not correct for "CfnBackupVaultProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupVault` resource
 *
 * @param properties - the TypeScript properties of a `CfnBackupVaultProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupVault` resource.
 */
// @ts-ignore TS6133
function cfnBackupVaultPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupVaultPropsValidator(properties).assertSuccess();
    return {
        BackupVaultName: cdk.stringToCloudFormation(properties.backupVaultName),
        AccessPolicy: cdk.objectToCloudFormation(properties.accessPolicy),
        BackupVaultTags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.backupVaultTags),
        EncryptionKeyArn: cdk.stringToCloudFormation(properties.encryptionKeyArn),
        LockConfiguration: cfnBackupVaultLockConfigurationTypePropertyToCloudFormation(properties.lockConfiguration),
        Notifications: cfnBackupVaultNotificationObjectTypePropertyToCloudFormation(properties.notifications),
    };
}

// @ts-ignore TS6133
function CfnBackupVaultPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupVaultProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupVaultProps>();
    ret.addPropertyResult('backupVaultName', 'BackupVaultName', cfn_parse.FromCloudFormation.getString(properties.BackupVaultName));
    ret.addPropertyResult('accessPolicy', 'AccessPolicy', properties.AccessPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.AccessPolicy) : undefined);
    ret.addPropertyResult('backupVaultTags', 'BackupVaultTags', properties.BackupVaultTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.BackupVaultTags) : undefined);
    ret.addPropertyResult('encryptionKeyArn', 'EncryptionKeyArn', properties.EncryptionKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKeyArn) : undefined);
    ret.addPropertyResult('lockConfiguration', 'LockConfiguration', properties.LockConfiguration != null ? CfnBackupVaultLockConfigurationTypePropertyFromCloudFormation(properties.LockConfiguration) : undefined);
    ret.addPropertyResult('notifications', 'Notifications', properties.Notifications != null ? CfnBackupVaultNotificationObjectTypePropertyFromCloudFormation(properties.Notifications) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Backup::BackupVault`
 *
 * Creates a logical container where backups are stored. A `CreateBackupVault` request includes a name, optionally one or more resource tags, an encryption key, and a request ID.
 *
 * Do not include sensitive data, such as passport numbers, in the name of a backup vault.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-cfn) .
 *
 * @cloudformationResource AWS::Backup::BackupVault
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html
 */
export class CfnBackupVault extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Backup::BackupVault";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBackupVault {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBackupVaultPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBackupVault(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, `arn:aws:backup:us-east-1:123456789012:backup-vault:aBackupVault` .
     * @cloudformationAttribute BackupVaultArn
     */
    public readonly attrBackupVaultArn: string;

    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase and uppercase letters, numbers, and hyphens.
     * @cloudformationAttribute BackupVaultName
     */
    public readonly attrBackupVaultName: string;

    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the AWS Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-backupvaultname
     */
    public backupVaultName: string;

    /**
     * A resource-based policy that is used to manage access permissions on the target backup vault.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-accesspolicy
     */
    public accessPolicy: any | cdk.IResolvable | undefined;

    /**
     * Metadata that you can assign to help organize the resources that you create. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-backupvaulttags
     */
    public backupVaultTags: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * A server-side encryption key you can specify to encrypt your backups from services that support full AWS Backup management; for example, `arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab` . If you specify a key, you must specify its ARN, not its alias. If you do not specify a key, AWS Backup creates a KMS key for you by default.
     *
     * To learn which AWS Backup services support full AWS Backup management and how AWS Backup handles encryption for backups from services that do not yet support full AWS Backup , see [Encryption for backups in AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/encryption.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-encryptionkeyarn
     */
    public encryptionKeyArn: string | undefined;

    /**
     * Configuration for [AWS Backup Vault Lock](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-lockconfiguration
     */
    public lockConfiguration: CfnBackupVault.LockConfigurationTypeProperty | cdk.IResolvable | undefined;

    /**
     * The SNS event notifications for the specified backup vault.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-notifications
     */
    public notifications: CfnBackupVault.NotificationObjectTypeProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Backup::BackupVault`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBackupVaultProps) {
        super(scope, id, { type: CfnBackupVault.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'backupVaultName', this);
        this.attrBackupVaultArn = cdk.Token.asString(this.getAtt('BackupVaultArn', cdk.ResolutionTypeHint.STRING));
        this.attrBackupVaultName = cdk.Token.asString(this.getAtt('BackupVaultName', cdk.ResolutionTypeHint.STRING));

        this.backupVaultName = props.backupVaultName;
        this.accessPolicy = props.accessPolicy;
        this.backupVaultTags = props.backupVaultTags;
        this.encryptionKeyArn = props.encryptionKeyArn;
        this.lockConfiguration = props.lockConfiguration;
        this.notifications = props.notifications;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::Backup::BackupVault\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
              : [] });
        }
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBackupVault.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            backupVaultName: this.backupVaultName,
            accessPolicy: this.accessPolicy,
            backupVaultTags: this.backupVaultTags,
            encryptionKeyArn: this.encryptionKeyArn,
            lockConfiguration: this.lockConfiguration,
            notifications: this.notifications,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBackupVaultPropsToCloudFormation(props);
    }
}

export namespace CfnBackupVault {
    /**
     * The `LockConfigurationType` property type specifies configuration for [AWS Backup Vault Lock](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-lockconfigurationtype.html
     */
    export interface LockConfigurationTypeProperty {
        /**
         * The AWS Backup Vault Lock configuration that specifies the number of days before the lock date. For example, setting `ChangeableForDays` to 30 on Jan. 1, 2022 at 8pm UTC will set the lock date to Jan. 31, 2022 at 8pm UTC.
         *
         * AWS Backup enforces a 72-hour cooling-off period before Vault Lock takes effect and becomes immutable. Therefore, you must set `ChangeableForDays` to 3 or greater.
         *
         * Before the lock date, you can delete Vault Lock from the vault using `DeleteBackupVaultLockConfiguration` or change the Vault Lock configuration using `PutBackupVaultLockConfiguration` . On and after the lock date, the Vault Lock becomes immutable and cannot be changed or deleted.
         *
         * If this parameter is not specified, you can delete Vault Lock from the vault using `DeleteBackupVaultLockConfiguration` or change the Vault Lock configuration using `PutBackupVaultLockConfiguration` at any time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-lockconfigurationtype.html#cfn-backup-backupvault-lockconfigurationtype-changeablefordays
         */
        readonly changeableForDays?: number;
        /**
         * The AWS Backup Vault Lock configuration that specifies the maximum retention period that the vault retains its recovery points. This setting can be useful if, for example, your organization's policies require you to destroy certain data after retaining it for four years (1460 days).
         *
         * If this parameter is not included, Vault Lock does not enforce a maximum retention period on the recovery points in the vault. If this parameter is included without a value, Vault Lock will not enforce a maximum retention period.
         *
         * If this parameter is specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or shorter than the maximum retention period. If the job's retention period is longer than that maximum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault. Recovery points already saved in the vault prior to Vault Lock are not affected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-lockconfigurationtype.html#cfn-backup-backupvault-lockconfigurationtype-maxretentiondays
         */
        readonly maxRetentionDays?: number;
        /**
         * The AWS Backup Vault Lock configuration that specifies the minimum retention period that the vault retains its recovery points. This setting can be useful if, for example, your organization's policies require you to retain certain data for at least seven years (2555 days).
         *
         * If this parameter is not specified, Vault Lock will not enforce a minimum retention period.
         *
         * If this parameter is specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or longer than the minimum retention period. If the job's retention period is shorter than that minimum retention period, then the vault fails that backup or copy job, and you should either modify your lifecycle settings or use a different vault. Recovery points already saved in the vault prior to Vault Lock are not affected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-lockconfigurationtype.html#cfn-backup-backupvault-lockconfigurationtype-minretentiondays
         */
        readonly minRetentionDays: number;
    }
}

/**
 * Determine whether the given properties match those of a `LockConfigurationTypeProperty`
 *
 * @param properties - the TypeScript properties of a `LockConfigurationTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupVault_LockConfigurationTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('changeableForDays', cdk.validateNumber)(properties.changeableForDays));
    errors.collect(cdk.propertyValidator('maxRetentionDays', cdk.validateNumber)(properties.maxRetentionDays));
    errors.collect(cdk.propertyValidator('minRetentionDays', cdk.requiredValidator)(properties.minRetentionDays));
    errors.collect(cdk.propertyValidator('minRetentionDays', cdk.validateNumber)(properties.minRetentionDays));
    return errors.wrap('supplied properties not correct for "LockConfigurationTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupVault.LockConfigurationType` resource
 *
 * @param properties - the TypeScript properties of a `LockConfigurationTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupVault.LockConfigurationType` resource.
 */
// @ts-ignore TS6133
function cfnBackupVaultLockConfigurationTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupVault_LockConfigurationTypePropertyValidator(properties).assertSuccess();
    return {
        ChangeableForDays: cdk.numberToCloudFormation(properties.changeableForDays),
        MaxRetentionDays: cdk.numberToCloudFormation(properties.maxRetentionDays),
        MinRetentionDays: cdk.numberToCloudFormation(properties.minRetentionDays),
    };
}

// @ts-ignore TS6133
function CfnBackupVaultLockConfigurationTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupVault.LockConfigurationTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupVault.LockConfigurationTypeProperty>();
    ret.addPropertyResult('changeableForDays', 'ChangeableForDays', properties.ChangeableForDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ChangeableForDays) : undefined);
    ret.addPropertyResult('maxRetentionDays', 'MaxRetentionDays', properties.MaxRetentionDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetentionDays) : undefined);
    ret.addPropertyResult('minRetentionDays', 'MinRetentionDays', cfn_parse.FromCloudFormation.getNumber(properties.MinRetentionDays));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBackupVault {
    /**
     * Specifies an object containing SNS event notification properties for the target backup vault.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-notificationobjecttype.html
     */
    export interface NotificationObjectTypeProperty {
        /**
         * An array of events that indicate the status of jobs to back up resources to the backup vault. For valid events, see [BackupVaultEvents](https://docs.aws.amazon.com/aws-backup/latest/devguide/API_PutBackupVaultNotifications.html#API_PutBackupVaultNotifications_RequestSyntax) in the *AWS Backup API Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-notificationobjecttype.html#cfn-backup-backupvault-notificationobjecttype-backupvaultevents
         */
        readonly backupVaultEvents: string[];
        /**
         * An ARN that uniquely identifies an Amazon Simple Notification Service (Amazon SNS) topic; for example, `arn:aws:sns:us-west-2:111122223333:MyTopic` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-notificationobjecttype.html#cfn-backup-backupvault-notificationobjecttype-snstopicarn
         */
        readonly snsTopicArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationObjectTypeProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationObjectTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBackupVault_NotificationObjectTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backupVaultEvents', cdk.requiredValidator)(properties.backupVaultEvents));
    errors.collect(cdk.propertyValidator('backupVaultEvents', cdk.listValidator(cdk.validateString))(properties.backupVaultEvents));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.requiredValidator)(properties.snsTopicArn));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.validateString)(properties.snsTopicArn));
    return errors.wrap('supplied properties not correct for "NotificationObjectTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::BackupVault.NotificationObjectType` resource
 *
 * @param properties - the TypeScript properties of a `NotificationObjectTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::BackupVault.NotificationObjectType` resource.
 */
// @ts-ignore TS6133
function cfnBackupVaultNotificationObjectTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBackupVault_NotificationObjectTypePropertyValidator(properties).assertSuccess();
    return {
        BackupVaultEvents: cdk.listMapper(cdk.stringToCloudFormation)(properties.backupVaultEvents),
        SNSTopicArn: cdk.stringToCloudFormation(properties.snsTopicArn),
    };
}

// @ts-ignore TS6133
function CfnBackupVaultNotificationObjectTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupVault.NotificationObjectTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupVault.NotificationObjectTypeProperty>();
    ret.addPropertyResult('backupVaultEvents', 'BackupVaultEvents', cfn_parse.FromCloudFormation.getStringArray(properties.BackupVaultEvents));
    ret.addPropertyResult('snsTopicArn', 'SNSTopicArn', cfn_parse.FromCloudFormation.getString(properties.SNSTopicArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFramework`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html
 */
export interface CfnFrameworkProps {

    /**
     * Contains detailed information about all of the controls of a framework. Each framework must contain at least one control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkcontrols
     */
    readonly frameworkControls: Array<CfnFramework.FrameworkControlProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An optional description of the framework with a maximum 1,024 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkdescription
     */
    readonly frameworkDescription?: string;

    /**
     * The unique name of a framework. This name is between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkname
     */
    readonly frameworkName?: string;

    /**
     * A list of tags with which to tag your framework.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworktags
     */
    readonly frameworkTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnFrameworkProps`
 *
 * @param properties - the TypeScript properties of a `CfnFrameworkProps`
 *
 * @returns the result of the validation.
 */
function CfnFrameworkPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('frameworkControls', cdk.requiredValidator)(properties.frameworkControls));
    errors.collect(cdk.propertyValidator('frameworkControls', cdk.listValidator(CfnFramework_FrameworkControlPropertyValidator))(properties.frameworkControls));
    errors.collect(cdk.propertyValidator('frameworkDescription', cdk.validateString)(properties.frameworkDescription));
    errors.collect(cdk.propertyValidator('frameworkName', cdk.validateString)(properties.frameworkName));
    errors.collect(cdk.propertyValidator('frameworkTags', cdk.listValidator(cdk.validateCfnTag))(properties.frameworkTags));
    return errors.wrap('supplied properties not correct for "CfnFrameworkProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::Framework` resource
 *
 * @param properties - the TypeScript properties of a `CfnFrameworkProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::Framework` resource.
 */
// @ts-ignore TS6133
function cfnFrameworkPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFrameworkPropsValidator(properties).assertSuccess();
    return {
        FrameworkControls: cdk.listMapper(cfnFrameworkFrameworkControlPropertyToCloudFormation)(properties.frameworkControls),
        FrameworkDescription: cdk.stringToCloudFormation(properties.frameworkDescription),
        FrameworkName: cdk.stringToCloudFormation(properties.frameworkName),
        FrameworkTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.frameworkTags),
    };
}

// @ts-ignore TS6133
function CfnFrameworkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFrameworkProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFrameworkProps>();
    ret.addPropertyResult('frameworkControls', 'FrameworkControls', cfn_parse.FromCloudFormation.getArray(CfnFrameworkFrameworkControlPropertyFromCloudFormation)(properties.FrameworkControls));
    ret.addPropertyResult('frameworkDescription', 'FrameworkDescription', properties.FrameworkDescription != null ? cfn_parse.FromCloudFormation.getString(properties.FrameworkDescription) : undefined);
    ret.addPropertyResult('frameworkName', 'FrameworkName', properties.FrameworkName != null ? cfn_parse.FromCloudFormation.getString(properties.FrameworkName) : undefined);
    ret.addPropertyResult('frameworkTags', 'FrameworkTags', properties.FrameworkTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.FrameworkTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Backup::Framework`
 *
 * Creates a framework with one or more controls. A framework is a collection of controls that you can use to evaluate your backup practices. By using pre-built customizable controls to define your policies, you can evaluate whether your backup practices comply with your policies and which resources are not yet in compliance.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/bam-cfn-integration.html#bam-cfn-frameworks-template) .
 *
 * @cloudformationResource AWS::Backup::Framework
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html
 */
export class CfnFramework extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Backup::Framework";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFramework {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFrameworkPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFramework(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The UTC time when you created your framework.
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     * Depolyment status refers to whether your framework has completed deployment. This status is usually `Completed` , but might also be `Create in progress` or another status. For a list of statuses, see [Framework compliance status](https://docs.aws.amazon.com/aws-backup/latest/devguide/viewing-frameworks.html) in the *Developer Guide* .
     * @cloudformationAttribute DeploymentStatus
     */
    public readonly attrDeploymentStatus: string;

    /**
     * The Amazon Resource Name (ARN) of your framework.
     * @cloudformationAttribute FrameworkArn
     */
    public readonly attrFrameworkArn: string;

    /**
     * Framework status refers to whether you have turned on resource tracking for all of your resources. This status is `Active` when you turn on all resources the framework evaluates. For other statuses and steps to correct them, see [Framework compliance status](https://docs.aws.amazon.com/aws-backup/latest/devguide/viewing-frameworks.html) in the *Developer Guide* .
     * @cloudformationAttribute FrameworkStatus
     */
    public readonly attrFrameworkStatus: string;

    /**
     * Contains detailed information about all of the controls of a framework. Each framework must contain at least one control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkcontrols
     */
    public frameworkControls: Array<CfnFramework.FrameworkControlProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An optional description of the framework with a maximum 1,024 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkdescription
     */
    public frameworkDescription: string | undefined;

    /**
     * The unique name of a framework. This name is between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkname
     */
    public frameworkName: string | undefined;

    /**
     * A list of tags with which to tag your framework.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworktags
     */
    public frameworkTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Backup::Framework`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFrameworkProps) {
        super(scope, id, { type: CfnFramework.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'frameworkControls', this);
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrDeploymentStatus = cdk.Token.asString(this.getAtt('DeploymentStatus', cdk.ResolutionTypeHint.STRING));
        this.attrFrameworkArn = cdk.Token.asString(this.getAtt('FrameworkArn', cdk.ResolutionTypeHint.STRING));
        this.attrFrameworkStatus = cdk.Token.asString(this.getAtt('FrameworkStatus', cdk.ResolutionTypeHint.STRING));

        this.frameworkControls = props.frameworkControls;
        this.frameworkDescription = props.frameworkDescription;
        this.frameworkName = props.frameworkName;
        this.frameworkTags = props.frameworkTags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFramework.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            frameworkControls: this.frameworkControls,
            frameworkDescription: this.frameworkDescription,
            frameworkName: this.frameworkName,
            frameworkTags: this.frameworkTags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFrameworkPropsToCloudFormation(props);
    }
}

export namespace CfnFramework {
    /**
     * A list of parameters for a control. A control can have zero, one, or more than one parameter. An example of a control with two parameters is: "backup plan frequency is at least `daily` and the retention period is at least `1 year` ". The first parameter is `daily` . The second parameter is `1 year` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlinputparameter.html
     */
    export interface ControlInputParameterProperty {
        /**
         * The name of a parameter, for example, `BackupPlanFrequency` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlinputparameter.html#cfn-backup-framework-controlinputparameter-parametername
         */
        readonly parameterName: string;
        /**
         * The value of parameter, for example, `hourly` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlinputparameter.html#cfn-backup-framework-controlinputparameter-parametervalue
         */
        readonly parameterValue: string;
    }
}

/**
 * Determine whether the given properties match those of a `ControlInputParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ControlInputParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnFramework_ControlInputParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('parameterName', cdk.requiredValidator)(properties.parameterName));
    errors.collect(cdk.propertyValidator('parameterName', cdk.validateString)(properties.parameterName));
    errors.collect(cdk.propertyValidator('parameterValue', cdk.requiredValidator)(properties.parameterValue));
    errors.collect(cdk.propertyValidator('parameterValue', cdk.validateString)(properties.parameterValue));
    return errors.wrap('supplied properties not correct for "ControlInputParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::Framework.ControlInputParameter` resource
 *
 * @param properties - the TypeScript properties of a `ControlInputParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::Framework.ControlInputParameter` resource.
 */
// @ts-ignore TS6133
function cfnFrameworkControlInputParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFramework_ControlInputParameterPropertyValidator(properties).assertSuccess();
    return {
        ParameterName: cdk.stringToCloudFormation(properties.parameterName),
        ParameterValue: cdk.stringToCloudFormation(properties.parameterValue),
    };
}

// @ts-ignore TS6133
function CfnFrameworkControlInputParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFramework.ControlInputParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFramework.ControlInputParameterProperty>();
    ret.addPropertyResult('parameterName', 'ParameterName', cfn_parse.FromCloudFormation.getString(properties.ParameterName));
    ret.addPropertyResult('parameterValue', 'ParameterValue', cfn_parse.FromCloudFormation.getString(properties.ParameterValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFramework {
    /**
     * A framework consists of one or more controls. Each control has its own control scope. The control scope can include one or more resource types, a combination of a tag key and value, or a combination of one resource type and one resource ID. If no scope is specified, evaluations for the rule are triggered when any resource in your recording group changes in configuration.
     *
     * > To set a control scope that includes all of a particular resource, leave the `ControlScope` empty or do not pass it when calling `CreateFramework` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlscope.html
     */
    export interface ControlScopeProperty {
        /**
         * The ID of the only AWS resource that you want your control scope to contain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlscope.html#cfn-backup-framework-controlscope-complianceresourceids
         */
        readonly complianceResourceIds?: string[];
        /**
         * Describes whether the control scope includes one or more types of resources, such as `EFS` or `RDS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlscope.html#cfn-backup-framework-controlscope-complianceresourcetypes
         */
        readonly complianceResourceTypes?: string[];
        /**
         * The tag key-value pair applied to those AWS resources that you want to trigger an evaluation for a rule. A maximum of one key-value pair can be provided. The tag value is optional, but it cannot be an empty string. The structure to assign a tag is: `[{"Key":"string","Value":"string"}]` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlscope.html#cfn-backup-framework-controlscope-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `ControlScopeProperty`
 *
 * @param properties - the TypeScript properties of a `ControlScopeProperty`
 *
 * @returns the result of the validation.
 */
function CfnFramework_ControlScopePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('complianceResourceIds', cdk.listValidator(cdk.validateString))(properties.complianceResourceIds));
    errors.collect(cdk.propertyValidator('complianceResourceTypes', cdk.listValidator(cdk.validateString))(properties.complianceResourceTypes));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "ControlScopeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::Framework.ControlScope` resource
 *
 * @param properties - the TypeScript properties of a `ControlScopeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::Framework.ControlScope` resource.
 */
// @ts-ignore TS6133
function cfnFrameworkControlScopePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFramework_ControlScopePropertyValidator(properties).assertSuccess();
    return {
        ComplianceResourceIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.complianceResourceIds),
        ComplianceResourceTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.complianceResourceTypes),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFrameworkControlScopePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFramework.ControlScopeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFramework.ControlScopeProperty>();
    ret.addPropertyResult('complianceResourceIds', 'ComplianceResourceIds', properties.ComplianceResourceIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ComplianceResourceIds) : undefined);
    ret.addPropertyResult('complianceResourceTypes', 'ComplianceResourceTypes', properties.ComplianceResourceTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ComplianceResourceTypes) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFramework {
    /**
     * Contains detailed information about all of the controls of a framework. Each framework must contain at least one control.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-frameworkcontrol.html
     */
    export interface FrameworkControlProperty {
        /**
         * A list of `ParameterName` and `ParameterValue` pairs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-frameworkcontrol.html#cfn-backup-framework-frameworkcontrol-controlinputparameters
         */
        readonly controlInputParameters?: Array<CfnFramework.ControlInputParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of a control. This name is between 1 and 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-frameworkcontrol.html#cfn-backup-framework-frameworkcontrol-controlname
         */
        readonly controlName: string;
        /**
         * The scope of a control. The control scope defines what the control will evaluate. Three examples of control scopes are: a specific backup plan, all backup plans with a specific tag, or all backup plans. For more information, see [`ControlScope` .](https://docs.aws.amazon.com/aws-backup/latest/devguide/API_ControlScope.html)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-frameworkcontrol.html#cfn-backup-framework-frameworkcontrol-controlscope
         */
        readonly controlScope?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FrameworkControlProperty`
 *
 * @param properties - the TypeScript properties of a `FrameworkControlProperty`
 *
 * @returns the result of the validation.
 */
function CfnFramework_FrameworkControlPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('controlInputParameters', cdk.listValidator(CfnFramework_ControlInputParameterPropertyValidator))(properties.controlInputParameters));
    errors.collect(cdk.propertyValidator('controlName', cdk.requiredValidator)(properties.controlName));
    errors.collect(cdk.propertyValidator('controlName', cdk.validateString)(properties.controlName));
    errors.collect(cdk.propertyValidator('controlScope', cdk.validateObject)(properties.controlScope));
    return errors.wrap('supplied properties not correct for "FrameworkControlProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::Framework.FrameworkControl` resource
 *
 * @param properties - the TypeScript properties of a `FrameworkControlProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::Framework.FrameworkControl` resource.
 */
// @ts-ignore TS6133
function cfnFrameworkFrameworkControlPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFramework_FrameworkControlPropertyValidator(properties).assertSuccess();
    return {
        ControlInputParameters: cdk.listMapper(cfnFrameworkControlInputParameterPropertyToCloudFormation)(properties.controlInputParameters),
        ControlName: cdk.stringToCloudFormation(properties.controlName),
        ControlScope: cdk.objectToCloudFormation(properties.controlScope),
    };
}

// @ts-ignore TS6133
function CfnFrameworkFrameworkControlPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFramework.FrameworkControlProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFramework.FrameworkControlProperty>();
    ret.addPropertyResult('controlInputParameters', 'ControlInputParameters', properties.ControlInputParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnFrameworkControlInputParameterPropertyFromCloudFormation)(properties.ControlInputParameters) : undefined);
    ret.addPropertyResult('controlName', 'ControlName', cfn_parse.FromCloudFormation.getString(properties.ControlName));
    ret.addPropertyResult('controlScope', 'ControlScope', properties.ControlScope != null ? cfn_parse.FromCloudFormation.getAny(properties.ControlScope) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnReportPlan`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html
 */
export interface CfnReportPlanProps {

    /**
     * Contains information about where and how to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportdeliverychannel
     */
    readonly reportDeliveryChannel: any | cdk.IResolvable;

    /**
     * Identifies the report template for the report. Reports are built using a report template. The report templates are:
     *
     * `RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT`
     *
     * If the report template is `RESOURCE_COMPLIANCE_REPORT` or `CONTROL_COMPLIANCE_REPORT` , this API resource also describes the report coverage by AWS Regions and frameworks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportsetting
     */
    readonly reportSetting: any | cdk.IResolvable;

    /**
     * An optional description of the report plan with a maximum 1,024 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplandescription
     */
    readonly reportPlanDescription?: string;

    /**
     * The unique name of the report plan. This name is between 1 and 256 characters starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplanname
     */
    readonly reportPlanName?: string;

    /**
     * A list of tags to tag your report plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplantags
     */
    readonly reportPlanTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnReportPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnReportPlanProps`
 *
 * @returns the result of the validation.
 */
function CfnReportPlanPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('reportDeliveryChannel', cdk.requiredValidator)(properties.reportDeliveryChannel));
    errors.collect(cdk.propertyValidator('reportDeliveryChannel', cdk.validateObject)(properties.reportDeliveryChannel));
    errors.collect(cdk.propertyValidator('reportPlanDescription', cdk.validateString)(properties.reportPlanDescription));
    errors.collect(cdk.propertyValidator('reportPlanName', cdk.validateString)(properties.reportPlanName));
    errors.collect(cdk.propertyValidator('reportPlanTags', cdk.listValidator(cdk.validateCfnTag))(properties.reportPlanTags));
    errors.collect(cdk.propertyValidator('reportSetting', cdk.requiredValidator)(properties.reportSetting));
    errors.collect(cdk.propertyValidator('reportSetting', cdk.validateObject)(properties.reportSetting));
    return errors.wrap('supplied properties not correct for "CfnReportPlanProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::ReportPlan` resource
 *
 * @param properties - the TypeScript properties of a `CfnReportPlanProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::ReportPlan` resource.
 */
// @ts-ignore TS6133
function cfnReportPlanPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReportPlanPropsValidator(properties).assertSuccess();
    return {
        ReportDeliveryChannel: cdk.objectToCloudFormation(properties.reportDeliveryChannel),
        ReportSetting: cdk.objectToCloudFormation(properties.reportSetting),
        ReportPlanDescription: cdk.stringToCloudFormation(properties.reportPlanDescription),
        ReportPlanName: cdk.stringToCloudFormation(properties.reportPlanName),
        ReportPlanTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.reportPlanTags),
    };
}

// @ts-ignore TS6133
function CfnReportPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReportPlanProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReportPlanProps>();
    ret.addPropertyResult('reportDeliveryChannel', 'ReportDeliveryChannel', cfn_parse.FromCloudFormation.getAny(properties.ReportDeliveryChannel));
    ret.addPropertyResult('reportSetting', 'ReportSetting', cfn_parse.FromCloudFormation.getAny(properties.ReportSetting));
    ret.addPropertyResult('reportPlanDescription', 'ReportPlanDescription', properties.ReportPlanDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ReportPlanDescription) : undefined);
    ret.addPropertyResult('reportPlanName', 'ReportPlanName', properties.ReportPlanName != null ? cfn_parse.FromCloudFormation.getString(properties.ReportPlanName) : undefined);
    ret.addPropertyResult('reportPlanTags', 'ReportPlanTags', properties.ReportPlanTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.ReportPlanTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Backup::ReportPlan`
 *
 * Creates a report plan. A report plan is a document that contains information about the contents of the report and where AWS Backup will deliver it.
 *
 * If you call `CreateReportPlan` with a plan that already exists, you receive an `AlreadyExistsException` exception.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-cfn) .
 *
 * @cloudformationResource AWS::Backup::ReportPlan
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html
 */
export class CfnReportPlan extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Backup::ReportPlan";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReportPlan {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReportPlanPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReportPlan(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of your report plan.
     * @cloudformationAttribute ReportPlanArn
     */
    public readonly attrReportPlanArn: string;

    /**
     * Contains information about where and how to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportdeliverychannel
     */
    public reportDeliveryChannel: any | cdk.IResolvable;

    /**
     * Identifies the report template for the report. Reports are built using a report template. The report templates are:
     *
     * `RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT`
     *
     * If the report template is `RESOURCE_COMPLIANCE_REPORT` or `CONTROL_COMPLIANCE_REPORT` , this API resource also describes the report coverage by AWS Regions and frameworks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportsetting
     */
    public reportSetting: any | cdk.IResolvable;

    /**
     * An optional description of the report plan with a maximum 1,024 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplandescription
     */
    public reportPlanDescription: string | undefined;

    /**
     * The unique name of the report plan. This name is between 1 and 256 characters starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplanname
     */
    public reportPlanName: string | undefined;

    /**
     * A list of tags to tag your report plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplantags
     */
    public reportPlanTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Backup::ReportPlan`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReportPlanProps) {
        super(scope, id, { type: CfnReportPlan.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'reportDeliveryChannel', this);
        cdk.requireProperty(props, 'reportSetting', this);
        this.attrReportPlanArn = cdk.Token.asString(this.getAtt('ReportPlanArn', cdk.ResolutionTypeHint.STRING));

        this.reportDeliveryChannel = props.reportDeliveryChannel;
        this.reportSetting = props.reportSetting;
        this.reportPlanDescription = props.reportPlanDescription;
        this.reportPlanName = props.reportPlanName;
        this.reportPlanTags = props.reportPlanTags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReportPlan.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            reportDeliveryChannel: this.reportDeliveryChannel,
            reportSetting: this.reportSetting,
            reportPlanDescription: this.reportPlanDescription,
            reportPlanName: this.reportPlanName,
            reportPlanTags: this.reportPlanTags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReportPlanPropsToCloudFormation(props);
    }
}

export namespace CfnReportPlan {
    /**
     * Contains information from your report plan about where to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportdeliverychannel.html
     */
    export interface ReportDeliveryChannelProperty {
        /**
         * A list of the format of your reports: `CSV` , `JSON` , or both. If not specified, the default format is `CSV` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportdeliverychannel.html#cfn-backup-reportplan-reportdeliverychannel-formats
         */
        readonly formats?: string[];
        /**
         * The unique name of the S3 bucket that receives your reports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportdeliverychannel.html#cfn-backup-reportplan-reportdeliverychannel-s3bucketname
         */
        readonly s3BucketName: string;
        /**
         * The prefix for where AWS Backup Audit Manager delivers your reports to Amazon S3. The prefix is this part of the following path: s3://your-bucket-name/ `prefix` /Backup/us-west-2/year/month/day/report-name. If not specified, there is no prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportdeliverychannel.html#cfn-backup-reportplan-reportdeliverychannel-s3keyprefix
         */
        readonly s3KeyPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReportDeliveryChannelProperty`
 *
 * @param properties - the TypeScript properties of a `ReportDeliveryChannelProperty`
 *
 * @returns the result of the validation.
 */
function CfnReportPlan_ReportDeliveryChannelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('formats', cdk.listValidator(cdk.validateString))(properties.formats));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.requiredValidator)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.validateString)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3KeyPrefix', cdk.validateString)(properties.s3KeyPrefix));
    return errors.wrap('supplied properties not correct for "ReportDeliveryChannelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::ReportPlan.ReportDeliveryChannel` resource
 *
 * @param properties - the TypeScript properties of a `ReportDeliveryChannelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::ReportPlan.ReportDeliveryChannel` resource.
 */
// @ts-ignore TS6133
function cfnReportPlanReportDeliveryChannelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReportPlan_ReportDeliveryChannelPropertyValidator(properties).assertSuccess();
    return {
        Formats: cdk.listMapper(cdk.stringToCloudFormation)(properties.formats),
        S3BucketName: cdk.stringToCloudFormation(properties.s3BucketName),
        S3KeyPrefix: cdk.stringToCloudFormation(properties.s3KeyPrefix),
    };
}

// @ts-ignore TS6133
function CfnReportPlanReportDeliveryChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReportPlan.ReportDeliveryChannelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReportPlan.ReportDeliveryChannelProperty>();
    ret.addPropertyResult('formats', 'Formats', properties.Formats != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Formats) : undefined);
    ret.addPropertyResult('s3BucketName', 'S3BucketName', cfn_parse.FromCloudFormation.getString(properties.S3BucketName));
    ret.addPropertyResult('s3KeyPrefix', 'S3KeyPrefix', properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReportPlan {
    /**
     * Contains detailed information about a report setting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html
     */
    export interface ReportSettingProperty {
        /**
         * These are the accounts to be included in the report.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-accounts
         */
        readonly accounts?: string[];
        /**
         * The Amazon Resource Names (ARNs) of the frameworks a report covers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-frameworkarns
         */
        readonly frameworkArns?: string[];
        /**
         * These are the Organizational Units to be included in the report.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-organizationunits
         */
        readonly organizationUnits?: string[];
        /**
         * These are the Regions to be included in the report.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-regions
         */
        readonly regions?: string[];
        /**
         * Identifies the report template for the report. Reports are built using a report template. The report templates are:
         *
         * `RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-reporttemplate
         */
        readonly reportTemplate: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReportSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ReportSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnReportPlan_ReportSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accounts', cdk.listValidator(cdk.validateString))(properties.accounts));
    errors.collect(cdk.propertyValidator('frameworkArns', cdk.listValidator(cdk.validateString))(properties.frameworkArns));
    errors.collect(cdk.propertyValidator('organizationUnits', cdk.listValidator(cdk.validateString))(properties.organizationUnits));
    errors.collect(cdk.propertyValidator('regions', cdk.listValidator(cdk.validateString))(properties.regions));
    errors.collect(cdk.propertyValidator('reportTemplate', cdk.requiredValidator)(properties.reportTemplate));
    errors.collect(cdk.propertyValidator('reportTemplate', cdk.validateString)(properties.reportTemplate));
    return errors.wrap('supplied properties not correct for "ReportSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Backup::ReportPlan.ReportSetting` resource
 *
 * @param properties - the TypeScript properties of a `ReportSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Backup::ReportPlan.ReportSetting` resource.
 */
// @ts-ignore TS6133
function cfnReportPlanReportSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReportPlan_ReportSettingPropertyValidator(properties).assertSuccess();
    return {
        Accounts: cdk.listMapper(cdk.stringToCloudFormation)(properties.accounts),
        FrameworkArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.frameworkArns),
        OrganizationUnits: cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationUnits),
        Regions: cdk.listMapper(cdk.stringToCloudFormation)(properties.regions),
        ReportTemplate: cdk.stringToCloudFormation(properties.reportTemplate),
    };
}

// @ts-ignore TS6133
function CfnReportPlanReportSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReportPlan.ReportSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReportPlan.ReportSettingProperty>();
    ret.addPropertyResult('accounts', 'Accounts', properties.Accounts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Accounts) : undefined);
    ret.addPropertyResult('frameworkArns', 'FrameworkArns', properties.FrameworkArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.FrameworkArns) : undefined);
    ret.addPropertyResult('organizationUnits', 'OrganizationUnits', properties.OrganizationUnits != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OrganizationUnits) : undefined);
    ret.addPropertyResult('regions', 'Regions', properties.Regions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Regions) : undefined);
    ret.addPropertyResult('reportTemplate', 'ReportTemplate', cfn_parse.FromCloudFormation.getString(properties.ReportTemplate));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
