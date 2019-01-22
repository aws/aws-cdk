import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import nodeunit = require('nodeunit');
import iam = require('../lib');

export = nodeunit.testCase({
  'creates no resource when unused'(test: nodeunit.Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new iam.LazyRole(stack, 'Lazy', {
      assumedBy: new iam.ServicePrincipal('test.amazonaws.com')
    });

    // THEN
    expect(stack).notTo(haveResourceLike('AWS::IAM::Role'));
    test.done();
  },

  'creates the resource when a property is read'(test: nodeunit.Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const roleArn = new iam.LazyRole(stack, 'Lazy', {
      assumedBy: new iam.ServicePrincipal('test.amazonaws.com')
    }).roleArn;

    // THEN
    test.notEqual(roleArn, null);
    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'test.amazonaws.com' }
        }]
      }
    }));
    test.done();
  },

  'returns appropriate roleName'(test: nodeunit.Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const role = new iam.LazyRole(stack, 'Lazy', {
      assumedBy: new iam.ServicePrincipal('test.amazonaws.com')
    });

    // THEN
    test.deepEqual(stack.node.resolve(role.roleName),
                   { Ref: 'Lazy399F7F48'});
    test.done();
  }
});
