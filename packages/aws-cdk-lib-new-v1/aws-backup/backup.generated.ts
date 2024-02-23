/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Contains an optional backup plan display name and an array of `BackupRule` objects, each of which specifies a backup rule.
 *
 * Each rule in a backup plan is a separate scheduled task and can back up a different selection of AWS resources.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-cfn) .
 *
 * @cloudformationResource AWS::Backup::BackupPlan
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html
 */
export class CfnBackupPlan extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Backup::BackupPlan";

  /**
   * Build a CfnBackupPlan from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBackupPlan(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * An Amazon Resource Name (ARN) that uniquely identifies a backup plan; for example, `arn:aws:backup:us-east-1:123456789012:plan:8F81F553-3A74-4A3F-B93D-B3360DC80C50` .
   *
   * @cloudformationAttribute BackupPlanArn
   */
  public readonly attrBackupPlanArn: string;

  /**
   * Uniquely identifies a backup plan.
   *
   * @cloudformationAttribute BackupPlanId
   */
  public readonly attrBackupPlanId: string;

  /**
   * Unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. Version Ids cannot be edited.
   *
   * @cloudformationAttribute VersionId
   */
  public readonly attrVersionId: string;

  /**
   * Uniquely identifies the backup plan to be associated with the selection of resources.
   */
  public backupPlan: CfnBackupPlan.BackupPlanResourceTypeProperty | cdk.IResolvable;

  /**
   * To help organize your resources, you can assign your own metadata to the resources that you create.
   */
  public backupPlanTags?: cdk.IResolvable | Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBackupPlanProps) {
    super(scope, id, {
      "type": CfnBackupPlan.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "backupPlan", this);

    this.attrBackupPlanArn = cdk.Token.asString(this.getAtt("BackupPlanArn", cdk.ResolutionTypeHint.STRING));
    this.attrBackupPlanId = cdk.Token.asString(this.getAtt("BackupPlanId", cdk.ResolutionTypeHint.STRING));
    this.attrVersionId = cdk.Token.asString(this.getAtt("VersionId", cdk.ResolutionTypeHint.STRING));
    this.backupPlan = props.backupPlan;
    this.backupPlanTags = props.backupPlanTags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "backupPlan": this.backupPlan,
      "backupPlanTags": this.backupPlanTags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBackupPlan.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBackupPlanPropsToCloudFormation(props);
  }
}

export namespace CfnBackupPlan {
  /**
   * Specifies an object containing properties used to create a backup plan.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupplanresourcetype.html
   */
  export interface BackupPlanResourceTypeProperty {
    /**
     * A list of backup options for each resource type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupplanresourcetype.html#cfn-backup-backupplan-backupplanresourcetype-advancedbackupsettings
     */
    readonly advancedBackupSettings?: Array<CfnBackupPlan.AdvancedBackupSettingResourceTypeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The display name of a backup plan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupplanresourcetype.html#cfn-backup-backupplan-backupplanresourcetype-backupplanname
     */
    readonly backupPlanName: string;

    /**
     * An array of `BackupRule` objects, each of which specifies a scheduled task that is used to back up a selection of resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupplanresourcetype.html#cfn-backup-backupplan-backupplanresourcetype-backupplanrule
     */
    readonly backupPlanRule: Array<CfnBackupPlan.BackupRuleResourceTypeProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Specifies an object containing resource type and backup options.
   *
   * This is only supported for Windows VSS backups.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-advancedbackupsettingresourcetype.html
   */
  export interface AdvancedBackupSettingResourceTypeProperty {
    /**
     * The backup option for the resource.
     *
     * Each option is a key-value pair. This option is only available for Windows VSS backup jobs.
     *
     * Valid values:
     *
     * Set to `"WindowsVSS":"enabled"` to enable the `WindowsVSS` backup option and create a Windows VSS backup.
     *
     * Set to `"WindowsVSS":"disabled"` to create a regular backup. The `WindowsVSS` option is not enabled by default.
     *
     * If you specify an invalid option, you get an `InvalidParameterValueException` exception.
     *
     * For more information about Windows VSS backups, see [Creating a VSS-Enabled Windows Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/windows-backups.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-advancedbackupsettingresourcetype.html#cfn-backup-backupplan-advancedbackupsettingresourcetype-backupoptions
     */
    readonly backupOptions: any | cdk.IResolvable;

    /**
     * The name of a resource type.
     *
     * The only supported resource type is EC2.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-advancedbackupsettingresourcetype.html#cfn-backup-backupplan-advancedbackupsettingresourcetype-resourcetype
     */
    readonly resourceType: string;
  }

  /**
   * Specifies an object containing properties used to schedule a task to back up a selection of resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html
   */
  export interface BackupRuleResourceTypeProperty {
    /**
     * A value in minutes after a backup job is successfully started before it must be completed or it is canceled by AWS Backup .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-completionwindowminutes
     */
    readonly completionWindowMinutes?: number;

    /**
     * An array of CopyAction objects, which contains the details of the copy operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-copyactions
     */
    readonly copyActions?: Array<CfnBackupPlan.CopyActionResourceTypeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Enables continuous backup and point-in-time restores (PITR).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-enablecontinuousbackup
     */
    readonly enableContinuousBackup?: boolean | cdk.IResolvable;

    /**
     * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires.
     *
     * AWS Backup transitions and expires backups automatically according to the lifecycle that you define.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-lifecycle
     */
    readonly lifecycle?: cdk.IResolvable | CfnBackupPlan.LifecycleResourceTypeProperty;

    /**
     * To help organize your resources, you can assign your own metadata to the resources that you create.
     *
     * Each tag is a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-recoverypointtags
     */
    readonly recoveryPointTags?: cdk.IResolvable | Record<string, string>;

    /**
     * A display name for a backup rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-rulename
     */
    readonly ruleName: string;

    /**
     * A CRON expression specifying when AWS Backup initiates a backup job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-scheduleexpression
     */
    readonly scheduleExpression?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-scheduleexpressiontimezone
     */
    readonly scheduleExpressionTimezone?: string;

    /**
     * An optional value that specifies a period of time in minutes after a backup is scheduled before a job is canceled if it doesn't start successfully.
     *
     * If this value is included, it must be at least 60 minutes to avoid errors.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-startwindowminutes
     */
    readonly startWindowMinutes?: number;

    /**
     * The name of a logical container where backups are stored.
     *
     * Backup vaults are identified by names that are unique to the account used to create them and the AWS Region where they are created. They consist of letters, numbers, and hyphens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-backupruleresourcetype.html#cfn-backup-backupplan-backupruleresourcetype-targetbackupvault
     */
    readonly targetBackupVault: string;
  }

