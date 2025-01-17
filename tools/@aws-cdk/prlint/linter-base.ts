import { Octokit } from '@octokit/rest';
import { GitHubPr, Review } from "./github";

export const PR_FROM_MAIN_ERROR = 'Pull requests from `main` branch of a fork cannot be accepted. Please reopen this contribution from another branch on your fork. For more information, see https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#step-4-pull-request.';

/**
 * Props used to perform linting against the pull request.
 */
export interface PullRequestLinterBaseProps {
  /**
   * GitHub client scoped to pull requests. Imported via @actions/github.
   */
  readonly client: Octokit;

  /**
   * Repository owner.
   */
  readonly owner: string;

  /**
   * Repository name.
   */
  readonly repo: string;

  /**
   * Pull request number.
   */
  readonly number: number;

  /**
   * For cases where the linter needs to know its own username
   */
  readonly linterLogin: string;
}


/**
 * Base "interacting with GitHub" functionality, devoid of any specific validation logic.
 *
 * Inheritance is not great, but this was the easiest way to factor this out for now.
 */
export class PullRequestLinterBase {
  /**
   * Find an open PR for the given commit.
   * @param sha the commit sha to find the PR of
   */
  public static async getPRFromCommit(client: Octokit, owner: string, repo: string, sha: string): Promise<GitHubPr | undefined> {
    const prs = await client.search.issuesAndPullRequests({
      q: sha,
    });
    console.log('Found PRs: ', prs);
    const foundPr = prs.data.items.find(pr => pr.state === 'open');
    if (foundPr) {
      // need to do this because the list PR response does not have
      // all the necessary information
      const pr = (await client.pulls.get({
        owner,
        repo,
        pull_number: foundPr.number,
      })).data;
      console.log(`PR: ${foundPr.number}: `, pr);
      // only process latest commit
      if (pr.head.sha === sha) {
        return pr;
      }
    }
    return;
  }

  protected readonly client: Octokit;
  protected readonly prParams: { owner: string, repo: string, pull_number: number };
  protected readonly issueParams: { owner: string, repo: string, issue_number: number };
  protected readonly linterLogin: string;

  private _pr: GitHubPr | undefined;

  constructor(readonly props: PullRequestLinterBaseProps) {
    this.client = props.client;
    this.prParams = { owner: props.owner, repo: props.repo, pull_number: props.number };
    this.issueParams = { owner: props.owner, repo: props.repo, issue_number: props.number };
    this.linterLogin = props.linterLogin;
  }

  public async pr(): Promise<GitHubPr> {
    if (!this._pr) {
      const r = await this.client.pulls.get(this.prParams);
      this._pr = r.data;
    }
    return this._pr;
  }

  /**
   * Execute the given set of actions
   */
  public async executeActions(actions: LinterActions) {
    const pr = await this.pr();

    for (const label of actions.removeLabels ?? []) {
      this.removeLabel(label, pr);
    }

    for (const label of actions.addLabels ?? []) {
      this.addLabel(label, pr);
    }

    if (actions.dismissPreviousReview || actions.requestChanges) {
      if (actions.dismissPreviousReview && actions.requestChanges) {
        throw new Error(`It does not make sense to supply both dismissPreviousReview and requestChanges: ${JSON.stringify(actions)}`);
      }

      const existingReviews = await this.findExistingPRLinterReview();

      if (actions.dismissPreviousReview) {
        this.dismissPRLinterReviews(existingReviews, 'passing');
      }
      if (actions.requestChanges) {
        this.createOrUpdatePRLinterReview(actions.requestChanges.failures, actions.requestChanges.exemptionRequest, existingReviews);
      }
    }
  }

  /**
   * For code that requires an exception
   */
  public actionsToException(actions: LinterActions) {
    if (actions.requestChanges) {
      // The tests check for exactly these messages
      const messages = [...actions.requestChanges.failures];
      if (actions.requestChanges.exemptionRequest) {
        messages.push('A exemption request has been requested. Please wait for a maintainer\'s review.');
      }
      throw new LinterError(messages.join('\n'));
    }
  }

  /**
   * Dismisses previous reviews by aws-cdk-automation when the pull request succeeds the linter.
   * @param existingReview The review created by a previous run of the linter
   */
  private async dismissPRLinterReviews(existingReviews: Review[], reason: 'passing' | 'stale'): Promise<void> {
    let message: string;
    switch (reason) {
      case 'passing':
        message = '✅ Updated pull request passes all PRLinter validations. Dismissing previous PRLinter review.';
        break;
      case 'stale':
        message = 'Dismissing outdated PRLinter review.';
        break;
    }

    for (const existingReview of existingReviews ?? []) {
      try {
        console.log('Dismissing review');
        await this.client.pulls.dismissReview({
          ...this.prParams,
          review_id: existingReview.id,
          message,
        });
      } catch (e: any) {
        // This can fail with a "not found" for some reason
        throw new Error(`Dismissing review failed, user is probably not authorized: ${JSON.stringify(e, undefined, 2)}`);
      }
    }
  }

