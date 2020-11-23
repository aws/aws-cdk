import { expect, haveResource } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { NewRelicInfrastructureAgent, Container, Environment, Service, ServiceDescription } from '../lib';

export = {
  'should be able to add Newrelic agent extension to a service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const SECRET_ARN = 'arn:aws:secretsmanager:us-west-2:209640446841:secret:newrelic-license-key-secret-8KnPij';

    // Import a secret from the account.
    const newRelicLicenseKey = secretsManager.Secret.fromSecretAttributes(stack, 'newrelic-license-key-secret', {
      secretCompleteArn: SECRET_ARN,
    });

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    serviceDescription.add(new NewRelicInfrastructureAgent({
      apmEnabled: true,
      distributedTracingEnabled: true,
      newRelicLicenseKey: ecs.Secret.fromSecretsManager(newRelicLicenseKey),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          DependsOn: [
            {
              Condition: 'START',
              ContainerName: 'newrelic-infrastructure-agent',
            },
          ],
          Environment: [
            {
              Name: 'NEW_RELIC_NO_CONFIG_FILE',
              Value: 'true',
            },
            {
              Name: 'NEW_RELIC_APP_NAME',
              Value: 'my-service',
            },
            {
              Name: 'NEW_RELIC_LOG',
              Value: 'stdout',
            },
            {
              Name: 'NEW_RELIC_DISTRIBUTED_TRACING_ENABLED',
              Value: 'true',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          Memory: 512,
          Name: 'app',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
          Secrets: [
            {
              Name: 'NEW_RELIC_LICENSE_KEY',
              ValueFrom: 'arn:aws:secretsmanager:us-west-2:209640446841:secret:newrelic-license-key-secret-8KnPij',
            },
          ],
          Ulimits: [
            {
              HardLimit: 1024000,
              Name: 'nofile',
              SoftLimit: 1024000,
            },
          ],
        },
        {
          Environment: [
            {
              Name: 'NRIA_OVERRIDE_HOST_ROOT',
              Value: '',
            },
            {
              Name: 'NRIA_IS_SECURE_FORWARD_ONLY',
              Value: 'true',
            },
            {
              Name: 'FARGATE',
              Value: 'true',
            },
            {
              Name: 'ENABLE_NRI_ECS',
              Value: 'true',
            },
            {
              Name: 'NRIA_PASSTHROUGH_ENVIRONMENT',
              Value: 'ECS_CONTAINER_METADATA_URI,ENABLE_NRI_ECS,FARGATE',
            },
            {
              Name: 'NRIA_CUSTOM_ATTRIBUTES',
              Value: '{"nrDeployMethod":"ecs-service-extensions"}',
            },
          ],
          Essential: true,
          Image: 'newrelic/infrastructure-bundle:1.5.0',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'myservicetaskdefinitionnewrelicinfrastructureagentLogGroup3BA92671',
              },
              'awslogs-stream-prefix': 'newrelic-agent',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          MemoryReservation: 50,
          Name: 'newrelic-infrastructure-agent',
          Secrets: [
            {
              Name: 'NRIA_LICENSE_KEY',
              ValueFrom: 'arn:aws:secretsmanager:us-west-2:209640446841:secret:newrelic-license-key-secret-8KnPij',
            },
          ],
          User: '0:1338',
        },
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'myservicetaskdefinitionExecutionRole0CE74AD0',
          'Arn',
        ],
      },
      Family: 'myservicetaskdefinition',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'EC2',
        'FARGATE',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'myservicetaskdefinitionTaskRole92ACD903',
          'Arn',
        ],
      },
    }));

    test.done();
  },

};