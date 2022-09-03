import { throws } from 'assert';
import { Template, Match } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as batch from '../lib';

describe('Batch Compute Environment', () => {
  let expectedManagedDefaultComputeProps: any;
  let defaultServiceRole: any;

  let stack: cdk.Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'test-vpc');

    defaultServiceRole = {
      ServiceRole: {
        'Fn::GetAtt': [
          'testcomputeenvResourceServiceInstanceRole105069A5',
          'Arn',
        ],
      },
    };

    expectedManagedDefaultComputeProps = (overrides: any) => {
      return {
        ComputeResources: {
          AllocationStrategy: batch.AllocationStrategy.BEST_FIT,
          InstanceRole: {
            'Fn::GetAtt': [
              'testcomputeenvInstanceProfileCBD87EAB',
              'Arn',
            ],
          },
          InstanceTypes: [
            'optimal',
          ],
          MaxvCpus: 256,
          MinvCpus: 0,
          Subnets: [
            {
              Ref: 'testvpcPrivateSubnet1Subnet865FB50A',
            },
            {
              Ref: 'testvpcPrivateSubnet2Subnet23D3396F',
            },
          ],
          Type: batch.ComputeResourceType.ON_DEMAND,
          ...overrides,
        },
      };
    };
  });

  describe('when validating props', () => {
    test('should deny setting compute resources when using type unmanaged', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: false,
          computeResources: {
            vpc,
          },
        });
      });
    });
    test('should deny if creating a managed environment with no provided compute resource props', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
        });
      });
    });
    test('should fail setting launch template with name and id', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            launchTemplate: {
              launchTemplateName: 'test-template-name',
              launchTemplateId: 'test-template-id',
            },
          },
        });
      });
    });
    test('should fail setting launch template missing both template name or id', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            launchTemplate: {},
          },
        });
      });
    });
  });
  describe('using fargate resources', () => {
    test('should deny setting bid percentage', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            bidPercentage: -1,
          },
        });
      });
    });
    test('should deny setting allocation strategy', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            allocationStrategy: batch.AllocationStrategy.BEST_FIT,
          },
        });
      });
    });
    test('should deny setting desired vCPUs', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            desiredvCpus: 1,
          },
        });
      });
    });
    test('should deny setting min vCPUs', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            minvCpus: 1,
          },
        });
      });
    });
    test('should deny setting image', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            image: ec2.MachineImage.latestAmazonLinux(),
          },
        });
      });
    });
    test('should deny setting instance types', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            instanceTypes: [],
          },
        });
      });
    });
    test('should deny setting EC2 key pair', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            ec2KeyPair: 'test',
          },
        });
      });
    });
    test('should deny setting instance role', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            instanceRole: 'test',
          },
        });
      });
    });
    test('should deny setting launch template', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            launchTemplate: {
              launchTemplateName: 'test-template',
            },
          },
        });
      });
    });
    test('should deny setting placement group', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            placementGroup: 'test',
          },
        });
      });
    });
    test('should deny setting spot fleet role', () => {
      // THEN
      throws(() => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
            spotFleetRole: iam.Role.fromRoleArn(stack, 'test-role-arn', 'test-role'),
          },
        });
      });
    });
  });

  describe('using spot resources', () => {
    test('should provide a spot fleet role if one is not given and allocationStrategy is BEST_FIT', () => {
      // WHEN
      new batch.ComputeEnvironment(stack, 'test-compute-env', {
        managed: true,
        computeResources: {
          type: batch.ComputeResourceType.SPOT,
          allocationStrategy: batch.AllocationStrategy.BEST_FIT,
          vpc,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
        Type: 'MANAGED',
        ...expectedManagedDefaultComputeProps({
          Type: batch.ComputeResourceType.SPOT,
          SpotIamFleetRole: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::',
                {
                  Ref: 'AWS::AccountId',
                },
                ':role/aws-service-role/spotfleet.amazonaws.com/AWSServiceRoleForEC2SpotFleet',
              ],
            ],
          },
        }),
      });
    });

    describe('with a bid percentage', () => {
      test('should deny my bid if set below 0', () => {
        // THEN
        throws(() => {
          // WHEN
          new batch.ComputeEnvironment(stack, 'test-compute-env', {
            managed: true,
            computeResources: {
              vpc,
              type: batch.ComputeResourceType.SPOT,
              bidPercentage: -1,
            },
          });
        });
      });

      test('should deny my bid if above 100', () => {
        // THEN
        throws(() => {
          // WHEN
          new batch.ComputeEnvironment(stack, 'test-compute-env', {
            managed: true,
            computeResources: {
              vpc,
              type: batch.ComputeResourceType.SPOT,
              bidPercentage: 101,
            },
          });
        });
      });
    });
  });

  describe('with properties specified', () => {
    test('renders the correct cloudformation properties', () => {
      // WHEN
      const props = {
        computeEnvironmentName: 'my-test-compute-env',
        computeResources: {
          allocationStrategy: batch.AllocationStrategy.BEST_FIT,
          vpc,
          computeResourcesTags: {
            'Name': 'AWS Batch Instance - C4OnDemand',
            'Tag Other': 'Has other value',
          },
          desiredvCpus: 1,
          ec2KeyPair: 'my-key-pair',
          image: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD),
          instanceRole: new iam.CfnInstanceProfile(stack, 'Instance-Profile', {
            roles: [new iam.Role(stack, 'Ecs-Instance-Role', {
              assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
              managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceforEC2Role'),
              ],
            }).roleName],
          }).attrArn,
          instanceTypes: [
            ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
          ],
          maxvCpus: 4,
          minvCpus: 1,
          placementGroup: 'example-cluster-group',
          securityGroups: [
            new ec2.SecurityGroup(stack, 'test-sg', {
              vpc,
              allowAllOutbound: true,
            }),
          ],
          type: batch.ComputeResourceType.ON_DEMAND,
          vpcSubnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          },
        } as batch.ComputeResources,
        enabled: false,
        managed: true,
      };

      new batch.ComputeEnvironment(stack, 'test-compute-env', props);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
        ComputeEnvironmentName: 'my-test-compute-env',
        Type: 'MANAGED',
        State: 'DISABLED',
        ServiceRole: {
          'Fn::GetAtt': [
            'testcomputeenvResourceServiceInstanceRole105069A5',
            'Arn',
          ],
        },
        ComputeResources: {
          AllocationStrategy: batch.AllocationStrategy.BEST_FIT,
          DesiredvCpus: props.computeResources.desiredvCpus,
          Ec2KeyPair: props.computeResources.ec2KeyPair,
          ImageId: {
            Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
          },
          InstanceRole: {
            'Fn::GetAtt': [
              props.computeResources.instanceRole ? 'InstanceProfile' : '',
              'Arn',
            ],
          },
          InstanceTypes: [
            props.computeResources.instanceTypes ? props.computeResources.instanceTypes[0].toString() : '',
          ],
          MaxvCpus: props.computeResources.maxvCpus,
          MinvCpus: props.computeResources.minvCpus,
          PlacementGroup: props.computeResources.placementGroup,
          SecurityGroupIds: [
            {
              'Fn::GetAtt': [
                'testsg872EB48A',
                'GroupId',
              ],
            },
          ],
          Subnets: [
            {
              Ref: `${cdk.Names.uniqueId(vpc)}PrivateSubnet1Subnet865FB50A`,
            },
            {
              Ref: `${cdk.Names.uniqueId(vpc)}PrivateSubnet2Subnet23D3396F`,
            },
          ],
          Tags: {
            'Name': 'AWS Batch Instance - C4OnDemand',
            'Tag Other': 'Has other value',
          },
          Type: 'EC2',
        },
      });
    });

    describe('with no allocation strategy specified', () => {
      test('should default to a best_fit strategy', () => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
          Type: 'MANAGED',
          ServiceRole: {
            'Fn::GetAtt': [
              'testcomputeenvResourceServiceInstanceRole105069A5',
              'Arn',
            ],
          },
        });
      });
    });

    describe('with a min vcpu value', () => {
      test('should deny less than 0', () => {
        // THEN
        throws(() => {
          // WHEN
          new batch.ComputeEnvironment(stack, 'test-compute-env', {
            computeResources: {
              vpc,
              minvCpus: -1,
            },
          });
        });
      });

      test('cannot be greater than the max vcpu value', () => {
        // THEN
        throws(() => {
          // WHEN
          new batch.ComputeEnvironment(stack, 'test-compute-env', {
            computeResources: {
              vpc,
              minvCpus: 2,
              maxvCpus: 1,
            },
          });
        });
      });
    });

    describe('with no min vcpu value provided', () => {
      test('should default to 0', () => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
          ...defaultServiceRole,
          ...expectedManagedDefaultComputeProps({
            MinvCpus: 0,
          }),
        });
      });
    });

    describe('with no max vcpu value provided', () => {
      test('should default to 256', () => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
          ...expectedManagedDefaultComputeProps({
            MaxvCpus: 256,
          }),
        });
      });
    });

    describe('with no instance role specified', () => {
      test('should generate a role for me', () => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
          },
        });

        // THEN
        Template.fromStack(stack).resourceCountIs('AWS::Batch::ComputeEnvironment', 1);
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 2);
      });
    });

    describe('with no instance type defined', () => {
      test('should default to optimal matching', () => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
          ...expectedManagedDefaultComputeProps({
            InstanceTypes: ['optimal'],
          }),
        });
      });
    });

    describe('with no type specified', () => {
      test('should default to EC2', () => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
          ...expectedManagedDefaultComputeProps({
            Type: batch.ComputeResourceType.ON_DEMAND,
          }),
        });
      });
    });

    describe('without useNetworkInterfaceSecurityGroups', () => {
      test('should not have securityGroups', () => {
        // THEN
        throws(() => {
          // WHEN
          new batch.ComputeEnvironment(stack, 'test-compute-env', {
            managed: true,
            computeResources: {
              vpc,
              launchTemplate: {
                useNetworkInterfaceSecurityGroups: true,
                launchTemplateName: 'dummyname',
              },
              securityGroups: [],
            },
          });
        });
      });

      test('should not have a SecurityGroupIds output', () => {
        // WHEN
        new batch.ComputeEnvironment(stack, 'efa-compute-env', {
          managed: true,
          computeResources: {
            vpc,
            launchTemplate: {
              useNetworkInterfaceSecurityGroups: true,
              launchTemplateName: 'dummyname',
            },
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties(
          'AWS::Batch::ComputeEnvironment', {
            ComputeResources: {
              SecurityGroupIds: Match.absent(),
            },
          },
        );
      });
    });

    describe('connectable functions', () => {
      test('ec2 ingress rule', () => {
        const computeEnvironment = new batch.ComputeEnvironment(stack, 'test-compute-env', {
          managed: true,
          computeResources: {
            vpc,
          },
        });

        const sg1 = new ec2.SecurityGroup(stack, 'SomeSecurityGroup', { vpc, allowAllOutbound: false });
        const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroups: [sg1] }));

        somethingConnectable.connections.allowFrom(computeEnvironment, ec2.Port.tcp(12345), 'connect to me');

        Template.fromStack(stack).hasResourceProperties
        ('AWS::EC2::SecurityGroupIngress', {
          GroupId: { 'Fn::GetAtt': ['SomeSecurityGroupEF219AD6', 'GroupId'] },
          IpProtocol: 'tcp',
          Description: 'connect to me',
          SourceSecurityGroupId: { 'Fn::GetAtt': ['testcomputeenvResourceSecurityGroup7615BA87', 'GroupId'] },
          FromPort: 12345,
          ToPort: 12345,
        });
      });

      test('fargate ingress rule', () => {
        const computeEnvironment = new batch.ComputeEnvironment(stack, 'test-fargate-env', {
          managed: true,
          computeResources: {
            vpc,
            type: batch.ComputeResourceType.FARGATE,
          },
        });

        const sg1 = new ec2.SecurityGroup(stack, 'SomeSecurityGroup', { vpc, allowAllOutbound: false });
        const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroups: [sg1] }));

        somethingConnectable.connections.allowFrom(computeEnvironment, ec2.Port.tcp(12345), 'connect to me');

        Template.fromStack(stack).hasResourceProperties
        ('AWS::EC2::SecurityGroupIngress', {
          GroupId: { 'Fn::GetAtt': ['SomeSecurityGroupEF219AD6', 'GroupId'] },
          IpProtocol: 'tcp',
          Description: 'connect to me',
          SourceSecurityGroupId: { 'Fn::GetAtt': ['testfargateenvResourceSecurityGroup66A2FC03', 'GroupId'] },
          FromPort: 12345,
          ToPort: 12345,
        });
      });
    });
  });
});

class SomethingConnectable implements ec2.IConnectable {
  constructor(public readonly connections: ec2.Connections) {
  }
}