  /**
   * Copies backups created by a backup rule to another vault.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-copyactionresourcetype.html
   */
  export interface CopyActionResourceTypeProperty {
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies the destination backup vault for the copied backup.
     *
     * For example, `arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-copyactionresourcetype.html#cfn-backup-backupplan-copyactionresourcetype-destinationbackupvaultarn
     */
    readonly destinationBackupVaultArn: string;

    /**
     * Defines when a protected resource is transitioned to cold storage and when it expires.
     *
     * AWS Backup transitions and expires backups automatically according to the lifecycle that you define. If you do not specify a lifecycle, AWS Backup applies the lifecycle policy of the source backup to the destination backup.
     *
     * Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-copyactionresourcetype.html#cfn-backup-backupplan-copyactionresourcetype-lifecycle
     */
    readonly lifecycle?: cdk.IResolvable | CfnBackupPlan.LifecycleResourceTypeProperty;
  }

  /**
   * Specifies an object containing an array of `Transition` objects that determine how long in days before a recovery point transitions to cold storage or is deleted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-lifecycleresourcetype.html
   */
  export interface LifecycleResourceTypeProperty {
    /**
     * Specifies the number of days after creation that a recovery point is deleted.
     *
     * Must be greater than `MoveToColdStorageAfterDays` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-lifecycleresourcetype.html#cfn-backup-backupplan-lifecycleresourcetype-deleteafterdays
     */
    readonly deleteAfterDays?: number;

    /**
     * Specifies the number of days after creation that a recovery point is moved to cold storage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupplan-lifecycleresourcetype.html#cfn-backup-backupplan-lifecycleresourcetype-movetocoldstorageafterdays
     */
    readonly moveToColdStorageAfterDays?: number;
  }
}

/**
 * Properties for defining a `CfnBackupPlan`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html
 */
export interface CfnBackupPlanProps {
  /**
   * Uniquely identifies the backup plan to be associated with the selection of resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html#cfn-backup-backupplan-backupplan
   */
  readonly backupPlan: CfnBackupPlan.BackupPlanResourceTypeProperty | cdk.IResolvable;

  /**
   * To help organize your resources, you can assign your own metadata to the resources that you create.
   *
   * Each tag is a key-value pair. The specified tags are assigned to all backups created with this plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupplan.html#cfn-backup-backupplan-backupplantags
   */
  readonly backupPlanTags?: cdk.IResolvable | Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `AdvancedBackupSettingResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedBackupSettingResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupPlanAdvancedBackupSettingResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backupOptions", cdk.requiredValidator)(properties.backupOptions));
  errors.collect(cdk.propertyValidator("backupOptions", cdk.validateObject)(properties.backupOptions));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  return errors.wrap("supplied properties not correct for \"AdvancedBackupSettingResourceTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupPlanAdvancedBackupSettingResourceTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupPlanAdvancedBackupSettingResourceTypePropertyValidator(properties).assertSuccess();
  return {
    "BackupOptions": cdk.objectToCloudFormation(properties.backupOptions),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType)
  };
}

// @ts-ignore TS6133
function CfnBackupPlanAdvancedBackupSettingResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.AdvancedBackupSettingResourceTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.AdvancedBackupSettingResourceTypeProperty>();
  ret.addPropertyResult("backupOptions", "BackupOptions", (properties.BackupOptions != null ? cfn_parse.FromCloudFormation.getAny(properties.BackupOptions) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LifecycleResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `LifecycleResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupPlanLifecycleResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteAfterDays", cdk.validateNumber)(properties.deleteAfterDays));
  errors.collect(cdk.propertyValidator("moveToColdStorageAfterDays", cdk.validateNumber)(properties.moveToColdStorageAfterDays));
  return errors.wrap("supplied properties not correct for \"LifecycleResourceTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupPlanLifecycleResourceTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupPlanLifecycleResourceTypePropertyValidator(properties).assertSuccess();
  return {
    "DeleteAfterDays": cdk.numberToCloudFormation(properties.deleteAfterDays),
    "MoveToColdStorageAfterDays": cdk.numberToCloudFormation(properties.moveToColdStorageAfterDays)
  };
}

// @ts-ignore TS6133
function CfnBackupPlanLifecycleResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBackupPlan.LifecycleResourceTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.LifecycleResourceTypeProperty>();
  ret.addPropertyResult("deleteAfterDays", "DeleteAfterDays", (properties.DeleteAfterDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.DeleteAfterDays) : undefined));
  ret.addPropertyResult("moveToColdStorageAfterDays", "MoveToColdStorageAfterDays", (properties.MoveToColdStorageAfterDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.MoveToColdStorageAfterDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CopyActionResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `CopyActionResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupPlanCopyActionResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationBackupVaultArn", cdk.requiredValidator)(properties.destinationBackupVaultArn));
  errors.collect(cdk.propertyValidator("destinationBackupVaultArn", cdk.validateString)(properties.destinationBackupVaultArn));
  errors.collect(cdk.propertyValidator("lifecycle", CfnBackupPlanLifecycleResourceTypePropertyValidator)(properties.lifecycle));
  return errors.wrap("supplied properties not correct for \"CopyActionResourceTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupPlanCopyActionResourceTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupPlanCopyActionResourceTypePropertyValidator(properties).assertSuccess();
  return {
    "DestinationBackupVaultArn": cdk.stringToCloudFormation(properties.destinationBackupVaultArn),
    "Lifecycle": convertCfnBackupPlanLifecycleResourceTypePropertyToCloudFormation(properties.lifecycle)
  };
}

// @ts-ignore TS6133
function CfnBackupPlanCopyActionResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.CopyActionResourceTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.CopyActionResourceTypeProperty>();
  ret.addPropertyResult("destinationBackupVaultArn", "DestinationBackupVaultArn", (properties.DestinationBackupVaultArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationBackupVaultArn) : undefined));
  ret.addPropertyResult("lifecycle", "Lifecycle", (properties.Lifecycle != null ? CfnBackupPlanLifecycleResourceTypePropertyFromCloudFormation(properties.Lifecycle) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BackupRuleResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `BackupRuleResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupPlanBackupRuleResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("completionWindowMinutes", cdk.validateNumber)(properties.completionWindowMinutes));
  errors.collect(cdk.propertyValidator("copyActions", cdk.listValidator(CfnBackupPlanCopyActionResourceTypePropertyValidator))(properties.copyActions));
  errors.collect(cdk.propertyValidator("enableContinuousBackup", cdk.validateBoolean)(properties.enableContinuousBackup));
  errors.collect(cdk.propertyValidator("lifecycle", CfnBackupPlanLifecycleResourceTypePropertyValidator)(properties.lifecycle));
  errors.collect(cdk.propertyValidator("recoveryPointTags", cdk.hashValidator(cdk.validateString))(properties.recoveryPointTags));
  errors.collect(cdk.propertyValidator("ruleName", cdk.requiredValidator)(properties.ruleName));
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpressionTimezone", cdk.validateString)(properties.scheduleExpressionTimezone));
  errors.collect(cdk.propertyValidator("startWindowMinutes", cdk.validateNumber)(properties.startWindowMinutes));
  errors.collect(cdk.propertyValidator("targetBackupVault", cdk.requiredValidator)(properties.targetBackupVault));
  errors.collect(cdk.propertyValidator("targetBackupVault", cdk.validateString)(properties.targetBackupVault));
  return errors.wrap("supplied properties not correct for \"BackupRuleResourceTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupPlanBackupRuleResourceTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupPlanBackupRuleResourceTypePropertyValidator(properties).assertSuccess();
  return {
    "CompletionWindowMinutes": cdk.numberToCloudFormation(properties.completionWindowMinutes),
    "CopyActions": cdk.listMapper(convertCfnBackupPlanCopyActionResourceTypePropertyToCloudFormation)(properties.copyActions),
    "EnableContinuousBackup": cdk.booleanToCloudFormation(properties.enableContinuousBackup),
    "Lifecycle": convertCfnBackupPlanLifecycleResourceTypePropertyToCloudFormation(properties.lifecycle),
    "RecoveryPointTags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.recoveryPointTags),
    "RuleName": cdk.stringToCloudFormation(properties.ruleName),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression),
    "ScheduleExpressionTimezone": cdk.stringToCloudFormation(properties.scheduleExpressionTimezone),
    "StartWindowMinutes": cdk.numberToCloudFormation(properties.startWindowMinutes),
    "TargetBackupVault": cdk.stringToCloudFormation(properties.targetBackupVault)
  };
}

// @ts-ignore TS6133
function CfnBackupPlanBackupRuleResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.BackupRuleResourceTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.BackupRuleResourceTypeProperty>();
  ret.addPropertyResult("completionWindowMinutes", "CompletionWindowMinutes", (properties.CompletionWindowMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.CompletionWindowMinutes) : undefined));
  ret.addPropertyResult("copyActions", "CopyActions", (properties.CopyActions != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupPlanCopyActionResourceTypePropertyFromCloudFormation)(properties.CopyActions) : undefined));
  ret.addPropertyResult("enableContinuousBackup", "EnableContinuousBackup", (properties.EnableContinuousBackup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableContinuousBackup) : undefined));
  ret.addPropertyResult("lifecycle", "Lifecycle", (properties.Lifecycle != null ? CfnBackupPlanLifecycleResourceTypePropertyFromCloudFormation(properties.Lifecycle) : undefined));
  ret.addPropertyResult("recoveryPointTags", "RecoveryPointTags", (properties.RecoveryPointTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.RecoveryPointTags) : undefined));
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addPropertyResult("scheduleExpressionTimezone", "ScheduleExpressionTimezone", (properties.ScheduleExpressionTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpressionTimezone) : undefined));
  ret.addPropertyResult("startWindowMinutes", "StartWindowMinutes", (properties.StartWindowMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartWindowMinutes) : undefined));
  ret.addPropertyResult("targetBackupVault", "TargetBackupVault", (properties.TargetBackupVault != null ? cfn_parse.FromCloudFormation.getString(properties.TargetBackupVault) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BackupPlanResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `BackupPlanResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupPlanBackupPlanResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("advancedBackupSettings", cdk.listValidator(CfnBackupPlanAdvancedBackupSettingResourceTypePropertyValidator))(properties.advancedBackupSettings));
  errors.collect(cdk.propertyValidator("backupPlanName", cdk.requiredValidator)(properties.backupPlanName));
  errors.collect(cdk.propertyValidator("backupPlanName", cdk.validateString)(properties.backupPlanName));
  errors.collect(cdk.propertyValidator("backupPlanRule", cdk.requiredValidator)(properties.backupPlanRule));
  errors.collect(cdk.propertyValidator("backupPlanRule", cdk.listValidator(CfnBackupPlanBackupRuleResourceTypePropertyValidator))(properties.backupPlanRule));
  return errors.wrap("supplied properties not correct for \"BackupPlanResourceTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupPlanBackupPlanResourceTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupPlanBackupPlanResourceTypePropertyValidator(properties).assertSuccess();
  return {
    "AdvancedBackupSettings": cdk.listMapper(convertCfnBackupPlanAdvancedBackupSettingResourceTypePropertyToCloudFormation)(properties.advancedBackupSettings),
    "BackupPlanName": cdk.stringToCloudFormation(properties.backupPlanName),
    "BackupPlanRule": cdk.listMapper(convertCfnBackupPlanBackupRuleResourceTypePropertyToCloudFormation)(properties.backupPlanRule)
  };
}

// @ts-ignore TS6133
function CfnBackupPlanBackupPlanResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlan.BackupPlanResourceTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlan.BackupPlanResourceTypeProperty>();
  ret.addPropertyResult("advancedBackupSettings", "AdvancedBackupSettings", (properties.AdvancedBackupSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupPlanAdvancedBackupSettingResourceTypePropertyFromCloudFormation)(properties.AdvancedBackupSettings) : undefined));
  ret.addPropertyResult("backupPlanName", "BackupPlanName", (properties.BackupPlanName != null ? cfn_parse.FromCloudFormation.getString(properties.BackupPlanName) : undefined));
  ret.addPropertyResult("backupPlanRule", "BackupPlanRule", (properties.BackupPlanRule != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupPlanBackupRuleResourceTypePropertyFromCloudFormation)(properties.BackupPlanRule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBackupPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnBackupPlanProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupPlanPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backupPlan", cdk.requiredValidator)(properties.backupPlan));
  errors.collect(cdk.propertyValidator("backupPlan", CfnBackupPlanBackupPlanResourceTypePropertyValidator)(properties.backupPlan));
  errors.collect(cdk.propertyValidator("backupPlanTags", cdk.hashValidator(cdk.validateString))(properties.backupPlanTags));
  return errors.wrap("supplied properties not correct for \"CfnBackupPlanProps\"");
}

// @ts-ignore TS6133
function convertCfnBackupPlanPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupPlanPropsValidator(properties).assertSuccess();
  return {
    "BackupPlan": convertCfnBackupPlanBackupPlanResourceTypePropertyToCloudFormation(properties.backupPlan),
    "BackupPlanTags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.backupPlanTags)
  };
}

// @ts-ignore TS6133
function CfnBackupPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupPlanProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupPlanProps>();
  ret.addPropertyResult("backupPlan", "BackupPlan", (properties.BackupPlan != null ? CfnBackupPlanBackupPlanResourceTypePropertyFromCloudFormation(properties.BackupPlan) : undefined));
  ret.addPropertyResult("backupPlanTags", "BackupPlanTags", (properties.BackupPlanTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.BackupPlanTags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a set of resources to assign to a backup plan.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-cfn) .
 *
 * @cloudformationResource AWS::Backup::BackupSelection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html
 */
export class CfnBackupSelection extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Backup::BackupSelection";

  /**
   * Build a CfnBackupSelection from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBackupSelection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Uniquely identifies a backup plan.
   *
   * @cloudformationAttribute BackupPlanId
   */
  public readonly attrBackupPlanId: string;

  /**
   * Uniquely identifies the backup selection.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Uniquely identifies a request to assign a set of resources to a backup plan.
   *
   * @cloudformationAttribute SelectionId
   */
  public readonly attrSelectionId: string;

  /**
   * Uniquely identifies a backup plan.
   */
  public backupPlanId: string;

  /**
   * Specifies the body of a request to assign a set of resources to a backup plan.
   */
  public backupSelection: CfnBackupSelection.BackupSelectionResourceTypeProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBackupSelectionProps) {
    super(scope, id, {
      "type": CfnBackupSelection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "backupPlanId", this);
    cdk.requireProperty(props, "backupSelection", this);

    this.attrBackupPlanId = cdk.Token.asString(this.getAtt("BackupPlanId", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrSelectionId = cdk.Token.asString(this.getAtt("SelectionId", cdk.ResolutionTypeHint.STRING));
    this.backupPlanId = props.backupPlanId;
    this.backupSelection = props.backupSelection;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "backupPlanId": this.backupPlanId,
      "backupSelection": this.backupSelection
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBackupSelection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBackupSelectionPropsToCloudFormation(props);
  }
}

export namespace CfnBackupSelection {
  /**
   * Specifies an object containing properties used to assign a set of resources to a backup plan.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html
   */
  export interface BackupSelectionResourceTypeProperty {
    /**
     * A list of conditions that you define to assign resources to your backup plans using tags.
     *
     * For example, `"StringEquals": { "ConditionKey": "aws:ResourceTag/CreatedByCryo", "ConditionValue": "true" },` . Condition operators are case sensitive.
     *
     * `Conditions` differs from `ListOfTags` as follows:
     *
     * - When you specify more than one condition, you only assign the resources that match ALL conditions (using AND logic).
     * - `Conditions` supports `StringEquals` , `StringLike` , `StringNotEquals` , and `StringNotLike` . `ListOfTags` only supports `StringEquals` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-conditions
     */
    readonly conditions?: any | cdk.IResolvable;

    /**
     * The ARN of the IAM role that AWS Backup uses to authenticate when backing up the target resource;
     *
     * for example, `arn:aws:iam::123456789012:role/S3Access` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-iamrolearn
     */
    readonly iamRoleArn: string;

    /**
     * A list of conditions that you define to assign resources to your backup plans using tags.
     *
     * For example, `"StringEquals": { "ConditionKey": "aws:ResourceTag/CreatedByCryo", "ConditionValue": "true" },` . Condition operators are case sensitive.
     *
     * `ListOfTags` differs from `Conditions` as follows:
     *
     * - When you specify more than one condition, you assign all resources that match AT LEAST ONE condition (using OR logic).
     * - `ListOfTags` only supports `StringEquals` . `Conditions` supports `StringEquals` , `StringLike` , `StringNotEquals` , and `StringNotLike` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-listoftags
     */
    readonly listOfTags?: Array<CfnBackupSelection.ConditionResourceTypeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of Amazon Resource Names (ARNs) to exclude from a backup plan.
     *
     * The maximum number of ARNs is 500 without wildcards, or 30 ARNs with wildcards.
     *
     * If you need to exclude many resources from a backup plan, consider a different resource selection strategy, such as assigning only one or a few resource types or refining your resource selection using tags.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-notresources
     */
    readonly notResources?: Array<string>;

    /**
     * An array of strings that contain Amazon Resource Names (ARNs) of resources to assign to a backup plan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-resources
     */
    readonly resources?: Array<string>;

    /**
     * The display name of a resource selection document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-backupselectionresourcetype.html#cfn-backup-backupselection-backupselectionresourcetype-selectionname
     */
    readonly selectionName: string;
  }

  /**
   * Specifies an object that contains an array of triplets made up of a condition type (such as `STRINGEQUALS` ), a key, and a value.
   *
   * Conditions are used to filter resources in a selection that is assigned to a backup plan.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionresourcetype.html
   */
  export interface ConditionResourceTypeProperty {
    /**
     * The key in a key-value pair.
     *
     * For example, in `"Department": "accounting"` , `"Department"` is the key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionresourcetype.html#cfn-backup-backupselection-conditionresourcetype-conditionkey
     */
    readonly conditionKey: string;

    /**
     * An operation, such as `STRINGEQUALS` , that is applied to a key-value pair used to filter resources in a selection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionresourcetype.html#cfn-backup-backupselection-conditionresourcetype-conditiontype
     */
    readonly conditionType: string;

    /**
     * The value in a key-value pair.
     *
     * For example, in `"Department": "accounting"` , `"accounting"` is the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionresourcetype.html#cfn-backup-backupselection-conditionresourcetype-conditionvalue
     */
    readonly conditionValue: string;
  }

  /**
   * Includes information about tags you define to assign tagged resources to a backup plan.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionparameter.html
   */
  export interface ConditionParameterProperty {
    /**
     * The key in a key-value pair.
     *
     * For example, in the tag `Department: Accounting` , `Department` is the key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionparameter.html#cfn-backup-backupselection-conditionparameter-conditionkey
     */
    readonly conditionKey?: string;

    /**
     * The value in a key-value pair.
     *
     * For example, in the tag `Department: Accounting` , `Accounting` is the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionparameter.html#cfn-backup-backupselection-conditionparameter-conditionvalue
     */
    readonly conditionValue?: string;
  }

  /**
   * Contains information about which resources to include or exclude from a backup plan using their tags.
   *
   * Conditions are case sensitive.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html
   */
  export interface ConditionsProperty {
    /**
     * Filters the values of your tagged resources for only those resources that you tagged with the same value.
     *
     * Also called "exact matching."
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html#cfn-backup-backupselection-conditions-stringequals
     */
    readonly stringEquals?: Array<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Filters the values of your tagged resources for matching tag values with the use of a wildcard character (*) anywhere in the string.
     *
     * For example, "prod*" or "*rod*" matches the tag value "production".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html#cfn-backup-backupselection-conditions-stringlike
     */
    readonly stringLike?: Array<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Filters the values of your tagged resources for only those resources that you tagged that do not have the same value.
     *
     * Also called "negated matching."
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html#cfn-backup-backupselection-conditions-stringnotequals
     */
    readonly stringNotEquals?: Array<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Filters the values of your tagged resources for non-matching tag values with the use of a wildcard character (*) anywhere in the string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html#cfn-backup-backupselection-conditions-stringnotlike
     */
    readonly stringNotLike?: Array<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnBackupSelection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html
 */
export interface CfnBackupSelectionProps {
  /**
   * Uniquely identifies a backup plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html#cfn-backup-backupselection-backupplanid
   */
  readonly backupPlanId: string;

  /**
   * Specifies the body of a request to assign a set of resources to a backup plan.
   *
   * It includes an array of resources, an optional array of patterns to exclude resources, an optional role to provide access to the AWS service the resource belongs to, and an optional array of tags used to identify a set of resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html#cfn-backup-backupselection-backupselection
   */
  readonly backupSelection: CfnBackupSelection.BackupSelectionResourceTypeProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ConditionResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupSelectionConditionResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conditionKey", cdk.requiredValidator)(properties.conditionKey));
  errors.collect(cdk.propertyValidator("conditionKey", cdk.validateString)(properties.conditionKey));
  errors.collect(cdk.propertyValidator("conditionType", cdk.requiredValidator)(properties.conditionType));
  errors.collect(cdk.propertyValidator("conditionType", cdk.validateString)(properties.conditionType));
  errors.collect(cdk.propertyValidator("conditionValue", cdk.requiredValidator)(properties.conditionValue));
  errors.collect(cdk.propertyValidator("conditionValue", cdk.validateString)(properties.conditionValue));
  return errors.wrap("supplied properties not correct for \"ConditionResourceTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupSelectionConditionResourceTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupSelectionConditionResourceTypePropertyValidator(properties).assertSuccess();
  return {
    "ConditionKey": cdk.stringToCloudFormation(properties.conditionKey),
    "ConditionType": cdk.stringToCloudFormation(properties.conditionType),
    "ConditionValue": cdk.stringToCloudFormation(properties.conditionValue)
  };
}

// @ts-ignore TS6133
function CfnBackupSelectionConditionResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelection.ConditionResourceTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelection.ConditionResourceTypeProperty>();
  ret.addPropertyResult("conditionKey", "ConditionKey", (properties.ConditionKey != null ? cfn_parse.FromCloudFormation.getString(properties.ConditionKey) : undefined));
  ret.addPropertyResult("conditionType", "ConditionType", (properties.ConditionType != null ? cfn_parse.FromCloudFormation.getString(properties.ConditionType) : undefined));
  ret.addPropertyResult("conditionValue", "ConditionValue", (properties.ConditionValue != null ? cfn_parse.FromCloudFormation.getString(properties.ConditionValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BackupSelectionResourceTypeProperty`
 *
 * @param properties - the TypeScript properties of a `BackupSelectionResourceTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupSelectionBackupSelectionResourceTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conditions", cdk.validateObject)(properties.conditions));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.requiredValidator)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("listOfTags", cdk.listValidator(CfnBackupSelectionConditionResourceTypePropertyValidator))(properties.listOfTags));
  errors.collect(cdk.propertyValidator("notResources", cdk.listValidator(cdk.validateString))(properties.notResources));
  errors.collect(cdk.propertyValidator("resources", cdk.listValidator(cdk.validateString))(properties.resources));
  errors.collect(cdk.propertyValidator("selectionName", cdk.requiredValidator)(properties.selectionName));
  errors.collect(cdk.propertyValidator("selectionName", cdk.validateString)(properties.selectionName));
  return errors.wrap("supplied properties not correct for \"BackupSelectionResourceTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupSelectionBackupSelectionResourceTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupSelectionBackupSelectionResourceTypePropertyValidator(properties).assertSuccess();
  return {
    "Conditions": cdk.objectToCloudFormation(properties.conditions),
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "ListOfTags": cdk.listMapper(convertCfnBackupSelectionConditionResourceTypePropertyToCloudFormation)(properties.listOfTags),
    "NotResources": cdk.listMapper(cdk.stringToCloudFormation)(properties.notResources),
    "Resources": cdk.listMapper(cdk.stringToCloudFormation)(properties.resources),
    "SelectionName": cdk.stringToCloudFormation(properties.selectionName)
  };
}

// @ts-ignore TS6133
function CfnBackupSelectionBackupSelectionResourceTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelection.BackupSelectionResourceTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelection.BackupSelectionResourceTypeProperty>();
  ret.addPropertyResult("conditions", "Conditions", (properties.Conditions != null ? cfn_parse.FromCloudFormation.getAny(properties.Conditions) : undefined));
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("listOfTags", "ListOfTags", (properties.ListOfTags != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionResourceTypePropertyFromCloudFormation)(properties.ListOfTags) : undefined));
  ret.addPropertyResult("notResources", "NotResources", (properties.NotResources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotResources) : undefined));
  ret.addPropertyResult("resources", "Resources", (properties.Resources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Resources) : undefined));
  ret.addPropertyResult("selectionName", "SelectionName", (properties.SelectionName != null ? cfn_parse.FromCloudFormation.getString(properties.SelectionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBackupSelectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnBackupSelectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupSelectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backupPlanId", cdk.requiredValidator)(properties.backupPlanId));
  errors.collect(cdk.propertyValidator("backupPlanId", cdk.validateString)(properties.backupPlanId));
  errors.collect(cdk.propertyValidator("backupSelection", cdk.requiredValidator)(properties.backupSelection));
  errors.collect(cdk.propertyValidator("backupSelection", CfnBackupSelectionBackupSelectionResourceTypePropertyValidator)(properties.backupSelection));
  return errors.wrap("supplied properties not correct for \"CfnBackupSelectionProps\"");
}

// @ts-ignore TS6133
function convertCfnBackupSelectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupSelectionPropsValidator(properties).assertSuccess();
  return {
    "BackupPlanId": cdk.stringToCloudFormation(properties.backupPlanId),
    "BackupSelection": convertCfnBackupSelectionBackupSelectionResourceTypePropertyToCloudFormation(properties.backupSelection)
  };
}

// @ts-ignore TS6133
function CfnBackupSelectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelectionProps>();
  ret.addPropertyResult("backupPlanId", "BackupPlanId", (properties.BackupPlanId != null ? cfn_parse.FromCloudFormation.getString(properties.BackupPlanId) : undefined));
  ret.addPropertyResult("backupSelection", "BackupSelection", (properties.BackupSelection != null ? CfnBackupSelectionBackupSelectionResourceTypePropertyFromCloudFormation(properties.BackupSelection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupSelectionConditionParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conditionKey", cdk.validateString)(properties.conditionKey));
  errors.collect(cdk.propertyValidator("conditionValue", cdk.validateString)(properties.conditionValue));
  return errors.wrap("supplied properties not correct for \"ConditionParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupSelectionConditionParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupSelectionConditionParameterPropertyValidator(properties).assertSuccess();
  return {
    "ConditionKey": cdk.stringToCloudFormation(properties.conditionKey),
    "ConditionValue": cdk.stringToCloudFormation(properties.conditionValue)
  };
}

// @ts-ignore TS6133
function CfnBackupSelectionConditionParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelection.ConditionParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelection.ConditionParameterProperty>();
  ret.addPropertyResult("conditionKey", "ConditionKey", (properties.ConditionKey != null ? cfn_parse.FromCloudFormation.getString(properties.ConditionKey) : undefined));
  ret.addPropertyResult("conditionValue", "ConditionValue", (properties.ConditionValue != null ? cfn_parse.FromCloudFormation.getString(properties.ConditionValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionsProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupSelectionConditionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("stringEquals", cdk.listValidator(CfnBackupSelectionConditionParameterPropertyValidator))(properties.stringEquals));
  errors.collect(cdk.propertyValidator("stringLike", cdk.listValidator(CfnBackupSelectionConditionParameterPropertyValidator))(properties.stringLike));
  errors.collect(cdk.propertyValidator("stringNotEquals", cdk.listValidator(CfnBackupSelectionConditionParameterPropertyValidator))(properties.stringNotEquals));
  errors.collect(cdk.propertyValidator("stringNotLike", cdk.listValidator(CfnBackupSelectionConditionParameterPropertyValidator))(properties.stringNotLike));
  return errors.wrap("supplied properties not correct for \"ConditionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupSelectionConditionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupSelectionConditionsPropertyValidator(properties).assertSuccess();
  return {
    "StringEquals": cdk.listMapper(convertCfnBackupSelectionConditionParameterPropertyToCloudFormation)(properties.stringEquals),
    "StringLike": cdk.listMapper(convertCfnBackupSelectionConditionParameterPropertyToCloudFormation)(properties.stringLike),
    "StringNotEquals": cdk.listMapper(convertCfnBackupSelectionConditionParameterPropertyToCloudFormation)(properties.stringNotEquals),
    "StringNotLike": cdk.listMapper(convertCfnBackupSelectionConditionParameterPropertyToCloudFormation)(properties.stringNotLike)
  };
}

// @ts-ignore TS6133
function CfnBackupSelectionConditionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupSelection.ConditionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupSelection.ConditionsProperty>();
  ret.addPropertyResult("stringEquals", "StringEquals", (properties.StringEquals != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionParameterPropertyFromCloudFormation)(properties.StringEquals) : undefined));
  ret.addPropertyResult("stringLike", "StringLike", (properties.StringLike != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionParameterPropertyFromCloudFormation)(properties.StringLike) : undefined));
  ret.addPropertyResult("stringNotEquals", "StringNotEquals", (properties.StringNotEquals != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionParameterPropertyFromCloudFormation)(properties.StringNotEquals) : undefined));
  ret.addPropertyResult("stringNotLike", "StringNotLike", (properties.StringNotLike != null ? cfn_parse.FromCloudFormation.getArray(CfnBackupSelectionConditionParameterPropertyFromCloudFormation)(properties.StringNotLike) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a logical container where backups are stored.
 *
 * A `CreateBackupVault` request includes a name, optionally one or more resource tags, an encryption key, and a request ID.
 *
 * Do not include sensitive data, such as passport numbers, in the name of a backup vault.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-cfn) .
 *
 * @cloudformationResource AWS::Backup::BackupVault
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html
 */
export class CfnBackupVault extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Backup::BackupVault";

  /**
   * Build a CfnBackupVault from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBackupVault(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, `arn:aws:backup:us-east-1:123456789012:backup-vault:aBackupVault` .
   *
   * @cloudformationAttribute BackupVaultArn
   */
  public readonly attrBackupVaultArn: string;

  /**
   * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase and uppercase letters, numbers, and hyphens.
   *
   * @cloudformationAttribute BackupVaultName
   */
  public readonly attrBackupVaultName: string;

  /**
   * A resource-based policy that is used to manage access permissions on the target backup vault.
   */
  public accessPolicy?: any | cdk.IResolvable;

  /**
   * The name of a logical container where backups are stored.
   */
  public backupVaultName: string;

  /**
   * Metadata that you can assign to help organize the resources that you create.
   */
  public backupVaultTags?: cdk.IResolvable | Record<string, string>;

  /**
   * A server-side encryption key you can specify to encrypt your backups from services that support full AWS Backup management;
   */
  public encryptionKeyArn?: string;

  /**
   * Configuration for [AWS Backup Vault Lock](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html) .
   */
  public lockConfiguration?: cdk.IResolvable | CfnBackupVault.LockConfigurationTypeProperty;

  /**
   * The SNS event notifications for the specified backup vault.
   */
  public notifications?: cdk.IResolvable | CfnBackupVault.NotificationObjectTypeProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBackupVaultProps) {
    super(scope, id, {
      "type": CfnBackupVault.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "backupVaultName", this);

    this.attrBackupVaultArn = cdk.Token.asString(this.getAtt("BackupVaultArn", cdk.ResolutionTypeHint.STRING));
    this.attrBackupVaultName = cdk.Token.asString(this.getAtt("BackupVaultName", cdk.ResolutionTypeHint.STRING));
    this.accessPolicy = props.accessPolicy;
    this.backupVaultName = props.backupVaultName;
    this.backupVaultTags = props.backupVaultTags;
    this.encryptionKeyArn = props.encryptionKeyArn;
    this.lockConfiguration = props.lockConfiguration;
    this.notifications = props.notifications;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::Backup::BackupVault' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessPolicy": this.accessPolicy,
      "backupVaultName": this.backupVaultName,
      "backupVaultTags": this.backupVaultTags,
      "encryptionKeyArn": this.encryptionKeyArn,
      "lockConfiguration": this.lockConfiguration,
      "notifications": this.notifications
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBackupVault.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBackupVaultPropsToCloudFormation(props);
  }
}

export namespace CfnBackupVault {
  /**
   * The `LockConfigurationType` property type specifies configuration for [AWS Backup Vault Lock](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-lockconfigurationtype.html
   */
  export interface LockConfigurationTypeProperty {
    /**
     * The AWS Backup Vault Lock configuration that specifies the number of days before the lock date.
     *
     * For example, setting `ChangeableForDays` to 30 on Jan. 1, 2022 at 8pm UTC will set the lock date to Jan. 31, 2022 at 8pm UTC.
     *
     * AWS Backup enforces a 72-hour cooling-off period before Vault Lock takes effect and becomes immutable. Therefore, you must set `ChangeableForDays` to 3 or greater.
     *
     * Before the lock date, you can delete Vault Lock from the vault using `DeleteBackupVaultLockConfiguration` or change the Vault Lock configuration using `PutBackupVaultLockConfiguration` . On and after the lock date, the Vault Lock becomes immutable and cannot be changed or deleted.
     *
     * If this parameter is not specified, you can delete Vault Lock from the vault using `DeleteBackupVaultLockConfiguration` or change the Vault Lock configuration using `PutBackupVaultLockConfiguration` at any time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-lockconfigurationtype.html#cfn-backup-backupvault-lockconfigurationtype-changeablefordays
     */
    readonly changeableForDays?: number;

    /**
     * The AWS Backup Vault Lock configuration that specifies the maximum retention period that the vault retains its recovery points.
     *
     * This setting can be useful if, for example, your organization's policies require you to destroy certain data after retaining it for four years (1460 days).
     *
     * If this parameter is not included, Vault Lock does not enforce a maximum retention period on the recovery points in the vault. If this parameter is included without a value, Vault Lock will not enforce a maximum retention period.
     *
     * If this parameter is specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or shorter than the maximum retention period. If the job's retention period is longer than that maximum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault. Recovery points already saved in the vault prior to Vault Lock are not affected.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-lockconfigurationtype.html#cfn-backup-backupvault-lockconfigurationtype-maxretentiondays
     */
    readonly maxRetentionDays?: number;

    /**
     * The AWS Backup Vault Lock configuration that specifies the minimum retention period that the vault retains its recovery points.
     *
     * This setting can be useful if, for example, your organization's policies require you to retain certain data for at least seven years (2555 days).
     *
     * If this parameter is not specified, Vault Lock will not enforce a minimum retention period.
     *
     * If this parameter is specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or longer than the minimum retention period. If the job's retention period is shorter than that minimum retention period, then the vault fails that backup or copy job, and you should either modify your lifecycle settings or use a different vault. Recovery points already saved in the vault prior to Vault Lock are not affected.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-lockconfigurationtype.html#cfn-backup-backupvault-lockconfigurationtype-minretentiondays
     */
    readonly minRetentionDays: number;
  }

  /**
   * Specifies an object containing SNS event notification properties for the target backup vault.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-notificationobjecttype.html
   */
  export interface NotificationObjectTypeProperty {
    /**
     * An array of events that indicate the status of jobs to back up resources to the backup vault.
     *
     * For valid events, see [BackupVaultEvents](https://docs.aws.amazon.com/aws-backup/latest/devguide/API_PutBackupVaultNotifications.html#API_PutBackupVaultNotifications_RequestSyntax) in the *AWS Backup API Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-notificationobjecttype.html#cfn-backup-backupvault-notificationobjecttype-backupvaultevents
     */
    readonly backupVaultEvents: Array<string>;

    /**
     * An ARN that uniquely identifies an Amazon Simple Notification Service (Amazon SNS) topic;
     *
     * for example, `arn:aws:sns:us-west-2:111122223333:MyTopic` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupvault-notificationobjecttype.html#cfn-backup-backupvault-notificationobjecttype-snstopicarn
     */
    readonly snsTopicArn: string;
  }
}

/**
 * Properties for defining a `CfnBackupVault`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html
 */
export interface CfnBackupVaultProps {
  /**
   * A resource-based policy that is used to manage access permissions on the target backup vault.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-accesspolicy
   */
  readonly accessPolicy?: any | cdk.IResolvable;

  /**
   * The name of a logical container where backups are stored.
   *
   * Backup vaults are identified by names that are unique to the account used to create them and the AWS Region where they are created. They consist of lowercase letters, numbers, and hyphens.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-backupvaultname
   */
  readonly backupVaultName: string;

  /**
   * Metadata that you can assign to help organize the resources that you create.
   *
   * Each tag is a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-backupvaulttags
   */
  readonly backupVaultTags?: cdk.IResolvable | Record<string, string>;

  /**
   * A server-side encryption key you can specify to encrypt your backups from services that support full AWS Backup management;
   *
   * for example, `arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab` . If you specify a key, you must specify its ARN, not its alias. If you do not specify a key, AWS Backup creates a KMS key for you by default.
   *
   * To learn which AWS Backup services support full AWS Backup management and how AWS Backup handles encryption for backups from services that do not yet support full AWS Backup , see [Encryption for backups in AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/encryption.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-encryptionkeyarn
   */
  readonly encryptionKeyArn?: string;

  /**
   * Configuration for [AWS Backup Vault Lock](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-lockconfiguration
   */
  readonly lockConfiguration?: cdk.IResolvable | CfnBackupVault.LockConfigurationTypeProperty;

  /**
   * The SNS event notifications for the specified backup vault.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupvault.html#cfn-backup-backupvault-notifications
   */
  readonly notifications?: cdk.IResolvable | CfnBackupVault.NotificationObjectTypeProperty;
}

/**
 * Determine whether the given properties match those of a `LockConfigurationTypeProperty`
 *
 * @param properties - the TypeScript properties of a `LockConfigurationTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupVaultLockConfigurationTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("changeableForDays", cdk.validateNumber)(properties.changeableForDays));
  errors.collect(cdk.propertyValidator("maxRetentionDays", cdk.validateNumber)(properties.maxRetentionDays));
  errors.collect(cdk.propertyValidator("minRetentionDays", cdk.requiredValidator)(properties.minRetentionDays));
  errors.collect(cdk.propertyValidator("minRetentionDays", cdk.validateNumber)(properties.minRetentionDays));
  return errors.wrap("supplied properties not correct for \"LockConfigurationTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupVaultLockConfigurationTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupVaultLockConfigurationTypePropertyValidator(properties).assertSuccess();
  return {
    "ChangeableForDays": cdk.numberToCloudFormation(properties.changeableForDays),
    "MaxRetentionDays": cdk.numberToCloudFormation(properties.maxRetentionDays),
    "MinRetentionDays": cdk.numberToCloudFormation(properties.minRetentionDays)
  };
}

// @ts-ignore TS6133
function CfnBackupVaultLockConfigurationTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBackupVault.LockConfigurationTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupVault.LockConfigurationTypeProperty>();
  ret.addPropertyResult("changeableForDays", "ChangeableForDays", (properties.ChangeableForDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ChangeableForDays) : undefined));
  ret.addPropertyResult("maxRetentionDays", "MaxRetentionDays", (properties.MaxRetentionDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetentionDays) : undefined));
  ret.addPropertyResult("minRetentionDays", "MinRetentionDays", (properties.MinRetentionDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinRetentionDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationObjectTypeProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationObjectTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupVaultNotificationObjectTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("backupVaultEvents", cdk.requiredValidator)(properties.backupVaultEvents));
  errors.collect(cdk.propertyValidator("backupVaultEvents", cdk.listValidator(cdk.validateString))(properties.backupVaultEvents));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.requiredValidator)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  return errors.wrap("supplied properties not correct for \"NotificationObjectTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBackupVaultNotificationObjectTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupVaultNotificationObjectTypePropertyValidator(properties).assertSuccess();
  return {
    "BackupVaultEvents": cdk.listMapper(cdk.stringToCloudFormation)(properties.backupVaultEvents),
    "SNSTopicArn": cdk.stringToCloudFormation(properties.snsTopicArn)
  };
}

// @ts-ignore TS6133
function CfnBackupVaultNotificationObjectTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBackupVault.NotificationObjectTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupVault.NotificationObjectTypeProperty>();
  ret.addPropertyResult("backupVaultEvents", "BackupVaultEvents", (properties.BackupVaultEvents != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.BackupVaultEvents) : undefined));
  ret.addPropertyResult("snsTopicArn", "SNSTopicArn", (properties.SNSTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SNSTopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBackupVaultProps`
 *
 * @param properties - the TypeScript properties of a `CfnBackupVaultProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBackupVaultPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPolicy", cdk.validateObject)(properties.accessPolicy));
  errors.collect(cdk.propertyValidator("backupVaultName", cdk.requiredValidator)(properties.backupVaultName));
  errors.collect(cdk.propertyValidator("backupVaultName", cdk.validateString)(properties.backupVaultName));
  errors.collect(cdk.propertyValidator("backupVaultTags", cdk.hashValidator(cdk.validateString))(properties.backupVaultTags));
  errors.collect(cdk.propertyValidator("encryptionKeyArn", cdk.validateString)(properties.encryptionKeyArn));
  errors.collect(cdk.propertyValidator("lockConfiguration", CfnBackupVaultLockConfigurationTypePropertyValidator)(properties.lockConfiguration));
  errors.collect(cdk.propertyValidator("notifications", CfnBackupVaultNotificationObjectTypePropertyValidator)(properties.notifications));
  return errors.wrap("supplied properties not correct for \"CfnBackupVaultProps\"");
}

// @ts-ignore TS6133
function convertCfnBackupVaultPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBackupVaultPropsValidator(properties).assertSuccess();
  return {
    "AccessPolicy": cdk.objectToCloudFormation(properties.accessPolicy),
    "BackupVaultName": cdk.stringToCloudFormation(properties.backupVaultName),
    "BackupVaultTags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.backupVaultTags),
    "EncryptionKeyArn": cdk.stringToCloudFormation(properties.encryptionKeyArn),
    "LockConfiguration": convertCfnBackupVaultLockConfigurationTypePropertyToCloudFormation(properties.lockConfiguration),
    "Notifications": convertCfnBackupVaultNotificationObjectTypePropertyToCloudFormation(properties.notifications)
  };
}

// @ts-ignore TS6133
function CfnBackupVaultPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBackupVaultProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBackupVaultProps>();
  ret.addPropertyResult("accessPolicy", "AccessPolicy", (properties.AccessPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.AccessPolicy) : undefined));
  ret.addPropertyResult("backupVaultName", "BackupVaultName", (properties.BackupVaultName != null ? cfn_parse.FromCloudFormation.getString(properties.BackupVaultName) : undefined));
  ret.addPropertyResult("backupVaultTags", "BackupVaultTags", (properties.BackupVaultTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.BackupVaultTags) : undefined));
  ret.addPropertyResult("encryptionKeyArn", "EncryptionKeyArn", (properties.EncryptionKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKeyArn) : undefined));
  ret.addPropertyResult("lockConfiguration", "LockConfiguration", (properties.LockConfiguration != null ? CfnBackupVaultLockConfigurationTypePropertyFromCloudFormation(properties.LockConfiguration) : undefined));
  ret.addPropertyResult("notifications", "Notifications", (properties.Notifications != null ? CfnBackupVaultNotificationObjectTypePropertyFromCloudFormation(properties.Notifications) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a framework with one or more controls.
 *
 * A framework is a collection of controls that you can use to evaluate your backup practices. By using pre-built customizable controls to define your policies, you can evaluate whether your backup practices comply with your policies and which resources are not yet in compliance.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/bam-cfn-integration.html#bam-cfn-frameworks-template) .
 *
 * @cloudformationResource AWS::Backup::Framework
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html
 */
export class CfnFramework extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Backup::Framework";

  /**
   * Build a CfnFramework from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFramework(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The UTC time when you created your framework.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * Depolyment status refers to whether your framework has completed deployment. This status is usually `Completed` , but might also be `Create in progress` or another status. For a list of statuses, see [Framework compliance status](https://docs.aws.amazon.com/aws-backup/latest/devguide/viewing-frameworks.html) in the *Developer Guide* .
   *
   * @cloudformationAttribute DeploymentStatus
   */
  public readonly attrDeploymentStatus: string;

  /**
   * The Amazon Resource Name (ARN) of your framework.
   *
   * @cloudformationAttribute FrameworkArn
   */
  public readonly attrFrameworkArn: string;

  /**
   * Framework status refers to whether you have turned on resource tracking for all of your resources. This status is `Active` when you turn on all resources the framework evaluates. For other statuses and steps to correct them, see [Framework compliance status](https://docs.aws.amazon.com/aws-backup/latest/devguide/viewing-frameworks.html) in the *Developer Guide* .
   *
   * @cloudformationAttribute FrameworkStatus
   */
  public readonly attrFrameworkStatus: string;

  /**
   * Contains detailed information about all of the controls of a framework.
   */
  public frameworkControls: Array<CfnFramework.FrameworkControlProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * An optional description of the framework with a maximum 1,024 characters.
   */
  public frameworkDescription?: string;

  /**
   * The unique name of a framework.
   */
  public frameworkName?: string;

  /**
   * A list of tags with which to tag your framework.
   */
  public frameworkTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFrameworkProps) {
    super(scope, id, {
      "type": CfnFramework.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "frameworkControls", this);

    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrDeploymentStatus = cdk.Token.asString(this.getAtt("DeploymentStatus", cdk.ResolutionTypeHint.STRING));
    this.attrFrameworkArn = cdk.Token.asString(this.getAtt("FrameworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrFrameworkStatus = cdk.Token.asString(this.getAtt("FrameworkStatus", cdk.ResolutionTypeHint.STRING));
    this.frameworkControls = props.frameworkControls;
    this.frameworkDescription = props.frameworkDescription;
    this.frameworkName = props.frameworkName;
    this.frameworkTags = props.frameworkTags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "frameworkControls": this.frameworkControls,
      "frameworkDescription": this.frameworkDescription,
      "frameworkName": this.frameworkName,
      "frameworkTags": this.frameworkTags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFramework.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFrameworkPropsToCloudFormation(props);
  }
}

export namespace CfnFramework {
  /**
   * Contains detailed information about all of the controls of a framework.
   *
   * Each framework must contain at least one control.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-frameworkcontrol.html
   */
  export interface FrameworkControlProperty {
    /**
     * A list of `ParameterName` and `ParameterValue` pairs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-frameworkcontrol.html#cfn-backup-framework-frameworkcontrol-controlinputparameters
     */
    readonly controlInputParameters?: Array<CfnFramework.ControlInputParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of a control.
     *
     * This name is between 1 and 256 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-frameworkcontrol.html#cfn-backup-framework-frameworkcontrol-controlname
     */
    readonly controlName: string;

    /**
     * The scope of a control.
     *
     * The control scope defines what the control will evaluate. Three examples of control scopes are: a specific backup plan, all backup plans with a specific tag, or all backup plans.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-frameworkcontrol.html#cfn-backup-framework-frameworkcontrol-controlscope
     */
    readonly controlScope?: any | cdk.IResolvable;
  }

  /**
   * A list of parameters for a control.
   *
   * A control can have zero, one, or more than one parameter. An example of a control with two parameters is: "backup plan frequency is at least `daily` and the retention period is at least `1 year` ". The first parameter is `daily` . The second parameter is `1 year` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlinputparameter.html
   */
  export interface ControlInputParameterProperty {
    /**
     * The name of a parameter, for example, `BackupPlanFrequency` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlinputparameter.html#cfn-backup-framework-controlinputparameter-parametername
     */
    readonly parameterName: string;

    /**
     * The value of parameter, for example, `hourly` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlinputparameter.html#cfn-backup-framework-controlinputparameter-parametervalue
     */
    readonly parameterValue: string;
  }

  /**
   * A framework consists of one or more controls.
   *
   * Each control has its own control scope. The control scope can include one or more resource types, a combination of a tag key and value, or a combination of one resource type and one resource ID. If no scope is specified, evaluations for the rule are triggered when any resource in your recording group changes in configuration.
   *
   * > To set a control scope that includes all of a particular resource, leave the `ControlScope` empty or do not pass it when calling `CreateFramework` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlscope.html
   */
  export interface ControlScopeProperty {
    /**
     * The ID of the only AWS resource that you want your control scope to contain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlscope.html#cfn-backup-framework-controlscope-complianceresourceids
     */
    readonly complianceResourceIds?: Array<string>;

    /**
     * Describes whether the control scope includes one or more types of resources, such as `EFS` or `RDS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlscope.html#cfn-backup-framework-controlscope-complianceresourcetypes
     */
    readonly complianceResourceTypes?: Array<string>;

    /**
     * The tag key-value pair applied to those AWS resources that you want to trigger an evaluation for a rule.
     *
     * A maximum of one key-value pair can be provided. The tag value is optional, but it cannot be an empty string. The structure to assign a tag is: `[{"Key":"string","Value":"string"}]` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-framework-controlscope.html#cfn-backup-framework-controlscope-tags
     */
    readonly tags?: Array<cdk.CfnTag>;
  }
}

/**
 * Properties for defining a `CfnFramework`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html
 */
export interface CfnFrameworkProps {
  /**
   * Contains detailed information about all of the controls of a framework.
   *
   * Each framework must contain at least one control.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkcontrols
   */
  readonly frameworkControls: Array<CfnFramework.FrameworkControlProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * An optional description of the framework with a maximum 1,024 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkdescription
   */
  readonly frameworkDescription?: string;

  /**
   * The unique name of a framework.
   *
   * This name is between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworkname
   */
  readonly frameworkName?: string;

  /**
   * A list of tags with which to tag your framework.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-framework.html#cfn-backup-framework-frameworktags
   */
  readonly frameworkTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ControlInputParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ControlInputParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFrameworkControlInputParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameterName", cdk.requiredValidator)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterName", cdk.validateString)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.requiredValidator)(properties.parameterValue));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.validateString)(properties.parameterValue));
  return errors.wrap("supplied properties not correct for \"ControlInputParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFrameworkControlInputParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFrameworkControlInputParameterPropertyValidator(properties).assertSuccess();
  return {
    "ParameterName": cdk.stringToCloudFormation(properties.parameterName),
    "ParameterValue": cdk.stringToCloudFormation(properties.parameterValue)
  };
}

// @ts-ignore TS6133
function CfnFrameworkControlInputParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFramework.ControlInputParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFramework.ControlInputParameterProperty>();
  ret.addPropertyResult("parameterName", "ParameterName", (properties.ParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterName) : undefined));
  ret.addPropertyResult("parameterValue", "ParameterValue", (properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FrameworkControlProperty`
 *
 * @param properties - the TypeScript properties of a `FrameworkControlProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFrameworkFrameworkControlPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("controlInputParameters", cdk.listValidator(CfnFrameworkControlInputParameterPropertyValidator))(properties.controlInputParameters));
  errors.collect(cdk.propertyValidator("controlName", cdk.requiredValidator)(properties.controlName));
  errors.collect(cdk.propertyValidator("controlName", cdk.validateString)(properties.controlName));
  errors.collect(cdk.propertyValidator("controlScope", cdk.validateObject)(properties.controlScope));
  return errors.wrap("supplied properties not correct for \"FrameworkControlProperty\"");
}

// @ts-ignore TS6133
function convertCfnFrameworkFrameworkControlPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFrameworkFrameworkControlPropertyValidator(properties).assertSuccess();
  return {
    "ControlInputParameters": cdk.listMapper(convertCfnFrameworkControlInputParameterPropertyToCloudFormation)(properties.controlInputParameters),
    "ControlName": cdk.stringToCloudFormation(properties.controlName),
    "ControlScope": cdk.objectToCloudFormation(properties.controlScope)
  };
}

// @ts-ignore TS6133
function CfnFrameworkFrameworkControlPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFramework.FrameworkControlProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFramework.FrameworkControlProperty>();
  ret.addPropertyResult("controlInputParameters", "ControlInputParameters", (properties.ControlInputParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnFrameworkControlInputParameterPropertyFromCloudFormation)(properties.ControlInputParameters) : undefined));
  ret.addPropertyResult("controlName", "ControlName", (properties.ControlName != null ? cfn_parse.FromCloudFormation.getString(properties.ControlName) : undefined));
  ret.addPropertyResult("controlScope", "ControlScope", (properties.ControlScope != null ? cfn_parse.FromCloudFormation.getAny(properties.ControlScope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFrameworkProps`
 *
 * @param properties - the TypeScript properties of a `CfnFrameworkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFrameworkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("frameworkControls", cdk.requiredValidator)(properties.frameworkControls));
  errors.collect(cdk.propertyValidator("frameworkControls", cdk.listValidator(CfnFrameworkFrameworkControlPropertyValidator))(properties.frameworkControls));
  errors.collect(cdk.propertyValidator("frameworkDescription", cdk.validateString)(properties.frameworkDescription));
  errors.collect(cdk.propertyValidator("frameworkName", cdk.validateString)(properties.frameworkName));
  errors.collect(cdk.propertyValidator("frameworkTags", cdk.listValidator(cdk.validateCfnTag))(properties.frameworkTags));
  return errors.wrap("supplied properties not correct for \"CfnFrameworkProps\"");
}

// @ts-ignore TS6133
function convertCfnFrameworkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFrameworkPropsValidator(properties).assertSuccess();
  return {
    "FrameworkControls": cdk.listMapper(convertCfnFrameworkFrameworkControlPropertyToCloudFormation)(properties.frameworkControls),
    "FrameworkDescription": cdk.stringToCloudFormation(properties.frameworkDescription),
    "FrameworkName": cdk.stringToCloudFormation(properties.frameworkName),
    "FrameworkTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.frameworkTags)
  };
}

// @ts-ignore TS6133
function CfnFrameworkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFrameworkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFrameworkProps>();
  ret.addPropertyResult("frameworkControls", "FrameworkControls", (properties.FrameworkControls != null ? cfn_parse.FromCloudFormation.getArray(CfnFrameworkFrameworkControlPropertyFromCloudFormation)(properties.FrameworkControls) : undefined));
  ret.addPropertyResult("frameworkDescription", "FrameworkDescription", (properties.FrameworkDescription != null ? cfn_parse.FromCloudFormation.getString(properties.FrameworkDescription) : undefined));
  ret.addPropertyResult("frameworkName", "FrameworkName", (properties.FrameworkName != null ? cfn_parse.FromCloudFormation.getString(properties.FrameworkName) : undefined));
  ret.addPropertyResult("frameworkTags", "FrameworkTags", (properties.FrameworkTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.FrameworkTags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ControlScopeProperty`
 *
 * @param properties - the TypeScript properties of a `ControlScopeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFrameworkControlScopePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("complianceResourceIds", cdk.listValidator(cdk.validateString))(properties.complianceResourceIds));
  errors.collect(cdk.propertyValidator("complianceResourceTypes", cdk.listValidator(cdk.validateString))(properties.complianceResourceTypes));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"ControlScopeProperty\"");
}

// @ts-ignore TS6133
function convertCfnFrameworkControlScopePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFrameworkControlScopePropertyValidator(properties).assertSuccess();
  return {
    "ComplianceResourceIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.complianceResourceIds),
    "ComplianceResourceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.complianceResourceTypes),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFrameworkControlScopePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFramework.ControlScopeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFramework.ControlScopeProperty>();
  ret.addPropertyResult("complianceResourceIds", "ComplianceResourceIds", (properties.ComplianceResourceIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ComplianceResourceIds) : undefined));
  ret.addPropertyResult("complianceResourceTypes", "ComplianceResourceTypes", (properties.ComplianceResourceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ComplianceResourceTypes) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a report plan.
 *
 * A report plan is a document that contains information about the contents of the report and where AWS Backup will deliver it.
 *
 * If you call `CreateReportPlan` with a plan that already exists, you receive an `AlreadyExistsException` exception.
 *
 * For a sample AWS CloudFormation template, see the [AWS Backup Developer Guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-cfn) .
 *
 * @cloudformationResource AWS::Backup::ReportPlan
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html
 */
export class CfnReportPlan extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Backup::ReportPlan";

  /**
   * Build a CfnReportPlan from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReportPlan(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of your report plan.
   *
   * @cloudformationAttribute ReportPlanArn
   */
  public readonly attrReportPlanArn: string;

  /**
   * Contains information about where and how to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
   */
  public reportDeliveryChannel: any | cdk.IResolvable;

  /**
   * An optional description of the report plan with a maximum 1,024 characters.
   */
  public reportPlanDescription?: string;

  /**
   * The unique name of the report plan.
   */
  public reportPlanName?: string;

  /**
   * A list of tags to tag your report plan.
   */
  public reportPlanTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Identifies the report template for the report. Reports are built using a report template. The report templates are:.
   */
  public reportSetting: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReportPlanProps) {
    super(scope, id, {
      "type": CfnReportPlan.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "reportDeliveryChannel", this);
    cdk.requireProperty(props, "reportSetting", this);

    this.attrReportPlanArn = cdk.Token.asString(this.getAtt("ReportPlanArn", cdk.ResolutionTypeHint.STRING));
    this.reportDeliveryChannel = props.reportDeliveryChannel;
    this.reportPlanDescription = props.reportPlanDescription;
    this.reportPlanName = props.reportPlanName;
    this.reportPlanTags = props.reportPlanTags;
    this.reportSetting = props.reportSetting;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "reportDeliveryChannel": this.reportDeliveryChannel,
      "reportPlanDescription": this.reportPlanDescription,
      "reportPlanName": this.reportPlanName,
      "reportPlanTags": this.reportPlanTags,
      "reportSetting": this.reportSetting
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReportPlan.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReportPlanPropsToCloudFormation(props);
  }
}

export namespace CfnReportPlan {
  /**
   * Contains detailed information about a report setting.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html
   */
  export interface ReportSettingProperty {
    /**
     * These are the accounts to be included in the report.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-accounts
     */
    readonly accounts?: Array<string>;

    /**
     * The Amazon Resource Names (ARNs) of the frameworks a report covers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-frameworkarns
     */
    readonly frameworkArns?: Array<string>;

    /**
     * These are the Organizational Units to be included in the report.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-organizationunits
     */
    readonly organizationUnits?: Array<string>;

    /**
     * These are the Regions to be included in the report.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-regions
     */
    readonly regions?: Array<string>;

    /**
     * Identifies the report template for the report. Reports are built using a report template. The report templates are:.
     *
     * `RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportsetting.html#cfn-backup-reportplan-reportsetting-reporttemplate
     */
    readonly reportTemplate: string;
  }

  /**
   * Contains information from your report plan about where to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportdeliverychannel.html
   */
  export interface ReportDeliveryChannelProperty {
    /**
     * A list of the format of your reports: `CSV` , `JSON` , or both.
     *
     * If not specified, the default format is `CSV` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportdeliverychannel.html#cfn-backup-reportplan-reportdeliverychannel-formats
     */
    readonly formats?: Array<string>;

    /**
     * The unique name of the S3 bucket that receives your reports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportdeliverychannel.html#cfn-backup-reportplan-reportdeliverychannel-s3bucketname
     */
    readonly s3BucketName: string;

    /**
     * The prefix for where AWS Backup Audit Manager delivers your reports to Amazon S3.
     *
     * The prefix is this part of the following path: s3://your-bucket-name/ `prefix` /Backup/us-west-2/year/month/day/report-name. If not specified, there is no prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-reportplan-reportdeliverychannel.html#cfn-backup-reportplan-reportdeliverychannel-s3keyprefix
     */
    readonly s3KeyPrefix?: string;
  }
}

/**
 * Properties for defining a `CfnReportPlan`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html
 */
export interface CfnReportPlanProps {
  /**
   * Contains information about where and how to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportdeliverychannel
   */
  readonly reportDeliveryChannel: any | cdk.IResolvable;

  /**
   * An optional description of the report plan with a maximum 1,024 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplandescription
   */
  readonly reportPlanDescription?: string;

  /**
   * The unique name of the report plan.
   *
   * This name is between 1 and 256 characters starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplanname
   */
  readonly reportPlanName?: string;

  /**
   * A list of tags to tag your report plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportplantags
   */
  readonly reportPlanTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Identifies the report template for the report. Reports are built using a report template. The report templates are:.
   *
   * `RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT`
   *
   * If the report template is `RESOURCE_COMPLIANCE_REPORT` or `CONTROL_COMPLIANCE_REPORT` , this API resource also describes the report coverage by AWS Regions and frameworks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-reportplan.html#cfn-backup-reportplan-reportsetting
   */
  readonly reportSetting: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ReportSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ReportSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReportPlanReportSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accounts", cdk.listValidator(cdk.validateString))(properties.accounts));
  errors.collect(cdk.propertyValidator("frameworkArns", cdk.listValidator(cdk.validateString))(properties.frameworkArns));
  errors.collect(cdk.propertyValidator("organizationUnits", cdk.listValidator(cdk.validateString))(properties.organizationUnits));
  errors.collect(cdk.propertyValidator("regions", cdk.listValidator(cdk.validateString))(properties.regions));
  errors.collect(cdk.propertyValidator("reportTemplate", cdk.requiredValidator)(properties.reportTemplate));
  errors.collect(cdk.propertyValidator("reportTemplate", cdk.validateString)(properties.reportTemplate));
  return errors.wrap("supplied properties not correct for \"ReportSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnReportPlanReportSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReportPlanReportSettingPropertyValidator(properties).assertSuccess();
  return {
    "Accounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.accounts),
    "FrameworkArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.frameworkArns),
    "OrganizationUnits": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationUnits),
    "Regions": cdk.listMapper(cdk.stringToCloudFormation)(properties.regions),
    "ReportTemplate": cdk.stringToCloudFormation(properties.reportTemplate)
  };
}

// @ts-ignore TS6133
function CfnReportPlanReportSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReportPlan.ReportSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReportPlan.ReportSettingProperty>();
  ret.addPropertyResult("accounts", "Accounts", (properties.Accounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Accounts) : undefined));
  ret.addPropertyResult("frameworkArns", "FrameworkArns", (properties.FrameworkArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.FrameworkArns) : undefined));
  ret.addPropertyResult("organizationUnits", "OrganizationUnits", (properties.OrganizationUnits != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationUnits) : undefined));
  ret.addPropertyResult("regions", "Regions", (properties.Regions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Regions) : undefined));
  ret.addPropertyResult("reportTemplate", "ReportTemplate", (properties.ReportTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.ReportTemplate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReportDeliveryChannelProperty`
 *
 * @param properties - the TypeScript properties of a `ReportDeliveryChannelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReportPlanReportDeliveryChannelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("formats", cdk.listValidator(cdk.validateString))(properties.formats));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.requiredValidator)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.validateString)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3KeyPrefix", cdk.validateString)(properties.s3KeyPrefix));
  return errors.wrap("supplied properties not correct for \"ReportDeliveryChannelProperty\"");
}

