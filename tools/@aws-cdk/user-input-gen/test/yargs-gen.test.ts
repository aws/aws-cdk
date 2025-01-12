import { $E, expr, ThingSymbol } from '@cdklabs/typewriter';
import { CliConfig, CliHelpers, renderYargs } from '../lib';

const YARGS_HELPERS = new CliHelpers('./util/yargs-helpers');

describe('render', () => {
  test('can generate global options', async () => {
    const config: CliConfig = {
      globalOptions: {
        one: {
          type: 'string',
          alias: 'o',
          desc: 'text for one',
          requiresArg: true,
        },
        two: { type: 'number', desc: 'text for two' },
        three: {
          type: 'array',
          alias: 't',
          desc: 'text for three',
        },
      },
      commands: {},
    };

    expect(await renderYargs(config, YARGS_HELPERS)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Argv } from 'yargs';
      import * as helpers from './util/yargs-helpers';

      // @ts-ignore TS6133
      export function parseCommandLineArguments(args: Array<string>): any {
        return yargs
          .env('CDK')
          .usage('Usage: cdk -a <cdk-app> COMMAND')
          .option('one', {
            default: undefined,
            type: 'string',
            alias: 'o',
            desc: 'text for one',
            requiresArg: true,
          })
          .option('two', {
            default: undefined,
            type: 'number',
            desc: 'text for two',
          })
          .option('three', {
            default: [],
            type: 'array',
            alias: 't',
            desc: 'text for three',
            nargs: 1,
            requiresArg: true,
          })
          .version(helpers.cliVersion())
          .demandCommand(1, '')
          .recommendCommands()
          .help()
          .alias('h', 'help')
          .epilogue(
            'If your app has a single stack, there is no need to specify the stack name\\n\\nIf one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
          )
          .parse(args);
      } // eslint-disable-next-line @typescript-eslint/no-require-imports
      const yargs = require('yargs');
      "
    `);
  });

  test('can generate negativeAlias', async () => {
    const config: CliConfig = {
      globalOptions: {},
      commands: {
        test: {
          description: 'the action under test',
          options: {
            one: {
              type: 'boolean',
              alias: 'o',
              desc: 'text for one',
              negativeAlias: 'O',
            },
          },
        },
      },
    };

    expect(await renderYargs(config, YARGS_HELPERS)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Argv } from 'yargs';
      import * as helpers from './util/yargs-helpers';

      // @ts-ignore TS6133
      export function parseCommandLineArguments(args: Array<string>): any {
        return yargs
          .env('CDK')
          .usage('Usage: cdk -a <cdk-app> COMMAND')
          .command('test', 'the action under test', (yargs: Argv) =>
            yargs
              .option('one', {
                default: undefined,
                type: 'boolean',
                alias: 'o',
                desc: 'text for one',
              })
              .option('O', { type: 'boolean', hidden: true })
              .middleware(helpers.yargsNegativeAlias('O', 'one'), true),
          )
          .version(helpers.cliVersion())
          .demandCommand(1, '')
          .recommendCommands()
          .help()
          .alias('h', 'help')
          .epilogue(
            'If your app has a single stack, there is no need to specify the stack name\\n\\nIf one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
          )
          .parse(args);
      } // eslint-disable-next-line @typescript-eslint/no-require-imports
      const yargs = require('yargs');
      "
    `);
  });

  test('can pass-through expression unchanged', async () => {
    const config: CliConfig = {
      globalOptions: {},
      commands: {
        test: {
          description: 'the action under test',
          options: {
            one: {
              type: 'boolean',
              default: $E(
                expr
                  .sym(new ThingSymbol('banana', YARGS_HELPERS))
                  .call(expr.lit(1), expr.lit(2), expr.lit(3)),
              ),
            },
          },
        },
      },
    };

    expect(await renderYargs(config, YARGS_HELPERS)).toContain(
      'default: helpers.banana(1, 2, 3)',
    );
  });

  test('special notification-arn option gets NO default value', async () => {
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

    expect(await renderYargs(config, YARGS_HELPERS)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { Argv } from 'yargs';
      import * as helpers from './util/yargs-helpers';

      // @ts-ignore TS6133
      export function parseCommandLineArguments(args: Array<string>): any {
        return yargs
          .env('CDK')
          .usage('Usage: cdk -a <cdk-app> COMMAND')
          .command('deploy', 'Notification Arns', (yargs: Argv) =>
            yargs
              .option('notification-arns', {
                type: 'array',
                desc: 'Deploy all stacks',
                nargs: 1,
                requiresArg: true,
              })
              .option('other-array', {
                default: [],
                type: 'array',
                desc: 'Other array',
                nargs: 1,
                requiresArg: true,
              }),
          )
          .version(helpers.cliVersion())
          .demandCommand(1, '')
          .recommendCommands()
          .help()
          .alias('h', 'help')
          .epilogue(
            'If your app has a single stack, there is no need to specify the stack name\\n\\nIf one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
          )
          .parse(args);
      } // eslint-disable-next-line @typescript-eslint/no-require-imports
      const yargs = require('yargs');
      "
    `);
  });
});
