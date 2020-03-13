import * as cxapi from '@aws-cdk/cx-api';
import { Configuration } from '../../settings';
import { flatMap } from '../../util/arrays';
import { SdkProvider } from '../aws-auth';
import { CloudAssembly, SelectStacksOptions, StackCollection } from './cloud-assembly';
import { CloudExecutable } from './cloud-executable';

/**
 * @returns output directory
 */
type Synthesizer = (aws: SdkProvider, config: Configuration) => Promise<cxapi.CloudAssembly>;

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
  aws: SdkProvider;

  /**
   * Callback invoked to synthesize the actual stacks
   */
  synthesizer: Synthesizer;
}

/**
 * Routines to get stacks from an app
 *
 * In a class because it contains some global state.
 *
 * This class serves as the facade for the CLI (and it has a poor name for
 * that). Serves to hide most of the refactorings.
 */
export class AppStacks {
  /**
   * Since app execution basically always synthesizes all the stacks,
   * we can invoke it once and cache the response for subsequent calls.
   */
  private _assembly?: CloudAssembly;

  constructor(private readonly props: AppStacksProps) {}

  /**
   * List all stacks in the CX and return the selected ones
   *
   * It's an error if there are no stacks to select, or if one of the requested parameters
   * refers to a nonexistant stack.
   */
  public async selectStacks(selectors: string[], options: SelectStacksOptions): Promise<StackCollection> {
    return (await this.assembly()).selectStacks(selectors, options);
  }

  /**
   * Return all stacks in the CX
   *
   * If the stacks have dependencies between them, they will be returned in
   * topologically sorted order. If there are dependencies that are not in the
   * set, they will be ignored; it is the user's responsibility that the
   * non-selected stacks have already been deployed previously.
   */
  public async listStacks(): Promise<cxapi.CloudFormationStackArtifact[]> {
    const response = await this.assembly();
    return response.assembly.stacks;
  }

  /**
   * Synthesize a single stack
   */
  public async synthesizeStack(stackId: string): Promise<cxapi.CloudFormationStackArtifact> {
    const resp = await this.assembly();
    const stack = resp.assembly.getStackArtifact(stackId);
    return stack;
  }

  /**
   * @returns an array with the tags available in the stack metadata.
   */
  public getTagsFromStackMetadata(stack: cxapi.CloudFormationStackArtifact): Tag[] {
    return flatMap(stack.findMetadataByType(cxapi.STACK_TAGS_METADATA_KEY), x => x.data);
  }

  /**
   * Extracts 'aws:cdk:warning|info|error' metadata entries from the stack synthesis
   */
  public processMetadata(stacks: StackCollection) {
    stacks.processMetadataMessages({
      ignoreErrors: this.props.ignoreErrors,
      strict: this.props.strict,
      verbose: this.props.verbose
    });
  }

  /**
   * Synthesize a set of stacks
   */
  private async assembly(): Promise<CloudAssembly> {
    if (!this._assembly) {
      this._assembly = await new CloudExecutable({
        configuration: this.props.configuration,
        sdkProvider: this.props.aws,
        synthesizer: this.props.synthesizer
      }).synthesize();
    }
    return this._assembly;
  }

}

/**
 * Combine the names of a set of stacks using a comma
 */
export function listStackIds(stacks: cxapi.CloudFormationStackArtifact[]): string {
  return stacks.map(s => s.id).join(', ');
}

export interface SelectedStack extends cxapi.CloudFormationStackArtifact {
  /**
   * The original name of the stack before renaming
   */
  originalName: string;
}

export interface Tag {
  readonly Key: string;
  readonly Value: string;
}