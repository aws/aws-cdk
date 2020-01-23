const path = require("path")
const fs = require("fs")
const GitHub = require("github-api")

class ValidationFailed extends Error {
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

function readNumberFromGithubEvent() {

    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/using-environment-variables

    github_event = process.env.GITHUB_EVENT_PATH;

    if (!github_event) {
        throw new Error("GITHUB_EVENT_PATH undefined");
    }

    number = JSON.parse(fs.readFileSync(github_event)).number

    if (!number) {
        throw new Error("GitHub Event is not related to a PR");
    }

    return number;
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

    try {
        number = number ? number : readNumberFromGithubEvent();
    } catch (err) {
        throw new Error("Unable to determine PR number: " + err.message 
            + ". Either pass it as the first argument, or execute from GitHub Actions.");
    }
    
    try {

        const gh = createGitHubClient();

        const OWNER = "aws"
        const REPO = "aws-cdk"
        
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
        
    } catch (err) {
        
        if (err instanceof ValidationFailed) {
            console.log("❌ Vadlidation failed: " + err.message);
        } else {
            console.log("❌ Unable to validate: " + err.message);
            console.log(err.stack)
        }
        
        process.exit(1);
    }

}

// this is necessary so that 'make-runnable' will make this function
// runnable from the command line.
module.exports.mandatoryChanges = async function(number) {
    await mandatoryChanges(number);
}

require('make-runnable/custom')({
    printOutputFrame: false
})
