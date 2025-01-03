import * as cxapi from '@aws-cdk/cx-api';
import * as contextproviders from '../../context-providers';
import { debug } from '../../logging';
import { Configuration, Context, PROJECT_CONTEXT } from '../../settings';
import { ICloudAssemblySource } from '../../toolkit/cloud-assembly-source';
import { ToolkitError } from '../../toolkit/error';
import { SdkProvider } from '../aws-auth';

/**
 * @returns output directory
 */
export type Synthesizer = (aws: SdkProvider, config: Configuration) => Promise<cxapi.CloudAssembly>;

export interface CloudExecutableProps {
  /**
   * Application configuration (settings and context)
   */
  configuration: Configuration;

  /**
   * Application context
   */
  context: Context;

  /**
   * The file used to store application context in (relative to cwd).
   *
   * @default "cdk.context.json"
   */
  contextFile?: string;

  /**
   * AWS object (used by synthesizer and contextprovider)
   */
  sdkProvider: SdkProvider;

  /**
   * Callback invoked to synthesize the actual stacks
   */
  synthesizer: Synthesizer;

  /**
   * Enable context lookups.
   *
   * Producing a `cxapi.CloudAssembly` will fail if this is disabled and context lookups need to be performed.
   *
   * @default true
   */
  readonly lookups?: boolean;
}

/**
 * Represent the Cloud Executable and the synthesis we can do on it
 */
export class CloudExecutable implements ICloudAssemblySource {
  private canLookup: boolean;
  private context: Context;
  private contextFile: string;

  constructor(private readonly props: CloudExecutableProps) {
    this.canLookup = props.lookups ?? true;
    this.context = props.context;
    this.contextFile = props.contextFile ?? PROJECT_CONTEXT;
  }

  /**
   * Produce a Cloud Assembly, i.e. a set of stacks
   */
  public async produce(): Promise<cxapi.CloudAssembly> {
    // We may need to run the cloud executable multiple times in order to satisfy all missing context
    // (When the executable runs, it will tell us about context it wants to use
    // but it missing. We'll then look up the context and run the executable again, and
    // again, until it doesn't complain anymore or we've stopped making progress).
    let previouslyMissingKeys: Set<string> | undefined;
    while (true) {
      const assembly = await this.props.synthesizer(this.props.sdkProvider, this.props.configuration);

      if (assembly.manifest.missing && assembly.manifest.missing.length > 0) {
        const missingKeys = missingContextKeys(assembly.manifest.missing);

        if (!this.canLookup) {
          throw new ToolkitError(
            'Context lookups have been disabled. '
            + 'Make sure all necessary context is already in \'cdk.context.json\' by running \'cdk synth\' on a machine with sufficient AWS credentials and committing the result. '
            + `Missing context keys: '${Array.from(missingKeys).join(', ')}'`);
        }

        let tryLookup = true;
        if (previouslyMissingKeys && setsEqual(missingKeys, previouslyMissingKeys)) {
          debug('Not making progress trying to resolve environmental context. Giving up.');
          tryLookup = false;
        }

        previouslyMissingKeys = missingKeys;

        if (tryLookup) {
          debug('Some context information is missing. Fetching...');

          await contextproviders.provideContextValues(
            assembly.manifest.missing,
            this.context,
            this.props.sdkProvider,
          );

          // Cache the new context to disk
          await this.context.save(this.contextFile);

          // Execute again
          continue;
        }
      }

      return assembly;
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

