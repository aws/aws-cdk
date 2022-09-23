import * as iam from '@aws-cdk/aws-iam';
import { Lazy, Resource, Aspects } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnBackupSelection } from './backup.generated';
import { BackupableResourcesCollector } from './backupable-resources-collector';
import { IBackupPlan } from './plan';
import { BackupResource, TagOperation } from './resource';

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
   * The role that AWS Backup uses to authenticate when backing up or restoring
   * the resources. By default, the `AWSBackupServiceRolePolicyForBackup`
   * managed policy will be attached to this role. If you want to disable the
   * addition of all managed policies, then specify allowBackup as false. If you
   * would like additional roles to be added for you, make use of the
   * allowBackup and allowRestore flags below. See the package overview for more
   * examples.
   *
   * @default - a new role will be created
   */
  readonly role?: iam.IRole;

  /**
   * Whether to automatically give backup permissions to the role that AWS
   * Backup uses. If `true`, the `AWSBackupServiceRolePolicyForBackup` managed
   * policy will be attached to the role.
   *
   * @default true
   */
  readonly allowBackup?: boolean;

  /**
   * Whether to automatically give restores permissions to the role that AWS
   * Backup uses. If `true`, the `AWSBackupServiceRolePolicyForRestores` managed
   * policy will be attached to the role.
   *
   * @default false
   */
  readonly allowRestores?: boolean;

  /**
   * Whether to automatically give S3 specific backup permissions to the role
   * that AWS Backup uses. If `true`, the
   * `AWSBackupServiceRolePolicyForS3Backup` managed policy will be attached to
   * the role.
   * @default false
   */
  readonly allowS3Backup?: boolean;

  /**
   * Whether to automatically give S3 specific restore permissions to the role
   * that AWS Backup uses. If `true`, the
   * `AWSBackupServiceRolePolicyForS3Restores` managed policy will be attached
   * to the role.
   * @default false
   */
  readonly allowS3Restores?: boolean;
}

/**
 * Properties for a BackupSelection
 */
export interface BackupSelectionProps extends BackupSelectionOptions {
  /**
   * The backup plan for this selection
   */
  readonly backupPlan: IBackupPlan;
}

/**
 * A backup selection
 */
export class BackupSelection extends Resource implements iam.IGrantable {
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

  /**
   * The service role that is being used for the backup selection.
   */
  public readonly role: iam.IRole;

  private listOfTags: CfnBackupSelection.ConditionResourceTypeProperty[] = [];
  private resources: string[] = [];
  private readonly backupableResourcesCollector = new BackupableResourcesCollector();

  constructor(scope: Construct, id: string, props: BackupSelectionProps) {
    super(scope, id);

    // Role created or existing role referenced
    const role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('backup.amazonaws.com'),
    });

    // AWS Backup AWS Managed Policies for general backup/restore

    // backup policy default true
    if (props.allowBackup ?? true) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBackupServiceRolePolicyForBackup'));
    }

    // restore policy default false
    if (props.allowRestores ?? false) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBackupServiceRolePolicyForRestores'));
    }

    // Conditionally add S3 specific managed policies (Backup and Restores)

    // S3 backup policy default false
    if (props.allowS3Backup ?? false) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSBackupServiceRolePolicyForS3Backup'));
    }

    // S3 backup policy default false
    if (props.allowS3Restores ?? false) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSBackupServiceRolePolicyForS3Restore'));
    }

    // Implement grantable interface
    this.grantPrincipal = role;

    // Expose the service role
    this.role = role;

    const selection = new CfnBackupSelection(this, 'Resource', {
      backupPlanId: props.backupPlan.backupPlanId,
      backupSelection: {
        iamRoleArn: role.roleArn,
        selectionName: props.backupSelectionName || this.node.id,
        listOfTags: Lazy.any({
          produce: () => this.listOfTags,
        }, { omitEmptyArray: true }),
        resources: Lazy.list({
          produce: () => [...this.resources, ...this.backupableResourcesCollector.resources],
        }, { omitEmpty: true }),
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
      Aspects.of(resource.construct).add(this.backupableResourcesCollector);
      // Cannot push `this.backupableResourcesCollector.resources` to
      // `this.resources` here because it has not been evaluated yet.
      // Will be concatenated to `this.resources` in a `Lazy.list`
      // in the constructor instead.
    }
  }
}
