import { Construct } from 'constructs';
import { IBucket } from '../../aws-s3';
import { IParameter } from '../../aws-ssm';

/**
 * Constructs for (CredSpec) files.
 */
export abstract class CredentialSpec {
  /**
   * Get the ARN for an S3 object.
   */
  protected static getArnFromS3Bucket(bucket: IBucket, key: string, objectVersion?: string) {
    if (!bucket.bucketName) {
      throw new Error('bucketName is undefined for the provided bucket');
    }

    return bucket.arnForObjects(`${key}/${objectVersion}`);
  }

  /**
   * Get the ARN for a SSM parameter.
   */
  protected static getArnFromSsmParameter(parameter: IParameter) {
    return parameter.parameterArn;
  }

  /**
   * Location or ARN from where to retrieve the CredSpec file.
   */
  protected readonly credSpecLocation: string;

  /**
   * @param credSpecFileLocation Location or ARN from where to retrieve the CredSpec file
   */
  constructor(credSpecFileLocation: string) {
    this.credSpecLocation = credSpecFileLocation;
  }

  /**
   * Get the prefix string based on the type of CredSpec.
   *
   * @returns Prefix string.
   */
  protected abstract getCredSpecTypePrefix(): string;

  /**
   * Called when the container is initialized to allow this object to bind
   * to the stack.
   *
   * @param scope The binding scope
   */
  public bind(scope: Construct): CredentialSpecConfig {
    return {
      typePrefix: this.getCredSpecTypePrefix(),
      location: this.credSpecLocation,
    };
  }
}

/**
 * Credential specification (CredSpec) file.
 */
export class DomainJoinedCredentialSpec extends CredentialSpec {
  /**
   * Loads the CredSpec from a S3 bucket object.
   *
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   * @returns CredSpec with it's locations set to the S3 object's ARN.
   */
  public static fromS3Bucket(bucket: IBucket, key: string, objectVersion?: string) {
    return new DomainJoinedCredentialSpec(CredentialSpec.getArnFromS3Bucket(bucket, key, objectVersion));
  }

  /**
   * Loads the CredSpec from a SSM parameter.
   *
   * @param parameter The SSM parameter
   * @returns CredSpec with it's locations set to the SSM parameter's ARN.
   */
  public static fromSsmParameter(parameter: IParameter) {
    return new DomainJoinedCredentialSpec(CredentialSpec.getArnFromSsmParameter(parameter));
  }

  constructor(credSpecFileLocation: string) {
    super(credSpecFileLocation);
  }

  protected override getCredSpecTypePrefix() {
    return 'credentialspec';
  }
}

/**
 * Credential specification for domainless gMSA.
 */
export class DomainlessCredentialSpec extends CredentialSpec {
  /**
   * Loads the CredSpec from a S3 bucket object.
   *
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   * @returns CredSpec with it's locations set to the S3 object's ARN.
   */
  public static fromS3Bucket(bucket: IBucket, key: string, objectVersion?: string) {
    return new DomainlessCredentialSpec(CredentialSpec.getArnFromS3Bucket(bucket, key, objectVersion));
  }

  /**
   * Loads the CredSpec from a SSM parameter.
   *
   * @param parameter The SSM parameter
   * @returns CredSpec with it's locations set to the SSM parameter's ARN.
   */
  public static fromSsmParameter(parameter: IParameter) {
    return new DomainlessCredentialSpec(CredentialSpec.getArnFromSsmParameter(parameter));
  }

  constructor(credSpecFileLocation: string) {
    super(credSpecFileLocation);
  }

  protected override getCredSpecTypePrefix() {
    return 'credentialspecdomainless';
  }
}

/**
 * Configuration for a credential specification (CredSpec) used for a ECS container.
 */
export interface CredentialSpecConfig {
  /**
   * Prefix used for the CredSpec string.
   */
  typePrefix: string;

  /**
   * Location of the CredSpec file.
   */
  location: string;
}