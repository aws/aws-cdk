import { CfnAddon } from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ArnFormat, IResource, Resource, Stack, Fn } from 'aws-cdk-lib/core';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { ICluster } from './cluster';

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
   * Version of the Add-On. You can check all available versions with describe-addon-versions.
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

  /**
   * The configuration values for the Add-on.
   *
   * @default - Use default configuration.
   */
  readonly configurationValues?: Record<string, any>;
  /**
   * The namespace configuration for the addon.
   * This specifies the Kubernetes namespace where the addon is installed.
   *
   * @default - Use addon's default namespace.
   */
  readonly namespace?: string;
  /**
   * An array of EKS Pod Identity associations owned by the add-on.
   *
   * @default - No Pod Identity associations.
   */
  readonly podIdentityAssociations?: PodIdentityAssociation[];
  /**
   * How to resolve field value conflicts for an Amazon EKS add-on.
   *
   * @default - NONE (Conflicts are not resolved)
   */
  readonly resolveConflicts?: ResolveConflictsType;
  /**
   * The IAM role to bind to the add-on's service account.
   *
   * @default - No role is bound to the add-on's service account.
   */
  readonly serviceAccountRole?: iam.IRole;
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
 * EKS cluster IP family.
 */
export enum ResolveConflictsType {
  /**
   * If the self-managed version of the add-on is installed on your cluster,
   * Amazon EKS doesn't change the value. Creation of the add-on might fail.
   */
  None = 'NONE',
  /**
   * If the self-managed version of the add-on is installed on your cluster
   * and the Amazon EKS default value is different than the existing value,
   * Amazon EKS changes the value to the Amazon EKS default value.
   */
  Overwrite = 'OVERWRITE',
  /**
   * This is similar to the NONE option.
   * If the self-managed version of the add-on is installed on your cluster
   * Amazon EKS doesn't change the add-on resource properties.
   * Creation of the add-on might fail if conflicts are detected.
   * This option works differently during the update operation.
   */
  Preserve = 'PRESERVE',
}

/**
 * Represents the attributes of an addon for an Amazon EKS cluster.
 */
export interface PodIdentityAssociation {
  /**
   * The Role of the addon.
   */
  readonly addonRole: iam.Role;

  /**
   * The name of the Kubernetes service account inside the cluster to associate the IAM credentials with.
   */
  readonly serviceAccount: string;
}

/**
 * Represents an Amazon EKS Add-On.
 * @resource AWS::EKS::Addon
 */
@propertyInjectable
export class Addon extends Resource implements IAddon {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-eks-v2-alpha.Addon';

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

  private readonly clusterName: string;
  private resource: CfnAddon;

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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.clusterName = props.cluster.clusterName;

    const podIdentityAssociations = props.podIdentityAssociations?.map(value => {
      return {
        roleArn: value.addonRole.roleArn,
        serviceAccount: value.serviceAccount,
      };
    });

    this.resource = new CfnAddon(this, 'Resource', {
      addonName: props.addonName,
      clusterName: this.clusterName,
      addonVersion: props.addonVersion,
      preserveOnDelete: props.preserveOnDelete,
      configurationValues: this.stack.toJsonString(props.configurationValues),
      namespaceConfig: props.namespace ? { namespace: props.namespace } : undefined,
      podIdentityAssociations: podIdentityAssociations,
      resolveConflicts: props.resolveConflicts,
      serviceAccountRoleArn: props.serviceAccountRole?.roleArn,
    });
  }

  /**
   * Name of the addon.
   */
  @memoizedGetter
  public get addonName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  @memoizedGetter
  public get addonArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'eks',
      resource: 'addon',
      resourceName: `${this.clusterName}/${this.addonName}/`,
    });
  }
}
