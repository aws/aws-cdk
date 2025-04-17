import { IBucket } from '../../aws-s3';
import { IParameter } from '../../aws-ssm';

/**
 * Base construct for a credential specification (CredSpec).
 */
export class CredentialSpec {
  /**
   * Helper method to generate the ARN for a S3 object. Used to avoid duplication of logic in derived classes.
   */
  protected static arnForS3Object(bucket: IBucket, key: string) {
    if (!key) {
      throw new Error('key is undefined');
    }

    return bucket.arnForObjects(key);
  }

  /**
   * Helper method to generate the ARN for a SSM parameter. Used to avoid duplication of logic in derived classes.
   */
  protected static arnForSsmParameter(parameter: IParameter) {
    return parameter.parameterArn;
  }

  /**
   * Prefix string based on the type of CredSpec.
   */
  public readonly prefixId: string;

  /**
   * Location or ARN from where to retrieve the CredSpec file.
   */
  public readonly fileLocation: string;

  /**
   * @param fileLocation Location or ARN from where to retrieve the CredSpec file
   */
  public constructor(prefixId: string, fileLocation: string) {
    this.prefixId = prefixId;
    this.fileLocation = fileLocation;
  }

  /**
   * Called when the container is initialized to allow this object to bind
   * to the stack.
   */
  public bind(): CredentialSpecConfig {
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
   * Loads the CredSpec from a S3 bucket object.
   *
   * @param bucket The S3 bucket
   * @param key The object key
   * @returns CredSpec with it's locations set to the S3 object's ARN.
   */
  public static fromS3Bucket(bucket: IBucket, key: string) {
    return new DomainJoinedCredentialSpec(CredentialSpec.arnForS3Object(bucket, key));
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

  public constructor(fileLocation: string) {
    super('credentialspec', fileLocation);
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
   * @returns CredSpec with it's locations set to the S3 object's ARN.
   */
  public static fromS3Bucket(bucket: IBucket, key: string) {
    return new DomainlessCredentialSpec(CredentialSpec.arnForS3Object(bucket, key));
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

  public constructor(fileLocation: string) {
    super('credentialspecdomainless', fileLocation);
  }
}

/**
 * Configuration for a credential specification (CredSpec) used for a ECS container.
 */
export interface CredentialSpecConfig {
  /**
   * Prefix used for the CredSpec string.
   */
  readonly typePrefix: string;

  /**
   * Location of the CredSpec file.
   */
  readonly location: string;
}
