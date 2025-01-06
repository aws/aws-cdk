interface YargsCommand {
  description: string;
  options?: { [optionName: string]: YargsOption };
  aliases?: string[];
  arg?: YargsArg;
}

export interface CliAction extends YargsCommand {
  options?: { [optionName: string]: CliOption };
}

interface YargsArg {
  name: string;
  variadic: boolean;
}

export interface YargsOption {
  type: 'string' | 'array' | 'number' | 'boolean' | 'count';
  desc?: string;
  default?: any;
  deprecated?: boolean | string;
  choices?: ReadonlyArray<string | number | true | undefined>;
  alias?: string | string[];
  conflicts?: string | readonly string[] | { [key: string]: string | readonly string[] };
  nargs?: number;
  requiresArg?: boolean;
  hidden?: boolean;
  count?: boolean;
}

export interface CliOption extends Omit<YargsOption, 'nargs' | 'hidden'> {
  negativeAlias?: string;
}

export interface Middleware {
  callback: string;
  args: string[];
  applyBeforeValidation?: boolean;
}

export interface CliConfig {
  globalOptions: { [optionName: string]: CliOption };
  commands: { [commandName: string]: CliAction };
}

/**
 * The result of a DynamicValue call
 */
export interface DynamicResult {
  dynamicType: 'parameter' | 'function';
  dynamicValue: string;
}
