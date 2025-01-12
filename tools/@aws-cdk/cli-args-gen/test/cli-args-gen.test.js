"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
describe('render', () => {
    test('can generate CliArguments type', async () => {
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
        expect(await (0, lib_1.renderCliArgsType)(config)).toMatchInlineSnapshot(`
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
         * The CLI command name
         */
        readonly _: Command;

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
        expect(await (0, lib_1.renderCliArgsType)(config)).toMatchInlineSnapshot(`
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
         * The CLI command name
         */
        readonly _: Command;

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
    test('positional arguments', async () => {
        const config = {
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
        expect(await (0, lib_1.renderCliArgsType)(config)).toMatchInlineSnapshot(`
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
         * The CLI command name
         */
        readonly _: Command;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWFyZ3MtZ2VuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbGktYXJncy1nZW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUFzRDtBQUV0RCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixJQUFJLENBQUMsZ0NBQWdDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDaEQsTUFBTSxNQUFNLEdBQWM7WUFDeEIsYUFBYSxFQUFFO2dCQUNiLEdBQUcsRUFBRTtvQkFDSCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxJQUFJLEVBQUUsK0NBQStDO2lCQUN0RDtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsSUFBSSxFQUFFLHNCQUFzQjtvQkFDNUIsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxTQUFTO29CQUNmLEtBQUssRUFBRSxJQUFJO29CQUNYLElBQUksRUFBRSw0QkFBNEI7aUJBQ25DO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxPQUFPLEVBQUUsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixLQUFLLEVBQUUsR0FBRztvQkFDVixJQUFJLEVBQUUsZ0JBQWdCO2lCQUN2QjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLE9BQU87b0JBQ2IsSUFBSSxFQUFFLGlCQUFpQjtpQkFDeEI7YUFDRjtZQUNELFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUU7b0JBQ04sV0FBVyxFQUFFLGdCQUFnQjtvQkFDN0IsT0FBTyxFQUFFO3dCQUNQLEdBQUcsRUFBRTs0QkFDSCxJQUFJLEVBQUUsU0FBUzs0QkFDZixJQUFJLEVBQUUsbUJBQW1COzRCQUN6QixPQUFPLEVBQUUsS0FBSzt5QkFDZjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUVGLE1BQU0sQ0FBQyxNQUFNLElBQUEsdUJBQWlCLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FzRjdELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hFLE1BQU0sTUFBTSxHQUFjO1lBQ3hCLFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUU7b0JBQ04sV0FBVyxFQUFFLG1CQUFtQjtvQkFDaEMsT0FBTyxFQUFFO3dCQUNQLENBQUMsbUJBQW1CLENBQUMsRUFBRTs0QkFDckIsSUFBSSxFQUFFLE9BQU87NEJBQ2IsSUFBSSxFQUFFLG1CQUFtQjt5QkFDMUI7d0JBQ0QsQ0FBQyxhQUFhLENBQUMsRUFBRTs0QkFDZixJQUFJLEVBQUUsT0FBTzs0QkFDYixJQUFJLEVBQUUsYUFBYTt5QkFDcEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELGFBQWEsRUFBRSxFQUFFO1NBQ2xCLENBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxJQUFBLHVCQUFpQixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0EwRDdELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RDLE1BQU0sTUFBTSxHQUFjO1lBQ3hCLFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUU7b0JBQ04sR0FBRyxFQUFFO3dCQUNILElBQUksRUFBRSxRQUFRO3dCQUNkLFFBQVEsRUFBRSxJQUFJO3FCQUNmO29CQUNELFdBQVcsRUFBRSxRQUFRO2lCQUN0QjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsR0FBRyxFQUFFO3dCQUNILElBQUksRUFBRSxJQUFJO3dCQUNWLFFBQVEsRUFBRSxLQUFLO3FCQUNoQjtvQkFDRCxXQUFXLEVBQUUsYUFBYTtpQkFDM0I7YUFDRjtZQUNELGFBQWEsRUFBRSxFQUFFO1NBQ2xCLENBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxJQUFBLHVCQUFpQixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQWtFN0QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsaUNvbmZpZywgcmVuZGVyQ2xpQXJnc1R5cGUgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgncmVuZGVyJywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gZ2VuZXJhdGUgQ2xpQXJndW1lbnRzIHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY29uZmlnOiBDbGlDb25maWcgPSB7XG4gICAgICBnbG9iYWxPcHRpb25zOiB7XG4gICAgICAgIGFwcDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2M6ICdSRVFVSVJFRDogQ29tbWFuZC1saW5lIGZvciBleGVjdXRpbmcgeW91ciBhcHAnLFxuICAgICAgICB9LFxuICAgICAgICBkZWJ1Zzoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZXNjOiAnRW5hYmxlIGRlYnVnIGxvZ2dpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB2ZXJib3NlOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGNvdW50OiB0cnVlLFxuICAgICAgICAgIGRlc2M6ICdJbmNyZWFzZSBsb2dnaW5nIHZlcmJvc2l0eScsXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGFsaWFzOiAnYycsXG4gICAgICAgICAgZGVzYzogJ2NvbnRleHQgdmFsdWVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgcGx1Z2luOiB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBkZXNjOiAncGx1Z2lucyB0byBsb2FkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBjb21tYW5kczoge1xuICAgICAgICBkZXBsb3k6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0RlcGxveSBhIHN0YWNrJyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBhbGw6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICBkZXNjOiAnRGVwbG95IGFsbCBzdGFja3MnLFxuICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGV4cGVjdChhd2FpdCByZW5kZXJDbGlBcmdzVHlwZShjb25maWcpKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAgXCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBHRU5FUkFURUQgRlJPTSBwYWNrYWdlcy9hd3MtY2RrL2xpYi9jb25maWcudHMuXG4gICAgICAvLyBEbyBub3QgZWRpdCBieSBoYW5kOyBhbGwgY2hhbmdlcyB3aWxsIGJlIG92ZXJ3cml0dGVuIGF0IGJ1aWxkIHRpbWUgZnJvbSB0aGUgY29uZmlnIGZpbGUuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgIGltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL3NldHRpbmdzJztcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgc3RydWN0dXJlIG9mIHRoZSBDTEkgY29uZmlndXJhdGlvbiwgZ2VuZXJhdGVkIGZyb20gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzXG4gICAgICAgKlxuICAgICAgICogQHN0cnVjdFxuICAgICAgICovXG4gICAgICBleHBvcnQgaW50ZXJmYWNlIENsaUFyZ3VtZW50cyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgQ0xJIGNvbW1hbmQgbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgXzogQ29tbWFuZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2xvYmFsIG9wdGlvbnMgYXZhaWxhYmxlIHRvIGFsbCBDTEkgY29tbWFuZHNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGdsb2JhbE9wdGlvbnM/OiBHbG9iYWxPcHRpb25zO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXBsb3kgYSBzdGFja1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZGVwbG95PzogRGVwbG95T3B0aW9ucztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHbG9iYWwgb3B0aW9ucyBhdmFpbGFibGUgdG8gYWxsIENMSSBjb21tYW5kc1xuICAgICAgICpcbiAgICAgICAqIEBzdHJ1Y3RcbiAgICAgICAqL1xuICAgICAgZXhwb3J0IGludGVyZmFjZSBHbG9iYWxPcHRpb25zIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJFUVVJUkVEOiBDb21tYW5kLWxpbmUgZm9yIGV4ZWN1dGluZyB5b3VyIGFwcFxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVmYXVsdCAtIHVuZGVmaW5lZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgYXBwPzogc3RyaW5nO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbmFibGUgZGVidWcgbG9nZ2luZ1xuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBkZWJ1Zz86IGJvb2xlYW47XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluY3JlYXNlIGxvZ2dpbmcgdmVyYm9zaXR5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZWZhdWx0IC0gdW5kZWZpbmVkXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB2ZXJib3NlPzogbnVtYmVyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjb250ZXh0IHZhbHVlc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVmYXVsdCAtIFtdXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBjb250ZXh0PzogQXJyYXk8c3RyaW5nPjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogcGx1Z2lucyB0byBsb2FkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZWZhdWx0IC0gW11cbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHBsdWdpbj86IEFycmF5PHN0cmluZz47XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRGVwbG95IGEgc3RhY2tcbiAgICAgICAqXG4gICAgICAgKiBAc3RydWN0XG4gICAgICAgKi9cbiAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVwbG95T3B0aW9ucyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXBsb3kgYWxsIHN0YWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBhbGw/OiBib29sZWFuO1xuICAgICAgfVxuICAgICAgXCJcbiAgICBgKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3BlY2lhbCBub3RpZmljYXRpb24tYXJuIG9wdGlvbiBnZXRzIHVuZGVmaW5lZCBkZWZhdWx0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGNvbmZpZzogQ2xpQ29uZmlnID0ge1xuICAgICAgY29tbWFuZHM6IHtcbiAgICAgICAgZGVwbG95OiB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdOb3RpZmljYXRpb24gQXJucycsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgWydub3RpZmljYXRpb24tYXJucyddOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgIGRlc2M6ICdEZXBsb3kgYWxsIHN0YWNrcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWydvdGhlci1hcnJheSddOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgIGRlc2M6ICdPdGhlciBhcnJheScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZ2xvYmFsT3B0aW9uczoge30sXG4gICAgfTtcblxuICAgIGV4cGVjdChhd2FpdCByZW5kZXJDbGlBcmdzVHlwZShjb25maWcpKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAgXCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBHRU5FUkFURUQgRlJPTSBwYWNrYWdlcy9hd3MtY2RrL2xpYi9jb25maWcudHMuXG4gICAgICAvLyBEbyBub3QgZWRpdCBieSBoYW5kOyBhbGwgY2hhbmdlcyB3aWxsIGJlIG92ZXJ3cml0dGVuIGF0IGJ1aWxkIHRpbWUgZnJvbSB0aGUgY29uZmlnIGZpbGUuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgIGltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL3NldHRpbmdzJztcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgc3RydWN0dXJlIG9mIHRoZSBDTEkgY29uZmlndXJhdGlvbiwgZ2VuZXJhdGVkIGZyb20gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzXG4gICAgICAgKlxuICAgICAgICogQHN0cnVjdFxuICAgICAgICovXG4gICAgICBleHBvcnQgaW50ZXJmYWNlIENsaUFyZ3VtZW50cyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgQ0xJIGNvbW1hbmQgbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgXzogQ29tbWFuZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2xvYmFsIG9wdGlvbnMgYXZhaWxhYmxlIHRvIGFsbCBDTEkgY29tbWFuZHNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGdsb2JhbE9wdGlvbnM/OiBHbG9iYWxPcHRpb25zO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBOb3RpZmljYXRpb24gQXJuc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZGVwbG95PzogRGVwbG95T3B0aW9ucztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHbG9iYWwgb3B0aW9ucyBhdmFpbGFibGUgdG8gYWxsIENMSSBjb21tYW5kc1xuICAgICAgICpcbiAgICAgICAqIEBzdHJ1Y3RcbiAgICAgICAqL1xuICAgICAgZXhwb3J0IGludGVyZmFjZSBHbG9iYWxPcHRpb25zIHt9XG5cbiAgICAgIC8qKlxuICAgICAgICogTm90aWZpY2F0aW9uIEFybnNcbiAgICAgICAqXG4gICAgICAgKiBAc3RydWN0XG4gICAgICAgKi9cbiAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVwbG95T3B0aW9ucyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXBsb3kgYWxsIHN0YWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVmYXVsdCAtIHVuZGVmaW5lZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgbm90aWZpY2F0aW9uQXJucz86IEFycmF5PHN0cmluZz47XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE90aGVyIGFycmF5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZWZhdWx0IC0gW11cbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IG90aGVyQXJyYXk/OiBBcnJheTxzdHJpbmc+O1xuICAgICAgfVxuICAgICAgXCJcbiAgICBgKTtcbiAgfSk7XG5cbiAgdGVzdCgncG9zaXRpb25hbCBhcmd1bWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY29uZmlnOiBDbGlDb25maWcgPSB7XG4gICAgICBjb21tYW5kczoge1xuICAgICAgICBkZXBsb3k6IHtcbiAgICAgICAgICBhcmc6IHtcbiAgICAgICAgICAgIG5hbWU6ICdTVEFDS1MnLFxuICAgICAgICAgICAgdmFyaWFkaWM6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2RlcGxveScsXG4gICAgICAgIH0sXG4gICAgICAgIGFja25vd2xlZGdlOiB7XG4gICAgICAgICAgYXJnOiB7XG4gICAgICAgICAgICBuYW1lOiAnSUQnLFxuICAgICAgICAgICAgdmFyaWFkaWM6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdhY2tub3dsZWRnZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZ2xvYmFsT3B0aW9uczoge30sXG4gICAgfTtcblxuICAgIGV4cGVjdChhd2FpdCByZW5kZXJDbGlBcmdzVHlwZShjb25maWcpKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAgXCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBHRU5FUkFURUQgRlJPTSBwYWNrYWdlcy9hd3MtY2RrL2xpYi9jb25maWcudHMuXG4gICAgICAvLyBEbyBub3QgZWRpdCBieSBoYW5kOyBhbGwgY2hhbmdlcyB3aWxsIGJlIG92ZXJ3cml0dGVuIGF0IGJ1aWxkIHRpbWUgZnJvbSB0aGUgY29uZmlnIGZpbGUuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgIGltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL3NldHRpbmdzJztcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgc3RydWN0dXJlIG9mIHRoZSBDTEkgY29uZmlndXJhdGlvbiwgZ2VuZXJhdGVkIGZyb20gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzXG4gICAgICAgKlxuICAgICAgICogQHN0cnVjdFxuICAgICAgICovXG4gICAgICBleHBvcnQgaW50ZXJmYWNlIENsaUFyZ3VtZW50cyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgQ0xJIGNvbW1hbmQgbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgXzogQ29tbWFuZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2xvYmFsIG9wdGlvbnMgYXZhaWxhYmxlIHRvIGFsbCBDTEkgY29tbWFuZHNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGdsb2JhbE9wdGlvbnM/OiBHbG9iYWxPcHRpb25zO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBkZXBsb3lcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGRlcGxveT86IERlcGxveU9wdGlvbnM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFja25vd2xlZGdlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBhY2tub3dsZWRnZT86IEFja25vd2xlZGdlT3B0aW9ucztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHbG9iYWwgb3B0aW9ucyBhdmFpbGFibGUgdG8gYWxsIENMSSBjb21tYW5kc1xuICAgICAgICpcbiAgICAgICAqIEBzdHJ1Y3RcbiAgICAgICAqL1xuICAgICAgZXhwb3J0IGludGVyZmFjZSBHbG9iYWxPcHRpb25zIHt9XG5cbiAgICAgIC8qKlxuICAgICAgICogZGVwbG95XG4gICAgICAgKlxuICAgICAgICogQHN0cnVjdFxuICAgICAgICovXG4gICAgICBleHBvcnQgaW50ZXJmYWNlIERlcGxveU9wdGlvbnMge1xuICAgICAgICAvKipcbiAgICAgICAgICogUG9zaXRpb25hbCBhcmd1bWVudCBmb3IgZGVwbG95XG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBTVEFDS1M/OiBBcnJheTxzdHJpbmc+O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIGFja25vd2xlZGdlXG4gICAgICAgKlxuICAgICAgICogQHN0cnVjdFxuICAgICAgICovXG4gICAgICBleHBvcnQgaW50ZXJmYWNlIEFja25vd2xlZGdlT3B0aW9ucyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQb3NpdGlvbmFsIGFyZ3VtZW50IGZvciBhY2tub3dsZWRnZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgSUQ/OiBzdHJpbmc7XG4gICAgICB9XG4gICAgICBcIlxuICAgIGApO1xuICB9KTtcbn0pO1xuIl19