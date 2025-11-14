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

### Distribution Configuration

Distribution configuration defines how and where your built images are distributed after successful creation. For AMIs,
this includes target AWS Regions, KMS encryption keys, account sharing permissions, License Manager associations, and
launch template configurations. For container images, it specifies the target Amazon ECR repositories across regions.
A distribution configuration can be associated with an image or an image pipeline to define these distribution settings
for image builds.

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
        launchTemplateName: 'imagebuilder-ami'
      }),
      setDefaultVersion: true
    },
    {
      accountId: '123456789012',
      launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(this, 'CrossAccountLaunchTemplate', {
        launchTemplateName: 'imagebuilder-cross-account-ami'
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
