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

interface YargsOption {
  type: 'string' | 'array' | 'number' | 'boolean' | 'count';
  desc?: string;
  default?: any;
  deprecated?: boolean | string;
  choices?: ReadonlyArray<string | number | true | undefined>;
  alias?: string;
  conflicts?: string | readonly string[] | { [key: string]: string | readonly string[] };
  nargs?: number;
  requiresArg?: boolean;
  hidden?: boolean;
  middleware?: Middleware;
}

export interface Middleware {
  callback: string;
  args: string[];
  applyBeforeValidation?: boolean;
}

export interface CliConfig {
  commands: { [commandName: string]: YargsCommand };
}

