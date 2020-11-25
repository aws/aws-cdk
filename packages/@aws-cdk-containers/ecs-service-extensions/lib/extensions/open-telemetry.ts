import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';

const AWS_OPEN_TELEMETRY = 'amazon/aws-otel-collector:latest';

const OPEN_TELEMETRY_CONFIG = `
extensions:
  health_check:

receivers:
  otlp:
    protocols:
      grpc:
        endpoint: localhost:55680
      http:
        endpoint: localhost:55681
  awsxray:
    endpoint: 0.0.0.0:2000
    transport: udp
  awsecscontainermetrics:

processors:
  batch/traces:
    timeout: 1s
    send_batch_size: 50
  batch/metrics:
    timeout: 60s

exporters:
  awsxray:
  awsemf:

service:
  pipelines:
    traces:
      receivers: [otlp,awsxray]
      processors: [batch/traces]
      exporters: [awsxray]
    metrics:
      receivers: [otlp, awsecscontainermetrics]
      processors: [batch/metrics]
      exporters: [awsemf]

  extensions: [health_check]
`;

/**
 * Settings for the main application container
 */
export interface OpenTelemetryProps {

}

/**
 * This hook modifies the application container's settings for the
 * Open Telemetry collector
 */
export class OpenTelemetryMutatingHook extends ContainerMutatingHook {
  constructor() {
    super();
  }

  // Modify the environment variables for the primary container
  // so that the open telemetry SDK in the main application container
  // can communicate to the open telemetry collector
  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions) {
    let environment = props.environment || {};

    return {
      ...props,
      environment,
    } as ecs.ContainerDefinitionOptions;
  }
}

/**
 * Settings for the Open Telemetry collector
 **/
export interface OpenTelemetryCollectorProps {

}

/**
 * This extension adds an AWS Distro for OpenTelemetry collector to the ECS task
 * according to the instructions here: https://aws-otel.github.io/docs/setup/ecs
 */
export class OpenTelemetryCollector extends ServiceExtension {
  private configContainer?: ecs.ContainerDefinition;

  constructor() {
    super('open-telemetry');
  }

  public prehook(service: Service, scope: cdk.Construct) {
    this.parentService = service;
    this.scope = scope;
  }

  // This hook adds and configures the Open Telemetry collector in the task definition
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    // A scratch space volume for storing the open telemetry config
    taskDefinition.addVolume({
      name: 'open-telemetry-config',
    });

    // Add a configuration writer container that generates the config file
    this.configContainer = taskDefinition.addContainer('open-telemetry-config-writer', {
      image: ecs.ContainerImage.fromRegistry('busybox'),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'open-telemetry-config-writer' }),
      entryPoint: ['/bin/sh', '-c'],
      command: [`echo "${OPEN_TELEMETRY_CONFIG}" > /var/scratch/open-telemetry-config.yml && cat /var/scratch/open-telemetry-config.yml`],
      memoryLimitMiB: 50,
      essential: false,
    });

    // Mount the shared config volume so that the config writer can write to it
    this.configContainer.addMountPoints({
      containerPath: '/var/scratch',
      readOnly: false,
      sourceVolume: 'open-telemetry-config',
    });

    // Add the open telemetry container
    this.container = taskDefinition.addContainer('open-telemetry-collector', {
      image: ecs.ContainerImage.fromRegistry(AWS_OPEN_TELEMETRY),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'open-telemetry-collector' }),
      command: ['--config=/var/scratch/open-telemetry-config.yml', '--log-level=DEBUG'],
      user: '0:1338', // Ensure that collector's outbound traffic doesn't go through proxy
      memoryReservationMiB: 50,
    });

    /*// Add a debug container to see if the content is available
    this.container = taskDefinition.addContainer('open-telemetry-config-reader', {
      image: ecs.ContainerImage.fromRegistry('busybox'),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'open-telemetry-config-reader' }),
      entryPoint: ['/bin/sh', '-c'],
      command: ['ls /var/scratch'],
      memoryLimitMiB: 50,
      essential: false,
    });*/

    // Mount the shared config volume so that the open telemetry collector
    // can read the config
    this.container.addMountPoints({
      containerPath: '/var/scratch',
      readOnly: false,
      sourceVolume: 'open-telemetry-config',
    });

    // Make sure that the open telemetry collector waits for the config
    // writer to complete writingfirst.
    this.container.addContainerDependencies({
      container: this.configContainer,
      condition: ecs.ContainerDependencyCondition.SUCCESS,
    });

    // Allow other containers to talk to the collector on port 55680
    this.container.addPortMappings({
      protocol: ecs.Protocol.TCP,
      containerPort: 55680,
    });

    // Modify the task definition role to allow the collector to communicate to
    // CloudWatch and X-Ray. IAM policy recommendation taken from here:
    // https://aws-otel.github.io/docs/setup/permissions
    new iam.Policy(this.scope, `${this.parentService.id}-open-telemetry`, {
      roles: [taskDefinition.taskRole],
      statements: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: [
            'logs:PutLogEvents',
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:DescribeLogStreams',
            'logs:DescribeLogGroups',
            'xray:PutTraceSegments',
            'xray:PutTelemetryRecords',
            'xray:GetSamplingRules',
            'xray:GetSamplingTargets',
            'xray:GetSamplingStatisticSummaries',
          ],
        }),
      ],
    });
  }
}