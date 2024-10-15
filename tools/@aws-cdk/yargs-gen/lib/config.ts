// called by a build tool to generate parse-command-line-arguments.ts

interface YargsCommand {
  description: string;
  options?: { [optionName: string]: YargsOption };
  aliases?: string[];
  //args?: { [argName: string]: YargsArg };
  arg?: YargsArg;
}

// might need to expand
interface YargsArg {
  name: string;
  variadic: boolean;
}

enum RequireApproval {
  Never = 'never',

  AnyChange = 'any-change',

  Broadening = 'broadening',
}

/**
 * Supported display modes for stack deployment activity
 */
enum StackActivityProgress {
  /**
   * Displays a progress bar with only the events for the resource currently being deployed
   */
  BAR = 'bar',

  /**
   * Displays complete history with all CloudFormation stack events
   */
  EVENTS = 'events',
}

interface YargsOption {
  type: 'string' | 'array' | 'number' | 'boolean' | 'count';
  desc?: string;
  default?: any;
  deprecated?: boolean | string;
  choices?: ReadonlyArray<string | number | true | undefined>;
  alias?: string;
  conflicts?: string | readonly string[] | { [key: string]: string | readonly string[] };
  nargs?: number;
  requiresArg?: boolean;
  hidden?: boolean;
  middleware?: Middleware;
}

export interface Middleware {
  callbacks: MiddlewareFunction | ReadonlyArray<MiddlewareFunction>;
  applyBeforeValidation?: boolean;
}

export interface CliConfig {
  commands: { [commandName: string]: YargsCommand };
}

// copied from yargs
type MiddlewareFunction = (args: any) => void;
// end copied from yargs

function yargsNegativeAlias<T extends { [x in S | L]: boolean | undefined }, S extends string, L extends string>(shortName: S, longName: L) {
  return (argv: T) => {
    if (shortName in argv && argv[shortName]) {
      (argv as any)[longName] = false;
    }
    return argv;
  };
}

export function makeConfig(): CliConfig {
  const config: CliConfig = {
    commands: {
      deploy: {
        description: 'Deploys the stack(s) named STACKS into your AWS account',
        options: {
          'all': { type: 'boolean', desc: 'Deploy all available stacks', default: false },
          'build-exclude': { type: 'array', alias: 'E', nargs: 1, desc: 'Do not rebuild asset with the given ID. Can be specified multiple times', default: [] },
          'exclusively': { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependencies' },
          'require-approval': { type: 'string', choices: [RequireApproval.Never, RequireApproval.AnyChange, RequireApproval.Broadening], desc: 'What security-sensitive changes need manual approval' },
          'notification-arns': { type: 'array', desc: 'ARNs of SNS topics that CloudFormation will notify with stack related events', nargs: 1, requiresArg: true },
          // @deprecated(v2) -- tags are part of the Cloud Assembly and tags specified here will be overwritten on the next deployment
          'tags': { type: 'array', alias: 't', desc: 'Tags to add to the stack (KEY=VALUE), overrides tags from Cloud Assembly (deprecated)', nargs: 1, requiresArg: true },
          'execute': { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet) (deprecated)', deprecated: true },
          'change-set-name': { type: 'string', desc: 'Name of the CloudFormation change set to create (only if method is not direct)' },
          'method': {
            alias: 'm',
            type: 'string',
            choices: ['direct', 'change-set', 'prepare-change-set'],
            requiresArg: true,
            desc: 'How to perform the deployment. Direct is a bit faster but lacks progress information',
          },
          'force': { alias: 'f', type: 'boolean', desc: 'Always deploy stack even if templates are identical', default: false },
          'parameters': { type: 'array', desc: 'Additional parameters passed to CloudFormation at deploy time (STACK:KEY=VALUE)', nargs: 1, requiresArg: true, default: {} },
          'outputs-file': { type: 'string', alias: 'O', desc: 'Path to file where stack outputs will be written as JSON', requiresArg: true },
          'previous-parameters': { type: 'boolean', default: true, desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)' },
          'toolkit-stack-name': { type: 'string', desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)', requiresArg: true },
          'progress': { type: 'string', choices: [StackActivityProgress.BAR, StackActivityProgress.EVENTS], desc: 'Display mode for stack activity events' },
          'rollback': {
            type: 'boolean',
            desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. " +
              'Note: do **not** disable this flag for deployments with resource replacements, as that will always fail',
          },
          'R': {
            type: 'boolean',
            hidden: true,
            // Hack to get '-R' as an alias for '--no-rollback', suggested by: https://github.com/yargs/yargs/issues/1729
            middleware: {
              callbacks: yargsNegativeAlias('R', 'rollback'),
              applyBeforeValidation: true,
            },
          },
          'hotswap': {
            type: 'boolean',
            desc: "Attempts to perform a 'hotswap' deployment, " +
              'but does not fall back to a full deployment if that is not possible. ' +
              'Instead, changes to any non-hotswappable properties are ignored.' +
              'Do not use this in production environments',
          },
          'hotswap-fallback': {
            type: 'boolean',
            desc: "Attempts to perform a 'hotswap' deployment, " +
              'which skips CloudFormation and updates the resources directly, ' +
              'and falls back to a full deployment if that is not possible. ' +
              'Do not use this in production environments',
          },
          'watch': {
            type: 'boolean',
            desc: 'Continuously observe the project files, ' +
              'and deploy the given stack(s) automatically when changes are detected. ' +
              'Implies --hotswap by default',
          },
          'logs': {
            type: 'boolean',
            default: true,
            desc: 'Show CloudWatch log events from all resources in the selected Stacks in the terminal. ' +
              "'true' by default, use --no-logs to turn off. " +
              "Only in effect if specified alongside the '--watch' option",
          },
          'concurrency': { type: 'number', desc: 'Maximum number of simultaneous deployments (dependency permitting) to execute.', default: 1, requiresArg: true },
          'asset-parallelism': { type: 'boolean', desc: 'Whether to build/publish assets in parallel' },
          'asset-prebuild': { type: 'boolean', desc: 'Whether to build all assets before deploying the first stack (useful for failing Docker builds)', default: true },
          'ignore-no-stacks': { type: 'boolean', desc: 'Whether to deploy if the app contains no stacks', default: false },
        },
        arg: {
          name: 'STACKS',
          variadic: true,
        },
      },
    },
  };

  return config;
}