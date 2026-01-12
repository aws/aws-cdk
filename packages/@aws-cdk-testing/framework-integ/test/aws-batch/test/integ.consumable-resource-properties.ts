import * as batch from 'aws-cdk-lib/aws-batch';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Size, Stack } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'BatchConsumableResourcePropertiesStack');

const container = new batch.EcsEc2ContainerDefinition(stack, 'Container', {
  image: ecs.ContainerImage.fromRegistry('busybox'),
  cpu: 1,
  memory: Size.mebibytes(128),
});

const jobDefWithConsumableResources = new batch.EcsJobDefinition(stack, 'JobDefinitionWithConsumableResources', {
  container,
  jobDefinitionName: 'test-job-def-with-consumable-resources',
  consumableResourceProperties: {
    consumableResourceList: [
      {
        consumableResource: 'arn:aws:batch:us-east-1:123456789012:consumable-resource/license-tokens',
        quantity: 2,
      },
      {
        consumableResource: 'arn:aws:batch:us-east-1:123456789012:consumable-resource/api-calls',
        quantity: 100,
      },
    ],
  },
});

const jobDefWithoutConsumableResources = new batch.EcsJobDefinition(stack, 'JobDefinitionWithoutConsumableResources', {
  container: new batch.EcsEc2ContainerDefinition(stack, 'ContainerWithoutConsumableResources', {
    image: ecs.ContainerImage.fromRegistry('busybox'),
    cpu: 1,
    memory: Size.mebibytes(128),
  }),
  jobDefinitionName: 'test-job-def-without-consumable-resources',
});

const integ = new IntegTest(app, 'BatchConsumableResourcePropertiesTest', {
  testCases: [stack],
});

// Assert that the job definition with consumable resources has the property
integ.assertions.awsApiCall('Batch', 'describeJobDefinitions', {
  jobDefinitionName: jobDefWithConsumableResources.jobDefinitionName,
}).assertAtPath('jobDefinitions.0.consumableResourceProperties.consumableResourceList.0.consumableResource',
  ExpectedResult.exact('arn:aws:batch:us-east-1:123456789012:consumable-resource/license-tokens'),
);

integ.assertions.awsApiCall('Batch', 'describeJobDefinitions', {
  jobDefinitionName: jobDefWithConsumableResources.jobDefinitionName,
}).assertAtPath('jobDefinitions.0.consumableResourceProperties.consumableResourceList.0.quantity',
  ExpectedResult.exact(2),
);

integ.assertions.awsApiCall('Batch', 'describeJobDefinitions', {
  jobDefinitionName: jobDefWithConsumableResources.jobDefinitionName,
}).assertAtPath('jobDefinitions.0.consumableResourceProperties.consumableResourceList.1.consumableResource',
  ExpectedResult.exact('arn:aws:batch:us-east-1:123456789012:consumable-resource/api-calls'),
);

integ.assertions.awsApiCall('Batch', 'describeJobDefinitions', {
  jobDefinitionName: jobDefWithConsumableResources.jobDefinitionName,
}).assertAtPath('jobDefinitions.0.consumableResourceProperties.consumableResourceList.1.quantity',
  ExpectedResult.exact(100),
);

// Assert that the job definition without consumable resources does not have the property
integ.assertions.awsApiCall('Batch', 'describeJobDefinitions', {
  jobDefinitionName: jobDefWithoutConsumableResources.jobDefinitionName,
}).assertAtPath('jobDefinitions.0.consumableResourceProperties',
  ExpectedResult.exact(undefined),
);
