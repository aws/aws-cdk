import { execSync } from 'child_process';
import * as path from 'path';
import { findModulePath, moduleStability } from './module';
import { breakingModules } from './parser';
import { GitHubFile, GitHubPr, Review } from "./github";
import { TestResult, ValidationCollector } from './results';
import { CODE_BUILD_CONTEXT, Exemption } from './constants';
import { StatusEvent } from '@octokit/webhooks-definitions/schema';
import { LinterActions, mergeLinterActions, PR_FROM_MAIN_ERROR, PullRequestLinterBase } from './linter-base';

/**
 * This class provides functionality to run lint checks against a pull request, request changes with the lint failures
 * in the body of the review, and dismiss any previous reviews upon changes to the pull request.
 */
export class PullRequestLinter extends PullRequestLinterBase {
  private readonly trustedCommunity: string[] = [];

  /**
   * Whether or not the codebuild job for the given commit is successful
   *
   * @param sha the commit sha to evaluate
   */
  private async codeBuildJobSucceeded(sha: string): Promise<boolean> {
    const statuses = await this.client.repos.listCommitStatusesForRef({
      owner: this.prParams.owner,
      repo: this.prParams.repo,
      ref: sha,
    });
    let status = statuses.data.filter(status => status.context === CODE_BUILD_CONTEXT).map(status => status.state);
    console.log("CodeBuild Commit Statuses: ", status);
    return statuses.data.some(status => status.context === CODE_BUILD_CONTEXT && status.state === 'success');
  }

  public async validateStatusEvent(status: StatusEvent): Promise<LinterActions> {
    if (status.context === CODE_BUILD_CONTEXT && status.state === 'success') {
      return await this.assessNeedsReview();
    }
    return {};
  }

  /**
   * Assess whether or not a PR is ready for review.
   * This is needed because some things that we need to evaluate are not filterable on
   * the builtin issue search. A PR is ready for review when:
   *
   *   1. Not a draft
   *   2. Does not have any merge conflicts
   *   3. PR linter is not failing OR the user has requested an exemption
   *   4. A maintainer has not requested changes
   *   5. A maintainer has not approved
   *
   * In addition, we differentiate between ready for review by a core team member
   * (pr/needs-maintainer-review) or ready for review by core OR the trusted community
   * (pr/needs-community-review). A PR is prioritized for core team review when:
   *
   *   6. It links to a p1 issue
   *   7. It links to a p2 issue and has an approved community review
   */
  private async assessNeedsReview(): Promise<LinterActions> {
    const pr = await this.pr();

    const reviewsData = await this.client.paginate(this.client.pulls.listReviews, this.prParams);
    console.log(JSON.stringify(reviewsData));

    // NOTE: MEMBER = a member of the organization that owns the repository
    // COLLABORATOR = has been invited to collaborate on the repository
    const maintainerRequestedChanges = reviewsData.some(
      review => review.author_association === 'MEMBER'
        && review.user?.login !== 'aws-cdk-automation'
        && review.state === 'CHANGES_REQUESTED',
    );
    const maintainerApproved = reviewsData.some(
      review => review.author_association === 'MEMBER'
        && review.state === 'APPROVED',
    );

    // NOTE: community reviewers may approve, comment, or request changes; however, it
    // is possible for the same member to perform any combination of those actions on
    // a single PR. We solve this by:
    //   1. Filtering reviews to those by trusted community members
    //   2. Filtering out reviews that only leave comments (without approving or requesting changes).
    //      This allows a reviewer to participate in a conversation about their review without
    //      effectively dismissing their review. While GitHub does not allow community reviewers
    //      to dismiss their reviews (which requires privileges on the repo), they can leave a
    //      new review with the opposite approve/request state to update their review.
    //   3. Mapping reviewers to only their newest review
    //   4. Checking if any reviewers' most recent review is an approval
    //      -> If so, the PR is considered community approved; the approval can always
    //         be dismissed by a maintainer to respect another reviewer's requested changes.
    //   5. Checking if any reviewers' most recent review requested changes
    //      -> If so, the PR is considered to still need changes to meet community review.
    const reviewsByTrustedCommunityMembers = reviewsData
      .filter(review => this.getTrustedCommunityMembers().includes(review.user?.login ?? ''))
      .filter(review => review.state !== 'PENDING' && review.state !== 'COMMENTED')
      .reduce((grouping, review) => {
        // submitted_at is not present for PENDING comments but is present for other states.
        // Because of that, it is optional on the type but sure to be present here. Likewise,
        // review.user is sure to be defined because we're operating on reviews by trusted
        // community members
        let newest = grouping[review.user!.login] ?? review;
        if (review.submitted_at! > newest.submitted_at!) {
          newest = review;
        }

        return {
          ...grouping,
          [review.user!.login]: newest,
        };
      }, {} as Record<string, typeof reviewsData[0]>);
    console.log('raw data: ', JSON.stringify(reviewsByTrustedCommunityMembers));
    const communityApproved = Object.values(reviewsByTrustedCommunityMembers).some(({state}) => state === 'APPROVED');
    const communityRequestedChanges = !communityApproved && Object.values(reviewsByTrustedCommunityMembers).some(({state}) => state === 'CHANGES_REQUESTED')

    const prLinterFailed = reviewsData.find((review) => review.user?.login === 'aws-cdk-automation' && review.state !== 'DISMISSED') as Review;
    const userRequestsExemption = pr.labels.some(label => (label.name === Exemption.REQUEST_EXEMPTION || label.name === Exemption.REQUEST_CLARIFICATION));
    console.log('evaluation: ', JSON.stringify({
      draft: pr.draft,
      mergeable_state: pr.mergeable_state,
      prLinterFailed,
      maintainerRequestedChanges,
      maintainerApproved,
      communityRequestedChanges,
      communityApproved,
      userRequestsExemption,
    }, undefined, 2));

    const fixesP1 = pr.labels.some(label => label.name === 'p1');
    let readyForReview = true;
    if (
      // we don't need to review drafts
      pr.draft
        // or PRs with conflicts
        || pr.mergeable_state === 'dirty'
        // or PRs that already have changes requested by a maintainer
        || maintainerRequestedChanges
        // or the PR linter failed and the user didn't request an exemption
        || (prLinterFailed && !userRequestsExemption)
        // or a maintainer has already approved the PR
        || maintainerApproved
        // or a trusted community member has requested changes on a p2 PR
        || (!fixesP1 && communityRequestedChanges)
    ) {
      readyForReview = false;
    }

    // needs-maintainer-review means one of the following
    // 1) fixes a p1 bug
    // 2) is already community approved
    // 3) is authored by a core team member
    if (readyForReview && (fixesP1 || communityApproved || pr.labels.some(label => label.name === 'contribution/core'))) {
      return {
        addLabels: ['pr/needs-maintainer-review'],
        removeLabels: ['pr/needs-community-review'],
      };
    } else if (readyForReview && !fixesP1) {
      return {
        addLabels: ['pr/needs-community-review'],
        removeLabels: ['pr/needs-maintainer-review'],
      };
    } else {
      return {
        removeLabels: [
          'pr/needs-community-review',
          'pr/needs-maintainer-review',
        ],
      };
    }
  }

