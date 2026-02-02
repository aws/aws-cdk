# EC2 Image Builder Construct Library

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## README

[Amazon EC2 Image Builder](https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html) is a
fully managed AWS service that helps you automate the creation, management, and deployment of customized, secure, and
up-to-date server images. You can use Image Builder to create Amazon Machine Images (AMIs) and container images for use
across AWS Regions.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project. It allows you to define
Image Builder pipelines, images, recipes, components, workflows, and lifecycle policies.
A component defines the sequence of steps required to customize an instance during image creation (build component) or
test an instance launched from the created image (test component). Components are created from declarative YAML or JSON
documents that describe runtime configuration for building, validating, or testing instances. Components are included
when added to the image recipe or container recipe for an image build.

EC2 Image Builder supports AWS-managed components for common tasks, AWS Marketplace components, and custom components
that you create. Components run during specific workflow phases: build and validate phases during the build stage, and
test phase during the test stage.

### Image Pipeline

An image pipeline provides the automation framework for building secure AMIs and container images. The pipeline
orchestrates the entire image creation process by combining an image recipe or container recipe with infrastructure
configuration and distribution configuration. Pipelines can run on a schedule or be triggered manually, and they manage
the build, test, and distribution phases automatically.

#### Image Pipeline Basic Usage

Create a simple AMI pipeline with just an image recipe:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'MyImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  )
});

const imagePipeline = new imagebuilder.ImagePipeline(this, 'MyImagePipeline', {
  recipe: exampleImageRecipe
});
```

Create a simple container pipeline with just a container recipe:

```ts
const containerRecipe = new imagebuilder.ContainerRecipe(this, 'MyContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  )
});

const containerPipeline = new imagebuilder.ImagePipeline(this, 'MyContainerPipeline', {
  recipe: exampleContainerRecipe
});
```

#### Image Pipeline Scheduling

##### Manual Pipeline Execution

Create a pipeline that runs only when manually triggered:

```ts
const manualPipeline = new imagebuilder.ImagePipeline(this, 'ManualPipeline', {
  imagePipelineName: 'my-manual-pipeline',
  description: 'Pipeline triggered manually for production builds',
  recipe: exampleImageRecipe
  // No schedule property - manual execution only
});

// Grant Lambda function permission to trigger the pipeline
manualPipeline.grantStartExecution(lambdaRole);
```

##### Automated Pipeline Scheduling

Schedule a pipeline to run automatically using cron expressions:

```ts
const weeklyPipeline = new imagebuilder.ImagePipeline(this, 'WeeklyPipeline', {
  imagePipelineName: 'weekly-build-pipeline',
  recipe: exampleImageRecipe,
  schedule: {
    expression: events.Schedule.cron({
      minute: '0',
      hour: '6',
      weekDay: 'MON'
    })
  }
});
```

Use rate expressions for regular intervals:

```ts
const dailyPipeline = new imagebuilder.ImagePipeline(this, 'DailyPipeline', {
  recipe: exampleContainerRecipe,
  schedule: {
    expression: events.Schedule.rate(Duration.days(1))
  }
});
```

##### Pipeline Schedule Configuration

Configure advanced scheduling options:

```ts
const advancedSchedulePipeline = new imagebuilder.ImagePipeline(this, 'AdvancedSchedulePipeline', {
  recipe: exampleImageRecipe,
  schedule: {
    expression: events.Schedule.rate(Duration.days(7)),
    // Only trigger when dependencies are updated (new base images, components, etc.)
    startCondition: imagebuilder.ScheduleStartCondition.EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE,
    // Automatically disable after 3 consecutive failures
    autoDisableFailureCount: 3
  },
  // Start enabled
  status: imagebuilder.ImagePipelineStatus.ENABLED
});
```

#### Image Pipeline Configuration

##### Infrastructure and Distribution in Image Pipelines

Configure custom infrastructure and distribution settings:

```ts
const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(this, 'Infrastructure', {
  infrastructureConfigurationName: 'production-infrastructure',
  instanceTypes: [
    ec2.InstanceType.of(ec2.InstanceClass.COMPUTE7_INTEL, ec2.InstanceSize.LARGE)
  ],
  vpc: vpc,
  subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }
});

const distributionConfiguration = new imagebuilder.DistributionConfiguration(this, 'Distribution');
distributionConfiguration.addAmiDistributions({
  amiName: 'production-ami-{{ imagebuilder:buildDate }}',
  amiTargetAccountIds: ['123456789012', '098765432109']
});

const productionPipeline = new imagebuilder.ImagePipeline(this, 'ProductionPipeline', {
  recipe: exampleImageRecipe,
  infrastructureConfiguration: infrastructureConfiguration,
  distributionConfiguration: distributionConfiguration
});
```

##### Pipeline Logging Configuration

Configure custom CloudWatch log groups for pipeline and image logs:

```ts
const pipelineLogGroup = new logs.LogGroup(this, 'PipelineLogGroup', {
  logGroupName: '/custom/imagebuilder/pipeline/logs',
  retention: logs.RetentionDays.ONE_MONTH
});

const imageLogGroup = new logs.LogGroup(this, 'ImageLogGroup', {
  logGroupName: '/custom/imagebuilder/image/logs',
  retention: logs.RetentionDays.ONE_WEEK
});

