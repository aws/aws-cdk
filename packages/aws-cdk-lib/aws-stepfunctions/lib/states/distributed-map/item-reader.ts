import * as iam from '../../../../aws-iam';
import { IBucket } from '../../../../aws-s3';
import { Arn, ArnFormat, Aws } from '../../../../core';
import { FieldUtils } from '../../fields';

/**
 * Base interface for Item Reader configurations
 */
export interface IItemReader {
  /**
   * S3 Bucket containing objects to iterate over or a file with a list to iterate over
   */
  readonly bucket: IBucket;

  /**
   * S3 bucket name containing objects to iterate over or a file with a list to iterate over, as JsonPath
   */
  readonly bucketNamePath?: string;

  /**
   * The Amazon S3 API action that Step Functions must invoke depending on the specified dataset.
   */
  readonly resource: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - Distributed Map state will iterate over all items provided by the ItemReader
   */
  readonly maxItems?: number;

  /**
   * Render the ItemReader as JSON object
   */
  render(): any;

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  providePolicyStatements(): iam.PolicyStatement[];

  /**
   * Validate that ItemReader contains exactly either @see bucket or @see bucketNamePath
   */
  validateItemReader(): string[];
}

/**
 * Base interface for Item Reader configuration properties
 */
export interface ItemReaderProps {
  /**
   * S3 Bucket containing objects to iterate over or a file with a list to iterate over
   *
   * @default - S3 bucket will be determined from @see bucketNamePath
   */
  readonly bucket?: IBucket;

  /**
   * S3 bucket name containing objects to iterate over or a file with a list to iterate over, as JsonPath
   *
   * @default - S3 bucket will be determined from @see bucket
   */
  readonly bucketNamePath?: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - Distributed Map state will iterate over all items provided by the ItemReader
   */
  readonly maxItems?: number;
}

/**
 * Properties for configuring an Item Reader that iterates over objects in an S3 bucket
 */
export interface S3ObjectsItemReaderProps extends ItemReaderProps {
  /**
   * S3 prefix used to limit objects to iterate over
   *
   * @default - No prefix
   */
  readonly prefix?: string;
}

/**
 * Item Reader configuration for iterating over objects in an S3 bucket
 */
export class S3ObjectsItemReader implements IItemReader {
  private readonly _bucket?: IBucket;

  /**
   * S3 Bucket containing objects to iterate over
   */
  public get bucket(): IBucket {
    if (!this._bucket) {
      throw new Error('`bucket` is undefined');
    }
    return this._bucket;
  }

  /**
   * S3 bucket name containing objects to iterate over or a file with a list to iterate over, as JsonPath
   */
  readonly bucketNamePath?: string;

  /**
   * ARN for the `listObjectsV2` method of the S3 API
   * This API method is used to iterate all objects in the S3 bucket/prefix
   */
  readonly resource: string;

  /**
   * S3 prefix used to limit objects to iterate over
   *
   * @default - No prefix
   */
  readonly prefix?: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - Distributed Map state will iterate over all items provided by the ItemReader
   */
  readonly maxItems?: number;

