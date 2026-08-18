import { RemovalPolicy, Resource, Stack, UnscopedValidationError, ValidationError } from 'aws-cdk-lib';
import { CfnTable } from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { IResource } from 'aws-cdk-lib/core';
import { lit, memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IDatabase } from './database';
import { IcebergPartitionTransform } from './iceberg-partition-transform';
import {
  ICEBERG_PROPERTY_KEYS,
  IcebergDataFormat,
  IcebergFormatVersion,
  validateIcebergProperties,
} from './iceberg-table-properties';
import type { IcebergRenderContext, IcebergType } from './iceberg-type';
import { IcebergTypeKind } from './iceberg-type';

/** Sort direction for an Iceberg sort field. */
export enum IcebergSortDirection {
  /** Ascending — smaller values first. */
  ASC = 'asc',

  /** Descending — larger values first. */
  DESC = 'desc',
}

/** Null ordering for an Iceberg sort field. */
export enum IcebergNullOrder {
  /** Nulls precede all non-null values. */
  NULLS_FIRST = 'nulls-first',

  /** Nulls follow all non-null values. */
  NULLS_LAST = 'nulls-last',
}

/** One top-level column in an Iceberg table. */
export interface IcebergColumn {
  /** Column name (unique within the table). */
  readonly name: string;

  /** Column type. */
  readonly type: IcebergType;

  /**
   * Whether the column is non-nullable.
   *
   * @default false
   */
  readonly required?: boolean;

  /**
   * Documentation string.
   *
   * @default - no documentation
   */
  readonly doc?: string;

  /**
   * Pin this column to a specific Iceberg field id. Recommended for any
   * table that will be evolved across deploys: it lets `cdk deploy`
   * add, remove, and reorder columns without triggering Iceberg's
   * silent-corruption-on-id-reuse trap.
   *
   * When omitted the construct assigns ids by position (1..N for the
   * top-level columns), which is fine for a fresh table but unsafe
   * once the table has data and you start dropping columns.
   *
   * @default - assigned by position
   */
  readonly id?: number;
}

/** One partition spec field. */
export interface IcebergPartitionField {
  /** Name of the top-level table column this partition derives from. */
  readonly sourceColumn: string;

  /** Transform to apply to the source column. */
  readonly transform: IcebergPartitionTransform;

  /**
   * Display name for the partition field.
   *
   * @default - `<sourceColumn>` for identity transforms, `<sourceColumn>_<transform>` otherwise
   */
  readonly name?: string;
}

/** One write-order (sort) field. */
export interface IcebergSortField {
  /** Name of the top-level table column to sort on. */
  readonly sourceColumn: string;

  /**
   * Transform to apply to the source column.
   *
   * @default IcebergPartitionTransform.IDENTITY
   */
  readonly transform?: IcebergPartitionTransform;

  /**
   * Sort direction.
   *
   * @default IcebergSortDirection.ASC
   */
  readonly direction?: IcebergSortDirection;

  /**
   * Null ordering.
   *
   * @default IcebergNullOrder.NULLS_LAST
   */
  readonly nullOrder?: IcebergNullOrder;
}

/** Construction properties for an `IcebergTable`. */
export interface IcebergTableProps {
  /** Glue database that will hold the table. */
  readonly database: IDatabase;

  /** Table name (lower-case, no spaces — Glue and Athena will fold it). */
  readonly tableName: string;

  /** Top-level columns. Must contain at least one column. */
  readonly columns: IcebergColumn[];

  /** S3 URI where Iceberg metadata + data live. Must start with `s3://`. */
  readonly location: string;

  /**
   * Optional partition spec. Order is preserved in the partition layout.
   *
   * @default - no partitioning
   */
  readonly partitionSpec?: IcebergPartitionField[];

  /**
   * Optional default write order. Realized as `IcebergTableInput.writeOrder`.
   *
   * @default - no sort order
   */
  readonly sortOrder?: IcebergSortField[];

  /**
   * Names of columns that together identify a row. Maps to
   * `IcebergSchema.identifierFieldIds`. Per the Iceberg spec these
   * must be primitive, non-nullable, non-floating-point fields.
   *
   * @default - no identifier fields
   */
  readonly identifierFieldNames?: string[];

  /**
   * Data-file storage format.
   *
   * @default IcebergDataFormat.PARQUET
   */
  readonly dataFormat?: IcebergDataFormat;

  /**
   * Iceberg format version.
   *
   * @default IcebergFormatVersion.V2
   */
  readonly formatVersion?: IcebergFormatVersion;

