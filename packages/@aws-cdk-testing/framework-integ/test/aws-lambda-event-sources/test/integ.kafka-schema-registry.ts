import { TestFunction } from './test-function';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  SelfManagedKafkaEventSource,
  AuthenticationMethod,
  GlueSchemaRegistry,
  ConfluentSchemaRegistry,
} from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, StackProps, Stack, SecretValue } from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { CfnRegistry } from 'aws-cdk-lib/aws-glue';

// Self-Managed Kafka Stack with Schema Registry
export class SmkGlueSchemaRegistryStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a Lambda function
    const testLambdaFunction = new TestFunction(this, 'GlueFunction');

    // Create dummy certificates for authentication
    const dummyCertString = `-----BEGIN CERTIFICATE-----
    MIIE5DCCAsygAwIBAgIRAPJdwaFaNRrytHBto0j5BA0wDQYJKoZIhvcNAQELBQAw
    cmUuiAii9R0=
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
    MIIFgjCCA2qgAwIBAgIQdjNZd6uFf9hbNC5RdfmHrzANBgkqhkiG9w0BAQsFADBb
    c8PH3PSoAaRwMMgOSA2ALJvbRz8mpg==
    -----END CERTIFICATE-----"
    `;

    const dummyPrivateKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
    zp2mwJn2NYB7AZ7+imp0azDZb+8YG2aUCiyqb6PnnA==
    -----END ENCRYPTED PRIVATE KEY-----`;

    // Create secrets for Kafka authentication
    const rootCASecret = new secretsmanager.Secret(this, 'GlueRootCASecret', {
      secretObjectValue: {
        certificate: SecretValue.unsafePlainText(dummyCertString),
      },
    });

    const clientCertificatesSecret = new secretsmanager.Secret(this, 'GlueClientCertSecret', {
      secretObjectValue: {
        certificate: SecretValue.unsafePlainText(dummyCertString),
        privateKey: SecretValue.unsafePlainText(dummyPrivateKey),
      },
    });

    // Grant read permissions to the Lambda function
    rootCASecret.grantRead(testLambdaFunction);
    clientCertificatesSecret.grantRead(testLambdaFunction);

    // Create a Glue Schema Registry
    const glueRegistry = new CfnRegistry(this, 'SchemaRegistry', {
      name: 'smk-glue-test-schema-registry',
      description: 'Schema registry for SMK integration tests',
    });

    // Define Kafka bootstrap servers
    const bootstrapServers = [
      'kafka-broker-1:9092',
      'kafka-broker-2:9092',
      'kafka-broker-3:9092',
    ];

    // Common configuration for SMK event sources
    const commonConfig = {
      bootstrapServers,
      secret: clientCertificatesSecret,
      authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
      rootCACertificate: rootCASecret,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
    };

    // SMK with Glue Schema Registry
    testLambdaFunction.addEventSource(new SelfManagedKafkaEventSource({
      ...commonConfig,
      topic: 'test-topic-smk-glue',
      consumerGroupId: 'test-consumer-group-smk-glue',
      provisionedPollerConfig: {
        minimumPollers: 1,
        maximumPollers: 3,
      },
      schemaRegistryConfig: new GlueSchemaRegistry({
        schemaRegistry: glueRegistry,
        eventRecordFormat: lambda.EventRecordFormat.JSON,
        schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
      }),
    }));
  }
}

// Self-Managed Kafka Stack with Schema Registry
export class SmkConfluentSchemaRegistryStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a Lambda function
    const testLambdaFunction = new TestFunction(this, 'ConfluentFunction');

    // Create dummy certificates for authentication
    const dummyCertString = `-----BEGIN CERTIFICATE-----
    MIIE5DCCAsygAwIBAgIRAPJdwaFaNRrytHBto0j5BA0wDQYJKoZIhvcNAQELBQAw
    cmUuiAii9R0=
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
    MIIFgjCCA2qgAwIBAgIQdjNZd6uFf9hbNC5RdfmHrzANBgkqhkiG9w0BAQsFADBb
    c8PH3PSoAaRwMMgOSA2ALJvbRz8mpg==
    -----END CERTIFICATE-----"
    `;

    const dummyPrivateKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
    zp2mwJn2NYB7AZ7+imp0azDZb+8YG2aUCiyqb6PnnA==
    -----END ENCRYPTED PRIVATE KEY-----`;

    // Create secrets for Kafka authentication
    const rootCASecret = new secretsmanager.Secret(this, 'ConfluentRootCASecret', {
      secretObjectValue: {
        certificate: SecretValue.unsafePlainText(dummyCertString),
      },
    });

    const clientCertificatesSecret = new secretsmanager.Secret(this, 'ConfluentClientCertSecret', {
      secretObjectValue: {
        certificate: SecretValue.unsafePlainText(dummyCertString),
        privateKey: SecretValue.unsafePlainText(dummyPrivateKey),
      },
    });

    // Grant read permissions to the Lambda function
    rootCASecret.grantRead(testLambdaFunction);
    clientCertificatesSecret.grantRead(testLambdaFunction);

    // Define Kafka bootstrap servers
    const bootstrapServers = [
      'kafka-broker-1:9092',
      'kafka-broker-2:9092',
      'kafka-broker-3:9092',
    ];

    // Common configuration for SMK event sources
    const commonConfig = {
      bootstrapServers,
      secret: clientCertificatesSecret,
      authenticationMethod: AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH,
      rootCACertificate: rootCASecret,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
    };

    // SMK with Confluent Schema Registry
    testLambdaFunction.addEventSource(new SelfManagedKafkaEventSource({
      ...commonConfig,
      topic: 'test-topic-smk-confluent',
      consumerGroupId: 'test-consumer-group-smk-confluent',
      provisionedPollerConfig: {
        minimumPollers: 1,
        maximumPollers: 3,
      },
      schemaRegistryConfig: new ConfluentSchemaRegistry({
        schemaRegistryUri: 'https://schema-registry.example.com',
        eventRecordFormat: lambda.EventRecordFormat.JSON,
        authenticationType: lambda.KafkaSchemaRegistryAccessConfigType.BASIC_AUTH,
        secret: clientCertificatesSecret,
        schemaValidationConfigs: [{ attribute: lambda.KafkaSchemaValidationAttribute.KEY }],
      }),
    }));
  }
}

// Create the app and stacks
const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const glueStack = new SmkGlueSchemaRegistryStack(app, 'lambda-event-source-glue-schema-registry');
const confluentStack = new SmkConfluentSchemaRegistryStack(app, 'lambda-event-source-confluent-schema-registry');

// Create the integration tests
new IntegTest(app, 'SchemaRegistryInteg', {
  testCases: [glueStack, confluentStack],
});

app.synth();
