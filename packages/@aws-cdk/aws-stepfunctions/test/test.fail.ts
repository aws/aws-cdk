import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as stepfunctions from '../lib';

export = {
    'Props are optional'(test: Test) {
        const stack = new cdk.Stack();

        new stepfunctions.Fail(stack, 'Fail');

        test.done();
    }
};
