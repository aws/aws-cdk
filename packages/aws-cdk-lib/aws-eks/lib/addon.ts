import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { CfnAddon } from './eks.generated';
import { IResource, Resource, Stack, Aws } from '../../core';

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
  public static fromAddonName(scope: Construct, id: string, addonName: string): IAddon {
    class Import extends Resource implements IAddon {
      public readonly addonName = addonName;
      public readonly addonArn = `arn:${Aws.PARTITION}:addon:${Stack.of(scope).region}:${Stack.of(scope).account}:${addonName}`;
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
    this.addonArn = 'dummy';
    // arn:aws:eks:us-east-1:903779448426:addon/Cluster9EE0221C-a380add2c2eb4144b5bdfa2b022815b9/eks-pod-identity-agent/2ac81096-e9e0-e60a-f5b9-946ae35b3e1e
    this.addonArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'eks',
      resource: 'addon',
      resourceName: `${this.clusterName}/${this.addonName}/`,
    });
  }

  // private getResourceArnAttribute(): string {
  //   // Implement the logic to get the ARN of the addon
  //   return Lazy.stringValue({ produce: () => `arn:aws:addon:${Stack.of(this).region}:${Stack.of(this).account}:${this.addonName}` });
  // }
}
