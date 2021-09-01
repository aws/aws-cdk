import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

describe('JobExecutable', () => {
  let stack: cdk.Stack;
  let bucket: s3.IBucket;
  let script: glue.Code;

  beforeEach(() => {
    stack = new cdk.Stack();
    bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'bucketName');
    script = glue.Code.fromBucket(bucket, 'script.py');
  });

  describe('.of()', () => {
    test('with valid config', () => {
      expect(glue.JobExecutable.of({
        glueVersion: glue.GlueVersion.V2_0,
        type: glue.JobType.PYTHON_SHELL,
        language: glue.JobLanguage.PYTHON,
        pythonVersion: glue.PythonVersion.THREE,
        script,
      })).toBeDefined();
    });

    test('python shell job with a language other than python throws', () => {
      expect(() => glue.JobExecutable.of({
        glueVersion: glue.GlueVersion.V3_0,
        type: glue.JobType.PYTHON_SHELL,
        language: glue.JobLanguage.SCALA,
        script,
      })).toThrow(/Python shell requires the language to be set to Python/);
    });

    [glue.GlueVersion.V0_9, glue.GlueVersion.V1_0].forEach((glueVersion) => {
      test(`python shell with glue version ${glueVersion} throws`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.PYTHON_SHELL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          script,
          glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion.name} does not support Python Shell`);
      });

      test(`extraJarsFirst with glue version ${glueVersion} throws`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.ETL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          extraJarsFirst: true,
          script,
          glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion.name} does not support extraJarsFirst`);
      });
    });

    [glue.GlueVersion.V2_0, glue.GlueVersion.V3_0].forEach((glueVersion) => {
      test(`PythonVersion.TWO with glue version ${glueVersion} throws`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.PYTHON_SHELL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          script,
          glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion.name} does not support PythonVersion 2`);
      });
    });

  });
});