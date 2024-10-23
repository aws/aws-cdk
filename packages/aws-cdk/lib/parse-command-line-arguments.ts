
/* eslint-disable @typescript-eslint/comma-dangle, comma-spacing, max-len, quotes, quote-props*/
import { Argv } from "yargs";

// @ts-ignore TS6133
function parseCommandLineArguments(args: Array<string>, browserDefault?: string, availableInitLanguages: Array<string>, migrateSupportedLanguages: Array<string>, version: string, yargsNegativeAlias: any): any {
  return yargs.usage("Usage: cdk -a <cdk-app> COMMAND").command(['deploy [STACKS..]'], "Deploys the stack(s) named STACKS into your AWS account", (yargs: Argv) => yargs.option("all", {
    "type": "boolean",
    "desc": "Deploy all available stacks",
    "default": false
  }).option("build-exclude", {
    "type": "array",
    "alias": "E",
    "nargs": 1,
    "desc": "Do not rebuild asset with the given ID. Can be specified multiple times",
    "default": []
  }).option("exclusively", {
    "type": "boolean",
    "alias": "e",
    "desc": "Only deploy requested stacks, don't include dependencies"
  }).option("require-approval", {
    "type": "string",
    "choices": ["never","any-change","broadening"],
    "desc": "What security-sensitive changes need manual approval"
  }).option("notification-arns", {
    "type": "array",
    "desc": "ARNs of SNS topics that CloudFormation will notify with stack related events",
    "nargs": 1,
    "requiresArg": true
  }).option("tags", {
    "type": "array",
    "alias": "t",
    "desc": "Tags to add to the stack (KEY=VALUE), overrides tags from Cloud Assembly (deprecated)",
    "nargs": 1,
    "requiresArg": true
  }).option("execute", {
    "type": "boolean",
    "desc": "Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet) (deprecated)",
    "deprecated": true
  }).option("change-set-name", {
    "type": "string",
    "desc": "Name of the CloudFormation change set to create (only if method is not direct)"
  }).option("method", {
    "alias": "m",
    "type": "string",
    "choices": ["direct","change-set","prepare-change-set"],
    "requiresArg": true,
    "desc": "How to perform the deployment. Direct is a bit faster but lacks progress information"
  }).option("force", {
    "alias": "f",
    "type": "boolean",
    "desc": "Always deploy stack even if templates are identical",
    "default": false
  }).option("parameters", {
    "type": "array",
    "desc": "Additional parameters passed to CloudFormation at deploy time (STACK:KEY=VALUE)",
    "nargs": 1,
    "requiresArg": true,
    "default": {}
  }).option("outputs-file", {
    "type": "string",
    "alias": "O",
    "desc": "Path to file where stack outputs will be written as JSON",
    "requiresArg": true
  }).option("previous-parameters", {
    "type": "boolean",
    "default": true,
    "desc": "Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)"
  }).option("toolkit-stack-name", {
    "type": "string",
    "desc": "The name of the existing CDK toolkit stack (only used for app using legacy synthesis)",
    "requiresArg": true
  }).option("progress", {
    "type": "string",
    "choices": ["bar","events"],
    "desc": "Display mode for stack activity events"
  }).option("rollback", {
    "type": "boolean",
    "desc": "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail"
  }).option("R", {
    "type": "boolean",
    "hidden": true
  }).middleware(yargsNegativeAlias(["R","rollback"]), true).option("hotswap", {
    "type": "boolean",
    "desc": "Attempts to perform a 'hotswap' deployment, but does not fall back to a full deployment if that is not possible. Instead, changes to any non-hotswappable properties are ignored.Do not use this in production environments"
  }).option("hotswap-fallback", {
    "type": "boolean",
    "desc": "Attempts to perform a 'hotswap' deployment, which skips CloudFormation and updates the resources directly, and falls back to a full deployment if that is not possible. Do not use this in production environments"
  }).option("watch", {
    "type": "boolean",
    "desc": "Continuously observe the project files, and deploy the given stack(s) automatically when changes are detected. Implies --hotswap by default"
  }).option("logs", {
    "type": "boolean",
    "default": true,
    "desc": "Show CloudWatch log events from all resources in the selected Stacks in the terminal. 'true' by default, use --no-logs to turn off. Only in effect if specified alongside the '--watch' option"
  }).option("concurrency", {
    "type": "number",
    "desc": "Maximum number of simultaneous deployments (dependency permitting) to execute.",
    "default": 1,
    "requiresArg": true
  }).option("asset-parallelism", {
    "type": "boolean",
    "desc": "Whether to build/publish assets in parallel"
  }).option("asset-prebuild", {
    "type": "boolean",
    "desc": "Whether to build all assets before deploying the first stack (useful for failing Docker builds)",
    "default": true
  }).option("ignore-no-stacks", {
    "type": "boolean",
    "desc": "Whether to deploy if the app contains no stacks",
    "default": false
  })).command(['rollback [STACKS..]'], "Rolls back the stack(s) named STACKS to their last stable state", (yargs: Argv) => yargs.option("all", {
    "type": "boolean",
    "default": false,
    "desc": "Roll back all available stacks"
  }).option("toolkit-stack-name", {
    "type": "string",
    "desc": "The name of the CDK toolkit stack the environment is bootstrapped with",
    "requiresArg": true
  }).option("force", {
    "alias": "f",
    "type": "boolean",
    "desc": "Orphan all resources for which the rollback operation fails."
  }).option("validate-bootstrap-version", {
    "type": "boolean",
    "desc": "Whether to validate the bootstrap stack version. Defaults to 'true', disable with --no-validate-bootstrap-version."
  }).option("orphan", {
    "type": "array",
    "nargs": 1,
    "requiresArg": true,
    "desc": "Orphan the given resources, identified by their logical ID (can be specified multiple times)",
    "default": []
  })).command(['import [STACK]'], "Import existing resource(s) into the given STACK", (yargs: Argv) => yargs.option("execute", {
    "type": "boolean",
    "desc": "Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)",
    "default": true
  }).option("change-set-name", {
    "type": "string",
    "desc": "Name of the CloudFormation change set to create"
  }).option("toolkit-stack-name", {
    "type": "string",
    "desc": "The name of the CDK toolkit stack to create",
    "requiresArg": true
  }).option("rollback", {
    "type": "boolean",
    "desc": "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail"
  }).option("force", {
    "alias": "f",
    "type": "boolean",
    "desc": "Do not abort if the template diff includes updates or deletes. This is probably safe but we're not sure, let us know how it goes."
  }).option("record-resource-mapping", {
    "type": "string",
    "alias": "r",
    "requiresArg": true,
    "desc": "If specified, CDK will generate a mapping of existing physical resources to CDK resources to be imported as. The mapping will be written in the given file path. No actual import operation will be performed"
  }).option("resource-mapping", {
    "type": "string",
    "alias": "m",
    "requiresArg": true,
    "desc": "If specified, CDK will use the given file to map physical resources to CDK resources for import, instead of interactively asking the user. Can be run from scripts"
  })).command(['watch [STACKS..]'], "Shortcut for 'deploy --watch'", (yargs: Argv) => yargs.option("build-exclude", {
    "type": "array",
    "alias": "E",
    "nargs": 1,
    "desc": "Do not rebuild asset with the given ID. Can be specified multiple times",
    "default": []
  }).option("exclusively", {
    "type": "boolean",
    "alias": "e",
    "desc": "Only deploy requested stacks, don't include dependencies"
  }).option("change-set-name", {
    "type": "string",
    "desc": "Name of the CloudFormation change set to create"
  }).option("force", {
    "alias": "f",
    "type": "boolean",
    "desc": "Always deploy stack even if templates are identical",
    "default": false
  }).option("toolkit-stack-name", {
    "type": "string",
    "desc": "The name of the existing CDK toolkit stack (only used for app using legacy synthesis)",
    "requiresArg": true
  }).option("progress", {
    "type": "string",
    "choices": ["bar","events"],
    "desc": "Display mode for stack activity events"
  }).option("rollback", {
    "type": "boolean",
    "desc": "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. Note: do **not** disable this flag for deployments with resource replacements, as that will always fail"
  }).option("R", {
    "type": "boolean",
    "hidden": true
  }).middleware(yargsNegativeAlias(["R","rollback"]), true).option("hotswap", {
    "type": "boolean",
    "desc": "Attempts to perform a 'hotswap' deployment, but does not fall back to a full deployment if that is not possible. Instead, changes to any non-hotswappable properties are ignored.'true' by default, use --no-hotswap to turn off"
  }).option("hotswap-fallback", {
    "type": "boolean",
    "desc": "Attempts to perform a 'hotswap' deployment, which skips CloudFormation and updates the resources directly, and falls back to a full deployment if that is not possible."
  }).option("logs", {
    "type": "boolean",
    "default": true,
    "desc": "Show CloudWatch log events from all resources in the selected Stacks in the terminal. 'true' by default, use --no-logs to turn off"
  }).option("concurrency", {
    "type": "number",
    "desc": "Maximum number of simultaneous deployments (dependency permitting) to execute.",
    "default": 1,
    "requiresArg": true
  })).command(['destroy [STACKS..]'], "Destroy the stack(s) named STACKS", (yargs: Argv) => yargs.option("all", {
    "type": "boolean",
    "default": false,
    "desc": "Destroy all available stacks"
  }).option("exclusively", {
    "type": "boolean",
    "alias": "e",
    "desc": "Only destroy requested stacks, don't include dependees"
  }).option("force", {
    "type": "boolean",
    "alias": "f",
    "desc": "Do not ask for confirmation before destroying the stacks"
  })).command(['diff [STACKS..]'], "Compares the specified stack with the deployed stack or a local template file, and returns with status 1 if any difference is found", (yargs: Argv) => yargs.option("exclusively", {
    "type": "boolean",
    "alias": "e",
    "desc": "Only diff requested stacks, don't include dependencies"
  }).option("context-lines", {
    "type": "number",
    "desc": "Number of context lines to include in arbitrary JSON diff rendering",
    "default": 3,
    "requiresArg": true
  }).option("template", {
    "type": "string",
    "desc": "The path to the CloudFormation template to compare with",
    "requiresArg": true
  }).option("strict", {
    "type": "boolean",
    "desc": "Do not filter out AWS::CDK::Metadata resources, mangled non-ASCII characters, or the CheckBootstrapVersionRule",
    "default": false
  }).option("security-only", {
    "type": "boolean",
    "desc": "Only diff for broadened security changes",
    "default": false
  }).option("fail", {
    "type": "boolean",
    "desc": "Fail with exit code 1 in case of diff"
  }).option("processed", {
    "type": "boolean",
    "desc": "Whether to compare against the template with Transforms already processed",
    "default": false
  }).option("quiet", {
    "type": "boolean",
    "alias": "q",
    "desc": "Do not print stack name and default message when there is no diff to stdout",
    "default": false
  }).option("change-set", {
    "type": "boolean",
    "alias": "changeset",
    "desc": "Whether to create a changeset to analyze resource replacements. In this mode, diff will use the deploy role instead of the lookup role.",
    "default": true
  })).command(['metadata [STACK]'], "Returns all metadata associated with this stack").command(['acknowledge [ID]', 'ack  [ID]'], "Acknowledge a notice so that it does not show up anymore").command(['notices'], "Returns a list of relevant notices", (yargs: Argv) => yargs.option("unacknowledged", {
    "type": "boolean",
    "alias": "u",
    "default": false,
    "desc": "Returns a list of unacknowledged notices"
  })).command(['init [TEMPLATE]'], "Create a new, empty CDK project from a template.", (yargs: Argv) => yargs.option("language", {
    "type": "string",
    "alias": "l",
    "desc": "The language to be used for the new project (default can be configured in ~/.cdk.json)",
    "choices": availableInitLanguages
  }).option("list", {
    "type": "boolean",
    "desc": "List the available templates"
  }).option("generate-only", {
    "type": "boolean",
    "default": false,
    "desc": "If true, only generates project files, without executing additional operations such as setting up a git repo, installing dependencies or compiling the project"
  })).command(['migrate'], false, (yargs: Argv) => yargs.option("stack-name", {
    "type": "string",
    "alias": "n",
    "desc": "The name assigned to the stack created in the new project. The name of the app will be based off this name as well.",
    "requiresArg": true
  }).option("language", {
    "type": "string",
    "default": "typescript",
    "alias": "l",
    "desc": "The language to be used for the new project",
    "choices": migrateSupportedLanguages
  }).option("account", {
    "type": "string",
    "desc": "The account to retrieve the CloudFormation stack template from"
  }).option("region", {
    "type": "string",
    "desc": "The region to retrieve the CloudFormation stack template from"
  }).option("from-path", {
    "type": "string",
    "desc": "The path to the CloudFormation template to migrate. Use this for locally stored templates"
  }).option("from-stack", {
    "type": "boolean",
    "desc": "Use this flag to retrieve the template for an existing CloudFormation stack"
  }).option("output-path", {
    "type": "string",
    "desc": "The output path for the migrated CDK app"
  }).option("from-scan", {
    "type": "string",
    "desc": "Determines if a new scan should be created, or the last successful existing scan should be used \n options are \"new\" or \"most-recent\""
  }).option("filter", {
    "type": "array",
    "desc": "Filters the resource scan based on the provided criteria in the following format: \"key1=value1,key2=value2\"\n This field can be passed multiple times for OR style filtering: \n filtering options: \n resource-identifier: A key-value pair that identifies the target resource. i.e. {\"ClusterName\", \"myCluster\"}\n resource-type-prefix: A string that represents a type-name prefix. i.e. \"AWS::DynamoDB::\"\n tag-key: a string that matches resources with at least one tag with the provided key. i.e. \"myTagKey\"\n tag-value: a string that matches resources with at least one tag with the provided value. i.e. \"myTagValue\""
  }).option("compress", {
    "type": "boolean",
    "desc": "Use this flag to zip the generated CDK app"
  })).command(['context'], "Manage cached context values", (yargs: Argv) => yargs.option("reset", {
    "alias": "e",
    "desc": "The context key (or its index) to reset",
    "type": "string",
    "requiresArg": true
  }).option("force", {
    "alias": "f",
    "desc": "Ignore missing key error",
    "type": "boolean",
    "default": false
  }).option("clear", {
    "desc": "Clear all context",
    "type": "boolean"
  })).command(['docs', 'doc '], "Opens the reference documentation in a browser", (yargs: Argv) => yargs.option("browser", {
    "alias": "b",
    "desc": "the command to use to open the browser, using %u as a placeholder for the path of the file to open",
    "type": "string",
    "default": browserDefault
  })).command(['doctor'], "Check your set-up for potential problems").version(version).demandCommand(1, "''").recommendCommands().help().alias("h", "help").epilogue("If your app has a single stack, there is no need to specify the stack name\n\nIf one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.").parse(args);
}// https://github.com/yargs/yargs/issues/1929
// https://github.com/evanw/esbuild/issues/1492
// eslint-disable-next-line @typescript-eslint/no-require-imports
const yargs = require('yargs');