// @ts-ignore TS6133
function convertCfnReportPlanReportDeliveryChannelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReportPlanReportDeliveryChannelPropertyValidator(properties).assertSuccess();
  return {
    "Formats": cdk.listMapper(cdk.stringToCloudFormation)(properties.formats),
    "S3BucketName": cdk.stringToCloudFormation(properties.s3BucketName),
    "S3KeyPrefix": cdk.stringToCloudFormation(properties.s3KeyPrefix)
  };
}

// @ts-ignore TS6133
function CfnReportPlanReportDeliveryChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReportPlan.ReportDeliveryChannelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReportPlan.ReportDeliveryChannelProperty>();
  ret.addPropertyResult("formats", "Formats", (properties.Formats != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Formats) : undefined));
  ret.addPropertyResult("s3BucketName", "S3BucketName", (properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined));
  ret.addPropertyResult("s3KeyPrefix", "S3KeyPrefix", (properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnReportPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnReportPlanProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReportPlanPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reportDeliveryChannel", cdk.requiredValidator)(properties.reportDeliveryChannel));
  errors.collect(cdk.propertyValidator("reportDeliveryChannel", cdk.validateObject)(properties.reportDeliveryChannel));
  errors.collect(cdk.propertyValidator("reportPlanDescription", cdk.validateString)(properties.reportPlanDescription));
  errors.collect(cdk.propertyValidator("reportPlanName", cdk.validateString)(properties.reportPlanName));
  errors.collect(cdk.propertyValidator("reportPlanTags", cdk.listValidator(cdk.validateCfnTag))(properties.reportPlanTags));
  errors.collect(cdk.propertyValidator("reportSetting", cdk.requiredValidator)(properties.reportSetting));
  errors.collect(cdk.propertyValidator("reportSetting", cdk.validateObject)(properties.reportSetting));
  return errors.wrap("supplied properties not correct for \"CfnReportPlanProps\"");
}

// @ts-ignore TS6133
function convertCfnReportPlanPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReportPlanPropsValidator(properties).assertSuccess();
  return {
    "ReportDeliveryChannel": cdk.objectToCloudFormation(properties.reportDeliveryChannel),
    "ReportPlanDescription": cdk.stringToCloudFormation(properties.reportPlanDescription),
    "ReportPlanName": cdk.stringToCloudFormation(properties.reportPlanName),
    "ReportPlanTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.reportPlanTags),
    "ReportSetting": cdk.objectToCloudFormation(properties.reportSetting)
  };
}

