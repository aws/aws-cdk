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


new integ.IntegTest(app, 'AttributeGroupIntegTest', {
  testCases: [stack],
});

app.synth();
