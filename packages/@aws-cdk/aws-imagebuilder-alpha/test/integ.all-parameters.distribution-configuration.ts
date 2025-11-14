import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-distribution-configuration-all-parameters');
const crossRegionParameter = new cdk.CfnParameter(stack, 'CrossRegion', {
  type: 'String',
  description: 'Unresolved token testing',
  default: 'ap-northeast-1',
});

const launchTemplate = new ec2.LaunchTemplate(stack, 'LaunchTemplate', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  instanceType: new ec2.InstanceType('t3.small'),
});
const repository = new ecr.Repository(stack, 'Repository');

const distributionConfiguration = new imagebuilder.DistributionConfiguration(stack, 'DistributionConfiguration', {
  description: 'This is a distribution configuration.',
  tags: {
    key1: 'value1',
    key2: 'value2',
  },
});

const amiOnlyDistributionConfiguration = new imagebuilder.DistributionConfiguration(
  stack,
  'AMIDistributionConfiguration',
  {
    description: 'This is an AMI distribution configuration.',
    tags: {
      key1: 'value1',
      key2: 'value2',
    },
  },
);

const containerOnlyDistributionConfiguration = new imagebuilder.DistributionConfiguration(
  stack,
  'ContainerDistributionConfiguration',
  {
    description: 'This is an AMI distribution configuration.',
    tags: {
      key1: 'value1',
      key2: 'value2',
    },
  },
);

const amiDistributionConfiguration: imagebuilder.AmiDistribution = {
  region: 'us-east-1',
  amiName: 'imagebuilder-{{ imagebuilder:buildDate }}',
  amiDescription: 'Build AMI',
  amiKmsKey: kms.Alias.fromAliasName(stack, 'DistributedAMIKey', 'alias/distribution-encryption-key'),
  amiTargetAccountIds: ['123456789012', '098765432109'],
  amiLaunchPermission: {
    organizationArns: [
      stack.formatArn({
        region: '',
        service: 'organizations',
        resource: 'organization',
        resourceName: 'o-1234567abc',
      }),
    ],
    organizationalUnitArns: [
      stack.formatArn({
        region: '',
        service: 'organizations',
        resource: 'ou',
        resourceName: 'o-1234567abc/ou-a123-b4567890',
      }),
    ],
    isPublicUserGroup: true,
    accountIds: ['234567890123'],
  },
  amiTags: {
    Environment: 'test',
    Version: '{{ imagebuilder:buildVersion }}',
  },
  ssmParameters: [
    {
      amiAccount: '098765432109',
      parameter: ssm.StringParameter.fromStringParameterAttributes(stack, 'Parameter', {
        parameterName: '/imagebuilder/ami',
        forceDynamicReference: true,
      }),
    },
  ],
  launchTemplates: [
    {
      launchTemplate,
      setDefaultVersion: true,
    },
  ],
  fastLaunchConfigurations: [
    {
      enabled: true,
      launchTemplate,
      maxParallelLaunches: 10,
      targetSnapshotCount: 25,
    },
  ],
  licenseConfigurationArns: [
    stack.formatArn({
      service: 'license-manager',
      resource: 'license-configuration',
      resourceName: 'lic-abcdefghijklmnopqrstuvwxyz123456',
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    }),
  ],
};

const crossRegionAmiDistributionConfiguration: imagebuilder.AmiDistribution = {
  region: crossRegionParameter.valueAsString,
  amiName: 'imagebuilder-{{ imagebuilder:buildDate }}',
  amiDescription: 'Build AMI',
  amiTags: {
    Environment: 'test',
    Version: '{{ imagebuilder:buildVersion }}',
  },
  ssmParameters: [
    {
      parameter: ssm.StringParameter.fromStringParameterAttributes(stack, 'CrossRegionParameter', {
        parameterName: '/imagebuilder/ami',
        forceDynamicReference: true,
      }),
    },
  ],
};

const containerDistributionConfiguration: imagebuilder.ContainerDistribution = {
  region: 'us-east-1',
  containerRepository: imagebuilder.Repository.fromEcr(repository),
  containerDescription: 'Test container image',
  containerTags: ['latest', 'latest-1.0'],
};

const crossRegionContainerDistributionConfiguration: imagebuilder.ContainerDistribution = {
  region: crossRegionParameter.valueAsString,
  containerRepository: imagebuilder.Repository.fromEcr(
    ecr.Repository.fromRepositoryName(stack, 'CrossRegionRepository', 'cross-region-repository'),
  ),
  containerDescription: 'Test container image',
  containerTags: ['cross-region-latest', 'cross-region-latest-1.0'],
};

distributionConfiguration.addAmiDistributions(amiDistributionConfiguration, crossRegionAmiDistributionConfiguration);
distributionConfiguration.addContainerDistributions(
  containerDistributionConfiguration,
  crossRegionContainerDistributionConfiguration,
);

amiOnlyDistributionConfiguration.addAmiDistributions(
  amiDistributionConfiguration,
  crossRegionAmiDistributionConfiguration,
);

containerOnlyDistributionConfiguration.addContainerDistributions(
  containerDistributionConfiguration,
  crossRegionContainerDistributionConfiguration,
);

new integ.IntegTest(app, 'DistributionConfigurationTest', {
  testCases: [stack],
});
