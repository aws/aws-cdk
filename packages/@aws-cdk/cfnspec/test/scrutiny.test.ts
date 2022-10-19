import { propertySpecification, resourceSpecification } from '../lib';
import { PropertyScrutinyType, ResourceScrutinyType } from '../lib/schema';

test('spot-check IAM identity tags', () => {
  const prop = propertySpecification('AWS::IAM::Role', 'Policies');
  expect(prop.ScrutinyType).toEqual(PropertyScrutinyType.InlineIdentityPolicies);
});

test('IAM AssumeRolePolicy', () => {
  // AssumeRolePolicyDocument is a resource policy, because it applies to the Role itself!
  const prop = propertySpecification('AWS::IAM::Role', 'AssumeRolePolicyDocument');
  expect(prop.ScrutinyType).toEqual(PropertyScrutinyType.InlineResourcePolicy);
});

test('spot-check IAM resource tags', () => {
  const prop = propertySpecification('AWS::KMS::Key', 'KeyPolicy');
  expect(prop.ScrutinyType).toEqual(PropertyScrutinyType.InlineResourcePolicy);
});

test('spot-check resource policy resources', () => {
  expect(resourceSpecification('AWS::S3::BucketPolicy').ScrutinyType).toEqual(ResourceScrutinyType.ResourcePolicyResource);
});

test('spot-check no misclassified tags', () => {
  const prop = propertySpecification('AWS::SNS::Subscription', 'DeliveryPolicy');
  expect(prop.ScrutinyType).toEqual(PropertyScrutinyType.None);
});

test('check Lambda permission resource scrutiny', () => {
  expect(resourceSpecification('AWS::Lambda::Permission').ScrutinyType).toEqual(ResourceScrutinyType.LambdaPermission);
});

test('check role managedpolicyarns', () => {
  const prop = propertySpecification('AWS::IAM::Role', 'ManagedPolicyArns');
  expect(prop.ScrutinyType).toEqual(PropertyScrutinyType.ManagedPolicies);
});

test('check securityGroup scrutinies', () => {
  const inProp = propertySpecification('AWS::EC2::SecurityGroup', 'SecurityGroupIngress');
  expect(inProp.ScrutinyType).toEqual(PropertyScrutinyType.IngressRules);

  const eProp = propertySpecification('AWS::EC2::SecurityGroup', 'SecurityGroupEgress');
  expect(eProp.ScrutinyType).toEqual(PropertyScrutinyType.EgressRules);
});

test('check securityGroupRule scrutinies', () => {
  const inRes = resourceSpecification('AWS::EC2::SecurityGroupIngress');
  expect(inRes.ScrutinyType).toEqual(ResourceScrutinyType.IngressRuleResource);

  const eRes = resourceSpecification('AWS::EC2::SecurityGroupEgress');
  expect(eRes.ScrutinyType).toEqual(ResourceScrutinyType.EgressRuleResource);
});