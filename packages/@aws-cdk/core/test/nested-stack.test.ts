import * as cxapi from '@aws-cdk/cx-api';
import { App } from '@aws-cdk/core';
import {
  Stack, NestedStack, CfnStack,
} from '../lib';
import { toCloudFormation } from './util';

describe('nested-stack', () => {
  test('a nested-stack has a defaultChild', () => {
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack');
    var cfn_nestedStack = (nestedStack.node.defaultChild) as CfnStack;
    cfn_nestedStack.addPropertyOverride('TemplateURL', 'http://my-url.com');
    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        MyNestedStackNestedStackMyNestedStackNestedStackResource9C617903: {
          DeletionPolicy: 'Delete',
          Properties: {
            TemplateURL: 'http://my-url.com',
          },
          Type: 'AWS::CloudFormation::Stack',
          UpdateReplacePolicy: 'Delete',
        },
      },
    });
  });
  test('a nested-stack has a description in templateOptions.', () => {
    const description = 'This is a description.';
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack', {
      description,
    });

    expect(nestedStack.templateOptions.description).toEqual(description);
  });

  test('a nested-stack has shorter logical id', () => {
    // GIVEN
    const shortlogicalId = 'MyNestedStackNestsMyNestedStack47285AF6';
    const shortlogicalIdFlag = { [cxapi.ENABLE_SHORTER_LOGICAL_ID_NESTED_STACKS]: true };
    const app = new App({
      context: shortlogicalIdFlag,
    });

    const stack = new Stack(app);
    const nestedStack = new NestedStack(stack, 'MyNestedStack');
    const cfn_nestedStack = (nestedStack.node.defaultChild) as CfnStack;

    // THEN
    expect(stack.getLogicalId(cfn_nestedStack)).toEqual(shortlogicalId);
  });
});