  /**
   * Extra `properties` to publish on the table. Auto-added keys
   * (`format-version`, `write.format.default`) are merged in and
   * must agree with `formatVersion` / `dataFormat` if also supplied
   * here.
   *
   * @default - no extra properties
   */
  readonly tableProperties?: { [key: string]: string };

  /**
   * Table comment. The Glue `OpenTableFormatInput` shape is mutually
   * exclusive with `TableInput.Description`, so the construct cannot
   * surface a description through the regular Glue field. The comment
   * is published in the Iceberg `properties` map under the `comment`
   * key, where Athena's `SHOW TBLPROPERTIES` and Iceberg-aware readers
   * can find it.
   *
   * @default - no comment
   */
  readonly comment?: string;

  /**
   * Removal policy for the underlying Glue table.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/** Attributes needed to import an existing Iceberg table. */
export interface IcebergTableAttributes {
  /** Glue database holding the table. */
  readonly database: IDatabase;

  /** Existing table's name. */
  readonly tableName: string;

  /** S3 URI where the table's data + metadata live. */
  readonly location: string;
}

/** Public interface implemented by `IcebergTable` and by import shims. */
export interface IIcebergTable extends IResource {
  /**
   * Glue ARN of the table.
   *
   * @attribute
   */
  readonly tableArn: string;

  /**
   * Table name.
   *
   * @attribute
   */
  readonly tableName: string;

  /** Glue database holding the table. */
  readonly database: IDatabase;

  /** S3 URI where the table is materialized. */
  readonly location: string;

  /**
   * Grant Glue + S3 read on this table.
   * [disable-awslint:no-grants]
   *
   * @param grantee the principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant Glue + S3 write on this table.
   * [disable-awslint:no-grants]
   *
   * @param grantee the principal
   */
  grantWrite(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant Glue + S3 read + write on this table.
   * [disable-awslint:no-grants]
   *
   * @param grantee the principal
   */
  grantReadWrite(grantee: iam.IGrantable): iam.Grant;
}

const READ_TABLE_ACTIONS = [
  'glue:BatchGetPartition',
  'glue:GetPartition',
  'glue:GetPartitions',
  'glue:GetTable',
  'glue:GetTables',
  'glue:GetTableVersion',
  'glue:GetTableVersions',
];

const WRITE_TABLE_ACTIONS = [
  'glue:BatchCreatePartition',
  'glue:BatchDeletePartition',
  'glue:CreatePartition',
  'glue:DeletePartition',
  'glue:UpdatePartition',
  'glue:UpdateTable',
];

const READ_S3_LIST_ACTIONS = ['s3:ListBucket'];
const READ_S3_BUCKET_ACTIONS = ['s3:GetBucketLocation'];
const WRITE_S3_BUCKET_ACTIONS = ['s3:ListBucketMultipartUploads'];
const READ_S3_OBJECT_ACTIONS = ['s3:GetObject'];
const WRITE_S3_OBJECT_ACTIONS = [
  's3:PutObject',
  's3:DeleteObject',
  's3:AbortMultipartUpload',
  's3:ListMultipartUploadParts',
];

/**
 * A Glue table created in the Apache Iceberg open table format.
 *
 * The construct emits the
 * `OpenTableFormatInput.IcebergInput.IcebergTableInput` shape that
 * survives CloudFormation `Update`. The alternative — placing columns
 * under `tableInput.storageDescriptor.columns` — silently strips
 * `table_type=ICEBERG` from the Glue table parameters on the first
 * update and leaves the table un-queryable in Athena.
 *
 * @resource AWS::Glue::Table
 * @see https://github.com/aws/aws-cdk/issues/29660
 */
@propertyInjectable
export class IcebergTable extends Resource implements IIcebergTable {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-glue-alpha.IcebergTable';

