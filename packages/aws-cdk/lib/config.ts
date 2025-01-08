// eslint-disable-next-line import/no-extraneous-dependencies
import { CliHelpers, type CliConfig } from '@aws-cdk/cli-args-gen';
import { StackActivityProgress } from './api/util/cloudformation/stack-activity-monitor';
import { MIGRATE_SUPPORTED_LANGUAGES } from './commands/migrate';
import { RequireApproval } from './diff';
import { availableInitLanguages } from './init';

export const YARGS_HELPERS = new CliHelpers('./util/yargs-helpers');

/**
 * Source of truth for all CDK CLI commands. `cli-args-gen` translates this into the `yargs` definition
 * in `lib/parse-command-line-arguments.ts`.
 */
export async function makeConfig(): Promise<CliConfig> {
  return {
    globalOptions: {
      'app': { type: 'string', alias: 'a', desc: 'REQUIRED WHEN RUNNING APP: command-line for executing your app or a cloud assembly directory (e.g. "node bin/my-app.js"). Can also be specified in cdk.json or ~/.cdk.json', requiresArg: true },
      'build': { type: 'string', desc: 'Command-line for a pre-synth build' },
      'context': { type: 'array', alias: 'c', desc: 'Add contextual string parameter (KEY=VALUE)' },
      'plugin': { type: 'array', alias: 'p', desc: 'Name or path of a node package that extend the CDK features. Can be specified multiple times' },
      'trace': { type: 'boolean', desc: 'Print trace for stack warnings' },
      'strict': { type: 'boolean', desc: 'Do not construct stacks with warnings' },
      'lookups': { type: 'boolean', desc: 'Perform context lookups (synthesis fails if this is disabled and context lookups need to be performed)', default: true },
      'ignore-errors': { type: 'boolean', default: false, desc: 'Ignores synthesis errors, which will likely produce an invalid output' },
      'json': { type: 'boolean', alias: 'j', desc: 'Use JSON output instead of YAML when templates are printed to STDOUT', default: false },
      'verbose': { type: 'boolean', alias: 'v', desc: 'Show debug logs (specify multiple times to increase verbosity)', default: false, count: true },
      'debug': { type: 'boolean', desc: 'Debug the CDK app. Log additional information during synthesis, such as creation stack traces of tokens (sets CDK_DEBUG, will slow down synthesis)', default: false },
      'profile': { type: 'string', desc: 'Use the indicated AWS profile as the default environment', requiresArg: true },
      'proxy': { type: 'string', desc: 'Use the indicated proxy. Will read from HTTPS_PROXY environment variable if not specified', requiresArg: true },
      'ca-bundle-path': { type: 'string', desc: 'Path to CA certificate to use when validating HTTPS requests. Will read from AWS_CA_BUNDLE environment variable if not specified', requiresArg: true },
      'ec2creds': { type: 'boolean', alias: 'i', default: undefined, desc: 'Force trying to fetch EC2 instance credentials. Default: guess EC2 instance status' },
      'version-reporting': { type: 'boolean', desc: 'Include the "AWS::CDK::Metadata" resource in synthesized templates (enabled by default)', default: undefined },
      'path-metadata': { type: 'boolean', desc: 'Include "aws:cdk:path" CloudFormation metadata for each resource (enabled by default)', default: undefined },
      'asset-metadata': { type: 'boolean', desc: 'Include "aws:asset:*" CloudFormation metadata for resources that uses assets (enabled by default)', default: undefined },
      'role-arn': { type: 'string', alias: 'r', desc: 'ARN of Role to use when invoking CloudFormation', default: undefined, requiresArg: true },
      'staging': { type: 'boolean', desc: 'Copy assets to the output directory (use --no-staging to disable the copy of assets which allows local debugging via the SAM CLI to reference the original source files)', default: true },
      'output': { type: 'string', alias: 'o', desc: 'Emits the synthesized cloud assembly into a directory (default: cdk.out)', requiresArg: true },
      'notices': { type: 'boolean', desc: 'Show relevant notices' },
      'no-color': { type: 'boolean', desc: 'Removes colors and other style from console output', default: false },
      'ci': { type: 'boolean', desc: 'Force CI detection. If CI=true then logs will be sent to stdout instead of stderr', default: YARGS_HELPERS.isCI() },
      'unstable': { type: 'array', desc: 'Opt in to unstable features. The flag indicates that the scope and API of a feature might still change. Otherwise the feature is generally production ready and fully supported. Can be specified multiple times.', default: [] },
    },
    commands: {
      list: {
        arg: {
          name: 'STACKS',
          variadic: true,
        },
        aliases: ['ls'],
        description: 'Lists all stacks in the app',
        options: {
          'long': { type: 'boolean', default: false, alias: 'l', desc: 'Display environment information for each stack' },
          'show-dependencies': { type: 'boolean', default: false, alias: 'd', desc: 'Display stack dependency information for each stack' },
        },
      },
      synthesize: {
        arg: {
          name: 'STACKS',
          variadic: true,
        },
        aliases: ['synth'],
        description: 'Synthesizes and prints the CloudFormation template for this stack',
        options: {
          exclusively: { type: 'boolean', alias: 'e', desc: 'Only synthesize requested stacks, don\'t include dependencies' },
          validation: { type: 'boolean', desc: 'After synthesis, validate stacks with the "validateOnSynth" attribute set (can also be controlled with CDK_VALIDATION)', default: true },
          quiet: { type: 'boolean', alias: 'q', desc: 'Do not output CloudFormation Template to stdout', default: false },
        },
      },
      bootstrap: {
        arg: {
          name: 'ENVIRONMENTS',
          variadic: true,
        },
        description: 'Deploys the CDK toolkit stack into an AWS environment',
        options: {
          'bootstrap-bucket-name': { type: 'string', alias: ['b', 'toolkit-bucket-name'], desc: 'The name of the CDK toolkit bucket; bucket will be created and must not exist', default: undefined },
          'bootstrap-kms-key-id': { type: 'string', desc: 'AWS KMS master key ID used for the SSE-KMS encryption', default: undefined, conflicts: 'bootstrap-customer-key' },
          'example-permissions-boundary': { type: 'boolean', alias: 'epb', desc: 'Use the example permissions boundary.', default: undefined, conflicts: 'custom-permissions-boundary' },
          'custom-permissions-boundary': { type: 'string', alias: 'cpb', desc: 'Use the permissions boundary specified by name.', default: undefined, conflicts: 'example-permissions-boundary' },
          'bootstrap-customer-key': { type: 'boolean', desc: 'Create a Customer Master Key (CMK) for the bootstrap bucket (you will be charged but can customize permissions, modern bootstrapping only)', default: undefined, conflicts: 'bootstrap-kms-key-id' },
          'qualifier': { type: 'string', desc: 'String which must be unique for each bootstrap stack. You must configure it on your CDK app if you change this from the default.', default: undefined },
          'public-access-block-configuration': { type: 'boolean', desc: 'Block public access configuration on CDK toolkit bucket (enabled by default) ', default: undefined },
          'tags': { type: 'array', alias: 't', desc: 'Tags to add for the stack (KEY=VALUE)', default: [] },
          'execute': { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)', default: true },
          'trust': { type: 'array', desc: 'The AWS account IDs that should be trusted to perform deployments into this environment (may be repeated, modern bootstrapping only)', default: [] },
          'trust-for-lookup': { type: 'array', desc: 'The AWS account IDs that should be trusted to look up values in this environment (may be repeated, modern bootstrapping only)', default: [] },
          'cloudformation-execution-policies': { type: 'array', desc: 'The Managed Policy ARNs that should be attached to the role performing deployments into this environment (may be repeated, modern bootstrapping only)', default: [] },
          'force': { alias: 'f', type: 'boolean', desc: 'Always bootstrap even if it would downgrade template version', default: false },
          'termination-protection': { type: 'boolean', default: undefined, desc: 'Toggle CloudFormation termination protection on the bootstrap stacks' },
          'show-template': { type: 'boolean', desc: 'Instead of actual bootstrapping, print the current CLI\'s bootstrapping template to stdout for customization', default: false },
          'toolkit-stack-name': { type: 'string', desc: 'The name of the CDK toolkit stack to create', requiresArg: true },
          'template': { type: 'string', requiresArg: true, desc: 'Use the template from the given file instead of the built-in one (use --show-template to obtain an example)' },
          'previous-parameters': { type: 'boolean', default: true, desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)' },
        },
      },
      gc: {
        description: 'Garbage collect assets. Options detailed here: https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/README.md#cdk-gc',
        arg: {
          name: 'ENVIRONMENTS',
          variadic: true,
        },
        options: {
          'action': { type: 'string', desc: 'The action (or sub-action) you want to perform. Valid entires are "print", "tag", "delete-tagged", "full".', default: 'full' },
          'type': { type: 'string', desc: 'Specify either ecr, s3, or all', default: 'all' },
          'rollback-buffer-days': { type: 'number', desc: 'Delete assets that have been marked as isolated for this many days', default: 0 },
          'created-buffer-days': { type: 'number', desc: 'Never delete assets younger than this (in days)', default: 1 },
          'confirm': { type: 'boolean', desc: 'Confirm via manual prompt before deletion', default: true },
          'bootstrap-stack-name': { type: 'string', desc: 'The name of the CDK toolkit stack, if different from the default "CDKToolkit"', requiresArg: true },
        },
      },
      deploy: {
        description: 'Deploys the stack(s) named STACKS into your AWS account',
        options: {
          'all': { type: 'boolean', desc: 'Deploy all available stacks', default: false },
          'build-exclude': { type: 'array', alias: 'E', desc: 'Do not rebuild asset with the given ID. Can be specified multiple times', default: [] },
          'exclusively': { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependencies' },
          'require-approval': { type: 'string', choices: [RequireApproval.Never, RequireApproval.AnyChange, RequireApproval.Broadening], desc: 'What security-sensitive changes need manual approval' },
          'notification-arns': { type: 'array', desc: 'ARNs of SNS topics that CloudFormation will notify with stack related events. These will be added to ARNs specified with the \'notificationArns\' stack property.' },
          // @deprecated(v2) -- tags are part of the Cloud Assembly and tags specified here will be overwritten on the next deployment
          'tags': { type: 'array', alias: 't', desc: 'Tags to add to the stack (KEY=VALUE), overrides tags from Cloud Assembly (deprecated)' },
          'execute': { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet) (deprecated)', deprecated: true },
          'change-set-name': { type: 'string', desc: 'Name of the CloudFormation change set to create (only if method is not direct)' },
          'method': {
            alias: 'm',
            type: 'string',
            choices: ['direct', 'change-set', 'prepare-change-set'],
            requiresArg: true,
            desc: 'How to perform the deployment. Direct is a bit faster but lacks progress information',
          },
          'import-existing-resources': { type: 'boolean', desc: 'Indicates if the stack set imports resources that already exist.', default: false },
          'force': { alias: 'f', type: 'boolean', desc: 'Always deploy stack even if templates are identical', default: false },
          'parameters': { type: 'array', desc: 'Additional parameters passed to CloudFormation at deploy time (STACK:KEY=VALUE)', default: {} },
          'outputs-file': { type: 'string', alias: 'O', desc: 'Path to file where stack outputs will be written as JSON', requiresArg: true },
          'previous-parameters': { type: 'boolean', default: true, desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)' },
          'toolkit-stack-name': { type: 'string', desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)', requiresArg: true },
          'progress': { type: 'string', choices: [StackActivityProgress.BAR, StackActivityProgress.EVENTS], desc: 'Display mode for stack activity events' },
          'rollback': {
            type: 'boolean',
            desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. " +
              'Note: do **not** disable this flag for deployments with resource replacements, as that will always fail',
            negativeAlias: 'R',
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
          'build-exclude': { type: 'array', alias: 'E', desc: 'Do not rebuild asset with the given ID. Can be specified multiple times', default: [] },
          'exclusively': { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependencies' },
          'change-set-name': { type: 'string', desc: 'Name of the CloudFormation change set to create' },
          'force': { alias: 'f', type: 'boolean', desc: 'Always deploy stack even if templates are identical', default: false },
          'toolkit-stack-name': { type: 'string', desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)', requiresArg: true },
          'progress': { type: 'string', choices: [StackActivityProgress.BAR, StackActivityProgress.EVENTS], desc: 'Display mode for stack activity events' },
          'rollback': {
            type: 'boolean',
            desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. " +
              'Note: do **not** disable this flag for deployments with resource replacements, as that will always fail',
            negativeAlias: 'R',
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
          all: { type: 'boolean', default: false, desc: 'Destroy all available stacks' },
          exclusively: { type: 'boolean', alias: 'e', desc: 'Only destroy requested stacks, don\'t include dependees' },
          force: { type: 'boolean', alias: 'f', desc: 'Do not ask for confirmation before destroying the stacks' },
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
          unacknowledged: { type: 'boolean', alias: 'u', default: false, desc: 'Returns a list of unacknowledged notices' },
        },
      },
      init: {
        description: 'Create a new, empty CDK project from a template.',
        arg: {
          name: 'TEMPLATE',
          variadic: false,
        },
        options: {
          'language': { type: 'string', alias: 'l', desc: 'The language to be used for the new project (default can be configured in ~/.cdk.json)', choices: await availableInitLanguages() },
          'list': { type: 'boolean', desc: 'List the available templates' },
          'generate-only': { type: 'boolean', default: false, desc: 'If true, only generates project files, without executing additional operations such as setting up a git repo, installing dependencies or compiling the project' },
        },
      },
      migrate: {
        description: 'Migrate existing AWS resources into a CDK app',
        options: {
          'stack-name': { type: 'string', alias: 'n', desc: 'The name assigned to the stack created in the new project. The name of the app will be based off this name as well.', requiresArg: true },
          'language': { type: 'string', default: 'typescript', alias: 'l', desc: 'The language to be used for the new project', choices: MIGRATE_SUPPORTED_LANGUAGES },
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
      context: {
        description: 'Manage cached context values',
        options: {
          reset: { alias: 'e', desc: 'The context key (or its index) to reset', type: 'string', requiresArg: true, default: undefined },
          force: { alias: 'f', desc: 'Ignore missing key error', type: 'boolean', default: false },
          clear: { desc: 'Clear all context', type: 'boolean', default: false },
        },
      },
      docs: {
        aliases: ['doc'],
        description: 'Opens the reference documentation in a browser',
        options: {
          browser: {
            alias: 'b',
            desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
            type: 'string',
            default: YARGS_HELPERS.browserForPlatform(),
          },
        },
      },
      doctor: {
        description: 'Check your set-up for potential problems',
      },
    },
  };
}
