import { ECR as ecr } from '@aws-sdk/client-ecr';
import { CompleteMultipartUploadCommandOutput, PutObjectCommandInput, S3 as s3 } from '@aws-sdk/client-s3';
import { SecretsManager as SM } from '@aws-sdk/client-secrets-manager';

// To avoid forcing users of this package onto sdkv3 we will re-export the type
export type ECR = ecr;
export type SecretsManager = SM;

export abstract class S3 extends s3 {
  public abstract upload(input: PutObjectCommandInput): Promise<CompleteMultipartUploadCommandOutput>;
}
/**
 * AWS SDK operations required by Asset Publishing
 */
export interface IAws {
  discoverPartition(): Promise<string>;
  discoverDefaultRegion(): Promise<string>;
  discoverCurrentAccount(): Promise<Account>;

  discoverTargetAccount(options: ClientOptions): Promise<Account>;
  s3Client(options: ClientOptions): Promise<S3>;
  ecrClient(options: ClientOptions): Promise<ECR>;
  secretsManagerClient(options: ClientOptions): Promise<SecretsManager>;
}

export interface ClientOptions {
  region?: string;
  assumeRoleArn?: string;
  assumeRoleExternalId?: string;
  quiet?: boolean;
}

/**
 * An AWS account
 *
 * An AWS account always exists in only one partition. Usually we don't care about
 * the partition, but when we need to form ARNs we do.
 */
export interface Account {
  /**
   * The account number
   */
  readonly accountId: string;

  /**
   * The partition ('aws' or 'aws-cn' or otherwise)
   */
  readonly partition: string;
}