// @ts-ignore TS6133
function CfnReportPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReportPlanProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReportPlanProps>();
  ret.addPropertyResult("reportDeliveryChannel", "ReportDeliveryChannel", (properties.ReportDeliveryChannel != null ? cfn_parse.FromCloudFormation.getAny(properties.ReportDeliveryChannel) : undefined));
  ret.addPropertyResult("reportPlanDescription", "ReportPlanDescription", (properties.ReportPlanDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ReportPlanDescription) : undefined));
  ret.addPropertyResult("reportPlanName", "ReportPlanName", (properties.ReportPlanName != null ? cfn_parse.FromCloudFormation.getString(properties.ReportPlanName) : undefined));
  ret.addPropertyResult("reportPlanTags", "ReportPlanTags", (properties.ReportPlanTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.ReportPlanTags) : undefined));
  ret.addPropertyResult("reportSetting", "ReportSetting", (properties.ReportSetting != null ? cfn_parse.FromCloudFormation.getAny(properties.ReportSetting) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This is the first of two steps to create a restore testing plan;
 *
 * once this request is successful, finish the procedure with request CreateRestoreTestingSelection.
 *
 * You must include the parameter RestoreTestingPlan. You may optionally include CreatorRequestId and Tags.
 *
 * @cloudformationResource AWS::Backup::RestoreTestingPlan
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingplan.html
 */
export class CfnRestoreTestingPlan extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Backup::RestoreTestingPlan";

  /**
   * Build a CfnRestoreTestingPlan from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRestoreTestingPlan {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRestoreTestingPlanPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRestoreTestingPlan(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * An Amazon Resource Name (ARN) that uniquely identifies a restore testing plan.
   *
   * @cloudformationAttribute RestoreTestingPlanArn
   */
  public readonly attrRestoreTestingPlanArn: string;

  /**
   * The specified criteria to assign a set of resources, such as recovery point types or backup vaults.
   */
  public recoveryPointSelection: cdk.IResolvable | CfnRestoreTestingPlan.RestoreTestingRecoveryPointSelectionProperty;

  /**
   * This is the restore testing plan name.
   */
  public restoreTestingPlanName: string;

  /**
   * A CRON expression in specified timezone when a restore testing plan is executed.
   */
  public scheduleExpression: string;

  /**
   * Optional.
   */
  public scheduleExpressionTimezone?: string;

  /**
   * Defaults to 24 hours.
   */
  public startWindowHours?: number;

  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRestoreTestingPlanProps) {
    super(scope, id, {
      "type": CfnRestoreTestingPlan.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "recoveryPointSelection", this);
    cdk.requireProperty(props, "restoreTestingPlanName", this);
    cdk.requireProperty(props, "scheduleExpression", this);

    this.attrRestoreTestingPlanArn = cdk.Token.asString(this.getAtt("RestoreTestingPlanArn", cdk.ResolutionTypeHint.STRING));
    this.recoveryPointSelection = props.recoveryPointSelection;
    this.restoreTestingPlanName = props.restoreTestingPlanName;
    this.scheduleExpression = props.scheduleExpression;
    this.scheduleExpressionTimezone = props.scheduleExpressionTimezone;
    this.startWindowHours = props.startWindowHours;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "recoveryPointSelection": this.recoveryPointSelection,
      "restoreTestingPlanName": this.restoreTestingPlanName,
      "scheduleExpression": this.scheduleExpression,
      "scheduleExpressionTimezone": this.scheduleExpressionTimezone,
      "startWindowHours": this.startWindowHours,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRestoreTestingPlan.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRestoreTestingPlanPropsToCloudFormation(props);
  }
}

export namespace CfnRestoreTestingPlan {
  /**
   * Required: Algorithm;
   *
   * Required: Recovery point types; IncludeVaults(one or more). Optional: SelectionWindowDays ('30' if not specified);ExcludeVaults (list of selectors), defaults to empty list if not listed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingplan-restoretestingrecoverypointselection.html
   */
  export interface RestoreTestingRecoveryPointSelectionProperty {
    /**
     * Acceptable values include "LATEST_WITHIN_WINDOW" or "RANDOM_WITHIN_WINDOW".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingplan-restoretestingrecoverypointselection.html#cfn-backup-restoretestingplan-restoretestingrecoverypointselection-algorithm
     */
    readonly algorithm: string;

    /**
     * Accepted values include specific ARNs or list of selectors.
     *
     * Defaults to empty list if not listed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingplan-restoretestingrecoverypointselection.html#cfn-backup-restoretestingplan-restoretestingrecoverypointselection-excludevaults
     */
    readonly excludeVaults?: Array<string>;

    /**
     * Accepted values include wildcard ["*"] or by specific ARNs or ARN wilcard replacement ["arn:aws:backup:us-west-2:123456789012:backup-vault:asdf", ...] ["arn:aws:backup:*:*:backup-vault:asdf-*", ...].
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingplan-restoretestingrecoverypointselection.html#cfn-backup-restoretestingplan-restoretestingrecoverypointselection-includevaults
     */
    readonly includeVaults: Array<string>;

    /**
     * These are the types of recovery points.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingplan-restoretestingrecoverypointselection.html#cfn-backup-restoretestingplan-restoretestingrecoverypointselection-recoverypointtypes
     */
    readonly recoveryPointTypes: Array<string>;

    /**
     * Accepted values are integers from 1 to 365.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingplan-restoretestingrecoverypointselection.html#cfn-backup-restoretestingplan-restoretestingrecoverypointselection-selectionwindowdays
     */
    readonly selectionWindowDays?: number;
  }
}

/**
 * Properties for defining a `CfnRestoreTestingPlan`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingplan.html
 */
export interface CfnRestoreTestingPlanProps {
  /**
   * The specified criteria to assign a set of resources, such as recovery point types or backup vaults.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingplan.html#cfn-backup-restoretestingplan-recoverypointselection
   */
  readonly recoveryPointSelection: cdk.IResolvable | CfnRestoreTestingPlan.RestoreTestingRecoveryPointSelectionProperty;

  /**
   * This is the restore testing plan name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingplan.html#cfn-backup-restoretestingplan-restoretestingplanname
   */
  readonly restoreTestingPlanName: string;

  /**
   * A CRON expression in specified timezone when a restore testing plan is executed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingplan.html#cfn-backup-restoretestingplan-scheduleexpression
   */
  readonly scheduleExpression: string;

  /**
   * Optional.
   *
   * This is the timezone in which the schedule expression is set. By default, ScheduleExpressions are in UTC. You can modify this to a specified timezone.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingplan.html#cfn-backup-restoretestingplan-scheduleexpressiontimezone
   */
  readonly scheduleExpressionTimezone?: string;

  /**
   * Defaults to 24 hours.
   *
   * A value in hours after a restore test is scheduled before a job will be canceled if it doesn't start successfully. This value is optional. If this value is included, this parameter has a maximum value of 168 hours (one week).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingplan.html#cfn-backup-restoretestingplan-startwindowhours
   */
  readonly startWindowHours?: number;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingplan.html#cfn-backup-restoretestingplan-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `RestoreTestingRecoveryPointSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `RestoreTestingRecoveryPointSelectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRestoreTestingPlanRestoreTestingRecoveryPointSelectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithm", cdk.requiredValidator)(properties.algorithm));
  errors.collect(cdk.propertyValidator("algorithm", cdk.validateString)(properties.algorithm));
  errors.collect(cdk.propertyValidator("excludeVaults", cdk.listValidator(cdk.validateString))(properties.excludeVaults));
  errors.collect(cdk.propertyValidator("includeVaults", cdk.requiredValidator)(properties.includeVaults));
  errors.collect(cdk.propertyValidator("includeVaults", cdk.listValidator(cdk.validateString))(properties.includeVaults));
  errors.collect(cdk.propertyValidator("recoveryPointTypes", cdk.requiredValidator)(properties.recoveryPointTypes));
  errors.collect(cdk.propertyValidator("recoveryPointTypes", cdk.listValidator(cdk.validateString))(properties.recoveryPointTypes));
  errors.collect(cdk.propertyValidator("selectionWindowDays", cdk.validateNumber)(properties.selectionWindowDays));
  return errors.wrap("supplied properties not correct for \"RestoreTestingRecoveryPointSelectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRestoreTestingPlanRestoreTestingRecoveryPointSelectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRestoreTestingPlanRestoreTestingRecoveryPointSelectionPropertyValidator(properties).assertSuccess();
  return {
    "Algorithm": cdk.stringToCloudFormation(properties.algorithm),
    "ExcludeVaults": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeVaults),
    "IncludeVaults": cdk.listMapper(cdk.stringToCloudFormation)(properties.includeVaults),
    "RecoveryPointTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.recoveryPointTypes),
    "SelectionWindowDays": cdk.numberToCloudFormation(properties.selectionWindowDays)
  };
}

// @ts-ignore TS6133
function CfnRestoreTestingPlanRestoreTestingRecoveryPointSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRestoreTestingPlan.RestoreTestingRecoveryPointSelectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRestoreTestingPlan.RestoreTestingRecoveryPointSelectionProperty>();
  ret.addPropertyResult("algorithm", "Algorithm", (properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined));
  ret.addPropertyResult("excludeVaults", "ExcludeVaults", (properties.ExcludeVaults != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeVaults) : undefined));
  ret.addPropertyResult("includeVaults", "IncludeVaults", (properties.IncludeVaults != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludeVaults) : undefined));
  ret.addPropertyResult("recoveryPointTypes", "RecoveryPointTypes", (properties.RecoveryPointTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RecoveryPointTypes) : undefined));
  ret.addPropertyResult("selectionWindowDays", "SelectionWindowDays", (properties.SelectionWindowDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.SelectionWindowDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRestoreTestingPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnRestoreTestingPlanProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRestoreTestingPlanPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recoveryPointSelection", cdk.requiredValidator)(properties.recoveryPointSelection));
  errors.collect(cdk.propertyValidator("recoveryPointSelection", CfnRestoreTestingPlanRestoreTestingRecoveryPointSelectionPropertyValidator)(properties.recoveryPointSelection));
  errors.collect(cdk.propertyValidator("restoreTestingPlanName", cdk.requiredValidator)(properties.restoreTestingPlanName));
  errors.collect(cdk.propertyValidator("restoreTestingPlanName", cdk.validateString)(properties.restoreTestingPlanName));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.requiredValidator)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpressionTimezone", cdk.validateString)(properties.scheduleExpressionTimezone));
  errors.collect(cdk.propertyValidator("startWindowHours", cdk.validateNumber)(properties.startWindowHours));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRestoreTestingPlanProps\"");
}

