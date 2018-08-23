import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { AWSManagedPolicy } from '../lib';

export = {
    'simple managed policy'(test: Test) {
        const mp = new AWSManagedPolicy("service-role/SomePolicy");

        test.deepEqual(cdk.resolve(mp.policyArn), {
            "Fn::Join": ['', [
                'arn',
                ':',
                { Ref: 'AWS::Partition' },
                ':',
                'iam',
                ':',
                '',
                ':',
                'aws',
                ':',
                'policy',
                '/',
                'service-role/SomePolicy'
            ]]
        });

        test.done();
    },
};