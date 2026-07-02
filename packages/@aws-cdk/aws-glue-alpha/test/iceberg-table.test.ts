import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as glue from '../lib';

const MINIMAL_COLUMNS: glue.IcebergColumn[] = [
  {
    name: 'id',
    type: glue.IcebergType.LONG,
    required: true,
  },
];

function makeStack(): { stack: cdk.Stack; database: glue.Database } {
  const stack = new cdk.Stack(new cdk.App(), 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });
  const database = new glue.Database(stack, 'Database', {
    databaseName: 'test_db',
  });
  return { stack, database };
}

test('happy path: emits openTableFormatInput shape with no TableInput sibling', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Table', {
    CatalogId: '123456789012',
    Name: 'simple',
    OpenTableFormatInput: {
      IcebergInput: {
        MetadataOperation: 'CREATE',
        Version: '2',
        IcebergTableInput: Match.objectLike({
          Location: 's3://my-bucket/simple/',
          Schema: Match.objectLike({
            Type: 'struct',
            SchemaId: 0,
            Fields: [
              { Id: 1, Name: 'id', Type: 'long', Required: true },
            ],
          }),
          Properties: {
            'format-version': '2',
            'write.format.default': 'parquet',
          },
        }),
      },
    },
    TableInput: Match.absent(),
  });
});

test('defaults dataFormat to parquet and formatVersion to v2', () => {
  const { stack, database } = makeStack();
  const table = new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
  });
  expect(table.dataFormat).toEqual(glue.IcebergDataFormat.PARQUET);
  expect(table.formatVersion).toEqual(glue.IcebergFormatVersion.V2);
});

test('renders a partition spec with auto-generated names', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'events',
    columns: [
      { name: 'id', type: glue.IcebergType.LONG, required: true },
      { name: 'occurred_at', type: glue.IcebergType.TIMESTAMPTZ, required: true },
      { name: 'customer_id', type: glue.IcebergType.LONG, required: true },
    ],
    location: 's3://my-bucket/events/',
    partitionSpec: [
      { sourceColumn: 'occurred_at', transform: glue.IcebergPartitionTransform.DAY },
      { sourceColumn: 'customer_id', transform: glue.IcebergPartitionTransform.bucket(16) },
    ],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Table', {
    OpenTableFormatInput: {
      IcebergInput: {
        IcebergTableInput: Match.objectLike({
          PartitionSpec: {
            SpecId: 0,
            Fields: [
              { Name: 'occurred_at_day', SourceId: 2, Transform: 'day', FieldId: 1000 },
              { Name: 'customer_id_bucket', SourceId: 3, Transform: 'bucket[16]', FieldId: 1001 },
            ],
          },
        }),
      },
    },
  });
});

test('renders a write order with default direction and null ordering', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'orders',
    columns: [
      { name: 'order_id', type: glue.IcebergType.LONG, required: true },
      { name: 'placed_at', type: glue.IcebergType.TIMESTAMPTZ, required: true },
    ],
    location: 's3://my-bucket/orders/',
    sortOrder: [
      { sourceColumn: 'placed_at' },
      {
        sourceColumn: 'order_id',
        direction: glue.IcebergSortDirection.DESC,
        nullOrder: glue.IcebergNullOrder.NULLS_FIRST,
      },
    ],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Table', {
    OpenTableFormatInput: {
      IcebergInput: {
        IcebergTableInput: Match.objectLike({
          WriteOrder: {
            OrderId: 1,
            Fields: [
              { SourceId: 2, Transform: 'identity', Direction: 'asc', NullOrder: 'nulls-last' },
              { SourceId: 1, Transform: 'identity', Direction: 'desc', NullOrder: 'nulls-first' },
            ],
          },
        }),
      },
    },
  });
});

test('resolves identifier field names to ids', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'orders',
    columns: [
      { name: 'order_id', type: glue.IcebergType.LONG, required: true },
      { name: 'customer_id', type: glue.IcebergType.LONG, required: true },
    ],
    location: 's3://my-bucket/orders/',
    identifierFieldNames: ['order_id'],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Table', {
    OpenTableFormatInput: {
      IcebergInput: {
        IcebergTableInput: Match.objectLike({
          Schema: Match.objectLike({
            IdentifierFieldIds: [1],
          }),
        }),
      },
    },
  });
});

