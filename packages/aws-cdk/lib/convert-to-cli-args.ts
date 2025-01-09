// -------------------------------------------------------------------------------------------
// GENERATED FROM packages/aws-cdk/lib/config.ts.
// Do not edit by hand; all changes will be overwritten at build time from the config file.
// -------------------------------------------------------------------------------------------
/* eslint-disable @stylistic/max-len */
import { CliArguments, GlobalOptions } from './cli-arguments';
import { Command } from './settings';

// @ts-ignore TS6133
export function convertYargsToCliArgs(args: any): CliArguments {
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
        STACKS: args.STACKS,
      };
      break;

    case 'synthesize':
      commandOptions = {
        exclusively: args.exclusively,
        validation: args.validation,
        quiet: args.quiet,
        STACKS: args.STACKS,
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
        ENVIRONMENTS: args.ENVIRONMENTS,
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
        ENVIRONMENTS: args.ENVIRONMENTS,
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
        STACKS: args.STACKS,
      };
      break;

    case 'rollback':
      commandOptions = {
        all: args.all,
        toolkitStackName: args.toolkitStackName,
        force: args.force,
        validateBootstrapVersion: args.validateBootstrapVersion,
        orphan: args.orphan,
        STACKS: args.STACKS,
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
        STACK: args.STACK,
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
        STACKS: args.STACKS,
      };
      break;

    case 'destroy':
      commandOptions = {
        all: args.all,
        exclusively: args.exclusively,
        force: args.force,
        STACKS: args.STACKS,
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
        STACKS: args.STACKS,
      };
      break;

    case 'metadata':
      commandOptions = {
        STACK: args.STACK,
      };
      break;

    case 'acknowledge':
      commandOptions = {
        ID: args.ID,
      };
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
        TEMPLATE: args.TEMPLATE,
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
    _: args._[0],
    globalOptions,
    [args._[0]]: commandOptions,
  };

  return cliArguments;
}

