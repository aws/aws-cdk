import { Mesh } from '@aws-cdk/aws-appmesh';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import { AppMeshAddon, CloudwatchAgentAddon, Container, Environment, FireLensAddon, HttpLoadBalancerAddon, Service, XRayAddon } from '../lib';
import { ServiceDescription } from '../lib/service-description';

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
  image: ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
}));
nameDescription.add(new AppMeshAddon({ mesh }));
nameDescription.add(new FireLensAddon());
nameDescription.add(new XRayAddon());
nameDescription.add(new CloudwatchAgentAddon());

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
  image: ContainerImage.fromRegistry('nathanpeck/greeting'),
  environment: {
    PORT: '80',
  },
}));
greetingDescription.add(new AppMeshAddon({ mesh }));
greetingDescription.add(new FireLensAddon());
greetingDescription.add(new XRayAddon());
greetingDescription.add(new CloudwatchAgentAddon());

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
  image: ContainerImage.fromRegistry('nathanpeck/greeter'),
  environment: {
    PORT: '80',
    GREETING_URL: 'http://greeting.internal',
    NAME_URL: 'http://name.internal',
  },
}));
greeterDescription.add(new AppMeshAddon({ mesh }));
greeterDescription.add(new FireLensAddon());
greeterDescription.add(new XRayAddon());
greeterDescription.add(new CloudwatchAgentAddon());
greeterDescription.add(new HttpLoadBalancerAddon());

const greeterService = new Service(stack, 'greeter', {
  environment: environment,
  serviceDescription: greeterDescription,
});

greeterService.connectTo(nameService);
greeterService.connectTo(greetingService);

/**
 * Expectations are that you should see an output
 * of the load balancer URL for the greeter service, make
 * a request to it and see a greeting phrase constructed out
 * of a random greeting and a random name from the two underlying
 * services. The other addons enable tracing and logging which must
 * be verified separately.
 */