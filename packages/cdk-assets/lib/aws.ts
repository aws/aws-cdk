import * as AWS from 'aws-sdk';

/**
 * AWS SDK operations required by Asset Publishing
 */
export interface IAws {
  discoverDefaultRegion(): Promise<string>;
  discoverCurrentAccount(): Promise<string>;

  s3Client(options: ClientOptions): Promise<AWS.S3>;
  ecrClient(options: ClientOptions): Promise<AWS.ECR>;
}

export interface ClientOptions {
  region?: string;
  assumeRoleArn?: string;
  assumeRoleExternalId?: string;
}