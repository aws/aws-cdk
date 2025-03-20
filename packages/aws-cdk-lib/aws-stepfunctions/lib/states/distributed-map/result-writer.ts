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
   *
   * @default - S3 bucket will be determined from @see bucketNamePath
   */
  readonly bucket?: IBucket;

  /**
   * S3 bucket name in which to save Map Run results, as JsonPath
   *
   * @default - S3 bucket will be determined from @see bucket
   */
  readonly bucketNamePath?: string;

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
  private readonly _bucket?: IBucket;

  /**
   * S3 Bucket in which to save Map Run results
   */
  public get bucket(): IBucket {
    if (!this._bucket) {
      throw new Error('`bucket` is undefined');
    }
    return this._bucket;
  }

  /**
   * S3 bucket name in which to save Map Run results, as JsonPath
   */
  readonly bucketNamePath?: string;

  /**
   * S3 prefix in which to save Map Run results
   *
   * @default - No prefix
   */
  readonly prefix?: string;

  constructor(props: ResultWriterProps) {
    this._bucket = props.bucket;
    this.bucketNamePath = props.bucketNamePath;
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
      ...(this._bucket && { Bucket: this._bucket.bucketName }),
      ...(this.bucketNamePath && { Bucket: this.bucketNamePath }),
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
    const statements = [
      new iam.PolicyStatement({
        actions: [
          's3:PutObject',
          's3:GetObject',
          's3:ListMultipartUploadParts',
          's3:AbortMultipartUpload',
        ],
        resources: [
          this._bucket ? Arn.format({
            region: '',
            account: '',
            partition: Aws.PARTITION,
            service: 's3',
            resource: this._bucket.bucketName,
            resourceName: '*',
          }) : '*',
        ],
      }),
    ];

    if (!this._bucket) {
      statements.push(new iam.PolicyStatement({
        actions: ['s3:ListBucket'],
        resources: ['*'],
      }));
    }

    return statements;
  }

  /**
   * Validate that ResultWriter contains exactly either @see bucket or @see bucketNamePath
   */
  public validateResultWriter(): string[] {
    const errors: string[] = [];
    if (this._bucket && this.bucketNamePath) {
      errors.push('Provide either `bucket` or `bucketNamePath`, but not both');
    } else if (!this._bucket && !this.bucketNamePath) {
      errors.push('Provide either `bucket` or `bucketNamePath`');
    }
    return errors;
  }
}
