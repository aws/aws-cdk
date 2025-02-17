// -------------------------------------------------------------------------------------------
// GENERATED FROM packages/aws-cdk/lib/cli/cli-config.ts.
// Do not edit by hand; all changes will be overwritten at build time from the config file.
// -------------------------------------------------------------------------------------------
/* eslint-disable @stylistic/max-len */
import { Command } from './user-configuration';
import { UserInput, GlobalOptions } from './user-input';

// @ts-ignore TS6133
export function convertYargsToUserInput(args: any): UserInput {
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
    case 'ls':
      commandOptions = {
        long: args.long,
        showDependencies: args.showDependencies,
        STACKS: args.STACKS,
      };
      break;

    case 'synth':
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
        untrust: args.untrust,
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
    case 'ack':
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
    case 'doc':
      commandOptions = {
        browser: args.browser,
      };
      break;

    case 'doctor':
      commandOptions = {};
      break;
  }
  const userInput: UserInput = {
    command: args._[0],
    globalOptions,
    [args._[0]]: commandOptions,
  };

  return userInput;
}

// @ts-ignore TS6133
export function convertConfigToUserInput(config: any): UserInput {
  const globalOptions: GlobalOptions = {
    app: config.app,
    build: config.build,
    context: config.context,
    plugin: config.plugin,
    trace: config.trace,
    strict: config.strict,
    lookups: config.lookups,
    ignoreErrors: config.ignoreErrors,
    json: config.json,
    verbose: config.verbose,
    debug: config.debug,
    profile: config.profile,
    proxy: config.proxy,
    caBundlePath: config.caBundlePath,
    ec2creds: config.ec2creds,
    versionReporting: config.versionReporting,
    pathMetadata: config.pathMetadata,
    assetMetadata: config.assetMetadata,
    roleArn: config.roleArn,
    staging: config.staging,
    output: config.output,
    notices: config.notices,
    noColor: config.noColor,
    ci: config.ci,
    unstable: config.unstable,
  };
  const listOptions = {
    long: config.list?.long,
    showDependencies: config.list?.showDependencies,
  };
  const synthOptions = {
    exclusively: config.synth?.exclusively,
    validation: config.synth?.validation,
    quiet: config.synth?.quiet,
  };
  const bootstrapOptions = {
    bootstrapBucketName: config.bootstrap?.bootstrapBucketName,
    bootstrapKmsKeyId: config.bootstrap?.bootstrapKmsKeyId,
    examplePermissionsBoundary: config.bootstrap?.examplePermissionsBoundary,
    customPermissionsBoundary: config.bootstrap?.customPermissionsBoundary,
    bootstrapCustomerKey: config.bootstrap?.bootstrapCustomerKey,
    qualifier: config.bootstrap?.qualifier,
    publicAccessBlockConfiguration: config.bootstrap?.publicAccessBlockConfiguration,
    tags: config.bootstrap?.tags,
    execute: config.bootstrap?.execute,
    trust: config.bootstrap?.trust,
    trustForLookup: config.bootstrap?.trustForLookup,
    untrust: config.bootstrap?.untrust,
    cloudformationExecutionPolicies: config.bootstrap?.cloudformationExecutionPolicies,
    force: config.bootstrap?.force,
    terminationProtection: config.bootstrap?.terminationProtection,
    showTemplate: config.bootstrap?.showTemplate,
    toolkitStackName: config.bootstrap?.toolkitStackName,
    template: config.bootstrap?.template,
    previousParameters: config.bootstrap?.previousParameters,
  };
  const gcOptions = {
    action: config.gc?.action,
    type: config.gc?.type,
    rollbackBufferDays: config.gc?.rollbackBufferDays,
    createdBufferDays: config.gc?.createdBufferDays,
    confirm: config.gc?.confirm,
    bootstrapStackName: config.gc?.bootstrapStackName,
  };
  const deployOptions = {
    all: config.deploy?.all,
    buildExclude: config.deploy?.buildExclude,
    exclusively: config.deploy?.exclusively,
    requireApproval: config.deploy?.requireApproval,
    notificationArns: config.deploy?.notificationArns,
    tags: config.deploy?.tags,
    execute: config.deploy?.execute,
    changeSetName: config.deploy?.changeSetName,
    method: config.deploy?.method,
    importExistingResources: config.deploy?.importExistingResources,
    force: config.deploy?.force,
    parameters: config.deploy?.parameters,
    outputsFile: config.deploy?.outputsFile,
    previousParameters: config.deploy?.previousParameters,
    toolkitStackName: config.deploy?.toolkitStackName,
    progress: config.deploy?.progress,
    rollback: config.deploy?.rollback,
    hotswap: config.deploy?.hotswap,
    hotswapFallback: config.deploy?.hotswapFallback,
    watch: config.deploy?.watch,
    logs: config.deploy?.logs,
    concurrency: config.deploy?.concurrency,
    assetParallelism: config.deploy?.assetParallelism,
    assetPrebuild: config.deploy?.assetPrebuild,
    ignoreNoStacks: config.deploy?.ignoreNoStacks,
  };
  const rollbackOptions = {
    all: config.rollback?.all,
    toolkitStackName: config.rollback?.toolkitStackName,
    force: config.rollback?.force,
    validateBootstrapVersion: config.rollback?.validateBootstrapVersion,
    orphan: config.rollback?.orphan,
  };
  const importOptions = {
    execute: config.import?.execute,
    changeSetName: config.import?.changeSetName,
    toolkitStackName: config.import?.toolkitStackName,
    rollback: config.import?.rollback,
    force: config.import?.force,
    recordResourceMapping: config.import?.recordResourceMapping,
    resourceMapping: config.import?.resourceMapping,
  };
  const watchOptions = {
    buildExclude: config.watch?.buildExclude,
    exclusively: config.watch?.exclusively,
    changeSetName: config.watch?.changeSetName,
    force: config.watch?.force,
    toolkitStackName: config.watch?.toolkitStackName,
    progress: config.watch?.progress,
    rollback: config.watch?.rollback,
    hotswap: config.watch?.hotswap,
    hotswapFallback: config.watch?.hotswapFallback,
    logs: config.watch?.logs,
    concurrency: config.watch?.concurrency,
  };
  const destroyOptions = {
    all: config.destroy?.all,
    exclusively: config.destroy?.exclusively,
    force: config.destroy?.force,
  };
  const diffOptions = {
    exclusively: config.diff?.exclusively,
    contextLines: config.diff?.contextLines,
    template: config.diff?.template,
    strict: config.diff?.strict,
    securityOnly: config.diff?.securityOnly,
    fail: config.diff?.fail,
    processed: config.diff?.processed,
    quiet: config.diff?.quiet,
    changeSet: config.diff?.changeSet,
  };
  const metadataOptions = {};
  const acknowledgeOptions = {};
  const noticesOptions = {
    unacknowledged: config.notices?.unacknowledged,
  };
  const initOptions = {
    language: config.init?.language,
    list: config.init?.list,
    generateOnly: config.init?.generateOnly,
  };
  const migrateOptions = {
    stackName: config.migrate?.stackName,
    language: config.migrate?.language,
    account: config.migrate?.account,
    region: config.migrate?.region,
    fromPath: config.migrate?.fromPath,
    fromStack: config.migrate?.fromStack,
    outputPath: config.migrate?.outputPath,
    fromScan: config.migrate?.fromScan,
    filter: config.migrate?.filter,
    compress: config.migrate?.compress,
  };
  const contextOptions = {
    reset: config.context?.reset,
    force: config.context?.force,
    clear: config.context?.clear,
  };
  const docsOptions = {
    browser: config.docs?.browser,
  };
  const doctorOptions = {};
  const userInput: UserInput = {
    globalOptions,
    list: listOptions,
    synth: synthOptions,
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

  return userInput;
}
