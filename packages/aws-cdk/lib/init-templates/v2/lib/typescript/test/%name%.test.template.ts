import * as cdk from 'aws-cdk-lib';
import { Template } from '@aws-cdk/assertions-alpha';
import * as %name.PascalCased% from '../lib/index';

test('Empty Stack', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  new %name.PascalCased%.%name.PascalCased%(stack, 'MyTestConstruct');
  // THEN
  const template = Template.fromStack(stack);
  template.templateMatches({});
});
