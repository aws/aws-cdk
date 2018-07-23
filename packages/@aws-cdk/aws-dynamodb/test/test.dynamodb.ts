import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { KeyAttributeType, Table } from '../lib';

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
                            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
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
                            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
                        }
                    }
                }
            });

            test.done();
        },
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
                        TableName: 'MyTable'
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
