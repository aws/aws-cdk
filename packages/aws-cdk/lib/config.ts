import { CliConfig } from '@aws-cdk/yargs-gen';
import { StackActivityProgress } from './api/util/cloudformation/stack-activity-monitor';
import { RequireApproval } from './diff';

/* eslint-disable quote-props */

/**
 * Source of truth for all CDK CLI commands. `yargs-gen` translates this into the `yargs` definition
 * in `lib/parse-command-line-arguments.ts`.
 */
export async function makeConfig(): Promise<CliConfig> {
  return {
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
              callback: 'yargsNegativeAlias',
              args: ['R', 'rollback'],
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
      rollback: {
        description: 'Rolls back the stack(s) named STACKS to their last stable state',
        arg: {
          name: 'STACKS',
          variadic: true,
        },
        options: {
          'all': { type: 'boolean', default: false, desc: 'Roll back all available stacks' },
          'toolkit-stack-name': { type: 'string', desc: 'The name of the CDK toolkit stack the environment is bootstrapped with', requiresArg: true },
          'force': {
            alias: 'f',
            type: 'boolean',
            desc: 'Orphan all resources for which the rollback operation fails.',
          },
          'validate-bootstrap-version': {
            type: 'boolean',
            desc: 'Whether to validate the bootstrap stack version. Defaults to \'true\', disable with --no-validate-bootstrap-version.',
          },
          'orphan': {
            // alias: 'o' conflicts with --output
            type: 'array',
            nargs: 1,
            requiresArg: true,
            desc: 'Orphan the given resources, identified by their logical ID (can be specified multiple times)',
            default: [],
          },
        },
      },
      import: {
        description: 'Import existing resource(s) into the given STACK',
        arg: {
          name: 'STACK',
          variadic: false,
        },
        options: {
          'execute': { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)', default: true },
          'change-set-name': { type: 'string', desc: 'Name of the CloudFormation change set to create' },
          'toolkit-stack-name': { type: 'string', desc: 'The name of the CDK toolkit stack to create', requiresArg: true },
          'rollback': {
            type: 'boolean',
            desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. " +
              'Note: do **not** disable this flag for deployments with resource replacements, as that will always fail',
          },
          'force': {
            alias: 'f',
            type: 'boolean',
            desc: 'Do not abort if the template diff includes updates or deletes. This is probably safe but we\'re not sure, let us know how it goes.',
          },
          'record-resource-mapping': {
            type: 'string',
            alias: 'r',
            requiresArg: true,
            desc: 'If specified, CDK will generate a mapping of existing physical resources to CDK resources to be imported as. The mapping ' +
              'will be written in the given file path. No actual import operation will be performed',
          },
          'resource-mapping': {
            type: 'string',
            alias: 'm',
            requiresArg: true,
            desc: 'If specified, CDK will use the given file to map physical resources to CDK resources for import, instead of interactively ' +
              'asking the user. Can be run from scripts',
          },
        },
      },
      watch: {
        description: "Shortcut for 'deploy --watch'",
        arg: {
          name: 'STACKS',
          variadic: true,
        },
        options: {
          // I'm fairly certain none of these options, present for 'deploy', make sense for 'watch':
          // .option('all', { type: 'boolean', default: false, desc: 'Deploy all available stacks' })
          // .option('ci', { type: 'boolean', desc: 'Force CI detection', default: process.env.CI !== undefined })
          // @deprecated(v2) -- tags are part of the Cloud Assembly and tags specified here will be overwritten on the next deployment
          // .option('tags', { type: 'array', alias: 't', desc: 'Tags to add to the stack (KEY=VALUE), overrides tags from Cloud Assembly (deprecated)', nargs: 1, requiresArg: true })
          // .option('execute', { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)', default: true })
          // These options, however, are more subtle - I could be convinced some of these should also be available for 'watch':
          // .option('require-approval', { type: 'string', choices: [RequireApproval.Never, RequireApproval.AnyChange, RequireApproval.Broadening], desc: 'What security-sensitive changes need manual approval' })
          // .option('parameters', { type: 'array', desc: 'Additional parameters passed to CloudFormation at deploy time (STACK:KEY=VALUE)', nargs: 1, requiresArg: true, default: {} })
          // .option('previous-parameters', { type: 'boolean', default: true, desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)' })
          // .option('outputs-file', { type: 'string', alias: 'O', desc: 'Path to file where stack outputs will be written as JSON', requiresArg: true })
          // .option('notification-arns', { type: 'array', desc: 'ARNs of SNS topics that CloudFormation will notify with stack related events', nargs: 1, requiresArg: true })
          'build-exclude': { type: 'array', alias: 'E', nargs: 1, desc: 'Do not rebuild asset with the given ID. Can be specified multiple times', default: [] },
          'exclusively': { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependencies' },
          'change-set-name': { type: 'string', desc: 'Name of the CloudFormation change set to create' },
          'force': { alias: 'f', type: 'boolean', desc: 'Always deploy stack even if templates are identical', default: false },
          'toolkit-stack-name': { type: 'string', desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)', requiresArg: true },
          'progress': { type: 'string', choices: [StackActivityProgress.BAR, StackActivityProgress.EVENTS], desc: 'Display mode for stack activity events' },
          'rollback': {
            type: 'boolean',
            desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. " +
              'Note: do **not** disable this flag for deployments with resource replacements, as that will always fail',
          },
          // same hack for -R as above in 'deploy'
          'R': {
            type: 'boolean',
            hidden: true,
            middleware: {
              callback: 'yargsNegativeAlias',
              args: ['R', 'rollback'],
              applyBeforeValidation: true,
            },
          },
          'hotswap': {
            type: 'boolean',
            desc: "Attempts to perform a 'hotswap' deployment, " +
              'but does not fall back to a full deployment if that is not possible. ' +
              'Instead, changes to any non-hotswappable properties are ignored.' +
              "'true' by default, use --no-hotswap to turn off",
          },
          'hotswap-fallback': {
            type: 'boolean',
            desc: "Attempts to perform a 'hotswap' deployment, " +
              'which skips CloudFormation and updates the resources directly, ' +
              'and falls back to a full deployment if that is not possible.',
          },
          'logs': {
            type: 'boolean',
            default: true,
            desc: 'Show CloudWatch log events from all resources in the selected Stacks in the terminal. ' +
              "'true' by default, use --no-logs to turn off",
          },
          'concurrency': { type: 'number', desc: 'Maximum number of simultaneous deployments (dependency permitting) to execute.', default: 1, requiresArg: true },
        },
      },
      destroy: {
        description: 'Destroy the stack(s) named STACKS',
        arg: {
          name: 'STACKS',
          variadic: true,
        },
        options: {
          'all': { type: 'boolean', default: false, desc: 'Destroy all available stacks' },
          'exclusively': { type: 'boolean', alias: 'e', desc: 'Only destroy requested stacks, don\'t include dependees' },
          'force': { type: 'boolean', alias: 'f', desc: 'Do not ask for confirmation before destroying the stacks' },
        },
      },
      diff: {
        description: 'Compares the specified stack with the deployed stack or a local template file, and returns with status 1 if any difference is found',
        arg: {
          name: 'STACKS',
          variadic: true,
        },
        options: {
          'exclusively': { type: 'boolean', alias: 'e', desc: 'Only diff requested stacks, don\'t include dependencies' },
          'context-lines': { type: 'number', desc: 'Number of context lines to include in arbitrary JSON diff rendering', default: 3, requiresArg: true },
          'template': { type: 'string', desc: 'The path to the CloudFormation template to compare with', requiresArg: true },
          'strict': { type: 'boolean', desc: 'Do not filter out AWS::CDK::Metadata resources, mangled non-ASCII characters, or the CheckBootstrapVersionRule', default: false },
          'security-only': { type: 'boolean', desc: 'Only diff for broadened security changes', default: false },
          'fail': { type: 'boolean', desc: 'Fail with exit code 1 in case of diff' },
          'processed': { type: 'boolean', desc: 'Whether to compare against the template with Transforms already processed', default: false },
          'quiet': { type: 'boolean', alias: 'q', desc: 'Do not print stack name and default message when there is no diff to stdout', default: false },
          'change-set': { type: 'boolean', alias: 'changeset', desc: 'Whether to create a changeset to analyze resource replacements. In this mode, diff will use the deploy role instead of the lookup role.', default: true },
        },
      },
      metadata: {
        description: 'Returns all metadata associated with this stack',
        arg: {
          name: 'STACK',
          variadic: false,
        },
      },
      acknowledge: {
        aliases: ['ack'],
        description: 'Acknowledge a notice so that it does not show up anymore',
        arg: {
          name: 'ID',
          variadic: false,
        },
      },
      notices: {
        description: 'Returns a list of relevant notices',
        options: {
          'unacknowledged': { type: 'boolean', alias: 'u', default: false, desc: 'Returns a list of unacknowledged notices' },
        },
      },
      init: {
        description: 'Create a new, empty CDK project from a template.',
        arg: {
          name: 'TEMPLATE',
          variadic: false,
        },
        options: {
          'language': { type: 'string', alias: 'l', desc: 'The language to be used for the new project (default can be configured in ~/.cdk.json)', choices: DynamicValue.fromParameter('availableInitLanguages') } as any, // TODO: preamble, this initTemplateLanguages variable needs to go as a statement there.
          'list': { type: 'boolean', desc: 'List the available templates' },
          'generate-only': { type: 'boolean', default: false, desc: 'If true, only generates project files, without executing additional operations such as setting up a git repo, installing dependencies or compiling the project' },
        },
      },
      'migrate': {
        description: false as any,
        options: {
          'stack-name': { type: 'string', alias: 'n', desc: 'The name assigned to the stack created in the new project. The name of the app will be based off this name as well.', requiresArg: true },
          'language': { type: 'string', default: 'typescript', alias: 'l', desc: 'The language to be used for the new project', choices: DynamicValue.fromParameter('migrateSupportedLanguages') as any },
          'account': { type: 'string', desc: 'The account to retrieve the CloudFormation stack template from' },
          'region': { type: 'string', desc: 'The region to retrieve the CloudFormation stack template from' },
          'from-path': { type: 'string', desc: 'The path to the CloudFormation template to migrate. Use this for locally stored templates' },
          'from-stack': { type: 'boolean', desc: 'Use this flag to retrieve the template for an existing CloudFormation stack' },
          'output-path': { type: 'string', desc: 'The output path for the migrated CDK app' },
          'from-scan': {
            type: 'string',
            desc: 'Determines if a new scan should be created, or the last successful existing scan should be used ' +
              '\n options are "new" or "most-recent"',
          },
          'filter': {
            type: 'array',
            desc: 'Filters the resource scan based on the provided criteria in the following format: "key1=value1,key2=value2"' +
              '\n This field can be passed multiple times for OR style filtering: ' +
              '\n filtering options: ' +
              '\n resource-identifier: A key-value pair that identifies the target resource. i.e. {"ClusterName", "myCluster"}' +
              '\n resource-type-prefix: A string that represents a type-name prefix. i.e. "AWS::DynamoDB::"' +
              '\n tag-key: a string that matches resources with at least one tag with the provided key. i.e. "myTagKey"' +
              '\n tag-value: a string that matches resources with at least one tag with the provided value. i.e. "myTagValue"',
          },
          'compress': { type: 'boolean', desc: 'Use this flag to zip the generated CDK app' },
        },
      },
      'context': {
        description: 'Manage cached context values',
        options: {
          'reset': { alias: 'e', desc: 'The context key (or its index) to reset', type: 'string', requiresArg: true },
          'force': { alias: 'f', desc: 'Ignore missing key error', type: 'boolean', default: false },
          'clear': { desc: 'Clear all context', type: 'boolean' },
        },
      },
      'docs': {
        aliases: ['doc'],
        description: 'Opens the reference documentation in a browser',
        options: {
          'browser': {
            alias: 'b',
            desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
            type: 'string',
            default: DynamicValue.fromParameter('browserDefault'),
          },
        },
      },
      'doctor': {
        description: 'Check your set-up for potential problems',
      },
    },
  };
}

/**
 * The result of a DynamicValue call
 */
export interface DynamicResult {
  dynamicType: 'parameter';
  dynamicValue: string;
}

/**
 * Informs the code library, `@aws-cdk/yargs-gen`, that
 * this value references an entity not defined in this configuration file.
 */
export class DynamicValue {
  /**
   * Instructs `yargs-gen` to retrieve this value from the parameter with passed name.
   */
  public static fromParameter(parameterName: string): DynamicResult {
    return {
      dynamicType: 'parameter',
      dynamicValue: parameterName,
    };
  }
}
