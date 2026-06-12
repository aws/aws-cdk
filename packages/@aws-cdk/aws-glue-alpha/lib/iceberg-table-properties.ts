import { UnscopedValidationError } from 'aws-cdk-lib';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';

/** Apache Iceberg format version. */
export enum IcebergFormatVersion {
  /** v1 — read-only Hive-compatible analytic tables. */
  V1 = '1',

  /** v2 — adds row-level deletes (default). */
  V2 = '2',
}

/** Data-file storage format for an Iceberg table. */
export enum IcebergDataFormat {
  /** Apache Parquet (default). */
  PARQUET = 'parquet',

  /** Apache ORC. */
  ORC = 'orc',

  /** Apache Avro. */
  AVRO = 'avro',
}

const FORMAT_VERSION_KEY = 'format-version';
const WRITE_FORMAT_DEFAULT_KEY = 'write.format.default';
const WRITE_PARQUET_COMPRESSION_CODEC_KEY = 'write.parquet.compression-codec';
const WRITE_ORC_COMPRESSION_CODEC_KEY = 'write.orc.compression-codec';
const WRITE_AVRO_COMPRESSION_CODEC_KEY = 'write.avro.compression-codec';
const WRITE_TARGET_FILE_SIZE_BYTES_KEY = 'write.target-file-size-bytes';
const WRITE_DELETE_MODE_KEY = 'write.delete.mode';
const WRITE_UPDATE_MODE_KEY = 'write.update.mode';
const WRITE_MERGE_MODE_KEY = 'write.merge.mode';
const WRITE_DISTRIBUTION_MODE_KEY = 'write.distribution-mode';
const GC_ENABLED_KEY = 'gc.enabled';
const HISTORY_EXPIRE_MAX_SNAPSHOT_AGE_MS_KEY = 'history.expire.max-snapshot-age-ms';
const HISTORY_EXPIRE_MIN_SNAPSHOTS_TO_KEEP_KEY = 'history.expire.min-snapshots-to-keep';
const COMMIT_RETRY_NUM_RETRIES_KEY = 'commit.retry.num-retries';

const PARQUET_CODECS = new Set([
  'zstd',
  'snappy',
  'gzip',
  'brotli',
  'lz4',
  'uncompressed',
]);

const ORC_CODECS = new Set([
  'zstd',
  'snappy',
  'zlib',
  'lz4',
  'lzo',
  'none',
]);

const AVRO_CODECS = new Set([
  'gzip',
  'snappy',
  'zstd',
  'uncompressed',
]);

const WRITE_MODES = new Set([
  'copy-on-write',
  'merge-on-read',
]);

const DISTRIBUTION_MODES = new Set([
  'none',
  'hash',
  'range',
]);

const BOOLEAN_VALUES = new Set([
  'true',
  'false',
]);

/**
 * Iceberg table-property keys this module is aware of. Exported so the
 * tests can build property maps without re-typing the strings.
 *
 * @internal
 */
export const ICEBERG_PROPERTY_KEYS = {
  FORMAT_VERSION: FORMAT_VERSION_KEY,
  WRITE_FORMAT_DEFAULT: WRITE_FORMAT_DEFAULT_KEY,
  WRITE_PARQUET_COMPRESSION_CODEC: WRITE_PARQUET_COMPRESSION_CODEC_KEY,
  WRITE_ORC_COMPRESSION_CODEC: WRITE_ORC_COMPRESSION_CODEC_KEY,
  WRITE_AVRO_COMPRESSION_CODEC: WRITE_AVRO_COMPRESSION_CODEC_KEY,
  WRITE_TARGET_FILE_SIZE_BYTES: WRITE_TARGET_FILE_SIZE_BYTES_KEY,
  WRITE_DELETE_MODE: WRITE_DELETE_MODE_KEY,
  WRITE_UPDATE_MODE: WRITE_UPDATE_MODE_KEY,
  WRITE_MERGE_MODE: WRITE_MERGE_MODE_KEY,
  WRITE_DISTRIBUTION_MODE: WRITE_DISTRIBUTION_MODE_KEY,
  GC_ENABLED: GC_ENABLED_KEY,
  HISTORY_EXPIRE_MAX_SNAPSHOT_AGE_MS: HISTORY_EXPIRE_MAX_SNAPSHOT_AGE_MS_KEY,
  HISTORY_EXPIRE_MIN_SNAPSHOTS_TO_KEEP: HISTORY_EXPIRE_MIN_SNAPSHOTS_TO_KEEP_KEY,
  COMMIT_RETRY_NUM_RETRIES: COMMIT_RETRY_NUM_RETRIES_KEY,
};

/**
 * Validate that the merged property map for a table is internally
 * consistent. Throws on the first conflict.
 *
 * @internal
 */
