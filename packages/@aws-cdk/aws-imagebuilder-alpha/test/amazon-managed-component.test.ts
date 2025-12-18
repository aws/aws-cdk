import * as cdk from 'aws-cdk-lib';
import { AmazonManagedComponent, Platform } from '../lib';

describe('Amazon-managed component', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('Amazon-managed component import by name', () => {
    const component = AmazonManagedComponent.fromAmazonManagedComponentName(
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

  test('Amazon-managed component import by attributes', () => {
    const component = AmazonManagedComponent.fromAmazonManagedComponentAttributes(stack, 'Component', {
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

  test('Amazon-managed component pre-defined method import', () => {
    const awsCliV2Linux = AmazonManagedComponent.awsCliV2(stack, 'AwsCliV2Linux-Component', {
      platform: Platform.LINUX,
    });
    const awsCliV2Windows = AmazonManagedComponent.awsCliV2(stack, 'AwsCliV2Windows-Component', {
      platform: Platform.WINDOWS,
    });
    const helloWorldLinux = AmazonManagedComponent.helloWorld(stack, 'HelloWorldLinux-Component', {
      platform: Platform.LINUX,
    });
    const helloWorldWindows = AmazonManagedComponent.helloWorld(stack, 'HelloWorldWindows-Component', {
      platform: Platform.WINDOWS,
    });
    const python3Linux = AmazonManagedComponent.python3(stack, 'Python3Linux-Component', { platform: Platform.LINUX });
    const python3Windows = AmazonManagedComponent.python3(stack, 'Python3Windows-Component', {
      platform: Platform.WINDOWS,
    });
    const rebootLinux = AmazonManagedComponent.reboot(stack, 'RebootLinux-Component', { platform: Platform.LINUX });
    const rebootWindows = AmazonManagedComponent.reboot(stack, 'RebootWindows-Component', {
      platform: Platform.WINDOWS,
    });
    const stigBuildLinux = AmazonManagedComponent.stigBuild(stack, 'StigBuildLinux-Component', {
      platform: Platform.LINUX,
    });
    const stigBuildWindows = AmazonManagedComponent.stigBuild(stack, 'StigBuildWindows-Component', {
      platform: Platform.WINDOWS,
    });
    const updateLinux = AmazonManagedComponent.updateOs(stack, 'UpdateLinux-Component', { platform: Platform.LINUX });
    const updateWindows = AmazonManagedComponent.updateOs(stack, 'UpdateWindows-Component', {
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

  test('Amazon-managed component pre-defined method import with a component version', () => {
    const helloWorldLinux = AmazonManagedComponent.helloWorld(stack, 'HelloWorldLinux-Component', {
      platform: Platform.LINUX,
      componentVersion: '2025.x.x',
    });

    expect(stack.resolve(helloWorldLinux.componentArn)).toEqual({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:aws:component/hello-world-linux/2025.x.x'],
      ],
    });
  });

  test('throws a validation error when importing a pre-defined Amazon-managed component with an unresolved platform attribute', () => {
    const platform = new cdk.CfnParameter(stack, 'Platform', { type: 'String' }).valueAsString;

    expect(() => AmazonManagedComponent.helloWorld(stack, 'Component', { platform: platform as Platform })).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when importing a pre-defined Amazon-managed component with an unsupported platform provided', () => {
    expect(() => AmazonManagedComponent.helloWorld(stack, 'Component', { platform: Platform.MAC_OS })).toThrow(
      cdk.ValidationError,
    );
  });
});
