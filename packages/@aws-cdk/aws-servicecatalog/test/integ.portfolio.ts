import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalog-portfolio');

new servicecatalog.Portfolio(stack, 'TestPortfolio', {
  portfolioName: 'TestPortfolio',
  providerName: 'TestProvider',
});
