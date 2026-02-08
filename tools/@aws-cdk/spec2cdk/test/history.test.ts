import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import type { SpecDatabase } from '@aws-cdk/service-spec-types';
import type { IScope } from '@cdklabs/typewriter';
import { AwsCdkLibBuilder } from '../lib/cdk/aws-cdk-lib';

let db: SpecDatabase;

beforeAll(async () => {
  db = await loadAwsServiceSpec();
});

// In the old cfn2ts implementation we render all types into the spec
// To ensure backwards compatibility we will render previous types
test('Previous types are rendered', () => {
  const resource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::CloudFormation::StackSet')[0];
  const info = new AwsCdkLibBuilder({ db }).addResource(resource);

  const modName = '@aws-cdk/aws-cloudformation/aws-cloudformation';
  const stackSet = info.resourcesMod.module.tryFindType(`${modName}.CfnStackSet`) as unknown as IScope;

  expect(stackSet.tryFindType(`${modName}.CfnStackSet.ManagedExecutionProperty`)).toBeTruthy();
});
