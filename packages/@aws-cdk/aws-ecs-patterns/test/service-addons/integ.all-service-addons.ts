import { Mesh } from '@aws-cdk/aws-appmesh';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import { AppMeshAddon, CloudwatchAgentAddon, Container, Environment, FireLensAddon, HttpLoadBalancerAddon, XRayAddon } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');

const mesh = new Mesh(stack, 'my-mesh');
const environment = new Environment(stack, 'production');

/** Name service */
const nameService = environment.addService('name');
nameService.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
}));
nameService.add(new AppMeshAddon({ mesh }));
nameService.add(new FireLensAddon());
nameService.add(new XRayAddon());
nameService.add(new CloudwatchAgentAddon());

/** Greeting service */
const greetingService = environment.addService('greeting');
greetingService.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('nathanpeck/greeting'),
  environment: {
    PORT: '80',
  },
}));
greetingService.add(new AppMeshAddon({ mesh }));
greetingService.add(new FireLensAddon());
greetingService.add(new XRayAddon());
greetingService.add(new CloudwatchAgentAddon());

/** Greeter service */
const greeterService = environment.addService('greeter');
greeterService.add(new Container({
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
greeterService.add(new AppMeshAddon({ mesh }));
greeterService.add(new FireLensAddon());
greeterService.add(new XRayAddon());
greeterService.add(new CloudwatchAgentAddon());
greeterService.add(new HttpLoadBalancerAddon());

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