import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { KeyAttributeType, StreamViewType, Table } from '../lib';

export = {
    'default properties': {
        'fails without a hash key'(test: Test) {
            const app = new TestApp();
            new Table(app.stack, 'MyTable');
            test.throws(() => app.synthesizeTemplate(), /partition key/);

            test.done();
        },

        'range key only'(test: Test) {
            const app = new TestApp();
            new Table(app.stack, 'MyTable').addPartitionKey('hashKey', KeyAttributeType.Binary);
            const template = app.synthesizeTemplate();

            test.deepEqual(template, {
                Resources: {
                    MyTable794EDED1: {
                        Type: 'AWS::DynamoDB::Table',
                        Properties: {
                            AttributeDefinitions: [{ AttributeName: 'hashKey', AttributeType: 'B' }],
                            KeySchema: [{ AttributeName: 'hashKey', KeyType: 'HASH' }],
                            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
                        }
                    }
                }
            });

            test.done();
        },

        'range + hash key'(test: Test) {
            const app = new TestApp();
            new Table(app.stack, 'MyTable').addPartitionKey('hashKey', KeyAttributeType.Binary)
                                        .addSortKey('sortKey', KeyAttributeType.Number);
            const template = app.synthesizeTemplate();

            test.deepEqual(template, {
                Resources: {
                    MyTable794EDED1: {
                        Type: 'AWS::DynamoDB::Table',
                        Properties: {
                            AttributeDefinitions: [
                                { AttributeName: 'hashKey', AttributeType: 'B' },
                                { AttributeName: 'sortKey', AttributeType: 'N' }
                            ],
                            KeySchema: [
                                { AttributeName: 'hashKey', KeyType: 'HASH' },
                                { AttributeName: 'sortKey', KeyType: 'RANGE' }
                            ],
                            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
                        }
                    }
                }
            });

            test.done();
        },
        'stream is not enabled by default'(test: Test) {
            const app = new TestApp();
            new Table(app.stack, 'MyTable')
                .addPartitionKey('partitionKey', KeyAttributeType.Binary)
                .addSortKey('sortKey', KeyAttributeType.Number);
            const template = app.synthesizeTemplate();

            test.deepEqual(template, {
                Resources: {
                    MyTable794EDED1: {
                        Type: 'AWS::DynamoDB::Table',
                        Properties: {
                            AttributeDefinitions: [
                                { AttributeName: 'partitionKey', AttributeType: 'B' },
                                { AttributeName: 'sortKey', AttributeType: 'N' }
                            ],
                            KeySchema: [
                                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                                { AttributeName: 'sortKey', KeyType: 'RANGE' }
                            ],
                            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
                        }
                    }
                }
            });

            test.done();
        },
        'can specify new and old images'(test: Test) {
            const app = new TestApp();
            const table = new Table(app.stack, 'MyTable', {
                tableName: 'MyTable',
                readCapacity: 42,
                writeCapacity: 1337,
                streamSpecification: StreamViewType.NewAndOldImages
            });
            table.addPartitionKey('partitionKey', KeyAttributeType.String);
            table.addSortKey('sortKey', KeyAttributeType.Binary);
            const template = app.synthesizeTemplate();

            test.deepEqual(template, {
                Resources: {
                    MyTable794EDED1: {
                        Type: 'AWS::DynamoDB::Table',
                        Properties: {
                            AttributeDefinitions: [
                                { AttributeName: 'partitionKey', AttributeType: 'S' },
                                { AttributeName: 'sortKey', AttributeType: 'B' }
                            ],
                            StreamSpecification: { StreamViewType: 'NEW_AND_OLD_IMAGES' },
                            KeySchema: [
                                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                                { AttributeName: 'sortKey', KeyType: 'RANGE' }
                            ],
                            ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
                            TableName: 'MyTable'
                        }
                    }
                }
            });

            test.done();
        },
        'can specify new images only'(test: Test) {
            const app = new TestApp();
            const table = new Table(app.stack, 'MyTable', {
                tableName: 'MyTable',
                readCapacity: 42,
                writeCapacity: 1337,
                streamSpecification: StreamViewType.NewImage
            });
            table.addPartitionKey('partitionKey', KeyAttributeType.String);
            table.addSortKey('sortKey', KeyAttributeType.Binary);
            const template = app.synthesizeTemplate();

            test.deepEqual(template, {
                Resources: {
                    MyTable794EDED1: {
                        Type: 'AWS::DynamoDB::Table',
                        Properties: {
                            KeySchema: [
                                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                                { AttributeName: 'sortKey', KeyType: 'RANGE' }
                            ],
                            ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
                            AttributeDefinitions: [
                                { AttributeName: 'partitionKey', AttributeType: 'S' },
                                { AttributeName: 'sortKey', AttributeType: 'B' }
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
            const table = new Table(app.stack, 'MyTable', {
                tableName: 'MyTable',
                readCapacity: 42,
                writeCapacity: 1337,
                streamSpecification: StreamViewType.OldImage
            });
            table.addPartitionKey('partitionKey', KeyAttributeType.String);
            table.addSortKey('sortKey', KeyAttributeType.Binary);
            const template = app.synthesizeTemplate();

            test.deepEqual(template, {
                Resources: {
                    MyTable794EDED1: {
                        Type: 'AWS::DynamoDB::Table',
                        Properties: {
                            KeySchema: [
                                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                                { AttributeName: 'sortKey', KeyType: 'RANGE' }
                            ],
                            ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
                            AttributeDefinitions: [
                                { AttributeName: 'partitionKey', AttributeType: 'S' },
                                { AttributeName: 'sortKey', AttributeType: 'B' }
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
        const table = new Table(app.stack, 'MyTable', {
            tableName: 'MyTable',
            readCapacity: 42,
            writeCapacity: 1337
        });
        table.addPartitionKey('partitionKey', KeyAttributeType.String);
        table.addSortKey('sortKey', KeyAttributeType.Binary);
        const template = app.synthesizeTemplate();

        test.deepEqual(template, {
            Resources: {
                MyTable794EDED1: {
                    Type: 'AWS::DynamoDB::Table',
                    Properties: {
                        AttributeDefinitions: [
                            { AttributeName: 'partitionKey', AttributeType: 'S' },
                            { AttributeName: 'sortKey', AttributeType: 'B' }
                        ],
                        KeySchema: [
                            { AttributeName: 'partitionKey', KeyType: 'HASH' },
                            { AttributeName: 'sortKey', KeyType: 'RANGE' }
                        ],
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 42,
                            WriteCapacityUnits: 1337
                        },
                        TableName: 'MyTable',
                    }
                }
            }
        });

        test.done();
    }
};

class TestApp {
    private readonly app = new App();
    // tslint:disable-next-line:member-ordering
    public readonly stack: Stack = new Stack(this.app, 'MyStack');

    public synthesizeTemplate() {
        return this.app.synthesizeStack(this.stack.name).template;
    }
}
