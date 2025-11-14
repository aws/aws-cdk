import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  AwsManagedComponent,
  AwsMarketplaceComponent,
  Component,
  ComponentAction,
  ComponentData,
  ComponentOnFailure,
  ComponentParameterValue,
  ComponentPhaseName,
  ComponentSchemaVersion,
  OSVersion,
  Platform,
} from '../lib';

describe('Component', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by name', () => {
    const component = Component.fromComponentName(stack, 'Component', 'imported-component-by-name');

    expect(stack.resolve(component.componentArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:component/imported-component-by-name/x.x.x',
        ],
      ],
    });
    expect(component.componentName).toEqual('imported-component-by-name');
    expect(component.componentVersion).toEqual('x.x.x');
  });

  test('imported by name as an unresolved token', () => {
    const component = Component.fromComponentName(stack, 'Component', `test-component-${stack.partition}`);

    expect(stack.resolve(component.componentArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:component/test-component-',
          { Ref: 'AWS::Partition' },
          '/x.x.x',
        ],
      ],
    });
    expect(stack.resolve(component.componentName)).toEqual({
      'Fn::Join': ['', ['test-component-', { Ref: 'AWS::Partition' }]],
    });
    expect(component.componentVersion).toEqual('x.x.x');
  });

  test('imported by arn', () => {
    const component = Component.fromComponentArn(
      stack,
      'Component',
      'arn:aws:imagebuilder:us-east-1:123456789012:component/imported-component-by-arn/1.2.3/4',
    );

    expect(component.componentArn).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:component/imported-component-by-arn/1.2.3/4',
    );
    expect(component.componentName).toEqual('imported-component-by-arn');
    expect(component.componentVersion).toEqual('1.2.3');
  });

  test('imported by arn as an unresolved token', () => {
    const component = Component.fromComponentArn(
      stack,
      'Component',
      `arn:aws:imagebuilder:us-east-1:123456789012:component/imported-component-by-arn-${stack.partition}/1.2.3/4`,
    );

    expect(stack.resolve(component.componentArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:aws:imagebuilder:us-east-1:123456789012:component/imported-component-by-arn-',
          { Ref: 'AWS::Partition' },
          '/1.2.3/4',
        ],
      ],
    });
    expect(stack.resolve(component.componentName)).toEqual({
      'Fn::Select': [
        0,
        {
          'Fn::Split': [
            '/',
            { 'Fn::Join': ['', ['imported-component-by-arn-', { Ref: 'AWS::Partition' }, '/1.2.3/4']] },
          ],
        },
      ],
    });
    expect(stack.resolve(component.componentVersion)).toEqual({
      'Fn::Select': [
        1,
        {
          'Fn::Split': [
            '/',
            {
              'Fn::Join': ['', ['imported-component-by-arn-', { Ref: 'AWS::Partition' }, '/1.2.3/4']],
            },
          ],
        },
      ],
    });
  });

  test('imported by attributes', () => {
    const component = Component.fromComponentAttributes(stack, 'Component', {
      componentName: 'imported-component-by-attributes',
      componentVersion: '1.2.3',
    });

    expect(stack.resolve(component.componentArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:component/imported-component-by-attributes/1.2.3',
        ],
      ],
    });
    expect(component.componentName).toEqual('imported-component-by-attributes');
    expect(component.componentVersion).toEqual('1.2.3');
  });

  test('AWS-managed component import by name', () => {
    const component = AwsManagedComponent.fromAwsManagedComponentName(
      stack,
      'Component',
      'amazon-cloudwatch-agent-linux',
    );

    expect(stack.resolve(component.componentArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:aws:component/amazon-cloudwatch-agent-linux/x.x.x',
        ],
      ],
    });
    expect(component.componentName).toEqual('amazon-cloudwatch-agent-linux');
    expect(component.componentVersion).toEqual('x.x.x');
  });

  test('AWS-managed component import by attributes', () => {
    const component = AwsManagedComponent.fromAwsManagedComponentAttributes(stack, 'Component', {
      componentName: 'amazon-cloudwatch-agent-linux',
      componentVersion: 'x.x.x',
    });

    expect(stack.resolve(component.componentArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:aws:component/amazon-cloudwatch-agent-linux/x.x.x',
        ],
      ],
    });
    expect(component.componentName).toEqual('amazon-cloudwatch-agent-linux');
    expect(component.componentVersion).toEqual('x.x.x');
  });

  test('AWS-managed component pre-defined method import', () => {
    const awsCliV2Linux = AwsManagedComponent.awsCliV2(stack, 'AwsCliV2Linux-Component', { platform: Platform.LINUX });
    const awsCliV2Windows = AwsManagedComponent.awsCliV2(stack, 'AwsCliV2Windows-Component', {
      platform: Platform.WINDOWS,
    });
    const helloWorldLinux = AwsManagedComponent.helloWorld(stack, 'HelloWorldLinux-Component', {
      platform: Platform.LINUX,
    });
    const helloWorldWindows = AwsManagedComponent.helloWorld(stack, 'HelloWorldWindows-Component', {
      platform: Platform.WINDOWS,
    });
    const python3Linux = AwsManagedComponent.python3(stack, 'Python3Linux-Component', { platform: Platform.LINUX });
    const python3Windows = AwsManagedComponent.python3(stack, 'Python3Windows-Component', {
      platform: Platform.WINDOWS,
    });
    const rebootLinux = AwsManagedComponent.reboot(stack, 'RebootLinux-Component', { platform: Platform.LINUX });
    const rebootWindows = AwsManagedComponent.reboot(stack, 'RebootWindows-Component', { platform: Platform.WINDOWS });
    const stigBuildLinux = AwsManagedComponent.stigBuild(stack, 'StigBuildLinux-Component', {
      platform: Platform.LINUX,
    });
    const stigBuildWindows = AwsManagedComponent.stigBuild(stack, 'StigBuildWindows-Component', {
      platform: Platform.WINDOWS,
    });
    const updateLinux = AwsManagedComponent.updateOS(stack, 'UpdateLinux-Component', { platform: Platform.LINUX });
    const updateWindows = AwsManagedComponent.updateOS(stack, 'UpdateWindows-Component', {
      platform: Platform.WINDOWS,
    });

    const expectedComponentArn = (componentName: string) => ({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, `:imagebuilder:us-east-1:aws:component/${componentName}/x.x.x`],
      ],
    });

    expect(stack.resolve(awsCliV2Linux.componentArn)).toEqual(expectedComponentArn('aws-cli-version-2-linux'));
    expect(stack.resolve(awsCliV2Windows.componentArn)).toEqual(expectedComponentArn('aws-cli-version-2-windows'));
    expect(stack.resolve(helloWorldLinux.componentArn)).toEqual(expectedComponentArn('hello-world-linux'));
    expect(stack.resolve(helloWorldWindows.componentArn)).toEqual(expectedComponentArn('hello-world-windows'));
    expect(stack.resolve(python3Linux.componentArn)).toEqual(expectedComponentArn('python-3-linux'));
    expect(stack.resolve(python3Windows.componentArn)).toEqual(expectedComponentArn('python-3-windows'));
    expect(stack.resolve(rebootLinux.componentArn)).toEqual(expectedComponentArn('reboot-linux'));
    expect(stack.resolve(rebootWindows.componentArn)).toEqual(expectedComponentArn('reboot-windows'));
    expect(stack.resolve(stigBuildLinux.componentArn)).toEqual(expectedComponentArn('stig-build-linux'));
    expect(stack.resolve(stigBuildWindows.componentArn)).toEqual(expectedComponentArn('stig-build-windows'));
    expect(stack.resolve(updateLinux.componentArn)).toEqual(expectedComponentArn('update-linux'));
    expect(stack.resolve(updateWindows.componentArn)).toEqual(expectedComponentArn('update-windows'));
  });

  test('AWS Marketplace component import by required attributes', () => {
    const component = AwsMarketplaceComponent.fromAwsMarketplaceComponentAttributes(stack, 'Component', {
      componentName: 'marketplace-component',
      componentVersion: '1.x.x',
      marketplaceProductId: 'marketplace-product-id',
    });

    expect(stack.resolve(component.componentArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:aws-marketplace:component/marketplace-component-marketplace-product-id/1.x.x',
        ],
      ],
    });
    expect(component.componentName).toEqual('marketplace-component-marketplace-product-id');
    expect(component.componentVersion).toEqual('1.x.x');
  });

  test('AWS Marketplace component import by all attributes', () => {
    const component = AwsMarketplaceComponent.fromAwsMarketplaceComponentAttributes(stack, 'Component', {
      componentName: 'marketplace-component',
      marketplaceProductId: 'marketplace-product-id',
    });

    expect(stack.resolve(component.componentArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:aws-marketplace:component/marketplace-component-marketplace-product-id/x.x.x',
        ],
      ],
    });
    expect(component.componentName).toEqual('marketplace-component-marketplace-product-id');
    expect(component.componentVersion).toEqual('x.x.x');
  });

  test('with all parameters', () => {
    const component = new Component(stack, 'Component', {
      componentName: 'test-component',
      componentVersion: '1.0.0',
      description: 'This is a test component',
      changeDescription: 'This is a change description',
      platform: Platform.LINUX,
      kmsKey: kms.Key.fromKeyArn(
        stack,
        'ComponentKey',
        stack.formatArn({ service: 'kms', resource: 'key', resourceName: '1234abcd-12ab-34cd-56ef-1234567890ab' }),
      ),
      supportedOsVersions: [OSVersion.AMAZON_LINUX, OSVersion.custom(Platform.LINUX, 'Custom OS')],
      data: ComponentData.fromComponentDocumentJsonObject({
        name: 'test-component',
        schemaVersion: ComponentSchemaVersion.V1_0,
        phases: [
          {
            name: ComponentPhaseName.BUILD,
            steps: [
              {
                name: 'hello-world-build',
                action: ComponentAction.EXECUTE_BASH,
                onFailure: ComponentOnFailure.CONTINUE,
                timeout: cdk.Duration.seconds(720),
                loop: {
                  name: 'scope',
                  forEach: ['world', 'universe'],
                },
                inputs: {
                  commands: ['echo "Hello {{ scope.value }}!"'],
                },
              },
            ],
          },
          {
            name: ComponentPhaseName.VALIDATE,
            steps: [
              {
                name: 'hello-world-validate',
                action: ComponentAction.EXECUTE_BASH,
                loop: {
                  name: 'scope',
                  for: {
                    start: 0,
                    end: 10,
                    updateBy: 1,
                  },
                },
                inputs: {
                  commands: ['echo "Hello {{ scope.index }} validate!"'],
                },
              },
            ],
          },
          {
            name: ComponentPhaseName.TEST,
            steps: [
              {
                name: 'hello-world-test',
                action: ComponentAction.EXECUTE_BASH,
                inputs: {
                  commands: ['echo "Hello test!"'],
                },
              },
            ],
          },
        ],
      }),
    });

    expect(Component.isComponent(component as unknown)).toBeTruthy();
    expect(Component.isComponent('Component')).toBeFalsy();

    Template.fromStack(stack).templateMatches({
      Resources: {
        Component0EED0119: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Component',
          Properties: {
            Name: 'test-component',
            Version: '1.0.0',
            Description: 'This is a test component',
            ChangeDescription: 'This is a change description',
            Platform: 'Linux',
            SupportedOsVersions: ['Amazon Linux', 'Custom OS'],
            KmsKeyId: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab',
                ],
              ],
            },
            Data: `name: test-component
schemaVersion: "1.0"
phases:
  - name: build
    steps:
      - name: hello-world-build
        action: ExecuteBash
        onFailure: Continue
        timeoutSeconds: 720
        loop:
          name: scope
          forEach:
            - world
            - universe
        inputs:
          commands:
            - echo "Hello {{ scope.value }}!"
  - name: validate
    steps:
      - name: hello-world-validate
        action: ExecuteBash
        loop:
          name: scope
          for:
            start: 0
            end: 10
            updateBy: 1
        inputs:
          commands:
            - echo "Hello {{ scope.index }} validate!"
  - name: test
    steps:
      - name: hello-world-test
        action: ExecuteBash
        inputs:
          commands:
            - echo "Hello test!"
`,
          },
        }),
      },
    });
  });

  test('with required parameters', () => {
    new Component(stack, 'Component', {
      platform: Platform.LINUX,
      data: ComponentData.fromJsonObject({
        name: 'test-component',
        schemaVersion: ComponentSchemaVersion.V1_0,
        phases: [
          {
            name: ComponentPhaseName.BUILD,
            steps: [
              {
                name: 'hello-world-build',
                action: ComponentAction.EXECUTE_BASH,
                inputs: {
                  commands: ['echo "Hello build!"'],
                },
              },
            ],
          },
        ],
      }),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Component0EED0119: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Component',
          Properties: {
            Name: 'stack-component-33dabf20',
            Version: '1.0.0',
            Platform: 'Linux',
            Data: `name: test-component
schemaVersion: "1.0"
phases:
  - name: build
    steps:
      - name: hello-world-build
        action: ExecuteBash
        inputs:
          commands:
            - echo "Hello build!"
`,
          },
        }),
      },
    });
  });

  test('with component data as a file asset', () => {
    new Component(stack, 'Component', {
      platform: Platform.LINUX,
      data: ComponentData.fromAsset(stack, 'ComponentData', path.join(__dirname, 'assets', 'component-data.yaml')),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Component0EED0119: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Component',
          Properties: {
            Name: 'stack-component-33dabf20',
            Version: '1.0.0',
            Platform: 'Linux',
            Uri: 's3://cdk-hnb659fds-assets-123456789012-us-east-1/bc0e810d66f3b8e9e6cfe276de3f128be221671559a8b6e657d1d97ace42bd52.yaml',
          },
        }),
      },
    });
  });

  test('with component data as an S3 location', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'component-bucket-123456789012-us-east-1');
    new Component(stack, 'Component', {
      platform: Platform.LINUX,
      data: ComponentData.fromS3(bucket, 'components/component.yaml'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Component0EED0119: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Component',
          Properties: {
            Name: 'stack-component-33dabf20',
            Version: '1.0.0',
            Platform: 'Linux',
            Uri: 's3://component-bucket-123456789012-us-east-1/components/component.yaml',
          },
        }),
      },
    });
  });

  test('with component data as an inline string', () => {
    new Component(stack, 'Component', {
      platform: Platform.LINUX,
      data: ComponentData.fromInline(`name: test-component
schemaVersion: "1.0"
phases:
  - name: build
    steps:
      - name: hello-world-build
        action: ExecuteBash
        inputs:
          commands:
            - echo "Hello build!"
`),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Component0EED0119: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Component',
          Properties: {
            Name: 'stack-component-33dabf20',
            Version: '1.0.0',
            Platform: 'Linux',
            Data: `name: test-component
schemaVersion: "1.0"
phases:
  - name: build
    steps:
      - name: hello-world-build
        action: ExecuteBash
        inputs:
          commands:
            - echo "Hello build!"
`,
          },
        }),
      },
    });
  });

  test('component string parameter value renders as expected', () => {
    const parameterValue = ComponentParameterValue.fromString('test-value');
    expect(parameterValue.value).toEqual(['test-value']);
  });

  test('grants read access to IAM roles', () => {
    const component = new Component(stack, 'Component', {
      platform: Platform.LINUX,
      data: ComponentData.fromJsonObject({
        name: 'test-component',
        schemaVersion: ComponentSchemaVersion.V1_0,
        phases: [
          {
            name: ComponentPhaseName.BUILD,
            steps: [
              {
                action: ComponentAction.EXECUTE_BASH,
                name: 'hello-world-build',
                inputs: {
                  commands: ['echo "Hello build!"'],
                },
              },
            ],
          },
        ],
      }),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    component.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::Component', 1);
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
            Action: 'imagebuilder:GetComponent',
            Resource: {
              'Fn::GetAtt': ['Component0EED0119', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants permissions to IAM roles', () => {
    const component = new Component(stack, 'Component', {
      platform: Platform.LINUX,
      data: ComponentData.fromJsonObject({
        name: 'test-component',
        schemaVersion: ComponentSchemaVersion.V1_0,
        phases: [
          {
            name: ComponentPhaseName.BUILD,
            steps: [
              {
                action: ComponentAction.EXECUTE_BASH,
                name: 'hello-world-build',
                inputs: {
                  commands: ['echo "Hello build!"'],
                },
              },
            ],
          },
        ],
      }),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    component.grant(role, 'imagebuilder:DeleteComponent', 'imagebuilder:GetComponent');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::Component', 1);
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
            Action: ['imagebuilder:DeleteComponent', 'imagebuilder:GetComponent'],
            Resource: {
              'Fn::GetAtt': ['Component0EED0119', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants S3 put permissions on S3 asset to IAM roles', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'component-bucket-123456789012-us-east-1');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });
    const componentData = ComponentData.fromS3(bucket, 'components/component.yaml');
    new Component(stack, 'Component', {
      platform: Platform.LINUX,
      data: componentData,
    });

    componentData.grantPut(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::Component', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.anyValue(),
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith(['s3:PutObject']),
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':s3:::component-bucket-123456789012-us-east-1/components/component.yaml',
                ],
              ],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants S3 read permissions on S3 asset to IAM roles', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'component-bucket-123456789012-us-east-1');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });
    const componentData = ComponentData.fromS3(bucket, 'components/component.yaml');
    new Component(stack, 'Component', {
      platform: Platform.LINUX,
      data: componentData,
    });

    componentData.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::Component', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.anyValue(),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith(['s3:GetObject*']),
            Resource: [
              {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::component-bucket-123456789012-us-east-1']],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3:::component-bucket-123456789012-us-east-1/components/component.yaml',
                  ],
                ],
              },
            ],
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('throws a validation error when a componentName and componentVersion are provided when importing by attributes', () => {
    expect(() =>
      Component.fromComponentAttributes(stack, 'Component', {
        componentArn: 'arn:aws:imagebuilder:us-east-1:123456789012:component/imported-component/x.x.x',
        componentName: 'imported-component',
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when neither a componentName or componentVersion are provided when importing by attributes', () => {
    expect(() => Component.fromComponentAttributes(stack, 'Component', {})).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing an AWS-managed component with the platform attribute', () => {
    expect(() =>
      AwsManagedComponent.fromAwsManagedComponentAttributes(stack, 'Component', {
        componentName: 'hello-world-linux',
        platform: Platform.LINUX,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing an AWS-managed component without the componentName attribute', () => {
    expect(() => AwsManagedComponent.fromAwsManagedComponentAttributes(stack, 'Component', {})).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when importing a pre-defined AWS-managed component without the platform attribute', () => {
    expect(() => AwsManagedComponent.helloWorld(stack, 'Component', {})).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing a pre-defined AWS-managed component with an unresolved platform attribute', () => {
    const platform = new cdk.CfnParameter(stack, 'Platform', { type: 'String' }).valueAsString;

    expect(() => AwsManagedComponent.helloWorld(stack, 'Component', { platform: platform as Platform })).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when importing a pre-defined AWS-managed component with the componentName attribute', () => {
    expect(() => AwsManagedComponent.helloWorld(stack, 'Component', { componentName: 'hello-world-linux' })).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when importing a pre-defined AWS-managed component with an unsupported platform provided', () => {
    expect(() => AwsManagedComponent.helloWorld(stack, 'Component', { platform: Platform.MAC_OS })).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when the resource name is too long', () => {
    expect(
      () =>
        new Component(stack, 'Component', {
          componentName: 'a'.repeat(129),
          platform: Platform.LINUX,
          data: ComponentData.fromJsonObject({
            name: 'test-component',
            schemaVersion: ComponentSchemaVersion.V1_0,
            phases: [
              {
                name: ComponentPhaseName.BUILD,
                steps: [
                  {
                    action: ComponentAction.EXECUTE_BASH,
                    name: 'hello-world-build',
                    inputs: {
                      commands: ['echo "Hello build!"'],
                    },
                  },
                ],
              },
            ],
          }),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains spaces', () => {
    expect(
      () =>
        new Component(stack, 'Component', {
          componentName: 'hello world',
          platform: Platform.LINUX,
          data: ComponentData.fromJsonObject({
            name: 'test-component',
            schemaVersion: ComponentSchemaVersion.V1_0,
            phases: [
              {
                name: ComponentPhaseName.BUILD,
                steps: [
                  {
                    action: ComponentAction.EXECUTE_BASH,
                    name: 'hello-world-build',
                    inputs: {
                      commands: ['echo "Hello build!"'],
                    },
                  },
                ],
              },
            ],
          }),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains underscores', () => {
    expect(
      () =>
        new Component(stack, 'Component', {
          componentName: 'hello_world',
          platform: Platform.LINUX,
          data: ComponentData.fromJsonObject({
            name: 'test-component',
            schemaVersion: ComponentSchemaVersion.V1_0,
            phases: [
              {
                name: ComponentPhaseName.BUILD,
                steps: [
                  {
                    action: ComponentAction.EXECUTE_BASH,
                    name: 'hello-world-build',
                    inputs: {
                      commands: ['echo "Hello build!"'],
                    },
                  },
                ],
              },
            ],
          }),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains uppercase characters', () => {
    expect(
      () =>
        new Component(stack, 'Component', {
          componentName: 'HelloWorld',
          platform: Platform.LINUX,
          data: ComponentData.fromJsonObject({
            name: 'test-component',
            schemaVersion: ComponentSchemaVersion.V1_0,
            phases: [
              {
                name: ComponentPhaseName.BUILD,
                steps: [
                  {
                    action: ComponentAction.EXECUTE_BASH,
                    name: 'hello-world-build',
                    inputs: {
                      commands: ['echo "Hello build!"'],
                    },
                  },
                ],
              },
            ],
          }),
        }),
    ).toThrow(cdk.ValidationError);
  });
});
