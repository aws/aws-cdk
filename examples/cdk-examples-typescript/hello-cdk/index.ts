import { App, Stack, StackProps } from '@aws-cdk/cdk';
import { KeyAttributeType, Table } from '@aws-cdk/dynamodb';

class HelloCDK extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const table = new Table(this, 'Table', {
            readCapacity: 1,
            writeCapacity: 1
        });

        table.addPartitionKey('ID', KeyAttributeType.String);
        table.addSortKey('Timestamp', KeyAttributeType.Number);
    }
}

const app = new App(process.argv);

new HelloCDK(app, 'Hello');

process.stdout.write(app.run());