  /**
   * Finds existing review, if present
   * @returns Existing review, if present
   */
  private async findExistingPRLinterReview(): Promise<Review[]> {
    const reviews = await this.client.paginate(this.client.pulls.listReviews, this.prParams);
    return reviews.filter((review) => review.user?.login === this.linterLogin && review.state !== 'DISMISSED');
  }

  /**
   * Creates a new review and comment for first run with failure or creates a new comment with new failures for existing reviews.
   *
   * We assume the PR linter only ever creates "Changes Requested" reviews, or dismisses
   * their own "Changes Requested" reviews.
   *
   * @param failureMessages The failures received by the pr linter validation checks.
   * @param existingReview The review created by a previous run of the linter.
   */
  private async createOrUpdatePRLinterReview(failureMessages: string[], exemptionRequest?: boolean, existingReviews?: Review[]): Promise<void> {
    // FIXME: this function is doing too much at once. We should split this out into separate
    // actions on `LinterActions`.

    const paras = [
      'The pull request linter fails with the following errors:',
      this.formatErrors(failureMessages),
      'If you believe this pull request should receive an exemption, please comment and provide a justification. ' +
      'A comment requesting an exemption should contain the text `Exemption Request`. ' +
      'Additionally, if clarification is needed, add `Clarification Request` to a comment.',
    ];

    if (exemptionRequest) {
      paras.push('✅ A exemption request has been requested. Please wait for a maintainer\'s review.');
    }
    const body = paras.join('\n\n');

    // Dismiss every review except the last one
    this.dismissPRLinterReviews((existingReviews ?? []).slice(0, -1), 'stale');

    // Update the last review
    const existingReview = (existingReviews ?? []).slice(-1)[0];

    if (!existingReview) {
      console.log('Creating review');
      await this.client.pulls.createReview({
        ...this.prParams,
        event: 'REQUEST_CHANGES',
        body,
      });
    } else if (existingReview.body !== body && existingReview.state === 'CHANGES_REQUESTED') {
      // State is good but body is wrong
      console.log('Updating review');
      this.client.pulls.updateReview({
        ...this.prParams,
        review_id: existingReview.id,
        body,
      });
    }

    // Closing the PR if it is opened from main branch of author's fork
    if (failureMessages.includes(PR_FROM_MAIN_ERROR)) {

      const errorMessageBody = 'Your pull request must be based off of a branch in a personal account '
      + '(not an organization owned account, and not the main branch). You must also have the setting '
      + 'enabled that <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork">allows the CDK team to push changes to your branch</a> '
      + '(this setting is enabled by default for personal accounts, and cannot be enabled for organization owned accounts). '
      + 'The reason for this is that our automation needs to synchronize your branch with our main after it has been approved, '
      + 'and we cannot do that if we cannot push to your branch.'
      console.log('Closing pull request');

      await this.client.issues.createComment({
        ...this.issueParams,
        body: errorMessageBody,
      });

      await this.client.pulls.update({
        ...this.prParams,
        state: 'closed',
      });
    }
  }

  private formatErrors(errors: string[]) {
    return errors.map(e => `    ❌ ${e}`).join('\n');
  }

  private addLabel(label: string, pr: Pick<GitHubPr, 'labels' | 'number'>) {
    // already has label, so no-op
    if (pr.labels.some(l => l.name === label)) { return; }
    this.client.issues.addLabels({
      issue_number: pr.number,
      owner: this.prParams.owner,
      repo: this.prParams.repo,
      labels: [
        label,
      ],
    });
  }

  private removeLabel(label: string, pr: Pick<GitHubPr, 'labels' | 'number'>) {
    // does not have label, so no-op
    if (!pr.labels.some(l => l.name === label)) { return; }
    this.client.issues.removeLabel({
      issue_number: pr.number,
      owner: this.prParams.owner,
      repo: this.prParams.repo,
      name: label,
    });
  }

}

export class LinterError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Actions that the PR linter should carry out
 */
export interface LinterActions {
  /**
   * Add labels to the PR
   */
  addLabels?: string[];

  /**
   * Remove labels from the PR
   */
  removeLabels?: string[];

  /**
   * Post a "request changes" review
   */
  requestChanges?: {
    failures: string[];
    exemptionRequest?: boolean;
  };

  /**
   * Dismiss the PR linter's previous review.
   */
  dismissPreviousReview?: boolean;
}

export function mergeLinterActions(a: LinterActions, b: LinterActions): LinterActions {
  return {
    addLabels: nonEmpty([...(a.addLabels ?? []), ...(b.addLabels ?? [])]),
    removeLabels: nonEmpty([...(a.removeLabels ?? []), ...(b.removeLabels ?? [])]),
    requestChanges: b.requestChanges ?? a.requestChanges,
    dismissPreviousReview: b.dismissPreviousReview ?? a.dismissPreviousReview,
  };
}

function nonEmpty<A>(xs: A[]): A[] | undefined {
  return xs.length > 0 ? xs : undefined;
}