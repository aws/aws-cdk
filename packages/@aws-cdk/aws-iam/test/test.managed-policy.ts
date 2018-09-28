import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { AwsManagedPolicy } from '../lib';

export = {
  'simple managed policy'(test: Test) {
    const mp = new AwsManagedPolicy("service-role/SomePolicy");

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
