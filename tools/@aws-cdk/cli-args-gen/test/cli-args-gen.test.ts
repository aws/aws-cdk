import { CliConfig, renderCliArgsType } from '../lib';

describe('render', () => {
  test('can generate CliArguments type', async () => {
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

    expect(await renderCliArgsType(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Command } from './settings';

      /**
       * The structure of the CLI configuration, generated from packages/aws-cdk/lib/config.ts
       *
       * @struct
       */
      export interface CliArguments {
        /**
         * The CLI command name followed by any properties of the command
         */
        readonly _: [Command, ...string[]];

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
         * context values
         *
         * @default - []
         */
        readonly context?: Array<string>;

        /**
         * plugins to load
         *
         * @default - []
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

    expect(await renderCliArgsType(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Command } from './settings';

      /**
       * The structure of the CLI configuration, generated from packages/aws-cdk/lib/config.ts
       *
       * @struct
       */
      export interface CliArguments {
        /**
         * The CLI command name followed by any properties of the command
         */
        readonly _: [Command, ...string[]];

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
         * @default - []
         */
        readonly otherArray?: Array<string>;
      }
      "
    `);
  });
});
