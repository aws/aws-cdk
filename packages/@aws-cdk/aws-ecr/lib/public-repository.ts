import { EOL } from 'os';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { Lazy, Resource, Stack, Token } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { BaseRepositoryProps, IBaseRepository, OnCloudTrailImagePushedOptions } from './base-repository';
import { CfnPublicRepository, CfnPublicRepositoryProps } from './ecr.generated';

/**
 * Represents an ECR Public Repository.
 */
export interface IPublicRepository extends IBaseRepository {

  /**
   * The name of the repository.
   * @attribute
   */
  readonly publicRepositoryName: string;

  /**
   * The ARN of the repository.
   * @attribute
   */
  readonly publicRepositoryArn: string;

  /**
   * Grant the given identity permissions to push images to this repository.
   */
  grantPush(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Base class for ECR Public Repository. Reused between imported repositories and owned repositories.
 */
export abstract class PublicRepositoryBase extends Resource implements IPublicRepository {

  protected static readonly PUBLIC_REPO_REGION = 'us-east-1';

  // From https://docs.aws.amazon.com/AmazonECR/latest/public/public-repository-policy-examples.html
  private static readonly PUSH_IAM_ACTIONS = [
    'ecr-public:BatchCheckLayerAvailability',
    'ecr-public:CompleteLayerUpload',
    'ecr-public:InitiateLayerUpload',
    'ecr-public:PutImage',
    'ecr-public:UploadLayerPart',
  ];

  public abstract readonly publicRepositoryName: string;
  public abstract readonly publicRepositoryArn: string;

  public abstract addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;

  public onCloudTrailEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    // See https://docs.aws.amazon.com/AmazonECR/latest/public/logging-using-cloudtrail.html
    if (Stack.of(this).region !== PublicRepositoryBase.PUBLIC_REPO_REGION) {
      throw new Error(`CloudWatch event rule for ECR Public Repository can only be created in ${PublicRepositoryBase.PUBLIC_REPO_REGION}.`);
    }

    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      source: ['aws.ecr-public'],
      detailType: ['AWS API Call via CloudTrail'],
      detail: {
        requestParameters: {
          repositoryName: [this.publicRepositoryName],
        },
      },
    });
    return rule;
  }

  public onCloudTrailImagePushed(id: string, options: OnCloudTrailImagePushedOptions = {}): events.Rule {
    const rule = this.onCloudTrailEvent(id, options);
    rule.addEventPattern({
      detail: {
        eventName: ['PutImage'],
        requestParameters: {
          imageTag: options.imageTag ? [options.imageTag] : undefined,
        },
      },
    });
    return rule;
  }

  public onEvent(id: string, options: events.OnEventOptions = {}) {
    if (Stack.of(this).region !== PublicRepositoryBase.PUBLIC_REPO_REGION) {
      throw new Error(`CloudWatch event rule for ECR Public Repository can only be created in ${PublicRepositoryBase.PUBLIC_REPO_REGION}.`);
    }
    const rule = new events.Rule(this, id, options);
    rule.addEventPattern({
      source: ['aws.ecr-public'],
      resources: [this.publicRepositoryArn],
    });
    rule.addTarget(options.target);
    return rule;
  }

  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipalAndResource({
      grantee,
      actions,
      resourceArns: [this.publicRepositoryArn],
      resourceSelfArns: [],
      resource: this,
    });
  }

  public grantPush(grantee: iam.IGrantable) {
    const ret = this.grant(grantee, ...PublicRepositoryBase.PUSH_IAM_ACTIONS);

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
 * Options for the ECR Public Repository construct.
 */
export interface PublicRepositoryProps extends BaseRepositoryProps {
  /**
   * Name for this repository
   *
   * @default Automatically generated name.
   */
  readonly publicRepositoryName?: string;

  /**
   * A short description of the contents of the repository.
   * This text appears in both the image details and also when searching for repositories on the Amazon ECR Public Gallery.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * A detailed description of the contents of the repository.
   * It's publicly visible in the Amazon ECR Public Gallery. The text must be in markdown format.
   *
   * @default - No about text.
   */
  readonly about?: string;

  /**
   * Detailed information about how to use the contents of the repository. It's publicly visible in the Amazon ECR Public Gallery.
   * The usage text provides context, support information, and additional usage details for users of the repository.
   * The text must be in markdown format.
   *
   * @default - No usage text.
   */
  readonly usage?: string;

  /**
   * The system architecture that the images in the repository are compatible with.
   *
   * @default - No system architecture tags.
   */
  readonly architectures?: Architecture[];

  /**
   * The operating systems that the images in the repository are compatible with.
   *
   * @default - No operating system tags.
   */
  readonly operatingSystems?: OperatingSystem[];

  /**
   * Custom resource policy document to attach to the Public Repository.
   *
   * @default - No policy document. Only the repository owner has access to manage the repository.
   */
  readonly resourcePolicy?: iam.PolicyStatement[];
}

/**
 * ECR Public Repository attributes.
 */
export interface PublicRepositoryAttributes {

  /**
   * The name of the repository.
   */
  readonly publicRepositoryName: string;

  /**
   * The ARN of the repository.
   */
  readonly publicRepositoryArn: string;
}

/**
 * Define an ECR Public Repository.
 */
export class PublicRepository extends PublicRepositoryBase {
  /**
   * Import a repository from attributes.
   */
  public static fromPublicRepositoryAttributes(scope: Construct, id: string, attrs: PublicRepositoryAttributes): IPublicRepository {
    class Import extends PublicRepositoryBase {
      public readonly publicRepositoryName = attrs.publicRepositoryName;
      public readonly publicRepositoryArn = attrs.publicRepositoryArn;

      public addToResourcePolicy(_statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
        // dropped
        return { statementAdded: false };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Import a public repository from ARN.
   */
  public static fromPublicRepositoryArn(scope: Construct, id: string, publicRepositoryArn: string): IPublicRepository {

    // if publicRepositoryArn is a token, the repository name is also required. this is because
    // repository names can include "/" (e.g. foo/bar/myrepo) and it is impossible to
    // parse the name from an ARN using CloudFormation's split/select.
    if (Token.isUnresolved(publicRepositoryArn)) {
      throw new Error('"publicRepositoryArn" is a late-bound value, and therefore "publicRepositoryName" is required. Use `fromPublicRepositoryAttributes` instead');
    }

    const publicRepositoryName = publicRepositoryArn.split('/').slice(1).join('/');

    class Import extends PublicRepositoryBase {
      public publicRepositoryName = publicRepositoryName;
      public publicRepositoryArn = publicRepositoryArn;

      public addToResourcePolicy(_statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
        // dropped
        return { statementAdded: false };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Import a public repository that resides in the same account
   * as the current stack from repository name.
   */
  public static fromPublicRepositoryName(scope: Construct, id: string, publicRepositoryName: string): IPublicRepository {
    class Import extends PublicRepositoryBase {
      public publicRepositoryName = publicRepositoryName;
      public publicRepositoryArn = PublicRepository.arnForLocalRepository(publicRepositoryName, scope);

      public addToResourcePolicy(_statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
        // dropped
        return { statementAdded: false };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Returns an ECR ARN for a repository that resides in the same account as the current stack.
   */
  public static arnForLocalRepository(publicRepositoryName: string, scope: IConstruct): string {
    return Stack.of(scope).formatArn({
      region: '',
      service: 'ecr-public',
      resource: 'repository',
      resourceName: publicRepositoryName,
    });
  }

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

  public readonly publicRepositoryName: string;
  public readonly publicRepositoryArn: string;

  private resourcePolicy?: iam.PolicyDocument;

  constructor(scope: Construct, id: string, props: PublicRepositoryProps = {}) {
    super(scope, id, {
      physicalName: props.publicRepositoryName,
    });
    if (Stack.of(this).region !== PublicRepositoryBase.PUBLIC_REPO_REGION) {
      throw new Error(`ECR Public Repository can only be created in ${PublicRepositoryBase.PUBLIC_REPO_REGION}.`);
    }

    PublicRepository.validateRepositoryName(this.physicalName);

    if (props.resourcePolicy !== undefined) {
      this.resourcePolicy = new iam.PolicyDocument({ statements: props.resourcePolicy });
    }

    const repositoryCatalogData = this.renderRepositoryCatalogData(props);

    const resource = new CfnPublicRepository(this, 'Resource', {
      repositoryName: this.physicalName,
      // It says "Text", but they actually mean "Object".
      repositoryPolicyText: Lazy.any({ produce: () => this.resourcePolicy }),
      repositoryCatalogData,
    });

    resource.applyRemovalPolicy(props.removalPolicy);

    this.publicRepositoryName = this.getResourceNameAttribute(resource.ref);
    this.publicRepositoryArn = this.getResourceArnAttribute(resource.attrArn, {
      region: '',
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

  /**
   * Add a policy statement to the repository's resource policy
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (this.resourcePolicy === undefined) {
      this.resourcePolicy = new iam.PolicyDocument();
    }
    this.resourcePolicy.addStatements(statement);
    return { statementAdded: true, policyDependable: this.resourcePolicy };
  }

  protected validate(): string[] {
    const errors = super.validate();
    errors.push(...this.resourcePolicy?.validateForResourcePolicy() || []);
    return errors;
  }
}

/**
 * Architecture tags that appear as badges on the repository and are used as search filters on the Amazon ECR Public Gallery.
 *
 * Note: If an unsupported tag is added to your repository catalog data, it's associated with the repository
 * and can be retrieved using the API but isn't discoverable in the Amazon ECR Public Gallery.
 */
export class Architecture {
  /**
   * ARM Architecture.
   */
  public static readonly ARM = new Architecture('ARM');

  /**
   * ARM 64 Architecture.
   */
  public static readonly ARM_64 = new Architecture('ARM 64');

  /**
   * x86 Architecture.
   */
  public static readonly X86 = new Architecture('x86');

  /**
   * x86-64 Architecture.
   */
  public static readonly X86_64 = new Architecture('x86-64');

  /**
   * Constructor for specifying a custom architecture tag.
   *
   * @param value the name of architecture tag.
   */
  public constructor(public readonly value: string) { }
}

/**
 * Operating system tags that appear as badges on the repository and are used as search filters on the Amazon ECR Public Gallery.
 *
 * Note: If an unsupported tag is added to your repository catalog data, it's associated with the repository
 * and can be retrieved using the API but isn't discoverable in the Amazon ECR Public Gallery.
 */
export class OperatingSystem {
  /**
   * Linux Operating System.
   */
  public static readonly LINUX = new OperatingSystem('Linux');

  /**
   * Windows Operating System.
   */
  public static readonly WINDOWS = new OperatingSystem('Windows');

  /**
   * Constructor for specifying a custom operating system tag.
   *
   * @param value the name of operating system tag.
   */
  public constructor(public readonly value: string) { }
}
