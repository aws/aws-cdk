import * as AWS from 'aws-sdk';

/**
 * AWS SDK operations required by Asset Publishing
 */
export interface IAws {
  discoverPartition(): Promise<string>;
  discoverDefaultRegion(): Promise<string>;
  discoverCurrentAccount(): Promise<Account>;

  s3Client(options: ClientOptions): Promise<AWS.S3>;
  ecrClient(options: ClientOptions): Promise<AWS.ECR>;
}

export interface ClientOptions {
  region?: string;
  assumeRoleArn?: string;
  assumeRoleExternalId?: string;
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