  /** Import an existing Iceberg table by its database + name + location. */
  public static fromIcebergTableAttributes(scope: Construct, id: string, attrs: IcebergTableAttributes): IIcebergTable {
    const location = normalizeLocation(attrs.location);
    const parsed = parseS3Uri(location);
    const stack = Stack.of(scope);
    const tableArn = stack.formatArn({
      service: 'glue',
      resource: 'table',
      resourceName: `${attrs.database.databaseName}/${attrs.tableName}`,
    });
    const bucketArn = `arn:${stack.partition}:s3:::${parsed.bucket}`;
    const objectArn = `${bucketArn}/${parsed.key}*`;
    const prefixGlob = `${parsed.key}*`;

    class Import extends Resource implements IIcebergTable {
      public readonly tableArn = tableArn;
      public readonly tableName = attrs.tableName;
      public readonly database = attrs.database;
      public readonly location = location;

      public grantRead(grantee: iam.IGrantable): iam.Grant {
        return grantSplit(grantee, {
          tableArn,
          bucketArn,
          objectArn,
          prefixGlob,
          tableActions: READ_TABLE_ACTIONS,
          listActions: READ_S3_LIST_ACTIONS,
          bucketActions: READ_S3_BUCKET_ACTIONS,
          objectActions: READ_S3_OBJECT_ACTIONS,
        });
      }

      public grantWrite(grantee: iam.IGrantable): iam.Grant {
        return grantSplit(grantee, {
          tableArn,
          bucketArn,
          objectArn,
          prefixGlob,
          tableActions: WRITE_TABLE_ACTIONS,
          listActions: [],
          bucketActions: WRITE_S3_BUCKET_ACTIONS,
          objectActions: WRITE_S3_OBJECT_ACTIONS,
        });
      }

      public grantReadWrite(grantee: iam.IGrantable): iam.Grant {
        return grantSplit(grantee, {
          tableArn,
          bucketArn,
          objectArn,
          prefixGlob,
          tableActions: [...READ_TABLE_ACTIONS, ...WRITE_TABLE_ACTIONS],
          listActions: READ_S3_LIST_ACTIONS,
          bucketActions: [...READ_S3_BUCKET_ACTIONS, ...WRITE_S3_BUCKET_ACTIONS],
          objectActions: [...READ_S3_OBJECT_ACTIONS, ...WRITE_S3_OBJECT_ACTIONS],
        });
      }
    }

    return new Import(scope, id);
  }

  /** Test whether the given object is an instance of `IcebergTable`. */
  public static isIcebergTable(x: any): x is IcebergTable {
    return x !== undefined && x !== null && (x as any).__icebergTableBrand === true;
  }

  /** Glue database holding the table. */
  public readonly database: IDatabase;

  /** S3 URI where the Iceberg metadata + data live. */
  public readonly location: string;

  /** Resolved data format (after defaulting). */
  public readonly dataFormat: IcebergDataFormat;

  /** Resolved format version (after defaulting). */
  public readonly formatVersion: IcebergFormatVersion;

  /** The underlying L1 — exposed for escape-hatch use. */
  public readonly resource: CfnTable;

  private readonly _tableName: string;
  private readonly bucketArn: string;
  private readonly objectArn: string;
  private readonly s3PrefixGlob: string;
  /** @internal */ public readonly __icebergTableBrand: boolean = true;

  constructor(scope: Construct, id: string, props: IcebergTableProps) {
    super(scope, id, {
      physicalName: props.tableName,
    });
    addConstructMetadata(this, props);

    validateProps(this, props);

    this.database = props.database;
    this._tableName = props.tableName;
    this.location = normalizeLocation(props.location);
    this.dataFormat = props.dataFormat ?? IcebergDataFormat.PARQUET;
    this.formatVersion = props.formatVersion ?? IcebergFormatVersion.V2;

    const parsed = parseS3Uri(this.location);
    this.bucketArn = `arn:${Stack.of(this).partition}:s3:::${parsed.bucket}`;
    this.objectArn = `${this.bucketArn}/${parsed.key}*`;
    this.s3PrefixGlob = `${parsed.key}*`;

    const mergedProperties = mergeProperties(
      this.dataFormat,
      this.formatVersion,
      props.tableProperties,
      props.comment,
    );
    validateIcebergProperties(this.dataFormat, this.formatVersion, mergedProperties);

    const rendered = renderSchema(this, props.columns);
    validatePartitionSpec(props.partitionSpec, rendered.columnByName);
    validateSortOrder(props.sortOrder, rendered.columnByName);
    const identifierFieldIds = resolveIdentifierFieldIds(this, props.identifierFieldNames, rendered.columnByName);

    this.resource = new CfnTable(this, 'Resource', {
      catalogId: Stack.of(this).account,
      databaseName: props.database.databaseName,
      name: this._tableName,
      openTableFormatInput: {
        icebergInput: {
          metadataOperation: 'CREATE',
          version: this.formatVersion,
          icebergTableInput: {
            location: this.location,
            schema: {
              type: 'struct',
              schemaId: 0,
              fields: rendered.fields,
              identifierFieldIds: identifierFieldIds,
            },
            partitionSpec: renderPartitionSpec(props.partitionSpec, rendered.columnByName),
            writeOrder: renderSortOrder(props.sortOrder, rendered.columnByName),
            properties: mergedProperties,
          },
        },
      },
    });

    this.resource.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);
    this.node.defaultChild = this.resource;
  }

