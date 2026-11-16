import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as imagebuilder from '../lib';
import { DockerfileData } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-container-recipe-all-parameters');

const repository = new ecr.Repository(stack, 'Repository', { removalPolicy: cdk.RemovalPolicy.DESTROY });

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

const containerRecipe = new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  containerRecipeName: 'test-container-recipe',
  containerRecipeVersion: '1.2.x',
  description: 'A test container recipe',
  baseImage: imagebuilder.BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
  osVersion: imagebuilder.OSVersion.AMAZON_LINUX_2023,
  targetRepository: imagebuilder.Repository.fromEcr(repository),
  dockerfile: DockerfileData.fromInline(`FROM {{{ imagebuilder:parentImage }}}
CMD ["echo", "Hello, world!"]
{{{ imagebuilder:environments }}}
{{{ imagebuilder:components }}}`),
  components: [
    {
      component: imagebuilder.AmazonManagedComponent.helloWorld(stack, 'Component2', {
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
  workingDirectory: '/var/tmp',
  instanceImage: imagebuilder.ContainerInstanceImage.fromSsmParameterName(
    '/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id',
  ),
  tags: {
    key1: 'value1',
    key2: 'value2',
  },
});

containerRecipe.addInstanceBlockDevice({
  deviceName: '/dev/sda2',
  volume: ec2.BlockDeviceVolume.ebsFromSnapshot('snap-123', {
    volumeSize: 75,
    deleteOnTermination: true,
    iops: 1000,
    volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
    throughput: 125,
  }),
});

new cdk.CfnOutput(stack, 'ContainerRecipeVersion', { value: containerRecipe.containerRecipeVersion });

new integ.IntegTest(app, 'ContainerRecipeTest-AllParameters', {
  testCases: [stack],
});
