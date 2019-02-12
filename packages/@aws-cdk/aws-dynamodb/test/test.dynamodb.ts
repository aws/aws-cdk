import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import { Stack, Tag } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import {
  Attribute,
  AttributeType,
  BillingMode,
  GlobalSecondaryIndexProps,
  LocalSecondaryIndexProps,
  ProjectionType,
  StreamViewType,
  Table
} from '../lib';

// tslint:disable:object-literal-key-quotes

// CDK parameters
const CONSTRUCT_NAME = 'MyTable';

// DynamoDB table parameters
const TABLE_NAME = 'MyTable';
const TABLE_PARTITION_KEY: Attribute = { name: 'hashKey', type: AttributeType.String };
const TABLE_SORT_KEY: Attribute = { name: 'sortKey', type: AttributeType.Number };

// DynamoDB global secondary index parameters
const GSI_NAME = 'MyGSI';
const GSI_PARTITION_KEY: Attribute = { name: 'gsiHashKey', type: AttributeType.String };
const GSI_SORT_KEY: Attribute = { name: 'gsiSortKey', type: AttributeType.Binary };
const GSI_NON_KEY = 'gsiNonKey';
function* GSI_GENERATOR() {
  let n = 0;
  while (true) {
    const globalSecondaryIndexProps: GlobalSecondaryIndexProps = {
      indexName: `${GSI_NAME}${n}`,
      partitionKey: { name: `${GSI_PARTITION_KEY.name}${n}`, type: GSI_PARTITION_KEY.type }
    };
    yield globalSecondaryIndexProps;
    n++;
  }
}
function* NON_KEY_ATTRIBUTE_GENERATOR(nonKeyPrefix: string) {
  let n = 0;
  while (true) {
    yield `${nonKeyPrefix}${n}`;
    n++;
  }
}

// DynamoDB local secondary index parameters
const LSI_NAME = 'MyLSI';
const LSI_SORT_KEY: Attribute = { name: 'lsiSortKey', type: AttributeType.Number };
const LSI_NON_KEY = 'lsiNonKey';
function* LSI_GENERATOR() {
  let n = 0;
  while (true) {
    const localSecondaryIndexProps: LocalSecondaryIndexProps = {
      indexName: `${LSI_NAME}${n}`,
      sortKey: { name : `${LSI_SORT_KEY.name}${n}`, type: LSI_SORT_KEY.type }
    };
    yield localSecondaryIndexProps;
    n++;
  }
}

