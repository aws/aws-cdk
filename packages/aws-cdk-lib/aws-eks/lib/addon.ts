import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { CfnAddon } from './eks.generated';
import { ArnFormat, IResource, Resource, Stack, Fn } from '../../core';

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
   * Version of the Add-On. You can check all available versions with describe-addon-versons.
   * For example, this lists all available versions for the `eks-pod-identity-agent` addon:
   * $ aws eks describe-addon-versions --addon-name eks-pod-identity-agent \
   * --query 'addons[*].addonVersions[*].addonVersion'
   *
   * @default the latest version.
   */
  readonly addonVersion?: string;
  /**
   * The EKS cluster the Add-On is associated with.
   */
  readonly cluster: ICluster;
  /**
   * Specifying this option preserves the add-on software on your cluster but Amazon EKS stops managing any settings for the add-on.
   * If an IAM account is associated with the add-on, it isn't removed.
   *
   * @default true
   */
  readonly preserveOnDelete?: boolean;
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
   * Creates an `IAddon` instance from the given addon attributes.
   *
   * @param scope - The parent construct.
   * @param id - The construct ID.
   * @param attrs - The attributes of the addon, including the addon name and the cluster name.
   * @returns An `IAddon` instance.
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
  /**
   * Creates an `IAddon` from an existing addon ARN.
   *
   * @param scope - The parent construct.
   * @param id - The ID of the construct.
   * @param addonArn - The ARN of the addon.
   * @returns An `IAddon` implementation.
   */
  public static fromAddonArn(scope: Construct, id: string, addonArn: string): IAddon {
    const parsedArn = Stack.of(scope).splitArn(addonArn, ArnFormat.COLON_RESOURCE_NAME);
    const splitResourceName = Fn.split('/', parsedArn.resourceName!);
    class Import extends Resource implements IAddon {
      public readonly addonName = Fn.select(1, splitResourceName);
      public readonly addonArn = addonArn;
    }

    return new Import(scope, id);
  }

  /**
   * Name of the addon.
   */
  public readonly addonName: string;
  /**
   * Arn of the addon.
   */
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
      addonVersion: props.addonVersion,
      preserveOnDelete: props.preserveOnDelete,
    });

    this.addonName = this.getResourceNameAttribute(resource.ref);
    this.addonArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'eks',
      resource: 'addon',
      resourceName: `${this.clusterName}/${this.addonName}/`,
    });
  }
}
