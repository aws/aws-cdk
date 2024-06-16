import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { CfnAddon } from './eks.generated';
import { IResource, Resource, Stack, Aws } from '../../core';

/**
 * Represents an Amazon EKS Add-On.
 */
export interface IAddOn extends IResource {
  /**
   * Name of the Add-On.
   */
  readonly addOnName: string;
  /**
   * ARN of the Add-On.
   */
  readonly addOnArn: string;
}

/**
 * Properties for creating an Amazon EKS Add-On.
 */
export interface AddOnProps {
  /**
   * Name of the Add-On.
   */
  readonly addOnName: string;
  /**
   * Version of the Add-On.
   */
  readonly addOnVersion?: string;
  /**
   * The EKS cluster the Add-On is associated with.
   */
  readonly cluster: ICluster;
}

/**
 * Represents an Amazon EKS Add-On.
 */
export class AddOn extends Resource implements IAddOn {
  /**
   * Creates an IAddOn instance from the given Add-On name.
   * @param scope The parent construct.
   * @param id The construct ID.
   * @param addOnName The name of the Add-On.
   * @returns An IAddOn instance.
   */
  public static fromAddOnName(scope: Construct, id: string, addOnName: string): IAddOn {
    class Import extends Resource implements IAddOn {
      public readonly addOnName = addOnName;
      public readonly addOnArn = `arn:${Aws.PARTITION}:addon:${Stack.of(scope).region}:${Stack.of(scope).account}:${addOnName}`;
    }
    return new Import(scope, id);
  }

  public readonly addOnName: string;
  public readonly addOnArn: string;
  private readonly clusterName: string;
  private readonly addonName: string;

  /**
   * Creates a new Amazon EKS Add-On.
   * @param scope The parent construct.
   * @param id The construct ID.
   * @param props The properties for the Add-On.
   */
  constructor(scope: Construct, id: string, props: AddOnProps) {
    super(scope, id, {
      physicalName: props.addOnName,
    });

    this.clusterName = props.cluster.clusterName;
    this.addonName = props.addOnName;

    const resource = new CfnAddon(this, 'Resource', {
      addonName: props.addOnName,
      clusterName: this.clusterName,
    });

    this.addOnName = this.getResourceNameAttribute(resource.ref);
    this.addOnArn = 'dummy';
    // arn:aws:eks:us-east-1:903779448426:addon/Cluster9EE0221C-a380add2c2eb4144b5bdfa2b022815b9/eks-pod-identity-agent/2ac81096-e9e0-e60a-f5b9-946ae35b3e1e
    this.addOnArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'eks',
      resource: 'addon',
      resourceName: `${this.clusterName}/${this.addonName}/`,
    });
  }

  // private getResourceArnAttribute(): string {
  //   // Implement the logic to get the ARN of the AddOn
  //   return Lazy.stringValue({ produce: () => `arn:aws:addon:${Stack.of(this).region}:${Stack.of(this).account}:${this.addOnName}` });
  // }
}
