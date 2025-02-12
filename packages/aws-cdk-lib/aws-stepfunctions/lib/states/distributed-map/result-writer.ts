import * as iam from '../../../../aws-iam';
import { IBucket } from '../../../../aws-s3';
import { Arn, ArnFormat, Aws } from '../../../../core';
import { FieldUtils } from '../../fields';
import { QueryLanguage } from '../../types';

/**
 * Interface for Result Writer configuration options
 */
export interface ResultWriterOptions {
  /**
   * S3 Bucket in which to save Map Run results
   */
  readonly bucket: IBucket;

  /**
   * The prefix to use for the file where the Map Run results are saved
   *
   * @default - No prefix
   */
  readonly prefix?: string;

}

/**
 * Interface for Result Writer configuration properties
 */
export interface ResultWriterProps extends ResultWriterOptions {
  /**
   * Query language to use when writing results to S3
   *
   * @default undefined - QueryLanguage.JSON_PATH
   */
  readonly queryLanguage?: QueryLanguage;
}

/**
 * Configuration for writing Distributed Map state results to S3
 */
export class ResultWriter {
  /**
   * Define a ResultWriter using JSONPath in the state machine
   *
   * A ResultWriter can be used for writing Distributed Map state results to S3
   */
  public static jsonPath(props: ResultWriterOptions) {
    return new ResultWriter(props);
  }

  /**
   * Define a ResultWriter using JSONata in the state machine
   *
   * A ResultWriter can be used for writing Distributed Map state results to S3
   */
  public static jsonata(props: ResultWriterOptions) {
    return new ResultWriter({
      ...props,
      queryLanguage: QueryLanguage.JSONATA,
    });
  }

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

  /**
   * Query language to use when writing results to S3
   *
   * @default undefined - QueryLanguage.JSON_PATH
   */
  readonly queryLanguage?: QueryLanguage;

  constructor(props: ResultWriterProps) {
    this.bucket = props.bucket;
    this.prefix = props.prefix;
    this.queryLanguage = props.queryLanguage;
  }

  /**
   * Render ResultWriter in ASL JSON format
   */
  public render(): any {
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
      ...(this.queryLanguage === QueryLanguage.JSONATA ? {
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
