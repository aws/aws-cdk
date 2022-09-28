import * as ecr from '@aws-cdk/aws-ecr';
import * as assets from '@aws-cdk/aws-ecr-assets';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnService } from './apprunner.generated';
import { IVpcConnector } from './vpc-connector';

/**
 * The image repository types
 */
export enum ImageRepositoryType {
  /**
   * Amazon ECR Public
   */
  ECR_PUBLIC = 'ECR_PUBLIC',

  /**
   * Amazon ECR
   */
  ECR = 'ECR',
}

/**
 * The number of CPU units reserved for each instance of your App Runner service.
 *
 */
export class Cpu {
  /**
   * 1 vCPU
   */
  public static readonly ONE_VCPU = Cpu.of('1 vCPU')

  /**
   * 2 vCPU
   */
  public static readonly TWO_VCPU = Cpu.of('2 vCPU')

  /**
   * Custom CPU unit
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-instanceconfiguration.html#cfn-apprunner-service-instanceconfiguration-cpu
   *
   * @param unit custom CPU unit
   */
  public static of(unit: string) { return new Cpu(unit); }

  /**
   *
   * @param unit The unit of CPU.
   */
  private constructor(public readonly unit: string) {}
}


/**
 * The amount of memory reserved for each instance of your App Runner service.
 */
export class Memory {
  /**
   * 2 GB(for 1 vCPU)
   */
  public static readonly TWO_GB = Memory.of('2 GB')

  /**
   * 3 GB(for 1 vCPU)
   */
  public static readonly THREE_GB = Memory.of('3 GB')

  /**
   * 4 GB(for 1 or 2 vCPU)
   */
  public static readonly FOUR_GB = Memory.of('4 GB')

  /**
   * Custom Memory unit
   *
   * @param unit custom Memory unit
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-instanceconfiguration.html#cfn-apprunner-service-instanceconfiguration-memory
   */
  public static of(unit: string) { return new Memory(unit); }

  /**
   *
   * @param unit The unit of memory.
   */
  private constructor(public readonly unit: string) { }
}

/**
 * The code runtimes
 */
export class Runtime {

  /**
   * CORRETTO 8
   */
  public static readonly CORRETTO_8 = Runtime.of('CORRETTO_8')

  /**
   * CORRETTO 11
   */
  public static readonly CORRETTO_11 = Runtime.of('CORRETTO_11')

  /**
   * NodeJS 12
   */
  public static readonly NODEJS_12 = Runtime.of('NODEJS_12')

  /**
   * NodeJS 14
   */
  public static readonly NODEJS_14 = Runtime.of('NODEJS_14')

  /**
   * NodeJS 16
   */
  public static readonly NODEJS_16 = Runtime.of('NODEJS_16')

  /**
   * Python 3
   */
  public static readonly PYTHON_3 = Runtime.of('PYTHON_3')

  /**
   * Other runtimes
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfigurationvalues.html#cfn-apprunner-service-codeconfigurationvalues-runtime for all available runtimes.
   *
   * @param name runtime name
   *
   */
  public static of(name: string) { return new Runtime(name); }

  /**
   *
   * @param name The runtime name.
   */
  private constructor(public readonly name: string) { }
}

/**
 * The environment variable for the service.
 */
interface EnvironmentVariable {
  readonly name: string;
  readonly value: string;
}

/**
 * Result of binding `Source` into a `Service`.
 */
export interface SourceConfig {
  /**
   * The image repository configuration (mutually exclusive  with `codeRepository`).
   *
   * @default - no image repository.
   */
  readonly imageRepository?: ImageRepository;

  /**
   * The ECR repository (required to grant the pull privileges for the iam role).
   *
   * @default - no ECR repository.
   */
  readonly ecrRepository?: ecr.IRepository;

  /**
   * The code repository configuration (mutually exclusive  with `imageRepository`).
   *
   * @default - no code repository.
   */
  readonly codeRepository?: CodeRepositoryProps;
}

