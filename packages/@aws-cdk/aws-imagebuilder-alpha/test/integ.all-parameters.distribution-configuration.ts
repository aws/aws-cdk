import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-distribution-configuration-all-parameters');

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

distributionConfiguration.addAmiDistributions({
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
});
distributionConfiguration.addContainerDistributions({
  region: 'us-east-1',
  containerRepository: imagebuilder.Repository.fromEcr(repository),
  containerDescription: 'Test container image',
  containerTags: ['latest', 'latest-1.0'],
});

new integ.IntegTest(app, 'InfrastructureConfigurationTest', {
  testCases: [stack],
});
