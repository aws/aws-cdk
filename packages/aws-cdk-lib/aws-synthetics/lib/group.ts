import type { Construct } from 'constructs';
import type { ICanary } from './canary';
import type { GroupReference, IGroupRef } from './synthetics.generated';
import { CfnGroup } from './synthetics.generated';
import * as cdk from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

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
}

/**
 * Properties for defining a CloudWatch Synthetics Group
 */
export interface GroupProps {
  /**
   * A name for the group. Must contain only lowercase alphanumeric characters,
   * hyphens, or underscores, and be at most 64 characters.
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
@propertyInjectable
export class Group extends cdk.Resource implements IGroup {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-synthetics.Group';

  /**
   * Import an existing group by ARN
   */
  public static fromGroupArn(scope: Construct, id: string, groupArn: string): IGroup {
    const arnParts = cdk.Arn.split(groupArn, cdk.ArnFormat.COLON_RESOURCE_NAME);
    const groupName = arnParts.resourceName;

    if (!groupName) {
      throw new ValidationError(lit`GroupArnMissingName`, 'Group ARN must contain a group name', scope);
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
    }

    return new Import(scope, id);
  }

  /**
   * The ID of the group
   * @attribute
   */
  public readonly groupId: string;

  /**
   * The ARN of the group
   * @attribute
   */
  public readonly groupArn: string;

  /**
   * The name of the group
   * @attribute
   */
  @memoizedGetter
  public get groupName(): string {
    return this.getResourceNameAttribute(this._resource.ref);
  }

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
        produce: () => cdk.Names.uniqueResourceName(this, { maxLength: 64 }).toLowerCase(),
      }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.groupName && !cdk.Token.isUnresolved(props.groupName)) {
      if (props.groupName.length < 1 || props.groupName.length > 64) {
        throw new ValidationError(lit`InvalidGroupName`, `Group name must be between 1 and 64 characters, got: ${props.groupName.length}`, this);
      }
      if (!/^[0-9a-z_\-]+$/.test(props.groupName)) {
        throw new ValidationError(lit`InvalidGroupName`, `Group name must match the pattern ^[0-9a-z_\\-]+$, got: ${props.groupName}`, this);
      }
    }

    if (props.canaries && props.canaries.length > 10) {
      throw new ValidationError(lit`TooManyCanaries`, `A group can contain at most 10 canaries, got: ${props.canaries.length}`, this);
    }

    props.canaries?.forEach(canary => this._canaries.add(canary));

    this._resource = new CfnGroup(this, 'Resource', {
      name: this.physicalName,
      resourceArns: cdk.Lazy.list({
        produce: () => Array.from(this._canaries).map(canary => canary.canaryArn),
      }, { omitEmpty: true }),
    });

    this.groupId = this._resource.attrId;
    this.groupArn = cdk.Stack.of(this).formatArn({
      service: 'synthetics',
      resource: 'group',
      resourceName: this.groupName,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Add a canary to this group
   *
   * @param canary The canary to add to the group [disable-awslint:prefer-ref-interface]
   */
  @MethodMetadata()
  public addCanary(canary: ICanary): void {
    if (this._canaries.size >= 10) {
      throw new ValidationError(lit`TooManyCanaries`, 'A group can contain at most 10 canaries', this);
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
