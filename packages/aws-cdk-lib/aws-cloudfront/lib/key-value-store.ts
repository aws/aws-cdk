import { Construct } from 'constructs';
import { CfnKeyValueStore } from './cloudfront.generated';
import * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import { Resource, IResource, Lazy, Names, Stack, Arn, ArnFormat } from '../../core';

/**
 * The data to be imported to the key value store.
 */
export abstract class ImportSource {
  /**
   * An import source that exists as an object in an S3 bucket.
   *
   * @param bucket the S3 bucket that contains the data
   * @param key the key within the S3 bucket that contains the data
   */
  public static fromBucket(bucket: s3.IBucket, key: string): ImportSource {
    return new S3ImportSource(bucket, key);
  }

  /**
   * An import source that exists as a local file.
   *
   * @param path the path to the local file
   * @param options the configuration for the temporarily created S3 file
   */
  public static fromAsset(path: string, options?: s3_assets.AssetOptions): ImportSource {
    return new AssetImportSource(path, options);
  }

  /**
   * Called when the key value store is initialized to allow the import source to
   * be bound to the stack.
   *
   * The method is primarily intended for internal use.
   *
   * @param scope the binding scope
   * @internal
   */
  public abstract _bind(scope: Construct): CfnKeyValueStore.ImportSourceProperty;
}

/**
 * An import source from an S3 object.
 */
export class S3ImportSource extends ImportSource {
  /**
   * @param bucket the S3 bucket that contains the data
   * @param key the key within the S3 bucket that contains the data
   */
  constructor(public readonly bucket: s3.IBucket, public readonly key: string) {
    super();
  }

  /**
   * @internal
   */
  public _bind(_scope: Construct): CfnKeyValueStore.ImportSourceProperty {
    return {
      sourceType: 'S3',
      sourceArn: `${this.bucket.arnForObjects(this.key)}`,
    };
  }
}

/**
 * An import source from a local file.
 */
export class AssetImportSource extends ImportSource {
  private asset?: s3_assets.Asset;

  /**
   * @param path the path to the local file
   * @param options the configuration for the temporarily created S3 file
   */
  constructor(public readonly path: string, private readonly options: s3_assets.AssetOptions = {}) {
    super();
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): CfnKeyValueStore.ImportSourceProperty {
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, 'ImportSource', {
        path: this.path,
        deployTime: true,
        ...this.options,
      });
    } else if (Stack.of(this.asset) !== Stack.of(scope)) {
      throw new Error(
        `Asset is already associated with another stack '${Stack.of(this.asset).stackName}. ` +
          'Create a new ImportSource instance for every stack.',
      );
    }

    return {
      sourceType: 'S3',
      sourceArn: this.asset.bucket.arnForObjects(this.asset.s3ObjectKey),
    };
  }
}

/**
 * The properties to create a Key Value Store.
 */
export interface KeyValueStoreProps {
  /**
   * The unique name of the Key Value Store.
   *
   * @default A generated name
   */
  readonly keyValueStoreName?: string;

  /**
   * A comment for the Key Value Store
   *
   * @default No comment will be specified
   */
  readonly comment?: string;

  /**
   * The import source for the Key Value Store.
   *
   * This will populate the initial items in the Key Value Store. The
   * source data must be in a valid JSON format.
   *
   * @default No data will be imported to the store
   */
  readonly source?: ImportSource;
}

/**
 * A CloudFront Key Value Store.
 */
export interface IKeyValueStore extends IResource {
  /**
   * The ARN of the Key Value Store.
   *
   * @attribute
   */
  readonly keyValueStoreArn: string;

  /**
   * The Unique ID of the Key Value Store.
   *
   * @attribute
   */
  readonly keyValueStoreId: string;

  /**
   * The status of the Key Value Store.
   *
   * @attribute
   */
  readonly keyValueStoreStatus: string;
}

/**
 * A CloudFront Key Value Store.
 *
 * @resource AWS::CloudFront::KeyValueStore
 */
export class KeyValueStore extends Resource implements IKeyValueStore {
  /**
   * Import a Key Value Store using its ARN.
   */
  public static fromKeyValueStoreArn(scope: Construct, id: string, keyValueStoreArn: string): IKeyValueStore {
    const storeId = Arn.split(keyValueStoreArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
    if (!storeId) {
      throw new Error(`Invalid Key Value Store ID '${keyValueStoreArn}'`);
    }
    return new class Import extends Resource implements IKeyValueStore {
      readonly keyValueStoreArn: string = keyValueStoreArn;
      readonly keyValueStoreId: string = storeId!;
      constructor() {
        super(scope, id, {
          environmentFromArn: keyValueStoreArn,
        });
      }

      public get keyValueStoreStatus(): string {
        throw new Error('Status is not available for imported Key Value Store');
      }
    };
  }

  readonly keyValueStoreArn: string;
  readonly keyValueStoreId: string;
  readonly keyValueStoreStatus: string;

  constructor(scope: Construct, id: string, props?: KeyValueStoreProps) {
    super(scope, id, {
      physicalName: props?.keyValueStoreName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 64 }),
      }),
    });

    const resource = new CfnKeyValueStore(this, 'Resource', {
      name: this.physicalName,
      comment: props?.comment,
      importSource: props?.source?._bind(this),
    });

    this.keyValueStoreArn = resource.attrArn;
    this.keyValueStoreId = resource.attrId;
    this.keyValueStoreStatus = resource.attrStatus;
  }
}
