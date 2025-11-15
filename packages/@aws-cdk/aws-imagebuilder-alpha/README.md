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

### Workflow

Workflows define the sequence of steps that Image Builder performs during image creation. There are three workflow types: BUILD (image building), TEST (testing images), and DISTRIBUTION (distributing container images).

#### Basic Usage

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

You can encrypt workflow data with a KMS key, so that only principals with access to decrypt with the key are able to access the workflow data.

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
const buildImageWorkflow = imagebuilder.AwsManagedWorkflow.buildImage(this, 'BuildImage');
const buildContainerWorkflow = imagebuilder.AwsManagedWorkflow.buildContainer(this, 'BuildContainer');

// Test workflows  
const testImageWorkflow = imagebuilder.AwsManagedWorkflow.testImage(this, 'TestImage');
const testContainerWorkflow = imagebuilder.AwsManagedWorkflow.testContainer(this, 'TestContainer');

// Distribution workflows
const distributeContainerWorkflow = imagebuilder.AwsManagedWorkflow.distributeContainer(this, 'DistributeContainer');
```
