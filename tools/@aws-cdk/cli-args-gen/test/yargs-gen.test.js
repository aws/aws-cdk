"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typewriter_1 = require("@cdklabs/typewriter");
const lib_1 = require("../lib");
const YARGS_HELPERS = new lib_1.CliHelpers('./util/yargs-helpers');
describe('render', () => {
    test('can generate global options', async () => {
        const config = {
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
        expect(await (0, lib_1.renderYargs)(config, YARGS_HELPERS)).toMatchInlineSnapshot(`
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
        const config = {
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
        expect(await (0, lib_1.renderYargs)(config, YARGS_HELPERS)).toMatchInlineSnapshot(`
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
        const config = {
            globalOptions: {},
            commands: {
                test: {
                    description: 'the action under test',
                    options: {
                        one: {
                            type: 'boolean',
                            default: (0, typewriter_1.$E)(typewriter_1.expr
                                .sym(new typewriter_1.ThingSymbol('banana', YARGS_HELPERS))
                                .call(typewriter_1.expr.lit(1), typewriter_1.expr.lit(2), typewriter_1.expr.lit(3))),
                        },
                    },
                },
            },
        };
        expect(await (0, lib_1.renderYargs)(config, YARGS_HELPERS)).toContain('default: helpers.banana(1, 2, 3)');
    });
    test('special notification-arn option gets NO default value', async () => {
        const config = {
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
        expect(await (0, lib_1.renderYargs)(config, YARGS_HELPERS)).toMatchInlineSnapshot(`
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFyZ3MtZ2VuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ5YXJncy1nZW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUE0RDtBQUM1RCxnQ0FBNEQ7QUFFNUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxnQkFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFN0QsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdDLE1BQU0sTUFBTSxHQUFjO1lBQ3hCLGFBQWEsRUFBRTtnQkFDYixHQUFHLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFLEdBQUc7b0JBQ1YsSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLFdBQVcsRUFBRSxJQUFJO2lCQUNsQjtnQkFDRCxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUU7Z0JBQzdDLEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsT0FBTztvQkFDYixLQUFLLEVBQUUsR0FBRztvQkFDVixJQUFJLEVBQUUsZ0JBQWdCO2lCQUN2QjthQUNGO1lBQ0QsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sSUFBQSxpQkFBVyxFQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBOEN0RSxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1QyxNQUFNLE1BQU0sR0FBYztZQUN4QixhQUFhLEVBQUUsRUFBRTtZQUNqQixRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLFdBQVcsRUFBRSx1QkFBdUI7b0JBQ3BDLE9BQU8sRUFBRTt3QkFDUCxHQUFHLEVBQUU7NEJBQ0gsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsS0FBSyxFQUFFLEdBQUc7NEJBQ1YsSUFBSSxFQUFFLGNBQWM7NEJBQ3BCLGFBQWEsRUFBRSxHQUFHO3lCQUNuQjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUVGLE1BQU0sQ0FBQyxNQUFNLElBQUEsaUJBQVcsRUFBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXFDdEUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdkQsTUFBTSxNQUFNLEdBQWM7WUFDeEIsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRTtvQkFDSixXQUFXLEVBQUUsdUJBQXVCO29CQUNwQyxPQUFPLEVBQUU7d0JBQ1AsR0FBRyxFQUFFOzRCQUNILElBQUksRUFBRSxTQUFTOzRCQUNmLE9BQU8sRUFBRSxJQUFBLGVBQUUsRUFDVCxpQkFBSTtpQ0FDRCxHQUFHLENBQUMsSUFBSSx3QkFBVyxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztpQ0FDN0MsSUFBSSxDQUFDLGlCQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQy9DO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sSUFBQSxpQkFBVyxFQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FDeEQsa0NBQWtDLENBQ25DLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1REFBdUQsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN2RSxNQUFNLE1BQU0sR0FBYztZQUN4QixRQUFRLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFO29CQUNOLFdBQVcsRUFBRSxtQkFBbUI7b0JBQ2hDLE9BQU8sRUFBRTt3QkFDUCxDQUFDLG1CQUFtQixDQUFDLEVBQUU7NEJBQ3JCLElBQUksRUFBRSxPQUFPOzRCQUNiLElBQUksRUFBRSxtQkFBbUI7eUJBQzFCO3dCQUNELENBQUMsYUFBYSxDQUFDLEVBQUU7NEJBQ2YsSUFBSSxFQUFFLE9BQU87NEJBQ2IsSUFBSSxFQUFFLGFBQWE7eUJBQ3BCO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxhQUFhLEVBQUUsRUFBRTtTQUNsQixDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sSUFBQSxpQkFBVyxFQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0EwQ3RFLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAkRSwgZXhwciwgVGhpbmdTeW1ib2wgfSBmcm9tICdAY2RrbGFicy90eXBld3JpdGVyJztcbmltcG9ydCB7IENsaUNvbmZpZywgQ2xpSGVscGVycywgcmVuZGVyWWFyZ3MgfSBmcm9tICcuLi9saWInO1xuXG5jb25zdCBZQVJHU19IRUxQRVJTID0gbmV3IENsaUhlbHBlcnMoJy4vdXRpbC95YXJncy1oZWxwZXJzJyk7XG5cbmRlc2NyaWJlKCdyZW5kZXInLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiBnZW5lcmF0ZSBnbG9iYWwgb3B0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjb25maWc6IENsaUNvbmZpZyA9IHtcbiAgICAgIGdsb2JhbE9wdGlvbnM6IHtcbiAgICAgICAgb25lOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgYWxpYXM6ICdvJyxcbiAgICAgICAgICBkZXNjOiAndGV4dCBmb3Igb25lJyxcbiAgICAgICAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgdHdvOiB7IHR5cGU6ICdudW1iZXInLCBkZXNjOiAndGV4dCBmb3IgdHdvJyB9LFxuICAgICAgICB0aHJlZToge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgYWxpYXM6ICd0JyxcbiAgICAgICAgICBkZXNjOiAndGV4dCBmb3IgdGhyZWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNvbW1hbmRzOiB7fSxcbiAgICB9O1xuXG4gICAgZXhwZWN0KGF3YWl0IHJlbmRlcllhcmdzKGNvbmZpZywgWUFSR1NfSEVMUEVSUykpLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICBcIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEdFTkVSQVRFRCBGUk9NIHBhY2thZ2VzL2F3cy1jZGsvbGliL2NvbmZpZy50cy5cbiAgICAgIC8vIERvIG5vdCBlZGl0IGJ5IGhhbmQ7IGFsbCBjaGFuZ2VzIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYXQgYnVpbGQgdGltZSBmcm9tIHRoZSBjb25maWcgZmlsZS5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgaW1wb3J0IHsgQXJndiB9IGZyb20gJ3lhcmdzJztcbiAgICAgIGltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi91dGlsL3lhcmdzLWhlbHBlcnMnO1xuXG4gICAgICAvLyBAdHMtaWdub3JlIFRTNjEzM1xuICAgICAgZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tbWFuZExpbmVBcmd1bWVudHMoYXJnczogQXJyYXk8c3RyaW5nPik6IGFueSB7XG4gICAgICAgIHJldHVybiB5YXJnc1xuICAgICAgICAgIC5lbnYoJ0NESycpXG4gICAgICAgICAgLnVzYWdlKCdVc2FnZTogY2RrIC1hIDxjZGstYXBwPiBDT01NQU5EJylcbiAgICAgICAgICAub3B0aW9uKCdvbmUnLCB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGFsaWFzOiAnbycsXG4gICAgICAgICAgICBkZXNjOiAndGV4dCBmb3Igb25lJyxcbiAgICAgICAgICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndHdvJywge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZXNjOiAndGV4dCBmb3IgdHdvJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3RocmVlJywge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgYWxpYXM6ICd0JyxcbiAgICAgICAgICAgIGRlc2M6ICd0ZXh0IGZvciB0aHJlZScsXG4gICAgICAgICAgICBuYXJnczogMSxcbiAgICAgICAgICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnZlcnNpb24oaGVscGVycy5jbGlWZXJzaW9uKCkpXG4gICAgICAgICAgLmRlbWFuZENvbW1hbmQoMSwgJycpXG4gICAgICAgICAgLnJlY29tbWVuZENvbW1hbmRzKClcbiAgICAgICAgICAuaGVscCgpXG4gICAgICAgICAgLmFsaWFzKCdoJywgJ2hlbHAnKVxuICAgICAgICAgIC5lcGlsb2d1ZShcbiAgICAgICAgICAgICdJZiB5b3VyIGFwcCBoYXMgYSBzaW5nbGUgc3RhY2ssIHRoZXJlIGlzIG5vIG5lZWQgdG8gc3BlY2lmeSB0aGUgc3RhY2sgbmFtZVxcXFxuXFxcXG5JZiBvbmUgb2YgY2RrLmpzb24gb3Igfi8uY2RrLmpzb24gZXhpc3RzLCBvcHRpb25zIHNwZWNpZmllZCB0aGVyZSB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdHMuIFNldHRpbmdzIGluIGNkay5qc29uIHRha2UgcHJlY2VkZW5jZS4nLFxuICAgICAgICAgIClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG4gICAgICB9IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICBjb25zdCB5YXJncyA9IHJlcXVpcmUoJ3lhcmdzJyk7XG4gICAgICBcIlxuICAgIGApO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZ2VuZXJhdGUgbmVnYXRpdmVBbGlhcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjb25maWc6IENsaUNvbmZpZyA9IHtcbiAgICAgIGdsb2JhbE9wdGlvbnM6IHt9LFxuICAgICAgY29tbWFuZHM6IHtcbiAgICAgICAgdGVzdDoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFjdGlvbiB1bmRlciB0ZXN0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBvbmU6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICBhbGlhczogJ28nLFxuICAgICAgICAgICAgICBkZXNjOiAndGV4dCBmb3Igb25lJyxcbiAgICAgICAgICAgICAgbmVnYXRpdmVBbGlhczogJ08nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgZXhwZWN0KGF3YWl0IHJlbmRlcllhcmdzKGNvbmZpZywgWUFSR1NfSEVMUEVSUykpLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICBcIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEdFTkVSQVRFRCBGUk9NIHBhY2thZ2VzL2F3cy1jZGsvbGliL2NvbmZpZy50cy5cbiAgICAgIC8vIERvIG5vdCBlZGl0IGJ5IGhhbmQ7IGFsbCBjaGFuZ2VzIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYXQgYnVpbGQgdGltZSBmcm9tIHRoZSBjb25maWcgZmlsZS5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgaW1wb3J0IHsgQXJndiB9IGZyb20gJ3lhcmdzJztcbiAgICAgIGltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi91dGlsL3lhcmdzLWhlbHBlcnMnO1xuXG4gICAgICAvLyBAdHMtaWdub3JlIFRTNjEzM1xuICAgICAgZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tbWFuZExpbmVBcmd1bWVudHMoYXJnczogQXJyYXk8c3RyaW5nPik6IGFueSB7XG4gICAgICAgIHJldHVybiB5YXJnc1xuICAgICAgICAgIC5lbnYoJ0NESycpXG4gICAgICAgICAgLnVzYWdlKCdVc2FnZTogY2RrIC1hIDxjZGstYXBwPiBDT01NQU5EJylcbiAgICAgICAgICAuY29tbWFuZCgndGVzdCcsICd0aGUgYWN0aW9uIHVuZGVyIHRlc3QnLCAoeWFyZ3M6IEFyZ3YpID0+XG4gICAgICAgICAgICB5YXJnc1xuICAgICAgICAgICAgICAub3B0aW9uKCdvbmUnLCB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICBhbGlhczogJ28nLFxuICAgICAgICAgICAgICAgIGRlc2M6ICd0ZXh0IGZvciBvbmUnLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAub3B0aW9uKCdPJywgeyB0eXBlOiAnYm9vbGVhbicsIGhpZGRlbjogdHJ1ZSB9KVxuICAgICAgICAgICAgICAubWlkZGxld2FyZShoZWxwZXJzLnlhcmdzTmVnYXRpdmVBbGlhcygnTycsICdvbmUnKSwgdHJ1ZSksXG4gICAgICAgICAgKVxuICAgICAgICAgIC52ZXJzaW9uKGhlbHBlcnMuY2xpVmVyc2lvbigpKVxuICAgICAgICAgIC5kZW1hbmRDb21tYW5kKDEsICcnKVxuICAgICAgICAgIC5yZWNvbW1lbmRDb21tYW5kcygpXG4gICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgIC5hbGlhcygnaCcsICdoZWxwJylcbiAgICAgICAgICAuZXBpbG9ndWUoXG4gICAgICAgICAgICAnSWYgeW91ciBhcHAgaGFzIGEgc2luZ2xlIHN0YWNrLCB0aGVyZSBpcyBubyBuZWVkIHRvIHNwZWNpZnkgdGhlIHN0YWNrIG5hbWVcXFxcblxcXFxuSWYgb25lIG9mIGNkay5qc29uIG9yIH4vLmNkay5qc29uIGV4aXN0cywgb3B0aW9ucyBzcGVjaWZpZWQgdGhlcmUgd2lsbCBiZSB1c2VkIGFzIGRlZmF1bHRzLiBTZXR0aW5ncyBpbiBjZGsuanNvbiB0YWtlIHByZWNlZGVuY2UuJyxcbiAgICAgICAgICApXG4gICAgICAgICAgLnBhcnNlKGFyZ3MpO1xuICAgICAgfSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgY29uc3QgeWFyZ3MgPSByZXF1aXJlKCd5YXJncycpO1xuICAgICAgXCJcbiAgICBgKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHBhc3MtdGhyb3VnaCBleHByZXNzaW9uIHVuY2hhbmdlZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjb25maWc6IENsaUNvbmZpZyA9IHtcbiAgICAgIGdsb2JhbE9wdGlvbnM6IHt9LFxuICAgICAgY29tbWFuZHM6IHtcbiAgICAgICAgdGVzdDoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFjdGlvbiB1bmRlciB0ZXN0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBvbmU6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICBkZWZhdWx0OiAkRShcbiAgICAgICAgICAgICAgICBleHByXG4gICAgICAgICAgICAgICAgICAuc3ltKG5ldyBUaGluZ1N5bWJvbCgnYmFuYW5hJywgWUFSR1NfSEVMUEVSUykpXG4gICAgICAgICAgICAgICAgICAuY2FsbChleHByLmxpdCgxKSwgZXhwci5saXQoMiksIGV4cHIubGl0KDMpKSxcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGV4cGVjdChhd2FpdCByZW5kZXJZYXJncyhjb25maWcsIFlBUkdTX0hFTFBFUlMpKS50b0NvbnRhaW4oXG4gICAgICAnZGVmYXVsdDogaGVscGVycy5iYW5hbmEoMSwgMiwgMyknLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpYWwgbm90aWZpY2F0aW9uLWFybiBvcHRpb24gZ2V0cyBOTyBkZWZhdWx0IHZhbHVlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGNvbmZpZzogQ2xpQ29uZmlnID0ge1xuICAgICAgY29tbWFuZHM6IHtcbiAgICAgICAgZGVwbG95OiB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdOb3RpZmljYXRpb24gQXJucycsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgWydub3RpZmljYXRpb24tYXJucyddOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgIGRlc2M6ICdEZXBsb3kgYWxsIHN0YWNrcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWydvdGhlci1hcnJheSddOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgIGRlc2M6ICdPdGhlciBhcnJheScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZ2xvYmFsT3B0aW9uczoge30sXG4gICAgfTtcblxuICAgIGV4cGVjdChhd2FpdCByZW5kZXJZYXJncyhjb25maWcsIFlBUkdTX0hFTFBFUlMpKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAgXCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBHRU5FUkFURUQgRlJPTSBwYWNrYWdlcy9hd3MtY2RrL2xpYi9jb25maWcudHMuXG4gICAgICAvLyBEbyBub3QgZWRpdCBieSBoYW5kOyBhbGwgY2hhbmdlcyB3aWxsIGJlIG92ZXJ3cml0dGVuIGF0IGJ1aWxkIHRpbWUgZnJvbSB0aGUgY29uZmlnIGZpbGUuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgIGltcG9ydCB7IEFyZ3YgfSBmcm9tICd5YXJncyc7XG4gICAgICBpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vdXRpbC95YXJncy1oZWxwZXJzJztcblxuICAgICAgLy8gQHRzLWlnbm9yZSBUUzYxMzNcbiAgICAgIGV4cG9ydCBmdW5jdGlvbiBwYXJzZUNvbW1hbmRMaW5lQXJndW1lbnRzKGFyZ3M6IEFycmF5PHN0cmluZz4pOiBhbnkge1xuICAgICAgICByZXR1cm4geWFyZ3NcbiAgICAgICAgICAuZW52KCdDREsnKVxuICAgICAgICAgIC51c2FnZSgnVXNhZ2U6IGNkayAtYSA8Y2RrLWFwcD4gQ09NTUFORCcpXG4gICAgICAgICAgLmNvbW1hbmQoJ2RlcGxveScsICdOb3RpZmljYXRpb24gQXJucycsICh5YXJnczogQXJndikgPT5cbiAgICAgICAgICAgIHlhcmdzXG4gICAgICAgICAgICAgIC5vcHRpb24oJ25vdGlmaWNhdGlvbi1hcm5zJywge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgZGVzYzogJ0RlcGxveSBhbGwgc3RhY2tzJyxcbiAgICAgICAgICAgICAgICBuYXJnczogMSxcbiAgICAgICAgICAgICAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLm9wdGlvbignb3RoZXItYXJyYXknLCB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICBkZXNjOiAnT3RoZXIgYXJyYXknLFxuICAgICAgICAgICAgICAgIG5hcmdzOiAxLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICApXG4gICAgICAgICAgLnZlcnNpb24oaGVscGVycy5jbGlWZXJzaW9uKCkpXG4gICAgICAgICAgLmRlbWFuZENvbW1hbmQoMSwgJycpXG4gICAgICAgICAgLnJlY29tbWVuZENvbW1hbmRzKClcbiAgICAgICAgICAuaGVscCgpXG4gICAgICAgICAgLmFsaWFzKCdoJywgJ2hlbHAnKVxuICAgICAgICAgIC5lcGlsb2d1ZShcbiAgICAgICAgICAgICdJZiB5b3VyIGFwcCBoYXMgYSBzaW5nbGUgc3RhY2ssIHRoZXJlIGlzIG5vIG5lZWQgdG8gc3BlY2lmeSB0aGUgc3RhY2sgbmFtZVxcXFxuXFxcXG5JZiBvbmUgb2YgY2RrLmpzb24gb3Igfi8uY2RrLmpzb24gZXhpc3RzLCBvcHRpb25zIHNwZWNpZmllZCB0aGVyZSB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdHMuIFNldHRpbmdzIGluIGNkay5qc29uIHRha2UgcHJlY2VkZW5jZS4nLFxuICAgICAgICAgIClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG4gICAgICB9IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICBjb25zdCB5YXJncyA9IHJlcXVpcmUoJ3lhcmdzJyk7XG4gICAgICBcIlxuICAgIGApO1xuICB9KTtcbn0pO1xuIl19