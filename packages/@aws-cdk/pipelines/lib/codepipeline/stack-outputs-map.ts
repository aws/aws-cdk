import { StackOutputReference } from '../blueprint';
import { PipelineQueries } from '../helpers-internal/pipeline-queries';
import { PipelineBase } from '../main';
import { stackVariableNamespace } from '../private/identifiers';

/**
 * Translate stack outputs to Codepipline variable references
 */
export class StackOutputsMap {
  private queries: PipelineQueries

  constructor(pipeline: PipelineBase) {
    this.queries = new PipelineQueries(pipeline);
  }

  /**
   * Return the matching variable reference string for a StackOutputReference
   */
  public toCodePipeline(x: StackOutputReference): string {
    return `#{${stackVariableNamespace(this.queries.producingStack(x))}.${x.outputName}}`;
  }
}