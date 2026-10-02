import { StageDeployment } from './stage-deployment';
import type { StackSteps, Step } from './step';
import type * as cdk from '../../../core';

/**
 * The retry mode for a stage when it fails.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/stage-retry.html
 */
export enum RetryMode {
  /**
   * Retry all actions in the failed stage
   */
  ALL_ACTIONS = 'ALL_ACTIONS',

  /**
   * Retry only the failed actions in the stage
   */
  FAILED_ACTIONS = 'FAILED_ACTIONS',
}

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
   * Configure automatic retry on stage failure for this wave.
   *
   * When set, the corresponding CodePipeline stage will be configured
   * to automatically retry on failure with the specified mode.
   *
   * @default - No automatic retry on failure
   */
  readonly retryMode?: RetryMode;
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
   * The stages that are deployed in this wave
   */
  public readonly stages: StageDeployment[] = [];

  /**
   * The retry mode for the CodePipeline stage associated with this wave.
   *
   * @default - No automatic retry on failure
   */
  public readonly retryMode?: RetryMode;

  constructor(
    /** Identifier for this Wave */
    public readonly id: string, props: WaveProps = {}) {
    this.pre = props.pre ?? [];
    this.post = props.post ?? [];
    this.retryMode = props.retryMode;
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
   * Instructions for stack level steps
   *
   * @default - No additional instructions
   */
  readonly stackSteps?: StackSteps[];

  /**
   * Configure automatic retry on stage failure.
   *
   * When used with `pipeline.addStage()`, this configures the
   * CodePipeline stage for automatic retry on failure with the
   * specified mode. The retry mode is applied to the wave that
   * is implicitly created for the stage.
   *
   * When used with `wave.addStage()`, this property is ignored.
   * Use `retryMode` on `WaveOptions` instead when creating a wave
   * with `pipeline.addWave()`.
   *
   * @default - No automatic retry on failure
   */
  readonly retryMode?: RetryMode;
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
   * Configure automatic retry on stage failure for this wave.
   *
   * When set, the corresponding CodePipeline stage will be configured
   * to automatically retry on failure with the specified mode.
   *
   * @default - No automatic retry on failure
   */
  readonly retryMode?: RetryMode;
}
