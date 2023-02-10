import * as path from 'path';
import { Octokit } from '@octokit/rest';
import { breakingModules } from './parser';
import { findModulePath, moduleStability } from './module';

/**
 * Types of exemption labels in aws-cdk project.
 */
enum Exemption {
  README = 'pr-linter/exempt-readme',
  TEST = 'pr-linter/exempt-test',
  INTEG_TEST = 'pr-linter/exempt-integ-test',
  BREAKING_CHANGE = 'pr-linter/exempt-breaking-change',
  CLI_INTEG_TESTED = 'pr-linter/cli-integ-tested',
}

export interface GitHubPr {
  readonly number: number;
  readonly title: string;
  readonly body: string | null;
  readonly labels: GitHubLabel[];
  readonly user?: {
    login: string;
  }
}

export interface GitHubLabel {
  readonly name: string;
}

export interface GitHubFile {
  readonly filename: string;
}

export interface Review {
  id: number;
  user: {
    login: string;
  };
  body: string;
  state: string;
}

export interface Comment {
  id: number;
}

class LinterError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Results of a single test.
 *
 * On a successful validation, no failures will be present.
 * Some tests may return multiple failures.
 */
class TestResult {
  /**
   * Create a test result from a potential failure
   */
  public static fromFailure(failureCondition: boolean, failureMessage: string): TestResult {
    const ret = new TestResult();
    ret.assessFailure(failureCondition, failureMessage);
    return ret;
  }

  public errorMessages: string[] = [];

  /**
   * Assesses the failure condition for the type of pull request being tested and adds the failure message
   * to errorMessages if failures are present.
   * @param failureCondition The conditions for this failure type.
   * @param failureMessage The message to emit to the contributor.
   */
  public assessFailure(failureCondition: boolean, failureMessage: string): void {
    if (failureCondition) {
      this.errorMessages.push(failureMessage);
    }
  }
}

/**
 * Represents a single test.
 */
interface Test {
  test: (pr: GitHubPr, files: GitHubFile[]) => TestResult;
}

/**
 * Represents a set of tests and the conditions under which those rules exempt.
 */
interface ValidateRuleSetOptions {

  /**
   * The function to test for exemption from the rules in testRuleSet.
   */
  exemption?: (pr: GitHubPr) => boolean;

  /**
   * The log message printed if the exemption is granted.
   */
  exemptionMessage?: string;

  /**
   * The set of rules to test against if the pull request is not exempt.
   */
  testRuleSet: Test[];
}

/**
 * This class provides functionality for performing validation tests against each ruleset and
 * collecting all the errors returned by those tests.
 */
class ValidationCollector {
  public errors: string[] = [];

  constructor(private pr: GitHubPr, private files: GitHubFile[]) { }

  /**
   * Checks for exemption criteria and then validates against the ruleset when not exempt to it.
   * Any validation failures are collected by the ValidationCollector.
   * @param validationOptions the options to validate against
   */
  public validateRuleSet(validationOptions: ValidateRuleSetOptions): void {
    if (validationOptions.exemption ? validationOptions.exemption(this.pr) : false) {
      console.log(validationOptions.exemptionMessage);
    } else {
      this.errors = this.errors.concat(...validationOptions.testRuleSet.map(((test: Test) => test.test(this.pr, this.files).errorMessages)));
    }
  }

  /**
   * Checks whether any validation errors have been collected.
   * @returns boolean
   */
  public isValid() {
    return this.errors.length === 0;
  }
}

/**
 * Props used to perform linting against the pull request.
 */
export interface PullRequestLinterProps {

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
}

/**
 * This class provides functionality to run lint checks against a pull request, request changes with the lint failures
 * in the body of the review, and dismiss any previous reviews upon changes to the pull request.
 */
export class PullRequestLinter {
  private readonly client: Octokit;
  private readonly prParams: { owner: string, repo: string, pull_number: number };
  private readonly issueParams: { owner: string, repo: string, issue_number: number };


  constructor(private readonly props: PullRequestLinterProps) {
    this.client = props.client;
    this.prParams = { owner: props.owner, repo: props.repo, pull_number: props.number };
    this.issueParams = { owner: props.owner, repo: props.repo, issue_number: props.number };
  }

