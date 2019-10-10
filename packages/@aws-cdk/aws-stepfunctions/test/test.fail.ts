import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'Props are optional'(test: Test) {
        const stack = new cdk.Stack();

        new stepfunctions.Fail(stack, 'Fail');

        test.done();
    }
};