test('honors a custom dataFormat + formatVersion + tableProperties', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'legacy',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/legacy/',
    dataFormat: glue.IcebergDataFormat.AVRO,
    formatVersion: glue.IcebergFormatVersion.V1,
    tableProperties: {
      'write.avro.compression-codec': 'snappy',
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Table', {
    OpenTableFormatInput: {
      IcebergInput: {
        Version: '1',
        IcebergTableInput: Match.objectLike({
          Properties: {
            'format-version': '1',
            'write.format.default': 'avro',
            'write.avro.compression-codec': 'snappy',
          },
        }),
      },
    },
  });
});

test('publishes the comment inside Iceberg properties (never TableInput)', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    comment: 'demo comment',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Table', {
    OpenTableFormatInput: {
      IcebergInput: {
        IcebergTableInput: Match.objectLike({
          Properties: Match.objectLike({ comment: 'demo comment' }),
        }),
      },
    },
    TableInput: Match.absent(),
  });
});

test('applies RemovalPolicy.RETAIN by default', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
  });
  Template.fromStack(stack).hasResource('AWS::Glue::Table', {
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  });
});

test('applies DESTROY when requested', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
  Template.fromStack(stack).hasResource('AWS::Glue::Table', {
    DeletionPolicy: 'Delete',
    UpdateReplacePolicy: 'Delete',
  });
});

test('appends a trailing slash to a location missing one', () => {
  const { stack, database } = makeStack();
  const table = new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple',
  });
  expect(table.location).toEqual('s3://my-bucket/simple/');
});

test('honors explicit column ids and fills auto ids around them', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'mixed',
    columns: [
      { name: 'autoFirst', type: glue.IcebergType.LONG },
      { name: 'pinnedTwo', type: glue.IcebergType.STRING, id: 2 },
      { name: 'autoNext', type: glue.IcebergType.STRING },
    ],
    location: 's3://my-bucket/mixed/',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Table', {
    OpenTableFormatInput: {
      IcebergInput: {
        IcebergTableInput: Match.objectLike({
          Schema: Match.objectLike({
            Fields: [
              Match.objectLike({ Id: 1, Name: 'autoFirst' }),
              Match.objectLike({ Id: 2, Name: 'pinnedTwo' }),
              Match.objectLike({ Id: 3, Name: 'autoNext' }),
            ],
          }),
        }),
      },
    },
  });
});

test('rejects duplicate pinned ids', () => {
  const { stack, database } = makeStack();
  expect(() => new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'dup',
    columns: [
      { name: 'a', type: glue.IcebergType.LONG, id: 7 },
      { name: 'b', type: glue.IcebergType.STRING, id: 7 },
    ],
    location: 's3://my-bucket/dup/',
  })).toThrow(/duplicate column id 7/);
});

test('rejects an invalid table name', () => {
  const { stack, database } = makeStack();
  expect(() => new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'Bad-Name',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
  })).toThrow(/must contain only lowercase letters/);
});

test('rejects an empty column list', () => {
  const { stack, database } = makeStack();
  expect(() => new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: [],
    location: 's3://my-bucket/simple/',
  })).toThrow(/at least one column/);
});

test('rejects a non-s3 location', () => {
  const { stack, database } = makeStack();
  expect(() => new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: '/some/local/path',
  })).toThrow(/s3:\/\//);
});

test('rejects a partition spec on an unknown column', () => {
  const { stack, database } = makeStack();
  expect(() => new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
    partitionSpec: [
      { sourceColumn: 'who_dis', transform: glue.IcebergPartitionTransform.IDENTITY },
    ],
  })).toThrow(/unknown column 'who_dis'/);
});

test('rejects an incompatible partition transform', () => {
  const { stack, database } = makeStack();
  expect(() => new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: [{ name: 'name', type: glue.IcebergType.STRING, required: true }],
    location: 's3://my-bucket/simple/',
    partitionSpec: [
      { sourceColumn: 'name', transform: glue.IcebergPartitionTransform.DAY },
    ],
  })).toThrow(/date\/timestamp/);
});

