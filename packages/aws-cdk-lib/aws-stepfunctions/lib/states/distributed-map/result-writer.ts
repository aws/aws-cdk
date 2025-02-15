import * as iam from '../../../../aws-iam';
import { IBucket } from '../../../../aws-s3';
import { Arn, ArnFormat, Aws } from '../../../../core';
import { FieldUtils } from '../../fields';
import { QueryLanguage } from '../../types';

/**
 * Interface for Result Writer configuration props
 */
export interface ResultWriterProps {
  /**
   * S3 Bucket in which to save Map Run results
   */
  readonly bucket: IBucket;

  /**
   * S3 prefix in which to save Map Run results
   *
   * @default - No prefix
   */
  readonly prefix?: string;
}

/**
 * Configuration for writing Distributed Map state results to S3
 */
export class ResultWriter {
  /**
   * S3 Bucket in which to save Map Run results
   */
  readonly bucket: IBucket;

  /**
   * S3 prefix in which to save Map Run results
   *
   * @default - No prefix
   */
  readonly prefix?: string;

  constructor(props: ResultWriterProps) {
    this.bucket = props.bucket;
    this.prefix = props.prefix;
  }

  /**
   * Render ResultWriter in ASL JSON format
   */
  public render(queryLanguage?: QueryLanguage): any {
    const resource = Arn.format({
      region: '',
      account: '',
      partition: Aws.PARTITION,
      service: 'states',
      resource: 's3',
      resourceName: 'putObject',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    const argumentOrParameter = {
      Bucket: this.bucket.bucketName,
      ...(this.prefix && { Prefix: this.prefix }),
    };

    return FieldUtils.renderObject({
      Resource: resource,
      ...(queryLanguage === QueryLanguage.JSONATA ? {
        Arguments: argumentOrParameter,
      } : {
        Parameters: argumentOrParameter,
      }),
    });
  }

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  public providePolicyStatements(): iam.PolicyStatement[] {
    const resource = Arn.format({
      region: '',
      account: '',
      partition: Aws.PARTITION,
      service: 's3',
      resource: this.bucket.bucketName,
      resourceName: '*',
    });

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
}