  /** Table name as it appears in Glue / Athena. */
  @memoizedGetter
  public get tableName(): string {
    return this._tableName;
  }

  /** Glue ARN of the table. */
  @memoizedGetter
  public get tableArn(): string {
    return Stack.of(this).formatArn({
      service: 'glue',
      resource: 'table',
      resourceName: `${this.database.databaseName}/${this._tableName}`,
    });
  }

  /**
   * Grant Glue read + S3 read on this table.
   * [disable-awslint:no-grants]
   *
   * @param grantee the principal
   */
  @MethodMetadata()
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return grantSplit(grantee, {
      tableArn: this.tableArn,
      bucketArn: this.bucketArn,
      objectArn: this.objectArn,
      prefixGlob: this.s3PrefixGlob,
      tableActions: READ_TABLE_ACTIONS,
      listActions: READ_S3_LIST_ACTIONS,
      bucketActions: READ_S3_BUCKET_ACTIONS,
      objectActions: READ_S3_OBJECT_ACTIONS,
    });
  }

  /**
   * Grant Glue write + S3 write on this table.
   * [disable-awslint:no-grants]
   *
   * @param grantee the principal
   */
  @MethodMetadata()
  public grantWrite(grantee: iam.IGrantable): iam.Grant {
    return grantSplit(grantee, {
      tableArn: this.tableArn,
      bucketArn: this.bucketArn,
      objectArn: this.objectArn,
      prefixGlob: this.s3PrefixGlob,
      tableActions: WRITE_TABLE_ACTIONS,
      listActions: [],
      bucketActions: WRITE_S3_BUCKET_ACTIONS,
      objectActions: WRITE_S3_OBJECT_ACTIONS,
    });
  }

  /**
   * Grant Glue + S3 read + write on this table.
   * [disable-awslint:no-grants]
   *
   * @param grantee the principal
   */
  @MethodMetadata()
  public grantReadWrite(grantee: iam.IGrantable): iam.Grant {
    return grantSplit(grantee, {
      tableArn: this.tableArn,
      bucketArn: this.bucketArn,
      objectArn: this.objectArn,
      prefixGlob: this.s3PrefixGlob,
      tableActions: [...READ_TABLE_ACTIONS, ...WRITE_TABLE_ACTIONS],
      listActions: READ_S3_LIST_ACTIONS,
      bucketActions: [...READ_S3_BUCKET_ACTIONS, ...WRITE_S3_BUCKET_ACTIONS],
      objectActions: [...READ_S3_OBJECT_ACTIONS, ...WRITE_S3_OBJECT_ACTIONS],
    });
  }
}

function validateProps(scope: Resource, props: IcebergTableProps): void {
  if (!/^[a-z0-9_]+$/.test(props.tableName)) {
    throw new ValidationError(lit`IcebergTableInvalidName`,
      `tableName '${props.tableName}' must contain only lowercase letters, digits, and underscores`,
      scope);
  }
  if (props.columns.length === 0) {
    throw new ValidationError(lit`IcebergTableNoColumns`,
      'IcebergTable requires at least one column',
      scope);
  }
  const seenNames = new Set<string>();
  for (const column of props.columns) {
    if (seenNames.has(column.name)) {
      throw new ValidationError(lit`IcebergTableDuplicateColumn`,
        `duplicate column name: ${column.name}`,
        scope);
    }
    seenNames.add(column.name);
  }
  if (!props.location.startsWith('s3://')) {
    throw new ValidationError(lit`IcebergTableLocationNotS3`,
      `location must start with 's3://', got '${props.location}'`,
      scope);
  }
}

function normalizeLocation(location: string): string {
  return location.endsWith('/') ? location : `${location}/`;
}

function parseS3Uri(uri: string): { bucket: string; key: string } {
  // `normalizeLocation` is always called first, so `uri` ends with `/`
  // and therefore contains at least one `/` after the scheme.
  const rest = uri.substring('s3://'.length);
  const slash = rest.indexOf('/');
  return {
    bucket: rest.substring(0, slash),
    key: rest.substring(slash + 1),
  };
}