// @ts-ignore TS6133
function convertCfnRestoreTestingPlanPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRestoreTestingPlanPropsValidator(properties).assertSuccess();
  return {
    "RecoveryPointSelection": convertCfnRestoreTestingPlanRestoreTestingRecoveryPointSelectionPropertyToCloudFormation(properties.recoveryPointSelection),
    "RestoreTestingPlanName": cdk.stringToCloudFormation(properties.restoreTestingPlanName),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression),
    "ScheduleExpressionTimezone": cdk.stringToCloudFormation(properties.scheduleExpressionTimezone),
    "StartWindowHours": cdk.numberToCloudFormation(properties.startWindowHours),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRestoreTestingPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRestoreTestingPlanProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRestoreTestingPlanProps>();
  ret.addPropertyResult("recoveryPointSelection", "RecoveryPointSelection", (properties.RecoveryPointSelection != null ? CfnRestoreTestingPlanRestoreTestingRecoveryPointSelectionPropertyFromCloudFormation(properties.RecoveryPointSelection) : undefined));
  ret.addPropertyResult("restoreTestingPlanName", "RestoreTestingPlanName", (properties.RestoreTestingPlanName != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreTestingPlanName) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addPropertyResult("scheduleExpressionTimezone", "ScheduleExpressionTimezone", (properties.ScheduleExpressionTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpressionTimezone) : undefined));
  ret.addPropertyResult("startWindowHours", "StartWindowHours", (properties.StartWindowHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartWindowHours) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This request can be sent after CreateRestoreTestingPlan request returns successfully.
 *
 * This is the second part of creating a resource testing plan, and it must be completed sequentially.
 *
 * This consists of `RestoreTestingSelectionName` , `ProtectedResourceType` , and one of the following:
 *
 * - `ProtectedResourceArns`
 * - `ProtectedResourceConditions`
 *
 * Each protected resource type can have one single value.
 *
 * A restore testing selection can include a wildcard value ("*") for `ProtectedResourceArns` along with `ProtectedResourceConditions` . Alternatively, you can include up to 30 specific protected resource ARNs in `ProtectedResourceArns` .
 *
 * Cannot select by both protected resource types AND specific ARNs. Request will fail if both are included.
 *
 * @cloudformationResource AWS::Backup::RestoreTestingSelection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html
 */
export class CfnRestoreTestingSelection extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Backup::RestoreTestingSelection";

  /**
   * Build a CfnRestoreTestingSelection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRestoreTestingSelection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRestoreTestingSelectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRestoreTestingSelection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the IAM role that AWS Backup uses to create the target resource;
   */
  public iamRoleArn: string;

  /**
   * You can include specific ARNs, such as `ProtectedResourceArns: ["arn:aws:...", "arn:aws:..."]` or you can include a wildcard: `ProtectedResourceArns: ["*"]` , but not both.
   */
  public protectedResourceArns?: Array<string>;

  /**
   * In a resource testing selection, this parameter filters by specific conditions such as `StringEquals` or `StringNotEquals` .
   */
  public protectedResourceConditions?: cdk.IResolvable | CfnRestoreTestingSelection.ProtectedResourceConditionsProperty;

  /**
   * The type of AWS resource included in a resource testing selection;
   */
  public protectedResourceType: string;

  /**
   * You can override certain restore metadata keys by including the parameter `RestoreMetadataOverrides` in the body of `RestoreTestingSelection` .
   */
  public restoreMetadataOverrides?: cdk.IResolvable | Record<string, string>;

  /**
   * The RestoreTestingPlanName is a unique string that is the name of the restore testing plan.
   */
  public restoreTestingPlanName: string;

  /**
   * This is the unique name of the restore testing selection that belongs to the related restore testing plan.
   */
  public restoreTestingSelectionName: string;

  /**
   * This is amount of hours (1 to 168) available to run a validation script on the data.
   */
  public validationWindowHours?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRestoreTestingSelectionProps) {
    super(scope, id, {
      "type": CfnRestoreTestingSelection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "iamRoleArn", this);
    cdk.requireProperty(props, "protectedResourceType", this);
    cdk.requireProperty(props, "restoreTestingPlanName", this);
    cdk.requireProperty(props, "restoreTestingSelectionName", this);

    this.iamRoleArn = props.iamRoleArn;
    this.protectedResourceArns = props.protectedResourceArns;
    this.protectedResourceConditions = props.protectedResourceConditions;
    this.protectedResourceType = props.protectedResourceType;
    this.restoreMetadataOverrides = props.restoreMetadataOverrides;
    this.restoreTestingPlanName = props.restoreTestingPlanName;
    this.restoreTestingSelectionName = props.restoreTestingSelectionName;
    this.validationWindowHours = props.validationWindowHours;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "iamRoleArn": this.iamRoleArn,
      "protectedResourceArns": this.protectedResourceArns,
      "protectedResourceConditions": this.protectedResourceConditions,
      "protectedResourceType": this.protectedResourceType,
      "restoreMetadataOverrides": this.restoreMetadataOverrides,
      "restoreTestingPlanName": this.restoreTestingPlanName,
      "restoreTestingSelectionName": this.restoreTestingSelectionName,
      "validationWindowHours": this.validationWindowHours
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRestoreTestingSelection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRestoreTestingSelectionPropsToCloudFormation(props);
  }
}

