import { Test } from 'nodeunit';
import { specification } from '../lib';
import { PropertyScrutinyType, ResourceScrutinyType } from '../lib/schema';

export = {
  'spot-check IAM identity tags'(test: Test) {
    const prop = specification().PropertyTypes['AWS::IAM::Role.Policy'].Properties!.PolicyDocument;
    test.equals(prop.ScrutinyType, PropertyScrutinyType.IdentityPolicy);

    test.done();
  },

  'spot-check IAM resource tags'(test: Test) {
    const prop = specification().ResourceTypes['AWS::KMS::Key'].Properties!.KeyPolicy;
    test.equals(prop.ScrutinyType, PropertyScrutinyType.ResourcePolicy);

    test.done();
  },

  'spot-check no misclassified tags'(test: Test) {
    const prop = specification().ResourceTypes['AWS::SNS::Subscription'].Properties!.DeliveryPolicy;
    test.equals(prop.ScrutinyType, PropertyScrutinyType.None);

    test.done();
  },

  'check Lambda permission resource scrutiny'(test: Test) {
    const resource = specification().ResourceTypes['AWS::Lambda::Permission'];
    test.equals(resource.ScrutinyType, ResourceScrutinyType.LambdaPermission);

    test.done();
  },

  'check role managedpolicyarns'(test: Test) {
    const prop = specification().ResourceTypes['AWS::IAM::Role'].Properties!.ManagedPolicyArns;
    test.equals(prop.ScrutinyType, PropertyScrutinyType.ManagedPolicies);

    test.done();
  },
};