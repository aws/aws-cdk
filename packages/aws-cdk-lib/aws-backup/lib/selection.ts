import type { Construct } from 'constructs';
import { CfnBackupSelection } from './backup.generated';
import { BackupableResourcesCollector } from './backupable-resources-collector';
import type { BackupResource, TagCondition } from './resource';
import { TagOperation } from './resource';
import * as iam from '../../aws-iam';
import { Resource, Aspects, Token } from '../../core';
import type { IArrayBox } from '../../core/lib/helpers-internal';
import { Box } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { noBoxStackTraces } from '../../core/lib/no-box-stack-traces';
import { mutatingAspectPrio32333 } from '../../core/lib/private/aspect-prio';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IBackupPlanRef } from '../../interfaces/generated/aws-backup-interfaces.generated';

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
   * Tag conditions that apply to all resources in this selection.
   * All conditions use AND logic — a resource must satisfy every condition to be selected.
   *
   * This is the preferred way to add tag-based filtering. Unlike `BackupResource.fromTag()`,
   * it makes clear that tag conditions are selection-wide and not scoped to a single ARN.
   *
   * @default - no tag conditions
   */
  readonly tagConditions?: TagCondition[];
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
@noBoxStackTraces
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

  private readonly stringEquals: IArrayBox<CfnBackupSelection.ConditionParameterProperty> = Box.fromArray([]);
  private readonly stringLike: IArrayBox<CfnBackupSelection.ConditionParameterProperty> = Box.fromArray([]);
  private readonly stringNotEquals: IArrayBox<CfnBackupSelection.ConditionParameterProperty> = Box.fromArray([]);
  private readonly stringNotLike: IArrayBox<CfnBackupSelection.ConditionParameterProperty> = Box.fromArray([]);
  private readonly resources: IArrayBox<string> = Box.fromArray([], { omitEmpty: false });
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
        // `conditions` is typed as `any` in the generated layer so CDK uses identity serialization
        // (no camelCase→PascalCase key transformation). PascalCase keys are used here explicitly.
        conditions: Box.combine(
          {
            se: this.stringEquals,
            sl: this.stringLike,
            sne: this.stringNotEquals,
            snl: this.stringNotLike,
          },
          ({ se, sl, sne, snl }) => {
            const conds: Record<string, Array<{ ConditionKey: string; ConditionValue: string }>> = {};
            if (se.length > 0) conds.StringEquals = se.map(p => ({ ConditionKey: p.conditionKey!, ConditionValue: p.conditionValue! }));
            if (sl.length > 0) conds.StringLike = sl.map(p => ({ ConditionKey: p.conditionKey!, ConditionValue: p.conditionValue! }));
            if (sne.length > 0) conds.StringNotEquals = sne.map(p => ({ ConditionKey: p.conditionKey!, ConditionValue: p.conditionValue! }));
            if (snl.length > 0) conds.StringNotLike = snl.map(p => ({ ConditionKey: p.conditionKey!, ConditionValue: p.conditionValue! }));
            return Object.keys(conds).length > 0 ? conds : undefined;
          },
        ),
        resources: Token.asList(
          this.resources.derive(r => {
            const all = [...r, ...this.backupableResourcesCollector.resources];
            return all.length > 0 ? all : undefined;
          }),
          { displayHint: 'resources' },
        ),
      },
    });

    this.backupPlanId = selection.attrBackupPlanId;
    this.selectionId = selection.attrSelectionId;

    for (const resource of props.resources) {
      this.addResource(resource);
    }
    for (const condition of props.tagConditions ?? []) {
      this.addTagCondition(condition);
    }
  }

  private addTagCondition(condition: TagCondition) {
    const param: CfnBackupSelection.ConditionParameterProperty = {
      conditionKey: condition.key,
      conditionValue: condition.value,
    };
    switch (condition.operation ?? TagOperation.STRING_EQUALS) {
      case TagOperation.STRING_EQUALS:
        this.stringEquals.push(param);
        break;
      case TagOperation.STRING_LIKE:
        this.stringLike.push(param);
        break;
      case TagOperation.STRING_NOT_EQUALS:
        this.stringNotEquals.push(param);
        break;
      case TagOperation.STRING_NOT_LIKE:
        this.stringNotLike.push(param);
        break;
    }
  }

  private addResource(resource: BackupResource) {
    if (resource.tagCondition) {
      this.addTagCondition(resource.tagCondition);
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
      // Will be concatenated to `this.resources` in the derive() call
      // in the constructor instead.
    }
  }
}