  /**
   * Deletes the previous linter comment if it exists.
   */
  private async deletePRLinterComment(): Promise<void> {
    // Since previous versions of this pr linter didn't add comments, we need to do this check first.
    const comment = await this.findExistingComment();
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
        message: '✅ Updated pull request passes all PRLinter validations. Dissmissing previous PRLinter review.'
      })
    }
  }

  /**
   * Creates a new review and comment for first run with failure or creates a new comment with new failures for existing reviews.
   * @param failureMessages The failures received by the pr linter validation checks.
   * @param existingReview The review created by a previous run of the linter.
   */
  private async createOrUpdatePRLinterReview(failureMessages: string[], existingReview?: Review): Promise<void> {
    const body = `The pull request linter fails with the following errors:${this.formatErrors(failureMessages)}`
      + '<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n'
      + 'If you would like to request an exemption from the status checks or clarification on feedback,'
      + ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.';
    if (!existingReview) {
      await this.client.pulls.createReview({
        ...this.prParams,
        body: 'The pull request linter has failed. See the aws-cdk-automation comment below for failure reasons.'
          + ' If you believe this pull request should receive an exemption, please comment and provide a justification.'
          + '\n\n\nA comment requesting an exemption should contain the text `Exemption Request`.'
          +  ' Additionally, if clarification is needed add `Clarification Request` to a comment.',
        event: 'REQUEST_CHANGES',
      })
    }

    await this.client.issues.createComment({
      ...this.issueParams,
      body,
    })

    throw new LinterError(body);
  }

  /**
   * Finds existing review, if present
   * @returns Existing review, if present
   */
  private async findExistingReview(): Promise<Review | undefined> {
    const reviews = await this.client.pulls.listReviews(this.prParams);
    return reviews.data.find((review) => review.user?.login === 'aws-cdk-automation' && review.state !== 'DISMISSED') as Review;
  }

  /**
   * Finds existing comment from previous review, if present
   * @returns Existing comment, if present
   */
  private async findExistingComment(): Promise<Comment | undefined> {
    const comments = await this.client.issues.listComments(this.issueParams);
    return comments.data.find((comment) => comment.user?.login === 'aws-cdk-automation' && comment.body?.startsWith('The pull request linter fails with the following errors:')) as Comment;
  }

  /**
   * Creates a new review, requesting changes, with the reasons that the linter did not pass.
   * @param result The result of the PR Linter run.
   */
  private async communicateResult(result: ValidationCollector): Promise<void> {
    const existingReview = await this.findExistingReview();
    if (result.isValid()) {
      console.log("✅  Success");
      await this.dismissPRLinterReview(existingReview);
    } else {
      await this.createOrUpdatePRLinterReview(result.errors, existingReview);
    }
  }

  /**
   * Performs validations and communicates results via pull request comments, upon failure.
   * This also dissmisses previous reviews so they do not remain in REQUEST_CHANGES upon fix of failures.
   */
  public async validate(): Promise<void> {
    const number = this.props.number;

    console.log(`⌛  Fetching PR number ${number}`);
    const pr = (await this.client.pulls.get(this.prParams)).data as GitHubPr;

    console.log(`⌛  Fetching files for PR number ${number}`);
    const files = await this.client.paginate(this.client.pulls.listFiles, this.prParams);

    console.log("⌛  Validating...");

    const validationCollector = new ValidationCollector(pr, files);

    validationCollector.validateRuleSet({
      exemption: shouldExemptReadme,
      exemptionMessage: `Not validating README changes since the PR is labeled with '${Exemption.README}'`,
      testRuleSet: [ { test: featureContainsReadme } ],
    });

    validationCollector.validateRuleSet({
      exemption: shouldExemptTest,
      exemptionMessage: `Not validating test changes since the PR is labeled with '${Exemption.TEST}'`,
      testRuleSet: [ { test: featureContainsTest }, { test: fixContainsTest } ],
    });

    validationCollector.validateRuleSet({
      exemption: shouldExemptIntegTest,
      exemptionMessage: `Not validating integration test changes since the PR is labeled with '${Exemption.INTEG_TEST}'`,
      testRuleSet: [ { test: featureContainsIntegTest}, { test: fixContainsIntegTest } ]
    });

    validationCollector.validateRuleSet({
      testRuleSet: [ { test: validateBreakingChangeFormat } ]
    });

    validationCollector.validateRuleSet({
      testRuleSet: [ { test: validateTitlePrefix } ]
    });
    validationCollector.validateRuleSet({
      testRuleSet: [ { test: validateTitleScope } ]
    })

    validationCollector.validateRuleSet({
      exemption: shouldExemptBreakingChange,
      exemptionMessage: `Not validating breaking changes since the PR is labeled with '${Exemption.BREAKING_CHANGE}'`,
      testRuleSet: [ { test: assertStability } ]
    });

    validationCollector.validateRuleSet({
      exemption: shouldExemptCliIntegTested,
      testRuleSet: [ { test: noCliChanges } ],
    });

    await this.deletePRLinterComment();
    await this.communicateResult(validationCollector);
  }

  private formatErrors(errors: string[]) {
    return `\n\n\t❌ ${errors.join('\n\t❌ ')}\n\n`;
  };

}

function isPkgCfnspec(pr: GitHubPr): boolean {
  return pr.title.indexOf("(cfnspec)") > -1;
}

