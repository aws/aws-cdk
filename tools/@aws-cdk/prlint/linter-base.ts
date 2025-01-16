import { Octokit } from '@octokit/rest';
import { GitHubComment, GitHubPr, Review } from "./github";

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

      const existingReview = await this.findExistingPRLinterReview();
      this.deletePRLinterComment();

      if (actions.dismissPreviousReview) {
        this.dismissPRLinterReview(existingReview);
      }
      if (actions.requestChanges) {
        this.createOrUpdatePRLinterReview(actions.requestChanges.failures, actions.requestChanges.exemptionRequest, existingReview);
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
   * Deletes the previous linter comment if it exists.
   */
  private async deletePRLinterComment(): Promise<void> {
    // Since previous versions of this pr linter didn't add comments, we need to do this check first.
    const comment = await this.findExistingPRLinterComment();
    if (comment) {
      await this.client.issues.deleteComment({
        ...this.issueParams,
        comment_id: comment.id,
      });
    };
  };

  /**
   * Dismisses previous reviews by aws-cdk-automation when the pull request succeeds the linter.
   * @param existingReview The review created by a previous run of the linter
   */
  private async dismissPRLinterReview(existingReview?: Review): Promise<void> {
    if (existingReview) {
      await this.client.pulls.dismissReview({
        ...this.prParams,
        review_id: existingReview.id,
        message: '✅ Updated pull request passes all PRLinter validations. Dismissing previous PRLinter review.',
      });
    }
  }

  /**
   * Finds existing review, if present
   * @returns Existing review, if present
   */
  private async findExistingPRLinterReview(): Promise<Review | undefined> {
    const reviews = await this.client.paginate(this.client.pulls.listReviews, this.prParams);
    return reviews.find((review) => review.user?.login === this.linterLogin && review.state !== 'DISMISSED') as Review;
  }

  /**
   * Finds existing comment from previous review, if present
   * @returns Existing comment, if present
   */
  private async findExistingPRLinterComment(): Promise<GitHubComment | undefined> {
    const comments = await this.client.paginate(this.client.issues.listComments, this.issueParams);
    return comments.find((comment) => comment.user?.login === this.linterLogin && comment.body?.startsWith('The pull request linter fails with the following errors:')) as GitHubComment;
  }

  /**
   * Creates a new review and comment for first run with failure or creates a new comment with new failures for existing reviews.
   *
   * @param failureMessages The failures received by the pr linter validation checks.
   * @param existingReview The review created by a previous run of the linter.
   */
  private async createOrUpdatePRLinterReview(failureMessages: string[], exemptionRequest?: boolean, existingReview?: Review): Promise<void> {
    // FIXME: this function is doing too much at once. We should split this out into separate
    // actions on `LinterActions`.

    let body = `The pull request linter fails with the following errors:${this.formatErrors(failureMessages)}`
      + '<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n'
      + 'If you would like to request an exemption from the status checks or clarification on feedback,'
      + ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.';
    if (!existingReview) {
      await this.client.pulls.createReview({
        ...this.prParams,
        body: 'The pull request linter has failed. See the aws-cdk-automation comment below for failure reasons.'
          + ' If you believe this pull request should receive an exemption, please comment and provide a justification.'
          + '\n\n\nA comment requesting an exemption should contain the text `Exemption Request`.'
          + ' Additionally, if clarification is needed add `Clarification Request` to a comment.',
        event: 'REQUEST_CHANGES',
      });
    }

    if (exemptionRequest) {
      body += '\n\n✅ A exemption request has been requested. Please wait for a maintainer\'s review.';
    }
    await this.client.issues.createComment({
      ...this.issueParams,
      body,
    });

    // Closing the PR if it is opened from main branch of author's fork
    if (failureMessages.includes(PR_FROM_MAIN_ERROR)) {

      const errorMessageBody = 'Your pull request must be based off of a branch in a personal account '
      + '(not an organization owned account, and not the main branch). You must also have the setting '
      + 'enabled that <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork">allows the CDK team to push changes to your branch</a> '
      + '(this setting is enabled by default for personal accounts, and cannot be enabled for organization owned accounts). '
      + 'The reason for this is that our automation needs to synchronize your branch with our main after it has been approved, '
      + 'and we cannot do that if we cannot push to your branch.'

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
    return `\n\n\t❌ ${errors.join('\n\t❌ ')}\n\n`;
  }

  private addLabel(label: string, pr: Pick<GitHubPr, 'labels' | 'number'>) {
    // already has label, so no-op
    if (pr.labels.some(l => l.name === label)) { return; }
    console.log(`adding ${label} to pr ${pr.number}`);
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
    console.log(`removing ${label} to pr ${pr.number}`);
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