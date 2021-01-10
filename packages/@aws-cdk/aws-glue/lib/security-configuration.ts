import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { CfnSecurityConfiguration } from './glue.generated';

/**
 * Interface representing a created or an imported {@link SecurityConfiguration}
 */
export interface ISecurityConfiguration extends cdk.IResource {
  /**
   * The name of the security configuration
   * @attribute
   */
  readonly securityConfigurationName: string;
}

/**
 * Attributes for importing {@link SecurityConfiguration}
 */
export interface SecurityConfigurationAttributes {
  /**
   * The name of the security configuration
   */
  readonly securityConfigurationName: string;
}

/**
 * S3 encryption configuration
 */
export interface S3Encryption {
  /**
   * Encryption mode
   * @default depending on whether a kms key is provided or not, it can be disabled
   */
  readonly mode?: 'DISABLED' | 'SSE-KMS' | 'SSE-S3';

  /**
   * The KMS key to be used to encrypt the data.
   * @default depending on the mode
   */
  readonly kmsKey?: kms.IKey,
}

/**
 * CloudWatch Logs encryption configuration
 */
export interface CloudWatchEncryption {
  /**
   * Encryption mode
   * @default depending on whether a kms key is provided or not, it can be disabled
   *
   */
  readonly mode?: 'DISABLED' | 'SSE-KMS';

  /**
   * The KMS key to be used to encrypt the data.
   * @default kms key must be provided if mode is not disabled
   */
  readonly kmsKey?: kms.IKey,
}

/**
 * Job bookmarks encryption configuration
 */
export interface JobBookmarksEncryption {
  /**
   * Encryption mode
   * @default depending on whether a kms key is provided or not, it can be disabled
   */
  readonly mode?: 'DISABLED' | 'CSE-KMS';

  /**
   * The KMS key to be used to encrypt the data.
   * @default kms key must be provided if mode is not disabled
   */
  readonly kmsKey?: kms.IKey,
}

/**
 * Constructions properties of {@link SecurityConfiguration}
 */
export interface SecurityConfigurationProps {
  /**
   * The name of the security configuration.
   */
  readonly securityConfigurationName: string;

  /**
   * The encryption configuration for Amazon CloudWatch.
   * @default no cloudwatch encryption
   */
  readonly cloudWatchEncryption?: CloudWatchEncryption,

  /**
   * The encryption configuration for job bookmarks.
   * @default no job bookmarks encryption
   */
  readonly jobBookmarksEncryption?: JobBookmarksEncryption,

  /**
   * The encyption configuration for Amazon Simple Storage Service (Amazon S3) data.
   * @default no s3 encryptions
   */
  readonly s3Encryptions?: S3Encryption[],
}

/**
 * A security configuration is a set of security properties that can be used by AWS Glue to encrypt data at rest.
 *
 * The following scenarios show some of the ways that you can use a security configuration.
 * - Attach a security configuration to an AWS Glue crawler to write encrypted Amazon CloudWatch Logs.
 * - Attach a security configuration to an extract, transform, and load (ETL) job to write encrypted Amazon Simple Storage Service (Amazon S3) targets and encrypted CloudWatch Logs.
 * - Attach a security configuration to an ETL job to write its jobs bookmarks as encrypted Amazon S3 data.
 * - Attach a security configuration to a development endpoint to write encrypted Amazon S3 targets.
 */
export class SecurityConfiguration extends cdk.Resource implements ISecurityConfiguration {

  /**
   * Creates a Connection construct that represents an external connection.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param attrs Import attributes
   */
  public static fromSecurityConfigurationAttributes(scope: constructs.Construct, id: string,
    attrs: SecurityConfigurationAttributes): ISecurityConfiguration {

    class Import extends cdk.Resource implements ISecurityConfiguration {
      public readonly securityConfigurationName = attrs.securityConfigurationName;
    }
    return new Import(scope, id);
  }

  /**
   * The name of the security configuration
   * @attribute
   */
  public readonly securityConfigurationName: string;

  constructor(scope: constructs.Construct, id: string, props: SecurityConfigurationProps) {
    super(scope, id, {
      physicalName: props.securityConfigurationName,
    });

    const s3Encryptions = props.s3Encryptions ? props.s3Encryptions.map((s3Encryption) => ({
      s3EncryptionMode: s3Encryption.mode,
      kmsKeyArn: s3Encryption.kmsKey ? s3Encryption.kmsKey.keyArn : undefined,
    })) : undefined;

    const cloudWatchEncryption = props.cloudWatchEncryption ? {
      cloudWatchEncryptionMode: props.cloudWatchEncryption.mode,
      kmsKeyArn: props.cloudWatchEncryption.kmsKey ? props.cloudWatchEncryption.kmsKey.keyArn : undefined,
    } : undefined;

    const jobBookmarksEncryption = props.jobBookmarksEncryption ? {
      jobBookmarksEncryptionMode: props.jobBookmarksEncryption.mode,
      kmsKeyArn: props.jobBookmarksEncryption.kmsKey ? props.jobBookmarksEncryption.kmsKey.keyArn : undefined,
    } : undefined;

    const resource = new CfnSecurityConfiguration(this, 'Resource', {
      name: props.securityConfigurationName,
      encryptionConfiguration: {
        cloudWatchEncryption,
        jobBookmarksEncryption,
        s3Encryptions,
      },
    });

    this.securityConfigurationName = this.getResourceNameAttribute(resource.ref);
  }
}