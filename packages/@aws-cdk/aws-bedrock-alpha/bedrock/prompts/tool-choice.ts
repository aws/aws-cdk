import { CfnPrompt } from 'aws-cdk-lib/aws-bedrock';

/**
 * Configuration for tools available to the model.
 */
export interface ToolConfiguration {
  /**
   * How the model should choose which tool to use.
   */
  readonly toolChoice: ToolChoice;

  /**
   * The tools available to the model.
   */
  readonly tools: CfnPrompt.ToolProperty[];
}

/**
 * Defines how the model should choose which tool to use.
 */
export class ToolChoice {
  /**
   * The model must request at least one tool (no text is generated).
   */
  public static readonly ANY = new ToolChoice({}, undefined, undefined);

  /**
   * (Default). The Model automatically decides if a tool should be called or whether to generate text instead.
   */
  public static readonly AUTO = new ToolChoice(undefined, {}, undefined);

  /**
   * The Model must request the specified tool. Only supported by some models like Anthropic Claude 3 models.
   *
   * @param toolName - The name of the specific tool to use
   * @returns A ToolChoice instance configured for the specific tool
   */
  public static specificTool(toolName: string): ToolChoice {
    return new ToolChoice(undefined, undefined, toolName);
  }

  /**
   * Configuration for ANY tool choice.
   */
  public readonly any?: any;

  /**
   * Configuration for AUTO tool choice.
   */
  public readonly auto?: any;

  /**
   * The specific tool name if using specific tool choice.
   */
  public readonly tool?: string;

  constructor(any: any, auto: any, tool?: string) {
    this.any = any;
    this.auto = auto;
    this.tool = tool;
  }

  /**
   * Renders the tool choice as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnPrompt.ToolChoiceProperty {
    return {
      any: this.any,
      auto: this.auto,
      tool: this.tool !== undefined ? { name: this.tool } : undefined,
    };
  }
}
