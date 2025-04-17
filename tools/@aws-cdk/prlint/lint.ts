import * as path from 'path';
import { findModulePath, moduleStability } from './module';
import { breakingModules } from './parser';
import { CheckRun, GitHubFile, GitHubPr, Review, sumChanges, summarizeRunConclusions } from "./github";
import { TestResult, ValidationCollector } from './results';
import { CODE_BUILD_CONTEXT, CODECOV_CHECKS, Exemption } from './constants';
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
      return this.assessNeedsReview();
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
    console.log(JSON.stringify(reviewsData.map(r => ({
      user: r.user?.login,
      state: r.state,
      author_association: r.author_association,
      submitted_at: r.submitted_at,
    })), undefined, 2));

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
    const trustedCommunityMembers = await this.getTrustedCommunityMembers();

    const reviewsByTrustedCommunityMembers = reviewsData
      .filter(review => trustedCommunityMembers.includes(review.user?.login ?? ''))
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
  private async getTrustedCommunityMembers(): Promise<string[]> {
    if (this.trustedCommunity.length > 0) { return this.trustedCommunity; }

    const wiki = await (await fetch('https://raw.githubusercontent.com/wiki/aws/aws-cdk/CDK-Community-PR-Reviews.md')).text();
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
      exemption: shouldExemptAnalyticsMetadataChange,
      testRuleSet: [
        { test: noMetadataChanges },
        { test: noAnalyticsClassesChanges },
        { test: noAnalyticsEnumsChanges },
        { test: noAnalyticsEnumAutomationChanges },
        { test: noAnalyticsEnumLikeAutomationChanges },
      ],
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

    validationCollector.validateRuleSet({
      exemption: shouldExemptSizeCheck,
      testRuleSet: [
        { test: prIsSmall },
      ],
    })

    if (pr.base.ref === 'main') {
      // Only check CodeCov for PRs targeting 'main'
      const runs = await this.checkRuns(sha);
      const codeCovRuns = CODECOV_CHECKS.map(c => runs[c] as CheckRun | undefined);

      validationCollector.validateRuleSet({
        exemption: () => hasLabel(pr, Exemption.CODECOV),
        testRuleSet: [{
          test: () => {
            const summary = summarizeRunConclusions(codeCovRuns.map(r => r?.conclusion));
            console.log('CodeCov Summary:', summary);

            switch (summary) {
              case 'failure': return TestResult.failure('CodeCov is indicating a drop in code coverage');
              // If we don't know the result of the CodeCov results yet, we pretend that there isn't a problem.
              //
              // It would be safer to ask for changes until we're confident that CodeCov has passed, but if we do
              // that the following sequence of events happens:
              //
              // 1. PR is ready to be merged (approved, everything passes)
              // 2. Mergify enqueues it and merges from main
              // 3. CodeCov needs to run again
              // 4. PR linter requests changes because CodeCov result is uncertain
              // 5. Mergify dequeues the PR because PR linter requests changes
              //
              // This looks very confusing and noisy, and also will never fix itself, so the PR ends up unmerged.
              //
              // The better solution would probably be not to do a "Request Changes" review, but leave a comment
              // and create a GitHub "status" on the PR to say 'success/pending/failure', and make it required.
              // (https://github.com/aws/aws-cdk/issues/33136)
              //
              // For now, not doing anything with a 'waiting' status is a smaller delta, and the race condition posed by it is
              // unlikely to happen given that there are much slower jobs that the merge is blocked on anyway.
              case 'waiting': return TestResult.success();
              case 'success': return TestResult.success();
            }
          },
        }],
      });
    }

    // We always delete all comments; in the future we will just communicate via reviews.
    ret.deleteComments = await this.findExistingPRLinterComments();

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
      console.log('✅ Success');
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

function shouldExemptSizeCheck(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.SIZE_CHECK);
}

function shouldExemptAnalyticsMetadataChange(pr: GitHubPr): boolean {
  return (hasLabel(pr, Exemption.ANALYTICS_METADATA_CHANGE) || pr.user?.login === 'aws-cdk-automation');
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
  const validTypes = "feat|fix|build|chore|ci|docs|style|refactor|perf|test|revert";
  const titleRe = new RegExp(`^(${validTypes})(\\([\\w_-]+\\))?: `);
  const m = titleRe.exec(pr.title);
  result.assessFailure(
    !m,
    `The title prefix of this pull request must be one of "${validTypes}"`);
  return result;
}

/**
 * Check that the PR title uses the typical convention for package names, and is lowercase.
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
      `The title scope of the pull request should omit 'aws-' from the name of modified packages. Use '${m[3]}' instead of '${m[2]}'.`,
    );
  }

  // Title scope is lowercase
  const scopeRe = /^\w+\(([\w_-]+)\)?: /; // Isolate the scope
  const scope = scopeRe.exec(pr.title);
  if (scope && scope[1]) {
    result.assessFailure(
      scope[1] !== scope[1].toLocaleLowerCase(),
      `The title scope of the pull request should be entirely in lowercase. Use '${scope[1].toLocaleLowerCase()}' instead.`,
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

function noAnalyticsClassesChanges(_pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  const condition = files.some(file => file.filename === 'packages/aws-cdk-lib/core/lib/analytics-data-source/classes.ts');
  result.assessFailure(condition, 'Manual changes to the classes.ts file are not allowed.');
  return result;
}

function noAnalyticsEnumsChanges(_pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  const condition = files.some(file => file.filename === 'packages/aws-cdk-lib/core/lib/analytics-data-source/enums.ts');
  result.assessFailure(condition, 'Manual changes to the enums.ts file are not allowed.');
  return result;
}

function noAnalyticsEnumAutomationChanges(_pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  const condition = files.some(file => file.filename === 'packages/aws-cdk-lib/core/lib/analytics-data-source/enums/module-enums.json');
  result.assessFailure(condition, 'Manual changes to the module-enums.json file are not allowed.');
  return result;
}

function noAnalyticsEnumLikeAutomationChanges(_pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  const condition = files.some(file => file.filename === 'packages/aws-cdk-lib/core/lib/analytics-data-source/enums/module-enumlikes.json');
  result.assessFailure(condition, 'Manual changes to the module-enumlikes.json file are not allowed.');
  return result;
}

function prIsSmall(_pr: GitHubPr, files: GitHubFile[]): TestResult {
  const folders = ['packages/aws-cdk/', 'packages/@aws-cdk-testing/cli-integ/'];
  const exclude = [/THIRD_PARTY_LICENSES/, /.*\.md/, /.*\.test\.ts/];
  const maxLinesAdded = 1000;
  const maxLinesRemoved = 1000;

  const filesToCheck: GitHubFile[] = files
    .filter(r => folders.some(folder => r.filename.startsWith(folder)))
    .filter(r => exclude.every(re => !re.test(r.filename)));

  const sum = sumChanges(filesToCheck);

  const result = new TestResult();
  result.assessFailure(
    sum.additions > maxLinesAdded,
    `The number of lines added (${sum.additions}) is greater than ${maxLinesAdded}`
  );
  result.assessFailure(
    sum.deletions > maxLinesRemoved,
    `The number of lines removed (${sum.deletions}) is greater than ${maxLinesAdded}`
  );

  return result;
}

require('make-runnable/custom')({
  printOutputFrame: false,
});
