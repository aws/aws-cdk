import { Match, Template } from '@aws-cdk/assertions';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as ecs from '../lib';

describe('cluster', () => {
  describe('isCluster() returns', () => {
    test('true if given cluster instance', () => {
      // GIVEN
      const stack = new cdk.Stack();
      // WHEN
      const createdCluster = new ecs.Cluster(stack, 'EcsCluster');
      // THEN
      expect(ecs.Cluster.isCluster(createdCluster)).toBe(true);
    });

    test('false if given imported cluster instance', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');

      const importedSg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG1', 'sg-1', { allowAllOutbound: false });
      // WHEN
      const importedCluster = ecs.Cluster.fromClusterAttributes(stack, 'Cluster', {
        clusterName: 'cluster-name',
        securityGroups: [importedSg],
        vpc,
      });
      // THEN
      expect(ecs.Cluster.isCluster(importedCluster)).toBe(false);
    });

    test('false if given undefined', () => {
      // THEN
      expect(ecs.Cluster.isCluster(undefined)).toBe(false);
    });
  });

  describe('When creating an ECS Cluster', () => {
    testDeprecated('with no properties set, it correctly sets default properties', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
      });

      Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
        InstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
        Tags: [
          {
            Key: 'Name',
            Value: 'Default/EcsCluster/Vpc',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
        ImageId: {
          Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
        },
        InstanceType: 't2.micro',
        IamInstanceProfile: {
          Ref: 'EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3',
        },
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231',
              'GroupId',
            ],
          },
        ],
        UserData: {
          'Fn::Base64': {
            'Fn::Join': [
              '',
              [
                '#!/bin/bash\necho ECS_CLUSTER=',
                {
                  Ref: 'EcsCluster97242B84',
                },
                // eslint-disable-next-line max-len
                ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
              ],
            ],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
        MaxSize: '1',
        MinSize: '1',
        LaunchConfigurationName: {
          Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
        },
        Tags: [
          {
            Key: 'Name',
            PropagateAtLaunch: true,
            Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
          },
        ],
        VPCZoneIdentifier: [
          {
            Ref: 'EcsClusterVpcPrivateSubnet1SubnetFAB0E487',
          },
          {
            Ref: 'EcsClusterVpcPrivateSubnet2SubnetC2B7B1BA',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup',
        SecurityGroupEgress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow all outbound traffic by default',
            IpProtocol: '-1',
          },
        ],
        Tags: [
          {
            Key: 'Name',
            Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
          },
        ],
        VpcId: {
          Ref: 'EcsClusterVpc779914AB',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
          Version: '2012-10-17',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'ecs:DeregisterContainerInstance',
                'ecs:RegisterContainerInstance',
                'ecs:Submit*',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'EcsCluster97242B84',
                  'Arn',
                ],
              },
            },
            {
              Action: [
                'ecs:Poll',
                'ecs:StartTelemetrySession',
              ],
              Effect: 'Allow',
              Resource: '*',
              Condition: {
                ArnEquals: {
                  'ecs:cluster': {
                    'Fn::GetAtt': [
                      'EcsCluster97242B84',
                      'Arn',
                    ],
                  },
                },
              },
            },
            {
              Action: [
                'ecs:DiscoverPollEndpoint',
                'ecr:GetAuthorizationToken',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    testDeprecated('with only vpc set, it correctly sets default properties', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
      });

      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
      });

      Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
        InstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
        Tags: [
          {
            Key: 'Name',
            Value: 'Default/MyVpc',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
        ImageId: {
          Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
        },
        InstanceType: 't2.micro',
        IamInstanceProfile: {
          Ref: 'EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3',
        },
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231',
              'GroupId',
            ],
          },
        ],
        UserData: {
          'Fn::Base64': {
            'Fn::Join': [
              '',
              [
                '#!/bin/bash\necho ECS_CLUSTER=',
                {
                  Ref: 'EcsCluster97242B84',
                },
                // eslint-disable-next-line max-len
                ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
              ],
            ],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
        MaxSize: '1',
        MinSize: '1',
        LaunchConfigurationName: {
          Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
        },
        Tags: [
          {
            Key: 'Name',
            PropagateAtLaunch: true,
            Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
          },
        ],
        VPCZoneIdentifier: [
          {
            Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
          },
          {
            Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup',
        SecurityGroupEgress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow all outbound traffic by default',
            IpProtocol: '-1',
          },
        ],
        Tags: [
          {
            Key: 'Name',
            Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
          },
        ],
        VpcId: {
          Ref: 'MyVpcF9F0CA6F',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
          Version: '2012-10-17',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'ecs:DeregisterContainerInstance',
                'ecs:RegisterContainerInstance',
                'ecs:Submit*',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'EcsCluster97242B84',
                  'Arn',
                ],
              },
            },
            {
              Action: [
                'ecs:Poll',
                'ecs:StartTelemetrySession',
              ],
              Effect: 'Allow',
              Resource: '*',
              Condition: {
                ArnEquals: {
                  'ecs:cluster': {
                    'Fn::GetAtt': [
                      'EcsCluster97242B84',
                      'Arn',
                    ],
                  },
                },
              },
            },
            {
              Action: [
                'ecs:DiscoverPollEndpoint',
                'ecr:GetAuthorizationToken',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
      });


    });

    testDeprecated('multiple clusters with default capacity', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});

      // WHEN
      for (let i = 0; i < 2; i++) {
        const cluster = new ecs.Cluster(stack, `EcsCluster${i}`, { vpc });
        cluster.addCapacity('MyCapacity', {
          instanceType: new ec2.InstanceType('m3.medium'),
        });
      }


    });

    testDeprecated('lifecycle hook is automatically added', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
      });

      // WHEN
      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
        AutoScalingGroupName: { Ref: 'EcsClusterDefaultAutoScalingGroupASGC1A785DB' },
        LifecycleTransition: 'autoscaling:EC2_INSTANCE_TERMINATING',
        DefaultResult: 'CONTINUE',
        HeartbeatTimeout: 300,
        NotificationTargetARN: { Ref: 'EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopicACD2D4A4' },
        RoleARN: { 'Fn::GetAtt': ['EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B', 'Arn'] },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Timeout: 310,
        Environment: {
          Variables: {
            CLUSTER: {
              Ref: 'EcsCluster97242B84',
            },
          },
        },
        Handler: 'index.lambda_handler',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'ec2:DescribeInstances',
                'ec2:DescribeInstanceAttribute',
                'ec2:DescribeInstanceStatus',
                'ec2:DescribeHosts',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 'autoscaling:CompleteLifecycleAction',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':autoscaling:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':autoScalingGroup:*:autoScalingGroupName/',
                    {
                      Ref: 'EcsClusterDefaultAutoScalingGroupASGC1A785DB',
                    },
                  ],
                ],
              },
            },
            {
              Action: [
                'ecs:DescribeContainerInstances',
                'ecs:DescribeTasks',
              ],
              Effect: 'Allow',
              Resource: '*',
              Condition: {
                ArnEquals: {
                  'ecs:cluster': {
                    'Fn::GetAtt': [
                      'EcsCluster97242B84',
                      'Arn',
                    ],
                  },
                },
              },
            },
            {
              Action: [
                'ecs:ListContainerInstances',
                'ecs:SubmitContainerStateChange',
                'ecs:SubmitTaskStateChange',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'EcsCluster97242B84',
                  'Arn',
                ],
              },
            },
            {
              Action: [
                'ecs:UpdateContainerInstancesState',
                'ecs:ListTasks',
              ],
              Condition: {
                ArnEquals: {
                  'ecs:cluster': {
                    'Fn::GetAtt': [
                      'EcsCluster97242B84',
                      'Arn',
                    ],
                  },
                },
              },
              Effect: 'Allow',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRoleDefaultPolicyA45BF396',
        Roles: [
          {
            Ref: 'EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA',
          },
        ],
      });


    });

    testDeprecated('lifecycle hook with encrypted SNS is added correctly', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
      });
      const key = new kms.Key(stack, 'Key');

      // WHEN
      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
        topicEncryptionKey: key,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
        KmsMasterKeyId: {
          'Fn::GetAtt': [
            'Key961B73FD',
            'Arn',
          ],
        },
      });


    });

    testDeprecated('with capacity and cloudmap namespace properties set', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        capacity: {
          instanceType: new ec2.InstanceType('t2.micro'),
        },
        defaultCloudMapNamespace: {
          name: 'foo.com',
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
        Name: 'foo.com',
        Vpc: {
          Ref: 'MyVpcF9F0CA6F',
        },
      });

      Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
        InstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
        Tags: [
          {
            Key: 'Name',
            Value: 'Default/MyVpc',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
        ImageId: {
          Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
        },
        InstanceType: 't2.micro',
        IamInstanceProfile: {
          Ref: 'EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3',
        },
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231',
              'GroupId',
            ],
          },
        ],
        UserData: {
          'Fn::Base64': {
            'Fn::Join': [
              '',
              [
                '#!/bin/bash\necho ECS_CLUSTER=',
                {
                  Ref: 'EcsCluster97242B84',
                },
                // eslint-disable-next-line max-len
                ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
              ],
            ],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
        MaxSize: '1',
        MinSize: '1',
        LaunchConfigurationName: {
          Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
        },
        Tags: [
          {
            Key: 'Name',
            PropagateAtLaunch: true,
            Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
          },
        ],
        VPCZoneIdentifier: [
          {
            Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
          },
          {
            Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup',
        SecurityGroupEgress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow all outbound traffic by default',
            IpProtocol: '-1',
          },
        ],
        Tags: [
          {
            Key: 'Name',
            Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
          },
        ],
        VpcId: {
          Ref: 'MyVpcF9F0CA6F',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
          Version: '2012-10-17',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'ecs:DeregisterContainerInstance',
                'ecs:RegisterContainerInstance',
                'ecs:Submit*',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'EcsCluster97242B84',
                  'Arn',
                ],
              },
            },
            {
              Action: [
                'ecs:Poll',
                'ecs:StartTelemetrySession',
              ],
              Effect: 'Allow',
              Resource: '*',
              Condition: {
                ArnEquals: {
                  'ecs:cluster': {
                    'Fn::GetAtt': [
                      'EcsCluster97242B84',
                      'Arn',
                    ],
                  },
                },
              },
            },
            {
              Action: [
                'ecs:DiscoverPollEndpoint',
                'ecr:GetAuthorizationToken',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
      });


    });
  });

  testDeprecated('allows specifying instance type', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('m3.large'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      InstanceType: 'm3.large',
    });


  });

  testDeprecated('allows specifying cluster size', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      desiredCapacity: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      MaxSize: '3',
    });


  });

  testDeprecated('configures userdata with powershell if windows machine image is specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('WindowsAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: new ecs.EcsOptimizedAmi({
        windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceecsoptimizedamiwindowsserver2019englishfullrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
      },
      InstanceType: 't2.micro',
      IamInstanceProfile: {
        Ref: 'EcsClusterWindowsAutoScalingGroupInstanceProfile65DFA6BB',
      },
      SecurityGroups: [
        {
          'Fn::GetAtt': [
            'EcsClusterWindowsAutoScalingGroupInstanceSecurityGroupDA468DF1',
            'GroupId',
          ],
        },
      ],
      UserData: {
        'Fn::Base64': {
          'Fn::Join': [
            '',
            [
              '<powershell>Remove-Item -Recurse C:\\ProgramData\\Amazon\\ECS\\Cache\nImport-Module ECSTools\n[Environment]::SetEnvironmentVariable("ECS_CLUSTER", "',
              {
                Ref: 'EcsCluster97242B84',
              },
              "\", \"Machine\")\n[Environment]::SetEnvironmentVariable(\"ECS_ENABLE_AWSLOGS_EXECUTIONROLE_OVERRIDE\", \"true\", \"Machine\")\n[Environment]::SetEnvironmentVariable(\"ECS_AVAILABLE_LOGGING_DRIVERS\", '[\"json-file\",\"awslogs\"]', \"Machine\")\n[Environment]::SetEnvironmentVariable(\"ECS_ENABLE_TASK_IAM_ROLE\", \"true\", \"Machine\")\nInitialize-ECSAgent -Cluster '",
              {
                Ref: 'EcsCluster97242B84',
              },
              "' -EnableTaskIAMRole</powershell>",
            ],
          ],
        },
      },
    });


  });

  /*
   * TODO:v2.0.0 BEGINNING OF OBSOLETE BLOCK
   */
  testDeprecated('allows specifying special HW AMI Type', () => {
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('GpuAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: new ecs.EcsOptimizedAmi({
        hardwareType: ecs.AmiHardwareType.GPU,
      }),
    });

    // THEN
    const assembly = app.synth();
    const template = assembly.getStackByName(stack.stackName).template;
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2gpurecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });

    expect(template.Parameters).toEqual({
      SsmParameterValueawsserviceecsoptimizedamiamazonlinux2gpurecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
        Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
        Default: '/aws/service/ecs/optimized-ami/amazon-linux-2/gpu/recommended/image_id',
      },
    });


  });

  testDeprecated('errors if amazon linux given with special HW type', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    // THEN
    expect(() => {
      cluster.addCapacity('GpuAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: new ecs.EcsOptimizedAmi({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
          hardwareType: ecs.AmiHardwareType.GPU,
        }),
      });
    }).toThrow(/Amazon Linux does not support special hardware type/);


  });

  testDeprecated('allows specifying windows image', () => {
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('WindowsAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: new ecs.EcsOptimizedAmi({
        windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
      }),
    });

    // THEN
    const assembly = app.synth();
    const template = assembly.getStackByName(stack.stackName).template;
    expect(template.Parameters).toEqual({
      SsmParameterValueawsserviceecsoptimizedamiwindowsserver2019englishfullrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
        Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
        Default: '/aws/service/ecs/optimized-ami/windows_server/2019/english/full/recommended/image_id',
      },
    });


  });

  testDeprecated('errors if windows given with special HW type', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    // THEN
    expect(() => {
      cluster.addCapacity('WindowsGpuAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: new ecs.EcsOptimizedAmi({
          windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
          hardwareType: ecs.AmiHardwareType.GPU,
        }),
      });
    }).toThrow(/Windows Server does not support special hardware type/);


  });

  testDeprecated('errors if windowsVersion and linux generation are set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    // THEN
    expect(() => {
      cluster.addCapacity('WindowsScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: new ecs.EcsOptimizedAmi({
          windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
        }),
      });
    }).toThrow(/"windowsVersion" and Linux image "generation" cannot be both set/);


  });

  testDeprecated('allows returning the correct image for windows for EcsOptimizedAmi', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const ami = new ecs.EcsOptimizedAmi({
      windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
    });

    expect(ami.getImage(stack).osType).toEqual(ec2.OperatingSystemType.WINDOWS);


  });

  testDeprecated('allows returning the correct image for linux for EcsOptimizedAmi', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const ami = new ecs.EcsOptimizedAmi({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
    });

    expect(ami.getImage(stack).osType).toEqual(ec2.OperatingSystemType.LINUX);


  });

  testDeprecated('allows returning the correct image for linux 2 for EcsOptimizedAmi', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const ami = new ecs.EcsOptimizedAmi({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    });

    expect(ami.getImage(stack).osType).toEqual(ec2.OperatingSystemType.LINUX);


  });

  test('allows returning the correct image for linux for EcsOptimizedImage', () => {
    // GIVEN
    const stack = new cdk.Stack();

    expect(ecs.EcsOptimizedImage.amazonLinux().getImage(stack).osType).toEqual(
      ec2.OperatingSystemType.LINUX);


  });

  test('allows returning the correct image for linux 2 for EcsOptimizedImage', () => {
    // GIVEN
    const stack = new cdk.Stack();

    expect(ecs.EcsOptimizedImage.amazonLinux2().getImage(stack).osType).toEqual(
      ec2.OperatingSystemType.LINUX);


  });

  test('allows returning the correct image for linux 2 for EcsOptimizedImage with ARM hardware', () => {
    // GIVEN
    const stack = new cdk.Stack();

    expect(ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.ARM).getImage(stack).osType).toEqual(
      ec2.OperatingSystemType.LINUX);


  });


  test('allows returning the correct image for windows for EcsOptimizedImage', () => {
    // GIVEN
    const stack = new cdk.Stack();

    expect(ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2019).getImage(stack).osType).toEqual(
      ec2.OperatingSystemType.WINDOWS);


  });

  test('allows setting cluster ServiceConnectDefaults.Namespace property when useAsServiceConnectDefault is true', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
      useForServiceConnect: true,
    });

    // THEN
    expect((cluster as any)._cfnCluster.serviceConnectDefaults.namespace).toBe('foo.com');
  });

  test('allows setting cluster _defaultCloudMapNamespace for HTTP namespace', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    // WHEN
    const namespace = cluster.addDefaultCloudMapNamespace({
      name: 'foo',
      type: cloudmap.NamespaceType.HTTP,
    });
    // THEN
    expect(namespace.namespaceName).toBe('foo');
  });

  /*
   * TODO:v2.0.0 END OF OBSOLETE BLOCK
   */

  testDeprecated('allows specifying special HW AMI Type v2', () => {
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('GpuAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.GPU),
    });

    // THEN
    const assembly = app.synth();
    const template = assembly.getStackByName(stack.stackName).template;
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2gpurecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });

    expect(template.Parameters).toEqual({
      SsmParameterValueawsserviceecsoptimizedamiamazonlinux2gpurecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
        Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
        Default: '/aws/service/ecs/optimized-ami/amazon-linux-2/gpu/recommended/image_id',
      },
    });


  });

  testDeprecated('allows specifying Amazon Linux v1 AMI', () => {
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('GpuAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux(),
    });

    // THEN
    const assembly = app.synth();
    const template = assembly.getStackByName(stack.stackName).template;
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinuxrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });

    expect(template.Parameters).toEqual({
      SsmParameterValueawsserviceecsoptimizedamiamazonlinuxrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
        Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
        Default: '/aws/service/ecs/optimized-ami/amazon-linux/recommended/image_id',
      },
    });


  });

  testDeprecated('allows specifying windows image v2', () => {
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('WindowsAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2019),
    });

    // THEN
    const assembly = app.synth();
    const template = assembly.getStackByName(stack.stackName).template;
    expect(template.Parameters).toEqual({
      SsmParameterValueawsserviceecsoptimizedamiwindowsserver2019englishfullrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
        Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
        Default: '/aws/service/ecs/optimized-ami/windows_server/2019/english/full/recommended/image_id',
      },
    });


  });

  testDeprecated('allows specifying spot fleet', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      spotPrice: '0.31',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      SpotPrice: '0.31',
    });


  });

  testDeprecated('allows specifying drain time', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      taskDrainTime: cdk.Duration.minutes(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
      HeartbeatTimeout: 60,
    });


  });

  testDeprecated('allows specifying automated spot draining', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('c5.xlarge'),
      spotPrice: '0.0735',
      spotInstanceDraining: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      UserData: {
        'Fn::Base64': {
          'Fn::Join': [
            '',
            [
              '#!/bin/bash\necho ECS_CLUSTER=',
              {
                Ref: 'EcsCluster97242B84',
              },
              ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config\necho ECS_ENABLE_SPOT_INSTANCE_DRAINING=true >> /etc/ecs/ecs.config',
            ],
          ],
        },
      },
    });


  });

  testDeprecated('allows containers access to instance metadata service', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      canContainersAccessInstanceRole: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      UserData: {
        'Fn::Base64': {
          'Fn::Join': [
            '',
            [
              '#!/bin/bash\necho ECS_CLUSTER=',
              {
                Ref: 'EcsCluster97242B84',
              },
              ' >> /etc/ecs/ecs.config',
            ],
          ],
        },
      },
    });


  });

  testDeprecated('allows adding default service discovery namespace', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
      Name: 'foo.com',
      Vpc: {
        Ref: 'MyVpcF9F0CA6F',
      },
    });


  });

  testDeprecated('allows adding public service discovery namespace', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
      type: cloudmap.NamespaceType.DNS_PUBLIC,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PublicDnsNamespace', {
      Name: 'foo.com',
    });

    expect(cluster.defaultCloudMapNamespace!.type).toEqual(cloudmap.NamespaceType.DNS_PUBLIC);


  });

  testDeprecated('throws if default service discovery namespace added more than once', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
    });

    // THEN
    expect(() => {
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
      });
    }).toThrow(/Can only add default namespace once./);


  });


  test('export/import of a cluster with a namespace', () => {
    // GIVEN
    const stack1 = new cdk.Stack();
    const vpc1 = new ec2.Vpc(stack1, 'Vpc');
    const cluster1 = new ecs.Cluster(stack1, 'Cluster', { vpc: vpc1 });
    cluster1.addDefaultCloudMapNamespace({
      name: 'hello.com',
    });

    const stack2 = new cdk.Stack();

    // WHEN
    const cluster2 = ecs.Cluster.fromClusterAttributes(stack2, 'Cluster', {
      vpc: vpc1,
      securityGroups: cluster1.connections.securityGroups,
      defaultCloudMapNamespace: cloudmap.PrivateDnsNamespace.fromPrivateDnsNamespaceAttributes(stack2, 'ns', {
        namespaceId: 'import-namespace-id',
        namespaceArn: 'import-namespace-arn',
        namespaceName: 'import-namespace-name',
      }),
      clusterName: 'cluster-name',
    });

    // THEN
    expect(cluster2.defaultCloudMapNamespace!.type).toEqual(cloudmap.NamespaceType.DNS_PRIVATE);
    expect(stack2.resolve(cluster2.defaultCloudMapNamespace!.namespaceId)).toEqual('import-namespace-id');

    // Can retrieve subnets from VPC - will throw 'There are no 'Private' subnets in this VPC. Use a different VPC subnet selection.' if broken.
    cluster2.vpc.selectSubnets();


  });

  test('imported cluster with imported security groups honors allowAllOutbound', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    const importedSg1 = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG1', 'sg-1', { allowAllOutbound: false });
    const importedSg2 = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG2', 'sg-2');

    const cluster = ecs.Cluster.fromClusterAttributes(stack, 'Cluster', {
      clusterName: 'cluster-name',
      securityGroups: [importedSg1, importedSg2],
      vpc,
    });

    // WHEN
    cluster.connections.allowToAnyIpv4(ec2.Port.tcp(443));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-1',
    });

    Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupEgress', 1);


  });

  test('Metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    // THEN
    expect(stack.resolve(cluster.metricCpuReservation())).toEqual({
      dimensions: {
        ClusterName: { Ref: 'EcsCluster97242B84' },
      },
      namespace: 'AWS/ECS',
      metricName: 'CPUReservation',
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
    });

    expect(stack.resolve(cluster.metricMemoryReservation())).toEqual({
      dimensions: {
        ClusterName: { Ref: 'EcsCluster97242B84' },
      },
      namespace: 'AWS/ECS',
      metricName: 'MemoryReservation',
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
    });

    expect(stack.resolve(cluster.metric('myMetric'))).toEqual({
      dimensions: {
        ClusterName: { Ref: 'EcsCluster97242B84' },
      },
      namespace: 'AWS/ECS',
      metricName: 'myMetric',
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
    });


  });

  testDeprecated('ASG with a public VPC without NAT Gateways', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyPublicVpc', {
      natGateways: 0,
      subnetConfiguration: [
        { cidrMask: 24, name: 'ingress', subnetType: ec2.SubnetType.PUBLIC },
      ],
    });

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

    // WHEN
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      associatePublicIpAddress: true,
      vpcSubnets: {
        onePerAz: true,
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: '10.0.0.0/16',
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
      InstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
      Tags: [
        {
          Key: 'Name',
          Value: 'Default/MyPublicVpc',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
      },
      InstanceType: 't2.micro',
      AssociatePublicIpAddress: true,
      IamInstanceProfile: {
        Ref: 'EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3',
      },
      SecurityGroups: [
        {
          'Fn::GetAtt': [
            'EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231',
            'GroupId',
          ],
        },
      ],
      UserData: {
        'Fn::Base64': {
          'Fn::Join': [
            '',
            [
              '#!/bin/bash\necho ECS_CLUSTER=',
              {
                Ref: 'EcsCluster97242B84',
              },
              // eslint-disable-next-line max-len
              ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
            ],
          ],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      MaxSize: '1',
      MinSize: '1',
      LaunchConfigurationName: {
        Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
      },
      Tags: [
        {
          Key: 'Name',
          PropagateAtLaunch: true,
          Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
        },
      ],
      VPCZoneIdentifier: [
        {
          Ref: 'MyPublicVpcingressSubnet1Subnet9191044C',
        },
        {
          Ref: 'MyPublicVpcingressSubnet2SubnetD2F2E034',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Default/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup',
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow all outbound traffic by default',
          IpProtocol: '-1',
        },
      ],
      Tags: [
        {
          Key: 'Name',
          Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
        },
      ],
      VpcId: {
        Ref: 'MyPublicVpcA2BF6CDA',
      },
    });

    // THEN

  });

  test('enable container insights', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    new ecs.Cluster(stack, 'EcsCluster', { containerInsights: true });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: [
        {
          Name: 'containerInsights',
          Value: 'enabled',
        },
      ],
    });


  });

  test('disable container insights', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    new ecs.Cluster(stack, 'EcsCluster', { containerInsights: false });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: [
        {
          Name: 'containerInsights',
          Value: 'disabled',
        },
      ],
    });


  });

  test('default container insights is undefined', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    new ecs.Cluster(stack, 'EcsCluster');

    // THEN
    const assembly = app.synth();
    const stackAssembly = assembly.getStackByName(stack.stackName);
    const template = stackAssembly.template;

    expect(
      template.Resources.EcsCluster97242B84.Properties === undefined ||
      template.Resources.EcsCluster97242B84.Properties.ClusterSettings === undefined,
    ).toEqual(true);


  });

  test('BottleRocketImage() returns correct AMI', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // WHEN
    new ecs.BottleRocketImage().getImage(stack);

    // THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
    expect(Object.entries(parameters).some(
      ([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketawsecs') &&
        (v as any).Default.includes('/bottlerocket/'),
    )).toEqual(true);
    expect(Object.entries(parameters).some(
      ([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketawsecs') &&
        (v as any).Default.includes('/aws-ecs-1/'),
    )).toEqual(true);

  });

  describe('isBottleRocketImage() returns', () => {
    test('true if given bottleRocketImage instance', () => {
      // WHEN
      const bottleRockectImage = new ecs.BottleRocketImage();
      // THEN
      expect(ecs.BottleRocketImage.isBottleRocketImage(bottleRockectImage)).toBe(true);
    });

    test('false if given amazonLinux instance', () => {
      // GIVEN
      const wrongImage = ec2.MachineImage.latestAmazonLinux();
      // THEN
      expect(ecs.BottleRocketImage.isBottleRocketImage(wrongImage)).toBe(false);
    });

    test('false if given undefined', () => {
      // THEN
      expect(ecs.BottleRocketImage.isBottleRocketImage(undefined)).toBe(false);
    });
  });

  testDeprecated('cluster capacity with bottlerocket AMI, by setting machineImageType', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.addCapacity('bottlerocket-asg', {
      instanceType: new ec2.InstanceType('c5.large'),
      machineImageType: ecs.MachineImageType.BOTTLEROCKET,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);
    Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      ImageId: {
        Ref: 'SsmParameterValueawsservicebottlerocketawsecs1x8664latestimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
      },
      UserData: {
        'Fn::Base64': {
          'Fn::Join': [
            '',
            [
              '\n[settings.ecs]\ncluster = "',
              {
                Ref: 'EcsCluster97242B84',
              },
              '"',
            ],
          ],
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/AmazonSSMManagedInstanceCore',
            ],
          ],
        },
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role',
            ],
          ],
        },
      ],
      Tags: [
        {
          Key: 'Name',
          Value: 'test/EcsCluster/bottlerocket-asg',
        },
      ],
    });
  });

  testDeprecated('correct bottlerocket AMI for ARM64 architecture', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.addCapacity('bottlerocket-asg', {
      instanceType: new ec2.InstanceType('m6g.large'),
      machineImageType: ecs.MachineImageType.BOTTLEROCKET,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      ImageId: {
        Ref: 'SsmParameterValueawsservicebottlerocketawsecs1arm64latestimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });

    Template.fromStack(stack).hasParameter('SsmParameterValueawsservicebottlerocketawsecs1arm64latestimageidC96584B6F00A464EAD1953AFF4B05118Parameter', {
      Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
      Default: '/aws/service/bottlerocket/aws-ecs-1/arm64/latest/image_id',
    });
  });

  testDeprecated('throws when machineImage and machineImageType both specified', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.addCapacity('bottlerocket-asg', {
      instanceType: new ec2.InstanceType('c5.large'),
      machineImage: new ecs.BottleRocketImage(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      UserData: {
        'Fn::Base64': {
          'Fn::Join': [
            '',
            [
              '\n[settings.ecs]\ncluster = "',
              {
                Ref: 'EcsCluster97242B84',
              },
              '"',
            ],
          ],
        },
      },
    });

  });

  testDeprecated('updatePolicy set when passed without updateType', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.addCapacity('bottlerocket-asg', {
      instanceType: new ec2.InstanceType('c5.large'),
      machineImage: new ecs.BottleRocketImage(),
      updatePolicy: autoscaling.UpdatePolicy.replacingUpdate(),
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingReplacingUpdate: {
          WillReplace: true,
        },
      },
    });
  });

  testDeprecated('undefined updateType & updatePolicy replaced by default updatePolicy', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.addCapacity('bottlerocket-asg', {
      instanceType: new ec2.InstanceType('c5.large'),
      machineImage: new ecs.BottleRocketImage(),
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingReplacingUpdate: {
          WillReplace: true,
        },
      },
    });
  });

  testDeprecated('updateType.NONE replaced by updatePolicy equivalent', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.addCapacity('bottlerocket-asg', {
      instanceType: new ec2.InstanceType('c5.large'),
      machineImage: new ecs.BottleRocketImage(),
      updateType: autoscaling.UpdateType.NONE,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingScheduledAction: {
          IgnoreUnmodifiedGroupSizeProperties: true,
        },
      },
    });
  });

  testDeprecated('updateType.REPLACING_UPDATE replaced by updatePolicy equivalent', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.addCapacity('bottlerocket-asg', {
      instanceType: new ec2.InstanceType('c5.large'),
      machineImage: new ecs.BottleRocketImage(),
      updateType: autoscaling.UpdateType.REPLACING_UPDATE,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingReplacingUpdate: {
          WillReplace: true,
        },
      },
    });
  });

  testDeprecated('updateType.ROLLING_UPDATE replaced by updatePolicy equivalent', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.addCapacity('bottlerocket-asg', {
      instanceType: new ec2.InstanceType('c5.large'),
      machineImage: new ecs.BottleRocketImage(),
      updateType: autoscaling.UpdateType.ROLLING_UPDATE,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingRollingUpdate: {
          WaitOnResourceSignals: false,
          PauseTime: 'PT0S',
          SuspendProcesses: [
            'HealthCheck',
            'ReplaceUnhealthy',
            'AZRebalance',
            'AlarmNotification',
            'ScheduledActions',
          ],
        },
        AutoScalingScheduledAction: {
          IgnoreUnmodifiedGroupSizeProperties: true,
        },
      },
    });
  });

  testDeprecated('throws when updatePolicy and updateType both specified', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    expect(() => {
      cluster.addCapacity('bottlerocket-asg', {
        instanceType: new ec2.InstanceType('c5.large'),
        machineImage: new ecs.BottleRocketImage(),
        updatePolicy: autoscaling.UpdatePolicy.replacingUpdate(),
        updateType: autoscaling.UpdateType.REPLACING_UPDATE,
      });
    }).toThrow("Cannot set 'signals'/'updatePolicy' and 'updateType' together. Prefer 'signals'/'updatePolicy'");
  });

  testDeprecated('allows specifying capacityProviders (deprecated)', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // WHEN
    new ecs.Cluster(stack, 'EcsCluster', { capacityProviders: ['FARGATE_SPOT'] });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
      CapacityProviders: Match.absent(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
      CapacityProviders: ['FARGATE_SPOT'],
    });


  });

  test('allows specifying Fargate capacityProviders', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // WHEN
    new ecs.Cluster(stack, 'EcsCluster', {
      enableFargateCapacityProviders: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
      CapacityProviders: Match.absent(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
      CapacityProviders: ['FARGATE', 'FARGATE_SPOT'],
    });


  });

  test('allows specifying capacityProviders (alternate method)', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // WHEN
    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    cluster.enableFargateCapacityProviders();

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
      CapacityProviders: Match.absent(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
      CapacityProviders: ['FARGATE', 'FARGATE_SPOT'],
    });


  });

  testDeprecated('allows adding capacityProviders post-construction (deprecated)', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // WHEN
    cluster.addCapacityProvider('FARGATE');
    cluster.addCapacityProvider('FARGATE'); // does not add twice

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
      CapacityProviders: Match.absent(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
      CapacityProviders: ['FARGATE'],
    });


  });

  testDeprecated('allows adding capacityProviders post-construction', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // WHEN
    cluster.addCapacityProvider('FARGATE');
    cluster.addCapacityProvider('FARGATE'); // does not add twice

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
      CapacityProviders: Match.absent(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
      CapacityProviders: ['FARGATE'],
    });


  });

  testDeprecated('throws for unsupported capacity providers', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // THEN
    expect(() => {
      cluster.addCapacityProvider('HONK');
    }).toThrow(/CapacityProvider not supported/);


  });

  test('creates ASG capacity providers with expected defaults', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // WHEN
    new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::CapacityProvider', {
      AutoScalingGroupProvider: {
        AutoScalingGroupArn: {
          Ref: 'asgASG4D014670',
        },
        ManagedScaling: {
          Status: 'ENABLED',
          TargetCapacity: 100,
        },
        ManagedTerminationProtection: 'ENABLED',
      },
    });

  });

  test('can disable Managed Scaling and Managed Termination Protection for ASG capacity provider', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // WHEN
    new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
      enableManagedScaling: false,
      enableManagedTerminationProtection: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::CapacityProvider', {
      AutoScalingGroupProvider: {
        AutoScalingGroupArn: {
          Ref: 'asgASG4D014670',
        },
        ManagedScaling: Match.absent(),
        ManagedTerminationProtection: 'DISABLED',
      },
    });
  });

  test('can disable Managed Termination Protection for ASG capacity provider', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // WHEN
    new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
      enableManagedTerminationProtection: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::CapacityProvider', {
      AutoScalingGroupProvider: {
        AutoScalingGroupArn: {
          Ref: 'asgASG4D014670',
        },
        ManagedScaling: {
          Status: 'ENABLED',
          TargetCapacity: 100,
        },
        ManagedTerminationProtection: 'DISABLED',
      },
    });
  });

  test('throws error, when ASG capacity provider has Managed Scaling disabled and Managed Termination Protection is undefined (defaults to true)', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // THEN
    expect(() => {
      new ecs.AsgCapacityProvider(stack, 'provider', {
        autoScalingGroup,
        enableManagedScaling: false,
      });
    }).toThrowError('Cannot enable Managed Termination Protection on a Capacity Provider when Managed Scaling is disabled. Either enable Managed Scaling or disable Managed Termination Protection.');
  });

  test('throws error, when Managed Scaling is disabled and Managed Termination Protection is enabled.', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // THEN
    expect(() => {
      new ecs.AsgCapacityProvider(stack, 'provider', {
        autoScalingGroup,
        enableManagedScaling: false,
        enableManagedTerminationProtection: true,
      });
    }).toThrowError('Cannot enable Managed Termination Protection on a Capacity Provider when Managed Scaling is disabled. Either enable Managed Scaling or disable Managed Termination Protection.');
  });

  test('capacity provider enables ASG new instance scale-in protection by default', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // WHEN
    new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      NewInstancesProtectedFromScaleIn: true,
    });

  });

  test('capacity provider disables ASG new instance scale-in protection', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // WHEN
    new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
      enableManagedTerminationProtection: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      NewInstancesProtectedFromScaleIn: Match.absent(),
    });
  });

  test('can add ASG capacity via Capacity Provider', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // WHEN
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
      enableManagedTerminationProtection: false,
    });

    cluster.enableFargateCapacityProviders();

    // Ensure not added twice
    cluster.addAsgCapacityProvider(capacityProvider);
    cluster.addAsgCapacityProvider(capacityProvider);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
      Cluster: {
        Ref: 'EcsCluster97242B84',
      },
      CapacityProviders: [
        'FARGATE',
        'FARGATE_SPOT',
        {
          Ref: 'providerD3FF4D3A',
        },
      ],
      DefaultCapacityProviderStrategy: [],
    });

  });

  test('should throw an error if capacity provider with default strategy is not present in capacity providers', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // THEN
    expect(() => {
      new ecs.Cluster(stack, 'EcsCluster', {
        enableFargateCapacityProviders: true,
      }).addDefaultCapacityProviderStrategy([
        { capacityProvider: 'test capacityProvider', base: 10, weight: 50 },
      ]);
    }).toThrow('Capacity provider test capacityProvider must be added to the cluster with addAsgCapacityProvider() before it can be used in a default capacity provider strategy.');
  });

  test('should throw an error when capacity providers is length 0 and default capacity provider startegy specified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // THEN
    expect(() => {
      new ecs.Cluster(stack, 'EcsCluster', {
        enableFargateCapacityProviders: false,
      }).addDefaultCapacityProviderStrategy([
        { capacityProvider: 'test capacityProvider', base: 10, weight: 50 },
      ]);
    }).toThrow('Capacity provider test capacityProvider must be added to the cluster with addAsgCapacityProvider() before it can be used in a default capacity provider strategy.');
  });

  test('should throw an error when more than 1 default capacity provider have base specified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // THEN
    expect(() => {
      new ecs.Cluster(stack, 'EcsCluster', {
        enableFargateCapacityProviders: true,
      }).addDefaultCapacityProviderStrategy([
        { capacityProvider: 'FARGATE', base: 10, weight: 50 },
        { capacityProvider: 'FARGATE_SPOT', base: 10, weight: 50 },
      ]);
    }).toThrow(/Only 1 capacity provider in a capacity provider strategy can have a nonzero base./);
  });

  test('should throw an error when a capacity provider strategy contains a mix of Auto Scaling groups and Fargate providers', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', {
      enableFargateCapacityProviders: true,
    });
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
      enableManagedTerminationProtection: false,
    });
    cluster.addAsgCapacityProvider(capacityProvider);

    // THEN
    expect(() => {
      cluster.addDefaultCapacityProviderStrategy([
        { capacityProvider: 'FARGATE', base: 10, weight: 50 },
        { capacityProvider: 'FARGATE_SPOT' },
        { capacityProvider: capacityProvider.capacityProviderName },
      ]);
    }).toThrow(/A capacity provider strategy cannot contain a mix of capacity providers using Auto Scaling groups and Fargate providers. Specify one or the other and try again./);
  });

  test('should throw an error if addDefaultCapacityProviderStrategy is called more than once', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // THEN
    expect(() => {
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        enableFargateCapacityProviders: true,
      });
      cluster.addDefaultCapacityProviderStrategy([
        { capacityProvider: 'FARGATE', base: 10, weight: 50 },
        { capacityProvider: 'FARGATE_SPOT' },
      ]);
      cluster.addDefaultCapacityProviderStrategy([
        { capacityProvider: 'FARGATE', base: 10, weight: 50 },
        { capacityProvider: 'FARGATE_SPOT' },
      ]);
    }).toThrow(/Cluster default capacity provider strategy is already set./);
  });

  test('can add ASG capacity via Capacity Provider with default capacity provider', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', {
      enableFargateCapacityProviders: true,
    });

    cluster.addDefaultCapacityProviderStrategy([
      { capacityProvider: 'FARGATE', base: 10, weight: 50 },
      { capacityProvider: 'FARGATE_SPOT' },
    ]);

    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // WHEN
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
      enableManagedTerminationProtection: false,
    });

    cluster.addAsgCapacityProvider(capacityProvider);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
      Cluster: {
        Ref: 'EcsCluster97242B84',
      },
      CapacityProviders: [
        'FARGATE',
        'FARGATE_SPOT',
        {
          Ref: 'providerD3FF4D3A',
        },
      ],
      DefaultCapacityProviderStrategy: [
        { CapacityProvider: 'FARGATE', Base: 10, Weight: 50 },
        { CapacityProvider: 'FARGATE_SPOT' },
      ],
    });
  });

  test('can add ASG default capacity provider', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
      vpc,
      instanceType: new ec2.InstanceType('bogus'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });

    // WHEN
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'provider', {
      autoScalingGroup,
      enableManagedTerminationProtection: false,
    });

    cluster.addAsgCapacityProvider(capacityProvider);

    cluster.addDefaultCapacityProviderStrategy([
      { capacityProvider: capacityProvider.capacityProviderName },
    ]);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
      Cluster: {
        Ref: 'EcsCluster97242B84',
      },
      CapacityProviders: [
        {
          Ref: 'providerD3FF4D3A',
        },
      ],
      DefaultCapacityProviderStrategy: [
        {
          CapacityProvider: {
            Ref: 'providerD3FF4D3A',
          },
        },
      ],
    });
  });

  test('correctly sets log configuration for execute command', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const kmsKey = new kms.Key(stack, 'KmsKey');

    const logGroup = new logs.LogGroup(stack, 'LogGroup', {
      encryptionKey: kmsKey,
    });

    const execBucket = new s3.Bucket(stack, 'EcsExecBucket', {
      encryptionKey: kmsKey,
    });

    // WHEN
    new ecs.Cluster(stack, 'EcsCluster', {
      executeCommandConfiguration: {
        kmsKey: kmsKey,
        logConfiguration: {
          cloudWatchLogGroup: logGroup,
          cloudWatchEncryptionEnabled: true,
          s3Bucket: execBucket,
          s3EncryptionEnabled: true,
          s3KeyPrefix: 'exec-output',
        },
        logging: ecs.ExecuteCommandLogging.OVERRIDE,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
      Configuration: {
        ExecuteCommandConfiguration: {
          KmsKeyId: {
            'Fn::GetAtt': [
              'KmsKey46693ADD',
              'Arn',
            ],
          },
          LogConfiguration: {
            CloudWatchEncryptionEnabled: true,
            CloudWatchLogGroupName: {
              Ref: 'LogGroupF5B46931',
            },
            S3BucketName: {
              Ref: 'EcsExecBucket4F468651',
            },
            S3EncryptionEnabled: true,
            S3KeyPrefix: 'exec-output',
          },
          Logging: 'OVERRIDE',
        },
      },
    });


  });

  test('throws when no log configuration is provided when logging is set to OVERRIDE', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // THEN
    expect(() => {
      new ecs.Cluster(stack, 'EcsCluster', {
        executeCommandConfiguration: {
          logging: ecs.ExecuteCommandLogging.OVERRIDE,
        },
      });
    }).toThrow(/Execute command log configuration must only be specified when logging is OVERRIDE./);


  });

  test('throws when log configuration provided but logging is set to DEFAULT', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    const logGroup = new logs.LogGroup(stack, 'LogGroup');

    // THEN
    expect(() => {
      new ecs.Cluster(stack, 'EcsCluster', {
        executeCommandConfiguration: {
          logConfiguration: {
            cloudWatchLogGroup: logGroup,
          },
          logging: ecs.ExecuteCommandLogging.DEFAULT,
        },
      });
    }).toThrow(/Execute command log configuration must only be specified when logging is OVERRIDE./);


  });

  test('throws when CloudWatchEncryptionEnabled without providing CloudWatch Logs log group name', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // THEN
    expect(() => {
      new ecs.Cluster(stack, 'EcsCluster', {
        executeCommandConfiguration: {
          logConfiguration: {
            cloudWatchEncryptionEnabled: true,
          },
          logging: ecs.ExecuteCommandLogging.OVERRIDE,
        },
      });
    }).toThrow(/You must specify a CloudWatch log group in the execute command log configuration to enable CloudWatch encryption./);


  });

  test('throws when S3EncryptionEnabled without providing S3 Bucket name', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');

    // THEN
    expect(() => {
      new ecs.Cluster(stack, 'EcsCluster', {
        executeCommandConfiguration: {
          logConfiguration: {
            s3EncryptionEnabled: true,
          },
          logging: ecs.ExecuteCommandLogging.OVERRIDE,
        },
      });
    }).toThrow(/You must specify an S3 bucket name in the execute command log configuration to enable S3 encryption./);


  });

  test('When importing ECS Cluster via Arn', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const clusterName = 'my-cluster';
    const region = 'service-region';
    const account = 'service-account';
    const cluster = ecs.Cluster.fromClusterArn(stack, 'Cluster', `arn:aws:ecs:${region}:${account}:cluster/${clusterName}`);

    // THEN
    expect(cluster.clusterName).toEqual(clusterName);
    expect(cluster.env.region).toEqual(region);
    expect(cluster.env.account).toEqual(account);
  });

  test('throws error when import ECS Cluster without resource name in arn', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      ecs.Cluster.fromClusterArn(stack, 'Cluster', 'arn:aws:ecs:service-region:service-account:cluster');
    }).toThrowError(/Missing required Cluster Name from Cluster ARN: /);
  });
});

