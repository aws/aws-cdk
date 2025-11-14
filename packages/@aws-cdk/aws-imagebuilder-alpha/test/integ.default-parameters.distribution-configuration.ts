import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-distribution-configuration-default-parameters');

const repository = new ecr.Repository(stack, 'Repository');

const amiDistributionConfiguration = new imagebuilder.DistributionConfiguration(stack, 'AMIDistributionConfiguration');
amiDistributionConfiguration.addAmiDistributions({ amiName: 'imagebuidler-{{ imagebuilder:buildDate }}' });

const containerDistributionConfiguration = new imagebuilder.DistributionConfiguration(
  stack,
  'ContainerDistributionConfiguration',
);
containerDistributionConfiguration.addContainerDistributions({
  containerRepository: imagebuilder.Repository.fromEcr(repository),
});

new integ.IntegTest(app, 'DistributionConfigurationTest', {
  testCases: [stack],
});
