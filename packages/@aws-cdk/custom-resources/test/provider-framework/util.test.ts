import { Duration } from '@aws-cdk/core';
import util = require('../../lib/provider-framework/util');

describe('retry policy', () => {
    it('default is 30 minutes timeout in 5 second intervals', () => {
        const policy = util.calculateRetryPolicy();
        expect(policy.backoffRate).toStrictEqual(1);
        expect(policy.interval && policy.interval.toSeconds()).toStrictEqual(5);
        expect(policy.maxAttempts).toStrictEqual(360);
    });
    it('if total timeout and query interval are the same we will have one attempt', () => {
        const policy = util.calculateRetryPolicy({
            totalTimeout: Duration.minutes(5),
            queryInterval: Duration.minutes(5)
        });
        expect(policy.maxAttempts).toStrictEqual(1);
    });
    it('fails if total timeout cannot be integrally divided', () => {
        expect(() => util.calculateRetryPolicy({
            totalTimeout: Duration.seconds(100),
            queryInterval: Duration.seconds(75)
        })).toThrow(/Cannot determine retry count since totalTimeout=100s is not integrally dividable by queryInterval=75s/);
    });
    it('fails if interval > timeout', () => {
        expect(() => util.calculateRetryPolicy({
            totalTimeout: Duration.seconds(5),
            queryInterval: Duration.seconds(10)
        })).toThrow(/Cannot determine retry count since totalTimeout=5s is not integrally dividable by queryInterval=10s/);
    });
});
