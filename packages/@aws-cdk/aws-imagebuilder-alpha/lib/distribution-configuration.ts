import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnDistributionConfiguration } from 'aws-cdk-lib/aws-imagebuilder';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';

const DISTRIBUTION_CONFIGURATION_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.DistributionConfiguration');

// Fast Launch requires at least 6 parallel launches.
const MIN_PARALLEL_LAUNCHES = 6;

/**
 * An EC2 Image Builder Distribution Configuration.
 */
export interface IDistributionConfiguration extends cdk.IResource {
  /**
   * The ARN of the distribution configuration
   *
   * @attribute
   */
  readonly distributionConfigurationArn: string;

  /**
   * The name of the distribution configuration
   *
   * @attribute
   */
  readonly distributionConfigurationName: string;

  /**
   * Grant custom actions to the given grantee for the distribution configuration
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant read permissions to the given grantee for the distribution configuration
   *
   * @param grantee The principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
}

/**
 * The launch permissions for the AMI, defining which principals are allowed to access the AMI
 */
export interface AmiLaunchPermission {
  /**
   * The ARNs for the AWS Organizations organizational units to share the AMI with
   *
   * @default None
   */
  readonly organizationalUnitArns?: string[];

  /**
   * The ARNs for the AWS Organization that you want to share the AMI with
   *
   * @default None
   */
  readonly organizationArns?: string[];

  /**
   * Whether to make the AMI public. Block public access for AMIs must be disabled to make the AMI public.
   *
   * @default false
   */
  readonly isPublicUserGroup?: boolean;

  /**
   * The AWS account IDs to share the AMI with
   *
   * @default None
   */
  readonly accountIds?: string[];
}

/**
 * The SSM parameters to create or update for the distributed AMIs
 */
export interface SSMParameterConfigurations {
  /**
   * The AWS account ID that will own the SSM parameter in the given region. This must be one of the target accounts
   * that was included in the list of AMI distribution target accounts
   *
   * @default The current account is used
   */
  readonly amiAccount?: string;

  /**
   * The data type of the SSM parameter
   *
   * @default ssm.ParameterDataType.AWS_EC2_IMAGE
   */
  readonly dataType?: ssm.ParameterDataType;

  /**
   * The SSM parameter to create or update
   */
  readonly parameter: ssm.IStringParameter;
}

/**
 * The launch template to apply the distributed AMI to
 */
export interface LaunchTemplateConfiguration {
  /**
   * The launch template to apply the distributed AMI to. A new launch template version will be created for the
   * provided launch template with the distributed AMI applied.
   */
  readonly launchTemplate: ec2.ILaunchTemplate;

  /**
   * The AWS account ID that owns the launch template
   *
   * @default The current account is used
   */
  readonly accountId?: string;

  /**
   * Whether to set the new launch template version that is created as the default launch template version
   *
   * @default false
   */
  readonly setDefaultVersion?: boolean;
}

/**
 * The EC2 Fast Launch configuration to use for the Windows AMI
 */
export interface FastLaunchConfiguration {
  /**
   * Whether to enable fast launch for the AMI
   *
   * @default false
   */
  readonly enabled?: boolean;

  /**
   * The launch template that the fast-launch enabled Windows AMI uses when it launches Windows instances to create
   * pre-provisioned snapshots
   *
   * @default None
   */
  readonly launchTemplate?: ec2.ILaunchTemplate;

  /**
   * The maximum number of parallel instances that are launched for creating resources
   *
   * @default A maximum of 6 instances are launched in parallel
   */
  readonly maxParallelLaunches?: number;

  /**
   * The number of pre-provisioned snapshots to keep on hand for a fast-launch enabled Windows AMI
   *
   * @default 10 snapshots are kept pre-provisioned
   */
  readonly targetSnapshotCount?: number;
}

/**
 * The regional distribution settings to use for an AMI build
 */
export interface AmiDistribution {
  /**
   * The target region to distribute AMIs to
   *
   * @default The current region is used
   */
  readonly region?: string;

  /**
   * The tags to apply to the distributed AMIs
   *
   * @default None
   */
  readonly amiTags?: { [key: string]: string };

  /**
   * The description of the AMI
   *
   * @default None
   */
  readonly amiDescription?: string;

  /**
   * The KMS key to encrypt the distributed AMI with
   *
   * @default None
   */
  readonly amiKmsKey?: kms.IKey;

