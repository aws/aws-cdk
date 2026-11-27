import * as codepipeline from '../../../../aws-codepipeline';
import * as cpa from '../../../../aws-codepipeline-actions';
import * as iam from '../../../../aws-iam';
import { Token, ValidationError } from '../../../../core';
import { lit } from '../../../../core/lib/private/literal-string';
import { obtainScope } from '../../private/construct-internals';
import type { CodePipelineActionFactoryResult, ICodePipelineActionFactory, ProduceActionOptions } from '../codepipeline-action-factory';
import type { CommandsStep } from '../commands-step';

/**
 * Produces a CodePipeline Commands action for a `CommandsStep`
 */
export class CommandsFactory implements ICodePipelineActionFactory {
  public static fromCommandsStep(step: CommandsStep): ICodePipelineActionFactory {
    return new CommandsFactory(step);
  }

  private constructor(private readonly step: CommandsStep) {
  }

  public produceAction(stage: codepipeline.IStage, options: ProduceActionOptions): CodePipelineActionFactoryResult {
    const step = this.step;
    const pipeline = options.pipeline.pipeline;

    if (isV2Pipeline(pipeline) === false) {
      throw new ValidationError(lit`CommandsStepRequiresV2Pipeline`, `CommandsStep '${step.id}' can only be used in a pipeline of type V2, set 'pipelineType: PipelineType.V2' on the pipeline (a pipeline type set with 'addPropertyOverride()' is not detected)`, options.pipeline);
    }

    const mainInput = step.inputs.find(x => x.directory === '.');

    const inputArtifact = mainInput
      ? options.artifacts.toCodePipeline(mainInput.fileSet)
      : options.fallbackArtifact;
    if (!inputArtifact) {
      throw new ValidationError(lit`CommandsStepRequiresInput`, `CommandsStep '${step.id}' requires an input (and the pipeline doesn't have a Source to fall back to). Add an input or a pipeline source.`, options.pipeline);
    }

    const outputArtifact = step.primaryOutput && step.outputFiles
      ? options.artifacts._toCodePipelineWithFiles(step.primaryOutput, step.outputFiles)
      : undefined;

    const role = this.actionRole(options);

    const action = new cpa.CommandsAction({
      actionName: options.actionName,
      runOrder: options.runOrder,
      variablesNamespace: options.variablesNamespace,
      input: inputArtifact,
      output: outputArtifact,
      outputVariables: step._renderOutputVariables(),
      commands: step.commands,
      environmentType: step.environmentType,
      computeType: step.computeType,
      vpc: step.vpc,
      subnetSelection: step.subnetSelection,
      securityGroups: step.securityGroups,
      role,
    });
    stage.addAction(action);

    return { runOrdersConsumed: 1 };
  }

  /**
   * The role to pass to the action
   *
   * Only creates a role if policy statements must be added to it, otherwise
   * the pipeline creates the role (or uses the pipeline role).
   */
  private actionRole(options: ProduceActionOptions): iam.IRole | undefined {
    const step = this.step;
    const statements = step.rolePolicyStatements ?? [];

    if (step.actionRole) {
      statements.forEach(s => step.actionRole!.addToPrincipalPolicy(s));
      return step.actionRole;
    }
    if (statements.length === 0) {
      return undefined;
    }

    const pipeline = options.pipeline;
    if (pipeline.usePipelineRoleForActions) {
      statements.forEach(s => pipeline.pipeline.role.addToPrincipalPolicy(s));
      return undefined;
    }

    // Same construct path as the role the pipeline would generate for this action
    const role = new iam.Role(obtainScope(options.scope, options.actionName), 'CodePipelineActionRole', {
      assumedBy: pipeline.pipeline.role,
    });
    statements.forEach(s => role.addToPrincipalPolicy(s));
    return role;
  }
}

/**
 * Whether the pipeline is of type V2
 *
 * Returns undefined if this cannot be determined at synthesis time.
 */
function isV2Pipeline(pipeline: codepipeline.Pipeline): boolean | undefined {
  const cfnPipeline = pipeline.node.defaultChild;
  if (!codepipeline.CfnPipeline.isCfnPipeline(cfnPipeline)) {
    return undefined;
  }
  // An unset pipeline type is V1
  const pipelineType = cfnPipeline.pipelineType ?? codepipeline.PipelineType.V1;
  if (Token.isUnresolved(pipelineType)) {
    return undefined;
  }
  return pipelineType === codepipeline.PipelineType.V2;
}

