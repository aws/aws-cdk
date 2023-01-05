import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from 'constructs';
import { CfnProject } from './codebuild.generated';
import { IProject } from './project';

/**
 * The type returned from `IArtifacts#bind`.
 */
export interface ArtifactsConfig {
  /**
   * The low-level CloudFormation artifacts property.
   */
  readonly artifactsProperty: CfnProject.ArtifactsProperty;
}

/**
 * The abstract interface of a CodeBuild build output.
 * Implemented by `Artifacts`.
 */
export interface IArtifacts {
  /**
   * The artifact identifier.
   * This property is required on secondary artifacts.
   */
  readonly identifier?: string;

  /**
   * The CodeBuild type of this artifact.
   */
  readonly type: string;

  /**
   * Callback when an Artifacts class is used in a CodeBuild Project.
   *
   * @param scope a root Construct that allows creating new Constructs
   * @param project the Project this Artifacts is used in
   */
  bind(scope: Construct, project: IProject): ArtifactsConfig;
}

/**
 * Properties common to all Artifacts classes.
 */
export interface ArtifactsProps {
  /**
   * The artifact identifier.
   * This property is required on secondary artifacts.
   */
  readonly identifier?: string;
}

/**
 * Artifacts definition for a CodeBuild Project.
 */
export abstract class Artifacts implements IArtifacts {
  public static s3(props: S3ArtifactsProps): IArtifacts {
    return new S3Artifacts(props);
  }

  public readonly identifier?: string;
  public abstract readonly type: string;

  protected constructor(props: ArtifactsProps) {
    this.identifier = props.identifier;
  }

  public bind(_scope: Construct, _project: IProject): ArtifactsConfig {
    return {
      artifactsProperty: {
        artifactIdentifier: this.identifier,
        type: this.type,
      },
    };
  }
}

/**
 * Construction properties for `S3Artifacts`.
 */
export interface S3ArtifactsProps extends ArtifactsProps {
  /**
   * The name of the output bucket.
   */
  readonly bucket: s3.IBucket;

  /**
   * The path inside of the bucket for the build output .zip file or folder.
   * If a value is not specified, then build output will be stored at the root of the
   * bucket (or under the <build-id> directory if `includeBuildId` is set to true).
   *
   * @default the root of the bucket
   */
  readonly path?: string;

  /**
   * The name of the build output ZIP file or folder inside the bucket.
   *
   * The full S3 object key will be "<path>/<build-id>/<name>" or
   * "<path>/<name>" depending on whether `includeBuildId` is set to true.
   *
   * If not set, `overrideArtifactName` will be set and the name from the
   * buildspec will be used instead.
   *
   * @default undefined, and use the name from the buildspec
   */
  readonly name?: string;

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

  /**
   * If this is false, build output will not be encrypted.
   * This is useful if the artifact to publish a static website or sharing content with others
   *
   * @default true - output will be encrypted
   */
  readonly encryption?: boolean;
}

/**
 * S3 Artifact definition for a CodeBuild Project.
 */
class S3Artifacts extends Artifacts {
  public readonly type = 'S3';

  constructor(private readonly props: S3ArtifactsProps) {
    super(props);
  }

  public bind(_scope: Construct, project: IProject): ArtifactsConfig {
    this.props.bucket.grantReadWrite(project);
    const superConfig = super.bind(_scope, project);
    return {
      artifactsProperty: {
        ...superConfig.artifactsProperty,
        location: this.props.bucket.bucketName,
        path: this.props.path,
        namespaceType: this.props.includeBuildId === false ? 'NONE' : 'BUILD_ID',
        name: this.props.name == null ? undefined : this.props.name,
        packaging: this.props.packageZip === false ? 'NONE' : 'ZIP',
        encryptionDisabled: this.props.encryption === false ? true : undefined,
        overrideArtifactName: this.props.name == null ? true : undefined,
      },
    };
  }
}
