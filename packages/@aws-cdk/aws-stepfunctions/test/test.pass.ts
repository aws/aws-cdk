import { Test } from 'nodeunit';
import { Result } from "../lib";

export = {
    'fromString has proper value'(test: Test) {
        const testValue = 'test string';
        const result = Result.fromString(testValue);
        test.equal(result.value, testValue);

        test.done();
    },
    'fromNumber has proper value'(test: Test) {
        const testValue = 1;
        const result = Result.fromNumber(testValue);
        test.equal(result.value, testValue);

        test.done();
    },
    'fromBoolean has proper value'(test: Test) {
        const testValue = false;
        const result = Result.fromBoolean(testValue);
        test.equal(result.value, testValue);

        test.done();
    },
    'fromObject has proper value'(test: Test) {
        const testValue = {a: 1};
        const result = Result.fromObject(testValue);
        test.deepEqual(result.value, testValue);

        test.done();
    },
    'fromArray has proper value'(test: Test) {
        const testValue = [1];
        const result = Result.fromArray(testValue);
        test.deepEqual(result.value, testValue);

        test.done();
    },
};
