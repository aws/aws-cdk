import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue');

const database = new glue.Database(stack, 'MyDatabase', {
  databaseName: 'my_database',
});

const connection = new glue.Connection(stack, 'MyConnection', {
  connectionName: 'my_connection',
  type: glue.ConnectionType.JDBC,
  properties: {
    JDBC_CONNECTION_URL: 'jdbc:mysql://mysql.example.com:3306',
    USERNAME: 'username',
    PASSWORD: 'password',
  },
});

const columns = [{
  name: 'col1',
  type: glue.Schema.STRING,
}, {
  name: 'col2',
  type: glue.Schema.STRING,
  comment: 'col2 comment',
}, {
  name: 'col3',
  type: glue.Schema.array(glue.Schema.STRING),
}, {
  name: 'col4',
  type: glue.Schema.map(glue.Schema.STRING, glue.Schema.STRING),
}, {
  name: 'col5',
  type: glue.Schema.struct([{
    name: 'col1',
    type: glue.Schema.STRING,
  }]),
}];

new glue.ExternalTable(stack, 'MyTableWithCustomLocation', {
  database,
  connection,
  tableName: 'custom_location_table',
  columns,
  dataFormat: glue.DataFormat.JSON,
  externalDataLocation: 'default_db.public.test',
});

new integ.IntegTest(app, 'aws-cdk-glue-table-integ', {
  testCases: [stack],
});

app.synth();
