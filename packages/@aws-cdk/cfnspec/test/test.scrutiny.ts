import { Test } from 'nodeunit';
import { specification } from '../lib';
import { ScrutinyType } from '../lib/schema';

export = {
  'spot-check IAM identity tags'(test: Test) {
    const prop = specification.PropertyTypes['AWS::IAM::Role.Policy'].Properties!.PolicyDocument;
    test.equals(prop.ScrutinyType, ScrutinyType.IdentityPolicy);

    test.done();
  },

  'spot-check IAM resource tags'(test: Test) {
    const prop = specification.ResourceTypes['AWS::KMS::Key'].Properties!.KeyPolicy;
    test.equals(prop.ScrutinyType, ScrutinyType.ResourcePolicy);

    test.done();
  },

  'spot-check no misclassified tags'(test: Test) {
    const prop = specification.ResourceTypes['AWS::SNS::Subscription'].Properties!.DeliveryPolicy;
    test.equals(prop.ScrutinyType, ScrutinyType.None);

    test.done();
  },
};