interface RenderedColumn {
  readonly id: number;
  readonly type: IcebergType;
}

interface RenderedSchema {
  readonly fields: CfnTable.IcebergStructFieldProperty[];
  readonly columnByName: Map<string, RenderedColumn>;
}

function renderSchema(scope: Resource, columns: IcebergColumn[]): RenderedSchema {
  const topLevelIds = assignTopLevelIds(scope, columns);
  let nextId = Math.max(...topLevelIds, columns.length) + 1;
  const ctx: IcebergRenderContext = {
    nextId: () => {
      const id = nextId;
      nextId += 1;
      return id;
    },
  };
  const columnByName = new Map<string, RenderedColumn>();
  const fields: CfnTable.IcebergStructFieldProperty[] = columns.map((column, index) => {
    const id = topLevelIds[index];
    const typeString = column.type._render(ctx);
    columnByName.set(column.name, {
      id,
      type: column.type,
    });
    return {
      id,
      name: column.name,
      type: typeString,
      required: column.required ?? false,
      doc: column.doc,
    };
  });
  return {
    fields,
    columnByName,
  };
}

function assignTopLevelIds(scope: Resource, columns: IcebergColumn[]): number[] {
  const taken = new Set<number>();
  for (const column of columns) {
    if (column.id === undefined) {
      continue;
    }
    if (!Number.isInteger(column.id) || column.id < 1) {
      throw new ValidationError(lit`IcebergColumnIdInvalid`,
        `column '${column.name}' has invalid id ${column.id}; ids must be positive integers`,
        scope);
    }
    if (taken.has(column.id)) {
      throw new ValidationError(lit`IcebergColumnIdDuplicate`,
        `duplicate column id ${column.id} on column '${column.name}'`,
        scope);
    }
    taken.add(column.id);
  }
  let cursor = 1;
  return columns.map((column) => {
    if (column.id !== undefined) {
      return column.id;
    }
    while (taken.has(cursor)) {
      cursor += 1;
    }
    taken.add(cursor);
    const assigned = cursor;
    cursor += 1;
    return assigned;
  });
}

function validatePartitionSpec(
  partitionSpec: IcebergPartitionField[] | undefined,
  columnByName: Map<string, RenderedColumn>,
): void {
  if (partitionSpec === undefined) {
    return;
  }
  const partitionNames = new Set<string>();
  for (const field of partitionSpec) {
    const source = columnByName.get(field.sourceColumn);
    if (source === undefined) {
      throw new UnscopedValidationError(lit`IcebergPartitionUnknownColumn`,
        `partitionSpec references unknown column '${field.sourceColumn}'`);
    }
    field.transform._validateSourceType(field.sourceColumn, source.type);
    const partitionName = field.name ?? defaultPartitionName(field);
    if (partitionNames.has(partitionName)) {
      throw new UnscopedValidationError(lit`IcebergPartitionDuplicateName`,
        `duplicate partition field name: ${partitionName}`);
    }
    partitionNames.add(partitionName);
  }
}

function validateSortOrder(
  sortOrder: IcebergSortField[] | undefined,
  columnByName: Map<string, RenderedColumn>,
): void {
  if (sortOrder === undefined) {
    return;
  }
  if (sortOrder.length === 0) {
    throw new UnscopedValidationError(lit`IcebergSortOrderEmpty`,
      'sortOrder must contain at least one field when provided');
  }
  for (const field of sortOrder) {
    const source = columnByName.get(field.sourceColumn);
    if (source === undefined) {
      throw new UnscopedValidationError(lit`IcebergSortUnknownColumn`,
        `sortOrder references unknown column '${field.sourceColumn}'`);
    }
    const transform = field.transform ?? IcebergPartitionTransform.IDENTITY;
    transform._validateSourceType(field.sourceColumn, source.type);
  }
}

function renderPartitionSpec(
  partitionSpec: IcebergPartitionField[] | undefined,
  columnByName: Map<string, RenderedColumn>,
): CfnTable.IcebergPartitionSpecProperty | undefined {
  if (partitionSpec === undefined || partitionSpec.length === 0) {
    return undefined;
  }
  const fields: CfnTable.IcebergPartitionFieldProperty[] = partitionSpec.map((field, index) => ({
    name: field.name ?? defaultPartitionName(field),
    sourceId: columnByName.get(field.sourceColumn)!.id,
    transform: field.transform.toTransformString(),
    // Iceberg spec: partition field ids live in [1000, 9999].
    fieldId: 1000 + index,
  }));
  return {
    specId: 0,
    fields,
  };
}

