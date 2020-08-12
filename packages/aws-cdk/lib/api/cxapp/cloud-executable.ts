import * as cxapi from '@aws-cdk/cx-api';
import { RegionInfo } from '@aws-cdk/region-info';
import * as contextproviders from '../../context-providers';
import { debug, warning } from '../../logging';
import { Configuration } from '../../settings';
import { SdkProvider } from '../aws-auth';
import { CloudAssembly } from './cloud-assembly';

/**
 * @returns output directory
 */
type Synthesizer = (aws: SdkProvider, config: Configuration) => Promise<cxapi.CloudAssembly>;

export interface CloudExecutableProps {
  /**
   * Application configuration (settings and context)
   */
  configuration: Configuration;

  /**
   * AWS object (used by synthesizer and contextprovider)
   */
  sdkProvider: SdkProvider;

  /**
   * Callback invoked to synthesize the actual stacks
   */
  synthesizer: Synthesizer;
}

/**
 * Represent the Cloud Executable and the synthesis we can do on it
 */
export class CloudExecutable {
  private _cloudAssembly?: CloudAssembly;

  constructor(private readonly props: CloudExecutableProps) {
  }

  /**
   * Return whether there is an app command from the configuration
   */
  public get hasApp() {
    return !!this.props.configuration.settings.get(['app']);
  }

  /**
   * Synthesize a set of stacks
   */
  public async synthesize(): Promise<CloudAssembly> {
    if (!this._cloudAssembly) {
      this._cloudAssembly = await this.doSynthesize();
    }
    return this._cloudAssembly;
  }

  private async doSynthesize(): Promise<CloudAssembly> {
    const trackVersions: boolean = this.props.configuration.settings.get(['versionReporting']);

    // We may need to run the cloud executable multiple times in order to satisfy all missing context
    // (When the executable runs, it will tell us about context it wants to use
    // but it missing. We'll then look up the context and run the executable again, and
    // again, until it doesn't complain anymore or we've stopped making progress).
    let previouslyMissingKeys: Set<string> | undefined;
    while (true) {
      const assembly = await this.props.synthesizer(this.props.sdkProvider, this.props.configuration);

      if (assembly.manifest.missing) {
        const missingKeys = missingContextKeys(assembly.manifest.missing);

        let tryLookup = true;
        if (previouslyMissingKeys && setsEqual(missingKeys, previouslyMissingKeys)) {
          debug('Not making progress trying to resolve environmental context. Giving up.');
          tryLookup = false;
        }

        previouslyMissingKeys = missingKeys;

        if (tryLookup) {
          debug('Some context information is missing. Fetching...');

          await contextproviders.provideContextValues(assembly.manifest.missing, this.props.configuration.context, this.props.sdkProvider);

          // Cache the new context to disk
          await this.props.configuration.saveContext();

          // Execute again
          continue;
        }
      }

      if (trackVersions && assembly.runtime) {
        const modules = formatModules(assembly.runtime);
        for (const stack of assembly.stacks) {
          if (!stack.template.Resources) {
            stack.template.Resources = {};
          }
          const resourcePresent = stack.environment.region === cxapi.UNKNOWN_REGION
            || RegionInfo.get(stack.environment.region).cdkMetadataResourceAvailable;
          if (resourcePresent) {
            if (!stack.template.Resources.CDKMetadata) {
              stack.template.Resources.CDKMetadata = {
                Type: 'AWS::CDK::Metadata',
                Properties: {
                  Modules: modules,
                },
              };
              if (stack.environment.region === cxapi.UNKNOWN_REGION) {
                stack.template.Conditions = stack.template.Conditions || {};
                const condName = 'CDKMetadataAvailable';
                if (!stack.template.Conditions[condName]) {
                  stack.template.Conditions[condName] = _makeCdkMetadataAvailableCondition();
                  stack.template.Resources.CDKMetadata.Condition = condName;
                } else {
                  warning(`The stack ${stack.id} already includes a ${condName} condition`);
                }
              }
            } else {
              warning(`The stack ${stack.id} already includes a CDKMetadata resource`);
            }
          }
        }
      }

      return new CloudAssembly(assembly);

      function formatModules(runtime: cxapi.RuntimeInfo): string {
        const modules = new Array<string>();

        // inject toolkit version to list of modules
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const toolkitVersion = require('../../../package.json').version;
        modules.push(`aws-cdk=${toolkitVersion}`);

        for (const key of Object.keys(runtime.libraries).sort()) {
          modules.push(`${key}=${runtime.libraries[key]}`);
        }
        return modules.join(',');
      }
    }
  }
}

/**
 * Return all keys of missing context items
 */
function missingContextKeys(missing?: cxapi.MissingContext[]): Set<string> {
  return new Set((missing || []).map(m => m.key));
}

function setsEqual<A>(a: Set<A>, b: Set<A>) {
  if (a.size !== b.size) { return false; }
  for (const x of a) {
    if (!b.has(x)) { return false; }
  }
  return true;
}

function _makeCdkMetadataAvailableCondition() {
  return _fnOr(RegionInfo.regions
    .filter(ri => ri.cdkMetadataResourceAvailable)
    .map(ri => ({ 'Fn::Equals': [{ Ref: 'AWS::Region' }, ri.name] })));
}

/**
 * This takes a bunch of operands and crafts an `Fn::Or` for those. Funny thing is `Fn::Or` requires
 * at least 2 operands and at most 10 operands, so we have to... do this.
 */
function _fnOr(operands: any[]): any {
  if (operands.length === 0) {
    throw new Error('Cannot build `Fn::Or` with zero operands!');
  }
  if (operands.length === 1) {
    return operands[0];
  }
  if (operands.length <= 10) {
    return { 'Fn::Or': operands };
  }
  return _fnOr(_inGroupsOf(operands, 10).map(group => _fnOr(group)));
}

function _inGroupsOf<T>(array: T[], maxGroup: number): T[][] {
  const result = new Array<T[]>();
  for (let i = 0; i < array.length; i += maxGroup) {
    result.push(array.slice(i, i + maxGroup));
  }
  return result;
}