test('rejects identifierFieldNames referencing a floating-point column', () => {
  const { stack, database } = makeStack();
  expect(() => new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: [{ name: 'metric', type: glue.IcebergType.DOUBLE, required: true }],
    location: 's3://my-bucket/simple/',
    identifierFieldNames: ['metric'],
  })).toThrow(/floating-point/);
});

test('propagates table-property validation errors', () => {
  const { stack, database } = makeStack();
  expect(() => new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
    tableProperties: {
      'write.format.default': 'orc',
    },
  })).toThrow(/write\.format\.default.*orc/);
});

test('grantRead emits a prefix-conditioned ListBucket statement', () => {
  const { stack, database } = makeStack();
  const table = new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/path/simple/',
  });
  const role = new iam.Role(stack, 'Reader', {
    assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
  });
  table.grantRead(role);
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: 's3:ListBucket',
          Condition: {
            StringLike: {
              's3:prefix': ['path/simple/*', 'path/simple/'],
            },
          },
        }),
      ]),
    },
  });
});

test('grantWrite does not include s3:ListBucket', () => {
  const { stack, database } = makeStack();
  const table = new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
  });
  const role = new iam.Role(stack, 'Writer', {
    assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
  });
  table.grantWrite(role);
  const template = Template.fromStack(stack);
  const policies = template.findResources('AWS::IAM::Policy');
  const policy = Object.values(policies)[0];
  const statements: any[] = policy.Properties.PolicyDocument.Statement;
  const hasListBucket = statements.some((s) => {
    const actions = Array.isArray(s.Action) ? s.Action : [s.Action];
    return actions.includes('s3:ListBucket');
  });
  expect(hasListBucket).toEqual(false);
});

test('isIcebergTable type check', () => {
  const { stack, database } = makeStack();
  const table = new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'simple',
    columns: MINIMAL_COLUMNS,
    location: 's3://my-bucket/simple/',
  });
  expect(glue.IcebergTable.isIcebergTable(table)).toEqual(true);
  expect(glue.IcebergTable.isIcebergTable({})).toEqual(false);
  expect(glue.IcebergTable.isIcebergTable(undefined)).toEqual(false);
});

test('fromIcebergTableAttributes reconstructs the table reference', () => {
  const { stack, database } = makeStack();
  const imported = glue.IcebergTable.fromIcebergTableAttributes(stack, 'Imported', {
    database,
    tableName: 'pre_existing',
    location: 's3://other-bucket/pre_existing/',
  });
  expect(imported.tableName).toEqual('pre_existing');
  expect(imported.location).toEqual('s3://other-bucket/pre_existing/');
});

test('IcebergType.list rejects missing element via the public constructor', () => {
  expect(() => new glue.IcebergType({ kind: glue.IcebergTypeKind.LIST })).toThrow(/listElement/);
});

test('IcebergType.decimal validates precision range', () => {
  expect(() => glue.IcebergType.decimal(0, 0)).toThrow(/decimal precision/);
  expect(() => glue.IcebergType.decimal(39, 0)).toThrow(/decimal precision/);
});

test('IcebergPartitionTransform.bucket validates positive integer', () => {
  expect(() => glue.IcebergPartitionTransform.bucket(0)).toThrow(/positive integer/);
  expect(() => glue.IcebergPartitionTransform.bucket(1.5)).toThrow(/positive integer/);
});

test('IcebergType nested struct renders with monotonic ids', () => {
  const { stack, database } = makeStack();
  new glue.IcebergTable(stack, 'Tbl', {
    database,
    tableName: 'nested',
    columns: [
      { name: 'id', type: glue.IcebergType.LONG, required: true },
      {
        name: 'address',
        type: glue.IcebergType.struct([
          { name: 'city', type: glue.IcebergType.STRING, required: true },
          { name: 'country', type: glue.IcebergType.STRING, required: true },
        ]),
      },
    ],
    location: 's3://my-bucket/nested/',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Table', {
    OpenTableFormatInput: {
      IcebergInput: {
        IcebergTableInput: Match.objectLike({
          Schema: Match.objectLike({
            Fields: Match.arrayWith([
              Match.objectLike({
                Id: 2,
                Name: 'address',
                Type: Match.stringLikeRegexp('"type":"struct"'),
              }),
            ]),
          }),
        }),
      },
    },
  });
});
