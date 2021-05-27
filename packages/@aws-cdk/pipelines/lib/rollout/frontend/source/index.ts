import { ExecutionGraph, PipelineGraph } from '../../graph';

export abstract class Source {
  public static gitHub(repo: string, props: GitHubSourceProps = {}): Source {
    return new GitHubSource(repo, props);
  }

  public static multiple(...sources: Source[]): Source {
    return new class extends Source {
      public addToExecutionGraph(options: AddSourceToGraphOptions): void {
        for (const source of sources) {
          source.addToExecutionGraph(options);
        }
      }
    }();
  }
  public abstract addToExecutionGraph(options: AddSourceToGraphOptions): void;
}

export interface AddSourceToGraphOptions {
  readonly root: PipelineGraph;
  readonly parent: ExecutionGraph;
}

import { GitHubSource, GitHubSourceProps } from './github-source';
export { GitHubSource, GitHubSourceProps } from './github-source';