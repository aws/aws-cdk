import { Construct } from 'constructs';
import { ICanary } from './canary';
import { CfnGroup, GroupReference, IGroupRef } from './synthetics.generated';
import * as cdk from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

/**
 * Represents a CloudWatch Synthetics Group
 */
export interface IGroup extends cdk.IResource, IGroupRef {
  /**
   * The ID of the group
   * @attribute
   */
  readonly groupId: string;

  /**
   * The name of the group
   * @attribute
   */
  readonly groupName: string;

  /**
   * The ARN of the group
   * @attribute
   */
  readonly groupArn: string;

  /**
   * Add a canary to this group
   *
   * @param canary The canary to add to the group
   */
  addCanary(canary: ICanary): void;
}

/**
 * Properties for defining a CloudWatch Synthetics Group
 */
export interface GroupProps {
  /**
   * A name for the group. It can include any Unicode characters.
   *
   * The names for all groups in your account, across all Regions, must be unique.
   *
   * @default - A unique name will be generated from the construct ID
   */
  readonly groupName?: string;

  /**
   * List of canaries to associate with this group.
   *
   * Each group can contain as many as 10 canaries.
   *
   * @default - No canaries are associated with the group initially
   */
  readonly canaries?: ICanary[];
}

/**
 * Define a new CloudWatch Synthetics Group
 *
 * Groups allow you to associate canaries with each other, including cross-Region canaries.
 * Using groups can help you with managing and automating your canaries, and you can also
 * view aggregated run results and statistics for all canaries in a group.
 */
export class Group extends cdk.Resource implements IGroup {
  /**
   * Import an existing group by ARN
   */
  public static fromGroupArn(scope: Construct, id: string, groupArn: string): IGroup {
    const arnParts = cdk.Arn.split(groupArn, cdk.ArnFormat.COLON_RESOURCE_NAME);
    const groupName = arnParts.resourceName;

    if (!groupName) {
      throw new ValidationError('Group ARN must contain a group name', scope);
    }

    return Group.fromGroupName(scope, id, groupName);
  }

  /**
   * Import an existing group by name
   */
  public static fromGroupName(scope: Construct, id: string, groupName: string): IGroup {
    class Import extends cdk.Resource implements IGroup {
      public readonly groupId = groupName;
      public readonly groupName = groupName;
      public readonly groupArn = cdk.Stack.of(this).formatArn({
        service: 'synthetics',
        resource: 'group',
        resourceName: groupName,
        arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
      });
      public get groupRef(): GroupReference {
        return { groupName: this.groupName };
      }

      public addCanary(_canary: ICanary): void {
        throw new ValidationError('Cannot add canaries to an imported group', this);
      }
    }

    return new Import(scope, id);
  }

  /**
   * The ID of the group
   * @attribute
   */
  public readonly groupId: string;

  /**
   * The name of the group
   * @attribute
   */
  public readonly groupName: string;

  /**
   * The ARN of the group
   * @attribute
   */
  public readonly groupArn: string;

  /**
   * A reference to the group.
   */
  public get groupRef(): GroupReference {
    return { groupName: this.groupName };
  }

  private readonly _resource: CfnGroup;
  private readonly _canaries: Set<ICanary> = new Set();

  constructor(scope: Construct, id: string, props: GroupProps = {}) {
    super(scope, id, {
      physicalName: props.groupName ?? cdk.Lazy.string({
        produce: () => cdk.Names.uniqueResourceName(this, { maxLength: 64 }),
      }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.canaries && props.canaries.length > 10) {
      throw new ValidationError(`A group can contain at most 10 canaries, got: ${props.canaries.length}`, this);
    }

    props.canaries?.forEach(canary => this._canaries.add(canary));

    this._resource = new CfnGroup(this, 'Resource', {
      name: this.physicalName,
      resourceArns: cdk.Lazy.list({
        produce: () => Array.from(this._canaries).map(canary => canary.canaryArn),
      }),
    });

    this.groupId = this._resource.attrId;
    this.groupName = this.getResourceNameAttribute(this._resource.ref);
    this.groupArn = cdk.Stack.of(this).formatArn({
      service: 'synthetics',
      resource: 'group',
      resourceName: this.groupId,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Add a canary to this group
   *
   * @param canary The canary to add to the group
   */
  public addCanary(canary: ICanary): void {
    if (this._canaries.size >= 10) {
      throw new ValidationError('A group can contain at most 10 canaries', this);
    }

    this._canaries.add(canary);
  }

  /**
   * Get all canaries associated with this group
   */
  public get canaries(): ICanary[] {
    return Array.from(this._canaries);
  }
}