/**
 * Properties of the Github repository for `Source.fromGitHub()`
 */
export interface GithubRepositoryProps {
  /**
   * The code configuration values. Will be ignored if configurationSource is `REPOSITORY`.
   * @default - no values will be passed. The `apprunner.yaml` from the github reopsitory will be used instead.
   */
  readonly codeConfigurationValues?: CodeConfigurationValues;

  /**
   * The source of the App Runner configuration.
   */
  readonly configurationSource: ConfigurationSourceType;

  /**
   * The location of the repository that contains the source code.
   */
  readonly repositoryUrl: string;

  /**
   * The branch name that represents a specific version for the repository.
   *
   * @default main
   */
  readonly branch?: string;

  /**
   * ARN of the connection to Github. Only required for Github source.
   */
  readonly connection: GitHubConnection;
}


/**
 * Properties of the image repository for `Source.fromEcrPublic()`
 */
export interface EcrPublicProps {
  /**
   * The image configuration for the image from ECR Public.
   * @default - no image configuration will be passed. The default `port` will be 8080.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html#cfn-apprunner-service-imageconfiguration-port
   */
  readonly imageConfiguration?: ImageConfiguration;
  /**
   * The ECR Public image URI.
   */
  readonly imageIdentifier: string;
}

/**
 * Properties of the image repository for `Source.fromEcr()`
 */
export interface EcrProps {
  /**
   * The image configuration for the image from ECR.
   * @default - no image configuration will be passed. The default `port` will be 8080.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html#cfn-apprunner-service-imageconfiguration-port
   */
  readonly imageConfiguration?: ImageConfiguration;
  /**
   * Represents the ECR repository.
   */
  readonly repository: ecr.IRepository;
  /**
   * Image tag.
   * @default - 'latest'
   * @deprecated use `tagOrDigest`
   */
  readonly tag?: string;
  /**
   * Image tag or digest (digests must start with `sha256:`).
   * @default - 'latest'
   */
  readonly tagOrDigest?: string;
}

/**
 * Properties of the image repository for `Source.fromAsset()`
 */
export interface AssetProps {
  /**
   * The image configuration for the image built from the asset.
   * @default - no image configuration will be passed. The default `port` will be 8080.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html#cfn-apprunner-service-imageconfiguration-port
   */
  readonly imageConfiguration?: ImageConfiguration;
  /**
   * Represents the docker image asset.
   */
  readonly asset: assets.DockerImageAsset;
}


/**
 * Represents the App Runner service source.
 */
export abstract class Source {
  /**
   * Source from the GitHub repository.
   */
  public static fromGitHub(props: GithubRepositoryProps): GithubSource {
    return new GithubSource(props);
  }
  /**
   * Source from the ECR repository.
   */
  public static fromEcr(props: EcrProps): EcrSource {
    return new EcrSource(props);
  }
  /**
   * Source from the ECR Public repository.
   */
  public static fromEcrPublic(props: EcrPublicProps): EcrPublicSource {
    return new EcrPublicSource(props);
  }
  /**
   * Source from local assets.
   */
  public static fromAsset(props: AssetProps): AssetSource {
    return new AssetSource(props);
  }
  /**
    * Called when the Job is initialized to allow this object to bind.
    */
  public abstract bind(scope: Construct): SourceConfig;
}

/**
 * Represents the service source from a Github repository.
 */
export class GithubSource extends Source {
  private readonly props: GithubRepositoryProps
  constructor(props: GithubRepositoryProps) {
    super();
    this.props = props;
  }
  public bind(_scope: Construct): SourceConfig {
    return {
      codeRepository: {
        codeConfiguration: {
          configurationSource: this.props.configurationSource,
          configurationValues: this.props.codeConfigurationValues,
        },
        repositoryUrl: this.props.repositoryUrl,
        sourceCodeVersion: {
          type: 'BRANCH',
          value: this.props.branch ?? 'main',
        },
        connection: this.props.connection,
      },
    };
  }
}
/**
 * Represents the service source from ECR.
 */
