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

// might need to expand
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
  middleware?: Middleware;
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