const loggedPipeline = new imagebuilder.ImagePipeline(this, 'LoggedPipeline', {
  recipe: exampleImageRecipe,
  imagePipelineLogGroup: pipelineLogGroup,
  imageLogGroup: imageLogGroup
});
```

##### Workflow Integration in Image Pipelines

Use AWS-managed workflows for common pipeline phases:

```ts
const workflowPipeline = new imagebuilder.ImagePipeline(this, 'WorkflowPipeline', {
  recipe: exampleImageRecipe,
  workflows: [
    { workflow: imagebuilder.AmazonManagedWorkflow.buildImage(this, 'BuildWorkflow') },
    { workflow: imagebuilder.AmazonManagedWorkflow.testImage(this, 'TestWorkflow') }
  ]
});
```

For container pipelines, use container-specific workflows:

```ts
const containerWorkflowPipeline = new imagebuilder.ImagePipeline(this, 'ContainerWorkflowPipeline', {
  recipe: exampleContainerRecipe,
  workflows: [
    { workflow: imagebuilder.AmazonManagedWorkflow.buildContainer(this, 'BuildContainer') },
    { workflow: imagebuilder.AmazonManagedWorkflow.testContainer(this, 'TestContainer') },
    { workflow: imagebuilder.AmazonManagedWorkflow.distributeContainer(this, 'DistributeContainer') }
  ]
});
```

##### Advanced Features in Image Pipelines

Configure image scanning for container pipelines:

```ts
const scanningRepository = new ecr.Repository(this, 'ScanningRepo');

const scannedContainerPipeline = new imagebuilder.ImagePipeline(this, 'ScannedContainerPipeline', {
  recipe: exampleContainerRecipe,
  imageScanningEnabled: true,
  imageScanningEcrRepository: scanningRepository,
  imageScanningEcrTags: ['security-scan', 'latest']
});
```

Control metadata collection and testing:

```ts
const controlledPipeline = new imagebuilder.ImagePipeline(this, 'ControlledPipeline', {
  recipe: exampleImageRecipe,
  enhancedImageMetadataEnabled: true,  // Collect detailed OS and package info
  imageTestsEnabled: false  // Skip testing phase for faster builds
});
```

#### Image Pipeline Events

##### Pipeline Event Handling

Handle specific pipeline events:

```ts
// Monitor CVE detection
examplePipeline.onCVEDetected('CVEAlert', {
  target: new targets.SnsTopic(topic)
});

// Handle pipeline auto-disable events
examplePipeline.onImagePipelineAutoDisabled('PipelineDisabledAlert', {
  target: new targets.LambdaFunction(lambdaFunction)
});
```

#### Importing Image Pipelines

Reference existing pipelines created outside CDK:

```ts
// Import by name
const existingPipelineByName = imagebuilder.ImagePipeline.fromImagePipelineName(
  this,
  'ExistingPipelineByName',
  'my-existing-pipeline'
);

// Import by ARN
const existingPipelineByArn = imagebuilder.ImagePipeline.fromImagePipelineArn(
  this,
  'ExistingPipelineByArn',
  'arn:aws:imagebuilder:us-east-1:123456789012:image-pipeline/imported-pipeline'
);

// Grant permissions to imported pipelines
const automationRole = new iam.Role(this, 'AutomationRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
});

existingPipelineByName.grantStartExecution(automationRole);
existingPipelineByArn.grantRead(lambdaRole);
```

### Image

An image is the output resource created by Image Builder, consisting of an AMI or container image plus metadata such as
version, platform, and creation details. Images are used as base images for future builds and can be shared across AWS
accounts. While images are the output from image pipeline executions, they can also be created in an ad-hoc manner
outside a pipeline, defined as a standalone resource.

#### Image Basic Usage

Create a simple AMI-based image from an image recipe:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'MyImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  )
});

const amiImage = new imagebuilder.Image(this, 'MyAmiImage', {
  recipe: imageRecipe
});
```

Create a simple container image from a container recipe:

```ts
const containerRecipe = new imagebuilder.ContainerRecipe(this, 'MyContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  )
});

const containerImage = new imagebuilder.Image(this, 'MyContainerImage', {
  recipe: containerRecipe
});
```

#### AWS-Managed Images

##### Pre-defined OS Images

Use AWS-managed images for common operating systems:

```ts
// Amazon Linux 2023 AMI for x86_64
const amazonLinux2023Ami = imagebuilder.AmazonManagedImage.amazonLinux2023(this, 'AmazonLinux2023', {
  imageType: imagebuilder.ImageType.AMI,
  imageArchitecture: imagebuilder.ImageArchitecture.X86_64
});

// Ubuntu 22.04 AMI for ARM64
const ubuntu2204Ami = imagebuilder.AmazonManagedImage.ubuntuServer2204(this, 'Ubuntu2204', {
  imageType: imagebuilder.ImageType.AMI,
  imageArchitecture: imagebuilder.ImageArchitecture.ARM64
});

// Windows Server 2022 Full AMI
const windows2022Ami = imagebuilder.AmazonManagedImage.windowsServer2022Full(this, 'Windows2022', {
  imageType: imagebuilder.ImageType.AMI,
  imageArchitecture: imagebuilder.ImageArchitecture.X86_64
});

// Use as base image in recipe
const managedImageRecipe = new imagebuilder.ImageRecipe(this, 'ManagedImageRecipe', {
  baseImage: amazonLinux2023Ami.toBaseImage()
});
```

##### Custom AWS-Managed Images

Import AWS-managed images by name or attributes:

```ts
// Import by name
const managedImageByName = imagebuilder.AmazonManagedImage.fromAmazonManagedImageName(
  this,
  'ManagedImageByName',
  'amazon-linux-2023-x86'
);

// Import by attributes with specific version
const managedImageByAttributes = imagebuilder.AmazonManagedImage.fromAmazonManagedImageAttributes(this, 'ManagedImageByAttributes', {
  imageName: 'ubuntu-server-22-lts-x86',
  imageVersion: '2024.11.25'
});
```

#### Image Configuration

##### Infrastructure and Distribution in Images

Configure custom infrastructure and distribution settings:

```ts
const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(this, 'Infrastructure', {
  infrastructureConfigurationName: 'production-infrastructure',
  instanceTypes: [
    ec2.InstanceType.of(ec2.InstanceClass.COMPUTE7_INTEL, ec2.InstanceSize.LARGE)
  ],
  vpc: vpc,
  subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }
});

const distributionConfiguration = new imagebuilder.DistributionConfiguration(this, 'Distribution');
distributionConfiguration.addAmiDistributions({
  amiName: 'production-ami-{{ imagebuilder:buildDate }}',
  amiTargetAccountIds: ['123456789012', '098765432109']
});

const productionImage = new imagebuilder.Image(this, 'ProductionImage', {
  recipe: exampleImageRecipe,
  infrastructureConfiguration: infrastructureConfiguration,
  distributionConfiguration: distributionConfiguration
});
```