  /**
   * The launch permissions for the AMI, defining which principals are allowed to access the AMI
   *
   * @default None
   */
  readonly amiLaunchPermission?: AmiLaunchPermission;

  /**
   * The name to use for the distributed AMIs
   *
   * @default A name is generated from the image recipe name
   */
  readonly amiName?: string;

  /**
   * The account IDs to copy the output AMI to
   *
   * @default None
   */
  readonly amiTargetAccountIds?: string[];

  /**
   * The SSM parameters to create or update for the distributed AMIs
   *
   * @default None
   */
  readonly ssmParameters?: SSMParameterConfigurations[];

  /**
   * The launch templates to apply the distributed AMI to
   *
   * @default None
   */
  readonly launchTemplates?: LaunchTemplateConfiguration[];

  /**
   * The fast launch configurations to use for enabling EC2 Fast Launch on the distributed Windows AMI
   *
   * @default None
   * @see https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_EnableFastLaunch.html
   */
  readonly fastLaunchConfigurations?: FastLaunchConfiguration[];

  /**
   * The License Manager license configuration ARNs to apply to the distributed AMIs
   *
   * @default None
   */
  readonly licenseConfigurationArns?: string[];
}

/**
 * The regional distribution settings to use for a container build
 */
export interface ContainerDistribution {
  /**
   * The target region to distribute containers to
   *
   * @default The current region is used
   */
  readonly region?: string;

  /**
   * The destination repository to distribute the output container to
   *
   * @default The target repository in the container recipe is used
   */
  readonly containerRepository: Repository;

  /**
   * The description of the container image
   *
   * @default None
   */
  readonly containerDescription?: string;

  /**
   * The additional tags to apply to the distributed container images
   *
   * @default None
   */
  readonly containerTags?: string[];
}

/**
 * Properties for creating a Distribution Configuration resource
 */
export interface DistributionConfigurationProps {
  /**
   * The list of target regions and associated AMI distribution settings where the built AMI will be distributed. AMI
   * distributions may also be added with the `addAmiDistributions` method.
   *
   * @default None if container distributions are provided. Otherwise, at least one AMI or container distribution must
   *          be provided
   */
  readonly amiDistributions?: AmiDistribution[];

  /**
   * The list of target regions and associated container distribution settings where the built container will be
   * distributed. Container distributions may also be added with the `addContainerDistributions` method.
   *
   * @default None if AMI distributions are provided. Otherwise, at least one AMI or container distribution must be
   *          provided
   */
  readonly containerDistributions?: ContainerDistribution[];

  /**
   * The name of the distribution configuration.
   *
   * @default A name is generated
   */
  readonly distributionConfigurationName?: string;

  /**
   * The description of the distribution configuration.
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The tags to apply to the distribution configuration
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * A new or imported Distribution Configuration
 */
abstract class DistributionConfigurationBase extends cdk.Resource implements IDistributionConfiguration {
  /**
   * The ARN of the distribution configuration
   */
  abstract readonly distributionConfigurationArn: string;

  /**
   * The name of the distribution configuration
   */
  abstract readonly distributionConfigurationName: string;

  /**
   * Grant custom actions to the given grantee for the distribution configuration
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.distributionConfigurationArn],
      scope: this,
    });
  }

  /**
   * Grant read permissions to the given grantee for the distribution configuration
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:GetDistributionConfiguration');
  }
}

/**
 * The service in which a container should be registered
 */
export enum RepositoryService {
  /**
   * Indicates the container should be registered in ECR
   */
  ECR = 'ECR',
}

/**
 * A container repository used to distribute container images in EC2 Image Builder
 */
export abstract class Repository {
  /**
   * The ECR repository to use as the target container repository
   *
   * @param repository The ECR repository to use
   */
  public static fromEcr(repository: ecr.IRepository): Repository {
    class Import extends Repository {
      public readonly repositoryName: string = repository.repositoryName;
      public readonly service: RepositoryService = RepositoryService.ECR;
    }

    return new Import();
  }

  /**
   * The name of the container repository where the output container image is stored
   */
  abstract readonly repositoryName: string;

  /**
   * The service in which the container repository is hosted
   */
  abstract readonly service: RepositoryService;
}

/**
 * Represents an EC2 Image Builder Distribution Configuration.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/manage-distribution-settings.html
 */
@propertyInjectable
export class DistributionConfiguration extends DistributionConfigurationBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-imagebuilder-alpha.DistributionConfiguration';

