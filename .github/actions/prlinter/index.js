const core = require('@actions/core');
const github = require('@actions/github');
const linter = require('prlint')

const checks = {
    "MANDATORY_CHANGES": linter.mandatoryChanges
}

async function runCheck(check) {

    const number = github.context.issue.number;

    try {
    
        await check(number);
    
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


async function run() {

    try {

        const checkType = core.getInput('check', {required: true});

        const check = checks[checkType];

        if (!check) {
            throw new Error(`Unsupported check type '${checkType}'. Choose one of: ${Object.keys(checks)}`)
        }

        await runCheck(check);
    
    } catch (error) {
        core.setFailed(error.message);
    }

}

run()
