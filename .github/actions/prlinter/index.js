const core = require('@actions/core');
const github = require('@actions/github');
const linter = require('prlint')

const checks = {
    "MANDATORY_CHANGES": linter.mandatoryChanges
}


async function run() {

    const check = core.getInput('check', {required: true});

    const number = github.context.issue.number;

    try {
    
        await checks[check](number);
    
    } catch (error) {
    
        core.setFailed(error.message);

        gh = new github.GitHub(process.env.GITHUB_TOKEN);

        await gh.issues.createComment({
            owner: "aws",
            repo: "aws-cdk",
            issue_number: number,
            body: `🚫 ${error.message}`
        });
    }    
}

run()
