import type { MissingContext } from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { ToolkitServices } from '../../../toolkit/private';
import { Context, contextproviders, PROJECT_CONTEXT } from '../../aws-cdk';
import { ToolkitError } from '../../errors';
import { ActionAwareIoHost, debug } from '../../io/private';
import { ICloudAssemblySource } from '../types';

export interface ContextAwareCloudAssemblyProps {
  /**
   * AWS object (used by contextprovider)
   * @deprecated context should be moved to the toolkit itself
   */
  readonly services: ToolkitServices;

  /**
   * Application context
   */
  readonly context: Context;

  /**
   * The file used to store application context in (relative to cwd).
   *
   * @default "cdk.context.json"
   */
  readonly contextFile?: string;

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
export class ContextAwareCloudAssembly implements ICloudAssemblySource {
  private canLookup: boolean;
  private context: Context;
  private contextFile: string;
  private ioHost: ActionAwareIoHost;

  constructor(private readonly source: ICloudAssemblySource, private readonly props: ContextAwareCloudAssemblyProps) {
    this.canLookup = props.lookups ?? true;
    this.context = props.context;
    this.contextFile = props.contextFile ?? PROJECT_CONTEXT; // @todo new feature not needed right now
    this.ioHost = props.services.ioHost;
  }

  /**
   * Produce a Cloud Assembly, i.e. a set of stacks
   */
  public async produce(): Promise<cxapi.CloudAssembly> {
    // We may need to run the cloud assembly source multiple times in order to satisfy all missing context
    // (When the source producer runs, it will tell us about context it wants to use
    // but it missing. We'll then look up the context and run the executable again, and
    // again, until it doesn't complain anymore or we've stopped making progress).
    let previouslyMissingKeys: Set<string> | undefined;
    while (true) {
      const assembly = await this.source.produce();

      if (assembly.manifest.missing && assembly.manifest.missing.length > 0) {
        const missingKeys = missingContextKeys(assembly.manifest.missing);

        if (!this.canLookup) {
          throw new ToolkitError(
            'Context lookups have been disabled. '
            + 'Make sure all necessary context is already in \'cdk.context.json\' by running \'cdk synth\' on a machine with sufficient AWS credentials and committing the result. '
            + `Missing context keys: '${Array.from(missingKeys).join(', ')}'`);
        }

        let tryLookup = true;
        if (previouslyMissingKeys && equalSets(missingKeys, previouslyMissingKeys)) {
          await this.ioHost.notify(debug('Not making progress trying to resolve environmental context. Giving up.'));
          tryLookup = false;
        }

        previouslyMissingKeys = missingKeys;

        if (tryLookup) {
          await this.ioHost.notify(debug('Some context information is missing. Fetching...', 'CDK_ASSEMBLY_I0241', {
            missingKeys: Array.from(missingKeys),
          }));
          await contextproviders.provideContextValues(
            assembly.manifest.missing,
            this.context,
            this.props.services.sdkProvider,
          );

          // Cache the new context to disk
          await this.ioHost.notify(debug(`Writing updated context to ${this.contextFile}...`, 'CDK_ASSEMBLY_I0042', {
            contextFile: this.contextFile,
            context: this.context.all,
          }));
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
function missingContextKeys(missing?: MissingContext[]): Set<string> {
  return new Set((missing || []).map(m => m.key));
}

/**
 * Are two sets equal to each other
 */
function equalSets<A>(a: Set<A>, b: Set<A>) {
  if (a.size !== b.size) { return false; }
  for (const x of a) {
    if (!b.has(x)) { return false; }
  }
  return true;
}
