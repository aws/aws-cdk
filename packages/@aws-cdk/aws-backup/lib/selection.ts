import * as iam from '@aws-cdk/aws-iam';
import { Construct, Lazy, Resource } from '@aws-cdk/core';
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
   * The role that AWS Backup uses to authenticate when backuping or restoring
   * the resources. The `AWSBackupServiceRolePolicyForBackup` managed policy
   * will be attached to this role.
   *
   * @default - a new role will be created
   */
  readonly role?: iam.IRole;

  /**
   * Whether to automatically give restores permissions to the role that AWS
   * Backup uses. If `true`, the `AWSBackupServiceRolePolicyForRestores` managed
   * policy will be attached to the role.
   *
   * @default false
   */
  readonly allowRestores?: boolean;
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

  constructor(scope: Construct, id: string, props: BackupSelectionProps) {
    super(scope, id);

    const role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('backup.amazonaws.com'),
    });
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBackupServiceRolePolicyForBackup'));
    if (props.allowRestores) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBackupServiceRolePolicyForRestores'));
    }
    this.grantPrincipal = role;

    const selection = new CfnBackupSelection(this, 'Resource', {
      backupPlanId: props.backupPlan.backupPlanId,
      backupSelection: {
        iamRoleArn: role.roleArn,
        selectionName: props.backupSelectionName || this.node.id,
        listOfTags: formatListOfTags(props.resources),
        resources: formatResources(props.resources),
      }
    });

    this.backupPlanId = selection.attrBackupPlanId;
    this.selectionId = selection.attrSelectionId;
  }
}

function formatListOfTags(backupResources: BackupResource[]): CfnBackupSelection.ConditionResourceTypeProperty[] | undefined {
  const listOfTags: CfnBackupSelection.ConditionResourceTypeProperty[] = [];

  for (const resource of backupResources) {
    if (resource.tagCondition) {
      listOfTags.push({
        conditionKey: resource.tagCondition.key,
        conditionType: resource.tagCondition.operation || TagOperation.STRING_EQUALS,
        conditionValue: resource.tagCondition.value,
      });
    }
  }

  return listOfTags.length !== 0 ? listOfTags : undefined;
}

function formatResources(backupResources: BackupResource[]): string[] {
  const _resources: string[] = [];
  const aspects: BackupableResourcesCollector[] = [];

  // Create all aspects first and then loop over them because we cannot
  // add items to a token list
  for (const resource of backupResources) {
    if (resource.resource) {
      _resources.push(resource.resource);
    }

    if (resource.construct) {
      const backupResourcesCollector = new BackupableResourcesCollector();
      resource.construct.node.applyAspect(backupResourcesCollector);
      aspects.push(backupResourcesCollector);
    }
  }

  return Lazy.listValue({ produce: () => {
    const resources: string[] = [..._resources];
    for (const aspect of aspects) {
      resources.push(...aspect.resources);
    }
    return resources;
  }});
}
