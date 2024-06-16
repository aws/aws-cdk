import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { CfnAddon } from './eks.generated';
import { IResource, Resource, Stack } from '../../core';

/**
 * Represents an Amazon EKS Add-On.
 */
export interface IAddon extends IResource {
  /**
   * Name of the Add-On.
   * @attribute
   */
  readonly addonName: string;
  /**
   * ARN of the Add-On.
   * @attribute
   */
  readonly addonArn: string;
}

/**
 * Properties for creating an Amazon EKS Add-On.
 */
export interface AddonProps {
  /**
   * Name of the Add-On.
   */
  readonly addonName: string;
  /**
   * Version of the Add-On.
   *
   * @default the latest version.
   */
  readonly addonVersion?: string;
  /**
   * The EKS cluster the Add-On is associated with.
   */
  readonly cluster: ICluster;
}

/**
 * Represents the attributes of an addon for an Amazon EKS cluster.
 */
export interface AddonAttributes {
  /**
   * The name of the addon.
   */
  readonly addonName: string;

  /**
   * The name of the Amazon EKS cluster the addon is associated with.
   */
  readonly clusterName: string;
}

/**
 * Represents an Amazon EKS Add-On.
 */
export class Addon extends Resource implements IAddon {
  /**
   * Creates an Iaddon instance from the given Add-On name.
   * @param scope The parent construct.
   * @param id The construct ID.
   * @param addonName The name of the Add-On.
   * @returns An Iaddon instance.
   */
  public static fromAddonAttributes(scope: Construct, id: string, attrs: AddonAttributes): IAddon {
    class Import extends Resource implements IAddon {
      public readonly addonName = attrs.addonName;
      public readonly addonArn = Stack.of(scope).formatArn({
        service: 'eks',
        resource: 'addon',
        resourceName: `${attrs.clusterName}/${attrs.addonName}`,
      });
    }
    return new Import(scope, id);
  }

  public readonly addonName: string;
  public readonly addonArn: string;
  private readonly clusterName: string;

  /**
   * Creates a new Amazon EKS Add-On.
   * @param scope The parent construct.
   * @param id The construct ID.
   * @param props The properties for the Add-On.
   */
  constructor(scope: Construct, id: string, props: AddonProps) {
    super(scope, id, {
      physicalName: props.addonName,
    });

    this.clusterName = props.cluster.clusterName;
    this.addonName = props.addonName;

    const resource = new CfnAddon(this, 'Resource', {
      addonName: props.addonName,
      clusterName: this.clusterName,
    });

    this.addonName = this.getResourceNameAttribute(resource.ref);
    this.addonArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'eks',
      resource: 'addon',
      resourceName: `${this.clusterName}/${this.addonName}/`,
    });
  }
}
