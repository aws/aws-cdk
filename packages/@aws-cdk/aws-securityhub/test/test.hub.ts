import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import securityhub = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
    'creates a basic hub'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new securityhub.Hub(stack, 'Hub', {});

        // THEN
        expect(stack).to(haveResourceLike('AWS::SecurityHub::Hub', {

        }));

        test.done();
    }
};
