import * as core from '@actions/core';
import * as github from '@actions/github';
import * as linter from './lint';

async function run() {
    const number = github.context.issue.number;

    try {

        await linter.validatePr(number);

    } catch (error) {

        core.setFailed(error.message);
    }

}

run()
