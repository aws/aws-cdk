const path = require("path")
const GitHub = require("github-api")

const OWNER = "aws"
const REPO = "aws-cdk"

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
        throw new ValidationFailed("Features must contain a change to a README file");
    };
};

function featureContainsTest(issue, files) {
    if (isFeature(issue) && !testChanged(files)) {
        throw new ValidationFailed("Features must contain a change to a test file");
    };
};

function fixContainsTest(issue, files) {
    if (isFix(issue) && !testChanged(files)) {
        throw new ValidationFailed("Fixes must contain a change to a test file");
    };
};

async function mandatoryChanges(number) {

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

module.exports.mandatoryChanges = mandatoryChanges

require('make-runnable/custom')({
    printOutputFrame: false
})
