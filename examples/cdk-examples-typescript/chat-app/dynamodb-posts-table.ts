import dynamodb = require('@aws-cdk/aws-dynamodb');
import cdk = require('@aws-cdk/cdk');

export class DynamoPostsTable extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'Alias',
        type: dynamodb.AttributeType.String
      },
      sortKey: {
        name: 'Timestamp',
        type: dynamodb.AttributeType.String
      },
      readCapacity: 5,
      writeCapacity: 5
    });
  }
}