##### Logging Configuration

Configure custom CloudWatch log groups for image builds:

```ts
const logGroup = new logs.LogGroup(this, 'ImageLogGroup', {
  logGroupName: '/custom/imagebuilder/image/logs',
  retention: logs.RetentionDays.ONE_MONTH
});

const loggedImage = new imagebuilder.Image(this, 'LoggedImage', {
  recipe: exampleImageRecipe,
  logGroup: logGroup
});
```

##### Workflow Integration in Images

Use workflows for custom build, test, and distribution processes:

```ts
const imageWithWorkflows = new imagebuilder.Image(this, 'ImageWithWorkflows', {
  recipe: exampleImageRecipe,
  workflows: [
    { workflow: imagebuilder.AmazonManagedWorkflow.buildImage(this, 'BuildWorkflow') },
    { workflow: imagebuilder.AmazonManagedWorkflow.testImage(this, 'TestWorkflow') }
  ]
});
```

##### Advanced Features in Images

Configure image scanning, metadata collection, and testing:

```ts
const scanningRepository = new ecr.Repository(this, 'ScanningRepository');

const advancedContainerImage = new imagebuilder.Image(this, 'AdvancedContainerImage', {
  recipe: exampleContainerRecipe,
  imageScanningEnabled: true,
  imageScanningEcrRepository: scanningRepository,
  imageScanningEcrTags: ['security-scan', 'latest'],
  enhancedImageMetadataEnabled: true,
  imageTestsEnabled: false  // Skip testing for faster builds
});
```

#### Importing Images

Reference existing images created outside CDK:

```ts
// Import by name
const existingImageByName = imagebuilder.Image.fromImageName(
  this,
  'ExistingImageByName',
  'my-existing-image'
);

// Import by ARN
const existingImageByArn = imagebuilder.Image.fromImageArn(
  this,
  'ExistingImageByArn',
  'arn:aws:imagebuilder:us-east-1:123456789012:image/imported-image/1.0.0'
);

// Import by attributes
const existingImageByAttributes = imagebuilder.Image.fromImageAttributes(this, 'ExistingImageByAttributes', {
  imageName: 'shared-base-image',
  imageVersion: '2024.11.25'
});

// Grant permissions to imported images
const role = new iam.Role(this, 'ImageAccessRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
});

existingImageByName.grantRead(role);
existingImageByArn.grant(role, 'imagebuilder:GetImage', 'imagebuilder:ListImagePackages');
```

### Image Recipe

#### Image Recipe Basic Usage

Create an image recipe with the required base image:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'MyImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  )
});
```

#### Image Recipe Base Images

To create a recipe, you have to select a base image to build and customize from. This base image can be referenced from
various sources, such as from SSM parameters, AWS Marketplace products, and AMI IDs directly.

##### SSM Parameters

Using SSM parameter references:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'SsmImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  )
});

// Using an SSM parameter construct
const parameter = ssm.StringParameter.fromStringParameterName(
  this,
  'BaseImageParameter',
  '/aws/service/ami-windows-latest/Windows_Server-2022-English-Full-Base'
);
const windowsRecipe = new imagebuilder.ImageRecipe(this, 'WindowsImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameter(parameter)
});
```

##### AMI IDs

When you have a specific AMI to use:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'AmiImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromAmiId('ami-12345678')
});
```

##### Marketplace Images

For marketplace base images:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'MarketplaceImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromMarketplaceProductId('prod-1234567890abcdef0')
});
```

#### Image Recipe Components

Components from various sources, such as custom-owned, AWS-owned, or AWS Marketplace-owned, can optionally be included
in recipes. For parameterized components, you are able to provide the parameters to use in the recipe, which will be
applied during the image build when executing components.

##### Custom Components in Image Recipes

Add your own components to the recipe:

```ts
const customComponent = new imagebuilder.Component(this, 'MyComponent', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromJsonObject({
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'install-app',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            inputs: {
              commands: ['yum install -y my-application']
            }
          }
        ]
      }
    ]
  })
});

const imageRecipe = new imagebuilder.ImageRecipe(this, 'ComponentImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  ),
  components: [
    {
      component: customComponent
    }
  ]
});
```

##### AWS-Managed Components in Image Recipes

Use pre-built AWS components:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'AmazonManagedImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  ),
  components: [
    {
      component: imagebuilder.AmazonManagedComponent.updateOs(this, 'UpdateOS', {
        platform: imagebuilder.Platform.LINUX
      })
    },
    {
      component: imagebuilder.AmazonManagedComponent.awsCliV2(this, 'AwsCli', {
        platform: imagebuilder.Platform.LINUX
      })
    }
  ]
});
```

##### Component Parameters in Image Recipes

Pass parameters to components that accept them:

```ts
const parameterizedComponent = imagebuilder.Component.fromComponentName(
  this,
  'ParameterizedComponent',
  'my-parameterized-component'
);

const imageRecipe = new imagebuilder.ImageRecipe(this, 'ParameterizedImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  ),
  components: [
    {
      component: parameterizedComponent,
      parameters: {
        environment: imagebuilder.ComponentParameterValue.fromString('production'),
        version: imagebuilder.ComponentParameterValue.fromString('1.0.0')
      }
    }
  ]
});
```

#### Image Recipe Configuration

##### Block Device Configuration

Configure storage for the build instance:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'BlockDeviceImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  ),
  blockDevices: [
    {
      deviceName: '/dev/sda1',
      volume: ec2.BlockDeviceVolume.ebs(100, {
        encrypted: true,
        volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3
      })
    }
  ]
});
```

##### AMI Tagging

