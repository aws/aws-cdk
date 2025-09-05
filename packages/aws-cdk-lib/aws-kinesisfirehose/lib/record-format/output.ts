import * as core from '../../../core';
import { Compression } from '../common';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

export interface OutputFormatRenderOptions {
  compression?: Compression;
}
export interface IOutputFormat {
  render(): CfnDeliveryStream.OutputFormatConfigurationProperty;
}

export enum ParquetWriterVersion {
  V1 = 'V1',
  V2 = 'V2',
}

export interface ParquetOutputFormatProps {

  /**
   * The Hadoop Distributed File System (HDFS) block size.
   * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying.
   * Firehose uses this value for padding calculations.
   *
   * @minimum `Size.mebibytes(64)`
   * @default `Size.mebibytes(256)`
   */
  readonly blockSize?: core.Size;

  /**
   * The compression code to use over data blocks.
   *
   * The possible values are `UNCOMPRESSED` , `SNAPPY` , and `GZIP`.
   * Use `SNAPPY` for higher decompression speed.
   * Use `GZIP` if the compression ratio is more important than speed.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-compression
   * @default `SNAPPY`
   */
  readonly compression?: Compression;

  /**
   * Indicates whether to enable dictionary compression.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-enabledictionarycompression
   * @default `false`
   */
  readonly enableDictionaryCompression?: boolean;

  /**
   * The maximum amount of padding to apply.
   *
   * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-maxpaddingbytes
   * @default no padding is applied
   */
  readonly maxPadding?: core.Size;

  /**
   * The Parquet page size.
   *
   * Column chunks are divided into pages. A page is conceptually an indivisible unit (in terms of compression and encoding). The minimum value is 64 KiB and the default is 1 MiB.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-pagesizebytes
   *
   * @minimum `Size.kibibytes(64)`
   * @default `Size.mebibytes(1)`
   */
  readonly pageSize?: core.Size;

  /**
   * Indicates the version of Parquet to output.
   *
   * The possible values are `V1` and `V2`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-writerversion
   *
   * @default `V1`
   */
  readonly writerVersion?: ParquetWriterVersion;
}

/**
 * This class specifies properties for Parquet output format for record format conversion.
 *
 * You should only need to specify an instance of this class if the default configuration does not suit your needs.
 */
export class ParquetOutputFormat implements IOutputFormat {
  private readonly VALID_COMPRESSIONS = [Compression.SNAPPY, Compression.UNCOMPRESSED, Compression.GZIP];

  public constructor(readonly props?: ParquetOutputFormatProps) {
    this.validateProps(props);
  }

  private validateProps(props?: ParquetOutputFormatProps) {
    if (!props) {
      return;
    }

    if (props.compression !== undefined && !this.VALID_COMPRESSIONS.map(compression => compression.value).includes(props.compression.value)) {
      throw new core.UnscopedValidationError(`Compression ${props.compression} is invalid, it must be one of ${this.VALID_COMPRESSIONS}`);
    }

    if (props.blockSize !== undefined && props.blockSize.toMebibytes() < 64) {
      throw new core.UnscopedValidationError(`Block size ${props.blockSize.toMebibytes()} is invalid, it must be at least 64 MiB`);
    }

    if (props.pageSize !== undefined && props.pageSize.toKibibytes() < 64) {
      throw new core.UnscopedValidationError(`Page size ${props.pageSize.toKibibytes()} is invalid, it must be at least 64 KiB`);
    }
  }

  private createParquetSerDeProps(): CfnDeliveryStream.ParquetSerDeProperty {
    const props = this.props;
    return props ? {
      blockSizeBytes: props.blockSize?.toBytes(),
      compression: props.compression?.value,
      enableDictionaryCompression: props.enableDictionaryCompression,
      maxPaddingBytes: props.maxPadding?.toBytes(),
      pageSizeBytes: props.pageSize?.toBytes(),
      writerVersion: props.writerVersion,
    } : {};
  }

  public render(): CfnDeliveryStream.OutputFormatConfigurationProperty {
    return {
      serializer: {
        parquetSerDe: this.createParquetSerDeProps(),
      },
    };
  }
}

