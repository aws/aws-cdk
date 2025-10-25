import * as cdk from 'aws-cdk-lib';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-attribute-group-import');

// Test importing AttributeGroup without attributes
const importedAttributeGroup = appreg.AttributeGroup.fromAttributeGroupArn(
  stack,
  'ImportedAttributeGroup',
  'arn:aws:servicecatalog:us-east-1:012345678910:/attribute-groups/test-import-id'
);

// Test importing AttributeGroup with attributes
const importedAttributeGroupWithAttrs = appreg.AttributeGroup.fromAttributeGroupArn(
  stack,
  'ImportedAttributeGroupWithAttrs',
  'arn:aws:servicecatalog:us-east-1:012345678910:/attribute-groups/test-import-id',
  {
    environment: 'production',
    team: 'platform',
    version: '1.0.0'
  }
);

// Create an application to associate with imported attribute groups
const application = new appreg.Application(stack, 'TestApplication', {
  applicationName: 'TestApplication',
  description: 'Test application for imported attribute groups',
});

// Associate imported attribute groups with the application
importedAttributeGroup.associateWith(application);
importedAttributeGroupWithAttrs.associateWith(application);

app.synth();
