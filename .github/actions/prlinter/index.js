const core = require('@actions/core');
const github = require('@actions/github');
const linter = require('prlint')

async function run() {

    const number = github.context.issue.number;

    try {
    
        await linter.mandatoryChanges(number);
    
    } catch (error) {
    
        core.setFailed(error.message);

        gh = new github.GitHub();
        gh.issues.createComment({
            owner: "aws",
            repo: "aws-cdk",
            issue_number: number,
            body: `🚫 ${error.message}`
        });
    }    
}

run()
