import { Endpoints } from '@octokit/types';
import { StatusEvent } from '@octokit/webhooks-definitions/schema';
import type { components } from '@octokit/openapi-types';

export type GitHubPr =
  Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['response']['data'];


export interface GitHubComment {
  id: number;
}

export interface Review {
  id: number;
  user: {
    login: string;
  };
  body: string;
  state: string;
}

export interface GithubStatusEvent {
  readonly sha: string;
  readonly state?: StatusEvent['state'];
  readonly context?: string;
}

export interface GitHubLabel {
  readonly name: string;
}

export interface GitHubFile {
  readonly filename: string;
}

export type CheckRunConclusion = components['schemas']['check-run']['conclusion']
