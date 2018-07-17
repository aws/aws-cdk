import { Stack } from '@aws-cdk/cdk';
import { expect, haveResource } from '@aws-cdk/cdk-assert';
import { Test } from 'nodeunit';
import { LogGroup, LogStream } from '../lib';

export = {
    'simple instantiation'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        const logGroup = new LogGroup(stack, 'LogGroup');

        new LogStream(stack, 'Stream', {
            logGroup
        });

        // THEN
        expect(stack).to(haveResource('AWS::Logs::LogStream', {
        }));

        test.done();
    },
};
