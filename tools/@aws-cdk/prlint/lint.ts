import * as path from 'path';
import { breakingModules } from './parser';
import { findModulePath, moduleStability } from './module';

const EXEMPT_README = 'pr-linter/exempt-readme';
const EXEMPT_TEST = 'pr-linter/exempt-test';
const EXEMPT_INTEG_TEST = 'pr-linter/exempt-integ-test';
const EXEMPT_BREAKING_CHANGE = 'pr-linter/exempt-breaking-change';

class LinterError extends Error {
  constructor(message: string) {
    super(message);
  }
}

interface Test {
  test: (pr: any, files: any[]) => any;
}

class ValidateResult {
  constructor(public errors: string[]) {
    this.errors = errors;
  }

  public isValid() {
    return this.errors.length === 0;
  }
}

interface ValidationCollectorOptions {
  exemption?: (pr: any) => boolean;
  exemptionMessage?: string;
  testRules: Test[];
}

class ValidationCollector {
  private errors: string[] = [];

  constructor(private pr: any, private files: string[]) {
    this.pr = pr;
    this.files = files;
  }

  public validateRule(validationOptions: ValidationCollectorOptions) {
    if (validationOptions.exemption ? validationOptions.exemption(this.pr) : false) {
      console.log(validationOptions.exemptionMessage);
    } else {
      this.errors = this.errors.concat(...validationOptions.testRules.map((test) =>
      test.test(this.pr, this.files)).filter(s => s !== undefined));
    }
  }

  public result() {
    return new ValidateResult(this.errors);
  }
}

export interface PRLinterProps {
  readonly client: any;
  readonly owner: string;
  readonly repo: string;
  readonly number: number;
}

export class PRLinter {
  private readonly client: any;
  private readonly prParams: { owner: string, repo: string, pull_number: number };


  constructor(private readonly props: PRLinterProps) {
    this.client = props.client;
    this.prParams = { owner: props.owner, repo: props.repo, pull_number: props.number };
  }

  private async communicateResult(errors: string[]) {
    const body = `The PR Linter fails with the following errors:${this.formatErrors(errors)}PRs must pass status checks before we can provide a meaningful review.`;
      await this.client.createReview({ ...this.prParams, body, event: 'REQUEST_CHANGES' });
      throw new LinterError(body);
  }

  private formatErrors(errors: string[]) {
    return `\n\n\t❌ ${errors.join('\n\t❌ ')}\n\n`;
  };

  public async validate() {
    const number = this.props.number;

    console.log(`⌛  Fetching PR number ${number}`);
    const pr = (await this.client.get(this.prParams)).data;

    console.log(`⌛  Fetching files for PR number ${number}`);
    const files = (await this.client.listFiles(this.prParams)).data;

    console.log("⌛  Validating...");

    const validationCollector = new ValidationCollector(pr, files);

    validationCollector.validateRule({
      exemption: shouldExemptReadme,
      exemptionMessage: `Not validating README changes since the PR is labeled with '${EXEMPT_README}'`,
      testRules: [ { test: featureContainsReadme } ],
    });

    validationCollector.validateRule({
      exemption: shouldExemptTest,
      exemptionMessage: `Not validating test changes since the PR is labeled with '${EXEMPT_TEST}'`,
      testRules: [ { test: featureContainsTest }, { test: fixContainsTest } ],
    });

    validationCollector.validateRule({
      exemption: shouldExemptIntegTest,
      exemptionMessage: `Not validating integration test changes since the PR is labeled with '${EXEMPT_INTEG_TEST}'`,
      testRules: [ { test: featureContainsIntegTest}, { test: fixContainsIntegTest } ]
    });

    validationCollector.validateRule({
      testRules: [ { test: validateBreakingChangeFormat } ]
    });

    validationCollector.validateRule({
      exemption: shouldExemptBreakingChange,
      exemptionMessage: `Not validating breaking changes since the PR is labeled with '${EXEMPT_BREAKING_CHANGE}'`,
      testRules: [ { test: assertStability } ]
    });

    validationCollector.result().isValid() ? console.log("✅  Success") : await this.communicateResult(validationCollector.result().errors);
  }
}

