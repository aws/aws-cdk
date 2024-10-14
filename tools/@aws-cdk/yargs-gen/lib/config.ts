// called by a build tool to generate parse-command-line-arguments.ts

interface YargsCommand {
  description: string;
  options?: { [optionName: string]: YargsOption };
  aliases?: string[];
  args?: { [argName: string]: YargsArg };
}

// might need to expand
interface YargsArg {
  variadic: boolean;
}

interface YargsOption {
  type: string;
  description: string;
  default?: string | boolean;
  alias?: string;
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
            description: 'Deploy all available stacks',
            default: false,
          },
        },
      },
    },
  };

  return config;
}