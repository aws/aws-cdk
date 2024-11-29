import * as cp from '../../../../aws-codepipeline';
import { Step } from '../../blueprint/step';
import { StepOutput } from '../../helpers-internal';

const CODEPIPELINE_ENGINE_NAME = 'codepipeline';

export function makeCodePipelineOutput(step: Step, variableName: string) {
  return new StepOutput(step, CODEPIPELINE_ENGINE_NAME, variableName).toString();
}

/**
 * If the step is producing outputs, determine a variableNamespace for it, and configure that on the outputs
 */
export function namespaceStepOutputs(step: Step, stage: cp.IStage, name: string): string | undefined {
  let ret: string | undefined;
  for (const output of StepOutput.producedStepOutputs(step)) {
    ret = namespaceName(stage, name);
    if (output.engineName !== CODEPIPELINE_ENGINE_NAME) {
      throw new Error(`Found unrecognized output type: ${output.engineName}`);
    }

    if (typeof output.engineSpecificInformation !== 'string') {
      throw new Error(`CodePipeline requires that 'engineSpecificInformation' is a string, got: ${JSON.stringify(output.engineSpecificInformation)}`);
    }
    output.defineResolution(`#{${ret}.${output.engineSpecificInformation}}`);
  }
  return ret;
}

/**
 * Generate a variable namespace from stage and action names
 *
 * Variable namespaces cannot have '.', but they can have '@'. Other than that,
 * action names are more limited so they translate easily.
 */
export function namespaceName(stage: cp.IStage, name: string) {
  return `${stage.stageName}/${name}`.replace(/[^a-zA-Z0-9@_-]/g, '@');
}