function isFeature(pr: GitHubPr): boolean {
  return pr.title.startsWith("feat")
}

function isFix(pr: GitHubPr): boolean {
  return pr.title.startsWith("fix")
}

function testChanged(files: GitHubFile[]): boolean {
  return files.filter(f => f.filename.toLowerCase().includes("test")).length != 0;
}

function integTestChanged(files: GitHubFile[]): boolean {
  return files.filter(f => f.filename.toLowerCase().match(/integ.*.ts$/)).length != 0;
}

function integTestSnapshotChanged(files: GitHubFile[]): boolean {
  return files.filter(f => f.filename.toLowerCase().includes(".snapshot")).length != 0;
}

function readmeChanged(files: GitHubFile[]): boolean {
  return files.filter(f => path.basename(f.filename) == "README.md").length != 0;
}

function featureContainsReadme(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && !readmeChanged(files) && !isPkgCfnspec(pr), 'Features must contain a change to a README file.');
  return result;
};

function featureContainsTest(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && !testChanged(files), 'Features must contain a change to a test file.');
  return result;
};

function fixContainsTest(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFix(pr) && !testChanged(files), 'Fixes must contain a change to a test file.');
  return result;
};

function featureContainsIntegTest(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files)),
    'Features must contain a change to an integration test file and the resulting snapshot.');
  return result;
};

function fixContainsIntegTest(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFix(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files)),
    'Fixes must contain a change to an integration test file and the resulting snapshot.');
  return result;
};


function shouldExemptReadme(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.README);
};

function shouldExemptTest(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.TEST);
};

function shouldExemptIntegTest(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.INTEG_TEST);
};

function shouldExemptBreakingChange(pr: GitHubPr): boolean {
  return hasLabel(pr, Exemption.BREAKING_CHANGE);
};

function shouldExemptCliIntegTested(pr: GitHubPr): boolean {
  return (hasLabel(pr, Exemption.CLI_INTEG_TESTED) || pr.user?.login === 'aws-cdk-automation');
}

function hasLabel(pr: GitHubPr, labelName: string): boolean {
  return pr.labels.some(function (l: any) {
    return l.name === labelName;
  })
};

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
    result.assessFailure(m[0].slice('BREAKING CHANGE:'.length).trim().length === 0, `The description of the first breaking change should immediately follow the 'BREAKING CHANGE: ' clause.`);
    const titleRe = /^[a-z]+\([0-9a-z-_]+\)/;
    result.assessFailure(!titleRe.exec(title), 'The title of this pull request must specify the module name that the first breaking change should be associated to.');
  }
  return result;
};

/**
 * Check that the PR title has the correct prefix.
 */
 function validateTitlePrefix(pr: GitHubPr): TestResult {
  const result = new TestResult();
  const titleRe = /^(feat|fix|build|chore|ci|docs|style|refactor|perf|test|(r|R)evert)(\([\w_-]+\))?: /;
  const m = titleRe.exec(pr.title);
  result.assessFailure(
    !m,
    "The title of this pull request does not follow the Conventional Commits format, see https://www.conventionalcommits.org/.");
  return result;
};

/**
 * Check that the PR title uses the typical convention for package names.
 *
 * For example, "fix(s3)" is preferred over "fix(aws-s3)".
 */
function validateTitleScope(pr: GitHubPr): TestResult {
  const result = new TestResult();
  // Specific commit types are handled by `validateTitlePrefix`. This just checks whether
  // the scope includes an `aws-` prefix or not.
  // Group 1: Scope with parens - "(aws-<name>)"
  // Group 2: Scope name - "aws-<name>"
  // Group 3: Preferred scope name - "<name>"
  const titleRe = /^\w+(\((aws-([\w_-]+))\))?: /;
  const m = titleRe.exec(pr.title);
  if (m) {
    result.assessFailure(
      !!(m[2] && m[3]),
      `The title of the pull request should omit 'aws-' from the name of modified packages. Use '${m[3]}' instead of '${m[2]}'.`,
    );
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
};

function noCliChanges(pr: GitHubPr, files: GitHubFile[]): TestResult {
  const branch = `pull/${pr.number}/head`;

  const cliCodeChanged = files.some(f => f.filename.toLowerCase().includes('packages/aws-cdk/lib/') && f.filename.endsWith('.ts'));

  return TestResult.fromFailure(
    cliCodeChanged,
    `CLI code has changed. A maintainer must run the code through the testing pipeline (git fetch origin ${branch} && git push -f origin FETCH_HEAD:test-main-pipeline), then add the '${Exemption.CLI_INTEG_TESTED}' label when the pipeline succeeds.`);
}

require('make-runnable/custom')({
  printOutputFrame: false
});
