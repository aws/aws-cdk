import { CliConfig, renderYargs } from '../lib';

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
          nargs: 1,
          requiresArg: true,
        },
      },
      commands: {},
    };

    expect(await renderYargs(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @typescript-eslint/comma-dangle, comma-spacing, max-len, quotes, quote-props */
      import { Argv } from 'yargs';

      // @ts-ignore TS6133
      export function parseCommandLineArguments(
        args: Array<string>,
        browserDefault: string,
        availableInitLanguages: Array<string>,
        migrateSupportedLanguages: Array<string>,
        version: string,
        yargsNegativeAlias: any
      ): any {
        return yargs
          .env('CDK')
          .usage('Usage: cdk -a <cdk-app> COMMAND')
          .option('one', {
            type: 'string',
            alias: 'o',
            desc: 'text for one',
            requiresArg: true,
          })
          .option('two', {
            type: 'number',
            desc: 'text for two',
          })
          .option('three', {
            type: 'array',
            alias: 't',
            desc: 'text for three',
            nargs: 1,
            requiresArg: true,
          })
          .version(version)
          .demandCommand(1, '')
          .recommendCommands()
          .help()
          .alias('h', 'help')
          .epilogue(
            'If your app has a single stack, there is no need to specify the stack name\\n\\nIf one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.'
          )
          .parse(args);
      } // eslint-disable-next-line @typescript-eslint/no-require-imports
      const yargs = require('yargs');
      "
    `);
  });
});
