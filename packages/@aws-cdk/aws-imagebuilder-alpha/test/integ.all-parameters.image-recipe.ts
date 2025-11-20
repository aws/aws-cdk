import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-recipe-all-parameters');

const userData = ec2.UserData.forLinux();
userData.addCommands('echo "Hello World"');

const parameterizedComponent = new imagebuilder.Component(stack, 'ParameterizedComponent', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromComponentDocumentJsonObject({
    name: 'ParameterizedComponent',
    description: 'This is a parameterized component',
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    parameters: {
      parameter1: {
        type: imagebuilder.ComponentParameterType.STRING,
        description: 'This is the first parameter',
      },
      parameter2: {
        type: imagebuilder.ComponentParameterType.STRING,
        description: 'This is the second parameter',
      },
    },
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'step1',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            inputs: imagebuilder.ComponentStepInputs.fromObject({
              commands: ['echo ${{ parameter1 }}', 'echo ${{ parameter2 }}'],
            }),
          },
        ],
      },
    ],
  }),
});

const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  imageRecipeName: 'test-image-recipe',
  imageRecipeVersion: '1.2.3',
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
  ),
  description: 'A test image recipe',
  components: [
    {
      component: imagebuilder.AwsManagedComponent.helloWorld(stack, 'Component2', {
        platform: imagebuilder.Platform.LINUX,
      }),
    },
    {
      component: parameterizedComponent,
      parameters: {
        parameter1: imagebuilder.ComponentParameterValue.fromString('parameter-value-1'),
        parameter2: imagebuilder.ComponentParameterValue.fromString('parameter-value-2'),
      },
    },
  ],
  amiTags: {
    imageTag1: 'imageValue1',
    imageTag2: 'imageValue2',
  },
  workingDirectory: '/var/tmp',
  uninstallSsmAgentAfterBuild: true,
  userDataOverride: userData,
  blockDevices: [
    {
      mappingEnabled: false,
      deviceName: '/dev/sda1',
      volume: ec2.BlockDeviceVolume.ephemeral(0),
    },
  ],
  tags: {
    key1: 'value1',
    key2: 'value2',
  },
});

imageRecipe.addBlockDevice({
  deviceName: '/dev/sda2',
  volume: ec2.BlockDeviceVolume.ebs(75, {
    encrypted: true,
    kmsKey: kms.Alias.fromAliasName(stack, 'DeviceKey', 'alias/device-encryption-key'),
    deleteOnTermination: true,
    iops: 1000,
    volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
    throughput: 125,
  }),
});

new cdk.CfnOutput(stack, 'ImageRecipeVersion', { value: imageRecipe.imageRecipeVersion });

new integ.IntegTest(app, 'ImageRecipeTest-AllParameters', {
  testCases: [stack],
});
