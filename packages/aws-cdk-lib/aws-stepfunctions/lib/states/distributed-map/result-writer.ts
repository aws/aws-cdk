import * as iam from '../../../../aws-iam';
import { IBucket } from '../../../../aws-s3';
import { Arn, ArnFormat, Aws } from '../../../../core';
import { FieldUtils } from '../../fields';
import { QueryLanguage } from '../../types';

/**
 * Interface for Result Writer configuration props
 * @deprecated use {@link ResultWriterV2Props} instead
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
 * Interface for Result Writer configuration props
 */
export interface ResultWriterV2Props {
  /**
   * S3 Bucket in which to save Map Run results
   * @default - specify a bucket
   */
  readonly bucket?: IBucket;

  /**
   * S3 bucket name in which to save Map Run results, as JsonPath
   *
   * @default - no bucket path
   */
  readonly bucketNamePath?: string;

  /**
   * S3 prefix in which to save Map Run results
   *
   * @default - No prefix
   */
  readonly prefix?: string;

  /**
   * Configuration to format the output of the Child Workflow executions
   *
   * @default - Specify both Transformation and OutputType
   */
  readonly writerConfig?: WriterConfig;
}

/**
 * The transformation to be applied to the Output of the Child Workflow executions
 */
export enum Transformation {
  /**
   * Returns the output of the child workflow executions unchanged, in addition to the workflow metadata.
   * Default when exporting the child workflow execution results to Amazon S3 and WriterConfig is not specified.
   */
  NONE = 'NONE',

  /**
   * Returns the output of the child workflow executions. Default when ResultWriter is not specified.
   */
  COMPACT = 'COMPACT',

  /**
   * Returns the output of the child workflow executions.
   * If a child workflow execution returns an array,this option flattens the array,
   * prior to returning the result to a state output or writing the result to an Amazon S3 object.
   */
  FLATTEN = 'FLATTEN',
}

/**
 * The format of the Output of the child workflow executions
 */
export enum OutputType {
  /**
   * Formats the results as a JSON array
   */
  JSON = 'JSON',
  /**
   * Formats the results as JSON Lines
   */
  JSONL = 'JSONL',
}

/**
 * Interface for Writer Config props
 */
export interface WriterConfigProps {
  /**
   * The transformation to be applied to the Output of the Child Workflow executions
   */
  readonly transformation: Transformation;

  /**
   * The format of the Output of the child workflow executions
   */
  readonly outputType: OutputType;
}

/**
 * Configuration to format the output
 */
export class WriterConfig {
  /**
   * The transformation to be applied to the Output of the Child Workflow executions
   */
  readonly transformation: Transformation;

  /**
   * The format of the Output of the child workflow executions
   */
  readonly outputType: OutputType;

  constructor(props: WriterConfigProps) {
    this.transformation = props.transformation;
    this.outputType = props.outputType;
  }
}

/**
 * Generate policy statements to allow S3PutObject on the bucket
 */
function buildS3PutObjectPolicyStatements(bucketName?: string): iam.PolicyStatement[] {
  const resource = bucketName ? Arn.format({
    region: '',
    account: '',
    partition: Aws.PARTITION,
    service: 's3',
    resource: bucketName,
    resourceName: '*',
  }) : '*';

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

/**
 * Value for s3:putObject used as Resource for ResultWriter in the ASL
 * "arn:aws:states:::s3:putObject"
 */
const statesS3PutObjectResource = Arn.format({
  region: '',
  account: '',
  partition: Aws.PARTITION,
  service: 'states',
  resource: 's3',
  resourceName: 'putObject',
  arnFormat: ArnFormat.COLON_RESOURCE_NAME,
});

/**
 * Configuration for writing Distributed Map state results to S3
 * @deprecated use {@link ResultWriterV2} instead
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
    const argumentOrParameter = {
      Bucket: this.bucket.bucketRef.bucketName,
      ...(this.prefix && { Prefix: this.prefix }),
    };

    return FieldUtils.renderObject({
      Resource: statesS3PutObjectResource,
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
    return this.bucket?.bucketRef.bucketName ? buildS3PutObjectPolicyStatements(this.bucket.bucketRef.bucketName) : [];
  }
}

/**
 * Configuration for writing Distributed Map state results to S3
 * The ResultWriter field cannot be empty. You must specify one of these sets of sub-fields.
 *   writerConfig - to preview the formatted output, without saving the results to Amazon S3.
 *   bucket and prefix - to save the results to Amazon S3 without additional formatting.
 *   All three fields: writerConfig, bucket and prefix - to format the output and save it to Amazon S3.
 */
export class ResultWriterV2 {
  /**
   * S3 Bucket in which to save Map Run results
   */
  readonly bucket?: IBucket;

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

  /**
   * Configuration to format the output of the Child Workflow executions
   */
  readonly writerConfig?: WriterConfig;

  constructor(props: ResultWriterV2Props) {
    this.bucket = props.bucket;
    this.bucketNamePath = props.bucketNamePath;
    this.prefix = props.prefix;
    this.writerConfig = props.writerConfig;
  }

  /**
   * Render ResultWriter in ASL JSON format
   */
  public render(queryLanguage?: QueryLanguage): any {
    // Resource and Parameters are only applicable if the bucket is defined, otherwise they shouldn't be rendered.
    const shouldRenderResourceAndParameters = !!(this.bucket || this.bucketNamePath);
    const argumentOrParameter = shouldRenderResourceAndParameters ? {
      ...(this.bucket && { Bucket: this.bucket.bucketRef.bucketName }),
      ...(this.bucketNamePath && { Bucket: this.bucketNamePath }),
      ...(this.prefix && { Prefix: this.prefix }),
    }: undefined;

    return FieldUtils.renderObject({
      ...(shouldRenderResourceAndParameters && { Resource: statesS3PutObjectResource }),
      ...(argumentOrParameter && (queryLanguage === QueryLanguage.JSONATA ? {
        Arguments: argumentOrParameter,
      } : {
        Parameters: argumentOrParameter,
      })),
      ...(this.writerConfig && {
        WriterConfig: {
          OutputType: this.writerConfig?.outputType,
          Transformation: this.writerConfig?.transformation,
        },
      }),
    });
  }

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  public providePolicyStatements(): iam.PolicyStatement[] {
    if (!this.bucket?.bucketName && !this.bucketNamePath) {
      return [];
    } else if (this.bucketNamePath) {
      return buildS3PutObjectPolicyStatements();
    }
    return buildS3PutObjectPolicyStatements(this.bucket?.bucketName);
  }

  /**
   * Validate that ResultWriter contains exactly either @see bucket or @see bucketNamePath
   */
  public validateResultWriter(): string[] {
    const errors: string[] = [];
    if (this.bucket && this.bucketNamePath) {
      errors.push('Provide either `bucket` or `bucketNamePath`, but not both');
    }
    return errors;
  }
}
