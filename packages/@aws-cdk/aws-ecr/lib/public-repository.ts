import { EOL } from 'os';
import * as iam from '@aws-cdk/aws-iam';
import { Lazy, RemovalPolicy, Resource, Token } from '@aws-cdk/core';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order

import { CfnPublicRepository, CfnPublicRepositoryProps } from './ecr.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';


export interface PublicRepositoryProps {
  /**
   * Name for this repository
   *
   * @default Automatically generated name.
   */
  readonly repositoryName?: string;

  /**
   * A short description of the contents of the repository.
   * This text appears in both the image details and also when searching for repositories on the Amazon ECR Public Gallery.
   */
  readonly description?: string;

  /**
   * A detailed description of the contents of the repository.
   * It's publicly visible in the Amazon ECR Public Gallery. The text must be in markdown format.
   */
  readonly about?: string;

  /**
   * Detailed information about how to use the contents of the repository. It's publicly visible in the Amazon ECR Public Gallery.
   * The usage text provides context, support information, and additional usage details for users of the repository.
   * The text must be in markdown format.
   */
  readonly usage?: string;

  /**
   * The system architecture that the images in the repository are compatible with.
   */
  readonly architectures?: Architecture[];

  /**
   * The operating systems that the images in the repository are compatible with.
   */
  readonly operatingSystems?: OperatingSystem[];

  /**
   * Custom policy document to attach to the Public Repository.
   *
   * @default - An empty policy document will be created.
   */
  readonly policy?: iam.PolicyDocument;

  /**
   * Determine what happens to the repository when the resource/stack is deleted.
   *
   * @default RemovalPolicy.Retain
   */
  readonly removalPolicy?: RemovalPolicy;
}

export interface PublicRepositoryAttributes {
  readonly repositoryName: string;
  readonly repositoryArn: string;
}

/**
 * Define an ECR Public Repository.
 */
export class PublicRepository extends Resource {

  private static validateRepositoryName(physicalName: string) {
    const repositoryName = physicalName;
    if (!repositoryName || Token.isUnresolved(repositoryName)) {
      // the name is a late-bound value, not a defined string,
      // so skip validation
      return;
    }

    const errors: string[] = [];

    // Rules codified from https://docs.aws.amazon.com/AmazonECRPublic/latest/APIReference/API_CreateRepository.html#ecrpublic-CreateRepository-request-repositoryName
    if (repositoryName.length < 2 || repositoryName.length > 205) {
      errors.push('Repository name must be at least 2 and no more than 205 characters');
    }
    const isPatternMatch = /^(?:[a-z0-9]+(?:[._-][a-z0-9]+)*\/)*[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(repositoryName);
    if (!isPatternMatch) {
      errors.push('Repository name must follow the specified pattern: (?:[a-z0-9]+(?:[._-][a-z0-9]+)*/)*[a-z0-9]+(?:[._-][a-z0-9]+)*');
    }

    if (errors.length > 0) {
      throw new Error(`Invalid ECR repository name (value: ${repositoryName})${EOL}${errors.join(EOL)}`);
    }
  }

  public readonly repositoryName: string;
  public readonly repositoryArn: string;
  private policy: iam.PolicyDocument;

  constructor(scope: Construct, id: string, props: PublicRepositoryProps = {}) {
    super(scope, id, {
      physicalName: props.repositoryName,
    });

    PublicRepository.validateRepositoryName(this.physicalName);

    this.policy = props.policy ?? new iam.PolicyDocument();
    const repositoryCatalogData = this.renderRepositoryCatalogData(props);

    const resource = new CfnPublicRepository(this, 'Resource', {
      repositoryName: this.physicalName,
      // It says "Text", but they actually mean "Object".
      repositoryPolicyText: Lazy.any({ produce: () => this.policy }),
      repositoryCatalogData,
    });

    resource.applyRemovalPolicy(props.removalPolicy);

    this.repositoryName = this.getResourceNameAttribute(resource.ref);
    this.repositoryArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'ecr-public',
      resource: 'repository',
      resourceName: this.physicalName,
    });
  }


  private renderRepositoryCatalogData(props: PublicRepositoryProps): CfnPublicRepositoryProps['repositoryCatalogData'] | undefined {
    if (!props.about && !props.description && !props.usage && !props.architectures && !props.operatingSystems) {
      return undefined;
    }

    return {
      RepositoryDescription: props.description,
      AboutText: props.about,
      UsageText: props.usage,
      Architectures: props.architectures?.map(element => element.value),
      OperatingSystems: props.operatingSystems?.map(element => element.value),
    };
  }

  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    this.policy.addStatements(statement);
    return { statementAdded: false, policyDependable: this.policy };
  }

  protected validate(): string[] {
    const errors = super.validate();
    errors.push(...this.policy.validateForResourcePolicy() || []);
    return errors;
  }

  /**
   * Grant the given principal identity permissions to perform the actions on this repository
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipalAndResource({
      grantee,
      actions,
      resourceArns: [this.repositoryArn],
      resourceSelfArns: [],
      resource: this,
    });
  }

  /**
   * Grant the given identity permissions to push images to this repository.
   */
  public grantPush(grantee: iam.IGrantable) {
    const ret = this.grant(grantee,
      'ecr-public:BatchCheckLayerAvailability',
      'ecr-public:PutImage',
      'ecr-public:InitiateLayerUpload',
      'ecr-public:UploadLayerPart',
      'ecr-public:CompleteLayerUpload');

    iam.Grant.addToPrincipal({
      grantee,
      actions: ['ecr-public:GetAuthorizationToken', 'sts:GetServiceBearerToken'],
      resourceArns: ['*'],
      scope: this,
    });

    return ret;
  }
}

/**
 * Architecture tags that appear as badges on the repository and are used as search filters on the Amazon ECR Public Gallery.
 *
 * Note: If an unsupported tag is added to your repository catalog data, it's associated with the repository
 * and can be retrieved using the API but isn't discoverable in the Amazon ECR Public Gallery.
 */
export class Architecture {
  public static readonly ARM = new Architecture('ARM');
  public static readonly ARM_64 = new Architecture('ARM 64');
  public static readonly X86 = new Architecture('x86');
  public static readonly X86_64 = new Architecture('x86-64');

  public constructor(public readonly value: string) { }
}

/**
 * Operating system tags that appear as badges on the repository and are used as search filters on the Amazon ECR Public Gallery.
 *
 * Note: If an unsupported tag is added to your repository catalog data, it's associated with the repository
 * and can be retrieved using the API but isn't discoverable in the Amazon ECR Public Gallery.
 */
export class OperatingSystem {
  public static readonly LINUX = new OperatingSystem('Linux');
  public static readonly WINDOWS = new OperatingSystem('Windows');

  public constructor(public readonly value: string) { }
}
