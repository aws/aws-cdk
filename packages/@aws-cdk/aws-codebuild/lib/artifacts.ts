import s3 = require('@aws-cdk/aws-s3');
import { CfnProject } from './codebuild.generated';
import { Project } from './project';

/**
 * Properties common to all Artifacts classes.
 */
export interface BuildArtifactsProps {
  /**
   * The artifact identifier.
   * This property is required on secondary artifacts.
   */
  readonly identifier?: string;
}

/**
 * Artifacts definition for a CodeBuild Project.
 */
export abstract class BuildArtifacts {
  public readonly identifier?: string;
  protected abstract readonly type: string;

  constructor(props: BuildArtifactsProps) {
    this.identifier = props.identifier;
  }

  /**
   * @internal
   */
  public _bind(_project: Project) {
    return;
  }

  public toArtifactsJSON(): CfnProject.ArtifactsProperty {
    const artifactsProp = this.toArtifactsProperty();
    return {
      artifactIdentifier: this.identifier,
      type: this.type,
      ...artifactsProp,
    };
  }

  protected toArtifactsProperty(): any {
    return {
    };
  }
}

/**
 * A `NO_ARTIFACTS` CodeBuild Project Artifact definition.
 * This is the default artifact type,
 * if none was specified when creating the Project
 * (and the source was not specified to be CodePipeline).
 * *Note*: the `NO_ARTIFACTS` type cannot be used as a secondary artifact,
 * and because of that, you're not allowed to specify an identifier for it.
 */
export class NoBuildArtifacts  extends BuildArtifacts {
  protected readonly type = 'NO_ARTIFACTS';

  constructor() {
    super({});
  }
}

/**
 * CodePipeline Artifact definition for a CodeBuild Project.
 * *Note*: this type cannot be used as a secondary artifact,
 * and because of that, you're not allowed to specify an identifier for it.
 */
export class CodePipelineBuildArtifacts extends BuildArtifacts {
  protected readonly type = 'CODEPIPELINE';

  constructor() {
    super({});
  }
}

/**
 * Construction properties for {@link S3BucketBuildArtifacts}.
 */
export interface S3BucketBuildArtifactsProps extends BuildArtifactsProps {
  /**
   * The name of the output bucket.
   */
  readonly bucket: s3.IBucket;

  /**
   * The path inside of the bucket for the build output .zip file or folder.
   * If a value is not specified, then build output will be stored at the root of the
   * bucket (or under the <build-id> directory if `includeBuildId` is set to true).
   */
  readonly path?: string;

  /**
   * The name of the build output ZIP file or folder inside the bucket.
   *
   * The full S3 object key will be "<path>/<build-id>/<name>" or
   * "<path>/<name>" depending on whether `includeBuildId` is set to true.
   */
  readonly name: string;

  /**
   * Indicates if the build ID should be included in the path. If this is set to true,
   * then the build artifact will be stored in "<path>/<build-id>/<name>".
   *
   * @default true
   */
  readonly includeBuildId?: boolean;

  /**
   * If this is true, all build output will be packaged into a single .zip file.
   * Otherwise, all files will be uploaded to <path>/<name>
   *
   * @default true - files will be archived
   */
  readonly packageZip?: boolean;
}

/**
 * S3 Artifact definition for a CodeBuild Project.
 */
export class S3BucketBuildArtifacts extends BuildArtifacts {
  protected readonly type = 'S3';

  constructor(private readonly props: S3BucketBuildArtifactsProps) {
    super(props);
  }

  /**
   * @internal
   */
  public _bind(project: Project) {
    this.props.bucket.grantReadWrite(project);
  }

  protected toArtifactsProperty(): any {
    return {
      location: this.props.bucket.bucketName,
      path: this.props.path,
      namespaceType: this.props.includeBuildId === false ? 'NONE' : 'BUILD_ID',
      name: this.props.name,
      packaging: this.props.packageZip === false ? 'NONE' : 'ZIP',
    };
  }
}
