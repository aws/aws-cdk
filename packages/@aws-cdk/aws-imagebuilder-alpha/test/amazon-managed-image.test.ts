import * as cdk from 'aws-cdk-lib';
import { AmazonManagedImage, ImageArchitecture, ImageType } from '../lib';

describe('Amazon-managed Image', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  const expectedAmazonManagedImageArn = (awsManagedImageName: string) => ({
    'Fn::Join': [
      '',
      ['arn:', { Ref: 'AWS::Partition' }, `:imagebuilder:us-east-1:aws:image/${awsManagedImageName}/x.x.x`],
    ],
  });

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('Amazon-managed image import by name', () => {
    const image = AmazonManagedImage.fromAmazonManagedImageName(stack, 'Image', 'amazon-linux-2-x86');

    expect(stack.resolve(image.imageArn)).toEqual({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:aws:image/amazon-linux-2-x86/x.x.x'],
      ],
    });
    expect(image.imageName).toEqual('amazon-linux-2-x86');
    expect(image.imageVersion).toEqual('x.x.x');
  });

  test('Amazon-managed image import by attributes', () => {
    const image = AmazonManagedImage.fromAmazonManagedImageAttributes(stack, 'Image', {
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

  test('Amazon-managed image pre-defined method import - Amazon Linux 2', () => {
    const amazonLinux2X86Ami = AmazonManagedImage.amazonLinux2(stack, 'AmazonLinux2-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const amazonLinux2Arm64Ami = AmazonManagedImage.amazonLinux2(stack, 'AmazonLinux2-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });
    const amazonLinux2X86DockerImage = AmazonManagedImage.amazonLinux2(stack, 'AmazonLinux2-x86-Docker', {
      imageType: ImageType.DOCKER,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(amazonLinux2X86Ami.imageArn)).toEqual(expectedAmazonManagedImageArn('amazon-linux-2-x86'));
    expect(stack.resolve(amazonLinux2Arm64Ami.imageArn)).toEqual(expectedAmazonManagedImageArn('amazon-linux-2-arm64'));
    expect(stack.resolve(amazonLinux2X86DockerImage.imageArn)).toEqual(
      expectedAmazonManagedImageArn('amazon-linux-x86-2'),
    );
    expect(() =>
      AmazonManagedImage.amazonLinux2(stack, 'AmazonLinux2-arm64-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.ARM64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Amazon Linux 2023', () => {
    const amazonLinux2023X86Ami = AmazonManagedImage.amazonLinux2023(stack, 'AmazonLinux2023-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const amazonLinux2023Arm64Ami = AmazonManagedImage.amazonLinux2023(stack, 'AmazonLinux2023-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });
    const amazonLinux2023X86DockerImage = AmazonManagedImage.amazonLinux2023(stack, 'AmazonLinux2023-x86-Docker', {
      imageType: ImageType.DOCKER,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(amazonLinux2023X86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('amazon-linux-2023-x86'),
    );
    expect(stack.resolve(amazonLinux2023Arm64Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('amazon-linux-2023-arm64'),
    );
    expect(stack.resolve(amazonLinux2023X86DockerImage.imageArn)).toEqual(
      expectedAmazonManagedImageArn('amazon-linux-2023-x86-2023'),
    );
    expect(() =>
      AmazonManagedImage.amazonLinux2023(stack, 'AmazonLinux2023-arm64-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.ARM64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Red Hat Enterprise Linux 10', () => {
    const redHat10X86Ami = AmazonManagedImage.redHatEnterpriseLinux10(stack, 'RedHat10-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const redHat10Arm64Ami = AmazonManagedImage.redHatEnterpriseLinux10(stack, 'RedHat10-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });

    expect(stack.resolve(redHat10X86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('red-hat-enterprise-linux-10-x86'),
    );
    expect(stack.resolve(redHat10Arm64Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('red-hat-enterprise-linux-10-arm64'),
    );
    expect(() =>
      AmazonManagedImage.redHatEnterpriseLinux10(stack, 'RedHat10-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - SUSE Linux Enterprise Server 15', () => {
    const suse15X86Ami = AmazonManagedImage.suseLinuxEnterpriseServer15(stack, 'SUSE15-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const suse15Arm64Ami = AmazonManagedImage.suseLinuxEnterpriseServer15(stack, 'SUSE15-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });

    expect(stack.resolve(suse15X86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('suse-linux-enterprise-server-15-x86'),
    );
    expect(stack.resolve(suse15Arm64Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('suse-linux-enterprise-server-15-arm64'),
    );
    expect(() =>
      AmazonManagedImage.suseLinuxEnterpriseServer15(stack, 'SUSE15-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Ubuntu 22.04', () => {
    const ubuntu2204X86Ami = AmazonManagedImage.ubuntuServer2204(stack, 'Ubuntu2204-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const ubuntu2204Arm64Ami = AmazonManagedImage.ubuntuServer2204(stack, 'Ubuntu2204-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });
    const ubuntu2204X86DockerImage = AmazonManagedImage.ubuntuServer2204(stack, 'Ubuntu2204-x86-Docker', {
      imageType: ImageType.DOCKER,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(ubuntu2204X86Ami.imageArn)).toEqual(expectedAmazonManagedImageArn('ubuntu-server-22-lts-x86'));
    expect(stack.resolve(ubuntu2204Arm64Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('ubuntu-server-22-lts-arm64'),
    );
    expect(stack.resolve(ubuntu2204X86DockerImage.imageArn)).toEqual(
      expectedAmazonManagedImageArn('ubuntu-22-x86-22-04'),
    );
    expect(() =>
      AmazonManagedImage.ubuntuServer2204(stack, 'Ubuntu2204-arm64-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.ARM64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Ubuntu 24.04', () => {
    const ubuntu2404X86Ami = AmazonManagedImage.ubuntuServer2404(stack, 'Ubuntu2404-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const ubuntu2404Arm64Ami = AmazonManagedImage.ubuntuServer2404(stack, 'Ubuntu2404-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });
    const ubuntu2404X86DockerImage = AmazonManagedImage.ubuntuServer2404(stack, 'Ubuntu2404-x86-Docker', {
      imageType: ImageType.DOCKER,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(ubuntu2404X86Ami.imageArn)).toEqual(expectedAmazonManagedImageArn('ubuntu-server-24-lts-x86'));
    expect(stack.resolve(ubuntu2404Arm64Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('ubuntu-server-24-lts-arm64'),
    );
    expect(stack.resolve(ubuntu2404X86DockerImage.imageArn)).toEqual(
      expectedAmazonManagedImageArn('ubuntu-24-x86-24-04'),
    );
    expect(() =>
      AmazonManagedImage.ubuntuServer2404(stack, 'Ubuntu2404-arm64-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.ARM64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Windows Server 2016 Core', () => {
    const windows2016EnglishCoreX86Ami = AmazonManagedImage.windowsServer2016Core(
      stack,
      'WindowsServer2016Core-x86-AMI',
      {
        imageType: ImageType.AMI,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );
    const windows2016EnglishCoreX86DockerImage = AmazonManagedImage.windowsServer2016Core(
      stack,
      'WindowsServer2016Core-x86-Docker',
      {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );

    expect(stack.resolve(windows2016EnglishCoreX86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2016-english-core-base-x86'),
    );
    expect(stack.resolve(windows2016EnglishCoreX86DockerImage.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2016-x86-core-ltsc2016-amd64'),
    );
    expect(() =>
      AmazonManagedImage.windowsServer2016Core(stack, 'WindowsServer2016Core-i386-AMI', {
        imageType: ImageType.AMI,
        imageArchitecture: 'i386' as ImageArchitecture,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Windows Server 2016 Full', () => {
    const windows2016EnglishFullX86Ami = AmazonManagedImage.windowsServer2016Full(
      stack,
      'WindowsServer2016Full-x86-AMI',
      {
        imageType: ImageType.AMI,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );

    expect(stack.resolve(windows2016EnglishFullX86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2016-english-full-base-x86'),
    );
    expect(() =>
      AmazonManagedImage.windowsServer2016Full(stack, 'WindowsServer2016Full-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Windows Server 2019 Core', () => {
    const windows2019CoreX86Ami = AmazonManagedImage.windowsServer2019Core(stack, 'WindowsServer2019Core-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const windows2019CoreX86DockerImage = AmazonManagedImage.windowsServer2019Core(
      stack,
      'WindowsServer2019Core-x86-Docker',
      {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );

    expect(stack.resolve(windows2019CoreX86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2019-english-core-base-x86'),
    );
    expect(stack.resolve(windows2019CoreX86DockerImage.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2019-x86-core-ltsc2019-amd64'),
    );
    expect(() =>
      AmazonManagedImage.windowsServer2019Core(stack, 'WindowsServer2019Core-i386-AMI', {
        imageType: ImageType.AMI,
        imageArchitecture: 'i386' as ImageArchitecture,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Windows Server 2019 Full', () => {
    const windows2019EnglishFullX86Ami = AmazonManagedImage.windowsServer2019Full(
      stack,
      'WindowsServer2019Full-x86-AMI',
      {
        imageType: ImageType.AMI,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );

    expect(stack.resolve(windows2019EnglishFullX86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2019-english-full-base-x86'),
    );
    expect(() =>
      AmazonManagedImage.windowsServer2019Full(stack, 'WindowsServer2019Full-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Windows Server 2022 Core', () => {
    const windows2022CoreX86Ami = AmazonManagedImage.windowsServer2022Core(stack, 'WindowsServer2022Core-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(windows2022CoreX86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2022-english-core-base-x86'),
    );
    expect(() =>
      AmazonManagedImage.windowsServer2022Core(stack, 'WindowsServer2022Core-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Windows Server 2022 Full', () => {
    const windows2022EnglishFullX86Ami = AmazonManagedImage.windowsServer2022Full(
      stack,
      'WindowsServer2022Full-x86-AMI',
      {
        imageType: ImageType.AMI,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );

    expect(stack.resolve(windows2022EnglishFullX86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2022-english-full-base-x86'),
    );
    expect(() =>
      AmazonManagedImage.windowsServer2022Full(stack, 'WindowsServer2022Full-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Windows Server 2025 Core', () => {
    const windows2025CoreX86Ami = AmazonManagedImage.windowsServer2025Core(stack, 'WindowsServer2025Core-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });

    expect(stack.resolve(windows2025CoreX86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2025-english-core-base-x86'),
    );
    expect(() =>
      AmazonManagedImage.windowsServer2025Core(stack, 'WindowsServer2025Core-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - Windows Server 2025 Full', () => {
    const windows2025EnglishFullX86Ami = AmazonManagedImage.windowsServer2025Full(
      stack,
      'WindowsServer2025Full-x86-AMI',
      {
        imageType: ImageType.AMI,
        imageArchitecture: ImageArchitecture.X86_64,
      },
    );

    expect(stack.resolve(windows2025EnglishFullX86Ami.imageArn)).toEqual(
      expectedAmazonManagedImageArn('windows-server-2025-english-full-base-x86'),
    );
    expect(() =>
      AmazonManagedImage.windowsServer2025Full(stack, 'WindowsServer2025Full-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - macOS 14', () => {
    const macOS14X86Ami = AmazonManagedImage.macOS14(stack, 'MacOS14-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const macOS14Arm64Ami = AmazonManagedImage.macOS14(stack, 'MacOS14-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });

    expect(stack.resolve(macOS14X86Ami.imageArn)).toEqual(expectedAmazonManagedImageArn('macos-sonoma-x86'));
    expect(stack.resolve(macOS14Arm64Ami.imageArn)).toEqual(expectedAmazonManagedImageArn('macos-sonoma-arm64'));
    expect(() =>
      AmazonManagedImage.macOS14(stack, 'MacOS14-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('Amazon-managed image pre-defined method import - macOS 15', () => {
    const macOS15X86Ami = AmazonManagedImage.macOS15(stack, 'MacOS14-x86-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.X86_64,
    });
    const macOS15Arm64Ami = AmazonManagedImage.macOS15(stack, 'MacOS14-arm64-AMI', {
      imageType: ImageType.AMI,
      imageArchitecture: ImageArchitecture.ARM64,
    });

    expect(stack.resolve(macOS15X86Ami.imageArn)).toEqual(expectedAmazonManagedImageArn('macos-sequoia-x86'));
    expect(stack.resolve(macOS15Arm64Ami.imageArn)).toEqual(expectedAmazonManagedImageArn('macos-sequoia-arm64'));
    expect(() =>
      AmazonManagedImage.macOS15(stack, 'MacOS15-x86-Docker', {
        imageType: ImageType.DOCKER,
        imageArchitecture: ImageArchitecture.X86_64,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing a pre-defined Amazon-managed image with an unresolved imageArchitecture', () => {
    expect(() =>
      AmazonManagedImage.amazonLinux2023(stack, 'Image', {
        imageArchitecture: cdk.Lazy.string({ produce: () => ImageArchitecture.X86_64 }) as ImageArchitecture,
        imageType: ImageType.AMI,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when importing a pre-defined Amazon-managed image with an unresolved imageType', () => {
    expect(() =>
      AmazonManagedImage.amazonLinux2023(stack, 'Image', {
        imageArchitecture: ImageArchitecture.ARM64,
        imageType: cdk.Lazy.string({ produce: () => ImageType.AMI }) as ImageType,
      }),
    ).toThrow(cdk.ValidationError);
  });
});
