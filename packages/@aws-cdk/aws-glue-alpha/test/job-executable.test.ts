import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';

describe('JobExecutable', () => {
  let stack: cdk.Stack;
  let bucket: s3.IBucket;
  let script: glue.Code;

  beforeEach(() => {
    stack = new cdk.Stack();
    bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'bucketname');
    script = glue.Code.fromBucket(bucket, 'script.py');
  });

  describe('.of()', () => {
    test('with valid config should succeed', () => {
      expect(glue.JobExecutable.of({
        glueVersion: glue.GlueVersion.V1_0,
        type: glue.JobType.PYTHON_SHELL,
        language: glue.JobLanguage.PYTHON,
        pythonVersion: glue.PythonVersion.THREE,
        script,
      })).toBeDefined();
    });

    test('with JobType.PYTHON_SHELL and a language other than JobLanguage.PYTHON should throw', () => {
      expect(() => glue.JobExecutable.of({
        glueVersion: glue.GlueVersion.V3_0,
        type: glue.JobType.PYTHON_SHELL,
        language: glue.JobLanguage.SCALA,
        script,
      })).toThrow(/Python shell requires the language to be set to Python/);
    });

    test('with JobType.of("glueray") and a language other than JobLanguage.PYTHON should throw', () => {
      expect(() => glue.JobExecutable.of({
        glueVersion: glue.GlueVersion.V4_0,
        type: glue.JobType.RAY,
        language: glue.JobLanguage.SCALA,
        script,
      })).toThrow(/Ray requires the language to be set to Python/);
    });

    test('with JobType.RAY and a language other than JobLanguage.PYTHON should throw', () => {
      expect(() => glue.JobExecutable.of({
        glueVersion: glue.GlueVersion.V4_0,
        type: glue.JobType.RAY,
        language: glue.JobLanguage.SCALA,
        script,
      })).toThrow(/Ray requires the language to be set to Python/);
    });

    test('with a non JobLanguage.PYTHON and extraPythonFiles set should throw', () => {
      expect(() => glue.JobExecutable.of({
        glueVersion: glue.GlueVersion.V3_0,
        type: glue.JobType.ETL,
        language: glue.JobLanguage.SCALA,
        className: 'com.Test',
        extraPythonFiles: [script],
        script,
      })).toThrow(/extraPythonFiles is not supported for languages other than JobLanguage.PYTHON/);
    });

    [glue.GlueVersion.V0_9, glue.GlueVersion.V4_0].forEach((glueVersion) => {
      test(`with JobType.PYTHON_SHELL and GlueVersion ${glueVersion} should throw`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.PYTHON_SHELL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          script,
          glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion} does not support Python Shell`);
      });
    });

    [glue.GlueVersion.V0_9, glue.GlueVersion.V4_0].forEach((glueVersion) => {
      test(`with JobType.PYTHON_SHELL and GlueVersion.of("${glueVersion}") should throw`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.PYTHON_SHELL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          script,
          glueVersion: glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion} does not support Python Shell`);
      });
    });

    [glue.GlueVersion.V0_9, glue.GlueVersion.V1_0, glue.GlueVersion.V2_0, glue.GlueVersion.V3_0].forEach((glueVersion) => {
      test(`with JobType.RAY and GlueVersion ${glueVersion} should throw`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.RAY,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          script,
          glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion} does not support Ray`);
      });
    });

    [glue.GlueVersion.V0_9, glue.GlueVersion.V1_0, glue.GlueVersion.V2_0, glue.GlueVersion.V3_0].forEach((glueVersion) => {
      test(`with JobType.of("glueray") and GlueVersion ${glueVersion} should throw`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.RAY,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          script,
          glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion} does not support Ray`);
      });
    });

    [glue.GlueVersion.V0_9, glue.GlueVersion.V1_0].forEach((glueVersion) => {
      test(`with extraJarsFirst set and GlueVersion ${glueVersion} should throw`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.ETL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          extraJarsFirst: true,
          script,
          glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion} does not support extraJarsFirst`);
      });
    });

    [glue.GlueVersion.V0_9, glue.GlueVersion.V1_0].forEach((glueVersion) => {
      test(`with extraJarsFirst set and GlueVersion.of("${glueVersion}") should throw`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.ETL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          extraJarsFirst: true,
          script,
          glueVersion: glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion} does not support extraJarsFirst`);
      });
    });

    [glue.GlueVersion.V2_0, glue.GlueVersion.V3_0, glue.GlueVersion.V4_0].forEach((glueVersion) => {
      test(`with PythonVersion.TWO and GlueVersion ${glueVersion} should throw`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.ETL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          script,
          glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion} does not support PythonVersion 2`);
      });
    });

    [glue.GlueVersion.V2_0, glue.GlueVersion.V3_0, glue.GlueVersion.V4_0].forEach((glueVersion) => {
      test(`with PythonVersion.TWO and GlueVersion.of("${glueVersion}") should throw`, () => {
        expect(() => glue.JobExecutable.of({
          type: glue.JobType.ETL,
          language: glue.JobLanguage.PYTHON,
          pythonVersion: glue.PythonVersion.TWO,
          script,
          glueVersion: glueVersion,
        })).toThrow(`Specified GlueVersion ${glueVersion} does not support PythonVersion 2`);
      });
    });

    test('with PythonVersion set to PythonVersion.THREE_NINE and JobType etl should throw', () => {
      expect(() => glue.JobExecutable.of({
        type: glue.JobType.ETL,
        language: glue.JobLanguage.PYTHON,
        pythonVersion: glue.PythonVersion.THREE_NINE,
        script,
        glueVersion: glue.GlueVersion.V1_0,
      })).toThrow('Specified PythonVersion PythonVersion.THREE_NINE is only supported for JobType Python Shell');
    });

    test('with PythonVersion PythonVersion.THREE_NINE and JobType pythonshell should succeed', () => {
      expect(glue.JobExecutable.of({
        type: glue.JobType.PYTHON_SHELL,
        glueVersion: glue.GlueVersion.V1_0,
        language: glue.JobLanguage.PYTHON,
        pythonVersion: glue.PythonVersion.THREE_NINE,
        script,
      })).toBeDefined();
    });

    test('with PythonVersion PythonVersion.THREE_NINE and JobType.of("pythonshell") should succeed', () => {
      expect(glue.JobExecutable.of({
        type: glue.JobType.PYTHON_SHELL,
        glueVersion: glue.GlueVersion.V1_0,
        language: glue.JobLanguage.PYTHON,
        pythonVersion: glue.PythonVersion.THREE_NINE,
        script,
      })).toBeDefined();
    });

    test('with PythonVersion PythonVersion.THREE_NINE and JobType ray should succeed', () => {
      expect(glue.JobExecutable.of({
        type: glue.JobType.RAY,
        glueVersion: glue.GlueVersion.V4_0,
        language: glue.JobLanguage.PYTHON,
        pythonVersion: glue.PythonVersion.THREE_NINE,
        runtime: glue.Runtime.RAY_TWO_FOUR,
        script,
      })).toBeDefined();
    });

    test('with PythonVersion PythonVersion.THREE_NINE and JobTypeof("glueray") should succeed', () => {
      expect(glue.JobExecutable.of({
        type: glue.JobType.RAY,
        glueVersion: glue.GlueVersion.V4_0,
        language: glue.JobLanguage.PYTHON,
        pythonVersion: glue.PythonVersion.THREE_NINE,
        runtime: glue.Runtime.RAY_TWO_FOUR,
        script,
      })).toBeDefined();
    });
  });
});