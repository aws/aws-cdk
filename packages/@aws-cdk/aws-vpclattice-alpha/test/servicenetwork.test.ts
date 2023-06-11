import { Template } from 'aws-cdk-lib/assertions';
import * as core from 'aws-cdk-lib';
import { aws_ec2 as ec2 }
  from 'aws-cdk-lib';
import * as vpclattice from '../lib';

/* We allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('Example Resource', () => {
  let stack: core.Stack;

  beforeEach(() => {
    // try to factor out as much boilerplate test setup to before methods -
    // makes the tests much more readable
    stack = new core.Stack();
  });

  describe('created with default properties', () => {

    beforeEach(() => {

      const latticeService = new vpclattice.Service(stack, 'Service', {
        shares: [{
          name: 'LatticeService',
          allowExternalPrincipals: false,
          principals: [
            '123456123456',
          ],
        }],
      });

      latticeService.addListener({});

      new vpclattice.ServiceNetwork(stack, 'ServiceNetwork', {
        services: [latticeService],
        vpcs: [
          new ec2.Vpc(stack, 'Vpc1'),
          new ec2.Vpc(stack, 'Vpc2'),
        ],
      });

      latticeService.applyAuthPolicy();

    });

    test('creates a lattice network', () => {
      Template.fromStack(stack).resourceCountIs('AWS::VpcLattice::ServiceNetwork', 1);
    });

    test('creates a lattice service', () => {
      Template.fromStack(stack).resourceCountIs('AWS::VpcLattice::Service', 1);
    });

  });
});
