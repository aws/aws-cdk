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

        core.setFailed(error.message);
    }

}

run()
