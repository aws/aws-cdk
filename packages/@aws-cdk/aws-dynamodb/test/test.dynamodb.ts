import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Attribute, AttributeType, ProjectionType, SecondaryIndexProps, StreamViewType, Table } from '../lib';

// CDK parameters
const STACK_NAME = 'MyStack';
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
    const globalSecondaryIndexProps: SecondaryIndexProps = {
      indexName: `${GSI_NAME}${n}`,
      partitionKey: { name: `${GSI_PARTITION_KEY.name}${n}`, type: GSI_PARTITION_KEY.type }
    };
    yield globalSecondaryIndexProps;
    n++;
  }
}
function* GSI_NON_KEY_ATTRIBUTE_GENERATOR() {
  let n = 0;
  while (true) {
    yield `${GSI_NON_KEY}${n}`;
    n++;
  }
}

export = {
  'default properties': {
    'fails without a hash key'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, CONSTRUCT_NAME);
      test.throws(() => app.synthesizeTemplate(), /partition key/);

      test.done();
    },

    'hash key only'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, CONSTRUCT_NAME).addPartitionKey(TABLE_PARTITION_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [{ AttributeName: 'hashKey', AttributeType: 'S' }],
              KeySchema: [{ AttributeName: 'hashKey', KeyType: 'HASH' }],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
              GlobalSecondaryIndexes: []
            }
          }
        }
      });

      test.done();
    },

    'hash + range key'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, CONSTRUCT_NAME)
        .addPartitionKey(TABLE_PARTITION_KEY)
        .addSortKey(TABLE_SORT_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'hashKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'hashKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
              GlobalSecondaryIndexes: []
            }
          }
        }
      });

      test.done();
    },

    'point-in-time recovery is not enabled'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, CONSTRUCT_NAME)
        .addPartitionKey(TABLE_PARTITION_KEY)
        .addSortKey(TABLE_SORT_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'hashKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'hashKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
              GlobalSecondaryIndexes: []
            }
          }
        }
      });

      test.done();
    },

    'server-side encryption is not enabled'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, CONSTRUCT_NAME)
        .addPartitionKey(TABLE_PARTITION_KEY)
        .addSortKey(TABLE_SORT_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'hashKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'hashKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
              GlobalSecondaryIndexes: []
            }
          }
        }
      });

      test.done();
    },

    'stream is not enabled'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, CONSTRUCT_NAME)
        .addPartitionKey(TABLE_PARTITION_KEY)
        .addSortKey(TABLE_SORT_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'hashKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'hashKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
              GlobalSecondaryIndexes: []
            }
          }
        }
      });

      test.done();
    },

    'ttl is not enabled'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, CONSTRUCT_NAME)
        .addPartitionKey(TABLE_PARTITION_KEY)
        .addSortKey(TABLE_SORT_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'hashKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'hashKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
              GlobalSecondaryIndexes: []
            }
          }
        }
      });

      test.done();
    },

    'can specify new and old images'(test: Test) {
      const app = new TestApp();
      const table = new Table(app.stack, CONSTRUCT_NAME, {
        tableName: TABLE_NAME,
        readCapacity: 42,
        writeCapacity: 1337,
        streamSpecification: StreamViewType.NewAndOldImages
      });
      table.addPartitionKey(TABLE_PARTITION_KEY);
      table.addSortKey(TABLE_SORT_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
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
              GlobalSecondaryIndexes: [],
              TableName: 'MyTable'
            }
          }
        }
      });

      test.done();
    },

    'can specify new images only'(test: Test) {
      const app = new TestApp();
      const table = new Table(app.stack, CONSTRUCT_NAME, {
        tableName: TABLE_NAME,
        readCapacity: 42,
        writeCapacity: 1337,
        streamSpecification: StreamViewType.NewImage
      });
      table.addPartitionKey(TABLE_PARTITION_KEY);
      table.addSortKey(TABLE_SORT_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              KeySchema: [
                { AttributeName: 'hashKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
              GlobalSecondaryIndexes: [],
              AttributeDefinitions: [
                { AttributeName: 'hashKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              StreamSpecification: { StreamViewType: 'NEW_IMAGE' },
              TableName: 'MyTable'
            }
          }
        }
      });

      test.done();
    },

    'can specify old images only'(test: Test) {
      const app = new TestApp();
      const table = new Table(app.stack, CONSTRUCT_NAME, {
        tableName: TABLE_NAME,
        readCapacity: 42,
        writeCapacity: 1337,
        streamSpecification: StreamViewType.OldImage
      });
      table.addPartitionKey(TABLE_PARTITION_KEY);
      table.addSortKey(TABLE_SORT_KEY);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              KeySchema: [
                { AttributeName: 'hashKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
              GlobalSecondaryIndexes: [],
              AttributeDefinitions: [
                { AttributeName: 'hashKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              StreamSpecification: { StreamViewType: 'OLD_IMAGE' },
              TableName: 'MyTable'
            }
          }
        }
      });

      test.done();
    }
  },

  'when specifying every property'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      pitrEnabled: true,
      sseEnabled: true,
      streamSpecification: StreamViewType.KeysOnly,
      ttlAttributeName: 'timeToLive'
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    const template = app.synthesizeTemplate();

    test.deepEqual(template, {
      Resources: {
        MyTable794EDED1: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
            GlobalSecondaryIndexes: [],
            PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
            SSESpecification: { SSEEnabled: true },
            StreamSpecification: { StreamViewType: 'KEYS_ONLY' },
            TableName: 'MyTable',
            TimeToLiveSpecification: { AttributeName: 'timeToLive', Enabled: true }
          }
        }
      }
    });

    test.done();
  },

  'when adding a global secondary index with hash key only'(test: Test) {
    const app = new TestApp();
    new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY)
      .addGlobalSecondaryIndex({
        indexName: GSI_NAME,
        partitionKey: GSI_PARTITION_KEY,
        readCapacity: 42,
        writeCapacity: 1337
      });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, {
      Resources: {
        MyTable794EDED1: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
        }
      }
    });

    test.done();
  },

  'when adding a global secondary index with hash + range key'(test: Test) {
    const app = new TestApp();
    new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY)
      .addGlobalSecondaryIndex({
        indexName: GSI_NAME,
        partitionKey: GSI_PARTITION_KEY,
        sortKey: GSI_SORT_KEY,
        projectionType: ProjectionType.All,
        readCapacity: 42,
        writeCapacity: 1337
      });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, {
      Resources: {
        MyTable794EDED1: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
        }
      }
    });

    test.done();
  },

  'when adding a global secondary index with projection type KEYS_ONLY'(test: Test) {
    const app = new TestApp();
    new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY)
      .addGlobalSecondaryIndex({
        indexName: GSI_NAME,
        partitionKey: GSI_PARTITION_KEY,
        sortKey: GSI_SORT_KEY,
        projectionType: ProjectionType.KeysOnly,
      });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, {
      Resources: {
        MyTable794EDED1: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
        }
      }
    });

    test.done();
  },

  'when adding a global secondary index with projection type INCLUDE'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY);
    const gsiNonKeyAttributeGenerator = GSI_NON_KEY_ATTRIBUTE_GENERATOR();
    table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      projectionType: ProjectionType.Include,
      nonKeyAttributes: [gsiNonKeyAttributeGenerator.next().value, gsiNonKeyAttributeGenerator.next().value],
      readCapacity: 42,
      writeCapacity: 1337
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, {
      Resources: {
        MyTable794EDED1: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
        }
      }
    });

    test.done();
  },

  'error when adding a global secondary index with projection type INCLUDE, but without specifying non-key attributes'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY);

    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      sortKey: GSI_SORT_KEY,
      projectionType: ProjectionType.Include
    }), /non-key attributes should be specified when using INCLUDE projection type/);

    test.done();
  },

  'error when adding a global secondary index with projection type ALL, but with non-key attributes'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY);
    const gsiNonKeyAttributeGenerator = GSI_NON_KEY_ATTRIBUTE_GENERATOR();

    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      nonKeyAttributes: [gsiNonKeyAttributeGenerator.next().value]
    }), /non-key attributes should not be specified when not using INCLUDE projection type/);

    test.done();
  },

  'error when adding a global secondary index with projection type KEYS_ONLY, but with non-key attributes'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY);
    const gsiNonKeyAttributeGenerator = GSI_NON_KEY_ATTRIBUTE_GENERATOR();

    test.throws(() => table.addGlobalSecondaryIndex({
      indexName: GSI_NAME,
      partitionKey: GSI_PARTITION_KEY,
      projectionType: ProjectionType.KeysOnly,
      nonKeyAttributes: [gsiNonKeyAttributeGenerator.next().value]
    }), /non-key attributes should not be specified when not using INCLUDE projection type/);

    test.done();
  },

  'error when adding a global secondary index with projection type INCLUDE, but with more than 20 non-key attributes'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY);
    const gsiNonKeyAttributeGenerator = GSI_NON_KEY_ATTRIBUTE_GENERATOR();
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
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY);

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

  'when adding multiple global secondary indexes'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY);
    const gsiGenerator = GSI_GENERATOR();
    for (let i = 0; i < 5; i++) {
      table.addGlobalSecondaryIndex(gsiGenerator.next().value);
    }
    const template = app.synthesizeTemplate();

    test.deepEqual(template, {
      Resources: {
        MyTable794EDED1: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
        }
      }
    });

    test.done();
  },

  'error when adding more than 5 global secondary indexes'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY);
    const gsiGenerator = GSI_GENERATOR();
    for (let i = 0; i < 5; i++) {
      table.addGlobalSecondaryIndex(gsiGenerator.next().value);
    }

    test.throws(() => table.addGlobalSecondaryIndex(gsiGenerator.next().value),
      /a maximum number of global secondary index per table is 5/);

    test.done();
  },

  'when adding a global secondary index without specifying read and write capacity'(test: Test) {
    const app = new TestApp();
    new Table(app.stack, CONSTRUCT_NAME)
      .addPartitionKey(TABLE_PARTITION_KEY)
      .addSortKey(TABLE_SORT_KEY)
      .addGlobalSecondaryIndex({
        indexName: GSI_NAME,
        partitionKey: GSI_PARTITION_KEY,
      });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, {
      Resources: {
        MyTable794EDED1: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
        }
      }
    });

    test.done();
  },

  'when specifying Read Auto Scaling'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60,
      scalingPolicyName: 'MyAwesomePolicyName'
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'hashKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          GlobalSecondaryIndexes: [],
          AttributeDefinitions:
           [ { AttributeName: 'hashKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'N' } ],
          TableName: 'MyTable' } },
        MyTableReadAutoScalingRoleFEE68E49:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableReadAutoScalingRoleDefaultPolicyF6A1975F:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableReadAutoScalingRoleDefaultPolicyF6A1975F',
          Roles: [ { Ref: 'MyTableReadAutoScalingRoleFEE68E49' } ] } },
        MyTableReadCapacityScalableTarget72B0B3BF:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableReadAutoScalingRoleFEE68E49', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableReadCapacityScalingPolicyCC18E396:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName: 'MyAwesomePolicyName',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableReadCapacityScalableTarget72B0B3BF' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'when specifying Read Auto Scaling via constructor'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      readAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 75.0,
        scaleInCooldown: 80,
        scaleOutCooldown: 60,
        scalingPolicyName: 'MyAwesomePolicyName'
      }
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'hashKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          GlobalSecondaryIndexes: [],
          AttributeDefinitions:
           [ { AttributeName: 'hashKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'N' } ],
          TableName: 'MyTable' } },
        MyTableReadAutoScalingRoleFEE68E49:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableReadAutoScalingRoleDefaultPolicyF6A1975F:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableReadAutoScalingRoleDefaultPolicyF6A1975F',
          Roles: [ { Ref: 'MyTableReadAutoScalingRoleFEE68E49' } ] } },
        MyTableReadCapacityScalableTarget72B0B3BF:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableReadAutoScalingRoleFEE68E49', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableReadCapacityScalingPolicyCC18E396:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName: 'MyAwesomePolicyName',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableReadCapacityScalableTarget72B0B3BF' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'error when specifying Read Auto Scaling via constructor and attempting to addReadAutoScaling'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      readAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 75.0,
        scaleInCooldown: 80,
        scaleOutCooldown: 60,
        scalingPolicyName: 'MyAwesomePolicyName'
      }
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 500,
      maxCapacity: 5000,
      targetValue: 25.0,
      scaleInCooldown: 40,
      scaleOutCooldown: 20,
      scalingPolicyName: 'MySecondAwesomePolicyName'
    }), /Read Auto Scaling already defined for Table/);

    test.done();
  },

  'when specifying Read Auto Scaling without scalingPolicyName'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'hashKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          GlobalSecondaryIndexes: [],
          AttributeDefinitions:
           [ { AttributeName: 'hashKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'N' } ],
          TableName: 'MyTable' } },
        MyTableReadAutoScalingRoleFEE68E49:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableReadAutoScalingRoleDefaultPolicyF6A1975F:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableReadAutoScalingRoleDefaultPolicyF6A1975F',
          Roles: [ { Ref: 'MyTableReadAutoScalingRoleFEE68E49' } ] } },
        MyTableReadCapacityScalableTarget72B0B3BF:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableReadAutoScalingRoleFEE68E49', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableReadCapacityScalingPolicyCC18E396:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName:
           { 'Fn::Join': [ '', [ { Ref: 'MyTable794EDED1' }, 'ReadCapacityScalingPolicy' ] ] },
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableReadCapacityScalableTarget72B0B3BF' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'when specifying Read Auto Scaling without scalingPolicyName without Table Name'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'hashKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          GlobalSecondaryIndexes: [],
          AttributeDefinitions:
           [ { AttributeName: 'hashKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'N' } ] } },
        MyTableReadAutoScalingRoleFEE68E49:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableReadAutoScalingRoleDefaultPolicyF6A1975F:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableReadAutoScalingRoleDefaultPolicyF6A1975F',
          Roles: [ { Ref: 'MyTableReadAutoScalingRoleFEE68E49' } ] } },
        MyTableReadCapacityScalableTarget72B0B3BF:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableReadAutoScalingRoleFEE68E49', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableReadCapacityScalingPolicyCC18E396:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName:
           { 'Fn::Join': [ '', [ { Ref: 'MyTable794EDED1' }, 'ReadCapacityScalingPolicy' ] ] },
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableReadCapacityScalableTarget72B0B3BF' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scalingTargetValue < 10'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 5.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    // tslint:disable-next-line:max-line-length
    }), /scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization\/DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: 5/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scalingTargetValue > 90'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 95.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    // tslint:disable-next-line:max-line-length
    }), /scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization\/DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: 95/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scaleInCooldown'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: -5,
      scaleOutCooldown: 60
    }), /scaleInCooldown must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scaleOutCooldown'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: -5
    }), /scaleOutCooldown must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid maximumCapacity'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: -5,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    }), /maximumCapacity must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid minimumCapacity'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addReadAutoScaling({
      minCapacity: -5,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    }), /minimumCapacity must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'when specifying Write Auto Scaling'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60,
      scalingPolicyName: 'MyAwesomePolicyName'
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'hashKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          GlobalSecondaryIndexes: [],
          AttributeDefinitions:
           [ { AttributeName: 'hashKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'N' } ],
          TableName: 'MyTable' } },
        MyTableWriteAutoScalingRoleDF7775DE:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB',
          Roles: [ { Ref: 'MyTableWriteAutoScalingRoleDF7775DE' } ] } },
        MyTableWriteCapacityScalableTarget56F9809A:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableWriteAutoScalingRoleDF7775DE', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableWriteCapacityScalingPolicy766EAD7A:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName: 'MyAwesomePolicyName',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableWriteCapacityScalableTarget56F9809A' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'when specifying Write Auto Scaling via constructor'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      writeAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 75.0,
        scaleInCooldown: 80,
        scaleOutCooldown: 60,
        scalingPolicyName: 'MyAwesomePolicyName'
      }
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'hashKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          GlobalSecondaryIndexes: [],
          AttributeDefinitions:
           [ { AttributeName: 'hashKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'N' } ],
          TableName: 'MyTable' } },
        MyTableWriteAutoScalingRoleDF7775DE:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB',
          Roles: [ { Ref: 'MyTableWriteAutoScalingRoleDF7775DE' } ] } },
        MyTableWriteCapacityScalableTarget56F9809A:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableWriteAutoScalingRoleDF7775DE', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableWriteCapacityScalingPolicy766EAD7A:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName: 'MyAwesomePolicyName',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableWriteCapacityScalableTarget56F9809A' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'error when specifying Write Auto Scaling via constructor and attempting to addWriteAutoScaling'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337,
      writeAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 75.0,
        scaleInCooldown: 80,
        scaleOutCooldown: 60,
        scalingPolicyName: 'MyAwesomePolicyName'
      }
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 500,
      maxCapacity: 5000,
      targetValue: 25.0,
      scaleInCooldown: 40,
      scaleOutCooldown: 20,
      scalingPolicyName: 'MySecondAwesomePolicyName'
    }), /Write Auto Scaling already defined for Table/);

    test.done();
  },

  'when specifying Write Auto Scaling without scalingPolicyName'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'hashKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          GlobalSecondaryIndexes: [],
          AttributeDefinitions:
           [ { AttributeName: 'hashKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'N' } ],
          TableName: 'MyTable' } },
        MyTableWriteAutoScalingRoleDF7775DE:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB',
          Roles: [ { Ref: 'MyTableWriteAutoScalingRoleDF7775DE' } ] } },
        MyTableWriteCapacityScalableTarget56F9809A:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableWriteAutoScalingRoleDF7775DE', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableWriteCapacityScalingPolicy766EAD7A:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName:
           { 'Fn::Join': [ '', [ { Ref: 'MyTable794EDED1' }, 'WriteCapacityScalingPolicy' ] ] },
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableWriteCapacityScalableTarget56F9809A' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'when specifying Write Auto Scaling without scalingPolicyName without Table Name'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'hashKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          GlobalSecondaryIndexes: [],
          AttributeDefinitions:
           [ { AttributeName: 'hashKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'N' } ] } },
        MyTableWriteAutoScalingRoleDF7775DE:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB',
          Roles: [ { Ref: 'MyTableWriteAutoScalingRoleDF7775DE' } ] } },
        MyTableWriteCapacityScalableTarget56F9809A:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableWriteAutoScalingRoleDF7775DE', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableWriteCapacityScalingPolicy766EAD7A:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName:
           { 'Fn::Join': [ '', [ { Ref: 'MyTable794EDED1' }, 'WriteCapacityScalingPolicy' ] ] },
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableWriteCapacityScalableTarget56F9809A' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid scalingTargetValue < 10'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 5.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    // tslint:disable-next-line:max-line-length
    }), /scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization\/DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: 5/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid scalingTargetValue > 90'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 95.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    // tslint:disable-next-line:max-line-length
    }), /scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization\/DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: 95/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid scaleInCooldown'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: -5,
      scaleOutCooldown: 60
    }), /scaleInCooldown must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid scaleOutCooldown'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: -5
    }), /scaleOutCooldown must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid maximumCapacity'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: -5,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    }), /maximumCapacity must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid minimumCapacity'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey(TABLE_PARTITION_KEY);
    table.addSortKey(TABLE_SORT_KEY);
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: -5,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    }), /minimumCapacity must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  }
};

class TestApp {
  private readonly app = new App();
  // tslint:disable-next-line:member-ordering
  public readonly stack: Stack = new Stack(this.app, STACK_NAME);

  public synthesizeTemplate() {
    return this.app.synthesizeStack(this.stack.name).template;
  }
}
