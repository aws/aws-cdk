import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import {
  AwsManagedImage,
  AwsManagedWorkflow,
  ContainerRecipe,
  DistributionConfiguration,
  IContainerRecipe,
  IImageRecipe,
  Image,
  ImageArchitecture,
  ImageRecipe,
  ImageType,
  InfrastructureConfiguration,
  IRecipeBase,
  WorkflowOnFailure,
  WorkflowParameterValue,
} from '../lib';

describe('AWS-managed Image', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  const expectedAwsManagedImageArn = (awsManagedImageName: string) => ({
    'Fn::Join': [
      '',
      ['arn:', { Ref: 'AWS::Partition' }, `:imagebuilder:us-east-1:aws:image/${awsManagedImageName}/x.x.x`],
    ],
  });

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('AWS-managed image import by name', () => {
    const image = AwsManagedImage.fromAwsManagedImageName(stack, 'Image', 'amazon-linux-2-x86');

    expect(stack.resolve(image.imageArn)).toEqual({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:aws:image/amazon-linux-2-x86/x.x.x'],
      ],
    });
    expect(image.imageName).toEqual('amazon-linux-2-x86');
    expect(image.imageVersion).toEqual('x.x.x');
  });

  test('AWS-managed image import by attributes', () => {
    const image = AwsManagedImage.fromAwsManagedImageAttributes(stack, 'Image', {
      imageName: 'amazon-linux-2-x86',
      imageVersion: '2025.1.1',
    });

    expect(stack.resolve(image.imageArn)).toEqual({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:aws:image/amazon-linux-2-x86/2025.1.1'],
      ],
    });
    expect(image.imageName).toEqual('amazon-linux-2-x86');
    expect(image.imageVersion).toEqual('2025.1.1');
  });

  test('AWS-managed image pre-defined method import - Amazon Linux 2', () => {
    const amazonLinux2X86Ami = AwsManagedImage.amazonLinux2(stack, 'AmazonLinux2-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const amazonLinux2Arm64Ami = AwsManagedImage.amazonLinux2(stack, 'AmazonLinux2-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });
    const amazonLinux2X86DockerImage = AwsManagedImage.amazonLinux2(stack, 'AmazonLinux2-x86-Docker', {
      imageType: ImageType.DOCKER,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(amazonLinux2X86Ami.imageArn)).toEqual(expectedAwsManagedImageArn('amazon-linux-2-x86'));
    expect(stack.resolve(amazonLinux2Arm64Ami.imageArn)).toEqual(expectedAwsManagedImageArn('amazon-linux-2-arm64'));
    expect(stack.resolve(amazonLinux2X86DockerImage.imageArn)).toEqual(
      expectedAwsManagedImageArn('amazon-linux-x86-2'),
    );
    expect(() =>
      AwsManagedImage.amazonLinux2(stack, 'AmazonLinux2-arm64-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.ARM64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Amazon Linux 2023', () => {
    const amazonLinux2023X86Ami = AwsManagedImage.amazonLinux2023(stack, 'AmazonLinux2023-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const amazonLinux2023Arm64Ami = AwsManagedImage.amazonLinux2023(stack, 'AmazonLinux2023-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });
    const amazonLinux2023X86DockerImage = AwsManagedImage.amazonLinux2023(stack, 'AmazonLinux2023-x86-Docker', {
      imageType: ImageType.DOCKER,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(amazonLinux2023X86Ami.imageArn)).toEqual(expectedAwsManagedImageArn('amazon-linux-2023-x86'));
    expect(stack.resolve(amazonLinux2023Arm64Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('amazon-linux-2023-arm64'),
    );
    expect(stack.resolve(amazonLinux2023X86DockerImage.imageArn)).toEqual(
      expectedAwsManagedImageArn('amazon-linux-2023-x86-2023'),
    );
    expect(() =>
      AwsManagedImage.amazonLinux2023(stack, 'AmazonLinux2023-arm64-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.ARM64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Red Hat Enterprise Linux 10', () => {
    const redHat10X86Ami = AwsManagedImage.redHatEnterpriseLinux10(stack, 'RedHat10-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const redHat10Arm64Ami = AwsManagedImage.redHatEnterpriseLinux10(stack, 'RedHat10-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });

    expect(stack.resolve(redHat10X86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('red-hat-enterprise-linux-10-x86'),
    );
    expect(stack.resolve(redHat10Arm64Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('red-hat-enterprise-linux-10-arm64'),
    );
    expect(() =>
      AwsManagedImage.redHatEnterpriseLinux10(stack, 'RedHat10-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - SUSE Linux Enterprise Server 15', () => {
    const suse15X86Ami = AwsManagedImage.suseLinuxEnterpriseServer15(stack, 'SUSE15-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const suse15Arm64Ami = AwsManagedImage.suseLinuxEnterpriseServer15(stack, 'SUSE15-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });

    expect(stack.resolve(suse15X86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('suse-linux-enterprise-server-15-x86'),
    );
    expect(stack.resolve(suse15Arm64Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('suse-linux-enterprise-server-15-arm64'),
    );
    expect(() =>
      AwsManagedImage.suseLinuxEnterpriseServer15(stack, 'SUSE15-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Ubuntu 22.04', () => {
    const ubuntu2204X86Ami = AwsManagedImage.ubuntuServer2204(stack, 'Ubuntu2204-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const ubuntu2204Arm64Ami = AwsManagedImage.ubuntuServer2204(stack, 'Ubuntu2204-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });
    const ubuntu2204X86DockerImage = AwsManagedImage.ubuntuServer2204(stack, 'Ubuntu2204-x86-Docker', {
      imageType: ImageType.DOCKER,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(ubuntu2204X86Ami.imageArn)).toEqual(expectedAwsManagedImageArn('ubuntu-server-22-lts-x86'));
    expect(stack.resolve(ubuntu2204Arm64Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('ubuntu-server-22-lts-arm64'),
    );
    expect(stack.resolve(ubuntu2204X86DockerImage.imageArn)).toEqual(expectedAwsManagedImageArn('ubuntu-22-x86-22-04'));
    expect(() =>
      AwsManagedImage.ubuntuServer2204(stack, 'Ubuntu2204-arm64-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.ARM64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Ubuntu 24.04', () => {
    const ubuntu2404X86Ami = AwsManagedImage.ubuntuServer2404(stack, 'Ubuntu2404-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const ubuntu2404Arm64Ami = AwsManagedImage.ubuntuServer2404(stack, 'Ubuntu2404-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });
    const ubuntu2404X86DockerImage = AwsManagedImage.ubuntuServer2404(stack, 'Ubuntu2404-x86-Docker', {
      imageType: ImageType.DOCKER,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(ubuntu2404X86Ami.imageArn)).toEqual(expectedAwsManagedImageArn('ubuntu-server-24-lts-x86'));
    expect(stack.resolve(ubuntu2404Arm64Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('ubuntu-server-24-lts-arm64'),
    );
    expect(stack.resolve(ubuntu2404X86DockerImage.imageArn)).toEqual(expectedAwsManagedImageArn('ubuntu-24-x86-24-04'));
    expect(() =>
      AwsManagedImage.ubuntuServer2404(stack, 'Ubuntu2404-arm64-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.ARM64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Windows Server 2016 Core', () => {
    const windows2016EnglishCoreX86Ami = AwsManagedImage.windowsServer2016Core(stack, 'WindowsServer2016Core-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const windows2016EnglishCoreX86DockerImage = AwsManagedImage.windowsServer2016Core(
      stack,
      'WindowsServer2016Core-x86-Docker',
      {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );

    expect(stack.resolve(windows2016EnglishCoreX86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2016-english-core-base-x86'),
    );
    expect(stack.resolve(windows2016EnglishCoreX86DockerImage.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2016-x86-core-ltsc2016-amd64'),
    );
    expect(() =>
      AwsManagedImage.windowsServer2016Core(stack, 'WindowsServer2016Core-i386-AMI', {
        imageType: ImageType.AMI,
        imageArchitecture: 'i386' as ImageArchitecture,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Windows Server 2016 Full', () => {
    const windows2016EnglishFullX86Ami = AwsManagedImage.windowsServer2016Full(stack, 'WindowsServer2016Full-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(windows2016EnglishFullX86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2016-english-full-base-x86'),
    );
    expect(() =>
      AwsManagedImage.windowsServer2016Full(stack, 'WindowsServer2016Full-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Windows Server 2019 Core', () => {
    const windows2019CoreX86Ami = AwsManagedImage.windowsServer2019Core(stack, 'WindowsServer2019Core-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const windows2019CoreX86DockerImage = AwsManagedImage.windowsServer2019Core(
      stack,
      'WindowsServer2019Core-x86-Docker',
      {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );

    expect(stack.resolve(windows2019CoreX86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2019-english-core-base-x86'),
    );
    expect(stack.resolve(windows2019CoreX86DockerImage.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2019-x86-core-ltsc2019-amd64'),
    );
    expect(() =>
      AwsManagedImage.windowsServer2019Core(stack, 'WindowsServer2019Core-i386-AMI', {
        imageType: ImageType.AMI,
        imageArchitecture: 'i386' as ImageArchitecture,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Windows Server 2019 Full', () => {
    const windows2019EnglishFullX86Ami = AwsManagedImage.windowsServer2019Full(stack, 'WindowsServer2019Full-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(windows2019EnglishFullX86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2019-english-full-base-x86'),
    );
    expect(() =>
      AwsManagedImage.windowsServer2019Full(stack, 'WindowsServer2019Full-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Windows Server 2022 Core', () => {
    const windows2022CoreX86Ami = AwsManagedImage.windowsServer2022Core(stack, 'WindowsServer2022Core-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(windows2022CoreX86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2022-english-core-base-x86'),
    );
    expect(() =>
      AwsManagedImage.windowsServer2022Core(stack, 'WindowsServer2022Core-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Windows Server 2022 Full', () => {
    const windows2022EnglishFullX86Ami = AwsManagedImage.windowsServer2022Full(stack, 'WindowsServer2022Full-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(windows2022EnglishFullX86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2022-english-full-base-x86'),
    );
    expect(() =>
      AwsManagedImage.windowsServer2022Full(stack, 'WindowsServer2022Full-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Windows Server 2025 Core', () => {
    const windows2025CoreX86Ami = AwsManagedImage.windowsServer2025Core(stack, 'WindowsServer2025Core-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(windows2025CoreX86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2025-english-core-base-x86'),
    );
    expect(() =>
      AwsManagedImage.windowsServer2025Core(stack, 'WindowsServer2025Core-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - Windows Server 2025 Full', () => {
    const windows2025EnglishFullX86Ami = AwsManagedImage.windowsServer2025Full(stack, 'WindowsServer2025Full-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(windows2025EnglishFullX86Ami.imageArn)).toEqual(
      expectedAwsManagedImageArn('windows-server-2025-english-full-base-x86'),
    );
    expect(() =>
      AwsManagedImage.windowsServer2025Full(stack, 'WindowsServer2025Full-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - macOS 14', () => {
    const macOS14X86Ami = AwsManagedImage.macOS14(stack, 'MacOS14-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const macOS14Arm64Ami = AwsManagedImage.macOS14(stack, 'MacOS14-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });

    expect(stack.resolve(macOS14X86Ami.imageArn)).toEqual(expectedAwsManagedImageArn('macos-sonoma-x86'));
    expect(stack.resolve(macOS14Arm64Ami.imageArn)).toEqual(expectedAwsManagedImageArn('macos-sonoma-arm64'));
    expect(() =>
      AwsManagedImage.macOS14(stack, 'MacOS14-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('AWS-managed image pre-defined method import - macOS 15', () => {
    const macOS15X86Ami = AwsManagedImage.macOS15(stack, 'MacOS14-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const macOS15Arm64Ami = AwsManagedImage.macOS15(stack, 'MacOS14-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });

    expect(stack.resolve(macOS15X86Ami.imageArn)).toEqual(expectedAwsManagedImageArn('macos-sequoia-x86'));
    expect(stack.resolve(macOS15Arm64Ami.imageArn)).toEqual(expectedAwsManagedImageArn('macos-sequoia-arm64'));
    expect(() =>
      AwsManagedImage.macOS15(stack, 'MacOS15-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing an AWS-managed image with the imageType attribute', () => {
    expect(() =>
      AwsManagedImage.fromAwsManagedImageAttributes(stack, 'Image', {
        imageName: 'amazon-linux-2023-x86',
        imageType: ImageType.DOCKER,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing an AWS-managed image with the imageArchitecture attribute', () => {
    expect(() =>
      AwsManagedImage.fromAwsManagedImageAttributes(stack, 'Image', {
        imageName: 'amazon-linux-2023-x86',
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing an AWS-managed image without an imageName', () => {
    expect(() => AwsManagedImage.fromAwsManagedImageAttributes(stack, 'Image', { imageVersion: 'x.x.x' })).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when importing a pre-defined AWS-managed image with the imageName attribute', () => {
    expect(() => AwsManagedImage.amazonLinux2023(stack, 'Image', { imageName: 'amazon-linux-2023-x86' })).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when importing a pre-defined AWS-managed image without the imageArchitecture attribute', () => {
    expect(() => AwsManagedImage.amazonLinux2023(stack, 'Image', { imageType: ImageType.AMI })).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when importing a pre-defined AWS-managed image without the imageType attribute', () => {
    expect(() =>
      AwsManagedImage.amazonLinux2023(stack, 'Image', { imageArchitecture: ImageArchitecture.ARM64 }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing a pre-defined AWS-managed image with an unresolved imageArchitecture', () => {
    expect(() =>
      AwsManagedImage.amazonLinux2023(stack, 'Image', {
        imageArchitecture: cdk.Lazy.string({ produce: () => ImageArchitecture.X86_64 }) as ImageArchitecture,
        imageType: ImageType.AMI,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing a pre-defined AWS-managed image with an unresolved imageType', () => {
    expect(() =>
      AwsManagedImage.amazonLinux2023(stack, 'Image', {
        imageArchitecture: ImageArchitecture.ARM64,
        imageType: cdk.Lazy.string({ produce: () => ImageType.AMI }) as ImageType,
      }),
    ).toThrow(cdk.ValidationError);
  });
});

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
          workflow: AwsManagedWorkflow.buildImage(stack, 'BuildImage'),
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
          workflow: AwsManagedWorkflow.buildContainer(stack, 'BuildContainer'),
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
      tags: { key1: 'value1', key2: 'value2' },
    });

    expect(Image.isImage(image as unknown)).toBeTruthy();
    expect(Image.isImage('Image')).toBeFalsy();

    Template.fromStack(stack).templateMatches({
      Resources: {
        Image9D742C96: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Image',
          Properties: {
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
      workflows: [{ workflow: AwsManagedWorkflow.buildImage(stack, 'BuildImage') }],
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
