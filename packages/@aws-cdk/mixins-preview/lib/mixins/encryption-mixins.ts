import { IConstruct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { IMixin } from '../core';

/**
 * Configuration for encryption at rest.
 */
export interface EncryptionConfig {
  /**
   * The encryption algorithm to use.
   * @default 'aws:kms'
   */
  readonly algorithm?: string;

  /**
   * Whether to enable S3 bucket key for cost optimization.
   * @default true
   */
  readonly bucketKeyEnabled?: boolean;
}

/**
 * Cross-service mixin that applies encryption at rest to supported resources.
 */
export class EncryptionAtRest implements IMixin {
  constructor(private readonly config: EncryptionConfig = {}) {}

  supports(construct: IConstruct): boolean {
    return construct instanceof s3.CfnBucket ||
           construct instanceof logs.CfnLogGroup ||
           construct instanceof dynamodb.CfnTable;
  }

  applyTo(construct: IConstruct): IConstruct {
    if (construct instanceof s3.CfnBucket) {
      this.applyToS3Bucket(construct);
    } else if (construct instanceof logs.CfnLogGroup) {
      this.applyToLogGroup(construct);
    } else if (construct instanceof dynamodb.CfnTable) {
      this.applyToDynamoTable(construct);
    }
    return construct;
  }

  validate(construct: IConstruct): string[] {
    const errors: string[] = [];
    if (construct instanceof s3.CfnBucket && !construct.bucketEncryption) {
      errors.push('S3 bucket encryption not configured');
    }
    return errors;
  }

  private applyToS3Bucket(bucket: s3.CfnBucket): void {
    bucket.bucketEncryption = {
      serverSideEncryptionConfiguration: [{
        bucketKeyEnabled: this.config.bucketKeyEnabled ?? true,
        serverSideEncryptionByDefault: {
          sseAlgorithm: this.config.algorithm ?? 'aws:kms',
        },
      }],
    };
  }

  private applyToLogGroup(logGroup: logs.CfnLogGroup): void {
    // Apply encryption to CloudWatch Logs
    (logGroup as any).kmsKeyId = 'alias/aws/logs';
  }

  private applyToDynamoTable(table: dynamodb.CfnTable): void {
    table.sseSpecification = {
      sseEnabled: true,
    };
  }
}
