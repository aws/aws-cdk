const { Template } = require('@aws-cdk/assertions');
const cdk = require('@aws-cdk/core');
const %name.PascalCased% = require('../lib/%name%-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack);

    template.templateMatches({});
});
