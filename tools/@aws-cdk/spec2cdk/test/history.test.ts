import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { IScope } from '@cdklabs/typewriter';
import { AstBuilder } from '../lib/cdk/ast';

let db: SpecDatabase;

beforeAll(async () => {
  db = await loadAwsServiceSpec();
});

// In the old cfn2ts implementation we render all types into the spec
// To ensure backwards compatibility we will render previous types
test('Previous types are rendered', () => {
  const resource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::CloudFormation::StackSet')[0];
  const info = new AstBuilder({ db }).addResource(resource);
  const stackSet = info.resourcesMod.tryFindType('@aws-cdk/aws-cloudformation.CfnStackSet') as unknown as IScope;

  expect(stackSet.tryFindType('@aws-cdk/aws-cloudformation.CfnStackSet.ManagedExecutionProperty')).toBeTruthy();
});