Tag the output AMI:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'TaggedImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  ),
  amiTags: {
    Environment: 'Production',
    Application: 'WebServer',
    Owner: 'DevOps Team'
  }
});
```

### Container Recipe

A container recipe is similar to an image recipe but specifically for container images. It defines the base container
image and components applied to produce the desired configuration for the output container image. Container recipes work
with Docker images from DockerHub, Amazon ECR, or Amazon-managed container images as starting points.

#### Container Recipe Basic Usage

Create a container recipe with the required base image and target repository:

```ts
const containerRecipe = new imagebuilder.ContainerRecipe(this, 'MyContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  )
});
```

#### Container Recipe Base Images

##### DockerHub Images

Using public Docker Hub images:

```ts
const containerRecipe = new imagebuilder.ContainerRecipe(this, 'DockerHubContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  )
});
```

##### ECR Images

Using images from your own ECR repositories:

```ts
const sourceRepo = ecr.Repository.fromRepositoryName(this, 'SourceRepo', 'my-base-image');
const targetRepo = ecr.Repository.fromRepositoryName(this, 'TargetRepo', 'my-container-repo');

const containerRecipe = new imagebuilder.ContainerRecipe(this, 'EcrContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromEcr(sourceRepo, '1.0.0'),
  targetRepository: imagebuilder.Repository.fromEcr(targetRepo)
});
```

##### ECR Public Images

Using images from Amazon ECR Public:

```ts
const containerRecipe = new imagebuilder.ContainerRecipe(this, 'EcrPublicContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', '2023'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  )
});
```

#### Container Recipe Components

##### Custom Components in Container Recipes

Add your own components to the container recipe:

```ts
const customComponent = new imagebuilder.Component(this, 'MyComponent', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromJsonObject({
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'install-app',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            inputs: {
              commands: ['yum install -y my-container-application']
            }
          }
        ]
      }
    ]
  })
});

const containerRecipe = new imagebuilder.ContainerRecipe(this, 'ComponentContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  ),
  components: [
    {
      component: customComponent
    }
  ]
});
```

##### AWS-Managed Components in Container Recipes

Use pre-built AWS components:

```ts
const containerRecipe = new imagebuilder.ContainerRecipe(this, 'AmazonManagedContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  ),
  components: [
    {
      component: imagebuilder.AmazonManagedComponent.updateOs(this, 'UpdateOS', {
        platform: imagebuilder.Platform.LINUX
      })
    },
    {
      component: imagebuilder.AmazonManagedComponent.awsCliV2(this, 'AwsCli', {
        platform: imagebuilder.Platform.LINUX
      })
    }
  ]
});
```

#### Container Recipe Configuration

##### Custom Dockerfile

Provide your own Dockerfile template:

```ts
const containerRecipe = new imagebuilder.ContainerRecipe(this, 'CustomDockerfileContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  ),
  dockerfile: imagebuilder.DockerfileData.fromInline(`
FROM {{{ imagebuilder:parentImage }}}
CMD ["echo", "Hello, world!"]
{{{ imagebuilder:environments }}}
{{{ imagebuilder:components }}}
`)
});
```

##### Instance Configuration

Configure the build instance:

```ts
const containerRecipe = new imagebuilder.ContainerRecipe(this, 'InstanceConfigContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  ),
  // Custom ECS-optimized AMI for building
  instanceImage: imagebuilder.ContainerInstanceImage.fromSsmParameterName(
    '/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id'
  ),
  // Additional storage for build process
  instanceBlockDevices: [
    {
      deviceName: '/dev/xvda',
      volume: ec2.BlockDeviceVolume.ebs(50, {
        encrypted: true,
        volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3
      })
    }
  ]
});
```

### Component

A component defines the sequence of steps required to customize an instance during image creation (build component) or
test an instance launched from the created image (test component). Components are created from declarative YAML or JSON
documents that describe runtime configuration for building, validating, or testing instances. Components are included
when added to the image recipe or container recipe for an image build.

EC2 Image Builder supports AWS-managed components for common tasks, AWS Marketplace components, and custom components
that you create. Components run during specific workflow phases: build and validate phases during the build stage, and
test phase during the test stage.

#### Basic Component Usage

Create a component with the required properties: platform and component data.

```ts
const component = new imagebuilder.Component(this, 'MyComponent', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromJsonObject({
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'install-app',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            inputs: {
              commands: ['echo "Installing my application..."', 'yum update -y'],
            },
          },
        ],
      },
    ],
  }),
});
```

#### Component Data Sources

##### Inline Component Data

Use `ComponentData.fromInline()` for existing YAML/JSON definitions:

```ts
const component = new imagebuilder.Component(this, 'InlineComponent', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromInline(`
name: my-component
schemaVersion: 1.0
phases:
  - name: build
    steps:
      - name: update-os
        action: ExecuteBash
        inputs:
          commands: ['yum update -y']
`)
});
```

##### JSON Object Component Data

Most developer-friendly approach using objects:

```ts

const component = new imagebuilder.Component(this, 'JsonComponent', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromJsonObject({
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'configure-app',
            action: imagebuilder.ComponentAction.CREATE_FILE,
            inputs: {
              path: '/etc/myapp/config.json',
              content: '{"env": "production"}'
            }
          }
        ]
      }
    ]
  })
});
```

##### Structured Component Document

For type-safe, CDK-native definitions with enhanced properties like `timeout` and `onFailure`.

###### Defining a component step

You can define steps in the component which will be executed in order when the component is applied:

```ts
const step: imagebuilder.ComponentDocumentStep = {
  name: 'configure-app',
  action: imagebuilder.ComponentAction.CREATE_FILE,
  inputs: imagebuilder.ComponentStepInputs.fromObject({
    path: '/etc/myapp/config.json',
    content: '{"env": "production"}'
  })
};
```

###### Defining a component phase

Phases group steps together, which run in sequence when building, validating or testing in the component:

```ts
const phase: imagebuilder.ComponentDocumentPhase = {
  name: imagebuilder.ComponentPhaseName.BUILD,
  steps: [
    {
      name: 'configure-app',
      action: imagebuilder.ComponentAction.CREATE_FILE,
      inputs: imagebuilder.ComponentStepInputs.fromObject({
        path: '/etc/myapp/config.json',
        content: '{"env": "production"}'
      })
    }
  ]
};
```

###### Defining a component

The component data defines all steps across the provided phases to execute during the build:

```ts  
const component = new imagebuilder.Component(this, 'StructuredComponent', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromComponentDocumentJsonObject({
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'install-with-timeout',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            timeout: Duration.minutes(10),
            onFailure: imagebuilder.ComponentOnFailure.CONTINUE,
            inputs: imagebuilder.ComponentStepInputs.fromObject({
              commands: ['./install-script.sh']
            })
          }
        ]
      }
    ]
  })
});
```

##### S3 Component Data

For those components you want to upload or have uploaded to S3:

```ts
// Upload a local file
const componentFromAsset = new imagebuilder.Component(this, 'AssetComponent', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromAsset(this, 'ComponentAsset', './my-component.yml'),
});

