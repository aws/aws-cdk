import dynamodb = require('@aws-cdk/aws-dynamodb');
import cdk = require('@aws-cdk/cdk');

class HelloCDK extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'Table', {
      readCapacity: 1,
      writeCapacity: 1
    });

    table.addPartitionKey({ name: 'ID', type: dynamodb.AttributeType.String });
    table.addSortKey({ name: 'Timestamp', type: dynamodb.AttributeType.Number });
  }
}

const app = new cdk.App();

new HelloCDK(app, 'Hello');

app.run();
