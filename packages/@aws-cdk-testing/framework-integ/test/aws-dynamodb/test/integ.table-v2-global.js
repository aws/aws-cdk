"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_kinesis_1 = require("aws-cdk-lib/aws-kinesis");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stream = new aws_kinesis_1.Stream(this, 'Stream');
        const globalTable = new aws_dynamodb_1.TableV2(this, 'GlobalTable', {
            partitionKey: { name: 'pk', type: aws_dynamodb_1.AttributeType.STRING },
            sortKey: { name: 'sk', type: aws_dynamodb_1.AttributeType.NUMBER },
            billing: aws_dynamodb_1.Billing.provisioned({
                readCapacity: aws_dynamodb_1.Capacity.fixed(10),
                writeCapacity: aws_dynamodb_1.Capacity.autoscaled({ maxCapacity: 20, targetUtilizationPercent: 60, seedCapacity: 10 }),
            }),
            encryption: aws_dynamodb_1.TableEncryptionV2.awsManagedKey(),
            contributorInsightsSpecification: {
                enabled: true,
            },
            pointInTimeRecovery: true,
            tableClass: aws_dynamodb_1.TableClass.STANDARD_INFREQUENT_ACCESS,
            timeToLiveAttribute: 'attr',
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            kinesisStream: stream,
            globalSecondaryIndexes: [
                {
                    indexName: 'gsi1',
                    partitionKey: { name: 'pk', type: aws_dynamodb_1.AttributeType.STRING },
                    readCapacity: aws_dynamodb_1.Capacity.fixed(10),
                },
                {
                    indexName: 'gsi2',
                    partitionKey: { name: 'pk', type: aws_dynamodb_1.AttributeType.STRING },
                    writeCapacity: aws_dynamodb_1.Capacity.autoscaled({ maxCapacity: 30 }),
                },
            ],
            localSecondaryIndexes: [
                {
                    indexName: 'lsi',
                    sortKey: { name: 'sk', type: aws_dynamodb_1.AttributeType.NUMBER },
                },
            ],
            replicas: [
                {
                    region: 'us-east-2',
                    readCapacity: aws_dynamodb_1.Capacity.autoscaled({ minCapacity: 5, maxCapacity: 25 }),
                    globalSecondaryIndexOptions: {
                        gsi2: {
                            contributorInsightsSpecification: {
                                enabled: false,
                            },
                        },
                    },
                    tags: [{ key: 'USE2ReplicaTagKey', value: 'USE2ReplicaTagValue' }],
                },
                {
                    region: 'us-west-2',
                    tableClass: aws_dynamodb_1.TableClass.STANDARD,
                    contributorInsightsSpecification: {
                        enabled: false,
                    },
                    globalSecondaryIndexOptions: {
                        gsi1: {
                            readCapacity: aws_dynamodb_1.Capacity.fixed(15),
                        },
                    },
                    tags: [{ key: 'USW2ReplicaTagKey', value: 'USW2ReplicaTagValue' }],
                },
            ],
            tags: [{ key: 'primaryTableTagKey', value: 'primaryTableTagValue' }],
        });
        aws_cdk_lib_1.Tags.of(globalTable).add('tagAspectKey', 'tagAspectValue');
    }
}
const app = new aws_cdk_lib_1.App();
aws_cdk_lib_1.Tags.of(app).add('stage', 'IntegTest');
new integ_tests_alpha_1.IntegTest(app, 'aws-cdk-global-table-integ', {
    testCases: [new TestStack(app, 'aws-cdk-global-table', { env: { region: process.env.CDK_DEFAULT_REGION || 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT } })],
});
