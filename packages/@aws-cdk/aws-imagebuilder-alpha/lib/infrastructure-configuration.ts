import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnInfrastructureConfiguration } from 'aws-cdk-lib/aws-imagebuilder';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';

const INFRASTRUCTURE_CONFIGURATION_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.InfrastructureConfiguration');

/**
 * An EC2 Image Builder Infrastructure Configuration.
 */
export interface IInfrastructureConfiguration extends cdk.IResource {
  /**
   * The ARN of the infrastructure configuration
   *
   * @attribute
   */
  readonly infrastructureConfigurationArn: string;

  /**
   * The name of the infrastructure configuration
   *
   * @attribute
   */
  readonly infrastructureConfigurationName: string;

  /**
   * Grant custom actions to the given grantee for the infrastructure configuration
   *
   * @param grantee - The principal
   * @param actions - The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant read permissions to the given grantee for the infrastructure configuration
   *
   * @param grantee - The principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Indicates whether a signed token header is required for instance metadata retrieval requests.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/APIReference/API_InstanceMetadataOptions.html#imagebuilder-Type-InstanceMetadataOptions-httpTokens
 */
export enum HttpTokens {
  /**
   * Allows retrieval of instance metadata with or without a signed token header in the request
   */
  OPTIONAL = 'optional',

  /**
   * Requires a signed token header in instance metadata retrieval requests
   */
  REQUIRED = 'required',
}

/**
 * The tenancy to use for an instance.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/APIReference/API_Placement.html#imagebuilder-Type-Placement-tenancy
 */
export enum Tenancy {
  /**
   * Instances will be launched with default tenancy
   */
  DEFAULT = 'default',

  /**
   * Instances will be launched with dedicated tenancy
   */
  DEDICATED = 'dedicated',

  /**
   * Instances will be launched on a dedicated host
   */
  HOST = 'host',
}

/**
 * The log settings for detailed build logging
 */
export interface InfrastructureConfigurationLogging {
  /**
   * The S3 logging bucket to use for detailed build logging
   */
  readonly s3Bucket: s3.IBucket;

  /**
   * The S3 logging prefix to use for detailed build logging
   *
   * @default No prefix
   */
  readonly s3KeyPrefix?: string;
}

/**
 * Properties for creating an Infrastructure Configuration resource
 */
export interface InfrastructureConfigurationProps {
  /**
   * The name of the infrastructure configuration. This name must be normalized by transforming all alphabetical
   * characters to lowercase, and replacing all spaces and underscores with hyphens.
   *
   * @default A name is generated
   */
  readonly infrastructureConfigurationName?: string;

  /**
   * The description of the infrastructure configuration.
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The instance types to launch build and test EC2 instances with.
   *
   * @default Image Builder will choose from a default set of instance types compatible with the AMI
   */
  readonly instanceTypes?: ec2.InstanceType[];

  /**
   * The instance profile to associate with the instance used to customize the AMI.
   *
   * By default, an instance profile and role will be created with minimal permissions needed to build the image,
   * attached to the EC2 instance.
   *
   * If an S3 logging bucket and key prefix is provided, an IAM inline policy will be attached to the instance profile's
   * role, allowing s3:PutObject permissions on the bucket.
   *
   * @default An instance profile will be generated
   */
  readonly instanceProfile?: iam.IInstanceProfile;
  /**
   * An IAM role to associate with the instance profile used by Image Builder
   *
   * The role must be assumable by the service principal `ec2.amazonaws.com`:
   * Note: You can provide an instanceProfile or a role, but not both.
   *
   * @example
   * const role = new iam.Role(this, 'MyRole', {
   *   assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
   * });
   *
   * @default A role will automatically be created, it can be accessed via the `role` property
   */
  readonly role?: iam.IRole;

  /**
   * The VPC to place the instance used to customize the AMI.
   *
   * @default The default VPC will be used
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Select which subnet to place the instance used to customize the AMI. The first subnet that is selected will be used.
   * You must specify the VPC to customize the subnet selection.
   *
   * @default The first subnet selected from the provided VPC will be used
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The security groups to associate with the instance used to customize the AMI.
   *
   * @default The default security group for the VPC will be used
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The key pair used to connect to the build and test EC2 instances. The key pair can be used to log into the build
   * or test instances for troubleshooting any failures.
   *
   * @default None
   */
  readonly keyPair?: ec2.IKeyPair;

