import { StageDeployment } from './stage-deployment';
import { StackSteps, Step } from './step';
import * as cdk from '../../../core';

/**
 * Construction properties for a `Wave`
 */
export interface WaveProps {
  /**
   * Additional steps to run before any of the stages in the wave
   *
   * @default - No additional steps
   */
  readonly pre?: Step[];

  /**
   * Additional steps to run after all of the stages in the wave
   *
   * @default - No additional steps
   */
  readonly post?: Step[];

  /**
   * Additional steps to run after all of the prepare-nodes in the stage. If this property is set allPrepareNodesFirst has to be set to true also. This is the case, because dependency cycle will occour otherwise.
   *
   * @default - No additional steps
   */
  readonly postPrepare?: Step[];

}

/**
 * Multiple stages that are deployed in parallel
 */
export class Wave {
  /**
   * Additional steps that are run before any of the stages in the wave
   */
  public readonly pre: Step[];

  /**
   * Additional steps that are run after all of the stages in the wave
   */
  public readonly post: Step[];

  /**
   * Additional steps to run after all of the prepare-nodes in the stage. If this property is set allPrepareNodesFirst has to be set to true also. This is the case, because dependency cycle will occour otherwise.
   *
   */
  public readonly postPrepare: Step[];

  /**
   * The stages that are deployed in this wave
   */
  public readonly stages: StageDeployment[] = [];

  constructor(
    /** Identifier for this Wave */
    public readonly id: string,
    props: WaveProps = {},
  ) {
    this.pre = props.pre ?? [];
    this.post = props.post ?? [];
    this.postPrepare = props.postPrepare ?? [];

  }

  /**
   * Add a Stage to this wave
   *
   * It will be deployed in parallel with all other stages in this
   * wave.
   */
  public addStage(stage: cdk.Stage, options: AddStageOpts = {}) {
    const ret = StageDeployment.fromStage(stage, options);
    this.stages.push(ret);
    return ret;
  }

  /**
   * Add an additional step to run before any of the stages in this wave
   */
  public addPre(...steps: Step[]) {
    this.pre.push(...steps);
  }

  /**
   * Add an additional step to run after all of the stages in this wave
   */
  public addPost(...steps: Step[]) {
    this.post.push(...steps);
  }

  /**
   * Add an additional step to run after all of the stacks in this stage
   */
  public addPostPrepare(...steps: Step[]) {
    this.postPrepare.push(...steps);
  }
}

/**
 * Options to pass to `addStage`
 */
export interface AddStageOpts {
  /**
   * Additional steps to run before any of the stacks in the stage
   *
   * @default - No additional steps
   */
  readonly pre?: Step[];

  /**
   * Additional steps to run after all of the stacks in the stage
   *
   * @default - No additional steps
   */
  readonly post?: Step[];

  /**
   * Additional steps to run after all of the prepare-nodes in the stage. If this property is set allPrepareNodesFirst has to be set to true also. This is the case, because dependency cycle will occour otherwise.
   *
   * @default - No additional steps
   */
  readonly postPrepare?: Step[];

  /**
   * Instructions for stack level steps
   *
   * @default - No additional instructions
   */
  readonly stackSteps?: StackSteps[];

}

/**
 * Options to pass to `addWave`
 */
export interface WaveOptions {
  /**
   * Additional steps to run before any of the stages in the wave
   *
   * @default - No additional steps
   */
  readonly pre?: Step[];

  /**
   * Additional steps to run after all of the stages in the wave
   *
   * @default - No additional steps
   */
  readonly post?: Step[];

  /**
   * Additional steps to run after all of the prepare-nodes in the stage
   *
   * @default - No additional steps
   */
  readonly postPrepare?: Step[];

}