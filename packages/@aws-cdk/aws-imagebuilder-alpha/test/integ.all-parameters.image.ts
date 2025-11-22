import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as imagebuilder from '../lib';
import { ImageArchitecture, ImageType } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-all-parameters');

const repository = new ecr.Repository(stack, 'Repository', {
  emptyOnDelete: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const executionRole = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
});
const logGroup = new logs.LogGroup(stack, 'ImageLogGroup', { removalPolicy: cdk.RemovalPolicy.DESTROY });
logGroup.grantWrite(executionRole);

const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.AwsManagedImage.amazonLinux2023(stack, 'AL2023-AMI', {
    imageType: ImageType.AMI,
    imageArchitecture: ImageArchitecture.ARM64,
  }).toBaseImage(),
  components: [
    {
      component: imagebuilder.AwsManagedComponent.fromAwsManagedComponentName(
        stack,
        'SimpleBootTest',
        'simple-boot-test-linux',
      ),
    },
  ],
});
const containerRecipe = new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.AwsManagedImage.amazonLinux2023(stack, 'AL2023-Container', {
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

const amiDistributionConfiguration = new imagebuilder.DistributionConfiguration(stack, 'AMIDistributionConfiguration');
amiDistributionConfiguration.addAmiDistributions({ amiName: 'imagebuilder-{{ imagebuilder:buildDate }}' });

const containerDistributionConfiguration = new imagebuilder.DistributionConfiguration(
  stack,
  'ContainerDistributionConfiguration',
);
containerDistributionConfiguration.addContainerDistributions({
  containerRepository: imagebuilder.Repository.fromEcr(repository),
});

const image = new imagebuilder.Image(stack, 'Image-AMI', {
  recipe: imageRecipe,
  infrastructureConfiguration,
  distributionConfiguration: amiDistributionConfiguration,
  executionRole,
  logGroup,
  workflows: [{ workflow: imagebuilder.AwsManagedWorkflow.testImage(stack, 'TestImage') }],
  enhancedImageMetadataEnabled: false,
  imageTestsEnabled: false,
  imageScanningEnabled: false,
});

image.grantDefaultExecutionRolePermissions(executionRole);

new imagebuilder.Image(stack, 'Image-Container', {
  recipe: containerRecipe,
  infrastructureConfiguration,
  distributionConfiguration: containerDistributionConfiguration,
  executionRole,
  logGroup,
  workflows: [{ workflow: imagebuilder.AwsManagedWorkflow.buildContainer(stack, 'TestContainer') }],
  enhancedImageMetadataEnabled: true,
  imageTestsEnabled: false,
  imageScanningEnabled: false,
});

new integ.IntegTest(app, 'ImageTest-AllParameters', {
  testCases: [stack],
});