  /**
   * Whether to terminate the EC2 instance when the build or test workflow fails.
   *
   * @default true
   */
  readonly terminateInstanceOnFailure?: boolean;

  /**
   * The maximum number of hops that an instance metadata request can traverse to reach its destination. By default,
   * this is set to 2.
   *
   * @default 2
   */
  readonly httpPutResponseHopLimit?: number;

  /**
   * Indicates whether a signed token header is required for instance metadata retrieval requests. By default, this is
   * set to `required` to require IMDSv2 on build and test EC2 instances.
   *
   * @default HttpTokens.REQUIRED
   */
  readonly httpTokens?: HttpTokens;

  /**
   * The SNS topic on which notifications are sent when an image build completes.
   *
   * @default No notifications are sent
   */
  readonly notificationTopic?: sns.ITopic;

  /**
   * The log settings for detailed build logging.
   *
   * @default None
   */
  readonly logging?: InfrastructureConfigurationLogging;

  /**
   * The availability zone to place Image Builder build and test EC2 instances.
   *
   * @default EC2 will select a random zone
   */
  readonly ec2InstanceAvailabilityZone?: string;

  /**
   * The ID of the Dedicated Host on which build and test instances run. This only applies if the instance tenancy is
   * `host`. This cannot be used with the `ec2InstanceHostResourceGroupArn` parameter.
   *
   * @default None
   */
  readonly ec2InstanceHostId?: string;

  /**
   * The ARN of the host resource group on which build and test instances run. This only applies if the instance tenancy
   * is `host`. This cannot be used with the `ec2InstanceHostId` parameter.
   *
   * @default None
   */
  readonly ec2InstanceHostResourceGroupArn?: string;

  /**
   * The tenancy of the instance. Dedicated tenancy runs instances on single-tenant hardware, while host tenancy runs
   * instances on a dedicated host. Shared tenancy is used by default.
   *
   * @default Tenancy.DEFAULT
   */
  readonly ec2InstanceTenancy?: Tenancy;

  /**
   * The additional tags to assign to the Amazon EC2 instance that Image Builder launches during the build process.
   *
   * @default None
   */
  readonly resourceTags?: { [key: string]: string };

  /**
   * The tags to apply to the infrastructure configuration
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Context information passed when an Infrastructure Configuration is being consumed
 *
 * @internal
 */
export interface InfrastructureConfigurationBindOptions {
  /**
   * Indicates whether the infrastructure configuration is being consumed inside of a container build
   */
  readonly isContainerBuild?: boolean;
}

/**
 * A new or imported Infrastructure Configuration
 */
abstract class InfrastructureConfigurationBase extends cdk.Resource implements IInfrastructureConfiguration {
  /**
   * The ARN of the infrastructure configuration
   */
  abstract readonly infrastructureConfigurationArn: string;
  /**
   * The name of the infrastructure configuration
   */
  abstract readonly infrastructureConfigurationName: string;

  /**
   * Grant custom actions to the given grantee for the infrastructure configuration
   *
   * @param grantee - The principal
   * @param actions - The list of actions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.infrastructureConfigurationArn],
      scope: this,
    });
  }

  /**
   * Grant read permissions to the given grantee for the infrastructure configuration
   *
   * @param grantee - The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:GetInfrastructureConfiguration');
  }
}

/**
 * Represents an EC2 Image Builder Infrastructure Configuration.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/manage-infra-config.html
 */
@propertyInjectable
export class InfrastructureConfiguration extends InfrastructureConfigurationBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-imagebuilder-alpha.InfrastructureConfiguration';

  /**
   * Import an existing infrastructure configuration given its ARN.
   */
  public static fromInfrastructureConfigurationArn(
    scope: Construct,
    id: string,
    infrastructureConfigurationArn: string,
  ): IInfrastructureConfiguration {
    const infrastructureConfigurationName = cdk.Stack.of(scope).splitArn(
      infrastructureConfigurationArn,
      cdk.ArnFormat.SLASH_RESOURCE_NAME,
    ).resourceName!;

    class Import extends InfrastructureConfigurationBase {
      public readonly infrastructureConfigurationArn = infrastructureConfigurationArn;
      public readonly infrastructureConfigurationName = infrastructureConfigurationName;
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing infrastructure configuration given its name. The provided name must be normalized by converting
   * all alphabetical characters to lowercase, and replacing all spaces and underscores with hyphens.
   */
  public static fromInfrastructureConfigurationName(
    scope: Construct,
    id: string,
    infrastructureConfigurationName: string,
  ): IInfrastructureConfiguration {
    return InfrastructureConfiguration.fromInfrastructureConfigurationArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        resource: 'infrastructure-configuration',
        resourceName: infrastructureConfigurationName,
      }),
    );
  }

