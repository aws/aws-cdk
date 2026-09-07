import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import type {
  IContainerRecipe,
  IImageRecipe,
  IRecipeBase,
} from '../lib';
import {
  ContainerRecipe,
  ImageRecipe,
  LifecyclePolicy,
  LifecyclePolicyActionType,
  LifecyclePolicyResourceType,
  LifecyclePolicyStatus,
} from '../lib';

describe('Lifecycle Policy', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by name', () => {
    const lifecyclePolicy = LifecyclePolicy.fromLifecyclePolicyName(
      stack,
      'LifecyclePolicy',
      'imported-lifecycle-policy-by-name',
    );

    expect(stack.resolve(lifecyclePolicy.lifecyclePolicyArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:lifecycle-policy/imported-lifecycle-policy-by-name',
        ],
      ],
    });
    expect(lifecyclePolicy.lifecyclePolicyName).toEqual('imported-lifecycle-policy-by-name');
  });

  test('imported by name as an unresolved token', () => {
    const lifecyclePolicy = LifecyclePolicy.fromLifecyclePolicyName(
      stack,
      'LifecyclePolicy',
      `test-lifecycle-policy-${stack.partition}`,
    );

    expect(stack.resolve(lifecyclePolicy.lifecyclePolicyArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':imagebuilder:us-east-1:123456789012:lifecycle-policy/test-lifecycle-policy-',
          { Ref: 'AWS::Partition' },
        ],
      ],
    });
    expect(stack.resolve(lifecyclePolicy.lifecyclePolicyName)).toEqual({
      'Fn::Join': ['', ['test-lifecycle-policy-', { Ref: 'AWS::Partition' }]],
    });
  });

  test('imported by arn', () => {
    const lifecyclePolicy = LifecyclePolicy.fromLifecyclePolicyArn(
      stack,
      'LifecyclePolicy',
      'arn:aws:imagebuilder:us-east-1:123456789012:lifecycle-policy/imported-lifecycle-policy-by-arn',
    );

    expect(lifecyclePolicy.lifecyclePolicyArn).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:lifecycle-policy/imported-lifecycle-policy-by-arn',
    );
    expect(lifecyclePolicy.lifecyclePolicyName).toEqual('imported-lifecycle-policy-by-arn');
  });

  test('with all parameters - AMI policy', () => {
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/EC2ImageBuilderLifecycleExecutionPolicy'),
      ],
    });

    const lifecyclePolicy = new LifecyclePolicy(stack, 'LifecyclePolicy', {
      lifecyclePolicyName: 'test-lifecycle-policy',
      description: 'This is a test lifecycle policy',
      status: LifecyclePolicyStatus.ENABLED,
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      executionRole: role,
      details: [
        {
          action: {
            type: LifecyclePolicyActionType.DELETE,
            includeAmis: true,
            includeSnapshots: true,
          },
          filter: {
            ageFilter: {
              age: cdk.Duration.days(30),
              retainAtLeast: 5,
            },
          },
          exclusionRules: {
            amiExclusionRules: {
              isPublic: true,
              lastLaunched: cdk.Duration.days(20),
              regions: ['us-west-2', 'us-east-2'],
              sharedAccounts: ['098765432109'],
              tags: { Environment: 'test' },
            },
            imageExclusionRules: { tags: { Environment: 'test' } },
          },
        },
        {
          action: {
            type: LifecyclePolicyActionType.DISABLE,
            includeAmis: false,
            includeSnapshots: false,
          },
          filter: {
            ageFilter: {
              age: cdk.Duration.days(20),
              retainAtLeast: 5,
            },
          },
          exclusionRules: {
            amiExclusionRules: {
              isPublic: true,
              lastLaunched: cdk.Duration.days(10),
              regions: ['us-west-2', 'us-east-2'],
              sharedAccounts: ['098765432109'],
              tags: { Environment: 'test' },
            },
            imageExclusionRules: { tags: { Environment: 'test' } },
          },
        },
        {
          action: {
            type: LifecyclePolicyActionType.DEPRECATE,
            includeAmis: false,
            includeSnapshots: false,
          },
          filter: {
            ageFilter: {
              age: cdk.Duration.days(10),
              retainAtLeast: 5,
            },
          },
          exclusionRules: {
            amiExclusionRules: {
              isPublic: true,
              lastLaunched: cdk.Duration.days(1),
              regions: ['us-west-2', 'us-east-2'],
              sharedAccounts: ['098765432109'],
              tags: { Environment: 'test' },
            },
            imageExclusionRules: { tags: { Environment: 'test' } },
          },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    expect(LifecyclePolicy.isLifecyclePolicy(lifecyclePolicy as unknown)).toBeTruthy();
    expect(LifecyclePolicy.isLifecyclePolicy('LifecyclePolicy')).toBeFalsy();

    Template.fromStack(stack).templateMatches({
      Resources: Match.objectEquals({
        LifecyclePolicy8967ABEC: {
          Type: 'AWS::ImageBuilder::LifecyclePolicy',
          Properties: {
            Name: 'test-lifecycle-policy',
            Description: 'This is a test lifecycle policy',
            ExecutionRole: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
            ResourceType: 'AMI_IMAGE',
            Status: 'ENABLED',
            PolicyDetails: [
              {
                Action: {
                  Type: 'DELETE',
                  IncludeResources: {
                    Amis: true,
                    Snapshots: true,
                  },
                },
                ExclusionRules: {
                  Amis: {
                    IsPublic: true,
                    LastLaunched: {
                      Unit: 'DAYS',
                      Value: 20,
                    },
                    Regions: ['us-west-2', 'us-east-2'],
                    SharedAccounts: ['098765432109'],
                    TagMap: {
                      Environment: 'test',
                    },
                  },
                  TagMap: {
                    Environment: 'test',
                  },
                },
                Filter: {
                  RetainAtLeast: 5,
                  Type: 'AGE',
                  Unit: 'DAYS',
                  Value: 30,
                },
              },
              {
                Action: {
                  Type: 'DISABLE',
                  IncludeResources: {
                    Amis: false,
                    Snapshots: false,
                  },
                },
                ExclusionRules: {
                  Amis: {
                    IsPublic: true,
                    LastLaunched: {
                      Unit: 'DAYS',
                      Value: 10,
                    },
                    Regions: ['us-west-2', 'us-east-2'],
                    SharedAccounts: ['098765432109'],
                    TagMap: {
                      Environment: 'test',
                    },
                  },
                  TagMap: {
                    Environment: 'test',
                  },
                },
                Filter: {
                  RetainAtLeast: 5,
                  Type: 'AGE',
                  Unit: 'DAYS',
                  Value: 20,
                },
              },
              {
                Action: {
                  Type: 'DEPRECATE',
                  IncludeResources: {
                    Amis: false,
                    Snapshots: false,
                  },
                },
                ExclusionRules: {
                  Amis: {
                    IsPublic: true,
                    LastLaunched: {
                      Unit: 'DAYS',
                      Value: 1,
                    },
                    Regions: ['us-west-2', 'us-east-2'],
                    SharedAccounts: ['098765432109'],
                    TagMap: {
                      Environment: 'test',
                    },
                  },
                  TagMap: {
                    Environment: 'test',
                  },
                },
                Filter: {
                  RetainAtLeast: 5,
                  Type: 'AGE',
                  Unit: 'DAYS',
                  Value: 10,
                },
              },
            ],
            ResourceSelection: {
              TagMap: {
                Environment: 'test',
              },
            },
          },
        },
        Role1ABCC5F0: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/service-role/EC2ImageBuilderLifecycleExecutionPolicy',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'imagebuilder.amazonaws.com',
                  },
                },
              ],
            },
          },
        },
      }),
    });
  });

  test('with all parameters - container policy', () => {
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/EC2ImageBuilderLifecycleExecutionPolicy'),
      ],
    });

    new LifecyclePolicy(stack, 'LifecyclePolicy', {
      lifecyclePolicyName: 'test-lifecycle-policy',
      description: 'This is a test lifecycle policy',
      status: LifecyclePolicyStatus.ENABLED,
      resourceType: LifecyclePolicyResourceType.CONTAINER_IMAGE,
      executionRole: role,
      details: [
        {
          action: {
            type: LifecyclePolicyActionType.DELETE,
            includeContainers: false,
          },
          filter: {
            ageFilter: {
              age: cdk.Duration.days(30),
              retainAtLeast: 5,
            },
          },
          exclusionRules: { imageExclusionRules: { tags: { Environment: 'test' } } },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    Template.fromStack(stack).templateMatches({
      Resources: Match.objectEquals({
        LifecyclePolicy8967ABEC: {
          Type: 'AWS::ImageBuilder::LifecyclePolicy',
          Properties: {
            Name: 'test-lifecycle-policy',
            Description: 'This is a test lifecycle policy',
            ExecutionRole: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
            ResourceType: 'CONTAINER_IMAGE',
            Status: 'ENABLED',
            PolicyDetails: [
              {
                Action: {
                  Type: 'DELETE',
                  IncludeResources: {
                    Containers: false,
                  },
                },
                ExclusionRules: {
                  TagMap: {
                    Environment: 'test',
                  },
                },
                Filter: {
                  RetainAtLeast: 5,
                  Type: 'AGE',
                  Unit: 'DAYS',
                  Value: 30,
                },
              },
            ],
            ResourceSelection: {
              TagMap: {
                Environment: 'test',
              },
            },
          },
        },
        Role1ABCC5F0: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/service-role/EC2ImageBuilderLifecycleExecutionPolicy',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'imagebuilder.amazonaws.com',
                  },
                },
              ],
            },
          },
        },
      }),
    });
  });

  test('with all parameters - recipe selection', () => {
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/EC2ImageBuilderLifecycleExecutionPolicy'),
      ],
    });

    const lifecyclePolicy = new LifecyclePolicy(stack, 'LifecyclePolicy', {
      lifecyclePolicyName: 'test-lifecycle-policy',
      description: 'This is a test lifecycle policy',
      status: LifecyclePolicyStatus.ENABLED,
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      executionRole: role,
      details: [
        {
          action: {
            type: LifecyclePolicyActionType.DELETE,
            includeAmis: true,
            includeSnapshots: true,
          },
          filter: {
            ageFilter: {
              age: cdk.Duration.days(30),
              retainAtLeast: 5,
            },
          },
          exclusionRules: {
            amiExclusionRules: {
              isPublic: true,
              lastLaunched: cdk.Duration.days(20),
              regions: ['us-west-2', 'us-east-2'],
              sharedAccounts: ['098765432109'],
              tags: { Environment: 'test' },
            },
            imageExclusionRules: { tags: { Environment: 'test' } },
          },
        },
        {
          action: {
            type: LifecyclePolicyActionType.DISABLE,
            includeAmis: false,
            includeSnapshots: false,
          },
          filter: {
            ageFilter: {
              age: cdk.Duration.days(20),
              retainAtLeast: 5,
            },
          },
          exclusionRules: {
            amiExclusionRules: {
              isPublic: true,
              lastLaunched: cdk.Duration.days(10),
              regions: ['us-west-2', 'us-east-2'],
              sharedAccounts: ['098765432109'],
              tags: { Environment: 'test' },
            },
            imageExclusionRules: { tags: { Environment: 'test' } },
          },
        },
        {
          action: {
            type: LifecyclePolicyActionType.DEPRECATE,
            includeAmis: false,
            includeSnapshots: false,
          },
          filter: {
            ageFilter: {
              age: cdk.Duration.days(10),
              retainAtLeast: 5,
            },
          },
          exclusionRules: {
            amiExclusionRules: {
              isPublic: true,
              lastLaunched: cdk.Duration.days(1),
              regions: ['us-west-2', 'us-east-2'],
              sharedAccounts: ['098765432109'],
              tags: { Environment: 'test' },
            },
            imageExclusionRules: { tags: { Environment: 'test' } },
          },
        },
      ],
      resourceSelection: {
        recipes: [
          ImageRecipe.fromImageRecipeAttributes(stack, 'ImageRecipe', {
            imageRecipeName: 'test-image-recipe',
            imageRecipeVersion: '1.0.0',
          }),
        ],
      },
    });

    expect(LifecyclePolicy.isLifecyclePolicy(lifecyclePolicy as unknown)).toBeTruthy();
    expect(LifecyclePolicy.isLifecyclePolicy('LifecyclePolicy')).toBeFalsy();

    Template.fromStack(stack).templateMatches({
      Resources: Match.objectEquals({
        LifecyclePolicy8967ABEC: {
          Type: 'AWS::ImageBuilder::LifecyclePolicy',
          Properties: {
            Name: 'test-lifecycle-policy',
            Description: 'This is a test lifecycle policy',
            ExecutionRole: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
            ResourceType: 'AMI_IMAGE',
            Status: 'ENABLED',
            PolicyDetails: [
              {
                Action: {
                  Type: 'DELETE',
                  IncludeResources: {
                    Amis: true,
                    Snapshots: true,
                  },
                },
                ExclusionRules: {
                  Amis: {
                    IsPublic: true,
                    LastLaunched: {
                      Unit: 'DAYS',
                      Value: 20,
                    },
                    Regions: ['us-west-2', 'us-east-2'],
                    SharedAccounts: ['098765432109'],
                    TagMap: {
                      Environment: 'test',
                    },
                  },
                  TagMap: {
                    Environment: 'test',
                  },
                },
                Filter: {
                  RetainAtLeast: 5,
                  Type: 'AGE',
                  Unit: 'DAYS',
                  Value: 30,
                },
              },
              {
                Action: {
                  Type: 'DISABLE',
                  IncludeResources: {
                    Amis: false,
                    Snapshots: false,
                  },
                },
                ExclusionRules: {
                  Amis: {
                    IsPublic: true,
                    LastLaunched: {
                      Unit: 'DAYS',
                      Value: 10,
                    },
                    Regions: ['us-west-2', 'us-east-2'],
                    SharedAccounts: ['098765432109'],
                    TagMap: {
                      Environment: 'test',
                    },
                  },
                  TagMap: {
                    Environment: 'test',
                  },
                },
                Filter: {
                  RetainAtLeast: 5,
                  Type: 'AGE',
                  Unit: 'DAYS',
                  Value: 20,
                },
              },
              {
                Action: {
                  Type: 'DEPRECATE',
                  IncludeResources: {
                    Amis: false,
                    Snapshots: false,
                  },
                },
                ExclusionRules: {
                  Amis: {
                    IsPublic: true,
                    LastLaunched: {
                      Unit: 'DAYS',
                      Value: 1,
                    },
                    Regions: ['us-west-2', 'us-east-2'],
                    SharedAccounts: ['098765432109'],
                    TagMap: {
                      Environment: 'test',
                    },
                  },
                  TagMap: {
                    Environment: 'test',
                  },
                },
                Filter: {
                  RetainAtLeast: 5,
                  Type: 'AGE',
                  Unit: 'DAYS',
                  Value: 10,
                },
              },
            ],
            ResourceSelection: { Recipes: [{ Name: 'test-image-recipe', SemanticVersion: '1.0.0' }] },
          },
        },
        Role1ABCC5F0: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/service-role/EC2ImageBuilderLifecycleExecutionPolicy',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'imagebuilder.amazonaws.com',
                  },
                },
              ],
            },
          },
        },
      }),
    });
  });

  test('with required parameters - AMI policy', () => {
    new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { countFilter: { count: 5 } },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    Template.fromStack(stack).templateMatches({
      Resources: Match.objectEquals({
        LifecyclePolicy8967ABEC: {
          Type: 'AWS::ImageBuilder::LifecyclePolicy',
          Properties: {
            Name: 'stack-lifecyclepolicy-a97ea585',
            ExecutionRole: { 'Fn::GetAtt': ['LifecyclePolicyExecutionRoleE76DAD4C', 'Arn'] },
            ResourceType: 'AMI_IMAGE',
            PolicyDetails: [
              {
                Action: { Type: 'DELETE', IncludeResources: { Amis: true, Snapshots: true } },
                Filter: { Type: 'COUNT', Value: 5 },
              },
            ],
            ResourceSelection: { TagMap: { Environment: 'test' } },
          },
        },
        LifecyclePolicyExecutionRoleE76DAD4C: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/service-role/EC2ImageBuilderLifecycleExecutionPolicy',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'imagebuilder.amazonaws.com',
                  },
                },
              ],
            },
          },
        },
      }),
    });
  });

  test('with required parameters - container policy', () => {
    new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.CONTAINER_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { countFilter: { count: 5 } },
        },
      ],
      resourceSelection: {
        recipes: [
          ContainerRecipe.fromContainerRecipeAttributes(stack, 'ContainerRecipe', {
            containerRecipeArn:
              'arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/test-container-recipe/2.0.0',
          }),
        ],
      },
    });

    Template.fromStack(stack).templateMatches({
      Resources: Match.objectEquals({
        LifecyclePolicy8967ABEC: {
          Type: 'AWS::ImageBuilder::LifecyclePolicy',
          Properties: {
            Name: 'stack-lifecyclepolicy-a97ea585',
            ExecutionRole: { 'Fn::GetAtt': ['LifecyclePolicyExecutionRoleE76DAD4C', 'Arn'] },
            ResourceType: 'CONTAINER_IMAGE',
            PolicyDetails: [
              {
                Action: { Type: 'DELETE', IncludeResources: { Containers: true } },
                Filter: { Type: 'COUNT', Value: 5 },
              },
            ],
            ResourceSelection: { Recipes: [{ Name: 'test-container-recipe', SemanticVersion: '2.0.0' }] },
          },
        },
        LifecyclePolicyExecutionRoleE76DAD4C: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/service-role/EC2ImageBuilderLifecycleExecutionPolicy',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'imagebuilder.amazonaws.com',
                  },
                },
              ],
            },
          },
        },
      }),
    });
  });

  test('with required parameters - recipe selection', () => {
    new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { countFilter: { count: 5 } },
        },
      ],
      resourceSelection: {
        recipes: [
          ImageRecipe.fromImageRecipeAttributes(stack, 'ImageRecipe', {
            imageRecipeName: 'test-image-recipe',
            imageRecipeVersion: '1.0.0',
          }),
        ],
      },
    });

    Template.fromStack(stack).templateMatches({
      Resources: Match.objectEquals({
        LifecyclePolicy8967ABEC: {
          Type: 'AWS::ImageBuilder::LifecyclePolicy',
          Properties: {
            Name: 'stack-lifecyclepolicy-a97ea585',
            ExecutionRole: { 'Fn::GetAtt': ['LifecyclePolicyExecutionRoleE76DAD4C', 'Arn'] },
            ResourceType: 'AMI_IMAGE',
            PolicyDetails: [
              {
                Action: { Type: 'DELETE', IncludeResources: { Amis: true, Snapshots: true } },
                Filter: { Type: 'COUNT', Value: 5 },
              },
            ],
            ResourceSelection: { Recipes: [{ Name: 'test-image-recipe', SemanticVersion: '1.0.0' }] },
          },
        },
        LifecyclePolicyExecutionRoleE76DAD4C: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/service-role/EC2ImageBuilderLifecycleExecutionPolicy',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'imagebuilder.amazonaws.com',
                  },
                },
              ],
            },
          },
        },
      }),
    });
  });

  test('converts filter age to correct number of days', () => {
    new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { ageFilter: { age: cdk.Duration.days(1) } },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::LifecyclePolicy', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(2);

    template.hasResourceProperties(
      'AWS::ImageBuilder::LifecyclePolicy',
      Match.objectEquals({
        Name: 'stack-lifecyclepolicy-a97ea585',
        ExecutionRole: { 'Fn::GetAtt': ['LifecyclePolicyExecutionRoleE76DAD4C', 'Arn'] },
        ResourceType: 'AMI_IMAGE',
        PolicyDetails: [
          {
            Action: { Type: 'DELETE', IncludeResources: { Amis: true, Snapshots: true } },
            Filter: { Type: 'AGE', Value: 1, Unit: 'DAYS' },
          },
        ],
        ResourceSelection: { TagMap: { Environment: 'test' } },
      }),
    );
  });

  test('converts filter age to correct number of weeks', () => {
    new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { ageFilter: { age: cdk.Duration.days(1001) } },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::LifecyclePolicy', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(2);

    template.hasResourceProperties(
      'AWS::ImageBuilder::LifecyclePolicy',
      Match.objectEquals({
        Name: 'stack-lifecyclepolicy-a97ea585',
        ExecutionRole: { 'Fn::GetAtt': ['LifecyclePolicyExecutionRoleE76DAD4C', 'Arn'] },
        ResourceType: 'AMI_IMAGE',
        PolicyDetails: [
          {
            Action: { Type: 'DELETE', IncludeResources: { Amis: true, Snapshots: true } },
            Filter: { Type: 'AGE', Value: 143, Unit: 'WEEKS' },
          },
        ],
        ResourceSelection: { TagMap: { Environment: 'test' } },
      }),
    );
  });

  test('converts filter age to correct number of months', () => {
    new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { ageFilter: { age: cdk.Duration.days(7 * 1000 + 1) } },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::LifecyclePolicy', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(2);

    template.hasResourceProperties(
      'AWS::ImageBuilder::LifecyclePolicy',
      Match.objectEquals({
        Name: 'stack-lifecyclepolicy-a97ea585',
        ExecutionRole: { 'Fn::GetAtt': ['LifecyclePolicyExecutionRoleE76DAD4C', 'Arn'] },
        ResourceType: 'AMI_IMAGE',
        PolicyDetails: [
          {
            Action: { Type: 'DELETE', IncludeResources: { Amis: true, Snapshots: true } },
            Filter: { Type: 'AGE', Value: 234, Unit: 'MONTHS' },
          },
        ],
        ResourceSelection: { TagMap: { Environment: 'test' } },
      }),
    );
  });

  test('converts filter age to correct number of years', () => {
    new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { ageFilter: { age: cdk.Duration.days(30 * 1000 + 1) } },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::LifecyclePolicy', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(2);

    template.hasResourceProperties(
      'AWS::ImageBuilder::LifecyclePolicy',
      Match.objectEquals({
        Name: 'stack-lifecyclepolicy-a97ea585',
        ExecutionRole: { 'Fn::GetAtt': ['LifecyclePolicyExecutionRoleE76DAD4C', 'Arn'] },
        ResourceType: 'AMI_IMAGE',
        PolicyDetails: [
          {
            Action: { Type: 'DELETE', IncludeResources: { Amis: true, Snapshots: true } },
            Filter: { Type: 'AGE', Value: 83, Unit: 'YEARS' },
          },
        ],
        ResourceSelection: { TagMap: { Environment: 'test' } },
      }),
    );
  });

  test('grants read access to IAM roles', () => {
    const lifecyclePolicy = new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { countFilter: { count: 5 } },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    lifecyclePolicy.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::ImageBuilder::LifecyclePolicy', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(4);

    template.hasResourceProperties(
      'AWS::IAM::Policy',
      Match.objectEquals({
        PolicyName: Match.anyValue(),
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: 'imagebuilder:GetLifecyclePolicy',
              Resource: {
                'Fn::GetAtt': ['LifecyclePolicy8967ABEC', 'Arn'],
              },
            },
          ],
        },
        Roles: [
          {
            Ref: 'Role1ABCC5F0',
          },
        ],
      }),
    );
  });

  test('grants permissions to IAM roles', () => {
    const lifecyclePolicy = new LifecyclePolicy(stack, 'LifecyclePolicy', {
      resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
      details: [
        {
          action: { type: LifecyclePolicyActionType.DELETE },
          filter: { countFilter: { count: 5 } },
        },
      ],
      resourceSelection: { tags: { Environment: 'test' } },
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    lifecyclePolicy.grant(role, 'imagebuilder:DeleteLifecyclePolicy', 'imagebuilder:UpdateLifecyclePolicy');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::ImageBuilder::LifecyclePolicy', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(4);

    template.hasResourceProperties(
      'AWS::IAM::Policy',
      Match.objectEquals({
        PolicyName: Match.anyValue(),
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['imagebuilder:DeleteLifecyclePolicy', 'imagebuilder:UpdateLifecyclePolicy'],
              Resource: {
                'Fn::GetAtt': ['LifecyclePolicy8967ABEC', 'Arn'],
              },
            },
          ],
        },
        Roles: [
          {
            Ref: 'Role1ABCC5F0',
          },
        ],
      }),
    );
  });

  test('throws a validation error when the resource name is too long', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        lifecyclePolicyName: 'a'.repeat(129),
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(1) } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains spaces', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        lifecyclePolicyName: 'a lifecycle policy',
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(1) } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains underscores', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        lifecyclePolicyName: 'a_lifecycle_policy',
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(1) } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains uppercase characters', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        lifecyclePolicyName: 'ALifecyclePolicy',
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(1) } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when no recipe or tag selections are provided', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: {},
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when no rules are provided', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when more than 3 rules are provided', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { countFilter: { count: 5 } },
          },
          {
            action: { type: LifecyclePolicyActionType.DISABLE },
            filter: { countFilter: { count: 5 } },
          },
          {
            action: { type: LifecyclePolicyActionType.DEPRECATE },
            filter: { countFilter: { count: 5 } },
          },
          {
            action: { type: 'NonExistentAction' as LifecyclePolicyActionType },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when rules contain duplicate actions', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { countFilter: { count: 5 } },
          },
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when a container policy rule includes a disable action', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.CONTAINER_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DISABLE },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when a container policy rule includes a deprecate action', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.CONTAINER_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DEPRECATE },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when a container policy rule includes AMIs', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.CONTAINER_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE, includeAmis: true },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when a container policy rule includes snapshots', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.CONTAINER_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE, includeSnapshots: true },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when a container policy rule has AMI exclusion rules', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.CONTAINER_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { countFilter: { count: 5 } },
            exclusionRules: { amiExclusionRules: { tags: { Environment: 'test' } } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when an AMI policy rule includes containers', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE, includeContainers: true },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when rule filters contain both an age and count filter', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(10) }, countFilter: { count: 5 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when rule filters contain neither an age or count filter', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [{ action: { type: LifecyclePolicyActionType.DELETE }, filter: {} }],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when age filter is too large', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(365 * 1000 + 1) } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when both recipe and tag selections are provided', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { countFilter: { count: 5 } },
          },
        ],
        resourceSelection: {
          recipes: [
            ImageRecipe.fromImageRecipeArn(
              stack,
              'Recipe',
              'arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/test/x.x.x',
            ),
          ],
          tags: { Environment: 'test' },
        },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when the recipe is not a valid recipe type', () => {
    class BadRecipe extends cdk.Resource implements IRecipeBase {
      public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
        return iam.Grant.addToPrincipal({
          grantee,
          actions,
          resourceArns: ['*'],
          scope: stack,
        });
      }

      public grantRead(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, 'imagebuilder:GetBadRecipe');
      }

      public _isContainerRecipe(): this is IContainerRecipe {
        return false;
      }

      public _isImageRecipe(): this is IImageRecipe {
        return false;
      }
    }

    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(1) } },
          },
        ],
        resourceSelection: { recipes: [new BadRecipe(stack, 'BadRecipe')] },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when a container recipe is selected in an AMI policy', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(45) } },
          },
        ],
        resourceSelection: {
          recipes: [
            ContainerRecipe.fromContainerRecipeAttributes(stack, 'ContainerRecipe', {
              containerRecipeArn:
                'arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/test-container-recipe/2.0.0',
            }),
          ],
        },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when an image recipe is selected in a CONTAINER_IMAGE policy', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.CONTAINER_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(45) } },
          },
        ],
        resourceSelection: {
          recipes: [
            ImageRecipe.fromImageRecipeAttributes(stack, 'ImageRecipe', {
              imageRecipeName: 'test-image-recipe',
              imageRecipeVersion: '1.0.0',
            }),
          ],
        },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when providing an age filter below 1 day', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.hours(0) } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when providing retainAtLeast below the minimum', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(1), retainAtLeast: -1 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws an error when providing retainAtLeast above the maximum', () => {
    expect(() => {
      new LifecyclePolicy(stack, 'LifecyclePolicy', {
        resourceType: LifecyclePolicyResourceType.AMI_IMAGE,
        details: [
          {
            action: { type: LifecyclePolicyActionType.DELETE },
            filter: { ageFilter: { age: cdk.Duration.days(1), retainAtLeast: 11 } },
          },
        ],
        resourceSelection: { tags: { Environment: 'test' } },
      });
    }).toThrow(cdk.ValidationError);
  });
});
