import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalog-tag-option');

new servicecatalog.TagOption(stack, 'MyTagOption1', {
  key: 'tagOptionKey',
  value: 'tagOptionValue',
});

// const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
//   displayName: 'testPortfolio',
//   providerName: 'testProvider',
// });

//const importag = servicecatalog.TagOption.fromTagOptionId(stack, 'ImportedTagOption', 'MyTagOptionId');

//portfolio.associateTagOption(importag);

app.synth();