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
 * Construction properties for {@link CodeCommitSource}.
 */
export interface CodeCommitSourceProps extends BuildSourceProps {
  repository: codecommit.RepositoryRef;
}

/**
 * CodeCommit Source definition for a CodeBuild project.
 */
export class CodeCommitSource extends BuildSource {
  public readonly type: SourceType = SourceType.CodeCommit;
  private readonly repo: codecommit.RepositoryRef;

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
  bucket: s3.BucketRef;
  path: string;
}

/**
 * S3 bucket definition for a CodeBuild project.
 */
export class S3BucketSource extends BuildSource {
  public readonly type: SourceType = SourceType.S3;
  private readonly bucket: s3.BucketRef;
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
export interface GitHubSourceProps extends BuildSourceProps {
  /**
   * The git url to clone for this code build project.
   */
  cloneUrl: string;

  /**
   * The oAuthToken used to authenticate when cloning source git repo.
   */
  oauthToken: cdk.Secret;
}

/**
 * GitHub Source definition for a CodeBuild project.
 */
export class GitHubSource extends BuildSource {
  public readonly type: SourceType = SourceType.GitHub;
  private readonly cloneUrl: string;
  private readonly oauthToken: cdk.Secret;

  constructor(props: GitHubSourceProps) {
    super(props);
    this.cloneUrl = props.cloneUrl;
    this.oauthToken = props.oauthToken;
  }

  protected toSourceProperty(): any {
    return {
      auth: { type: 'OAUTH', resource: this.oauthToken },
      location: this.cloneUrl,
    };
  }
}

/**
 * GitHub Enterprise Source definition for a CodeBuild project.
 */
export class GitHubEnterpriseSource extends BuildSource {
  public readonly type: SourceType = SourceType.GitHubEnterPrise;
  private readonly cloneUrl: string;
  private readonly oauthToken: cdk.Secret;

  constructor(props: GitHubSourceProps) {
    super(props);
    this.cloneUrl = props.cloneUrl;
    this.oauthToken = props.oauthToken;
  }

  protected toSourceProperty(): any {
    return {
      auth: { type: 'OAUTH', resource: this.oauthToken },
      location: this.cloneUrl,
    };
  }
}

/**
 * Construction properties for {@link BitBucketSource}.
 */
export interface BitBucketSourceProps extends BuildSourceProps {
  httpsCloneUrl: string;
}

/**
 * BitBucket Source definition for a CodeBuild project.
 */
export class BitBucketSource extends BuildSource {
  public readonly type: SourceType = SourceType.BitBucket;
  private readonly httpsCloneUrl: any;

  constructor(props: BitBucketSourceProps) {
    super(props);
    this.httpsCloneUrl = props.httpsCloneUrl;
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
  GitHubEnterPrise = 'GITHUB_ENTERPRISE',
  BitBucket = 'BITBUCKET',
  S3 = 'S3',
}
