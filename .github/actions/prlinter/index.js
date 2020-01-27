const core = require('@actions/core');
const github = require('@actions/github');
const linter = require('prlint')

try {
    linter.mandatoryChanges(github.context.issue.number);
} catch (error) {
    core.setFailed(error.message);
}