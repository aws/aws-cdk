import { DefaultTokenResolver, IResolveContext, Lazy, StringConcat, Token, Tokenization } from 'aws-cdk-lib';
import { IPipe } from './pipe';
import { DynamicInput, PipeVariable } from './pipeVariable';
import { unquote } from './unquote';

type StaticString = string;
type KeyValue = Record<string, string | PipeVariable>;
type StaticJsonFlat = Record<string, StaticString | KeyValue>;
type InputTransformJson = Record<string, StaticString | KeyValue | StaticJsonFlat | IInputTransformation[] | StaticString [] | DynamicInput>;

type InputTransformationValue = StaticString | InputTransformJson;

/**
 * The inputTemplate that is used to transform the input event payload with unquoted variables
 */
export interface InputTransformationConfig {
  /**
   * The inputTemplate that is used to transform the input event payload
   */
  readonly inputTemplate: string;
}

/**
 * Transform or replace the input event payload
 */
export interface IInputTransformation {
  /**
   * Bind the input transformation to the pipe and returns the inputTemplate string.
   */
  bind(pipe: IPipe): InputTransformationConfig;
}

/**
 * Transform or replace the input event payload
 */
export class InputTransformation implements IInputTransformation {

  /**
   * Creates an InputTransformation from a string.
   */
  static fromText(inputTemplate: StaticString): InputTransformation {
    return new InputTransformation(inputTemplate);
  }

  /**
   * Creates an InputTransformation from a jsonPath expression of the input event.
   */
  static fromEventPath(jsonPathExpression: string): InputTransformation {
    if (!jsonPathExpression.startsWith('$.')) {
      throw new Error('jsonPathExpression start with "$."');
    }
    const jsonPath = `<${jsonPathExpression}>`;
    return new InputTransformation(jsonPath);
  }

  /**
   * Creates an InputTransformation from a pipe variable.
   */
  static fromObject(inputTemplate: InputTransformJson): InputTransformation {
    return new InputTransformation(inputTemplate);
  }

  /**
   * The inputTemplate that is used to transform the input event payload
   */
  private inputTemplate: InputTransformationValue;

  private constructor(inputTemplate: InputTransformationValue) {

    this.inputTemplate = inputTemplate;
  }

  public bind(pipe: IPipe): InputTransformationConfig {
    if (typeof this.inputTemplate === 'string') {
      return { inputTemplate: this.inputTemplate };
    }

    const stringifiedJsonWithUnresolvedTokens = pipe.stack.toJsonString(this.inputTemplate);
    const resolved = Tokenization.resolve(stringifiedJsonWithUnresolvedTokens, {
      scope: pipe,
      resolver: new DefaultTokenResolver(new StringConcat()),
    });
    return { inputTemplate: this.unquoteDynamicInputs(resolved) };
  }

  private unquoteDynamicInputs(sub: string) {

    // TODO can we use the Token.asString() here?
    return Lazy.uncachedString({ produce: (ctx: IResolveContext) => Token.asString(deepUnquote(ctx.resolve(sub))) });

    /**
     * Removes the quotes from the values that are in the keys array
     *
     * @param resolved the resolved object containing the dynamic fields with quotes. In cases where a cloudformation intrinsic function is used, the resolved value will be an object.
     * @returns the resolved object with the dynamic fields without quotes
     */
    function deepUnquote(resolved: any): any {
      if (Array.isArray(resolved)) {
        return resolved.map(deepUnquote);
      }

      if (typeof(resolved) === 'object' && resolved !== null) {
        for (const [key, value] of Object.entries(resolved)) {
          resolved[key] = deepUnquote(value);
        }
      }
      if (typeof resolved === 'string') {
        return unquote(resolved);
      }

      return resolved;
    }
  }
}

