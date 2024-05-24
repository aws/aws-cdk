import { ResourceChangeDetail } from '@aws-sdk/client-cloudformation';
import * as utils from './util';
import { PropertyDifference, ResourceDifference, ResourceImpact, DifferenceCollection, Resource, ChangeSetResource, fullDiff } from '../lib';
import { TemplateAndChangeSetDiffMerger } from '../lib/diff/template-and-changeset-diff-merger';

describe('fullDiff tests that include changeset', () => {
  test('changeset overrides spec replacements', () => {
    // GIVEN
    const currentTemplate = {
      Parameters: {
        BucketName: {
          Type: 'String',
        },
      },
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: 'Name1' }, // Immutable prop
        },
      },
    };
    const newTemplate = {
      Parameters: {
        BucketName: {
          Type: 'String',
        },
      },
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: { Ref: 'BucketName' } }, // No change
        },
      },
    };

    // WHEN
    const differences = fullDiff(currentTemplate, newTemplate, {
      Parameters: [
        {
          ParameterKey: 'BucketName',
          ParameterValue: 'Name1',
        },
      ],
      Changes: [],
    });

    // THEN
    expect(differences.differenceCount).toBe(0);
  });

  test('changeset replacements are respected', () => {
    // GIVEN
    const currentTemplate = {
      Parameters: {
        BucketName: {
          Type: 'String',
        },
      },
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: 'Name1' }, // Immutable prop
        },
      },
    };
    const newTemplate = {
      Parameters: {
        BucketName: {
          Type: 'String',
        },
      },
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: { Ref: 'BucketName' } }, // 'Name1' -> 'Name2'
        },
      },
    };

    // WHEN
    const differences = fullDiff(currentTemplate, newTemplate, {
      Parameters: [
        {
          ParameterKey: 'BucketName',
          ParameterValue: 'Name2',
        },
      ],
      Changes: [
        {
          Type: 'Resource',
          ResourceChange: {
            Action: 'Modify',
            LogicalResourceId: 'Bucket',
            ResourceType: 'AWS::S3::Bucket',
            Replacement: 'True',
            Details: [
              {
                Target: {
                  Attribute: 'Properties',
                  Name: 'BucketName',
                  RequiresRecreation: 'Always',
                },
                Evaluation: 'Static',
                ChangeSource: 'DirectModification',
              },
            ],
          },
        },
      ],
    });

    // THEN
    expect(differences.differenceCount).toBe(1);
  });

  // This is directly in-line with changeset behavior,
  // see 'Replacement': https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ResourceChange.html
  test('dynamic changeset replacements are considered conditional replacements', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        Instance: {
          Type: 'AWS::EC2::Instance',
          Properties: {
            ImageId: 'ami-79fd7eee',
            KeyName: 'rsa-is-fun',
          },
        },
      },
    };

    const newTemplate = {
      Resources: {
        Instance: {
          Type: 'AWS::EC2::Instance',
          Properties: {
            ImageId: 'ami-79fd7eee',
            KeyName: 'but-sha-is-cool',
          },
        },
      },
    };

    // WHEN
    const differences = fullDiff(currentTemplate, newTemplate, {
      Changes: [
        {
          Type: 'Resource',
          ResourceChange: {
            Action: 'Modify',
            LogicalResourceId: 'Instance',
            ResourceType: 'AWS::EC2::Instance',
            Replacement: 'Conditional',
            Details: [
              {
                Target: {
                  Attribute: 'Properties',
                  Name: 'KeyName',
                  RequiresRecreation: 'Always',
                },
                Evaluation: 'Dynamic',
                ChangeSource: 'DirectModification',
              },
            ],
          },
        },
      ],
    });

    // THEN
    expect(differences.differenceCount).toBe(1);
    expect(differences.resources.changes.Instance.changeImpact).toEqual(ResourceImpact.MAY_REPLACE);
    expect(differences.resources.changes.Instance.propertyUpdates).toEqual({
      KeyName: {
        changeImpact: ResourceImpact.MAY_REPLACE,
        isDifferent: true,
        oldValue: 'rsa-is-fun',
        newValue: 'but-sha-is-cool',
      },
    });
  });

  test('changeset resource replacement is not tracked through references', () => {
    // GIVEN
    const currentTemplate = {
      Parameters: {
        BucketName: {
          Type: 'String',
        },
      },
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: 'Name1' }, // Immutable prop
        },
        Queue: {
          Type: 'AWS::SQS::Queue',
          Properties: { QueueName: { Ref: 'Bucket' } }, // Immutable prop
        },
        Topic: {
          Type: 'AWS::SNS::Topic',
          Properties: { TopicName: { Ref: 'Queue' } }, // Immutable prop
        },
      },
    };

    // WHEN
    const newTemplate = {
      Parameters: {
        BucketName: {
          Type: 'String',
        },
      },
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: { Ref: 'BucketName' } },
        },
        Queue: {
          Type: 'AWS::SQS::Queue',
          Properties: { QueueName: { Ref: 'Bucket' } },
        },
        Topic: {
          Type: 'AWS::SNS::Topic',
          Properties: { TopicName: { Ref: 'Queue' } },
        },
      },
    };
    const differences = fullDiff(currentTemplate, newTemplate, {
      Parameters: [
        {
          ParameterKey: 'BucketName',
          ParameterValue: 'Name1',
        },
      ],
      Changes: [
        {
          Type: 'Resource',
          ResourceChange: {
            Action: 'Modify',
            LogicalResourceId: 'Bucket',
            ResourceType: 'AWS::S3::Bucket',
            Replacement: 'False',
            Details: [],
          },
        },
      ],
    });

    // THEN
    expect(differences.resources.differenceCount).toBe(0);
  });

  test('Fn::GetAtt short form and long form are equivalent', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: 'BucketName' },
        },
      },
      Outputs: {
        BucketArnOneWay: { 'Fn::GetAtt': ['BucketName', 'Arn'] },
        BucketArnAnotherWay: { 'Fn::GetAtt': 'BucketName.Arn' },
      },
    };
    const newTemplate = {
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: 'BucketName' },
        },
      },
      Outputs: {
        BucketArnOneWay: { 'Fn::GetAtt': 'BucketName.Arn' },
        BucketArnAnotherWay: { 'Fn::GetAtt': ['BucketName', 'Arn'] },
      },
    };

    // WHEN
    const differences = fullDiff(currentTemplate, newTemplate);

    // THEN
    expect(differences.differenceCount).toBe(0);
  });

  test('metadata changes are obscured from the diff', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          BucketName: 'magic-bucket',
          Metadata: {
            'aws:cdk:path': '/foo/BucketResource',
          },
        },
      },
    };

    // WHEN
    const newTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          BucketName: 'magic-bucket',
          Metadata: {
            'aws:cdk:path': '/bar/BucketResource',
          },
        },
      },
    };

    // THEN
    let differences = fullDiff(currentTemplate, newTemplate, {});
    expect(differences.differenceCount).toBe(0);
  });

  test('single element arrays are equivalent to the single element in DependsOn expressions', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          DependsOn: ['SomeResource'],
        },
      },
    };

    // WHEN
    const newTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          DependsOn: 'SomeResource',
        },
      },
    };

    let differences = fullDiff(currentTemplate, newTemplate, {});
    expect(differences.resources.differenceCount).toBe(0);

    differences = fullDiff(newTemplate, currentTemplate, {});
    expect(differences.resources.differenceCount).toBe(0);
  });

  test('array equivalence is independent of element order in DependsOn expressions', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          DependsOn: ['SomeResource', 'AnotherResource'],
        },
      },
    };

    // WHEN
    const newTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          DependsOn: ['AnotherResource', 'SomeResource'],
        },
      },
    };

    let differences = fullDiff(currentTemplate, newTemplate, {});
    expect(differences.resources.differenceCount).toBe(0);

    differences = fullDiff(newTemplate, currentTemplate, {});
    expect(differences.resources.differenceCount).toBe(0);
  });

  test('arrays of different length are considered unequal in DependsOn expressions', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          DependsOn: ['SomeResource', 'AnotherResource', 'LastResource'],
        },
      },
    };

    // WHEN
    const newTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          DependsOn: ['AnotherResource', 'SomeResource'],
        },
      },
    };

    // dependsOn changes do not appear in the changeset
    let differences = fullDiff(currentTemplate, newTemplate, {});
    expect(differences.resources.differenceCount).toBe(1);

    differences = fullDiff(newTemplate, currentTemplate, {});
    expect(differences.resources.differenceCount).toBe(1);
  });

  test('arrays that differ only in element order are considered unequal outside of DependsOn expressions', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          BucketName: { 'Fn::Select': [0, ['name1', 'name2']] },
        },
      },
    };

    // WHEN
    const newTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
          BucketName: { 'Fn::Select': [0, ['name2', 'name1']] },
        },
      },
    };

    let differences = fullDiff(currentTemplate, newTemplate, {
      Changes: [
        {
          Type: 'Resource',
          ResourceChange: {
            Action: 'Modify',
            LogicalResourceId: 'BucketResource',
            ResourceType: 'AWS::S3::Bucket',
            Replacement: 'True',
            Details: [{
              Evaluation: 'Static',
              Target: {
                Attribute: 'Properties',
                Name: 'BucketName',
                RequiresRecreation: 'Always',
              },
            }],
          },
        },
      ],
    });
    expect(differences.resources.differenceCount).toBe(1);
  });

  test('SAM Resources are rendered with changeset diffs', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        ServerlessFunction: {
          Type: 'AWS::Serverless::Function',
          Properties: {
            CodeUri: 's3://bermuda-triangle-1337-bucket/old-handler.zip',
          },
        },
      },
    };

    // WHEN
    const newTemplate = {
      Resources: {
        ServerlessFunction: {
          Type: 'AWS::Serverless::Function',
          Properties: {
            CodeUri: 's3://bermuda-triangle-1337-bucket/new-handler.zip',
          },
        },
      },
    };

    let differences = fullDiff(currentTemplate, newTemplate, {
      Changes: [
        {
          Type: 'Resource',
          ResourceChange: {
            Action: 'Modify',
            LogicalResourceId: 'ServerlessFunction',
            ResourceType: 'AWS::Lambda::Function', // The SAM transform is applied before the changeset is created, so the changeset has a Lambda resource here!
            Replacement: 'False',
            Details: [{
              Evaluation: 'Static',
              Target: {
                Attribute: 'Properties',
                Name: 'Code',
                RequiresRecreation: 'Never',
              },
            }],
          },
        },
      ],
    });
    expect(differences.resources.differenceCount).toBe(1);
  });

  test('imports are respected for new stacks', async () => {
    // GIVEN
    const currentTemplate = {};

    // WHEN
    const newTemplate = {
      Resources: {
        BucketResource: {
          Type: 'AWS::S3::Bucket',
        },
      },
    };

    let differences = fullDiff(currentTemplate, newTemplate, {
      Changes: [
        {
          Type: 'Resource',
          ResourceChange: {
            Action: 'Import',
            LogicalResourceId: 'BucketResource',
          },
        },
      ],
    });
    expect(differences.resources.differenceCount).toBe(1);
    expect(differences.resources.get('BucketResource')?.changeImpact === ResourceImpact.WILL_IMPORT);
  });

  test('imports are respected for existing stacks', async () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        OldResource: {
          Type: 'AWS::Something::Resource',
        },
      },
    };

    // WHEN
    const newTemplate = {
      Resources: {
        OldResource: {
          Type: 'AWS::Something::Resource',
        },
        BucketResource: {
          Type: 'AWS::S3::Bucket',
        },
      },
    };

    let differences = fullDiff(currentTemplate, newTemplate, {
      Changes: [
        {
          Type: 'Resource',
          ResourceChange: {
            Action: 'Import',
            LogicalResourceId: 'BucketResource',
          },
        },
      ],
    });
    expect(differences.resources.differenceCount).toBe(1);
    expect(differences.resources.get('BucketResource')?.changeImpact === ResourceImpact.WILL_IMPORT);
  });

  test('properties that only show up in changeset diff are included in fullDiff', () => {
  // GIVEN
    const currentTemplate = {
      Parameters: {
        SsmParameterValuetestbugreportC9: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'goodJob',
        },
      },
      Resources: {
        mySsmParameter: utils.ssmParam,
      },
    };

    // WHEN
    const diffWithoutChangeSet = fullDiff(currentTemplate, currentTemplate);
    const diffWithChangeSet = fullDiff(currentTemplate, currentTemplate,
      { Changes: [utils.ssmParamFromChangeset] },
    );

    // THEN
    expect(diffWithoutChangeSet.differenceCount).toBe(0);
    expect(diffWithoutChangeSet.resources.changes).toEqual({});

    expect(diffWithChangeSet.differenceCount).toBe(1);
    expect(diffWithChangeSet.resources.changes.mySsmParameter).toEqual(
      {
        oldValue: {
          Type: 'AWS::SSM::Parameter',
          Properties: {
            Value: 'changedddd',
            Type: 'String',
            Name: 'mySsmParameterFromStack',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
          },
        },
        newValue: {
          Type: 'AWS::SSM::Parameter',
          Properties: {
            Value: 'sdflkja',
            Type: 'String',
            Name: 'mySsmParameterFromStack',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
          },
        },
        resourceTypes: {
          oldType: 'AWS::SSM::Parameter',
          newType: 'AWS::SSM::Parameter',
        },
        propertyDiffs: {
          Value: {
            oldValue: 'changedddd',
            newValue: 'sdflkja',
            isDifferent: true,
            changeImpact: 'WILL_UPDATE',
          },
          Type: {
            oldValue: 'String',
            newValue: 'String',
            isDifferent: false,
            changeImpact: 'NO_CHANGE',
          },
          Name: {
            oldValue: 'mySsmParameterFromStack',
            newValue: 'mySsmParameterFromStack',
            isDifferent: false,
            changeImpact: 'NO_CHANGE',
          },
        },
        otherDiffs: {
          Type: {
            oldValue: 'AWS::SSM::Parameter',
            newValue: 'AWS::SSM::Parameter',
            isDifferent: false,
          },
          Metadata: {
            oldValue: {
              'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
            },
            newValue: {
              'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
            },
            isDifferent: false,
          },
        },
        isAddition: false,
        isRemoval: false,
        isImport: undefined,
      },
    );

    expect(diffWithChangeSet.resources.changes.mySsmParameter.isUpdate).toEqual(true);
  });

  test('resources that only show up in changeset diff are included in fullDiff', () => {
  // GIVEN
    const currentTemplate = {
      Parameters: {
        SsmParameterValuetestbugreportC9: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'goodJob',
        },
      },
      Resources: {
        Queue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: {
              Ref: 'SsmParameterValuetestbugreportC9',
            },
          },
        },
      },
    };

    // WHEN
    const diffWithoutChangeSet = fullDiff(currentTemplate, currentTemplate);
    const diffWithChangeSet = fullDiff(currentTemplate, currentTemplate,
      {
        Changes: [
          utils.queueFromChangeset({}),
        ],
        Parameters: [{
          ParameterKey: 'SsmParameterValuetestbugreportC9',
          ParameterValue: 'goodJob',
          ResolvedValue: 'changedVal',
        }],
      },
    );

    // THEN
    expect(diffWithoutChangeSet.differenceCount).toBe(0);
    expect(diffWithoutChangeSet.resources.changes).toEqual({});

    expect(diffWithChangeSet.differenceCount).toBe(1);
    expect(diffWithChangeSet.resources.changes.Queue).toEqual(
      {
        oldValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'newValuechangedddd',
            ReceiveMessageWaitTimeSeconds: '20',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        newValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'newValuesdflkja',
            ReceiveMessageWaitTimeSeconds: '20',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        resourceTypes: {
          oldType: 'AWS::SQS::Queue',
          newType: 'AWS::SQS::Queue',
        },
        propertyDiffs: {
          QueueName: {
            oldValue: 'newValuechangedddd',
            newValue: 'newValuesdflkja',
            isDifferent: true,
            changeImpact: 'WILL_REPLACE',
          },
          ReceiveMessageWaitTimeSeconds: {
            oldValue: '20',
            newValue: '20',
            isDifferent: false,
            changeImpact: 'NO_CHANGE',
          },
        },
        otherDiffs: {
          Type: {
            oldValue: 'AWS::SQS::Queue',
            newValue: 'AWS::SQS::Queue',
            isDifferent: false,
          },
          Metadata: {
            oldValue: {
              'aws:cdk:path': 'cdkbugreport/Queue/Resource',
            },
            newValue: {
              'aws:cdk:path': 'cdkbugreport/Queue/Resource',
            },
            isDifferent: false,
          },
          UpdateReplacePolicy: {
            oldValue: 'Delete',
            newValue: 'Delete',
            isDifferent: false,
          },
          DeletionPolicy: {
            oldValue: 'Delete',
            newValue: 'Delete',
            isDifferent: false,
          },
        },
        isAddition: false,
        isRemoval: false,
        isImport: undefined,
      },
    );

    expect(diffWithChangeSet.resources.changes.Queue.isUpdate).toEqual(true);
  });

  test('changeSet diff properties override the TemplateDiff properties', () => {

    // GIVEN
    const currentTemplate = {
      Parameters: {
        SsmParameterValuetestbugreportC9: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'goodJob',
        },
      },
      Resources: {
        Queue: utils.sqsQueueWithArgs({ waitTime: 10, queueName: 'hi' }),
      },
    };

    const newTemplate = {
      Parameters: {
        SsmParameterValuetestbugreportC9: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'goodJob',
        },
      },
      Resources: {
        Queue: utils.sqsQueueWithArgs({ waitTime: 10, queueName: 'bye' }),
      },
    };

    // WHEN
    const diffWithoutChangeSet = fullDiff(currentTemplate, newTemplate);
    const diffWithChangeSet = fullDiff(currentTemplate, newTemplate,
      {
        Changes: [utils.queueFromChangeset({ beforeContextWaitTime: '10', afterContextWaitTime: '20' })],
        Parameters: [{
          ParameterKey: 'SsmParameterValuetestbugreportC9',
          ParameterValue: 'goodJob',
          ResolvedValue: 'changedddd',
        }],
      },
    );

    // THEN
    expect(diffWithoutChangeSet.differenceCount).toBe(1);
    expect(diffWithoutChangeSet.resources.changes).toEqual(
      {
        Queue: {
          oldValue: utils.sqsQueueWithArgs({ waitTime: 10, queueName: 'hi' }),
          newValue: utils.sqsQueueWithArgs({ waitTime: 10, queueName: 'bye' }),
          resourceTypes: {
            oldType: 'AWS::SQS::Queue',
            newType: 'AWS::SQS::Queue',
          },
          propertyDiffs: {
            QueueName: {
              oldValue: {
                Ref: 'hi',
              },
              newValue: {
                Ref: 'bye',
              },
              isDifferent: true,
              changeImpact: 'WILL_REPLACE',
            },
            ReceiveMessageWaitTimeSeconds: {
              oldValue: 10,
              newValue: 10,
              isDifferent: false,
              changeImpact: 'NO_CHANGE',
            },
          },
          otherDiffs: {
            Type: {
              oldValue: 'AWS::SQS::Queue',
              newValue: 'AWS::SQS::Queue',
              isDifferent: false,
            },
          },
          isAddition: false,
          isRemoval: false,
          isImport: undefined,
        },
      },
    );

    expect(diffWithChangeSet.differenceCount).toBe(1); // this is the count of how many resources have changed
    expect(diffWithChangeSet.resources.changes.Queue).toEqual(
      {
        oldValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'newValuechangedddd',
            ReceiveMessageWaitTimeSeconds: '10',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        newValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'newValuesdflkja',
            ReceiveMessageWaitTimeSeconds: '20',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        resourceTypes: {
          oldType: 'AWS::SQS::Queue',
          newType: 'AWS::SQS::Queue',
        },
        propertyDiffs: {
          QueueName: {
            oldValue: 'newValuechangedddd',
            newValue: 'newValuesdflkja',
            isDifferent: true,
            changeImpact: 'WILL_REPLACE',
          },
          ReceiveMessageWaitTimeSeconds: {
            oldValue: '10',
            newValue: '20',
            isDifferent: true,
            changeImpact: 'WILL_UPDATE',
          },
        },
        otherDiffs: {
          Type: {
            oldValue: 'AWS::SQS::Queue',
            newValue: 'AWS::SQS::Queue',
            isDifferent: false,
          },
          Metadata: {
            oldValue: {
              'aws:cdk:path': 'cdkbugreport/Queue/Resource',
            },
            newValue: {
              'aws:cdk:path': 'cdkbugreport/Queue/Resource',
            },
            isDifferent: false,
          },
          UpdateReplacePolicy: {
            oldValue: 'Delete',
            newValue: 'Delete',
            isDifferent: false,
          },
          DeletionPolicy: {
            oldValue: 'Delete',
            newValue: 'Delete',
            isDifferent: false,
          },
        },
        isAddition: false,
        isRemoval: false,
        isImport: undefined,
      },
    );
  });

  test('IamChanges that are visible only through changeset are added to TemplatedDiff.iamChanges', () => {
    // GIVEN
    const currentTemplate = {};

    // WHEN
    const diffWithChangeSet = fullDiff(currentTemplate, currentTemplate, utils.changeSetWithIamChanges);

    // THEN
    expect(diffWithChangeSet.iamChanges.statements.additions).toEqual([{
      sid: undefined,
      effect: 'Allow',
      resources: {
        values: [
          'arn:aws:sqs:us-east-1:012345678901:newAndDifferent',
        ],
        not: false,
      },
      actions: {
        values: [
          'sqs:DeleteMessage',
          'sqs:GetQueueAttributes',
          'sqs:ReceiveMessage',
          'sqs:SendMessage',
        ],
        not: false,
      },
      principals: {
        values: [
          'AWS:{{changeSet:KNOWN_AFTER_APPLY}}',
        ],
        not: false,
      },
      condition: undefined,
      serializedIntrinsic: undefined,
    }]);

    expect(diffWithChangeSet.iamChanges.statements.removals).toEqual([{
      sid: undefined,
      effect: 'Allow',
      resources: {
        values: [
          'arn:aws:sqs:us-east-1:012345678901:sdflkja',
        ],
        not: false,
      },
      actions: {
        values: [
          'sqs:DeleteMessage',
          'sqs:GetQueueAttributes',
          'sqs:ReceiveMessage',
          'sqs:SendMessage',
        ],
        not: false,
      },
      principals: {
        values: [
          'AWS:sdflkja',
        ],
        not: false,
      },
      condition: undefined,
      serializedIntrinsic: undefined,
    }]);

  });

  test('works with values defined before but not after (coming from changeset)', async () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        Queue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'nice',
            DelaySeconds: '10',
          },
        },
      },
    };

    const changeSet = {
      Changes: [
        {
          Type: 'Resource',
          ResourceChange: {
            Action: 'Modify',
            LogicalResourceId: 'Queue',
            ResourceType: 'AWS::SQS::Queue',
            Replacement: 'False',
            Scope: ['Properties'],
            Details: [
              { Target: { Attribute: 'Properties', Name: 'DelaySeconds', RequiresRecreation: 'Never' } },
            ],
          },
        },
      ],
    };

    // WHEN
    const diff = fullDiff(currentTemplate, currentTemplate, changeSet as any);
    expect(diff.resources.changes.Queue).toEqual({
      oldValue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          DelaySeconds: '10',
        },
      },
      newValue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          DelaySeconds: 'value_after_change_is_not_viewable',
        },
      },
      resourceTypes: {
        oldType: 'AWS::SQS::Queue',
        newType: 'AWS::SQS::Queue',
      },
      propertyDiffs: {
        DelaySeconds: {
          oldValue: '10',
          newValue: 'value_after_change_is_not_viewable',
          isDifferent: true,
          changeImpact: 'WILL_UPDATE',
        },
      },
      otherDiffs: {
        Type: {
          oldValue: 'AWS::SQS::Queue',
          newValue: 'AWS::SQS::Queue',
          isDifferent: false,
        },
      },
      isAddition: false,
      isRemoval: false,
      isImport: undefined,
    });

  });

});