export enum OrcFormatVersion {
  V0_11 = 'V0_11',
  V0_12 = 'V0_12',
}

export interface OrcOutputFormatProps {
  readonly blockSize?: core.Size;
  readonly bloomFilterColumns?: string[];
  readonly bloomFilterFalsePositiveProbability?: number;
  readonly compression?: Compression;
  readonly dictionaryKeyThreshold?: number;
  readonly enablePadding?: boolean;
  readonly formatVersion?: OrcFormatVersion;
  readonly paddingTolerance?: number;
  readonly rowIndexStride?: number;
  readonly stripeSize?: core.Size;
}

class OrcOutputFormat implements IOutputFormat {
  private readonly VALID_COMPRESSIONS = [Compression.SNAPPY, Compression.UNCOMPRESSED, Compression.GZIP];

  public constructor(readonly props?: OrcOutputFormatProps) {
    this.validateProps(props);
  }

  private betweenInclusive(num: number, min: number, max: number) {
    return num >= min && num <= max;
  }

  private validateProps(props?: OrcOutputFormatProps) {
    if (!props) {
      return;
    }

    if (props.compression !== undefined && !this.VALID_COMPRESSIONS.map(compression => compression.value).includes(props.compression.value)) {
      throw new core.UnscopedValidationError(`Compression ${props.compression} is invalid, it must be one of ${this.VALID_COMPRESSIONS}`);
    }

    if (props.blockSize !== undefined && props.blockSize.toMebibytes() < 64) {
      throw new core.UnscopedValidationError(`Block size ${props.blockSize.toMebibytes()} is invalid, it must be at least 64 MiB`);
    }

    if (props.stripeSize !== undefined && props.stripeSize.toMebibytes() < 8) {
      throw new core.UnscopedValidationError(`Stripe size ${props.stripeSize.toMebibytes()} is invalid, it must be at least 8 MiB`);
    }

    if (props.bloomFilterFalsePositiveProbability !== undefined && !this.betweenInclusive(props.bloomFilterFalsePositiveProbability, 0, 1)) {
      throw new core.UnscopedValidationError(`Bloom filter false positive probability ${props.bloomFilterFalsePositiveProbability} is invalid, it must be between 0 and 1, inclusive`);
    }

    if (props.dictionaryKeyThreshold !== undefined && !this.betweenInclusive(props.dictionaryKeyThreshold, 0, 1)) {
      throw new core.UnscopedValidationError(`Dictionary key threshold ${props.dictionaryKeyThreshold} is invalid, it must be between 0 and 1, inclusive`);
    }

    if (props.paddingTolerance !== undefined && !this.betweenInclusive(props.paddingTolerance, 0, 1)) {
      throw new core.UnscopedValidationError(`Padding tolerance ${props.paddingTolerance} is invalid, it must be between 0 and 1, inclusive`);
    }

    if (props.rowIndexStride !== undefined && props.rowIndexStride < 1000) {
      throw new core.UnscopedValidationError(`Row index stride ${props.rowIndexStride} is invalid, it must be at least 1000`);
    }
  }

  private createOrcSerDeProps(): CfnDeliveryStream.OrcSerDeProperty {
    const props = this.props;
    return props ? {
      blockSizeBytes: props.blockSize?.toBytes(),
      bloomFilterColumns: props.bloomFilterColumns,
      bloomFilterFalsePositiveProbability: props.bloomFilterFalsePositiveProbability,
      compression: props.compression?.value,
      dictionaryKeyThreshold: props.dictionaryKeyThreshold,
      enablePadding: props.enablePadding,
      formatVersion: props.formatVersion,
      paddingTolerance: props.paddingTolerance,
      rowIndexStride: props.rowIndexStride,
      stripeSizeBytes: props.stripeSize?.toBytes(),
    } : {};
  }

  public render(): CfnDeliveryStream.OutputFormatConfigurationProperty {
    return {
      serializer: {
        orcSerDe: this.createOrcSerDeProps(),
      },
    };
  }
}

export class OutputFormat {
  public static readonly PARQUET = new ParquetOutputFormat();
  public static readonly ORC = new OrcOutputFormat();

  private constructor() {}
}
