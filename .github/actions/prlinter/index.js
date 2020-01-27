import { getInput, setOutput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import mandatoryChanges from '../../../tools/prlint/pr-validations'

try {
    mandatoryChanges(github.context.issue.number);
} catch (error) {
    setFailed(error.message);
}