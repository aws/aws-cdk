import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import { Service } from '../service';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';
import { Construct } from '@aws-cdk/core';

const AWS_OPEN_TELEMETRY = 'amazon/aws-otel-collector:latest';

interface OpenTelemetryConfigProps {
  serviceName: string,
}

// This helper function generates an open telemetry config
function generateOpenTelemetryConfig(props: OpenTelemetryConfigProps) {
  return `
  extensions:
    health_check:

  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:55680
        http:
          endpoint: 0.0.0.0:55681
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
    filter:
      metrics:
        include:
          match_type: strict
          metric_names:
            - ecs.task.memory.reserved
            - ecs.task.memory.utilized
            - ecs.task.cpu.reserved
            - ecs.task.cpu.utilized
            - ecs.task.network.rate.rx
            - ecs.task.network.rate.tx
            - ecs.task.storage.read_bytes
            - ecs.task.storage.write_bytes
    metricstransform:
      transforms:
        - metric_name: ecs.task.memory.utilized
          action: update
          new_name: MemoryUtilized
        - metric_name: ecs.task.memory.reserved
          action: update
          new_name: MemoryReserved
        - metric_name: ecs.task.cpu.utilized
          action: update
          new_name: CpuUtilized
        - metric_name: ecs.task.cpu.reserved
          action: update
          new_name: CpuReserved
        - metric_name: ecs.task.network.rate.rx
          action: update
          new_name: NetworkRxBytes
        - metric_name: ecs.task.network.rate.tx
          action: update
          new_name: NetworkTxBytes
        - metric_name: ecs.task.storage.read_bytes
          action: update
          new_name: StorageReadBytes
        - metric_name: ecs.task.storage.write_bytes
          action: update
          new_name: StorageWriteBytes
    resource:
      attributes:
        - key: ClusterName
          from_attribute: aws.ecs.cluster.name
          action: insert
        - key: aws.ecs.cluster.name
          action: delete
        - key: ServiceName
          from_attribute: aws.ecs.service.name
          action: insert
        - key: ServiceName
          action: update
          value: ${props.serviceName}
        - key: aws.ecs.service.name
          action: delete
        - key: TaskId
          from_attribute: aws.ecs.task.id
          action: insert
        - key: aws.ecs.task.id
          action: delete
        - key: TaskDefinitionFamily
          from_attribute: aws.ecs.task.family
          action: insert
        - key: aws.ecs.task.family
          action: delete
  exporters:
    awsxray:
    awsemf/application:
      log_group_name: 'aws/ecs/containerinsights/{ClusterName}/application/metrics'
      log_stream_name: '{TaskId}'
    awsemf/performance:
      namespace: ECS/ContainerInsights
      log_group_name: '/aws/ecs/containerinsights/{ClusterName}/performance'
      log_stream_name: '{TaskId}'
      resource_to_telemetry_conversion:
        enabled: true
      dimension_rollup_option: NoDimensionRollup
      metric_declarations:
        dimensions: [ [ ClusterName ], [ ClusterName, TaskDefinitionFamily ], [ ClusterName, ServiceName ] ]
        metric_name_selectors: [ . ]
  service:
    pipelines:
      traces:
        receivers: [otlp,awsxray]
        processors: [batch/traces]
        exporters: [awsxray]
      metrics/application:
        receivers: [otlp]
        processors: [batch/metrics]
        exporters: [awsemf/application]
      metrics/performance:
        receivers: [awsecscontainermetrics ]
        processors: [filter, metricstransform, resource]
        exporters: [ awsemf/performance ]

    extensions: [health_check]
  `;
}

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
  private config?: ssm.IParameter;

  constructor() {
    super('open-telemetry');
  }

  public prehook(service: Service, scope: Construct) {
    this.parentService = service;
    this.scope = scope;

    // This SSM parameter is used to vend config to the OpenTelemetry collector
    this.config = new ssm.StringParameter(scope, `${this.parentService.id}-open-telemetry-config`, {
      stringValue: generateOpenTelemetryConfig({
        serviceName: this.parentService.id,
      }),
    });
  }

  // This hook adds and configures the Open Telemetry collector in the task definition
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    if (!this.config) {
      throw new Error('The task definition hook can not be called until the prehook has created the SSM parameter');
    }

    // Add the open telemetry container
    this.container = taskDefinition.addContainer('open-telemetry-collector', {
      image: ecs.ContainerImage.fromRegistry(AWS_OPEN_TELEMETRY),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'open-telemetry-collector' }),
      //command: ['--log-level=DEBUG'],
      user: '0:1338', // Ensure that collector's outbound traffic doesn't go through proxy
      secrets: {
        AOT_CONFIG_CONTENT: ecs.Secret.fromSsmParameter(this.config),
      },
      memoryReservationMiB: 50,
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