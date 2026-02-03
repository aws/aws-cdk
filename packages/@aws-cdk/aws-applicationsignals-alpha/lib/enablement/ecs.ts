import { Annotations } from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import * as constants from './constants';
import * as agent from './ecs-cloudwatch-agent';
import * as sdk from './ecs-sdk-instrumentation';
import * as inst from './instrumentation-versions';

/**
 * Interface for instrumentation properties.
 */
export interface InstrumentationProps {
  /**
   * The version of the instrumentation.
   */
  readonly sdkVersion: inst.InstrumentationVersion;
  /**
   * The runtime platform of the instrumentation.
   *
   * @default - the runtime platform specified through the input TaskDefinition.
   */
  readonly runtimePlatform?: ecs.RuntimePlatform;
}

/**
 * Interface for Application Signals properties.
 */
export interface ApplicationSignalsIntegrationProps {

  /**
   * The name of the service.
   *
   * @default - task definition family name
   */
  readonly serviceName?: string;

  /**
   * The task definition to integrate Application Signals into.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: ecs.TaskDefinition;

  /**
   * The instrumentation properties.
   */
  readonly instrumentation: InstrumentationProps;

  /**
   * The environment variables to override.
   *
   * @default - no environment variables to override.
   */
  readonly overrideEnvironments?: sdk.EnvironmentExtension[];

  /**
   * The CloudWatch Agent properties.
   *
   * @default - a basic agent sidecar container with latest public image
   */
  readonly cloudWatchAgentSidecar?: agent.CloudWatchAgentOptions;
}

/**
 * Class for integrating Application Signals into an ECS task definition.
 */
export class ApplicationSignalsIntegration extends Construct {
  private sdkInjector?: sdk.Injector;
  private mountVolumeName: string = 'opentelemetry-auto-instrumentation';
  private cloudWatchAgentSidecar?: agent.CloudWatchAgentOptions;

  constructor(
    scope: Construct,
    id: string,
    props: ApplicationSignalsIntegrationProps) {
    super(scope, id);
    this.cloudWatchAgentSidecar = props.cloudWatchAgentSidecar;

    let runtimePlatformObj = props.instrumentation.runtimePlatform ?? (props.taskDefinition as any).runtimePlatform;
    let cpuArch = ecs.CpuArchitecture.X86_64;
    let isWindows = false;

    if (runtimePlatformObj) {
      const runtimePlatform = runtimePlatformObj as ecs.RuntimePlatform;
      if (runtimePlatform.operatingSystemFamily) {
        isWindows = runtimePlatform.operatingSystemFamily.isWindows();
        if (runtimePlatform.cpuArchitecture) {
          cpuArch = runtimePlatform.cpuArchitecture;
        }
      }
    }

    const overrideEnvironments = [];
    if (props.serviceName) {
      // If service.name is also provided in OTEL_RESOURCE_ATTRIBUTES, then OTEL_SERVICE_NAME takes precedence.
      overrideEnvironments.push({
        name: constants.CommonExporting.OTEL_SERVICE_NAME,
        value: props.serviceName,
      });
    }
    overrideEnvironments.push(...props.overrideEnvironments ?? []);

    if (props.instrumentation.sdkVersion instanceof inst.JavaInstrumentationVersion) {
      this.sdkInjector = new sdk.JavaInjector(
        this.mountVolumeName,
        props.instrumentation.sdkVersion,
        overrideEnvironments,
      );
    } else if (props.instrumentation.sdkVersion instanceof inst.PythonInstrumentationVersion) {
      this.sdkInjector = new sdk.PythonInjector(
        this.mountVolumeName,
        props.instrumentation.sdkVersion,
        overrideEnvironments,
      );
    } else if (props.instrumentation.sdkVersion instanceof inst.DotnetInstrumentationVersion) {
      if (isWindows) {
        this.sdkInjector = new sdk.DotNetWindowsInjector(
          this.mountVolumeName,
          props.instrumentation.sdkVersion,
          overrideEnvironments,
        );
      } else {
        this.sdkInjector = new sdk.DotNetLinuxInjector(
          this.mountVolumeName,
          props.instrumentation.sdkVersion,
          cpuArch,
          overrideEnvironments,
        );
      }
    } else if (props.instrumentation.sdkVersion instanceof inst.NodeInstrumentationVersion) {
      this.sdkInjector = new sdk.NodeInjector(
        this.mountVolumeName,
        props.instrumentation.sdkVersion,
        overrideEnvironments,
      );
    }

    this.mutateTaskDefinition(props.taskDefinition);
  }

  private mutateTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    taskDefinition.addVolume({
      name: this.mountVolumeName,
    });

    let defaultContainer = taskDefinition.defaultContainer!;
    if (this.sdkInjector) {
      this.sdkInjector.renderDefaultContainer(taskDefinition);
      let initContainer = this.sdkInjector.injectInitContainer(taskDefinition);
      defaultContainer.addContainerDependencies({
        container: initContainer,
        condition: ecs.ContainerDependencyCondition.SUCCESS,
      });
    }

    if (this.cloudWatchAgentSidecar) {
      const cloudWatchAgent = new agent.CloudWatchAgentIntegration(this, 'CloudWatchAgentSidecar',
        {
          taskDefinition: taskDefinition,
          ...this.cloudWatchAgentSidecar,
        },
      );
      defaultContainer.addContainerDependencies({
        container: cloudWatchAgent.agentContainer,
        condition: ecs.ContainerDependencyCondition.START,
      });
    } else {
      Annotations.of(this).addWarningV2(this.node.id, ' Application Signals functionality requires prior deployment of the CloudWatch Agent with appropriate security group settings. Missing or incorrect configurations will prevent successful collection of observability data.');
    }
  }
}
