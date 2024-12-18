import { CliConfig, renderCliType } from '../lib';

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

    expect(await renderCliType(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @typescript-eslint/comma-dangle, comma-spacing, max-len, quotes, quote-props */
      /**
       * The structure of the CLI configuration, generated from packages/aws-cdk/lib/config.ts
       *
       * @struct
       */
      export interface CliArguments {
        /**
         * The CLI command name followed by any properties of the command
         */
        readonly _: Array<string>;

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
});
