import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import kms = require('../lib');

export = {
  'Via service, any principal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const statement = new iam.PolicyStatement()
      .addAction('abc:call')
      .addPrincipal(new kms.ViaServicePrincipal('bla.amazonaws.com'))
      .addResource('*');

    // THEN
    test.deepEqual(stack.resolve(statement), {
      Action: 'abc:call',
      Condition: { StringEquals: { 'kms:ViaService': 'bla.amazonaws.com' } },
      Effect: 'Allow',
      Principal: '*',
      Resource: '*'
    });

    test.done();
  },

  'Via service, principal with conditions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const statement = new iam.PolicyStatement()
      .addAction('abc:call')
      .addPrincipal(new kms.ViaServicePrincipal('bla.amazonaws.com', new iam.OrganizationPrincipal('o-1234')))
      .addResource('*');

    // THEN
    test.deepEqual(stack.resolve(statement), {
      Action: 'abc:call',
      Condition: {
        StringEquals: {
          'kms:ViaService': 'bla.amazonaws.com',
          'aws:PrincipalOrgID': 'o-1234'
        }
      },
      Effect: 'Allow',
      Principal: '*',
      Resource: '*'
    });

    test.done();
  },
};