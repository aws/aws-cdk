import * as cdk from '@aws-cdk/cdk';

import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';

export interface IArtifactsStore {
  /**
   * Bucket to store artifacts in given region
   */
  readonly bucket: s3.IBucket;

  /**
   * The KMS encryption material (key or alias)
   * used to encrypt artifacts. In case of cross-account pipelines
   * specifying this value may be required, as artifacts should be
   * encrypted with KMS key which is allowed to be used in foreign account.
   *
   * **Limited support** This feature has limited support, users
   * may be required to set required in KMS key
   * resource policy, as well for roles to access this key.
   */
  readonly encryptionMaterialArn?: string;

  grantRead(identity?: iam.IPrincipal): void;
  grantReadWrite(identity?: iam.IPrincipal): void;
}

export interface ArtifactsStoreProps {
  /**
   * Bucket to store artifacts in given region
   */
  bucket?: s3.IBucket;

  /**
   * The KMS encryption material (key or alias)
   * used to encrypt artifacts. In case of cross-account pipelines
   * specifying this value may be required, as artifacts should be
   * encrypted with KMS key which is allowed to be used in foreign account.
   *
   * **Limited support** This feature has limited support, users
   * may be required to set required in KMS key
   * resource policy, as well for roles to access this key.
   */
  readonly encryptionMaterialArn?: string;
}

/**
 * Represents artifacts store.
 *
 * Artifacts store is composed from bucket and eventually KMS key (or alias), which is used to encrypt or
 * decrypt artifacts.
 */
export class ArtifactsStore extends cdk.Construct implements IArtifactsStore {
  /**
   * Bucket to store artifacts in given region
   */
  public readonly bucket: s3.IBucket;

  /**
   * The name of bucket used to store artifacts.
   * If store has been created within stack with known account and region
   * this value will fully represent physical name, and should not contain
   * pseudo parameters.
   */
  public get bucketName() { return this._bucketName; }

  public readonly encryptionMaterialArn?: string;

  protected _bucketName: string;
  /**
   * Constructs new artifacts store with given properties.
   * **Consider using `fromBaseName`**
   */
  constructor(scope: cdk.Construct, id: string, props: ArtifactsStoreProps) {
    super(scope, id);
    this.bucket = props.bucket || new s3.Bucket(this, 'Bucket');
    this._bucketName = this.bucket.bucketName;
    this.encryptionMaterialArn = props.encryptionMaterialArn;
  }

  public grantRead(identity?: iam.IPrincipal): void {
    if (!identity) {
      return;
    }
    this.bucket.grantRead(identity);
  }

  public grantReadWrite(identity?: iam.IPrincipal) {
    if (!identity) {
      return;
    }
    this.bucket.grantReadWrite(identity);
  }
}

/**
 * Represents configuration of artifact store used for cross-region and cross account replication of deployment artifacts.
 *
 * Artifacts store is a set of AWS artifacts (like buckets and KMS keys) which are used by pipeline to store
 * input and output to and from actions.
 */
export interface ImportedArtifactsStoreProps {
  /**
   * The name of the S3 Bucket used for replicating the Pipeline's artifacts into the region.
   */
  bucketName: string;

  /**
   * The KMS encryption material (key or alias)
   * used to encrypt artifacts. In case of cross-account pipelines
   * specifying this value may be required, as artifacts should be
   * encrypted with KMS key which is allowed to be used in foreign account.
   *
   * **Limited support** This feature has limited support, users
   * may be required to set required in KMS key
   * resource policy, as well for roles to access this key.
   */
  encryptionMaterialArn?: string;
}

/**
 * Represents imported artifacts store.
 */
export class ImportedArtifactsStore extends cdk.Construct implements IArtifactsStore {
  public readonly bucket: s3.IBucket;

  public readonly encryptionMaterialArn?: string;

  constructor(scope: cdk.Construct, id: string, props: ImportedArtifactsStoreProps) {
    super(scope, id);

    this.bucket = s3.Bucket.import(this, `${id}-Bucket`, {
      bucketName: props.bucketName
    });

    this.encryptionMaterialArn = props.encryptionMaterialArn;
  }

  public grantRead(identity?: iam.IPrincipal): void {
    if (!identity) {
      return;
    }
    this.bucket.grantRead(identity);
  }

  public grantReadWrite(identity?: iam.IPrincipal) {
    if (!identity) {
      return;
    }
    this.bucket.grantReadWrite(identity);
  }
}