// Reference an existing S3 object
const bucket = s3.Bucket.fromBucketName(this, 'ComponentBucket', 'my-components-bucket');
const componentFromS3 = new imagebuilder.Component(this, 'S3Component', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromS3(bucket, 'components/my-component.yml'),
});
```

#### Encrypt component data with a KMS key

You can encrypt component data with a KMS key, so that only principals with access to decrypt with the key are able to
access the component data.

```ts
const component = new imagebuilder.Component(this, 'EncryptedComponent', {
  platform: imagebuilder.Platform.LINUX,
  kmsKey: new kms.Key(this, 'ComponentKey'),
  data: imagebuilder.ComponentData.fromJsonObject({
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'secure-setup',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            inputs: {
              commands: ['echo "This component data is encrypted with KMS"']
            }
          }
        ]
      }
    ]
  })
});
```

#### AWS-Managed Components

AWS provides a collection of managed components for common tasks:

```ts
// Install AWS CLI v2
const awsCliComponent = imagebuilder.AmazonManagedComponent.awsCliV2(this, 'AwsCli', {
  platform: imagebuilder.Platform.LINUX
});

// Update the operating system
const updateComponent = imagebuilder.AmazonManagedComponent.updateOs(this, 'UpdateOS', {
  platform: imagebuilder.Platform.LINUX
});

// Reference any AWS-managed component by name
const customAwsComponent = imagebuilder.AmazonManagedComponent.fromAmazonManagedComponentName(
  this,
  'CloudWatchAgent',
  'amazon-cloudwatch-agent-linux'
);
```

#### AWS Marketplace Components

You can reference AWS Marketplace components using the marketplace component name and its product ID:

```ts
const marketplaceComponent = imagebuilder.AwsMarketplaceComponent.fromAwsMarketplaceComponentAttributes(
  this,
  'MarketplaceComponent',
  {
    componentName: 'my-marketplace-component',
    marketplaceProductId: 'prod-1234567890abcdef0',
  }
);
```

### Infrastructure Configuration

Infrastructure configuration defines the compute resources and environment settings used during the image building
process. This includes instance types, IAM instance profile, VPC settings, subnets, security groups, SNS topics for
notifications, logging configuration, and troubleshooting settings like whether to terminate instances on failure or
keep them running for debugging. These settings are applied to builds when included in an image or an image pipeline.

```ts
const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(this, 'InfrastructureConfiguration', {
  infrastructureConfigurationName: 'test-infrastructure-configuration',
  description: 'An Infrastructure Configuration',
  // Optional - instance types to use for build/test
  instanceTypes: [
    ec2.InstanceType.of(ec2.InstanceClass.STANDARD7_INTEL, ec2.InstanceSize.LARGE),
    ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.LARGE)
  ],
  // Optional - create an instance profile with necessary permissions
  instanceProfile: new iam.InstanceProfile(this, 'InstanceProfile', {
    instanceProfileName: 'test-instance-profile',
    role: new iam.Role(this, 'InstanceProfileRole', {
      assumedBy: iam.ServicePrincipal.fromStaticServicePrincipleName('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('EC2InstanceProfileForImageBuilder')
      ]
    })
  }),
  // Use VPC network configuration
  vpc,
  subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
  securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroup', vpc.vpcDefaultSecurityGroup)],
  keyPair: ec2.KeyPair.fromKeyPairName(this, 'KeyPair', 'imagebuilder-instance-key-pair'),
  terminateInstanceOnFailure: true,
  // Optional - IMDSv2 settings
  httpTokens: imagebuilder.HttpTokens.REQUIRED,
  httpPutResponseHopLimit: 1,
  // Optional - publish image completion messages to an SNS topic
  notificationTopic: sns.Topic.fromTopicArn(
    this,
    'Topic',
    this.formatArn({ service: 'sns', resource: 'image-builder-topic' })
  ),
  // Optional - log settings. Logging is enabled by default
  logging: {
    s3Bucket: s3.Bucket.fromBucketName(this, 'LogBucket', `imagebuilder-logging-${Aws.ACCOUNT_ID}`),
    s3KeyPrefix: 'imagebuilder-logs'
  },
  // Optional - host placement settings
  ec2InstanceAvailabilityZone: Stack.of(this).availabilityZones[0],
  ec2InstanceHostId: dedicatedHost.attrHostId,
  ec2InstanceTenancy: imagebuilder.Tenancy.HOST,
  resourceTags: {
    Environment: 'production'
  }
});
```

### Distribution Configuration

Distribution configuration defines how and where your built images are distributed after successful creation. For AMIs,
this includes target AWS Regions, KMS encryption keys, account sharing permissions, License Manager associations, and
launch template configurations. For container images, it specifies the target Amazon ECR repositories across regions.
A distribution configuration can be associated with an image or an image pipeline to define these distribution settings
for image builds.

#### AMI Distributions

AMI distributions can be defined to copy and modify AMIs in different accounts and regions, and apply them to launch
templates, SSM parameters, etc.:

```ts
const distributionConfiguration = new imagebuilder.DistributionConfiguration(this, 'DistributionConfiguration', {
  distributionConfigurationName: 'test-distribution-configuration',
  description: 'A Distribution Configuration',
  amiDistributions: [
    {
      // Distribute AMI to us-east-2 and publish the AMI ID to an SSM parameter
      region: 'us-east-2',
      ssmParameters: [
        {
          parameter: ssm.StringParameter.fromStringParameterAttributes(this, 'CrossRegionParameter', {
            parameterName: '/imagebuilder/ami',
            forceDynamicReference: true
          })
        }
      ]
    }
  ]
});

