import * as path from 'path';
import * as GitHub from 'github-api';
import { breakingModules } from './parser';
import { findModulePath, moduleStability } from './module';

const OWNER = 'aws';
const REPO = 'aws-cdk';
const EXEMPT_README = 'pr-linter/exempt-readme';
const EXEMPT_TEST = 'pr-linter/exempt-test';
const EXEMPT_INTEG_TEST = 'pr-linter/exempt-integ-test';
const EXEMPT_BREAKING_CHANGE = 'pr-linter/exempt-breaking-change';

class LinterError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function createGitHubClient() {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    console.log("Creating authenticated GitHub Client");
  } else {
    console.log("Creating un-authenticated GitHub Client");
  }

  return new GitHub({'token': token});
}

function isPkgCfnspec(issue: any) {
  return issue.title.indexOf("(cfnspec)") > -1;
}

function isFeature(issue: any) {
  return issue.title.startsWith("feat")
}

function isFix(issue: any) {
  return issue.title.startsWith("fix")
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

function featureContainsReadme(issue: any, files: any[]) {
  if (isFeature(issue) && !readmeChanged(files) && !isPkgCfnspec(issue)) {
    throw new LinterError("Features must contain a change to a README file.");
  }
};

function featureContainsTest(issue: any, files: any[]) {
  if (isFeature(issue) && !testChanged(files)) {
    throw new LinterError("Features must contain a change to a test file.");
  }
};

function fixContainsTest(issue: any, files: any[]) {
  if (isFix(issue) && !testChanged(files)) {
    throw new LinterError("Fixes must contain a change to a test file.");
  }
};

function featureContainsIntegTest(issue: any, files: any[]) {
  if (isFeature(issue) && (!integTestChanged(files) || !integTestSnapshotChanged(files))) {
    throw new LinterError("Features must contain a change to an integration test file.");
  }
};

function fixContainsIntegTest(issue: any, files: any[]) {
  if (isFix(issue) && (!integTestChanged(files) || !integTestSnapshotChanged(files))) {
    throw new LinterError("Fixes must contain a change to an integration test file.");
  }
}

function shouldExemptReadme(issue: any) {
  return hasLabel(issue, EXEMPT_README);
}

function shouldExemptTest(issue: any) {
  return hasLabel(issue, EXEMPT_TEST);
}

function shouldExemptIntegTest(issue: any) {
  return hasLabel(issue, EXEMPT_INTEG_TEST);
}

function shouldExemptBreakingChange(issue: any) {
  return hasLabel(issue, EXEMPT_BREAKING_CHANGE);
}

function hasLabel(issue: any, labelName: string) {
  return issue.labels.some(function (l: any) {
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

export async function validatePr(number: number) {

  if (!number) {
    throw new Error('Must provide a PR number');
  }

  const gh = createGitHubClient();

  const issues = gh.getIssues(OWNER, REPO);
  const repo = gh.getRepo(OWNER, REPO);

  console.log(`⌛  Fetching PR number ${number}`);
  const issue = (await issues.getIssue(number)).data;

  console.log(`⌛  Fetching files for PR number ${number}`);
  const files = (await repo.listPullRequestFiles(number)).data;

  console.log("⌛  Validating...");

  try {
    if (shouldExemptReadme(issue)) {
      console.log(`Not validating README changes since the PR is labeled with '${EXEMPT_README}'`);
    } else {
      featureContainsReadme(issue, files);
    }

    if (shouldExemptTest(issue)) {
      console.log(`Not validating test changes since the PR is labeled with '${EXEMPT_TEST}'`);
    } else {
      featureContainsTest(issue, files);
      fixContainsTest(issue, files);
    }

    if (shouldExemptIntegTest(issue)) {
      console.log(`Not validating integration test changes since the PR is labeled with '${EXEMPT_INTEG_TEST}'`)
    } else {
      featureContainsIntegTest(issue, files);
      fixContainsIntegTest(issue, files);
    }

    validateBreakingChangeFormat(issue.title, issue.body);
    if (shouldExemptBreakingChange(issue)) {
      console.log(`Not validating breaking changes since the PR is labeled with '${EXEMPT_BREAKING_CHANGE}'`);
    } else {
      assertStability(issue.title, issue.body);
    }

    console.log("✅  Success");
  } catch (error) {
    await issues.createComment(issue, `This PR does not fulfill the following requirement: ${error.message} PRs must pass status checks before we can provide a meaningful review.`);
    throw error;
  }
}

require('make-runnable/custom')({
  printOutputFrame: false
})
