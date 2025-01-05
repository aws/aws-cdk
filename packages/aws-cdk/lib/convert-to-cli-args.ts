// -------------------------------------------------------------------------------------------
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
    build: args.build,
    context: args.context,
    plugin: args.plugin,
    trace: args.trace,
    strict: args.strict,
    lookups: args.lookups,
    ignoreErrors: args.ignoreErrors,
    json: args.json,
    verbose: args.verbose,
    debug: args.debug,
    profile: args.profile,
    proxy: args.proxy,
    caBundlePath: args.caBundlePath,
    ec2creds: args.ec2creds,
    versionReporting: args.versionReporting,
    pathMetadata: args.pathMetadata,
    assetMetadata: args.assetMetadata,
    roleArn: args.roleArn,
    staging: args.staging,
    output: args.output,
    notices: args.notices,
    noColor: args.noColor,
    ci: args.ci,
    unstable: args.unstable,
  };
  let commandOptions;
  switch (args._[0] as Command) {
    case 'list':
      commandOptions = {
        long: args.long,
        showDependencies: args.showDependencies,
      };
      break;

    case 'synthesize':
      commandOptions = {
        exclusively: args.exclusively,
        validation: args.validation,
        quiet: args.quiet,
      };
      break;

    case 'bootstrap':
      commandOptions = {
        bootstrapBucketName: args.bootstrapBucketName,
        bootstrapKmsKeyId: args.bootstrapKmsKeyId,
        examplePermissionsBoundary: args.examplePermissionsBoundary,
        customPermissionsBoundary: args.customPermissionsBoundary,
        bootstrapCustomerKey: args.bootstrapCustomerKey,
        qualifier: args.qualifier,
        publicAccessBlockConfiguration: args.publicAccessBlockConfiguration,
        tags: args.tags,
        execute: args.execute,
        trust: args.trust,
        trustForLookup: args.trustForLookup,
        cloudformationExecutionPolicies: args.cloudformationExecutionPolicies,
        force: args.force,
        terminationProtection: args.terminationProtection,
        showTemplate: args.showTemplate,
        toolkitStackName: args.toolkitStackName,
        template: args.template,
        previousParameters: args.previousParameters,
      };
      break;

    case 'gc':
      commandOptions = {
        action: args.action,
        type: args.type,
        rollbackBufferDays: args.rollbackBufferDays,
        createdBufferDays: args.createdBufferDays,
        confirm: args.confirm,
        bootstrapStackName: args.bootstrapStackName,
      };
      break;

    case 'deploy':
      commandOptions = {
        all: args.all,
        buildExclude: args.buildExclude,
        exclusively: args.exclusively,
        requireApproval: args.requireApproval,
        notificationArns: args.notificationArns,
        tags: args.tags,
        execute: args.execute,
        changeSetName: args.changeSetName,
        method: args.method,
        importExistingResources: args.importExistingResources,
        force: args.force,
        parameters: args.parameters,
        outputsFile: args.outputsFile,
        previousParameters: args.previousParameters,
        toolkitStackName: args.toolkitStackName,
        progress: args.progress,
        rollback: args.rollback,
        hotswap: args.hotswap,
        hotswapFallback: args.hotswapFallback,
        watch: args.watch,
        logs: args.logs,
        concurrency: args.concurrency,
        assetParallelism: args.assetParallelism,
        assetPrebuild: args.assetPrebuild,
        ignoreNoStacks: args.ignoreNoStacks,
      };
      break;

    case 'rollback':
      commandOptions = {
        all: args.all,
        toolkitStackName: args.toolkitStackName,
        force: args.force,
        validateBootstrapVersion: args.validateBootstrapVersion,
        orphan: args.orphan,
      };
      break;

    case 'import':
      commandOptions = {
        execute: args.execute,
        changeSetName: args.changeSetName,
        toolkitStackName: args.toolkitStackName,
        rollback: args.rollback,
        force: args.force,
        recordResourceMapping: args.recordResourceMapping,
        resourceMapping: args.resourceMapping,
      };
      break;

    case 'watch':
      commandOptions = {
        buildExclude: args.buildExclude,
        exclusively: args.exclusively,
        changeSetName: args.changeSetName,
        force: args.force,
        toolkitStackName: args.toolkitStackName,
        progress: args.progress,
        rollback: args.rollback,
        hotswap: args.hotswap,
        hotswapFallback: args.hotswapFallback,
        logs: args.logs,
        concurrency: args.concurrency,
      };
      break;

    case 'destroy':
      commandOptions = {
        all: args.all,
        exclusively: args.exclusively,
        force: args.force,
      };
      break;

    case 'diff':
      commandOptions = {
        exclusively: args.exclusively,
        contextLines: args.contextLines,
        template: args.template,
        strict: args.strict,
        securityOnly: args.securityOnly,
        fail: args.fail,
        processed: args.processed,
        quiet: args.quiet,
        changeSet: args.changeSet,
      };
      break;

    case 'metadata':
      commandOptions = {};
      break;

    case 'acknowledge':
      commandOptions = {};
      break;

    case 'notices':
      commandOptions = {
        unacknowledged: args.unacknowledged,
      };
      break;

    case 'init':
      commandOptions = {
        language: args.language,
        list: args.list,
        generateOnly: args.generateOnly,
      };
      break;

    case 'migrate':
      commandOptions = {
        stackName: args.stackName,
        language: args.language,
        account: args.account,
        region: args.region,
        fromPath: args.fromPath,
        fromStack: args.fromStack,
        outputPath: args.outputPath,
        fromScan: args.fromScan,
        filter: args.filter,
        compress: args.compress,
      };
      break;

    case 'context':
      commandOptions = {
        reset: args.reset,
        force: args.force,
        clear: args.clear,
      };
      break;

    case 'docs':
      commandOptions = {
        browser: args.browser,
      };
      break;

    case 'doctor':
      commandOptions = {};
      break;
  }
  const cliArguments: CliArguments = {
    _: args._,
    globalOptions,
    [args._[0]]: commandOptions,
  };

  return cliArguments;
}
