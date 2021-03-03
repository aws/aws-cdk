/// !cdk-integ pragma:ignore-assets
import { Mesh } from '@aws-cdk/aws-appmesh';
import * as ecs from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import { AppMeshExtension, OpenTelemetryCollector, CloudWatchLogsExtension, Container, Environment, HttpLoadBalancerExtension, ScaleOnCpuUtilization, Service, ServiceDescription } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const mesh = new Mesh(stack, 'my-mesh');
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
    TEST_XRAY: 'true',
  },
}));
nameDescription.add(new AppMeshExtension({ mesh }));
nameDescription.add(new OpenTelemetryCollector());
nameDescription.add(new CloudWatchLogsExtension());
nameDescription.add(new ScaleOnCpuUtilization({
  initialTaskCount: 2,
  minTaskCount: 2,
}));

const nameService = new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
});

/** Greeting service */
const greetingDescription = new ServiceDescription();
greetingDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ecs.ContainerImage.fromAsset('./test-apps/greeting'),
  environment: {
    PORT: '80',
    TEST_XRAY: 'true',
  },
}));
greetingDescription.add(new AppMeshExtension({ mesh }));
greetingDescription.add(new OpenTelemetryCollector());
greetingDescription.add(new CloudWatchLogsExtension());
greetingDescription.add(new ScaleOnCpuUtilization({
  initialTaskCount: 2,
  minTaskCount: 2,
}));

const greetingService = new Service(stack, 'greeting', {
  environment: environment,
  serviceDescription: greetingDescription,
});

/** Greeter service */
const greeterDescription = new ServiceDescription();
greeterDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ecs.ContainerImage.fromAsset('./test-apps/greeter'),
  environment: {
    PORT: '80',
    GREETING_URL: 'http://greeting.production',
    NAME_URL: 'http://name.production',
    TEST_XRAY: 'true',
  },
}));
greeterDescription.add(new AppMeshExtension({ mesh }));
greeterDescription.add(new OpenTelemetryCollector());
greeterDescription.add(new CloudWatchLogsExtension());
greeterDescription.add(new HttpLoadBalancerExtension());
greeterDescription.add(new ScaleOnCpuUtilization({
  initialTaskCount: 2,
  minTaskCount: 2,
}));

const greeterService = new Service(stack, 'greeter', {
  environment: environment,
  serviceDescription: greeterDescription,
});

greeterService.connectTo(nameService);
greeterService.connectTo(greetingService);