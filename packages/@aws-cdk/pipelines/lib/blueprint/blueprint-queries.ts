import { Blueprint } from './blueprint';
import { ScriptStep, StackOutputReference } from './script-step';
import { StackDeployment } from './stack-deployment';
import { Step } from './step';

/**
 * Answer some questions about a pipeline blueprint
 */
export class BlueprintQueries {
  constructor(private readonly blueprint: Blueprint) {
  }

  /**
   * Return the names of all outputs for the given stack that are referenced in this blueprint
   */
  public stackOutputsReferenced(stack: StackDeployment): string[] {
    const steps = new Array<Step>();
    for (const wave of this.blueprint.waves) {
      steps.push(...wave.pre, ...wave.post);
      for (const stage of wave.stages) {
        steps.push(...stage.pre, ...stage.post);
      }
    }

    const ret = new Array<string>();
    for (const step of steps) {
      if (!(step instanceof ScriptStep)) { continue; }

      for (const outputRef of Object.values(step.envFromOutputs)) {
        if (outputRef.isProducedBy(stack)) {
          ret.push(outputRef.outputName);
        }
      }
    }
    return ret;
  }

  /**
   * Find the stack deployment that is producing the given reference
   */
  public producingStack(outputReference: StackOutputReference): StackDeployment {
    for (const wave of this.blueprint.waves) {
      for (const stage of wave.stages) {
        for (const stack of stage.stacks) {
          if (outputReference.isProducedBy(stack)) {
            return stack;
          }
        }
      }
    }

    throw new Error(`Stack '${outputReference.stackDescription}' (producing output '${outputReference.outputName}') is not in the pipeline; call 'addStage()' to add the stack's Stage to the pipeline`);
  }
}