// @ts-ignore TS6133
export function convertConfigToCliArgs(args: any): CliArguments {
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
  const listOptions = {
    long: args.list.long,
    showDependencies: args.list.showDependencies,
  };
  const synthesizeOptions = {
    exclusively: args.synthesize.exclusively,
    validation: args.synthesize.validation,
    quiet: args.synthesize.quiet,
  };
  const bootstrapOptions = {
    bootstrapBucketName: args.bootstrap.bootstrapBucketName,
    bootstrapKmsKeyId: args.bootstrap.bootstrapKmsKeyId,
    examplePermissionsBoundary: args.bootstrap.examplePermissionsBoundary,
    customPermissionsBoundary: args.bootstrap.customPermissionsBoundary,
    bootstrapCustomerKey: args.bootstrap.bootstrapCustomerKey,
    qualifier: args.bootstrap.qualifier,
    publicAccessBlockConfiguration: args.bootstrap.publicAccessBlockConfiguration,
    tags: args.bootstrap.tags,
    execute: args.bootstrap.execute,
    trust: args.bootstrap.trust,
    trustForLookup: args.bootstrap.trustForLookup,
    cloudformationExecutionPolicies: args.bootstrap.cloudformationExecutionPolicies,
    force: args.bootstrap.force,
    terminationProtection: args.bootstrap.terminationProtection,
    showTemplate: args.bootstrap.showTemplate,
    toolkitStackName: args.bootstrap.toolkitStackName,
    template: args.bootstrap.template,
    previousParameters: args.bootstrap.previousParameters,
  };
  const gcOptions = {
    action: args.gc.action,
    type: args.gc.type,
    rollbackBufferDays: args.gc.rollbackBufferDays,
    createdBufferDays: args.gc.createdBufferDays,
    confirm: args.gc.confirm,
    bootstrapStackName: args.gc.bootstrapStackName,
  };
  const deployOptions = {
    all: args.deploy.all,
    buildExclude: args.deploy.buildExclude,
    exclusively: args.deploy.exclusively,
    requireApproval: args.deploy.requireApproval,
    notificationArns: args.deploy.notificationArns,
    tags: args.deploy.tags,
    execute: args.deploy.execute,
    changeSetName: args.deploy.changeSetName,
    method: args.deploy.method,
    importExistingResources: args.deploy.importExistingResources,
    force: args.deploy.force,
    parameters: args.deploy.parameters,
    outputsFile: args.deploy.outputsFile,
    previousParameters: args.deploy.previousParameters,
    toolkitStackName: args.deploy.toolkitStackName,
    progress: args.deploy.progress,
    rollback: args.deploy.rollback,
    hotswap: args.deploy.hotswap,
    hotswapFallback: args.deploy.hotswapFallback,
    watch: args.deploy.watch,
    logs: args.deploy.logs,
    concurrency: args.deploy.concurrency,
    assetParallelism: args.deploy.assetParallelism,
    assetPrebuild: args.deploy.assetPrebuild,
    ignoreNoStacks: args.deploy.ignoreNoStacks,
  };
  const rollbackOptions = {
    all: args.rollback.all,
    toolkitStackName: args.rollback.toolkitStackName,
    force: args.rollback.force,
    validateBootstrapVersion: args.rollback.validateBootstrapVersion,
    orphan: args.rollback.orphan,
  };
  const importOptions = {
    execute: args.import.execute,
    changeSetName: args.import.changeSetName,
    toolkitStackName: args.import.toolkitStackName,
    rollback: args.import.rollback,
    force: args.import.force,
    recordResourceMapping: args.import.recordResourceMapping,
    resourceMapping: args.import.resourceMapping,
  };
  const watchOptions = {
    buildExclude: args.watch.buildExclude,
    exclusively: args.watch.exclusively,
    changeSetName: args.watch.changeSetName,
    force: args.watch.force,
    toolkitStackName: args.watch.toolkitStackName,
    progress: args.watch.progress,
    rollback: args.watch.rollback,
    hotswap: args.watch.hotswap,
    hotswapFallback: args.watch.hotswapFallback,
    logs: args.watch.logs,
    concurrency: args.watch.concurrency,
  };
  const destroyOptions = {
    all: args.destroy.all,
    exclusively: args.destroy.exclusively,
    force: args.destroy.force,
  };
  const diffOptions = {
    exclusively: args.diff.exclusively,
    contextLines: args.diff.contextLines,
    template: args.diff.template,
    strict: args.diff.strict,
    securityOnly: args.diff.securityOnly,
    fail: args.diff.fail,
    processed: args.diff.processed,
    quiet: args.diff.quiet,
    changeSet: args.diff.changeSet,
  };
  const metadataOptions = {};
  const acknowledgeOptions = {};
  const noticesOptions = {
    unacknowledged: args.notices.unacknowledged,
  };
  const initOptions = {
    language: args.init.language,
    list: args.init.list,
    generateOnly: args.init.generateOnly,
  };
  const migrateOptions = {
    stackName: args.migrate.stackName,
    language: args.migrate.language,
    account: args.migrate.account,
    region: args.migrate.region,
    fromPath: args.migrate.fromPath,
    fromStack: args.migrate.fromStack,
    outputPath: args.migrate.outputPath,
    fromScan: args.migrate.fromScan,
    filter: args.migrate.filter,
    compress: args.migrate.compress,
  };
  const contextOptions = {
    reset: args.context.reset,
    force: args.context.force,
    clear: args.context.clear,
  };
  const docsOptions = {
    browser: args.docs.browser,
  };
  const doctorOptions = {};
  const cliArguments: CliArguments = {
    globalOptions,
    list: listOptions,
    synthesize: synthesizeOptions,
    bootstrap: bootstrapOptions,
    gc: gcOptions,
    deploy: deployOptions,
    rollback: rollbackOptions,
    import: importOptions,
    watch: watchOptions,
    destroy: destroyOptions,
    diff: diffOptions,
    metadata: metadataOptions,
    acknowledge: acknowledgeOptions,
    notices: noticesOptions,
    init: initOptions,
    migrate: migrateOptions,
    context: contextOptions,
    docs: docsOptions,
    doctor: doctorOptions,
  };

  return cliArguments;
}
