import codecommit = require('@aws-cdk/aws-codecommit');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './codebuild.generated';
import { Project } from './project';

/**
 * Source Provider definition for a CodeBuild project
 * TODO: Abstract class should be an interface
 */
export abstract class BuildSource {
  /**
   * Called by the project when the source is added so that the source can perform
   * binding operations on the source. For example, it can grant permissions to the
   * code build project to read from the S3 bucket.
   */
  public bind(_project: Project) {
    return;
  }

  public abstract toSourceJSON(): cloudformation.ProjectResource.SourceProperty;
}

export class NoSource extends BuildSource {
  constructor() {
    super();
  }

  public toSourceJSON(): cloudformation.ProjectResource.SourceProperty {
    return {
      type: SourceType.None,
    };
  }
}

/**
 * CodeCommit Source definition for a CodeBuild project
 */
export class CodeCommitSource extends BuildSource {
  constructor(private readonly repo: codecommit.RepositoryRef) {
    super();
  }

  public bind(project: Project) {
    // https://docs.aws.amazon.com/codebuild/latest/userguide/setting-up.html
    project.addToRolePolicy(new cdk.PolicyStatement()
      .addAction('codecommit:GitPull')
      .addResource(this.repo.repositoryArn));
  }

  public toSourceJSON(): cloudformation.ProjectResource.SourceProperty {
    return {
      type: SourceType.CodeCommit,
      location: this.repo.repositoryCloneUrlHttp
    };
  }
}

/**
 * CodePipeline Source definition for a CodeBuild project
 */
export class CodePipelineSource extends BuildSource {
  public toSourceJSON(): cloudformation.ProjectResource.SourceProperty {
    return {
      type: SourceType.CodePipeline
    };
  }

  public bind(_project: Project) {
    // TODO: permissions on the pipeline bucket?
  }
}

/**
 * GitHub Source definition for a CodeBuild project
 */
export class GitHubSource extends BuildSource {
  constructor(private readonly httpscloneUrl: string, private readonly oauthToken: any) {
    super();
    this.httpscloneUrl = httpscloneUrl;
    this.oauthToken = oauthToken;
  }

  public toSourceJSON(): cloudformation.ProjectResource.SourceProperty {
    return {
      type: SourceType.GitHub,
      auth: this.oauthToken != null ? { type: 'OAUTH', resource: this.oauthToken } : undefined,
      location: this.httpscloneUrl
    };
  }
}

/**
 * GitHub Enterprice Source definition for a CodeBuild project
 */
export class GitHubEnterpriseSource extends BuildSource {
  constructor(private readonly cloneUrl: string) {
    super();
    this.cloneUrl = cloneUrl;
  }

  public toSourceJSON(): cloudformation.ProjectResource.SourceProperty {
    return {
      type: SourceType.GitHubEnterPrise,
      location: this.cloneUrl,
    };
  }
}

/**
 * BitBucket Source definition for a CodeBuild project
 */
export class BitBucketSource extends BuildSource {
  constructor(private readonly httpsCloneUrl: string) {
    super();
    this.httpsCloneUrl = httpsCloneUrl;
  }
  public toSourceJSON(): cloudformation.ProjectResource.SourceProperty {
    return {
      type: SourceType.BitBucket,
      location: this.httpsCloneUrl
    };
  }
}

/**
 * S3 bucket definition for a CodeBuild project.
 */
export class S3BucketSource extends BuildSource {
  constructor(private readonly bucket: s3.BucketRef, private readonly path: string) {
    super();
  }

  public toSourceJSON(): cloudformation.ProjectResource.SourceProperty {
    return {
      type: SourceType.S3,
      location: new cdk.FnConcat(this.bucket.bucketName, '/', this.path)
    };
  }

  public bind(project: Project) {
    this.bucket.grantRead(project.role);
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
