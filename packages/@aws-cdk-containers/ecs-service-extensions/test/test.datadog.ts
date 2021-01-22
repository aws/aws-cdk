import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { DatadogAgent, Container, Environment, Service, ServiceDescription } from '../lib';

export = {
  'should be able to add Datadog agent extension to a service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const SECRET_ARN = 'arn:aws:secretsmanager:us-west-2:209640446841:secret:datadog-api-key-secret-JxST1g';

    // Import a secret from the account.
    const datadogApiKey = secretsManager.Secret.fromSecretAttributes(stack, 'datadog-api-key-secret', {
      secretCompleteArn: SECRET_ARN,
    });

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromAsset('./test/test-apps/name'),
    }));

    serviceDescription.add(new DatadogAgent({
      apmEnabled: true,
      traceAnalyticsEnabled: true,
      datadogApiKey: ecs.Secret.fromSecretsManager(datadogApiKey),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'DD_TRACE_ANALYTICS_ENABLED',
              Value: 'true',
            },
            {
              Name: 'DD_SERVICE',
              Value: 'my-service',
            },
          ],
          Essential: true,
          Memory: 512,
          Name: 'app',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
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
              Name: 'DD_ENV',
              Value: 'production',
            },
            {
              Name: 'ECS_FARGATE',
              Value: 'true',
            },
            {
              Name: 'DD_APM_ENABLED',
              Value: 'true',
            },
            {
              Name: 'DD_APM_NON_LOCAL_TRAFFIC',
              Value: 'true',
            },
            {
              Name: 'DD_ECS_COLLECT_RESOURCE_TAGS_EC2',
              Value: 'true',
            },
          ],
          Essential: true,
          Image: 'public.ecr.aws/datadog/agent:7',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'myservicetaskdefinitiondatadogagentLogGroup7D034F5A',
              },
              'awslogs-stream-prefix': 'datadog-agent',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          MemoryReservation: 50,
          Name: 'datadog-agent',
          PortMappings: [
            {
              ContainerPort: 8126,
              Protocol: 'tcp',
            },
          ],
          Secrets: [
            {
              Name: 'DD_API_KEY',
              ValueFrom: 'arn:aws:secretsmanager:us-west-2:209640446841:secret:datadog-api-key-secret-JxST1g',
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