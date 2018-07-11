import { expect, haveResource, matchTemplate } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { LogGroup } from '../lib';

export = {
    'fixed retention'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        new LogGroup(stack, 'LogGroup', {
            retentionDays: 7
        });

        // THEN
        expect(stack).to(haveResource('AWS::Logs::LogGroup', {
            RetentionInDays: 7
        }));

        test.done();
    },

    'default retention'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        new LogGroup(stack, 'LogGroup');

        // THEN
        expect(stack).to(haveResource('AWS::Logs::LogGroup', {
            RetentionInDays: 730
        }));

        test.done();
    },

    'infinite retention'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        new LogGroup(stack, 'LogGroup', {
            retentionDays: Infinity
        });

        // THEN
        expect(stack).to(matchTemplate({
            Resources: {
                LogGroupF5B46931: { Type: "AWS::Logs::LogGroup" }
              }
        }));

        test.done();
    }
};