import { App, Stack } from '@aws-cdk/cdk';
import { KeyAttributeType, Table } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-dynamodb');

const table = new Table(stack, 'Table');

table.addPartitionKey('hashKey', KeyAttributeType.String);
table.addSortKey('rangeKey', KeyAttributeType.Number);

process.stdout.write(app.run());
