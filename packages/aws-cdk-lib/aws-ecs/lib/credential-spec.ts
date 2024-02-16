import { IBucket } from '../../aws-s3';
import { IParameter } from '../../aws-ssm';

/**
 * Base construct for a credential specification (CredSpec).
 */
export class CredentialSpec {
  /**
   * Get the ARN for an S3 object.
   */
  protected static arnForS3Object(bucket: IBucket, key: string, objectVersion?: string) {
    let keyPattern = key;

    if (!key) {
      throw new Error('key is undefined');
    }

    if (objectVersion) {
      keyPattern += `/${objectVersion}`;
    }

    return bucket.arnForObjects(keyPattern);
  }

  /**
   * Get the ARN for a SSM parameter.
   */
  protected static arnForSsmParameter(parameter: IParameter) {
    return parameter.parameterArn;
  }

  /**
   * Prefix string based on the type of CredSpec.
   */
  public prefixId: string;

  /**
   * Location or ARN from where to retrieve the CredSpec file.
   */
  public fileLocation: string;

  /**
   * @param fileLocation Location or ARN from where to retrieve the CredSpec file
   */
  constructor(prefixId: string, fileLocation: string) {
    this.prefixId = prefixId;
    this.fileLocation = fileLocation;
  }

  /**
   * Called when the container is initialized to allow this object to bind
   * to the stack.
   */
  public bind(): ICredentialSpecConfig {
    return {
      typePrefix: this.prefixId,
      location: this.fileLocation,
    };
  }
}

/**
 * Credential specification (CredSpec) file.
 */
export class DomainJoinedCredentialSpec extends CredentialSpec {
  /**
   * Prefix Id for this type of CredSpec.
   */
  public static readonly PREFIX_ID = 'credentialspec';

  /**
   * Loads the CredSpec from a S3 bucket object.
   *
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   * @returns CredSpec with it's locations set to the S3 object's ARN.
   */
  public static fromS3Bucket(bucket: IBucket, key: string, objectVersion?: string) {
    return new DomainJoinedCredentialSpec(CredentialSpec.arnForS3Object(bucket, key, objectVersion));
  }

  /**
   * Loads the CredSpec from a SSM parameter.
   *
   * @param parameter The SSM parameter
   * @returns CredSpec with it's locations set to the SSM parameter's ARN.
   */
  public static fromSsmParameter(parameter: IParameter) {
    return new DomainJoinedCredentialSpec(CredentialSpec.arnForSsmParameter(parameter));
  }

  constructor(fileLocation: string) {
    super(DomainJoinedCredentialSpec.PREFIX_ID, fileLocation);
  }
}

/**
 * Credential specification for domainless gMSA.
 */
export class DomainlessCredentialSpec extends CredentialSpec {
  /**
   * Prefix Id for this type of CredSpec.
   */
  public static readonly PREFIX_ID = 'credentialspecdomainless';

  /**
   * Loads the CredSpec from a S3 bucket object.
   *
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   * @returns CredSpec with it's locations set to the S3 object's ARN.
   */
  public static fromS3Bucket(bucket: IBucket, key: string, objectVersion?: string) {
    return new DomainlessCredentialSpec(CredentialSpec.arnForS3Object(bucket, key, objectVersion));
  }

  /**
   * Loads the CredSpec from a SSM parameter.
   *
   * @param parameter The SSM parameter
   * @returns CredSpec with it's locations set to the SSM parameter's ARN.
   */
  public static fromSsmParameter(parameter: IParameter) {
    return new DomainlessCredentialSpec(CredentialSpec.arnForSsmParameter(parameter));
  }

  constructor(fileLocation: string) {
    super(DomainlessCredentialSpec.PREFIX_ID, fileLocation);
  }
}

/**
 * Configuration for a credential specification (CredSpec) used for a ECS container.
 */
export interface ICredentialSpecConfig {
  /**
   * Prefix used for the CredSpec string.
   */
  readonly typePrefix: string;

  /**
   * Location of the CredSpec file.
   */
  readonly location: string;
}