export class EcrSource extends Source {
  private readonly props: EcrProps
  constructor(props: EcrProps) {
    super();
    this.props = props;
  }
  public bind(_scope: Construct): SourceConfig {
    return {
      imageRepository: {
        imageConfiguration: this.props.imageConfiguration,
        imageIdentifier: this.props.repository.repositoryUriForTagOrDigest(
          this.props.tagOrDigest || this.props.tag || 'latest',
        ),
        imageRepositoryType: ImageRepositoryType.ECR,
      },
      ecrRepository: this.props.repository,
    };
  }
}

/**
 * Represents the service source from ECR Public.
 */
export class EcrPublicSource extends Source {
  private readonly props: EcrPublicProps;
  constructor(props: EcrPublicProps) {
    super();
    this.props = props;
  }
  public bind(_scope: Construct): SourceConfig {
    return {
      imageRepository: {
        imageConfiguration: this.props.imageConfiguration,
        imageIdentifier: this.props.imageIdentifier,
        imageRepositoryType: ImageRepositoryType.ECR_PUBLIC,
      },
    };
  }
}

/**
 * Represents the source from local assets.
 */
export class AssetSource extends Source {
  private readonly props: AssetProps
  constructor(props: AssetProps) {
    super();
    this.props = props;
  }
  public bind(_scope: Construct): SourceConfig {
    return {
      imageRepository: {
        imageConfiguration: this.props.imageConfiguration,
        imageIdentifier: this.props.asset.imageUri,
        imageRepositoryType: ImageRepositoryType.ECR,
      },
      ecrRepository: this.props.asset.repository,
    };
  }
}

/**
 * Describes the configuration that AWS App Runner uses to run an App Runner service
 * using an image pulled from a source image repository.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html
 */
export interface ImageConfiguration {
  /**
   * The port that your application listens to in the container.
   *
   * @default 8080
   */
  readonly port?: number;

  /**
   * Environment variables that are available to your running App Runner service.
   *
   * @default - no environment variables
   */
  readonly environment?: { [key: string]: string };

  /**
   * An optional command that App Runner runs to start the application in the source image.
   * If specified, this command overrides the Docker image’s default start command.
   *
   * @default - no start command
   */
  readonly startCommand?: string;
}

/**
 * Describes a source image repository.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imagerepository.html
 */
export interface ImageRepository {
  /**
   * The identifier of the image. For `ECR_PUBLIC` imageRepositoryType, the identifier domain should
   * always be `public.ecr.aws`. For `ECR`, the pattern should be
   * `([0-9]{12}.dkr.ecr.[a-z\-]+-[0-9]{1}.amazonaws.com\/.*)`.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imagerepository.html for more details.
   */
  readonly imageIdentifier: string;

  /**
   * The type of the image repository. This reflects the repository provider and whether
   * the repository is private or public.
   */
  readonly imageRepositoryType: ImageRepositoryType;

  /**
   * Configuration for running the identified image.
   * @default - no image configuration will be passed. The default `port` will be 8080.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html#cfn-apprunner-service-imageconfiguration-port
   */
  readonly imageConfiguration?: ImageConfiguration;
}

/**
 * Identifies a version of code that AWS App Runner refers to within a source code repository.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-sourcecodeversion.html
 */
export interface SourceCodeVersion {
  /**
   * The type of version identifier.
   */
  readonly type: string;

  /**
   * A source code version.
   */
  readonly value: string;
}

/**
 * Properties of the CodeRepository.
 */
export interface CodeRepositoryProps {
  /**
   * Configuration for building and running the service from a source code repository.
   */
  readonly codeConfiguration: CodeConfiguration;

  /**
   * The location of the repository that contains the source code.
   */
  readonly repositoryUrl: string;

