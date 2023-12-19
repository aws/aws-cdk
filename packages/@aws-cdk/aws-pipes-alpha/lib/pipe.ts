import { IResource, Resource } from 'aws-cdk-lib';
import { IRole, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { Construct } from 'constructs';
import { IPipeEnrichment } from './enrichment';
import { IPipeSource } from './source';
import { IPipeSourceFilter } from './sourceFilter';
import { IPipeTarget } from './target';

/**
 * Interface representing a created or an imported `Pipe`.
 */
export interface IPipe extends IResource {
  /**
 * The name of the pipe
 *
 * @attribute
 * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-name
 */
  readonly pipeName: string;

  /**
   * The ARN of the pipe
   *
   * @attribute
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#Arn-fn::getatt
   */
  readonly pipeArn: string;

  /**
   * The role used by the pipe
   *
   * @attribute
   */
  readonly pipeRole: IRole;

}

/**
 * Construction properties for `Pipe`.
 */
export interface PipeProps {
  /**
   * The name of the pipe.
   */
  readonly pipeName: string

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

export interface PipeProps {
  /**
   * The source of the pipe
   */
  readonly source: IPipeSource;
  /**
   * The filter pattern for the pipe source
   * @default - no filter
   */
  readonly filter?: IPipeSourceFilter;
  /**
  * Enrichment step to enhance the data from the source before sending it to the target.
  * @default - no enrichment
  */
  readonly enrichment?: IPipeEnrichment;
  /**
   * The target of the pipe
   */
  readonly target: IPipeTarget;
  /**
  * Name of the pipe in the AWS console
  *
  * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-name
  *
  * @default - automatically generated name
  */
  readonly name?: string;
  /**
   * The role used by the pipe which has permissions to read from the source and write to the target.
   * If an enriched target is used, the role also have permissions to call the enriched target.
   * If no role is provided, a role will be created.
   *
   * @default - a new role will be created.
   */
  readonly role?: IRole;
  /**
   * A description of the pipe displayed in the AWS console
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-description
   *
   * @default - no description
   */
  readonly description?: string;
  /**
   * The desired state of the pipe. If the state is set to STOPPED, the pipe will not process events.
   *
   * @link https://docs.aws.amazon.com/eventbridge/latest/pipes-reference/API_Pipe.html#eventbridge-Type-Pipe-DesiredState
   *
   * @default - DesiredState.RUNNING
   */
  readonly desiredState?: DesiredState;
  /**
   * `AWS::Pipes::Pipe.Tags`
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-tags
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
 * An EventBridge Pipe
*/
export class Pipe extends PipeBase {
  /**
   * Reference an existing pipe by ARN
   */
  public static fromPipeArn(scope: Construct, id: string, pipeArn: string): IPipe {
    // TODO implement fromPipeArn function
    throw Error(`Not implemented! ${scope} ${id} ${pipeArn}`);
  }

  public readonly pipeName: string;
  public readonly pipeArn: string;
  public readonly pipeRole: IRole;

  constructor(scope: Construct, id: string, props: PipeProps) {
    const pipeName =
      props.name;
    super(scope, id, { physicalName: pipeName });

    this.pipeRole =
      props.role ||
      new Role(this, 'Role', {
        assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
      });

    const sourceParameters = {
      ...props.source.sourceParameters,
      filterCriteria: props.filter,
    };
    if (props.enrichment) {
      props.enrichment.grantInvoke(this.pipeRole);
    }
    props.source.grantRead(this.pipeRole);
    props.target.grantPush(this.pipeRole);

    const resource = new CfnPipe(this, 'Resource', {
      name: props.name,
      description: props.description,
      roleArn: this.pipeRole.roleArn,
      source: props.source.sourceArn,
      sourceParameters: sourceParameters,
      enrichment: props.enrichment?.enrichmentArn,
      enrichmentParameters: props.enrichment?.enrichmentParameters,
      target: props.target.targetArn,
      targetParameters: props.target.targetParameters,
      desiredState: props.desiredState,
      tags: props.tags,
    });

    this.pipeName = resource.ref;
    this.pipeArn = resource.attrArn;

  }

}