export = {
  'default properties': {
    'hash key only'(test: Test) {
      const stack = new Stack();
      new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY });

      expect(stack).to(haveResource('AWS::DynamoDB::Table', {
        AttributeDefinitions: [{ AttributeName: 'hashKey', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'hashKey', KeyType: 'HASH' }],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }));
      test.done();
    },

  'hash + range key'(test: Test) {
    const stack = new Stack();
    new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table', {
            AttributeDefinitions: [
              { AttributeName: 'hashKey', AttributeType: 'S' },
              { AttributeName: 'sortKey', AttributeType: 'N' }
            ],
            KeySchema: [
              { AttributeName: 'hashKey', KeyType: 'HASH' },
              { AttributeName: 'sortKey', KeyType: 'RANGE' }
            ],
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    }));
    test.done();
  },

  'hash + range key can also be specified in props'(test: Test) {
    const stack = new Stack();

    new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      }));

    test.done();
  },

  'point-in-time recovery is not enabled'(test: Test) {
    const stack = new Stack();
    new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }
    ));
    test.done();
  },

  'server-side encryption is not enabled'(test: Test) {
    const stack = new Stack();
    new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY,
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }
    ));
    test.done();
  },

  'stream is not enabled'(test: Test) {
    const stack = new Stack();
    new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY,
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }
    ));
    test.done();
  },

  'ttl is not enabled'(test: Test) {
    const stack = new Stack();
    new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY,
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }
    ));
    test.done();
  },

  'can specify new and old images'(test: Test) {
    const stack = new Stack();

    new Table(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      streamSpecification: StreamViewType.NewAndOldImages,
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        StreamSpecification: { StreamViewType: 'NEW_AND_OLD_IMAGES' },
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
        TableName: 'MyTable'
      }
    ));
    test.done();
  },

  'can specify new images only'(test: Test) {
    const stack = new Stack();

    new Table(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      streamSpecification: StreamViewType.NewImage,
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        StreamSpecification: { StreamViewType: 'NEW_IMAGE' },
        TableName: 'MyTable',
      }
    ));
    test.done();
  },

  'can specify old images only'(test: Test) {
    const stack = new Stack();

    new Table(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      streamSpecification: StreamViewType.OldImage,
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        StreamSpecification: { StreamViewType: 'OLD_IMAGE' },
        TableName: 'MyTable',
      }
    ));
    test.done();
  }
},

  'when specifying every property'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      pitrEnabled: true,
      sseEnabled: true,
      billingMode: BillingMode.Provisioned,
      streamSpecification: StreamViewType.KeysOnly,
      ttlAttributeName: 'timeToLive',
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY,
    });
    table.node.apply(new Tag('Environment', 'Production'));

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 42,
          WriteCapacityUnits: 1337
        },
        PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
        SSESpecification: { SSEEnabled: true },
        StreamSpecification: { StreamViewType: 'KEYS_ONLY' },
        TableName: 'MyTable',
        Tags: [ { Key: 'Environment', Value: 'Production' } ],
        TimeToLiveSpecification: { AttributeName: 'timeToLive', Enabled: true }
      }
    ));
    test.done();
  },

  'when specifying PAY_PER_REQUEST billing mode'(test: Test) {
    const stack = new Stack();
    new Table(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      billingMode: BillingMode.PayPerRequest,
      partitionKey: TABLE_PARTITION_KEY
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
        ],
        TableName: 'MyTable',
      }
    ));
    test.done();
  },

  'error when specifying read or write capacity with a PAY_PER_REQUEST billing mode'(test: Test) {
    const stack = new Stack();
    test.throws(() => new Table(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      billingMode: BillingMode.PayPerRequest,
      partitionKey: TABLE_PARTITION_KEY,
      readCapacity: 1
    }));
    test.throws(() => new Table(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      billingMode: BillingMode.PayPerRequest,
      partitionKey: TABLE_PARTITION_KEY,
      writeCapacity: 1
    }));
    test.throws(() => new Table(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      billingMode: BillingMode.PayPerRequest,
      partitionKey: TABLE_PARTITION_KEY,
      readCapacity: 1,
      writeCapacity: 1
    }));
    test.done();
  },

  'when adding a global secondary index with hash key only'(test: Test) {
    const stack = new Stack();

    const table = new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      readCapacity: 42,
      writeCapacity: 1337
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'gsiHashKey', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        GlobalSecondaryIndexes: [
          {
            IndexName: 'MyGSI',
            KeySchema: [
              { AttributeName: 'gsiHashKey', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 }
          }
        ]
      }
    ));
    test.done();
  },

  'when adding a global secondary index with hash + range key'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      projectionType: ProjectionType.All,
      readCapacity: 42,
      writeCapacity: 1337
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'gsiHashKey', AttributeType: 'S' },
          { AttributeName: 'gsiSortKey', AttributeType: 'B' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        GlobalSecondaryIndexes: [
          {
            IndexName: 'MyGSI',
            KeySchema: [
              { AttributeName: 'gsiHashKey', KeyType: 'HASH' },
              { AttributeName: 'gsiSortKey', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 }
          }
        ]
      }
    ));
    test.done();
  },

  'when adding a global secondary index with projection type KEYS_ONLY'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    });

    table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      projectionType: ProjectionType.KeysOnly,
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'gsiHashKey', AttributeType: 'S' },
          { AttributeName: 'gsiSortKey', AttributeType: 'B' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        GlobalSecondaryIndexes: [
          {
            IndexName: 'MyGSI',
            KeySchema: [
              { AttributeName: 'gsiHashKey', KeyType: 'HASH' },
              { AttributeName: 'gsiSortKey', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'KEYS_ONLY' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
          }
        ]
      }
    ));
    test.done();
  },

  'when adding a global secondary index with projection type INCLUDE'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    const gsiNonKeyAttributeGenerator = NON_KEY_ATTRIBUTE_GENERATOR(GSI_NON_KEY);
    table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      projectionType: ProjectionType.Include,
      nonKeyAttributes: [gsiNonKeyAttributeGenerator.next().value, gsiNonKeyAttributeGenerator.next().value],
      readCapacity: 42,
      writeCapacity: 1337
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'gsiHashKey', AttributeType: 'S' },
          { AttributeName: 'gsiSortKey', AttributeType: 'B' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        GlobalSecondaryIndexes: [
          {
            IndexName: 'MyGSI',
            KeySchema: [
              { AttributeName: 'gsiHashKey', KeyType: 'HASH' },
              { AttributeName: 'gsiSortKey', KeyType: 'RANGE' }
            ],
            Projection: { NonKeyAttributes: ['gsiNonKey0', 'gsiNonKey1'], ProjectionType: 'INCLUDE' },
            ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 }
          }
        ]
      }
    ));
    test.done();
  },

  'when adding a global secondary index on a table with PAY_PER_REQUEST billing mode'(test: Test) {
    const stack = new Stack();
    new Table(stack, CONSTRUCT_NAME, {
      billingMode: BillingMode.PayPerRequest,
      partitionKey: TABLE_PARTITION_KEY,
      sortKey: TABLE_SORT_KEY
    }).addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'gsiHashKey', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'MyGSI',
            KeySchema: [
              { AttributeName: 'gsiHashKey', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' }
          }
        ]
      }
    ));
    test.done();
  },

  'error when adding a global secondary index with projection type INCLUDE, but without specifying non-key attributes'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      projectionType: ProjectionType.Include
    }), /non-key attributes should be specified when using INCLUDE projection type/);

    test.done();
  },

  'error when adding a global secondary index with projection type ALL, but with non-key attributes'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    const gsiNonKeyAttributeGenerator = NON_KEY_ATTRIBUTE_GENERATOR(GSI_NON_KEY);

    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      nonKeyAttributes: [gsiNonKeyAttributeGenerator.next().value]
    }), /non-key attributes should not be specified when not using INCLUDE projection type/);

    test.done();
  },

  'error when adding a global secondary index with projection type KEYS_ONLY, but with non-key attributes'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    const gsiNonKeyAttributeGenerator = NON_KEY_ATTRIBUTE_GENERATOR(GSI_NON_KEY);

    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      projectionType: ProjectionType.KeysOnly,
      nonKeyAttributes: [gsiNonKeyAttributeGenerator.next().value]
    }), /non-key attributes should not be specified when not using INCLUDE projection type/);

    test.done();
  },

  'error when adding a global secondary index with projection type INCLUDE, but with more than 20 non-key attributes'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    const gsiNonKeyAttributeGenerator = NON_KEY_ATTRIBUTE_GENERATOR(GSI_NON_KEY);
    const gsiNonKeyAttributes: string[] = [];
    for (let i = 0; i < 21; i++) {
      gsiNonKeyAttributes.push(gsiNonKeyAttributeGenerator.next().value);
    }

    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      projectionType: ProjectionType.Include,
      nonKeyAttributes: gsiNonKeyAttributes
    }), /a maximum number of nonKeyAttributes across all of secondary indexes is 20/);

    test.done();
  },

  'error when adding a global secondary index with projection type INCLUDE, but with key attributes'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });

    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      projectionType: ProjectionType.Include,
      nonKeyAttributes: [GSI_NON_KEY, TABLE_PARTITION_KEY.name]
      // tslint:disable-next-line:max-line-length
    }), /a key attribute, hashKey, is part of a list of non-key attributes, gsiNonKey,hashKey, which is not allowed since all key attributes are added automatically and this configuration causes stack creation failure/);

    test.done();
  },

  'error when adding a global secondary index with read or write capacity on a PAY_PER_REQUEST table'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, {
      partitionKey: TABLE_PARTITION_KEY,
      billingMode: BillingMode.PayPerRequest
    });

    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      readCapacity: 1
    }));
    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      writeCapacity: 1
    }));
    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      readCapacity: 1,
      writeCapacity: 1
    }));

    test.done();
  },

  'when adding multiple global secondary indexes'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    const gsiGenerator = GSI_GENERATOR();
    for (let i = 0; i < 5; i++) {
      table.addGlobalSecondaryIndex(gsiGenerator.next().value);
    }

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'gsiHashKey0', AttributeType: 'S' },
          { AttributeName: 'gsiHashKey1', AttributeType: 'S' },
          { AttributeName: 'gsiHashKey2', AttributeType: 'S' },
          { AttributeName: 'gsiHashKey3', AttributeType: 'S' },
          { AttributeName: 'gsiHashKey4', AttributeType: 'S' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        GlobalSecondaryIndexes: [
          {
            IndexName: 'MyGSI0',
            KeySchema: [
              { AttributeName: 'gsiHashKey0', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
          },
          {
            IndexName: 'MyGSI1',
            KeySchema: [
              { AttributeName: 'gsiHashKey1', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
          },
          {
            IndexName: 'MyGSI2',
            KeySchema: [
              { AttributeName: 'gsiHashKey2', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
          },
          {
            IndexName: 'MyGSI3',
            KeySchema: [
              { AttributeName: 'gsiHashKey3', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
          },
          {
            IndexName: 'MyGSI4',
            KeySchema: [
              { AttributeName: 'gsiHashKey4', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
          },
        ]
      }
    ));
    test.done();
  },

  'error when adding more than 5 global secondary indexes'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    const gsiGenerator = GSI_GENERATOR();
    for (let i = 0; i < 5; i++) {
      table.addGlobalSecondaryIndex(gsiGenerator.next().value);
    }

    test.throws(() => table.addGlobalSecondaryIndex(gsiGenerator.next().value),
      /a maximum number of global secondary index per table is 5/);

    test.done();
  },

  'when adding a global secondary index without specifying read and write capacity'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });

    table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'gsiHashKey', AttributeType: 'S' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        GlobalSecondaryIndexes: [
          {
            IndexName: 'MyGSI',
            KeySchema: [
              { AttributeName: 'gsiHashKey', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
          }
        ]
      }
    ));
    test.done();
  },

  'when adding a local secondary index with hash + range key'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });

    table.addLocalSecondaryIndex({
      indexName: LSI_NAME,
      sortKey: LSI_SORT_KEY,
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'lsiSortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        LocalSecondaryIndexes: [
          {
            IndexName: 'MyLSI',
            KeySchema: [
              { AttributeName: 'hashKey', KeyType: 'HASH' },
              { AttributeName: 'lsiSortKey', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'ALL' },
          }
        ],
      }
    ));
    test.done();
  },

  'when adding a local secondary index with projection type KEYS_ONLY'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    table.addLocalSecondaryIndex({
      indexName: LSI_NAME,
      sortKey: LSI_SORT_KEY,
      projectionType: ProjectionType.KeysOnly
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'lsiSortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        LocalSecondaryIndexes: [
          {
            IndexName: 'MyLSI',
            KeySchema: [
              { AttributeName: 'hashKey', KeyType: 'HASH' },
              { AttributeName: 'lsiSortKey', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'KEYS_ONLY' },
          }
        ],
      }
    ));
    test.done();
  },

  'when adding a local secondary index with projection type INCLUDE'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    const lsiNonKeyAttributeGenerator = NON_KEY_ATTRIBUTE_GENERATOR(LSI_NON_KEY);
    table.addLocalSecondaryIndex({
      indexName: LSI_NAME,
      sortKey: LSI_SORT_KEY,
      projectionType: ProjectionType.Include,
      nonKeyAttributes: [ lsiNonKeyAttributeGenerator.next().value, lsiNonKeyAttributeGenerator.next().value ]
    });

    expect(stack).to(haveResource('AWS::DynamoDB::Table',
      {
        AttributeDefinitions: [
          { AttributeName: 'hashKey', AttributeType: 'S' },
          { AttributeName: 'sortKey', AttributeType: 'N' },
          { AttributeName: 'lsiSortKey', AttributeType: 'N' }
        ],
        KeySchema: [
          { AttributeName: 'hashKey', KeyType: 'HASH' },
          { AttributeName: 'sortKey', KeyType: 'RANGE' }
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        LocalSecondaryIndexes: [
          {
            IndexName: 'MyLSI',
            KeySchema: [
              { AttributeName: 'hashKey', KeyType: 'HASH' },
              { AttributeName: 'lsiSortKey', KeyType: 'RANGE' }
            ],
            Projection: { NonKeyAttributes: ['lsiNonKey0', 'lsiNonKey1'], ProjectionType: 'INCLUDE' },
          }
        ],
      }
    ));
    test.done();
  },

  'error when adding more than 5 local secondary indexes'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    const lsiGenerator = LSI_GENERATOR();
    for (let i = 0; i < 5; i++) {
      table.addLocalSecondaryIndex(lsiGenerator.next().value);
    }

    test.throws(() => table.addLocalSecondaryIndex(lsiGenerator.next().value),
      /a maximum number of local secondary index per table is 5/);

    test.done();
  },

  'error when adding a local secondary index with the name of a global secondary index'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY, sortKey: TABLE_SORT_KEY });
    table.addGlobalSecondaryIndex({
      indexName: 'SecondaryIndex',
      partitionKey: GSI_PARTITION_KEY
    });

    test.throws(() => table.addLocalSecondaryIndex({
      indexName: 'SecondaryIndex',
      sortKey: LSI_SORT_KEY
    }), /a duplicate index name, SecondaryIndex, is not allowed/);

    test.done();
  },

  'error when validating construct if a local secondary index exists without a sort key of the table'(test: Test) {
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { partitionKey: TABLE_PARTITION_KEY });

    table.addLocalSecondaryIndex({
      indexName: LSI_NAME,
      sortKey: LSI_SORT_KEY
    });

    const errors = table.node.validateTree();

    test.strictEqual(1, errors.length);
    test.strictEqual('a sort key of the table must be specified to add local secondary indexes', errors[0].message);

    test.done();
  },

  'can enable Read AutoScaling'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { readCapacity: 42, writeCapacity: 1337, partitionKey: TABLE_PARTITION_KEY });

    // WHEN
    table.autoScaleReadCapacity({ minCapacity: 50, maxCapacity: 500 }).scaleOnUtilization({ targetUtilizationPercent: 75 });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      MaxCapacity: 500,
      MinCapacity: 50,
      ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
      ServiceNamespace: 'dynamodb'
    }));
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
        TargetValue: 75
      }
    }));

    test.done();
  },

  'can enable Write AutoScaling'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { readCapacity: 42, writeCapacity: 1337, partitionKey: TABLE_PARTITION_KEY });

    // WHEN
    table.autoScaleWriteCapacity({ minCapacity: 50, maxCapacity: 500 }).scaleOnUtilization({ targetUtilizationPercent: 75 });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      MaxCapacity: 500,
      MinCapacity: 50,
      ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
      ServiceNamespace: 'dynamodb'
    }));
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
        TargetValue: 75
      }
    }));

    test.done();
  },

  'cannot enable AutoScaling twice on the same property'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { readCapacity: 42, writeCapacity: 1337, partitionKey: TABLE_PARTITION_KEY });
    table.autoScaleReadCapacity({ minCapacity: 50, maxCapacity: 500 }).scaleOnUtilization({ targetUtilizationPercent: 75 });

    // WHEN
    test.throws(() => {
      table.autoScaleReadCapacity({ minCapacity: 50, maxCapacity: 500 });
    });

    test.done();
  },

  'error when enabling AutoScaling on the PAY_PER_REQUEST table'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { billingMode: BillingMode.PayPerRequest, partitionKey: TABLE_PARTITION_KEY });
    table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY
    });

    // WHEN
    test.throws(() => {
      table.autoScaleReadCapacity({ minCapacity: 50, maxCapacity: 500 });
    });
    test.throws(() => {
      table.autoScaleWriteCapacity({ minCapacity: 50, maxCapacity: 500 });
    });
    test.throws(() => table.autoScaleGlobalSecondaryIndexReadCapacity(GSI_NAME, {
      minCapacity: 1,
      maxCapacity: 5
    }));

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scalingTargetValue < 10'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { readCapacity: 42, writeCapacity: 1337, partitionKey: TABLE_PARTITION_KEY });

    // THEN
    test.throws(() => {
      table.autoScaleReadCapacity({ minCapacity: 50, maxCapacity: 500 }).scaleOnUtilization({ targetUtilizationPercent: 5 });
    });

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid minimumCapacity'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, { readCapacity: 42, writeCapacity: 1337, partitionKey: TABLE_PARTITION_KEY });

    // THEN
    test.throws(() => table.autoScaleReadCapacity({ minCapacity: 10, maxCapacity: 5 }));

    test.done();
  },

  'can autoscale on a schedule'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const table = new Table(stack, CONSTRUCT_NAME, {
      readCapacity: 42,
      writeCapacity: 1337,
      partitionKey: { name: 'Hash', type: AttributeType.String }
    });

    // WHEN
    const scaling = table.autoScaleReadCapacity({ minCapacity: 1, maxCapacity: 100 });
    scaling.scaleOnSchedule('SaveMoneyByNotScalingUp', {
      schedule: 'cron(* * ? * * )',
      maxCapacity: 10
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ScheduledActions: [
        {
          ScalableTargetAction: { "MaxCapacity": 10 },
          Schedule: "cron(* * ? * * )",
          ScheduledActionName: "SaveMoneyByNotScalingUp"
        }
      ]
    }));

    test.done();
  },

  'grants': {

    '"grant" allows adding arbitrary actions associated with this table resource'(test: Test) {
      testGrant(test,
        [ 'action1', 'action2' ], (p, t) => t.grant(p, 'dynamodb:action1', 'dynamodb:action2'));
    },

    '"grantReadData" allows the principal to read data from the table'(test: Test) {
      testGrant(test,
        [ 'BatchGetItem', 'GetRecords', 'GetShardIterator', 'Query', 'GetItem', 'Scan' ], (p, t) => t.grantReadData(p));
    },

    '"grantWriteData" allows the principal to write data to the table'(test: Test) {
      testGrant(test, [
        'BatchWriteItem', 'PutItem', 'UpdateItem', 'DeleteItem' ], (p, t) => t.grantWriteData(p));
    },

    '"grantReadWriteData" allows the principal to read/write data'(test: Test) {
      testGrant(test, [
        'BatchGetItem', 'GetRecords', 'GetShardIterator', 'Query', 'GetItem', 'Scan',
        'BatchWriteItem', 'PutItem', 'UpdateItem', 'DeleteItem' ], (p, t) => t.grantReadWriteData(p));
    },

    '"grantFullAccess" allows the principal to perform any action on the table ("*")'(test: Test) {
      testGrant(test, [ '*' ], (p, t) => t.grantFullAccess(p));
    },

    '"Table.grantListStreams" allows principal to list all streams'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const user = new iam.User(stack, 'user');

      // WHEN
      Table.grantListStreams(user);

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": "dynamodb:ListStreams",
              "Effect": "Allow",
              "Resource": "*"
            }
          ],
          "Version": "2012-10-17"
        },
        "Users": [ { "Ref": "user2C2B57AE" } ]
      }));
      test.done();
    },

    '"grantStreamRead" allows principal to read and describe the table stream"'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const table = new Table(stack, 'my-table', {
        partitionKey: {
          name: 'id',
          type: AttributeType.String
        },
        streamSpecification: StreamViewType.NewImage
      });
      const user = new iam.User(stack, 'user');

      // WHEN
      table.grantStreamRead(user);

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "dynamodb:DescribeStream",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "mytable0324D45C",
                  "StreamArn"
                ]
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "Users": [ { "Ref": "user2C2B57AE" } ]
      }));
      test.done();
    },
    'if table has an index grant gives access to the index'(test: Test) {
      // GIVEN
      const stack = new Stack();

      const table = new Table(stack, 'my-table', { partitionKey: { name: 'ID', type: AttributeType.String } });
      table.addGlobalSecondaryIndex({ indexName: 'MyIndex', partitionKey: { name: 'Age', type: AttributeType.Number }});
      const user = new iam.User(stack, 'user');

      // WHEN
      table.grantReadData(user);

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                'dynamodb:BatchGetItem',
                'dynamodb:GetRecords',
                'dynamodb:GetShardIterator',
                'dynamodb:Query',
                'dynamodb:GetItem',
                'dynamodb:Scan'
              ],
              "Effect": "Allow",
              "Resource": [
                { "Fn::GetAtt": ["mytable0324D45C", "Arn"] },
                { "Fn::Join": [ "", [ { "Fn::GetAtt": [ "mytable0324D45C", "Arn" ] }, "/index/*" ] ] }
              ]
            }
          ],
          "Version": "2012-10-17"
        },
        "Users": [ { "Ref": "user2C2B57AE" } ]
      }));
      test.done();
    }
  },
};

function testGrant(test: Test, expectedActions: string[], invocation: (user: iam.IPrincipal, table: Table) => void) {
  // GIVEN
  const stack = new Stack();
  const table = new Table(stack, 'my-table', { partitionKey: { name: 'ID', type:  AttributeType.String } });
  const user = new iam.User(stack, 'user');

  // WHEN
  invocation(user, table);

  // THEN
  const action = expectedActions.length > 1 ? expectedActions.map(a => `dynamodb:${a}`) : `dynamodb:${expectedActions[0]}`;
  expect(stack).to(haveResource('AWS::IAM::Policy', {
    "PolicyDocument": {
      "Statement": [
        {
          "Action": action,
          "Effect": "Allow",
          "Resource": [
            { "Fn::GetAtt": [ "mytable0324D45C", "Arn" ] },
            { "Ref" : "AWS::NoValue" }
          ]
        }
      ],
      "Version": "2012-10-17"
    },
    "Users": [ { "Ref": "user2C2B57AE" } ]
  }));
  test.done();
}
