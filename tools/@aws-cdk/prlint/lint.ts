import * as path from 'path';
import { breakingModules } from './parser';
import { findModulePath, moduleStability } from './module';

/**
 * Types of exemption labels in aws-cdk project.
 */
enum Exemption {
  README = 'pr-linter/exempt-readme',
  TEST = 'pr-linter/exempt-test',
  INTEG_TEST = 'pr-linter/exempt-integ-test',
  BREAKING_CHANGE = 'pr-linter/exempt-breaking-change'
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
  test: (pr: any, files: any[]) => TestResult;
}

/**
 * Represents a set of tests and the conditions under which those rules exempt.
 */
interface ValidateRuleSetOptions {

  /**
   * The function to test for exemption from the rules in testRuleSet.
   */
  exemption?: (pr: any) => boolean;

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

  constructor(private pr: any, private files: string[]) { }

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
  readonly client: any;

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
  private readonly client: any;
  private readonly prParams: { owner: string, repo: string, pull_number: number };


  constructor(private readonly props: PullRequestLinterProps) {
    this.client = props.client;
    this.prParams = { owner: props.owner, repo: props.repo, pull_number: props.number };
  }

  /**
   * Dismisses previous reviews by aws-cdk-automation when changes have been made to the pull request.
   */
  private async dismissPreviousPRLinterReviews(): Promise<void> {
    const reviews = await this.client.listReviews(this.prParams);
    reviews.data.forEach(async (review: any) => {
      if (review.user?.login === 'aws-cdk-automation' && review.state !== 'DISMISSED') {
        await this.client.dismissReview({
          ...this.prParams,
          review_id: review.id,
          message: 'Pull Request updated. Dissmissing previous PRLinter Review.',
        })
      }
    })
  }

  /**
   * Creates a new review, requesting changes, with the reasons that the linter did not pass.
   * @param failureReasons The list of reasons why the linter failed
   */
  private async communicateResult(failureReasons: string[]): Promise<void> {
    const body = `The Pull Request Linter fails with the following errors:${this.formatErrors(failureReasons)}PRs must pass status checks before we can provide a meaningful review.`;
      await this.client.createReview({ ...this.prParams, body, event: 'REQUEST_CHANGES', });
      throw new LinterError(body);
  }

  /**
   * Performs validations and communicates results via pull request comments, upon failure.
   * This also dissmisses previous reviews so they do not remain in REQUEST_CHANGES upon fix of failures.
   */
  public async validate(): Promise<void> {
    const number = this.props.number;

    console.log(`⌛  Fetching PR number ${number}`);
    const pr = (await this.client.get(this.prParams)).data;

    console.log(`⌛  Fetching files for PR number ${number}`);
    const files = (await this.client.listFiles(this.prParams)).data;

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
      exemption: shouldExemptBreakingChange,
      exemptionMessage: `Not validating breaking changes since the PR is labeled with '${Exemption.BREAKING_CHANGE}'`,
      testRuleSet: [ { test: assertStability } ]
    });

    await this.dismissPreviousPRLinterReviews();
    validationCollector.isValid() ? console.log("✅  Success") : await this.communicateResult(validationCollector.errors);
  }

  private formatErrors(errors: string[]) {
    return `\n\n\t❌ ${errors.join('\n\t❌ ')}\n\n`;
  };
}

function isPkgCfnspec(pr: any): boolean {
  return pr.title.indexOf("(cfnspec)") > -1;
}

function isFeature(pr: any): boolean {
  return pr.title.startsWith("feat")
}

function isFix(pr: any): boolean {
  return pr.title.startsWith("fix")
}

function testChanged(files: any[]): boolean {
  return files.filter(f => f.filename.toLowerCase().includes("test")).length != 0;
}

function integTestChanged(files: any[]): boolean {
  return files.filter(f => f.filename.toLowerCase().match(/integ.*.ts$/)).length != 0;
}

function integTestSnapshotChanged(files: any[]): boolean {
  return files.filter(f => f.filename.toLowerCase().includes("integ.snapshot")).length != 0;
}

function readmeChanged(files: any[]): boolean {
  return files.filter(f => path.basename(f.filename) == "README.md").length != 0;
}

function featureContainsReadme(pr: any, files: any[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && !readmeChanged(files) && !isPkgCfnspec(pr), 'Features must contain a change to a README file.');
  return result;
};

function featureContainsTest(pr: any, files: any[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && !testChanged(files), 'Features must contain a change to a test file.');
  return result;
};

function fixContainsTest(pr: any, files: any[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFix(pr) && !testChanged(files), 'Fixes must contain a change to a test file.');
  return result;
};

function featureContainsIntegTest(pr: any, files: any[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFeature(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files)),
    'Features must contain a change to an integration test file and the resulting snapshot.');
  return result;
};

function fixContainsIntegTest(pr: any, files: any[]): TestResult {
  const result = new TestResult();
  result.assessFailure(isFix(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files)),
    'Fixes must contain a change to an integration test file and the resulting snapshot.');
  return result;
};

function shouldExemptReadme(pr: any): boolean {
  return hasLabel(pr, Exemption.README);
};

function shouldExemptTest(pr: any): boolean {
  return hasLabel(pr, Exemption.TEST);
};

function shouldExemptIntegTest(pr: any): boolean {
  return hasLabel(pr, Exemption.INTEG_TEST);
};

function shouldExemptBreakingChange(pr: any): boolean {
  return hasLabel(pr, Exemption.BREAKING_CHANGE);
};

function hasLabel(pr: any, labelName: string): boolean {
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
function validateBreakingChangeFormat(pr: any, _files: any[]): TestResult {
  const title = pr.title;
  const body = pr.body;
  const result = new TestResult();
  const re = /^BREAKING.*$/m;
  const m = re.exec(body);
  if (m) {
    result.assessFailure(!m[0].startsWith('BREAKING CHANGE: '), `Breaking changes should be indicated by starting a line with 'BREAKING CHANGE: ', variations are not allowed. (found: '${m[0]}').`);
    result.assessFailure(m[0].slice('BREAKING CHANGE:'.length).trim().length === 0, `The description of the first breaking change should immediately follow the 'BREAKING CHANGE: ' clause.`);
    const titleRe = /^[a-z]+\([0-9a-z-_]+\)/;
    result.assessFailure(!titleRe.exec(title), 'The title of this pull request must specify the module name that the first breaking change should be associated to.');
  }
  return result;
};

function assertStability(pr: any, _files: any[]): TestResult {
  const title = pr.title;
  const body = pr.body;
  const result = new TestResult();
  const breakingStable = breakingModules(title, body).filter(mod => 'stable' === moduleStability(findModulePath(mod)));
  result.assessFailure(breakingStable.length > 0, `Breaking changes in stable modules [${breakingStable.join(', ')}] is disallowed.`);
  return result;
};

require('make-runnable/custom')({
  printOutputFrame: false
});
