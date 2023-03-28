import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-attribute-group');

const attributeGroup = new appreg.AttributeGroup(stack, 'TestAttributeGroup', {
  attributeGroupName: 'myFirstAttributeGroup',
  description: 'test attribute group description',
  attributes: {
    stage: 'alpha',
    teamMembers: [
      'markI',
      'markII',
      'markIII',
    ],
    plannedRoadMap: {
      alpha: 'time1',
      beta: 'time2',
    },
  },
});
const myRole = new iam.Role(stack, 'MyRole', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});
const mySecondRole = new iam.Role(stack, 'MySecondRole', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});
attributeGroup.shareAttributeGroup('MyShareId', {
  name: 'MyShare',
  roles: [myRole, mySecondRole],
});

app.synth();
