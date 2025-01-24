import { Endpoints } from '@octokit/types';
import { StatusEvent } from '@octokit/webhooks-definitions/schema';
import type { components } from '@octokit/openapi-types';

export type GitHubPr =
  Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['response']['data'];

export  type CheckRun = components['schemas']['check-run'];

export interface GitHubComment {
  id: number;
}

export interface Review {
  id: number;
  user: {
    login: string;
  } | null;
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


/**
 * Combine all check run conclusions
 *
 * Returns `success` if they all return a positive result, `failure` if
 * one of them failed for some reason, and `waiting` if the result isn't available
 * yet.
 */
export function summarizeRunConclusions(conclusions: Array<CheckRun['conclusion'] | undefined>): 'success' | 'failure' | 'waiting' {
  for (const concl of conclusions) {
    switch (concl) {
      case null:
      case undefined:
      case 'action_required':
        return 'waiting';

      case 'failure':
      case 'cancelled':
      case 'timed_out':
        return 'failure';

      case 'neutral':
      case 'skipped':
      case 'success':
        break;
    }
  }
  return 'success';
}