export namespace CfnRestoreTestingSelection {
  /**
   * A list of conditions that you define for resources in your restore testing plan using tags.
   *
   * For example, `"StringEquals": { "Key": "aws:ResourceTag/CreatedByCryo", "Value": "true" },` . Condition operators are case sensitive.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingselection-protectedresourceconditions.html
   */
  export interface ProtectedResourceConditionsProperty {
    /**
     * Filters the values of your tagged resources for only those resources that you tagged with the same value.
     *
     * Also called "exact matching."
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingselection-protectedresourceconditions.html#cfn-backup-restoretestingselection-protectedresourceconditions-stringequals
     */
    readonly stringEquals?: Array<cdk.IResolvable | CfnRestoreTestingSelection.KeyValueProperty> | cdk.IResolvable;

    /**
     * Filters the values of your tagged resources for only those resources that you tagged that do not have the same value.
     *
     * Also called "negated matching."
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingselection-protectedresourceconditions.html#cfn-backup-restoretestingselection-protectedresourceconditions-stringnotequals
     */
    readonly stringNotEquals?: Array<cdk.IResolvable | CfnRestoreTestingSelection.KeyValueProperty> | cdk.IResolvable;
  }

  /**
   * Pair of two related strings.
   *
   * Allowed characters are letters, white space, and numbers that can be represented in UTF-8 and the following characters: `+ - = . _ : /`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingselection-keyvalue.html
   */
  export interface KeyValueProperty {
    /**
     * The tag key (String). The key can't start with `aws:` .
     *
     * Length Constraints: Minimum length of 1. Maximum length of 128.
     *
     * Pattern: `^(?![aA]{1}[wW]{1}[sS]{1}:)([\p{L}\p{Z}\p{N}_.:/=+\-@]+)$`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingselection-keyvalue.html#cfn-backup-restoretestingselection-keyvalue-key
     */
    readonly key: string;

