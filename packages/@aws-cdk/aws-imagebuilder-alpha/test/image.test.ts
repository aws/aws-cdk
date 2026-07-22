import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
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
  Image,
  ImageRecipe,
  InfrastructureConfiguration,
  WorkflowOnFailure,
  WorkflowParameterValue,
} from '../lib';

describe('Image', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by name', () => {
    const image = Image.fromImageName(stack, 'Image', 'imported-image-by-name');

    expect(stack.resolve(image.imageArn)).toEqual({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:123456789012:image/imported-image-by-name/x.x.x'],
      ],
    });
    expect(image.imageName).toEqual('imported-image-by-name');
    expect(image.imageVersion).toEqual('x.x.x');
  });

  test('imported by name as an unresolved token', () => {
    const image = Image.fromImageName(stack, 'Image', `test-image-${stack.partition}`);

    expect(stack.resolve(image.imageArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:image/test-image-',
          { Ref: 'AWS::Partition' },
          '/x.x.x',
        ],
      ],
    });
    expect(stack.resolve(image.imageName)).toEqual({
      'Fn::Join': ['', ['test-image-', { Ref: 'AWS::Partition' }]],
    });
    expect(image.imageVersion).toEqual('x.x.x');
  });

  test('imported by arn', () => {
    const image = Image.fromImageArn(
      stack,
      'Image',
      'arn:aws:imagebuilder:us-east-1:123456789012:image/imported-image-by-arn/1.2.3/4',
    );

    expect(image.imageArn).toEqual('arn:aws:imagebuilder:us-east-1:123456789012:image/imported-image-by-arn/1.2.3/4');
    expect(image.imageName).toEqual('imported-image-by-arn');
    expect(image.imageVersion).toEqual('1.2.3');
  });

  test('imported by arn as an unresolved token', () => {
    const image = Image.fromImageArn(
      stack,
      'Image',
      `arn:aws:imagebuilder:us-east-1:123456789012:image/imported-image-by-arn-${stack.partition}/1.2.3/4`,
    );

    expect(stack.resolve(image.imageArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:aws:imagebuilder:us-east-1:123456789012:image/imported-image-by-arn-',
          { Ref: 'AWS::Partition' },
          '/1.2.3/4',
        ],
      ],
    });
    expect(stack.resolve(image.imageName)).toEqual({
      'Fn::Select': [
        0,
        {
          'Fn::Split': ['/', { 'Fn::Join': ['', ['imported-image-by-arn-', { Ref: 'AWS::Partition' }, '/1.2.3/4']] }],
        },
      ],
    });
    expect(stack.resolve(image.imageVersion)).toEqual({
      'Fn::Select': [
        1,
        {
          'Fn::Split': [
            '/',
            {
              'Fn::Join': ['', ['imported-image-by-arn-', { Ref: 'AWS::Partition' }, '/1.2.3/4']],
            },
          ],
        },
      ],
    });
  });

  test('imported by attributes', () => {
    const image = Image.fromImageAttributes(stack, 'Image', {
      imageName: 'imported-image-by-attributes',
      imageVersion: '1.2.3',
    });

    expect(stack.resolve(image.imageArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:image/imported-image-by-attributes/1.2.3',
        ],
      ],
    });
    expect(image.imageName).toEqual('imported-image-by-attributes');
    expect(image.imageVersion).toEqual('1.2.3');
  });

  test('with all parameters - image recipe', () => {
    const deletionExecutionRole = iam.Role.fromRoleName(stack, 'DeletionExecutionRole', 'imagebuilder-lifecycle-role');
    const executionRole = iam.Role.fromRoleName(stack, 'ExecutionRole', 'imagebuilder-execution-role');
    const image = new Image(stack, 'Image', {
      recipe: ImageRecipe.fromImageRecipeAttributes(stack, 'ImageRecipe', { imageRecipeName: 'test-image-recipe' }),
      infrastructureConfiguration: InfrastructureConfiguration.fromInfrastructureConfigurationName(
        stack,
        'InfrastructureConfiguration',
        'test-infrastructure-configuration',
      ),
      distributionConfiguration: DistributionConfiguration.fromDistributionConfigurationName(
        stack,
        'DistributionConfiguration',
        'test-distribution-configuration',
      ),
      workflows: [
        {
          workflow: AmazonManagedWorkflow.buildImage(stack, 'BuildImage'),
          onFailure: WorkflowOnFailure.ABORT,
          parallelGroup: 'group-1',
          parameters: { parameterName: WorkflowParameterValue.fromString('parameterValue') },
        },
      ],
      executionRole,
      logGroup: logs.LogGroup.fromLogGroupName(stack, 'LogGroup', 'test-log-group'),
      imageTestsEnabled: true,
      imageScanningEnabled: true,
      enhancedImageMetadataEnabled: true,
      deletionExecutionRole,
      tags: { key1: 'value1', key2: 'value2' },
    });
    const grants = image.grantDefaultExecutionRolePermissions(executionRole);

    expect(grants.length).toBeGreaterThanOrEqual(1);

    expect(Image.isImage(image as unknown)).toBeTruthy();
    expect(Image.isImage('ImagePipeline')).toBeFalsy();

    const template = Template.fromStack(stack);

    // Validate that default permissions were added - check presence of ec2:CreateImage
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          { Action: Match.arrayWith(['ec2:CreateImage']), Effect: 'Allow', Resource: Match.anyValue() },
        ]),
      },
    });

    expect(Image.isImage(image as unknown)).toBeTruthy();
    expect(Image.isImage('Image')).toBeFalsy();

    template.templateMatches({
      Resources: {
        Image9D742C96: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Image',
          Properties: {
            DeletionSettings: {
              ExecutionRole: {
                'Fn::Join': [
                  '',
                  ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:role/imagebuilder-lifecycle-role'],
                ],
              },
            },
            DistributionConfigurationArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:distribution-configuration/test-distribution-configuration',
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
                  ':imagebuilder:us-east-1:123456789012:image-recipe/test-image-recipe/x.x.x',
                ],
              ],
            },
            ImageScanningConfiguration: { ImageScanningEnabled: true },
            ImageTestsConfiguration: { ImageTestsEnabled: true },
            InfrastructureConfigurationArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:infrastructure-configuration/test-infrastructure-configuration',
                ],
              ],
            },
            LoggingConfiguration: { LogGroupName: 'test-log-group' },
            Tags: { key1: 'value1', key2: 'value2' },
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

  test('with all parameters - container recipe', () => {
    const deletionExecutionRole = iam.Role.fromRoleName(stack, 'DeletionExecutionRole', 'imagebuilder-lifecycle-role');
    const image = new Image(stack, 'Image', {
      recipe: ContainerRecipe.fromContainerRecipeAttributes(stack, 'ContainerRecipe', {
        containerRecipeName: 'test-container-recipe',
      }),
      infrastructureConfiguration: InfrastructureConfiguration.fromInfrastructureConfigurationName(
        stack,
        'InfrastructureConfiguration',
        'test-infrastructure-configuration',
      ),
      distributionConfiguration: DistributionConfiguration.fromDistributionConfigurationName(
        stack,
        'DistributionConfiguration',
        'test-distribution-configuration',
      ),
      workflows: [
        {
          workflow: AmazonManagedWorkflow.buildContainer(stack, 'BuildContainer'),
          onFailure: WorkflowOnFailure.ABORT,
          parallelGroup: 'group-1',
          parameters: { parameterName: WorkflowParameterValue.fromString('parameterValue') },
        },
      ],
      executionRole: iam.Role.fromRoleName(stack, 'ExecutionRole', 'test-execution-role'),
      logGroup: logs.LogGroup.fromLogGroupName(stack, 'LogGroup', 'test-log-group'),
      imageTestsEnabled: true,
      imageScanningEnabled: true,
      imageScanningEcrRepository: ecr.Repository.fromRepositoryName(
        stack,
        'ImageScanningRepository',
        'image-scanning-repository',
      ),
      imageScanningEcrTags: ['latest-scan'],
      enhancedImageMetadataEnabled: true,
      deletionExecutionRole,
      tags: { key1: 'value1', key2: 'value2' },
    });

    expect(Image.isImage(image as unknown)).toBeTruthy();
    expect(Image.isImage('Image')).toBeFalsy();

    Template.fromStack(stack).templateMatches({
      Resources: {
        Image9D742C96: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Image',
          Properties: {
            DeletionSettings: {
              ExecutionRole: {
                'Fn::Join': [
                  '',
                  ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:role/imagebuilder-lifecycle-role'],
                ],
              },
            },
            DistributionConfigurationArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:distribution-configuration/test-distribution-configuration',
                ],
              ],
            },
            EnhancedImageMetadataEnabled: true,
            ExecutionRole: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:role/test-execution-role']],
            },
            ContainerRecipeArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:container-recipe/test-container-recipe/x.x.x',
                ],
              ],
            },
            ImageScanningConfiguration: {
              ImageScanningEnabled: true,
              EcrConfiguration: { RepositoryName: 'image-scanning-repository', ContainerTags: ['latest-scan'] },
            },
            ImageTestsConfiguration: { ImageTestsEnabled: true },
            InfrastructureConfigurationArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:infrastructure-configuration/test-infrastructure-configuration',
                ],
              ],
            },
            LoggingConfiguration: { LogGroupName: 'test-log-group' },
            Tags: { key1: 'value1', key2: 'value2' },
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

  test('with required parameters - image recipe', () => {
    new Image(stack, 'Image', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'test-image-recipe'),
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ImageBuilder::Image', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(4);

    template.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonSSMManagedInstanceCore']] },
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/EC2InstanceProfileForImageBuilder']] },
      ],
    });

    template.templateMatches({
      Resources: {
        Image9D742C96: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Image',
          Properties: {
            ImageRecipeArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:image-recipe/test-image-recipe/x.x.x',
                ],
              ],
            },
            InfrastructureConfigurationArn: {
              'Fn::GetAtt': ['ImageInfrastructureConfigurationF814DF47', 'Arn'],
            },
          },
        }),
      },
    });
  });

  test('with required parameters - container recipe', () => {
    new Image(stack, 'Image', {
      recipe: ContainerRecipe.fromContainerRecipeName(stack, 'ContainerRecipe', 'test-container-recipe'),
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ImageBuilder::Image', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(4);

    template.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonSSMManagedInstanceCore']] },
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/EC2InstanceProfileForImageBuilder']] },
        {
          'Fn::Join': [
            '',
            ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/EC2InstanceProfileForImageBuilderECRContainerBuilds'],
          ],
        },
      ],
    });

    template.templateMatches({
      Resources: {
        Image9D742C96: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Image',
          Properties: {
            ContainerRecipeArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':imagebuilder:us-east-1:123456789012:container-recipe/test-container-recipe/x.x.x',
                ],
              ],
            },
            InfrastructureConfigurationArn: {
              'Fn::GetAtt': ['ImageInfrastructureConfigurationF814DF47', 'Arn'],
            },
          },
        }),
      },
    });
  });

  test('generates an execution role when workflows are provided', () => {
    const image = new Image(stack, 'Image', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      workflows: [{ workflow: AmazonManagedWorkflow.buildImage(stack, 'BuildImage') }],
    });

    const template = Template.fromStack(stack);

    expect(image.executionRole).not.toBeUndefined();
    expect(image.executionRole).toBeInstanceOf(iam.Role);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::Image', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

    template.hasResourceProperties('AWS::ImageBuilder::Image', { ExecutionRole: Match.anyValue() });
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

  test('generates an execution role when a log group is provided outside of /aws/imagebuilder/', () => {
    const image = new Image(stack, 'Image', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      logGroup: logs.LogGroup.fromLogGroupName(stack, 'ImageLogGroup', 'image-log-group'),
    });

    const template = Template.fromStack(stack);

    expect(image.executionRole).not.toBeUndefined();
    expect(image.executionRole).toBeInstanceOf(iam.Role);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::Image', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

    template.hasResourceProperties('AWS::ImageBuilder::Image', { ExecutionRole: Match.anyValue() });
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
                ['arn:', { Ref: 'AWS::Partition' }, ':logs:us-east-1:123456789012:log-group:image-log-group:*'],
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

    const image = new Image(stack, 'Image', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
      logGroup: logs.LogGroup.fromLogGroupName(stack, 'ImageLogGroup', 'image-log-group'),
      executionRole,
    });

    const template = Template.fromStack(stack);

    expect(image.executionRole).not.toBeUndefined();
    expect(image.executionRole).toBeInstanceOf(iam.Role);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::Image', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(6);

    template.hasResourceProperties('AWS::ImageBuilder::Image', { ExecutionRole: Match.anyValue() });
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
        ]),
      },
    });
  });

  test('grants read access to IAM roles', () => {
    const image = new Image(stack, 'Image', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    image.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::Image', 1);
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
            Action: 'imagebuilder:GetImage',
            Resource: {
              'Fn::GetAtt': ['Image9D742C96', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants permissions to IAM roles', () => {
    const image = new Image(stack, 'Image', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    image.grant(role, 'imagebuilder:DeleteImage', 'imagebuilder:ListImagePackages');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.resourceCountIs('AWS::ImageBuilder::InfrastructureConfiguration', 1);
    template.resourceCountIs('AWS::ImageBuilder::Image', 1);
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
            Action: ['imagebuilder:DeleteImage', 'imagebuilder:ListImagePackages'],
            Resource: {
              'Fn::GetAtt': ['Image9D742C96', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants default execution role permissions on imported images', () => {
    const image = new Image(stack, 'Image', {
      recipe: ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe'),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    const grants = image.grantDefaultExecutionRolePermissions(role);
    const template = Template.fromStack(stack);

    expect(grants.length).toBeGreaterThanOrEqual(1);

    // Validate that default permissions were added - check presence of ec2:CreateImage
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          { Action: Match.arrayWith(['ec2:CreateImage']), Effect: 'Allow', Resource: Match.anyValue() },
        ]),
      },
    });
  });

  test('throws a validation error when neither an imageArn and imageName are provided when importing by attributes', () => {
    expect(() => Image.fromImageAttributes(stack, 'Image', { imageVersion: '2025.x.x' })).toThrow(cdk.ValidationError);
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

    expect(() => new Image(stack, 'Image', { recipe: new BadRecipe(stack, 'BadRecipe') })).toThrow(cdk.ValidationError);
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

    expect(() => new Image(stack, 'Image', { recipe: new BadRecipe(stack, 'BadRecipe') })).toThrow(cdk.ValidationError);
  });
});
