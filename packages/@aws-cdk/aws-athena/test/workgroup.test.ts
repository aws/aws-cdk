import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as athena from '../lib';


describe('Workgroup', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
  });

  describe('fromWorkGroupAttributes', () => {
    test('with attributes', () => {
      // WHEN
      const workGroup = athena.WorkGroup.fromWorkGroupAttributes(stack, 'ImportedWorkgroup', {
        workgroupName: 'some-workgroup',
        workgroupArn: 'arn:aws:athena:us-west-2:1234567:workgroup/some-workgroup',
      });

      expect(workGroup.workgroupArn).toBe('arn:aws:athena:us-west-2:1234567:workgroup/some-workgroup');
      expect(workGroup.workgroupName).toBe('some-workgroup');
      expect(workGroup.creationTime).toBe(undefined);
    });
  });

  describe('new', () => {
    test('should create a simple workgroup', () => {
      const workGroup = new athena.WorkGroup(stack, 'ExampleWorkGroup', {
        workGroupName: 'awesome',
        description: 'Test WorkGroup',
        tags: {
          key1: 'value1',
          key2: 'value2',
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Athena::WorkGroup', {
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
      });
      expect(stack.resolve(workGroup.workgroupArn)).toEqual(
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':athena:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':workgroup/awesome']] },
      );
      expect(stack.resolve(workGroup.workgroupName)).toEqual('awesome');
      expect(stack.resolve(workGroup.creationTime)).toEqual({ 'Fn::GetAtt': ['ExampleWorkGroupF52E7585', 'CreationTime'] });
    });

    test('should create a simple workgroup with new Engine version', () => {
      new athena.WorkGroup(stack, 'ExampleWorkGroup', {
        workGroupName: 'awesome',
        description: 'Test WorkGroup',
        configuration: {
          engineVersion: athena.EngineVersion.of('New version'),
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Athena::WorkGroup', {
        Name: 'awesome',
        Description: 'Test WorkGroup',
        WorkGroupConfiguration: {
          EngineVersion: {
            SelectedEngineVersion: 'New version',
          },
        },
      });
    });

    test('should create a workgroup with configuration', () => {
      new athena.WorkGroup(stack, 'ExampleWorkGroup', {
        workGroupName: 'awesome',
        description: 'Test WorkGroup',
        recursiveDeleteOption: true,
        state: athena.WorkGroupState.ENABLED,
        configuration: {
          engineVersion: athena.EngineVersion.V_3,
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
      Template.fromStack(stack).hasResourceProperties('AWS::Athena::WorkGroup', {
        Name: 'awesome',
        Description: 'Test WorkGroup',
        RecursiveDeleteOption: true,
        State: 'ENABLED',
        WorkGroupConfiguration: {
          RequesterPaysEnabled: true,
          PublishCloudWatchMetricsEnabled: true,
          EnforceWorkGroupConfiguration: true,
          BytesScannedCutoffPerQuery: 1234,
          EngineVersion: {
            SelectedEngineVersion: 'Athena engine version 3',
          },
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
      });
    });
    test('description length must be <= 1024', () => {
      expect(() => {
        new athena.WorkGroup(stack, 'WorkGroup', {
          workGroupName: 'somename',
          description: 'a'.repeat(1025),
        });
      }).toThrow('A WorkGroup description exceeds allowed maximum of 1024');
    });

    test('must have kms key provided when specifying SSE_KMS', () => {
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

    test('must have kms key provided when specifying CSE_KMS', () => {
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
  });

  describe('grant', () => {
    let workgroup: athena.WorkGroup;
    let user: iam.IUser;
    beforeEach(() => {
      workgroup = new athena.WorkGroup(stack, 'ExampleWorkGroup', {
        workGroupName: 'awesome',
        description: 'Test WorkGroup',
      });
      user = new iam.User(stack, 'User');
    });
    test('should grant full access', () => {
      workgroup.grantFullAccess(user);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    test('should grant user access', () => {
      workgroup.grantUserAccess(user);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    test('should grant management access', () => {
      workgroup.grantManagementAccess(user);
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
  });
});
