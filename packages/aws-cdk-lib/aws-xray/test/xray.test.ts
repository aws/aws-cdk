import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { CfnParameter, Duration, Stack, App, Token, Tags } from '../../core';
import * as xray from '../lib';

/* eslint-disable quote-props */

test('able to add tags to XRay CfnGroup', () => {
  const stack = new Stack();
  new xray.CfnGroup(stack, 'Group', {
    groupName: 'GroupName',
    tags: [{
      key: 'Key',
      value: 'Value',
    }],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::XRay::Group', {
    Tags: [{
      Key: 'Key',
      Value: 'Value',
    }],
  });
});

test('able to add tags through Tags.of()... to XRay CfnGroup', () => {
  const stack = new Stack();
  new xray.CfnGroup(stack, 'Group', {
    groupName: 'GroupName',
  });

  Tags.of(stack).add('Key', 'Value');

  Template.fromStack(stack).hasResourceProperties('AWS::XRay::Group', {
    Tags: [{
      Key: 'Key',
      Value: 'Value',
    }],
  });
});
