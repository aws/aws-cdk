import dynamodb = require('@aws-cdk/aws-dynamodb');
import cdk = require('@aws-cdk/cdk');

class HelloCDK extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        const table = new dynamodb.Table(this, 'Table', {
            readCapacity: 1,
            writeCapacity: 1
        });

        table.addPartitionKey('ID', dynamodb.KeyAttributeType.String);
        table.addSortKey('Timestamp', dynamodb.KeyAttributeType.Number);
    }
}

const app = new cdk.App(process.argv);

new HelloCDK(app, 'Hello');

process.stdout.write(app.run());
