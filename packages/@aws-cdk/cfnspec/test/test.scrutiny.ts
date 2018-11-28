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

  'check securityGroup scrutinies'(test: Test) {
    const inProp = specification().ResourceTypes['AWS::EC2::SecurityGroup'].Properties!.SecurityGroupIngress;
    test.equals(inProp.ScrutinyType, PropertyScrutinyType.IngressRules);

    const eProp = specification().ResourceTypes['AWS::EC2::SecurityGroup'].Properties!.SecurityGroupEgress;
    test.equals(eProp.ScrutinyType, PropertyScrutinyType.EgressRules);

    test.done();
  },

  'check securityGroupRule scrutinies'(test: Test) {
    const inRes = specification().ResourceTypes['AWS::EC2::SecurityGroupIngress'];
    test.equals(inRes.ScrutinyType, ResourceScrutinyType.IngressRuleResource);

    const eRes = specification().ResourceTypes['AWS::EC2::SecurityGroupEgress'];
    test.equals(eRes.ScrutinyType, ResourceScrutinyType.EgressRuleResource);
  }
};