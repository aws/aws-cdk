import { Mesh } from '@aws-cdk/aws-appmesh';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import { AppMeshAddon, CloudwatchAgentAddon, Container, Environment, FireLensAddon, HttpLoadBalancerAddon, XRayAddon } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');

const environment = new Environment(stack, 'production');
const myService = environment.addService('my-service');

const mesh = new Mesh(stack, 'my-mesh');

myService.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
}));

myService.add(new FireLensAddon());
myService.add(new XRayAddon());
myService.add(new CloudwatchAgentAddon());
myService.add(new AppMeshAddon({
  mesh,
}));
myService.add(new HttpLoadBalancerAddon());

app.synth();