  /**
   * The version that should be used within the source code repository.
   */
  readonly sourceCodeVersion: SourceCodeVersion;

  /**
   * The App Runner connection for GitHub.
   */
  readonly connection: GitHubConnection;
}

/**
 * Properties of the AppRunner Service
 */
export interface ServiceProps {
  /**
   * The source of the repository for the service.
   */
  readonly source: Source;

  /**
   * The number of CPU units reserved for each instance of your App Runner service.
   *
   * @default Cpu.ONE_VCPU
   */
  readonly cpu?: Cpu;

  /**
   * The amount of memory reserved for each instance of your App Runner service.
   *
   * @default Memory.TWO_GB
   */
  readonly memory?: Memory;

  /**
   * The IAM role that grants the App Runner service access to a source repository.
   * It's required for ECR image repositories (but not for ECR Public repositories).
   *
   * The role must be assumable by the 'build.apprunner.amazonaws.com' service principal.
   *
   * @see https://docs.aws.amazon.com/apprunner/latest/dg/security_iam_service-with-iam.html#security_iam_service-with-iam-roles-service.access
   *
   * @default - generate a new access role.
   */
  readonly accessRole?: iam.IRole;

  /**
   * The IAM role that provides permissions to your App Runner service.
   * These are permissions that your code needs when it calls any AWS APIs.
   *
   * The role must be assumable by the 'tasks.apprunner.amazonaws.com' service principal.
   *
   * @see https://docs.aws.amazon.com/apprunner/latest/dg/security_iam_service-with-iam.html#security_iam_service-with-iam-roles-service.instance
   *
   * @default - no instance role attached.
   */
  readonly instanceRole?: iam.IRole;

  /**
   * Name of the service.
   *
   * @default - auto-generated if undefined.
   */
  readonly serviceName?: string;

  /**
   * Settings for an App Runner VPC connector to associate with the service.
   *
   * @default - no VPC connector, uses the DEFAULT egress type instead
   */
  readonly vpcConnector?: IVpcConnector;
}

/**
 * The source of the App Runner configuration.
 */
export enum ConfigurationSourceType {
  /**
   * App Runner reads configuration values from `the apprunner.yaml` file in the source code repository
   * and ignores `configurationValues`.
   */
  REPOSITORY = 'REPOSITORY',

  /**
   * App Runner uses configuration values provided in `configurationValues` and ignores the `apprunner.yaml`
   * file in the source code repository.
   */
  API = 'API',
}

/**
 * Describes the configuration that AWS App Runner uses to build and run an App Runner service
 * from a source code repository.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-codeconfiguration.html
 */
export interface CodeConfiguration {
  /**
   * The basic configuration for building and running the App Runner service.
   * Use it to quickly launch an App Runner service without providing a apprunner.yaml file in the
   * source code repository (or ignoring the file if it exists).
   *
   * @default - not specified. Use `apprunner.yaml` instead.
   */
  readonly configurationValues?: CodeConfigurationValues;

  /**
   * The source of the App Runner configuration.
   */
  readonly configurationSource: ConfigurationSourceType;
}

/**
 * Describes resources needed to authenticate access to some source repositories.
 * The specific resource depends on the repository provider.
 */
interface AuthenticationConfiguration {
  /**
   * The Amazon Resource Name (ARN) of the IAM role that grants the App Runner service access to a
   * source repository. It's required for ECR image repositories (but not for ECR Public repositories).
   *
   * @defult - no access role.
   */
  readonly accessRoleArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the App Runner connection that enables the App Runner service
   * to connect to a source repository. It's required for GitHub code repositories.
   *
   * @default - no connection.
   */
  readonly connectionArn?: string;
}

/**
 * Describes the basic configuration needed for building and running an AWS App Runner service.
 * This type doesn't support the full set of possible configuration options. Fur full configuration capabilities,
 * use a `apprunner.yaml` file in the source code repository.
 */
