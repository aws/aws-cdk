const core = require('@actions/core');
const github = require('@actions/github');
const linter = require('prlint')

const checks = {
    "MANDATORY_CHANGES": linter.mandatoryChanges
}

async function run() {
    const number = github.context.issue.number;

    try {

        const checkType = core.getInput('check', {required: true});

        const check = checks[checkType];

        if (!check) {
            throw new Error(`Unsupported check type '${checkType}'. Choose one of: ${Object.keys(checks)}`)
        }

        await check(number);
    
    } catch (error) {

        if (error instanceof linter.LinterError) {            
    
            // only post a comment if its an actual validation error.
            // otherwise its probably a bug and we should look at the build log to fix it.

            gh = new github.GitHub(process.env.GITHUB_TOKEN);
    
            await gh.issues.createComment({
                owner: "aws",
                repo: "aws-cdk",
                issue_number: number,
                body: `🚫 ${error.message}`
            });
    
        } 

        core.setFailed(error.message);
    }

}

run()