  /**
   * Return whether the given object is an InfrastructureConfiguration.
   */
  public static isInfrastructureConfiguration(x: any): x is InfrastructureConfiguration {
    return x !== null && typeof x === 'object' && INFRASTRUCTURE_CONFIGURATION_SYMBOL in x;
  }

  /**
   * The ARN of the infrastructure configuration
   */
  public readonly infrastructureConfigurationArn: string;

  /**
   * The name of the infrastructure configuration
   */
  public readonly infrastructureConfigurationName: string;

  /**
   * The EC2 instance profile to use for the build
   */
  public readonly instanceProfile: iam.IInstanceProfile;

  /**
   * The role associated with the EC2 instance profile used for the build
   */
  public readonly role?: iam.IRole;

  /**
   * The bucket used to upload image build logs
   */
  public readonly logBucket?: s3.IBucket;

  private readonly autoGeneratedInstanceProfileRole?: iam.IRole;

  public constructor(scope: Construct, id: string, props: InfrastructureConfigurationProps = {}) {
    super(scope, id, {
      physicalName:
        props.infrastructureConfigurationName ??
        cdk.Lazy.string({
          produce: () =>
            cdk.Names.uniqueResourceName(this, {
              maxLength: 128,
              separator: '-',
              allowedSpecialCharacters: '-',
            }).toLowerCase(), // Enforce lowercase for the auto-generated fallback
        }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    Object.defineProperty(this, INFRASTRUCTURE_CONFIGURATION_SYMBOL, { value: true });

    this.validateInfrastructureConfigurationName();

    if (props.subnetSelection && !props.vpc) {
      throw new cdk.ValidationError('A vpc must be provided when using subnetSelection', this);
    }

    const selectedSubnets = props.vpc?.selectSubnets(props.subnetSelection);
    if (props.vpc && selectedSubnets && selectedSubnets.subnetIds.length === 0) {
      throw new cdk.ValidationError('No subnets matched the given subnetSelection for the provided VPC.', this);
    }

    if (props.instanceProfile && props.role) {
      throw new cdk.ValidationError('Both an instance profile and a role cannot be provided', this);
    }

    if (!cdk.Token.isUnresolved(props.ec2InstanceTenancy)) {
      if (props.ec2InstanceTenancy === Tenancy.HOST) {
        if (props.ec2InstanceHostId === undefined && props.ec2InstanceHostResourceGroupArn === undefined) {
          throw new cdk.ValidationError(
            'ec2InstanceHostId or ec2InstanceHostResourceGroupArn must be specified when ec2InstanceTenancy is set to host',
            this,
          );
        }
      } else {
        if (props.ec2InstanceHostId !== undefined) {
          throw new cdk.ValidationError(
            'ec2InstanceHostId cannot be specified unless ec2InstanceTenancy is set to host',
            this,
          );
        }

        if (props.ec2InstanceHostResourceGroupArn !== undefined) {
          throw new cdk.ValidationError(
            'ec2InstanceHostResourceGroupArn cannot be specified unless ec2InstanceTenancy is set to host',
            this,
          );
        }
      }
    }

    if (props.ec2InstanceHostId !== undefined && props.ec2InstanceHostResourceGroupArn !== undefined) {
      throw new cdk.ValidationError(
        'ec2InstanceHostId and ec2InstanceHostResourceGroupArn cannot be used together',
        this,
      );
    }

    if (props.httpPutResponseHopLimit !== undefined && props.httpPutResponseHopLimit < 1) {
      throw new cdk.ValidationError('httpPutResponseHopLimit must be at least 1', this);
    }

    if (props.httpPutResponseHopLimit !== undefined && props.httpPutResponseHopLimit > 64) {
      throw new cdk.ValidationError('httpPutResponseHopLimit must be at most 64', this);
    }

    if (!props.instanceProfile && !props.role) {
      this.autoGeneratedInstanceProfileRole = new iam.Role(this, 'InstanceProfileRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
          iam.ManagedPolicy.fromAwsManagedPolicyName('EC2InstanceProfileForImageBuilder'),
        ],
      });
      this.role = this.autoGeneratedInstanceProfileRole;
    }

    this.instanceProfile =
      props.instanceProfile ||
      new iam.InstanceProfile(this, 'InstanceProfile', { role: props.role ?? this.autoGeneratedInstanceProfileRole });

    this.role = this.instanceProfile.role;
    this.logBucket = props.logging?.s3Bucket;

    if (this.logBucket && this.role) {
      this.logBucket.grantPut(this.role, props.logging?.s3KeyPrefix ? `${props.logging.s3KeyPrefix}/*` : '*');
    }

    const hasPlacementOptions =
      props.ec2InstanceAvailabilityZone !== undefined ||
      props.ec2InstanceHostId !== undefined ||
      props.ec2InstanceHostResourceGroupArn !== undefined ||
      props.ec2InstanceTenancy !== undefined;
    const placement: CfnInfrastructureConfiguration.PlacementProperty | undefined = hasPlacementOptions
      ? {
        ...(props.ec2InstanceAvailabilityZone !== undefined && {
          availabilityZone: props.ec2InstanceAvailabilityZone,
        }),
        ...(props.ec2InstanceHostId !== undefined && { hostId: props.ec2InstanceHostId }),
        ...(props.ec2InstanceHostResourceGroupArn !== undefined && {
          hostResourceGroupArn: props.ec2InstanceHostResourceGroupArn,
        }),
        ...(props.ec2InstanceTenancy !== undefined && { tenancy: props.ec2InstanceTenancy }),
      }
      : undefined;

    const infrastructureConfiguration = new CfnInfrastructureConfiguration(this, 'Resource', {
      name: this.physicalName,
      instanceProfileName: this.instanceProfile.instanceProfileName,
      description: props.description,
      instanceMetadataOptions: {
        httpTokens: props.httpTokens ?? HttpTokens.REQUIRED,
        httpPutResponseHopLimit: props.httpPutResponseHopLimit ?? 2,
      },
      instanceTypes: props.instanceTypes?.length
        ? props.instanceTypes?.map((instanceType) => instanceType.toString())
        : undefined,
      keyPair: props.keyPair?.keyPairName,
      ...(props.logging && {
        logging: {
          s3Logs: {
            s3BucketName: props.logging?.s3Bucket.bucketName,
            s3KeyPrefix: props.logging?.s3KeyPrefix,
          },
        },
      }),
      ...(placement && { placement }),
      resourceTags: props.resourceTags,
      securityGroupIds: props.securityGroups?.length
        ? props.securityGroups?.map((securityGroup) => securityGroup.securityGroupId)
        : undefined,
      subnetId: props.vpc?.selectSubnets(props.subnetSelection).subnetIds[0],
      snsTopicArn: props.notificationTopic?.topicArn,
      tags: props.tags,
      terminateInstanceOnFailure: props.terminateInstanceOnFailure,
    });

    this.infrastructureConfigurationName = this.getResourceNameAttribute(infrastructureConfiguration.attrName);
    this.infrastructureConfigurationArn = this.getResourceArnAttribute(infrastructureConfiguration.attrArn, {
      service: 'imagebuilder',
      resource: 'infrastructure-configuration',
      resourceName: this.physicalName,
    });
  }

  private validateInfrastructureConfigurationName() {
    if (cdk.Token.isUnresolved(this.physicalName)) {
      return; // Cannot validate unresolved tokens, given their actual value is rendered at deployment time
    }

    if (this.physicalName.length > 128) {
      throw new cdk.ValidationError('The infrastructureConfigurationName cannot be longer than 128 characters', this);
    }

    if (this.physicalName.includes(' ')) {
      throw new cdk.ValidationError('The infrastructureConfigurationName cannot contain spaces', this);
    }

    if (this.physicalName.includes('_')) {
      throw new cdk.ValidationError('The infrastructureConfigurationName cannot contain underscores', this);
    }

    if (this.physicalName !== this.physicalName.toLowerCase()) {
      throw new cdk.ValidationError('The infrastructureConfigurationName must be lowercase', this);
    }
  }

  /**
   * @internal
   */
  public _bind(options: InfrastructureConfigurationBindOptions) {
    if (options.isContainerBuild) {
      this.autoGeneratedInstanceProfileRole?.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName('EC2InstanceProfileForImageBuilderECRContainerBuilds'),
      );
    }
  }
}