export interface CodeConfigurationValues {
  /**
   * The command App Runner runs to build your application.
   *
   * @default - no build command.
   */
  readonly buildCommand?: string;

  /**
   * The port that your application listens to in the container.
   *
   * @default 8080
   */
  readonly port?: string;

  /**
   * A runtime environment type for building and running an App Runner service. It represents
   * a programming language runtime.
   */
  readonly runtime: Runtime;

  /**
   * The environment variables that are available to your running App Runner service.
   *
   * @default - no environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * The command App Runner runs to start your application.
   *
   * @default - no start command.
   */
  readonly startCommand?: string;
}

/**
 * Represents the App Runner connection that enables the App Runner service to connect
 * to a source repository. It's required for GitHub code repositories.
 */
export class GitHubConnection {
  /**
   * Using existing App Runner connection by specifying the connection ARN.
   * @param arn connection ARN
   * @returns Connection
   */
  public static fromConnectionArn(arn: string): GitHubConnection {
    return new GitHubConnection(arn);
  }
  /**
   * The ARN of the Connection for App Runner service to connect to the repository.
   */
  public readonly connectionArn: string
  constructor(arn: string) {
    this.connectionArn = arn;
  }
}

/**
 * Attributes for the App Runner Service
 */
export interface ServiceAttributes {
  /**
   * The name of the service.
   */
  readonly serviceName: string;

  /**
   * The ARN of the service.
   */
  readonly serviceArn: string;

  /**
   * The URL of the service.
   */
  readonly serviceUrl: string;

  /**
   * The status of the service.
   */
  readonly serviceStatus: string;
}

/**
 * Represents the App Runner Service.
 */
export interface IService extends cdk.IResource {
  /**
   * The Name of the service.
   */
  readonly serviceName: string;

  /**
   * The ARN of the service.
   */
  readonly serviceArn: string;
}

/**
 * The App Runner Service.
 */
export class Service extends cdk.Resource {
  /**
   * Import from service name.
   */
  public static fromServiceName(scope: Construct, id: string, serviceName: string): IService {
    class Import extends cdk.Resource {
      public serviceName = serviceName;
      public serviceArn = cdk.Stack.of(this).formatArn({
        resource: 'service',
        service: 'apprunner',
        resourceName: serviceName,
      })
    }
    return new Import(scope, id);
  }

  /**
   * Import from service attributes.
   */
  public static fromServiceAttributes(scope: Construct, id: string, attrs: ServiceAttributes): IService {
    const serviceArn = attrs.serviceArn;
    const serviceName = attrs.serviceName;
    const serviceUrl = attrs.serviceUrl;
    const serviceStatus = attrs.serviceStatus;

    class Import extends cdk.Resource {
      public readonly serviceArn = serviceArn
      public readonly serviceName = serviceName
      public readonly serviceUrl = serviceUrl
      public readonly serviceStatus = serviceStatus
    }

    return new Import(scope, id);
  }
  private readonly props: ServiceProps;
  private accessRole?: iam.IRole;
  private source: SourceConfig;
  /**
   * Environment variables for this service
   */
  private environment?: { [key: string]: string } = {};

  /**
   * The ARN of the Service.
   * @attribute
   */
  readonly serviceArn: string;

  /**
   * The ID of the Service.
   * @attribute
   */
  readonly serviceId: string;

  /**
   * The URL of the Service.
   * @attribute
   */
  readonly serviceUrl: string;

  /**
   * The status of the Service.
   * @attribute
   */
  readonly serviceStatus: string;

  /**
   * The name of the service.
   * @attribute
   */
  readonly serviceName: string;

