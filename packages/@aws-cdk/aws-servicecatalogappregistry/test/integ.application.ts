import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-application');

const application = new appreg.Application(stack, 'TestApplication', {
  applicationName: 'myCdkApplication',
  description: 'my application description',
});

const attributeGroup = new appreg.AttributeGroup(stack, 'TestAttributeGroup', {
  attributeGroupName: 'myCdkAttributeGroup',
  description: 'my attribute group description',
  attributes: {
    stage: 'alpha',
    teamMembers: [
      'markI',
      'markII',
      'markIII',
    ],
    public: false,
    publishYear: 2021,
    plannedRoadMap: {
      alpha: 'some time',
      beta: 'another time',
      gamma: 'penultimate time',
      release: 'go time',
    },
  },
});

application.associateStack(stack);
application.associateAttributeGroup(attributeGroup);
const myRole = new iam.Role(stack, 'MyRole', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});
application.shareApplication({
  roles: [myRole],
});

app.synth();
