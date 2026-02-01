import { Construct } from 'constructs';
import { CfnBackupSelection } from './backup.generated';
import { BackupableResourcesCollector } from './backupable-resources-collector';
import { BackupResource, TagOperation } from './resource';
import * as iam from '../../aws-iam';
import { Lazy, Resource, Aspects, Token, UnscopedValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { mutatingAspectPrio32333 } from '../../core/lib/private/aspect-prio';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import { IBackupPlanRef } from '../../interfaces/generated/aws-backup-interfaces.generated';

/**
 * A condition for backup selection using tag-based filtering.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditionparameter.html
 */
export interface BackupSelectionCondition {
  /**
   * The tag key to match.
   *
   * Note: The key will be automatically prefixed with 'aws:ResourceTag/'
   * when generating CloudFormation.
   */
  readonly key: string;

  /**
   * The tag value to match.
   */
  readonly value: string;
}

/**
 * Conditions for backup selection using AND logic.
 *
 * When multiple conditions are specified, resources must match ALL conditions
 * to be included in the backup selection. This is different from
 * `BackupResource.fromTag()` which uses OR logic via ListOfTags.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html
 */
export interface BackupSelectionConditions {
  /**
   * Filters resources for exact tag value matches.
   *
   * @default - no stringEquals conditions
   */
  readonly stringEquals?: BackupSelectionCondition[];

  /**
   * Filters resources for tag values matching a wildcard pattern.
   * Use '*' as a wildcard character.
   *
   * @default - no stringLike conditions
   */
  readonly stringLike?: BackupSelectionCondition[];

  /**
   * Filters resources for tag values that do NOT match exactly.
   *
   * @default - no stringNotEquals conditions
   */
  readonly stringNotEquals?: BackupSelectionCondition[];

  /**
   * Filters resources for tag values that do NOT match a wildcard pattern.
   *
   * @default - no stringNotLike conditions
   */
  readonly stringNotLike?: BackupSelectionCondition[];
}

/**
 * Options for a BackupSelection
 */
export interface BackupSelectionOptions {
  /**
   * The resources to backup.
   * Use the helper static methods defined on `BackupResource`.
   */
  readonly resources: BackupResource[];

  /**
   * The name for this selection
   *
   * @default - a CDK generated name
   */
  readonly backupSelectionName?: string;

  /**
   * The role that AWS Backup uses to authenticate when backuping or restoring
   * the resources. The `AWSBackupServiceRolePolicyForBackup` managed policy
   * will be attached to this role unless `disableDefaultBackupPolicy`
   * is set to `true`.
   *
   * @default - a new role will be created
   */
  readonly role?: iam.IRole;

  /**
   * Whether to disable automatically assigning default backup permissions to the role
   * that AWS Backup uses.
   * If `false`, the `AWSBackupServiceRolePolicyForBackup` managed policy will be
   * attached to the role.
   *
   * @default false
   */
  readonly disableDefaultBackupPolicy?: boolean;

  /**
   * Whether to automatically give restores permissions to the role that AWS
   * Backup uses. If `true`, the `AWSBackupServiceRolePolicyForRestores` managed
   * policy will be attached to the role.
   *
   * @default false
   */
  readonly allowRestores?: boolean;

  /**
   * Conditions for selecting resources using AND logic.
   *
   * When conditions are specified, resources must match ALL conditions
   * to be included in the backup selection. This is different from
   * `BackupResource.fromTag()` which uses OR logic via ListOfTags.
   *
   * Use this property when you need to select resources that match
   * both an ARN pattern AND specific tag conditions.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-backup-backupselection-conditions.html
   * @default - no conditions
   */
  readonly conditions?: BackupSelectionConditions;
}

/**
 * Properties for a BackupSelection
 */
export interface BackupSelectionProps extends BackupSelectionOptions {
  /**
   * The backup plan for this selection
   */
  readonly backupPlan: IBackupPlanRef;
}

/**
 * A backup selection
 */
@propertyInjectable
export class BackupSelection extends Resource implements iam.IGrantable {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-backup.BackupSelection';
  /**
   * The identifier of the backup plan.
   *
   * @attribute
   */
  public readonly backupPlanId: string;

  /**
   * The identifier of the backup selection.
   *
   * @attribute
   */
  public readonly selectionId: string;

  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: iam.IPrincipal;

  private listOfTags: CfnBackupSelection.ConditionResourceTypeProperty[] = [];
  private resources: string[] = [];
  private readonly backupableResourcesCollector = new BackupableResourcesCollector();

  constructor(scope: Construct, id: string, props: BackupSelectionProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('backup.amazonaws.com'),
    });
    if (!props.disableDefaultBackupPolicy) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBackupServiceRolePolicyForBackup'));
    }
    if (props.allowRestores) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBackupServiceRolePolicyForRestores'));
    }
    this.grantPrincipal = role;

    const selection = new CfnBackupSelection(this, 'Resource', {
      backupPlanId: props.backupPlan.backupPlanRef.backupPlanId,
      backupSelection: {
        iamRoleArn: role.roleArn,
        selectionName: props.backupSelectionName || this.node.id,
        listOfTags: Lazy.any({
          produce: () => this.listOfTags,
        }, { omitEmptyArray: true }),
        resources: Lazy.list({
          produce: () => [...this.resources, ...this.backupableResourcesCollector.resources],
        }, { omitEmpty: true }),
        conditions: this.renderConditions(props.conditions),
      },
    });

    this.backupPlanId = selection.attrBackupPlanId;
    this.selectionId = selection.attrSelectionId;

    for (const resource of props.resources) {
      this.addResource(resource);
    }
  }

  private addResource(resource: BackupResource) {
    if (resource.tagCondition) {
      this.listOfTags.push({
        conditionKey: resource.tagCondition.key,
        conditionType: resource.tagCondition.operation || TagOperation.STRING_EQUALS,
        conditionValue: resource.tagCondition.value,
      });
    }

    if (resource.resource) {
      this.resources.push(resource.resource);
    }

    if (resource.construct) {
      Aspects.of(resource.construct).add(this.backupableResourcesCollector, {
        priority: mutatingAspectPrio32333(resource.construct),
      });
      // Cannot push `this.backupableResourcesCollector.resources` to
      // `this.resources` here because it has not been evaluated yet.
      // Will be concatenated to `this.resources` in a `Lazy.list`
      // in the constructor instead.
    }
  }

  /**
   * Renders the conditions property for CloudFormation.
   * Returns undefined if no conditions are specified.
   *
   * Note: We output CloudFormation-format (PascalCase) directly because
   * the L1 construct uses objectToCloudFormation which doesn't convert
   * nested property names.
   */
  private renderConditions(conditions?: BackupSelectionConditions): any {
    if (!conditions) {
      return undefined;
    }

    const hasConditions =
      (conditions.stringEquals && conditions.stringEquals.length > 0) ||
      (conditions.stringLike && conditions.stringLike.length > 0) ||
      (conditions.stringNotEquals && conditions.stringNotEquals.length > 0) ||
      (conditions.stringNotLike && conditions.stringNotLike.length > 0);

    if (!hasConditions) {
      return undefined;
    }

    const result: any = {};

    if (conditions.stringEquals && conditions.stringEquals.length > 0) {
      result.StringEquals = this.renderConditionParameters(conditions.stringEquals);
    }
    if (conditions.stringLike && conditions.stringLike.length > 0) {
      result.StringLike = this.renderConditionParameters(conditions.stringLike);
    }
    if (conditions.stringNotEquals && conditions.stringNotEquals.length > 0) {
      result.StringNotEquals = this.renderConditionParameters(conditions.stringNotEquals);
    }
    if (conditions.stringNotLike && conditions.stringNotLike.length > 0) {
      result.StringNotLike = this.renderConditionParameters(conditions.stringNotLike);
    }

    return result;
  }

  /**
   * Renders an array of condition parameters for CloudFormation.
   * Automatically prefixes tag keys with 'aws:ResourceTag/'.
   *
   * Note: We output CloudFormation-format (PascalCase) directly.
   */
  private renderConditionParameters(
    conditions?: BackupSelectionCondition[],
  ): any[] | undefined {
    if (!conditions || conditions.length === 0) {
      return undefined;
    }

    return conditions.map((condition) => {
      if (Token.isUnresolved(condition.key)) {
        throw new UnscopedValidationError(
          'Backup selection condition keys must be static strings. ' +
          'Dynamic tag keys (tokens) are not supported by AWS Backup. ' +
          `Received: ${condition.key}`,
        );
      }
      return {
        ConditionKey: `aws:ResourceTag/${condition.key}`,
        ConditionValue: condition.value,
      };
    });
  }
}