  /**
   * Trusted community reviewers is derived from the source of truth at this wiki:
   * https://github.com/aws/aws-cdk/wiki/CDK-Community-PR-Reviews
   */
  private getTrustedCommunityMembers(): string[] {
    if (this.trustedCommunity.length > 0) { return this.trustedCommunity; }

    const wiki = execSync('curl https://raw.githubusercontent.com/wiki/aws/aws-cdk/CDK-Community-PR-Reviews.md', { encoding: 'utf-8' }).toString();
    const rawMdTable = wiki.split('<!--section-->')[1].split('\n').filter(l => l !== '');
    for (let i = 2; i < rawMdTable.length; i++) {
      this.trustedCommunity.push(rawMdTable[i].split('|')[1].trim());
    }
    return this.trustedCommunity;
  }

  /**
   * Performs validations and communicates results via pull request comments, upon failure.
   * This also dismisses previous reviews so they do not remain in REQUEST_CHANGES upon fix of failures.
   */
  public async validatePullRequestTarget(): Promise<LinterActions> {
    let ret: LinterActions = {};

    const number = this.props.number;
    const sha = (await this.pr()).head.sha;

    console.log(`⌛  Fetching PR number ${number}`);
    const pr = await this.pr();
    console.log(`PR base ref is: ${pr.base.ref}`)

    console.log(`⌛  Fetching files for PR number ${number}`);
    const files = await this.client.paginate(this.client.pulls.listFiles, this.prParams);

    console.log('⌛  Validating...');

    const validationCollector = new ValidationCollector(pr, files);

    validationCollector.validateRuleSet({
      exemption: shouldExemptReadme,
      exemptionMessage: `Not validating README changes since the PR is labeled with '${Exemption.README}'`,
      testRuleSet: [{ test: featureContainsReadme }],
    });

    validationCollector.validateRuleSet({
      exemption: shouldExemptTest,
      exemptionMessage: `Not validating test changes since the PR is labeled with '${Exemption.TEST}'`,
      testRuleSet: [{ test: featureContainsTest }, { test: fixContainsTest }],
    });

    validationCollector.validateRuleSet({
      exemption: shouldExemptIntegTest,
      exemptionMessage: `Not validating integration test changes since the PR is labeled with '${Exemption.INTEG_TEST}'`,
      testRuleSet: [{ test: featureContainsIntegTest }, { test: fixContainsIntegTest }],
    });

    validationCollector.validateRuleSet({
      exemption: shouldExemptBreakingChange,
      exemptionMessage: `Not validating breaking changes since the PR is labeled with '${Exemption.BREAKING_CHANGE}'`,
      testRuleSet: [{ test: assertStability }],
    });

    validationCollector.validateRuleSet({
      exemption: shouldExemptCliIntegTested,
      testRuleSet: [{ test: noCliChanges }],
    });

    validationCollector.validateRuleSet({
      exemption: (pr) => pr.user?.login === 'aws-cdk-automation',
      testRuleSet: [{ test: noMetadataChanges }],
    });

    validationCollector.validateRuleSet({
      testRuleSet: [
        { test: validateBreakingChangeFormat },
        { test: validateTitlePrefix },
        { test: validateTitleScope },
        { test: validateTitleLowercase },
        { test: validateBranch },
      ],
    });

    ret = mergeLinterActions(ret, await this.validationToActions(validationCollector));

    // also assess whether the PR needs review or not
    try {
      const state = await this.codeBuildJobSucceeded(sha);
      console.log(`PR code build job ${state ? "SUCCESSFUL" : "not yet successful"}`);
      if (state) {
        console.log('Assessing if the PR needs a review now');
        ret = mergeLinterActions(ret, await this.assessNeedsReview());
      }
    } catch (e) {
      console.log(`assessing review failed for sha ${sha}: `, e);
    }

    return ret;
  }

