import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from '../lib';

/**
 * Invariant guard for the `defaultArguments` API.
 *
 * The construct owns every job argument it emits — whether the value comes from a dedicated typed
 * prop (`continuousLogging`, `enableMetrics`, `sparkUI`, `className`, `extra*`) or from the job
 * class itself (`--job-language`). The untyped `defaultArguments` map is the escape hatch for
 * arguments the L2 does NOT model; it must NOT be a second channel for arguments that have a typed
 * equivalent.
 *
 * These tests derive the managed-key set from what each class actually synthesizes and then assert,
 * per class:
 *  - passing any synthesized (managed) key through `defaultArguments` throws — no silent win, no
 *    silent drop; and
 *  - passing a genuinely custom key still flows through untouched (escape hatch preserved).
 *
 * If a future change adds a typed prop that emits a new argument, this test starts rejecting that
 * key from `defaultArguments` automatically — there is no separate reserved list to keep in sync.
 */

// Glue service-reserved keys — owned by Glue, reserved for every job type regardless of props.
const GLUE_RESERVED = ['--debug', '--mode', '--JOB_NAME'];

/**
 * Each entry builds one job class with every args-producing prop set, so the synthesized
 * `DefaultArguments` contains the full managed-key surface for that class.
 */
const JOB_CLASSES: Array<{ name: string; build: (scope: cdk.Stack, props: any) => void }> = [
  {
    name: 'PySparkEtlJob',
    build: (scope, extra) => new glue.PySparkEtlJob(scope, 'Job', {
      ...baseSparkProps(scope), ...extra,
    }),
  },
  {
    name: 'PySparkFlexEtlJob',
    build: (scope, extra) => new glue.PySparkFlexEtlJob(scope, 'Job', {
      ...baseSparkProps(scope), ...extra,
    }),
  },
  {
    name: 'PySparkStreamingJob',
    build: (scope, extra) => new glue.PySparkStreamingJob(scope, 'Job', {
      ...baseSparkProps(scope), ...extra,
    }),
  },
  {
    name: 'ScalaSparkEtlJob',
    build: (scope, extra) => new glue.ScalaSparkEtlJob(scope, 'Job', {
      ...baseSparkProps(scope), className: 'com.example.MyJob', ...extra,
    }),
  },
  {
    name: 'ScalaSparkFlexEtlJob',
    build: (scope, extra) => new glue.ScalaSparkFlexEtlJob(scope, 'Job', {
      ...baseSparkProps(scope), className: 'com.example.MyJob', ...extra,
    }),
  },
  {
    name: 'ScalaSparkStreamingJob',
    build: (scope, extra) => new glue.ScalaSparkStreamingJob(scope, 'Job', {
      ...baseSparkProps(scope), className: 'com.example.MyJob', ...extra,
    }),
  },
  {
    name: 'PythonShellJob',
    build: (scope, extra) => new glue.PythonShellJob(scope, 'Job', {
      role: roleOf(scope), script: scriptOf(scope), jobName: 'Job', ...extra,
    }),
  },
  {
    name: 'RayJob',
    build: (scope, extra) => new glue.RayJob(scope, 'Job', {
      role: roleOf(scope), script: scriptOf(scope), jobName: 'Job', ...extra,
    }),
  },
];

let uid = 0;
function roleOf(scope: cdk.Stack): iam.IRole {
  return iam.Role.fromRoleArn(scope, `Role${uid++}`, 'arn:aws:iam::123456789012:role/TestRole');
}
function scriptOf(scope: cdk.Stack): glue.Code {
  return glue.Code.fromBucket(s3.Bucket.fromBucketName(scope, `CodeBucket${uid++}`, 'bucketname'), 'script');
}
/** Spark props with every args-producing typed prop set, to exercise the full managed surface. */
function baseSparkProps(scope: cdk.Stack) {
  return {
    role: roleOf(scope),
    script: scriptOf(scope),
    jobName: 'Job',
    sparkUI: {},
    enableMetrics: true,
    enableObservabilityMetrics: true,
    extraJars: [scriptOf(scope)],
    extraFiles: [scriptOf(scope)],
    extraPythonFiles: [scriptOf(scope)],
    extraJarsFirst: true,
  };
}

/** Synthesize a class with no `defaultArguments` and return the managed args (key→value) it emits. */
function managedArgsOf(build: (scope: cdk.Stack, props: any) => void): { [key: string]: string } {
  const stack = new cdk.Stack(new cdk.App(), 'S');
  build(stack, {});
  const jobs = Template.fromStack(stack).findResources('AWS::Glue::Job');
  const resource = Object.values(jobs)[0];
  return resource.Properties.DefaultArguments;
}

describe('defaultArguments managed-key invariant', () => {
  for (const jobClass of JOB_CLASSES) {
    describe(jobClass.name, () => {
      const managedArgs = managedArgsOf(jobClass.build);
      const managedKeys = Object.keys(managedArgs);

      test('emits at least one managed argument', () => {
        expect(managedKeys.length).toBeGreaterThan(0);
      });

      test.each(managedKeys)('rejects managed key %s passed via defaultArguments with a different value', (key) => {
        const stack = new cdk.Stack(new cdk.App(), 'S');
        // Use a value guaranteed to differ from the managed value.
        const differentValue = `${managedArgs[key]}-different`;
        expect(() => jobClass.build(stack, { defaultArguments: { [key]: differentValue } }))
          .toThrow(/managed by the construct or reserved by Glue/);
      });

      test('allows managed keys passed via defaultArguments when the value is identical', () => {
        // Only literal-valued managed args can be reconciled by value at synth time. Token-valued
        // args (e.g. --spark-event-logs-path, extra-* S3 URLs) synthesize to CloudFormation
        // intrinsics, so equality cannot be proven and they are (correctly) always rejected — see
        // the "different value" case, which covers them.
        const literalArgs = Object.fromEntries(
          Object.entries(managedArgs).filter(([, value]) => typeof value === 'string'),
        );
        const stack = new cdk.Stack(new cdk.App(), 'S');
        // Passing the exact same values the construct would emit is not contradictory.
        expect(() => jobClass.build(stack, { defaultArguments: literalArgs })).not.toThrow();
        Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
          DefaultArguments: managedArgs,
        });
      });

      test.each(GLUE_RESERVED)('rejects Glue-reserved key %s passed via defaultArguments', (key) => {
        const stack = new cdk.Stack(new cdk.App(), 'S');
        expect(() => jobClass.build(stack, { defaultArguments: { [key]: 'x' } }))
          .toThrow(/managed by the construct or reserved by Glue/);
      });

      test('allows a genuinely custom argument to flow through (escape hatch preserved)', () => {
        const stack = new cdk.Stack(new cdk.App(), 'S');
        jobClass.build(stack, { defaultArguments: { '--my-custom-arg': 'value' } });
        Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
          DefaultArguments: {
            '--my-custom-arg': 'value',
          },
        });
      });
    });
  }
});
