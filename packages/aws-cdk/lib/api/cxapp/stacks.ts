import cxapi = require('@aws-cdk/cx-api');
import minimatch = require('minimatch');
import yargs = require('yargs');
import contextproviders = require('../../context-providers');
import { debug, error, print, warning } from '../../logging';
import { Configuration } from '../../settings';
import cdkUtil = require('../../util');
import { SDK } from '../util/sdk';
import { execProgram } from './exec';

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
  private cachedResponse?: cxapi.SynthesizeResponse;

  constructor(private readonly argv: yargs.Arguments, private readonly configuration: Configuration, private readonly aws: SDK) {
  }

  /**
   * List all stacks in the CX and return the selected ones
   *
   * It's an error if there are no stacks to select, or if one of the requested parameters
   * refers to a nonexistant stack.
   */
  public async selectStacks(...selectors: string[]): Promise<cxapi.SynthesizedStack[]> {
    selectors = selectors.filter(s => s != null); // filter null/undefined

    const stacks: cxapi.SynthesizedStack[] = await this.listStacks();
    if (stacks.length === 0) {
      throw new Error('This app contains no stacks');
    }

    if (selectors.length === 0) {
      debug('Stack name not specified, so defaulting to all available stacks: ' + listStackNames(stacks));
      return stacks;
    }

    // For every selector argument, pick stacks from the list.
    const matched = new Set<string>();
    for (const pattern of selectors) {
      let found = false;

      for (const stack of stacks) {
        if (minimatch(stack.name, pattern)) {
          matched.add(stack.name);
          found = true;
        }
      }

      if (!found) {
        throw new Error(`No stack found matching '${pattern}'. Use "list" to print manifest`);
      }
    }

    return stacks.filter(s => matched.has(s.name));
  }

  public async listStacks(): Promise<cxapi.SynthesizedStack[]> {
    const response = await this.synthesizeStacks();
    return response.stacks;
  }

  /**
   * Synthesize a single stack
   */
  public async synthesizeStack(stackName: string): Promise<cxapi.SynthesizedStack> {
    const resp = await this.synthesizeStacks();
    const stack = resp.stacks.find(s => s.name === stackName);
    if (!stack) {
      throw new Error(`Stack ${stackName} not found`);
    }
    return stack;
  }

  /**
   * Synthesize a set of stacks
   */
  public async synthesizeStacks(): Promise<cxapi.SynthesizeResponse> {
    if (this.cachedResponse) {
      return this.cachedResponse;
    }

    const trackVersions: boolean = this.configuration.combined.get(['versionReporting']);

    // We may need to run the cloud executable multiple times in order to satisfy all missing context
    while (true) {
      const response: cxapi.SynthesizeResponse = await execProgram(this.aws, this.configuration.combined);
      const allMissing = cdkUtil.deepMerge(...response.stacks.map(s => s.missing));

      if (!cdkUtil.isEmpty(allMissing)) {
        debug(`Some context information is missing. Fetching...`);

        await contextproviders.provideContextValues(allMissing, this.configuration.projectConfig, this.aws);

        // Cache the new context to disk
        await this.configuration.saveProjectConfig();

        continue;
      }

      const { errors, warnings } = this.processMessages(response);

      if (errors && !this.argv.ignoreErrors) {
        throw new Error('Found errors');
      }

      if (this.argv.strict && warnings) {
        throw new Error('Found warnings (--strict mode)');
      }

      if (trackVersions && response.runtime) {
        const modules = formatModules(response.runtime);
        for (const stack of response.stacks) {
          if (!stack.template.Resources) {
            stack.template.Resources = {};
          }
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

      // All good, return
      this.cachedResponse = response;
      return response;

      function formatModules(runtime: cxapi.AppRuntime): string {
        const modules = new Array<string>();

        const toolkitVersion = require('../../../package.json').version;

        modules.push(`aws-cdk=${toolkitVersion}`);

        for (const key of Object.keys(runtime.libraries).sort()) {
          modules.push(`${key}=${runtime.libraries[key]}`);
        }
        return modules.join(',');
      }
    }
  }

  /**
   * Extracts 'aws:cdk:warning|info|error' metadata entries from the stack synthesis
   */
  private processMessages(stacks: cxapi.SynthesizeResponse): { errors: boolean, warnings: boolean } {
    let warnings = false;
    let errors = false;
    for (const stack of stacks.stacks) {
      for (const id of Object.keys(stack.metadata)) {
        const metadata = stack.metadata[id];
        for (const entry of metadata) {
          switch (entry.type) {
            case cxapi.WARNING_METADATA_KEY:
              warnings = true;
              this.printMessage(warning, 'Warning', id, entry);
              break;
            case cxapi.ERROR_METADATA_KEY:
              errors = true;
              this.printMessage(error, 'Error', id, entry);
              break;
            case cxapi.INFO_METADATA_KEY:
              this.printMessage(print, 'Info', id, entry);
              break;
          }
        }
      }
    }
    return { warnings, errors };
  }

  private printMessage(logFn: (s: string) => void, prefix: string, id: string, entry: cxapi.MetadataEntry) {
    logFn(`[${prefix} at ${id}] ${entry.data}`);

    if (this.argv.trace || this.argv.verbose) {
      logFn(`  ${entry.trace.join('\n  ')}`);
    }
  }
}

/**
 * Combine the names of a set of stacks using a comma
 */
export function listStackNames(stacks: cxapi.SynthesizedStack[]): string {
  return stacks.map(s => s.name).join(', ');
}
