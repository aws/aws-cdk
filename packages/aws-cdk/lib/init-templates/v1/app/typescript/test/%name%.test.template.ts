import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as %name.PascalCased% from '../lib/%name%-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack);

    template.templateMatches({});
});
