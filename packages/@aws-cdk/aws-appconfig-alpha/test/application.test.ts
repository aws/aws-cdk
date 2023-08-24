import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  Application,
  Platform,
  LambdaDestination,
  Parameter,
  ActionPoint,
} from '../lib';

describe('appconfig', () => {
  test('basic appconfig', () => {
    const stack = new cdk.Stack();
    new Application(stack, 'MyAppConfig');

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Application', {
      Name: 'MyAppConfig',
    });
  });

  test('appconfig with name', () => {
    const stack = new cdk.Stack();
    new Application(stack, 'MyAppConfig', {
      name: 'TestApp',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Application', {
      Name: 'TestApp',
    });
  });

  test('appconfig with description', () => {
    const stack = new cdk.Stack();
    new Application(stack, 'MyAppConfig', {
      description: 'This is my description',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Application', {
      Name: 'MyAppConfig',
      Description: 'This is my description',
    });
  });

  test('get lambda layer arn', () => {
    expect(Application.getLambdaLayerVersionArn('us-east-1')).toEqual('arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:110');
    expect(Application.getLambdaLayerVersionArn('us-east-1', Platform.ARM_64)).toEqual('arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension-Arm64:43');
  });

  test('add agent to ecs', () => {
    const stack = new cdk.Stack();
    const taskDef = new FargateTaskDefinition(stack, 'TaskDef');
    Application.addAgentToEcs(taskDef);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Image: 'public.ecr.aws/aws-appconfig/aws-appconfig-agent:latest',
          Name: 'AppConfigAgentContainer',
          Essential: true,
        },
      ],
    });
  });

  test('pre create hosted configuration version', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.on(ActionPoint.ON_DEPLOYMENT_STEP, new LambdaDestination(func));

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
      Name: 'Extension28486',
      Actions: {
        ON_DEPLOYMENT_STEP: [
          {
            Name: 'Extension28486',
            RoleArn: { 'Fn::GetAtt': ['Extension28486RoleFD36712B5D791', 'Arn'] },
            Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
          },
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
      ExtensionIdentifier: {
        'Fn::GetAtt': ['Extension28486EB468E25', 'Id'],
      },
      ExtensionVersionNumber: {
        'Fn::GetAtt': ['Extension28486EB468E25', 'VersionNumber'],
      },
      ResourceIdentifier: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':appconfig:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':application/',
            { Ref: 'MyAppConfigB4B63E75' },
          ],
        ],
      },
    });
  });

  test('pre create hosted configuration version', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.preCreateHostedConfigurationVersion(new LambdaDestination(func), {
      description: 'This is my description',
      name: 'MyExtension',
      latestVersionNumber: 1,
      parameters: [
        Parameter.required('myparam', 'val'),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
      Name: 'MyExtension',
      Description: 'This is my description',
      LatestVersionNumber: 1,
      Actions: {
        PRE_CREATE_HOSTED_CONFIGURATION_VERSION: [
          {
            Name: 'Extension8D9D7',
            RoleArn: { 'Fn::GetAtt': ['Extension8D9D7RoleFD367F4FA01C5', 'Arn'] },
            Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
          },
        ],
      },
      Parameters: {
        myparam: { Required: true },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
      ExtensionIdentifier: {
        'Fn::GetAtt': ['Extension8D9D75657615A', 'Id'],
      },
      ExtensionVersionNumber: {
        'Fn::GetAtt': ['Extension8D9D75657615A', 'VersionNumber'],
      },
      Parameters: {
        myparam: 'val',
      },
      ResourceIdentifier: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':appconfig:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':application/',
            { Ref: 'MyAppConfigB4B63E75' },
          ],
        ],
      },
    });
  });

  test('pre start deployment', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.preStartDeployment(new LambdaDestination(func));

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
      Name: 'Extension6253E',
      Actions: {
        PRE_START_DEPLOYMENT: [
          {
            Name: 'Extension6253E',
            RoleArn: { 'Fn::GetAtt': ['Extension6253ERoleFD367F586E17D', 'Arn'] },
            Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
          },
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
      ExtensionIdentifier: {
        'Fn::GetAtt': ['Extension6253ED4CE66CE', 'Id'],
      },
      ExtensionVersionNumber: {
        'Fn::GetAtt': ['Extension6253ED4CE66CE', 'VersionNumber'],
      },
      ResourceIdentifier: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':appconfig:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':application/',
            { Ref: 'MyAppConfigB4B63E75' },
          ],
        ],
      },
    });
  });

  test('on deployment start', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    Object.defineProperty(appconfig, 'applicationArn', {
      value: 'arn:aws:appconfig:us-east-1:123456789012:application/abc123',
    });
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.onDeploymentStart(new LambdaDestination(func));

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
      Name: 'ExtensionB65DC',
      Actions: {
        ON_DEPLOYMENT_START: [
          {
            Name: 'ExtensionB65DC',
            RoleArn: { 'Fn::GetAtt': ['ExtensionB65DCRoleFD3677AFA6FE0', 'Arn'] },
            Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
          },
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
      ExtensionIdentifier: {
        'Fn::GetAtt': ['ExtensionB65DC00D22C6E', 'Id'],
      },
      ExtensionVersionNumber: {
        'Fn::GetAtt': ['ExtensionB65DC00D22C6E', 'VersionNumber'],
      },
      ResourceIdentifier: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':appconfig:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':application/',
            { Ref: 'MyAppConfigB4B63E75' },
          ],
        ],
      },
    });
  });

  test('on deployment step', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.onDeploymentStep(new LambdaDestination(func));

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
      Name: 'Extension28486',
      Actions: {
        ON_DEPLOYMENT_STEP: [
          {
            Name: 'Extension28486',
            RoleArn: { 'Fn::GetAtt': ['Extension28486RoleFD36712B5D791', 'Arn'] },
            Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
          },
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
      ExtensionIdentifier: {
        'Fn::GetAtt': ['Extension28486EB468E25', 'Id'],
      },
      ExtensionVersionNumber: {
        'Fn::GetAtt': ['Extension28486EB468E25', 'VersionNumber'],
      },
      ResourceIdentifier: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':appconfig:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':application/',
            { Ref: 'MyAppConfigB4B63E75' },
          ],
        ],
      },
    });
  });

  test('on deployment complete', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.onDeploymentComplete(new LambdaDestination(func));

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
      Name: 'Extension32166',
      Actions: {
        ON_DEPLOYMENT_COMPLETE: [
          {
            Name: 'Extension32166',
            RoleArn: { 'Fn::GetAtt': ['Extension32166RoleFD367EE1FF117', 'Arn'] },
            Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
          },
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
      ExtensionIdentifier: {
        'Fn::GetAtt': ['Extension32166E58405A0', 'Id'],
      },
      ExtensionVersionNumber: {
        'Fn::GetAtt': ['Extension32166E58405A0', 'VersionNumber'],
      },
      ResourceIdentifier: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':appconfig:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':application/',
            { Ref: 'MyAppConfigB4B63E75' },
          ],
        ],
      },
    });
  });

  test('on deployment bake', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.onDeploymentBaking(new LambdaDestination(func));

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
      Name: 'Extension1CAD4',
      Actions: {
        ON_DEPLOYMENT_BAKING: [
          {
            Name: 'Extension1CAD4',
            RoleArn: { 'Fn::GetAtt': ['Extension1CAD4RoleFD367FC09E8DE', 'Arn'] },
            Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
          },
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
      ExtensionIdentifier: {
        'Fn::GetAtt': ['Extension1CAD47F07C609', 'Id'],
      },
      ExtensionVersionNumber: {
        'Fn::GetAtt': ['Extension1CAD47F07C609', 'VersionNumber'],
      },
      ResourceIdentifier: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':appconfig:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':application/',
            { Ref: 'MyAppConfigB4B63E75' },
          ],
        ],
      },
    });
  });

  test('on deployment rolled back', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.onDeploymentRolledBack(new LambdaDestination(func));

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
      Name: 'ExtensionC8347',
      Actions: {
        ON_DEPLOYMENT_ROLLED_BACK: [
          {
            Name: 'ExtensionC8347',
            RoleArn: { 'Fn::GetAtt': ['ExtensionC8347RoleFD36716A1DE61', 'Arn'] },
            Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
          },
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
      ExtensionIdentifier: {
        'Fn::GetAtt': ['ExtensionC83470CE85F6C', 'Id'],
      },
      ExtensionVersionNumber: {
        'Fn::GetAtt': ['ExtensionC83470CE85F6C', 'VersionNumber'],
      },
      ResourceIdentifier: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':appconfig:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':application/',
            { Ref: 'MyAppConfigB4B63E75' },
          ],
        ],
      },
    });
  });

  test('create same extension twice', () => {
    const stack = new cdk.Stack();
    const appconfig = new Application(stack, 'MyAppConfig');
    const func = new Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromInline('# this is my code'),
    });
    Object.defineProperty(func, 'functionArn', {
      value: 'arn:lambda:us-east-1:123456789012:function:my-function',
    });
    appconfig.preStartDeployment(new LambdaDestination(func));

    expect(() => {
      appconfig.preStartDeployment(new LambdaDestination(func));
    }).toThrow();
  });

  test('from application arn', () => {
    const stack = new cdk.Stack();
    const app = Application.fromApplicationArn(stack, 'Application',
      'arn:aws:appconfig:us-west-2:123456789012:application/abc123');

    expect(app.applicationId).toEqual('abc123');
  });

  test('from application arn with no resource name', () => {
    const stack = new cdk.Stack();
    expect(() => {
      Application.fromApplicationArn(stack, 'Application',
        'arn:aws:appconfig:us-west-2:123456789012:application/');
    }).toThrow('Missing required application id from application ARN');
  });

  test('from application id', () => {
    const cdkApp = new cdk.App();
    const stack = new cdk.Stack(cdkApp, 'Stack', {
      env: {
        region: 'us-west-2',
        account: '123456789012',
      },
    });
    const app = Application.fromApplicationId(stack, 'Application', 'abc123');

    expect(app.applicationId).toEqual('abc123');
  });
});