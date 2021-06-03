import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { Portfolio, Product } from '../lib';


const app = new App();
const stack = new Stack(app, 'integ-servicecatalog-portfolio');

const role = new iam.Role(stack, 'TestRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const role2 = new iam.Role(stack, 'TestRole2', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const portfolio = new Portfolio(stack, 'TestPortfolio', {
  portfolioName: 'TestPortfolio',
  providerName: 'TestProvider',
});

const product = new Product(stack, 'TestProduct', {
  productName: 'TestProduct',
  owner: 'Test Owner',
  provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
});

portfolio.giveAccess(role);
portfolio.giveAccess(role2);


portfolio.allowTagUpdates({
  product: product,
});


app.synth();