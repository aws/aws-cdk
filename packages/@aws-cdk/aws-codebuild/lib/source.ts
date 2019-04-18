import codecommit = require('@aws-cdk/aws-codecommit');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import { CfnProject } from './codebuild.generated';
import { Project } from './project';

/**
 * Properties common to all Source classes.
 */
export interface BuildSourceProps {
  /**
   * The source identifier.
   * This property is required on secondary sources.
   */
  readonly identifier?: string;
}

/**
 * Source provider definition for a CodeBuild Project.
 */
export abstract class BuildSource {
  public readonly identifier?: string;
  public abstract readonly type: SourceType;
  public readonly badgeSupported: boolean = false;

  constructor(props: BuildSourceProps) {
    this.identifier = props.identifier;
  }

  /**
   * Called by the project when the source is added so that the source can perform
   * binding operations on the source. For example, it can grant permissions to the
   * code build project to read from the S3 bucket.
   *
   * @internal
   */
  public _bind(_project: Project) {
    // by default, do nothing
    return;
  }

  public toSourceJSON(): CfnProject.SourceProperty {
    const sourceProp = this.toSourceProperty();
    return {
      sourceIdentifier: this.identifier,
      type: this.type,
      ...sourceProp,
    };
  }

  public buildTriggers(): CfnProject.ProjectTriggersProperty | undefined {
    return undefined;
  }

  protected toSourceProperty(): any {
    return {
    };
  }
}

/**
 * A `NO_SOURCE` CodeBuild Project Source definition.
 * This is the default source type,
 * if none was specified when creating the Project.
 * *Note*: the `NO_SOURCE` type cannot be used as a secondary source,
 * and because of that, you're not allowed to specify an identifier for it.
 */
export class NoSource extends BuildSource {
  public readonly type: SourceType = SourceType.None;

  constructor() {
    super({});
  }
}

/**
 * The construction properties common to all build sources that are backed by Git.
 */
export interface GitBuildSourceProps extends BuildSourceProps {
  /**
   * The depth of history to download. Minimum value is 0.
   * If this value is 0, greater than 25, or not provided,
   * then the full history is downloaded with each build of the project.
   */
  readonly cloneDepth?: number;
}

/**
 * A common superclass of all build sources that are backed by Git.
 */
export abstract class GitBuildSource extends BuildSource {
  private readonly cloneDepth?: number;

  protected constructor(props: GitBuildSourceProps) {
    super(props);

    this.cloneDepth = props.cloneDepth;
  }

  public toSourceJSON(): CfnProject.SourceProperty {
    return {
      ...super.toSourceJSON(),
      gitCloneDepth: this.cloneDepth
    };
  }
}

/**
 * The construction properties common to all external build sources that are backed by Git.
 */
export interface ExternalGitBuildSourceProps extends GitBuildSourceProps {
  /**
   * Whether to create a webhook that will trigger a build every time a commit is pushed to the repository.
   *
   * @default false
   */
  readonly webhook?: boolean;

  /**
   * Whether to send notifications on your build's start and end.
   *
   * @default true
   */
  readonly reportBuildStatus?: boolean;

  /**
   * A list of lists of WebhookFilter objects used to determine which webhook events are triggered.
   */
  readonly filterGroups?: WebhookFilter[][];
}

/**
 * A common superclass of all external build sources that are backed by Git.
 */
export abstract class ExternalGitBuildSource extends GitBuildSource {
  public readonly badgeSupported: boolean = true;
  private readonly reportBuildStatus: boolean;
  private readonly webhook?: boolean;
  private readonly filterGroups?: WebhookFilter[][];

  protected constructor(props: ExternalGitBuildSourceProps) {
    super(props);

    this.webhook = props.webhook;
    this.reportBuildStatus = props.reportBuildStatus === undefined ? true : props.reportBuildStatus;
    this.filterGroups = props.filterGroups;
  }

  public buildTriggers(): CfnProject.ProjectTriggersProperty | undefined {
    if (!this.webhook && this.filterGroups) {
      throw new Error("filterGroups property could only be set when webhook property is true");
    }
    return this.webhook === undefined
      ? undefined
      : {
        webhook: this.webhook,
        filterGroups: this.filterGroups,
      };
  }

  public toSourceJSON(): CfnProject.SourceProperty {
    return {
      ...super.toSourceJSON(),
      reportBuildStatus: this.reportBuildStatus,
    };
  }
}

/**
 * Construction properties for {@link CodeCommitSource}.
 */
export interface CodeCommitSourceProps extends GitBuildSourceProps {
  readonly repository: codecommit.IRepository;
}

/**
 * CodeCommit Source definition for a CodeBuild project.
 */
export class CodeCommitSource extends GitBuildSource {
  public readonly type: SourceType = SourceType.CodeCommit;
  private readonly repo: codecommit.IRepository;

  constructor(props: CodeCommitSourceProps) {
    super(props);
    this.repo = props.repository;
  }

  /**
   * @internal
   */
  public _bind(project: Project) {
    // https://docs.aws.amazon.com/codebuild/latest/userguide/setting-up.html
    project.addToRolePolicy(new iam.PolicyStatement()
      .addAction('codecommit:GitPull')
      .addResource(this.repo.repositoryArn));
  }

  protected toSourceProperty(): any {
    return {
      location: this.repo.repositoryCloneUrlHttp
    };
  }
}

/**
 * Construction properties for {@link S3BucketSource}.
 */
