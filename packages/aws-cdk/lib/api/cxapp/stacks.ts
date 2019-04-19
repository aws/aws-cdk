import cxapi = require('@aws-cdk/cx-api');
import regionInfo = require('@aws-cdk/region-info');
import { Configuration, debug, ExtendedStackSelection, SDK, StackSelector, warning } from '@aws-cdk/toolchain-common';
import cdkUtil = require('@aws-cdk/toolchain-common/lib/util');
import { SelectedStack } from 'cdk-deploy';
import contextproviders = require('../../context-providers');
import { Renames } from '../../renames';

type Synthesizer = (aws: SDK, config: Configuration) => Promise<cxapi.SynthesizeResponse>;

export interface AppStacksProps {
  /**
   * Whether to be verbose
   *
   * @default false
   */
  verbose?: boolean;

  /**
   * Don't stop on error metadata
   *
   * @default false
   */
  ignoreErrors?: boolean;

  /**
   * Treat warnings in metadata as errors
   *
   * @default false
   */
  strict?: boolean;

  /**
   * Application configuration (settings and context)
   */
  configuration: Configuration;

  /**
   * AWS object (used by synthesizer and contextprovider)
   */
  aws: SDK;

  /**
   * Renames to apply
   */
  renames?: Renames;

  /**
   * Callback invoked to synthesize the actual stacks
   */
  synthesizer: Synthesizer;
}

/**
 * Routines to get stacks from an app
 *
 * In a class because it shares some global state
 */
export class AppStacks {
  /**
   * Since app execution basically always synthesizes all the stacks,
   * we can invoke it once and cache the response for subsequent calls.
   */
  private stackSelector: StackSelector;
  private readonly renames: Renames;

  constructor(private readonly props: AppStacksProps) {
    this.renames = props.renames || new Renames({});
  }

  /**
   * List all stacks in the CX and return the selected ones
   *
   * It's an error if there are no stacks to select, or if one of the requested parameters
   * refers to a nonexistant stack.
   */
  public async selectStacks(selectors: string[], extendedSelection: ExtendedStackSelection): Promise<SelectedStack[]> {
    // tslint:disable-next-line: no-console
    console.log('before');
    const selectedList = (await this.synthesizeStacks()).selectStacks(selectors, extendedSelection);
    // tslint:disable-next-line: no-console
    console.log('after');

    return this.applyRenames(selectedList);
  }

  /**
   * Return all stacks in the CX
   *
   * If the stacks have dependencies between them, they will be returned in
   * topologically sorted order. If there are dependencies that are not in the
   * set, they will be ignored; it is the user's responsibility that the
   * non-selected stacks have already been deployed previously.
   *
   * Renames are *NOT* applied in list mode.
   */
  public async listStacks(): Promise<cxapi.SynthesizedStack[]> {
    const selector = await this.synthesizeStacks();
    return selector.listStacks();
  }

  /**
   * Synthesize a single stack
   */
  public async synthesizeStack(stackName: string): Promise<SelectedStack> {
    const selector = await this.synthesizeStacks();
    const stack = selector.selectStackByName(stackName);
    if (!stack) {
      throw new Error(`Stack ${stackName} not found`);
    }
    return this.applyRenames([stack])[0];
  }

  /**
   * Synthesize a set of stacks
   */
  public async synthesizeStacks(): Promise<StackSelector> {
    if (this.stackSelector) {
      return this.stackSelector;
    }

    const trackVersions: boolean = this.props.configuration.settings.get(['versionReporting']);

    // We may need to run the cloud executable multiple times in order to satisfy all missing context
    while (true) {
      const response: cxapi.SynthesizeResponse = await this.props.synthesizer(this.props.aws, this.props.configuration);
      const allMissing = cdkUtil.deepMerge(...response.stacks.map(s => s.missing));

      if (!cdkUtil.isEmpty(allMissing)) {
        debug(`Some context information is missing. Fetching...`);

        await contextproviders.provideContextValues(allMissing, this.props.configuration.context, this.props.aws);

        // Cache the new context to disk
        await this.props.configuration.saveContext();

        continue;
      }

      if (trackVersions && response.runtime) {
        const modules = formatModules(response.runtime);
        for (const stack of response.stacks) {
          if (!stack.template.Resources) {
            stack.template.Resources = {};
          }
          const resourcePresent = stack.environment.region === 'default-region'
            || regionInfo.Fact.find(stack.environment.region, regionInfo.FactName.cdkMetadataResourceAvailable) === 'YES';
          if (resourcePresent) {
            if (!stack.template.Resources.CDKMetadata) {
              stack.template.Resources.CDKMetadata = {
                Type: 'AWS::CDK::Metadata',
                Properties: {
                  Modules: modules
                }
              };
            } else {
              warning(`The stack ${stack.name} already includes a CDKMetadata resource`);
            }
          }
        }
      }

      // All good, return
      return this.stackSelector = new StackSelector({
        response
      });

      function formatModules(runtime: cxapi.AppRuntime): string {
        const modules = new Array<string>();

        // inject toolkit version to list of modules
        const toolkitVersion = require('../../../package.json').version;
        modules.push(`aws-cdk=${toolkitVersion}`);

        for (const key of Object.keys(runtime.libraries).sort()) {
          modules.push(`${key}=${runtime.libraries[key]}`);
        }
        return modules.join(',');
      }
    }
  }


  private applyRenames(stacks: cxapi.SynthesizedStack[]): SelectedStack[] {
    this.renames.validateSelectedStacks(stacks);

    const ret = [];
    for (const stack of stacks) {
      ret.push({
        ...stack,
        originalName: stack.name,
        name: this.renames.finalName(stack.name),
      });
    }

    return ret;
  }
}