  /**
   * Import an existing distribution configuration given its ARN.
   */
  public static fromDistributionConfigurationArn(
    scope: Construct,
    id: string,
    distributionConfigurationArn: string,
  ): IDistributionConfiguration {
    const distributionConfigurationName = cdk.Stack.of(scope).splitArn(
      distributionConfigurationArn,
      cdk.ArnFormat.SLASH_RESOURCE_NAME,
    ).resourceName!;

    class Import extends DistributionConfigurationBase {
      public readonly distributionConfigurationArn = distributionConfigurationArn;
      public readonly distributionConfigurationName = distributionConfigurationName;
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing distribution configuration given its name. The provided name must be normalized by converting
   * all alphabetical characters to lowercase, and replacing all spaces and underscores with hyphens.
   */
  public static fromDistributionConfigurationName(
    scope: Construct,
    id: string,
    distributionConfigurationName: string,
  ): IDistributionConfiguration {
    return this.fromDistributionConfigurationArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        resource: 'distribution-configuration',
        resourceName: distributionConfigurationName,
      }),
    );
  }

  /**
   * Return whether the given object is a DistributionConfiguration.
   */
  public static isDistributionConfiguration(x: any): x is DistributionConfiguration {
    return x !== null && typeof x === 'object' && DISTRIBUTION_CONFIGURATION_SYMBOL in x;
  }

  /**
   * The ARN of the distribution configuration
   */
  public readonly distributionConfigurationArn: string;

  /**
   * The name of the distribution configuration
   */
  public readonly distributionConfigurationName: string;

  private readonly amiDistributionsByRegion: { [region: string]: AmiDistribution } = {};
  private readonly containerDistributionsByRegion: {
    [region: string]: ContainerDistribution;
  } = {};

  public constructor(scope: Construct, id: string, props: DistributionConfigurationProps = {}) {
    super(scope, id, {
      physicalName:
        props.distributionConfigurationName ??
        cdk.Lazy.string({
          produce: () =>
            cdk.Names.uniqueResourceName(this, {
              maxLength: 128,
              separator: '-',
              allowedSpecialCharacters: '-',
            }).toLowerCase(), // Enforce lowercase for the auto-generated fallback
        }),
    });

    Object.defineProperty(this, DISTRIBUTION_CONFIGURATION_SYMBOL, { value: true });

    this.validateDistributionConfigurationName();

    this.addAmiDistributions(...(props.amiDistributions ?? []));
    this.addContainerDistributions(...(props.containerDistributions ?? []));

    const distributionConfiguration = new CfnDistributionConfiguration(this, 'Resource', {
      name: this.physicalName,
      description: props.description,
      distributions: cdk.Lazy.any({ produce: () => this.renderDistributions() }),
      tags: props.tags,
    });

    this.distributionConfigurationName = this.getResourceNameAttribute(distributionConfiguration.attrName);
    this.distributionConfigurationArn = this.getResourceArnAttribute(distributionConfiguration.attrArn, {
      service: 'imagebuilder',
      resource: 'distribution-configuration',
      resourceName: this.physicalName,
    });
  }

  /**
   * Adds AMI distribution settings to the distribution configuration
   *
   * @param amiDistributions The list of AMI distribution settings to apply
   */
  public addAmiDistributions(...amiDistributions: AmiDistribution[]): void {
    amiDistributions.forEach((amiDistribution) => {
      const region = amiDistribution.region ?? cdk.Stack.of(this).region;
      if (!cdk.Token.isUnresolved(region) && this.amiDistributionsByRegion[region]) {
        throw new cdk.ValidationError(
          `duplicate AMI distribution found for region "${region}"; only one AMI distribution per region is allowed`,
          this,
        );
      }

      this.amiDistributionsByRegion[region] = amiDistribution;
    });
  }

  /**
   * Adds container distribution settings to the distribution configuration
   *
   * @param containerDistributions The list of container distribution settings to apply
   */
  public addContainerDistributions(...containerDistributions: ContainerDistribution[]): void {
    containerDistributions.forEach((containerDistribution) => {
      const region = containerDistribution.region ?? cdk.Stack.of(this).region;
      if (this.containerDistributionsByRegion[region]) {
        throw new cdk.ValidationError('You may not specify multiple container distributions in the same region', this);
      }

      this.containerDistributionsByRegion[region] = containerDistribution;
    });
  }

