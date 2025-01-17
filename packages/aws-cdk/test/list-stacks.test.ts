import * as cxschema from '@aws-cdk/cloud-assembly-schema';;
import { instanceMockFrom, MockCloudExecutable, TestStackArtifact } from './util';
import { Bootstrapper } from '../lib/api/bootstrap';
import { Deployments } from '../lib/api/deployments';
import { CdkToolkit } from '../lib/cdk-toolkit';
import { listStacks } from '../lib/list-stacks';

describe('list', () => {
  let cloudFormation: jest.Mocked<Deployments>;
  let bootstrapper: jest.Mocked<Bootstrapper>;

  beforeEach(() => {
    jest.resetAllMocks();

    bootstrapper = instanceMockFrom(Bootstrapper);
    bootstrapper.bootstrapEnvironment.mockResolvedValue({ noOp: false, outputs: {} } as any);
  });

  test('stacks with no dependencies', async () => {
    let cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_A,
        {
          stackName: 'Test-Stack-B',
          template: { Resources: { TemplateName: 'Test-Stack-B' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-B': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
        },
      ],
    });
    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: cloudFormation,
    });

    // WHEN
    const workflow = await listStacks(toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-B'] });

    // THEN
    expect(JSON.stringify(workflow)).toEqual(JSON.stringify([{
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-B',
      name: 'Test-Stack-B',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    }]));
  });

  test('stacks with dependent stacks', async () => {
    let cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_A,
        {
          stackName: 'Test-Stack-B',
          template: { Resources: { TemplateName: 'Test-Stack-B' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-B': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-A'],
        },
      ],
    });

    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: cloudFormation,
    });

    // WHEN
    const workflow = await listStacks( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-B'] });

    // THEN
    expect(JSON.stringify(workflow)).toEqual(JSON.stringify([{
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-B',
      name: 'Test-Stack-B',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-A',
        dependencies: [],
      }],
    }]));
  });

  // In the context where we have a display name set to hieraricalId/stackName
  // we would need to pass in the displayName to list the stacks.
  test('stacks with dependent stacks and have display name set to hieraricalId/stackName', async () => {
    let cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_A,
        {
          stackName: 'Test-Stack-B',
          template: { Resources: { TemplateName: 'Test-Stack-B' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-B': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-A'],
          displayName: 'Test-Stack-A/Test-Stack-B',
        },
      ],
    });

    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: cloudFormation,
    });

    // WHEN
    const workflow = await listStacks( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-A/Test-Stack-B'] });

    // THEN
    expect(JSON.stringify(workflow)).toEqual(JSON.stringify([{
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-A/Test-Stack-B',
      name: 'Test-Stack-B',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-A',
        dependencies: [],
      }],
    }]));
  });

  test('stacks with display names and have nested dependencies', async () => {
    let cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_A,
        {
          stackName: 'Test-Stack-B',
          template: { Resources: { TemplateName: 'Test-Stack-B' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-B': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-A'],
          displayName: 'Test-Stack-A/Test-Stack-B',
        },
        {
          stackName: 'Test-Stack-C',
          template: { Resources: { TemplateName: 'Test-Stack-C' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-C': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-B'],
          displayName: 'Test-Stack-A/Test-Stack-B/Test-Stack-C',
        },
      ],
    });

    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: cloudFormation,
    });

    // WHEN
    const workflow = await listStacks( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-A/Test-Stack-B', 'Test-Stack-A/Test-Stack-B/Test-Stack-C'] });

    // THEN
    expect(JSON.stringify(workflow)).toEqual(JSON.stringify([{
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-A/Test-Stack-B',
      name: 'Test-Stack-B',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-A',
        dependencies: [],
      }],
    },
    {
      id: 'Test-Stack-A/Test-Stack-B/Test-Stack-C',
      name: 'Test-Stack-C',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-A/Test-Stack-B',
        dependencies: [{
          id: 'Test-Stack-A',
          dependencies: [],
        }],
      }],
    }]));
  });

  test('stacks with nested dependencies', async () => {
    let cloudExecutable = new MockCloudExecutable({
      stacks: [
        MockStack.MOCK_STACK_A,
        {
          stackName: 'Test-Stack-B',
          template: { Resources: { TemplateName: 'Test-Stack-B' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-B': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-A'],
        },
        {
          stackName: 'Test-Stack-C',
          template: { Resources: { TemplateName: 'Test-Stack-C' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-C': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-B'],
        },
      ],
    });

    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: cloudFormation,
    });

    // WHEN
    const workflow = await listStacks( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-B', 'Test-Stack-C'] });

    // THEN
    expect(JSON.stringify(workflow)).toEqual(JSON.stringify([{
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-B',
      name: 'Test-Stack-B',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-A',
        dependencies: [],
      }],
    },
    {
      id: 'Test-Stack-C',
      name: 'Test-Stack-C',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-B',
        dependencies: [{
          id: 'Test-Stack-A',
          dependencies: [],
        }],
      }],
    }]));
  });

  // In the context of stacks with cross-stack or cross-region references,
  // the dependency mechanism is responsible for appropriately applying dependencies at the correct hierarchy level,
  // typically at the top-level stacks.
  // This involves handling the establishment of cross-references between stacks or nested stacks
  // and generating assets for nested stack templates as necessary.
  test('stacks with cross stack referencing', async () => {
    let cloudExecutable = new MockCloudExecutable({
      stacks: [
        {
          stackName: 'Test-Stack-A',
          template: {
            Resources: {
              MyBucket1Reference: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
                  Parameters: {
                    BucketName: { 'Fn::GetAtt': ['MyBucket1', 'Arn'] },
                  },
                },
              },
            },
          },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-A': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-C'],
        },
        MockStack.MOCK_STACK_C,
      ],
    });

    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: cloudFormation,
    });

    // WHEN
    const workflow = await listStacks( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-C'] });

    // THEN
    expect(JSON.stringify(workflow)).toEqual(JSON.stringify([{
      id: 'Test-Stack-C',
      name: 'Test-Stack-C',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-C',
        dependencies: [],
      }],
    }]));
  });

  test('stacks with circular dependencies should error out', async () => {
    let cloudExecutable = new MockCloudExecutable({
      stacks: [
        {
          stackName: 'Test-Stack-A',
          template: { Resources: { TemplateName: 'Test-Stack-A' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-A': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-B'],
        },
        {
          stackName: 'Test-Stack-B',
          template: { Resources: { TemplateName: 'Test-Stack-B' } },
          env: 'aws://123456789012/bermuda-triangle-1',
          metadata: {
            '/Test-Stack-B': [
              {
                type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
              },
            ],
          },
          depends: ['Test-Stack-A'],
        },
      ],
    });

    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: cloudFormation,
    });

    // WHEN
    await expect(() =>
      listStacks( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-B'] }),
    ).rejects.toThrow('Could not determine ordering');
  });
});

class MockStack {
  public static readonly MOCK_STACK_A: TestStackArtifact = {
    stackName: 'Test-Stack-A',
    template: { Resources: { TemplateName: 'Test-Stack-A' } },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-A': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
        },
      ],
    },
  };
  public static readonly MOCK_STACK_C: TestStackArtifact = {
    stackName: 'Test-Stack-C',
    template: {
      Resources: {
        MyBucket1: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            AccessControl: 'PublicRead',
          },
          DeletionPolicy: 'Retain',
        },
      },
    },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-C': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
        },
      ],
    },
  };
}
