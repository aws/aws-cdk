import { IResource, Resource, Stack } from 'aws-cdk-lib';
import { IRole, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { Construct } from 'constructs';
import { IEnrichment } from './enrichment';
import { IFilter } from './filter';
import { ILogDestination, IncludeExecutionData, LogLevel } from './logs';
import { ISource, SourceWithDeadLetterTarget } from './source';
import { ITarget } from './target';

/**
 * Interface representing a created or an imported `Pipe`.
 */
export interface IPipe extends IResource {
  /**
   * The name of the pipe.
   *
   * @attribute
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-name
   */
  readonly pipeName: string;

  /**
   * The ARN of the pipe.
   *
   * @attribute
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#Arn-fn::getatt
   */
  readonly pipeArn: string;

  /**
   * The role used by the pipe.
   * For imported pipes it assumes that the default role is used.
   *
   * @attribute
   */
  readonly pipeRole: IRole;

}

/**
 * The state the pipe should be in.
 */
export enum DesiredState {
  /**
   * The pipe should be running.
   */
  RUNNING = 'RUNNING',

  /**
   * The pipe should be stopped.
   * */
  STOPPED = 'STOPPED',
}

/**
 * Properties for a pipe.
 */
export interface PipeProps {
  /**
   * The source of the pipe.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-source.html
   */
  readonly source: ISource;

  /**
   * The filter pattern for the pipe source
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-filtering.html
   * @default - no filter
   */
  readonly filter?: IFilter;

  /**
  * Enrichment step to enhance the data from the source before sending it to the target.
  *
  * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/pipes-enrichment.html
  * @default - no enrichment
  */
  readonly enrichment?: IEnrichment;

  /**
   * The target of the pipe
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html
   */
  readonly target: ITarget;

  /**
  * Name of the pipe in the AWS console
  *
  * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-name
  *
  * @default - automatically generated name
  */
  readonly pipeName?: string;

  /**
   * The role used by the pipe which has permissions to read from the source and write to the target.
   * If an enriched target is used, the role also have permissions to call the enriched target.
   * If no role is provided, a role will be created.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-permissions.html
   * @default - a new role will be created.
   */
  readonly role?: IRole;

  /**
   * Destinations for the logs.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-logs.html
   * @default - no logs
   */
  readonly logDestinations?: ILogDestination[];

  /**
    * The level of logging detail to include.
    *
    * This applies to all log destinations for the pipe.
    *
    * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-logs.html
    * @default - LogLevel.ERROR
    */
  readonly logLevel?: LogLevel;

  /**
    * Whether the execution data (specifically, the `payload` , `awsRequest` , and `awsResponse` fields) is included in the log messages for this pipe.
    *
    * This applies to all log destinations for the pipe.
    *
    * For more information, see [Including execution data in logs](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-logs.html#eb-pipes-logs-execution-data) and the [message schema](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-logs-schema.html) in the *Amazon EventBridge User Guide* .
    *
    * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-includeexecutiondata
    * @default - none
    */
  readonly logIncludeExecutionData?: IncludeExecutionData[];

  /**
   * A description of the pipe displayed in the AWS console
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-description
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The desired state of the pipe. If the state is set to STOPPED, the pipe will not process events.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/pipes-reference/API_Pipe.html#eventbridge-Type-Pipe-DesiredState
   *
   * @default - DesiredState.RUNNING
   */
  readonly desiredState?: DesiredState;

  /**
   * The list of key-value pairs to associate with the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-tags
   *
   * @default - no tags
   */
  readonly tags?: {
    [key: string]: string;
  };
}

abstract class PipeBase extends Resource implements IPipe {
  public abstract readonly pipeName: string;
  public abstract readonly pipeArn: string;
  public abstract readonly pipeRole: IRole;

}

/**
 * An imported pipe.
 */
class ImportedPipe extends PipeBase {
  public readonly pipeName: string ;
  public readonly pipeArn: string;
  public readonly pipeRole: IRole;

  constructor(scope: Construct, id: string, pipeName: string) {
    super(scope, id);
    this.pipeName = pipeName;
    this.pipeArn = Stack.of(this).formatArn({
      service: 'pipes',
      partition: 'aws',
      resource: 'pipe',
      resourceName: this.pipeName,
    });
    this.pipeRole = Role.fromRoleName(this, 'Role', this.pipeName );
  }
}

/**
 * Amazon EventBridge Pipes connects sources to targets.
 *
 * Pipes are intended for point-to-point integrations between supported sources and targets,
 * with support for advanced transformations and enrichment.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html
 */
export class Pipe extends PipeBase {
  /**
   * Creates a pipe from the name of a pipe.
   */
  static fromPipeName(scope: Construct, id: string, pipeName: string): IPipe {

    return new ImportedPipe(scope, id, pipeName);
  }

  public readonly pipeName: string;
  public readonly pipeArn: string;
  public readonly pipeRole: IRole;

  constructor(scope: Construct, id: string, props: PipeProps) {

    super(scope, id, { physicalName: props.pipeName });

    /**
     * Role setup
     */
    this.pipeRole =
      props.role ||
      new Role(this, 'Role', {
        assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
      });

    /**
     * Source / Filter setup
     */
    const source = props.source.bind(this);
    props.source.grantRead(this.pipeRole);
    if (props.source instanceof SourceWithDeadLetterTarget) {
      props.source.grantPush(this.pipeRole, props.source.deadLetterTarget);
    }

    // Add the filter criteria to the source parameters
    const sourceParameters : CfnPipe.PipeSourceParametersProperty= {
      ...source.sourceParameters,
      filterCriteria: props.filter,
    };

    /**
     * Enrichment setup
     */
    const enrichment = props.enrichment?.bind(this);
    props.enrichment?.grantInvoke(this.pipeRole);

    /**
     * Target setup
     */
    const target = props.target.bind(this);
    props.target.grantPush(this.pipeRole);

    /**
     * Logs setup
     */
    const initialLogConfiguration: CfnPipe.PipeLogConfigurationProperty = {
      level: props.logLevel || LogLevel.ERROR,
      includeExecutionData: props.logIncludeExecutionData || undefined,
    };

    // Iterate over all the log destinations and add them to the log configuration
    const logConfiguration = props.logDestinations?.reduce((currentLogConfiguration, destination) => {
      const logDestinationConfig = destination.bind(this);
      destination.grantPush(this.pipeRole);
      const additionalLogConfiguration = logDestinationConfig.parameters;
      return { ...currentLogConfiguration, ...additionalLogConfiguration };
    }, initialLogConfiguration);

    /**
     * Pipe resource
     */

    const resource = new CfnPipe(this, 'Resource', {
      name: props.pipeName,
      description: props.description,
      roleArn: this.pipeRole.roleArn,
      source: props.source.sourceArn,
      sourceParameters: sourceParameters,
      enrichment: props.enrichment?.enrichmentArn,
      enrichmentParameters: enrichment?.enrichmentParameters,
      target: props.target.targetArn,
      targetParameters: target.targetParameters,
      desiredState: props.desiredState,
      logConfiguration: logConfiguration,
      tags: props.tags,
    });

    this.pipeName = resource.ref;
    this.pipeArn = resource.attrArn;
  }

}
