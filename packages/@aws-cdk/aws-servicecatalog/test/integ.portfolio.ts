import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { Portfolio } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-servicecatalog-portfolio');

const role = new iam.Role(stack, 'TestRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const role2 = new iam.Role(stack, 'TestRole2', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const portfolio = new Portfolio(stack, 'TestPortfolio', {
  name: 'TestPortfolio',
  provider: 'TestProvider',
});

portfolio.giveAccessToRole(role);
portfolio.giveAccessToRole(role2);

app.synth();
