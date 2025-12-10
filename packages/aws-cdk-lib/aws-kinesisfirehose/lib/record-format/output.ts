import * as cdk from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

/**
 * An output format to be used in Firehose record format conversion.
 */
export interface IOutputFormat {

  /**
   * Renders the cloudformation properties for the output format.
   */
  createOutputFormatConfig(): CfnDeliveryStream.OutputFormatConfigurationProperty;
}

/**
 * Possible compression options available for Parquet OutputFormat
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-compression
 */
export class ParquetCompression {
  /**
   * Gzip
   */
  public static readonly GZIP = new ParquetCompression('GZIP');

  /**
   * Snappy
   */
  public static readonly SNAPPY = new ParquetCompression('SNAPPY');

  /**
   * Uncompressed
   */
  public static readonly UNCOMPRESSED = new ParquetCompression('UNCOMPRESSED');

  /**
   * Creates a new ParquetCompression instance with a custom value.
   */
  public static of(value: string): ParquetCompression {
    return new ParquetCompression(value);
  }

  /**
   * @param value the string value of the Serde Compression.
   */
  private constructor(public readonly value: string) { }
}

/**
 * The available WriterVersions for Parquet output format
 */
export enum ParquetWriterVersion {

  /**
   * Use V1 Parquet writer version when writing the output
   */
  V1 = 'V1',

  /**
   * Use V2 Parquet writer version when writing the output
   */
  V2 = 'V2',
}

/**
 * Props for Parquet output format for data record format conversion
 */
export interface ParquetOutputFormatProps {

  /**
   * The Hadoop Distributed File System (HDFS) block size.
   * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying.
   * Firehose uses this value for padding calculations.
   *
   * @minimum `Size.mebibytes(64)`
   * @default `Size.mebibytes(256)`
   */
  readonly blockSize?: cdk.Size;

  /**
   * The compression code to use over data blocks.
   *
   * The possible values are `UNCOMPRESSED` , `SNAPPY` , and `GZIP`.
   * Use `SNAPPY` for higher decompression speed.
   * Use `GZIP` if the compression ratio is more important than speed.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-compression
   * @default `SNAPPY`
   */
  readonly compression?: ParquetCompression;

  /**
   * Indicates whether to enable dictionary compression.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-enabledictionarycompression
   * @default `false`
   */
  readonly enableDictionaryCompression?: boolean;

  /**
   * The maximum amount of padding to apply.
   *
   * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-maxpaddingbytes
   * @default no padding is applied
   */
  readonly maxPadding?: cdk.Size;

  /**
   * The Parquet page size.
   *
   * Column chunks are divided into pages. A page is conceptually an indivisible unit (in terms of compression and encoding). The minimum value is 64 KiB and the default is 1 MiB.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-pagesizebytes
   *
   * @minimum `Size.kibibytes(64)`
   * @default `Size.mebibytes(1)`
   */
  readonly pageSize?: cdk.Size;

  /**
   * Indicates the version of Parquet to output.
   *
   * The possible values are `V1` and `V2`
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-writerversion
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
  /**
   * Properties for the Parquet output format
   */
  readonly props?: ParquetOutputFormatProps;

  public constructor(props?: ParquetOutputFormatProps) {
    this.props = props;
    this.validateProps(props);
  }

