import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-attribute-group');

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
    plannedRoadMap: {
      alpha: 'time1',
      beta: 'time2',
    },
  },
});
const myRole = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::279317280375:role/Developer');
attributeGroup.shareResource({
  roles: [myRole],
});

app.synth();
