import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-attribute-group');

const application = new appreg.Application(stack, 'TestApplication', {
  applicationName: 'TestApplication',
  description: 'My application description',
});

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

attributeGroup.associateWith(application);

// Import an attribute group with its known attributes so they can be read back via the
// `attributes` accessor (AppRegistry does not return attributes from an ARN).
const importedAttributeGroup = appreg.AttributeGroup.fromAttributeGroupAttributes(stack, 'ImportedAttributeGroup', {
  attributeGroupArn: 'arn:aws:servicecatalog:us-east-1:123456789012:/attribute-groups/0aqmvxvgmry0ecc4mjhwypun6i',
  attributes: { stage: 'beta', owner: 'platform' },
});

// Surface the `attributes` accessor for both a created and an imported attribute group.
new cdk.CfnOutput(stack, 'CreatedAttributeGroupAttributes', {
  value: JSON.stringify(attributeGroup.attributes),
});
new cdk.CfnOutput(stack, 'ImportedAttributeGroupAttributes', {
  value: JSON.stringify(importedAttributeGroup.attributes),
});

new integ.IntegTest(app, 'AttributeGroupIntegTest', {
  testCases: [stack],
});

app.synth();