    /**
     * The value of the key.
     *
     * Length Constraints: Maximum length of 256.
     *
     * Pattern: `^([\p{L}\p{Z}\p{N}_.:/=+\-@]*)$`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-restoretestingselection-keyvalue.html#cfn-backup-restoretestingselection-keyvalue-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnRestoreTestingSelection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html
 */
export interface CfnRestoreTestingSelectionProps {
  /**
   * The Amazon Resource Name (ARN) of the IAM role that AWS Backup uses to create the target resource;
   *
   * for example: `arn:aws:iam::123456789012:role/S3Access` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html#cfn-backup-restoretestingselection-iamrolearn
   */
  readonly iamRoleArn: string;

  /**
   * You can include specific ARNs, such as `ProtectedResourceArns: ["arn:aws:...", "arn:aws:..."]` or you can include a wildcard: `ProtectedResourceArns: ["*"]` , but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html#cfn-backup-restoretestingselection-protectedresourcearns
   */
  readonly protectedResourceArns?: Array<string>;

  /**
   * In a resource testing selection, this parameter filters by specific conditions such as `StringEquals` or `StringNotEquals` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html#cfn-backup-restoretestingselection-protectedresourceconditions
   */
  readonly protectedResourceConditions?: cdk.IResolvable | CfnRestoreTestingSelection.ProtectedResourceConditionsProperty;

