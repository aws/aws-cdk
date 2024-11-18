// -------------------------------------------------------------------------------------------
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
    .option('app', {
      type: 'string',
      alias: 'a',
      desc: 'REQUIRED WHEN RUNNING APP: command-line for executing your app or a cloud assembly directory (e.g. "node bin/my-app.js"). Can also be specified in cdk.json or ~/.cdk.json',
      requiresArg: true,
    })
    .option('build', {
      type: 'string',
      desc: 'Command-line for a pre-synth build',
    })
    .option('context', {
      type: 'array',
      alias: 'c',
      desc: 'Add contextual string parameter (KEY=VALUE)',
      nargs: 1,
      requiresArg: true,
    })
    .option('plugin', {
      type: 'array',
      alias: 'p',
      desc: 'Name or path of a node package that extend the CDK features. Can be specified multiple times',
      nargs: 1,
    })
    .option('trace', {
      type: 'boolean',
      desc: 'Print trace for stack warnings',
    })
    .option('strict', {
      type: 'boolean',
      desc: 'Do not construct stacks with warnings',
    })
    .option('lookups', {
      type: 'boolean',
      desc: 'Perform context lookups (synthesis fails if this is disabled and context lookups need to be performed)',
      default: true,
    })
    .option('ignore-errors', {
      type: 'boolean',
      default: false,
      desc: 'Ignores synthesis errors, which will likely produce an invalid output',
    })
    .option('json', {
      type: 'boolean',
      alias: 'j',
      desc: 'Use JSON output instead of YAML when templates are printed to STDOUT',
      default: false,
    })
    .option('verbose', {
      type: 'boolean',
      alias: 'v',
      desc: 'Show debug logs (specify multiple times to increase verbosity)',
      default: false,
      count: true,
    })
    .option('debug', {
      type: 'boolean',
      desc: 'Enable emission of additional debugging information, such as creation stack traces of tokens',
      default: false,
    })
    .option('profile', {
      type: 'string',
      desc: 'Use the indicated AWS profile as the default environment',
      requiresArg: true,
    })
    .option('proxy', {
      type: 'string',
      desc: 'Use the indicated proxy. Will read from HTTPS_PROXY environment variable if not specified',
      requiresArg: true,
    })
    .option('ca-bundle-path', {
      type: 'string',
      desc: 'Path to CA certificate to use when validating HTTPS requests. Will read from AWS_CA_BUNDLE environment variable if not specified',
      requiresArg: true,
    })
    .option('ec2creds', {
      type: 'boolean',
      alias: 'i',
      default: undefined,
      desc: 'Force trying to fetch EC2 instance credentials. Default: guess EC2 instance status',
    })
    .option('version-reporting', {
      type: 'boolean',
      desc: 'Include the "AWS::CDK::Metadata" resource in synthesized templates (enabled by default)',
      default: undefined,
    })
    .option('path-metadata', {
      type: 'boolean',
      desc: 'Include "aws:cdk:path" CloudFormation metadata for each resource (enabled by default)',
      default: undefined,
    })
    .option('asset-metadata', {
      type: 'boolean',
      desc: 'Include "aws:asset:*" CloudFormation metadata for resources that uses assets (enabled by default)',
      default: undefined,
    })
    .option('role-arn', {
      type: 'string',
      alias: 'r',
      desc: 'ARN of Role to use when invoking CloudFormation',
      default: undefined,
      requiresArg: true,
    })
    .option('staging', {
      type: 'boolean',
      desc: 'Copy assets to the output directory (use --no-staging to disable the copy of assets which allows local debugging via the SAM CLI to reference the original source files)',
      default: true,
    })
    .option('output', {
      type: 'string',
      alias: 'o',
      desc: 'Emits the synthesized cloud assembly into a directory (default: cdk.out)',
      requiresArg: true,
    })
    .option('notices', {
      type: 'boolean',
      desc: 'Show relevant notices',
    })
    .option('no-color', {
      type: 'boolean',
      desc: 'Removes colors and other style from console output',
      default: false,
    })
    .option('ci', {
      type: 'boolean',
      desc: 'Force CI detection. If CI=true then logs will be sent to stdout instead of stderr',
      default: process.env.CI !== undefined,
    })
    .option('unstable', {
      type: 'array',
      desc: 'Opt in to unstable features. The flag indicates that the scope and API of a feature might still change. Otherwise the feature is generally production ready and fully supported. Can be specified multiple times.',
      default: [],
    })
    .command(['list [STACKS..]', 'ls [STACKS..]'], 'Lists all stacks in the app', (yargs: Argv) =>
      yargs
        .option('long', {
          type: 'boolean',
          default: false,
          alias: 'l',
          desc: 'Display environment information for each stack',
        })
        .option('show-dependencies', {
          type: 'boolean',
          default: false,
          alias: 'd',
          desc: 'Display stack dependency information for each stack',
        })
    )
    .command(['synthesize [STACKS..]', 'synth [STACKS..]'], 'Synthesizes and prints the CloudFormation template for this stack', (yargs: Argv) =>
      yargs
        .option('exclusively', {
          type: 'boolean',
          alias: 'e',
          desc: "Only synthesize requested stacks, don't include dependencies",
        })
        .option('validation', {
          type: 'boolean',
          desc: 'After synthesis, validate stacks with the "validateOnSynth" attribute set (can also be controlled with CDK_VALIDATION)',
          default: true,
        })
        .option('quiet', {
          type: 'boolean',
          alias: 'q',
          desc: 'Do not output CloudFormation Template to stdout',
          default: false,
        })
    )
    .command('bootstrap [ENVIRONMENTS..]', 'Deploys the CDK toolkit stack into an AWS environment', (yargs: Argv) =>
      yargs
        .option('bootstrap-bucket-name', {
          type: 'string',
          alias: ['b', 'toolkit-bucket-name'],
          desc: 'The name of the CDK toolkit bucket; bucket will be created and must not exist',
          default: undefined,
        })
        .option('bootstrap-kms-key-id', {
          type: 'string',
          desc: 'AWS KMS master key ID used for the SSE-KMS encryption',
          default: undefined,
          conflicts: 'bootstrap-customer-key',
        })
        .option('example-permissions-boundary', {
          type: 'boolean',
          alias: 'epb',
          desc: 'Use the example permissions boundary.',
          default: undefined,
          conflicts: 'custom-permissions-boundary',
        })
        .option('custom-permissions-boundary', {
          type: 'string',
          alias: 'cpb',
          desc: 'Use the permissions boundary specified by name.',
          default: undefined,
          conflicts: 'example-permissions-boundary',
        })
        .option('bootstrap-customer-key', {
          type: 'boolean',
          desc: 'Create a Customer Master Key (CMK) for the bootstrap bucket (you will be charged but can customize permissions, modern bootstrapping only)',
          default: undefined,
          conflicts: 'bootstrap-kms-key-id',
        })
        .option('qualifier', {
          type: 'string',
          desc: 'String which must be unique for each bootstrap stack. You must configure it on your CDK app if you change this from the default.',
          default: undefined,
        })
        .option('public-access-block-configuration', {
          type: 'boolean',
          desc: 'Block public access configuration on CDK toolkit bucket (enabled by default) ',
          default: undefined,
        })
        .option('tags', {
          type: 'array',
          alias: 't',
          desc: 'Tags to add for the stack (KEY=VALUE)',
          nargs: 1,
          requiresArg: true,
          default: [],
        })
        .option('execute', {
          type: 'boolean',
          desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)',
          default: true,
        })
        .option('trust', {
          type: 'array',
          desc: 'The AWS account IDs that should be trusted to perform deployments into this environment (may be repeated, modern bootstrapping only)',
          default: [],
          nargs: 1,
          requiresArg: true,
        })
        .option('trust-for-lookup', {
          type: 'array',
          desc: 'The AWS account IDs that should be trusted to look up values in this environment (may be repeated, modern bootstrapping only)',
          default: [],
          nargs: 1,
          requiresArg: true,
        })
        .option('cloudformation-execution-policies', {
          type: 'array',
          desc: 'The Managed Policy ARNs that should be attached to the role performing deployments into this environment (may be repeated, modern bootstrapping only)',
          default: [],
          nargs: 1,
          requiresArg: true,
        })
        .option('force', {
          alias: 'f',
          type: 'boolean',
          desc: 'Always bootstrap even if it would downgrade template version',
          default: false,
        })
        .option('termination-protection', {
          type: 'boolean',
          default: undefined,
          desc: 'Toggle CloudFormation termination protection on the bootstrap stacks',
        })
        .option('show-template', {
          type: 'boolean',
          desc: "Instead of actual bootstrapping, print the current CLI's bootstrapping template to stdout for customization",
          default: false,
        })
        .option('toolkit-stack-name', {
          type: 'string',
          desc: 'The name of the CDK toolkit stack to create',
          requiresArg: true,
        })
        .option('template', {
          type: 'string',
          requiresArg: true,
          desc: 'Use the template from the given file instead of the built-in one (use --show-template to obtain an example)',
        })
        .option('previous-parameters', {
          type: 'boolean',
          default: true,
          desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)',
        })
    )
    .command(
      'gc [ENVIRONMENTS..]',
      'Garbage collect assets. Options detailed here: https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/README.md#cdk-gc',
      (yargs: Argv) =>
        yargs
          .option('action', {
            type: 'string',
            desc: 'The action (or sub-action) you want to perform. Valid entires are "print", "tag", "delete-tagged", "full".',
            default: 'full',
          })
          .option('type', {
            type: 'string',
            desc: 'Specify either ecr, s3, or all',
            default: 'all',
          })
          .option('rollback-buffer-days', {
            type: 'number',
            desc: 'Delete assets that have been marked as isolated for this many days',
            default: 0,
          })
          .option('created-buffer-days', {
            type: 'number',
            desc: 'Never delete assets younger than this (in days)',
            default: 1,
          })
          .option('confirm', {
            type: 'boolean',
            desc: 'Confirm via manual prompt before deletion',
            default: true,
          })
          .option('bootstrap-stack-name', {
            type: 'string',
            desc: 'The name of the CDK toolkit stack, if different from the default "CDKToolkit"',
            requiresArg: true,
          })
    )
    .command('deploy [STACKS..]', 'Deploys the stack(s) named STACKS into your AWS account', (yargs: Argv) =>
      yargs
        .option('all', {
          type: 'boolean',
          desc: 'Deploy all available stacks',
          default: false,
        })
        .option('build-exclude', {
          type: 'array',
          alias: 'E',
          nargs: 1,
          desc: 'Do not rebuild asset with the given ID. Can be specified multiple times',
          default: [],
        })
        .option('exclusively', {
          type: 'boolean',
          alias: 'e',
          desc: "Only deploy requested stacks, don't include dependencies",
        })
        .option('require-approval', {
          type: 'string',
          choices: ['never', 'any-change', 'broadening'],
          desc: 'What security-sensitive changes need manual approval',
        })
        .option('notification-arns', {
          type: 'array',
          desc: "ARNs of SNS topics that CloudFormation will notify with stack related events. These will be added to ARNs specified with the 'notificationArns' stack property.",
          nargs: 1,
          requiresArg: true,
        })
        .option('tags', {
          type: 'array',
          alias: 't',
          desc: 'Tags to add to the stack (KEY=VALUE), overrides tags from Cloud Assembly (deprecated)',
          nargs: 1,
          requiresArg: true,
        })
        .option('execute', {
          type: 'boolean',
          desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet) (deprecated)',
          deprecated: true,
        })
        .option('change-set-name', {
          type: 'string',
          desc: 'Name of the CloudFormation change set to create (only if method is not direct)',
        })
        .option('method', {
          alias: 'm',
          type: 'string',
          choices: ['direct', 'change-set', 'prepare-change-set'],
          requiresArg: true,
          desc: 'How to perform the deployment. Direct is a bit faster but lacks progress information',
        })
        .option('force', {
          alias: 'f',
          type: 'boolean',
          desc: 'Always deploy stack even if templates are identical',
          default: false,
        })
        .option('parameters', {
          type: 'array',
          desc: 'Additional parameters passed to CloudFormation at deploy time (STACK:KEY=VALUE)',
          nargs: 1,
          requiresArg: true,
          default: {},
        })
        .option('outputs-file', {
          type: 'string',
          alias: 'O',
          desc: 'Path to file where stack outputs will be written as JSON',
          requiresArg: true,
        })
        .option('previous-parameters', {
          type: 'boolean',
          default: true,
          desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)',
        })
        .option('toolkit-stack-name', {
          type: 'string',
          desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)',
          requiresArg: true,
        })
        .option('progress', {
          type: 'string',
          choices: ['bar', 'events'],
          desc: 'Display mode for stack activity events',
        })
        .option('rollback', {
          type: 'boolean',
          desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail",
        })
        .middleware(yargsNegativeAlias('rollback', 'R'), true)
        .option('R', {
          type: 'boolean',
          hidden: true,
        })
        .option('hotswap', {
          type: 'boolean',
          desc: "Attempts to perform a 'hotswap' deployment, but does not fall back to a full deployment if that is not possible. Instead, changes to any non-hotswappable properties are ignored.Do not use this in production environments",
        })
        .option('hotswap-fallback', {
          type: 'boolean',
          desc: "Attempts to perform a 'hotswap' deployment, which skips CloudFormation and updates the resources directly, and falls back to a full deployment if that is not possible. Do not use this in production environments",
        })
        .option('watch', {
          type: 'boolean',
          desc: 'Continuously observe the project files, and deploy the given stack(s) automatically when changes are detected. Implies --hotswap by default',
        })
        .option('logs', {
          type: 'boolean',
          default: true,
          desc: "Show CloudWatch log events from all resources in the selected Stacks in the terminal. 'true' by default, use --no-logs to turn off. Only in effect if specified alongside the '--watch' option",
        })
        .option('concurrency', {
          type: 'number',
          desc: 'Maximum number of simultaneous deployments (dependency permitting) to execute.',
          default: 1,
          requiresArg: true,
        })
        .option('asset-parallelism', {
          type: 'boolean',
          desc: 'Whether to build/publish assets in parallel',
        })
        .option('asset-prebuild', {
          type: 'boolean',
          desc: 'Whether to build all assets before deploying the first stack (useful for failing Docker builds)',
          default: true,
        })
        .option('ignore-no-stacks', {
          type: 'boolean',
          desc: 'Whether to deploy if the app contains no stacks',
          default: false,
        })
    )
    .command('rollback [STACKS..]', 'Rolls back the stack(s) named STACKS to their last stable state', (yargs: Argv) =>
      yargs
        .option('all', {
          type: 'boolean',
          default: false,
          desc: 'Roll back all available stacks',
        })
        .option('toolkit-stack-name', {
          type: 'string',
          desc: 'The name of the CDK toolkit stack the environment is bootstrapped with',
          requiresArg: true,
        })
        .option('force', {
          alias: 'f',
          type: 'boolean',
          desc: 'Orphan all resources for which the rollback operation fails.',
        })
        .option('validate-bootstrap-version', {
          type: 'boolean',
          desc: "Whether to validate the bootstrap stack version. Defaults to 'true', disable with --no-validate-bootstrap-version.",
        })
        .option('orphan', {
          type: 'array',
          nargs: 1,
          requiresArg: true,
          desc: 'Orphan the given resources, identified by their logical ID (can be specified multiple times)',
          default: [],
        })
    )
    .command('import [STACK]', 'Import existing resource(s) into the given STACK', (yargs: Argv) =>
      yargs
        .option('execute', {
          type: 'boolean',
          desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)',
          default: true,
        })
        .option('change-set-name', {
          type: 'string',
          desc: 'Name of the CloudFormation change set to create',
        })
        .option('toolkit-stack-name', {
          type: 'string',
          desc: 'The name of the CDK toolkit stack to create',
          requiresArg: true,
        })
        .option('rollback', {
          type: 'boolean',
          desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail",
        })
        .option('force', {
          alias: 'f',
          type: 'boolean',
          desc: "Do not abort if the template diff includes updates or deletes. This is probably safe but we're not sure, let us know how it goes.",
        })
        .option('record-resource-mapping', {
          type: 'string',
          alias: 'r',
          requiresArg: true,
          desc: 'If specified, CDK will generate a mapping of existing physical resources to CDK resources to be imported as. The mapping will be written in the given file path. No actual import operation will be performed',
        })
        .option('resource-mapping', {
          type: 'string',
          alias: 'm',
          requiresArg: true,
          desc: 'If specified, CDK will use the given file to map physical resources to CDK resources for import, instead of interactively asking the user. Can be run from scripts',
        })
    )
    .command('watch [STACKS..]', "Shortcut for 'deploy --watch'", (yargs: Argv) =>
      yargs
        .option('build-exclude', {
          type: 'array',
          alias: 'E',
          nargs: 1,
          desc: 'Do not rebuild asset with the given ID. Can be specified multiple times',
          default: [],
        })
        .option('exclusively', {
          type: 'boolean',
          alias: 'e',
          desc: "Only deploy requested stacks, don't include dependencies",
        })
        .option('change-set-name', {
          type: 'string',
          desc: 'Name of the CloudFormation change set to create',
        })
        .option('force', {
          alias: 'f',
          type: 'boolean',
          desc: 'Always deploy stack even if templates are identical',
          default: false,
        })
        .option('toolkit-stack-name', {
          type: 'string',
          desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)',
          requiresArg: true,
        })
        .option('progress', {
          type: 'string',
          choices: ['bar', 'events'],
          desc: 'Display mode for stack activity events',
        })
        .option('rollback', {
          type: 'boolean',
          desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail",
        })
        .middleware(yargsNegativeAlias('rollback', '-R'), true)
        .option('R', {
          type: 'boolean',
          hidden: true,
        })
        .option('hotswap', {
          type: 'boolean',
          desc: "Attempts to perform a 'hotswap' deployment, but does not fall back to a full deployment if that is not possible. Instead, changes to any non-hotswappable properties are ignored.'true' by default, use --no-hotswap to turn off",
        })
        .option('hotswap-fallback', {
          type: 'boolean',
          desc: "Attempts to perform a 'hotswap' deployment, which skips CloudFormation and updates the resources directly, and falls back to a full deployment if that is not possible.",
        })
        .option('logs', {
          type: 'boolean',
          default: true,
          desc: "Show CloudWatch log events from all resources in the selected Stacks in the terminal. 'true' by default, use --no-logs to turn off",
        })
        .option('concurrency', {
          type: 'number',
          desc: 'Maximum number of simultaneous deployments (dependency permitting) to execute.',
          default: 1,
          requiresArg: true,
        })
    )
    .command('destroy [STACKS..]', 'Destroy the stack(s) named STACKS', (yargs: Argv) =>
      yargs
        .option('all', {
          type: 'boolean',
          default: false,
          desc: 'Destroy all available stacks',
        })
        .option('exclusively', {
          type: 'boolean',
          alias: 'e',
          desc: "Only destroy requested stacks, don't include dependees",
        })
        .option('force', {
          type: 'boolean',
          alias: 'f',
          desc: 'Do not ask for confirmation before destroying the stacks',
        })
    )
    .command(
      'diff [STACKS..]',
      'Compares the specified stack with the deployed stack or a local template file, and returns with status 1 if any difference is found',
      (yargs: Argv) =>
        yargs
          .option('exclusively', {
            type: 'boolean',
            alias: 'e',
            desc: "Only diff requested stacks, don't include dependencies",
          })
          .option('context-lines', {
            type: 'number',
            desc: 'Number of context lines to include in arbitrary JSON diff rendering',
            default: 3,
            requiresArg: true,
          })
          .option('template', {
            type: 'string',
            desc: 'The path to the CloudFormation template to compare with',
            requiresArg: true,
          })
          .option('strict', {
            type: 'boolean',
            desc: 'Do not filter out AWS::CDK::Metadata resources, mangled non-ASCII characters, or the CheckBootstrapVersionRule',
            default: false,
          })
          .option('security-only', {
            type: 'boolean',
            desc: 'Only diff for broadened security changes',
            default: false,
          })
          .option('fail', {
            type: 'boolean',
            desc: 'Fail with exit code 1 in case of diff',
          })
          .option('processed', {
            type: 'boolean',
            desc: 'Whether to compare against the template with Transforms already processed',
            default: false,
          })
          .option('quiet', {
            type: 'boolean',
            alias: 'q',
            desc: 'Do not print stack name and default message when there is no diff to stdout',
            default: false,
          })
          .option('change-set', {
            type: 'boolean',
            alias: 'changeset',
            desc: 'Whether to create a changeset to analyze resource replacements. In this mode, diff will use the deploy role instead of the lookup role.',
            default: true,
          })
    )
    .command('metadata [STACK]', 'Returns all metadata associated with this stack')
    .command(['acknowledge [ID]', 'ack [ID]'], 'Acknowledge a notice so that it does not show up anymore')
    .command('notices', 'Returns a list of relevant notices', (yargs: Argv) =>
      yargs.option('unacknowledged', {
        type: 'boolean',
        alias: 'u',
        default: false,
        desc: 'Returns a list of unacknowledged notices',
      })
    )
    .command('init [TEMPLATE]', 'Create a new, empty CDK project from a template.', (yargs: Argv) =>
      yargs
        .option('language', {
          type: 'string',
          alias: 'l',
          desc: 'The language to be used for the new project (default can be configured in ~/.cdk.json)',
          choices: availableInitLanguages,
        })
        .option('list', {
          type: 'boolean',
          desc: 'List the available templates',
        })
        .option('generate-only', {
          type: 'boolean',
          default: false,
          desc: 'If true, only generates project files, without executing additional operations such as setting up a git repo, installing dependencies or compiling the project',
        })
    )
    .command('migrate', false, (yargs: Argv) =>
      yargs
        .option('stack-name', {
          type: 'string',
          alias: 'n',
          desc: 'The name assigned to the stack created in the new project. The name of the app will be based off this name as well.',
          requiresArg: true,
        })
        .option('language', {
          type: 'string',
          default: 'typescript',
          alias: 'l',
          desc: 'The language to be used for the new project',
          choices: migrateSupportedLanguages,
        })
        .option('account', {
          type: 'string',
          desc: 'The account to retrieve the CloudFormation stack template from',
        })
        .option('region', {
          type: 'string',
          desc: 'The region to retrieve the CloudFormation stack template from',
        })
        .option('from-path', {
          type: 'string',
          desc: 'The path to the CloudFormation template to migrate. Use this for locally stored templates',
        })
        .option('from-stack', {
          type: 'boolean',
          desc: 'Use this flag to retrieve the template for an existing CloudFormation stack',
        })
        .option('output-path', {
          type: 'string',
          desc: 'The output path for the migrated CDK app',
        })
        .option('from-scan', {
          type: 'string',
          desc: 'Determines if a new scan should be created, or the last successful existing scan should be used \n options are "new" or "most-recent"',
        })
        .option('filter', {
          type: 'array',
          desc: 'Filters the resource scan based on the provided criteria in the following format: "key1=value1,key2=value2"\n This field can be passed multiple times for OR style filtering: \n filtering options: \n resource-identifier: A key-value pair that identifies the target resource. i.e. {"ClusterName", "myCluster"}\n resource-type-prefix: A string that represents a type-name prefix. i.e. "AWS::DynamoDB::"\n tag-key: a string that matches resources with at least one tag with the provided key. i.e. "myTagKey"\n tag-value: a string that matches resources with at least one tag with the provided value. i.e. "myTagValue"',
        })
        .option('compress', {
          type: 'boolean',
          desc: 'Use this flag to zip the generated CDK app',
        })
    )
    .command('context', 'Manage cached context values', (yargs: Argv) =>
      yargs
        .option('reset', {
          alias: 'e',
          desc: 'The context key (or its index) to reset',
          type: 'string',
          requiresArg: true,
        })
        .option('force', {
          alias: 'f',
          desc: 'Ignore missing key error',
          type: 'boolean',
          default: false,
        })
        .option('clear', {
          desc: 'Clear all context',
          type: 'boolean',
        })
    )
    .command(['docs', 'doc'], 'Opens the reference documentation in a browser', (yargs: Argv) =>
      yargs.option('browser', {
        alias: 'b',
        desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
        type: 'string',
        default: browserDefault,
      })
    )
    .command('doctor', 'Check your set-up for potential problems')
    .version(version)
    .demandCommand(1, '')
    .recommendCommands()
    .help()
    .alias('h', 'help')
    .epilogue(
      'If your app has a single stack, there is no need to specify the stack name\n\nIf one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.'
    )
    .parse(args);
} // eslint-disable-next-line @typescript-eslint/no-require-imports
const yargs = require('yargs');
