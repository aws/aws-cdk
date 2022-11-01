import { Template, Match } from '@aws-cdk/assertions';
import * as sfn from '@aws-cdk/aws-stepfunctions';
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
        outputLocation: {
          bucketName: 'query-results-bucket',
          objectKey: 'folder',
        },
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
          OutputLocation: 's3://query-results-bucket/folder/',
        },
        WorkGroup: 'primary',
      },
    });
  });

  test('sync integrationPattern', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new AthenaStartQueryExecution(stack, 'Query', {
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      queryString: 'CREATE DATABASE database',
      queryExecutionContext: {
        databaseName: 'mydatabase',
      },
      resultConfiguration: {
        encryptionConfiguration: { encryptionOption: EncryptionOption.S3_MANAGED },
      },
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
            ':states:::athena:startQueryExecution.sync',
          ],
        ],
      },
      End: true,
      Parameters: {
        QueryString: 'CREATE DATABASE database',
        QueryExecutionContext: {
          Database: 'mydatabase',
        },
        ResultConfiguration: {
          EncryptionConfiguration: { EncryptionOption: EncryptionOption.S3_MANAGED },
        },
      },
    });
  });

  test('no encryptionConfiguration', () => {
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
        outputLocation: {
          bucketName: 'query-results-bucket',
          objectKey: 'folder',
        },
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
          OutputLocation: 's3://query-results-bucket/folder/',
        },
        WorkGroup: 'primary',
      },
    });
  });

  test('omit QueryExecutionContext if no catalog or database name provided', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new AthenaStartQueryExecution(stack, 'Query', {
      queryString: 'CREATE DATABASE database',
      clientRequestToken: 'unique-client-request-token',
      resultConfiguration: {
        outputLocation: {
          bucketName: 'query-results-bucket',
          objectKey: 'folder',
        },
      },
    });


    // THEN
    expect(stack.resolve(task.toStateJson())).not.toHaveProperty('Parameters.QueryExecutionContext');
  });

  test('bucket arn is formatted as expected in generated policy', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new AthenaStartQueryExecution(stack, 'Query', {
      queryString: 'CREATE DATABASE database',
      clientRequestToken: 'unique-client-request-token',
      resultConfiguration: {
        outputLocation: {
          bucketName: 'query-results-bucket',
          objectKey: 'folder',
        },
      },
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definition: task,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          {
            Action: [
              's3:AbortMultipartUpload',
              's3:ListBucketMultipartUploads',
              's3:ListMultipartUploadParts',
              's3:PutObject',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':s3:::query-results-bucket/folder',
                ],
              ],
            },
          },
        ]),
      }),
    });
  });
});
