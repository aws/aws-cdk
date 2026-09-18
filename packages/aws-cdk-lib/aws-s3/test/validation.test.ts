// Test property validation source attribution, by means of the S3 construct

import { PropertyMutationMetadataEntry } from '../../cloud-assembly-schema';
import { App, Stack } from '../../core';
import { CloudFormationStackArtifact } from '../../cx-api';
import * as s3 from '../lib';

let app: App;
let stack: Stack;
beforeEach(() => {
  process.env.CDK_DEBUG = 'true';
  app = new App({
    postCliContext: {},
  });
  stack = new Stack(app, 'Stack');
});

test('invalid properties can be attributed to a construct mutation, not just creation', () => {
  function createBucket1() {
    return new s3.Bucket(stack, 'MyBucket', {
      abacStatus: true,
    });
  }
  function addLifecycleRule1(b: s3.Bucket) {
    b.addLifecycleRule({
      id: 'asdf',
      noncurrentVersionsToRetain: 0,
    });
  }
  // WHEN
  const b = createBucket1();
  addLifecycleRule1(b);

  // THEN - we have different stack traces for the abacStatus and the lifecycle rule's ID
  const asm = app.synth();
  const art = asm.getStackByName(stack.stackName);
  const creationStack = readCreationStack(art, '/Stack/MyBucket/Resource');
  const propertyAssignments = readPropertyAssignments(art, '/Stack/MyBucket/Resource');

  console.log(creationStack);
  console.log(propertyAssignments);

  expect(false).toBe(true); // TODO: implement the actual test
});

test('invalid properties are attributed to the correct code line', () => {
  // WHEN
  const b = new s3.Bucket(stack, 'MyBucket');
  b.addLifecycleRule({
    id: 'x'.repeat(300), // invalid, too long
    noncurrentVersionsToRetain: 0,
  });

  // THEN - the validation error should point to the line where the lifecycle rule was added, not the line where the bucket was created
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
