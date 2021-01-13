import { Source } from '../frontend/source';
import { Authentication } from '../shared/source-authentication';
import { ExecutionAction, ExecutionArtifact } from './index';

export enum SourceType {
  GITHUB = 'GITHUB',
}

export interface GitHubSourceProps {
  readonly owner: string;
  readonly repo: string;
  readonly branch: string;
  readonly authentication: Authentication;
}

export interface SourceProps {
  readonly type: SourceType;
  readonly gitHubSource?: GitHubSourceProps;
}

export class ExecutionSourceAction extends ExecutionAction {
  public readonly outputArtifact: ExecutionArtifact;

  constructor(name: string, public readonly source: Source, public readonly props: SourceProps) {
    super(name);
    this.outputArtifact = new ExecutionArtifact('Source', this);
  }
}

