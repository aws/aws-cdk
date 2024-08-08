import { Arn, ArnFormat, Aws } from '../../../../core';
import { FieldUtils } from '../../fields';

/**
 * Base interface for Item Reader Path configurations
 */
export interface IItemReaderPath {
  /**
   * S3 bucket name containing objects to iterate over or a file with a list to iterate over, as JsonPath
   */
  readonly bucketNamePath: string;

  /**
   * The Amazon S3 API action that Step Functions must invoke depending on the specified dataset.
   */
  readonly resource: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - Distributed Map state will iterate over all items provided by the ItemReaderPath
   */
  readonly maxItems?: number;

  /**
   * Render the ItemReaderPath as JSON object
   */
  render(): any;
}

/**
 * Base interface for Item Reader Path configuration properties
 */
export interface ItemReaderPathProps {
  /**
   * S3 bucket name containing objects to iterate over or a file with a list to iterate over, as JsonPath
   */
  readonly bucketNamePath: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - Distributed Map state will iterate over all items provided by the ItemReaderPath
   */
  readonly maxItems?: number;
}

/**
 * Properties for configuring an Item Reader Path that iterates over objects in an S3 bucket
 */
export interface S3ObjectsItemReaderPathProps extends ItemReaderPathProps {
  /**
   * S3 prefix used to limit objects to iterate over, as JsonPath
   *
   * @default - No prefix
   */
  readonly prefixPath?: string;
}

/**
 * Item Reader Path configuration for iterating over objects in an S3 bucket
 */
export class S3ObjectsItemReaderPath implements IItemReaderPath {
  /**
   * S3 bucket name containing objects to iterate over, as JsonPath
   */
  readonly bucketNamePath: string;

  /**
   * ARN for the `listObjectsV2` method of the S3 API
   * This API method is used to iterate all objects in the S3 bucket/prefix
   */
  readonly resource: string;

  /**
   * S3 prefix used to limit objects to iterate over, as JsonPath
   *
   * @default - No prefix
   */
  readonly prefixPath?: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - Distributed Map state will iterate over all items provided by the ItemReaderPath
   */
  readonly maxItems?: number;

  constructor(props: S3ObjectsItemReaderPathProps) {
    this.bucketNamePath = props.bucketNamePath;
    this.prefixPath = props.prefixPath;
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
   * Renders the ItemReaderPath configuration as JSON object
   * @returns - JSON object
   */
  public render(): any {
    return FieldUtils.renderObject({
      Resource: this.resource,
      ...(this.maxItems && { ReaderConfig: { MaxItems: this.maxItems } }),
      Parameters: {
        'Bucket.$': this.bucketNamePath,
        ...(this.prefixPath && { 'Prefix.$': this.prefixPath }),
      },
    });
  }
}