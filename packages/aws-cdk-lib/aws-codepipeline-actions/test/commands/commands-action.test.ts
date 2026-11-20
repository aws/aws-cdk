import { Match, Template } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codepipeline from '../../../aws-codepipeline';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import { Bucket } from '../../../aws-s3';
import { App, Stack, Token } from '../../../core';
import * as cpactions from '../../lib';

describe('Commands Action', () => {
  let stack: Stack;
  let sourceOutput1: codepipeline.Artifact;
  let sourceOutput2: codepipeline.Artifact;
  let pipeline: codepipeline.Pipeline;

  beforeEach(() => {
    // GIVEN
    stack = new Stack();
    sourceOutput1 = new codepipeline.Artifact('SourceArtifact');
    sourceOutput2 = new codepipeline.Artifact('SourceArtifact2');
    pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'Source1',
          bucket: new Bucket(stack, 'SourceBucket1'),
          bucketKey: 'sample.zip',
          output: sourceOutput1,
        }),
        new cpactions.S3SourceAction({
          actionName: 'Source2',
          bucket: new Bucket(stack, 'SourceBucket2'),
          bucketKey: 'sample.zip',
          output: sourceOutput2,
        }),
      ],
    });
  });

  test('pipeline with commands action', () => {
    // WHEN
    const commandsAction = new cpactions.CommandsAction({
      actionName: 'Commands',
      commands: [
        'pwd',
        'ls -la',
      ],
      input: sourceOutput1,
      extraInputs: [sourceOutput2],
      output: new codepipeline.Artifact('CommandsArtifact'),
      outputVariables: ['MY_OUTPUT', 'CODEBUILD_BUILD_ID', 'AWS_DEFAULT_REGION'],
    });

    pipeline.addStage({
      stageName: 'Commands',
      actions: [commandsAction],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        {
          Name: 'Commands',
          Actions: [
            {
              ActionTypeId: {
                Category: 'Compute',
                Owner: 'AWS',
                Provider: 'Commands',
                Version: '1',
              },
              Commands: [
                'pwd',
                'ls -la',
              ],
              InputArtifacts: [
                {
                  Name: 'SourceArtifact',
                },
                {
                  Name: 'SourceArtifact2',
                },
              ],
              Name: 'Commands',
              OutputArtifacts: [
                {
                  Name: 'CommandsArtifact',
                },
              ],
              OutputVariables: [
                'MY_OUTPUT',
                'CODEBUILD_BUILD_ID',
                'AWS_DEFAULT_REGION',
              ],
              RoleArn: {
                'Fn::GetAtt': [
                  'PipelineCommandsCodePipelineActionRole98E395B5',
                  'Arn',
                ],
              },
              RunOrder: 1,
            },
          ],
        },
      ]),
    });
  });

  test('throw if commands length is lower than 1', () => {
    // THEN
    expect(() => {
      new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [],
        input: sourceOutput1,
      });
    }).toThrow(/The length of the commands array must be between 1 and 50, got: 0/);
  });

  test('throw if commands length is greater than 50', () => {
    // THEN
    expect(() => {
      new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: new Array(51).fill('echo hello'),
        input: sourceOutput1,
      });
    }).toThrow(/The length of the commands array must be between 1 and 50, got: 51/);
  });

  test('throw if outputVariables length is lower than 1', () => {
    // THEN
    expect(() => {
      new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'echo hello',
        ],
        input: sourceOutput1,
        outputVariables: [],
      });
    }).toThrow(/The length of the outputVariables array must be between 1 and 15, got: 0/);
  });

  test('throw if outputVariables length is greater than 15', () => {
    // THEN
    expect(() => {
      new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'echo hello',
        ],
        input: sourceOutput1,
        outputVariables: [...new Array(16).keys()].map(i => `VAR${i}`),
      });
    }).toThrow(/The length of the outputVariables array must be between 1 and 15, got: 16/);
  });

  describe('grant policy', () => {
    test('grant policy for logs', () => {
      // WHEN
      const commandsAction = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'pwd',
          'ls -la',
        ],
        input: sourceOutput1,
      });

      pipeline.addStage({
        stageName: 'Commands',
        actions: [commandsAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':log-group:/aws/codepipeline/',
                      {
                        Ref: 'PipelineC660917D',
                      },
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
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':log-group:/aws/codepipeline/',
                      {
                        Ref: 'PipelineC660917D',
                      },
                      ':*',
                    ],
                  ],
                },
              ],
            },
            {
              Action: 'logs:GetLogEvents',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':logs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':log-group:/aws/codepipeline/',
                    {
                      Ref: 'PipelineC660917D',
                    },
                    ':*',
                  ],
                ],
              },
            },
          ]),
        },
      });
    });

    test('grant read policy for buckets if the action has input without output', () => {
      // WHEN
      const commandsAction = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'pwd',
          'ls -la',
        ],
        input: sourceOutput1,
      });

      pipeline.addStage({
        stageName: 'Commands',
        actions: [commandsAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': [
                    'PipelineArtifactsBucket22248F97',
                    'Arn',
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          'PipelineArtifactsBucket22248F97',
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
          ]),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
        PolicyDocument: {
          // Write policy is not granted
          Statement: Match.not(
            Match.arrayWith([
              {
                Action: [
                  's3:DeleteObject*',
                  's3:PutObject',
                  's3:PutObjectLegalHold',
                  's3:PutObjectRetention',
                  's3:PutObjectTagging',
                  's3:PutObjectVersionTagging',
                  's3:Abort*',
                ],
                Effect: 'Allow',
                Resource: [
                  {
                    'Fn::GetAtt': [
                      'PipelineArtifactsBucket22248F97',
                      'Arn',
                    ],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': [
                            'PipelineArtifactsBucket22248F97',
                            'Arn',
                          ],
                        },
                        '/*',
                      ],
                    ],
                  },
                ],
              },
            ]),
          ),
        },
      });
    });

    test('grant write policy for buckets if the action has input and output', () => {
      // WHEN
      const commandsOutput = new codepipeline.Artifact('CommandsArtifact');
      const commandsAction = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'pwd',
          'ls -la',
        ],
        input: sourceOutput1,
        output: commandsOutput,
      });

      pipeline.addStage({
        stageName: 'Commands',
        actions: [commandsAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': [
                    'PipelineArtifactsBucket22248F97',
                    'Arn',
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          'PipelineArtifactsBucket22248F97',
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
            {
              Action: [
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': [
                    'PipelineArtifactsBucket22248F97',
                    'Arn',
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          'PipelineArtifactsBucket22248F97',
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
          ]),
        },
      });
    });
  });

  describe('variable method', () => {
    test('can reference by variable method', () => {
      // WHEN
      const commandsOutput = new codepipeline.Artifact('CommandsArtifact');
      const commandsAction = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'export MY_OUTPUT=my-key',
        ],
        input: sourceOutput1,
        extraInputs: [sourceOutput2],
        output: commandsOutput,
        outputVariables: ['MY_OUTPUT'],
      });

      const deployBucket = new Bucket(stack, 'DeployBucket');
      const deployAction = new cpactions.S3DeployAction({
        actionName: 'DeployAction',
        extract: true,
        input: commandsOutput,
        bucket: deployBucket,
        objectKey: commandsAction.variable('MY_OUTPUT'),
      });

      pipeline.addStage({
        stageName: 'Commands',
        actions: [commandsAction],
      });
      pipeline.addStage({
        stageName: 'Deploy',
        actions: [deployAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: Match.arrayWith([
          {
            Name: 'Commands',
            Actions: [
              Match.objectLike({
                OutputVariables: [
                  'MY_OUTPUT',
                ],
              }),
            ],
          },
          {
            Name: 'Deploy',
            Actions: [
              Match.objectLike({
                Configuration: {
                  ObjectKey: '#{Commands_Commands_NS.MY_OUTPUT}',
                },
              }),
            ],
          },
        ]),
      });
    });
  });

  test('throw if method references a non-exported variable', () => {
    // GIVEN
    const commandsOutput = new codepipeline.Artifact('CommandsArtifact');
    const commandsAction = new cpactions.CommandsAction({
      actionName: 'Commands',
      commands: [
        'export MY_OUTPUT=my-key',
      ],
      input: sourceOutput1,
      extraInputs: [sourceOutput2],
      output: commandsOutput,
      outputVariables: ['MY_OUTPUT'],
    });
    const deployBucket = new Bucket(stack, 'DeployBucket');

    // THEN
    expect(() => {
      new cpactions.S3DeployAction({
        actionName: 'DeployAction',
        extract: true,
        input: commandsOutput,
        bucket: deployBucket,
        objectKey: commandsAction.variable('NON-EXPORTED-OUTPUT'),
      });
    }).toThrow(/Variable 'NON-EXPORTED-OUTPUT' is not exported by `outputVariables`, exported variables: MY_OUTPUT/);
  });

  describe('compute and VPC configuration', () => {
    function addCommandsAction(props: Partial<cpactions.CommandsActionProps>) {
      pipeline.addStage({
        stageName: 'Commands',
        actions: [new cpactions.CommandsAction({
          actionName: 'Commands',
          commands: ['echo hello'],
          input: sourceOutput1,
          ...props,
        })],
      });
    }

    function commandsActionConfiguration(): any {
      const pipelines = Template.fromStack(stack).findResources('AWS::CodePipeline::Pipeline');
      const pipelineResource = Object.values(pipelines)[0] as any;
      const commandsStage = pipelineResource.Properties.Stages.find((s: any) => s.Name === 'Commands');
      return commandsStage.Actions[0].Configuration;
    }

    test('does not render a configuration when no compute or VPC props are set', () => {
      // WHEN
      addCommandsAction({});

      // THEN
      expect(commandsActionConfiguration()).toBeUndefined();
      Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroup', 0);
    });

    test('renders environment type and compute type', () => {
      // WHEN
      addCommandsAction({
        environmentType: cpactions.CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER,
        computeType: codebuild.ComputeType.MEDIUM,
      });

      // THEN
      expect(commandsActionConfiguration()).toEqual({
        EnvironmentType: 'WINDOWS_SERVER_2022_CONTAINER',
        ComputeType: 'BUILD_GENERAL1_MEDIUM',
      });
    });

    test('renders a custom environment type', () => {
      // WHEN
      addCommandsAction({
        environmentType: cpactions.CommandsEnvironmentType.of('MY_CONTAINER'),
      });

      // THEN
      expect(commandsActionConfiguration()).toEqual({
        EnvironmentType: 'MY_CONTAINER',
      });
    });

    test.each([
      codebuild.ComputeType.SMALL,
      codebuild.ComputeType.MEDIUM,
      codebuild.ComputeType.LARGE,
    ])('accepts compute type %s', (computeType) => {
      // WHEN
      addCommandsAction({ computeType });

      // THEN
      expect(commandsActionConfiguration()).toEqual({
        ComputeType: computeType,
      });
    });

    test.each([
      codebuild.ComputeType.X_LARGE,
      codebuild.ComputeType.X2_LARGE,
      codebuild.ComputeType.LAMBDA_1GB,
      codebuild.ComputeType.ATTRIBUTE_BASED,
    ])('fails for unsupported compute type %s', (computeType) => {
      // THEN
      expect(() => {
        new cpactions.CommandsAction({
          actionName: 'Commands',
          commands: ['echo hello'],
          input: sourceOutput1,
          computeType,
        });
      }).toThrow(`Unsupported compute type for the Commands action: \"${computeType}\", supported compute types are: BUILD_GENERAL1_SMALL, BUILD_GENERAL1_MEDIUM, BUILD_GENERAL1_LARGE`);
    });

    test('does not validate a tokenized compute type', () => {
      // WHEN
      const computeType = Token.asString({ Ref: 'ComputeTypeParameter' }) as codebuild.ComputeType;
      addCommandsAction({ computeType });

      // THEN
      expect(commandsActionConfiguration()).toEqual({
        ComputeType: { Ref: 'ComputeTypeParameter' },
      });
    });

    test('fails for windows environment type with small compute type', () => {
      // THEN
      expect(() => {
        new cpactions.CommandsAction({
          actionName: 'Commands',
          commands: ['echo hello'],
          input: sourceOutput1,
          environmentType: cpactions.CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER,
          computeType: codebuild.ComputeType.SMALL,
        });
      }).toThrow('The environment type WINDOWS_SERVER_2022_CONTAINER is not compatible with the compute type BUILD_GENERAL1_SMALL, use BUILD_GENERAL1_MEDIUM or BUILD_GENERAL1_LARGE instead');
    });

    test('fails for windows environment type without a compute type', () => {
      // THEN
      expect(() => {
        new cpactions.CommandsAction({
          actionName: 'Commands',
          commands: ['echo hello'],
          input: sourceOutput1,
          environmentType: cpactions.CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER,
        });
      }).toThrow('The environment type WINDOWS_SERVER_2022_CONTAINER requires \'computeType\' to be set to BUILD_GENERAL1_MEDIUM or BUILD_GENERAL1_LARGE, because the default compute type BUILD_GENERAL1_SMALL is not compatible with it');
    });

    test.each([
      ['subnetSelection', { subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS } }],
      ['securityGroups', { securityGroups: [] }],
    ])('fails if %s is set without vpc', (_name, props) => {
      // THEN
      expect(() => {
        new cpactions.CommandsAction({
          actionName: 'Commands',
          commands: ['echo hello'],
          input: sourceOutput1,
          ...props,
        });
      }).toThrow('Cannot configure \'subnetSelection\' or \'securityGroups\' without configuring a \'vpc\'');
    });

    test('renders the VPC configuration with the given subnets and security groups', () => {
      // GIVEN
      const vpc = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
        vpcId: 'vpc-12345',
        availabilityZones: ['us-east-1a', 'us-east-1b'],
        privateSubnetIds: ['subnet-private1', 'subnet-private2'],
        publicSubnetIds: ['subnet-public1', 'subnet-public2'],
      });
      const sg1 = ec2.SecurityGroup.fromSecurityGroupId(stack, 'Sg1', 'sg-1');
      const sg2 = ec2.SecurityGroup.fromSecurityGroupId(stack, 'Sg2', 'sg-2');

      // WHEN
      addCommandsAction({
        computeType: codebuild.ComputeType.LARGE,
        vpc,
        subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
        securityGroups: [sg1, sg2],
      });

      // THEN
      expect(commandsActionConfiguration()).toEqual({
        ComputeType: 'BUILD_GENERAL1_LARGE',
        VpcId: 'vpc-12345',
        Subnets: 'subnet-public1,subnet-public2',
        SecurityGroupIds: 'sg-1,sg-2',
      });
      Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroup', 0);
    });

    test('creates a security group and uses the private subnets by default', () => {
      // GIVEN
      const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

      // WHEN
      addCommandsAction({ vpc });

      // THEN
      Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroup', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Automatic generated security group for CodePipeline Commands action',
        SecurityGroupEgress: [{ CidrIp: '0.0.0.0/0', IpProtocol: '-1' }],
        VpcId: stack.resolve(vpc.vpcId),
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: Match.arrayWith([{
          Name: 'Commands',
          Actions: [Match.objectLike({
            Configuration: {
              VpcId: stack.resolve(vpc.vpcId),
              Subnets: {
                'Fn::Join': [',', vpc.privateSubnets.map(subnet => stack.resolve(subnet.subnetId))],
              },
              SecurityGroupIds: {
                'Fn::GetAtt': [Match.stringLikeRegexp('^PipelineCommandsSecurityGroup'), 'GroupId'],
              },
            },
          })],
        }]),
      });
    });

    test('grants the VPC permissions to the action role', () => {
      // GIVEN
      const vpc = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
        vpcId: 'vpc-12345',
        availabilityZones: ['us-east-1a'],
        privateSubnetIds: ['subnet-private1'],
      });

      // WHEN
      addCommandsAction({ vpc });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                'ec2:CreateNetworkInterface',
                'ec2:DescribeNetworkInterfaces',
                'ec2:DeleteNetworkInterface',
                'ec2:DescribeSubnets',
                'ec2:DescribeSecurityGroups',
                'ec2:DescribeDhcpOptions',
                'ec2:DescribeVpcs',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 'ec2:CreateNetworkInterfacePermission',
              Condition: {
                StringEquals: {
                  'ec2:Subnet': [{
                    'Fn::Join': ['', [
                      'arn:', { Ref: 'AWS::Partition' }, ':ec2:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':subnet/subnet-private1',
                    ]],
                  }],
                },
              },
              Effect: 'Allow',
              Resource: {
                'Fn::Join': ['', [
                  'arn:', { Ref: 'AWS::Partition' }, ':ec2:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':network-interface/*',
                ]],
              },
            },
          ]),
        },
      });
    });

    describe('VPC in another environment', () => {
      let app: App;
      let pipelineStack: Stack;
      let crossPipeline: codepipeline.Pipeline;
      let crossSource: codepipeline.Artifact;

      beforeEach(() => {
        app = new App();
        pipelineStack = new Stack(app, 'PipelineStack', { env: { account: '111111111111', region: 'us-east-1' } });
        crossSource = new codepipeline.Artifact('SourceArtifact');
        crossPipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          pipelineName: 'MyPipeline',
          crossAccountKeys: true,
        });
        crossPipeline.addStage({
          stageName: 'Source',
          actions: [new cpactions.S3SourceAction({
            actionName: 'Source',
            bucket: new Bucket(pipelineStack, 'SourceBucket'),
            bucketKey: 'sample.zip',
            output: crossSource,
          })],
        });
      });

      function addCrossAccountAction(vpcStack: Stack, props: Partial<cpactions.CommandsActionProps>) {
        const vpc = ec2.Vpc.fromVpcAttributes(vpcStack, 'Vpc', {
          vpcId: 'vpc-12345',
          availabilityZones: ['us-east-1a'],
          privateSubnetIds: ['subnet-private1'],
        });
        const role = new iam.Role(vpcStack, 'ActionRole', {
          assumedBy: new iam.AccountPrincipal('111111111111'),
          roleName: 'ActionRole',
        });
        crossPipeline.addStage({
          stageName: 'Commands',
          actions: [new cpactions.CommandsAction({
            actionName: 'Commands',
            commands: ['echo hello'],
            input: crossSource,
            vpc,
            role,
            ...props,
          })],
        });
      }

      test('fails to create a default security group for a VPC in another account', () => {
        // GIVEN
        const otherStack = new Stack(app, 'OtherStack', { env: { account: '222222222222', region: 'us-east-1' } });

        // THEN
        expect(() => addCrossAccountAction(otherStack, {}))
          .toThrow("The VPC of the Commands action 'Commands' is in a different account than the pipeline, specify 'securityGroups' that belong to the VPC");
      });

      test('scopes the network interface permissions to the account of the VPC', () => {
        // GIVEN
        const otherStack = new Stack(app, 'OtherStack', { env: { account: '222222222222', region: 'us-east-1' } });
        const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(otherStack, 'Sg', 'sg-1');

        // WHEN
        addCrossAccountAction(otherStack, { securityGroups: [securityGroup] });

        // THEN
        Template.fromStack(pipelineStack).resourceCountIs('AWS::EC2::SecurityGroup', 0);
        Template.fromStack(otherStack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: Match.arrayWith([{
              Action: 'ec2:CreateNetworkInterfacePermission',
              Condition: {
                StringEquals: {
                  'ec2:Subnet': [{
                    'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ec2:us-east-1:222222222222:subnet/subnet-private1']],
                  }],
                },
              },
              Effect: 'Allow',
              Resource: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ec2:us-east-1:222222222222:network-interface/*']],
              },
            }]),
          },
        });
      });

      test('fails for a VPC in another region', () => {
        // GIVEN
        const otherStack = new Stack(app, 'OtherStack', { env: { account: '111111111111', region: 'us-west-2' } });
        const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(otherStack, 'Sg', 'sg-1');

        // THEN
        expect(() => addCrossAccountAction(otherStack, { securityGroups: [securityGroup] }))
          .toThrow("The VPC of the Commands action 'Commands' must be in the same region as the pipeline, got: 'us-west-2' and 'us-east-1'");
      });
    });

    test('allows connections from the generated security group', () => {
      // GIVEN
      const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
      const database = new ec2.SecurityGroup(stack, 'DatabaseSecurityGroup', { vpc });
      const action = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: ['echo hello'],
        input: sourceOutput1,
        vpc,
      });

      // WHEN
      action.connections.allowTo(database, ec2.Port.tcp(5432));
      pipeline.addStage({ stageName: 'Commands', actions: [action] });

      // THEN
      expect(action.connections.securityGroups).toHaveLength(1);
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        IpProtocol: 'tcp',
        FromPort: 5432,
        ToPort: 5432,
        GroupId: { 'Fn::GetAtt': [Match.stringLikeRegexp('^DatabaseSecurityGroup'), 'GroupId'] },
        SourceSecurityGroupId: { 'Fn::GetAtt': [Match.stringLikeRegexp('^PipelineCommandsSecurityGroup'), 'GroupId'] },
      });
    });

    test('exposes the given security groups as connections', () => {
      // GIVEN
      const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
      const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

      // WHEN
      const action = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: ['echo hello'],
        input: sourceOutput1,
        vpc,
        securityGroups: [securityGroup],
      });
      pipeline.addStage({ stageName: 'Commands', actions: [action] });

      // THEN
      expect(action.connections.securityGroups).toEqual([securityGroup]);
    });

    test('fails to access connections without a VPC', () => {
      // GIVEN
      const action = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: ['echo hello'],
        input: sourceOutput1,
      });

      // THEN
      expect(() => action.connections).toThrow('Only Commands actions that run in a VPC have security groups to manage, supply the \'vpc\' property when creating the action');
    });

    test('does not grant VPC permissions without a VPC', () => {
      // WHEN
      addCommandsAction({ computeType: codebuild.ComputeType.MEDIUM });

      // THEN
      const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy');
      expect(JSON.stringify(policies)).not.toContain('ec2:');
    });
  });
});
