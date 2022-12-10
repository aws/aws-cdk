import * as iam from '@aws-cdk/aws-iam';
import { FieldUtils } from '../../fields';
import { isPathString } from '../../util';
import { DistributedMapResource } from './distributed-map-resource';

/**
 * Properties for ItemReader
 */
export interface ItemReaderProps {
  /**
   * The maximum number of items to read
   *
   * @default - no limit
   */
  readonly maxItems?: number;

  /**
   * The path to the maximum number of items
   *
   * @default - no path
   */
  readonly maxItemsPath?: string;
}

/**
 * Base class for ItemReader
 */
export class ItemReader {
  protected readonly maxItems?: number;
  protected readonly maxItemsPath?: string;

  constructor(props: ItemReaderProps) {
    if (props.maxItems && props.maxItemsPath) {
      throw new Error('Only one of maxItems and maxItemsPath can be provided');
    }
    this.maxItems = props.maxItems;
    this.maxItemsPath = props.maxItemsPath;
  }

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

  protected renderMaxItems(): any {
    return {
      ...(this.maxItems ? { MaxItems: this.maxItems } : {}),
      ...(this.maxItemsPath ? { MaxItemsPath: this.maxItemsPath } : {}),
    };
  }
}

/**
 * Properties for S3Reader
 */
export interface S3ReaderProps extends ItemReaderProps {
  /**
   * The S3 bucket
   */
  readonly bucket: string;

  /**
   * The S3 key
   */
  readonly key: string;
}

/**
 * S3 implementation of ItemReader
 */
export class S3Reader extends ItemReader {
  protected readonly bucket: string;
  protected readonly key: string;
  protected readonly resource: DistributedMapResource;

  constructor(props: S3ReaderProps, resource: DistributedMapResource) {
    super(props);
    this.bucket = props.bucket;
    this.key = props.key;
    this.resource = resource;
  }

  public render(): any {
    return {
      Resource: this.resource,
      ReaderConfig: {
        ...this.renderReaderConfigOptions(),
        ...super.renderMaxItems(),
      },
      ...this.renderParameters(),
    };
  }

  protected renderReaderConfigOptions(): any {
    return {};
  }

  protected renderParameters(): any {
    return FieldUtils.renderObject({
      Parameters: {
        Bucket: this.bucket,
        Key: this.key,
      },
    });
  }
}

/**
 * CSV Header Location Options
 */
export enum CSVHeaderLocation {
  /**
   * The first row of the CSV file is the header
   */
  FIRST_ROW = 'FIRST_ROW',

  /**
   * The header is given in the headers property
   */
  GIVEN = 'GIVEN',
}

/**
 * Properties for S3CSVReader
 */
export interface S3CSVReaderProps extends S3ReaderProps {
  /**
   * The location of the header in the CSV file
   *
   * @default CSVHeaderLocation.FIRST_ROW
   */
  readonly headerLocation?: CSVHeaderLocation;

  /**
   * The headers of the CSV file
   *
   * @default - no headers
   */
  readonly headers?: string[];
}

/**
 * S3Reader for CSV files
 */
export class S3CSVReader extends S3Reader {
  private readonly headerLocation?: CSVHeaderLocation;
  private readonly headers?: string[];

  constructor(props: S3CSVReaderProps) {
    if (props.headerLocation === CSVHeaderLocation.GIVEN && !props.headers) {
      throw new Error('headers must be specified when headerLocation is GIVEN');
    }
    if (props.headerLocation === CSVHeaderLocation.FIRST_ROW && props.headers) {
      throw new Error('headers must not be specified when headerLocation is FIRST_ROW');
    }

    super(props, DistributedMapResource.S3_GET_OBJECT);
    this.headerLocation = props.headerLocation;
    this.headers = props.headers;
  }

  protected renderReaderConfigOptions(): any {
    return {
      InputType: 'CSV',
      CSVHeaderLocation: this.headerLocation ?? CSVHeaderLocation.FIRST_ROW,
      ...(this.headers ? { CSVHeaders: this.headers } : {}),
    };
  }

  public providePolicyStatements(): iam.PolicyStatement[] {
    let resource = '*';
    if (!isPathString(this.bucket)) {
      const resourceSiffix = isPathString(this.key) ? '*' : this.key;
      resource = `arn:aws:s3:::${this.bucket}/${resourceSiffix}`;
    }

    return [
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [resource],
      }),
    ];
  }
}

/**
 * S3Reader for S3 Objects
 */
export class S3ObjectsReader extends S3Reader {
  constructor(props: S3ReaderProps) {
    super(props, DistributedMapResource.S3_LIST_OBJECTS_V2);
  }

  protected renderParameters(): any {
    return FieldUtils.renderObject({
      Parameters: {
        Bucket: this.bucket,
        Prefix: this.key,
      },
    });
  }

  public providePolicyStatements(): iam.PolicyStatement[] {
    const resource = isPathString(this.bucket)? '*' : `arn:aws:s3:::${this.bucket}`;

    return [
      new iam.PolicyStatement({
        actions: ['s3:ListBucket'],
        resources: [resource],
        ...(!isPathString(this.key) && {
          conditions: { StringLike: { 's3:prefix': [this.key] } },
        }),
      }),
    ];
  }
}

/**
 * S3Reader for JSON files
 */
export class S3JsonReader extends S3Reader {
  constructor(props: S3ReaderProps) {
    super(props, DistributedMapResource.S3_GET_OBJECT);
  }

  protected renderReaderConfigOptions(): any {
    return {
      InputType: 'JSON',
    };
  }

  public providePolicyStatements(): iam.PolicyStatement[] {
    let resource = '*';
    if (!isPathString(this.bucket)) {
      const resourceSiffix = isPathString(this.key) ? '*' : this.key;
      resource = `arn:aws:s3:::${this.bucket}/${resourceSiffix}`;
    }

    return [
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [resource],
      }),
    ];
  }
}

/**
 * S3Reader for S3 inventory manifest file
 */
export class S3InventoryReader extends S3Reader {
  constructor(props: S3ReaderProps) {
    super(props, DistributedMapResource.S3_GET_OBJECT);
  }

  protected renderReaderConfigOptions(): any {
    return {
      InputType: 'MANIFEST',
    };
  }

  public providePolicyStatements(): iam.PolicyStatement[] {
    return [
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [`arn:aws:s3:::${this.bucket}/*`],
      }),
    ];
  }
}
