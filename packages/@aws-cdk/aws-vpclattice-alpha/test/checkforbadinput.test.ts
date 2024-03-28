//import { Template } from 'aws-cdk-lib/assertions';
import * as core from 'aws-cdk-lib';
// import {
//   aws_ec2 as ec2,
//   aws_s3 as s3,
//   aws_kinesis as kinesis,
//   aws_logs as log,
//   aws_lambda as lambda,
//   aws_iam as iam,
//   aws_elasticloadbalancingv2 as elbv2,
// }
//   from 'aws-cdk-lib';

import {
  // TargetGroup,
  // Target,
  Service,
  Listener,
  //AuthType,
  // ServiceNetwork,
  // LoggingDestination,
  // HTTPMethods,
  Protocol,
  // PathMatchType,
  // MatchOperator,
}
  from '../lib';

describe('Lattice Input Checking', () => {
  let stack: core.Stack;
  beforeEach(() => {
    // try to factor out as much boilerplate test setup to before methods -
    // makes the tests much more readable
    stack = new core.Stack();
  });

  describe('Bad Service Name', () => {
    test('throws error on badly formed name', () => {
      expect(() => {
        new Service(stack, 'Service', {
          name: 'BadServiceName', // has caps
        });
      }).toThrowError('The service  name must be between 3 and 63 characters long. The name can only contain alphanumeric characters and hyphens. The name must be unique to the account.');
    });
  });

});

describe('Listener Errors', () => {
  let stack: core.Stack;
  let service: Service;
  beforeEach(() => {
    // try to factor out as much boilerplate test setup to before methods -
    // makes the tests much more readable
    stack = new core.Stack();
    service = new Service(stack, 'Service', {});

  });

  describe('Bad Port Range', () => {
    test('throws error on out of range port', () => {
      expect(() => {
        new Listener(stack, 'Listener', {
          protocol: Protocol.HTTPS,
          port: -1,
          service: service,
        });
      }).toThrowError('Port out of range');
    });
  });

});
