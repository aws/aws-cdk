import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { App } from '@aws-cdk/cdk';
import { GlobalTable } from '../lib';

const app = new App();
new GlobalTable(app, 'globdynamodbinteg', {
  partitionKey: { name: 'hashKey', type: AttributeType.String },
  tableName: 'integrationtest',
  regions: [ "us-east-1", "us-east-2", "us-west-2" ]
});
app.synth();