  private validateDistributionConfigurationName() {
    if (cdk.Token.isUnresolved(this.physicalName)) {
      return; // Cannot validate unresolved tokens, given their actual value is rendered at deployment time
    }

    if (this.physicalName.length > 128) {
      throw new cdk.ValidationError('The distributionConfigurationName cannot be longer than 128 characters', this);
    }

    if (this.physicalName.includes(' ')) {
      throw new cdk.ValidationError('The distributionConfigurationName cannot contain spaces', this);
    }

    if (this.physicalName.includes('_')) {
      throw new cdk.ValidationError('The distributionConfigurationName cannot contain underscores', this);
    }

    if (this.physicalName !== this.physicalName.toLowerCase()) {
      throw new cdk.ValidationError('The distributionConfigurationName must be lowercase', this);
    }
  }

  private renderDistributions(): CfnDistributionConfiguration.DistributionProperty[] {
    if (
      !Object.keys(this.amiDistributionsByRegion).length &&
      !Object.keys(this.containerDistributionsByRegion).length
    ) {
      throw new cdk.ValidationError('You must specify at least one AMI or container distribution', this);
    }

    const distributionByRegion: { [region: string]: CfnDistributionConfiguration.DistributionProperty } =
      Object.fromEntries(
        Object.entries(this.amiDistributionsByRegion).map(
          ([region, distribution]): [string, CfnDistributionConfiguration.DistributionProperty] => [
            region,
            {
              region,
              amiDistributionConfiguration: this.buildAmiDistribution(distribution),
              fastLaunchConfigurations: this.buildFastLaunchConfigurations(distribution),
              launchTemplateConfigurations: this.buildLaunchTemplateConfigurations(distribution),
              ssmParameterConfigurations: this.buildSsmParameterConfigurations(distribution),
              licenseConfigurationArns: this.buildLicenseConfigurationArns(distribution),
            },
          ],
        ),
      );
    Object.values(this.containerDistributionsByRegion).forEach((containerDistribution) => {
      const region = containerDistribution.region ?? cdk.Stack.of(this).region;
      distributionByRegion[region] = {
        ...(distributionByRegion[region] ?? {}),
        region,
        containerDistributionConfiguration: this.buildContainerDistribution(containerDistribution),
      };
    });

    return Object.values(distributionByRegion);
  }

  private buildAmiDistribution(amiDistribution: AmiDistribution): object | undefined {
    const launchPermissions = this.buildAmiLaunchPermissions(amiDistribution);
    const amiDistributionConfiguration = {
      ...(Object.keys(amiDistribution.amiTags ?? {}).length && { AmiTags: amiDistribution.amiTags }),
      ...(amiDistribution.amiDescription !== undefined && { Description: amiDistribution.amiDescription }),
      ...(amiDistribution.amiKmsKey !== undefined && { KmsKeyId: amiDistribution.amiKmsKey.keyArn }),
      ...(launchPermissions && { LaunchPermissionConfiguration: launchPermissions }),
      ...(amiDistribution.amiName !== undefined && { Name: amiDistribution.amiName }),
      ...(amiDistribution.amiTargetAccountIds !== undefined && {
        TargetAccountIds: amiDistribution.amiTargetAccountIds,
      }),
    };

    return Object.keys(amiDistributionConfiguration).length ? amiDistributionConfiguration : undefined;
  }

  private buildContainerDistribution(containerDistribution: ContainerDistribution): object | undefined {
    return {
      ContainerTags: containerDistribution.containerTags,
      Description: containerDistribution.containerDescription,
      TargetRepository: {
        RepositoryName: containerDistribution.containerRepository.repositoryName,
        Service: containerDistribution.containerRepository.service,
      },
    };
  }

  private buildAmiLaunchPermissions(amiDistribution: AmiDistribution): object | undefined {
    const launchPermissions = {
      ...(amiDistribution.amiLaunchPermission?.organizationalUnitArns !== undefined && {
        OrganizationalUnitArns: amiDistribution.amiLaunchPermission?.organizationalUnitArns,
      }),
      ...(amiDistribution.amiLaunchPermission?.organizationArns !== undefined && {
        OrganizationArns: amiDistribution.amiLaunchPermission?.organizationArns,
      }),
      ...(amiDistribution.amiLaunchPermission?.isPublicUserGroup && {
        UserGroups: ['all'],
      }),
      ...(amiDistribution.amiLaunchPermission?.accountIds !== undefined && {
        UserIds: amiDistribution.amiLaunchPermission?.accountIds,
      }),
    };

    return Object.keys(launchPermissions).length ? launchPermissions : undefined;
  }

