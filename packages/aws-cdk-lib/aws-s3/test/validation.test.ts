// Test property validation source attribution, by means of the S3 construct

import { AssemblyValidationReport } from '../../assertions/lib/helpers-internal';
import type { PropertyMutationMetadataEntry } from '../../cloud-assembly-schema';
import { App, Stack } from '../../core';
import type { StackFrameFinder } from '../../core/lib/private/stack-trace';
import { formatValidationReports, stripAnsi } from '../../core/lib/validation/private/modern-formatter';
import type { CloudFormationStackArtifact } from '../../cx-api';
import * as s3 from '../lib';

let app: App;
let stack: Stack;
beforeEach(() => {
  process.env.CDK_DEBUG = 'true';
  app = new App({
    postCliContext: AssemblyValidationReport.APP_CONTEXT,
  });
  stack = new Stack(app, 'Stack');
});

function createFineBucket() {
  return new s3.Bucket(stack, 'MyBucket', {
    abacStatus: true,
  });
}

test('invalid properties can be attributed to a construct mutation, not just creation', () => {
  function addLifecycleRule1(b: s3.Bucket) {
    b.addLifecycleRule({
      id: 'asdf',
      noncurrentVersionsToRetain: 0,
    });
  }
  // WHEN
  const b = createFineBucket();
  addLifecycleRule1(b);

  // THEN - we have different stack traces for the abacStatus and the lifecycle rule's ID,
  // and they contain the function names that we defined above.
  const asm = app.synth();
  const art = asm.getStackByName(stack.stackName);
  const creationStack = readCreationStack(art, '/Stack/MyBucket/Resource');
  const propertyAssignments = readPropertyAssignments(art, '/Stack/MyBucket/Resource');

  expect(creationStack).toContainEqual(expect.stringContaining('createFineBucket'));
  expect(propertyAssignments[0]).toMatchObject({
    propertyName: 'LifecycleConfiguration',
    stackTrace: expect.arrayContaining([expect.stringContaining('addLifecycleRule1')]),
  });
});

test('invalid properties are attributed to the correct code line', () => {
  function addTooLongLifecycleRule(b: s3.Bucket) {
    b.addLifecycleRule({
      id: 'x'.repeat(300), // invalid, too long
      noncurrentVersionsToRetain: 0,
    });
  }

  function addCorrectLifecycleRule(b: s3.Bucket) {
    b.addLifecycleRule({ id: 'y', noncurrentVersionsToRetain: 0 });
  }

  // WHEN
  const b = createFineBucket();
  addTooLongLifecycleRule(b);
  addCorrectLifecycleRule(b);

  // THEN - the validation error should BOTH point to where the bucket was
  // created, as well as where the lifecycle rules were mutated
  const report = AssemblyValidationReport.fromApp(app);
  const violatingConstruct = report.allViolations()
    .filter(v => v.ruleName === 'F3033')
    .flatMap(v => v.violatingConstructs)
    [0];

  expect(violatingConstruct).toMatchObject({
    constructPath: 'Stack/MyBucket/Resource',
    cloudFormationResource: {
      propertyPaths: ['Properties.LifecycleConfiguration.Rules.0.Id'],
    },
    stackTraces: expect.arrayContaining([
      expect.stringContaining('createFineBucket'),
      expect.stringContaining('addTooLongLifecycleRule'),
      expect.stringContaining('addCorrectLifecycleRule'),
    ]),
  });

  // AND they are all rendered.
  // Use a custom StackFrameFinder to make sure we only render the test frames, ignoring those
  // from the CDK library itself.
  const finder: StackFrameFinder = {
    isUserCodeFrame(frame) {
      return !frame.includes('/lib/');
    },
  };

  const reportText = stripAnsi(formatValidationReports(__dirname, report.report.pluginReports, finder).join('\n'));
  expect(reportText).toMatchInlineSnapshot(`
"validation.test.ts:23:10
or validation.test.ts:55:7
or validation.test.ts:62:7
WARNING LifecycleConfiguration.Rules.0.Id: length 300 exceeds maximum 255 (CloudFormation Validate)
   Stack/MyBucket/Resource (MyBucketF68F3FF0) constructs.Construct
   Acknowledge with 'CloudFormation-Validate::F3033'"
`);
});

function readCreationStack(art: CloudFormationStackArtifact, constructPath: string): string[] {
  const items = art.findMetadataByType('aws:cdk:creationStack').filter(e => e.path === constructPath);
  if (items.length === 0) {
    throw new Error(`No creation stack found for ${constructPath}`);
  }
  return items[0].data as string[];
}

function readPropertyAssignments(art: CloudFormationStackArtifact, constructPath: string): PropertyMutationMetadataEntry[] {
  return art.findMetadataByType('aws:cdk:propertyAssignment')
    .filter(e => e.path === constructPath)
    .map(e => e.data as PropertyMutationMetadataEntry);
}
