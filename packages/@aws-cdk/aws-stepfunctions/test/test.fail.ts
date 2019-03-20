import { Test } from 'nodeunit';
import stepfunctions = require('../lib');
import cdk = require('@aws-cdk/cdk');

export = {
    'Props are optional'(test: Test) {
        const stack = new cdk.Stack();

        new stepfunctions.Fail(stack, 'Fail');

        test.done();
    }
};
