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

### Component

A component defines the sequence of steps required to customize an instance during image creation (build component) or
test an instance launched from the created image (test component). Components are created from declarative YAML or JSON
documents that describe runtime configuration for building, validating, or testing instances. Components are included
when added to the image recipe or container recipe for an image build.

EC2 Image Builder supports AWS-managed components for common tasks, AWS Marketplace components, and custom components
that you create. Components run during specific workflow phases: build and validate phases during the build stage, and
test phase during the test stage.

#### Basic Usage

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
              content: '{"env": "production"}',
            },
          },
        ],
      },
    ],
  }),
});
```

##### Structured Component Document

For type-safe, CDK-native definitions with enhanced properties like `timeout` and `onFailure`:

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
            inputs: {
              commands: ['./install-script.sh'],
            },
          },
        ],
      },
    ],
  }),
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
              commands: ['echo "This component data is encrypted with KMS"'],
            },
          },
        ],
      },
    ],
  }),
});
```

#### AWS-Managed Components

AWS provides a collection of managed components for common tasks:

```ts
// Install AWS CLI v2
const awsCliComponent = imagebuilder.AwsManagedComponent.awsCliV2(this, 'AwsCli', {
  platform: imagebuilder.Platform.LINUX
});

// Update the operating system
const updateComponent = imagebuilder.AwsManagedComponent.updateOS(this, 'UpdateOS', {
  platform: imagebuilder.Platform.LINUX
});

// Reference any AWS-managed component by name
const customAwsComponent = imagebuilder.AwsManagedComponent.fromAwsManagedComponentName(
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