function renderSortOrder(
  sortOrder: IcebergSortField[] | undefined,
  columnByName: Map<string, RenderedColumn>,
): CfnTable.IcebergSortOrderProperty | undefined {
  if (sortOrder === undefined || sortOrder.length === 0) {
    return undefined;
  }
  const fields: CfnTable.IcebergSortFieldProperty[] = sortOrder.map((field) => {
    const transform = field.transform ?? IcebergPartitionTransform.IDENTITY;
    return {
      sourceId: columnByName.get(field.sourceColumn)!.id,
      transform: transform.toTransformString(),
      direction: field.direction ?? IcebergSortDirection.ASC,
      nullOrder: field.nullOrder ?? IcebergNullOrder.NULLS_LAST,
    };
  });
  return {
    orderId: 1,
    fields,
  };
}

function defaultPartitionName(field: IcebergPartitionField): string {
  const transformString = field.transform.toTransformString();
  if (transformString === 'identity') {
    return field.sourceColumn;
  }
  const baseTransform = transformString.replace(/\[.*\]$/, '');
  return `${field.sourceColumn}_${baseTransform}`;
}

function resolveIdentifierFieldIds(
  scope: Resource,
  identifierFieldNames: string[] | undefined,
  columnByName: Map<string, RenderedColumn>,
): number[] | undefined {
  if (identifierFieldNames === undefined || identifierFieldNames.length === 0) {
    return undefined;
  }
  const seen = new Set<string>();
  return identifierFieldNames.map((name) => {
    if (seen.has(name)) {
      throw new ValidationError(lit`IcebergIdentifierDuplicate`,
        `duplicate identifier field: ${name}`,
        scope);
    }
    seen.add(name);
    const column = columnByName.get(name);
    if (column === undefined) {
      throw new ValidationError(lit`IcebergIdentifierUnknownColumn`,
        `identifierFieldNames references unknown column '${name}'`,
        scope);
    }
    if (column.type.kind === IcebergTypeKind.FLOAT || column.type.kind === IcebergTypeKind.DOUBLE) {
      throw new ValidationError(lit`IcebergIdentifierFloat`,
        `identifierFieldNames cannot reference floating-point column '${name}' (Iceberg spec)`,
        scope);
    }
    return column.id;
  });
}

function mergeProperties(
  dataFormat: IcebergDataFormat,
  formatVersion: IcebergFormatVersion,
  user: { [key: string]: string } | undefined,
  comment: string | undefined,
): { [key: string]: string } {
  const merged: { [key: string]: string } = {
    [ICEBERG_PROPERTY_KEYS.FORMAT_VERSION]: formatVersion,
    [ICEBERG_PROPERTY_KEYS.WRITE_FORMAT_DEFAULT]: dataFormat,
    ...(user ?? {}),
  };
  if (comment !== undefined) {
    merged.comment = comment;
  }
  return merged;
}

/**
 * Issue four scoped statements: Glue actions on the table ARN,
 * `s3:ListBucket` on the bucket ARN with an `s3:prefix` condition,
 * other bucket-level S3 actions on the bucket ARN with no condition
 * (they don't support `s3:prefix` and including them in the
 * conditioned statement would silently deny them), and S3 object
 * actions on `bucket/prefix*`.
 */
function grantSplit(
  grantee: iam.IGrantable,
  args: {
    tableArn: string;
    bucketArn: string;
    objectArn: string;
    prefixGlob: string;
    tableActions: string[];
    listActions: string[];
    bucketActions: string[];
    objectActions: string[];
  },
): iam.Grant {
  const tableGrant = iam.Grant.addToPrincipal({
    grantee,
    actions: args.tableActions,
    resourceArns: [args.tableArn],
  });
  if (args.listActions.length > 0) {
    iam.Grant.addToPrincipal({
      grantee,
      actions: args.listActions,
      resourceArns: [args.bucketArn],
      conditions: {
        StringLike: {
          's3:prefix': [
            args.prefixGlob,
            args.prefixGlob.replace(/\*$/, ''),
          ],
        },
      },
    });
  }
  if (args.bucketActions.length > 0) {
    iam.Grant.addToPrincipal({
      grantee,
      actions: args.bucketActions,
      resourceArns: [args.bucketArn],
    });
  }
  iam.Grant.addToPrincipal({
    grantee,
    actions: args.objectActions,
    resourceArns: [args.objectArn],
  });
  return tableGrant;
}