export function validateIcebergProperties(
  dataFormat: IcebergDataFormat,
  formatVersion: IcebergFormatVersion,
  properties: { [key: string]: string },
): void {
  const declaredFormat = properties[WRITE_FORMAT_DEFAULT_KEY];
  if (declaredFormat !== undefined && declaredFormat !== dataFormat) {
    throw new UnscopedValidationError(lit`IcebergFormatDefaultDisagrees`,
      `tableProperties['${WRITE_FORMAT_DEFAULT_KEY}'] is '${declaredFormat}' `
      + `but dataFormat is '${dataFormat}'. Drop the property or change dataFormat to match.`);
  }

  const declaredVersion = properties[FORMAT_VERSION_KEY];
  if (declaredVersion !== undefined && declaredVersion !== formatVersion) {
    throw new UnscopedValidationError(lit`IcebergFormatVersionDisagrees`,
      `tableProperties['${FORMAT_VERSION_KEY}'] is '${declaredVersion}' `
      + `but formatVersion is '${formatVersion}'. Drop the property or change formatVersion to match.`);
  }

  validateCompressionForFormat(dataFormat, properties);

  validateEnum(properties, WRITE_DELETE_MODE_KEY, WRITE_MODES);
  validateEnum(properties, WRITE_UPDATE_MODE_KEY, WRITE_MODES);
  validateEnum(properties, WRITE_MERGE_MODE_KEY, WRITE_MODES);
  validateEnum(properties, WRITE_DISTRIBUTION_MODE_KEY, DISTRIBUTION_MODES);

  if (formatVersion === IcebergFormatVersion.V1) {
    for (const key of [WRITE_DELETE_MODE_KEY, WRITE_UPDATE_MODE_KEY, WRITE_MERGE_MODE_KEY]) {
      if (properties[key] === 'merge-on-read') {
        throw new UnscopedValidationError(lit`IcebergMergeOnReadRequiresV2`,
          `tableProperties['${key}'] = 'merge-on-read' requires formatVersion v2; got v1`);
      }
    }
  }

  validateEnum(properties, GC_ENABLED_KEY, BOOLEAN_VALUES);

  validatePositiveInt(properties, WRITE_TARGET_FILE_SIZE_BYTES_KEY);
  validatePositiveInt(properties, HISTORY_EXPIRE_MAX_SNAPSHOT_AGE_MS_KEY);
  validatePositiveInt(properties, HISTORY_EXPIRE_MIN_SNAPSHOTS_TO_KEEP_KEY);
  validatePositiveInt(properties, COMMIT_RETRY_NUM_RETRIES_KEY);
}

function validateCompressionForFormat(
  dataFormat: IcebergDataFormat,
  properties: { [key: string]: string },
): void {
  const candidates: Array<{ key: string; allowed: ReadonlySet<string>; ownerFormat: IcebergDataFormat }> = [
    { key: WRITE_PARQUET_COMPRESSION_CODEC_KEY, allowed: PARQUET_CODECS, ownerFormat: IcebergDataFormat.PARQUET },
    { key: WRITE_ORC_COMPRESSION_CODEC_KEY, allowed: ORC_CODECS, ownerFormat: IcebergDataFormat.ORC },
    { key: WRITE_AVRO_COMPRESSION_CODEC_KEY, allowed: AVRO_CODECS, ownerFormat: IcebergDataFormat.AVRO },
  ];
  for (const candidate of candidates) {
    const value = properties[candidate.key];
    if (value === undefined) {
      continue;
    }
    if (candidate.ownerFormat !== dataFormat) {
      throw new UnscopedValidationError(lit`IcebergCompressionCodecWrongFormat`,
        `tableProperties['${candidate.key}'] is set but dataFormat is '${dataFormat}'. `
        + `That codec key only applies to '${candidate.ownerFormat}' tables.`);
    }
    if (!candidate.allowed.has(value)) {
      throw new UnscopedValidationError(lit`IcebergCompressionCodecInvalid`,
        `tableProperties['${candidate.key}'] = '${value}' is not a valid ${candidate.ownerFormat} `
        + `compression codec. Allowed: ${Array.from(candidate.allowed).sort().join(', ')}.`);
    }
  }
}

function validateEnum(
  properties: { [key: string]: string },
  key: string,
  allowed: ReadonlySet<string>,
): void {
  const value = properties[key];
  if (value !== undefined && !allowed.has(value)) {
    throw new UnscopedValidationError(lit`IcebergPropertyEnumInvalid`,
      `tableProperties['${key}'] = '${value}' is not valid. `
      + `Allowed: ${Array.from(allowed).sort().join(', ')}.`);
  }
}

function validatePositiveInt(
  properties: { [key: string]: string },
  key: string,
): void {
  const raw = properties[key];
  if (raw === undefined) {
    return;
  }
  if (!/^[0-9]+$/.test(raw) || Number(raw) < 1) {
    throw new UnscopedValidationError(lit`IcebergPropertyPositiveIntInvalid`,
      `tableProperties['${key}'] = '${raw}' must be a positive integer string.`);
  }
}
