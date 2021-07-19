import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct, Node } from 'constructs';

/**
 * Props for defining an S3 destination of a Kinesis Data Firehose delivery stream.
 */
export interface S3BucketProps extends firehose.DestinationProps { }

/**
 * An S3 bucket destination for data from a Kinesis Data Firehose delivery stream.
 */
export class S3Bucket extends firehose.DestinationBase {
  constructor(private readonly bucket: s3.IBucket, s3Props: S3BucketProps = {}) {
    super(s3Props);
  }

  bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'S3 Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const bucketGrant = this.bucket.grantReadWrite(role);
    Node.of(scope).addDependency(bucketGrant);

    return {
      extendedS3DestinationConfiguration: {
        cloudWatchLoggingOptions: this.createLoggingOptions(scope, role, 'S3Destination'),
        roleArn: role.roleArn,
        bucketArn: this.bucket.bucketArn,
      },
    };
  }
}
