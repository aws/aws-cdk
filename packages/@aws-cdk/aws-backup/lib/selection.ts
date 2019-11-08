import iam = require('@aws-cdk/aws-iam');
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnBackupSelection } from './backup.generated';
import { IBackupPlan } from './plan';

/**
 * Represents a Backup Selection.
 */
export interface IBackupSelection extends IResource {
  /**
   * The name of the selection.
   * @attribute
   */
  readonly backupSelectionName: string;
  /**
   * Optional IAM Role to use for accessing the resources
   * @attribute
   */
  readonly role?: iam.IRole;
  /**
   * The Backup Plan to relate the selections to.
   * @attribute
   */
  readonly backupPlan: IBackupPlan;
  /**
   * A string representation of the backup plan ID.
   * @attribute
   */
  readonly backupSelectionBackupPlanId: string;
  /**
   * A string representation of the backup selection ID.
   * @attribute
   */
  readonly backupSelectionSelectionId: string;
  /**
   * Optional resources' ARN to select.
   * @attribute
   */
  readonly resources?: string[];
}

abstract class BackupSelectionBase extends Resource implements IBackupSelection {
  public abstract readonly backupSelectionName: string;
  public abstract readonly backupPlan: IBackupPlan;
  public abstract readonly backupSelectionBackupPlanId: string;
  public abstract readonly backupSelectionSelectionId: string;
  public abstract readonly role?: iam.IRole;
  public abstract readonly resources?: string[];
}

/**
 * Backup selection attributes.
 */
export interface BackupSelectionAttributes {
  /**
   * A string representation of the backup selection.
   */
  readonly backupSelectionName: string;
  /**
   * A backup plan object.
   */
  readonly backupPlan: IBackupPlan;
  /**
   * The backup selection's selection Id.
   */
  readonly backupSelectionSelectionId: string;
}

/**
 * Represents the backup selection properties.
 */
export interface BackupSelectionProps {
  /**
   * The name of the selection resource.
   */
  readonly backupSelectionName: string;
  /**
   * The backup plan to assign this plan to.
   */
  readonly backupPlan: IBackupPlan;
  /**
   * Optional IAM Role to use for selecting and interacting with the AWS resources to backup.
   * @default IAM Role based from the AWS Backup service.
   * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/iam-service-roles.html
   */
  readonly role?: iam.IRole;
  /**
   * A list of ARNs to backup.
   * @default to no resources.
   */
  readonly resources?: string[];
}

/**
 * Backup resource selection.
 */
export class BackupSelection extends BackupSelectionBase {
  /**
   * Imports a backup selection based from the given attributes.
   */
  public static fromBackupSelectionAttributes(scope: Construct, id: string, attrs: BackupSelectionAttributes): IBackupSelection {
    class Import extends BackupSelectionBase {
      public readonly backupSelectionName: string = attrs.backupSelectionName;
      public readonly backupPlan: IBackupPlan = attrs.backupPlan;
      public readonly backupSelectionBackupPlanId: string = attrs.backupPlan.backupPlanId;
      public readonly backupSelectionSelectionId: string = attrs.backupSelectionSelectionId;
      public readonly resources?: string[]; // dropped
      public readonly role?: iam.IRole; // dropped
    }

    return new Import(scope, id);
  }

  public readonly backupSelectionName: string;
  public readonly backupPlan: IBackupPlan;
  public readonly backupSelectionBackupPlanId: string;
  public readonly backupSelectionSelectionId: string;
  public readonly role?: iam.IRole;
  public readonly resources?: string[];

  constructor(scope: Construct, id: string, props: BackupSelectionProps) {
    super(scope, id);
    this.backupPlan = props.backupPlan;
    this.backupSelectionBackupPlanId = this.backupPlan.backupPlanId;
    this.backupSelectionName = props.backupSelectionName;

    const resource = new CfnBackupSelection(this, 'Resource', {
      backupPlanId: this.backupPlan.backupPlanName,
      backupSelection: {
        selectionName: this.backupSelectionName,
        iamRoleArn: this.parseRole(props).roleArn,
        resources: props.resources,
      }
    });

    this.backupSelectionSelectionId = resource.attrSelectionId;
    this.backupSelectionBackupPlanId = resource.attrBackupPlanId;
  }

  private parseRole(props: BackupSelectionProps): iam.IRole {
    if (props.role) {
      return props.role;
    }

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('backup.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBackupServiceRolePolicyForBackup')
      ]
    });

    return role;
  }
}
