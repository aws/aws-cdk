import { GitHubFile, GitHubPr } from "./github";

/**
 * Results of a single test.
 *
 * On a successful validation, no failures will be present.
 * Some tests may return multiple failures.
 */
export class TestResult {
  /**
   * Return a successful test result
   */
  public static success() {
    return new TestResult();
  }

  /**
   * Return an unconditionally failing test result
   */
  public static failure(message: string) {
    const ret = new TestResult();
    ret.assessFailure(true, message);
    return ret;
  }

  /**
   * Create a test result from a POTENTIAL failure
   *
   * If `failureCondition` is true, this will return a failure, otherwise it will return a success.
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
 * Represents a set of tests and the conditions under which those rules exempt.
 */
export interface ValidateRuleSetOptions {
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
export class ValidationCollector {
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
 * Represents a single test.
 */
export interface Test {
  test: (pr: GitHubPr, files: GitHubFile[]) => TestResult;
}
