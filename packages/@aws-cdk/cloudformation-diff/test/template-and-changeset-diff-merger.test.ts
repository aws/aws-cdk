import { ResourceChangeDetail } from '@aws-sdk/client-cloudformation';
import { changeSet, changeSetWithIamChanges, changeSetWithMissingChanges, changeSetWithPartiallyFilledChanges, changeSetWithUndefinedDetails, sqsQueueWithAargs, ssmParam } from './util';
import { ChangeSetResource } from '../lib';
import { TemplateAndChangeSetDiffMerger } from '../lib/diff/template-and-changeset-diff-merger';
import { fullDiff, ResourceImpact } from '../lib/diff-template';

describe('fullDiff tests', () => {
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

  test('changeset does not overrides spec additions or deletions', () => {
    // GIVEN
    const currentTemplate = {
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
          Properties: { BucketName: 'MagicBucket' },
        },
      },
    };
    const newTemplate = {
      Resources: {
        Queue: {
          Type: 'AWS::SQS::Queue',
          Properties: { QueueName: 'MagicQueue' },
        },
      },
    };

    // WHEN
    const differences = fullDiff(currentTemplate, newTemplate, {
      Changes: [
        {
          ResourceChange: {
            Action: 'Remove',
            LogicalResourceId: 'Bucket',
            ResourceType: 'AWS::S3::Bucket',
            Details: [],
          },
        },
        {
          ResourceChange: {
            Action: 'Add',
            LogicalResourceId: 'Queue',
            ResourceType: 'AWS::SQS::Queue',
            Details: [],
          },
        },
      ],
    });

    // A realistic changeset will include Additions and Removals, but this shows that we don't use the changeset to determine additions or removals
    const emptyChangeSetDifferences = fullDiff(currentTemplate, newTemplate, {
      Changes: [],
    });

    // THEN
    expect(differences.differenceCount).toBe(2);
    expect(emptyChangeSetDifferences.differenceCount).toBe(2);
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
    expect(differences.resources.get('BucketResource').changeImpact === ResourceImpact.WILL_IMPORT);
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
    expect(differences.resources.get('BucketResource').changeImpact === ResourceImpact.WILL_IMPORT);
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
        mySsmParameter: ssmParam,
      },
    };

    // WHEN
    const diffWithoutChangeSet = fullDiff(currentTemplate, currentTemplate);
    const diffWithChangeSet = fullDiff(currentTemplate, currentTemplate,
      {
        Changes: [
          {
            Type: 'Resource',
            ResourceChange: {
              Action: 'Modify',
              LogicalResourceId: 'mySsmParameter',
              PhysicalResourceId: 'mySsmParameterFromStack',
              ResourceType: 'AWS::SSM::Parameter',
              Replacement: 'False',
              Scope: [
                'Properties',
              ],
              Details: [
                {
                  Target: {
                    Attribute: 'Properties',
                    Name: 'Value',
                    RequiresRecreation: 'Never',
                    Path: '/Properties/Value',
                    BeforeValue: 'changedddd',
                    AfterValue: 'sdflkja',
                    AttributeChangeType: 'Modify',
                  },
                  Evaluation: 'Static',
                  ChangeSource: 'DirectModification',
                },
              ],
            },
          },
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
    expect(diffWithChangeSet.resources.changes.mySsmParameter).toEqual(
      {
        oldValue: {
          Type: 'AWS::SSM::Parameter',
          Properties: {
            Value: 'changedddd',
          },
        },
        newValue: {
          Type: 'AWS::SSM::Parameter',
          Properties: {
            Value: 'sdflkja',
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
        },
        otherDiffs: {
          Type: {
            oldValue: 'AWS::SSM::Parameter',
            newValue: 'AWS::SSM::Parameter',
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
          {
            Type: 'Resource',
            ResourceChange: {
              PolicyAction: 'ReplaceAndDelete',
              Action: 'Modify',
              LogicalResourceId: 'Queue',
              PhysicalResourceId: 'https://sqs.us-east-1.amazonaws.com/012345678901/newValuechangedddd',
              ResourceType: 'AWS::SQS::Queue',
              Replacement: 'True',
              Scope: [
                'Properties',
              ],
              Details: [
                {
                  Target: {
                    Attribute: 'Properties',
                    Name: 'QueueName',
                    RequiresRecreation: 'Always',
                    Path: '/Properties/QueueName',
                    BeforeValue: 'newValuechangedddd',
                    AfterValue: 'newValuesdflkja',
                    AttributeChangeType: 'Modify',
                  },
                  Evaluation: 'Static',
                  ChangeSource: 'DirectModification',
                },
              ],
            },
          },
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
          },
        },
        newValue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: 'newValuesdflkja',
          },
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
    );

    expect(diffWithChangeSet.resources.changes.Queue.isUpdate).toEqual(true);
  });

  test('a resource in the diff that is missing a property has the missing property added to the diff', () => {
  // The idea is, we detect 1 change in the template diff -- and we detect another change in the changeset diff.

    // GIVEN
    const currentTemplate = {
      Parameters: {
        SsmParameterValuetestbugreportC9: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'goodJob',
        },
      },
      Resources: {
        Queue: sqsQueueWithAargs({ waitTime: 10 }),
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
        Queue: sqsQueueWithAargs({ waitTime: 20 }),
      },
    };

    // WHEN
    const diffWithoutChangeSet = fullDiff(currentTemplate, newTemplate);
    const diffWithChangeSet = fullDiff(currentTemplate, newTemplate,
      {
        Changes: [
          {
            Type: 'Resource',
            ResourceChange: {
              PolicyAction: 'ReplaceAndDelete',
              Action: 'Modify',
              LogicalResourceId: 'Queue',
              PhysicalResourceId: 'https://sqs.us-east-1.amazonaws.com/012345678901/newValueNEEEWWWEEERRRRR',
              ResourceType: 'AWS::SQS::Queue',
              Replacement: 'True',
              Scope: [
                'Properties',
              ],
              Details: [{
                Target: { Attribute: 'Properties', Name: 'QueueName', RequiresRecreation: 'Always' },
                Evaluation: 'Static',
                ChangeSource: 'DirectModification',
              },
              {
                Target: { Attribute: 'Properties', Name: 'ReceiveMessageWaitTimeSeconds', RequiresRecreation: 'Never' },
                Evaluation: 'Static',
                ChangeSource: 'DirectModification',
              }],
            },
          },
        ],
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
          oldValue: sqsQueueWithAargs({ waitTime: 10 }),
          newValue: sqsQueueWithAargs({ waitTime: 20 }),
          resourceTypes: {
            oldType: 'AWS::SQS::Queue',
            newType: 'AWS::SQS::Queue',
          },
          propertyDiffs: {
            QueueName: {
              oldValue: {
                Ref: 'SsmParameterValuetestbugreportC9',
              },
              newValue: {
                Ref: 'SsmParameterValuetestbugreportC9',
              },
              isDifferent: false,
              changeImpact: 'NO_CHANGE',
            },
            ReceiveMessageWaitTimeSeconds: {
              oldValue: 10,
              newValue: 20,
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
        },
      },
    );

    expect(diffWithChangeSet.differenceCount).toBe(1); // this is the count of how many resources have changed
    expect(diffWithChangeSet.resources.changes).toEqual(
      {
        Queue: {
          oldValue: sqsQueueWithAargs({ waitTime: 10 }),
          newValue: sqsQueueWithAargs({ waitTime: 20 }),
          resourceTypes: {
            oldType: 'AWS::SQS::Queue',
            newType: 'AWS::SQS::Queue',
          },
          propertyDiffs: {
            QueueName: {
              oldValue: {
              },
              newValue: {
              },
              isDifferent: true,
              changeImpact: 'WILL_REPLACE',
            },
            ReceiveMessageWaitTimeSeconds: {
              oldValue: 10,
              newValue: 20,
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
        },
      },
    );
  });

  test('IamChanges that are visible only through changeset are added to TemplatedDiff.iamChanges', () => {
    // GIVEN
    const currentTemplate = {};

    // WHEN
    const diffWithChangeSet = fullDiff(currentTemplate, currentTemplate, changeSetWithIamChanges);

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

});

describe('method tests', () => {

  test('InspectChangeSet correctly parses changeset', async () => {
    // WHEN
    const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: changeSet });

    // THEN
    expect(Object.keys(templateAndChangeSetDiffMerger.changeSetResources ?? {}).length).toBe(2);
    expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).Queue).toEqual({
      resourceWasReplaced: true,
      resourceType: 'AWS::SQS::Queue',
      properties: {
        QueueName: {
          changeSetReplacementMode: 'Always',
          beforeValue: 'newValuechangedddd',
          afterValue: 'newValuesdflkja',
        },
      },
    });
    expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).mySsmParameter).toEqual({
      resourceWasReplaced: false,
      resourceType: 'AWS::SSM::Parameter',
      properties: {
        Value: {
          changeSetReplacementMode: 'Never',
          beforeValue: 'changedddd',
          afterValue: 'sdflkja',
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
    const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: changeSetWithMissingChanges });

    // THEN
    expect(templateAndChangeSetDiffMerger.changeSetResources).toEqual({});
    expect(templateAndChangeSetDiffMerger.changeSet).toEqual(changeSetWithMissingChanges);
  });

  test('TemplateAndChangeSetDiffMerger constructor can handle partially defined changes in changset.Changes', async () => {
    // WHEN
    const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: changeSetWithPartiallyFilledChanges });

    // THEN
    expect(templateAndChangeSetDiffMerger.changeSet).toEqual(changeSetWithPartiallyFilledChanges);
    expect(Object.keys(templateAndChangeSetDiffMerger.changeSetResources ?? {}).length).toBe(2);
    expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).mySsmParameter).toEqual({
      resourceWasReplaced: false,
      resourceType: 'AWS::SSM::Parameter',
      properties: {},
    });
    expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).Queue).toEqual({
      resourceWasReplaced: true,
      resourceType: 'UNKNOWN',
      properties: {
        QueueName: {
          changeSetReplacementMode: 'Always',
          beforeValue: undefined,
          afterValue: undefined,
        },
      },
    });
  });

  test('TemplateAndChangeSetDiffMerger constructor can handle undefined Details in changset.Changes', async () => {
    // WHEN
    const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: changeSetWithUndefinedDetails });

    // THEN
    expect(templateAndChangeSetDiffMerger.changeSet).toEqual(changeSetWithUndefinedDetails);
    expect(Object.keys(templateAndChangeSetDiffMerger.changeSetResources ?? {}).length).toBe(1);
    expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).Queue).toEqual({
      resourceWasReplaced: true,
      resourceType: 'UNKNOWN',
      properties: {},
    });
  });

  test('determineChangeSetReplacementMode can evaluate missing Target', async () => {
    // GIVEN
    const propertyChangeWithMissingTarget = {
      Target: undefined,
    };

    // WHEN
    const changeSetReplacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithMissingTarget);

    // THEN
    expect(changeSetReplacementMode).toEqual('Conditionally');
  });

  test('determineChangeSetReplacementMode can evaluate missing RequiresRecreation', async () => {
    // GIVEN
    const propertyChangeWithMissingTargetDetail = {
      Target: { RequiresRecreation: undefined },
    };

    // WHEN
    const changeSetReplacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithMissingTargetDetail);

    // THEN
    expect(changeSetReplacementMode).toEqual('Conditionally');
  });

  test('determineChangeSetReplacementMode can evaluate Always and Static', async () => {
    // GIVEN
    const propertyChangeWithAlwaysStatic: ResourceChangeDetail = {
      Target: { RequiresRecreation: 'Always' },
      Evaluation: 'Static',
    };

    // WHEN
    const changeSetReplacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithAlwaysStatic);

    // THEN
    expect(changeSetReplacementMode).toEqual('Always');
  });

  test('determineChangeSetReplacementMode can evaluate always dynamic', async () => {
    // GIVEN
    const propertyChangeWithAlwaysDynamic: ResourceChangeDetail = {
      Target: { RequiresRecreation: 'Always' },
      Evaluation: 'Dynamic',
    };

    // WHEN
    const changeSetReplacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithAlwaysDynamic);

    // THEN
    expect(changeSetReplacementMode).toEqual('Conditionally');
  });

  test('determineChangeSetReplacementMode with missing Evaluation', async () => {
    // GIVEN
    const propertyChangeWithMissingEvaluation: ResourceChangeDetail = {
      Target: { RequiresRecreation: 'Always' },
      Evaluation: undefined,
    };

    // WHEN
    const changeSetReplacementMode = TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChangeWithMissingEvaluation);

    // THEN
    expect(changeSetReplacementMode).toEqual('Always');
  });

  test('convertResourceFromChangesetToResourceForDiff with missing resourceType and properties', async () => {
    // GIVEN
    const changeSetResource: ChangeSetResource = {
      resourceWasReplaced: false,
      resourceType: undefined,
      properties: undefined,
    };

    // WHEN
    const resourceAfterChange = TemplateAndChangeSetDiffMerger.convertResourceFromChangesetToResourceForDiff(
      changeSetResource,
      'AFTER_VALUES',
    );
    const resourceBeforeChange = TemplateAndChangeSetDiffMerger.convertResourceFromChangesetToResourceForDiff(
      changeSetResource,
      'BEFORE_VALUES',
    );

    // THEN
    expect(resourceBeforeChange).toEqual({
      Type: 'UNKNOWN',
      Properties: {},
    });

    expect(resourceAfterChange).toEqual({
      Type: 'UNKNOWN',
      Properties: {},
    });
  });

  test('convertResourceFromChangesetToResourceForDiff with fully filled input', async () => {
    // GIVEN
    const changeSetResource: ChangeSetResource = {
      resourceWasReplaced: false,
      resourceType: 'CDK::IS::GREAT',
      properties: {
        C: {
          changeSetReplacementMode: 'Always',
          beforeValue: 'changedddd',
          afterValue: 'sdflkja',
        },
      },
    };

    // WHEN
    const resourceAfterChange = TemplateAndChangeSetDiffMerger.convertResourceFromChangesetToResourceForDiff(
      changeSetResource,
      'AFTER_VALUES',
    );
    const resourceBeforeChange = TemplateAndChangeSetDiffMerger.convertResourceFromChangesetToResourceForDiff(
      changeSetResource,
      'BEFORE_VALUES',
    );

    // THEN
    expect(resourceBeforeChange).toEqual({
      Type: 'CDK::IS::GREAT',
      Properties: { C: 'changedddd' },
    });

    expect(resourceAfterChange).toEqual({
      Type: 'CDK::IS::GREAT',
      Properties: { C: 'sdflkja' },
    });
  });

});