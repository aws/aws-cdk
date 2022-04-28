import * as appreg from '@aws-cdk/aws-servicecatalogappregistry';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-application');

const application = new appreg.Application(stack, 'TestApplication', {
  applicationName: 'myApplicationtest',
  description: 'my application description',
});

const attributeGroup = new appreg.AttributeGroup(stack, 'TestAttributeGroup', {
  attributeGroupName: 'myAttributeGroupTest',
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

app.synth();

