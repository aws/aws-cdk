import * as os from 'os';
import * as path from 'path';
import { ArtifactType } from '@aws-cdk/cloud-assembly-schema';
import { CloudAssemblyBuilder, Environment, EnvironmentUtils } from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import {
  BOOTSTRAP_VARIANT_PARAMETER,
  BOOTSTRAP_VERSION_OUTPUT,
  BOOTSTRAP_VERSION_RESOURCE,
  BootstrapEnvironmentOptions,
  DEFAULT_BOOTSTRAP_VARIANT,
} from './bootstrap-props';
import * as logging from '../../logging';
import type { SDK, SdkProvider } from '../aws-auth';
import { assertIsSuccessfulDeployStackResult, deployStack, SuccessfulDeployStackResult } from '../deploy-stack';
import { NoBootstrapStackEnvironmentResources } from '../environment-resources';
import { Mode } from '../plugin/mode';
import { DEFAULT_TOOLKIT_STACK_NAME, ToolkitInfo } from '../toolkit-info';

/**
 * A class to hold state around stack bootstrapping
 *
 * This class exists so we can break bootstrapping into 2 phases:
 *
 * ```ts
 * const current = BootstrapStack.lookup(...);
 * // ...
 * current.update(newTemplate, ...);
 * ```
 *
 * And do something in between the two phases (such as look at the
 * current bootstrap stack and doing something intelligent).
 */
export class BootstrapStack {
  public static async lookup(sdkProvider: SdkProvider, environment: Environment, toolkitStackName?: string) {
    toolkitStackName = toolkitStackName ?? DEFAULT_TOOLKIT_STACK_NAME;

    const resolvedEnvironment = await sdkProvider.resolveEnvironment(environment);
    const sdk = (await sdkProvider.forEnvironment(resolvedEnvironment, Mode.ForWriting)).sdk;

    const currentToolkitInfo = await ToolkitInfo.lookup(resolvedEnvironment, sdk, toolkitStackName);

    return new BootstrapStack(sdkProvider, sdk, resolvedEnvironment, toolkitStackName, currentToolkitInfo);
  }

  protected constructor(
    private readonly sdkProvider: SdkProvider,
    private readonly sdk: SDK,
    private readonly resolvedEnvironment: Environment,
    private readonly toolkitStackName: string,
    private readonly currentToolkitInfo: ToolkitInfo,
  ) {}

  public get parameters(): Record<string, string> {
    return this.currentToolkitInfo.found ? this.currentToolkitInfo.bootstrapStack.parameters : {};
  }

  public get terminationProtection() {
    return this.currentToolkitInfo.found ? this.currentToolkitInfo.bootstrapStack.terminationProtection : undefined;
  }

  public async partition(): Promise<string> {
    return (await this.sdk.currentAccount()).partition;
  }

  /**
   * Perform the actual deployment of a bootstrap stack, given a template and some parameters
   */
  public async update(
    template: any,
    parameters: Record<string, string | undefined>,
    options: Omit<BootstrapEnvironmentOptions, 'parameters'>,
  ): Promise<SuccessfulDeployStackResult> {
    if (this.currentToolkitInfo.found && !options.force) {
      // Safety checks
      const abortResponse = {
        type: 'did-deploy-stack',
        noOp: true,
        outputs: {},
        stackArn: this.currentToolkitInfo.bootstrapStack.stackId,
      } satisfies SuccessfulDeployStackResult;

      // Validate that the bootstrap stack we're trying to replace is from the same variant as the one we're trying to deploy
      const currentVariant = this.currentToolkitInfo.variant;
      const newVariant = bootstrapVariantFromTemplate(template);
      if (currentVariant !== newVariant) {
        logging.warning(
          `Bootstrap stack already exists, containing '${currentVariant}'. Not overwriting it with a template containing '${newVariant}' (use --force if you intend to overwrite)`,
        );
        return abortResponse;
      }

      // Validate that we're not downgrading the bootstrap stack
      const newVersion = bootstrapVersionFromTemplate(template);
      const currentVersion = this.currentToolkitInfo.version;
      if (newVersion < currentVersion) {
        logging.warning(
          `Bootstrap stack already at version ${currentVersion}. Not downgrading it to version ${newVersion} (use --force if you intend to downgrade)`,
        );
        if (newVersion === 0) {
          // A downgrade with 0 as target version means we probably have a new-style bootstrap in the account,
          // and an old-style bootstrap as current target, which means the user probably forgot to put this flag in.
          logging.warning("(Did you set the '@aws-cdk/core:newStyleStackSynthesis' feature flag in cdk.json?)");
        }
        return abortResponse;
      }
    }

    const outdir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-bootstrap'));
    const builder = new CloudAssemblyBuilder(outdir);
    const templateFile = `${this.toolkitStackName}.template.json`;
    await fs.writeJson(path.join(builder.outdir, templateFile), template, {
      spaces: 2,
    });

    builder.addArtifact(this.toolkitStackName, {
      type: ArtifactType.AWS_CLOUDFORMATION_STACK,
      environment: EnvironmentUtils.format(this.resolvedEnvironment.account, this.resolvedEnvironment.region),
      properties: {
        templateFile,
        terminationProtection: options.terminationProtection ?? false,
      },
    });

    const assembly = builder.buildAssembly();

    const ret = await deployStack({
      stack: assembly.getStackByName(this.toolkitStackName),
      resolvedEnvironment: this.resolvedEnvironment,
      sdk: this.sdk,
      sdkProvider: this.sdkProvider,
      force: options.force,
      roleArn: options.roleArn,
      tags: options.tags,
      deploymentMethod: { method: 'change-set', execute: options.execute },
      parameters,
      usePreviousParameters: options.usePreviousParameters ?? true,
      // Obviously we can't need a bootstrap stack to deploy a bootstrap stack
      envResources: new NoBootstrapStackEnvironmentResources(this.resolvedEnvironment, this.sdk),
    });

    assertIsSuccessfulDeployStackResult(ret);

    return ret;
  }
}

export function bootstrapVersionFromTemplate(template: any): number {
  const versionSources = [
    template.Outputs?.[BOOTSTRAP_VERSION_OUTPUT]?.Value,
    template.Resources?.[BOOTSTRAP_VERSION_RESOURCE]?.Properties?.Value,
  ];

  for (const vs of versionSources) {
    if (typeof vs === 'number') {
      return vs;
    }
    if (typeof vs === 'string' && !isNaN(parseInt(vs, 10))) {
      return parseInt(vs, 10);
    }
  }
  return 0;
}

export function bootstrapVariantFromTemplate(template: any): string {
  return template.Parameters?.[BOOTSTRAP_VARIANT_PARAMETER]?.Default ?? DEFAULT_BOOTSTRAP_VARIANT;
}
