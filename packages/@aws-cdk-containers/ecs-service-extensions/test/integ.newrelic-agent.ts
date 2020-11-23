import { Mesh, MeshFilterType } from '@aws-cdk/aws-appmesh';
import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import { App, Stack } from '@aws-cdk/core';
import { AppMeshExtension, CloudWatchLogsExtension, NewRelicInfrastructureAgent, Container, Environment, HttpLoadBalancerExtension, Service, ServiceDescription } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const mesh = new Mesh(stack, 'my-mesh', {
  // This is necessary because the New Relic agent runs
  // inside the application container, and needs to talk outbound
  // to New Relic
  egressFilter: MeshFilterType.ALLOW_ALL,
});
const environment = new Environment(stack, 'production');

// Substitute in your own secret when running the integration test
const SECRET_ARN = 'arn:aws:secretsmanager:us-west-2:209640446841:secret:newrelic-license-key-secret-8KnPij';

// Import a secret from the account.
const newRelicLicenseKey = secretsManager.Secret.fromSecretAttributes(stack, 'newrelic-license-key-secret', {
  secretCompleteArn: SECRET_ARN,
});

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
nameDescription.add(new AppMeshExtension({ mesh }));
nameDescription.add(new CloudWatchLogsExtension());
nameDescription.add(new NewRelicInfrastructureAgent({
  apmEnabled: true,
  distributedTracingEnabled: true,
  newRelicLicenseKey: ecs.Secret.fromSecretsManager(newRelicLicenseKey),
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
    TEST_NEWRELIC: 'true',
  },
}));
greetingDescription.add(new AppMeshExtension({ mesh }));
greetingDescription.add(new CloudWatchLogsExtension());
greetingDescription.add(new NewRelicInfrastructureAgent({
  apmEnabled: true,
  distributedTracingEnabled: true,
  newRelicLicenseKey: ecs.Secret.fromSecretsManager(newRelicLicenseKey),
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
    TEST_NEWRELIC: 'true',
    GREETING_URL: 'http://greeting.production',
    NAME_URL: 'http://name.production',
  },
}));
greeterDescription.add(new AppMeshExtension({ mesh }));
greeterDescription.add(new CloudWatchLogsExtension());
greeterDescription.add(new NewRelicInfrastructureAgent({
  apmEnabled: true,
  distributedTracingEnabled: true,
  newRelicLicenseKey: ecs.Secret.fromSecretsManager(newRelicLicenseKey),
}));
greeterDescription.add(new HttpLoadBalancerExtension());

const greeterService = new Service(stack, 'greeter', {
  environment: environment,
  serviceDescription: greeterDescription,
});

greeterService.connectTo(nameService);
greeterService.connectTo(greetingService);

/**
 * 1. Create a New Relic account and get your New Relic license key
 * 2. Put the license key into Secret Manager, and change the SECRET_ARN env variable
 *    in this test to the right ARN
 * 3. Expectation is that when you deploy this stack you should see infrastructure
 *    metrics and service APM metrics flowing into New Relic
 */