describe('method tests', () => {

  describe('TemplateAndChangeSetDiffMerger constructor', () => {

    test('InspectChangeSet correctly parses changeset', async () => {
    // WHEN
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: utils.changeSet });

      // THEN
      expect(Object.keys(templateAndChangeSetDiffMerger.changeSetResources ?? {}).length).toBe(2);
      expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).Queue).toEqual({
        resourceWasReplaced: true,
        resourceType: 'AWS::SQS::Queue',
        propertyReplacementModes: {
          ReceiveMessageWaitTimeSeconds: {
            replacementMode: 'Never',
          },
          QueueName: {
            replacementMode: 'Always',
          },
        },
        beforeContext: {
          Properties: {
            QueueName: 'newValuechangedddd',
            ReceiveMessageWaitTimeSeconds: '20',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        afterContext: {
          Properties: {
            QueueName: 'newValuesdflkja',
            ReceiveMessageWaitTimeSeconds: '20',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      });
      expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).mySsmParameter).toEqual({
        resourceWasReplaced: false,
        resourceType: 'AWS::SSM::Parameter',
        propertyReplacementModes: {
          Value: {
            replacementMode: 'Never',
          },
        },
        beforeContext: {
          Properties: {
            Value: 'changedddd',
            Type: 'String',
            Name: 'mySsmParameterFromStack',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
          },
        },
        afterContext: {
          Properties: {
            Value: 'sdflkja',
            Type: 'String',
            Name: 'mySsmParameterFromStack',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
          },
        },
      });
    });

    test('TemplateAndChangeSetDiffMerger constructor can handle undefined changeset', async () => {
    // WHEN
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: {} });

      // THEN
      expect(templateAndChangeSetDiffMerger.changeSetResources).toEqual({});
      expect(templateAndChangeSetDiffMerger.changeSet).toEqual({});
    });

    test('TemplateAndChangeSetDiffMerger constructor can handle undefined changes in changset.Changes', async () => {
    // WHEN
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: utils.changeSetWithMissingChanges });

      // THEN
      expect(templateAndChangeSetDiffMerger.changeSetResources).toEqual({});
      expect(templateAndChangeSetDiffMerger.changeSet).toEqual(utils.changeSetWithMissingChanges);
    });

    test('TemplateAndChangeSetDiffMerger constructor can handle partially defined changes in changset.Changes', async () => {
      // WHEN
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: utils.changeSetWithPartiallyFilledChanges });

      // THEN
      expect(templateAndChangeSetDiffMerger.changeSet).toEqual(utils.changeSetWithPartiallyFilledChanges);
      expect(Object.keys(templateAndChangeSetDiffMerger.changeSetResources ?? {}).length).toBe(2);
      expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).mySsmParameter).toEqual( {
        resourceWasReplaced: false,
        resourceType: 'UNKNOWN_RESOURCE_TYPE',
        propertyReplacementModes: {
          Value: {
            replacementMode: 'Never',
          },
        },
        beforeContext: {
          Properties: {
            Value: 'changedddd',
            Type: 'String',
            Name: 'mySsmParameterFromStack',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
          },
        },
        afterContext: {
          Properties: {
            Value: 'sdflkja',
            Type: 'String',
            Name: 'mySsmParameterFromStack',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
          },
        },
      });
      expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).Queue).toEqual({
        resourceWasReplaced: true,
        resourceType: 'UNKNOWN_RESOURCE_TYPE',
        propertyReplacementModes: {
          QueueName: {
            replacementMode: 'Always',
          },
        },
        beforeContext: {
          Properties: {
            QueueName: undefined,
            ReceiveMessageWaitTimeSeconds: '20',
            Random: 'nice',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        afterContext: {
          Properties: {
            QueueName: undefined,
            ReceiveMessageWaitTimeSeconds: '20',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      });
    });

    test('TemplateAndChangeSetDiffMerger constructor can handle undefined Details in changset.Changes', async () => {
    // WHEN
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: utils.changeSetWithUndefinedDetails });

      // THEN
      expect(templateAndChangeSetDiffMerger.changeSet).toEqual(utils.changeSetWithUndefinedDetails);
      expect(Object.keys(templateAndChangeSetDiffMerger.changeSetResources ?? {}).length).toBe(1);
      expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).Queue).toEqual({
        resourceWasReplaced: true,
        resourceType: 'UNKNOWN_RESOURCE_TYPE',
        propertyReplacementModes: {},
        beforeContext: undefined,
        afterContext: undefined,
      });
    });

  });

  describe('determineChangeSetReplacementMode ', () => {
    test('can evaluate missing Target', async () => {
    // GIVEN
      const propertyChangeWithMissingTarget = {
        Target: undefined,
      };

      // WHEN
      const replacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithMissingTarget);

      // THEN
      expect(replacementMode).toEqual('Conditionally');
    });

    test('can evaluate missing RequiresRecreation', async () => {
    // GIVEN
      const propertyChangeWithMissingTargetDetail = {
        Target: { RequiresRecreation: undefined },
      };

      // WHEN
      const replacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithMissingTargetDetail);

      // THEN
      expect(replacementMode).toEqual('Conditionally');
    });

    test('can evaluate Always and Static', async () => {
    // GIVEN
      const propertyChangeWithAlwaysStatic: ResourceChangeDetail = {
        Target: { RequiresRecreation: 'Always' },
        Evaluation: 'Static',
      };

      // WHEN
      const replacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithAlwaysStatic);

      // THEN
      expect(replacementMode).toEqual('Always');
    });

    test('can evaluate always dynamic', async () => {
    // GIVEN
      const propertyChangeWithAlwaysDynamic: ResourceChangeDetail = {
        Target: { RequiresRecreation: 'Always' },
        Evaluation: 'Dynamic',
      };

      // WHEN
      const replacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithAlwaysDynamic);

      // THEN
      expect(replacementMode).toEqual('Conditionally');
    });

    test('missing Evaluation', async () => {
    // GIVEN
      const propertyChangeWithMissingEvaluation: ResourceChangeDetail = {
        Target: { RequiresRecreation: 'Always' },
        Evaluation: undefined,
      };

      // WHEN
      const replacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithMissingEvaluation);

      // THEN
      expect(replacementMode).toEqual('Always');
    });

  });

  describe('overrideDiffResourcesWithChangeSetResources', () => {

    test('can add resources from changeset', async () => {
    // GIVEN
      const resources = new DifferenceCollection<Resource, ResourceDifference>({});
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: utils.changeSet });

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourcesWithChangeSetResources(resources, {});

      // THEN
      expect(resources.differenceCount).toBe(2);
      expect(resources.changes.mySsmParameter.isUpdate).toBe(true);
      expect(resources.changes.mySsmParameter).toEqual({
        oldValue: {
          Type: 'AWS::SSM::Parameter',
          Properties: {
            Value: 'changedddd',
            Type: 'String',
            Name: 'mySsmParameterFromStack',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
          },
        },
        newValue: {
          Type: 'AWS::SSM::Parameter',
          Properties: {
            Value: 'sdflkja',
            Type: 'String',
            Name: 'mySsmParameterFromStack',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
          },
        },
        resourceTypes: {
          oldType: 'AWS::SSM::Parameter',
          newType: 'AWS::SSM::Parameter',
        },
        propertyDiffs: {
          Value: {
            oldValue: 'changedddd',
            newValue: 'sdflkja',
            isDifferent: true,
            changeImpact: 'WILL_UPDATE',
          },
          Type: {
            oldValue: 'String',
            newValue: 'String',
            isDifferent: false,
            changeImpact: 'NO_CHANGE',
          },
          Name: {
            oldValue: 'mySsmParameterFromStack',
            newValue: 'mySsmParameterFromStack',
            isDifferent: false,
            changeImpact: 'NO_CHANGE',
          },
        },
        otherDiffs: {
          Type: {
            oldValue: 'AWS::SSM::Parameter',
            newValue: 'AWS::SSM::Parameter',
            isDifferent: false,
          },
          Metadata: {
            oldValue: {
              'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
            },
            newValue: {
              'aws:cdk:path': 'cdkbugreport/mySsmParameter/Resource',
            },
            isDifferent: false,
          },
        },
        isAddition: false,
        isRemoval: false,
        isImport: undefined,
      });

      expect(resources.changes.Queue.isUpdate).toBe(true);
      expect(resources.changes.Queue).toEqual({
        oldValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'newValuechangedddd',
            ReceiveMessageWaitTimeSeconds: '20',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        newValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'newValuesdflkja',
            ReceiveMessageWaitTimeSeconds: '20',
          },
          Metadata: {
            'aws:cdk:path': 'cdkbugreport/Queue/Resource',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        resourceTypes: {
          oldType: 'AWS::SQS::Queue',
          newType: 'AWS::SQS::Queue',
        },
        propertyDiffs: {
          QueueName: {
            oldValue: 'newValuechangedddd',
            newValue: 'newValuesdflkja',
            isDifferent: true,
            changeImpact: 'WILL_REPLACE',
          },
          ReceiveMessageWaitTimeSeconds: {
            oldValue: '20',
            newValue: '20',
            isDifferent: false,
            changeImpact: 'NO_CHANGE',
          },
        },
        otherDiffs: {
          Type: {
            oldValue: 'AWS::SQS::Queue',
            newValue: 'AWS::SQS::Queue',
            isDifferent: false,
          },
          Metadata: {
            oldValue: {
              'aws:cdk:path': 'cdkbugreport/Queue/Resource',
            },
            newValue: {
              'aws:cdk:path': 'cdkbugreport/Queue/Resource',
            },
            isDifferent: false,
          },
          UpdateReplacePolicy: {
            oldValue: 'Delete',
            newValue: 'Delete',
            isDifferent: false,
          },
          DeletionPolicy: {
            oldValue: 'Delete',
            newValue: 'Delete',
            isDifferent: false,
          },
        },
        isAddition: false,
        isRemoval: false,
        isImport: undefined,
      });
    });

    test('can add resources from empty changeset', async () => {
    // GIVEN
      const resources = new DifferenceCollection<Resource, ResourceDifference>({});
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: utils.changeSetWithMissingChanges });

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourcesWithChangeSetResources(resources, {});

      // THEN
      expect(resources.differenceCount).toBe(0);
      expect(resources.changes).toEqual({});

    });

    test('can add resources from changeset that have undefined resourceType and Details', async () => {
    // GIVEN
      const resources = new DifferenceCollection<Resource, ResourceDifference>({});
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {
            resourceWasReplaced: false,
            resourceType: undefined,
            propertyReplacementModes: {},
            beforeContext: { Properties: { QueueName: 'hi' } },
            afterContext: { Properties: { QueueName: 'bye' } },
          } as ChangeSetResource,
        },
      });

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourcesWithChangeSetResources(resources, {});

      // THEN
      expect(resources.differenceCount).toBe(1);
      expect(resources.changes.Queue).toEqual({
        oldValue: {
          Type: 'UNKNOWN_RESOURCE_TYPE',
          Properties: {
            QueueName: 'hi',
          },
        },
        newValue: {
          Type: 'UNKNOWN_RESOURCE_TYPE',
          Properties: {
            QueueName: 'bye',
          },
        },
        resourceTypes: {
          oldType: 'UNKNOWN_RESOURCE_TYPE',
          newType: 'UNKNOWN_RESOURCE_TYPE',
        },
        propertyDiffs: {
          QueueName: {
            oldValue: 'hi',
            newValue: 'bye',
            isDifferent: true,
            changeImpact: 'NO_CHANGE',
          },
        },
        otherDiffs: {
          Type: {
            oldValue: 'UNKNOWN_RESOURCE_TYPE',
            newValue: 'UNKNOWN_RESOURCE_TYPE',
            isDifferent: false,
          },
        },
        isAddition: false,
        isRemoval: false,
        isImport: undefined,
      });

    });

    test('works without beforeContext and afterContext', async () => {
      // GIVEN
      const resources = new DifferenceCollection<Resource, ResourceDifference>({});
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {
            propertyReplacementModes: {
              QueueName: { replacementMode: 'Always' },
              DelaySeconds: { replacementMode: 'Never' },
            },
            resourceWasReplaced: false,
            resourceType: 'AWS::SQS::Queue',
            beforeContext: undefined,
            afterContext: undefined,
            changeAction: 'Modify',
          } as ChangeSetResource,
        },
      });

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourcesWithChangeSetResources(resources, {});

      // THEN
      expect(resources.differenceCount).toBe(1);
      expect(resources.changes.Queue).toEqual({
        oldValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'value_before_change_is_not_viewable',
            DelaySeconds: 'value_before_change_is_not_viewable',
          },
        },
        newValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'value_after_change_is_not_viewable',
            DelaySeconds: 'value_after_change_is_not_viewable',
          },
        },
        resourceTypes: {
          oldType: 'AWS::SQS::Queue',
          newType: 'AWS::SQS::Queue',
        },
        propertyDiffs: {
          QueueName: {
            oldValue: 'value_before_change_is_not_viewable',
            newValue: 'value_after_change_is_not_viewable',
            isDifferent: true,
            changeImpact: 'WILL_REPLACE',
          },
          DelaySeconds: {
            oldValue: 'value_before_change_is_not_viewable',
            newValue: 'value_after_change_is_not_viewable',
            isDifferent: true,
            changeImpact: 'WILL_UPDATE',
          },
        },
        otherDiffs: {
          Type: {
            oldValue: 'AWS::SQS::Queue',
            newValue: 'AWS::SQS::Queue',
            isDifferent: false,
          },
        },
        isAddition: false,
        isRemoval: false,
        isImport: undefined,
      });

    });

  });

  describe('overrideDiffResourceChangeImpactWithChangeSetChangeImpact', () => {

    test('can handle blank change', async () => {
      // GIVEN
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: {} });
      const queue = new ResourceDifference(undefined, undefined, { resourceType: {}, propertyDiffs: {}, otherDiffs: {} });
      const logicalId = 'Queue';

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.isDifferent).toBe(false);
      expect(queue.changeImpact).toBe('NO_CHANGE');
    });

    test('ignores changes that are not in changeset', async () => {
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {},
      });
      const queue = new ResourceDifference(
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'first' } },
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'second' } },
        {
          resourceType: { oldType: 'AWS::CDK::GREAT', newType: 'AWS::CDK::GREAT' },
          propertyDiffs: { QueueName: new PropertyDifference<string>( 'first', 'second', { changeImpact: ResourceImpact.WILL_UPDATE }) },
          otherDiffs: {},
        },
      );
      const logicalId = 'Queue';

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.isDifferent).toBe(false);
      expect(queue.changeImpact).toBe('NO_CHANGE');
    });

    test('can handle undefined properties', async () => {
    // GIVEN
      const logicalId = 'Queue';

      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {} as any,
        },
      });
      const queue = new ResourceDifference(
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'first' } },
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'second' } },
        {
          resourceType: { oldType: 'AWS::CDK::GREAT', newType: 'AWS::CDK::GREAT' },
          propertyDiffs: { QueueName: new PropertyDifference<string>( 'first', 'second', { changeImpact: ResourceImpact.WILL_UPDATE }) },
          otherDiffs: {},
        },
      );

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.isDifferent).toBe(false);
      expect(queue.changeImpact).toBe('NO_CHANGE');
    });

    test('can handle empty properties', async () => {
    // GIVEN
      const logicalId = 'Queue';

      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {
            propertyReplacementModes: {},
          } as any,
        },
      });
      const queue = new ResourceDifference(
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'first' } },
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'second' } },
        {
          resourceType: { oldType: 'AWS::CDK::GREAT', newType: 'AWS::CDK::GREAT' },
          propertyDiffs: { QueueName: new PropertyDifference<string>( 'first', 'second', { changeImpact: ResourceImpact.WILL_UPDATE }) },
          otherDiffs: {},
        },
      );

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.isDifferent).toBe(false);
      expect(queue.changeImpact).toBe('NO_CHANGE');
    });

    test('can handle property without replacementMode', async () => {
    // GIVEN
      const logicalId = 'Queue';

      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {
            propertyReplacementModes: {
              QueueName: {} as any,
            },
          } as any,
        },
      });
      const queue = new ResourceDifference(
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'first' } },
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'second' } },
        {
          resourceType: { oldType: 'AWS::CDK::GREAT', newType: 'AWS::CDK::GREAT' },
          propertyDiffs: { QueueName: new PropertyDifference<string>( 'first', 'second', { changeImpact: ResourceImpact.WILL_UPDATE }) },
          otherDiffs: {},
        },
      );

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.isDifferent).toBe(false);
      expect(queue.changeImpact).toBe('NO_CHANGE');
    });

    test('handles Never case', async () => {
    // GIVEN
      const logicalId = 'Queue';

      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {
            propertyReplacementModes: {
              QueueName: {
                replacementMode: 'Never',
              },
            },
          } as any,
        },
      });
      const queue = new ResourceDifference(
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'first' } },
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'second' } },
        {
          resourceType: { oldType: 'AWS::CDK::GREAT', newType: 'AWS::CDK::GREAT' },
          propertyDiffs: { QueueName: new PropertyDifference<string>( 'first', 'second', { changeImpact: ResourceImpact.NO_CHANGE }) },
          otherDiffs: {},
        },
      );

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.changeImpact).toBe('WILL_UPDATE');
      expect(queue.isDifferent).toBe(true);
    });

    test('handles Conditionally case', async () => {
    // GIVEN
      const logicalId = 'Queue';

      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {
            propertyReplacementModes: {
              QueueName: {
                replacementMode: 'Conditionally',
              },
            },
          } as any,
        },
      });
      const queue = new ResourceDifference(
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'first' } },
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'second' } },
        {
          resourceType: { oldType: 'AWS::CDK::GREAT', newType: 'AWS::CDK::GREAT' },
          propertyDiffs: { QueueName: new PropertyDifference<string>( 'first', 'second', { changeImpact: ResourceImpact.NO_CHANGE }) },
          otherDiffs: {},
        },
      );

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.changeImpact).toBe('MAY_REPLACE');
      expect(queue.isDifferent).toBe(true);
    });

    test('handles Always case', async () => {
    // GIVEN
      const logicalId = 'Queue';

      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {
            propertyReplacementModes: {
              QueueName: {
                replacementMode: 'Always',
              },
            },
          } as any,
        },
      });
      const queue = new ResourceDifference(
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'first' } },
        { Type: 'AWS::CDK::GREAT', Properties: { QueueName: 'second' } },
        {
          resourceType: { oldType: 'AWS::CDK::GREAT', newType: 'AWS::CDK::GREAT' },
          propertyDiffs: { QueueName: new PropertyDifference<string>( 'first', 'second', { changeImpact: ResourceImpact.NO_CHANGE }) },
          otherDiffs: {},
        },
      );

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.changeImpact).toBe('WILL_REPLACE');
      expect(queue.isDifferent).toBe(true);
    });

    test('returns if AWS::Serverless is resourcetype', async () => {
    // GIVEN
      const logicalId = 'Queue';

      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({
        changeSet: {},
        changeSetResources: {
          Queue: {
            propertyReplacementModes: {
              QueueName: {
                replacementMode: 'Always',
              },
            },
          } as any,
        },
      });
      const queue = new ResourceDifference(
        { Type: 'AAWS::Serverless::IDK', Properties: { QueueName: 'first' } },
        { Type: 'AAWS::Serverless::IDK', Properties: { QueueName: 'second' } },
        {
          resourceType: { oldType: 'AWS::Serverless::IDK', newType: 'AWS::Serverless::IDK' },
          propertyDiffs: {
            QueueName: new PropertyDifference<string>( 'first', 'second',
              { changeImpact: ResourceImpact.WILL_ORPHAN }), // choose will_orphan to show that we're ignoring changeset
          },
          otherDiffs: {},
        },
      );

      //WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.changeImpact).toBe('WILL_ORPHAN');
      expect(queue.isDifferent).toBe(true);
    });

  });

  // TODO -- delete thid describe block once IncludeInputValues is supported in all regions.
  describe('convertContextlessChangeSetResourceToResource', () => {

    test('If resource exists and is missing Properties field, then Properties field is added', async () => {
      // GIVEN
      const propertiesThatChanged = ['QueueName', 'DelaySeconds'];
      const resource: Resource = {
        Type: 'AWS::SQS::Queue',
      };

      //WHEN
      const beforeChangesResult = TemplateAndChangeSetDiffMerger.convertContextlessChangeSetResourceToResource(
        'AWS::SQS::Queue',
        resource,
        {
          propertiesThatChanged,
          beforeOrAfterChanges: 'BEFORE',
        },
      );

      // THEN
      expect(beforeChangesResult).toEqual({
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'value_before_change_is_not_viewable',
          DelaySeconds: 'value_before_change_is_not_viewable',
        },
      });
    });

    test('properties that are missing from the diff are added', async () => {
      // GIVEN
      const QueueName = 'sillyQueue';
      const propertiesThatChanged = ['QueueName', 'DelaySeconds'];
      const oldValueFromTemplateDiff : Resource = {
        Type: 'AWS::SQS::Queue',
        Properties: { QueueName },
      };
      const newValueFromTemplateDiff : Resource = {
        Type: 'AWS::SQS::Queue',
        Properties: { QueueName },
      };

      //WHEN
      const beforeChangesResult = TemplateAndChangeSetDiffMerger.convertContextlessChangeSetResourceToResource(
        'AWS::SQS::Queue',
        oldValueFromTemplateDiff,
        {
          propertiesThatChanged,
          beforeOrAfterChanges: 'BEFORE',
        },
      );
      const afterChangesResult = TemplateAndChangeSetDiffMerger.convertContextlessChangeSetResourceToResource(
        'AWS::SQS::Queue',
        newValueFromTemplateDiff,
        {
          propertiesThatChanged,
          beforeOrAfterChanges: 'AFTER',
        },
      );

      // THEN
      expect(afterChangesResult).toEqual({
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: QueueName,
          DelaySeconds: 'value_after_change_is_not_viewable',
        },
      });
      expect(beforeChangesResult).toEqual({
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: QueueName,
          DelaySeconds: 'value_before_change_is_not_viewable',
        },
      });
    });

    test('returns propsWithBackupMessage if the resource does not exist in template diff', async () => {
      //WHEN
      const oldOrNewValueFromTemplateDiff = undefined;
      const beforeChangesResult = TemplateAndChangeSetDiffMerger.convertContextlessChangeSetResourceToResource(
        'AWS::SQS::Queue',
        oldOrNewValueFromTemplateDiff,
        {
          propertiesThatChanged: ['QueueName', 'DelaySeconds'],
          beforeOrAfterChanges: 'BEFORE',
        },
      );
      const afterChangesResult = TemplateAndChangeSetDiffMerger.convertContextlessChangeSetResourceToResource(
        'AWS::SQS::Queue',
        oldOrNewValueFromTemplateDiff,
        {
          propertiesThatChanged: ['QueueName', 'DelaySeconds'],
          beforeOrAfterChanges: 'AFTER',
        },
      );

      // THEN
      expect(afterChangesResult).toEqual({
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'value_after_change_is_not_viewable',
          DelaySeconds: 'value_after_change_is_not_viewable',
        },
      });
      expect(beforeChangesResult).toEqual({
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'value_before_change_is_not_viewable',
          DelaySeconds: 'value_before_change_is_not_viewable',
        },
      });
    });

  });

});
