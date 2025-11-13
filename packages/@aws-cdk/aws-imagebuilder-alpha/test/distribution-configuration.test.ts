import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { DistributionConfiguration, Repository } from '../lib';

describe('Distribution Configuration', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by name', () => {
    const distributionConfiguration = DistributionConfiguration.fromDistributionConfigurationName(
      stack,
      'DistributionConfiguration',
      'imported-distribution-configuration-by-name',
    );

    expect(stack.resolve(distributionConfiguration.distributionConfigurationArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:distribution-configuration/imported-distribution-configuration-by-name',
        ],
      ],
    });
    expect(distributionConfiguration.distributionConfigurationName).toEqual(
      'imported-distribution-configuration-by-name',
    );
  });

  test('imported by name as an unresolved token', () => {
    const distributionConfiguration = DistributionConfiguration.fromDistributionConfigurationName(
      stack,
      'DistributionConfiguration',
      `test-distribution-configuration-${stack.partition}`,
    );

    expect(stack.resolve(distributionConfiguration.distributionConfigurationArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:distribution-configuration/test-distribution-configuration-',
          { Ref: 'AWS::Partition' },
        ],
      ],
    });
    expect(stack.resolve(distributionConfiguration.distributionConfigurationName)).toEqual({
      'Fn::Join': ['', ['test-distribution-configuration-', { Ref: 'AWS::Partition' }]],
    });
  });

  test('imported by arn', () => {
    const distributionConfiguration = DistributionConfiguration.fromDistributionConfigurationArn(
      stack,
      'DistributionConfiguration',
      'arn:aws:imagebuilder:us-east-1:123456789012:distribution-configuration/imported-distribution-configuration-by-arn',
    );

    expect(distributionConfiguration.distributionConfigurationArn).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:distribution-configuration/imported-distribution-configuration-by-arn',
    );
    expect(distributionConfiguration.distributionConfigurationName).toEqual(
      'imported-distribution-configuration-by-arn',
    );
  });

  test('with all parameters', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration', {
      distributionConfigurationName: 'test-distribution-configuration',
      description: 'A Distribution Configuration',
      amiDistributions: [
        {
          region: 'us-east-2',
          fastLaunchConfigurations: [
            {
              enabled: true,
              launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'CrossRegionFastLaunchLT', {
                launchTemplateId: 'lt-987',
              }),
            },
          ],
          ssmParameters: [
            {
              parameter: ssm.StringParameter.fromStringParameterAttributes(stack, 'CrossRegionParameter', {
                parameterName: '/imagebuilder/ami',
                forceDynamicReference: true,
              }),
            },
          ],
        },
      ],
      containerDistributions: [
        {
          region: 'us-east-2',
          containerRepository: Repository.fromEcr(
            ecr.Repository.fromRepositoryName(stack, 'CrossRegionTargetRepository', 'cross-region-target-repository'),
          ),
          containerDescription: 'Test cross-region container image',
          containerTags: ['latest', 'latest-1.0'],
        },
      ],
      tags: {
        key1: 'value1',
        key2: 'value2',
      },
    });

    distributionConfiguration.addAmiDistributions({
      amiName: 'imagebuilder-{{ imagebuilder:buildDate }}',
      amiDescription: 'Build AMI',
      amiKmsKey: kms.Alias.fromAliasName(stack, 'DistributedAMIKey', 'alias/distribution-encryption-key'),
      amiTargetAccountIds: ['123456789012', '098765432109'],
      amiLaunchPermission: {
        organizationArns: [
          stack.formatArn({
            region: '',
            service: 'organizations',
            resource: 'organization',
            resourceName: 'o-1234567abc',
          }),
        ],
        organizationalUnitArns: [
          stack.formatArn({
            region: '',
            service: 'organizations',
            resource: 'ou',
            resourceName: 'o-1234567abc/ou-a123-b4567890',
          }),
        ],
        isPublicUserGroup: true,
        accountIds: ['234567890123'],
      },
      amiTags: {
        Environment: 'test',
        Version: '{{ imagebuilder:buildVersion }}',
      },
      ssmParameters: [
        {
          parameter: ssm.StringParameter.fromStringParameterAttributes(stack, 'Parameter', {
            parameterName: '/imagebuilder/ami',
            forceDynamicReference: true,
          }),
        },
        {
          amiAccount: '098765432109',
          dataType: ssm.ParameterDataType.TEXT,
          parameter: ssm.StringParameter.fromStringParameterAttributes(stack, 'CrossAccountParameter', {
            parameterName: 'imagebuilder-prod-ami',
            forceDynamicReference: true,
          }),
        },
      ],
      launchTemplates: [
        {
          launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'LaunchTemplate', {
            launchTemplateId: 'lt-123',
          }),
          setDefaultVersion: true,
        },
        {
          accountId: '123456789012',
          launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'CrossAccountLaunchTemplate', {
            launchTemplateId: 'lt-456',
          }),
          setDefaultVersion: false,
        },
      ],
      fastLaunchConfigurations: [
        {
          enabled: true,
          launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'FastLaunchLT', {
            launchTemplateName: 'fast-launch-lt',
            versionNumber: '2',
          }),
          maxParallelLaunches: 10,
          targetSnapshotCount: 25,
        },
      ],
      licenseConfigurationArns: [
        stack.formatArn({
          service: 'license-manager',
          resource: 'license-configuration',
          resourceName: 'lic-abcdefghijklmnopqrstuvwxyz123456',
          arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
        }),
      ],
    });

    distributionConfiguration.addContainerDistributions({
      containerRepository: Repository.fromEcr(
        ecr.Repository.fromRepositoryName(stack, 'TargetRepository', 'target-repository'),
      ),
      containerDescription: 'Test container image',
      containerTags: ['default', 'default-1.0'],
    });

    expect(DistributionConfiguration.isDistributionConfiguration(distributionConfiguration as unknown)).toBeTruthy();
    expect(DistributionConfiguration.isDistributionConfiguration('DistributionConfiguration')).toBeFalsy();

    Template.fromStack(stack).templateMatches({
      Resources: {
        DistributionConfiguration26801BDF: Match.objectEquals({
          Type: 'AWS::ImageBuilder::DistributionConfiguration',
          Properties: {
            Name: 'test-distribution-configuration',
            Description: 'A Distribution Configuration',
            Distributions: [
              {
                Region: 'us-east-2',
                ContainerDistributionConfiguration: {
                  ContainerTags: ['latest', 'latest-1.0'],
                  Description: 'Test cross-region container image',
                  TargetRepository: {
                    RepositoryName: 'cross-region-target-repository',
                    Service: 'ECR',
                  },
                },
                FastLaunchConfigurations: [
                  { Enabled: true, LaunchTemplate: { LaunchTemplateId: 'lt-987', LaunchTemplateVersion: '$Default' } },
                ],
                SsmParameterConfigurations: [{ ParameterName: '/imagebuilder/ami' }],
              },
              {
                Region: 'us-east-1',
                AmiDistributionConfiguration: {
                  Name: 'imagebuilder-{{ imagebuilder:buildDate }}',
                  Description: 'Build AMI',
                  KmsKeyId: {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':kms:us-east-1:123456789012:alias/distribution-encryption-key',
                      ],
                    ],
                  },
                  LaunchPermissionConfiguration: {
                    OrganizationArns: [
                      {
                        'Fn::Join': [
                          '',
                          ['arn:', { Ref: 'AWS::Partition' }, ':organizations::123456789012:organization/o-1234567abc'],
                        ],
                      },
                    ],
                    OrganizationalUnitArns: [
                      {
                        'Fn::Join': [
                          '',
                          [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':organizations::123456789012:ou/o-1234567abc/ou-a123-b4567890',
                          ],
                        ],
                      },
                    ],
                    UserGroups: ['all'],
                    UserIds: ['234567890123'],
                  },
                  TargetAccountIds: ['123456789012', '098765432109'],
                  AmiTags: {
                    Environment: 'test',
                    Version: '{{ imagebuilder:buildVersion }}',
                  },
                },
                ContainerDistributionConfiguration: {
                  ContainerTags: ['default', 'default-1.0'],
                  Description: 'Test container image',
                  TargetRepository: {
                    RepositoryName: 'target-repository',
                    Service: 'ECR',
                  },
                },
                FastLaunchConfigurations: [
                  {
                    Enabled: true,
                    LaunchTemplate: { LaunchTemplateName: 'fast-launch-lt', LaunchTemplateVersion: '2' },
                    MaxParallelLaunches: 10,
                    SnapshotConfiguration: { TargetResourceCount: 25 },
                  },
                ],
                LaunchTemplateConfigurations: [
                  { LaunchTemplateId: 'lt-123', SetDefaultVersion: true },
                  { AccountId: '123456789012', LaunchTemplateId: 'lt-456', SetDefaultVersion: false },
                ],
                LicenseConfigurationArns: [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':license-manager:us-east-1:123456789012:license-configuration:lic-abcdefghijklmnopqrstuvwxyz123456',
                      ],
                    ],
                  },
                ],
                SsmParameterConfigurations: [
                  { ParameterName: '/imagebuilder/ami' },
                  { AmiAccountId: '098765432109', DataType: 'text', ParameterName: 'imagebuilder-prod-ami' },
                ],
              },
            ],
            Tags: {
              key1: 'value1',
              key2: 'value2',
            },
          },
        }),
      },
    });
  });

  test('with required parameters - AMI distribution', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration');
    distributionConfiguration.addAmiDistributions({ amiName: 'imagebuilder-{{ imagebuilder:buildDate }}' });

    Template.fromStack(stack).templateMatches({
      Resources: {
        DistributionConfiguration26801BDF: Match.objectEquals({
          Type: 'AWS::ImageBuilder::DistributionConfiguration',
          Properties: {
            Name: 'stack-distributionconfiguration-15e7372b',
            Distributions: [
              {
                Region: 'us-east-1',
                AmiDistributionConfiguration: {
                  Name: 'imagebuilder-{{ imagebuilder:buildDate }}',
                },
              },
            ],
          },
        }),
      },
    });
  });

  test('with required parameters - container distribution', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration');
    distributionConfiguration.addContainerDistributions({
      containerRepository: Repository.fromEcr(
        ecr.Repository.fromRepositoryName(stack, 'TargetRepository', 'target-repository'),
      ),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        DistributionConfiguration26801BDF: Match.objectEquals({
          Type: 'AWS::ImageBuilder::DistributionConfiguration',
          Properties: {
            Name: 'stack-distributionconfiguration-15e7372b',
            Distributions: [
              {
                Region: 'us-east-1',
                ContainerDistributionConfiguration: {
                  TargetRepository: {
                    RepositoryName: 'target-repository',
                    Service: 'ECR',
                  },
                },
              },
            ],
          },
        }),
      },
    });
  });

  test('grants read access to IAM roles', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration');
    distributionConfiguration.addAmiDistributions({ amiName: 'imagebuilder-{{ imagebuilder:buildDate }}' });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    distributionConfiguration.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::DistributionConfiguration', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']],
              },
            },
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: 'imagebuilder:GetDistributionConfiguration',
            Resource: {
              'Fn::GetAtt': ['DistributionConfiguration26801BDF', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants permissions to IAM roles', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration');
    distributionConfiguration.addAmiDistributions({ amiName: 'imagebuilder-{{ imagebuilder:buildDate }}' });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    distributionConfiguration.grant(
      role,
      'imagebuilder:DeleteDistributionConfiguration',
      'imagebuilder:UpdateDistributionConfiguration',
    );

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::DistributionConfiguration', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']],
              },
            },
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: ['imagebuilder:DeleteDistributionConfiguration', 'imagebuilder:UpdateDistributionConfiguration'],
            Resource: {
              'Fn::GetAtt': ['DistributionConfiguration26801BDF', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('throws a validation error when the resource name contains spaces', () => {
    expect(() => {
      new DistributionConfiguration(stack, 'DistributionConfiguration', {
        distributionConfigurationName: 'a name with spaces',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains underscores', () => {
    expect(() => {
      new DistributionConfiguration(stack, 'DistributionConfiguration', {
        distributionConfigurationName: 'a_name_with_underscores',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains uppercase characters', () => {
    expect(() => {
      new DistributionConfiguration(stack, 'DistributionConfiguration', {
        distributionConfigurationName: 'ANameWithUppercaseCharacters',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when providing multiple AMI distributions for the same region', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration');
    distributionConfiguration.addAmiDistributions({ amiName: 'imagebuilder-{{ imagebuilder:buildDate }}' });

    expect(() => {
      distributionConfiguration.addAmiDistributions({ amiName: 'imagebuilder-{{ imagebuilder:buildDate }}' });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when providing multiple container distributions in the same region', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration');
    distributionConfiguration.addContainerDistributions({
      containerRepository: Repository.fromEcr(
        ecr.Repository.fromRepositoryName(stack, 'TargetRepository', 'target-repository'),
      ),
    });

    expect(() => {
      distributionConfiguration.addContainerDistributions({
        containerRepository: Repository.fromEcr(
          ecr.Repository.fromRepositoryName(stack, 'TargetRepository2', 'target-repository-2'),
        ),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when providing a max parallel launch below 6 for fast launch configurations', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration');
    distributionConfiguration.addAmiDistributions({ fastLaunchConfigurations: [{ maxParallelLaunches: 5 }] });

    expect(() => Template.fromStack(stack)).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when providing a launch template by name only for launch template configurations', () => {
    const distributionConfiguration = new DistributionConfiguration(stack, 'DistributionConfiguration');
    distributionConfiguration.addAmiDistributions({
      launchTemplates: [
        {
          launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'LaunchTemplate', {
            launchTemplateName: 'imagebuilder-launch-template',
          }),
        },
      ],
    });

    expect(() => Template.fromStack(stack)).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when no distributions are provided', () => {
    new DistributionConfiguration(stack, 'DistributionConfiguration');

    expect(() => Template.fromStack(stack)).toThrow(cdk.ValidationError);
  });
});