  private validateProps(props?: ParquetOutputFormatProps) {
    if (!props) {
      return;
    }

    if (props.blockSize !== undefined && props.blockSize.toMebibytes() < 64) {
      throw new cdk.UnscopedValidationError(`Block size ${props.blockSize.toMebibytes()} is invalid, it must be at least 64 MiB`);
    }

    if (props.pageSize !== undefined && props.pageSize.toKibibytes() < 64) {
      throw new cdk.UnscopedValidationError(`Page size ${props.pageSize.toKibibytes()} is invalid, it must be at least 64 KiB`);
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

  public createOutputFormatConfig(): CfnDeliveryStream.OutputFormatConfigurationProperty {
    return {
      serializer: {
        parquetSerDe: this.createParquetSerDeProps(),
      },
    };
  }
}

/**
 * Possible compression options available for ORC OutputFormat
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-compression
 */
export class OrcCompression {
  /**
   * Gzip
   */
  public static readonly ZLIB = new OrcCompression('ZLIB');

  /**
   * Snappy
   */
  public static readonly SNAPPY = new OrcCompression('SNAPPY');

  /**
   * Uncompressed
   */
  public static readonly NONE = new OrcCompression('NONE');

  /**
   * Creates a new OrcCompression instance with a custom value.
   */
  public static of(value: string): OrcCompression {
    return new OrcCompression(value);
  }

  /**
   * @param value the string value of the Serde Compression.
   */
  private constructor(public readonly value: string) { }
}

/**
 * The available WriterVersions for ORC output format
 */
export enum OrcFormatVersion {

  /**
   * Use V0_11 ORC writer version when writing the output of the record transformation
   */
  V0_11 = 'V0_11',

  /**
   * Use V0_12 ORC writer version when writing the output of the record transformation
   */
  V0_12 = 'V0_12',
}

/**
 * Props for ORC output format for data record format conversion
 */
export interface OrcOutputFormatProps {

  /**
   * The Hadoop Distributed File System (HDFS) block size.
   * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying.
   * Firehose uses this value for padding calculations.
   *
   * @minimum `Size.mebibytes(64)`
   * @default `Size.mebibytes(256)`
   */
  readonly blockSize?: cdk.Size;

  /**
   * The compression code to use over data blocks.
   *
   * The possible values are `NONE` , `SNAPPY` , and `ZLIB`.
   * Use `SNAPPY` for higher decompression speed.
   * Use `GZIP` if the compression ratio is more important than speed.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-compression
   * @default `SNAPPY`
   */
  readonly compression?: OrcCompression;

  /**
   * The column names for which you want Firehose to create bloom filters.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-bloomfiltercolumns
   *
   * @default no bloom filters are created
   */
  readonly bloomFilterColumns?: string[];

  /**
   * The Bloom filter false positive probability (FPP).
   *
   * The lower the FPP, the bigger the bloom filter.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-bloomfilterfalsepositiveprobability
   *
   * @minimum `0`
   * @maximum `1`
   * @default `0.05`
   */
  readonly bloomFilterFalsePositiveProbability?: number;

  /**
   * Determines whether dictionary encoding should be applied to a column.
   *
   * If the number of distinct keys (unique values) in a column exceeds this fraction of the total non-null rows in that column, dictionary encoding will be turned off for that specific column.
   *
   * To turn off dictionary encoding, set this threshold to 0. To always use dictionary encoding, set this threshold to 1.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-dictionarykeythreshold
   *
   * @minimum `0`
   * @maximum `1`
   * @default `0.8`
   */
  readonly dictionaryKeyThreshold?: number;

  /**
   * Set this to `true` to indicate that you want stripes to be padded to the HDFS block boundaries.
   *
   * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-enablepadding
   *
   * @default `false`
   */
  readonly enablePadding?: boolean;

  /**
   * The version of the ORC format to write.
   *
   * The possible values are `V0_11` and `V0_12`.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-formatversion
   *
   * @default `V0_12`
   */
  readonly formatVersion?: OrcFormatVersion;

  /**
   * A number between 0 and 1 that defines the tolerance for block padding as a decimal fraction of stripe size.
   *
   * The default value is 0.05, which means 5 percent of stripe size.
   *
   * For the default values of 64 MiB ORC stripes and 256 MiB HDFS blocks, the default block padding tolerance of 5 percent reserves a maximum of 3.2 MiB for padding within the 256 MiB block.
   * In such a case, if the available size within the block is more than 3.2 MiB, a new, smaller stripe is inserted to fit within that space.
   * This ensures that no stripe crosses block boundaries and causes remote reads within a node-local task.
   *
   * Kinesis Data Firehose ignores this parameter when `EnablePadding` is `false` .
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-paddingtolerance
   *
   * @default `0.05` if `enablePadding` is `true`
   */
  readonly paddingTolerance?: number;

  /**
   * The number of rows between index entries.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-rowindexstride
   *
   * @minimum 1000
   * @default 10000
   */
  readonly rowIndexStride?: number;

  /**
   * The number of bytes in each stripe.
   *
   * The default is 64 MiB and the minimum is 8 MiB.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-stripesizebytes
   *
   * @minimum `Size.mebibytes(8)`
   * @default `Size.mebibytes(64)`
   */
  readonly stripeSize?: cdk.Size;
}

/**
 * This class specifies properties for ORC output format for record format conversion.
 *
 * You should only need to specify an instance of this class if the default configuration does not suit your needs.
 */
export class OrcOutputFormat implements IOutputFormat {
  /**
   * Properties for the ORC output format
   */
  readonly props?: OrcOutputFormatProps;

  public constructor(props?: OrcOutputFormatProps) {
    this.props = props;
    this.validateProps(props);
  }

  private betweenInclusive(num: number, min: number, max: number) {
    return num >= min && num <= max;
  }

  private validateProps(props?: OrcOutputFormatProps) {
    if (!props) {
      return;
    }

    if (props.blockSize !== undefined && props.blockSize.toMebibytes() < 64) {
      throw new cdk.UnscopedValidationError(`Block size ${props.blockSize.toMebibytes()} is invalid, it must be at least 64 MiB`);
    }

    if (props.stripeSize !== undefined && props.stripeSize.toMebibytes() < 8) {
      throw new cdk.UnscopedValidationError(`Stripe size ${props.stripeSize.toMebibytes()} is invalid, it must be at least 8 MiB`);
    }

    if (props.bloomFilterFalsePositiveProbability !== undefined && !this.betweenInclusive(props.bloomFilterFalsePositiveProbability, 0, 1)) {
      throw new cdk.UnscopedValidationError(`Bloom filter false positive probability ${props.bloomFilterFalsePositiveProbability} is invalid, it must be between 0 and 1, inclusive`);
    }

    if (props.dictionaryKeyThreshold !== undefined && !this.betweenInclusive(props.dictionaryKeyThreshold, 0, 1)) {
      throw new cdk.UnscopedValidationError(`Dictionary key threshold ${props.dictionaryKeyThreshold} is invalid, it must be between 0 and 1, inclusive`);
    }

    if (props.paddingTolerance !== undefined && !this.betweenInclusive(props.paddingTolerance, 0, 1)) {
      throw new cdk.UnscopedValidationError(`Padding tolerance ${props.paddingTolerance} is invalid, it must be between 0 and 1, inclusive`);
    }

    if (props.rowIndexStride !== undefined && props.rowIndexStride < 1000) {
      throw new cdk.UnscopedValidationError(`Row index stride ${props.rowIndexStride} is invalid, it must be at least 1000`);
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

  public createOutputFormatConfig(): CfnDeliveryStream.OutputFormatConfigurationProperty {
    return {
      serializer: {
        orcSerDe: this.createOrcSerDeProps(),
      },
    };
  }
}

/**
 * Represents possible output formats when performing record data conversion.
 */
export class OutputFormat {
  /**
   * Write output files in Parquet
   */
  public static readonly PARQUET = new ParquetOutputFormat();

  /**
   * Write output files in ORC
   */
  public static readonly ORC = new OrcOutputFormat();

  private constructor() {}
}
