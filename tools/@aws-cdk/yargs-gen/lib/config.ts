// called by a build tool to generate parse-command-line-arguments.ts

interface YargsCommand {
  description: string;
  options?: { [optionName: string]: YargsOption };
  aliases?: string[];
  //args?: { [argName: string]: YargsArg };
  arg?: YargsArg;
}

// might need to expand
interface YargsArg {
  name: string;
  variadic: boolean;
}

interface YargsOption {
  type: 'string' | 'array' | 'number' | 'boolean' | 'count';
  desc: string;
  default?: any;
  alias?: string;
  conflicts?: string | readonly string[] | { [key: string]: string | readonly string[] };
  nargs?: number;
  requiresArg?: boolean;
}

export interface CliConfig {
  commands: { [commandName: string]: YargsCommand };
}

export function makeConfig(): CliConfig {
  const config: CliConfig = {
    commands: {
      deploy: {
        description: 'Deploys the stack(s) named STACKS into your AWS account',
        options: {
          all: {
            type: 'boolean',
            desc: 'Deploy all available stacks',
            default: false,
          },
        },
      },
    },
  };

  return config;
}