// Tests some properties of the generated code
import { Stack } from 'aws-cdk';
import { Test } from 'nodeunit';
import { serverless } from '../lib';

export = {
    'codeuri version field should be optional'(test: Test) {
        const stack = new Stack();
        new serverless.FunctionResource(stack, 'Fucntion', {
            codeUri: {
                bucket: 'a',
                key: 'b'
                // 'version' shouldn't have to go here
                // https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
            },
            handler: 'index',
            runtime: 'asdf'
        });

        test.done();
    }
};