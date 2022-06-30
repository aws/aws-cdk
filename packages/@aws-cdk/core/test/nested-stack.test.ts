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
    const description = 'This is a description.'
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack', {
      description,
    });

    expect(nestedStack.templateOptions.description).toEqual(description);
  });
});