// For AMI-based image builds - add an AMI distribution in the current region
distributionConfiguration.addAmiDistributions({
  amiName: 'imagebuilder-{{ imagebuilder:buildDate }}',
  amiDescription: 'Build AMI',
  amiKmsKey: kms.Key.fromLookup(this, 'ComponentKey', { aliasName: 'alias/distribution-encryption-key' }),
  // Copy the AMI to different accounts
  amiTargetAccountIds: ['123456789012', '098765432109'],
  // Add launch permissions on the AMI
  amiLaunchPermission: {
    organizationArns: [
      this.formatArn({ region: '', service: 'organizations', resource: 'organization', resourceName: 'o-1234567abc' })
    ],
    organizationalUnitArns: [
      this.formatArn({
        region: '',
        service: 'organizations',
        resource: 'ou',
        resourceName: 'o-1234567abc/ou-a123-b4567890'
      })
    ],
    isPublicUserGroup: true,
    accountIds: ['234567890123']
  },
  // Attach tags to the AMI
  amiTags: {
    Environment: 'production',
    Version: '{{ imagebuilder:buildVersion }}'
  },
  // Optional - publish the distributed AMI ID to an SSM parameter
  ssmParameters: [
    {
      parameter: ssm.StringParameter.fromStringParameterAttributes(this, 'Parameter', {
        parameterName: '/imagebuilder/ami',
        forceDynamicReference: true
      })
    },
    {
      amiAccount: '098765432109',
      dataType: ssm.ParameterDataType.TEXT,
      parameter: ssm.StringParameter.fromStringParameterAttributes(this, 'CrossAccountParameter', {
        parameterName: 'imagebuilder-prod-ami',
        forceDynamicReference: true
      })
    }
  ],
  // Optional - create a new launch template version with the distributed AMI ID
  launchTemplates: [
    {
      launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(this, 'LaunchTemplate', {
        launchTemplateId: 'lt-1234'
      }),
      setDefaultVersion: true
    },
    {
      accountId: '123456789012',
      launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(this, 'CrossAccountLaunchTemplate', {
        launchTemplateId: 'lt-5678'
      }),
      setDefaultVersion: true
    }
  ],
  // Optional - enable Fast Launch on an imported launch template
  fastLaunchConfigurations: [
    {
      enabled: true,
      launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(this, 'FastLaunchLT', {
        launchTemplateName: 'fast-launch-lt'
      }),
      maxParallelLaunches: 10,
      targetSnapshotCount: 2
    }
  ],
  // Optional - license configurations to apply to the AMI
  licenseConfigurationArns: [
    'arn:aws:license-manager:us-west-2:123456789012:license-configuration:lic-abcdefghijklmnopqrstuvwxyz'
  ]
});
```

#### Container Distributions

##### Container repositories

Container distributions can be configured to distribute to ECR repositories:

```ts
const ecrRepository = ecr.Repository.fromRepositoryName(this, 'ECRRepository', 'my-repo');
const imageBuilderRepository = imagebuilder.Repository.fromEcr(ecrRepository);
```

##### Defining a container distribution

You can configure the container repositories as well as the description and tags applied to the distributed container
images:

```ts
const ecrRepository = ecr.Repository.fromRepositoryName(this, 'ECRRepository', 'my-repo');
const containerRepository = imagebuilder.Repository.fromEcr(ecrRepository);
const containerDistributionConfiguration = new imagebuilder.DistributionConfiguration(
  this,
  'ContainerDistributionConfiguration'
);

containerDistributionConfiguration.addContainerDistributions({
  containerRepository,
  containerDescription: 'Test container image',
  containerTags: ['latest', 'latest-1.0']
});
```

### Workflow

Workflows define the sequence of steps that Image Builder performs during image creation. There are three workflow
types: BUILD (image building), TEST (testing images), and DISTRIBUTION (distributing container images).

#### Basic Workflow Usage

Create a workflow with the required properties: workflow type and workflow data.

```ts
const workflow = new imagebuilder.Workflow(this, 'MyWorkflow', {
  workflowType: imagebuilder.WorkflowType.BUILD,
  data: imagebuilder.WorkflowData.fromJsonObject({
    schemaVersion: imagebuilder.WorkflowSchemaVersion.V1_0,
    steps: [
      {
        name: 'LaunchBuildInstance',
        action: imagebuilder.WorkflowAction.LAUNCH_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          waitFor: 'ssmAgent',
        },
      },
      {
        name: 'ExecuteComponents',
        action: imagebuilder.WorkflowAction.EXECUTE_COMPONENTS,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          'instanceId': 'i-123',
        },
      },
      {
        name: 'CreateImage',
        action: imagebuilder.WorkflowAction.CREATE_IMAGE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          'instanceId': 'i-123',
        },
      },
      {
        name: 'TerminateInstance',
        action: imagebuilder.WorkflowAction.TERMINATE_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.CONTINUE,
        inputs: {
          'instanceId': 'i-123',
        },
      },
    ],
    outputs: [
      {
        name: 'ImageId',
        value: '$.stepOutputs.CreateImage.imageId',
      },
    ],
  }),
});
```

#### Workflow Data Sources

##### Inline Workflow Data

Use `WorkflowData.fromInline()` for existing YAML/JSON definitions:

```ts
const workflow = new imagebuilder.Workflow(this, 'InlineWorkflow', {
  workflowType: imagebuilder.WorkflowType.TEST,
  data: imagebuilder.WorkflowData.fromInline(`
schemaVersion: 1.0
steps:
  - name: LaunchTestInstance
    action: LaunchInstance
    onFailure: Abort
    inputs:
      waitFor: ssmAgent
  - name: RunTests
    action: RunCommand
    onFailure: Abort
    inputs:
      instanceId.$: "$.stepOutputs.LaunchTestInstance.instanceId"
      commands: ['./run-tests.sh']
  - name: TerminateTestInstance
    action: TerminateInstance
    onFailure: Continue
    inputs:
      instanceId.$: "$.stepOutputs.LaunchTestInstance.instanceId"
`),
});
```

##### JSON Object Workflow Data

Most developer-friendly approach using JavaScript objects:

```ts
const workflow = new imagebuilder.Workflow(this, 'JsonWorkflow', {
  workflowType: imagebuilder.WorkflowType.BUILD,
  data: imagebuilder.WorkflowData.fromJsonObject({
    schemaVersion: imagebuilder.WorkflowSchemaVersion.V1_0,
    steps: [
      {
        name: 'LaunchBuildInstance',
        action: imagebuilder.WorkflowAction.LAUNCH_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          waitFor: 'ssmAgent'
        }
      },
      {
        name: 'ExecuteComponents',
        action: imagebuilder.WorkflowAction.EXECUTE_COMPONENTS,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          'instanceId': 'i-123'
        }
      },
      {
        name: 'CreateImage',
        action: imagebuilder.WorkflowAction.CREATE_IMAGE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          'instanceId': 'i-123'
        }
      },
      {
        name: 'TerminateInstance',
        action: imagebuilder.WorkflowAction.TERMINATE_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.CONTINUE,
        inputs: {
          'instanceId': 'i-123'
        }
      }
    ],
    outputs: [
      {
        name: 'ImageId',
        value: '$.stepOutputs.CreateImage.imageId'
      }
    ]
  })
});
```

##### S3 Workflow Data

For those workflows you want to upload or have uploaded to S3:

```ts
// Upload a local file
const workflowFromAsset = new imagebuilder.Workflow(this, 'AssetWorkflow', {
  workflowType: imagebuilder.WorkflowType.BUILD,
  data: imagebuilder.WorkflowData.fromAsset(this, 'WorkflowAsset', './my-workflow.yml'),
});

