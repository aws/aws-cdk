import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import { HttpTokens, InfrastructureConfiguration, Tenancy } from '../lib';

describe('Infrastructure Configuration', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by name', () => {
    const infrastructureConfiguration = InfrastructureConfiguration.fromInfrastructureConfigurationName(
      stack,
      'InfrastructureConfiguration',
      'imported-infrastructure-configuration-by-name',
    );

    expect(stack.resolve(infrastructureConfiguration.infrastructureConfigurationArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:infrastructure-configuration/imported-infrastructure-configuration-by-name',
        ],
      ],
    });
    expect(infrastructureConfiguration.infrastructureConfigurationName).toEqual(
      'imported-infrastructure-configuration-by-name',
    );
  });

  test('imported by name as an unresolved token', () => {
    const infrastructureConfiguration = InfrastructureConfiguration.fromInfrastructureConfigurationName(
      stack,
      'InfrastructureConfiguration',
      `test-infrastructure-configuration-${stack.partition}`,
    );

    expect(stack.resolve(infrastructureConfiguration.infrastructureConfigurationArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:infrastructure-configuration/test-infrastructure-configuration-',
          { Ref: 'AWS::Partition' },
        ],
      ],
    });
    expect(stack.resolve(infrastructureConfiguration.infrastructureConfigurationName)).toEqual({
      'Fn::Join': ['', ['test-infrastructure-configuration-', { Ref: 'AWS::Partition' }]],
    });
  });

  test('imported by arn', () => {
    const infrastructureConfiguration = InfrastructureConfiguration.fromInfrastructureConfigurationArn(
      stack,
      'InfrastructureConfiguration',
      'arn:aws:imagebuilder:us-east-1:123456789012:infrastructure-configuration/imported-infrastructure-configuration-by-arn',
    );

    expect(infrastructureConfiguration.infrastructureConfigurationArn).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:infrastructure-configuration/imported-infrastructure-configuration-by-arn',
    );
    expect(infrastructureConfiguration.infrastructureConfigurationName).toEqual(
      'imported-infrastructure-configuration-by-arn',
    );
  });

  test('with all parameters', () => {
    const vpc = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
      vpcId: 'vpc-123',
      publicSubnetIds: ['subnet-123456', 'subnet-abcdef'],
      availabilityZones: ['us-east-1a', 'us-east-1b'],
    });

    const infrastructureConfiguration = new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
      infrastructureConfigurationName: 'infra-config-all-parameters',
      instanceProfile: iam.InstanceProfile.fromInstanceProfileName(
        stack,
        'InstanceProfile',
        'EC2InstanceProfileForImageBuilder',
      ),
      description: 'This is an infrastructure configuration.',
      ec2InstanceAvailabilityZone: stack.availabilityZones[0],
      ec2InstanceHostId: 'h-12345678',
      ec2InstanceTenancy: Tenancy.HOST,
      httpPutResponseHopLimit: 1,
      httpTokens: HttpTokens.OPTIONAL,
      instanceTypes: [
        ec2.InstanceType.of(ec2.InstanceClass.M7I_FLEX, ec2.InstanceSize.LARGE),
        ec2.InstanceType.of(ec2.InstanceClass.C7G, ec2.InstanceSize.MEDIUM),
      ],
      keyPair: ec2.KeyPair.fromKeyPairName(stack, 'KeyPair', 'key-pair-name'),
      logging: {
        s3Bucket: s3.Bucket.fromBucketName(stack, 'S3Bucket', 'imagebuilder-logging-bucket'),
        s3KeyPrefix: 'imagebuilder-logs',
      },
      notificationTopic: sns.Topic.fromTopicArn(
        stack,
        'ImageBuilderTopic',
        'arn:aws:sns:us-east-1:123456789012:imagebuilder-topic',
      ),
      resourceTags: {
        infraTag1: 'infraValue1',
        infraTag2: 'infraValue2',
      },
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-12345678')],
      vpc,
      subnetSelection: { subnets: vpc.publicSubnets },
      tags: {
        key1: 'value1',
        key2: 'value2',
      },
      terminateInstanceOnFailure: false,
    });

    expect(
      InfrastructureConfiguration.isInfrastructureConfiguration(infrastructureConfiguration as unknown),
    ).toBeTruthy();
    expect(InfrastructureConfiguration.isInfrastructureConfiguration('InfrastructureConfiguration')).toBeFalsy();

    Template.fromStack(stack).templateMatches({
      Resources: {
        InfrastructureConfiguration86C7777D: Match.objectEquals({
          Type: 'AWS::ImageBuilder::InfrastructureConfiguration',
          Properties: {
            Name: 'infra-config-all-parameters',
            InstanceProfileName: 'EC2InstanceProfileForImageBuilder',
            Description: 'This is an infrastructure configuration.',
            InstanceMetadataOptions: {
              HttpPutResponseHopLimit: 1,
              HttpTokens: 'optional',
            },
            InstanceTypes: ['m7i-flex.large', 'c7g.medium'],
            KeyPair: 'key-pair-name',
            Logging: {
              S3Logs: {
                S3BucketName: 'imagebuilder-logging-bucket',
                S3KeyPrefix: 'imagebuilder-logs',
              },
            },
            Placement: {
              AvailabilityZone: 'dummy1a',
              HostId: 'h-12345678',
              Tenancy: 'host',
            },
            ResourceTags: {
              infraTag1: 'infraValue1',
              infraTag2: 'infraValue2',
            },
            SecurityGroupIds: ['sg-12345678'],
            SnsTopicArn: 'arn:aws:sns:us-east-1:123456789012:imagebuilder-topic',
            SubnetId: 'subnet-123456',
            Tags: {
              key1: 'value1',
              key2: 'value2',
            },
            TerminateInstanceOnFailure: false,
          },
        }),
      },
    });
  });

  test('with a host ID', () => {
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
      ec2InstanceTenancy: Tenancy.HOST,
      ec2InstanceHostId: 'h-12345678',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        InfrastructureConfiguration86C7777D: Match.objectEquals({
          Type: 'AWS::ImageBuilder::InfrastructureConfiguration',
          Properties: {
            Name: 'stack-infrastructureconfiguration-fa45cca8',
            InstanceProfileName: {
              Ref: 'InfrastructureConfigurationInstanceProfile8FD9235B',
            },
            InstanceMetadataOptions: {
              HttpTokens: 'required',
              HttpPutResponseHopLimit: 2,
            },
            Placement: {
              HostId: 'h-12345678',
              Tenancy: 'host',
            },
          },
        }),
      },
    });
  });

  test('with a host resource group ARN', () => {
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
      ec2InstanceTenancy: Tenancy.HOST,
      ec2InstanceHostResourceGroupArn: 'arn:aws:resource-groups:us-east-1:123456789012:group/host-group',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        InfrastructureConfiguration86C7777D: Match.objectEquals({
          Type: 'AWS::ImageBuilder::InfrastructureConfiguration',
          Properties: {
            Name: 'stack-infrastructureconfiguration-fa45cca8',
            InstanceProfileName: {
              Ref: 'InfrastructureConfigurationInstanceProfile8FD9235B',
            },
            InstanceMetadataOptions: {
              HttpTokens: 'required',
              HttpPutResponseHopLimit: 2,
            },
            Placement: {
              HostResourceGroupArn: 'arn:aws:resource-groups:us-east-1:123456789012:group/host-group',
              Tenancy: 'host',
            },
          },
        }),
      },
    });
  });

  test('generates an instance profile by default', () => {
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration');

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonSSMManagedInstanceCore']],
        },
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/EC2InstanceProfileForImageBuilder']],
        },
      ],
    });
  });

  test('does not generate an instance profile when provided with one', () => {
    const instanceProfile = iam.InstanceProfile.fromInstanceProfileName(
      stack,
      'InstanceProfile',
      'ImportedInstanceProfile',
    );
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', { instanceProfile });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::InstanceProfile', 0);
    template.resourceCountIs('AWS::IAM::Role', 0);
    template.templateMatches({
      Resources: {
        InfrastructureConfiguration86C7777D: Match.objectEquals({
          Type: 'AWS::ImageBuilder::InfrastructureConfiguration',
          Properties: {
            Name: 'stack-infrastructureconfiguration-fa45cca8',
            InstanceProfileName: 'ImportedInstanceProfile',
            InstanceMetadataOptions: {
              HttpTokens: 'required',
              HttpPutResponseHopLimit: 2,
            },
          },
        }),
      },
    });
  });

  test('does not generate an instance profile role when provided with one', () => {
    const role = iam.Role.fromRoleName(stack, 'Role', 'EC2InstanceProfileForImageBuilderRole');
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', { role });

    Template.fromStack(stack).templateMatches({
      Resources: {
        InfrastructureConfigurationInstanceProfile8FD9235B: {
          Type: 'AWS::IAM::InstanceProfile',
          Properties: {
            Roles: ['EC2InstanceProfileForImageBuilderRole'],
          },
        },
        InfrastructureConfiguration86C7777D: Match.objectEquals({
          Type: 'AWS::ImageBuilder::InfrastructureConfiguration',
          Properties: {
            Name: 'stack-infrastructureconfiguration-fa45cca8',
            InstanceProfileName: {
              Ref: 'InfrastructureConfigurationInstanceProfile8FD9235B',
            },
            InstanceMetadataOptions: {
              HttpTokens: 'required',
              HttpPutResponseHopLimit: 2,
            },
          },
        }),
      },
    });
  });

  test('attaches the EC2InstanceProfileForImageBuilderECRContainerBuilds managed policy in container build contexts', () => {
    const infrastructureConfiguration = new InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
    infrastructureConfiguration._bind({ isContainerBuild: true });

    Template.fromStack(stack).templateMatches({
      Resources: {
        InfrastructureConfigurationInstanceProfileRole3AFA1533: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonSSMManagedInstanceCore']],
              },
              {
                'Fn::Join': [
                  '',
                  ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/EC2InstanceProfileForImageBuilder'],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/EC2InstanceProfileForImageBuilderECRContainerBuilds',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'ec2.amazonaws.com',
                  },
                },
              ],
            },
          },
        },
        InfrastructureConfigurationInstanceProfile8FD9235B: {
          Type: 'AWS::IAM::InstanceProfile',
          Properties: {
            Roles: [
              {
                Ref: 'InfrastructureConfigurationInstanceProfileRole3AFA1533',
              },
            ],
          },
        },
        InfrastructureConfiguration86C7777D: Match.objectEquals({
          Type: 'AWS::ImageBuilder::InfrastructureConfiguration',
          Properties: {
            Name: 'stack-infrastructureconfiguration-fa45cca8',
            InstanceProfileName: {
              Ref: 'InfrastructureConfigurationInstanceProfile8FD9235B',
            },
            InstanceMetadataOptions: {
              HttpTokens: 'required',
              HttpPutResponseHopLimit: 2,
            },
          },
        }),
      },
    });
  });

  test('does not attach the EC2InstanceProfileForImageBuilderECRContainerBuilds managed policy in container build contexts when a user-provided role is passed', () => {
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('EC2InstanceProfileForImageBuilder'),
      ],
    });
    const infrastructureConfiguration = new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', { role });
    infrastructureConfiguration._bind({ isContainerBuild: true });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonSSMManagedInstanceCore']],
        },
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/EC2InstanceProfileForImageBuilder']],
        },
      ],
    });
  });

  test('does not pass an instance type list when it is empty', () => {
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', { instanceTypes: [] });

    Template.fromStack(stack).templateMatches({
      Resources: {
        InfrastructureConfiguration86C7777D: Match.objectEquals({
          Type: 'AWS::ImageBuilder::InfrastructureConfiguration',
          Properties: {
            Name: 'stack-infrastructureconfiguration-fa45cca8',
            InstanceProfileName: {
              Ref: 'InfrastructureConfigurationInstanceProfile8FD9235B',
            },
            InstanceMetadataOptions: {
              HttpTokens: 'required',
              HttpPutResponseHopLimit: 2,
            },
          },
        }),
      },
    });
  });

  test('does not pass a security group list when it is empty', () => {
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', { securityGroups: [] });

    Template.fromStack(stack).templateMatches({
      Resources: {
        InfrastructureConfiguration86C7777D: Match.objectEquals({
          Type: 'AWS::ImageBuilder::InfrastructureConfiguration',
          Properties: {
            Name: 'stack-infrastructureconfiguration-fa45cca8',
            InstanceProfileName: {
              Ref: 'InfrastructureConfigurationInstanceProfile8FD9235B',
            },
            InstanceMetadataOptions: {
              HttpTokens: 'required',
              HttpPutResponseHopLimit: 2,
            },
          },
        }),
      },
    });
  });

  test('correct permissions granted to instance profile role when a key prefix is provided', () => {
    const instanceProfile = iam.InstanceProfile.fromInstanceProfileAttributes(stack, 'InstanceProfile', {
      instanceProfileArn: 'arn:aws:iam::123456789012:instance-profile/EC2InstanceProfileForImageBuilder',
      role: iam.Role.fromRoleName(stack, 'Role', 'EC2InstanceProfileForImageBuilderRole'),
    });
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
      instanceProfile,
      logging: {
        s3Bucket: s3.Bucket.fromBucketName(stack, 'S3Bucket', 'imagebuilder-logging-bucket'),
        s3KeyPrefix: 'imagebuilder-logs',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith(['s3:PutObject']),
            Resource: {
              'Fn::Join': [
                '',
                ['arn:', { Ref: 'AWS::Partition' }, ':s3:::imagebuilder-logging-bucket/imagebuilder-logs/*'],
              ],
            },
          },
        ],
      },
      Roles: ['EC2InstanceProfileForImageBuilderRole'],
    });
  });

  test('correct permissions granted to instance profile role when a key prefix is not provided', () => {
    const instanceProfile = iam.InstanceProfile.fromInstanceProfileAttributes(stack, 'InstanceProfile', {
      instanceProfileArn: 'arn:aws:iam::123456789012:instance-profile/EC2InstanceProfileForImageBuilder',
      role: iam.Role.fromRoleName(stack, 'Role', 'EC2InstanceProfileForImageBuilderRole'),
    });
    new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
      instanceProfile,
      logging: { s3Bucket: s3.Bucket.fromBucketName(stack, 'S3Bucket', 'imagebuilder-logging-bucket') },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith(['s3:PutObject']),
            Resource: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::imagebuilder-logging-bucket/*']],
            },
          },
        ],
      },
      Roles: ['EC2InstanceProfileForImageBuilderRole'],
    });
  });

  test('grants read access to IAM roles', () => {
    const infrastructureConfiguration = new InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    infrastructureConfiguration.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(5);

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
            Action: 'imagebuilder:GetInfrastructureConfiguration',
            Resource: {
              'Fn::GetAtt': ['InfrastructureConfiguration86C7777D', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants permissions to IAM roles', () => {
    const infrastructureConfiguration = new InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    infrastructureConfiguration.grant(
      role,
      'imagebuilder:DeleteInfrastructureConfiguration',
      'imagebuilder:UpdateInfrastructureConfiguration',
    );

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(5);

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
            Action: [
              'imagebuilder:DeleteInfrastructureConfiguration',
              'imagebuilder:UpdateInfrastructureConfiguration',
            ],
            Resource: {
              'Fn::GetAtt': ['InfrastructureConfiguration86C7777D', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('throws a validation error when the resource name is too long', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        infrastructureConfigurationName: 'a'.repeat(129),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains spaces', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        infrastructureConfigurationName: 'a b c',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains underscores', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        infrastructureConfigurationName: 'a_b_c',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains uppercase characters', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        infrastructureConfigurationName: 'aBc',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when a subnet selection is provided without a VPC', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        subnetSelection: {
          subnetFilters: [ec2.SubnetFilter.byIds(['subnet-12345678'])],
        },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when no subnets are selected from the VPC', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        vpc: ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
          vpcId: 'vpc-123',
          availabilityZones: ['us-east-1a'],
          publicSubnetIds: ['subnet-12345678'],
          privateSubnetIds: ['subnet-87654321'],
        }),
        subnetSelection: { subnetFilters: [ec2.SubnetFilter.byIds([])] },
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when an instance profile and role are provided', () => {
    const instanceProfile = iam.InstanceProfile.fromInstanceProfileName(
      stack,
      'InstanceProfile',
      'ImportedInstanceProfile',
    );
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        instanceProfile,
        role,
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when tenancy is host without a host ID or host resource group ARN', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        ec2InstanceTenancy: Tenancy.HOST,
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when tenancy is not host but a host ID is provided', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        ec2InstanceHostId: 'h-12345678',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when tenancy is not host but a host resource group ARN is provided', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        ec2InstanceTenancy: Tenancy.DEDICATED,
        ec2InstanceHostResourceGroupArn: 'arn:aws:resource-groups:us-east-1:123456789012:group/host-group',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when both a host ID and host resource group ARN is provided', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        ec2InstanceTenancy: Tenancy.HOST,
        ec2InstanceHostId: 'h-12345678',
        ec2InstanceHostResourceGroupArn: 'arn:aws:resource-groups:us-east-1:123456789012:group/host-group',
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when httpPutResponseHopLimit is below the limit', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        httpPutResponseHopLimit: 0,
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when httpPutResponseHopLimit is above the limit', () => {
    expect(() => {
      new InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
        httpPutResponseHopLimit: 65,
      });
    }).toThrow(cdk.ValidationError);
  });
});
