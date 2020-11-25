import * as ecs from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import { OpenTelemetryCollector, Container, Environment, HttpLoadBalancerExtension, Service, ServiceDescription } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const environment = new Environment(stack, 'production');

/** Name service */
const nameDescription = new ServiceDescription();
nameDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ecs.ContainerImage.fromAsset('./test-apps/name'),
  environment: {
    PORT: '80',
    TEST_NEWRELIC: 'true',
  },
}));
nameDescription.add(new OpenTelemetryCollector());
nameDescription.add(new HttpLoadBalancerExtension());

new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
});