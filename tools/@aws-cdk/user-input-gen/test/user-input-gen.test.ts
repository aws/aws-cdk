import { CliConfig, renderUserInputType } from '../lib';

describe('render', () => {
  test('can generate UserInput type', async () => {
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
        verbose: {
          type: 'boolean',
          count: true,
          desc: 'Increase logging verbosity',
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
          description: 'Deploy a stack',
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

    expect(await renderUserInputType(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/cli/cli-config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Command } from './user-configuration';

      /**
       * The structure of the user input -- either CLI options or cdk.json -- generated from packages/aws-cdk/lib/config.ts
       *
       * @struct
       */
      export interface UserInput {
        /**
         * The CLI command name
         */
        readonly command?: Command;

        /**
         * Global options available to all CLI commands
         */
        readonly globalOptions?: GlobalOptions;

        /**
         * Deploy a stack
         */
        readonly deploy?: DeployOptions;
      }

      /**
       * Global options available to all CLI commands
       *
       * @struct
       */
      export interface GlobalOptions {
        /**
         * REQUIRED: Command-line for executing your app
         *
         * @default - undefined
         */
        readonly app?: string;

        /**
         * Enable debug logging
         *
         * @default - false
         */
        readonly debug?: boolean;

        /**
         * Increase logging verbosity
         *
         * @default - undefined
         */
        readonly verbose?: number;

        /**
         * context values
         *
         * @default - []
         */
        readonly context?: Array<string>;

        /**
         * plugins to load
         *
         * @default - undefined
         */
        readonly plugin?: Array<string>;
      }

      /**
       * Deploy a stack
       *
       * @struct
       */
      export interface DeployOptions {
        /**
         * Deploy all stacks
         *
         * @default - false
         */
        readonly all?: boolean;
      }
      "
    `);
  });

  test('special notification-arn option gets undefined default', async () => {
    const config: CliConfig = {
      commands: {
        deploy: {
          description: 'Notification Arns',
          options: {
            ['notification-arns']: {
              type: 'array',
              desc: 'Deploy all stacks',
            },
            ['other-array']: {
              type: 'array',
              desc: 'Other array',
            },
          },
        },
      },
      globalOptions: {},
    };

    expect(await renderUserInputType(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/cli/cli-config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Command } from './user-configuration';

      /**
       * The structure of the user input -- either CLI options or cdk.json -- generated from packages/aws-cdk/lib/config.ts
       *
       * @struct
       */
      export interface UserInput {
        /**
         * The CLI command name
         */
        readonly command?: Command;

        /**
         * Global options available to all CLI commands
         */
        readonly globalOptions?: GlobalOptions;

        /**
         * Notification Arns
         */
        readonly deploy?: DeployOptions;
      }

      /**
       * Global options available to all CLI commands
       *
       * @struct
       */
      export interface GlobalOptions {}

      /**
       * Notification Arns
       *
       * @struct
       */
      export interface DeployOptions {
        /**
         * Deploy all stacks
         *
         * @default - undefined
         */
        readonly notificationArns?: Array<string>;

        /**
         * Other array
         *
         * @default - undefined
         */
        readonly otherArray?: Array<string>;
      }
      "
    `);
  });

  test('positional arguments', async () => {
    const config: CliConfig = {
      commands: {
        deploy: {
          arg: {
            name: 'STACKS',
            variadic: true,
          },
          description: 'deploy',
        },
        acknowledge: {
          arg: {
            name: 'ID',
            variadic: false,
          },
          description: 'acknowledge',
        },
      },
      globalOptions: {},
    };

    expect(await renderUserInputType(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/cli/cli-config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Command } from './user-configuration';

      /**
       * The structure of the user input -- either CLI options or cdk.json -- generated from packages/aws-cdk/lib/config.ts
       *
       * @struct
       */
      export interface UserInput {
        /**
         * The CLI command name
         */
        readonly command?: Command;

        /**
         * Global options available to all CLI commands
         */
        readonly globalOptions?: GlobalOptions;

        /**
         * deploy
         */
        readonly deploy?: DeployOptions;

        /**
         * acknowledge
         */
        readonly acknowledge?: AcknowledgeOptions;
      }

      /**
       * Global options available to all CLI commands
       *
       * @struct
       */
      export interface GlobalOptions {}

      /**
       * deploy
       *
       * @struct
       */
      export interface DeployOptions {
        /**
         * Positional argument for deploy
         */
        readonly STACKS?: Array<string>;
      }

      /**
       * acknowledge
       *
       * @struct
       */
      export interface AcknowledgeOptions {
        /**
         * Positional argument for acknowledge
         */
        readonly ID?: string;
      }
      "
    `);
  });
});
