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

  public async validate() {
    const number = this.props.number;

    console.log(`⌛  Fetching PR number ${number}`);
    const pr = (await this.client.get(this.prParams)).data;

    console.log(`⌛  Fetching files for PR number ${number}`);
    const files = (await this.client.listFiles(this.prParams)).data;

    console.log("⌛  Validating...");

    try {
      if (shouldExemptReadme(pr)) {
        console.log(`Not validating README changes since the PR is labeled with '${EXEMPT_README}'`);
      } else {
        featureContainsReadme(pr, files);
      }

      if (shouldExemptTest(pr)) {
        console.log(`Not validating test changes since the PR is labeled with '${EXEMPT_TEST}'`);
      } else {
        featureContainsTest(pr, files);
        fixContainsTest(pr, files);
      }

      if (shouldExemptIntegTest(pr)) {
        console.log(`Not validating integration test changes since the PR is labeled with '${EXEMPT_INTEG_TEST}'`)
      } else {
        featureContainsIntegTest(pr, files);
        fixContainsIntegTest(pr, files);
      }

      validateBreakingChangeFormat(pr.title, pr.body!);
      if (shouldExemptBreakingChange(pr)) {
        console.log(`Not validating breaking changes since the PR is labeled with '${EXEMPT_BREAKING_CHANGE}'`);
      } else {
        assertStability(pr.title, pr.body!);
      }

      console.log("✅  Success");
    } catch (error) {
      const body = `This PR does not fulfill the following requirement: ${error.message} PRs must pass status checks before we can provide a meaningful review.`;
      await this.client.createReview({ ...this.prParams, body, event: 'REQUEST_CHANGES' });
      throw error;
    }
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
  if (isFeature(pr) && !readmeChanged(files) && !isPkgCfnspec(pr)) {
    throw new LinterError("Features must contain a change to a README file.");
  }
};

function featureContainsTest(pr: any, files: any[]) {
  if (isFeature(pr) && !testChanged(files)) {
    throw new LinterError("Features must contain a change to a test file.");
  }
};

function fixContainsTest(pr: any, files: any[]) {
  if (isFix(pr) && !testChanged(files)) {
    throw new LinterError("Fixes must contain a change to a test file.");
  }
};

function featureContainsIntegTest(pr: any, files: any[]) {
  if (isFeature(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files))) {
    throw new LinterError("Features must contain a change to an integration test file.");
  }
};

function fixContainsIntegTest(pr: any, files: any[]) {
  if (isFix(pr) && (!integTestChanged(files) || !integTestSnapshotChanged(files))) {
    throw new LinterError("Fixes must contain a change to an integration test file.");
  }
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
  console.log(pr);
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
function validateBreakingChangeFormat(title: string, body: string) {
  const re = /^BREAKING.*$/m;
  const m = re.exec(body);
  if (m) {
    if (!m[0].startsWith('BREAKING CHANGE: ')) {
      throw new LinterError(`Breaking changes should be indicated by starting a line with 'BREAKING CHANGE: ', variations are not allowed. (found: '${m[0]}').`);
    }
    if (m[0].slice('BREAKING CHANGE:'.length).trim().length === 0) {
      throw new LinterError("The description of the first breaking change should immediately follow the 'BREAKING CHANGE: ' clause.");
    }
    const titleRe = /^[a-z]+\([0-9a-z-_]+\)/;
    if (!titleRe.exec(title)) {
      throw new LinterError("The title of this PR must specify the module name that the first breaking change should be associated to.");
    }
  }
}

function assertStability(title: string, body: string) {
  const breakingStable = breakingModules(title, body)
    .filter(mod => 'stable' === moduleStability(findModulePath(mod)));

  if (breakingStable.length > 0) {
    throw new Error(`Breaking changes in stable modules [${breakingStable.join(', ')}] is disallowed.`);
  }
}

require('make-runnable/custom')({
  printOutputFrame: false
})
