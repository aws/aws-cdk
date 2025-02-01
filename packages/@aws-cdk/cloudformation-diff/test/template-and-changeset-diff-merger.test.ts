import { ResourceChangeDetail } from '@aws-sdk/client-cloudformation';
import * as utils from './util';
import { PropertyDifference, ResourceDifference, ResourceImpact, fullDiff } from '../lib';
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
      });
      expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).mySsmParameter).toEqual({
        resourceWasReplaced: false,
        resourceType: 'AWS::SSM::Parameter',
        propertyReplacementModes: {
          Value: {
            replacementMode: 'Never',
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
      expect((templateAndChangeSetDiffMerger.changeSetResources ?? {}).mySsmParameter).toEqual({
        resourceWasReplaced: false,
        resourceType: 'UNKNOWN_RESOURCE_TYPE',
        propertyReplacementModes: {
          Value: {
            replacementMode: 'Never',
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

  describe('overrideDiffResourceChangeImpactWithChangeSetChangeImpact', () => {
    test('can handle blank change', async () => {
      // GIVEN
      const templateAndChangeSetDiffMerger = new TemplateAndChangeSetDiffMerger({ changeSet: {} });
      const queue = new ResourceDifference(undefined, undefined, { resourceType: {}, propertyDiffs: {}, otherDiffs: {} });
      const logicalId = 'Queue';

      // WHEN
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

      // WHEN
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

      // WHEN
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

      // WHEN
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

      // WHEN
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

      // WHEN
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

      // WHEN
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

      // WHEN
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

      // WHEN
      templateAndChangeSetDiffMerger.overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId, queue);

      // THEN
      expect(queue.changeImpact).toBe('WILL_ORPHAN');
      expect(queue.isDifferent).toBe(true);
    });
  });
});
