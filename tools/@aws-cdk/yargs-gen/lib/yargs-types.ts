interface YargsCommand {
  description: string;
  options?: { [optionName: string]: YargsOption };
  aliases?: string[];
  arg?: YargsArg;
}

interface YargsArg {
  name: string;
  variadic: boolean;
}

interface YargsCommand {
  description: string;
  options?: { [optionName: string]: YargsOption };
  aliases?: string[];
  arg?: YargsArg;
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
  negativeAlias?: string;
}

export interface Middleware {
  callback: string;
  args: string[];
  applyBeforeValidation?: boolean;
}

export interface CliConfig {
  globalOptions: { [optionName: string]: YargsOption };
  commands: { [commandName: string]: YargsCommand };
}

/**
 * The result of a DynamicValue call
 */
export interface DynamicResult {
  dynamicType: 'parameter' | 'function';
  dynamicValue: string | (() => any);
}
