const core = require('@actions/core');
const github = require('@actions/github');
const linter = require('prlint')

try {

    const number = github.context.issue.number;

    console.log(`PR: ${number}`);

    console.log('Validating...');

    linter.mandatoryChanges(github.context.issue.number);

    console.log('Success!')


} catch (error) {

    console.log(`Failed: ${error.message}`)

    core.setFailed(error.message);

    console.log('Set Failed')
}