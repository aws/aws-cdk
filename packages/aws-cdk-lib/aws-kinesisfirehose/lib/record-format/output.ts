import * as core from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

export interface IOutputFormat {
  render(): CfnDeliveryStream.OutputFormatConfigurationProperty;
}

export enum WriterVersion {
  V1 = 'V1',
  V2 = 'V2',
}

export enum Compression {
  UNCOMPRESSED = 'UNCOMPRESSED',
  SNAPPY = 'SNAPPY',
  GZIP = 'GZIP',
}

export interface ParquetOutputFormatProps {
  readonly blockSize?: core.Size;
  readonly compression?: Compression;
  readonly enableDictionaryCompression?: boolean;
  readonly maxPadding?: core.Size;
  readonly pageSize?: core.Size;
  readonly writerVersion?: WriterVersion;
}

export class ParquetOutputFormat implements IOutputFormat {
  public constructor(readonly props?: ParquetOutputFormatProps) {
    this.validateProps(props);
  }

  private validateProps(props?: ParquetOutputFormatProps) {
    if (!props) {
      return;
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
      compression: props.compression,
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

export enum FormatVersion {
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
  readonly formatVersion?: FormatVersion;
  readonly paddingTolerance?: number;
  readonly rowIndexStride?: number;
  readonly stripeSize?: core.Size;
}
class OrcOutputFormat implements IOutputFormat {
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
      compression: props.compression,
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