  /**
   * Creates a new review, requesting changes, with the reasons that the linter did not pass.
   * @param result The result of the PR Linter run.
   */
  private async validationToActions(result: ValidationCollector): Promise<LinterActions> {
    if (result.isValid()) {
      console.log('✅  Success');
      return {
        dismissPreviousReview: true,
      };
    } else {
      // Not the best place to put this, but this is ~where it was before the refactor.
      const prAuthor = (await this.pr()).user?.login;

      const comments = await this.client.paginate(this.client.issues.listComments, this.issueParams);
      const exemptionRequest = comments.some(comment => comment.user?.login === prAuthor && comment.body?.toLowerCase().includes("exemption request"));

      return {
        requestChanges: {
          failures: result.errors,
          exemptionRequest,
        },
      };
    }
  }
}

function isFeature(pr: GitHubPr): boolean {
  return pr.title.startsWith('feat');
}

function isFix(pr: GitHubPr): boolean {
  return pr.title.startsWith('fix');
}

function testChanged(files: GitHubFile[]): boolean {
  return files.filter(f => f.filename.toLowerCase().includes('test')).length != 0;
}

function integTestChanged(files: GitHubFile[]): boolean {
  return files.filter(f => f.filename.toLowerCase().match(/integ.*.ts$/)).length != 0;
}

function integTestSnapshotChanged(files: GitHubFile[]): boolean {
  return files.filter(f => f.filename.toLowerCase().includes('.snapshot')).length != 0;
}

function readmeChanged(files: GitHubFile[]): boolean {
  return files.filter(f => path.basename(f.filename) == 'README.md').length != 0;
}

function featureContainsReadme(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && !readmeChanged(files), 'Features must contain a change to a README file.');
  return result;
}

function featureContainsTest(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && !testChanged(files), 'Features must contain a change to a test file.');
  return result;
}

function fixContainsTest(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFix(pr) && !testChanged(files), 'Fixes must contain a change to a test file.');
  return result;
}

function featureContainsIntegTest(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files)),
    'Features must contain a change to an integration test file and the resulting snapshot.');
  return result;
}

function fixContainsIntegTest(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFix(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files)),
    'Fixes must contain a change to an integration test file and the resulting snapshot.');
  return result;
}

function shouldExemptReadme(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.README);
}

function shouldExemptTest(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.TEST);
}

function shouldExemptIntegTest(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.INTEG_TEST);
}

function shouldExemptBreakingChange(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.BREAKING_CHANGE);
}

function shouldExemptCliIntegTested(pr: GitHubPr): boolean {
  return (hasLabel(pr, Exemption.CLI_INTEG_TESTED) || pr.user?.login === 'aws-cdk-automation');
}

function hasLabel(pr: GitHubPr, labelName: string): boolean {
  return pr.labels.some(function (l: any) {
    return l.name === labelName;
  });
}


/**
 * Check that the 'BREAKING CHANGE:' note in the body is correct.
 *
 * Check this by looking for something that most likely was intended
 * to be said note, but got misspelled as "BREAKING CHANGES:" or
 * "BREAKING CHANGES(module):"
 */
