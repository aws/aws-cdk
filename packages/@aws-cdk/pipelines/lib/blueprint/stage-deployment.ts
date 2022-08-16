import * as cdk from '@aws-cdk/core';
import { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { isStackArtifact } from '../private/cloud-assembly-internals';
import { pipelineSynth } from '../private/construct-internals';
import { StackDeployment } from './stack-deployment';
import { StackSteps, Step } from './step';

/**
 * Properties to define if stack has specific prepare setting
 */
export interface StackDeploymentPrepareProps {
  /**
   * Name of the stack having specific prepare setting.
   *
   * Normally in format `<stage id>-<stack id>`.
   */
  readonly stackName: string;
  /**
   * Add a "prepare" step for stack which can be used to create the change
   * set. If this is disabled, only the "execute" step will be included.
   *
   * @default - use value from stage
   */
  readonly prepareStep: boolean;
}

/**
 * Properties for a `StageDeployment`
 */
export interface StageDeploymentProps {
  /**
   * Stage name to use in the pipeline
   *
   * @default - Use Stage's construct ID
   */
  readonly stageName?: string;

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
   * Instructions for additional steps that are run at the stack level
   *
   * @default - No additional instructions
   */
  readonly stackSteps?: StackSteps[];

  /**
   * Add a "prepare" step for each stack which can be used to create the change
   * set. If this is disabled, only the "execute" step will be included.
   *
   * @default - use value from pipeline
   */
  readonly prepareStep?: boolean;

  /**
   * Define need to have prepare step in stacks inside stage. If no special
   * handling added, uses one from stage.
   *
   * @default - use value from stage
   */
  readonly prepareStepForStacks?: StackDeploymentPrepareProps[];
}

/**
 * Deployment of a single `Stage`
 *
 * A `Stage` consists of one or more `Stacks`, which will be
 * deployed in dependency order.
 */
export class StageDeployment {
  /**
   * Create a new `StageDeployment` from a `Stage`
   *
   * Synthesizes the target stage, and deployes the stacks found inside
   * in dependency order.
   */
  public static fromStage(stage: cdk.Stage, props: StageDeploymentProps = {}) {
    const assembly = pipelineSynth(stage);
    if (assembly.stacks.length === 0) {
      // If we don't check here, a more puzzling "stage contains no actions"
      // error will be thrown come deployment time.
      throw new Error(`The given Stage construct ('${stage.node.path}') should contain at least one Stack`);
    }

    const stepFromArtifact = new Map<CloudFormationStackArtifact, StackDeployment>();
    for (const artifact of assembly.stacks) {
      const step = StackDeployment.fromArtifact(artifact);
      stepFromArtifact.set(artifact, step);
    }
    if (props.stackSteps) {
      for (const stackstep of props.stackSteps) {
        const stackArtifact = assembly.getStackArtifact(stackstep.stack.artifactId);
        const thisStep = stepFromArtifact.get(stackArtifact);
        if (!thisStep) {
          throw new Error('Logic error: we just added a step for this artifact but it disappeared.');
        }
        thisStep.addStackSteps(stackstep.pre ?? [], stackstep.changeSet ?? [], stackstep.post ?? []);
      }
    }

    for (const artifact of assembly.stacks) {
      const thisStep = stepFromArtifact.get(artifact);
      if (!thisStep) {
        throw new Error('Logic error: we just added a step for this artifact but it disappeared.');
      }

      const stackDependencies = artifact.dependencies.filter(isStackArtifact);
      for (const dep of stackDependencies) {
        const depStep = stepFromArtifact.get(dep);
        if (!depStep) {
          throw new Error(`Stack '${artifact.id}' depends on stack not found in same Stage: '${dep.id}'`);
        }
        thisStep.addStackDependency(depStep);
      }
    }

    return new StageDeployment(Array.from(stepFromArtifact.values()), {
      stageName: stage.stageName,
      ...props,
    });
  }

  /**
   * The display name of this stage
   */
  public readonly stageName: string;

  /**
   * Additional steps that are run before any of the stacks in the stage
   */
  public readonly pre: Step[];

  /**
   * Additional steps that are run after all of the stacks in the stage
   */
  public readonly post: Step[];

  /**
   * Instructions for additional steps that are run at stack level
   */
  public readonly stackSteps: StackSteps[];

  /**
   * Determine if all stacks in stage should be deployed with prepare
   * step or not.
   */
  public readonly prepareStep?: boolean;

  /**
   * Stack specific deployment options
   */
  public readonly prepareStepForStacks?: StackDeploymentPrepareProps[];

  private constructor(
    /** The stacks deployed in this stage */
    public readonly stacks: StackDeployment[], props: StageDeploymentProps = {}) {
    this.stageName = props.stageName ?? '';
    this.pre = props.pre ?? [];
    this.post = props.post ?? [];
    this.stackSteps = props.stackSteps ?? [];
    this.prepareStep = props.prepareStep;
    this.prepareStepForStacks = props.prepareStepForStacks;
  }

  /**
   * Add an additional step to run before any of the stacks in this stage
   */
  public addPre(...steps: Step[]) {
    this.pre.push(...steps);
  }

  /**
   * Add an additional step to run after all of the stacks in this stage
   */
  public addPost(...steps: Step[]) {
    this.post.push(...steps);
  }
}