import { App, Stack } from '@aws-cdk/cdk';
import { AttributeType, StreamViewType, Table } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-dynamodb');

const table = new Table(stack, 'Table', {
  pitrEnabled: true,
  sseEnabled: true,
  streamSpecification: StreamViewType.KeysOnly,
  ttlAttributeName: 'timeToLive'
});

table.addPartitionKey({ name: 'hashKey', type: AttributeType.String });
table.addSortKey({ name: 'rangeKey', type: AttributeType.Number });

process.stdout.write(app.run());
