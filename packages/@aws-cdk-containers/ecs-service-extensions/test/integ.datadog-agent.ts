import { Mesh } from '@aws-cdk/aws-appmesh';
import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import { App, Stack } from '@aws-cdk/core';
import { AppMeshExtension, DatadogAgent, Container, Environment, HttpLoadBalancerExtension, Service, ServiceDescription } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const mesh = new Mesh(stack, 'my-mesh');
const environment = new Environment(stack, 'production');

// Substitute in your own secret when running the integration test
const SECRET_ARN = 'arn:aws:secretsmanager:us-west-2:209640446841:secret:datadog-api-key-secret-JxST1g';

// Import a secret from the account.
const datadogApiKey = secretsManager.Secret.fromSecretAttributes(stack, 'datadog-api-key-secret', {
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
    TEST_DATADOG: 'true',
  },
}));
nameDescription.add(new AppMeshExtension({ mesh }));
nameDescription.add(new DatadogAgent({
  apmEnabled: true,
  traceAnalyticsEnabled: true,
  datadogApiKey: ecs.Secret.fromSecretsManager(datadogApiKey),
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
    TEST_DATADOG: 'true',
  },
}));
greetingDescription.add(new AppMeshExtension({ mesh }));
greetingDescription.add(new DatadogAgent({
  apmEnabled: true,
  traceAnalyticsEnabled: true,
  datadogApiKey: ecs.Secret.fromSecretsManager(datadogApiKey),
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
    TEST_DATADOG: 'true',
    GREETING_URL: 'http://greeting.production',
    NAME_URL: 'http://name.production',
  },
}));
greeterDescription.add(new AppMeshExtension({ mesh }));
greeterDescription.add(new DatadogAgent({
  apmEnabled: true,
  traceAnalyticsEnabled: true,
  datadogApiKey: ecs.Secret.fromSecretsManager(datadogApiKey),
}));
greeterDescription.add(new HttpLoadBalancerExtension());

const greeterService = new Service(stack, 'greeter', {
  environment: environment,
  serviceDescription: greeterDescription,
});

greeterService.connectTo(nameService);
greeterService.connectTo(greetingService);

/**
 * 1. Create a Datadog account and get your Datadog API key
 * 2. Put the API key into Secret Manager, and change the SECRET_ARN env variable
 *    in this test to the right ARN
 * 3. Expectation is that when you deploy this stack you should see service metrics,
 *    and traces across all three services start showing up in DataDog.
 */