test('can add ASG capacity via Capacity Provider by not specifying machineImageType', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'test');
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'EcsCluster');

  const autoScalingGroupAl2 = new autoscaling.AutoScalingGroup(stack, 'asgal2', {
    vpc,
    instanceType: new ec2.InstanceType('bogus'),
    machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  });

  const autoScalingGroupBottlerocket = new autoscaling.AutoScalingGroup(stack, 'asgBottlerocket', {
    vpc,
    instanceType: new ec2.InstanceType('bogus'),
    machineImage: new ecs.BottleRocketImage(),
  });

  // WHEN
  const capacityProviderAl2 = new ecs.AsgCapacityProvider(stack, 'provideral2', {
    autoScalingGroup: autoScalingGroupAl2,
    enableManagedTerminationProtection: false,
  });

  const capacityProviderBottlerocket = new ecs.AsgCapacityProvider(stack, 'providerBottlerocket', {
    autoScalingGroup: autoScalingGroupBottlerocket,
    enableManagedTerminationProtection: false,
    machineImageType: ecs.MachineImageType.BOTTLEROCKET,
  });

  cluster.enableFargateCapacityProviders();

  // Ensure not added twice
  cluster.addAsgCapacityProvider(capacityProviderAl2);
  cluster.addAsgCapacityProvider(capacityProviderAl2);

  // Add Bottlerocket ASG Capacity Provider
  cluster.addAsgCapacityProvider(capacityProviderBottlerocket);


  // THEN Bottlerocket LaunchConfiguration
  Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
    ImageId: {
      Ref: 'SsmParameterValueawsservicebottlerocketawsecs1x8664latestimageidC96584B6F00A464EAD1953AFF4B05118Parameter',

    },
    UserData: {
      'Fn::Base64': {
        'Fn::Join': [
          '',
          [
            '\n[settings.ecs]\ncluster = \"',
            {
              Ref: 'EcsCluster97242B84',
            },
            '\"',
          ],
        ],
      },
    },
  });

  // THEN AmazonLinux2 LaunchConfiguration
  Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
    ImageId: {
      Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
    },
    UserData: {
      'Fn::Base64': {
        'Fn::Join': [
          '',
          [
            '#!/bin/bash\necho ECS_CLUSTER=',
            {
              Ref: 'EcsCluster97242B84',

            },
            ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
          ],
        ],
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
    CapacityProviders: [
      'FARGATE',
      'FARGATE_SPOT',
      {
        Ref: 'provideral2A427CBC0',
      },
      {
        Ref: 'providerBottlerocket90C039FA',
      },
    ],
    Cluster: {
      Ref: 'EcsCluster97242B84',
    },
    DefaultCapacityProviderStrategy: [],
  });

});

