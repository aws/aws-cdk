import iam = require('@aws-cdk/aws-iam');
import { Test } from 'nodeunit';
import kms = require('../lib');

export = {
  'Via service, any principal'(test: Test) {
    // WHEN
    const statement = new iam.PolicyStatement({
      actions: ['abc:call'],
      principals: [new kms.ViaServicePrincipal('bla.amazonaws.com')],
      resources: ['*']
    });

    // THEN
    test.deepEqual(statement.toStatementJson(), {
      Action: 'abc:call',
      Condition: { StringEquals: { 'kms:ViaService': 'bla.amazonaws.com' } },
      Effect: 'Allow',
      Principal: '*',
      Resource: '*'
    });

    test.done();
  },

  'Via service, principal with conditions'(test: Test) {
    // WHEN
    const statement = new iam.PolicyStatement({
      actions: ['abc:call'],
      principals: [new kms.ViaServicePrincipal('bla.amazonaws.com', new iam.OrganizationPrincipal('o-1234'))],
      resources: ['*']
    });

    // THEN
    test.deepEqual(statement.toStatementJson(), {
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