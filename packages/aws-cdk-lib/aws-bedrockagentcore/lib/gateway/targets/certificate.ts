import type { CfnGatewayTarget } from '../../../../aws-bedrockagentcore';
import * as iam from '../../../../aws-iam';
import type { IBucket } from '../../../../aws-s3';
import type { ISecret } from '../../../../aws-secretsmanager';
import { Aws, Token } from '../../../../core';
import { UnscopedValidationError } from '../../../../core/lib/errors';
import { lit } from '../../../../core/lib/helpers-internal';

/**
 * Options for referencing a private CA certificate stored in Amazon S3.
 */
export interface CertificateFromBucketOptions {
  /**
   * The account ID of the Amazon S3 bucket owner.
   *
   * Set this when the bucket is owned by a different AWS account than the gateway.
   *
   * @default - the bucket owner is not specified
   */
  readonly bucketOwnerAccountId?: string;
}

/**
 * A reference to a PEM-encoded private certificate authority (CA) certificate
 * that the gateway uses to verify TLS connections to the target endpoint.
 *
 * Use this when the target endpoint presents a certificate issued by a private CA
 * that is not trusted by default. The configuration only references the certificate;
 * it never contains the certificate content.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CertificateConfiguration.html
 */
export abstract class CertificateConfiguration {
  /**
   * Reference a PEM-encoded private CA certificate stored as an Amazon S3 object.
   *
   * The gateway's execution role is granted `s3:GetObject` on the object
   * (and `kms:Decrypt` on the bucket's encryption key, if any).
   *
   * @param bucket The bucket that contains the certificate
   * @param objectKey The object key of the PEM-encoded certificate
   * @param options Additional options
   */
  public static fromBucket(
    bucket: IBucket,
    objectKey: string,
    options: CertificateFromBucketOptions = {},
  ): CertificateConfiguration {
    return new S3CertificateConfiguration(bucket, objectKey, options);
  }

  /**
   * Reference a PEM-encoded private CA certificate stored in an AWS Secrets Manager secret.
   *
   * The gateway's execution role is granted read access to the secret
   * (and `kms:Decrypt` on the secret's encryption key, if any).
   *
   * @param secret The secret that contains the certificate
   */
  public static fromSecret(secret: ISecret): CertificateConfiguration {
    return new SecretsManagerCertificateConfiguration(secret);
  }

  /**
   * Renders the CloudFormation property.
   * @internal
   */
  public abstract _render(): CfnGatewayTarget.CertificateConfigurationProperty;

  /**
   * Grants the given role read access to the certificate.
   * @internal
   */
  public abstract _grantRead(role: iam.IRole): iam.Grant;
}

/**
 * Private CA certificate stored in Amazon S3.
 */
class S3CertificateConfiguration extends CertificateConfiguration {
  constructor(
    private readonly bucket: IBucket,
    private readonly objectKey: string,
    private readonly options: CertificateFromBucketOptions,
  ) {
    super();
    if (!Token.isUnresolved(objectKey) && objectKey.length === 0) {
      throw new UnscopedValidationError(lit`CertificateObjectKeyEmpty`, 'The object key of the certificate must not be empty');
    }
    const ownerId = options.bucketOwnerAccountId;
    if (ownerId !== undefined && !Token.isUnresolved(ownerId) && !/^[0-9]{12}$/.test(ownerId)) {
      throw new UnscopedValidationError(
        lit`CertificateBucketOwnerAccountIdInvalid`,
        `bucketOwnerAccountId must be a 12-digit AWS account ID, got "${ownerId}"`,
      );
    }
  }

  public _render(): CfnGatewayTarget.CertificateConfigurationProperty {
    return {
      s3: {
        uri: `s3://${this.bucket.bucketName}/${this.objectKey}`,
        bucketOwnerAccountId: this.options.bucketOwnerAccountId,
      },
    };
  }

  public _grantRead(role: iam.IRole): iam.Grant {
    const grant = iam.Grant.addToPrincipal({
      grantee: role,
      actions: ['s3:GetObject'],
      resourceArns: [`arn:${Aws.PARTITION}:s3:::${this.bucket.bucketName}/${this.objectKey}`],
    });
    this.bucket.encryptionKey?.grantDecrypt(role);
    return grant;
  }
}

/**
 * Private CA certificate stored in AWS Secrets Manager.
 */
class SecretsManagerCertificateConfiguration extends CertificateConfiguration {
  constructor(private readonly secret: ISecret) {
    super();
  }

  public _render(): CfnGatewayTarget.CertificateConfigurationProperty {
    return {
      secretsManager: {
        secretArn: this.secret.secretArn,
      },
    };
  }

  public _grantRead(role: iam.IRole): iam.Grant {
    return this.secret.grantRead(role);
  }
}
