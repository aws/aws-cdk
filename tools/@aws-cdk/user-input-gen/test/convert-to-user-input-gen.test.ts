import { CliConfig, renderUserInputFuncs } from '../lib';

describe('render', () => {
  test('can generate conversion function', async () => {
    const config: CliConfig = {
      globalOptions: {
        app: {
          type: 'string',
          desc: 'REQUIRED: Command-line for executing your app',
        },
        debug: {
          type: 'boolean',
          desc: 'Enable debug logging',
          default: false,
        },
        context: {
          default: [],
          type: 'array',
          alias: 'c',
          desc: 'context values',
        },
        plugin: {
          type: 'array',
          desc: 'plugins to load',
        },
      },
      commands: {
        deploy: {
          arg: {
            name: 'STACKS',
            variadic: true,
          },
          description: 'Deploy a stack',
          aliases: ['d'],
          options: {
            all: {
              type: 'boolean',
              desc: 'Deploy all stacks',
              default: false,
            },
          },
        },
      },
    };

    expect(await renderUserInputFuncs(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/cli/cli-config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Command } from './user-configuration';
      import { UserInput, GlobalOptions } from './user-input';

      // @ts-ignore TS6133
      export function convertYargsToUserInput(args: any): UserInput {
        const globalOptions: GlobalOptions = {
          app: args.app,
          debug: args.debug,
          context: args.context,
          plugin: args.plugin,
        };
        let commandOptions;
        switch (args._[0] as Command) {
          case 'deploy':
          case 'd':
            commandOptions = {
              all: args.all,
              STACKS: args.STACKS,
            };
            break;
        }
        const userInput: UserInput = {
          command: args._[0],
          globalOptions,
          [args._[0]]: commandOptions,
        };

        return userInput;
      }

      // @ts-ignore TS6133
      export function convertConfigToUserInput(config: any): UserInput {
        const globalOptions: GlobalOptions = {
          app: config.app,
          debug: config.debug,
          context: config.context,
          plugin: config.plugin,
        };
        const deployOptions = {
          all: config.deploy?.all,
        };
        const userInput: UserInput = {
          globalOptions,
          deploy: deployOptions,
        };

        return userInput;
      }
      "
    `);
  });
});
