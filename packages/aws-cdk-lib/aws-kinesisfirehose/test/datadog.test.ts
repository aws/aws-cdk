import * as cdk from '../..';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as firehose from '../lib';

describe('Datadog destination', () => {
  let stack: cdk.Stack;
  let destinationRole: iam.IRole;

  beforeEach(() => {
    stack = new cdk.Stack();
    destinationRole = new iam.Role(stack, 'Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
  });
});
