const path = require("path")
const GitHub = require("github-api")

const OWNER = "aws"
const REPO = "aws-cdk"
const EXEMPT_README = 'pr-linter/exempt-readme'
const EXEMPT_TEST = 'pr-linter/exempt-test'

class LinterError extends Error {
    constructor(message) {
        super(message);
    }
}

function createGitHubClient() {
    const token = process.env.GITHUB_TOKEN;

    if (token) {
        console.log("Creating authenticated GitHub Client")
    } else {
        console.log("Creating un-authenticated GitHub Client")
    }

    return new GitHub({'token': token});
}

function isPkgCfnspec(issue) {
    return issue.title.indexOf("(cfnspec)") > -1;
}

function isFeature(issue) {
    return issue.title.startsWith("feat")
}

function isFix(issue) {
    return issue.title.startsWith("fix")
}

function testChanged(files) {
    return files.filter(f => f.filename.toLowerCase().includes("test")).length != 0;
}

function readmeChanged(files) {
    return files.filter(f => path.basename(f.filename) == "README.md").length != 0;
}

function featureContainsReadme(issue, files) {
    if (isFeature(issue) && !readmeChanged(files) && !isPkgCfnspec(issue)) {
        throw new LinterError("Features must contain a change to a README file");
    };
};

function featureContainsTest(issue, files) {
    if (isFeature(issue) && !testChanged(files)) {
        throw new LinterError("Features must contain a change to a test file");
    };
};

function fixContainsTest(issue, files) {
    if (isFix(issue) && !testChanged(files)) {
        throw new LinterError("Fixes must contain a change to a test file");
    };
};

function shouldExemptReadme(issue) {
    return hasLabel(issue, EXEMPT_README);
}

function shouldExemptTest(issue) {
    return hasLabel(issue, EXEMPT_TEST);
}

function hasLabel(issue, labelName) {
    return issue.labels.some(function (l) {
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
function validateBreakingChangeFormat(body) {
    const re = /^BREAKING.*$/m;
    const m = re.exec(body);
    if (m) {
        if (!m[0].startsWith('BREAKING CHANGE: ')) {
            throw new LinterError(`Breaking changes should be indicated by starting a line with 'BREAKING CHANGE: ', variations are not allowed. (found: '${m[0]}')`);
        }
    }
}

async function validatePr(number) {

    if (!number) {
        throw new Error('Must provide a PR number')
    }

    const gh = createGitHubClient();

    const issues = gh.getIssues(OWNER, REPO);
    const repo = gh.getRepo(OWNER, REPO);

    console.log(`⌛  Fetching PR number ${number}`)
    const issue = (await issues.getIssue(number)).data;

    console.log(`⌛  Fetching files for PR number ${number}`)
    const files = (await repo.listPullRequestFiles(number)).data;

    console.log("⌛  Validating...");

    if (shouldExemptReadme(issue)) {
        console.log(`Not validating README changes since the PR is labeled with '${EXEMPT_README}'`)
    } else {
        featureContainsReadme(issue, files);
    }

    if (shouldExemptTest(issue)) {
        console.log(`Not validating test changes since the PR is labeled with '${EXEMPT_TEST}'`)
    } else {
        featureContainsTest(issue, files);
        fixContainsTest(issue, files);
    }

    validateBreakingChangeFormat(issue.body);

    console.log("✅  Success")

}

// we don't use the 'export' prefix because github actions
// node runtime doesn't seem to support ES6.
// TODO need to verify this.
module.exports.validatePr = validatePr

require('make-runnable/custom')({
    printOutputFrame: false
})