test('throws when ASG Capacity Provider with capacityProviderName starting with aws, ecs or faragte', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'test');
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'EcsCluster');

  const autoScalingGroupAl2 = new autoscaling.AutoScalingGroup(stack, 'asgal2', {
    vpc,
    instanceType: new ec2.InstanceType('bogus'),
    machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  });

  // THEN
  expect(() => {
    // WHEN Capacity Provider define capacityProviderName start with aws.
    const capacityProviderAl2 = new ecs.AsgCapacityProvider(stack, 'provideral2', {
      autoScalingGroup: autoScalingGroupAl2,
      enableManagedTerminationProtection: false,
      capacityProviderName: 'awscp',
    });

    cluster.addAsgCapacityProvider(capacityProviderAl2);
  }).toThrow(/Invalid Capacity Provider Name: awscp, If a name is specified, it cannot start with aws, ecs, or fargate./);

  expect(() => {
    // WHEN Capacity Provider define capacityProviderName start with ecs.
    const capacityProviderAl2 = new ecs.AsgCapacityProvider(stack, 'provideral2-2', {
      autoScalingGroup: autoScalingGroupAl2,
      enableManagedTerminationProtection: false,
      capacityProviderName: 'ecscp',
    });

    cluster.addAsgCapacityProvider(capacityProviderAl2);
  }).toThrow(/Invalid Capacity Provider Name: ecscp, If a name is specified, it cannot start with aws, ecs, or fargate./);
});

