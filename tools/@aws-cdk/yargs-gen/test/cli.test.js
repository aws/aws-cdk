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
      /* eslint-disable @typescript-eslint/comma-dangle, comma-spacing, max-len, quotes, quote-props */
      import { Argv } from 'yargs';
      import * as helpers from './util/yargs-helpers';

      // @ts-ignore TS6133
      export function parseCommandLineArguments(args: Array<string>): any {
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
          .version(helpers.cliVersion())
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
      /* eslint-disable @typescript-eslint/comma-dangle, comma-spacing, max-len, quotes, quote-props */
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
                type: 'boolean',
                alias: 'o',
                desc: 'text for one',
              })
              .option('O', { type: 'boolean', hidden: true })
              .middleware(helpers.yargsNegativeAlias('O', 'one'), true)
          )
          .version(helpers.cliVersion())
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUE0RDtBQUM1RCxnQ0FBNEQ7QUFFNUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxnQkFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFN0QsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdDLE1BQU0sTUFBTSxHQUFjO1lBQ3hCLGFBQWEsRUFBRTtnQkFDYixHQUFHLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFLEdBQUc7b0JBQ1YsSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLFdBQVcsRUFBRSxJQUFJO2lCQUNsQjtnQkFDRCxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUU7Z0JBQzdDLEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsT0FBTztvQkFDYixLQUFLLEVBQUUsR0FBRztvQkFDVixJQUFJLEVBQUUsZ0JBQWdCO2lCQUN2QjthQUNGO1lBQ0QsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sSUFBQSxpQkFBVyxFQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBMkN0RSxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1QyxNQUFNLE1BQU0sR0FBYztZQUN4QixhQUFhLEVBQUUsRUFBRTtZQUNqQixRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLFdBQVcsRUFBRSx1QkFBdUI7b0JBQ3BDLE9BQU8sRUFBRTt3QkFDUCxHQUFHLEVBQUU7NEJBQ0gsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsS0FBSyxFQUFFLEdBQUc7NEJBQ1YsSUFBSSxFQUFFLGNBQWM7NEJBQ3BCLGFBQWEsRUFBRSxHQUFHO3lCQUNuQjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUVGLE1BQU0sQ0FBQyxNQUFNLElBQUEsaUJBQVcsRUFBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBb0N0RSxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN2RCxNQUFNLE1BQU0sR0FBYztZQUN4QixhQUFhLEVBQUUsRUFBRTtZQUNqQixRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLFdBQVcsRUFBRSx1QkFBdUI7b0JBQ3BDLE9BQU8sRUFBRTt3QkFDUCxHQUFHLEVBQUU7NEJBQ0gsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsT0FBTyxFQUFFLElBQUEsZUFBRSxFQUNULGlCQUFJO2lDQUNELEdBQUcsQ0FBQyxJQUFJLHdCQUFXLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2lDQUM3QyxJQUFJLENBQUMsaUJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDL0M7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxJQUFBLGlCQUFXLEVBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDakcsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ICRFLCBleHByLCBUaGluZ1N5bWJvbCB9IGZyb20gJ0BjZGtsYWJzL3R5cGV3cml0ZXInO1xuaW1wb3J0IHsgQ2xpQ29uZmlnLCBDbGlIZWxwZXJzLCByZW5kZXJZYXJncyB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IFlBUkdTX0hFTFBFUlMgPSBuZXcgQ2xpSGVscGVycygnLi91dGlsL3lhcmdzLWhlbHBlcnMnKTtcblxuZGVzY3JpYmUoJ3JlbmRlcicsICgpID0+IHtcbiAgdGVzdCgnY2FuIGdlbmVyYXRlIGdsb2JhbCBvcHRpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGNvbmZpZzogQ2xpQ29uZmlnID0ge1xuICAgICAgZ2xvYmFsT3B0aW9uczoge1xuICAgICAgICBvbmU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBhbGlhczogJ28nLFxuICAgICAgICAgIGRlc2M6ICd0ZXh0IGZvciBvbmUnLFxuICAgICAgICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICB0d286IHsgdHlwZTogJ251bWJlcicsIGRlc2M6ICd0ZXh0IGZvciB0d28nIH0sXG4gICAgICAgIHRocmVlOiB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBhbGlhczogJ3QnLFxuICAgICAgICAgIGRlc2M6ICd0ZXh0IGZvciB0aHJlZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY29tbWFuZHM6IHt9LFxuICAgIH07XG5cbiAgICBleHBlY3QoYXdhaXQgcmVuZGVyWWFyZ3MoY29uZmlnLCBZQVJHU19IRUxQRVJTKSkudG9NYXRjaElubGluZVNuYXBzaG90KGBcbiAgICAgIFwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gR0VORVJBVEVEIEZST00gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzLlxuICAgICAgLy8gRG8gbm90IGVkaXQgYnkgaGFuZDsgYWxsIGNoYW5nZXMgd2lsbCBiZSBvdmVyd3JpdHRlbiBhdCBidWlsZCB0aW1lIGZyb20gdGhlIGNvbmZpZyBmaWxlLlxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2NvbW1hLWRhbmdsZSwgY29tbWEtc3BhY2luZywgbWF4LWxlbiwgcXVvdGVzLCBxdW90ZS1wcm9wcyAqL1xuICAgICAgaW1wb3J0IHsgQXJndiB9IGZyb20gJ3lhcmdzJztcbiAgICAgIGltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi91dGlsL3lhcmdzLWhlbHBlcnMnO1xuXG4gICAgICAvLyBAdHMtaWdub3JlIFRTNjEzM1xuICAgICAgZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tbWFuZExpbmVBcmd1bWVudHMoYXJnczogQXJyYXk8c3RyaW5nPik6IGFueSB7XG4gICAgICAgIHJldHVybiB5YXJnc1xuICAgICAgICAgIC5lbnYoJ0NESycpXG4gICAgICAgICAgLnVzYWdlKCdVc2FnZTogY2RrIC1hIDxjZGstYXBwPiBDT01NQU5EJylcbiAgICAgICAgICAub3B0aW9uKCdvbmUnLCB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGFsaWFzOiAnbycsXG4gICAgICAgICAgICBkZXNjOiAndGV4dCBmb3Igb25lJyxcbiAgICAgICAgICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndHdvJywge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZXNjOiAndGV4dCBmb3IgdHdvJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3RocmVlJywge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGFsaWFzOiAndCcsXG4gICAgICAgICAgICBkZXNjOiAndGV4dCBmb3IgdGhyZWUnLFxuICAgICAgICAgICAgbmFyZ3M6IDEsXG4gICAgICAgICAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC52ZXJzaW9uKGhlbHBlcnMuY2xpVmVyc2lvbigpKVxuICAgICAgICAgIC5kZW1hbmRDb21tYW5kKDEsICcnKVxuICAgICAgICAgIC5yZWNvbW1lbmRDb21tYW5kcygpXG4gICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgIC5hbGlhcygnaCcsICdoZWxwJylcbiAgICAgICAgICAuZXBpbG9ndWUoXG4gICAgICAgICAgICAnSWYgeW91ciBhcHAgaGFzIGEgc2luZ2xlIHN0YWNrLCB0aGVyZSBpcyBubyBuZWVkIHRvIHNwZWNpZnkgdGhlIHN0YWNrIG5hbWVcXFxcblxcXFxuSWYgb25lIG9mIGNkay5qc29uIG9yIH4vLmNkay5qc29uIGV4aXN0cywgb3B0aW9ucyBzcGVjaWZpZWQgdGhlcmUgd2lsbCBiZSB1c2VkIGFzIGRlZmF1bHRzLiBTZXR0aW5ncyBpbiBjZGsuanNvbiB0YWtlIHByZWNlZGVuY2UuJ1xuICAgICAgICAgIClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG4gICAgICB9IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICBjb25zdCB5YXJncyA9IHJlcXVpcmUoJ3lhcmdzJyk7XG4gICAgICBcIlxuICAgIGApO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZ2VuZXJhdGUgbmVnYXRpdmVBbGlhcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjb25maWc6IENsaUNvbmZpZyA9IHtcbiAgICAgIGdsb2JhbE9wdGlvbnM6IHt9LFxuICAgICAgY29tbWFuZHM6IHtcbiAgICAgICAgdGVzdDoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFjdGlvbiB1bmRlciB0ZXN0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBvbmU6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICBhbGlhczogJ28nLFxuICAgICAgICAgICAgICBkZXNjOiAndGV4dCBmb3Igb25lJyxcbiAgICAgICAgICAgICAgbmVnYXRpdmVBbGlhczogJ08nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgZXhwZWN0KGF3YWl0IHJlbmRlcllhcmdzKGNvbmZpZywgWUFSR1NfSEVMUEVSUykpLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICBcIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEdFTkVSQVRFRCBGUk9NIHBhY2thZ2VzL2F3cy1jZGsvbGliL2NvbmZpZy50cy5cbiAgICAgIC8vIERvIG5vdCBlZGl0IGJ5IGhhbmQ7IGFsbCBjaGFuZ2VzIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYXQgYnVpbGQgdGltZSBmcm9tIHRoZSBjb25maWcgZmlsZS5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9jb21tYS1kYW5nbGUsIGNvbW1hLXNwYWNpbmcsIG1heC1sZW4sIHF1b3RlcywgcXVvdGUtcHJvcHMgKi9cbiAgICAgIGltcG9ydCB7IEFyZ3YgfSBmcm9tICd5YXJncyc7XG4gICAgICBpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vdXRpbC95YXJncy1oZWxwZXJzJztcblxuICAgICAgLy8gQHRzLWlnbm9yZSBUUzYxMzNcbiAgICAgIGV4cG9ydCBmdW5jdGlvbiBwYXJzZUNvbW1hbmRMaW5lQXJndW1lbnRzKGFyZ3M6IEFycmF5PHN0cmluZz4pOiBhbnkge1xuICAgICAgICByZXR1cm4geWFyZ3NcbiAgICAgICAgICAuZW52KCdDREsnKVxuICAgICAgICAgIC51c2FnZSgnVXNhZ2U6IGNkayAtYSA8Y2RrLWFwcD4gQ09NTUFORCcpXG4gICAgICAgICAgLmNvbW1hbmQoJ3Rlc3QnLCAndGhlIGFjdGlvbiB1bmRlciB0ZXN0JywgKHlhcmdzOiBBcmd2KSA9PlxuICAgICAgICAgICAgeWFyZ3NcbiAgICAgICAgICAgICAgLm9wdGlvbignb25lJywge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICBhbGlhczogJ28nLFxuICAgICAgICAgICAgICAgIGRlc2M6ICd0ZXh0IGZvciBvbmUnLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAub3B0aW9uKCdPJywgeyB0eXBlOiAnYm9vbGVhbicsIGhpZGRlbjogdHJ1ZSB9KVxuICAgICAgICAgICAgICAubWlkZGxld2FyZShoZWxwZXJzLnlhcmdzTmVnYXRpdmVBbGlhcygnTycsICdvbmUnKSwgdHJ1ZSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnZlcnNpb24oaGVscGVycy5jbGlWZXJzaW9uKCkpXG4gICAgICAgICAgLmRlbWFuZENvbW1hbmQoMSwgJycpXG4gICAgICAgICAgLnJlY29tbWVuZENvbW1hbmRzKClcbiAgICAgICAgICAuaGVscCgpXG4gICAgICAgICAgLmFsaWFzKCdoJywgJ2hlbHAnKVxuICAgICAgICAgIC5lcGlsb2d1ZShcbiAgICAgICAgICAgICdJZiB5b3VyIGFwcCBoYXMgYSBzaW5nbGUgc3RhY2ssIHRoZXJlIGlzIG5vIG5lZWQgdG8gc3BlY2lmeSB0aGUgc3RhY2sgbmFtZVxcXFxuXFxcXG5JZiBvbmUgb2YgY2RrLmpzb24gb3Igfi8uY2RrLmpzb24gZXhpc3RzLCBvcHRpb25zIHNwZWNpZmllZCB0aGVyZSB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdHMuIFNldHRpbmdzIGluIGNkay5qc29uIHRha2UgcHJlY2VkZW5jZS4nXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wYXJzZShhcmdzKTtcbiAgICAgIH0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICAgIGNvbnN0IHlhcmdzID0gcmVxdWlyZSgneWFyZ3MnKTtcbiAgICAgIFwiXG4gICAgYCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBwYXNzLXRocm91Z2ggZXhwcmVzc2lvbiB1bmNoYW5nZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY29uZmlnOiBDbGlDb25maWcgPSB7XG4gICAgICBnbG9iYWxPcHRpb25zOiB7fSxcbiAgICAgIGNvbW1hbmRzOiB7XG4gICAgICAgIHRlc3Q6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ3RoZSBhY3Rpb24gdW5kZXIgdGVzdCcsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgb25lOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgZGVmYXVsdDogJEUoXG4gICAgICAgICAgICAgICAgZXhwclxuICAgICAgICAgICAgICAgICAgLnN5bShuZXcgVGhpbmdTeW1ib2woJ2JhbmFuYScsIFlBUkdTX0hFTFBFUlMpKVxuICAgICAgICAgICAgICAgICAgLmNhbGwoZXhwci5saXQoMSksIGV4cHIubGl0KDIpLCBleHByLmxpdCgzKSksXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBleHBlY3QoYXdhaXQgcmVuZGVyWWFyZ3MoY29uZmlnLCBZQVJHU19IRUxQRVJTKSkudG9Db250YWluKCdkZWZhdWx0OiBoZWxwZXJzLmJhbmFuYSgxLCAyLCAzKScpO1xuICB9KTtcbn0pO1xuIl19