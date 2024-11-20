import { Construct } from 'constructs';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';

/**
 * Use a S3 bucket as a Lambda destination
 */
export class S3Destination implements lambda.IDestination {
  constructor(private readonly bucket: s3.IBucket) {
  }

  /**
   * Returns a destination configuration
   */
  public bind(_scope: Construct, fn: lambda.IFunction, _options?: lambda.DestinationOptions): lambda.DestinationConfig {
    // grant read and putObject permissions
    this.bucket.grantRead(fn);
    this.bucket.grantPut(fn);

    return {
      destination: this.bucket.bucketArn,
    };
  }
}
