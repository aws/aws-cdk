import * as ecr from '@aws-cdk/aws-ecr';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnService } from './';

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
 */
export enum Cpu {
  /**
   * 1 vCPU
   */
  ONE_VCPU = '1 vCPU',
  /**
   * 2 vCPU
   */
  TWO_VCPU = '2 vCPU',
}

/**
 * The amount of memory reserved for each instance of your App Runner service.
 */
export enum Memory {
  /**
   * 2 GB
   */
  TWO_GB = '2 GB',
  /**
   * 3 GB
   */
  THREE_GB = '3 GB',
  /**
   * 4 GB
   */
  FOUR_GB = '4 GB',
}

/**
 * The code runtimes
 */
export enum CodeRuntime {
  /**
   * NodeJS 12
   */
  NODEJS_12 = 'NODEJS_12',
  /**
   * Python 3
   */
  PYTHON_3 = 'PYTHON_3',
}

/**
 * Describes the configuration that AWS App Runner uses to run an App Runner service
 * using an image pulled from a source image repository.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imageconfiguration.html
 */
interface ImageConfiguration {
  /**
   * The port that your application listens to in the container.
   *
   * @default 8080
   */
  readonly port?: string;
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
interface ImageRepository {
  /**
   * The identifier of an image.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apprunner-service-imagerepository.html
   */
  readonly imageIdentifier: string;
  /**
   * The type of the image repository. This reflects the repository provider and whether
   * the repository is private or public.
   */
  readonly imageRepositoryType: ImageRepositoryType;
  /**
   * Configuration for running the identified image.
   */
  readonly imageConfiguration: ImageConfiguration;
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
}

/**
 * Properties of the AppRunner Service
 */
export interface ServiceProps {
  /**
   * The description of a source image repository.
   * You must provide either `image` or `code`(but not both).
   *
   * @default - no image repository.
   */
  readonly image?: ContainerImage;
  /**
   * The description of a source code repository.
   * You must provide either `image` or `code`(but not both).
   *
   * @default - no code repository.
   */
  readonly code?: CodeRepositoryProps;
  /**
   * The port that your application listens to in the container.
   *
   * @default 8080
   */
  readonly port?: number;
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
   * ARN of the connection to Github. Only required for Github source.
   *
   * @default - no connection
   */
  readonly gitHubConnection?: GitHubConnection;
  /**
   * The IAM role that grants the App Runner service access to a source repository.
   * It's required for ECR image repositories (but not for ECR Public repositories).
   *
   * @default - generate a new access role.
   */
  readonly accessRole?: iam.IRole;
  /**
   * The IAM role that provides permissions to your App Runner service.
   * These are permissions that your code needs when it calls any AWS APIs.
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
  readonly runtime: CodeRuntime;
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
export class Connection {
  /**
   * Using existing App Runner connection by specifying the connection ARN.
   * @param arn connection ARN
   * @returns Connection
   */
  public static fromConnectionArn(arn: string): Connection {
    return new Connection(arn);
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
  private ecrRepository?: ecr.IRepository;
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
  constructor(scope: Construct, id: string, props: ServiceProps = {}) {
    super(scope, id);
    // either image or code is allowed. Not both.
    if ((!props.code && !props.image) || (props.code && props.image)) {
      throw new Error('Either image or code is required, not both.');
    }
    // connection is required if code is defined
    if (props.code && !props.connection) {
      throw new Error('connection is required for github repository source.');
    }
    this.props = props;

    // generate an IAM role only when ImageRepositoryType is ECR and props.role is undefined
    this.accessRole = (this.props.image && this.props.image.type == ImageRepositoryType.ECR) ?
      this.props.accessRole ? this.props.accessRole : this.generateDefaultRole() : undefined;

    const resource = new CfnService(this, 'Resource', {
      instanceConfiguration: {
        cpu: props.cpu?.valueOf(),
        memory: props.memory?.valueOf(),
        instanceRoleArn: props.instanceRole?.roleArn,
      },
      sourceConfiguration: {
        authenticationConfiguration: this.renderAuthenticationConfiguration(),
        imageRepository: this.props.image ? this.renderImageRepositoryConfiguration(this.props.image) : undefined,
        codeRepository: this.props.code ? this.renderCodeRepositoryConfiguration(this.props.code) : undefined,
      },
    });

    // grant required privileges for the role
    if (this.accessRole && this.ecrRepository) {
      this.ecrRepository.grantPull(this.accessRole);
    }
    this.serviceArn = resource.attrServiceArn;
    this.serviceId = resource.attrServiceId;
    this.serviceUrl = resource.attrServiceUrl;
    this.serviceStatus = resource.attrStatus;
    this.serviceName = resource.ref;
  }
  private renderImageRepositoryConfiguration(assets: ContainerImage): ImageRepository {
    // grant pull privileges
    if (assets.ecrRepository && this.accessRole) {
      assets.ecrRepository.grantPull(this.accessRole);
    }

    // })
    return {
      imageIdentifier: assets.uri,
      imageRepositoryType: assets.type,
      imageConfiguration: {
        port: this.props.port ? this.props.port.toString() : undefined,
      },
    };
  }
  private renderCodeRepositoryConfiguration(code: CodeRepositoryProps): CodeRepositoryProps {
    return {
      repositoryUrl: code.repositoryUrl,
      sourceCodeVersion: code.sourceCodeVersion,
      codeConfiguration: code.codeConfiguration,
    };
  }
  private renderAuthenticationConfiguration(): AuthenticationConfiguration {
    return {
      accessRoleArn: this.accessRole?.roleArn,
      // assign connectionArn only when code is available
      connectionArn: this.props.code ? this.props.connection?.connectionArn : undefined,
    };
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

/**
 * The container image for the App Runner service.
 */
export class ContainerImage {
  /**
   * Using the ECR Public repository.
   * @param uri URL of the ECR Public registry
   * @returns ContainerImage
   */
  public static fromEcrPublic(uri: string): ContainerImage {
    return new ContainerImage(ImageRepositoryType.ECR_PUBLIC, uri);
  }
  /**
   * Using the ECR repository.
   * @param repository The ECR repository.
   * @param tag The image tag. Default `latest`.
   * @returns
   */
  public static fromEcrRepository(repository: ecr.IRepository, tag?: string): ContainerImage {
    const uri = repository.repositoryUriForTag(tag || 'latest');
    return new ContainerImage(ImageRepositoryType.ECR, uri, repository );
  }
  /**
   * Using local docker image assets. On deployment, local image assets will be built and pushed to Amazon ECR.
   * @param assert docker image asset
   * @returns ContainerImage
   */
  public static fromDockerImageAssets(assert: DockerImageAsset): ContainerImage {
    return {
      type: ImageRepositoryType.ECR,
      uri: assert.imageUri,
      ecrRepository: assert.repository,
    };
  }
  /**
   *
   * @param type Image repository type.
   * @param uri Image repository URI.
   * @param ecrRepository ECR Repository.
   */
  protected constructor(public readonly type: ImageRepositoryType, public readonly uri: string, public readonly ecrRepository?: ecr.IRepository) { }
}

/**
 * Properties of the Github repository.
 */
export interface GithubRepositoryProps {
  /**
   * The location of the repository that contains the source code.
   */
  readonly repositoryUrl: string;
  /**
   * A runtime environment type for building and running an App Runner service.
   * It represents a programming language runtime.
   */
  readonly runtime: CodeRuntime;
  /**
   * The branch name that represents a specific version for the repository.
   *
   * @default main
   */
  readonly branch?: string;
}

/**
 * Represents the CodeRepository.
 */
export class CodeRepository {
  /**
   * This method returns required properties for github repository.
   * @param props github repository properties
   * @returns code repository properties
   */
  public static fromGithubRepository(props: GithubRepositoryProps): CodeRepositoryProps {
    return {
      codeConfiguration: {
        configurationValues: {
          runtime: props.runtime,
        },
        configurationSource: ConfigurationSourceType.REPOSITORY,
      },
      repositoryUrl: props.repositoryUrl,
      sourceCodeVersion: {
        type: 'BRANCH',
        value: props.branch ?? 'main',
      },
    };
  }
}
