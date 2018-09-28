import dynamodb = require('@aws-cdk/aws-dynamodb');
import cdk = require('@aws-cdk/cdk');

export class DynamoPostsTable extends cdk.Construct {
  constructor(parent: cdk.Construct, name: string) {
    super(parent, name);

    const table = new dynamodb.Table(this, 'Table', {
      readCapacity: 5, writeCapacity: 5
    });

    table.addPartitionKey({ name: 'Alias', type: dynamodb.AttributeType.String });
    table.addSortKey({ name: 'Timestamp', type: dynamodb.AttributeType.String });
  }
}
