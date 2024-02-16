import * as s3 from '../../aws-s3';
import * as ssm from '../../aws-ssm';
import * as cdk from '../../core';
import * as ecs from '../lib';

/* eslint-disable dot-notation */

describe('credential spec', () => {
  describe('ecs.DomainJoinedCredentialSpec', () => {
    test('returns the correct prefixId and location', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const credSpecLocation = 'credSpecLocation';
      const credSpec = new ecs.DomainJoinedCredentialSpec(credSpecLocation);
      const containerDefinition = defineContainerDefinition(stack, credSpec);

      // THEN
      expect(containerDefinition.credentialSpecs?.length == 1);
      expect(containerDefinition.credentialSpecs?.at(0)?.typePrefix).toEqual('credentialspec');
      expect(containerDefinition.credentialSpecs?.at(0)?.location).toEqual(credSpecLocation);
    });

    describe('fromS3Bucket', () => {
      test('fails if key name is empty', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'bucket');

        // THEN
        expect(() => ecs.DomainJoinedCredentialSpec.fromS3Bucket(bucket, '')).toThrow(/key is undefined/);
      });

      test('returns a valid version-less S3 object ARN as location', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const objectKey = 'credSpec';
        const bucket = new s3.Bucket(stack, 'bucket');
        const credSpec = ecs.DomainJoinedCredentialSpec.fromS3Bucket(bucket, objectKey);
        const containerDefinition = defineContainerDefinition(stack, credSpec);

        // THEN
        expect(containerDefinition.credentialSpecs?.at(0)?.location).toEqual(bucket.arnForObjects(objectKey));
      });

      test('returns a valid versioned S3 object ARN as location', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const objectKey = 'credSpec';
        const objectVersion = 'xwghdvg2672';
        const bucket = new s3.Bucket(stack, 'bucket');
        const credSpec = ecs.DomainJoinedCredentialSpec.fromS3Bucket(bucket, objectKey, objectVersion);
        const containerDefinition = defineContainerDefinition(stack, credSpec);

        // THEN
        expect(containerDefinition.credentialSpecs?.at(0)?.location).toEqual(bucket.arnForObjects(`${objectKey}/${objectVersion}`));
      });
    });

    describe('fromSsmParameter', () => {
      test('returns a valid SSM parameter ARN as location', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const parameter = new ssm.StringParameter(stack, 'parameter', {
          stringValue: 'value',
        });
        const credSpec = ecs.DomainJoinedCredentialSpec.fromSsmParameter(parameter);
        const containerDefinition = defineContainerDefinition(stack, credSpec);

        // THEN
        expect(containerDefinition.credentialSpecs?.at(0)?.location).toEqual(parameter.parameterArn);
      });
    });
  });

  describe('ecs.DomainlessCredentialSpec', () => {
    test('returns the correct prefixId and location', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const credSpecLocation = 'credSpecLocation';
      const credSpec = new ecs.DomainlessCredentialSpec(credSpecLocation);
      const containerDefinition = defineContainerDefinition(stack, credSpec);

      // THEN
      expect(containerDefinition.credentialSpecs?.length == 1);
      expect(containerDefinition.credentialSpecs?.at(0)?.typePrefix).toEqual('credentialspecdomainless');
      expect(containerDefinition.credentialSpecs?.at(0)?.location).toEqual(credSpecLocation);
    });

    describe('fromS3Bucket', () => {
      test('fails if key name is empty', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'bucket');

        // THEN
        expect(() => ecs.DomainlessCredentialSpec.fromS3Bucket(bucket, '')).toThrow(/key is undefined/);
      });

      test('returns a valid version-less S3 object ARN as location', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const objectKey = 'credSpec';
        const bucket = new s3.Bucket(stack, 'bucket');
        const credSpec = ecs.DomainlessCredentialSpec.fromS3Bucket(bucket, objectKey);
        const containerDefinition = defineContainerDefinition(stack, credSpec);

        // THEN
        expect(containerDefinition.credentialSpecs?.at(0)?.location).toEqual(bucket.arnForObjects(objectKey));
      });

      test('returns a valid versioned S3 object ARN as location', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const objectKey = 'credSpec';
        const objectVersion = 'xwghdvg2672';
        const bucket = new s3.Bucket(stack, 'bucket');
        const credSpec = ecs.DomainlessCredentialSpec.fromS3Bucket(bucket, objectKey, objectVersion);
        const containerDefinition = defineContainerDefinition(stack, credSpec);

        // THEN
        expect(containerDefinition.credentialSpecs?.at(0)?.location).toEqual(bucket.arnForObjects(`${objectKey}/${objectVersion}`));
      });
    });

    describe('fromSsmParameter', () => {
      test('returns a valid SSM parameter ARN as location', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const parameter = new ssm.StringParameter(stack, 'parameter', {
          stringValue: 'value',
        });
        const credSpec = ecs.DomainlessCredentialSpec.fromSsmParameter(parameter);
        const containerDefinition = defineContainerDefinition(stack, credSpec);

        // THEN
        expect(containerDefinition.credentialSpecs?.at(0)?.location).toEqual(parameter.parameterArn);
      });
    });
  });
});

function defineContainerDefinition(stack: cdk.Stack, credentialSpec: ecs.CredentialSpec) {
  const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

  return new ecs.ContainerDefinition(stack, 'Container', {
    credentialSpecs: [credentialSpec],
    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
    memoryLimitMiB: 512,
    taskDefinition,
  });
}
