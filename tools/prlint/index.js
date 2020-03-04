const path = require("path")
const GitHub = require("github-api")

const OWNER = "aws"
const REPO = "aws-cdk"

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
    if (isFeature(issue) && !readmeChanged(files)) {
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

async function mandatoryChanges(number) {

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

    featureContainsReadme(issue, files);
    featureContainsTest(issue, files);
    fixContainsTest(issue, files);

    console.log("✅  Success")

}

async function commitMessage(number) {

    function validate() {

        const commitMessageSection = issue.body.match(/## Commit Message([\s|\S]*)## End Commit Message/);

        if (!commitMessageSection || commitMessageSection.length !== 2) {
            throw new LinterError("Your PR description doesn't specify the commit"
                + " message properly. See for details.")
        }

        const commitMessage = commitMessageSection[1].trim();
        const paragraphs = commitMessage.split(/\r\n\r\n|\n\n/);
        const title = paragraphs[0];
        const expectedCommitTitle = `${issue.title} (#${number})`

        if (title !== expectedCommitTitle) {
            throw new LinterError("First paragraph of '## Commit Message' section"
                + ` must be: '${expectedCommitTitle}'`)
        }

        for (i in paragraphs) {
            if (i != paragraphs.length - 1 && paragraphs[i].startsWith("BREAKING CHANGE:")) {
                throw new LinterError("'BREAKING CHANGE:' must be specified as the last paragraph");
            }
        }
    }

    if (!number) {
        throw new Error('Must provide a PR number')
    }

    const gh = createGitHubClient();

    const issues = gh.getIssues(OWNER, REPO);

    console.log(`⌛  Fetching PR number ${number}`)
    const issue = (await issues.getIssue(number)).data;

    if (issue.user.login === "dependabot[bot]" || issue.user.login === "dependabot-preview[bot]") {
        console.log("⏭️   Validation skipped because its a dependabot PR");
    } else {
        console.log("⌛  Validating...");
        validate();
    }

    console.log("✅  Success")
}

// we don't use the 'export' prefix because github actions
// node runtime doesn't seem to support ES6.
// TODO need to verify this.
module.exports.mandatoryChanges = mandatoryChanges
module.exports.LinterError = LinterError
module.exports.commitMessage = commitMessage

require('make-runnable/custom')({
    printOutputFrame: false
})
