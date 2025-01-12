"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
describe('render', () => {
    test('can generate conversion function', async () => {
        const config = {
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
        expect(await (0, lib_1.renderCliArgsFunc)(config)).toMatchInlineSnapshot(`
      "// -------------------------------------------------------------------------------------------
      // GENERATED FROM packages/aws-cdk/lib/config.ts.
      // Do not edit by hand; all changes will be overwritten at build time from the config file.
      // -------------------------------------------------------------------------------------------
      /* eslint-disable @stylistic/max-len */
      import { CliArguments, GlobalOptions } from './cli-arguments';
      import { Command } from './settings';

      // @ts-ignore TS6133
      export function convertToCliArgs(args: any): CliArguments {
        const globalOptions: GlobalOptions = {
          app: args.app,
          debug: args.debug,
          context: args.context,
          plugin: args.plugin,
        };
        let commandOptions;
        switch (args._[0] as Command) {
          case 'deploy':
            commandOptions = {
              all: args.all,
              STACKS: args.STACKS,
            };
            break;
        }
        const cliArguments: CliArguments = {
          _: args._[0],
          globalOptions,
          [args._[0]]: commandOptions,
        };

        return cliArguments;
      }
      "
    `);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWFyZ3MtZnVuY3Rpb24tZ2VuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbGktYXJncy1mdW5jdGlvbi1nZW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUFzRDtBQUV0RCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixJQUFJLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEQsTUFBTSxNQUFNLEdBQWM7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLEdBQUcsRUFBRTtvQkFDSCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxJQUFJLEVBQUUsK0NBQStDO2lCQUN0RDtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsSUFBSSxFQUFFLHNCQUFzQjtvQkFDNUIsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLE9BQU8sRUFBRSxFQUFFO29CQUNYLElBQUksRUFBRSxPQUFPO29CQUNiLEtBQUssRUFBRSxHQUFHO29CQUNWLElBQUksRUFBRSxnQkFBZ0I7aUJBQ3ZCO2dCQUNELE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsT0FBTztvQkFDYixJQUFJLEVBQUUsaUJBQWlCO2lCQUN4QjthQUNGO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRTtvQkFDTixHQUFHLEVBQUU7d0JBQ0gsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsUUFBUSxFQUFFLElBQUk7cUJBQ2Y7b0JBQ0QsV0FBVyxFQUFFLGdCQUFnQjtvQkFDN0IsT0FBTyxFQUFFO3dCQUNQLEdBQUcsRUFBRTs0QkFDSCxJQUFJLEVBQUUsU0FBUzs0QkFDZixJQUFJLEVBQUUsbUJBQW1COzRCQUN6QixPQUFPLEVBQUUsS0FBSzt5QkFDZjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUVGLE1BQU0sQ0FBQyxNQUFNLElBQUEsdUJBQWlCLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FtQzdELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDbGlDb25maWcsIHJlbmRlckNsaUFyZ3NGdW5jIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3JlbmRlcicsICgpID0+IHtcbiAgdGVzdCgnY2FuIGdlbmVyYXRlIGNvbnZlcnNpb24gZnVuY3Rpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY29uZmlnOiBDbGlDb25maWcgPSB7XG4gICAgICBnbG9iYWxPcHRpb25zOiB7XG4gICAgICAgIGFwcDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2M6ICdSRVFVSVJFRDogQ29tbWFuZC1saW5lIGZvciBleGVjdXRpbmcgeW91ciBhcHAnLFxuICAgICAgICB9LFxuICAgICAgICBkZWJ1Zzoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZXNjOiAnRW5hYmxlIGRlYnVnIGxvZ2dpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBhbGlhczogJ2MnLFxuICAgICAgICAgIGRlc2M6ICdjb250ZXh0IHZhbHVlcycsXG4gICAgICAgIH0sXG4gICAgICAgIHBsdWdpbjoge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgZGVzYzogJ3BsdWdpbnMgdG8gbG9hZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY29tbWFuZHM6IHtcbiAgICAgICAgZGVwbG95OiB7XG4gICAgICAgICAgYXJnOiB7XG4gICAgICAgICAgICBuYW1lOiAnU1RBQ0tTJyxcbiAgICAgICAgICAgIHZhcmlhZGljOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdEZXBsb3kgYSBzdGFjaycsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgYWxsOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgZGVzYzogJ0RlcGxveSBhbGwgc3RhY2tzJyxcbiAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBleHBlY3QoYXdhaXQgcmVuZGVyQ2xpQXJnc0Z1bmMoY29uZmlnKSkudG9NYXRjaElubGluZVNuYXBzaG90KGBcbiAgICAgIFwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gR0VORVJBVEVEIEZST00gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzLlxuICAgICAgLy8gRG8gbm90IGVkaXQgYnkgaGFuZDsgYWxsIGNoYW5nZXMgd2lsbCBiZSBvdmVyd3JpdHRlbiBhdCBidWlsZCB0aW1lIGZyb20gdGhlIGNvbmZpZyBmaWxlLlxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLyogZXNsaW50LWRpc2FibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICBpbXBvcnQgeyBDbGlBcmd1bWVudHMsIEdsb2JhbE9wdGlvbnMgfSBmcm9tICcuL2NsaS1hcmd1bWVudHMnO1xuICAgICAgaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vc2V0dGluZ3MnO1xuXG4gICAgICAvLyBAdHMtaWdub3JlIFRTNjEzM1xuICAgICAgZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb0NsaUFyZ3MoYXJnczogYW55KTogQ2xpQXJndW1lbnRzIHtcbiAgICAgICAgY29uc3QgZ2xvYmFsT3B0aW9uczogR2xvYmFsT3B0aW9ucyA9IHtcbiAgICAgICAgICBhcHA6IGFyZ3MuYXBwLFxuICAgICAgICAgIGRlYnVnOiBhcmdzLmRlYnVnLFxuICAgICAgICAgIGNvbnRleHQ6IGFyZ3MuY29udGV4dCxcbiAgICAgICAgICBwbHVnaW46IGFyZ3MucGx1Z2luLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgY29tbWFuZE9wdGlvbnM7XG4gICAgICAgIHN3aXRjaCAoYXJncy5fWzBdIGFzIENvbW1hbmQpIHtcbiAgICAgICAgICBjYXNlICdkZXBsb3knOlxuICAgICAgICAgICAgY29tbWFuZE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIGFsbDogYXJncy5hbGwsXG4gICAgICAgICAgICAgIFNUQUNLUzogYXJncy5TVEFDS1MsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2xpQXJndW1lbnRzOiBDbGlBcmd1bWVudHMgPSB7XG4gICAgICAgICAgXzogYXJncy5fWzBdLFxuICAgICAgICAgIGdsb2JhbE9wdGlvbnMsXG4gICAgICAgICAgW2FyZ3MuX1swXV06IGNvbW1hbmRPcHRpb25zLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjbGlBcmd1bWVudHM7XG4gICAgICB9XG4gICAgICBcIlxuICAgIGApO1xuICB9KTtcbn0pO1xuIl19