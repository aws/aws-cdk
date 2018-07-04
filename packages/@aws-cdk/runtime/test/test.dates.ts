import { Test } from 'nodeunit';
import { dateToCloudFormation, validateDate } from '../lib';

export = {
    'Dates are validated correctly'(test: Test) {
        const valid = validateDate(new Date('2000-01-01'));
        valid.assertSuccess();

        test.done();
    },

    'Dates are formatted as ISO8601'(test: Test) {
        const rendered = dateToCloudFormation(new Date('2001-02-03 04:05:06 UTC'));

        test.equal('2001-02-03T04:05:06', rendered);
        test.done();
    },

    'Dates are always formatted in UTC'(test: Test) {
        const rendered = dateToCloudFormation(new Date('2001-02-03 04:05:06 +01:00'));

        test.equal('2001-02-03T03:05:06', rendered);
        test.done();
    },

    'Invalid dates are considered invalid'(test: Test) {
        const valid = validateDate(new Date('some day'));

        test.throws(() => { valid.assertSuccess(); });

        test.done();
    }
};