  /**
   * The type of AWS resource included in a resource testing selection;
   *
   * for example, an Amazon EBS volume or an Amazon RDS database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html#cfn-backup-restoretestingselection-protectedresourcetype
   */
  readonly protectedResourceType: string;

  /**
   * You can override certain restore metadata keys by including the parameter `RestoreMetadataOverrides` in the body of `RestoreTestingSelection` .
   *
   * Key values are not case sensitive.
   *
   * See the complete list of [restore testing inferred metadata](https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing-inferred-metadata.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html#cfn-backup-restoretestingselection-restoremetadataoverrides
   */
  readonly restoreMetadataOverrides?: cdk.IResolvable | Record<string, string>;

  /**
   * The RestoreTestingPlanName is a unique string that is the name of the restore testing plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html#cfn-backup-restoretestingselection-restoretestingplanname
   */
  readonly restoreTestingPlanName: string;

  /**
   * This is the unique name of the restore testing selection that belongs to the related restore testing plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html#cfn-backup-restoretestingselection-restoretestingselectionname
   */
  readonly restoreTestingSelectionName: string;

  /**
   * This is amount of hours (1 to 168) available to run a validation script on the data.
   *
   * The data will be deleted upon the completion of the validation script or the end of the specified retention period, whichever comes first.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-restoretestingselection.html#cfn-backup-restoretestingselection-validationwindowhours
   */
  readonly validationWindowHours?: number;
}

/**
 * Determine whether the given properties match those of a `KeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `KeyValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRestoreTestingSelectionKeyValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"KeyValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnRestoreTestingSelectionKeyValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRestoreTestingSelectionKeyValuePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRestoreTestingSelectionKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRestoreTestingSelection.KeyValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRestoreTestingSelection.KeyValueProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProtectedResourceConditionsProperty`
 *
 * @param properties - the TypeScript properties of a `ProtectedResourceConditionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRestoreTestingSelectionProtectedResourceConditionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("stringEquals", cdk.listValidator(CfnRestoreTestingSelectionKeyValuePropertyValidator))(properties.stringEquals));
  errors.collect(cdk.propertyValidator("stringNotEquals", cdk.listValidator(CfnRestoreTestingSelectionKeyValuePropertyValidator))(properties.stringNotEquals));
  return errors.wrap("supplied properties not correct for \"ProtectedResourceConditionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRestoreTestingSelectionProtectedResourceConditionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRestoreTestingSelectionProtectedResourceConditionsPropertyValidator(properties).assertSuccess();
  return {
    "StringEquals": cdk.listMapper(convertCfnRestoreTestingSelectionKeyValuePropertyToCloudFormation)(properties.stringEquals),
    "StringNotEquals": cdk.listMapper(convertCfnRestoreTestingSelectionKeyValuePropertyToCloudFormation)(properties.stringNotEquals)
  };
}

// @ts-ignore TS6133
function CfnRestoreTestingSelectionProtectedResourceConditionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRestoreTestingSelection.ProtectedResourceConditionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRestoreTestingSelection.ProtectedResourceConditionsProperty>();
  ret.addPropertyResult("stringEquals", "StringEquals", (properties.StringEquals != null ? cfn_parse.FromCloudFormation.getArray(CfnRestoreTestingSelectionKeyValuePropertyFromCloudFormation)(properties.StringEquals) : undefined));
  ret.addPropertyResult("stringNotEquals", "StringNotEquals", (properties.StringNotEquals != null ? cfn_parse.FromCloudFormation.getArray(CfnRestoreTestingSelectionKeyValuePropertyFromCloudFormation)(properties.StringNotEquals) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRestoreTestingSelectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnRestoreTestingSelectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRestoreTestingSelectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.requiredValidator)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("protectedResourceArns", cdk.listValidator(cdk.validateString))(properties.protectedResourceArns));
  errors.collect(cdk.propertyValidator("protectedResourceConditions", CfnRestoreTestingSelectionProtectedResourceConditionsPropertyValidator)(properties.protectedResourceConditions));
  errors.collect(cdk.propertyValidator("protectedResourceType", cdk.requiredValidator)(properties.protectedResourceType));
  errors.collect(cdk.propertyValidator("protectedResourceType", cdk.validateString)(properties.protectedResourceType));
  errors.collect(cdk.propertyValidator("restoreMetadataOverrides", cdk.hashValidator(cdk.validateString))(properties.restoreMetadataOverrides));
  errors.collect(cdk.propertyValidator("restoreTestingPlanName", cdk.requiredValidator)(properties.restoreTestingPlanName));
  errors.collect(cdk.propertyValidator("restoreTestingPlanName", cdk.validateString)(properties.restoreTestingPlanName));
  errors.collect(cdk.propertyValidator("restoreTestingSelectionName", cdk.requiredValidator)(properties.restoreTestingSelectionName));
  errors.collect(cdk.propertyValidator("restoreTestingSelectionName", cdk.validateString)(properties.restoreTestingSelectionName));
  errors.collect(cdk.propertyValidator("validationWindowHours", cdk.validateNumber)(properties.validationWindowHours));
  return errors.wrap("supplied properties not correct for \"CfnRestoreTestingSelectionProps\"");
}

// @ts-ignore TS6133
function convertCfnRestoreTestingSelectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRestoreTestingSelectionPropsValidator(properties).assertSuccess();
  return {
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "ProtectedResourceArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.protectedResourceArns),
    "ProtectedResourceConditions": convertCfnRestoreTestingSelectionProtectedResourceConditionsPropertyToCloudFormation(properties.protectedResourceConditions),
    "ProtectedResourceType": cdk.stringToCloudFormation(properties.protectedResourceType),
    "RestoreMetadataOverrides": cdk.hashMapper(cdk.stringToCloudFormation)(properties.restoreMetadataOverrides),
    "RestoreTestingPlanName": cdk.stringToCloudFormation(properties.restoreTestingPlanName),
    "RestoreTestingSelectionName": cdk.stringToCloudFormation(properties.restoreTestingSelectionName),
    "ValidationWindowHours": cdk.numberToCloudFormation(properties.validationWindowHours)
  };
}

// @ts-ignore TS6133
function CfnRestoreTestingSelectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRestoreTestingSelectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRestoreTestingSelectionProps>();
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("protectedResourceArns", "ProtectedResourceArns", (properties.ProtectedResourceArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ProtectedResourceArns) : undefined));
  ret.addPropertyResult("protectedResourceConditions", "ProtectedResourceConditions", (properties.ProtectedResourceConditions != null ? CfnRestoreTestingSelectionProtectedResourceConditionsPropertyFromCloudFormation(properties.ProtectedResourceConditions) : undefined));
  ret.addPropertyResult("protectedResourceType", "ProtectedResourceType", (properties.ProtectedResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ProtectedResourceType) : undefined));
  ret.addPropertyResult("restoreMetadataOverrides", "RestoreMetadataOverrides", (properties.RestoreMetadataOverrides != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.RestoreMetadataOverrides) : undefined));
  ret.addPropertyResult("restoreTestingPlanName", "RestoreTestingPlanName", (properties.RestoreTestingPlanName != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreTestingPlanName) : undefined));
  ret.addPropertyResult("restoreTestingSelectionName", "RestoreTestingSelectionName", (properties.RestoreTestingSelectionName != null ? cfn_parse.FromCloudFormation.getString(properties.RestoreTestingSelectionName) : undefined));
  ret.addPropertyResult("validationWindowHours", "ValidationWindowHours", (properties.ValidationWindowHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.ValidationWindowHours) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}