import { Test } from 'nodeunit';
import { propertySpecification, resourceSpecification } from '../lib';
import { PropertyScrutinyType, ResourceScrutinyType } from '../lib/schema';

export = {
  'spot-check IAM identity tags'(test: Test) {
    const prop = propertySpecification('AWS::IAM::Role', 'Policies');
    test.equals(prop.ScrutinyType, PropertyScrutinyType.InlineIdentityPolicies);

    test.done();
  },

  'IAM AssumeRolePolicy'(test: Test) {
    // AssumeRolePolicyDocument is a resource policy, because it applies to the Role itself!
    const prop = propertySpecification('AWS::IAM::Role', 'AssumeRolePolicyDocument');
    test.equals(prop.ScrutinyType, PropertyScrutinyType.InlineResourcePolicy);

    test.done();
  },

  'spot-check IAM resource tags'(test: Test) {
    const prop = propertySpecification('AWS::KMS::Key', 'KeyPolicy');
    test.equals(prop.ScrutinyType, PropertyScrutinyType.InlineResourcePolicy);

    test.done();
  },

  'spot-check resource policy resources'(test: Test) {
    test.equals(resourceSpecification('AWS::S3::BucketPolicy').ScrutinyType, ResourceScrutinyType.ResourcePolicyResource);

    test.done();
  },

  'spot-check no misclassified tags'(test: Test) {
    const prop = propertySpecification('AWS::SNS::Subscription', 'DeliveryPolicy');
    test.equals(prop.ScrutinyType, PropertyScrutinyType.None);

    test.done();
  },

  'check Lambda permission resource scrutiny'(test: Test) {
    test.equals(resourceSpecification('AWS::Lambda::Permission').ScrutinyType, ResourceScrutinyType.LambdaPermission);

    test.done();
  },

  'check role managedpolicyarns'(test: Test) {
    const prop = propertySpecification('AWS::IAM::Role', 'ManagedPolicyArns');
    test.equals(prop.ScrutinyType, PropertyScrutinyType.ManagedPolicies);

    test.done();
  },

  'check securityGroup scrutinies'(test: Test) {
    const inProp = propertySpecification('AWS::EC2::SecurityGroup', 'SecurityGroupIngress');
    test.equals(inProp.ScrutinyType, PropertyScrutinyType.IngressRules);

    const eProp = propertySpecification('AWS::EC2::SecurityGroup', 'SecurityGroupEgress');
    test.equals(eProp.ScrutinyType, PropertyScrutinyType.EgressRules);

    test.done();
  },

  'check securityGroupRule scrutinies'(test: Test) {
    const inRes = resourceSpecification('AWS::EC2::SecurityGroupIngress');
    test.equals(inRes.ScrutinyType, ResourceScrutinyType.IngressRuleResource);

    const eRes = resourceSpecification('AWS::EC2::SecurityGroupEgress');
    test.equals(eRes.ScrutinyType, ResourceScrutinyType.EgressRuleResource);

    test.done();
  },
};