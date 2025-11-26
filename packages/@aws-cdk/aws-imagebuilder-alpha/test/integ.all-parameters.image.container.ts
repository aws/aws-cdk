import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as imagebuilder from '../lib';
import { ImageArchitecture, ImageType } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-container-all-parameters');

const repository = new ecr.Repository(stack, 'Repository', {
  emptyOnDelete: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
cdk.Tags.of(repository).add('LifecycleExecutionAccess', 'EC2 Image Builder');

const scanningRepository = new ecr.Repository(stack, 'ScanningRepository', {
  emptyOnDelete: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const executionRole = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
});
const deletionExecutionRole = new iam.Role(stack, 'LifecycleExecutionRole', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/EC2ImageBuilderLifecycleExecutionPolicy')],
});
const logGroup = new logs.LogGroup(stack, 'ImageLogGroup', { removalPolicy: cdk.RemovalPolicy.DESTROY });
logGroup.grantWrite(executionRole);

const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
const containerRecipe = new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.AmazonManagedImage.amazonLinux2023(stack, 'AL2023-Container', {
    imageType: ImageType.DOCKER,
    imageArchitecture: ImageArchitecture.X86_64,
  }).toContainerBaseImage(),
  targetRepository: imagebuilder.Repository.fromEcr(repository),
  components: [
    {
      component: imagebuilder.AwsManagedComponent.helloWorld(stack, 'HelloWorld', {
        platform: imagebuilder.Platform.LINUX,
      }),
    },
  ],
});

const containerDistributionConfiguration = new imagebuilder.DistributionConfiguration(
  stack,
  'ContainerDistributionConfiguration',
);
containerDistributionConfiguration.addContainerDistributions({
  containerRepository: imagebuilder.Repository.fromEcr(repository),
});

const image = new imagebuilder.Image(stack, 'Image-Container', {
  recipe: containerRecipe,
  infrastructureConfiguration,
  distributionConfiguration: containerDistributionConfiguration,
  executionRole,
  logGroup,
  workflows: [{ workflow: imagebuilder.AwsManagedWorkflow.buildContainer(stack, 'TestContainer') }],
  enhancedImageMetadataEnabled: false,
  imageTestsEnabled: true,
  imageScanningEnabled: true,
  imageScanningEcrRepository: scanningRepository,
  imageScanningEcrTags: ['latest-scan'],
  deletionExecutionRole,
  tags: { key1: 'value1', key2: 'value2' },
});
image.grantDefaultExecutionRolePermissions(executionRole);

new integ.IntegTest(app, 'ImageTest-Container-AllParameters', {
  testCases: [stack],
});
