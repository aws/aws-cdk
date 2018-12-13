import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import iam = require('../lib');

export = {
  'cloudformation XxxResource emits a warning'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack');

    new iam.cloudformation.UserResource(stack, 'LegacyResource', {
      userName: 'MyUserName'
    });

    const out = app.synthesizeStack('test-stack');

    const warnings = out.metadata['/test-stack/LegacyResource'].filter(md => md.type === 'aws:cdk:warning');
    test.deepEqual(warnings.length, 1);
    test.deepEqual(warnings[0].data,
      'DEPRECATED: \"cloudformation.UserResource\" will be deprecated in a future release in ' +
      'favor of \"CfnUser\" (see https://github.com/awslabs/aws-cdk/issues/878)');

    test.done();
  }
};