function validateBreakingChangeFormat(pr: GitHubPr, _files: GitHubFile[]): TestResult {
  const title = pr.title;
  const body = pr.body;
  const result = new TestResult();
  const re = /^BREAKING.*$/m;
  const m = re.exec(body ?? '');
  if (m) {
    result.assessFailure(!m[0].startsWith('BREAKING CHANGE: '), `Breaking changes should be indicated by starting a line with 'BREAKING CHANGE: ', variations are not allowed. (found: '${m[0]}').`);
    result.assessFailure(m[0].slice('BREAKING CHANGE:'.length).trim().length === 0, 'The description of the first breaking change should immediately follow the \'BREAKING CHANGE: \' clause.');
    const titleRe = /^[a-z]+\([0-9a-z-_]+\)/;
    result.assessFailure(!titleRe.exec(title), 'The title of this pull request must specify the module name that the first breaking change should be associated to.');
  }
  return result;
}

/**
 * Check that the PR title has the correct prefix.
 */
function validateTitlePrefix(pr: GitHubPr): TestResult {
  const result = new TestResult();
  const titleRe = /^(feat|fix|build|chore|ci|docs|style|refactor|perf|test|(r|R)evert)(\([\w_-]+\))?: /;
  const m = titleRe.exec(pr.title);
  result.assessFailure(
    !m,
    'The title of this pull request does not follow the Conventional Commits format, see https://www.conventionalcommits.org/.');
  return result;
}

/**
 * Check that the PR title uses the typical convention for package names.
 *
 * For example, "fix(s3)" is preferred over "fix(aws-s3)".
 */
function validateTitleScope(pr: GitHubPr): TestResult {
  const result = new TestResult();
  const scopesExemptFromThisRule = ['aws-cdk-lib'];
  // Specific commit types are handled by `validateTitlePrefix`. This just checks whether
  // the scope includes an `aws-` prefix or not.
  // Group 1: Scope with parens - "(aws-<name>)"
  // Group 2: Scope name - "aws-<name>"
  // Group 3: Preferred scope name - "<name>"
  const titleRe = /^\w+(\((aws-([\w_-]+))\))?: /;
  const m = titleRe.exec(pr.title);
  if (m && !scopesExemptFromThisRule.includes(m[2])) {
    result.assessFailure(
      !!(m[2] && m[3]),
      `The title of the pull request should omit 'aws-' from the name of modified packages. Use '${m[3]}' instead of '${m[2]}'.`,
    );
  }
  return result;
}

function validateTitleLowercase(pr: GitHubPr): TestResult {
  const result = new TestResult();
  const start = pr.title.indexOf(':');
  const firstLetter = pr.title.charAt(start + 2);
  result.assessFailure(
    firstLetter !== firstLetter.toLocaleLowerCase(),
    'The first word of the pull request title should not be capitalized. If the title starts with a CDK construct, it should be in backticks "``".',
  );
  return result;
}

/**
 * Check that the PR is not opened from main branch of author's fork
 *
 * @param pr github pr
 * @returns test result
 */
function validateBranch(pr: GitHubPr): TestResult {
  const result = new TestResult();

  if (pr.head && pr.head.ref) {
    result.assessFailure(pr.head.ref === 'main', PR_FROM_MAIN_ERROR);
  }

  return result;
}

function assertStability(pr: GitHubPr, _files: GitHubFile[]): TestResult {
  const title = pr.title;
  const body = pr.body;
  const result = new TestResult();
  const breakingStable = breakingModules(title, body ?? '').filter(mod => 'stable' === moduleStability(findModulePath(mod)));
  result.assessFailure(breakingStable.length > 0, `Breaking changes in stable modules [${breakingStable.join(', ')}] is disallowed.`);
  return result;
}

function noCliChanges(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const branch = `pull/${pr.number}/head`;

  const cliCodeChanged = files.some(f => f.filename.toLowerCase().includes('packages/aws-cdk/lib/') && f.filename.endsWith('.ts'));

  return TestResult.fromFailure(
    cliCodeChanged,
    `CLI code has changed. A maintainer must run the code through the testing pipeline (git fetch origin ${branch} && git push -f origin FETCH_HEAD:test-main-pipeline), then add the '${Exemption.CLI_INTEG_TESTED}' label when the pipeline succeeds.`,
  );
}

function noMetadataChanges(_pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  const condition = files.some(file => file.filename === 'packages/aws-cdk-lib/region-info/build-tools/metadata.ts');
  result.assessFailure(condition, 'Manual changes to the metadata.ts file are not allowed.');
  return result;
}

require('make-runnable/custom')({
  printOutputFrame: false,
});
