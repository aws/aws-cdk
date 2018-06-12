import { Test } from 'nodeunit';
import { validateName } from '../lib/validation';

interface NameValidationTestCase {
    name: string;
    shouldPassValidation: boolean;
    explanation: string;
}

export = {
    'name validation'(test: Test) {
        const cases: NameValidationTestCase[] = [
            { name: 'BlahBleep123.@-_', shouldPassValidation: true, explanation: 'should be valid' },
            { name: '', shouldPassValidation: false, explanation: 'the empty string should be invalid' },
            { name: ' BlahBleep', shouldPassValidation: false, explanation: 'spaces should be invalid' },
            { name: '!BlahBleep', shouldPassValidation: false, explanation: '\'!\' should be invalid' }
        ];

        cases.forEach(testCase => {
            const name = testCase.name;
            const validationBlock = () => { validateName('test thing', name); };
            if (testCase.shouldPassValidation) {
                test.doesNotThrow(validationBlock, Error, `${name} failed validation but ${testCase.explanation}`);
            } else {
                test.throws(validationBlock, Error, `${name} passed validation but ${testCase.explanation}`);
            }
        });

        test.done();
    },
};