// Reference an existing S3 object
const bucket = s3.Bucket.fromBucketName(this, 'WorkflowBucket', 'my-workflows-bucket');
const workflowFromS3 = new imagebuilder.Workflow(this, 'S3Workflow', {
  workflowType: imagebuilder.WorkflowType.BUILD,
  data: imagebuilder.WorkflowData.fromS3(bucket, 'workflows/my-workflow.yml'),
});
```

#### Encrypt workflow data with a KMS key

You can encrypt workflow data with a KMS key, so that only principals with access to decrypt with the key are able to
access the workflow data.

```ts
const workflow = new imagebuilder.Workflow(this, 'EncryptedWorkflow', {
  workflowType: imagebuilder.WorkflowType.BUILD,
  kmsKey: new kms.Key(this, 'WorkflowKey'),
  data: imagebuilder.WorkflowData.fromJsonObject({
    schemaVersion: imagebuilder.WorkflowSchemaVersion.V1_0,
    steps: [
      {
        name: 'LaunchBuildInstance',
        action: imagebuilder.WorkflowAction.LAUNCH_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          waitFor: 'ssmAgent',
        },
      },
      {
        name: 'CreateImage',
        action: imagebuilder.WorkflowAction.CREATE_IMAGE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          'instanceId': 'i-123',
        },
      },
      {
        name: 'TerminateInstance',
        action: imagebuilder.WorkflowAction.TERMINATE_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.CONTINUE,
        inputs: {
          'instanceId': 'i-123',
        },
      },
    ],
    outputs: [
      {
        name: 'ImageId',
        value: '$.stepOutputs.CreateImage.imageId',
      },
    ],
  }),
});
```

#### AWS-Managed Workflows

AWS provides a collection of workflows for common scenarios:

```ts
// Build workflows
const buildImageWorkflow = imagebuilder.AmazonManagedWorkflow.buildImage(this, 'BuildImage');
const buildContainerWorkflow = imagebuilder.AmazonManagedWorkflow.buildContainer(this, 'BuildContainer');

// Test workflows  
const testImageWorkflow = imagebuilder.AmazonManagedWorkflow.testImage(this, 'TestImage');
const testContainerWorkflow = imagebuilder.AmazonManagedWorkflow.testContainer(this, 'TestContainer');

// Distribution workflows
const distributeContainerWorkflow = imagebuilder.AmazonManagedWorkflow.distributeContainer(this, 'DistributeContainer');
```

### Lifecycle Policy

Lifecycle policies help you manage the retention and cleanup of Image Builder resources automatically. These policies
define rules for deprecating or deleting old image versions, managing AMI snapshots, and controlling resource costs by
removing unused images based on age, count, or other criteria.

#### Lifecycle Policy Basic Usage

Create a lifecycle policy to automatically delete old AMI images after 30 days:

```ts
const lifecyclePolicy = new imagebuilder.LifecyclePolicy(this, 'MyLifecyclePolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { ageFilter: { age: Duration.days(30) } }
    }
  ],
  resourceSelection: {
    tags: { Environment: 'development' }
  }
});
```

Create a lifecycle policy to keep only the 10 most recent container images:

```ts
const containerLifecyclePolicy = new imagebuilder.LifecyclePolicy(this, 'ContainerLifecyclePolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.CONTAINER_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { countFilter: { count: 10 } }
    }
  ],
  resourceSelection: {
    tags: { Application: 'web-app' }
  }
});
```

#### Lifecycle Policy Resource Selection

##### Tag-Based Resource Selection

Apply lifecycle policies to images with specific tags:

```ts
const tagBasedPolicy = new imagebuilder.LifecyclePolicy(this, 'TagBasedPolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { ageFilter: { age: Duration.days(90) } }
    }
  ],
  resourceSelection: {
    tags: {
      Environment: 'staging',
      Team: 'backend'
    }
  }
});
```

##### Recipe-Based Resource Selection

Apply lifecycle policies to specific image or container recipes:

```ts
const imageRecipe = new imagebuilder.ImageRecipe(this, 'MyImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64'
  )
});

