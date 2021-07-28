import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { App, Stack } from '@aws-cdk/core';
import * as servicecatalog from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-servicecatalog-portfolio');

const role = new iam.Role(stack, 'TestRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const group = new iam.Group(stack, 'TestGroup');

const portfolio = new servicecatalog.Portfolio(stack, 'TestPortfolio', {
  displayName: 'TestPortfolio',
  providerName: 'TestProvider',
  description: 'This is our Service Catalog Portfolio',
  messageLanguage: servicecatalog.MessageLanguage.EN,
});

portfolio.giveAccessToRole(role);
portfolio.giveAccessToGroup(group);

const tagOptions = new servicecatalog.TagOptions({
  key1: ['value1', 'value2'],
  key2: ['value1'],
});
portfolio.associateTagOptions(tagOptions);

portfolio.shareWithAccount('123456789012');

const product = new servicecatalog.CloudFormationProduct(stack, 'TestProduct', {
  productName: 'testProduct',
  owner: 'testOwner',
  productVersions: [
    {
      validateTemplate: false,
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
        'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
    },
  ],
});

portfolio.addProduct(product);

portfolio.constrainTagUpdates(product);

const topic = new sns.Topic(stack, 'Topic1');

const specialTopic = new sns.Topic(stack, 'specialTopic');

portfolio.notifyOnStackEvents(product, topic);
portfolio.notifyOnStackEvents(product, specialTopic, {
  description: 'special topic description',
  messageLanguage: servicecatalog.MessageLanguage.EN,
});

const launchRole = new iam.Role(stack, 'LaunchRole', {
  assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
});

portfolio.setLaunchRole(product, launchRole);

const secondPortfolio = new servicecatalog.Portfolio(stack, 'SecondTestPortfolio', {
  displayName: 'SecondTestPortfolio',
  providerName: 'TestProvider',
});

const adminRole = new iam.Role(stack, 'AdminRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

secondPortfolio.deployWithStackSets(product, {
  accounts: ['000000000000', '111111111111', '222222222222'],
  regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
  adminRole: adminRole,
  executionRoleName: 'StackSetExecutionRole',
  allowStackSetInstanceOperations: true,
});

app.synth();
