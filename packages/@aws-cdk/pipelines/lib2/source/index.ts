import { ExecutionGraph, ExecutionPipeline } from '../graph';
import { GitHubSource, GitHubSourceProps } from './github-source';

export abstract class Source {
  public static gitHub(repo: string, props: GitHubSourceProps = {}): Source {
    return new GitHubSource(repo, props);
  }
  public abstract addToExecutionGraph(options: AddSourceToGraphOptions): void;
}

export interface AddSourceToGraphOptions {
  readonly root: ExecutionPipeline;
  readonly parent: ExecutionGraph;
}