const containerRecipe = new imagebuilder.ContainerRecipe(this, 'MyContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(this, 'Repository', 'my-container-repo')
  )
});

const recipeBasedPolicy = new imagebuilder.LifecyclePolicy(this, 'RecipeBasedPolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { countFilter: { count: 5 } }
    }
  ],
  resourceSelection: {
    recipes: [imageRecipe, containerRecipe]
  }
});
```

#### Lifecycle Policy Rules

##### Age-Based Rules

Delete images older than a specific time period:

```ts
const ageBasedPolicy = new imagebuilder.LifecyclePolicy(this, 'AgeBasedPolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  details: [
    {
      action: {
        type: imagebuilder.LifecyclePolicyActionType.DELETE,
        includeAmis: true,
        includeSnapshots: true
      },
      filter: {
        ageFilter: {
          age: Duration.days(60),
          retainAtLeast: 3  // Always keep at least 3 images
        }
      }
    }
  ],
  resourceSelection: {
    tags: { Environment: 'testing' }
  }
});
```

##### Count-Based Rules

Keep only a specific number of the most recent images:

```ts
const countBasedPolicy = new imagebuilder.LifecyclePolicy(this, 'CountBasedPolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.CONTAINER_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { countFilter: { count: 15 } }  // Keep only the 15 most recent images
    }
  ],
  resourceSelection: {
    tags: { Application: 'microservice' }
  }
});
```

##### Multiple Lifecycle Rules

Implement a graduated approach with multiple actions:

```ts
const graduatedPolicy = new imagebuilder.LifecyclePolicy(this, 'GraduatedPolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  details: [
    {
      // First: Deprecate images after 30 days
      action: {
        type: imagebuilder.LifecyclePolicyActionType.DEPRECATE,
        includeAmis: true
      },
      filter: {
        ageFilter: {
          age: Duration.days(30),
          retainAtLeast: 5
        }
      }
    },
    {
      // Second: Disable images after 60 days  
      action: {
        type: imagebuilder.LifecyclePolicyActionType.DISABLE,
        includeAmis: true
      },
      filter: {
        ageFilter: {
          age: Duration.days(60),
          retainAtLeast: 3
        }
      }
    },
    {
      // Finally: Delete images after 90 days
      action: {
        type: imagebuilder.LifecyclePolicyActionType.DELETE,
        includeAmis: true,
        includeSnapshots: true
      },
      filter: {
        ageFilter: {
          age: Duration.days(90),
          retainAtLeast: 1
        }
      }
    }
  ],
  resourceSelection: {
    tags: { Environment: 'production' }
  }
});
```

#### Lifecycle Policy Exclusion Rules

##### AMI Exclusion Rules

Exclude specific AMIs from lifecycle actions based on various criteria:

```ts
const excludeAmisPolicy = new imagebuilder.LifecyclePolicy(this, 'ExcludeAmisPolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { ageFilter: { age: Duration.days(30) } },
      exclusionRules: {
        amiExclusionRules: {
          isPublic: true,  // Exclude public AMIs
          lastLaunched: Duration.days(7),  // Exclude AMIs launched in last 7 days
          regions: ['us-west-2', 'eu-west-1'],  // Exclude AMIs in specific regions
          sharedAccounts: ['123456789012'],  // Exclude AMIs shared with specific accounts
          tags: {
            Protected: 'true',
            Environment: 'production'
          }
        }
      }
    }
  ],
  resourceSelection: {
    tags: { Team: 'infrastructure' }
  }
});
```

##### Image Exclusion Rules

Exclude Image Builder images with protective tags:

```ts
const excludeImagesPolicy = new imagebuilder.LifecyclePolicy(this, 'ExcludeImagesPolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.CONTAINER_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { countFilter: { count: 20 } },
      exclusionRules: {
        imageExclusionRules: {
          tags: {
            DoNotDelete: 'true',
            Critical: 'baseline'
          }
        }
      }
    }
  ],
  resourceSelection: {
    tags: { Application: 'frontend' }
  }
});
```

#### Advanced Lifecycle Configuration

##### Custom Execution Roles

Provide your own IAM execution role with specific permissions:

```ts
const executionRole = new iam.Role(this, 'LifecycleExecutionRole', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/EC2ImageBuilderLifecycleExecutionPolicy')
  ]
});

const customRolePolicy = new imagebuilder.LifecyclePolicy(this, 'CustomRolePolicy', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  executionRole: executionRole,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { ageFilter: { age: Duration.days(45) } }
    }
  ],
  resourceSelection: {
    tags: { Environment: 'development' }
  }
});
```

##### Lifecycle Policy Status

Control whether the lifecycle policy is active:

```ts
const disabledPolicy = new imagebuilder.LifecyclePolicy(this, 'DisabledPolicy', {
  lifecyclePolicyName: 'my-disabled-policy',
  description: 'A lifecycle policy that is temporarily disabled',
  status: imagebuilder.LifecyclePolicyStatus.DISABLED,
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { ageFilter: { age: Duration.days(30) } }
    }
  ],
  resourceSelection: {
    tags: { Environment: 'testing' }
  },
  tags: {
    Owner: 'DevOps',
    CostCenter: 'Engineering'
  }
});
```

##### Importing Lifecycle Policies

Reference lifecycle policies created outside CDK:

```ts
// Import by name
const importedByName = imagebuilder.LifecyclePolicy.fromLifecyclePolicyName(
  this,
  'ImportedByName',
  'existing-lifecycle-policy'
);

// Import by ARN
const importedByArn = imagebuilder.LifecyclePolicy.fromLifecyclePolicyArn(
  this,
  'ImportedByArn',
  'arn:aws:imagebuilder:us-east-1:123456789012:lifecycle-policy/my-policy'
);

importedByName.grantRead(lambdaRole);
importedByArn.grant(lambdaRole, 'imagebuilder:UpdateLifecyclePolicy');
```