  constructor(props: S3ObjectsItemReaderProps) {
    this._bucket = props.bucket;
    this.bucketNamePath = props.bucketNamePath;
    this.prefix = props.prefix;
    this.maxItems = props.maxItems;
    this.resource = Arn.format({
      region: '',
      account: '',
      partition: Aws.PARTITION,
      service: 'states',
      resource: 's3',
      resourceName: 'listObjectsV2',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Renders the ItemReader configuration as JSON object
   * @returns - JSON object
   */
  public render(): any {
    return FieldUtils.renderObject({
      Resource: this.resource,
      ...(this.maxItems && { ReaderConfig: { MaxItems: this.maxItems } }),
      Parameters: {
        ...(this._bucket && { Bucket: this._bucket.bucketName }),
        ...(this.bucketNamePath && { Bucket: this.bucketNamePath }),
        ...(this.prefix && { Prefix: this.prefix }),
      },
    });
  }

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  public providePolicyStatements(): iam.PolicyStatement[] {
    return [
      new iam.PolicyStatement({
        actions: [
          's3:ListBucket',
        ],
        resources: [this._bucket ? this._bucket.bucketArn : '*'],
      }),
    ];
  }

  /**
   * Validate that ItemReader contains exactly either @see bucket or @see bucketNamePath
   */
  public validateItemReader(): string[] {
    const errors: string[] = [];
    if (this._bucket && this.bucketNamePath) {
      errors.push('Provide either `bucket` or `bucketNamePath`, but not both');
    } else if (!this._bucket && !this.bucketNamePath) {
      errors.push('Provide either `bucket` or `bucketNamePath`');
    }
    return errors;
  }
}

/**
 * Base interface for Item Reader configuration properties the iterate over entries in a S3 file
 */
export interface S3FileItemReaderProps extends ItemReaderProps {
  /**
   * Key of file stored in S3 bucket containing an array to iterate over
   */
  readonly key: string;
}

/**
 * Base Item Reader configuration for iterating over entries in a S3 file
 */
abstract class S3FileItemReader implements IItemReader {
  private readonly _bucket?: IBucket;

  /**
   * S3 Bucket containing a file with a list to iterate over
   */
  public get bucket(): IBucket {
    if (!this._bucket) {
      throw new Error('`bucket` is undefined');
    }
    return this._bucket;
  }

  /**
   * S3 bucket name containing objects to iterate over or a file with a list to iterate over, as JsonPath
   */
  readonly bucketNamePath?: string;

  /**
   * S3 key of a file with a list to iterate over
   */
  readonly key: string;

  /**
   * ARN for the `getObject` method of the S3 API
   * This API method is used to iterate all objects in the S3 bucket/prefix
   */
  readonly resource: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - No maxItems
   */
  readonly maxItems?: number;

  protected abstract readonly inputType: string;

  constructor(props: S3FileItemReaderProps) {
    this._bucket = props.bucket;
    this.bucketNamePath = props.bucketNamePath;
    this.key = props.key;
    this.maxItems = props.maxItems;
    this.resource = Arn.format({
      region: '',
      account: '',
      partition: Aws.PARTITION,
      service: 'states',
      resource: 's3',
      resourceName: 'getObject',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Renders the ItemReader configuration as JSON object
   * @returns - JSON object
   */
  public render(): any {
    return FieldUtils.renderObject({
      Resource: this.resource,
      ReaderConfig: {
        InputType: this.inputType,
        ...(this.maxItems && { MaxItems: this.maxItems }),
      },
      Parameters: {
        ...(this._bucket && { Bucket: this._bucket.bucketName }),
        ...(this.bucketNamePath && { Bucket: this.bucketNamePath }),
        Key: this.key,
      },
    });
  }

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  public providePolicyStatements(): iam.PolicyStatement[] {
    if (!this._bucket) return [];
    const resource = Arn.format({
      region: '',
      account: '',
      partition: Aws.PARTITION,
      service: 's3',
      resource: this._bucket.bucketName,
      resourceName: '*',
    });

    return [
      new iam.PolicyStatement({
        actions: [
          's3:GetObject',
        ],
        resources: [resource],
      }),
    ];
  }

  /**
   * Validate that ItemReader contains exactly either @see bucket or @see bucketNamePath
   */
  public validateItemReader(): string[] {
    const errors: string[] = [];
    if (this._bucket && this.bucketNamePath) {
      errors.push('Provide either `bucket` or `bucketNamePath`, but not both');
    } else if (!this._bucket && !this.bucketNamePath) {
      errors.push('Provide either `bucket` or `bucketNamePath`');
    }
    return errors;
  }
}

/**
 * Item Reader configuration for iterating over items in a JSON array stored in a S3 file
 */
export class S3JsonItemReader extends S3FileItemReader {
  protected readonly inputType: string = 'JSON';
}

/**
 * CSV header location options
 */
export enum CsvHeaderLocation {
  /**
   * Headers will be read from first row of CSV file
   */
  FIRST_ROW = 'FIRST_ROW',

  /**
   * Headers are provided in CSVHeaders property
   */
  GIVEN = 'GIVEN',
}

/**
 * Configuration for CSV header options for a CSV Item Reader
 */
export class CsvHeaders {
  /**
   * Configures S3CsvItemReader to read headers from the first row of the CSV file
   * @returns - CsvHeaders
   */
  public static useFirstRow(): CsvHeaders {
    return new CsvHeaders(CsvHeaderLocation.FIRST_ROW);
  }

  /**
   * Configures S3CsvItemReader to use the headers provided in the `headers` parameter
   * @param headers - List of headers
   * @returns - CsvHeaders
   */
  public static use(headers: string[]): CsvHeaders {
    return new CsvHeaders(CsvHeaderLocation.GIVEN, headers);
  }

  /**
   * Location of headers in CSV file
   */
  public readonly headerLocation: CsvHeaderLocation;

  /**
   * List of headers if `headerLocation` is `GIVEN`
   */
  public readonly headers?: string[];

  private constructor(headerLocation: CsvHeaderLocation, headers?: string[]) {
    this.headerLocation = headerLocation;
    this.headers = headers;
  }
}

/**
 * Properties for configuring an Item Reader that iterates over items in a CSV file in S3
 */
export interface S3CsvItemReaderProps extends S3FileItemReaderProps {
  /**
   * CSV file header configuration
   *
   * @default - CsvHeaders with CsvHeadersLocation.FIRST_ROW
   */
  readonly csvHeaders?: CsvHeaders;
}

/**
 * Item Reader configuration for iterating over items in a CSV file stored in S3
 */
export class S3CsvItemReader extends S3FileItemReader {
  /**
   * CSV headers configuration
   */
  readonly csvHeaders: CsvHeaders;
  protected readonly inputType: string = 'CSV';

  constructor(props: S3CsvItemReaderProps) {
    super(props);
    this.csvHeaders = props.csvHeaders ?? CsvHeaders.useFirstRow();
  }

  public render(): any {
    let rendered = super.render();

    rendered.ReaderConfig = FieldUtils.renderObject({
      ...rendered.ReaderConfig,
      ...{
        CSVHeaderLocation: this.csvHeaders.headerLocation,
        ...(this.csvHeaders.headers && { CSVHeaders: this.csvHeaders.headers }),
      },
    });

    return rendered;
  }
}

/**
 * Item Reader configuration for iterating over items in a S3 inventory manifest file stored in S3
 */
export class S3ManifestItemReader extends S3FileItemReader {
  protected readonly inputType: string = 'MANIFEST';
}
