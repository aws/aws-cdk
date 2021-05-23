const core = require('@actions/core');
const github = require('@actions/github');
const linter = require('./lint');

async function run() {
    const number = github.context.issue.number;

    try {

        await linter.validatePr(number);

    } catch (error) {

        core.setFailed(error.message);
    }

}

run()
