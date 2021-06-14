import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { Portfolio } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-servicecatalog-portfolio');

const role = new iam.Role(stack, 'TestRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const group = new iam.Group(stack, 'TestGroup');

const portfolio = new Portfolio(stack, 'TestPortfolio', {
  displayName: 'TestPortfolio',
  providerName: 'TestProvider',
  description: 'This is our Service Catalog Portfolio',
});

portfolio.giveAccessToRole(role);
portfolio.giveAccessToGroup(group);

portfolio.shareWithAccount('123456789012');

app.synth();