describe('Accessing container instance role', function () {

  const addUserDataMock = jest.fn();
  const autoScalingGroup: autoscaling.AutoScalingGroup = {
    addUserData: addUserDataMock,
    addToRolePolicy: jest.fn(),
    protectNewInstancesFromScaleIn: jest.fn(),
  } as unknown as autoscaling.AutoScalingGroup;

  afterEach(() => {
    addUserDataMock.mockClear();
  });

  test('block ecs from accessing metadata service when canContainersAccessInstanceRole not set', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // WHEN

    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
      autoScalingGroup: autoScalingGroup,
    });

    cluster.addAsgCapacityProvider(capacityProvider);

    // THEN
    expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
    expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('sudo service iptables save');
    expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
  });

  test('allow ecs accessing metadata service when canContainersAccessInstanceRole is set on addAsgCapacityProvider', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // WHEN
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
      autoScalingGroup: autoScalingGroup,
    });

    cluster.addAsgCapacityProvider(capacityProvider, {
      canContainersAccessInstanceRole: true,
    });

    // THEN
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo service iptables save');
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
  });

  test('allow ecs accessing metadata service when canContainersAccessInstanceRole is set on AsgCapacityProvider instantiation', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // WHEN
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
      autoScalingGroup: autoScalingGroup,
      canContainersAccessInstanceRole: true,
    });

    cluster.addAsgCapacityProvider(capacityProvider);

    // THEN
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo service iptables save');
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
  });

  test('allow ecs accessing metadata service when canContainersAccessInstanceRole is set on constructor and method', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // WHEN
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
      autoScalingGroup: autoScalingGroup,
      canContainersAccessInstanceRole: true,
    });

    cluster.addAsgCapacityProvider(capacityProvider, {
      canContainersAccessInstanceRole: true,
    });

    // THEN
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo service iptables save');
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
  });

  test('block ecs from accessing metadata service when canContainersAccessInstanceRole set on constructor and not set on method', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // WHEN
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
      autoScalingGroup: autoScalingGroup,
      canContainersAccessInstanceRole: true,
    });

    cluster.addAsgCapacityProvider(capacityProvider, {
      canContainersAccessInstanceRole: false,
    });

    // THEN
    expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
    expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('sudo service iptables save');
    expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
  });

  test('allow ecs accessing metadata service when canContainersAccessInstanceRole is not set on constructor and set on method', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');

    // WHEN
    const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
      autoScalingGroup: autoScalingGroup,
      canContainersAccessInstanceRole: false,
    });

    cluster.addAsgCapacityProvider(capacityProvider, {
      canContainersAccessInstanceRole: true,
    });

    // THEN
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo service iptables save');
    expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
  });
});
