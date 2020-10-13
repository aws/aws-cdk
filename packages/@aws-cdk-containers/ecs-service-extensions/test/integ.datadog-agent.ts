import { Mesh } from '@aws-cdk/aws-appmesh';
import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import { App, Stack } from '@aws-cdk/core';
import { AppMeshExtension, DatadogAgentExtension, Container, Environment, Service, ServiceDescription } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');

const mesh = new Mesh(stack, 'my-mesh');
const environment = new Environment(stack, 'production');

// Import a secret from the account.
const datadogApiKey = secretsManager.Secret.fromSecretName(stack, 'datadog-api-key-secret', 'datadog-api-key');

/** Name service */
const nameDescription = new ServiceDescription();
nameDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
}));
nameDescription.add(new DatadogAgentExtension({
  apmEnabled: true,
  traceAnalyticsEnabled: true,
  datadogApiKey: ecs.Secret.fromSecretsManager(datadogApiKey),
}));
nameDescription.add(new AppMeshExtension({ mesh }));

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
  image: ecs.ContainerImage.fromRegistry('nathanpeck/greeting'),
  environment: {
    PORT: '80',
  },
}));
greetingDescription.add(new DatadogAgentExtension({
  apmEnabled: true,
  traceAnalyticsEnabled: true,
  datadogApiKey: ecs.Secret.fromSecretsManager(datadogApiKey),
}));
greetingDescription.add(new AppMeshExtension({ mesh }));

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
  image: ecs.ContainerImage.fromRegistry('nathanpeck/greeter'),
  environment: {
    PORT: '80',
    GREETING_URL: 'http://greeting.production',
    NAME_URL: 'http://name.production',
  },
}));
greeterDescription.add(new DatadogAgentExtension({
  apmEnabled: true,
  traceAnalyticsEnabled: true,
  datadogApiKey: ecs.Secret.fromSecretsManager(datadogApiKey),
}));
greeterDescription.add(new AppMeshExtension({ mesh }));

const greeterService = new Service(stack, 'greeter', {
  environment: environment,
  serviceDescription: greeterDescription,
});

greeterService.connectTo(nameService);
greeterService.connectTo(greetingService);

/**
 *
 */