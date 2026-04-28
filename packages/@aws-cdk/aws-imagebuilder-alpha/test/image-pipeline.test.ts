import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import type {
  IContainerRecipe,
  IImageRecipe,
  IRecipeBase,
} from '../lib';
import {
  AmazonManagedWorkflow,
  ContainerRecipe,
  DistributionConfiguration,
  ImagePipeline,
  ImagePipelineStatus,
  ImageRecipe,
  InfrastructureConfiguration,
  ScheduleStartCondition,
  WorkflowOnFailure,
  WorkflowParameterValue,
} from '../lib';

/* eslint-disable @stylistic/quote-props */
describe('ImagePipeline', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by name', () => {
    const imagePipeline = ImagePipeline.fromImagePipelineName(
      stack,
      'ImagePipeline',
      'imported-image-pipeline-by-name',
    );

    expect(stack.resolve(imagePipeline.imagePipelineArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:image-pipeline/imported-image-pipeline-by-name',
        ],
      ],
    });
    expect(imagePipeline.imagePipelineName).toEqual('imported-image-pipeline-by-name');
  });

  test('imported by name as an unresolved token', () => {
    const imagePipeline = ImagePipeline.fromImagePipelineName(
      stack,
      'ImagePipeline',
      `test-image-pipeline-${stack.partition}`,
    );

    expect(stack.resolve(imagePipeline.imagePipelineArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:image-pipeline/test-image-pipeline-',
          { Ref: 'AWS::Partition' },
        ],
      ],
    });
    expect(stack.resolve(imagePipeline.imagePipelineName)).toEqual({
      'Fn::Join': ['', ['test-image-pipeline-', { Ref: 'AWS::Partition' }]],
    });
  });

  test('imported by arn', () => {
    const imagePipeline = ImagePipeline.fromImagePipelineArn(
      stack,
      'ImagePipeline',
      'arn:aws:imagebuilder:us-east-1:123456789012:image-pipeline/imported-image-pipeline-by-arn',
    );

    expect(imagePipeline.imagePipelineArn).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:image-pipeline/imported-image-pipeline-by-arn',
    );
    expect(imagePipeline.imagePipelineName).toEqual('imported-image-pipeline-by-arn');
  });

  test('with all parameters - AMI pipeline', () => {
    const executionRole = iam.Role.fromRoleName(stack, 'ExecutionRole', 'imagebuilder-execution-role');
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      imagePipelineName: 'test-image-pipeline',
      description: 'this is an image pipeline description.',
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      infrastructureConfiguration: InfrastructureConfiguration.fromInfrastructureConfigurationName(
        stack,
        'InfrastructureConfiguration',
        'imported-infrastructure-configuration',
      ),
      distributionConfiguration: DistributionConfiguration.fromDistributionConfigurationName(
        stack,
        'DistributionConfiguration',
        'imported-distribution-configuration',
      ),
      status: ImagePipelineStatus.ENABLED,
      executionRole,
      schedule: {
        expression: events.Schedule.cron({ minute: '0', hour: '0', weekDay: '0' }),
        startCondition: ScheduleStartCondition.EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE,
        autoDisableFailureCount: 5,
      },
      workflows: [
        {
          workflow: AmazonManagedWorkflow.buildImage(stack, 'BuildImage'),
          onFailure: WorkflowOnFailure.ABORT,
          parallelGroup: 'group-1',
          parameters: { parameterName: WorkflowParameterValue.fromString('parameterValue') },
        },
      ],
      imageLogGroup: logs.LogGroup.fromLogGroupName(stack, 'ImageLogGroup', '/aws/imagebuilder/test'),
      imagePipelineLogGroup: logs.LogGroup.fromLogGroupName(
        stack,
        'ImagePipelineLogGroup',
        '/aws/imagebuilder/pipeline/test',
      ),
      enhancedImageMetadataEnabled: true,
      imageTestsEnabled: false,
      imageScanningEnabled: true,
    });
    const grants = imagePipeline.grantDefaultExecutionRolePermissions(executionRole);

    expect(grants.length).toBeGreaterThanOrEqual(1);

    expect(ImagePipeline.isImagePipeline(imagePipeline as unknown)).toBeTruthy();
    expect(ImagePipeline.isImagePipeline('ImagePipeline')).toBeFalsy();

    const template = Template.fromStack(stack);

    // Validate that default permissions were added - check presence of ec2:CreateImage
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          { Action: Match.arrayWith(['ec2:CreateImage']), Effect: 'Allow', Resource: Match.anyValue() },
        ]),
      },
    });

    template.templateMatches({
      Resources: {
        ImagePipeline7DDDE57F: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ImagePipeline',
          Properties: {
            Description: 'this is an image pipeline description.',
            DistributionConfigurationArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:distribution-configuration/imported-distribution-configuration',
                ],
              ],
            },
            EnhancedImageMetadataEnabled: true,
            ExecutionRole: {
              'Fn::Join': [
                '',
                ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:role/imagebuilder-execution-role'],
              ],
            },
            ImageRecipeArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:image-recipe/imported-image-recipe/x.x.x',
                ],
              ],
            },
            ImageScanningConfiguration: { ImageScanningEnabled: true },
            ImageTestsConfiguration: { ImageTestsEnabled: false },
            InfrastructureConfigurationArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:infrastructure-configuration/imported-infrastructure-configuration',
                ],
              ],
            },
            LoggingConfiguration: {
              ImageLogGroupName: '/aws/imagebuilder/test',
              PipelineLogGroupName: '/aws/imagebuilder/pipeline/test',
            },
            Name: 'test-image-pipeline',
            Schedule: {
              AutoDisablePolicy: { FailureCount: 5 },
              PipelineExecutionStartCondition: 'EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE',
              ScheduleExpression: 'cron(0 0 ? * 0 *)',
            },
            Status: 'ENABLED',
            Workflows: [
              {
                OnFailure: 'Abort',
                ParallelGroup: 'group-1',
                Parameters: [{ Name: 'parameterName', Value: ['parameterValue'] }],
                WorkflowArn: {
                  'Fn::Join': [
                    '',
                    ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:aws:workflow/build/build-image/x.x.x'],
                  ],
                },
              },
            ],
          },
        }),
      },
    });
  });

  test('with all parameters - container pipeline', () => {
    const executionRole = iam.Role.fromRoleName(stack, 'ExecutionRole', 'imagebuilder-execution-role');
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      imagePipelineName: 'test-image-pipeline',
      description: 'this is an image pipeline description.',
      recipe: ContainerRecipe.fromContainerRecipeName(stack, 'ImageRecipe', 'imported-container-recipe'),
      infrastructureConfiguration: InfrastructureConfiguration.fromInfrastructureConfigurationName(
        stack,
        'InfrastructureConfiguration',
        'imported-infrastructure-configuration',
      ),
      distributionConfiguration: DistributionConfiguration.fromDistributionConfigurationName(
        stack,
        'DistributionConfiguration',
        'imported-distribution-configuration',
      ),
      executionRole,
      status: ImagePipelineStatus.DISABLED,
      schedule: {
        expression: events.Schedule.rate(cdk.Duration.days(7)),
        startCondition: ScheduleStartCondition.EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE,
      },
      workflows: [
        {
          workflow: AmazonManagedWorkflow.buildContainer(stack, 'BuildContainer'),
          onFailure: WorkflowOnFailure.ABORT,
          parallelGroup: 'group-1',
          parameters: { parameterName: WorkflowParameterValue.fromString('parameterValue') },
        },
      ],
      imageLogGroup: logs.LogGroup.fromLogGroupName(stack, 'ImageLogGroup', '/aws/imagebuilder/test'),
      imagePipelineLogGroup: logs.LogGroup.fromLogGroupName(
        stack,
        'ImagePipelineLogGroup',
        '/aws/imagebuilder/pipeline/test',
      ),
      enhancedImageMetadataEnabled: false,
      imageTestsEnabled: true,
      imageScanningEnabled: true,
      imageScanningEcrRepository: ecr.Repository.fromRepositoryName(stack, 'Repository', 'scanning-repo'),
      imageScanningEcrTags: ['latest-scan'],
    });
    imagePipeline.grantDefaultExecutionRolePermissions(executionRole);

    expect(ImagePipeline.isImagePipeline(imagePipeline as unknown)).toBeTruthy();
    expect(ImagePipeline.isImagePipeline('ImagePipeline')).toBeFalsy();

    Template.fromStack(stack).templateMatches({
      Resources: {
        ImagePipeline7DDDE57F: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ImagePipeline',
          Properties: {
            ContainerRecipeArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:container-recipe/imported-container-recipe/x.x.x',
                ],
              ],
            },
            Description: 'this is an image pipeline description.',
            DistributionConfigurationArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:distribution-configuration/imported-distribution-configuration',
                ],
              ],
            },
            EnhancedImageMetadataEnabled: false,
            ExecutionRole: {
              'Fn::Join': [
                '',
                ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:role/imagebuilder-execution-role'],
              ],
            },
            ImageScanningConfiguration: {
              EcrConfiguration: {
                ContainerTags: ['latest-scan'],
                RepositoryName: 'scanning-repo',
              },
              ImageScanningEnabled: true,
            },
            ImageTestsConfiguration: { ImageTestsEnabled: true },
            InfrastructureConfigurationArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:infrastructure-configuration/imported-infrastructure-configuration',
                ],
              ],
            },
            LoggingConfiguration: {
              ImageLogGroupName: '/aws/imagebuilder/test',
              PipelineLogGroupName: '/aws/imagebuilder/pipeline/test',
            },
            Name: 'test-image-pipeline',
            Schedule: {
              PipelineExecutionStartCondition: 'EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE',
              ScheduleExpression: 'rate(7 days)',
            },
            Status: 'DISABLED',
            Workflows: [
              {
                OnFailure: 'Abort',
                ParallelGroup: 'group-1',
                Parameters: [{ Name: 'parameterName', Value: ['parameterValue'] }],
                WorkflowArn: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':imagebuilder:us-east-1:aws:workflow/build/build-container/x.x.x',
                    ],
                  ],
                },
              },
            ],
          },
        }),
      },
    });
  });

  test('with required parameters - AMI pipeline', () => {
    new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(4);

    Template.fromStack(stack).templateMatches({
      Resources: {
        ImagePipeline7DDDE57F: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ImagePipeline',
          Properties: {
            ImageRecipeArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:image-recipe/imported-image-recipe/x.x.x',
                ],
              ],
            },
            InfrastructureConfigurationArn: {
              'Fn::GetAtt': ['ImagePipelineInfrastructureConfiguration70CB8806', 'Arn'],
            },
            Name: 'stack-imagepipeline-8aa53ec3',
          },
        }),
      },
    });
  });

  test('with required parameters - container pipeline', () => {
    new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ContainerRecipe.fromContainerRecipeName(stack, 'ContainerRecipe', 'imported-container-recipe'),
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(4);

    Template.fromStack(stack).templateMatches({
      Resources: {
        ImagePipeline7DDDE57F: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ImagePipeline',
          Properties: {
            ContainerRecipeArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:container-recipe/imported-container-recipe/x.x.x',
                ],
              ],
            },
            InfrastructureConfigurationArn: {
              'Fn::GetAtt': ['ImagePipelineInfrastructureConfiguration70CB8806', 'Arn'],
            },
            Name: 'stack-imagepipeline-8aa53ec3',
          },
        }),
      },
    });
  });

  test('generates an execution role when workflows are provided', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      workflows: [{ workflow: AmazonManagedWorkflow.buildImage(stack, 'BuildImage') }],
    });

    const template = Template.fromStack(stack);

    expect(imagePipeline.executionRole).not.toBeUndefined();
    expect(imagePipeline.executionRole).toBeInstanceOf(iam.Role);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

    template.hasResourceProperties('AWS::ImageBuilder::ImagePipeline', { ExecutionRole: Match.anyValue() });
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
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
    });
  });

  test('generates an execution role when an image log group is provided outside of /aws/imagebuilder/', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      imageLogGroup: logs.LogGroup.fromLogGroupName(stack, 'ImageLogGroup', 'image-log-group'),
    });

    const template = Template.fromStack(stack);

    expect(imagePipeline.executionRole).not.toBeUndefined();
    expect(imagePipeline.executionRole).toBeInstanceOf(iam.Role);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

    template.hasResourceProperties('AWS::ImageBuilder::ImagePipeline', { ExecutionRole: Match.anyValue() });
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
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
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: Match.arrayWith(['logs:CreateLogStream', 'logs:PutLogEvents']),
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':logs:us-east-1:123456789012:log-group:image-log-group:*',
                ],
              ],
            },
          },
        ]),
      },
    });
  });

  test('generates an execution role when an image pipeline log group is provided outside of /aws/imagebuilder/', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      imagePipelineLogGroup: logs.LogGroup.fromLogGroupName(stack, 'ImagePipelineLogGroup', 'image-pipeline-log-group'),
    });

    const template = Template.fromStack(stack);

    expect(imagePipeline.executionRole).not.toBeUndefined();
    expect(imagePipeline.executionRole).toBeInstanceOf(iam.Role);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

    template.hasResourceProperties('AWS::ImageBuilder::ImagePipeline', { ExecutionRole: Match.anyValue() });
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
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
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: Match.arrayWith(['logs:CreateLogStream', 'logs:PutLogEvents']),
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':logs:us-east-1:123456789012:log-group:image-pipeline-log-group:*',
                ],
              ],
            },
          },
        ]),
      },
    });
  });

  test('grants log group permissions to a pre-defined execution role', () => {
    const executionRole = new iam.Role(stack, 'ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
    });

    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      imageLogGroup: logs.LogGroup.fromLogGroupName(stack, 'ImageLogGroup', 'image-log-group'),
      imagePipelineLogGroup: logs.LogGroup.fromLogGroupName(stack, 'ImagePipelineLogGroup', 'image-pipeline-log-group'),
      executionRole,
    });

    const template = Template.fromStack(stack);

    expect(imagePipeline.executionRole).not.toBeUndefined();
    expect(imagePipeline.executionRole).toBeInstanceOf(iam.Role);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

    template.hasResourceProperties('AWS::ImageBuilder::ImagePipeline', { ExecutionRole: Match.anyValue() });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: Match.arrayWith(['logs:CreateLogStream', 'logs:PutLogEvents']),
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                ['arn:', { Ref: 'AWS::Partition' }, ':logs:us-east-1:123456789012:log-group:image-log-group:*'],
              ],
            },
          },
          {
            Action: Match.arrayWith(['logs:CreateLogStream', 'logs:PutLogEvents']),
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':logs:us-east-1:123456789012:log-group:image-pipeline-log-group:*',
                ],
              ],
            },
          },
        ]),
      },
    });
  });

  test('grants read access to IAM roles', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    imagePipeline.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

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
            Action: 'imagebuilder:GetImagePipeline',
            Resource: {
              'Fn::GetAtt': ['ImagePipeline7DDDE57F', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants start pipeline execution access to IAM roles', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    imagePipeline.grantStartExecution(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

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
            Action: 'imagebuilder:StartImagePipelineExecution',
            Resource: {
              'Fn::GetAtt': ['ImagePipeline7DDDE57F', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants permissions to IAM roles', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    imagePipeline.grant(role, 'imagebuilder:DeleteImagePipeline', 'imagebuilder:UpdateImagePipeline');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImagePipeline', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

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
            Action: ['imagebuilder:DeleteImagePipeline', 'imagebuilder:UpdateImagePipeline'],
            Resource: {
              'Fn::GetAtt': ['ImagePipeline7DDDE57F', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('creates a rule from onEvent', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    imagePipeline.onEvent('PipelineRule');

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: { source: ['aws.imagebuilder'] },
      State: 'ENABLED',
    });
  });

  test('creates a rule from onCVEDetected', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    imagePipeline.onCVEDetected('CVEDetectionRule');

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        source: ['aws.imagebuilder'],
        resources: [{ 'Fn::GetAtt': ['ImagePipeline7DDDE57F', 'Arn'] }],
        'detail-type': ['EC2 Image Builder CVE Detected'],
      },
      State: 'ENABLED',
    });
  });

  test('creates a rule from onImageBuildStateChange', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    imagePipeline.onImageBuildStateChange('ImageBuildStateChangeRule');

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        source: ['aws.imagebuilder'],
        'detail-type': ['EC2 Image Builder Image State Change'],
      },
      State: 'ENABLED',
    });
  });

  test('creates a rule from onImageBuildCompleted', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    imagePipeline.onImageBuildCompleted('ImageBuildCompletedRule');

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        source: ['aws.imagebuilder'],
        'detail-type': ['EC2 Image Builder Image State Change'],
        detail: { state: { status: ['AVAILABLE', 'CANCELLED', 'FAILED'] } },
      },
      State: 'ENABLED',
    });
  });

  test('creates a rule from onImageBuildFailed', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    imagePipeline.onImageBuildFailed('ImageBuildFailedRule');

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        source: ['aws.imagebuilder'],
        'detail-type': ['EC2 Image Builder Image State Change'],
        detail: { state: { status: ['FAILED'] } },
      },
      State: 'ENABLED',
    });
  });

  test('creates a rule from onImageBuildSucceeded', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    imagePipeline.onImageBuildSucceeded('ImageBuildSuccessRule');

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        source: ['aws.imagebuilder'],
        'detail-type': ['EC2 Image Builder Image State Change'],
        detail: { state: { status: ['AVAILABLE'] } },
      },
      State: 'ENABLED',
    });
  });

  test('creates a rule from onImagePipelineAutoDisabled', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    imagePipeline.onImagePipelineAutoDisabled('ImagePipelineAutoDisabledRule');

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        source: ['aws.imagebuilder'],
        resources: [{ 'Fn::GetAtt': ['ImagePipeline7DDDE57F', 'Arn'] }],
        'detail-type': ['EC2 Image Builder Image Pipeline Automatically Disabled'],
      },
      State: 'ENABLED',
    });
  });

  test('creates a rule from onWaitForAction', () => {
    const imagePipeline = new ImagePipeline(stack, 'ImagePipeline', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    imagePipeline.onWaitForAction('ImageBuildWaitingRule');

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        source: ['aws.imagebuilder'],
        'detail-type': ['EC2 Image Builder Workflow Step Waiting'],
      },
      State: 'ENABLED',
    });
  });

  test('throws a validation error when the resource name is too long', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        imagePipelineName: 'a'.repeat(129),
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains spaces', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        imagePipelineName: 'an image pipeline',
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains underscores', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        imagePipelineName: 'an_image_pipeline',
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains uppercase characters', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        imagePipelineName: 'AnImagePipeline',
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the auto disable failure count is lower than the limit', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        schedule: { expression: events.Schedule.rate(cdk.Duration.days(7)), autoDisableFailureCount: -1 },
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the auto disable failure count is higher than the limit', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        schedule: { expression: events.Schedule.rate(cdk.Duration.days(7)), autoDisableFailureCount: 11 },
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('does not throw a validation error when the auto disable failure count is an unresolved token', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        schedule: {
          expression: events.Schedule.rate(cdk.Duration.days(7)),
          autoDisableFailureCount: cdk.Lazy.number({ produce: () => 100 }),
        },
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      });
    }).not.toThrow(cdk.ValidationError);
  });

  test('throws a validation error when an image scanning ECR repository is provided for an AMI pipeline', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
        imageScanningEcrRepository: ecr.Repository.fromRepositoryName(stack, 'Repository', 'scanning-repo'),
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when an image scanning ECR tag is provided for an AMI pipeline', () => {
    expect(() => {
      new ImagePipeline(stack, 'ImagePipeline', {
        recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
        imageScanningEcrTags: ['latest-scan'],
      });
    }).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the recipe is neither an IImageRecipe or IContainerRecipe', () => {
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

    expect(() => new ImagePipeline(stack, 'ImagePipeline', { recipe: new BadRecipe(stack, 'BadRecipe') })).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when the recipe is both an IImageRecipe and IContainerRecipe', () => {
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
        return true;
      }

      public _isImageRecipe(): this is IImageRecipe {
        return true;
      }
    }

    expect(() => new ImagePipeline(stack, 'ImagePipeline', { recipe: new BadRecipe(stack, 'BadRecipe') })).toThrow(
      cdk.ValidationError,
    );
  });
});
