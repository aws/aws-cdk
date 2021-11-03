const { Template, Match } = require('@aws-cdk/assertions');
const cdk = require('@aws-cdk/core');
const %name.PascalCased% = require('../lib/%name%-stack');

test('SQS Queue Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  });
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::SNS::Topic', 1);
});