export interface S3BucketSourceProps extends BuildSourceProps {
  readonly bucket: s3.IBucket;
  readonly path: string;
}

/**
 * S3 bucket definition for a CodeBuild project.
 */
export class S3BucketSource extends BuildSource {
  public readonly type: SourceType = SourceType.S3;
  private readonly bucket: s3.IBucket;
  private readonly path: string;

  constructor(props: S3BucketSourceProps) {
    super(props);
    this.bucket = props.bucket;
    this.path = props.path;
  }

  /**
   * @internal
   */
  public _bind(project: Project) {
    this.bucket.grantRead(project);
  }

  protected toSourceProperty(): any {
    return {
      location: `${this.bucket.bucketName}/${this.path}`,
    };
  }
}

/**
 * CodePipeline Source definition for a CodeBuild Project.
 * *Note*: this type cannot be used as a secondary source,
 * and because of that, you're not allowed to specify an identifier for it.
 */
export class CodePipelineSource extends BuildSource {
  public readonly type: SourceType = SourceType.CodePipeline;

  constructor() {
    super({});
  }
}

/**
 * Construction properties for {@link GitHubSource} and {@link GitHubEnterpriseSource}.
 */
export interface GitHubSourceProps extends ExternalGitBuildSourceProps {
  /**
   * The GitHub account/user that owns the repo.
   *
   * @example 'awslabs'
   */
  readonly owner: string;

  /**
   * The name of the repo (without the username).
   *
   * @example 'aws-cdk'
   */
  readonly repo: string;
}

/**
 * GitHub Source definition for a CodeBuild project.
 */
export class GitHubSource extends ExternalGitBuildSource {
  public readonly type: SourceType = SourceType.GitHub;
  private readonly httpsCloneUrl: string;

  constructor(props: GitHubSourceProps) {
    super(props);
    this.httpsCloneUrl = `https://github.com/${props.owner}/${props.repo}.git`;
  }

  protected toSourceProperty(): any {
    return {
      location: this.httpsCloneUrl,
    };
  }
}

/**
 * Construction properties for {@link GitHubEnterpriseSource}.
 */
export interface GitHubEnterpriseSourceProps extends ExternalGitBuildSourceProps {
  /**
   * The HTTPS URL of the repository in your GitHub Enterprise installation.
   */
  readonly httpsCloneUrl: string;

  /**
   * Whether to ignore SSL errors when connecting to the repository.
   *
   * @default false
   */
  readonly ignoreSslErrors?: boolean;
}

/**
 * GitHub Enterprise Source definition for a CodeBuild project.
 */
export class GitHubEnterpriseSource extends ExternalGitBuildSource {
  public readonly type: SourceType = SourceType.GitHubEnterprise;
  private readonly httpsCloneUrl: string;
  private readonly ignoreSslErrors?: boolean;

  constructor(props: GitHubEnterpriseSourceProps) {
    super(props);
    this.httpsCloneUrl = props.httpsCloneUrl;
    this.ignoreSslErrors = props.ignoreSslErrors;
  }

  protected toSourceProperty(): any {
    return {
      location: this.httpsCloneUrl,
      insecureSsl: this.ignoreSslErrors,
    };
  }
}

/**
 * Construction properties for {@link BitBucketSource}.
 */
export interface BitBucketSourceProps extends ExternalGitBuildSourceProps {
  /**
   * The BitBucket account/user that owns the repo.
   *
   * @example 'awslabs'
   */
  readonly owner: string;

  /**
   * The name of the repo (without the username).
   *
   * @example 'aws-cdk'
   */
  readonly repo: string;
}

/**
 * BitBucket Source definition for a CodeBuild project.
 */
export class BitBucketSource extends ExternalGitBuildSource {
  public readonly type: SourceType = SourceType.BitBucket;
  private readonly httpsCloneUrl: any;

  constructor(props: BitBucketSourceProps) {
    super(props);
    this.httpsCloneUrl = `https://bitbucket.org/${props.owner}/${props.repo}.git`;
  }

  protected toSourceProperty(): any {
    return {
      location: this.httpsCloneUrl
    };
  }
}

/**
 * Filter used to determine which webhooks trigger a build
 */
export interface WebhookFilter {
  /**
   * The type of webhook filter.
   */
  readonly type: WebhookFilterType,

  /**
   * A regular expression pattern.
   */
  readonly pattern: string,

  /**
   * Used to indicate that the pattern determines which webhook events do not trigger a build.
   * If true, then a webhook event that does not match the pattern triggers a build.
   * If false, then a webhook event that matches the pattern triggers a build.
   *
   * @default false
   */
  readonly excludeMatchedPattern?: boolean,
}

/**
 * Filter types for webhook filters
 */
export enum WebhookFilterType {
  Event = 'EVENT',
  ActorAccountId = 'ACTOR_ACCOUNT_ID',
  HeadRef = 'HEAD_REF',
  BaseRef = 'BASE_REF',
  FilePath = 'FILE_PATH',
}

/**
 * Source types for CodeBuild Project
 */
export enum SourceType {
  None = 'NO_SOURCE',
  CodeCommit = 'CODECOMMIT',
  CodePipeline = 'CODEPIPELINE',
  GitHub = 'GITHUB',
  GitHubEnterprise = 'GITHUB_ENTERPRISE',
  BitBucket = 'BITBUCKET',
  S3 = 'S3',
}