  public constructor(scope: Construct, id: string, props: ServiceProps) {
    super(scope, id);

    const source = props.source.bind(this);
    this.source = source;
    this.props = props;

    // generate an IAM role only when ImageRepositoryType is ECR and props.role is undefined
    this.accessRole = (this.source.imageRepository?.imageRepositoryType == ImageRepositoryType.ECR) ?
      this.props.accessRole ? this.props.accessRole : this.generateDefaultRole() : undefined;

    if (source.codeRepository?.codeConfiguration.configurationSource == ConfigurationSourceType.REPOSITORY &&
      source.codeRepository?.codeConfiguration.configurationValues) {
      throw new Error('configurationValues cannot be provided if the ConfigurationSource is Repository');
    }

    const resource = new CfnService(this, 'Resource', {
      instanceConfiguration: {
        cpu: props.cpu?.unit,
        memory: props.memory?.unit,
        instanceRoleArn: props.instanceRole?.roleArn,
      },
      sourceConfiguration: {
        authenticationConfiguration: this.renderAuthenticationConfiguration(),
        imageRepository: source.imageRepository ? this.renderImageRepository() : undefined,
        codeRepository: source.codeRepository ? this.renderCodeConfiguration() : undefined,
      },
      networkConfiguration: {
        egressConfiguration: {
          egressType: this.props.vpcConnector ? 'VPC' : 'DEFAULT',
          vpcConnectorArn: this.props.vpcConnector?.vpcConnectorArn,
        },
      },
    });

    // grant required privileges for the role
    if (source.ecrRepository && this.accessRole) {
      source.ecrRepository.grantPull(this.accessRole);
    }

    this.serviceArn = resource.attrServiceArn;
    this.serviceId = resource.attrServiceId;
    this.serviceUrl = resource.attrServiceUrl;
    this.serviceStatus = resource.attrStatus;
    this.serviceName = resource.ref;
  }
  private renderAuthenticationConfiguration(): AuthenticationConfiguration {
    return {
      accessRoleArn: this.accessRole?.roleArn,
      connectionArn: this.source.codeRepository?.connection?.connectionArn,
    };
  }
  private renderCodeConfiguration() {
    return {
      codeConfiguration: {
        configurationSource: this.source.codeRepository!.codeConfiguration.configurationSource,
        // codeConfigurationValues will be ignored if configurationSource is REPOSITORY
        codeConfigurationValues: this.source.codeRepository!.codeConfiguration.configurationValues ?
          this.renderCodeConfigurationValues(this.source.codeRepository!.codeConfiguration.configurationValues) : undefined,
      },
      repositoryUrl: this.source.codeRepository!.repositoryUrl,
      sourceCodeVersion: this.source.codeRepository!.sourceCodeVersion,
    };

  }
  private renderCodeConfigurationValues(props: CodeConfigurationValues): any {
    this.environment = props.environment;
    return {
      port: props.port,
      buildCommand: props.buildCommand,
      runtime: props.runtime.name,
      runtimeEnvironmentVariables: this.renderEnvironmentVariables(),
      startCommand: props.startCommand,
    };
  }
  private renderImageRepository(): any {
    const repo = this.source.imageRepository!;
    this.environment = repo.imageConfiguration?.environment;
    return Object.assign(repo, {
      imageConfiguration: {
        port: repo.imageConfiguration?.port?.toString(),
        startCommand: repo.imageConfiguration?.startCommand,
        runtimeEnvironmentVariables: this.renderEnvironmentVariables(),
      },
    });
  }

  private renderEnvironmentVariables(): EnvironmentVariable[] | undefined {
    if (this.environment) {
      let env: EnvironmentVariable[] = [];
      for (const [key, value] of Object.entries(this.environment)) {
        if (key.startsWith('AWSAPPRUNNER')) {
          throw new Error(`Environment variable key ${key} with a prefix of AWSAPPRUNNER is not allowed`);
        }
        env.push({ name: key, value: value });
      }
      return env;
    } else {
      return undefined;
    }
  }

  private generateDefaultRole(): iam.Role {
    const accessRole = new iam.Role(this, 'AccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
    });
    accessRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['ecr:GetAuthorizationToken'],
      resources: ['*'],
    }));
    this.accessRole = accessRole;
    return accessRole;
  }
}
