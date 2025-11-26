import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as imagebuilder from '../lib';
import { ImageArchitecture, ImageType } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-ami-all-parameters');

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

const amiDistributionConfiguration = new imagebuilder.DistributionConfiguration(stack, 'AMIDistributionConfiguration');
amiDistributionConfiguration.addAmiDistributions({ amiName: 'imagebuilder-{{ imagebuilder:buildDate }}' });

const image = new imagebuilder.Image(stack, 'Image-AMI', {
  recipe: imageRecipe,
  infrastructureConfiguration,
  distributionConfiguration: amiDistributionConfiguration,
  executionRole,
  logGroup,
  workflows: [{ workflow: imagebuilder.AwsManagedWorkflow.testImage(stack, 'TestImage') }],
  enhancedImageMetadataEnabled: true,
  imageTestsEnabled: true,
  imageScanningEnabled: true,
  deletionExecutionRole,
  tags: { key1: 'value1', key2: 'value2' },
});
image.grantDefaultExecutionRolePermissions(executionRole);

new integ.IntegTest(app, 'ImageTest-AMI-AllParameters', {
  testCases: [stack],
});
