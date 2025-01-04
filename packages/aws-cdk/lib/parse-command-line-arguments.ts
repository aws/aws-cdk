// -------------------------------------------------------------------------------------------
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
    .option('app', {
      default: undefined,
      type: 'string',
      alias: 'a',
      desc: 'REQUIRED WHEN RUNNING APP: command-line for executing your app or a cloud assembly directory (e.g. "node bin/my-app.js"). Can also be specified in cdk.json or ~/.cdk.json',
      requiresArg: true,
    })
    .option('build', {
      default: undefined,
      type: 'string',
      desc: 'Command-line for a pre-synth build',
    })
    .option('context', {
      default: [],
      type: 'array',
      alias: 'c',
      desc: 'Add contextual string parameter (KEY=VALUE)',
      nargs: 1,
      requiresArg: true,
    })
    .option('plugin', {
      default: [],
      type: 'array',
      alias: 'p',
      desc: 'Name or path of a node package that extend the CDK features. Can be specified multiple times',
      nargs: 1,
      requiresArg: true,
    })
    .option('trace', {
      default: undefined,
      type: 'boolean',
      desc: 'Print trace for stack warnings',
    })
    .option('strict', {
      default: undefined,
      type: 'boolean',
      desc: 'Do not construct stacks with warnings',
    })
    .option('lookups', {
      default: true,
      type: 'boolean',
      desc: 'Perform context lookups (synthesis fails if this is disabled and context lookups need to be performed)',
    })
    .option('ignore-errors', {
      default: false,
      type: 'boolean',
      desc: 'Ignores synthesis errors, which will likely produce an invalid output',
    })
    .option('json', {
      default: false,
      type: 'boolean',
      alias: 'j',
      desc: 'Use JSON output instead of YAML when templates are printed to STDOUT',
    })
    .option('verbose', {
      default: false,
      type: 'boolean',
      alias: 'v',
      desc: 'Show debug logs (specify multiple times to increase verbosity)',
      count: true,
    })
    .option('debug', {
      default: false,
      type: 'boolean',
      desc: 'Debug the CDK app. Log additional information during synthesis, such as creation stack traces of tokens (sets CDK_DEBUG, will slow down synthesis)',
    })
    .option('profile', {
      default: undefined,
      type: 'string',
      desc: 'Use the indicated AWS profile as the default environment',
      requiresArg: true,
    })
    .option('proxy', {
      default: undefined,
      type: 'string',
      desc: 'Use the indicated proxy. Will read from HTTPS_PROXY environment variable if not specified',
      requiresArg: true,
    })
    .option('ca-bundle-path', {
      default: undefined,
      type: 'string',
      desc: 'Path to CA certificate to use when validating HTTPS requests. Will read from AWS_CA_BUNDLE environment variable if not specified',
      requiresArg: true,
    })
    .option('ec2creds', {
      default: undefined,
      type: 'boolean',
      alias: 'i',
      desc: 'Force trying to fetch EC2 instance credentials. Default: guess EC2 instance status',
    })
    .option('version-reporting', {
      default: undefined,
      type: 'boolean',
      desc: 'Include the "AWS::CDK::Metadata" resource in synthesized templates (enabled by default)',
    })
    .option('path-metadata', {
      default: undefined,
      type: 'boolean',
      desc: 'Include "aws:cdk:path" CloudFormation metadata for each resource (enabled by default)',
    })
    .option('asset-metadata', {
      default: undefined,
      type: 'boolean',
      desc: 'Include "aws:asset:*" CloudFormation metadata for resources that uses assets (enabled by default)',
    })
    .option('role-arn', {
      default: undefined,
      type: 'string',
      alias: 'r',
      desc: 'ARN of Role to use when invoking CloudFormation',
      requiresArg: true,
    })
    .option('staging', {
      default: true,
      type: 'boolean',
      desc: 'Copy assets to the output directory (use --no-staging to disable the copy of assets which allows local debugging via the SAM CLI to reference the original source files)',
    })
    .option('output', {
      default: undefined,
      type: 'string',
      alias: 'o',
      desc: 'Emits the synthesized cloud assembly into a directory (default: cdk.out)',
      requiresArg: true,
    })
    .option('notices', {
      default: undefined,
      type: 'boolean',
      desc: 'Show relevant notices',
    })
    .option('no-color', {
      default: false,
      type: 'boolean',
      desc: 'Removes colors and other style from console output',
    })
    .option('ci', {
      default: helpers.isCI(),
      type: 'boolean',
      desc: 'Force CI detection. If CI=true then logs will be sent to stdout instead of stderr',
    })
    .option('unstable', {
      default: [],
      type: 'array',
      desc: 'Opt in to unstable features. The flag indicates that the scope and API of a feature might still change. Otherwise the feature is generally production ready and fully supported. Can be specified multiple times.',
      nargs: 1,
      requiresArg: true,
    })
    .command(['list [STACKS..]', 'ls [STACKS..]'], 'Lists all stacks in the app', (yargs: Argv) =>
      yargs
        .option('long', {
          default: false,
          type: 'boolean',
          alias: 'l',
          desc: 'Display environment information for each stack',
        })
        .option('show-dependencies', {
          default: false,
          type: 'boolean',
          alias: 'd',
          desc: 'Display stack dependency information for each stack',
        }),
    )
    .command(['synthesize [STACKS..]', 'synth [STACKS..]'], 'Synthesizes and prints the CloudFormation template for this stack', (yargs: Argv) =>
      yargs
        .option('exclusively', {
          default: undefined,
          type: 'boolean',
          alias: 'e',
          desc: "Only synthesize requested stacks, don't include dependencies",
        })
        .option('validation', {
          default: true,
          type: 'boolean',
          desc: 'After synthesis, validate stacks with the "validateOnSynth" attribute set (can also be controlled with CDK_VALIDATION)',
        })
        .option('quiet', {
          default: false,
          type: 'boolean',
          alias: 'q',
          desc: 'Do not output CloudFormation Template to stdout',
        }),
    )
    .command('bootstrap [ENVIRONMENTS..]', 'Deploys the CDK toolkit stack into an AWS environment', (yargs: Argv) =>
      yargs
        .option('bootstrap-bucket-name', {
          default: undefined,
          type: 'string',
          alias: ['b', 'toolkit-bucket-name'],
          desc: 'The name of the CDK toolkit bucket; bucket will be created and must not exist',
        })
        .option('bootstrap-kms-key-id', {
          default: undefined,
          type: 'string',
          desc: 'AWS KMS master key ID used for the SSE-KMS encryption',
          conflicts: 'bootstrap-customer-key',
        })
        .option('example-permissions-boundary', {
          default: undefined,
          type: 'boolean',
          alias: 'epb',
          desc: 'Use the example permissions boundary.',
          conflicts: 'custom-permissions-boundary',
        })
        .option('custom-permissions-boundary', {
          default: undefined,
          type: 'string',
          alias: 'cpb',
          desc: 'Use the permissions boundary specified by name.',
          conflicts: 'example-permissions-boundary',
        })
        .option('bootstrap-customer-key', {
          default: undefined,
          type: 'boolean',
          desc: 'Create a Customer Master Key (CMK) for the bootstrap bucket (you will be charged but can customize permissions, modern bootstrapping only)',
          conflicts: 'bootstrap-kms-key-id',
        })
        .option('qualifier', {
          default: undefined,
          type: 'string',
          desc: 'String which must be unique for each bootstrap stack. You must configure it on your CDK app if you change this from the default.',
        })
        .option('public-access-block-configuration', {
          default: undefined,
          type: 'boolean',
          desc: 'Block public access configuration on CDK toolkit bucket (enabled by default) ',
        })
        .option('tags', {
          default: [],
          type: 'array',
          alias: 't',
          desc: 'Tags to add for the stack (KEY=VALUE)',
          nargs: 1,
          requiresArg: true,
        })
        .option('execute', {
          default: true,
          type: 'boolean',
          desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)',
        })
        .option('trust', {
          default: [],
          type: 'array',
          desc: 'The AWS account IDs that should be trusted to perform deployments into this environment (may be repeated, modern bootstrapping only)',
          nargs: 1,
          requiresArg: true,
        })
        .option('trust-for-lookup', {
          default: [],
          type: 'array',
          desc: 'The AWS account IDs that should be trusted to look up values in this environment (may be repeated, modern bootstrapping only)',
          nargs: 1,
          requiresArg: true,
        })
        .option('cloudformation-execution-policies', {
          default: [],
          type: 'array',
          desc: 'The Managed Policy ARNs that should be attached to the role performing deployments into this environment (may be repeated, modern bootstrapping only)',
          nargs: 1,
          requiresArg: true,
        })
        .option('force', {
          default: false,
          alias: 'f',
          type: 'boolean',
          desc: 'Always bootstrap even if it would downgrade template version',
        })
        .option('termination-protection', {
          default: undefined,
          type: 'boolean',
          desc: 'Toggle CloudFormation termination protection on the bootstrap stacks',
        })
        .option('show-template', {
          default: false,
          type: 'boolean',
          desc: "Instead of actual bootstrapping, print the current CLI's bootstrapping template to stdout for customization",
        })
        .option('toolkit-stack-name', {
          default: undefined,
          type: 'string',
          desc: 'The name of the CDK toolkit stack to create',
          requiresArg: true,
        })
        .option('template', {
          default: undefined,
          type: 'string',
          requiresArg: true,
          desc: 'Use the template from the given file instead of the built-in one (use --show-template to obtain an example)',
        })
        .option('previous-parameters', {
          default: true,
          type: 'boolean',
          desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)',
        }),
    )
    .command(
      'gc [ENVIRONMENTS..]',
      'Garbage collect assets. Options detailed here: https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/README.md#cdk-gc',
      (yargs: Argv) =>
        yargs
          .option('action', {
            default: 'full',
            type: 'string',
            desc: 'The action (or sub-action) you want to perform. Valid entires are "print", "tag", "delete-tagged", "full".',
          })
          .option('type', {
            default: 'all',
            type: 'string',
            desc: 'Specify either ecr, s3, or all',
          })
          .option('rollback-buffer-days', {
            default: 0,
            type: 'number',
            desc: 'Delete assets that have been marked as isolated for this many days',
          })
          .option('created-buffer-days', {
            default: 1,
            type: 'number',
            desc: 'Never delete assets younger than this (in days)',
          })
          .option('confirm', {
            default: true,
            type: 'boolean',
            desc: 'Confirm via manual prompt before deletion',
          })
          .option('bootstrap-stack-name', {
            default: undefined,
            type: 'string',
            desc: 'The name of the CDK toolkit stack, if different from the default "CDKToolkit"',
            requiresArg: true,
          }),
    )
    .command('deploy [STACKS..]', 'Deploys the stack(s) named STACKS into your AWS account', (yargs: Argv) =>
      yargs
        .option('all', {
          default: false,
          type: 'boolean',
          desc: 'Deploy all available stacks',
        })
        .option('build-exclude', {
          default: [],
          type: 'array',
          alias: 'E',
          desc: 'Do not rebuild asset with the given ID. Can be specified multiple times',
          nargs: 1,
          requiresArg: true,
        })
        .option('exclusively', {
          default: undefined,
          type: 'boolean',
          alias: 'e',
          desc: "Only deploy requested stacks, don't include dependencies",
        })
        .option('require-approval', {
          default: undefined,
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
          default: [],
          type: 'array',
          alias: 't',
          desc: 'Tags to add to the stack (KEY=VALUE), overrides tags from Cloud Assembly (deprecated)',
          nargs: 1,
          requiresArg: true,
        })
        .option('execute', {
          default: undefined,
          type: 'boolean',
          desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet) (deprecated)',
          deprecated: true,
        })
        .option('change-set-name', {
          default: undefined,
          type: 'string',
          desc: 'Name of the CloudFormation change set to create (only if method is not direct)',
        })
        .option('method', {
          default: undefined,
          alias: 'm',
          type: 'string',
          choices: ['direct', 'change-set', 'prepare-change-set'],
          requiresArg: true,
          desc: 'How to perform the deployment. Direct is a bit faster but lacks progress information',
        })
        .option('import-existing-resources', {
          default: false,
          type: 'boolean',
          desc: 'Indicates if the stack set imports resources that already exist.',
        })
        .option('force', {
          default: false,
          alias: 'f',
          type: 'boolean',
          desc: 'Always deploy stack even if templates are identical',
        })
        .option('parameters', {
          default: {},
          type: 'array',
          desc: 'Additional parameters passed to CloudFormation at deploy time (STACK:KEY=VALUE)',
          nargs: 1,
          requiresArg: true,
        })
        .option('outputs-file', {
          default: undefined,
          type: 'string',
          alias: 'O',
          desc: 'Path to file where stack outputs will be written as JSON',
          requiresArg: true,
        })
        .option('previous-parameters', {
          default: true,
          type: 'boolean',
          desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)',
        })
        .option('toolkit-stack-name', {
          default: undefined,
          type: 'string',
          desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)',
          requiresArg: true,
        })
        .option('progress', {
          default: undefined,
          type: 'string',
          choices: ['bar', 'events'],
          desc: 'Display mode for stack activity events',
        })
        .option('rollback', {
          default: undefined,
          type: 'boolean',
          desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail",
        })
        .option('R', { type: 'boolean', hidden: true })
        .middleware(helpers.yargsNegativeAlias('R', 'rollback'), true)
        .option('hotswap', {
          default: undefined,
          type: 'boolean',
          desc: "Attempts to perform a 'hotswap' deployment, but does not fall back to a full deployment if that is not possible. Instead, changes to any non-hotswappable properties are ignored.Do not use this in production environments",
        })
        .option('hotswap-fallback', {
          default: undefined,
          type: 'boolean',
          desc: "Attempts to perform a 'hotswap' deployment, which skips CloudFormation and updates the resources directly, and falls back to a full deployment if that is not possible. Do not use this in production environments",
        })
        .option('watch', {
          default: undefined,
          type: 'boolean',
          desc: 'Continuously observe the project files, and deploy the given stack(s) automatically when changes are detected. Implies --hotswap by default',
        })
        .option('logs', {
          default: true,
          type: 'boolean',
          desc: "Show CloudWatch log events from all resources in the selected Stacks in the terminal. 'true' by default, use --no-logs to turn off. Only in effect if specified alongside the '--watch' option",
        })
        .option('concurrency', {
          default: 1,
          type: 'number',
          desc: 'Maximum number of simultaneous deployments (dependency permitting) to execute.',
          requiresArg: true,
        })
        .option('asset-parallelism', {
          default: undefined,
          type: 'boolean',
          desc: 'Whether to build/publish assets in parallel',
        })
        .option('asset-prebuild', {
          default: true,
          type: 'boolean',
          desc: 'Whether to build all assets before deploying the first stack (useful for failing Docker builds)',
        })
        .option('ignore-no-stacks', {
          default: false,
          type: 'boolean',
          desc: 'Whether to deploy if the app contains no stacks',
        }),
    )
    .command('rollback [STACKS..]', 'Rolls back the stack(s) named STACKS to their last stable state', (yargs: Argv) =>
      yargs
        .option('all', {
          default: false,
          type: 'boolean',
          desc: 'Roll back all available stacks',
        })
        .option('toolkit-stack-name', {
          default: undefined,
          type: 'string',
          desc: 'The name of the CDK toolkit stack the environment is bootstrapped with',
          requiresArg: true,
        })
        .option('force', {
          default: undefined,
          alias: 'f',
          type: 'boolean',
          desc: 'Orphan all resources for which the rollback operation fails.',
        })
        .option('validate-bootstrap-version', {
          default: undefined,
          type: 'boolean',
          desc: "Whether to validate the bootstrap stack version. Defaults to 'true', disable with --no-validate-bootstrap-version.",
        })
        .option('orphan', {
          default: [],
          type: 'array',
          desc: 'Orphan the given resources, identified by their logical ID (can be specified multiple times)',
          nargs: 1,
          requiresArg: true,
        }),
    )
    .command('import [STACK]', 'Import existing resource(s) into the given STACK', (yargs: Argv) =>
      yargs
        .option('execute', {
          default: true,
          type: 'boolean',
          desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)',
        })
        .option('change-set-name', {
          default: undefined,
          type: 'string',
          desc: 'Name of the CloudFormation change set to create',
        })
        .option('toolkit-stack-name', {
          default: undefined,
          type: 'string',
          desc: 'The name of the CDK toolkit stack to create',
          requiresArg: true,
        })
        .option('rollback', {
          default: undefined,
          type: 'boolean',
          desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail",
        })
        .option('force', {
          default: undefined,
          alias: 'f',
          type: 'boolean',
          desc: "Do not abort if the template diff includes updates or deletes. This is probably safe but we're not sure, let us know how it goes.",
        })
        .option('record-resource-mapping', {
          default: undefined,
          type: 'string',
          alias: 'r',
          requiresArg: true,
          desc: 'If specified, CDK will generate a mapping of existing physical resources to CDK resources to be imported as. The mapping will be written in the given file path. No actual import operation will be performed',
        })
        .option('resource-mapping', {
          default: undefined,
          type: 'string',
          alias: 'm',
          requiresArg: true,
          desc: 'If specified, CDK will use the given file to map physical resources to CDK resources for import, instead of interactively asking the user. Can be run from scripts',
        }),
    )
    .command('watch [STACKS..]', "Shortcut for 'deploy --watch'", (yargs: Argv) =>
      yargs
        .option('build-exclude', {
          default: [],
          type: 'array',
          alias: 'E',
          desc: 'Do not rebuild asset with the given ID. Can be specified multiple times',
          nargs: 1,
          requiresArg: true,
        })
        .option('exclusively', {
          default: undefined,
          type: 'boolean',
          alias: 'e',
          desc: "Only deploy requested stacks, don't include dependencies",
        })
        .option('change-set-name', {
          default: undefined,
          type: 'string',
          desc: 'Name of the CloudFormation change set to create',
        })
        .option('force', {
          default: false,
          alias: 'f',
          type: 'boolean',
          desc: 'Always deploy stack even if templates are identical',
        })
        .option('toolkit-stack-name', {
          default: undefined,
          type: 'string',
          desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)',
          requiresArg: true,
        })
        .option('progress', {
          default: undefined,
          type: 'string',
          choices: ['bar', 'events'],
          desc: 'Display mode for stack activity events',
        })
        .option('rollback', {
          default: undefined,
          type: 'boolean',
          desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail",
        })
        .option('R', { type: 'boolean', hidden: true })
        .middleware(helpers.yargsNegativeAlias('R', 'rollback'), true)
        .option('hotswap', {
          default: undefined,
          type: 'boolean',
          desc: "Attempts to perform a 'hotswap' deployment, but does not fall back to a full deployment if that is not possible. Instead, changes to any non-hotswappable properties are ignored.'true' by default, use --no-hotswap to turn off",
        })
        .option('hotswap-fallback', {
          default: undefined,
          type: 'boolean',
          desc: "Attempts to perform a 'hotswap' deployment, which skips CloudFormation and updates the resources directly, and falls back to a full deployment if that is not possible.",
        })
        .option('logs', {
          default: true,
          type: 'boolean',
          desc: "Show CloudWatch log events from all resources in the selected Stacks in the terminal. 'true' by default, use --no-logs to turn off",
        })
        .option('concurrency', {
          default: 1,
          type: 'number',
          desc: 'Maximum number of simultaneous deployments (dependency permitting) to execute.',
          requiresArg: true,
        }),
    )
    .command('destroy [STACKS..]', 'Destroy the stack(s) named STACKS', (yargs: Argv) =>
      yargs
        .option('all', {
          default: false,
          type: 'boolean',
          desc: 'Destroy all available stacks',
        })
        .option('exclusively', {
          default: undefined,
          type: 'boolean',
          alias: 'e',
          desc: "Only destroy requested stacks, don't include dependees",
        })
        .option('force', {
          default: undefined,
          type: 'boolean',
          alias: 'f',
          desc: 'Do not ask for confirmation before destroying the stacks',
        }),
    )
    .command(
      'diff [STACKS..]',
      'Compares the specified stack with the deployed stack or a local template file, and returns with status 1 if any difference is found',
      (yargs: Argv) =>
        yargs
          .option('exclusively', {
            default: undefined,
            type: 'boolean',
            alias: 'e',
            desc: "Only diff requested stacks, don't include dependencies",
          })
          .option('context-lines', {
            default: 3,
            type: 'number',
            desc: 'Number of context lines to include in arbitrary JSON diff rendering',
            requiresArg: true,
          })
          .option('template', {
            default: undefined,
            type: 'string',
            desc: 'The path to the CloudFormation template to compare with',
            requiresArg: true,
          })
          .option('strict', {
            default: false,
            type: 'boolean',
            desc: 'Do not filter out AWS::CDK::Metadata resources, mangled non-ASCII characters, or the CheckBootstrapVersionRule',
          })
          .option('security-only', {
            default: false,
            type: 'boolean',
            desc: 'Only diff for broadened security changes',
          })
          .option('fail', {
            default: undefined,
            type: 'boolean',
            desc: 'Fail with exit code 1 in case of diff',
          })
          .option('processed', {
            default: false,
            type: 'boolean',
            desc: 'Whether to compare against the template with Transforms already processed',
          })
          .option('quiet', {
            default: false,
            type: 'boolean',
            alias: 'q',
            desc: 'Do not print stack name and default message when there is no diff to stdout',
          })
          .option('change-set', {
            default: true,
            type: 'boolean',
            alias: 'changeset',
            desc: 'Whether to create a changeset to analyze resource replacements. In this mode, diff will use the deploy role instead of the lookup role.',
          }),
    )
    .command('metadata [STACK]', 'Returns all metadata associated with this stack')
    .command(['acknowledge [ID]', 'ack [ID]'], 'Acknowledge a notice so that it does not show up anymore')
    .command('notices', 'Returns a list of relevant notices', (yargs: Argv) =>
      yargs.option('unacknowledged', {
        default: false,
        type: 'boolean',
        alias: 'u',
        desc: 'Returns a list of unacknowledged notices',
      }),
    )
    .command('init [TEMPLATE]', 'Create a new, empty CDK project from a template.', (yargs: Argv) =>
      yargs
        .option('language', {
          default: undefined,
          type: 'string',
          alias: 'l',
          desc: 'The language to be used for the new project (default can be configured in ~/.cdk.json)',
          choices: ['csharp', 'fsharp', 'go', 'java', 'javascript', 'python', 'typescript'],
        })
        .option('list', {
          default: undefined,
          type: 'boolean',
          desc: 'List the available templates',
        })
        .option('generate-only', {
          default: false,
          type: 'boolean',
          desc: 'If true, only generates project files, without executing additional operations such as setting up a git repo, installing dependencies or compiling the project',
        }),
    )
    .command('migrate', 'Migrate existing AWS resources into a CDK app', (yargs: Argv) =>
      yargs
        .option('stack-name', {
          default: undefined,
          type: 'string',
          alias: 'n',
          desc: 'The name assigned to the stack created in the new project. The name of the app will be based off this name as well.',
          requiresArg: true,
        })
        .option('language', {
          default: 'typescript',
          type: 'string',
          alias: 'l',
          desc: 'The language to be used for the new project',
          choices: ['typescript', 'go', 'java', 'python', 'csharp'],
        })
        .option('account', {
          default: undefined,
          type: 'string',
          desc: 'The account to retrieve the CloudFormation stack template from',
        })
        .option('region', {
          default: undefined,
          type: 'string',
          desc: 'The region to retrieve the CloudFormation stack template from',
        })
        .option('from-path', {
          default: undefined,
          type: 'string',
          desc: 'The path to the CloudFormation template to migrate. Use this for locally stored templates',
        })
        .option('from-stack', {
          default: undefined,
          type: 'boolean',
          desc: 'Use this flag to retrieve the template for an existing CloudFormation stack',
        })
        .option('output-path', {
          default: undefined,
          type: 'string',
          desc: 'The output path for the migrated CDK app',
        })
        .option('from-scan', {
          default: undefined,
          type: 'string',
          desc: 'Determines if a new scan should be created, or the last successful existing scan should be used \n options are "new" or "most-recent"',
        })
        .option('filter', {
          default: [],
          type: 'array',
          desc: 'Filters the resource scan based on the provided criteria in the following format: "key1=value1,key2=value2"\n This field can be passed multiple times for OR style filtering: \n filtering options: \n resource-identifier: A key-value pair that identifies the target resource. i.e. {"ClusterName", "myCluster"}\n resource-type-prefix: A string that represents a type-name prefix. i.e. "AWS::DynamoDB::"\n tag-key: a string that matches resources with at least one tag with the provided key. i.e. "myTagKey"\n tag-value: a string that matches resources with at least one tag with the provided value. i.e. "myTagValue"',
          nargs: 1,
          requiresArg: true,
        })
        .option('compress', {
          default: undefined,
          type: 'boolean',
          desc: 'Use this flag to zip the generated CDK app',
        }),
    )
    .command('context', 'Manage cached context values', (yargs: Argv) =>
      yargs
        .option('reset', {
          default: undefined,
          alias: 'e',
          desc: 'The context key (or its index) to reset',
          type: 'string',
          requiresArg: true,
        })
        .option('force', {
          default: false,
          alias: 'f',
          desc: 'Ignore missing key error',
          type: 'boolean',
        })
        .option('clear', {
          default: false,
          desc: 'Clear all context',
          type: 'boolean',
        }),
    )
    .command(['docs', 'doc'], 'Opens the reference documentation in a browser', (yargs: Argv) =>
      yargs.option('browser', {
        default: helpers.browserForPlatform(),
        alias: 'b',
        desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
        type: 'string',
      }),
    )
    .command('doctor', 'Check your set-up for potential problems')
    .version(helpers.cliVersion())
    .demandCommand(1, '')
    .recommendCommands()
    .help()
    .alias('h', 'help')
    .epilogue(
      'If your app has a single stack, there is no need to specify the stack name\n\nIf one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
    )
    .parse(args);
} // eslint-disable-next-line @typescript-eslint/no-require-imports
const yargs = require('yargs');
