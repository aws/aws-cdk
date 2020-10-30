import * as cdk from '@aws-cdk/core';
import { AthenaStartQueryExecution, EncryptionOption } from '../../lib/athena/start-query-execution';

describe('Start Query Execution', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new AthenaStartQueryExecution(stack, 'Query', {
      queryString: 'CREATE DATABASE database',
      clientRequestToken: 'unique-client-request-token',
      queryExecutionContext: {
        databaseName: 'mydatabase',
        catalogName: 'AwsDataCatalog',
      },
      resultConfiguration: {
        encryptionConfiguration: { encryptionOption: EncryptionOption.S3_MANAGED },
        outputLocation: 'https://s3.Region.amazonaws.com/bucket-name/key-name',
      },
      workGroup: 'primary',
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::athena:startQueryExecution',
          ],
        ],
      },
      End: true,
      Parameters: {
        QueryString: 'CREATE DATABASE database',
        ClientRequestToken: 'unique-client-request-token',
        QueryExecutionContext: {
          Database: 'mydatabase',
          Catalog: 'AwsDataCatalog',
        },
        ResultConfiguration: {
          EncryptionConfiguration: { EncryptionOption: EncryptionOption.S3_MANAGED },
          OutputLocation: 'https://s3.Region.amazonaws.com/bucket-name/key-name',
        },
        WorkGroup: 'primary',
      },
    });
  });
});