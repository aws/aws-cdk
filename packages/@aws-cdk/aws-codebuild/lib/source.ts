import codecommit = require('@aws-cdk/aws-codecommit');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
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
  identifier?: string;
}

/**
 * Source provider definition for a CodeBuild Project.
 */
export abstract class BuildSource {
  public readonly identifier?: string;
  public abstract readonly type: SourceType;

  constructor(props: BuildSourceProps) {
    this.identifier = props.identifier;
  }

  /**
   * Called by the project when the source is added so that the source can perform
   * binding operations on the source. For example, it can grant permissions to the
   * code build project to read from the S3 bucket.
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
  cloneDepth?: number;
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
    const ret = super.toSourceJSON();
    ret.gitCloneDepth = this.cloneDepth;
    return ret;
  }
}

/**
 * Construction properties for {@link CodeCommitSource}.
 */
export interface CodeCommitSourceProps extends GitBuildSourceProps {
  repository: codecommit.IRepository;
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
  bucket: s3.IBucket;
  path: string;
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

  public _bind(project: Project) {
    this.bucket.grantRead(project.role);
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
export interface GitHubSourceProps extends GitBuildSourceProps {
  /**
   * The GitHub account/user that owns the repo.
   *
   * @example 'awslabs'
   */
  owner: string;

  /**
   * The name of the repo (without the username).
   *
   * @example 'aws-cdk'
   */
  repo: string;

  /**
   * The oAuthToken used to authenticate when cloning source git repo.
   * Note that you need to give CodeBuild permissions to your GitHub account in order for the token to work.
   * That is a one-time operation that can be done through the AWS Console for CodeBuild.
   */
  oauthToken: cdk.Secret;

  /**
   * Whether to create a webhook that will trigger a build every time a commit is pushed to the GitHub repository.
   *
   * @default false
   */
  webhook?: boolean;

  /**
   * Whether to send GitHub notifications on your build's start and end.
   *
   * @default true
   */
  reportBuildStatus?: boolean;
}

/**
 * GitHub Source definition for a CodeBuild project.
 */
export class GitHubSource extends GitBuildSource {
  public readonly type: SourceType = SourceType.GitHub;
  private readonly httpsCloneUrl: string;
  private readonly oauthToken: cdk.Secret;
  private readonly reportBuildStatus: boolean;
  private readonly webhook?: boolean;

  constructor(props: GitHubSourceProps) {
    super(props);
    this.httpsCloneUrl = `https://github.com/${props.owner}/${props.repo}.git`;
    this.oauthToken = props.oauthToken;
    this.webhook = props.webhook;
    this.reportBuildStatus = props.reportBuildStatus === undefined ? true : props.reportBuildStatus;
  }

  public buildTriggers(): CfnProject.ProjectTriggersProperty | undefined {
    return this.webhook === undefined
      ? undefined
      : {
        webhook: this.webhook,
      };
  }

  protected toSourceProperty(): any {
    return {
      auth: { type: 'OAUTH', resource: this.oauthToken },
      location: this.httpsCloneUrl,
      reportBuildStatus: this.reportBuildStatus,
    };
  }
}

/**
 * Construction properties for {@link GitHubEnterpriseSource}.
 */
export interface GitHubEnterpriseSourceProps extends GitBuildSourceProps {
  /**
   * The HTTPS URL of the repository in your GitHub Enterprise installation.
   */
  httpsCloneUrl: string;

  /**
   * The OAuth token used to authenticate when cloning the git repository.
   */
  oauthToken: cdk.Secret;

  /**
   * Whether to ignore SSL errors when connecting to the repository.
   *
   * @default false
   */
  ignoreSslErrors?: boolean;
}

/**
 * GitHub Enterprise Source definition for a CodeBuild project.
 */
export class GitHubEnterpriseSource extends GitBuildSource {
  public readonly type: SourceType = SourceType.GitHubEnterprise;
  private readonly httpsCloneUrl: string;
  private readonly oauthToken: cdk.Secret;
  private readonly ignoreSslErrors?: boolean;

  constructor(props: GitHubEnterpriseSourceProps) {
    super(props);
    this.httpsCloneUrl = props.httpsCloneUrl;
    this.oauthToken = props.oauthToken;
    this.ignoreSslErrors = props.ignoreSslErrors;
  }

  protected toSourceProperty(): any {
    return {
      auth: { type: 'OAUTH', resource: this.oauthToken },
      location: this.httpsCloneUrl,
      insecureSsl: this.ignoreSslErrors,
    };
  }
}

/**
 * Construction properties for {@link BitBucketSource}.
 */
export interface BitBucketSourceProps extends GitBuildSourceProps {
  /**
   * The BitBucket account/user that owns the repo.
   *
   * @example 'awslabs'
   */
  owner: string;

  /**
   * The name of the repo (without the username).
   *
   * @example 'aws-cdk'
   */
  repo: string;
}

/**
 * BitBucket Source definition for a CodeBuild project.
 */
export class BitBucketSource extends GitBuildSource {
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
