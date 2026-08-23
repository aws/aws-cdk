import { StackDeployment } from './stack-deployment';
import type { StackSteps, Step } from './step';
import type * as cdk from '../../../core';
import { ValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { CloudFormationStackArtifact } from '../../../cx-api';
import { isStackArtifact } from '../private/cloud-assembly-internals';
import { pipelineSynth } from '../private/construct-internals';

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
   * Additional steps to run once every stack in this stage has had its change
   * set prepared, and before any stack in this stage is deployed.
   *
   * All steps given here run as a single dependency barrier: every stack's
   * "Prepare" action in this stage must complete before any of them starts,
   * and every stack's "Deploy" action waits for all of them to complete.
   * Multiple steps given here run in parallel with each other (use
   * `Step.sequence()` if you need them to run in order).
   *
   * This only works for stages whose stacks have no dependencies on each
   * other. If any two stacks in the stage depend on each other, a validation
   * error is thrown, because a dependent stack's change set cannot be
   * computed before its dependency has been deployed.
   *
   * Requires change sets to be enabled (`useChangeSets: true`, the default).
   *
   * @default - No additional steps
   */
  readonly deployGate?: Step[];

  /**
   * Instructions for additional steps that are run at the stack level
   *
   * @default - No additional instructions
   */
  readonly stackSteps?: StackSteps[];
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
      throw new ValidationError(lit`GivenStageConstruct`, `The given Stage construct ('${stage.node.path}') should contain at least one Stack`, stage);
    }

    const stepFromArtifact = new Map<CloudFormationStackArtifact, StackDeployment>();
    for (const artifact of assembly.stacks) {
      if (artifact.assumeRoleAdditionalOptions?.Tags && artifact.assumeRoleArn) {
        throw new ValidationError(lit`DeploymentStack`, `Deployment of stack ${artifact.stackName} requires assuming the role ${artifact.assumeRoleArn} with session tags, but assuming roles with session tags is not supported by CodePipeline.`, stage);
      }
      const step = StackDeployment.fromArtifact(artifact);
      stepFromArtifact.set(artifact, step);
    }
    if (props.stackSteps) {
      for (const stackstep of props.stackSteps) {
        const stackArtifact = assembly.getStackArtifact(stackstep.stack.artifactId);
        const thisStep = stepFromArtifact.get(stackArtifact);
        if (!thisStep) {
          throw new ValidationError(lit`LogicErrorAddedStepArtifact`, 'Logic error: we just added a step for this artifact but it disappeared.', stage);
        }
        thisStep.addStackSteps(stackstep.pre ?? [], stackstep.changeSet ?? [], stackstep.post ?? []);
      }
    }

    for (const artifact of assembly.stacks) {
      const thisStep = stepFromArtifact.get(artifact);
      if (!thisStep) {
        throw new ValidationError(lit`LogicErrorAddedStepArtifact`, 'Logic error: we just added a step for this artifact but it disappeared.', stage);
      }

      const stackDependencies = artifact.dependencies.filter(isStackArtifact);
      for (const dep of stackDependencies) {
        const depStep = stepFromArtifact.get(dep);
        if (!depStep) {
          throw new ValidationError(lit`StackDependsStackFound`, `Stack '${artifact.id}' depends on stack not found in same Stage: '${dep.id}'`, stage);
        }
        thisStep.addStackDependency(depStep);
      }
    }

    if ((props.deployGate ?? []).length > 0) {
      const dependentStacks = Array.from(stepFromArtifact.values())
        .filter(s => s.stackDependencies.length > 0);
      if (dependentStacks.length > 0) {
        throw new ValidationError(
          lit`DeployGateRequiresIndependentStacks`,
          'cannot use \'deployGate\' steps in stage \'' + stage.stageName + '\': ' +
          'stack(s) ' + dependentStacks.map(s => s.stackName).join(', ') + ' depend on other stacks in the same stage. ' +
          '\'deployGate\' requires all stacks in a stage to be independent, because a dependent ' +
          'stack\'s change set cannot be prepared before its dependency has been deployed',
          stage,
        );
      }
      const stepsWithOutputs = (props.deployGate ?? []).filter(s => s.consumedStackOutputs.length > 0);
      if (stepsWithOutputs.length > 0) {
        throw new ValidationError(
          lit`DeployGateCannotConsumeStackOutputs`,
          'cannot use \'deployGate\' steps that consume stack outputs in stage \'' + stage.stageName + '\': ' +
          'step(s) ' + stepsWithOutputs.map(s => s.id).join(', ') + ' consume stack outputs, ' +
          'but \'deployGate\' steps run before any stack in the stage is deployed',
          stage,
        );
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
   * Additional steps that run after every stack's change set has been prepared
   * and before any stack in this stage is deployed.
   */
  public readonly deployGate: Step[];

  /**
   * Instructions for additional steps that are run at stack level
   */
  public readonly stackSteps: StackSteps[];

  /**
   * Determine if all stacks in stage should be deployed with prepare
   * step or not.
   */
  public readonly prepareStep?: boolean;

  private constructor(
    /** The stacks deployed in this stage */
    public readonly stacks: StackDeployment[], props: StageDeploymentProps = {}) {
    this.stageName = props.stageName ?? '';
    this.pre = props.pre ?? [];
    this.post = props.post ?? [];
    this.deployGate = props.deployGate ?? [];
    this.stackSteps = props.stackSteps ?? [];
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