function isPkgCfnspec(pr: any) {
  return pr.title.indexOf("(cfnspec)") > -1;
}

function isFeature(pr: any) {
  return pr.title.startsWith("feat")
}

function isFix(pr: any) {
  return pr.title.startsWith("fix")
}

function testChanged(files: any[]) {
  return files.filter(f => f.filename.toLowerCase().includes("test")).length != 0;
}

function integTestChanged(files: any[]) {
  return files.filter(f => f.filename.toLowerCase().match(/integ.*.ts$/)).length != 0;
}

function integTestSnapshotChanged(files: any[]) {
  return files.filter(f => f.filename.toLowerCase().includes("integ.snapshot")).length != 0;
}

function readmeChanged(files: any[]) {
  return files.filter(f => path.basename(f.filename) == "README.md").length != 0;
}

function featureContainsReadme(pr: any, files: any[]) {
  return (isFeature(pr) && !readmeChanged(files) && !isPkgCfnspec(pr)) ? 'Features must contain a change to a README file.': undefined;
};

function featureContainsTest(pr: any, files: any[]) {
  return (isFeature(pr) && !testChanged(files)) ? 'Features must contain a change to a test file.' : undefined;
};

function fixContainsTest(pr: any, files: any[]) {
  return (isFix(pr) && !testChanged(files)) ? 'Fixes must contain a change to a test file.': undefined;
};

function featureContainsIntegTest(pr: any, files: any[]) {
  return (isFeature(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files))) ? 'Features must contain a change to an integration test file and the resulting snapshot.' : undefined;
};

function fixContainsIntegTest(pr: any, files: any[]) {
  return (isFix(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files))) ? 'Fixes must contain a change to an integration test file and the resulting snapshot.' : undefined;
}

function shouldExemptReadme(pr: any) {
  return hasLabel(pr, EXEMPT_README);
}

function shouldExemptTest(pr: any) {
  return hasLabel(pr, EXEMPT_TEST);
}

function shouldExemptIntegTest(pr: any) {
  return hasLabel(pr, EXEMPT_INTEG_TEST);
}

function shouldExemptBreakingChange(pr: any) {
  return hasLabel(pr, EXEMPT_BREAKING_CHANGE);
}

function hasLabel(pr: any, labelName: string) {
  return pr.labels.some(function (l: any) {
    return l.name === labelName;
  })
}

/**
 * Check that the 'BREAKING CHANGE:' note in the body is correct.
 *
 * Check this by looking for something that most likely was intended
 * to be said note, but got misspelled as "BREAKING CHANGES:" or
 * "BREAKING CHANGES(module):"
 */
function validateBreakingChangeFormat(pr: any, _files: any[]): string[] {
  const title = pr.title;
  const body = pr.body;
  const errors: string[] = [];
  const re = /^BREAKING.*$/m;
  const m = re.exec(body);
  if (m) {
    if (!m[0].startsWith('BREAKING CHANGE: ')) {
      errors.push(`Breaking changes should be indicated by starting a line with 'BREAKING CHANGE: ', variations are not allowed. (found: '${m[0]}').`);
    }
    if (m[0].slice('BREAKING CHANGE:'.length).trim().length === 0) {
      errors.push(`The description of the first breaking change should immediately follow the 'BREAKING CHANGE: ' clause.`);
    }
    const titleRe = /^[a-z]+\([0-9a-z-_]+\)/;
    if (!titleRe.exec(title)) {
      errors.push('The title of this PR must specify the module name that the first breaking change should be associated to.');
    }
  }
  return errors;
}

function assertStability(pr: any, _files: any[]) {
  const title = pr.title;
  const body = pr.body;
  const breakingStable = breakingModules(title, body).filter(mod => 'stable' === moduleStability(findModulePath(mod)));
  return breakingStable.length > 0 ? `Breaking changes in stable modules [${breakingStable.join(', ')}] is disallowed.` : undefined;
}

require('make-runnable/custom')({
  printOutputFrame: false
})
