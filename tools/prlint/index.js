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

// we don't use the 'export' prefix because github actions
// node runtime doesn't seem to support ES6.
// TODO need to verify this.
module.exports.mandatoryChanges = mandatoryChanges
module.exports.LinterError = LinterError

require('make-runnable/custom')({
    printOutputFrame: false
})
