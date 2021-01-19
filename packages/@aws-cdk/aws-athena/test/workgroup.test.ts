import '@aws-cdk/assert/jest';
import * as cdkAsserts from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as athena from '../lib';

describe('WorkGroup', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
  });

  test('created simple workgroup', () => {
    // WHEN
    new athena.WorkGroup(stack, 'ExampleWorkGroup', {
      workGroupName: 'awesome',
      description: 'Test WorkGroup',
      tags: {
        key1: 'value1',
        key2: 'value2',
      },
    });

    // THEN
    cdkAsserts.expect(stack).to(cdkAsserts.haveResource('AWS::Athena::WorkGroup', {
      Name: 'awesome',
      Description: 'Test WorkGroup',
      Tags: [
        {
          Key: 'key1',
          Value: 'value1',
        },
        {
          Key: 'key2',
          Value: 'value2',
        },
      ],
    }));
  });

  test('creates workgroup with configuration', () => {
    // WHEN
    new athena.WorkGroup(stack, 'ExampleWorkGroup', {
      workGroupName: 'awesome',
      description: 'Test WorkGroup',
      recursiveDeleteOption: true,
      state: athena.WorkGroupState.ENABLED,
      configuration: {
        requesterPaysEnabled: true,
        publishCloudWatchMetricsEnabled: true,
        enforceWorkGroupConfiguration: true,
        bytesScannedCutoffPerQuery: 1234,
        resultConfigurations: {
          encryptionConfiguration: {
            encryptionOption: athena.EncryptionOption.KMS,
            kmsKey: new kms.Key(stack, 'Key'),
          },
          outputLocation: {
            bucket: new s3.Bucket(stack, 'AthenaBucket', {
              bucketName: 'some-bucket',
            }),
            s3Prefix: 'athena/results/',
          },
        },
      },
    });

    // THEN
    cdkAsserts.expect(stack).to(cdkAsserts.haveResource('AWS::Athena::WorkGroup', {
      Name: 'awesome',
      Description: 'Test WorkGroup',
      RecursiveDeleteOption: true,
      State: 'ENABLED',
      WorkGroupConfiguration: {
        RequesterPaysEnabled: true,
        PublishCloudWatchMetricsEnabled: true,
        EnforceWorkGroupConfiguration: true,
        BytesScannedCutoffPerQuery: 1234,
        ResultConfiguration: {
          EncryptionConfiguration: {
            EncryptionOption: 'SSE_KMS',
            KmsKey: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          OutputLocation: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'AthenaBucketFA1FB7C3',
                },
                '/athena/results/',
              ],
            ],
          },
        },
      },
    }));
  });

  test('creates workgroup with configuration update', () => {
    // WHEN
    new athena.WorkGroup(stack, 'ExampleWorkGroup', {
      workGroupName: 'new-awesome',
      description: 'Updated Test WorkGroup',
      recursiveDeleteOption: false,
      state: athena.WorkGroupState.ENABLED,
      configurationUpdates: {
        requesterPaysEnabled: true,
        publishCloudWatchMetricsEnabled: true,
        enforceWorkGroupConfiguration: false,
        removeBytesScannedCutoffPerQuery: true,
        resultConfigurationUpdates: {
          encryptionConfiguration: {
            encryptionOption: athena.EncryptionOption.S3_MANAGED,
          },
          outputLocation: {
            bucket: new s3.Bucket(stack, 'AthenaBucket', {
              bucketName: 'some-bucket',
            }),
            s3Prefix: 'athena/results/',
          },
        },
      },
    });

    // THEN
    cdkAsserts.expect(stack).to(cdkAsserts.haveResource('AWS::Athena::WorkGroup', {
      Name: 'new-awesome',
      Description: 'Updated Test WorkGroup',
      RecursiveDeleteOption: false,
      State: 'ENABLED',
      WorkGroupConfigurationUpdates: {
        RequesterPaysEnabled: true,
        PublishCloudWatchMetricsEnabled: true,
        EnforceWorkGroupConfiguration: false,
        RemoveBytesScannedCutoffPerQuery: true,
        ResultConfigurationUpdates: {
          EncryptionConfiguration: {
            EncryptionOption: 'SSE_S3',
          },
          OutputLocation: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'AthenaBucketFA1FB7C3',
                },
                '/athena/results/',
              ],
            ],
          },
        },
      },
    }));
  });

  test('WorkGroup.fromWorkGroupAttributes', () => {

    // WHEN
    const workGroup = athena.WorkGroup.fromWorkGroupAttributes(stack, 'ImportedWorkgroup', {
      workgroupName: 'some-workgroup',
      workgroupArn: 'arn:aws:athena:us-west-2:1234567:workgroup/some-workgroup',
    });

    // THEN
    expect(workGroup.workgroupArn).toBe('arn:aws:athena:us-west-2:1234567:workgroup/some-workgroup');
    expect(workGroup.workgroupName).toBe('some-workgroup');
  });


  test('WorkGroup description length must be <= 1024', () => {
    expect(() => {
      new athena.WorkGroup(stack, 'WorkGroup', {
        workGroupName: 'somename',
        description: 'a'.repeat(1025),
      });
    }).toThrow('A WorkGroup description exceeds allowed maximum of 1024');
  });

  test('WorkGroup must have kms key provided when specifying SSE_KMS', () => {
    expect(() => {
      new athena.WorkGroup(stack, 'WorkGroup', {
        workGroupName: 'somename',
        configuration: {
          resultConfigurations: {
            encryptionConfiguration: {
              encryptionOption: athena.EncryptionOption.KMS,
            },
          },
        },
      });
    }).toThrow('SSE_KMS requires providing a kms key');
  });

  test('WorkGroup must have kms key provided when specifying CSE_KMS', () => {
    expect(() => {
      new athena.WorkGroup(stack, 'WorkGroup', {
        workGroupName: 'somename',
        configuration: {
          resultConfigurations: {
            encryptionConfiguration: {
              encryptionOption: athena.EncryptionOption.CLIENT_SIDE_KMS,
            },
          },
        },
      });
    }).toThrow('CSE_KMS requires providing a kms key');
  });

  test('WorkGroup grants FullAccess to a user', () => {
    const workgroup = new athena.WorkGroup(stack, 'ExampleWorkGroup', {
      workGroupName: 'awesome',
      description: 'Test WorkGroup',
    });
    const user = new iam.User(stack, 'User');

    // WHEN
    workgroup.grantFullAccess(user);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'athena:ListEngineVersions',
              'athena:ListWorkGroups',
              'athena:GetExecutionEngine',
              'athena:GetExecutionEngines',
              'athena:GetNamespace',
              'athena:GetCatalogs',
              'athena:GetTables',
              'athena:GetTable',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'athena:StartQueryExecution',
              'athena:GetQueryResults',
              'athena:DeleteNamedQuery',
              'athena:GetNamedQuery',
              'athena:ListQueryExecutions',
              'athena:StopQueryExecution',
              'athena:GetQueryResultsStream',
              'athena:ListNamedQueries',
              'athena:CreateNamedQuery',
              'athena:GetQueryExecution',
              'athena:BatchGetNamedQuery',
              'athena:BatchGetQueryExecution',
              'athena:GetWorkGroup',
              'athena:CreateWorkGroup',
              'athena:GetWorkGroup',
              'athena:DeleteWorkGroup',
              'athena:UpdateWorkGroup',
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
                  ':athena:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':workgroup/awesome',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('WorkGroup grants User access to a user', () => {
    const workgroup = new athena.WorkGroup(stack, 'ExampleWorkGroup', {
      workGroupName: 'awesome',
      description: 'Test WorkGroup',
    });
    const user = new iam.User(stack, 'User');
    // WHEN
    workgroup.grantUserAccess(user);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'athena:ListEngineVersions',
              'athena:ListWorkGroups',
              'athena:GetExecutionEngine',
              'athena:GetExecutionEngines',
              'athena:GetNamespace',
              'athena:GetCatalogs',
              'athena:GetTables',
              'athena:GetTable',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'athena:StartQueryExecution',
              'athena:GetQueryResults',
              'athena:DeleteNamedQuery',
              'athena:GetNamedQuery',
              'athena:ListQueryExecutions',
              'athena:StopQueryExecution',
              'athena:GetQueryResultsStream',
              'athena:ListNamedQueries',
              'athena:CreateNamedQuery',
              'athena:GetQueryExecution',
              'athena:BatchGetNamedQuery',
              'athena:BatchGetQueryExecution',
              'athena:GetWorkGroup',
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
                  ':athena:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':workgroup/awesome',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('WorkGroup grants management access to a user', () => {
    const workgroup = new athena.WorkGroup(stack, 'ExampleWorkGroup', {
      workGroupName: 'awesome',
      description: 'Test WorkGroup',
    });
    const user = new iam.User(stack, 'User');

    // WHEN

    workgroup.grantManagementAccess(user);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'athena:ListEngineVersions',
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'athena:CreateWorkGroup',
              'athena:GetWorkGroup',
              'athena:DeleteWorkGroup',
              'athena:UpdateWorkGroup',
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
                  ':athena:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':workgroup/awesome',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('WorkGroup name can contain only a-zA-Z0-9._-', () => {
    expect(() => {
      new athena.WorkGroup(stack, 'WorkGroup', {
        workGroupName: 'NotAllowedName!>>>',
      });
    }).toThrow('A WorkGroup must be between 1 and 128 characters, inclusive, and consist of alphanumeric (a-z, A-Z, 0-9) characters and dashes, underscores, dots only.');
  });

  test('WorkGroup name must be between 1 and 128 characters', () => {
    expect(() => {
      new athena.WorkGroup(stack, 'WorkGroup', {
        workGroupName: 'very_long_name'.repeat(100),
      });
    }).toThrow('A WorkGroup must be between 1 and 128 characters, inclusive, and consist of alphanumeric (a-z, A-Z, 0-9) characters and dashes, underscores, dots only.');
  });

});