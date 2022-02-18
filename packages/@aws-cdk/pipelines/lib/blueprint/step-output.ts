import { IResolvable, IResolveContext, Token, Tokenization } from '@aws-cdk/core';
import { Step } from './step';

const STEP_OUTPUT_SYM = Symbol.for('@aws-cdk/pipelines.StepOutput');

/**
 * A symbolic reference to a value produced by another step
 *
 * The engine is responsible for defining how these should be rendered.
 */
export class StepOutput implements IResolvable {
  /**
   * Return true if the given IResolvable is a StepOutput
   */
  public static isStepOutput(resolvable: IResolvable): resolvable is StepOutput {
    return !!(resolvable as any)[STEP_OUTPUT_SYM];
  }

  /**
   * Find all StepOutputs referenced in the given structure
   */
  public static findAll(structure: any): StepOutput[] {
    return findAllStepOutputs(structure);
  }

  /**
   * The step that produces this output
   */
  public readonly step: Step;

  /**
   * Additional data on the output, to be interpreted by the engine
   */
  public readonly engineSpecificInformation: any;

  public readonly creationStack: string[] = [];
  private resolution: any = undefined;

  constructor(step: Step, engineSpecificInformation: any) {
    this.step = step;
    this.engineSpecificInformation = engineSpecificInformation;
    Object.defineProperty(this, STEP_OUTPUT_SYM, { value: true });
  }

  /**
   * Define the resolved value for this StepOutput.
   *
   * Should be called by the engine.
   */
  public defineResolution(value: any) {
    this.resolution = value;
  }

  public resolve(_context: IResolveContext) {
    if (this.resolution === undefined) {
      throw new Error(`Output for step ${this.step} not configured. Either the step is not in the pipeline, or this engine does not support Outputs for this step.`);
    }
    return this.resolution;
  }

  public toString(): string {
    return Token.asString(this);
  }
}

function findAllStepOutputs(structure: any): StepOutput[] {
  const ret = new Set<StepOutput>();
  recurse(structure);
  return Array.from(ret);

  function checkToken(x?: IResolvable) {
    if (x && StepOutput.isStepOutput(x)) {
      ret.add(x);
      return true;
    }

    // Return false if it wasn't a Token in the first place (in which case we recurse)
    return x !== undefined;
  }

  function recurse(x: any): void {
    if (!x) { return; }

    if (Tokenization.isResolvable(x)) {
      checkToken(x);
      return;
    }
    if (Array.isArray(x)) {
      if (!checkToken(Tokenization.reverseList(x))) {
        x.forEach(recurse);
      }
      return;
    }
    if (typeof x === 'number') {
      checkToken(Tokenization.reverseNumber(x));
      return;
    }
    if (typeof x === 'string') {
      Tokenization.reverseString(x).tokens.forEach(checkToken);
      return;
    }
    if (typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) {
        recurse(k);
        recurse(v);
      }
    }
  }
}