  private buildFastLaunchConfigurations(
    amiDistribution: AmiDistribution,
  ): CfnDistributionConfiguration.FastLaunchConfigurationProperty[] | undefined {
    const fastLaunchConfigurations = amiDistribution.fastLaunchConfigurations?.map(
      (fastLaunchConfiguration): CfnDistributionConfiguration.FastLaunchConfigurationProperty => {
        if (
          fastLaunchConfiguration.maxParallelLaunches !== undefined &&
          !cdk.Token.isUnresolved(fastLaunchConfiguration.maxParallelLaunches) &&
          fastLaunchConfiguration.maxParallelLaunches < MIN_PARALLEL_LAUNCHES
        ) {
          throw new cdk.ValidationError('You must specify a maximum parallel launch count of at least 6', this);
        }

        const useFastLaunchLaunchTemplateId = fastLaunchConfiguration.launchTemplate?.launchTemplateId !== undefined;
        const launchTemplate: CfnDistributionConfiguration.FastLaunchLaunchTemplateSpecificationProperty = {
          ...(useFastLaunchLaunchTemplateId && {
            launchTemplateId: fastLaunchConfiguration.launchTemplate?.launchTemplateId,
          }),
          ...(!useFastLaunchLaunchTemplateId && {
            launchTemplateName: fastLaunchConfiguration.launchTemplate?.launchTemplateName,
          }),
          ...(fastLaunchConfiguration.launchTemplate?.versionNumber !== undefined && {
            launchTemplateVersion: fastLaunchConfiguration.launchTemplate?.versionNumber,
          }),
        };

        return {
          enabled: fastLaunchConfiguration.enabled,
          maxParallelLaunches: fastLaunchConfiguration.maxParallelLaunches,
          ...(Object.keys(launchTemplate).length && { launchTemplate }),
          ...(fastLaunchConfiguration.targetSnapshotCount !== undefined && {
            snapshotConfiguration: { targetResourceCount: fastLaunchConfiguration.targetSnapshotCount },
          }),
        };
      },
    );

    return fastLaunchConfigurations?.length ? fastLaunchConfigurations : undefined;
  }

  private buildLaunchTemplateConfigurations(
    amiDistribution: AmiDistribution,
  ): CfnDistributionConfiguration.LaunchTemplateConfigurationProperty[] | undefined {
    const launchTemplateConfigurations = amiDistribution.launchTemplates?.map(
      (launchTemplateConfiguration): CfnDistributionConfiguration.LaunchTemplateConfigurationProperty => {
        if (!launchTemplateConfiguration.launchTemplate.launchTemplateId) {
          throw new cdk.ValidationError(
            'You must reference launch templates by ID in launch template configurations',
            this,
          );
        }

        return {
          accountId: launchTemplateConfiguration.accountId,
          launchTemplateId: launchTemplateConfiguration.launchTemplate.launchTemplateId,
          setDefaultVersion: launchTemplateConfiguration.setDefaultVersion,
        };
      },
    );

    return launchTemplateConfigurations?.length ? launchTemplateConfigurations : undefined;
  }

  private buildLicenseConfigurationArns(amiDistribution: AmiDistribution): string[] | undefined {
    const licenseConfigurationArns = amiDistribution.licenseConfigurationArns?.map(
      (licenseConfigurationArn) => licenseConfigurationArn,
    );

    return licenseConfigurationArns?.length ? licenseConfigurationArns : undefined;
  }

  private buildSsmParameterConfigurations(
    amiDistribution: AmiDistribution,
  ): CfnDistributionConfiguration.SsmParameterConfigurationProperty[] | undefined {
    const ssmParameterConfigurations = amiDistribution.ssmParameters?.map(
      (ssmParameterConfiguration): CfnDistributionConfiguration.SsmParameterConfigurationProperty => ({
        amiAccountId: ssmParameterConfiguration.amiAccount,
        dataType: ssmParameterConfiguration.dataType,
        parameterName: ssmParameterConfiguration.parameter.parameterName,
      }),
    );

    return ssmParameterConfigurations?.length ? ssmParameterConfigurations : undefined;
  }
}
