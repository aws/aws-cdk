import * as iam from '@aws-cdk/aws-iam';
import { FieldUtils } from '../../fields';
import { isPathString } from '../../util';
import { DistributedMapResource } from './distributed-map-resource';

/**
 * Properties for ResultWriter
 */
export interface ResultWriterProps {}

/**
 * Base class for ResultWriter
 */
export class ResultWriter {
  /**
   * Render the properties to JSON
   */
  public render(): any {
    return {};
  }

  /**
   * Returns the IAM policy statements required by this ResultWriter
   */
  public providePolicyStatements(): iam.PolicyStatement[] {
    return [];
  }
}

/**
 * Properties for S3Writer
 */
export interface S3WriterProps extends ResultWriterProps {
  /**
   * The S3 bucket
   */
  readonly bucket: string;

  /**
   * The S3 key prefix
   */
  readonly prefix: string;
}

/**
 * ResultWriter that writes to S3
 */
export class S3Writer extends ResultWriter {
  private readonly bucket: string;
  private readonly prefix: string;

  constructor(props: S3WriterProps) {
    super();
    this.bucket = props.bucket;
    this.prefix = props.prefix;
  }

  public render(): any {
    return {
      Resource: DistributedMapResource.S3_PUT_OBJECT,
      ...this.renderParameters(),
    };
  }

  public providePolicyStatements(): iam.PolicyStatement[] {
    let resource = '*';
    if (!isPathString(this.bucket)) {
      const resourceSiffix = isPathString(this.prefix) ? '*' : `${this.prefix}/*`;
      resource = `arn:aws:s3:::${this.bucket}/${resourceSiffix}`;
    }

    return [
      new iam.PolicyStatement({
        actions: [
          's3:PutObject',
          's3:GetObject',
          's3:ListMultipartUploadParts',
          's3:AbortMultipartUpload',
        ],
        resources: [resource],
      }),
    ];
  }

  private renderParameters(): any {
    return FieldUtils.renderObject({
      Parameters: {
        Bucket: this.bucket,
        Prefix: this.prefix,
      },
    });
  }
}
